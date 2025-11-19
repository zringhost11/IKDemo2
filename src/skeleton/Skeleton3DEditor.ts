
import { IK_Comp } from "../IK/IK_Comp";
import { ILinerender } from "./LineRender";
const {Vector3,Color,Sprite3D} = Laya;
type Sprite3D = Laya.Sprite3D;
type Vector3 = Laya.Vector3;
type Color = Laya.Color;

var liner:ILinerender={
    addLine: (from: Vector3, to: Vector3, color?: Color, color2?: Color) => { },
    destroy: function (): void {},
    clear:():void=>{}
}
var initLiner=false

@IEditorEnv.customEditor(IK_Comp)
export class Skeleton3DEditor extends IEditorEnv.CustomEditor {
    declare owner: Laya.Sprite3D;

    onSceneGUI(): void {
        //IEditorEnv.Handles.drawHemiSphere(this.owner.transform.position, 2);
    }

    onDrawGizmos(): void {
        let gizmo = IEditorEnv.Gizmos;
        if(!initLiner){
            initLiner=true;
            liner.addLine = gizmo.drawLine.bind(gizmo);
        }
        liner.addLine = gizmo.drawLine.bind(gizmo);
        //IEditorEnv.Gizmos.drawIcon(pos, "editorResources/UI/ready1.png");
        let ik = this.owner.getComponent(IK_Comp) as IK_Comp;
        ik.visualize(liner);
    }
}