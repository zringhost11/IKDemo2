// import { IK_Chain } from "./IK/IK_Chain";
// import { IK_Comp } from "./IK/IK_Comp";

const { IK_Comp } = Laya;
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
    private forwardCheckDistance: number = 0.5; // 前方检测距离（米）
    private stepHeightThreshold: number = 0.1; // 台阶高度阈值（米），超过此值才认为是台阶
    private nextStepY: number = 0; // 下一步楼梯的Y坐标
    private nextStepY2: number = undefined; // 下一步楼梯的Y坐标2
    private _stepUpSpeed: number = 1; // 上台阶平滑速度（米/秒）
    private _stepDownSpeed: number = 1; // 下台阶平滑速度（米/秒）
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
    public groundOffsetAdjustment: number = 0.0;
    private moveAni: Laya.Animator;

    // 动画速度相关
    private animationSpeed: number = 1.0; // 当前动画速度
    private readonly speedChangeStep: number = 0.1; // 每次调整的速度步长
    private readonly minSpeed: number = 0.1; // 最小速度
    private readonly maxSpeed: number = 3.0; // 最大速度
    private speedDisplayLabel: Laya.Label; // 速度显示标签
    private lastSpeedUpdateTime: number = 0; // 上次速度更新时间
    private readonly speedUpdateInterval: number = 10; // 速度更新间隔（毫秒）
    private nextStepPosDebug: Laya.Sprite3D;
    private camera: Laya.Camera;
    private cameraFollowSpeedFast: number = 5; // 摄像机快速跟随速度（米/秒）- 用于初始定位
    private cameraFollowSpeedSlow: number = 1; // 摄像机慢速跟随速度（米/秒）- 用于平滑跟随
    private cameraFollowDistanceThreshold: number = 3; // 距离阈值（米），超过此距离使用快速，否则使用慢速
    private cameraHorizontalLerpSpeed: number = 3; // 摄像机水平方向插值速度（每秒插值系数）- 降低使跟随更平滑
    private cameraVerticalLerpSpeed: number = 0.3; // 摄像机垂直方向插值速度（每秒插值系数）- 非常慢以避免跳跃感
    private cameraOffset: Laya.Vector3 = new Laya.Vector3(-5, 2, 0); // 摄像机相对于人物的偏移量（X, Y, Z）- 侧面视角（左侧）
    private cameraTargetY: number = 0; // 摄像机目标Y坐标（平滑过渡用）
    private cameraTargetYInitialized: boolean = false; // 摄像机目标Y是否已初始化

    //组件被激活后执行，此时所有节点和组件均已创建完毕，此方法只执行一次
    //onAwake(): void {}

    //组件被启用后执行，例如节点被添加到舞台后
    //onEnable(): void {}

    //组件被禁用时执行，例如从节点从舞台移除后
    //onDisable(): void {}

    //第一次执行update之前执行，只会执行一次
    onStart(): void {
        const node = this.owner;
        this.camera = node.scene.getChild("Main Camera") as Laya.Camera;
        const rightToeBase = node.findChild("mixamorig:RightFoot");
        //const leftToeBase = node.findChild("mixamorig:LeftFoot");
        const leftToeBase = node.findChild("LeftFoot");
        const ikcom = node.getComponent(IK_Comp);
        this.rightToeBase = rightToeBase;
        this.leftToeBase = leftToeBase;
        this.ikcom = ikcom;
        (this.owner as any).checkFloor = this.checkFloor.bind(this);

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
        this.initDebugRenderer();

        // 初始化速度显示UI
        this.initSpeedDisplay();
    }
    standType: "left" | "right";

    stand(type: string) {
        const stepDirection = this.detectStepDirection(this.lastDirection);
        if ("left" === type) {
            this.standType = "left";
            if (0 === stepDirection) {
                this.rightBlendWeight = 0;
            } else {
                this.rightBlendWeight = 1;
            }
        } else if ("right" === type) {
            this.standType = "right";
            if (0 === stepDirection) {
                this.leftBlendWeight = 0;
            } else {
                this.leftBlendWeight = 1;
            }
        }
        //强制人物的y坐标移动到当前地面位置
        this.updateGrounding(0);
    }
    blend(type: string) {
        if ("left" === type) {
            this.leftBlendWeight = 1;
        } else if ("right" === type) {
            this.rightBlendWeight = 1;
        }
    }
    runBlend(type: string) {
        if ("left" === type) {
            this.leftBlendWeight = 1;
        } else if ("right" === type) {
            this.rightBlendWeight = 1;
        }

    }
    runUnBlend(type: string) {
        if ("left" === type) {
            this.leftBlendWeight = 0;
        } else if ("right" === type) {
            this.rightBlendWeight = 0;
        }
    }

    checkFloor(num: string): number {
        const stepDirection = this.detectStepDirection(this.lastDirection);
        if (1 === stepDirection) {
            if ("0" === num) {
                this.nextStepY2 = this.nextStepY;
                return 0;
            } else if ("left" === num) {
                //取左脚的y坐标
                if (this.leftToeBase) {
                    // 检测两个脚的地面坐标是否一致
                    this.checkAndUpdateNextStepY("left");
                }
                this.rightBlendWeight = 0;
            } else if ("right" === num) {
                //取右脚的y坐标
                if (this.rightToeBase) {
                    // 检测两个脚的地面坐标是否一致
                    this.checkAndUpdateNextStepY("right");
                }
                this.leftBlendWeight = 0;
            }
        } else {
            if ("left" === num) {
                this.rightBlendWeight = 0;
            } else if ("right" === num) {
                this.leftBlendWeight = 0;
            }
        }

        return 0; // 默认返回值
    }



    /**
     * 实时检测两只脚中最低那只脚下方的地面位置，用于下楼时的平滑跟随
     * @returns 返回最低脚下方的地面Y坐标，如果无法检测则返回null
     */
    private getLowestFootGroundY(): number | null {
        if (!this.scene3D) {
            return null;
        }

        let leftFootGroundY: number | null = null;
        let rightFootGroundY: number | null = null;

        // 检测左脚下方的地面
        if (this.leftToeBase) {
            const leftFootPos = this.leftToeBase.transform.position.clone();
            leftFootGroundY = this.getGroundHeightAt(leftFootPos);
        }

        // 检测右脚下方的地面
        if (this.rightToeBase) {
            const rightFootPos = this.rightToeBase.transform.position.clone();
            rightFootGroundY = this.getGroundHeightAt(rightFootPos);
        }

        // 返回两只脚中地面高度最低的那个
        if (leftFootGroundY !== null && rightFootGroundY !== null) {
            return Math.min(leftFootGroundY, rightFootGroundY);
        } else if (leftFootGroundY !== null) {
            return leftFootGroundY;
        } else if (rightFootGroundY !== null) {
            return rightFootGroundY;
        }

        return null;
    }

    /**
     * 检测指定脚到地面的距离，如果低于当前人物到地面的距离，就认为是下楼
     * @param footType 要检测的脚的类型："left" 或 "right"
     */
    private checkFootGroundForDownstairs(footType: "left" | "right"): void {
        if (!this.scene3D) {
            return;
        }

        // 获取当前人物的地面位置
        const ownerWorldPos = this.owner.transform.position.clone();
        const currentPersonGroundY = this.getGroundHeightAt(ownerWorldPos);

        if (currentPersonGroundY === null) {
            return; // 无法检测当前人物的地面位置
        }

        // 获取指定脚的地面位置
        let footGroundY: number | null = null;
        let footPos: Laya.Vector3 | null = null;

        if (footType === "left" && this.leftToeBase) {
            footPos = this.leftToeBase.transform.position.clone();
            footGroundY = this.getGroundHeightAt(footPos);
        } else if (footType === "right" && this.rightToeBase) {
            footPos = this.rightToeBase.transform.position.clone();
            footGroundY = this.getGroundHeightAt(footPos);
        }

        if (footGroundY === null) {
            return; // 无法检测脚的地面位置
        }

        // 检查脚的地面位置是否低于当前人物的地面位置
        const heightThreshold = 0.05; // 高度差阈值（米），避免微小误差
        const heightDiff = currentPersonGroundY - footGroundY;

        if (heightDiff > heightThreshold) {
            // 脚的地面位置低于当前人物地面位置，认为是下楼
            console.log(`下楼 - ${footType === "left" ? "左脚" : "右脚"}地面位置(${footGroundY.toFixed(3)})低于当前人物地面位置(${currentPersonGroundY.toFixed(3)})`);
            console.log("下楼");
            this.nextStepY2 = footGroundY;

            // 设置调试标记位置到下楼的那个脚的地面位置
            if (this.nextStepPosDebug && footPos) {
                // 计算期望的角色中心高度（脚的地面高度 + 偏移量）
                const pivotOffset = this.getPivotOffsetWithAdjustment();
                const targetPersonY = footGroundY + pivotOffset;

                this.nextStepPosDebug.transform.position = new Laya.Vector3(
                    footPos.x,
                    targetPersonY, // 使用计算出的角色中心高度
                    footPos.z
                );
                console.log(`设置调试标记到${footType === "left" ? "左脚" : "右脚"}地面位置: (${footPos.x.toFixed(3)}, ${targetPersonY.toFixed(3)}, ${footPos.z.toFixed(3)})`);
            }
        }
    }

    /**
     * 检测当前人物的Y坐标和当前脚的地面坐标是否一致，如果不一致则设置nextStepY为当前脚的地面坐标
     * @param footType 脚的类型："left" 或 "right"
     */
    private checkAndUpdateNextStepY(footType: "left" | "right"): void {
        if (!this.scene3D) {
            return;
        }

        // 获取当前人物的Y坐标（角色中心高度）
        const ownerWorldPos = this.owner.transform.position.clone();
        const currentPersonY = ownerWorldPos.y;

        // 获取当前脚的地面坐标
        let currentFootGroundY: number | null = null;
        let footPos: Laya.Vector3 | null = null;

        if (footType === "left" && this.leftToeBase) {
            footPos = this.leftToeBase.transform.position.clone();
            currentFootGroundY = this.getGroundHeightAt(footPos);
        } else if (footType === "right" && this.rightToeBase) {
            footPos = this.rightToeBase.transform.position.clone();
            currentFootGroundY = this.getGroundHeightAt(footPos);
        }

        if (currentFootGroundY === null || !footPos) {
            return; // 无法获取脚的地面坐标
        }

        // 计算期望的角色中心高度（当前脚的地面高度 + 偏移量）
        const pivotOffset = this.getPivotOffsetWithAdjustment();
        const expectedPersonY = currentFootGroundY + pivotOffset;

        // 检查当前人物Y坐标和期望的角色中心高度是否一致（允许小的误差）
        const heightThreshold = 0.05; // 高度差阈值（米）
        const heightDiff = Math.abs(currentPersonY - expectedPersonY);

        if (heightDiff > heightThreshold) {
            // 不一致，设置nextStepY为当前脚的地面坐标
            this.nextStepY = expectedPersonY;
            console.log(`${footType === "left" ? "左脚" : "右脚"}地面坐标与人物Y坐标不一致（差值: ${heightDiff.toFixed(3)}），设置nextStepY: ${this.nextStepY.toFixed(3)}`);

            // 如果存在调试标记节点，更新它的位置
            if (this.nextStepPosDebug) {
                this.nextStepPosDebug.transform.position = new Laya.Vector3(
                    footPos.x,
                    this.nextStepY,
                    footPos.z
                );
            }
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
        this.debugLineRenderer.maxLineCount = 100; // 设置最大线条数量
        this.nextStepPosDebug = this.owner.scene.getChild("nextStepPosDebug") as Laya.Sprite3D;
    }

    /**
     * 初始化速度显示UI
     */
    private initSpeedDisplay(): void {
        // 创建Label用于显示速度
        this.speedDisplayLabel = new Laya.Label();
        this.speedDisplayLabel.font = "Microsoft YaHei";
        this.speedDisplayLabel.fontSize = 24;
        this.speedDisplayLabel.color = "#FFFFFF";
        this.speedDisplayLabel.stroke = 2;
        this.speedDisplayLabel.strokeColor = "#000000";
        this.speedDisplayLabel.x = 20;
        this.speedDisplayLabel.y = 20;
        this.speedDisplayLabel.text = `动画速度: ${this.animationSpeed.toFixed(1)}x`;

        // 添加到舞台
        Laya.stage.addChild(this.speedDisplayLabel);
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
        const isKeyUpDown = Laya.InputManager.hasKeyDown("ArrowUp");
        const isKeyDownDown = Laya.InputManager.hasKeyDown("ArrowDown");

        // 处理动画速度调整（上下方向键）
        this.updateAnimationSpeed(isKeyUpDown, isKeyDownDown);

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
            const p1 = this.owner as Laya.Sprite3D;
            const p2 = p1.parent as Laya.Sprite3D;
            const srcZ = p1.transform.localPosition.z;
            p1.transform.localPosition.z = 0;
            p1.transform.localPosition.x = 0; // 转身时将x强制设置为0
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
            this.nextStepY2 = undefined;
            this.nextStepY = undefined;
        }

        // 待机时将x强制设置为0
        if (playName === "idle") {
            const localPos = this.owner.transform.localPosition.clone();
            localPos.x = 0;
            this.owner.transform.localPosition = localPos;
            this.updateGrounding(deltaTime);
            this.nextStepY2 = undefined;
            this.nextStepY = undefined;
            this.leftBlendWeight = 1;
            this.rightBlendWeight = 1;
        } else if ("run" === playName) {
            this.updateGrounding(deltaTime);
        }




        // 更新摄像机跟随
        this.updateCameraFollow(deltaTime);

        if (!this.pivotOffsetInitialized && this.isGrounded) {
            this.computePivotToFootOffset();
        }

        // 应用动画速度
        if (this.animator) {
            this.animator.speed = this.animationSpeed;
        }
        if (this.moveAni) {
            this.moveAni.speed = this.animationSpeed;
        }

        if (this.animator.getControllerLayer(0).getCurrentPlayState().animatorState.name !== playName) {
            this.animator.play(playName);
            this.moveAni.play(playName);
            if ("walk" === playName) {
                this.leftBlendWeight = 0;
                this.rightBlendWeight = 1;
                this.standType = "right";
            } else if ("run" === playName) {
                this.leftBlendWeight = 0;
                this.rightBlendWeight = 1;
            }
        }

        if ("walk" === playName) {
            const stepDirection = this.detectStepDirection(this.lastDirection);
            if (1 !== stepDirection) {
                // 下楼或平路时，实时检测最低脚的地面位置
                const lowestFootGroundY = this.getLowestFootGroundY();
                if (lowestFootGroundY !== null) {
                    // 获取当前角色脚下的地面高度
                    const ownerWorldPos = this.owner.transform.position.clone();
                    const currentGroundY = this.getGroundHeightAt(ownerWorldPos);
                    
                    if (currentGroundY !== null) {
                        const heightDiff = currentGroundY - lowestFootGroundY;
                        // 如果最低脚的地面位置低于当前人物地面位置，需要下降
                        if (heightDiff > 0.05) {
                            const pivotOffset = this.getPivotOffsetWithAdjustment();
                            this.nextStepY2 = lowestFootGroundY + pivotOffset;
                        }
                    }
                }
                
                // 保留原有的检测逻辑作为备用
                if (this.standType === "left") {
                    this.checkFootGroundForDownstairs("right");
                } else if (this.standType === "right") {
                    this.checkFootGroundForDownstairs("left");
                }
            }
        }

        if (undefined !== this.nextStepY2) {
            this.updateGrounding(deltaTime, this.nextStepY2);
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
     * 更新动画速度
     * @param isKeyUpDown 是否按下上方向键（增加速度）
     * @param isKeyDownDown 是否按下下方向键（减少速度）
     */
    private updateAnimationSpeed(isKeyUpDown: boolean, isKeyDownDown: boolean): void {
        const now = Laya.timer.currTimer;

        // 控制更新频率，避免速度变化过快
        if (now - this.lastSpeedUpdateTime < this.speedUpdateInterval) {
            return;
        }

        if (isKeyUpDown) {
            // 按下上方向键，增加速度
            this.animationSpeed = Math.min(this.animationSpeed + this.speedChangeStep, this.maxSpeed);
            this.updateSpeedDisplay();
            this.lastSpeedUpdateTime = now;
        } else if (isKeyDownDown) {
            // 按下下方向键，减少速度
            this.animationSpeed = Math.max(this.animationSpeed - this.speedChangeStep, this.minSpeed);
            this.updateSpeedDisplay();
            this.lastSpeedUpdateTime = now;
        }
    }

    /**
     * 更新速度显示文本
     */
    private updateSpeedDisplay(): void {
        if (this.speedDisplayLabel) {
            this.speedDisplayLabel.text = `动画速度: ${this.animationSpeed.toFixed(1)}x`;
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
     * 检测下一步是上楼还是下楼
     * @param direction 移动方向：-1=左，1=右，0=无方向
     * @returns 返回检测结果：1=上楼，-1=下楼，0=平路或无法检测
     */
    private detectStepDirection(direction: number): number {
        if (!this.scene3D || direction === 0) {
            return 0; // 无方向或场景未初始化，返回平路
        }

        // 获取角色当前位置（世界坐标）
        const ownerWorldPos = this.owner.transform.position.clone();

        // 获取当前人物的Y坐标（角色中心高度）
        const currentGroundHeight = ownerWorldPos.y;

        // 计算前方检测位置（使用角色本地空间的Z轴方向）
        // 方法1：计算两个位置（当前位置和前方位置），然后相减得到方向向量
        const localForwardPos = new Laya.Vector3(0, 0, this.forwardCheckDistance);
        const worldForwardPos = new Laya.Vector3();

        // 将本地空间的前方位置转换为世界空间
        this.owner.transform.localToGlobal(localForwardPos, worldForwardPos);

        // 计算方向向量（只取XZ分量，忽略Y）
        const worldForward = new Laya.Vector3();
        worldForward.x = worldForwardPos.x - ownerWorldPos.x;
        worldForward.y = 0; // 忽略Y分量，只考虑水平方向
        worldForward.z = worldForwardPos.z - ownerWorldPos.z;

        // 归一化方向向量，然后乘以检测距离
        const forwardLength = Math.sqrt(worldForward.x * worldForward.x + worldForward.z * worldForward.z);
        if (forwardLength > 0.001) {
            const scale = this.forwardCheckDistance / forwardLength;
            worldForward.x *= scale;
            worldForward.z *= scale;
        }

        // 计算前方检测点位置（XZ平面，Y坐标使用角色当前位置的Y）
        // getGroundHeightAt会从worldPos.y + groundCheckHeight开始向下检测
        const forwardCheckPos = new Laya.Vector3();
        forwardCheckPos.x = ownerWorldPos.x + worldForward.x;
        forwardCheckPos.y = ownerWorldPos.y; // 使用角色当前位置的Y，确保能检测到前方地面
        forwardCheckPos.z = ownerWorldPos.z + worldForward.z;

        // 获取前方地面高度
        const forwardGroundHeight = this.getGroundHeightAt(forwardCheckPos);
        if (forwardGroundHeight === null) {
            return 0; // 无法检测前方地面，返回平路
        }

        // 计算高度差
        const heightDiff = forwardGroundHeight - currentGroundHeight;

        // 添加调试信息（可选）
        // console.log(`当前地面高度: ${currentGroundHeight.toFixed(3)}, 前方地面高度: ${forwardGroundHeight.toFixed(3)}, 高度差: ${heightDiff.toFixed(3)}`);

        // 判断是上楼、下楼还是平路
        if (heightDiff > this.stepHeightThreshold) {
            return 1; // 上楼
        } else if (heightDiff < -this.stepHeightThreshold) {
            return -1; // 下楼
        } else {
            return 0; // 平路
        }
    }

    /**
     * 获取指定位置的地面高度
     * @param worldPos 世界坐标位置（Y坐标会被忽略，从上方检测）
     * @returns 地面高度，如果无法检测则返回null
     */
    private getGroundHeightAt(worldPos: Laya.Vector3): number | null {
        if (!this.scene3D) {
            return null;
        }

        // 从指定位置上方发射射线检测地面
        const rayStartPos = worldPos.clone();
        rayStartPos.y += this.groundCheckHeight;

        // 射线方向：在世界空间中向下
        const rayDirection = new Laya.Vector3(0, -1, 0);
        const ray = new Laya.Ray(rayStartPos, rayDirection);
        const hitResult = new Laya.HitResult();

        // 执行射线检测
        const hit = this.scene3D.physicsSimulation.rayCast(ray, hitResult, this.groundCheckDistance);

        // 检查是否检测到地面
        if (hit && hitResult.succeeded) {
            return hitResult.point.y;
        }

        return null; // 无法检测到地面
    }

    /**
     * 更新摄像机跟随逻辑
     * @param deltaTime 帧间隔秒
     */
    private updateCameraFollow(deltaTime: number): void {
        if (!this.camera) {
            return;
        }

        // 获取人物当前世界位置
        const characterWorldPos = this.owner.transform.position.clone();

        // 计算人物的目标Y位置（带偏移）
        const rawTargetY = characterWorldPos.y + this.cameraOffset.y;

        // 初始化平滑目标Y值
        if (!this.cameraTargetYInitialized) {
            this.cameraTargetY = rawTargetY;
            this.cameraTargetYInitialized = true;
        }

        // 第一层平滑：让目标Y值缓慢跟随人物Y值（非常慢，避免跳跃感）
        const targetYLerpSpeed = 0.5; // 目标Y值的平滑速度
        const targetYLerpFactor = Math.min(1, targetYLerpSpeed * deltaTime);
        this.cameraTargetY = this.cameraTargetY + (rawTargetY - this.cameraTargetY) * targetYLerpFactor;

        // 计算目标摄像机位置（使用平滑后的目标Y值）
        const targetCameraPos = new Laya.Vector3();
        targetCameraPos.x = characterWorldPos.x + this.cameraOffset.x;
        targetCameraPos.y = this.cameraTargetY; // 使用平滑后的目标Y
        targetCameraPos.z = characterWorldPos.z + this.cameraOffset.z;

        // 获取摄像机当前位置
        const currentCameraPos = this.camera.transform.position.clone();

        // 计算位置差
        const posDiff = new Laya.Vector3();
        Laya.Vector3.subtract(targetCameraPos, currentCameraPos, posDiff);

        // 分别计算水平和垂直方向的距离
        const horizontalDiff = new Laya.Vector3(posDiff.x, 0, posDiff.z);
        const horizontalDistance = Laya.Vector3.distance(new Laya.Vector3(0, 0, 0), horizontalDiff);
        const totalDistance = Laya.Vector3.distance(currentCameraPos, targetCameraPos);

        // 如果距离很小，直接设置到目标位置
        if (totalDistance < 0.01) {
            this.camera.transform.position = targetCameraPos;
            return;
        }

        // 根据水平距离动态选择插值速度：距离远时快速，距离近时慢速
        let currentHorizontalLerpSpeed: number;
        if (horizontalDistance > this.cameraFollowDistanceThreshold) {
            // 距离较远，使用快速跟随
            currentHorizontalLerpSpeed = this.cameraFollowSpeedFast;
        } else {
            // 距离较近，使用慢速跟随（平滑）
            currentHorizontalLerpSpeed = this.cameraHorizontalLerpSpeed;
        }

        // 使用插值（lerp）平滑移动，分别处理水平和垂直方向
        const newCameraPos = new Laya.Vector3();

        // 水平方向使用动态插值速度
        const horizontalLerpFactor = Math.min(1, currentHorizontalLerpSpeed * deltaTime);
        newCameraPos.x = currentCameraPos.x + (targetCameraPos.x - currentCameraPos.x) * horizontalLerpFactor;
        newCameraPos.z = currentCameraPos.z + (targetCameraPos.z - currentCameraPos.z) * horizontalLerpFactor;

        // 第二层平滑：垂直方向使用更慢的插值速度（避免跳跃感）
        const verticalLerpFactor = Math.min(1, this.cameraVerticalLerpSpeed * deltaTime);
        newCameraPos.y = currentCameraPos.y + (targetCameraPos.y - currentCameraPos.y) * verticalLerpFactor;

        // 更新摄像机位置
        this.camera.transform.position = newCameraPos;

        // 让摄像机从侧面看向人物（侧面视角）- 使用平滑后的Y值
        const lookAtTarget = characterWorldPos.clone();
        lookAtTarget.y = this.cameraTargetY - this.cameraOffset.y; // 使用平滑后的目标看向位置
        this.camera.transform.lookAt(lookAtTarget, new Laya.Vector3(0, 1, 0));
    }

    /**
     * 将角色与地面对齐并处理重力
     * @param deltaTime 帧间隔秒
     * @param targetGroundY 可选的地面Y坐标位置，如果不传则使用射线检测
     */
    private updateGrounding(deltaTime: number, targetGroundY?: number): void {
        if (!this.scene3D) {
            return;
        }
        //要修改this.owner.parent的Y坐标

        // 获取角色当前位置
        const ownerWorldPos = this.owner.transform.position.clone();

        let groundPointY: number | null = null;

        // 如果传入了目标地面Y坐标，直接使用
        if (targetGroundY !== undefined && targetGroundY !== null) {
            groundPointY = targetGroundY;
        } else {
            // 否则使用射线检测地面
            const rayStartPos = ownerWorldPos.clone();
            rayStartPos.y += this.groundCheckHeight; // 从角色上方一定高度发射

            // 射线方向：在世界空间中向下
            const rayDirection = new Laya.Vector3(0, -1, 0);
            const ray = new Laya.Ray(rayStartPos, rayDirection);
            const hitResult = new Laya.HitResult();

            // 执行射线检测
            const hit = this.scene3D.physicsSimulation.rayCast(ray, hitResult, this.groundCheckDistance);

            // 检查是否检测到地面
            if (hit && hitResult.succeeded) {
                groundPointY = hitResult.point.y;
            }
        }

        // 如果获取到了地面高度（无论是传入的还是检测到的）
        if (groundPointY !== null) {
            // 计算期望的脚部高度（地面高度 + 偏移量）
            const expectedFootHeight = groundPointY + this.groundOffsetAdjustment;

            // 计算当前脚部高度（使用最低的脚部高度）
            const rightFootHeight = this.rightToeBase ? this.rightToeBase.transform.position.y : Number.POSITIVE_INFINITY;
            const leftFootHeight = this.leftToeBase ? this.leftToeBase.transform.position.y : Number.POSITIVE_INFINITY;
            const currentFootHeight = Math.min(rightFootHeight, leftFootHeight);

            if (!isFinite(currentFootHeight)) {
                return;
            }

            // 计算期望的角色中心高度
            const pivotOffset = this.getPivotOffsetWithAdjustment();
            const expectedPivotHeight = expectedFootHeight + pivotOffset;

            // 计算当前角色中心高度
            const currentPivotHeight = ownerWorldPos.y;

            // 计算高度差
            const heightDiff = expectedPivotHeight - currentPivotHeight;

            // 判断是上台阶还是下台阶
            const isSteppingUp = heightDiff > 0;
            const stepSpeed = isSteppingUp ? this._stepUpSpeed : this._stepDownSpeed;

            // 平滑移动角色到目标高度
            const maxStepDistance = stepSpeed * deltaTime;
            let actualHeightChange = 0;

            if (Math.abs(heightDiff) <= maxStepDistance) {
                // 如果高度差小于单帧最大移动距离，直接到达目标位置
                actualHeightChange = heightDiff;
                this.isGrounded = true;
                this.verticalVelocity = 0; // 重置垂直速度
            } else {
                // 否则平滑移动到目标位置
                actualHeightChange = Math.sign(heightDiff) * maxStepDistance;
                this.isGrounded = true;
                this.verticalVelocity = 0; // 重置垂直速度
            }

            // 更新父节点的Y坐标
            const parent = this.owner.parent as Laya.Sprite3D;
            if (parent) {
                const parentPos = parent.transform.position.clone();
                parentPos.y += actualHeightChange;
                parent.transform.position = parentPos;
            }

        } else {
            // 没有检测到地面（且没有传入目标地面Y坐标），应用重力
            this.isGrounded = false;
            this.verticalVelocity += this.gravity * deltaTime;

            // 应用垂直速度
            const parent = this.owner.parent as Laya.Sprite3D;
            if (parent) {
                const parentPos = parent.transform.position.clone();
                parentPos.y += this.verticalVelocity * deltaTime;
                parent.transform.position = parentPos;
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