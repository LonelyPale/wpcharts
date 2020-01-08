import {Chart} from "./Chart";
import {Schema} from "../rdb/Schema";
import {clone} from "../util/common";
import {parseTimeT, TimeModel} from "../model/TimeModel";
import {LinearModel} from "../model/LinearModel";
import {Series} from "../component/Series";
import {TimeAxis} from "../component/axis/TimeAxis";

export class Statistical extends Chart {

    public static readonly clazz: string = "statistical";
    public static readonly title: string = "统计模型过程线";

    pointId: string = '';
    unit: string = '';

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
    }

    protected initData(): void {
        let {seriesMap, table, modelMap, lineMap, legendManager, option: {data}} = this;

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
        let {table, modelMap, seriesMap, unit, gridComponent} = this;
        let {width, height} = this.gridComponent.getView();
        let {width: w, height: h, top: t, bottom: b, left: l, right: r} = this.option.view;

        let sw = w - l - r;
        let st = 40;
        let shSupply = 80;
        let shInterval = (h - t - b - (st + shSupply) * 3) / 7;

        this.gridComponent.getView().boxOrient = 'vertical';

        //# 初始化模型
        modelMap['time'] = new TimeModel('time', 'horizontal', table.columns('SuvDate'));
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
            let model = new LinearModel(unit, 'vertical', columnsData);
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
                let legend = series.legendManager.add(legendName);
                series.lineMap[legendName] = {data, model, legend};
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
        let {seriesMap} = this;
        let seriesArray = Object.values(seriesMap);
        for (let i = 0; i < seriesArray.length; i++) {
            seriesArray[i].initLegend();
        }
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
