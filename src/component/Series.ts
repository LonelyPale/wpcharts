import {Component, ComponentProperty} from "./Component";
import {View} from "../view/View";
import {log} from "../util/debug";
import {Model} from "../model/Model";
import {LegendManager} from "./legend/LegendManager";
import {LinearAxis} from "./axis/LinearAxis";
import {Line} from "../svg/Line";
import {config} from "../config";
import {Rect} from "../svg/Rect";
import d3 from "d3";
import {Path} from "../svg/Path";
import {Table} from "../rdb/Table";
import {LineObject} from "../object/LineObject";

export interface SeriesProperty extends ComponentProperty {
    table: Table;
}

export class Series extends Component {

    public static readonly ClassName: string = 'series';

    topComponent!: Component;
    bottomComponent!: Component;
    leftComponent!: Component;
    rightComponent!: Component;
    gridComponent!: Component;

    backgroundComponent!: Component;

    linesComponent!: Component;
    pointsComponent!: Component;
    legendsComponent!: Component;

    legends: string[] = [];
    table: Table;

    cache: { [key: string]: any } = {};
    modelMap: { [key: string]: Model<number | string | Date> } = {};
    //lineMap: { [key: string]: any } = {};
    lineMap: { [key: string]: LineObject } = {}; //线
    legendManager: LegendManager = new LegendManager();

    constructor(property: SeriesProperty) {
        super(property);
        this.table = property.table;
    }

    protected drawDottedLine(num: number, type: 'horizontal' | 'vertical') {
        let {width, height} = this.gridComponent.getView();
        let space = type === 'horizontal' ? height / num : width / num;
        if (type === 'horizontal') {
            for (let i = 1; i < num; i++) {
                let interval = space * i + 0.5;
                let line = new Line({y1: interval, y2: interval, x2: width, stroke: 'black', 'stroke-width': 1, "stroke-dasharray": 2, opacity: 0.5});
                this.backgroundComponent.append(line);
            }
        } else if (type === 'vertical') {
            for (let i = 1; i < num; i++) {
                let interval = space * i + 0.5;
                let line = new Line({x1: interval, x2: interval, y2: height, stroke: 'black', 'stroke-width': 1, "stroke-dasharray": 2, opacity: 0.5});
                this.backgroundComponent.append(line);
            }
        }
    }

    //# initComponent
    public init(): this {
        if (!this.getSvgContext()) {
            log.e.call(this, "this.context is undefined or null");
            return this;
        }

        this.view = this.view || new View({}, this);
        let {width, height, top, bottom, left, right} = this.view;

        this.topComponent = new Component({attribute: {class: 'top'}});
        this.bottomComponent = new Component({attribute: {class: 'bottom'}});
        this.leftComponent = new Component({attribute: {class: 'left'}});
        this.rightComponent = new Component({attribute: {class: 'right'}});
        this.gridComponent = new Component({attribute: {class: 'grid'}});

        this.topComponent.setView({x: 0, y: 0, width, height: top});
        this.bottomComponent.setView({x: 0, y: height - bottom, width, height: bottom, left: left, right: right});
        this.leftComponent.setView({x: 0, y: top, width: left, height: height - top - bottom});
        this.rightComponent.setView({x: width - right, y: top, width: right, height: height - top - bottom});
        this.gridComponent.setView({x: left, y: top, width: width - left - right, height: height - top - bottom});

        this.append(this.topComponent);
        this.append(this.bottomComponent);
        this.append(this.leftComponent);
        this.append(this.rightComponent);
        this.append(this.gridComponent);

        let {width: gw, height: gh} = this.gridComponent.getView();

        if (config.browser.chrome && config.os.group.indexOf('windows') > -1) {
            this.gridComponent.style({cursor: 'url("/wpcharts/dist/css/image/empty-1x1-white.png"),crosshair'});
        } else {
            this.gridComponent.style({cursor: 'url("/wpcharts/dist/css/image/empty-1x1.png"),crosshair'});
        }

        this.backgroundComponent = new Component({attribute: {class: 'background'}});
        this.gridComponent.append(this.backgroundComponent);

        this.backgroundComponent.append(new Rect({x: 0.5, y: 0, width: gw - 1, height: gh, fill: 'none', stroke: 'black', 'stroke-width': 1}));

        //# 线、点、图例
        this.linesComponent = <Component>this.gridComponent.append(new Component({attribute: {class: 'lines'}}));
        this.pointsComponent = <Component>this.gridComponent.append(new Component({attribute: {class: 'points'}}));
        this.legendsComponent = <Component>new Component({attribute: {class: 'legends'}}).setView({
            x: 0,
            y: 8,
            width: width,
            height: top,
            boxOrient: "horizontal"
        });
        this.topComponent.append(this.legendsComponent);

        return this;
    }

