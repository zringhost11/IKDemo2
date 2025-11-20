import { IK_Chain } from "../IK_Chain";
import { IK_Comp } from "../IK_Comp";
import { IK_ISolver } from "../IK_ISolver";
import { IK_Target } from "../IK_Target";
import { quaternionFromTo } from "../IK_Utils"

const { Quaternion, Vector3 } = Laya
type Vector3 = Laya.Vector3
type Quaternion = Laya.Quaternion

// --- 静态缓存变量 (避免 GC) ---
const tmpVec3_1 = new Vector3();
const tmpVec3_2 = new Vector3();
const tmpVec3_3 = new Vector3();
const tmpVec3_4 = new Vector3();
const tmpVec3_5 = new Vector3();

const tmpQuat_1 = new Quaternion();
const tmpQuat_2 = new Quaternion();

export class IK_CCDSolver implements IK_ISolver {
    dampingFactor: number = 0.1; 
    maxIterations: number;
    poleTarget: IK_Target = null;

    // 调试/状态变量
    private _targetPos = new Vector3();
    private _currentEndPos = new Vector3();

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
        // 确定末端关节索引：endOffline 为 true 时，倒数第二个是实际末端
        const endId = endOffline ? joints.length - 2 : joints.length - 1;
        const endEffector = joints[endId];
        const basePos = joints[0].position;
        
        // 复制目标位置到本地缓存
        target.cloneTo(this._targetPos);
        
        // 2. 检查是否可达 (Reachability)
        // 如果不可达，直接拉直链条指向目标，不再进行迭代
        const totalLength = this.calculateTotalLength(joints, endId);
        const distBaseToTarget = Vector3.distance(basePos, this._targetPos);
        
        if (distBaseToTarget > totalLength) {
            this.handleUnreachable(joints, endId, basePos, this._targetPos);
            // 设置结果数据供外部读取
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
            // 3.1 执行单次反向遍历 (从末端到根)
            touched = this.solveOneIteration(joints, endId, this._targetPos, epsilonSq);
            
            // 如果已经接触目标，提前退出
            if (touched) break;

            // 3.2 检查误差是否满足要求
            const currentDistSq = Vector3.distanceSquared(this._currentEndPos, this._targetPos);
            if (currentDistSq < epsilonSq) {
                touched = true;
                break;
            }

            iteration++;
            
            // 3.3 如果还有下一轮迭代，必须进行 FK (Forward Kinematics) 更新
            // 之前只更新末端位置，但下一轮迭代需要正确的中间关节位置作为 Pivot
            if (iteration < this.maxIterations) {
                this.updateAllJointPositions(joints, endId);
                // FK 后重新获取一下最准确的末端位置
                endEffector.position.cloneTo(this._currentEndPos);
            }
        }

        // 4. 最终位置同步
        // 确保最后一次计算的旋转应用到了关节位置上 (给外部渲染用)
        this.updateAllJointPositions(joints, endId);

