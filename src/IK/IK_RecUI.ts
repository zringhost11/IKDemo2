import { IK_Comp } from "./IK_Comp";

const { regClass, runInEditor, property, Sprite3D, Vector3, Matrix4x4, Quaternion, LayaEnv, Color, PixelLineSprite3D, Scene3D, RenderState } = Laya;
type Sprite3D = Laya.Sprite3D;
type Matrix4x4 = Laya.Matrix4x4;
type Scene3D = Laya.Scene3D;
type PixelLineSprite3D = Laya.PixelLineSprite3D;

@regClass() @runInEditor
export class IK_RecUI extends Laya.Script{
    @property(IK_Comp)
    ikComp: IK_Comp = null;

    constructor(){
        super();
    }

    onAwake(): void {
        this.owner.on(Laya.Event.CLICK,this,this.onClick);
    }
    onClick(e:Laya.Event){
        switch(e.target.name){
            case 'startrec':
                this.ikComp.recordIkFrames = !this.ikComp.recordIkFrames;
                e.target.text = this.ikComp.recordIkFrames?"stop":"start"
                break;
            case 'stop':
                this.ikComp.停止帧回放=!this.ikComp.停止帧回放;
                e.target.text = this.ikComp.停止帧回放?"回放":"停止回放"
                break;
            case 'play':
                this.ikComp.回放最近帧=true;
                break;
            case 'prev':
                this.ikComp.回放上一帧=true;
                break;
            case 'next':
                this.ikComp.回放下一帧=true;
                break;
            default:
                break;
        }
    }
    
}