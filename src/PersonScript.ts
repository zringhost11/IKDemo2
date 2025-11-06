const { regClass, property } = Laya;

@regClass()
export class PersonScript extends Laya.Script {
    declare owner: Laya.Sprite3D;
    //declare owner : Laya.Sprite;
    private characterController: Laya.CharacterController;
    private animator: Laya.Animator;
    private lastDirection: number = 0; // 0: 无方向, -1: 左, 1: 右
    private rightToeBase: Laya.Sprite3D;
    private leftToeBase: Laya.Sprite3D;
    private ikcom: Laya.IK_Comp;
    private scene3D: Laya.Scene3D;

    // 调试用：法线可视化
    private debugLineRenderer: Laya.PixelLineRenderer;
    private debugCounter: number = 0; // 用于控制打印频率
    private debugLineIndex: number = 0; // 当前线条索引
    private leftChain: Laya.IK_Chain;
    private rightChain: Laya.IK_Chain;
    
    // 脚部的初始旋转（用于补偿初始角度）
    private rightFootInitialRotation: Laya.Quaternion;
    private leftFootInitialRotation: Laya.Quaternion;

    //组件被激活后执行，此时所有节点和组件均已创建完毕，此方法只执行一次
    //onAwake(): void {}

    //组件被启用后执行，例如节点被添加到舞台后
    //onEnable(): void {}

    //组件被禁用时执行，例如从节点从舞台移除后
    //onDisable(): void {}

