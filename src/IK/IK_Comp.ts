import { Bone3D } from "../skeleton/Bone3D";
import { ILinerender } from "../skeleton/LineRender";
import { Skeleton3D } from "../skeleton/Skeleton3D";
import { BoneConstraints } from "./BoneConstraints";
import { IK_AnimLayer } from "./IK_AnimLayer";
import { IK_Chain } from "./IK_Chain";
import { IK_ChainData } from "./IK_ChainData";
import { IK_Constraint1, IK_ConstraintInstance } from "./IK_Constraint";
import { IK_Constraint_Euler } from "./IK_Constraint_Euler";
import { IK_Constraint_SwingTwist } from "./IK_Constraint_SwingTwist";
import { IK_ConstraintData } from "./IK_ConstraintData";
import { IK_Joint } from "./IK_Joint";
import { IK_Lookat } from "./IK_Lookat";
import { IK_Target } from "./IK_Target";
import { IK_System, SHOW_DBG } from "./IK_System";

const { regClass, runInEditor, property, Sprite3D, Vector3, Matrix4x4, Quaternion, LayaEnv, Color, PixelLineSprite3D, Scene3D, RenderState } = Laya;
type Sprite3D = Laya.Sprite3D;
type Matrix4x4 = Laya.Matrix4x4;
type Scene3D = Laya.Scene3D;
type PixelLineSprite3D = Laya.PixelLineSprite3D;


@regClass() @runInEditor
export class IK_Comp extends Laya.Script {
    private _ik_sys: IK_System;
    _ske3d = new Skeleton3D();

    private _needRebuild = true;

    private _constraintsMap = new Map<Sprite3D, IK_ConstraintInstance>();
    private _showDbg = false;
    private _visualSp: PixelLineSprite3D = null
    private _visualInPlay = true;

    private sensorAcc: { x: number, y: number, z: number } = null;

    private _chainDatas: IK_ChainData[] = [];

    //运行时信息
    current_iteration =0;
    current_error =0.0;
    pole_rot=0;
    targetChange=0;
    blendW=0;

    @property({ type: [IK_ChainData], onChange: "onChainDataChange" })
    set chainDatas(v: IK_ChainData[]) {
        this._chainDatas = v;
        this._needRebuild = true;
    }
    get chainDatas() {
        return this._chainDatas;
    }


    private _solverIteration = 10;
    @property({ type: 'int', max: 100, min: 1 })
    set solverIteration(v: number) {
        this._solverIteration = v;
        this._ik_sys.setMaxIterations(v);
    }
    get solverIteration() {
        return this._solverIteration;
    }

    private _dirsolverIteration = 10;
    @property({ type: 'int', max: 100, min: 1 })
    set dirSolverIteration(v: number) {
        this._dirsolverIteration = v;
        IK_Lookat.dirIt = v;
    }
    get dirSolverIteration() {
        return this._dirsolverIteration;
    }

    @property({ type: Number, min: 0, max: 1 })
    set dampingFactor(v: number) {
        this._ik_sys.setDampingFactor(v);
    }
    get dampingFactor() {
        return this._ik_sys.getDampingFactor();
    }

    private _constraintDatas: IK_ConstraintData[]
    //@property({type:[IK_ConstraintData],onChange:'onConstraintDataChange'})
    set constraints(cs: IK_ConstraintData[]) {
        this._constraintDatas = cs;
        this._needRebuild = true;
    }
    get constraints() {
        return this._constraintDatas;
    }

    onConstraintDataChange(idx: number) {
        let constraintComp = this.owner.getComponent(BoneConstraints);
        this.constraints = constraintComp.constraints;
        //this._needRebuild=true;
    }

    @property({ type: Boolean, catalog: 'debug' })
    set showGizmos(v: boolean) {
        this._showDbg = v;
        if (this._ik_sys) {
            this._ik_sys.showDbg = v;
        }
    }
    get showGizmos() {
        return this._showDbg;
    }

