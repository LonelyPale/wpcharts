import {Chart} from "./Chart";
import {Schema} from "../rdb/Schema";
import {clone} from "../util/common";
import {parseTimeT, TimeModel} from "../model/TimeModel";
import {LinearModel} from "../model/LinearModel";
import {Series} from "../component/Series";
import {TimeAxis} from "../component/axis/TimeAxis";
import {TimeFieldName, TimeModelName} from "../constant";
import {LineObject} from "../object/LineObject";
import {Legend} from "../component/legend/Legend";
import d3 from "d3";
import {LegendIndex, LegendIndexNode} from "../component/legend/LegendIndex";

export class Statistical extends Chart {

    public static readonly clazz: string = "statistical";
    public static readonly title: string = "统计模型过程线";

    pointId: string = '';
    unit: string = '';

    legendIndex: LegendIndex = new LegendIndex();//统计模型过程线: 使用单独的图例和颜色

    constructor(selector: string) {
        super(selector);

        let schema: Schema = {
            name: Statistical.clazz,
            properties: {
                PlotId: 'number',
                Legend: 'string',
                SuvDate: 'Date',
                Val: 'number'
            }
        };
        this.table = this.db.create(schema);

        this.legendIndex.add(new LegendIndexNode(['实测值', '残差', '水位分量'], new Legend({
            name: 'solid_circle',
            color: 'Blue',
            generator: d3.symbol().type(d3.symbolCircle),
            fill: true,
            width: 1,
            style: 'style1',
            legend: 'symbolCircleSolid'
        })));
        this.legendIndex.add(new LegendIndexNode(['计算值', '温度分量'], new Legend({
            name: 'hollow_circle',
            color: 'Red',
            generator: d3.symbol().type(d3.symbolCircle),
            fill: false,
            width: 1,
            style: 'style1',
            legend: 'symbolCircleHollow'
        })));
        this.legendIndex.add(new LegendIndexNode(['降雨分量'], new Legend({
            name: 'solid_rect',
            color: 'Green',
            generator: d3.symbol().type(d3.symbolSquare),
            fill: true,
            width: 1,
            style: 'style1',
            legend: 'symbolSquareSolid'
        })));
        this.legendIndex.add(new LegendIndexNode(['时效分量'], new Legend({
            name: 'hollow_rect',
            color: 'Black',
            generator: d3.symbol().type(d3.symbolSquare),
            fill: false,
            width: 1,
            style: 'style1',
            legend: 'symbolSquareHollow'
        })));
    }

    protected initData(): void {
        let {seriesMap, table, option: {data}} = this;

        this.option.view.height = 750;
        this.option.view.top = 60;
        this.option.view.bottom = 60;

        this.data = clone(data && data.PlotList ? data : data.object);

        let pointId, unit;
        let plotList = this.data.PlotList;
        for (let i = 0, len_i = plotList.length; i < len_i; i++) {//图
            let item_i = plotList[i];
            let observLineList = item_i.ObservLineList;

            let series = new Series({table});
            seriesMap[i] = series;

            for (let j = 0, len_j = observLineList.length; j < len_j; j++) {//线
                let item_j = observLineList[j];

                if (!pointId) pointId = item_j.PointId || '';
                if (!unit) unit = item_j.Unit || '';

                let legend = item_j.Legend;
                let observPointList = item_j.ObservPointList;

                series.legends.push(legend);

                for (let k = 0, len_k = observPointList.length; k < len_k; k++) {//点
                    let item_k = observPointList[k];

                    let suvDate = item_k.SuvDate;
                    let val = item_k.Val;

                    let date = parseTimeT(suvDate);
                    let value = parseFloat(val);

                    table.insert([i, legend, date, value]);
                }

            }

        }

        this.pointId = pointId;
        this.unit = unit;
        this.title = this.data.Title || this.title;

        //备份表
        this.tableBackup = table.copy(Statistical.clazz + '-backup');
    }

