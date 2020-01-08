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
import {GrahamsScan} from "../math/geometry/algorithm/GrahamsScan";
import {Point} from "../math/geometry/Point";

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
        let xModel = new LinearModel(this.xAxisName, 'horizontal', table.columns('valueX'));
        let yModel = new LinearModel(this.yAxisName, 'vertical', table.columns('valueY'));

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
        let {legendManager} = this;
        legendManager.add('scatter').drawLegend(this.legendsComponent, '实测值');
        legendManager.add('line').drawLegend(this.legendsComponent, '直线相关拟合线');
        legendManager.add('polynomial').drawLegend(this.legendsComponent, '多项式相关拟合线');
    }

    protected initLines(): void {
        let {modelMap, xAxisName, yAxisName, legendManager, data} = this;

        let scaleX = modelMap[xAxisName].scale;
        let scaleY = modelMap[yAxisName].scale;
        let lineGenerator = d3.line()
            .x(function (d: any) {
                return scaleX(parseFloat(d.valueX));
            })
            .y(function (d: any) {
                return scaleY(parseFloat(d.valueY));
            });

        //直线
        let pointsLine = data.lineDataList;
        let typeLine = 'line';
        let legendLine = legendManager.get(typeLine);
        if (pointsLine && pointsLine.length > 0) {
            this.linesComponent.append(new Path({
                d: <string>lineGenerator(pointsLine),
                fill: 'none',
                stroke: legendLine.color,
                'stroke-width': 1,
                class: 'line'
            }));
        }

        //曲线
        let pointsPolynomial = data.polynomialDataList;
        let typePolynomial = 'polynomial';
        let legendPolynomial = legendManager.get(typePolynomial);
        if (pointsPolynomial && pointsPolynomial.length > 0) {
            this.linesComponent.append(new Path({
                d: <string>lineGenerator(pointsPolynomial),
                fill: 'none',
                stroke: legendPolynomial.color,
                'stroke-width': 1,
                class: 'line'
            }));
        }
    }

    protected initPoints(): void {
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

    protected initMenu(): void {
        super.initMenu();

        let self = this;
        let {menu: rootMenu} = this;
        rootMenu.append(new MenuSeparator());

        //使用 d3.polygonHull 计算凸包(可以包含重复的点，能正确计算)
        rootMenu.append(new MenuItem({
            text: '包络图',
            action() {
                console.log("包络图");

                let {modelMap, data, xAxisName, yAxisName} = self;

                let scaleX = modelMap[xAxisName].scale;
                let scaleY = modelMap[yAxisName].scale;

                let scatterDataList = data.scatterDataList;
                let points: Array<[number, number]> = [];

                for (let i = 0, len = scatterDataList.length; i < len; i++) {
                    let item = scatterDataList[i];
                    let valueX = scaleX(parseFloat(item.valueX));
                    let valueY = scaleY(parseFloat(item.valueY));
                    points.push([valueX, valueY]);
                }

                let pointsConvexHull: Array<[number, number]> | null = d3.polygonHull(points);

                let lineGenerator = d3.line()
                    .x(function (d: [number, number]) {
                        return (d[0]);
                    })
                    .y(function (d: [number, number]) {
                        return (d[1]);
                    });

                if (pointsConvexHull && pointsConvexHull.length > 0) {
                    let color = '#FF9966';// #FFFF00 #FF9966 #FF9999
                    self.pointsComponent.append(new Path({
                        d: <string>lineGenerator(pointsConvexHull),
                        fill: color,
                        stroke: color,
                        'stroke-width': 1,
                        'fill-opacity': 0.5,
                    }));
                }
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

}
