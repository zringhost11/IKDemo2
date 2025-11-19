import { IK_Comp } from "../IK/IK_Comp";
import { Bone3D } from "./Bone3D";
import { ILinerender } from "./LineRender";
import { rayHit } from "./MathUtils";
import { drawAxis } from "./RenderUtils";

const { Vector2, Vector3,Ray,BoundBox,RenderState,Color,Sprite3D,Event,Matrix4x4} = Laya;
type Sprite3D = Laya.Sprite3D;
type Camera = Laya.Camera;
type Event = Laya.Event;
//type PixelLineSprite3D = Laya.PixelLineSprite3D;
type Ray = Laya.Ray;
type Vector3=Laya.Vector3;
type Color = Laya.Color;

var v1 = new Vector3();
var v2 = new Vector3();

var noColor = new Color(0,0,0,0.1)

export class Skeleton3D{
    private _visualSp:ILinerender;
    showBone=true
    private _bones:Bone3D[]=[];
    private _bounds = new BoundBox(new Vector3(),new Vector3());
    private _editorCamera:Camera = null;
    enablePick=false;
    enablePickHide=false;
    //如果选中了多个，多次相同的话，每次选择不同的
    private _curPickedBone:Bone3D=null;
    private _lastMouseX=0;
    private _lastMouseY=0;
    private _useGizmo=true;
    owner:Sprite3D;

    get pickedParent(){
        return this._curPickedBone?.parent;
    }

    get pickedChild(){
        return this._curPickedBone?.child;
    }

    get pickdName(){
        return this._curPickedBone?.name;
    }

    showAxis=false;

    axisLength=0.3

    private _mouseOutListener:any;

    onAwake(owner:Sprite3D){
        this.owner = owner;
        // if(!this._useGizmo && !this._visualSp){
        //     let scene = (this.owner as Sprite3D).scene;
        //     let sp = this._visualSp = new PixelLineSprite3D();
        //     sp.name='skeleton visual'
        //     sp.maxLineCount=1000;
        //     let mtl = sp._render.sharedMaterial;
        //     mtl.depthTest= RenderState.DEPTHTEST_ALWAYS;
        //     mtl.renderQueue = 4000;
        //     scene.addChild(sp);
        // }

        this._bones.length=0;
        this.traverseChildren(owner,(parent:Sprite3D,child:Sprite3D)=>{
            if(parent && child)
                this._bones.push(new Bone3D(parent.name+'->'+child.name,parent,child));
        });

        if(window.EditorEnv){
            this._editorCamera = EditorEnv.d3Manager.sceneCamera;
            Laya.stage.on(Event.MOUSE_MOVE, this, this.onGlobalMouseMove);
            Laya.stage.on(Event.RIGHT_MOUSE_DOWN, this, this.onGlobalMouseDown);
            Laya.stage.on(Event.RIGHT_MOUSE_UP, this, this.onGlobalMouseUp);

            let mainCanv = Laya.Browser.mainCanvas.source;
            this._mouseOutListener = (ev:any)=>{
                let touch = (Laya.InputManager.inst as any)._mouseTouch as Laya.TouchInfo;
                if(touch.began)touch.end();
            }
            mainCanv.addEventListener('mouseout',this._mouseOutListener)
        }
    }

    
    visualize(liner:ILinerender){
        if(this.showBone){
            this._visualSp = liner;
            let root = this.owner as Sprite3D;
            this.traverseChildren(root,this._addLine.bind(this));
        }
    }

    onDestroy(): void {
        if(window.EditorEnv){
            Laya.stage.off(Event.MOUSE_MOVE, this, this.onGlobalMouseMove);
            Laya.stage.off(Event.MOUSE_DOWN, this, this.onGlobalMouseDown);
            Laya.stage.off(Event.RIGHT_MOUSE_DOWN, this, this.onGlobalMouseDown);
            Laya.stage.off(Event.RIGHT_MOUSE_UP, this, this.onGlobalMouseUp);
            Laya.Browser.mainCanvas.source.removeEventListener('mouseout',this._mouseOutListener)
        }
    }

    onGlobalMouseDown(evt: Event){
        if(evt.button==2)
            this._pickBone(evt);
    }
    onGlobalMouseUp(evt: Event){}

    onGlobalMouseMove(evt: Event){
    }

