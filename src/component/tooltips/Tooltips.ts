import d3 from "d3";
import {Component, ComponentProperty} from "../Component";
import {SvgContext} from "../../svg/SvgObject";
import {Rect} from "../../svg/Rect";
import {View} from "../../view/View";

export class Tooltips extends Component {

    public static readonly ClassName: string = 'tooltips';

    constructor(property?: ComponentProperty) {
        super(property);
        this.setView({width: 150, height: 0, left: 5, right: 5, top: 15, bottom: 5, boxOrient: "vertical"});
    }

    protected draw(parentSvgContext: SvgContext): this {
        super.draw(parentSvgContext);
        return this.hide();
    }

    public clear(): this {
        this.children = {};
        this.getSvgContext().selectAll("*").remove();
        //let selector = '.' + Tooltips.ClassName;
        //d3.select("#root1 " + selector).selectAll("*").remove();
        return this;
    }

    public refresh(recordsNumber: number, mouse: [number, number], parentView: View, tooltipsView: View, nodeView: View, minWidth: number): this {
        //# 计算宽高
        /*
        let width = 150; //单个120
        let height = recordsNumber * 35 + 20;
        //let height = recordsNumber * 50 + 20;
        if (height >= 400) {
            width = 390;
            height = 200;
        } else if (height >= 200) {
            width = 240;
            height = 200;
        }
        */

        //# 计算宽高 new
        let width, height;
        let {width: tw, height: th, top: tt, bottom: tb, left: tl, right: tr} = tooltipsView;
        let {width: nw, height: nh, top: nt, bottom: nb, left: nl, right: nr} = nodeView;
        height = tt + tb + recordsNumber * (nh + nt + nb);
        if (height <= th) {
            width = minWidth > nw ? minWidth : nw;
        } else if (height <= th * 2) {
            width = nw * 2;
            height = th;
        } else if (height <= th * 3) {
            width = nw * 3;
            height = th;
        } else {
            width = tw;
            height = th;
        }

        //# 计算显示位置 position
        let [x, y] = mouse;
        let {width: pwidth, height: pheight, left: pleft, top: ptop} = parentView;
        if (pleft + x + width + 5 > pwidth) {
            x -= width + 5;
        } else {
            x += 5
        }
        if (ptop + y + height + 5 > pheight) {
            y -= height + 5;
        } else {
            y += 5;
        }

        this.clear();
        this.setView({width: width, height: height, top: tt, bottom: tb, left: tl, right: tr, boxOrient: "vertical"});
        this.append(new Rect({width: width, height: height, opacity: 0.8}));
        this.attr('transform', `translate(${x}, ${y})`);
        this.show();

        return this;
    }

}
