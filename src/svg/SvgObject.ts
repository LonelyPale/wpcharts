import d3, {BaseType, CustomEventParameters, ValueFn as d3ValueFn} from "d3";
import {log} from "../util/debug";
import {ObjectId} from "../util/ObjectId";
import {View, ViewOption} from "../view/View";

export type SvgContext = d3.Selection<any, any, any, any>;

export type SvgAttribute = Record<string, string | number | boolean>;

export type ValueFn = d3ValueFn<any, any, any>;
export type ValueFnEvent = d3ValueFn<BaseType, any, CustomEventParameters>;

function assertSvgContext(svgContext: SvgContext) {
    if (!svgContext) {
        throw new Error('SvgContext is undefined or null');
    }
}

const id = "_id";

export abstract class SvgObject {

    private parentSvgContext?: SvgContext; //Svg类由构造方法赋值, 其他类由append方法赋值
    private svgContext?: SvgContext; //append方法赋值

    protected parent?: SvgObject;
    protected children: Record<string, SvgObject> = {};

    protected attribute: SvgAttribute;

    protected view?: View;

    protected constructor(attribute?: SvgAttribute) {
        this.attribute = attribute || {};
        this.attribute[id] = new ObjectId().toString();//# gen ObjectId
    }

    getTagName(): string {
        const constructor = <SvgObjectConstructor>this.constructor;
        return constructor.TagName;
    }

    getClassName(): string {
        const constructor = <SvgObjectConstructor>this.constructor;
        return constructor.ClassName;
    }

    setView(option: ViewOption): SvgObject {
        this.view = new View(option, this);
        return this;
    }

    getView(): View {
        return <View>this.view;
    }

    private initAttribute(): SvgObject {
        if (!this.svgContext) {
            log.e.call(this, "this.context is undefined or null");
            return this;
        }
        for (let key in this.attribute) {
            if (this.attribute.hasOwnProperty(key)) {
                let value = this.attribute[key];
                if (value === null || value === undefined) {
                    delete this.attribute[key];
                }
                this.svgContext.attr(key, value);
            }
        }
        return this;
    }

    private initView(): SvgObject {
        if (!this.view) {
            return this;
        }
        if (this.parent && this.parent.view) {
            this.parent.view.append(this.view);
        } else {
            this.view.transform();
        }
        return this;
    }

    private initOther(): SvgObject {
        let className = this.getClassName();
        if (className) {
            this.classed(className, true);
        }
        return this;
    }

    protected draw(parentSvgContext: SvgContext): SvgObject {
        this.parentSvgContext = parentSvgContext;
        this.svgContext = this.parentSvgContext.append(this.getTagName());
        this.initAttribute();
        this.initView();
        this.initOther();
        return this;
    }

    append(svgObject: SvgObject): SvgObject {
        if (!this.svgContext) {
            log.e.call(this, "this.context is undefined or null");
            return this;
        }
        this.children[svgObject.id()] = svgObject;
        svgObject.parent = this;
        svgObject.draw(this.svgContext);
        return svgObject;
    }

    remove(): this {
        //(<SvgContext>this.context).remove(); //编译后不会检查this.context是否为真
        if (this.svgContext) {
            this.svgContext.remove();
        }
        if (this.view) {
            this.view.remove();
        }
        if (this.parent) {
            delete this.parent.children[this.id()];
        }
        return this;
    }

    show(): this {
        return this.style("display", null);
    }

    hide(): this {
        return this.style("display", "none");
    }

    //# 默认是追加 false，覆盖需要明确指出 true
    transform(value: string, overwrite: boolean = false): this {
        if (overwrite) {
            this.attr('transform', value);
        } else {
            let transform = this.attr('transform');
            if (transform) {
                this.attr('transform', transform + value);
            } else {
                this.attr('transform', value);
            }
        }
        return this;
    }