    @property({ type: Boolean, catalog: 'debug' })
    set 显示约束(v: boolean) {
        if (v)
            SHOW_DBG.add(SHOW_DBG.CONSTRAINT);
        else
            SHOW_DBG.sub(SHOW_DBG.CONSTRAINT);
    }
    get 显示约束() {
        return SHOW_DBG.has(SHOW_DBG.CONSTRAINT);
    }
    @property({ type: Boolean, catalog: 'debug' })
    set 显约束轴(v: boolean) {
        if (v)
            SHOW_DBG.add(SHOW_DBG.CONSTRAINT_AXIS);
        else
            SHOW_DBG.sub(SHOW_DBG.CONSTRAINT_AXIS);
    }
    get 显约束轴() {
        return SHOW_DBG.has(SHOW_DBG.CONSTRAINT_AXIS);
    }

    // @property({type:Boolean})
    // get enableSolver(){
    //     return this._ik_sys.enableSolver;
    // }
    // set enableSolver(b:boolean){
    //     this._ik_sys.enableSolver=b;
    // }

    private _runInEditor = true;
    @property({ type: Boolean })
    get RunInEditor() {
        return this._runInEditor;
    }
    set RunInEditor(b: boolean) {
        this._runInEditor = b;
    }

    @property({ type: Boolean, catalog: 'debug', caption: '使用动画层' })
    set useAnimLayer(b: boolean) {
        this._ik_sys.useAnimLayer = b;
    }
    get useAnimLayer() {
        return this._ik_sys.useAnimLayer;
    }

    //skeleton3d相关
    @property({ type: Boolean, catalog: "skeleton" })
    set showBone(value: boolean) {
        this._ske3d.showBone = value;
    }
    get showBone(): boolean {
        return this._ske3d.showBone;
    }

    @property({ type: Boolean, catalog: "skeleton" })
    set pickBone(v: boolean) {
        this._ske3d.enablePick = v;
    }
    get pickBone() {
        return this._ske3d.enablePick;
    }

    @property({ type: Boolean, catalog: "skeleton" })
    set pickHideBone(v: boolean) {
        this._ske3d.enablePickHide = v;
    }
    get pickHideBone() {
        return this._ske3d.enablePickHide;
    }    

    @property({ type: Sprite3D, serializable: false, hidden: '!data.pickBone', catalog: "skeleton" })
    get pickedParent() {
        return this._ske3d.pickedParent;
    }

    @property({ type: Sprite3D, serializable: false, hidden: '!data.pickBone', catalog: 'skeleton' })
    get pickedChild() {
        return this._ske3d.pickedChild;
    }

    @property({type:Boolean,catalog:'skeleton'})
    get hideBone(){
        if(this._ske3d.pickedChild){
            let data = this._ske3d.pickedChild._extra;
            return ((data as any).notLinkToParent);
        }
        return false;
    }
    set hideBone(v:boolean){
        if(this._ske3d.pickedChild){
            let data = this._ske3d.pickedChild._extra;
            (data as any).notLinkToParent = v;
        }
    }

    private _enableControl = false;
    @property({ type: Boolean, catalog: "skeleton", caption: "控制父节点" })
    get enableControl() {
        return this._enableControl;
    }
    set enableControl(v: boolean) {
        if (v) {
            Laya.stage.on('sensor', this, this._controlBone)
            Laya.stage.on('noloevent', this, this._controlBoneNolo)
        } else {
            Laya.stage.off('sensor', this, this._controlBone)
            Laya.stage.off('noloevent', this, this._controlBoneNolo)
        }
        this._enableControl = v;
    }

    @property({ type: Boolean, catalog: "skeleton", caption: '控制带约束' })
    controlWithConstraint = false;


    @property({ type: Boolean, catalog: "skeleton" })
    get showAxis() {
        return this._ske3d.showAxis;
    }
    set showAxis(v: boolean) {
        this._ske3d.showAxis = v;
    }

    @property({ type: Number, min: 0.1, max: 1.0, catalog: 'skeleton' })
    set axisLength(v: number) {
        this._ske3d.axisLength = v;
    }
    get axisLength() {
        return this._ske3d.axisLength;
    }

    @property({ type: String, catalog: 'skeleton' })
    //@property({type:String,isAsset:true, useAssetPath: true,catalog:'skeleton'})
    poseName: string;

    // @property({type:Sprite3D,catalog:'skeleton'})
    // poseNode:Sprite3D;

    @property({ type: Boolean, serializable: false, catalog: 'skeleton' })
    get 保存姿态() {
        return false;
    }
    set 保存姿态(v: boolean) {
        this._ske3d.savePose(this.poseName);
    }

