import {SvgContext, SvgObject} from "../../svg/SvgObject";
import {Axis, AxisProperty} from "./Axis";
import {View} from "../../view/View";
import {formatTime, TimeModel} from "../../model/TimeModel";
import {Line} from "../../svg/Line";
import {G} from "../../svg/G";
import {Text} from "../../svg/Text";
import {Circle} from "../../svg/Circle";

interface TimeAxisProperty extends AxisProperty {
    click?: () => {}
}

export class TimeAxis extends Axis {

    public static readonly ClassName: string = 'time-axis ' + Axis.ClassName;

    constructor(property: TimeAxisProperty) {
        super(property);
    }

    protected draw(parentSvgContext: SvgContext): SvgObject {
        super.draw(parentSvgContext);
        this._drawAxis();
        return this;
    }

    private _drawAxis() {
        let {model, view} = this;
        let {width, height} = <View>view;
        let {data, scale, time_group} = <TimeModel>model;

        let {click} = this.property;
        if (click && typeof click === "function") {
            let clickAxis = this.append(new G({class: 'clickAxis'}).setView({width: width, height: 15}));
            let svgContext = clickAxis.getSvgContext();
            for (let i = 0, len = data.length; i < len; i++) {
                let date = data[i];
                let xAxis_circle_x = scale(date);
                clickAxis.append(new Circle({
                    cx: xAxis_circle_x,//圆心坐标x
                    cy: 4,//圆心坐标y
                    r: 3,//半径
                    fill: 'green',//填充色
                    stroke: 'orange',//圆边色
                    "stroke-width": 0,//圆边厚度
                    "data-time": formatTime(date),
                })).on("click", (a, b: number, c: any) => {
                    //console.log(arguments, c);
                    click(c[b].attributes["data-time"].nodeValue);
                });

                /*
                svgContext.append("circle")
                    .attr("data-time", formatTime(date))
                    .attr("cx", xAxis_circle_x)
                    .attr("cy", 4)
                    .attr("r", 3)
                    .attr("fill", "green")
                    .attr("stroke", "orange")
                    .attr("stroke-width", 0)
                    .on("click", (a, b: number, c: any) => {
                        //console.log(arguments, c);
                        click(c[0].attributes["data-time"].nodeValue);
                    });
                */
            }
        }

        let timeAxis = this.append(new G({class: 'timeAxis'}).setView({width: width, height: height - 15}));
        let line1 = timeAxis.append(new Line({x2: width, class: 'tick-line'}));
        let line2 = timeAxis.append(new Line({y1: 20, x2: width, y2: 20, class: 'tick-line'}));
        let tick_group = timeAxis.append(new G()).classed('tick-group', true).transform('translate(0.5, 0)');

        let ticks1_len = time_group.times1.length;
        let tick1_width = width / ticks1_len;
        let tick1_text = tick1_width / 2;

        let tick1 = tick_group.append(new G()).classed('tick1', true);
        for (let i = 0; i < ticks1_len; i++) {
            let tick = tick1.append(new G()).classed('tick', true).transform(`translate(${tick1_width * i}, 0)`);
            tick.append(new Line({y2: 20, class: 'tick-line'}));
            tick.append(new Text({class: 'tick-text'})).text(time_group.times1[i]).transform(`translate(${tick1_text}, -3)`);
            //if (i !== 0) {
            //虚线X
            //tick.append(new Line({y2: -height || -100, "stroke-dasharray": 2, opacity: 0.5}));//todo
            //}
        }
        let t = tick1.append(new G()).classed('tick', true).transform(`translate(${width - 1}, 0)`);
        t.append(new Line({y2: 20, class: 'tick-line'}));

        //虚线X right
        //t.append(new Line({y2: -height || -100, "stroke-dasharray": 2, opacity: 0.5}));//todo

        if (time_group.times2.length > 0) {
            let line3 = timeAxis.append(new Line({y1: 40, x2: width, y2: 40, class: 'tick-line'}));

            let tick2 = tick_group.append(new G()).classed('tick2', true).transform(`translate(0, 20)`);
            tick2.append(new G()).classed('tick', true).append(new Line({y2: 20, class: 'tick-line'}));

            let ticks2_len = time_group.times2.length;
            let tick2_width = 0;
            let tick2_text = 0;
            for (let j = 0; j < ticks2_len; j++) {
                let time2 = time_group.times2[j];
                tick2_width += tick1_width * time2.len;
                tick2_text = tick1_width * time2.len / 2;
                let tick = tick2.append(new G()).classed('tick', true);
                if (j === ticks2_len - 1) {
                    tick.transform(`translate(${tick2_width - 1}, 0)`);
                } else {
                    tick.transform(`translate(${tick2_width}, 0)`);
                }
                tick.append(new Line({y2: 20, class: 'tick-line'}));
                tick.append(new Text({class: 'tick-text'})).text(time2.text).transform(`translate(${-tick2_text}, -3)`);
            }
        }

    }

}
