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
    // 调试用：线条渲染器
    private debugLineRenderer: Laya.PixelLineRenderer;
    private debugLineIndex: number = 0; // 当前线条索引
    
    // IK 平滑插值相关
    private rightFootTargetPos: Laya.Vector3 = new Laya.Vector3(); // 右脚目标位置（平滑后）
    private leftFootTargetPos: Laya.Vector3 = new Laya.Vector3(); // 左脚目标位置（平滑后）
    private rightFootTargetDir: Laya.Vector3 = new Laya.Vector3(0, 1, 0); // 右脚目标方向
    private leftFootTargetDir: Laya.Vector3 = new Laya.Vector3(0, 1, 0); // 左脚目标方向
    private rightFootInitialized: boolean = false; // 右脚是否已初始化
    private leftFootInitialized: boolean = false; // 左脚是否已初始化
    
    // IK 参数
    @property({ type: Number, min: 0.01, max: 1, tip: "IK目标位置平滑速度，数值越大响应越快，但可能产生滑动感", caption: "平滑速度" })
    private ikSmoothSpeed: number = 0.3; // IK平滑速度
    
    @property({ type: Number, min: 0, max: 1, tip: "脚部高度偏移量，让脚更贴合地面，避免悬空", caption: "脚部高度偏移" })
    private footHeightOffset: number = 0.05; // 脚部高度偏移
    
    @property({ type: Number, min: 0, max: 2, tip: "最大脚部高度差限制，避免IK过度拉伸导致不自然", caption: "最大高度差" })
    private maxFootHeightDiff: number = 0.5; // 最大脚部高度差
    
    @property({ type: Number, min: 0.1, max: 2, tip: "射线检测距离，用于检测脚部下方的地面高度", caption: "检测距离" })
    private raycastDistance: number = 1.5; // 射线检测距离
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
        //ikcom.showGizmos=true
        this.scene3D = this.owner.scene as Laya.Scene3D;
        this.characterController = node.parent.getComponent(Laya.CharacterController);
        this.rightToeBase = rightToeBase;
        this.leftToeBase = leftToeBase;
        this.ikcom = ikcom;

        this.animator = node.getComponent(Laya.Animator);
        this.phyAni = node.parent.getComponent(Laya.Animator);

        // 初始化调试线条渲染器
        this.initDebugRenderer();
        
        // 初始化脚部目标位置
        if (this.rightToeBase) {
            this.rightFootTargetPos = this.rightToeBase.transform.position.clone();
            this.rightFootInitialized = true;
        }
        if (this.leftToeBase) {
            this.leftFootTargetPos = this.leftToeBase.transform.position.clone();
            this.leftFootInitialized = true;
        }
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
        this.debugLineRenderer.maxLineCount = 200; // 增加最大线条数量以支持粗线效果
        
        // 尝试设置材质颜色（如果支持的话）
        if ((this.debugLineRenderer as any)._render && (this.debugLineRenderer as any)._render.material) {
            const material = (this.debugLineRenderer as any)._render.material;
            if (material.albedoColor !== undefined) {
                material.albedoColor = new Laya.Vector4(0, 0, 1, 1); // 蓝色
            }
        }
        
        // 尝试设置线条宽度（如果支持的话）
        if ((this.debugLineRenderer as any).widthMultiplier !== undefined) {
            (this.debugLineRenderer as any).widthMultiplier = 0.05;
        }
    }
    private _leftBlendWeight: number = 1;
    private _rightBlendWeight: number = 1;
    @property({ type: Number, min: 0, max: 1, tip: "左脚IK混合权重，0为完全禁用IK，1为完全启用IK", caption: "左脚权重" })
    set leftBlendWeight(value: number) {
        this._leftBlendWeight = value;
        if (!this.leftChain) return;
        this.leftChain.blendWeight = value;
    }
    @property({ type: Number, min: 0, max: 1, tip: "右脚IK混合权重，0为完全禁用IK，1为完全启用IK", caption: "右脚权重" })
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

        // 重置调试线条索引（每帧重新开始）
        this.debugLineIndex = 0;
        
        // 清除之前的线条（如果方法存在）
        if (this.debugLineRenderer && (this.debugLineRenderer as any).clear) {
            (this.debugLineRenderer as any).clear();
        }

        this.updateFootIK(this.rightToeBase, this.rightChain, true);  // true = 右脚（红色系）
        this.updateFootIK(this.leftToeBase, this.leftChain, false);   // false = 左脚（蓝色系）
    }
    /**
     * 更新脚部 IK（射线检测地面，带平滑插值）
     * @param toeBase 脚趾根节点
     * @param chain IK 链
     * @param isRightFoot 是否为右脚（true=右脚，false=左脚）
     */
    private updateFootIK(toeBase: Laya.Sprite3D, chain: IK_Chain, isRightFoot: boolean): void {
        if (!toeBase || !this.scene3D || !chain || !this.ikcom) {
            return;
        }

        // 获取当前脚部位置和目标位置
        const currentTargetPos = isRightFoot ? this.rightFootTargetPos : this.leftFootTargetPos;
        const currentTargetDir = isRightFoot ? this.rightFootTargetDir : this.leftFootTargetDir;
        const isInitialized = isRightFoot ? this.rightFootInitialized : this.leftFootInitialized;

        // 从脚踝位置向下发射射线
        const footWorldPos = toeBase.transform.position.clone();

        // 从脚部上方发射射线，确保从角色外部发射
        const rayStartPos = footWorldPos.clone();
        rayStartPos.y += 0.3; // 从脚部上方0.3米发射

        // 射线方向：在世界空间中向下
        const rayDirection = new Laya.Vector3(0, -1, 0);
        const ray = new Laya.Ray(rayStartPos, rayDirection);
        const hitResult = new Laya.HitResult();

        // 执行射线检测，使用配置的距离
        const hit = this.scene3D.physicsSimulation.rayCast(ray, hitResult, this.raycastDistance);

        // 检查是否检测到碰撞
        if (hit && hitResult.succeeded) {
            const groundNormal = hitResult.normal.clone();
            let hitPoint = hitResult.point.clone();
            
            // 添加脚部高度偏移，让脚更贴合地面
            const offset = groundNormal.clone();
            Laya.Vector3.scale(offset, this.footHeightOffset, offset);
            Laya.Vector3.add(hitPoint, offset, hitPoint);
            
            // 限制脚部高度差，避免过度拉伸
            const currentFootY = toeBase.transform.position.y;
            const heightDiff = Math.abs(hitPoint.y - currentFootY);
            if (heightDiff > this.maxFootHeightDiff) {
                // 如果高度差太大，限制目标位置
                if (hitPoint.y > currentFootY) {
                    hitPoint.y = currentFootY + this.maxFootHeightDiff;
                } else {
                    hitPoint.y = currentFootY - this.maxFootHeightDiff;
                }
            }

            // 平滑插值目标位置
            if (!isInitialized) {
                // 首次初始化，直接设置
                hitPoint.cloneTo(currentTargetPos);
                groundNormal.cloneTo(currentTargetDir);
                if (isRightFoot) {
                    this.rightFootInitialized = true;
                } else {
                    this.leftFootInitialized = true;
                }
            } else {
                // 使用线性插值平滑过渡
                const deltaTime = Math.max(Laya.timer.delta / 1000, 1 / 1000);
                const smoothFactor = Math.min(1, this.ikSmoothSpeed * deltaTime * 60); // 基于60fps标准化
                
                // 手动实现线性插值（如果Vector3.lerp不存在）
                const diff = new Laya.Vector3();
                Laya.Vector3.subtract(hitPoint, currentTargetPos, diff);
                Laya.Vector3.scale(diff, smoothFactor, diff);
                Laya.Vector3.add(currentTargetPos, diff, currentTargetPos);
                
                // 方向也进行平滑插值
                const dirDiff = new Laya.Vector3();
                Laya.Vector3.subtract(groundNormal, currentTargetDir, dirDiff);
                Laya.Vector3.scale(dirDiff, smoothFactor, dirDiff);
                Laya.Vector3.add(currentTargetDir, dirDiff, currentTargetDir);
                currentTargetDir.normalize();
            }

            // 设置 IK 目标
            this.ikcom.setTarget(chain, new IK_Target(currentTargetPos, currentTargetDir));

            // 可视化：绘制碰撞点和 IK 方向
            this.drawIKDebugLines(currentTargetPos, currentTargetDir);
        } else {
            // 没有检测到地面，保持当前目标位置（不更新）
            // 这样可以避免脚部突然跳回
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

    /**
     * 绘制 IK 调试线条（显示 hitPoint 和 targetDirection）
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

        // 使用蓝色 - 直接使用 Laya.Color 常量
        const pointColor = Laya.Color.BLUE;      // 纯蓝色（碰撞点）
        const directionColor = Laya.Color.CYAN;   // 青色（IK 方向，更明显）

        // 1. 绘制碰撞点标记（用一个小十字，增大尺寸使其更明显）
        const markerSize = 0.1; // 标记大小（米），从0.05增加到0.1

        // 绘制粗线效果：通过绘制多条相邻的线来模拟粗线
        const lineThickness = 0.005; // 线条粗细偏移量（米）
        
        // X轴方向的线（绘制多条线使其变粗）
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                const offsetY = i * lineThickness;
                const offsetZ = j * lineThickness;
                const markerX1 = new Laya.Vector3(hitPoint.x - markerSize, hitPoint.y + offsetY, hitPoint.z + offsetZ);
                const markerX2 = new Laya.Vector3(hitPoint.x + markerSize, hitPoint.y + offsetY, hitPoint.z + offsetZ);
                if (this.debugLineIndex < this.debugLineRenderer.lineCount) {
                    this.debugLineRenderer.setLine(this.debugLineIndex, markerX1, markerX2, pointColor, pointColor);
                } else {
                    this.debugLineRenderer.addLine(markerX1, markerX2, pointColor, pointColor);
                }
                this.debugLineIndex++;
            }
        }

        // Z轴方向的线（绘制多条线使其变粗）
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                const offsetX = i * lineThickness;
                const offsetY = j * lineThickness;
                const markerZ1 = new Laya.Vector3(hitPoint.x + offsetX, hitPoint.y + offsetY, hitPoint.z - markerSize);
                const markerZ2 = new Laya.Vector3(hitPoint.x + offsetX, hitPoint.y + offsetY, hitPoint.z + markerSize);
                if (this.debugLineIndex < this.debugLineRenderer.lineCount) {
                    this.debugLineRenderer.setLine(this.debugLineIndex, markerZ1, markerZ2, pointColor, pointColor);
                } else {
                    this.debugLineRenderer.addLine(markerZ1, markerZ2, pointColor, pointColor);
                }
                this.debugLineIndex++;
            }
        }

        // 2. 绘制 IK Target 方向：从碰撞点开始，沿着方向绘制一条粗线
        const directionLength = 0.3; // 方向显示长度（米）
        const directionEnd = new Laya.Vector3();
        directionEnd.x = hitPoint.x + targetDirection.x * directionLength;
        directionEnd.y = hitPoint.y + targetDirection.y * directionLength;
        directionEnd.z = hitPoint.z + targetDirection.z * directionLength;

        // 计算垂直于方向的向量用于绘制粗线
        const perp1 = new Laya.Vector3();
        const perp2 = new Laya.Vector3();
        if (Math.abs(targetDirection.y) < 0.9) {
            // 如果方向不是垂直的，使用叉积计算垂直向量
            const up = new Laya.Vector3(0, 1, 0);
            Laya.Vector3.cross(targetDirection, up, perp1);
            perp1.normalize();
            Laya.Vector3.cross(perp1, targetDirection, perp2);
            perp2.normalize();
        } else {
            // 如果方向接近垂直，使用X和Z轴
            perp1.set(1, 0, 0);
            perp2.set(0, 0, 1);
        }
        const perp1Scaled = new Laya.Vector3();
        const perp2Scaled = new Laya.Vector3();
        Laya.Vector3.scale(perp1, lineThickness, perp1Scaled);
        Laya.Vector3.scale(perp2, lineThickness, perp2Scaled);

        // 绘制多条线使其变粗
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                const offset1 = new Laya.Vector3();
                Laya.Vector3.scale(perp1Scaled, i, offset1);
                const offset2 = new Laya.Vector3();
                Laya.Vector3.scale(perp2Scaled, j, offset2);
                
                const temp = new Laya.Vector3();
                const start = new Laya.Vector3();
                Laya.Vector3.add(hitPoint, offset1, temp);
                Laya.Vector3.add(temp, offset2, start);
                
                const end = new Laya.Vector3();
                Laya.Vector3.add(directionEnd, offset1, temp);
                Laya.Vector3.add(temp, offset2, end);

                if (this.debugLineIndex < this.debugLineRenderer.lineCount) {
                    this.debugLineRenderer.setLine(this.debugLineIndex, start, end, directionColor, directionColor);
                } else {
                    this.debugLineRenderer.addLine(start, end, directionColor, directionColor);
                }
                this.debugLineIndex++;
            }
        }
    }

    //每帧更新时执行，在update之后执行，尽量不要在这里写大循环逻辑或者使用getComponent方法
    //onLateUpdate(): void {}

    //鼠标点击后执行。与交互相关的还有onMouseDown等十多个函数，具体请参阅文档。
    //onMouseClick(): void {}
}