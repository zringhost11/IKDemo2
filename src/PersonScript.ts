// import { IK_Chain } from "./IK/IK_Chain";
// import { IK_Comp } from "./IK/IK_Comp";

const {IK_Comp} = Laya;
type IK_Chain = Laya.IK_Chain;
type IK_Comp = Laya.IK_Comp;

const { regClass, property } = Laya;

@regClass()
export class PersonScript extends Laya.Script {
    declare owner: Laya.Sprite3D;
    //declare owner : Laya.Sprite;
    private animator: Laya.Animator;
    private lastDirection: number = 1; // 0: 无方向, -1: 左, 1: 右
    private rightToeBase: Laya.Sprite3D;
    private leftToeBase: Laya.Sprite3D;
    private ikcom: IK_Comp;
    private scene3D: Laya.Scene3D;
    private pivotToFootOffset: number = 0;
    private pivotOffsetInitialized: boolean = false;

    // 调试用：法线可视化
    private debugLineRenderer: Laya.PixelLineRenderer;
    private debugCounter: number = 0; // 用于控制打印频率
    private debugLineIndex: number = 0; // 当前线条索引
    private leftChain: IK_Chain;
    private rightChain: IK_Chain;

    // 脚部的初始旋转（用于补偿初始角度）
    private rightFootInitialRotation: Laya.Quaternion;
    private leftFootInitialRotation: Laya.Quaternion;

    // 基础移动参数
    private moveSpeed: number = 1; // 米/秒
    private runSpeedMultiplier: number = 3; // 奔跑时的速度倍率
    private gravity: number = -30; // 米/秒^2
    private verticalVelocity: number = 0;
    private isGrounded: boolean = false;
    private groundCheckHeight: number = 1.0;
    private groundCheckDistance: number = 3.0;
    private _stepUpSpeed: number = 2; // 上台阶平滑速度（米/秒）
    private _stepDownSpeed: number = 2; // 下台阶平滑速度（米/秒）
    private readonly doubleTapThresholdMs: number = 300; // 双击阈值（毫秒）
    private keyLastDownTime: Record<string, number> = {};
    private keyDownState: Record<string, boolean> = {};
    private keyIsRunning: Record<string, boolean> = {};
    private isRunMode: boolean = false;
    private lastRunTriggerTime: number = 0;
    private readonly runPersistMs: number = 200;
    //@property({ type: Number, min: 0.1, max: 10, step: 0.1 })
    set stepUpSpeed(value: number) {
        this._stepUpSpeed = value;
    }
    get stepUpSpeed(): number {
        return this._stepUpSpeed;
    }
    //@property({ type: Number, min: 0.1, max: 10, step: 0.1 })
    set stepDownSpeed(value: number) {
        this._stepDownSpeed = value;
    }
    get stepDownSpeed(): number {
        return this._stepDownSpeed;
    }
    //@property({ type: Number, min: -0.2, max: 0.2, step: 0.005, description: "角色脚底相对于地面的额外高度调整" })
    public groundOffsetAdjustment: number = 0.1;
    private moveAni: Laya.Animator;

    //组件被激活后执行，此时所有节点和组件均已创建完毕，此方法只执行一次
    //onAwake(): void {}

    //组件被启用后执行，例如节点被添加到舞台后
    //onEnable(): void {}

    //组件被禁用时执行，例如从节点从舞台移除后
    //onDisable(): void {}

    //第一次执行update之前执行，只会执行一次
    onStart(): void {
        const node = this.owner;
        const rightToeBase = node.findChild("mixamorig:RightFoot");
        //const leftToeBase = node.findChild("mixamorig:LeftFoot");
        const leftToeBase = node.findChild("LeftFoot");
        const ikcom = node.getComponent(IK_Comp);
        this.rightToeBase = rightToeBase;
        this.leftToeBase = leftToeBase;
        this.ikcom = ikcom;

        this.animator = node.getComponent(Laya.Animator);
        this.moveAni = this.owner.parent.getComponent(Laya.Animator);
        this.scene3D = this.owner.scene as Laya.Scene3D;

        // 保存脚部的初始旋转（用于补偿初始角度）
        if (this.rightToeBase) {
            this.rightFootInitialRotation = this.rightToeBase.transform.rotation.clone();
        }
        if (this.leftToeBase) {
            this.leftFootInitialRotation = this.leftToeBase.transform.rotation.clone();
        }

        this.computePivotToFootOffset();

        // 初始化调试线条渲染器（用于可视化法线）
        //this.initDebugRenderer();
    }

