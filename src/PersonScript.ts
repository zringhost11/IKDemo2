const { regClass, property } = Laya;

@regClass()
export class PersonScript extends Laya.Script {
    declare owner: Laya.Sprite3D;
    //declare owner : Laya.Sprite;
    private characterController: Laya.CharacterController;
    private animator: Laya.Animator;
    private lastDirection: number = 0; // 0: 无方向, -1: 左, 1: 右
    private rightToeBase: Laya.Node;
    private leftToeBase: Laya.Node;
    private ikcom: Laya.IK_Comp;

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
        const rightToeBase = node.findChild("mixamorig:RightToeBase");
        const leftToeBase = node.findChild("mixamorig:LeftToeBase");
        const ikcom = node.getComponent(Laya.IK_Comp);
        this.rightToeBase = rightToeBase;
        this.leftToeBase = leftToeBase;
        this.ikcom = ikcom;
        this.animator = node.getComponent(Laya.Animator);
    }

    //手动调用节点销毁时执行
    //onDestroy(): void {}

    //每帧更新时执行，尽量不要在这里写大循环逻辑或者使用getComponent方法
    onUpdate(): void {
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
    }

    //每帧更新时执行，在update之后执行，尽量不要在这里写大循环逻辑或者使用getComponent方法
    //onLateUpdate(): void {}

    //鼠标点击后执行。与交互相关的还有onMouseDown等十多个函数，具体请参阅文档。
    //onMouseClick(): void {}
}