import { IK_Comp } from "./IK_Comp";

const { regClass, runInEditor, property, Sprite3D, Vector3, Matrix4x4, Quaternion, LayaEnv, Color, PixelLineSprite3D, Scene3D, RenderState } = Laya;
type Sprite3D = Laya.Sprite3D;
type Matrix4x4 = Laya.Matrix4x4;
type Scene3D = Laya.Scene3D;
type PixelLineSprite3D = Laya.PixelLineSprite3D;

@regClass() @runInEditor
export class IK_DebugSystem extends Laya.Script{
    @property(Laya.Sprite)
    //run data
    ui:Laya.Sprite = null;
    datacnt=200;

    //comp data
    private datas:number[][]=[[]];
    //private ranges:number[]=[0.003,100,6,0.01,0.001];
    //private color:string[]=['red','green','blue','#ffff00','#ff00ff','#ee95fdff']
    private config = [
        //0
        {min:0,max:0.05,color:'red',skip:false},
        //1
        {min:0,max:100,color:'green'},
        //2
        {min:0,max:6,color:'blue',skip:false},
        //3
        {min:0,max:0.01,color:'#ffff00',skip:true},
        //4
        {min:0,max:1,color:'#ff00ff',skip:false},
        //5
        {min:0,max:1000,color:'#c7befdff',skip:true},
    ]
    override onUpdate(): void {
        let ikcomp = this.owner.getComponent(IK_Comp);
        if(!ikcomp.enabled){
            ikcomp = this.owner.getComponent(Laya.IK_Comp) as any as IK_Comp;
        }
        let g = this.ui.graphics;
        g.clear();
        
        //let width = 100;
        let height = 100;
        let step = 4;
        g.drawLine(0,0,this.datacnt*step,0,'white');
        g.drawLine(0,height,this.datacnt*step,height,'white');
        let h1 = height*(1-0.04/this.config[0].max);
        g.drawLine(0,h1,this.datacnt*step,h1,'black');
        for(let i=0,n=this.config.length;i<n;i++){
            g.fillText(''+this.config[i].max,0,i*10,'10px Arial',this.config[i].color,null)
        }
        let datas = this.datas;
        datas.push([
            ikcomp.current_error,
            ikcomp.current_iteration,
            ikcomp.pole_rot,
            ikcomp.targetChange,
            ikcomp.blendW,
        ]
        );

        for(let d=1,nd=datas.length;d<nd;d++){
            let x = d*step;
            let lastx = x-step;
            let curdata = datas[d];
            let lastdata = datas[d-1];
            for(let i=0,n=curdata.length;i<n;i++){
                if(this.config[i].skip)
                    continue;
                let r1 = this.config[i].max-this.config[i].min;
                let lv = lastdata[i];
                let v1 = curdata[i];
                let ly = (1-lv/r1)*height;
                let y = (1-v1/r1)*height;
                g.drawLine(lastx,ly,x-1,y,this.config[i].color);
            }
        }
        if(datas.length>this.datacnt){
            datas.shift();
        }
    }
}