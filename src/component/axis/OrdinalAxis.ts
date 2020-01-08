import d3 from "d3";
import {Axis, AxisProperty} from "./Axis";
import {OrdinalModel} from "../../model/OrdinalModel";
import {SvgContext, SvgObject} from "../../svg/SvgObject";
import {Text} from "../../svg/Text";
import {View} from "../../view/View";

export class OrdinalAxis extends Axis {

    public static readonly ClassName: string = 'ordinal-axis ' + Axis.ClassName;

    constructor(property: AxisProperty) {
        super(property);
    }

    protected draw(parentSvgContext: SvgContext): SvgObject {
        super.draw(parentSvgContext);
        this._drawAxis();
        return this;
    }

    private _drawAxis() {
        let {model, type, view} = this;
        let {tickSize, tickPadding, tickValues, scale, name} = <OrdinalModel>model;
        let x = 0, y = 0;
        let axis;

        if (type === 'axisTop') {
            axis = d3.axisTop(scale);
            x = (<View>view).width + 40;
            y = 0;
        } else if (type === 'axisBottom') {
            axis = d3.axisBottom(scale);
            x = (<View>view).width + 40;
            y = 0;
        } else if (type === 'axisLeft') {
            axis = d3.axisLeft(scale);
            y = -10;
        } else if (type === 'axisRight') {
            axis = d3.axisRight(scale);
            y = -10;
        } else {
            return this;
        }

        axis.tickSize(tickSize).tickPadding(tickPadding);
        this.call(axis);
        this.append(new Text({x: x, y: y, class:'axis-text'})).text(name);
    }

}
