
const {Vector3,Color} = Laya;
type Vector3=Laya.Vector3;
type Color = Laya.Color;

export interface ILinerender{
    addLine(start:Vector3,end:Vector3, c1:Color,c2:Color):void;
    destroy():void;
    clear():void;
}

export class PixelLineRender implements ILinerender{
    clear(): void {
        throw new Error("Method not implemented.");
    }
    addLine(start: Vector3, end: Vector3, c1: Color, c2: Color): void {
        throw new Error("Method not implemented.");
    }
    destroy(): void {
        throw new Error("Method not implemented.");
    }
    line(start: Vector3, end: Vector3, c1: Color, c2: Color): void {
        throw new Error("Method not implemented.");
    }

}
