import { IK_Chain } from "../IK_Chain";
import { IK_Comp } from "../IK_Comp";
import { IK_ISolver } from "../IK_ISolver";
import { IK_Target } from "../IK_Target";
import { quaternionFromTo } from "../IK_Utils"

const { Quaternion, Vector3 } = Laya
type Vector3 = Laya.Vector3
type Quaternion = Laya.Quaternion

export class IK_CCDSolver implements IK_ISolver {
    dampingFactor: number = 0.1; 
    maxIterations: number;
    poleTarget: IK_Target = null;

    // ==========================================
    // 核心状态变量 (State)
    // ==========================================
    private _targetPos = new Vector3();      // 缓存的目标位置
    private _currentEndPos = new Vector3();  // 缓存的末端位置（用于数学计算追踪）

    // ==========================================
    // 计算用临时变量 (Working Memory)
    // 使用成员变量代替 new，避免 GC，同时避免全局污染
    // ==========================================
    
    // 1. 核心算法专用变量 (语义化命名)
    private _jointToEndVec = new Vector3();    // 关节->末端 向量
    private _jointToTargetVec = new Vector3(); // 关节->目标 向量
    private _pivotPos = new Vector3();         // 当前关节位置 (旋转轴心)
    private _rotationDelta = new Quaternion(); // 计算出的旋转量

    // 2. 通用计算变量 (用于中间计算，随用随弃)
    private _calcVecA = new Vector3();
    private _calcVecB = new Vector3();
    private _calcVecC = new Vector3();
    private _calcQuat = new Quaternion();

    constructor(maxIterations: number = 1) {
        this.maxIterations = maxIterations;
    }

    /**
     * IK 求解入口
     */
    solve(comp: IK_Comp, chain: IK_Chain, target: Vector3, endOffline: boolean): boolean {
        const joints = chain.joints;
        if (joints.length < 2) return false;

        // 1. 准备数据
        const endId = endOffline ? joints.length - 2 : joints.length - 1;
        const endEffector = joints[endId];
        const basePos = joints[0].position;
        
        // 缓存目标位置
        target.cloneTo(this._targetPos);
        
        // 2. 检查是否可达 (Reachability)
        const totalLength = this.calculateTotalLength(joints, endId);
        const distBaseToTarget = Vector3.distance(basePos, this._targetPos);
        
        if (distBaseToTarget > totalLength) {
            this.handleUnreachable(joints, endId, basePos, this._targetPos);
            comp.current_iteration = 1;
            comp.current_error = distBaseToTarget - totalLength;
            return false;
        }

        // 3. CCD 迭代求解
        let iteration = 0;
        let touched = false;
        const epsilonSq = chain.maxError * chain.maxError;
        
        // 初始化当前末端位置缓存
        endEffector.position.cloneTo(this._currentEndPos);

        while (iteration < this.maxIterations) {
            // 3.1 执行单次反向遍历
            touched = this.solveOneIteration(joints, endId, this._targetPos, epsilonSq);
            
            if (touched) break;

            // 3.2 检查误差
            const currentDistSq = Vector3.distanceSquared(this._currentEndPos, this._targetPos);
            if (currentDistSq < epsilonSq) {
                touched = true;
                break;
            }

            iteration++;
            
            // 3.3 FK 更新：为下一轮迭代准备准确的关节位置
            if (iteration < this.maxIterations) {
                this.updateAllJointPositions(joints, endId);
                endEffector.position.cloneTo(this._currentEndPos);
            }
        }

        // 4. 最终位置同步
        this.updateAllJointPositions(joints, endId);

        // 5. 极向量约束
        if (this.poleTarget && joints.length > 2) {
            this.solvePoleVector(comp, chain, joints, endId, basePos);
        }

        // 记录状态
        comp.current_iteration = iteration;
        comp.current_error = Math.sqrt(Vector3.distanceSquared(endEffector.position, this._targetPos));

        return touched;
    }

