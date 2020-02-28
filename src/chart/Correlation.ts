import d3 from "d3";
import {Chart} from "./Chart";
import {Schema} from "../rdb/Schema";
import {clone} from "../util/common";
import {LinearModel} from "../model/LinearModel";
import {LinearAxis} from "../component/axis/LinearAxis";
import {Path} from "../svg/Path";
import {Circle} from "../svg/Circle";
import {MenuSeparator} from "../component/menu/MenuSeparator";
import {MenuItem} from "../component/menu/MenuItem";
import {bubbleSort} from "../util/algorithm/sort/BubbleSort";
import {Legend} from "../component/legend/Legend";
import {Component} from "../component/Component";

export class Correlation extends Chart {

    public static readonly clazz: string = "correlation";
    public static readonly title: string = "相关图";

    xAxisName!: string;
    yAxisName!: string;

    constructor(selector: string) {
        super(selector);

        let schema: Schema = {
            name: Correlation.clazz,
            properties: {
                type: 'string',
                valueX: 'number',
                valueY: 'number'
            }
        };
        this.table = this.db.create(schema);

        //菜单状态
        this.state.menuStatus['直线相关拟合线'] = false;
        this.state.menuStatus['多项式相关拟合线'] = false;
        this.state.menuStatus['分年连线'] = false;
        this.state.menuStatus['包络图'] = false;
        this.state.menuStatus['标记数据点'] =  true;
    }

    protected initData(): void {
        let {action, table, modelMap, lineMap, legendManager, option: {data}} = this;

        this.data = clone(data && data.designcode ? data : data.object);

        let usedData = this.data;

        this.xAxisName = this.data.axisXLabel;
        this.yAxisName = this.data.axisYLabel;

        //散点
        if (usedData.scatterDataList && usedData.scatterDataList.length > 0) {
            let type = 'scatter';
            for (let i = 0, len = usedData.scatterDataList.length; i < len; i++) {
                let item = usedData.scatterDataList[i];
                let {valueX, valueY} = item;
                table.insert([type, parseFloat(valueX), parseFloat(valueY)]);
            }
        }

        //直线
        if (usedData.lineDataList && usedData.lineDataList.length > 0) {
            let type = 'line';
            for (let i = 0, len = usedData.lineDataList.length; i < len; i++) {
                let item = usedData.lineDataList[i];
                let {valueX, valueY} = item;
                table.insert([type, parseFloat(valueX), parseFloat(valueY)]);
            }
        }

        //曲线
        if (usedData.polynomialDataList && usedData.polynomialDataList.length > 0) {
            let type = 'polynomial';
            for (let i = 0, len = usedData.polynomialDataList.length; i < len; i++) {
                let item = usedData.polynomialDataList[i];
                let {valueX, valueY} = item;
                table.insert([type, parseFloat(valueX), parseFloat(valueY)]);
            }
        }

        this.title = this.data.title || this.title;

        //备份表
        this.tableBackup = table.copy(Correlation.clazz + '-backup');
    }

    protected initModel(): void {
        let {table, modelMap} = this;
        let {width, height} = this.gridComponent.getView();

        //# 初始化模型
        let xModel = new LinearModel(this.xAxisName, 'valueX', 'horizontal', table.columns('valueX'));
        let yModel = new LinearModel(this.yAxisName, 'valueY', 'vertical', table.columns('valueY'));

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
    }

    protected initXAxis(): void {
        let {width} = this.gridComponent.getView();

        let xAxisModel = this.modelMap[this.xAxisName];
        let xAxis = new LinearAxis({model: xAxisModel, type: "axisBottom"}).setView({width, height: 20});

        this.bottomComponent.append(xAxis);
        this.drawDottedLine(xAxisModel.tickValues.length - 1, 'vertical');
    }

    protected initYAxis(): void {
        let {width} = this.leftComponent.getView();
        let {height} = this.gridComponent.getView();

        let yAxisModel = this.modelMap[this.yAxisName];
        let yAxis = new LinearAxis({model: yAxisModel, type: "axisLeft"}).setView({x: width, y: -0.5, height});

        this.leftComponent.append(yAxis);
        this.drawDottedLine(yAxisModel.tickValues.length - 1, 'horizontal');
    }

    protected initLegend(): void {
    }

    protected initLines(): void {
    }

    protected initPoints(): void {
        this.reloadHistory();
    }

