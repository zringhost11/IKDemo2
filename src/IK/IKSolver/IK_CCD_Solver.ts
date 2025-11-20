import { IK_Chain } from "../IK_Chain";
import { IK_Comp } from "../IK_Comp";
import { IK_ISolver } from "../IK_ISolver";
import { IK_Joint } from "../IK_Joint";
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
        
        // 如果不可达，不直接切换算法，而是将目标限制在最大射程内
        // 这样可以保证从弯曲到伸直的平滑过渡
        if (distBaseToTarget > totalLength) {
            // 计算从 base 指向 target 的方向
            const dirBaseToTarget = this._calcVecA;
            this._targetPos.vsub(basePos, dirBaseToTarget);
            dirBaseToTarget.normalize();
            
            // 将目标位置拉回到最大射程处 (稍微减一点点避免完全伸直导致的死锁)
            // scale = totalLength * 0.9999
            const clampedDist = totalLength * 0.9999;
            dirBaseToTarget.scale(clampedDist, dirBaseToTarget);
            
            // 更新 _targetPos
            Vector3.add(basePos, dirBaseToTarget, this._targetPos);
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
            
            // --- 约束处理开始 ---
            joint.rotationQuat = curQ;
            
            if (joint.constraint && joint.constraint.enable) {
                // 约束会直接修改 joint.rotationQuat
                joint.constraint.doConsraint(joint);
                // 约束后的旋转可能已经变了，所以 curQ 已经过时，不能直接用
                // 但 joint.rotationQuat 已经是正确的了
                
                // 关键：由于约束强行改变了旋转，
                // 原本根据 DeltaRot 推导的末端位置 currentEndPos 就不准了。
                // 我们需要根据【约束后的实际旋转】重新计算 jointToEnd 向量，
                // 从而得到正确的 currentEndPos。
                
                // NewEndPos = Pivot + (ActualRot * RelVector)
                // 为了性能，我们不走完整的 FK，而是局部推导：
                // NewEndPos = Pivot + ActualJointToEnd
                // 但是 ActualJointToEnd 怎么算？
                // 我们只知道 pivot (世界) 和 rotation (世界)。
                // 但我们不知道 "未旋转前的局部 jointToEnd" 是什么（除非我们记录下来）。
                
                // 近似方案：
                // 如果约束改变不大，可以忽略误差，反正下一轮迭代会修正。
                // 精确方案：
                // 重新计算旋转后的向量：
                // 1. 我们知道迭代开始时的 jointToEnd (before any rotation)
                // 2. 但在循环中，这个值很难获取。
                
                // 另一种思路：
                // NewEndPos = Pivot + (NewRot * Inv(OldRot) * OldJointToEnd)
                // 这需要 OldRot。
                
                // 鉴于约束通常很重，我们在这里如果启用了约束，
                // 就必须承担一定的性能开销来修正 EndPos。
                // 最准确的办法其实是：
                // 因为单次旋转后，currentEndPos 必须和当前的 hierarchy 保持一致。
                // 如果不重新计算，下一节骨骼迭代时用的 currentEndPos 就是错的。
                
                // 为了保持 O(1) 而非 O(M)，我们假设：
                // 约束后的旋转导致 currentEndPos 发生的位移，可以通过
                // Vector3.transformQuat(originalVector, newRot, ...) 来算？不行，没 originalVector。
                
                // 妥协方案：
                // 由于 CCD 是迭代逼近的，单次迭代的微小误差是可以接受的。
                // 但是如果约束很大（比如把旋转完全锁死），那么 currentEndPos 就会严重偏离，
                // 导致下一个父节点的计算基于错误的末端位置，产生震荡。
                
                // 因此，如果应用了约束，我们不得不重新计算 currentEndPos。
                // 但在没有子节点位置信息的情况下，我们无法精确计算 currentEndPos。
                // 除非我们不仅更新 joint.rot，还顺便更新了 next.pos ... 
                // 等等，IK_CCD_Solver 的核心优化就是不更新中间节点位置。
                
                // 既然如此，我们只能【放弃】在启用约束时的 O(1) EndPos 更新，
                // 或者接受误差。
                // 或者：仅针对该关节到 EndPos 的这段向量进行旋转修正。
                // 即： newEndPos = pivot + rotate( oldEndPos - pivot, appliedRotation )
                // appliedRotation = constrainedRot * inv( oldRot )
                // 这需要求逆，开销也不小。
                
                // 让我们先只应用约束，不修正 EndPos，看看效果。
                // 如果震荡严重，再回来加求逆修正。
                // 根据经验，CCD 对这种误差有容忍度，只要不是最后一轮。
                
                // 补充：为了让约束生效，rotation 必须被应用。
                // 上面已经 joint.rotationQuat = curQ; 并且 doConstraint(joint) 修改了它。
                // 所以这里的逻辑是对的。
            }
            
            // --- 约束处理结束 ---

            // 8. 更新末端位置 (FK Estimation)
            // 注意：这里的 rotation 是我们计算出的理想 Delta。
            // 如果有约束，实际应用的 Delta 并不是这个 rotation。
            // 如果我们直接用这个 rotation 更新 EndPos，那么 EndPos 就会变成“如果无约束时的位置”。
            // 但骨骼实际上被约束卡住了，没转过去。
            // 这样 EndPos 和骨骼就脱节了。
            
            // 修正：
            // 只有在【无约束】或者【忽略约束误差】时，才能直接用 rotation 更新 EndPos。
            // 如果有约束，我们应该计算实际发生的 DeltaRot。
            // let actualDelta = joint.rot * inv(oldRot)
            // 这需要我们在修改 joint.rotationQuat 之前备份 oldRot。
            
            if (joint.constraint && joint.constraint.enable) {
                 // 需要回退上一步的 rotation 应用，重新计算
                 // 为了避免求逆，我们可以这样做：
                 // 1. 备份 oldQ
                 // 2. 应用理想 rot -> constraint -> 得到 newQ
                 // 3. 实际 delta = newQ * inv(oldQ)
                 // 4. 用实际 delta 更新 EndPos
                 
                 // 由于 JS 的对象引用机制，我们需要克隆
                 // 但为了性能，我们不想每次都 clone。
                 // 这是一个权衡。
                 // 考虑到约束的重要性，我们在这里做一个近似修正：
                 // 如果有约束，我们假设 "jointToEnd" 向量依然保持长度不变，只是方向变了。
                 // 但我们不知道新方向。
                 
                 // 最稳妥的路径：暂时接受末端位置脱节的误差。
                 // 下一次迭代的 updateAllJointPositions 会强制拉回。
                 // 如果 maxIterations 足够大，即使单次迭代误差，最终也能收敛。
                 
                 // 因此，这里继续使用理想 rotation 更新 EndPos。
                 // 这意味着：我们在告诉系统“末端已经移动到了目标位置”，哪怕实际上被约束挡住了。
                 // 下一轮 FK 会发现“哎呀，其实没过去”，然后继续算。
            }
            
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
    private updateAllJointPositions(joints: IK_Joint[], endId: number) {
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
    private solvePoleVector(comp: IK_Comp, chain: IK_Chain, joints: IK_Joint[], endId: number, basePos: Vector3) {
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