    /**
     * 单次 CCD 迭代
     */
    private solveOneIteration(joints: any[], endId: number, targetPos: Vector3, epsilonSq: number): boolean {
        const currentEndPos = this._currentEndPos;
        
        // 使用类成员变量，清晰明了
        const jointToEnd = this._jointToEndVec;
        const jointToTarget = this._jointToTargetVec;
        const rotation = this._rotationDelta;
        const pivot = this._pivotPos;

        for (let i = endId - 1; i >= 0; i--) {
            const joint = joints[i];
            if (joint.fixed) continue;

            // 1. 获取 Pivot
            joint.position.cloneTo(pivot);

            // 2. 距离检测
            if (Vector3.distanceSquared(currentEndPos, targetPos) < epsilonSq) {
                return true;
            }

            // 3. 构建向量
            currentEndPos.vsub(pivot, jointToEnd); // Vector A
            targetPos.vsub(pivot, jointToTarget);  // Vector B

            // 4. 稳定性检查
            if (jointToEnd.lengthSquared() < 1e-6 || jointToTarget.lengthSquared() < 1e-6) {
                continue;
            }

            jointToEnd.normalize();
            jointToTarget.normalize();

            // 5. 计算旋转
            quaternionFromTo(jointToEnd, jointToTarget, rotation);

            // 6. 应用阻尼
            if (this.dampingFactor < 1.0 && this.dampingFactor > 0) {
                Quaternion.slerp(Quaternion.DEFAULT, rotation, this.dampingFactor, rotation);
            }

            // 7. 应用旋转到关节
            const curQ = joint.rotationQuat;
            Quaternion.multiply(rotation, curQ, curQ);
            curQ.normalize(curQ);
            joint.rotationQuat = curQ;

            // 8. 更新末端位置 (FK Estimation)
            // 重新获取未归一化的 jointToEnd
            currentEndPos.vsub(pivot, jointToEnd);
            // 旋转它
            Vector3.transformQuat(jointToEnd, rotation, jointToEnd);
            // 加回 Pivot
            Vector3.add(pivot, jointToEnd, currentEndPos);
        }

        return false;
    }

    /**
     * FK 更新所有关节位置
     */
    private updateAllJointPositions(joints: any[], endId: number) {
        for (let i = 0; i < endId; i++) {
            const parent = joints[i];
            const child = joints[i + 1];
            
            if (child) {
                // ChildPos = ParentPos + ParentRot * ChildRelPos
                const offset = this._calcVecA; // 使用通用变量
                Vector3.transformQuat(child.relPos, parent.rotationQuat, offset);
                
                const newPos = child.position;
                newPos.x = parent.position.x + offset.x;
                newPos.y = parent.position.y + offset.y;
                newPos.z = parent.position.z + offset.z;
                child.position = newPos;
            }
        }
    }

    /**
     * 处理不可达情况
     */
    private handleUnreachable(joints: any[], endId: number, basePos: Vector3, targetPos: Vector3) {
        // 复用通用变量
        const dirToTarget = this._calcVecA;
        const dirJointToNext = this._calcVecB;
        const rot = this._rotationDelta; // 复用旋转变量

        for (let i = 0; i < endId; i++) {
            const joint = joints[i];
            if (joint.fixed) continue;
            
            const next = joints[i+1];
            if (!next) break;

            // 当前朝向
            next.position.vsub(joint.position, dirJointToNext);
            dirJointToNext.normalize();
            
            // 目标朝向
            targetPos.vsub(joint.position, dirToTarget);
            dirToTarget.normalize();

            // 旋转
            quaternionFromTo(dirJointToNext, dirToTarget, rot);
            
            const curQ = joint.rotationQuat;
            Quaternion.multiply(rot, curQ, curQ);
            joint.rotationQuat = curQ;

            // 立即更新下一节位置
            this.updateOneChildPosition(joint, next);
        }
    }

    private updateOneChildPosition(parent: any, child: any) {
        const offset = this._calcVecC; // 避免与 handleUnreachable 中的 A/B 冲突（虽不是递归，但为了保险）
        Vector3.transformQuat(child.relPos, parent.rotationQuat, offset);
        
        const newPos = child.position;
        newPos.x = parent.position.x + offset.x;
        newPos.y = parent.position.y + offset.y;
        newPos.z = parent.position.z + offset.z;
        child.position = newPos;
    }