    private _pickBone(evt:Event){
        if(!this.enablePick)
            return;
        let pt = new Vector2(evt.stageX, evt.stageY);
        let ray = new Ray(new Vector3, new Vector3);
        let camera = this._editorCamera;
        camera.viewportPointToRay(pt, ray);
        
        let dx = evt.stageX-this._lastMouseX;
        let dy = evt.stageY-this._lastMouseY;
        let mouseMoved = (dx*dx+dy*dy)>4;
        if(mouseMoved){
            this._lastMouseX = evt.stageX;
            this._lastMouseY = evt.stageY;
        }

        let picks:Bone3D[]  = [];
        this.pickBone(ray.origin, ray.direction,0.1,this._bones, picks);
        if(picks.length>0){
            let last = this._curPickedBone;
            let selid=0;
            if(last && !mouseMoved){
                let idx = picks.indexOf(last);
                if(idx>=0){
                    //如果上次已经选择了，这次就不要选了
                    selid = (idx+1)%picks.length;
                }
            }
            this._curPickedBone = picks[selid];
            this._onSelectBone(this._curPickedBone);
            console.log('拾取:'+this._curPickedBone.name+',所有:')
            for(let b of picks){
                console.log(b.name)
            }
        }
    }

    private _addLine(parent: Sprite3D, child: Sprite3D) {
        if(!child)return;
        let pcolor = Color.RED;
        let ccolor = Color.GREEN;
        let liner = this._visualSp;
        if(this._curPickedBone){
            if(this._curPickedBone.parent == parent && this._curPickedBone.child==child){
                pcolor = Color.WHITE;
                ccolor = Color.WHITE;

                if(this.showAxis){
                    drawAxis(liner,parent.transform.worldMatrix,this.axisLength);
                    // let ori = parent.transform.position;
                    // let e = parent.transform.worldMatrix.elements;
                    // let axLen=this.axisLength;
                    // v1.set(e[0],e[1],e[2]).normalize().scale(axLen,v1);
                    // ori.vadd(v1,v2);
                    // liner.addLine(ori,v2,Color.RED,Color.RED);
                    // v1.set(e[4],e[5],e[6]).normalize().scale(axLen,v1);
                    // ori.vadd(v1,v2);
                    // liner.addLine(ori,v2,Color.GREEN,Color.GREEN);
                    // v1.set(e[8],e[9],e[10]).normalize().scale(axLen,v1);
                    // ori.vadd(v1,v2);
                    // liner.addLine(ori,v2,Color.BLUE,Color.BLUE);
                }
            }else{
                if((child._extra as any).notLinkToParent){
                    return;
                    pcolor = noColor;
                    ccolor = noColor;
                }
            }
        }
        liner.addLine(
            parent.transform.position,
            child.transform.position,
            pcolor,
            ccolor
        );
    }

    traverseChildren(parent: Sprite3D, f:(parent:Sprite3D,child:Sprite3D)=>void): void {
        if(parent.name=='joints')
            return;
        if(!parent.children||parent.children.length==0){
            f(parent,null)
        }
        parent.children.forEach(child => {
            if (child instanceof Sprite3D) {
                let childsp = child as Sprite3D
                f(parent,childsp);
                this.traverseChildren(childsp,f);
            }
        });
    }

    private _onSelectBone(bone:Bone3D){
        let cursel = EditorEnv.scene.selection?.[0];
        let ikcom:IK_Comp=null;
        if(cursel && (ikcom = cursel.getComponent(IK_Comp))){
            //编辑ik中，不要改变选择对象。
            ikcom.onSelectBone(bone);
            return;
        }
        EditorEnv.scene.setSelection([bone.parent])
    }

    pickBone(rayStart: Vector3, rayDir: Vector3, maxdist: number, bones: Bone3D[], picks: Bone3D[]) {
        let tmpStart = new Vector3();
        let tmpEnd = new Vector3();
        let tmpVec = new Vector3();
        let tmpDir = new Vector3();

        // 遍历所有骨骼
        for (let bone of bones) {
            // 如果骨骼长度为0，则跳过
            if (bone.boneLength <= 0.01) continue;

            if((bone.child._extra as any)?.notLinkToParent && !this.enablePickHide)
                continue;
            
            // 获取骨骼的世界位置
            bone.parent.transform.position.cloneTo(tmpStart);
            bone.child.transform.position.cloneTo(tmpEnd);

            // 计算射线到骨骼线段的最短距离
            let t = rayHit(tmpStart, tmpEnd, rayStart, rayDir, tmpVec);

            if (t < maxdist) {
                // 计算射线起点到最近点的距离
                tmpVec.vsub(rayStart, tmpVec);
                bone.pickDist = t;
                picks.push(bone);
            }
        }

        // 按距离排序
        picks.sort((a, b) => {
            // let distA = Vector3.distance(rayStart, a.parent.transform.position);
            // let distB = Vector3.distance(rayStart, b.parent.transform.position);
            // return distA - distB;
            return a.pickDist-b.pickDist;
        });
    }

    savePose(name:string){
        EditorEnv.scene.runScript("EditorEnvHelper.savePose",name);
    }

    loadPose(name:string){
        EditorEnv.scene.runScript("EditorEnvHelper.loadPose",name);
    }
}
