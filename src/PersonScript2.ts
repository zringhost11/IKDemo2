const { regClass, property } = Laya;

// import { IK_Chain } from "./IK/IK_Chain";
// import { IK_Comp } from "./IK/IK_Comp";
// import { IK_Target } from "./IK/IK_Target";

const {IK_Comp,IK_Target} = Laya;
type IK_Chain = Laya.IK_Chain;
type IK_Comp = Laya.IK_Comp;

@regClass()
export class PersonScript2 extends Laya.Script {
    declare owner: Laya.Sprite3D;
    //declare owner : Laya.Sprite;
    private lastDirection: number = 1; // 0: 无方向, -1: 左, 1: 右
    private rightToeBase: Laya.Sprite3D;
    private leftToeBase: Laya.Sprite3D;
    private ikcom: IK_Comp;
    private animator: Laya.Animator;
    private phyAni: Laya.Animator;
    private leftChain: IK_Chain;
    private rightChain: IK_Chain;
    private readonly doubleTapThresholdMs: number = 300;
    private keyLastDownTime: Record<string, number> = {};
    private keyDownState: Record<string, boolean> = {};
    private keyIsRunning: Record<string, boolean> = {};
    private isRunMode: boolean = false;
    private lastRunTriggerTime: number = 0;
    private readonly runPersistMs: number = 200;
    private characterController: Laya.CharacterController;
    private scene3D: Laya.Scene3D;
    //组件被激活后执行，此时所有节点和组件均已创建完毕，此方法只执行一次
    //onAwake(): void {}

    //组件被启用后执行，例如节点被添加到舞台后
    //onEnable(): void {}

    //组件被禁用时执行，例如从节点从舞台移除后
    //onDisable(): void {}

    //第一次执行update之前执行，只会执行一次
    onStart(): void {
        const node = this.owner;
        // const rightToeBase = node.findChild("mixamorig:RightFoot") as Laya.Sprite3D;
        // const leftToeBase = node.findChild("mixamorig:LeftFoot") as Laya.Sprite3D;
        const rightToeBase = node.findChild("RightFoot") as Laya.Sprite3D;
        const leftToeBase = node.findChild("LeftFoot") as Laya.Sprite3D;
        const ikcom = node.getComponent(IK_Comp);
        this.scene3D = this.owner.scene as Laya.Scene3D;
        this.characterController = node.parent.getComponent(Laya.CharacterController);
        this.rightToeBase = rightToeBase;
        this.leftToeBase = leftToeBase;
        this.ikcom = ikcom;

        this.animator = node.getComponent(Laya.Animator);
        this.phyAni = node.parent.getComponent(Laya.Animator);

    }
    private _leftBlendWeight: number = 1;
    private _rightBlendWeight: number = 1;
    @property({ type: Number, min: 0, max: 1 })
    set leftBlendWeight(value: number) {
        this._leftBlendWeight = value;
        if (!this.leftChain) return;
        this.leftChain.blendWeight = value;
    }
    @property({ type: Number, min: 0, max: 1 })
    set rightBlendWeight(value: number) {
        this._rightBlendWeight = value;
        if (!this.rightChain) return;
        this.rightChain.blendWeight = value;
    }
    get leftBlendWeight(): number {
        if (!this.leftChain) return this._leftBlendWeight;
        return this.leftChain.blendWeight;
    }
    get rightBlendWeight(): number {
        if (!this.rightChain) return this._rightBlendWeight;
        return this.rightChain.blendWeight;
    }

    //手动调用节点销毁时执行
    //onDestroy(): void {}