    protected initMenu(): void {
        super.initMenu();

        let self = this;
        let {menu: rootMenu, state} = this;

        rootMenu.append(new MenuSeparator());

        rootMenu.append(new MenuItem({
            text: '直线相关拟合线',
            type: this.state.menuStatus['直线相关拟合线'] ? 'check' : 'normal',
            action() {
                let menuType = '直线相关拟合线';
                console.log(menuType, !state.menuStatus[menuType]);
                state.menuStatus[menuType] = !state.menuStatus[menuType];
                self.reset();
            }
        }));

        rootMenu.append(new MenuItem({
            text: '多项式相关拟合线',
            type: this.state.menuStatus['多项式相关拟合线'] ? 'check' : 'normal',
            action() {
                let menuType = '多项式相关拟合线';
                console.log(menuType, !state.menuStatus[menuType]);
                state.menuStatus[menuType] = !state.menuStatus[menuType];
                self.reset();
            }
        }));

        rootMenu.append(new MenuItem({
            text: '分年连线',
            type: this.state.menuStatus['分年连线'] ? 'check' : 'normal',
            action() {
                let menuType = '分年连线';
                console.log(menuType, !state.menuStatus[menuType]);
                state.menuStatus[menuType] = !state.menuStatus[menuType];
                self.reset();
            }
        }));

        //使用 d3.polygonHull 计算凸包(可以包含重复的点，能正确计算)
        rootMenu.append(new MenuItem({
            text: '包络图',
            type: this.state.menuStatus['包络图'] ? 'check' : 'normal',
            action() {
                let menuType = '包络图';
                console.log(menuType, !state.menuStatus[menuType]);
                state.menuStatus[menuType] = !state.menuStatus[menuType];
                state.menuStatus['标记数据点'] = !state.menuStatus[menuType];
                self.reset();
            }
        }));

        rootMenu.append(new MenuItem({
            text: '标记数据点',
            type: this.state.menuStatus['标记数据点'] ? 'check' : 'normal',
            action() {
                let menuType = '标记数据点';
                console.log(menuType, !state.menuStatus[menuType]);
                state.menuStatus[menuType] = !state.menuStatus[menuType];
                self.reset();
            }
        }));

        /*
        //使用自定义的算法计算凸包(不能有重复的点，否则会计算错误)
        //存在问题，某些情况下计算结果不正确，如：测点Ec2-2土压力与水位相关图
        rootMenu.append(new MenuItem({
            text: '包络图',
            action() {
                console.log("包络图");

                let {modelMap, data, xAxisName, yAxisName} = self;

                let scaleX = modelMap[xAxisName].scale;
                let scaleY = modelMap[yAxisName].scale;

                let scatterDataList = data.scatterDataList;

                let points: Point[] = [];
                let pointsMap: { [key: string]: number } = {};

                for (let i = 0, len = scatterDataList.length; i < len; i++) {
                    let item = scatterDataList[i];
                    let valueX = scaleX(parseFloat(item.valueX));
                    let valueY = scaleY(parseFloat(item.valueY));
                    let index = valueX + "-" + valueY;
                    if (!pointsMap[index]) {//处理重复的点
                        points.push(new Point(valueX, valueY));
                        pointsMap[index] = 1;
                    }
                }

                let pointsConvexHull: Point[] = new GrahamsScan().getConvexHull(points);

                let lineGenerator = d3.line()
                    .x(function (d: any) {
                        return (d.x);
                    })
                    .y(function (d: any) {
                        return (d.y);
                    });

                if (pointsConvexHull && pointsConvexHull.length > 0) {
                    let color = '#FF9966';// #FFFF00 #FF9966 #FF9999
                    self.pointsComponent.append(new Path({
                        d: <string>lineGenerator(<any>pointsConvexHull),
                        fill: color,
                        stroke: color,
                        'stroke-width': 1,
                        'fill-opacity': 0.5,
                    }));
                }
            }
        }));
        */

    }

