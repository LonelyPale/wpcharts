import d3 from "d3";
import {SvgAttribute, SvgObject} from "../../svg/SvgObject";
import {Path} from "../../svg/Path";
import {clone} from "../../util/common";
import {Rect} from "../../svg/Rect";
import {Text} from "../../svg/Text";
import {Line} from "../../svg/Line";
import {Title} from "../../svg/Title";
import {G} from "../../svg/G";
import {LineLegendType, LineStyleType} from "../../object/LineSet";

export type Symbol = d3.Symbol<any, any>;

interface LegendAttribute {
    name: string;
    generator: Symbol;
    fill: boolean;
    attribute?: SvgAttribute;
    clazz?: string;

    //# extend
    color: string;
    width: number;
    style: LineStyleType;
    legend: LineLegendType;
}

export class Legend {

    static readonly DefaultLegendSize: number = 20;
    static readonly DefaultStrokeWidth: number = 1;

    readonly name: string;
    readonly generator: Symbol;
    readonly fill: boolean;
    readonly attribute: SvgAttribute;
    readonly clazz?: string;

    //# extend
    readonly color: string;
    readonly width: number;
    readonly style: LineStyleType;
    readonly legend: LineLegendType;

    constructor(legendAttribute: LegendAttribute) {
        let {name, generator, fill, attribute, clazz, color, width, style, legend} = legendAttribute;
        this.name = name;
        this.generator = generator;
        this.fill = fill;
        this.attribute = attribute || {};
        if (clazz) this.clazz = clazz;

        //# extend
        this.color = color || '#000000';
        this.width = width || 1;
        this.style = style || 'style1';
        this.legend = legend || 'symbolCircleSolid';

        //初始化默认属性
        this.attribute['d'] = <string>this.generator.size(Legend.DefaultLegendSize)();
        if (this.fill) {
            this.attribute['fill'] = this.color;
        } else {
            this.attribute['fill'] = 'none';
            this.attribute['stroke'] = this.color;
            this.attribute['stroke-width'] = Legend.DefaultStrokeWidth;
        }
    }

    draw(context: SvgObject, x: number = 0, y: number = 0, size: number = Legend.DefaultLegendSize): SvgObject {
        let attribute: SvgAttribute = clone(this.attribute);

        if (size !== Legend.DefaultLegendSize && size > 0) {
            attribute['d'] = <string>this.generator.size(size)();
        }

        if (x !== 0 || y !== 0) {
            let transform = attribute['transform'] || '';
            attribute['transform'] = `translate(${x}, ${y})${transform}`;
        }

        if (size > 0) {
            let path = new Path(attribute);
            context.append(path);
        }

        return context;
    }

    drawLegend(context: SvgObject, content: string, size: number = 60, attr?: SvgAttribute): SvgObject {
        //let content = 'pointId 温度℃ 123123456789012345';
        let content15 = content;
        if (content.length > 15) {
            content15 = content.substring(0, 15) + '....';
        }

        let g1 = new G(attr).setView({width: 148, height: 22, top: 5, bottom: 5, left: 5, right: 5, boxOrient: "horizontal"});
        context.append(g1);
        let rect = g1.append(new Rect({width: 148, height: 22, class:'legend-rect'}).setView({}));//图例外框：用于右键菜单事件范围判断
        //rect.on('contextmenu', ()=>{console.log(222);});

        let g2 = new G().setView({width: 148, height: 22, top: 5, bottom: 5, left: 3, right: 5, boxOrient: "horizontal"});
        g1.append(g2);
        let line = g2.append(new Line({x1: 0, y1: 6, x2: 25, y2: 6, stroke: this.color, class: 'legend-line'}).setView({}));
        let text = g2.append(new Text({x: 28, y: 10, class: 'legend-text'}).setView({})).text(content15).append(new Title()).text(content);
        this.draw(g2, 15, 11, size);
        return context;
    }

}
