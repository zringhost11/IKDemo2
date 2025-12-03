const { regClass } = Laya;

interface AnimatorPlayScriptInfo {
    animator: Laya.Animator;
    layerindex: number;
    playState: Laya.AnimatorState;
}

/**
 * 继承自AnimatorStateScript(动画状态脚本)
 */
@regClass()
export class AnimationScript extends Laya.AnimatorStateScript {
    /**动画的状态信息 */
    playStateInfo: AnimatorPlayScriptInfo = { animator: null, layerindex: -1, playState: null };

    setPlayScriptInfo(animator: Laya.Animator, layerindex: number, playstate: Laya.AnimatorState) {
        this.playStateInfo.animator = animator;
        this.playStateInfo.layerindex = layerindex;
        this.playStateInfo.playState = playstate;
    }

    /**
     * 动画状态开始时执行。
     */
    onStateEnter(): void {
        //console.log("动画开始播放了");
    }
    checkFloor(num: number = 0) {
        console.log("checkFloor", num);
        const owner = this.playStateInfo.animator.owner;
        const checkFloor = (owner as any).checkFloor;
        if (checkFloor) {
            checkFloor(num);
        }
    }

    /**
     * 动画状态运行中
     * @param normalizeTime 0-1动画播放状态
     */
    onStateUpdate(normalizeTime: number): void {
        //console.log("动画状态更新了");
    }

    /**
    * 动画状态退出时执行。
    */
    onStateExit(): void {
        //console.log("动画退出了");
    }

    /**
    * 动画设置了循环的话，每次循环结束时执行
    */
    onStateLoop(): void {
        //console.log("本次动画循环完成，将要开始下次循环");
    }
}