    protected initModel(): void {
        let {table, modelMap, seriesMap, pointId, unit, gridComponent} = this;
        let {width, height} = this.gridComponent.getView();
        let {width: w, height: h, top: t, bottom: b, left: l, right: r} = this.option.view;

        let sw = w - l - r;
        let st = 40;
        let shSupply = 80;
        let shInterval = (h - t - b - (st + shSupply) * 3) / 7;

        this.gridComponent.getView().boxOrient = 'vertical';

        //# 初始化模型
        modelMap['time'] = new TimeModel(TimeModelName, TimeFieldName, 'horizontal', table.columns('SuvDate'));
        modelMap['time'].range = [0, width];
        modelMap['time'].init();

        //let units = ['实测值', '计算值', '残差', '水位分量', '温度分量', '降雨分量', '时效分量'];
        let seriesArray = Object.values(seriesMap);
        for (let i = 0; i < seriesArray.length; i++) {
            let series = seriesArray[i];
            let {legends} = series;

            series.setView({width: sw, height: shInterval * legends.length + st + shSupply, top: st, boxOrient: 'free'});
            gridComponent.append(series);
            series.init();

            let rowsData = table.select(`PlotId='${i}'`);
            let columnsData = table.columns('Val', rowsData);
            let model = new LinearModel(unit, 'Val', 'vertical', columnsData);
            model.range = [series.gridComponent.getView().height, 0];
            model.ticks = 4;
            model.tickSize = 0;
            model.tickPadding = 20;
            model.init();
            modelMap[i] = model;

            series.modelMap[unit] = model;
            series.modelMap['time'] = modelMap['time'];

            for (let j = 0; j < legends.length; j++) {
                let legendName = legends[j];
                let data = table.select(`PlotId='${i}' and Legend='${legendName}'`);
                let legend = this.legendIndex.get(legendName) || series.legendManager.add(legendName);//新图例和颜色
                //series.lineMap[legendName] = {data, model, legend}; //last line
                let lineObject = new LineObject(pointId, unit, legendName);//#初始化线
                lineObject.data = data;
                lineObject.table = table;
                lineObject.legendObject = legend;
                lineObject.xModel = modelMap[TimeModelName];
                lineObject.yModel = modelMap[i];
                series.lineMap[legendName] = lineObject;
            }
        }

    }

    protected initXAxis(): void {
        let {width} = this.gridComponent.getView();
        let {time} = this.modelMap;
        let datetimeAxis = new TimeAxis({model: <TimeModel>time}).setView({width});
        this.bottomComponent.append(datetimeAxis);

        let {seriesMap} = this;
        let seriesArray = Object.values(seriesMap);
        for (let i = 0; i < seriesArray.length; i++) {
            seriesArray[i].initXAxis();
        }
    }

    protected initYAxis(): void {
        let {seriesMap} = this;
        let seriesArray = Object.values(seriesMap);
        for (let i = 0; i < seriesArray.length; i++) {
            seriesArray[i].initYAxis();
        }
    }

    protected initLegend(): void {
        /*
        //统计模型过程线: 使用单独的图例和颜色, 没有使用通用图例
        let {seriesMap} = this;
        let seriesArray = Object.values(seriesMap);
        for (let i = 0; i < seriesArray.length; i++) {
            seriesArray[i].initLegend();
        }
        */
    }

    protected initLines(): void {
        let {seriesMap} = this;
        let seriesArray = Object.values(seriesMap);
        for (let i = 0; i < seriesArray.length; i++) {
            seriesArray[i].initLines();
        }
    }

    protected initPoints(): void {
        let {seriesMap} = this;
        let seriesArray = Object.values(seriesMap);
        for (let i = 0; i < seriesArray.length; i++) {
            seriesArray[i].initPoints();
        }
    }

    protected initBackground() {
    }

    protected initEvent() {
    }

}
