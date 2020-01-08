import d3 from "d3";
import {Axis, AxisProperty} from "./Axis";
import {SvgContext, SvgObject} from "../../svg/SvgObject";
import {View} from "../../view/View";
import {LinearModel} from "../../model/LinearModel";
import {Text} from "../../svg/Text";

export class LinearAxis extends Axis {

    public static readonly ClassName: string = 'linear-axis ' + Axis.ClassName;

    constructor(property: AxisProperty) {
        super(property);
    }

    protected draw(parentSvgContext: SvgContext): SvgObject {
        super.draw(parentSvgContext);
        this._drawAxis();
        return this;
    }

    private _drawAxis() {
        let {view, model, type} = this;
        let {width, height} = <View>view;
        let {tickSize, tickPadding, tickValues, scale, name} = <LinearModel>model;
        let axis, x, y;

        if (type === 'axisTop') {
            axis = d3.axisTop(scale);
            x = width + 40;
            y = 0;
        } else if (type === 'axisBottom') {
            axis = d3.axisBottom(scale);
            x = width + 40;
            y = 0;
        } else if (type === 'axisLeft') {
            axis = d3.axisLeft(scale);
            x = 0;
            y = -10;
        } else if (type === 'axisRight') {
            axis = d3.axisRight(scale);
            x = 0;
            y = -10;
        } else {
            return this;
        }

        let format = <(domainValue: any, index: number) => string>d3.format(".2f");
        axis.tickSize(tickSize).tickPadding(tickPadding).tickValues(tickValues).tickFormat(format);//.ticks(7)
        this.call(axis);
        //this.append(new G({})).classed('y-axis', true).call(axis);
        this.append(new Text({x: x, y: y, class:'axis-text'})).text(name);

        //虚线 Y
        //this.getSvgContext().selectAll(".y-axis .tick").append("line").attr("stroke-dasharray", 2).attr("x2", 100).style("opacity", 0.5);
    }

}
