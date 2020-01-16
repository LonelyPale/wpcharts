import d3 from "d3";
import {Chart, ChartConstructor} from "./Chart";
import {clone} from "../util/common";
import {formatTime, parseTime, TimeModel} from "../model/TimeModel";
import {LinearModel} from "../model/LinearModel";
import {TimeAxis} from "../component/axis/TimeAxis";
import {OrdinalAxis} from "../component/axis/OrdinalAxis";
import {OrdinalModel} from "../model/OrdinalModel";
import {Schema} from "../rdb/Schema";
import {LinearAxis} from "../component/axis/LinearAxis";
import {Path} from "../svg/Path";
import {Text} from "../svg/Text";
import {G} from "../svg/G";
import {TooltipsEvent} from "../event/EventTypes";
import {lately} from "../util/array";
import {View} from "../view/View";
import {TimeFieldName, TimeModelName} from "../constant";

export class Distribution extends Chart {

    public static readonly clazz: string = "distribution";
    public static readonly title: string = "分布图";

    isHorizontal: boolean = true;

    xAxisName!: string;
    yAxisName!: string;

    points: any[] = []; //所有测点集

    lines: any = {}; //已绘制的线

    constructor(selector: string) {
        super(selector);

        let schema: Schema = {
            name: Distribution.clazz,
            properties: {
                PointId: 'string',
                Unit: 'string',
                SuvDate: 'Date',
                Value: 'number',
                pointX: 'number',
                pointY: 'number',
                plotAngle: 'number',
                valueY: 'number',
            }
        };
        this.table = this.db.create(schema);
    }

    protected initData(): void {
        this.clear();

        let {option: {data}, table} = this;

        this.data = clone(data && data.pointCategories ? data : data.object);

        if (this.option.isHorizontal !== undefined) {
            this.isHorizontal = this.option.isHorizontal;
        } else if (this.data.isHorizontal !== undefined) {
            this.isHorizontal = this.data.isHorizontal;
        }

        if (!this.isHorizontal) {
            this.option.view.height = 750;
            this.option.view.left = 300;
            this.option.view.right = 300;
            this.xAxisName = data.valueAxisName;
            this.yAxisName = data.categoryAxisName;
        } else {
            this.xAxisName = data.categoryAxisName;
            this.yAxisName = data.valueAxisName;
        }

        let usedData = this.data;

        for (let i = 0, len = usedData.suvDateList.length; i < len; i++) {
            let date = usedData.suvDateList[i];

            for (let j = 0, length = usedData.pointCategories.length; j < length; j++) {
                let pointId = usedData.pointCategories[j];
                let unit = usedData.valueAxisName;
                let suvDate = <Date>parseTime(date);
                let value = usedData.dataList[j][i];
                let pointX, pointY, plotAngle, valueY;

                value = value ? parseFloat(value) : value;

                //# 带背景图使用
                if (!!usedData.imageFile) {
                    pointX = usedData.pointX[j];
                    pointY = usedData.pointY[j];
                    plotAngle = usedData.plotAngle[j];

                    let dataYList = usedData.dataYList;
                    if (!!dataYList) {
                        valueY = dataYList[j][i];
                        valueY = valueY ? parseFloat(valueY) : valueY;
                    }
                }

                let row = table.insert([pointId, unit, suvDate, value, pointX, pointY, plotAngle, valueY]);
            }
        }

        /*if (usedData.pointCategories[usedData.pointCategories.length - 1] === "孔底") {//测斜仪分布图:倒置数据
            for (let i = usedData.pointCategories.length - 1; i >= 0; i--) {
                this.points.push(usedData.pointCategories[i]);
            }
        } else {//普通分布图
            for (let i = 0, len = usedData.pointCategories.length; i < len; i++) {
                this.points.push(usedData.pointCategories[i]);
            }
        }*/

        for (let i = 0, len = usedData.pointCategories.length; i < len; i++) {
            this.points.push(usedData.pointCategories[i]);
        }

        this.title = this.data.title || this.title;

        //备份表
        this.tableBackup = table.copy(Distribution.clazz + '-backup');
    }