    //直线相关拟合线
    drawLinearCorrelationFitLine() {
        let {data, legendManager, legendsComponent, linesComponent, modelMap, xAxisName, yAxisName} = this;

        let scaleX = modelMap[xAxisName].scale;
        let scaleY = modelMap[yAxisName].scale;
        let lineGenerator = d3.line()
            .x(function (d: any) {
                return scaleX(parseFloat(d.valueX));
            })
            .y(function (d: any) {
                return scaleY(parseFloat(d.valueY));
            });

        let pointsLine = data.lineDataList;
        let typeLine = 'line';
        legendManager.add(typeLine).drawLegend(legendsComponent, '直线相关拟合线');
        let legendLine = legendManager.get(typeLine);
        if (pointsLine && pointsLine.length > 0) {
            linesComponent.append(new Path({
                d: <string>lineGenerator(pointsLine),
                fill: 'none',
                stroke: legendLine.color,
                'stroke-width': 1,
                class: 'line'
            }));
        }
    }

    //多项式相关拟合线
    drawPolynomialCorrelationFitLine() {
        let {data, legendManager, legendsComponent, linesComponent, modelMap, xAxisName, yAxisName} = this;

        let scaleX = modelMap[xAxisName].scale;
        let scaleY = modelMap[yAxisName].scale;
        let lineGenerator = d3.line()
            .x(function (d: any) {
                return scaleX(parseFloat(d.valueX));
            })
            .y(function (d: any) {
                return scaleY(parseFloat(d.valueY));
            });

        //曲线
        let pointsPolynomial = data.polynomialDataList;
        let typePolynomial = 'polynomial';
        legendManager.add(typePolynomial).drawLegend(legendsComponent, '多项式相关拟合线');
        let legendPolynomial = legendManager.get(typePolynomial);
        if (pointsPolynomial && pointsPolynomial.length > 0) {
            linesComponent.append(new Path({
                d: <string>lineGenerator(pointsPolynomial),
                fill: 'none',
                stroke: legendPolynomial.color,
                'stroke-width': 1,
                class: 'line'
            }));
        }
    }

    //分年连线
    drawYearLine() {
        let yearLine = [];
        let yearLineMap: {[key:string]: any[]} = {};
        let scatterDataList = this.data.scatterDataList;

        for(let item of scatterDataList) {
            let keyYear = item.suvDateX.substring(0, 4);
            if(yearLineMap[keyYear]) {
                yearLineMap[keyYear].push(item);
            } else {
                yearLineMap[keyYear] = [item];
                yearLine.push([keyYear, yearLineMap[keyYear]]);
            }
        }

        for(let item of yearLine) {
            bubbleSort(item[1], (a: any, b: any) => {
                return a.suvDateX > b.suvDateX;
            });
        }

        bubbleSort(yearLine, (a: any, b: any) => {
            return a[0] > b[0];
        });

        let lastPoint = null;
        for(let subarray of yearLine) {
            let currentPoints = subarray[1];
            if(lastPoint) {
                currentPoints.unshift(lastPoint);
            }
            lastPoint = currentPoints[currentPoints.length - 1];
            this.drawPath(subarray[1], subarray[0]);
        }

    }

    //包络图
    drawEnvelopeChart() {
        let {modelMap, data, xAxisName, yAxisName} = this;

        let scaleX = modelMap[xAxisName].scale;
        let scaleY = modelMap[yAxisName].scale;

        let scatterDataList = data.scatterDataList;
        let points: Array<[number, number]> = [];

        let historyData = [];
        let currentYearData = [];
        let inCurrentYearData = [];
        let outCurrentYearData = [];
        let year = new Date().getFullYear().toString();

        for(let item of scatterDataList) {
            let keyYear = item.suvDateX.substring(0, 4);
            if(keyYear === year) {
                currentYearData.push(item);
            } else {
                historyData.push(item);
            }
        }

        for (let i = 0, len = historyData.length; i < len; i++) {
            let item = historyData[i];
            let valueX = scaleX(parseFloat(item.valueX));
            let valueY = scaleY(parseFloat(item.valueY));
            points.push([valueX, valueY]);
        }

        let pointsConvexHull: Array<[number, number]> | null = d3.polygonHull(points);
        if (pointsConvexHull && pointsConvexHull.length > 0) {
            let color = '#FF9966';// #FFFF00 #FF9966 #FF9999
            let lineGenerator = d3.line()
                .x(function (d: [number, number]) {
                    return (d[0]);
                })
                .y(function (d: [number, number]) {
                    return (d[1]);
                });
            this.pointsComponent.append(new Path({
                d: <string>lineGenerator(pointsConvexHull),
                fill: color,
                stroke: color,
                'stroke-width': 1,
                'fill-opacity': 0.5,
            }));

            for(let item of currentYearData) {
                let flag = d3.polygonContains(pointsConvexHull, [scaleX(parseFloat(item.valueX)), scaleY(parseFloat(item.valueY))]);
                if(flag) {
                    inCurrentYearData.push(item);
                } else {
                    outCurrentYearData.push(item);
                }
            }
        }

        let historyLegendObject = new Legend({
            name: 'solid_circle',
            color: '#C0C0C0',
            generator: d3.symbol().type(d3.symbolCircle),
            fill: true
        });
        this.drawPoint(historyData, historyLegendObject);

        let inCurrentLegendObject = new Legend({
            name: 'solid_circle',
            color: 'red',
            generator: d3.symbol().type(d3.symbolCircle),
            fill: true
        });
        this.drawPoint(inCurrentYearData, inCurrentLegendObject);

        let outCurrentLegendObject = new Legend({
            name: 'solid_star',
            color: 'red',
            generator: d3.symbol().type(d3.symbolStar),
            fill: true
        });
        this.drawPoint(outCurrentYearData, outCurrentLegendObject);
    }

