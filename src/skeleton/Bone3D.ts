const {Sprite3D, Vector3}=Laya;
type Sprite3D = Laya.Sprite3D;

var dv = new Vector3();
export class Bone3D {
    boneLength = 0;
    pickDist=0;
    constructor(
        public name:string,
        public parent:Sprite3D,
        public child:Sprite3D
        
    ){
        parent.transform.position.vsub(child.transform.position,dv);
        this.boneLength = dv.length();
    }
}