    //每帧更新时执行，尽量不要在这里写大循环逻辑或者使用getComponent方法
    onUpdate(): void {
        if (!this.leftChain) {
            this.leftChain = this.ikcom.getChain("left");
        }
        if (!this.rightChain) {
            this.rightChain = this.ikcom.getChain("right");
        }
        let playName = "idle";
        let currentDirection = 0;
        const deltaTime = Math.max(Laya.timer.delta / 1000, 1 / 1000);

        const now = Laya.timer.currTimer;
        const isKeyADown = Laya.InputManager.hasKeyDown("a");
        const isKeyDDown = Laya.InputManager.hasKeyDown("d");

        this.updateRunStateForKey("a", isKeyADown, now);
        this.updateRunStateForKey("d", isKeyDDown, now);

        if (isKeyADown) {
            currentDirection = -1; // 左
        } else if (isKeyDDown) {
            currentDirection = 1; // 右
        }

        const hasMovementInput = isKeyADown || isKeyDDown;
        if (!hasMovementInput && this.isRunMode && now - this.lastRunTriggerTime > this.runPersistMs) {
            this.isRunMode = false;
        } else if (hasMovementInput && this.isRunMode) {
            this.lastRunTriggerTime = now;
        }

        let isRunning = false;
        if (currentDirection !== 0) {
            const activeKey = currentDirection === -1 ? "a" : "d";
            if (this.keyIsRunning[activeKey]) {
                this.isRunMode = true;
                this.lastRunTriggerTime = now;
            }
            isRunning = this.isRunMode;
            playName = isRunning ? "run" : "walk";
        }

        // 只在方向改变时旋转
        if (currentDirection !== this.lastDirection && currentDirection !== 0) {

            if (currentDirection === -1) {
                this.owner.transform.localRotationEuler = new Laya.Vector3(0, -180, 0);
            } else if (currentDirection === 1) {
                this.owner.transform.localRotationEuler = new Laya.Vector3(0, 0, 0);
            }
            this.lastDirection = currentDirection;
        }


        if (this.animator.getControllerLayer(0).getCurrentPlayState().animatorState.name !== playName) {
            this.animator.play(playName);
            this.phyAni.play(playName);
        }
        if ("idle" === playName) {
            this.characterController.move(new Laya.Vector3(0, 0, 0));
        } else if ("run" === playName) {
            this.characterController.move(new Laya.Vector3(0, 0, 0.06 * currentDirection));
        } else if ("walk" === playName) {
            this.characterController.move(new Laya.Vector3(0, 0, 0.02 * currentDirection));
        }
        this.updateFootIK(this.rightToeBase, this.rightChain, true);  // true = 右脚（红色系）
        this.updateFootIK(this.leftToeBase, this.leftChain, false);   // false = 左脚（蓝色系）
    }
    /**
  * 更新脚部 IK（射线检测地面）
  * @param toeBase 脚趾根节点
  * @param chain IK 链
  * @param isRightFoot 是否为右脚（true=右脚红色系，false=左脚蓝色系）
  */
    private updateFootIK(toeBase: Laya.Sprite3D, chain: IK_Chain, isRightFoot: boolean): void {
        if (!toeBase || !this.scene3D || !chain || !this.ikcom) {
            return;
        }

        // 从脚踝位置向下发射射线
        // 注意：transform.position 已经是世界坐标
        const footWorldPos = toeBase.transform.position.clone();

        // 从更高的位置发射，确保从角色外部发射
        // 我们从脚部上方 1.0 米发射
        const rayStartPos = footWorldPos.clone();
        rayStartPos.y += 0.5; // 增加偏移量，确保从角色外部发射

        // 射线方向：在世界空间中向下
        const rayDirection = new Laya.Vector3(0, -1, 0);
        const ray = new Laya.Ray(rayStartPos, rayDirection);
        const hitResult = new Laya.HitResult();

        // 执行射线检测
        // 增加检测距离，先不设置碰撞组，看看能否检测到任何东西
        const raycastDistance = 5.0; // 增加检测距离到 5 米


        // 先尝试不使用碰撞组过滤，看看能否检测到任何碰撞
        const hit = this.scene3D.physicsSimulation.rayCast(ray, hitResult, raycastDistance);

        // 检查是否检测到碰撞
        if (hit && hitResult.succeeded) {
            // 检测到了非角色自己的碰撞，继续处理
            const groundNormal = hitResult.normal; // 法线是一个单位向量，指向地面垂直向上的方向
            const hitPoint = hitResult.point; // 碰撞点位置

            // IK Target 方向：直接使用地面法线（垂直于地面）
            const targetDirection = groundNormal.clone();

            this.ikcom.setTarget(chain, new IK_Target(hitPoint, targetDirection));

            // 可视化：绘制碰撞点和 IK 方向
            //this.drawIKDebugLines(hitPoint, targetDirection);
        } else {

        }
    }
    private updateRunStateForKey(key: string, isDown: boolean, now: number): void {
        const wasDown = !!this.keyDownState[key];

        if (isDown && !wasDown) {
            const lastTime = this.keyLastDownTime[key] ?? Number.NEGATIVE_INFINITY;
            if (now - lastTime <= this.doubleTapThresholdMs) {
                this.keyIsRunning[key] = true;
                this.isRunMode = true;
                this.lastRunTriggerTime = now;
            }
            this.keyLastDownTime[key] = now;
        } else if (!isDown && wasDown) {
            this.keyIsRunning[key] = false;
        }

        if (!isDown) {
            this.keyLastDownTime[key] = this.keyLastDownTime[key] ?? Number.NEGATIVE_INFINITY;
        }

        this.keyDownState[key] = isDown;
    }
    //每帧更新时执行，在update之后执行，尽量不要在这里写大循环逻辑或者使用getComponent方法
    //onLateUpdate(): void {}

    //鼠标点击后执行。与交互相关的还有onMouseDown等十多个函数，具体请参阅文档。
    //onMouseClick(): void {}
}