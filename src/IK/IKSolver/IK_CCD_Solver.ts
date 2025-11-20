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
    // ==========================================
    private _jointToEndVec = new Vector3();    
    private _jointToTargetVec = new Vector3(); 
    private _pivotPos = new Vector3();         
    private _rotationDelta = new Quaternion(); 

    private _calcVecA = new Vector3();
    private _calcVecB = new Vector3();
    private _calcVecC = new Vector3();
    private _calcQuat = new Quaternion();

    // Debug
    private _logCounter = 0;
    private _lastAngle = 0;

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
        
        target.cloneTo(this._targetPos);
        
        // 2. 检查是否可达
        const totalLength = this.calculateTotalLength(joints, endId);
        const distBaseToTarget = Vector3.distance(basePos, this._targetPos);
        
        if (distBaseToTarget > totalLength) {
            const dirBaseToTarget = this._calcVecA;
            this._targetPos.vsub(basePos, dirBaseToTarget);
            dirBaseToTarget.normalize();
            
            const clampedDist = totalLength * 0.9999;
            dirBaseToTarget.scale(clampedDist, dirBaseToTarget);
            
            Vector3.add(basePos, dirBaseToTarget, this._targetPos);
        }

        // --- 新增：极向量预处理 ---
        // 在 CCD 迭代前，先扭转根节点，让膝盖朝向 Pole Target
        if (this.poleTarget && joints.length > 2) {
            this.preRotateToPole(joints, endId, basePos);
        }
        // -------------------------

        // 3. CCD 迭代求解
        let iteration = 0;
        let touched = false;
        const epsilonSq = chain.maxError * chain.maxError;
        
        endEffector.position.cloneTo(this._currentEndPos);

        while (iteration < this.maxIterations) {
            // 3.1 执行单次反向遍历
            touched = this.solveOneIteration(joints, endId, this._targetPos, epsilonSq);
            
            if (touched) break;

            iteration++;
            
            // 3.3 FK 更新
            if (iteration < this.maxIterations) {
                this.updateAllJointPositions(joints, endId);
                endEffector.position.cloneTo(this._currentEndPos);
            }
        }

        // 4. 最终位置同步
        this.updateAllJointPositions(joints, endId);

        // 5. 极向量约束 (后处理)
        // 依然保留后处理，以修正 CCD 迭代过程中可能产生的微小偏差
        if (this.poleTarget && joints.length > 2) {
            this.solvePoleVector(comp, chain, joints, endId, basePos);
        }

        comp.current_iteration = iteration;
        comp.current_error = Math.sqrt(Vector3.distanceSquared(endEffector.position, this._targetPos));

        return touched;
    }

    /**
     * 预旋转：将骨骼链平面旋转对齐到 Pole Target 平面
     * 重点旋转根节点 (joints[0])，使 joints[1] (膝盖) 尽量指向 Pole
     */
    private preRotateToPole(joints: IK_Joint[], endId: number, basePos: Vector3) {
        const polePos = this.poleTarget.pos;
        const midJoint = joints[1];
        const endJoint = joints[endId]; // 当前的末端，可能还没碰到目标

        // 1. 计算当前的 "Base->End" 轴
        const axis = this._calcVecA;
        endJoint.position.vsub(basePos, axis);
        if (axis.lengthSquared() < 1e-6) return; // 还没拉开距离，无法确定轴
        axis.normalize();

        // 2. 计算当前的 "Base->Mid" 投影 (当前膝盖方向)
        const baseToMid = this._calcVecB;
        midJoint.position.vsub(basePos, baseToMid);
        
        const projMid = this._jointToEndVec; // 复用变量
        // projMid = baseToMid - axis * (baseToMid . axis)
        const dotMid = Vector3.dot(baseToMid, axis);
        const tmp = this._calcVecC;
        axis.scale(dotMid, tmp);
        baseToMid.vsub(tmp, projMid);

        // 3. 计算 "Base->Pole" 投影 (目标膝盖方向)
        const baseToPole = this._jointToTargetVec; // 复用变量
        polePos.vsub(basePos, baseToPole);
        
        const projPole = this._pivotPos; // 复用变量
        // projPole = baseToPole - axis * (baseToPole . axis)
        const dotPole = Vector3.dot(baseToPole, axis);
        axis.scale(dotPole, tmp);
        baseToPole.vsub(tmp, projPole);

        // 4. 计算旋转
        if (projMid.lengthSquared() > 1e-4 && projPole.lengthSquared() > 1e-4) {
            projMid.normalize();
            projPole.normalize();

            const rot = this._calcQuat;
            quaternionFromTo(projMid, projPole, rot);
            
            // 5. 应用旋转到根节点
            // 这会带动整个腿部旋转，使膝盖朝向 Pole Target
            const root = joints[0];
            Quaternion.multiply(rot, root.rotationQuat, root.rotationQuat);
            
            // 6. 重要：立即更新 FK，否则后续 CCD 使用的位置是错的
            this.updateAllJointPositions(joints, endId);
        }
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

            joint.position.cloneTo(pivot);

            if (Vector3.distanceSquared(currentEndPos, targetPos) < epsilonSq) {
                return true;
            }

            currentEndPos.vsub(pivot, jointToEnd); 
            targetPos.vsub(pivot, jointToTarget); 

            if (jointToEnd.lengthSquared() < 1e-6 || jointToTarget.lengthSquared() < 1e-6) {
                continue;
            }

            jointToEnd.normalize();
            jointToTarget.normalize();

            quaternionFromTo(jointToEnd, jointToTarget, rotation);

            if (this.dampingFactor < 1.0 && this.dampingFactor > 0) {
                Quaternion.slerp(Quaternion.DEFAULT, rotation, this.dampingFactor, rotation);
            }

            const curQ = joint.rotationQuat;
            Quaternion.multiply(rotation, curQ, curQ);
            curQ.normalize(curQ);
            
            joint.rotationQuat = curQ;
            
            if (joint.constraint && joint.constraint.enable) {
                joint.constraint.doConsraint(joint);
            }

            // FK Estimation
            currentEndPos.vsub(pivot, jointToEnd);
            Vector3.transformQuat(jointToEnd, rotation, jointToEnd);
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
                const offset = this._calcVecA; 
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
     * 极向量处理 (后处理)
     */
    private solvePoleVector(comp: IK_Comp, chain: IK_Chain, joints: IK_Joint[], endId: number, basePos: Vector3) {
        // 移除调试打印，保持代码整洁
        const axis = this._calcVecA;
        const baseToPole = this._calcVecB;
        const baseToMid = this._calcVecC;
        
        const projMid = this._jointToEndVec;
        const projPole = this._jointToTargetVec;
        const tmpCross = this._pivotPos; 

        const endPos = joints[endId].position;
        const polePos = this.poleTarget.pos;
        const midPos = chain.joints[1].position;

        endPos.vsub(basePos, axis);
        polePos.vsub(basePos, baseToPole);
        midPos.vsub(basePos, baseToMid);

        const axisLenSq = axis.lengthSquared();
        if (axisLenSq < 1e-6) return;
        
        const axisLen = Math.sqrt(axisLenSq);
        axis.scale(1/axisLen, axis);

        // Proj Mid
        const dotMid = Vector3.dot(baseToMid, axis);
        const tmpAxisScaled = projMid; 
        axis.scale(dotMid, tmpAxisScaled);
        baseToMid.vsub(tmpAxisScaled, projMid); 

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
            let angle = Math.atan2(sinTheta, cosTheta);

            if (Math.abs(angle) > 1e-4) {
                comp.pole_rot = angle;
                const rot = this._rotationDelta; 
                Quaternion.createFromAxisAngle(axis, angle, rot);
                
                const rootJoint = joints[0];
                Quaternion.multiply(rot, rootJoint.rotationQuat, rootJoint.rotationQuat);
                
                this.updateAllJointPositions(joints, endId);
            }
        }
    }
}