    private calculateTotalLength(joints: any[], endId: number): number {
        let len = 0;
        for (let i = 0; i < endId; i++) {
            len += joints[i].length;
        }
        return len;
    }

    /**
     * 极向量处理
     */
    private solvePoleVector(comp: IK_Comp, chain: IK_Chain, joints: any[], endId: number, basePos: Vector3) {
        const axis = this._calcVecA;
        const baseToPole = this._calcVecB;
        const baseToMid = this._calcVecC;
        
        // 极向量特有的投影向量，为防混淆，可以复用 _jointTo... 变量，或者再增加几个通用变量
        // 这里复用 _pivotPos 和 _currentEndPos 作为临时存储是不安全的，因为它们有特定语义。
        // 为了代码清晰，我们在方法内定义别名指向通用变量，或者不够用时增加变量。
        // 这里使用 _jointToEndVec / _jointToTargetVec 作为临时的 projMid / projPole
        const projMid = this._jointToEndVec;
        const projPole = this._jointToTargetVec;
        const tmpCross = this._pivotPos; // 借用 pivotPos 存 Cross 结果

        const endPos = joints[endId].position;
        const polePos = this.poleTarget.pos;
        const midPos = chain.joints[1].position;

        endPos.vsub(basePos, axis);
        polePos.vsub(basePos, baseToPole);
        midPos.vsub(basePos, baseToMid);

        if (axis.lengthSquared() < 1e-6) return;

        axis.normalize();

        // Proj Mid
        const dotMid = Vector3.dot(baseToMid, axis);
        const tmpVec = this._calcQuat; // 借用 Quat 内存? 不行，类型不同。
        // 我们需要一个新的 Vector3，或者小心复用。
        // 既然是基于类的，增加一个 _calcVecD 成本很低。
        // 但这里我们可以直接运算： proj = v - axis * dot
        // 下面这种写法是为了避免 new Vector3
        
        // 借用一下 updateAllJointPositions 才会用到的 _calcVecC (不，这里正在用 baseToMid=C)
        // 我们需要一个 tmp 来存 axis * dot
        // 此时 _targetPos 是空闲的吗？是的，主流程 solve 已结束，只剩 pole。
        // 但为了稳健，不要复用状态变量。
        // 最好还是定义足够的通用变量。
        
        // 这里临时 new 一个也没事，因为极向量计算频率较低（每帧一次）。
        // 或者我们复用 _jointToEndVec (projMid) 来暂存 axis * dot，计算完后再 sub
        // projMid = baseToMid - (axis * dot)
        
        // step 1: tmp = axis * dot
        const tmpAxisScaled = projMid; 
        axis.scale(dotMid, tmpAxisScaled);
        
        // step 2: projMid = baseToMid - tmp
        // 注意：baseToMid 和 projMid 如果指向不同内存，则：
        baseToMid.vsub(tmpAxisScaled, projMid); // 结果存入 projMid

        // Proj Pole
        const dotPole = Vector3.dot(baseToPole, axis);
        const tmpAxisScaled2 = projPole;
        axis.scale(dotPole, tmpAxisScaled2);
        baseToPole.vsub(tmpAxisScaled2, projPole);

        const lenMid = projMid.length();
        const lenPole = projPole.length();

        if (lenMid > 1e-3 && lenPole > 1e-3) {
            projMid.scale(1/lenMid, projMid);
            projPole.scale(1/lenPole, projPole);

            const cosTheta = Math.max(-1, Math.min(1, Vector3.dot(projMid, projPole)));
            Vector3.cross(projMid, projPole, tmpCross);
            const sinTheta = Vector3.dot(tmpCross, axis);
            const angle = Math.atan2(sinTheta, cosTheta);

            if (Math.abs(angle) > 1e-4) {
                comp.pole_rot = angle;
                const rot = this._rotationDelta; // 复用
                Quaternion.createFromAxisAngle(axis, angle, rot);
                
                const rootJoint = joints[0];
                Quaternion.multiply(rot, rootJoint.rotationQuat, rootJoint.rotationQuat);
                
                this.updateAllJointPositions(joints, endId);
            }
        }
    }
}