    //第一次执行update之前执行，只会执行一次
    onStart(): void {
        this.characterController = this.owner.getComponent(Laya.CharacterController);
        const node = this.owner.getChild("move").getChild("Swagger Walk");
        const rightToeBase = node.findChild("mixamorig:RightFoot");
        const leftToeBase = node.findChild("mixamorig:LeftFoot");
        const ikcom = node.getComponent(Laya.IK_Comp);
        this.rightToeBase = rightToeBase;
        this.leftToeBase = leftToeBase;
        this.ikcom = ikcom;

        this.animator = node.getComponent(Laya.Animator);
        this.scene3D = this.owner.scene as Laya.Scene3D;

        // 保存脚部的初始旋转（用于补偿初始角度）
        if (this.rightToeBase) {
            this.rightFootInitialRotation = this.rightToeBase.transform.rotation.clone();
        }
        if (this.leftToeBase) {
            this.leftFootInitialRotation = this.leftToeBase.transform.rotation.clone();
        }

        // 初始化调试线条渲染器（用于可视化法线）
        this.initDebugRenderer();
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

        if (Laya.InputManager.hasKeyDown("a")) {
            playName = "walk";
            currentDirection = -1; // 左
        } else if (Laya.InputManager.hasKeyDown("d")) {
            playName = "walk";
            currentDirection = 1; // 右
        }

        // 只在方向改变时旋转
        if (currentDirection !== this.lastDirection) {
            if (currentDirection === -1) {
                this.owner.transform.localRotationEuler = new Laya.Vector3(0, -180, 0);
            } else if (currentDirection === 1) {
                this.owner.transform.localRotationEuler = new Laya.Vector3(0, 0, 0);
            }
            this.lastDirection = currentDirection;
            this.characterController.move(new Laya.Vector3(0, 0, 0.015 * currentDirection));
        }

        if (this.animator.getControllerLayer(0).getCurrentPlayState().animatorState.name !== playName) {
            this.animator.play(playName);
            if ("walk" !== playName) {
                this.characterController.move(new Laya.Vector3(0, 0, 0));
            }
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
    private updateFootIK(toeBase: Laya.Sprite3D, chain: Laya.IK_Chain, isRightFoot: boolean): void {
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

            // 计算 IK Target 位置：碰撞点 + 法线方向 × 脚底高度
            const footBottomHeight = 0.0; // 脚底高度偏移（单位：米）
            const targetPosition = new Laya.Vector3();
            targetPosition.x = hitPoint.x + groundNormal.x * footBottomHeight;
            targetPosition.y = hitPoint.y + groundNormal.y * footBottomHeight;
            targetPosition.z = hitPoint.z + groundNormal.z * footBottomHeight;

            // 计算 IK Target 方向
            // 目标：构建一个旋转，让脚部的上方向对齐到地面法线
            // 方法：从局部坐标系 (上=0,1,0, 前=0,0,1) 旋转到 (上=法线, 前=计算得出)
            
            // 脚部的局部坐标系
            const footLocalUp = new Laya.Vector3(0, 1, 0);
            const footLocalForward = new Laya.Vector3(0, 0, 1);
            const footLocalRight = new Laya.Vector3(1, 0, 0);
            
            // 目标上方向就是地面法线
            const targetUp = groundNormal.clone();
            
            // 计算目标前方向：保持前方向在水平面上的投影
            // 先计算一个参考前方向（使用角色的前方向或脚部的当前前方向）
            const footRotation = toeBase.transform.rotation.clone();
            const footWorldForward = new Laya.Vector3();
            Laya.Vector3.transformQuat(footLocalForward, footRotation, footWorldForward);
            
            // 计算目标右方向：targetRight = normalize(cross(targetUp, footWorldForward))
            const targetRight = new Laya.Vector3();
            Laya.Vector3.cross(targetUp, footWorldForward, targetRight);
            const rightLength = Math.sqrt(targetRight.x * targetRight.x + targetRight.y * targetRight.y + targetRight.z * targetRight.z);
            
            let targetDirection: Laya.Vector3;
            
            if (rightLength > 0.001) {
                // 归一化右方向
                targetRight.x /= rightLength;
                targetRight.y /= rightLength;
                targetRight.z /= rightLength;
                
                // 计算目标前方向：targetForward = cross(targetRight, targetUp)
                Laya.Vector3.cross(targetRight, targetUp, targetDirection = new Laya.Vector3());
                
                // 归一化
                const dirLength = Math.sqrt(targetDirection.x * targetDirection.x + targetDirection.y * targetDirection.y + targetDirection.z * targetDirection.z);
                if (dirLength > 0.001) {
                    targetDirection.x /= dirLength;
                    targetDirection.y /= dirLength;
                    targetDirection.z /= dirLength;
                } else {
                    // 如果计算失败，使用默认前方向
                    targetDirection = new Laya.Vector3(0, 0, 1);
                }
            } else {
                // 如果法线和前方向平行，使用垂直方向作为参考
                const vertical = new Laya.Vector3(0, 1, 0);
                const tempRight = new Laya.Vector3();
                Laya.Vector3.cross(targetUp, vertical, tempRight);
                const tempRightLength = Math.sqrt(tempRight.x * tempRight.x + tempRight.y * tempRight.y + tempRight.z * tempRight.z);
                
                if (tempRightLength > 0.001) {
                    tempRight.x /= tempRightLength;
                    tempRight.y /= tempRightLength;
                    tempRight.z /= tempRightLength;
                    Laya.Vector3.cross(tempRight, targetUp, targetDirection = new Laya.Vector3());
                    const dirLength = Math.sqrt(targetDirection.x * targetDirection.x + targetDirection.y * targetDirection.y + targetDirection.z * targetDirection.z);
                    if (dirLength > 0.001) {
                        targetDirection.x /= dirLength;
                        targetDirection.y /= dirLength;
                        targetDirection.z /= dirLength;
                    } else {
                        targetDirection = new Laya.Vector3(0, 0, 1);
                    }
                } else {
                    // 完全垂直的情况，使用默认前方向
                    targetDirection = new Laya.Vector3(0, 0, 1);
                }
            }
            

            // 可视化：绘制碰撞点、法线和 IK 方向
            if (this.debugLineRenderer) {
                // 根据左右脚选择不同颜色
                // 右脚：红色系（红色=射线，橙色=法线）
                // 左脚：蓝色系（蓝色=射线，青色=法线）
                const rayColor = isRightFoot
                    ? new Laya.Color(1, 0, 0, 1)      // 右脚：红色
                    : new Laya.Color(0, 0.5, 1, 1);   // 左脚：蓝色

                const normalColor = isRightFoot
                    ? new Laya.Color(1, 0.5, 0, 1)     // 右脚：橙色
                    : new Laya.Color(0, 1, 1, 1);      // 左脚：青色

                // 1. 绘制射线：从脚部到碰撞点
                if (this.debugLineIndex < this.debugLineRenderer.lineCount) {
                    this.debugLineRenderer.setLine(this.debugLineIndex, footWorldPos, hitPoint, rayColor, rayColor);
                } else {
                    this.debugLineRenderer.addLine(footWorldPos, hitPoint, rayColor, rayColor);
                }
                this.debugLineIndex++;

                // 2. 绘制法线：从碰撞点开始，沿着法线方向绘制一条线
                const normalLength = 0.5; // 法线显示长度（米）
                const normalEnd = new Laya.Vector3();
                normalEnd.x = hitPoint.x + groundNormal.x * normalLength;
                normalEnd.y = hitPoint.y + groundNormal.y * normalLength;
                normalEnd.z = hitPoint.z + groundNormal.z * normalLength;

                if (this.debugLineIndex < this.debugLineRenderer.lineCount) {
                    this.debugLineRenderer.setLine(this.debugLineIndex, hitPoint, normalEnd, normalColor, normalColor);
                } else {
                    this.debugLineRenderer.addLine(hitPoint, normalEnd, normalColor, normalColor);
                }
                this.debugLineIndex++;

                // 3. 绘制 IK Target 方向：从 IK Target 位置开始，沿着方向绘制一条线
                const directionLength = 0.3; // 方向显示长度（米）
                const directionEnd = new Laya.Vector3();
                directionEnd.x = targetPosition.x + targetDirection.x * directionLength;
                directionEnd.y = targetPosition.y + targetDirection.y * directionLength;
                directionEnd.z = targetPosition.z + targetDirection.z * directionLength;
                
                const directionColor = isRightFoot
                    ? new Laya.Color(1, 1, 0, 1)     // 右脚：黄色（表示 IK 方向）
                    : new Laya.Color(0, 1, 0, 1);    // 左脚：绿色（表示 IK 方向）

                if (this.debugLineIndex < this.debugLineRenderer.lineCount) {
                    this.debugLineRenderer.setLine(this.debugLineIndex, targetPosition, directionEnd, directionColor, directionColor);
                } else {
                    this.debugLineRenderer.addLine(targetPosition, directionEnd, directionColor, directionColor);
                }
                this.debugLineIndex++;

                // 3. 绘制 IK Target 位置（用一个小十字标记）
                const markerSize = 0.05; // 标记大小（米）
                const markerColor = isRightFoot
                    ? new Laya.Color(1, 1, 0, 1)      // 右脚：黄色（表示 IK Target）
                    : new Laya.Color(0, 1, 0, 1);     // 左脚：绿色（表示 IK Target）

                // X轴方向的线
                const markerX1 = new Laya.Vector3(targetPosition.x - markerSize, targetPosition.y, targetPosition.z);
                const markerX2 = new Laya.Vector3(targetPosition.x + markerSize, targetPosition.y, targetPosition.z);
                if (this.debugLineIndex < this.debugLineRenderer.lineCount) {
                    this.debugLineRenderer.setLine(this.debugLineIndex, markerX1, markerX2, markerColor, markerColor);
                } else {
                    this.debugLineRenderer.addLine(markerX1, markerX2, markerColor, markerColor);
                }
                this.debugLineIndex++;

                // Z轴方向的线
                const markerZ1 = new Laya.Vector3(targetPosition.x, targetPosition.y, targetPosition.z - markerSize);
                const markerZ2 = new Laya.Vector3(targetPosition.x, targetPosition.y, targetPosition.z + markerSize);
                if (this.debugLineIndex < this.debugLineRenderer.lineCount) {
                    this.debugLineRenderer.setLine(this.debugLineIndex, markerZ1, markerZ2, markerColor, markerColor);
                } else {
                    this.debugLineRenderer.addLine(markerZ1, markerZ2, markerColor, markerColor);
                }
                this.debugLineIndex++;
            }
        } else {

            // 绘制失败的射线（灰色）
            if (this.debugLineRenderer) {
                const failedRayEnd = new Laya.Vector3();
                failedRayEnd.x = rayStartPos.x;
                failedRayEnd.y = rayStartPos.y - raycastDistance;
                failedRayEnd.z = rayStartPos.z;

                const grayColor = new Laya.Color(0.5, 0.5, 0.5, 1); // 灰色
                if (this.debugLineIndex < this.debugLineRenderer.lineCount) {
                    this.debugLineRenderer.setLine(this.debugLineIndex, rayStartPos, failedRayEnd, grayColor, grayColor);
                } else {
                    this.debugLineRenderer.addLine(rayStartPos, failedRayEnd, grayColor, grayColor);
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