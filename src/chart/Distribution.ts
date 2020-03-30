import d3, {ArrayLike} from "d3";
import {Chart, ChartConstructor} from "./Chart";
import {clone} from "../util/common";
import {day, formatTime, parseTime, TimeModel} from "../model/TimeModel";
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
import {LineObject} from "../object/LineObject";
import {Line} from "../svg/Line";
import {Rect} from "../svg/Rect";
import {Component} from "../component/Component";
import {Legend} from "../component/legend/Legend";

export class Distribution extends Chart {

    public static readonly clazz: string = "distribution";
    public static readonly title: string = "分布图";

    isHorizontal: boolean = true;

    xAxisName!: string;
    yAxisName!: string;

    points: string[] = []; //所有测点集
    pointsPosition: number[] = []; //所有测点集坐标位置

    lines: any = {}; //已绘制的线

    moveLineComponent!: Component; //粘合移动线

    constructor(selector: string) {
        super(selector);

        let schema: Schema = {
            name: Distribution.clazz,
            properties: {
                PointId: 'string',
                Unit: 'string',
                Legend: 'string',
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

                let legend = formatTime(suvDate); //niceDate
                let row = table.insert([pointId, unit, legend, suvDate, value, pointX, pointY, plotAngle, valueY]);
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

        if(usedData.pointCategories && usedData.pointCategories.length > 0) {
            for (let i = 0, len = usedData.pointCategories.length; i < len; i++) {
                this.points.push(usedData.pointCategories[i]);
            }
        }

        if(usedData.pointPosition && usedData.pointPosition.length > 0) {
            for (let pos of usedData.pointPosition) {
                this.pointsPosition.push(pos);
            }
        }

        this.title = this.data.title || this.title;

        //备份表
        this.tableBackup = table.copy(Distribution.clazz + '-backup');
    }

    protected initModel(): void {
        let {modelMap, lineMap, cache, isHorizontal, points, pointsPosition, table, option, reverseAxis} = this;
        let {width, height} = this.gridComponent.getView();

        //# 初始化模型
        modelMap[TimeModelName] = new TimeModel(TimeModelName, TimeFieldName, 'horizontal', table.columns('SuvDate'));
        modelMap[TimeModelName].range = isHorizontal ? [0, width] : [0, option.view.width - 200];
        modelMap[TimeModelName].init();

        let xModel, yModel;
        if (!isHorizontal) {
            xModel = new LinearModel(this.xAxisName, 'Value', 'horizontal', table.columns('Value'));
            yModel = new OrdinalModel(this.yAxisName, 'PointId', 'vertical', points, pointsPosition);
        } else {
            xModel = new OrdinalModel(this.xAxisName, 'PointId', 'horizontal', points, pointsPosition);
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

            let pointId = row.get('PointId');
            let unit = row.get('Unit');
            let legend = row.get('Legend');

            //# 不存在时间相同的多条线，一个时间只有一条线。
            if (!lineMap[niceDate]) {
                //lineMap[niceDate] = {data: [row.get()]};//#初始化线
                let lineObject = new LineObject(pointId, unit, legend);//#初始化线
                lineObject.data = [row.get()];
                lineObject.table = table;
                lineObject.xModel = xModel;
                lineObject.yModel = yModel;
                lineMap[niceDate] = lineObject;
            } else {
                lineMap[niceDate].data.push(row.get());//#追加线数据
            }
        }

    }

    protected initView(): void {
        super.initView();

        //# 粘合-移动线
        this.moveLineComponent = <Component>this.gridComponent.append(new Component({attribute: {class: 'move-line'}}));
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
            this.drawDottedLine(xAxisModel.range, 'vertical');
        } else {
            xAxis = new LinearAxis({model: xAxisModel, type: "axisBottom"}).setView({width, height: 20});
            this.drawDottedLine(xAxisModel.tickValues.length - 1, 'vertical');
        }

        //# 分布图: 时间轴移动鼠标时的事件需要的范围  - timeAxisView.left - timeAxisView.right
        let timeAxisView = timeAxis.getView();
        this.bottomComponent.append(new Rect({x: timeAxisView.x, width: timeAxisView.width, height: timeAxisView.height, class:'bottom-rect', fill: 'white'}).setView({}));

        this.bottomComponent.append(xAxis);
        this.bottomComponent.append(timeAxis);
    }

    protected initYAxis(): void {
        let {isHorizontal} = this;
        let {width} = this.leftComponent.getView();
        let {height} = this.gridComponent.getView();

        let yAxis;
        let yAxisModel = this.modelMap[this.yAxisName];
        if (isHorizontal) {
            yAxis = new LinearAxis({model: yAxisModel, type: "axisLeft"}).setView({x: width, y: -0.5, height});
            this.drawDottedLine(yAxisModel.tickValues.length - 1, 'horizontal');
        } else {
            yAxis = new OrdinalAxis({model: yAxisModel, type: "axisLeft"}).setView({x: width, y: -0.5, height});
            this.drawDottedLine(yAxisModel.range, 'horizontal');
        }

        this.leftComponent.append(yAxis);
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
                lineObj.legendObject = legendManager.add(time);
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

    protected drawLineClick(line: LineObject): void {
        let {modelMap, table} = this;

        let points = line.data;
        let legend = line.legendObject;
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

    protected drawPointClick(line: LineObject): void {
        let {modelMap, table} = this;

        let points = line.data;
        let legend = line.legendObject;
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

    protected drawLegendClick(line: LineObject): void {
        let {pointId, unit, legend, legendObject} = line;
        legendObject.drawLegend(this.legendsComponent, legend.substr(0, 10), 60, {pointId, unit, legend});
    }

    protected onClickTime(time: string): void {
        let {legendManager, lineMap, lines, isHorizontal, cache, table} = this;

        if (lines[time] || Object.keys(lines).length >= 12) return;//已绘制此线,重复点击 或 超过12根线

        let size = legendManager.getSize();
        if (size > 0) {
            console.log('onClickTime:', time);

            let lineObj = lineMap[time];
            lineObj.legendObject = legendManager.add(time);

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

        //# 时间轴粘合线
        let bottomView = this.bottomComponent.getView();
        let vline = new Line({y1: -(bottomView.height - 75), y2: -bottomView.height, stroke: 'red', 'stroke-width': 2}).setView({});
        this.bottomComponent.append(vline).hide();
        vline.on('click', (datum: any, index: number, groups: any[] | ArrayLike<any>) => {
            d3.event.preventDefault();
            let mouse = d3.mouse(groups[index]);
            let [x, y] = mouse;

            //垂直图时要计算偏移
            if(!this.isHorizontal) {
                x += 200;
            }console.log(x);

            let line = this.queryTimeLine(x);//点击时不需要减去左边的宽度
            if(line) {
                this.onClickTime(line.legend);
                this.clearMoveLine();
            }
        });
        //鼠标移入 mouseover
        this.bottomComponent.on('mouseenter', () => {
            d3.event.preventDefault();
            vline.show();
        });
        //鼠标移出 mouseout
        this.bottomComponent.on('mouseleave', () => {
            d3.event.preventDefault();
            vline.hide();
            setTimeout(() => this.clearMoveLine(), 100);
        });
        //鼠标移动
        let timerMouseMoveEvent: any;
        this.bottomComponent.on('mousemove', (datum: any, index: number, groups: any[] | ArrayLike<any>) => {
            d3.event.preventDefault();
            let mouse = d3.mouse(groups[index]);
            let [x, y] = mouse;
            x = x - bottomView.left;//移动时需要减去左边的宽度
            vline.attr({x1: x, x2: x});

            //垂直图时要计算偏移
            if(!this.isHorizontal) {
                x += 200;
            }

            clearTimeout(timerMouseMoveEvent);
            timerMouseMoveEvent = setTimeout(() => {
                let line = this.queryTimeLine(x);
                if(line) {
                    console.log('move-line:', line.legend);
                    this.clearMoveLine();
                    this.showMoveLine(line);
                } else {
                    this.clearMoveLine();
                }
            }, 100);
        });

        //# 提示信息
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

    queryTimeLine(xCoordinate: number): LineObject | null {
        let timeModel = this.modelMap['time'];
        let timeScale = timeModel.scale;
        let xValue = <Date>timeScale.invert(xCoordinate);

        let timeTempArray: any[][] = [];
        let timeIndex = Object.keys(this.lineMap);
        for(let timeStr of timeIndex) {
            let time: Date | null = parseTime(timeStr);
            if(time) {
                let timeDifference: number = Math.abs(time.getTime() - xValue.getTime());
                if(timeDifference < day * 7) {
                    timeTempArray.push([time, timeDifference]);
                }
            }
        }
        //console.log(333, timeTempArray);

        let timeSelected;
        if(timeTempArray.length > 0) {
            timeSelected = timeTempArray[0];
            if(timeTempArray.length > 1) {
                for(let i = 1; i < timeTempArray.length; i++) {
                    if(timeSelected[1] > timeTempArray[i][1]) {
                        timeSelected = timeTempArray[i];
                    }
                }
            }
        }
        //console.log(444, timeSelected, formatTime(timeSelected[0]));

        if(timeSelected) {
            let time = formatTime(timeSelected[0]);
            let line = this.lineMap[time];
            if(line) {
                return line;
            }
        } else {
            console.log('timeEvent:current:not-find:', formatTime(xValue));
        }

        return null;
    }

    //显示移动线
    showMoveLine(line: LineObject) {
        let legendObject = new Legend({
            name: 'solid_star',
            color: 'Red',
            generator: d3.symbol().type(d3.symbolStar),
            fill: true,
            width: 1,
            style: 'style1',
            legend: 'symbolStarSolid'
        });
        line.draw(this.moveLineComponent, this.moveLineComponent, legendObject);
    }

    //清除移动线
    clearMoveLine() {
        d3.select(this.selector).select(".move-line").selectAll("*").remove();
    }

}
