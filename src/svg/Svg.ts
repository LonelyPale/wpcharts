import d3 from "d3";
import {SvgAttribute, SvgContext, SvgObject} from "./SvgObject";
import {log} from "../util/debug";
import {Menu} from "../component/menu/Menu";

export class Svg extends SvgObject {

    static readonly SvgNamespace: string = d3.namespaces.svg; // http://www.w3.org/2000/svg
    static readonly SvgVersion: number = 1.1; // 1.0 or 1.1

    static readonly TagName: string = 'svg';

    constructor(parentSvgContext: SvgContext, attribute?: SvgAttribute) {
        attribute = attribute || {};
        attribute['xmlns'] = Svg.SvgNamespace;
        attribute['version'] = Svg.SvgVersion;
        super(attribute);
        this.draw(parentSvgContext);
    }

    contextmenu(menu: Menu): this {
        this.append(menu);
        this.on('click', () => menu.hide());
        this.on("contextmenu", () => {
            d3.event.preventDefault();

            let event = d3.event;
            let x = event.offsetX || 0;//clientX
            let y = event.offsetY || 0;//clientY

            menu.attr('transform', `translate(${x}, ${y})`);//# todo: 右击位置在right 和 bottom时，当空间不够会隐藏超出的部分
            menu.show();
        });
        return this;
    }

    //# test
    log(...args: any[]) {
        //debugger; //# 設定斷點
        //log(`${this.constructor.name}:SvgObject:`, ...args);
        //log.apply(this, args);
        //log.call(this, ...args);

        //debugger;
        log("this:", this);
        log("constructor:", this.constructor);
        // @ts-ignore
        log("prototype:", this.prototype);
        // @ts-ignore
        log("__proto__:", this.__proto__);

        let a = {a: 1};
        log("test-object:", a, a.constructor);
    }

}