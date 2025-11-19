
const {Sprite3D,Vector3,Matrix4x4,Transform3D} = Laya;
type Vector3 = Laya.Vector3;
type Quaternion = Laya.Quaternion;
type Sprite3D = Laya.Sprite3D;
type Matrix4x4 = Laya.Matrix4x4;
type Transform3D = Laya.Transform3D;

export class IK_Target {
    targetSprite:Sprite3D=null;
    _pos=new Vector3();
    _dir=new Vector3(0,1,0);
    constructor(pos?: Vector3 | Sprite3D| null, dir?: Vector3 | null) {
        if(pos instanceof Sprite3D){
            this.targetSprite = pos;
        }else{
            if(pos)pos.cloneTo(this._pos);
            if(dir)dir.cloneTo(this._dir);
        }
    }

    getPose(mat:Matrix4x4){
        if(this.targetSprite){
            this.targetSprite.transform.worldMatrix.cloneTo(mat);
            return mat;
        }
        return null;
    }

    get pos(){
        if(this.targetSprite){
            return this.targetSprite.transform.position;
        }
        return this._pos;
    }
    set pos(p:Vector3){
        if(this.targetSprite){
            this.targetSprite=null;
        }
        p.cloneTo(this._pos);
    }

    get dir(){
        if(this.targetSprite){
            let e = this.targetSprite.transform.worldMatrix.elements;
            this._dir.setValue(e[4],e[5],e[6]);
            this._dir.normalize();
        }
        return this._dir;
    }
    set dir(v:Vector3){
        if(this.targetSprite){
            this.targetSprite=null;
        }
        v.cloneTo(this._dir)
    }
}