    //# 覆盖
    attr(name: SvgAttribute): this;
    attr(name: string): string;
    attr(name: string, value: null): this;
    attr(name: string, value: string | number | boolean): this;
    attr(name: string, value: ValueFn): this;
    attr(name: SvgAttribute | string, value?: null | string | number | boolean | ValueFn): string | this {
        if (!this.svgContext) {
            log.e.call(this, "this.context is undefined or null");
            return this;
        }
        if (typeof name === 'object' && name !== null) {
            for (const key in name) {
                if (name.hasOwnProperty(key)) {
                    let val = name[key];
                    if (val === null || val === undefined) {
                        delete this.attribute[key];
                    } else {
                        this.attribute[key] = val;
                    }
                    this.svgContext.attr(key, val);
                }
            }
        } else if (value === undefined) {
            return this.svgContext.attr(name);
        } else if (value === null) {
            delete this.attribute[name];
            this.svgContext.attr(name, value);
        } else if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
            this.attribute[name] = value;
            this.svgContext.attr(name, value);
        } else {
            this.svgContext.attr(name, value);
        }
        return this;
    }

    classed(names: string): boolean;
    classed(names: string, value: boolean): this;
    classed(names: string, value: ValueFn): this;
    classed(names: string, value?: boolean | ValueFn): boolean | this {
        if (!this.svgContext) {
            log.e.call(this, "this.context is undefined or null");
            return this;
        }
        if (value === undefined) {
            return this.svgContext.classed(names);
        } else if (typeof value === "boolean") {
            this.svgContext.classed(names, value);
        } else {
            this.svgContext.classed(names, value);
        }
        return this;
    }

    style(name: SvgAttribute): this;
    style(name: string): string;
    style(name: string, value: null): this;
    style(name: string, value: string | number | boolean, priority?: null | 'important'): this;
    style(name: string, value: ValueFn, priority?: null | 'important'): this;
    style(name: SvgAttribute | string, value?: null | string | number | boolean | ValueFn, priority?: null | 'important'): string | this {
        if (!this.svgContext) {
            log.e.call(this, "this.context is undefined or null");
            return this;
        }
        if (typeof name === 'object' && name !== null) {
            for (const key in name) {
                if (name.hasOwnProperty(key)) {
                    this.svgContext.style(key, name[key]);
                }
            }
        } else if (value === undefined) {
            return this.svgContext.style(name);
        } else if (value === null) {
            this.svgContext.style(name, value);
        } else if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
            this.svgContext.style(name, value, priority);
        } else {
            this.svgContext.style(name, value, priority);
        }
        return this;
    }

    text(): string;
    text(value: null): this;
    text(value: string | number | boolean): this;
    text(value: ValueFn): this;
    text(value?: null | string | number | boolean | ValueFn): string | this {
        if (!this.svgContext) {
            log.e.call(this, "this.context is undefined or null");
            return this;
        }
        if (value === undefined) {
            return this.svgContext.text();
        } else if (value === null) {
            this.svgContext.text(value);
        } else if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
            this.svgContext.text(value);
        } else {
            this.svgContext.text(value);
        }
        return this;
    }

    on(typenames: string): ValueFn | undefined;
    on(typenames: string, listener: null): this;
    on(typenames: string, listener: ValueFn, capture?: boolean): this;
    on(typenames: string, listener?: null | ValueFn, capture?: boolean): ValueFn | undefined | this {
        if (!this.svgContext) {
            log.e.call(this, "this.context is undefined or null");
            return this;
        }
        if (listener === undefined) {
            return this.svgContext.on(typenames);
        } else if (listener === null) {
            this.svgContext.on(typenames, listener);
        } else {
            this.svgContext.on(typenames, listener, capture);
        }
        return this;
    }

    dispatch(type: string, parameters?: CustomEventParameters): this;
    dispatch(type: string, parameters?: ValueFnEvent): this;
    dispatch(type: string, parameters?: CustomEventParameters | ValueFnEvent): this {
        if (!this.svgContext) {
            log.e.call(this, "this.context is undefined or null");
            return this;
        }

        if (!parameters) {
            parameters = {
                bubbles: true, //表示该事件能否冒泡
                cancelable: true, //表示该事件是否可以取消
                detail: null //可选的默认值是 null 的任意类型数据，是一个与 event 相关的值
            };
        }

        if (typeof parameters === "object") {
            this.svgContext.dispatch(type, parameters);
        } else if (typeof parameters === "function") {
            this.svgContext.dispatch(type, parameters);
        } else {
            this.svgContext.dispatch(type);
        }

        return this;
    }

    call(func: (selection: d3.Selection<any, any, any, any>, ...args: any[]) => void, ...args: any[]): this {
        if (!this.svgContext) {
            log.e.call(this, "this.context is undefined or null");
            return this;
        }
        this.svgContext.call(func, ...args);
        return this;
    }

    getSvgContext(): SvgContext {
        //if (!this.svgContext) throw new Error("SvgContext cannot is undefined or null");
        return <SvgContext>this.svgContext;
    }

    getChildren(): Record<string, SvgObject>;
    getChildren(id: string): SvgObject;
    getChildren(id?: string): SvgObject | Record<string, SvgObject> {
        if(typeof id === "string") {
            return this.children[id];
        } else {
            return this.children;
        }
    }

    id(): string {
        return <string>this.attribute[id];
    }

    test(event: any) {
        console.log(111, event, arguments, this);
        d3.event.preventDefault();
        let btnNum = event.button;
        if (btnNum == 2) {
            alert("您点击了鼠标右键！")
        } else if (btnNum == 0) {
            alert("您点击了鼠标左键！")
        } else if (btnNum == 1) {
            alert("您点击了鼠标中键！");
        } else {
            alert("您点击了" + btnNum + "号键，我不能确定它的名称。");
        }
        console.log(112233);
    }

}

//# 构造器定义
export interface SvgObjectConstructor {
    new(attribute?: SvgAttribute): SvgObject;

    readonly TagName: string;   //子类必须实现
    readonly ClassName: string; //子类可选实现
}
