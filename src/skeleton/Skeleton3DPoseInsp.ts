@IEditor.inspectorField("PoseInspector")
export class SkePoseField extends IEditor.PropertyField {
    private _panel:IEditor.InspectorPanel;
    @IEditor.onLoad
    static async onLoad() {
        //await gui.UIPackage.resourceMgr.load("MyField.widget");
    }

    create() {
        //let input = gui.UIPackage.createWidgetSync("MyField.widget");
        let widget:gui.Widget;
        this._panel = IEditor.GUIUtils.createInspectorPanel();
        Editor.typeRegistry.addTypes([
            {
                name : "MyPanelType", //请注意，名字是全局唯一的，一定要长
                properties : [
                    { name : "text", type : "string" },
                    { name : "count" , type: "number" },
                    { name : "actions", inspector: "Buttons",
                        options : { buttons : [ { caption : "点我", event: "my_click" } ] }
                    }
                ]
             }
        ]);

        this._panel.allowUndo = true; //根据需要设置
        //如果不需要undo功能，也可以直接this._data = {};
        this._data = IEditor.DataWatcher.watch({}); 

        //inspect可以多次调用，将多个数据组合在一个面板编辑
        this._panel.inspect(this._data, "MyPanelType");

        this._panel.on("my_click", ()=> {
            alert("hello");
        });

        return { ui: widget };
    }

    refresh() {
        //这里负责将数据设置到界面上
    }
}