    @property({ type: Boolean, serializable: false, catalog: 'skeleton', inspector: "PropertyButton",options: { buttons: [
                        { caption: "重置姿态", selectCaption: "重置姿态", event: "modifyProperty" },
                        { caption: "保存姿态", runScript: "EditorEnvHelper.savePose" },
                    ],
                }, })
    get 重置姿态() {
        return false;
    }
    set 重置姿态(v: boolean) {
        // if(this._ik_sys.enableSolver){
        //     alert('重置姿态需要先关掉Enable Solver或者关掉ik否则看不到效果')
        //     return;
        // }
        if (this._runInEditor) {
            alert('重置姿态需要先关掉RunInEditor');
            return;
        }
        this._ske3d.loadPose(this.poseName);
        this._ik_sys.resetPose();
    }


    constructor() {
        super();
    }
    protected _onAdded(): void {
        let ik = this._ik_sys = new IK_System(this);
        ik.setRoot(this.owner as Sprite3D);
        ik.showDbg = this._showDbg;
    }

    onAfterDeserialize() {
        this._needRebuild = true;
    }

    onChainDataChange(data: IK_ChainData, key: string, value: any, oldvalue: any) {
        this._needRebuild = true;
    }

    setTarget(name: string | IK_Chain, target: IK_Target) {
        this._ik_sys.setTarget(name, target);
    }

    get chains() {
        return this._ik_sys.chains;
    }

    getChain(name: string) {
        for (let c of this.chains) {
            if (c.name == name)
                return c;
        }
        return null;
    }

    /**
     * 在动画开始之前，用来记录、恢复静态姿态
     */
    beforeOwnerAnim() {
        //if(!this.enableSolver)
        //    return;
        if (!this._runInEditor && window.EditorEnv)
            return;

        for (let chain of this._ik_sys.chains) {
            chain.resetStaticPose();
        }
        for (let lookat of this._ik_sys.lookats) {
            lookat.resetStaticPose();
        }
    }

    onAwake(): void {
        super.onAwake();
        this._ske3d.onAwake(this.owner as Sprite3D);
        let constraintComp = this.owner.getComponent(BoneConstraints);
        if (constraintComp) {
            this.constraints = constraintComp.constraints;
            this.owner.on(BoneConstraints.DATACHANGE, this, this.onConstraintDataChange);
        }
    }

    onDestroy(): void {
        this.showGizmos = false;
        this._ik_sys.showDbg = false;
        super.onDestroy();
        this._ske3d.onDestroy();
        this.owner.off(BoneConstraints.DATACHANGE, this, this.onConstraintDataChange);
    }