    /**
     * 初始化调试渲染器
     */
    private initDebugRenderer(): void {
        // 创建一个用于绘制调试线条的节点
        const debugNode = new Laya.Sprite3D();
        debugNode.name = "DebugLineRenderer";
        this.scene3D.addChild(debugNode);

        // 添加 PixelLineRenderer 组件
        this.debugLineRenderer = debugNode.addComponent(Laya.PixelLineRenderer);
        this.debugLineRenderer.maxLineCount = 100; // 设置最大线条数量
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
    onLateUpdate(): void {

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
            const p1 = this.owner.parent as Laya.Sprite3D;
            const p2 = p1.parent as Laya.Sprite3D;
            const srcZ = p1.transform.localPosition.z;
            p1.transform.localPosition.z = 0;
            p2.transform.localPosition.z += srcZ * this.lastDirection;
            p1.transform.localPosition = p1.transform.localPosition;
            p2.transform.localPosition = p2.transform.localPosition;
            this.moveAni.play(playName);

            if (currentDirection === -1) {
                p2.transform.localRotationEuler = new Laya.Vector3(0, -180, 0);
            } else if (currentDirection === 1) {
                p2.transform.localRotationEuler = new Laya.Vector3(0, 0, 0);
            }
            this.lastDirection = currentDirection;
        }

        this.updateGrounding(deltaTime);

        if (!this.pivotOffsetInitialized && this.isGrounded) {
            this.computePivotToFootOffset();
        }

        if (this.animator.getControllerLayer(0).getCurrentPlayState().animatorState.name !== playName) {
            this.animator.play(playName);
            this.moveAni.play(playName);
        }

        // 重置调试线条索引（每帧重新开始）
        this.debugLineIndex = 0;

        // 为左右脚执行射线检测（使用不同颜色区分）
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

            this.ikcom.setTarget(chain, new Laya.IK_Target(hitPoint, targetDirection));

            // 可视化：绘制碰撞点和 IK 方向
            this.drawIKDebugLines(hitPoint, targetDirection);
        } else {

        }
    }

    /**
     * 沿角色前进方向移动
     * @param deltaTime 帧间隔秒
     */
    private moveForward(deltaTime: number, speedMultiplier: number = 1): void {
        const displacement = new Laya.Vector3(0, 0, this.moveSpeed * speedMultiplier * deltaTime);
        this.owner.transform.translate(displacement, true);
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

    private computePivotToFootOffset(): void {
        if (!this.rightToeBase && !this.leftToeBase) {
            return;
        }
        const pivotHeight = this.owner.transform.position.y;
        const rightFootHeight = this.rightToeBase ? this.rightToeBase.transform.position.y : Number.POSITIVE_INFINITY;
        const leftFootHeight = this.leftToeBase ? this.leftToeBase.transform.position.y : Number.POSITIVE_INFINITY;
        const minFootHeight = Math.min(rightFootHeight, leftFootHeight);
        if (!isFinite(minFootHeight)) {
            return;
        }
        const rawOffset = pivotHeight - minFootHeight;
        this.pivotToFootOffset = rawOffset;
        this.pivotOffsetInitialized = true;
    }

    private getPivotOffset(): number {
        if (!this.pivotOffsetInitialized) {
            this.computePivotToFootOffset();
        }
        return this.pivotOffsetInitialized ? this.pivotToFootOffset : 0;
    }

    private getPivotOffsetWithAdjustment(): number {
        const baseOffset = this.getPivotOffset();
        const groundedMultiplier = this.isGrounded ? 1 : 0.5;
        return baseOffset + this.groundOffsetAdjustment * groundedMultiplier;
    }

    /**
     * 将角色与地面对齐并处理重力
     * @param deltaTime 帧间隔秒
     */
    private updateGrounding(deltaTime: number): void {
        if (!this.scene3D) {
            return;
        }

        const transform = this.owner.transform;
        const currentPosition = transform.position.clone();

        const rayStartPos = currentPosition.clone();
        rayStartPos.y += this.groundCheckHeight;

        const ray = new Laya.Ray(rayStartPos, new Laya.Vector3(0, -1, 0));
        const hitResult = new Laya.HitResult();
        const rayDistance = this.groundCheckHeight + this.groundCheckDistance;
        const hit = this.scene3D.physicsSimulation.rayCast(ray, hitResult, rayDistance);

        if (hit && hitResult.succeeded) {
            const groundY = hitResult.point.y;
            const currentY = transform.position.y;
            if (!this.isGrounded && this.verticalVelocity < 0) {
                this.verticalVelocity = 0;
            }
            this.isGrounded = true;
            const pivotOffset = this.getPivotOffsetWithAdjustment();
            let targetY = groundY + pivotOffset;
            if (groundY > currentY) {
                const riseDistance = this.stepUpSpeed * deltaTime;
                targetY = Math.min(currentY + riseDistance, groundY + pivotOffset);
            } else if (groundY < currentY) {
                const dropDistance = this._stepDownSpeed * deltaTime;
                const maxDrop = currentY - dropDistance;
                // 只有在台阶高度差在可控范围内时才平滑下降
                if (currentY - groundY <= this.groundCheckHeight + this.groundCheckDistance) {
                    targetY = Math.max(maxDrop, groundY + pivotOffset);
                    this.verticalVelocity = 0;
                }
            }
            const newPosition = transform.position.clone();
            newPosition.y = targetY;
            transform.position = newPosition;
        } else {
            this.isGrounded = false;
            this.verticalVelocity += this.gravity * deltaTime;
            const fallDistance = this.verticalVelocity * deltaTime;
            if (fallDistance !== 0) {
                transform.translate(new Laya.Vector3(0, fallDistance, 0), false);
            }
        }
    }

    /**
     * 绘制 IK 调试线条（只显示 hitPoint 和 targetDirection）
     * @param hitPoint 碰撞点
     * @param targetDirection IK Target 方向
     */
    private drawIKDebugLines(
        hitPoint: Laya.Vector3,
        targetDirection: Laya.Vector3
    ): void {
        if (!this.debugLineRenderer) {
            return;
        }

        // 统一颜色
        const pointColor = new Laya.Color(1, 0, 0, 1);      // 红色（碰撞点）
        const directionColor = new Laya.Color(1, 1, 0, 1);   // 黄色（IK 方向）

        // 1. 绘制碰撞点标记（用一个小十字）
        const markerSize = 0.05; // 标记大小（米）

        // X轴方向的线
        const markerX1 = new Laya.Vector3(hitPoint.x - markerSize, hitPoint.y, hitPoint.z);
        const markerX2 = new Laya.Vector3(hitPoint.x + markerSize, hitPoint.y, hitPoint.z);
        if (this.debugLineIndex < this.debugLineRenderer.lineCount) {
            this.debugLineRenderer.setLine(this.debugLineIndex, markerX1, markerX2, pointColor, pointColor);
        } else {
            this.debugLineRenderer.addLine(markerX1, markerX2, pointColor, pointColor);
        }
        this.debugLineIndex++;

        // Z轴方向的线
        const markerZ1 = new Laya.Vector3(hitPoint.x, hitPoint.y, hitPoint.z - markerSize);
        const markerZ2 = new Laya.Vector3(hitPoint.x, hitPoint.y, hitPoint.z + markerSize);
        if (this.debugLineIndex < this.debugLineRenderer.lineCount) {
            this.debugLineRenderer.setLine(this.debugLineIndex, markerZ1, markerZ2, pointColor, pointColor);
        } else {
            this.debugLineRenderer.addLine(markerZ1, markerZ2, pointColor, pointColor);
        }
        this.debugLineIndex++;

        // 2. 绘制 IK Target 方向：从碰撞点开始，沿着方向绘制一条线
        const directionLength = 0.3; // 方向显示长度（米）
        const directionEnd = new Laya.Vector3();
        directionEnd.x = hitPoint.x + targetDirection.x * directionLength;
        directionEnd.y = hitPoint.y + targetDirection.y * directionLength;
        directionEnd.z = hitPoint.z + targetDirection.z * directionLength;

        if (this.debugLineIndex < this.debugLineRenderer.lineCount) {
            this.debugLineRenderer.setLine(this.debugLineIndex, hitPoint, directionEnd, directionColor, directionColor);
        } else {
            this.debugLineRenderer.addLine(hitPoint, directionEnd, directionColor, directionColor);
        }
        this.debugLineIndex++;
    }

    //每帧更新时执行，在update之后执行，尽量不要在这里写大循环逻辑或者使用getComponent方法
    //onLateUpdate(): void {}

    //鼠标点击后执行。与交互相关的还有onMouseDown等十多个函数，具体请参阅文档。
    //onMouseClick(): void {}
}