    protected initModel(): void {
        let {modelMap, lineMap, cache, isHorizontal, points, table, option, reverseAxis} = this;
        let {width, height} = this.gridComponent.getView();

        //# 初始化模型
        modelMap[TimeModelName] = new TimeModel(TimeModelName, TimeFieldName, 'horizontal', table.columns('SuvDate'));
        modelMap[TimeModelName].range = isHorizontal ? [0, width] : [0, option.view.width - 200];
        modelMap[TimeModelName].init();

        let xModel, yModel;
        if (!isHorizontal) {
            xModel = new LinearModel(this.xAxisName, 'Value', 'horizontal', table.columns('Value'));
            yModel = new OrdinalModel(this.yAxisName, 'PointId', 'vertical', points);
        } else {
            xModel = new OrdinalModel(this.xAxisName, 'PointId', 'horizontal', points);
            yModel = new LinearModel(this.yAxisName, 'Value', 'vertical', table.columns('Value'));
        }

        modelMap[this.xAxisName] = xModel;
        modelMap[this.yAxisName] = yModel;

        xModel.range = [0, width];
        yModel.range = [height, 0];

        xModel.tickSize = 0;
        yModel.tickSize = 0;

        xModel.tickPadding = 5;
        yModel.tickPadding = 20;

        xModel.init();
        yModel.init();

        let usedData = this.data;
        if (reverseAxis) {
            if (usedData.pointCategories[usedData.pointCategories.length - 1] === "孔底") {
                yModel.reverse();
            } else {
                if (isHorizontal) {
                    yModel.reverse();
                } else {
                    xModel.reverse();
                }
            }
        }

        //# 初始化线 and 初始化全局索引
        let rows = table.getRows();
        for (let i = 0; i < rows.length; i++) {
            let row = rows[i];
            let suvDate = row.get('SuvDate');
            let niceDate = formatTime(suvDate);

            if (!lineMap[niceDate]) {
                lineMap[niceDate] = {data: [row.get()]};//#初始化线
            } else {
                lineMap[niceDate].data.push(row.get());//#追加线数据
            }
        }

    }

    protected initLegend(): void {
    }

    protected initXAxis(): void {
        this.bottomComponent.getView().boxOrient = 'vertical';

        let {isHorizontal, option} = this;
        let {width} = this.gridComponent.getView();
        let {time} = this.modelMap;
        let timeAxis = new TimeAxis({
            model: time,
            // @ts-ignore
            click: (time: string) => {
                this.onClickTime(time);
            }
        });

        if (isHorizontal) {
            timeAxis.setView({width, height: 80, boxOrient: "vertical"});
        } else {
            timeAxis.setView({x: -200, width: option.view.width - 200, height: 80, boxOrient: "vertical"});
        }

        let xAxisModel = this.modelMap[this.xAxisName];
        let xAxis;
        if (isHorizontal) {
            xAxis = new OrdinalAxis({model: xAxisModel, type: "axisBottom"}).setView({width, height: 20});
        } else {
            xAxis = new LinearAxis({model: xAxisModel, type: "axisBottom"}).setView({width, height: 20});
        }

        this.bottomComponent.append(xAxis);
        this.bottomComponent.append(timeAxis);
        this.drawDottedLine(xAxisModel.tickValues.length - 1, 'vertical');
    }

    protected initYAxis(): void {
        let {isHorizontal} = this;
        let {width} = this.leftComponent.getView();
        let {height} = this.gridComponent.getView();

        let yAxis;
        let yAxisModel = this.modelMap[this.yAxisName];
        if (isHorizontal) {
            yAxis = new LinearAxis({model: yAxisModel, type: "axisLeft"}).setView({x: width, y: -0.5, height});
        } else {
            yAxis = new OrdinalAxis({model: yAxisModel, type: "axisLeft"}).setView({x: width, y: -0.5, height});
        }

        this.leftComponent.append(yAxis);
        this.drawDottedLine(yAxisModel.tickValues.length - 1, 'horizontal');
    }

    protected initLines(): void {
        //生成月报用图时，默认绘制全部线，且不绘制时间轴和点击条
        let {lineMap, legendManager} = this;
        let {defaultDraw} = this.option;
        if (defaultDraw) {
            let lineKeys = Object.keys(lineMap);
            let len = lineKeys.length > 12 ? 12 : lineKeys.length;
            for (let i = 0; i < len; i++) {
                let time = lineKeys[i];
                let lineObj = lineMap[time];
                lineObj.time = time;
                lineObj.legend = legendManager.add(time);
                this.drawLineClick(lineObj);
                this.drawLegendClick(lineObj);
                if (!this.data.dataYList) this.drawPointClick(lineObj);
            }
            
            //隐藏 时间轴和点击条
            let svg = this.svg.getSvgContext();
            svg.selectAll(".time-axis").style("display", "none");
        }
    }

    protected initPoints(): void {
    }

    protected drawLineClick(line: any): void {
        let {modelMap, table} = this;

        let points = line.data;
        let legend = line.legend;
        let isHorizontal = this.isHorizontal;
        let scaleX = modelMap[this.xAxisName].scale;
        let scaleY = modelMap[this.yAxisName].scale;
        let lineGenerator = null;

        lineGenerator = d3.line()
            .x(function (d: any) {
                if (isHorizontal) {
                    return scaleX(table.field('PointId', d));
                } else {
                    return scaleX(table.field('Value', d));
                }
            })
            .y(function (d: any) {
                if (isHorizontal) {
                    return scaleY(table.field('Value', d));
                } else {
                    return scaleY(table.field('PointId', d));
                }
            })
            .defined(function (d: any) {
                return table.field('Value', d) !== null;
            });

        if (points && points.length > 0) {
            this.linesComponent.append(new Path({d: <string>lineGenerator(points), stroke: legend.color, 'stroke-width': 1, fill: 'none', class: 'line'}));
        }
    }