        // 5. 极向量约束 (Pole Vector)
        // 在主 IK 求解后应用，调整膝盖/手肘朝向
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
     * 从末端的前一个关节开始，逐个往回调整旋转
     */
    private solveOneIteration(joints: any[], endId: number, targetPos: Vector3, epsilonSq: number): boolean {
        const currentEndPos = this._currentEndPos;
        const jointToEnd = tmpVec3_1;
        const jointToTarget = tmpVec3_2;
        const rotation = tmpQuat_1;
        const pivot = tmpVec3_3;

        // 从倒数第二个关节开始，一直遍历到根节点 (0)
        for (let i = endId - 1; i >= 0; i--) {
            const joint = joints[i];
            if (joint.fixed) continue;

            // 1. 获取当前关节位置 (旋转轴心)
            joint.position.cloneTo(pivot);

            // 2. 检查末端是否已经足够接近目标
            if (Vector3.distanceSquared(currentEndPos, targetPos) < epsilonSq) {
                return true;
            }

            // 3. 构建向量
            // 向量 A: 关节 -> 当前末端位置
            currentEndPos.vsub(pivot, jointToEnd);
            // 向量 B: 关节 -> 目标位置
            targetPos.vsub(pivot, jointToTarget);

            // 4. 稳定性检查：如果向量太短，无法计算方向，跳过
            if (jointToEnd.lengthSquared() < 1e-6 || jointToTarget.lengthSquared() < 1e-6) {
                continue;
            }

            jointToEnd.normalize();
            jointToTarget.normalize();

            // 5. 计算旋转 (From A to B)
            quaternionFromTo(jointToEnd, jointToTarget, rotation);

            // 6. 应用阻尼 (Damping) 防止震荡
            if (this.dampingFactor < 1.0 && this.dampingFactor > 0) {
                Quaternion.slerp(Quaternion.DEFAULT, rotation, this.dampingFactor, rotation);
            }

            // 7. 应用旋转到关节
            // 新旋转 = DeltaRot * 旧旋转 (注意乘法顺序，Delta 是在父空间/世界空间应用的)
            const curQ = joint.rotationQuat;
            Quaternion.multiply(rotation, curQ, curQ);
            curQ.normalize(curQ);
            joint.rotationQuat = curQ;

            // 8. 数学更新末端位置 (Mathematical FK)
            // 这样可以避免更新所有中间子关节的位置，只追踪末端
            // NewEndPos = Pivot + Rot * (OldEndPos - Pivot)
            
            // 8.1 获取原始向量 (未归一化)
            currentEndPos.vsub(pivot, jointToEnd);
            
            // 8.2 旋转向量
            Vector3.transformQuat(jointToEnd, rotation, jointToEnd);
            
            // 8.3 更新末端位置
            Vector3.add(pivot, jointToEnd, currentEndPos);

            // TODO: 如果有关节约束 (Constraint)，需要在这里应用，并修正 currentEndPos
            // 目前为了性能暂时略过，或者在 updateAllJointPositions 中统一修正
        }

        return false;
    }

    /**
     * FK (正向运动学) 更新所有关节位置
     * 根据父关节的位置和旋转，以及子关节的相对偏移 (relPos)，重新计算子关节的世界坐标
     */
    private updateAllJointPositions(joints: any[], endId: number) {
        // 从根节点的子节点开始更新 (根节点位置假设不变，或者由外部控制)
        // i 是父节点索引
        for (let i = 0; i < endId; i++) {
            const parent = joints[i];
            const child = joints[i + 1];
            
            if (child) {
                // ChildPos = ParentPos + ParentRot * ChildRelPos
                const offset = tmpVec3_4;
                Vector3.transformQuat(child.relPos, parent.rotationQuat, offset);
                
                const newPos = child.position; // 引用 Laya 的 Vector3 对象
                // 手动赋值避免 new
                newPos.x = parent.position.x + offset.x;
                newPos.y = parent.position.y + offset.y;
                newPos.z = parent.position.z + offset.z;
                
                // Laya 可能需要标记 transform 脏，但通常修改 position 属性会自动处理
                child.position = newPos; 
            }
        }
    }