    onUpdate() {
        if (window.EditorEnv && !this._runInEditor)
            return;
        if (this._needRebuild) {
            let _fixedBone = new Set<Sprite3D>();
            //创建约束
            this._constraintsMap.clear();
            if (this._constraintDatas) {
                this._constraintDatas.forEach(cdata => {
                    // if(!cdata.enable)
                    //     return;
                    if (!cdata.bone)
                        return;
                    if (this._constraintsMap.get(cdata.bone)) {
                        console.error('一个骨骼只能设置一个约束:', cdata.bone, name, cdata.bone);
                    }
                    let constraint: IK_ConstraintInstance = null;
                    let d2r = Math.PI / 180;
                    switch (cdata.type) {
                        //@ts-ignore
                        case 'hinge':
                            //let c = new IK_Constraint_Hinge(cdata.xmin*d2r,cdata.xmax*d2r);
                            //constraint = new IK_ConstraintInstance(c,getSpaceByDir(cdata.bone,cdata.axis));
                            cdata.ymin = 0; cdata.ymax = 0;
                            cdata.zmin = 0; cdata.zmax = 0;
                        case 'euler': {
                            let c = new IK_Constraint_Euler(cdata.xmin * d2r, cdata.xmax * d2r,
                                cdata.ymin * d2r, cdata.ymax * d2r,
                                cdata.zmin * d2r, cdata.zmax * d2r);
                            constraint = this._createConstraintInstanceFromData(cdata, c);
                        }
                            break;
                        case 'swingtwist': {
                            let c = new IK_Constraint_SwingTwist(cdata.xmax * d2r,
                                cdata.ymax * d2r,
                                cdata.zmin * d2r, cdata.zmax * d2r);

                            c.visual_height = cdata.visualHeight;
                            c.visual_zheight = c.visual_height + 0.1;
                            constraint = this._createConstraintInstanceFromData(cdata, c);
                        }
                            break;
                        case 'fixed':
                            _fixedBone.add(cdata.bone);
                            break;
                        default:
                            break;
                    }
                    if (constraint) {
                        this._constraintsMap.set(cdata.bone, constraint)
                    }
                });
                this._ik_sys.constraintsMap = this._constraintsMap;
            }
            //创建chain
            this._ik_sys.clear();
            this.chainDatas.forEach(data => {
                let cnt = data.bones?.length||data.jointCount;
                if (!cnt || !data.end || !data.enable)
                    return;
                let name = data.name;
                if (!name) {
                    name = data.end.name;
                }

                let chain_joints:IK_Joint[]=null;
                if (data.type == 'position') {
                    let c = this._ik_sys.chreateChainByBoneName(data.end, cnt);
                    c.name = name;
                    c.enable = data.enable;
                    c.blendWeight = data.blendWeight;
                    c.poleTarget = data.PoleTarget ? new IK_Target(data.PoleTarget) : null;
                    if(data.maxError) c.maxError = data.maxError;
                    if(!data.enablePoleTarget){
                        c.poleTarget = null;
                    }
                    //c.alignWithTarget = data.alignWithTarget;
                    this._ik_sys.addChain(c);
                    if (data.target)
                        this._ik_sys.setTarget(c, new IK_Target(data.target));
                    if (data.fixedEnd) {
                        c.endFixed = true;
                    }
                    if (data.alignTarget && data.alignTarget != 'no') {
                        c.endAlign = data.alignTarget;
                    }
                    chain_joints = c.joints;
                } else if (data.type == 'lookat') {
                    let lookat = this._ik_sys.chreateLookatByEndSprite(data.end, cnt);
                    if (lookat) {
                        lookat.name = name;
                        lookat.enable = data.enable;
                        //lookat.alignWithTarget = data.alignWithTarget;
                        this._ik_sys.lookats.push(lookat);
                        if (data.target) {
                            lookat.target = new IK_Target(data.target);
                        }
                        chain_joints = lookat.joints;
                    }
                }
                //如果有bones数据，应用一下
                if(data.bones){
                    let joints = chain_joints;
                    data.bones.forEach(b=>{
                        if(b.disabled){
                            for(let i=0,n=cnt;i<n;i++){
                                if(joints[i].bone==b.data){
                                    joints[i].fixed=true;
                                    break;
                                }
                            }
                        }
                    })
                }
                //固定约束
                if(_fixedBone.size){
                    chain_joints.forEach(j=>{
                        if(_fixedBone.has(j.bone)){
                            j.fixed=true;
                        }
                    })
                }
            })
            this._needRebuild = false;
        } else {
            this._updateConstraintSpace();
        }
        //应用ik结果
        this._ik_sys.onUpdate();

        if (LayaEnv.isPlaying && this._visualInPlay) {
            if (!this._visualSp) {
                let sp = this._visualSp = new PixelLineSprite3D();
                sp.name = 'ik visual'
                sp.maxLineCount = 1000;
                let mtl = sp._render.material;
                mtl.renderQueue = 4001;
                mtl.depthTest = RenderState.DEPTHTEST_ALWAYS;
                this.owner._scene.addChild(sp);
            }
            this._visualSp.clear();
            this.visualize(this._visualSp);
        }

    }

    private _createConstraintInstanceFromData(cdata: IK_ConstraintData, c: IK_Constraint1): IK_ConstraintInstance {
        if (!cdata || !cdata.bone) return null;
        let inParent = new Matrix4x4();
        let parentMatW: Matrix4x4;
        if (cdata.bone.parent) {
            parentMatW = (cdata.bone.parent as Sprite3D).transform.worldMatrix;
        }
        if (cdata.space) {
            if (cdata.space.parent == cdata.bone) {
                alert(`约束调整对象${cdata.space.name}不要放到当前关节下，建议放到当前关节的父下，否则初始化的时候会与当前关节的姿态有关`)
            }
            let constraintMat = cdata.space.transform.worldMatrix;
            let invMat = new Matrix4x4();
            if (parentMatW) {
                parentMatW.invert(invMat);
                Matrix4x4.multiply(invMat, constraintMat, inParent);
            } else {
                constraintMat.cloneTo(inParent);
            }
            if (LayaEnv.isPlaying && cdata.space.name.startsWith('_ik')) {
                //this._SpriteToClean.add(cdata.space);
                //删除会引起一些问题，例如别人重用，例如希望运行时动态修改，所以先不删除了
            }
        } else {
            //没有space则与parent对齐，但是加上位置偏移
            let pos = cdata.bone.transform.localPosition;
            inParent.elements[12] = pos.x; inParent.elements[13] = pos.y; inParent.elements[14] = pos.z;
        }
        let constraint = new IK_ConstraintInstance(c, inParent, cdata.constraintBone);
        constraint.data = cdata;
        constraint.enable = cdata.enable;
        return constraint;
    }

