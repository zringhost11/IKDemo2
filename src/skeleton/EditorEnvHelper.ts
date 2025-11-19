import * as fs from 'fs'

const { Sprite3D, Matrix4x4 } = Laya;
type Sprite3D = Laya.Sprite3D;

@IEditorEnv.regClass()
class EditorEnvHelper {
    static savePose(name: string,p1:string) {
        let cursel = EditorEnv.scene.selection?.[0];
        if (cursel instanceof Sprite3D) {
            if (!name.endsWith('.json'))
                name += '.json'
            let filename = EditorEnv.assetsPath + '/' + name;
            if (fs.existsSync(filename)) {
                if (!confirm(`已经存在文件${name}了，是否覆盖`)) {
                    return;
                }
            }
            let data: any = {}
            EditorEnvHelper.traverseChildren(cursel, (parent: Sprite3D, child: Sprite3D) => {
                let pose = parent.transform.localMatrix.elements;
                let posed: number[] = [];
                pose.forEach(v => posed.push(v));
                data[parent.name] = posed;
            });
            fs.writeFileSync(filename, JSON.stringify(data, null, ' '), { encoding: 'utf-8' });
        }
    }

    static loadPose(name: string) {
        let cursel = EditorEnv.scene.selection?.[0];
        if (cursel instanceof Sprite3D) {
            if (!name.endsWith('.json'))
                name += '.json'
            //comp.loadPose(name)
            let fc = fs.readFileSync(EditorEnv.assetsPath + '/' + name, { encoding: 'utf-8' }) as string;
            if (!fc) {
                console.log('没有这个文件')
                return;
            }
            let apply = 0;
            try {
                let data = JSON.parse(fc)
                EditorEnvHelper.traverseChildren(cursel, (parent: Sprite3D, child: Sprite3D) => {
                    let bonePos = data[parent.name];
                    if (!bonePos)
                        return;
                    parent.transform.localMatrix = new Matrix4x4(...bonePos);
                    apply++;
                });
                console.log('apply:', apply)
            } catch (e) {
                console.log('json parse error')
            }
        }
    }

    static traverseChildren(parent: Sprite3D, f:(parent:Sprite3D,child:Sprite3D)=>void): void {
        if(parent.name=='joints')
            return;
        if(!parent.children||parent.children.length==0){
            f(parent,null)
        }
        parent.children.forEach(child => {
            if (child instanceof Sprite3D) {
                let childsp = child as Sprite3D
                f(parent,childsp);
                this.traverseChildren(childsp,f);
            }
        });
    }

}


(window as any).savePose = EditorEnvHelper.savePose;
(window as any).loadPose = EditorEnvHelper.loadPose;