    /**
     * 处理目标不可达的情况：拉直链条指向目标
     */
    private handleUnreachable(joints: any[], endId: number, basePos: Vector3, targetPos: Vector3) {
        const dir = tmpVec3_1;
        const rot = tmpQuat_1;
        
        // 计算 根->目标 的方向
        targetPos.vsub(basePos, dir);
        if (dir.lengthSquared() < 1e-6) return; // 重合了
        dir.normalize();

        // 简单的策略：
        // 1. 将所有关节（除了最后一个）的旋转设置为“指向子节点”的方向为“指向目标”
        // 或者更简单：将整个链条视为直线，旋转根节点指向目标，后续节点全部归零(相对于父)或者设为直线。
        // 这里采用逐个对齐的策略，保留之前的逻辑，但简化计算
        
        // 其实如果不可达，通常意味着全部伸直。
        // 我们只需要计算 根->目标 的旋转，应用到根节点。
        // 然后后续所有节点相对于父节点的旋转设为 identity (即伸直状态)。
        // 但这依赖于“relPos”本身是沿 Z 轴还是什么轴。
        // 比较稳妥的方法是逐个旋转：
        
        for (let i = 0; i < endId; i++) {
            const joint = joints[i];
            if (joint.fixed) continue;
            
            const next = joints[i+1];
            if (!next) break;

            // 关节当前指向子关节的向量（世界空间）
            const currentDir = tmpVec3_2;
            next.position.vsub(joint.position, currentDir);
            currentDir.normalize();
            
            // 目标方向（这里简化为：所有骨骼都试图指向最终 Target）
            // 这会造成“拉直”的效果
            const targetDir = tmpVec3_3;
            targetPos.vsub(joint.position, targetDir);
            targetDir.normalize();

            // 计算旋转
            quaternionFromTo(currentDir, targetDir, rot);
            
            // 应用旋转
            const curQ = joint.rotationQuat;
            Quaternion.multiply(rot, curQ, curQ);
            joint.rotationQuat = curQ;

            // 必须立即更新子节点位置，因为下一个循环依赖 next.position
            this.updateOneChildPosition(joint, next);
        }
    }

    private updateOneChildPosition(parent: any, child: any) {
        const offset = tmpVec3_4;
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
     * 极向量处理 (保持原有逻辑，稍微整理变量)
     */
    private solvePoleVector(comp: IK_Comp, chain: IK_Chain, joints: any[], endId: number, basePos: Vector3) {
        // 静态变量复用
        const axis = tmpVec3_1;
        const baseToPole = tmpVec3_2;
        const baseToMid = tmpVec3_3;
        const projMid = tmpVec3_4;
        const projPole = tmpVec3_5;
        const tmpCalc = new Vector3(); // 临时用一下，避免复杂的别名覆盖风险，或者小心使用

        const endPos = joints[endId].position;
        const polePos = this.poleTarget.pos;
        const midPos = chain.joints[1].position; // 假设 joint[1] 是中间关节 (膝盖/肘)

        // 构建向量
        endPos.vsub(basePos, axis);
        polePos.vsub(basePos, baseToPole);
        midPos.vsub(basePos, baseToMid);

        if (axis.lengthSquared() < 1e-6) return;

        // 1. 归一化旋转轴 (根->末端)
        axis.normalize();

        // 2. 投影 Mid 和 Pole 到垂直于 Axis 的平面
        // proj(v) = v - axis * (v . axis)
        
        // Proj Mid
        const dotMid = Vector3.dot(baseToMid, axis);
        axis.scale(dotMid, tmpCalc);
        baseToMid.vsub(tmpCalc, projMid);

        // Proj Pole
        const dotPole = Vector3.dot(baseToPole, axis);
        axis.scale(dotPole, tmpCalc);
        baseToPole.vsub(tmpCalc, projPole);

        const lenMid = projMid.length();
        const lenPole = projPole.length();

        if (lenMid > 1e-3 && lenPole > 1e-3) {
            projMid.scale(1/lenMid, projMid);
            projPole.scale(1/lenPole, projPole);

            // 3. 计算角度
            const cosTheta = Math.max(-1, Math.min(1, Vector3.dot(projMid, projPole)));
            Vector3.cross(projMid, projPole, tmpCalc);
            const sinTheta = Vector3.dot(tmpCalc, axis);
            const angle = Math.atan2(sinTheta, cosTheta);

            if (Math.abs(angle) > 1e-4) {
                // 4. 应用旋转到根节点
                comp.pole_rot = angle;
                const rot = tmpQuat_1;
                Quaternion.createFromAxisAngle(axis, angle, rot);
                
                const rootJoint = joints[0];
                Quaternion.multiply(rot, rootJoint.rotationQuat, rootJoint.rotationQuat);
                
                // 旋转根节点后，整条链的位置都需要更新
                this.updateAllJointPositions(joints, endId);
            }
        }
    }
}