    //约束的动态修改.
    private _updateConstraintSpace() {
        for (let [bone, constraint] of this._constraintsMap) {
            let inParent = constraint.inParent;  //直接修改
            let data = constraint.data;
            if (data.space && !data.space.destroyed) {
                let parentMatW: Matrix4x4;
                if (data.bone.parent) {
                    parentMatW = (data.bone.parent as Sprite3D).transform.worldMatrix;
                }
                let constraintMat = data.space.transform.worldMatrix;
                let invMat = new Matrix4x4();
                if (parentMatW) {
                    parentMatW.invert(invMat);
                    Matrix4x4.multiply(invMat, constraintMat, inParent);
                } else {
                    constraintMat.cloneTo(inParent);
                }
            } else {
                //没有space则与parent对齐，但是加上位置偏移
                // let pos = data.bone.transform.localPosition;
                // inParent.elements[12] = pos.x; inParent.elements[13]=pos.y; inParent.elements[14]=pos.z;
            }
        }
    }

    onSelectBone(b: Bone3D) {
        //换骨骼了，继续控制还是放弃控制。放弃控制需要不断按键。继续控制容易出现不想要的控制
        this._controlling = false;
        //this._controlBone({click:true});
    }
    private _controlling = false;
    private _lastCtrlMat = new Matrix4x4();
    private _lastCtlMatInv = new Matrix4x4();
    private _lastBoneMat = new Matrix4x4();
    private _controlBone(event: any) {
        if (!window.EditorEnv)
            return;
        let sp: Sprite3D = null;
        let cursel = EditorEnv.scene.selection?.[0];
        let ikcom: IK_Comp = null;
        if (cursel && (ikcom = cursel.getComponent(IK_Comp))) {
            sp = ikcom._ske3d.pickedParent;
        } else {
            if (cursel instanceof Sprite3D) {
                sp = cursel;
            }
        }

        //sp = this._ske3d.pickedParent;
        if (sp) {
            //按键事件
            if (event.click) {
                this._controlling = !this._controlling;
                if (this._controlling) {
                    //初始化
                    this._lastCtrlMat.invert(this._lastCtlMatInv);
                    sp.transform.worldMatrix.cloneTo(this._lastBoneMat);
                    let ele = this._lastBoneMat.elements;
                    ele[12] = 0; ele[13] = 0; ele[14] = 0;
                } else {
                }
                return;
            }

            let euler = event.euler;
            //this.sensorAcc = event.velocity
            this.sensorAcc = event.acceleration
            //sp.transform.rotationEuler = new Vector3(euler.x, -euler.y, euler.z);
            if (window.EditorEnv) {
                let camera = EditorEnv.d3Manager.sceneCamera;
                let mat = camera.transform.worldMatrix;
                let ctlMat = new Matrix4x4();
                let k = Math.PI / 180;
                Matrix4x4.createRotationYawPitchRoll(euler.z * k, euler.x * k, euler.y * k, ctlMat);

                Matrix4x4.multiply(mat, ctlMat, ctlMat);
                ctlMat.cloneTo(this._lastCtrlMat);

                if (this._controlling) {
                    //计算矩阵的差
                    let diffMat = new Matrix4x4();
                    Matrix4x4.multiply(ctlMat, this._lastCtlMatInv, diffMat);
                    let pos = sp.transform.position.clone();
                    sp.transform.position = new Vector3();
                    Matrix4x4.multiply(diffMat, this._lastBoneMat, diffMat);
                    sp.transform.worldMatrix = diffMat;
                    sp.transform.position = pos;

                    //sp.transform.rotationEuler = new Vector3(pitch,yaw,roll);//new Vector3(euler.x, euler.z, euler.y);
                    if (this.controlWithConstraint) {
                        let joint = (sp as any)._ik_joint as IK_Joint;
                        if (joint) {
                            if (joint.constraint) {
                                joint.copyTransform();
                                joint.constraint.doConsraint(joint);
                                joint.applyTransform(1.0);
                            }
                        }
                    }
                }
            }
        }
    }