    public initXAxis(): this {
        let {modelMap: {time}} = this;
        this.drawDottedLine(time.tickValues.length, 'vertical');
        return this;
    }

    public initYAxis(): this {
        let {modelMap} = this;

        let modelArray = Object.values(modelMap);
        for (let i = 0; i < modelArray.length; i++) {
            let model = modelArray[i];
            if (model.name === 'time') continue;
            let linearAxis = new LinearAxis({model, type: 'axisLeft'}).setView({x: 0, y: -0.5, height: this.gridComponent.getView().height});
            this.leftComponent.append(linearAxis);
            this.drawDottedLine(model.tickValues.length - 1, "horizontal");
        }

        return this;
    }

    public initLegend(): this {
        let {legendManager, legends, legendsComponent} = this;
        for (let i = 0; i < legends.length; i++) {
            let legendName = legends[i];
            legendManager.get(legendName).drawLegend(legendsComponent, legendName);
        }
        return this;
    }

    public initLines(): void {
        let {lineMap, table, legendsComponent} = this;

        for (let line of Object.values(lineMap)) {
            let {data, legendObject, xModel: {scale: xScale}, yModel: {scale: yScale}} = line;
            let lineGenerator = null;

            if (data.length === 0) continue;//跳过没有数据的线

            //用闭包保存住当前循环的i的值。
            (function (yScale) {
                lineGenerator = d3.line()
                    .x(function (d: any, index: number, data: any[]) {
                        //console.log(d, index, data);
                        return xScale(table.field('SuvDate', d));
                    })
                    .y(function (d: any, index: number, data: any[]) {
                        return yScale(table.field('Val', d));
                    });
            })(yScale);

            this.linesComponent.append(new Path({d: <string>lineGenerator(data), stroke: legendObject.color, class: 'line'}));

            //统计模型过程线: 使用单独的图例和颜色, 没有使用通用图例
            legendObject.drawLegend(legendsComponent, line.legend);
        }

    }

    public initPoints(): void {
        let {lineMap, modelMap, table} = this;

        for (let line of Object.values(lineMap)) {
            let {data, legendObject, xModel: {scale: xScale}, yModel: {scale: yScale}} = line;

            let pointsLength = data.length;
            let pointsSpace = Math.floor(data.length / 10);
            let point, j, x, y;
            if (pointsLength <= 12) {
                //显示所有的点
                for (j = 0; j < pointsLength; j++) {
                    point = data[j];
                    x = xScale(table.field('SuvDate', point));
                    y = yScale(table.field('Val', point));
                    legendObject.draw(this.pointsComponent, x, y);
                }
            } else {
                //显示最多12个点
                for (j = 1; j <= 10; j++) {
                    if (pointsLength === (j * pointsSpace)) {
                        //能整除的情况，最后一个点会重合，如：20，300
                        point = data[j * pointsSpace - Math.floor(pointsSpace / 2)];
                    } else {
                        point = data[j * pointsSpace];
                    }
                    x = xScale(table.field('SuvDate', point));
                    y = yScale(table.field('Val', point));
                    legendObject.draw(this.pointsComponent, x, y);
                }
                legendObject.draw(this.pointsComponent, xScale(table.field('SuvDate', data[0])), yScale(table.field('Val', data[0])));//第一个点
                legendObject.draw(this.pointsComponent, xScale(table.field('SuvDate', data[pointsLength - 1])), yScale(table.field('Val', data[pointsLength - 1])));//最后一个点
            }
        }

    }

}