    protected drawPointClick(line: any): void {
        let {modelMap, table} = this;

        let points = line.data;
        let legend = line.legend;
        let isHorizontal = this.isHorizontal;
        let scaleX = modelMap[this.xAxisName].scale;
        let scaleY = modelMap[this.yAxisName].scale;

        for (let i = 0, len = points.length; i < len; i++) {
            let valueX = isHorizontal ? table.field('PointId', points[i]) : table.field('Value', points[i]);
            let valueY = isHorizontal ? table.field('Value', points[i]) : table.field('PointId', points[i]);

            if (!valueY && valueY !== 0) continue;

            let x = scaleX(valueX);
            let y = scaleY(valueY);
            legend.draw(this.pointsComponent, x, y);
        }
    }

    protected drawLegendClick(line: any): void {
        let {time, legend} = line;
        legend.drawLegend(this.legendsComponent, time.substr(0, 10));//time.substr(0, 10)
    }

    protected onClickTime(time: string): void {
        let {legendManager, lineMap, lines, isHorizontal, cache, table} = this;

        if (lines[time] || Object.keys(lines).length >= 12) return;//已绘制此线,重复点击 或 超过12根线

        let size = legendManager.getSize();
        if (size > 0) {
            console.log('onClickTime:', time);

            let lineObj = lineMap[time];
            lineObj.time = time;
            lineObj.legend = legendManager.add(time);

            this.drawLineClick(lineObj);
            this.drawLegendClick(lineObj);
            if (!this.data.dataYList) this.drawPointClick(lineObj);

            lines[time] = lineObj;
            for (let i = 0; i < lineObj.data.length; i++) {
                let row = lineObj.data[i];
                let pointId = table.field('PointId', row);
                let value = table.field('Value', row);

                let key;
                if (isHorizontal) {
                    key = pointId;
                } else {
                    key = value;
                }
                let objCache = cache[key];
                if (objCache) {
                    objCache.push(row);
                } else {
                    cache[key] = [row];
                }
            }

        }

    }

    protected initEvent() {
        super.initEvent();

        this.svg.on(TooltipsEvent, (datum: any, index: number, groups: any) => {
            let {detail: {mouse, target: tooltips}} = d3.event;

            let {table, cache, modelMap, legendManager, option: {view: parentView}, xAxisName, isHorizontal} = this;
            let {scale, data} = modelMap[xAxisName];

            let value;
            if (isHorizontal) {
                let valueX = mouse[0];
                let valueX2 = mouse[0] + 3;
                let limitError = Math.abs(valueX - valueX2);

                let range = modelMap[xAxisName].range;
                let domain = modelMap[xAxisName].domain;

                value = lately(range, valueX, limitError); //# 计算最逼近目标的值
                if (value === null) return;

                let i = range.indexOf(value);
                value = domain[i];
            } else {
                let valueX = scale.invert(mouse[0]);
                let valueX2 = scale.invert(mouse[0] + 3);
                let limitError = Math.abs(valueX - valueX2);
                value = lately(Object.keys(cache), valueX, limitError); //# 计算最逼近目标的值
                if (value === null) return;
            }

            let pointRowArray = cache[value];
            if (!pointRowArray) return;

            let tooltipsView: View = new View({
                width: parentView.width / 2,
                height: parentView.height / 2,
                top: 22,
                bottom: 5,
                left: 5,
                right: 5
            }, tooltips.getSvgContext());
            let nodeView: View = new View({width: 145, height: isHorizontal ? 52 : 37}, tooltips.getSvgContext());

            tooltips.refresh(pointRowArray.length, mouse, parentView, tooltipsView, nodeView, 145);
            tooltips.append(new Text({x: 5})).text(`${xAxisName}: ${value}`);

            for (let i = 0; i < pointRowArray.length; i++) {
                let row = pointRowArray[i];
                let pointId = table.field('PointId', row);
                let unit = table.field('Unit', row);
                let value = table.field('Value', row);
                let date = table.field('SuvDate', row);

                let niceDate = formatTime(date);
                let legend = legendManager.get(niceDate);

                let g = tooltips.append(new G().setView({width: 145, height: 15}));
                legend.draw(g, 5, 12, 50);
                g.append(new Text({x: 15})).text(`${pointId}`);
                if (isHorizontal) {
                    tooltips.append(new Text().setView({width: 120, height: 15})).text(`${unit}: ${value}`);
                    tooltips.append(new Text().setView({width: 145, height: 22})).text(niceDate);
                } else {
                    tooltips.append(new Text().setView({width: 145, height: 22})).text(niceDate);
                }
            }
        });

    }

    protected clear() {
        super.clear();
        this.lines = [];
    }
}