    private _btn_lastMenu = 0;
    private _lastNoloPos = new Vector3();
    private _controlBoneNolo(event: any) { }
    private _controlBoneNolo1(event: any) {
        if (!window.EditorEnv)
            return;
        let sp: Sprite3D = null;
        let cursel = EditorEnv.scene.selection?.[0];
        let ikcom: IK_Comp = null;
        if (cursel && (ikcom = cursel.getComponent(IK_Comp))) {
            sp = ikcom._ske3d.pickedParent;
        }

        if (!sp) {
            if (cursel instanceof Sprite3D) {
                sp = cursel;
            }
        }

        //sp = this._ske3d.pickedParent;
        if (sp) {
            let lc = event.nolo.leftController;
            if (lc.battery.level > 0) {
                lc.position;
                lc.rotation;//xyzw
                lc.buttons//trigger,system,menu
            }
            let menuclick = false;
            //console.log('lc.buttons.menu ',lc.buttons.menu,lc.position.x, lc.position.y,lc.position.z)
            if (this._btn_lastMenu == 1 && lc.buttons.menu == 0) {
                menuclick = true;
            }
            this._btn_lastMenu = lc.buttons.menu;

            //按键事件
            if (menuclick) {
                this._controlling = !this._controlling;
                if (this._controlling) {
                    //初始化
                    this._lastCtrlMat.invert(this._lastCtlMatInv);
                    sp.transform.worldMatrix.cloneTo(this._lastBoneMat);
                    let ele = this._lastBoneMat.elements;
                    ele[12] = lc.position.x; ele[13] = lc.position.y; ele[14] = lc.position.z;
                } else {
                }
                return;
            }

            //sp.transform.rotationEuler = new Vector3(euler.x, -euler.y, euler.z);
            if (window.EditorEnv) {
                let camera = EditorEnv.d3Manager.sceneCamera;
                let mat = camera.transform.worldMatrix;
                let ctlMat = new Matrix4x4();
                //let k = Math.PI/180;
                let k = 30;
                ctlMat.elements[12] = lc.position.x * k;
                ctlMat.elements[13] = lc.position.y * k;
                ctlMat.elements[14] = lc.position.z * k;
                //Matrix4x4.createRotationYawPitchRoll(euler.z*k,euler.x*k,euler.y*k,ctlMat);
                //console.log('pos',lc.position.z)
                sp.transform.position = new Vector3(lc.position.x * k, lc.position.y * k, -lc.position.z * k);

                if (false) {
                    Matrix4x4.multiply(mat, ctlMat, ctlMat);
                    ctlMat.cloneTo(this._lastCtrlMat);

                    if (this._controlling) {
                        //计算矩阵的差
                        let diffMat = new Matrix4x4();
                        Matrix4x4.multiply(ctlMat, this._lastCtlMatInv, diffMat);
                        //let pos = sp.transform.position.clone();
                        sp.transform.position = new Vector3();
                        Matrix4x4.multiply(diffMat, this._lastBoneMat, diffMat);
                        sp.transform.worldMatrix = diffMat;
                        //sp.transform.position = pos;

                        //sp.transform.rotationEuler = new Vector3(pitch,yaw,roll);//new Vector3(euler.x, euler.z, euler.y);
                        if (this.controlWithConstraint) {
                            let joint = (sp as any)._ik_joint as IK_Joint;
                            if (joint) {
                                if (joint.constraint) {
                                    joint.copyTransform();
                                    joint.constraint.doConsraint(joint);
                                    joint.applyTransform(1.0);
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    visualizeSensor(liner: ILinerender) {
        let acc = this.sensorAcc;
        if (!acc) return;
        liner.addLine(new Vector3(), new Vector3(acc.x, acc.y, acc.z), Color.WHITE, Color.WHITE);
    }
    visualize(v: ILinerender) {
        this._ske3d.visualize(v);
        this._ik_sys.visualize(v);
        this.visualizeSensor(v);
    }
}
