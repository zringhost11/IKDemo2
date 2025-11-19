
const {Vector3,Quaternion,Matrix4x4} = Laya;
type Vector3 = Laya.Vector3;
type Quaternion = Laya.Quaternion;
type Matrix4x4 = Laya.Matrix4x4;


let xUnitVec3: Vector3;
let yUnitVec3: Vector3;
let tmpVec3: Vector3;

export function quaternionFromTo(from: Vector3, to: Vector3, out: Quaternion): boolean {
    if (!xUnitVec3) {
        xUnitVec3 = new Vector3(1, 0, 0);
        yUnitVec3 = new Vector3(0, 1, 0);
        tmpVec3 = new Vector3();
    }
    var dot: number = Vector3.dot(from, to);
    if (dot < -0.999999) {// 180度了，可以选择多个轴旋转
        Vector3.cross(xUnitVec3, from, tmpVec3);
        if (Vector3.scalarLength(tmpVec3) < 0.000001)
            Vector3.cross(yUnitVec3, from, tmpVec3);
        Vector3.normalize(tmpVec3, tmpVec3);
        Quaternion.createFromAxisAngle(tmpVec3, Math.PI, out);
        return true
    } else if (dot > 0.999999) {// 没有变化
        out.x = 0;
        out.y = 0;
        out.z = 0;
        out.w = 1;
        return false;
    } else {
        // 下面是求这个四元数，这是一个简化求法，根据cos(a/2)=√((1+dot)/2), cos(a/2)sin(a/2)=sin(a)/2 就能推导出来
        Vector3.cross(from, to, tmpVec3);
        out.x = tmpVec3.x;
        out.y = tmpVec3.y;
        out.z = tmpVec3.z;
        out.w = 1 + dot;
        out.normalize(out);
        return true;
    }
    return false;
}


export class ArcBall {
    private width: number;  // 用来把屏幕坐标缩放到[-1,1]的
    private height: number;
    private lastPos = new Vector3(); // 上次的点的位置，是已经规格化的了
    private curPos = new Vector3();
    //private halfPos: Vector3 = new Vector3();

    private newQuat = new Quaternion();
    protected static e = 1e-6;

    //private isDrag: boolean = false;

    private static xUnitVec3: Vector3;
    private static yUnitVec3: Vector3;
    static tmpVec3: Vector3;

    private camStartWorldMat = new Matrix4x4();	//开始拖动的时候的矩阵

    initStatic() {
        if (!ArcBall.xUnitVec3) {
            ArcBall.xUnitVec3 = new Vector3(1, 0, 0);
            ArcBall.yUnitVec3 = new Vector3(0, 1, 0);
            ArcBall.tmpVec3 = new Vector3();
        }
    }

    // 设置屏幕范围。可以不是方形的，对应的arcball也会变形。
    init(w: number, h: number): void {
        this.initStatic();
        if (w <= ArcBall.e || h <= ArcBall.e) throw '设置大小不对，不能为0';
        this.width = w;
        this.height = h;
    }

    // 把屏幕空间换成-1,1
    private normx(x: number): number {
        return x * 2 / this.width - 1;
    }
    private normy(y: number): number {
        return -(y * 2 / this.height - 1);
    }

    // 根据屏幕坐标返回一个arcball表面上的位置。这个位置会考虑摄像机的影响。
    private hitpos(x: number, y: number, out: Vector3): void {
        var x1 = this.normx(x);
        var y1 = this.normy(y);
        var l = x1 * x1 + y1 * y1;
        var nl = Math.sqrt(l);
        if (l > 1.0) {
            // 在球外面
            out.x = x1 / nl;
            out.y = y1 / nl;
            out.z = 0;
        } else {
            // 在球面上了
            out.x = x1;        // x
            out.y = y1;        // z
            out.z = Math.sqrt(1 - l);  //y
        }
        Vector3.TransformNormal(out, this.camStartWorldMat, out);
    }

    /**
     * 开始新的拖动。
     * 记录开始拖动的位置
     * 以后调用dragTo的时候都是跟这个比较，来计算旋转
     */
    private setStartPos(x: number, y: number): void {
        this.hitpos(x, y, this.lastPos);
    }

    /**
     * 返回本次变化的四元数
     * 累计结果在quatResult中
     * @param	x
     * @param	y
     * @return
     */
    dragTo(x: number, y: number): Quaternion {
        this.hitpos(x, y, this.curPos);
        quaternionFromTo(this.lastPos,this.curPos,this.newQuat);
        return this.newQuat;
    }

    startDrag(x: number, y: number, camWorldMatrix: Matrix4x4): void {
        //this.isDrag = true;
        camWorldMatrix.cloneTo(this.camStartWorldMat);
        // 记录起始接触点
        this.setStartPos(x, y);
    }
}


