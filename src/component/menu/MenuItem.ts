import d3 from "d3";
import {SvgContext, SvgObject} from "../../svg/SvgObject";
import {Component, ComponentProperty} from "../Component";
import {View} from "../../view/View";
import {Text} from "../../svg/Text";
import {Rect} from "../../svg/Rect";
import {Path} from "../../svg/Path";

type MenuItemType = 'normal' | 'check' | 'menu';

export interface MenuItemProperty extends ComponentProperty {
    text: string;
    type?: MenuItemType;

    action?(menuItem: MenuItem): void;
}

export class MenuItem extends Component {

    public static readonly ClassName: string = 'menu-item';

    static readonly Width = 128;
    static readonly Height = 22;

    private menu!: SvgObject;

    constructor(property: MenuItemProperty) {
        super(property);
        this.property.type = this.property.type || 'normal';
        this.setView({width: MenuItem.Width, height: MenuItem.Height, left: 15, boxOrient: "horizontal"});
    }

    append(svgObject: SvgObject): SvgObject {
        super.append(svgObject);
        if (svgObject.getClassName() === 'menu') {
            this.menu = svgObject;
            this.menu.transform('translate(113, -16)');
        }
        return svgObject;
    }

    protected draw(parentSvgContext: SvgContext): this {
        super.draw(parentSvgContext);
        this.attr('type', this.property.type);

        let {width, height} = <View>this.view;
        let layout = new Rect({width: width, height: height});
        this.append(layout);

        let text = new Text().setView({width: 100});
        this.append(text).text(this.property.text);

        if (this.property.type === 'menu') {
            let symbolGenerator = d3.symbol().type(d3.symbolTriangle).size(30);
            let pathData = symbolGenerator();
            this.append(new Path({d: <string>pathData}).setView({x: -2, y: 11})).classed('icon-triangle', true).transform('rotate(90)');
        } else if (this.property.type === 'check') {
            let d = 'M14.1 27.2l7.1 7.2 16.7-16.8';
            this.append(new Path({d: d}).setView({x: -22, y: -10})).classed('icon-hook', true).transform('scale(0.8)');
        } else {
            //# polyfill: 位置预留：用于解决菜单类型切换时 check 和 normal 的图标位置在 水平 方向上会出现偏移的问题。
            this.append(new Path({}).setView({x: -22, y: -10})).classed('icon-hook', true).transform('scale(0.8)').hide();
        }

        if (this.property.type === 'menu') {
            this.on('mouseover', () => this.menu.show());
            this.on('mouseout', () => this.menu.hide());
        } else {
            this.on('click', () => this.action());
        }

        return this;
    }

    setType(type: MenuItemType) {
        this.property.type = type;
        d3.selectAll('.icon-hook').remove();
        if (this.property.type === 'check') {
            let d = 'M14.1 27.2l7.1 7.2 16.7-16.8';
            this.append(new Path({d: d}).setView({x: 0, y: -10})).classed('icon-hook', true).transform('scale(0.8)');
        }
    }

    action() {
        if (this.property.action && typeof this.property.action === "function") {
            this.property.action(this);
        }
    }

}
