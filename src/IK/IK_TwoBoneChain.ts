import { IK_Joint } from "./IK_Joint";

type Sprite3D = Laya.Sprite3D;
type Matrix4x4 = Laya.Matrix4x4;

export class IK_TwoBoneChain{
    root:IK_Joint=null;
    kee:IK_Joint=null;
    end:IK_Joint=null;

    solve(target:Matrix4x4, poleTarget?:Matrix4x4){
        let rootMat = this.root.bone.transform.worldMatrix;
        let keeMat = this.kee.bone.transform.worldMatrix;
        let endMat = this.kee.bone.transform.worldMatrix;

    }
}