    //标记散点
    drawScatterPoint() {
        let {modelMap, xAxisName, yAxisName, legendManager} = this;

        let data = this.data.scatterDataList;
        let type = 'scatter';
        let legend = legendManager.get(type);

        let scaleX = modelMap[xAxisName].scale;
        let scaleY = modelMap[yAxisName].scale;

        for (let i = 0, len = data.length; i < len; i++) {
            let valueX = data[i].valueX;
            let valueY = data[i].valueY;

            let x = scaleX(parseFloat(valueX));
            let y = scaleY(parseFloat(valueY));

            //legend.draw(this.pointsComponent, x, y);
            this.pointsComponent.append(new Circle({
                cx: x,//圆心坐标x
                cy: y,//圆心坐标y
                r: 3,//半径
                fill: legend.color,//填充色
                stroke: 'orange',//圆边色
                "stroke-width": 0,//圆边厚度
                class: 'point',
            }));
        }
    }

    reloadHistory() {
        let {menuStatus} = this.state;
        if(menuStatus['标记数据点']) {
            this.legendManager.add('scatter').drawLegend(this.legendsComponent, '实测值');
            this.drawScatterPoint();
        }
        if(menuStatus['直线相关拟合线']) this.drawLinearCorrelationFitLine();
        if(menuStatus['多项式相关拟合线']) this.drawPolynomialCorrelationFitLine();
        if(menuStatus['分年连线']) this.drawYearLine();
        if(menuStatus['包络图']) this.drawEnvelopeChart();
    }

    drawPath(data: any[], legend: string) {
        let {legendManager, legendsComponent, linesComponent, modelMap, xAxisName, yAxisName} = this;

        let scaleX = modelMap[xAxisName].scale;
        let scaleY = modelMap[yAxisName].scale;
        let lineGenerator = d3.line()
            .x(function (d: any) {
                return scaleX(parseFloat(d.valueX));
            })
            .y(function (d: any) {
                return scaleY(parseFloat(d.valueY));
            });

        let points = data;
        let type = legend;
        legendManager.add(type).drawLegend(legendsComponent, type);
        let legendObject = legendManager.get(type);
        if (points && points.length > 0) {
            linesComponent.append(new Path({
                d: <string>lineGenerator(points),
                fill: 'none',
                stroke: legendObject.color,
                'stroke-width': 1,
                class: 'line'
            }));
        }
    }

    drawPoint(data: any[], legendObject: Legend) {
        let {modelMap, xAxisName, yAxisName} = this;

        let scaleX = modelMap[xAxisName].scale;
        let scaleY = modelMap[yAxisName].scale;

        for (let i = 0, len = data.length; i < len; i++) {
            let valueX = data[i].valueX;
            let valueY = data[i].valueY;

            let x = scaleX(parseFloat(valueX));
            let y = scaleY(parseFloat(valueY));

            if(legendObject.name.indexOf('circle') > -1) {
                this.pointsComponent.append(new Circle({
                    cx: x,//圆心坐标x
                    cy: y,//圆心坐标y
                    r: 3,//半径
                    fill: legendObject.color,//填充色
                    stroke: 'orange',//圆边色
                    "stroke-width": 0,//圆边厚度
                    class: 'point',
                }));
            } else {
                legendObject.draw(this.pointsComponent, x, y, 30);
            }
        }

    }

}
