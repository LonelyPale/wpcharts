import d3 from "d3";
import {Chart} from "./Chart";
import {parseTime, TimeModel, formatTime, day} from "../model/TimeModel";
import {LinearModel} from "../model/LinearModel";
import {TimeAxis} from "../component/axis/TimeAxis";
import {LinearAxis} from "../component/axis/LinearAxis";
import {Path} from "../svg/Path";
import {clone} from "../util/common";
import {Schema} from "../rdb/Schema";
import {Text} from "../svg/Text";
import {Row} from "../rdb/Row";
import {G} from "../svg/G";
import {lately} from "../util/array";
import {BrushEvent, MouseLeft, MouseWheel, TooltipsEvent} from "../event/EventTypes";
import {View} from "../view/View";
import {LineObject, LineObjectTag} from "../object/LineObject";
import {TimeModelName, TimeFieldName} from "../constant";

export class Hydrograph extends Chart {

    public static readonly clazz: string = "hydrograph";
    public static readonly title: string = "过程线";

    constructor(selector: string) {
        super(selector);

        let schema: Schema = {
            name: Hydrograph.clazz,
            properties: {
                PointId: 'string',
                Unit: 'string',
                Legend: 'string',
                SuvDate: 'Date',
                Value: 'number'
            }
        };
        this.table = this.db.create(schema);

        //new LinearModel('', 'horizontal').nice(11.21, 28.25, 7);
        //new LinearModel('', 'horizontal').nice(-0.04, 1.69, 7);
    }

    //# 两种情况: 首次、添加
    protected initData(): void {
        this.clear();

        let {action, table, modelMap, lineMap, option: {data}} = this;

        if (action === 'add') {
            data = clone(data && data.ObservLineList ? data : data.object);
            for (let i = 0; i < data.ObservLineList.length; i++) {
                let line = data.ObservLineList[i];
                //let unit = line.Unit;
                //let pointId = line.PointId;
                //let idx = pointId + '-' + unit;
                this.data.ObservLineList.push(line);//#合并数据
            }
        } else {
            this.data = clone(data && data.ObservLineList ? data : data.object);
        }

        let usedData = this.data;
        modelMap[TimeModelName] = new TimeModel(TimeModelName, TimeFieldName, 'horizontal');

        //只处理12根线
        for (let i = 0, i_len = usedData.ObservLineList.length < 12 ? usedData.ObservLineList.length : 12; i < i_len; i++) {
            let line = usedData.ObservLineList[i];
            let pointId = line.PointId;
            let unit = line.Unit;
            let legend = line.Legend;
            let id = LineObject.id(pointId, unit, legend);

            let model = modelMap[unit];

            if (!lineMap[id]) {
                if (!model) {
                    //只显示4个物理量,加上时间共5个.
                    if (Object.keys(modelMap).length < 5) {
                        modelMap[unit] = new LinearModel(unit, 'Value', 'vertical');
                    } else {
                        continue;
                    }
                }
                lineMap[id] = new LineObject(pointId, unit, legend);//#初始化线
            } else {
                continue;//不考虑线追加数据的情况
            }

            for (let j = 0, j_len = line.ObservPointList.length; j < j_len; j++) {
                let point = line.ObservPointList[j];
                let value = parseFloat(point.Value);
                let suvDate = <Date>parseTime(point.SuvDate);
                let row = table.insert([pointId, unit, legend, suvDate, value]); //#保存处理后的数据
            }

        }

        this.title = this.data.Title || this.title;
        this.warningValue = this.data.WarningValue;
        this.initWarningValue = this.data.InitWarningValue;
        this.initReverse = this.data.InitReverse;

        //备份表
        this.tableBackup = table.copy(Hydrograph.clazz + '-backup');
    }

    //# 三种情况: 首次、添加、重置
    protected initModel(): void {
        let {width, height} = this.gridComponent.getView();
        let {action, table, pointIdMap, modelMap, lineMap, cache, legendManager, reverseAxis, initReverse} = this;

        if (action === 'reset') modelMap[TimeModelName] = new TimeModel(TimeModelName, TimeFieldName, 'horizontal');

        //# 初始化全局索引 1
        let rows = table.getRows();
        for (let i = 0; i < rows.length; i++) {
            let row = rows[i];
            let pointId = row.get('PointId');
            let unit = row.get('Unit');
            let legend = row.get('Legend');
            let id = LineObject.id(pointId, unit, legend);
            let suvDate = row.get('SuvDate');
            let value = row.get('Value');
            let model = modelMap[unit];

            if (action === 'reset') {
                if (!lineMap[id]) {
                    if (!model) {
                        modelMap[unit] = new LinearModel(unit, 'Value', 'vertical');
                    }
                    lineMap[id] = new LineObject(pointId, unit, legend);//#初始化线
                }
            }

            if (pointIdMap[pointId]) {
                pointIdMap[pointId] += 1;
            } else {
                pointIdMap[pointId] = 1;
            }

            let key = suvDate.toString();
            let objCache = cache[key];
            if (objCache) {
                objCache.push(row);
            } else {
                cache[key] = [row];
            }
        }

        //# 初始化线 2
        for (let line of Object.values(lineMap)) {
            let {pointId, unit, legend, id} = line;
            line.data = table.select(`PointId='${pointId}' and Unit='${unit}' and Legend='${legend}' and Value!='-99'`);
            line.table = table;
            line.legendObject = legendManager.add(id);
            line.xModel = modelMap[TimeModelName];
            line.yModel = modelMap[unit];
            if(line.data.length === 0) delete lineMap[id];
        }

        //# 初始化模型 3
        for (let model of Object.values(modelMap)) {
            if (model.name === TimeModelName) {
                model.data = table.columns(TimeFieldName);
                model.range = [0, width];
            } else {
                let rowData = table.select(`Unit='${model.name}'`);
                model.data = table.columns('Value', rowData, (value: number) => value !== -99);//处理无效值
                //model.range = reverseAxis ? [0, height] : [height, 0];
                // if(initReverse && initReverse.includes(model.name)){
                //     model.range = [0, height];
                // } else {
                //     model.range = [height, 0];
                // }
                model.range = [height, 0];
                model.tickSize = 0;
                model.tickPadding = 20;
                if(model.data.length === 0) delete modelMap[model.name];
            }
            model.init();
        }
    }

    protected initLegend(): void {
        //let pointIds = Object.keys(this.pointIdMap);
        //let models = Object.keys(this.modelMap);
        let lines = Object.values(this.lineMap);

        for (let line of lines) {
            let {legend, legendObject} = line;
            //不做处理，统一按 legend 字段显示
            //let content = line.generateLegendName(LineObject.generateTags(pointIds.length, models.length));
            legendObject.drawLegend(this.legendsComponent, legend);
        }
    }

    protected initXAxis(): void {
        //if(this.currentEvent) return;

        let {width} = this.gridComponent.getView();
        let {time} = this.modelMap;
        let datetimeAxis = new TimeAxis({model: <TimeModel>time}).setView({width});
        this.bottomComponent.append(datetimeAxis);
        this.drawDottedLine(time.tickValues.length, 'vertical');
    }

    protected initYAxis(): void {
        //if(this.currentEvent) return;

        let {width, height} = this.gridComponent.getView();
        let count = 0;
        for (let model of Object.values(this.modelMap)) {
            if (model.name !== 'time') {
                let {width: lw} = this.leftComponent.getView();
                let {width: rw} = this.rightComponent.getView();
                count += 1;
                if (count === 1) {
                    model.tickSize = 0;
                    let linearAxis = new LinearAxis({model, type: 'axisLeft'}).setView({x: lw, y: -0.5, height});
                    this.leftComponent.append(linearAxis);
                    this.drawDottedLine(model.tickValues.length - 1, "horizontal");
                } else if (count === 2) {
                    model.tickSize = 0;
                    let linearAxis = new LinearAxis({model, type: 'axisRight'}).setView({x: -1, y: -0.5, height});
                    this.rightComponent.append(linearAxis);
                } else if (count === 3) {
                    model.tickSize = 5;
                    let linearAxis = new LinearAxis({model, type: 'axisLeft'}).setView({x: lw / 2, height});
                    this.leftComponent.append(linearAxis);
                } else if (count === 4) {
                    model.tickSize = 5;
                    let linearAxis = new LinearAxis({model, type: 'axisRight'}).setView({x: rw / 2, height});
                    this.rightComponent.append(linearAxis);
                } else {
                    break;
                }
            }
        }
    }

    protected initLines(): void {
        let {lineMap, linesComponent} = this;
        for (let line of Object.values(lineMap)) {
           line.drawLine(linesComponent);
        }
    }

    protected initPoints(): void {
        let {lineMap, pointsComponent} = this;
        for (let line of Object.values(lineMap)) {
            line.drawPoint(pointsComponent);
        }
    }

    min: number = 0;
    max: number = 0;

    protected initEvent() {
        super.initEvent();

        //let e = new Event();

        this.svg.on(TooltipsEvent, (datum: any, index: number, groups: any) => {
            let {detail: {mouse, target: tooltips}} = d3.event;

            let {cache, legendManager, option: {view: parentView}} = this;
            let {scale, data} = this.modelMap['time'];

            let valueX = scale.invert(mouse[0]);
            let valueX2 = scale.invert(mouse[0] + 3);
            let limitError = Math.abs(valueX - valueX2);
            let value = lately(data, valueX, limitError); //# 计算最逼近目标的值
            if (value === null) return;
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
            let nodeView: View = new View({width: 120, height: 37}, tooltips.getSvgContext());

            tooltips.refresh(pointRowArray.length, mouse, parentView, tooltipsView, nodeView, 145);
            tooltips.append(new Text({x: 5})).text(formatTime(value));

            for (let i = 0; i < pointRowArray.length; i++) {
                let row = <Row>pointRowArray[i];
                let pointId = row.get('PointId');
                let unit = row.get('Unit');
                let legend = row.get('Legend');
                let value = row.get('Value');
                let id = LineObject.id(pointId, unit, legend);
                let legendObject = legendManager.get(id);
                let g = tooltips.append(new G().setView({width: 120, height: 15}));
                legendObject.draw(g, 5, 12, 50);
                g.append(new Text({x: 15})).text(`${legend}`);
                tooltips.append(new Text().setView({width: 120, height: 22})).text(`${unit}: ${value}`);
            }
        });

        this.svg.on(BrushEvent, () => {
            let {detail: {startPosition, endPosition}} = d3.event;
            let {modelMap, table} = this;

            let [sx, sy] = startPosition;
            let [ex, ey] = endPosition;
            let brushData: any[] = [];

            let tempmax;
            let sxValue, exValue, xName;
            for (let model of Object.values(modelMap)) {
                let {name, type, scale} = model;
                if (type === 'horizontal') {
                    sxValue = scale.invert(sx);
                    exValue = scale.invert(ex);
                    if (sxValue > exValue) {
                        tempmax = sxValue;
                        sxValue = exValue;
                        exValue = tempmax;
                    }
                    sxValue = formatTime(sxValue);
                    exValue = formatTime(exValue);
                    xName = name;
                    break;
                }
            }

            for (let model of Object.values(modelMap)) {
                let {name, type, scale} = model;
                let syValue, eyValue;

                if (type === 'vertical') {
                    syValue = scale.invert(sy);
                    eyValue = scale.invert(ey);
                    if (syValue > eyValue) {
                        tempmax = syValue;
                        syValue = eyValue;
                        eyValue = tempmax;
                    }
                } else {
                    continue;
                }

                let data: any[];
                data = table.select(`Unit='${name}' and SuvDate>='${sxValue}' and SuvDate<='${exValue}' and Value>='${syValue}' and Value<='${eyValue}'`);

                for (let i = 0; i < data.length; i++) {
                    brushData.push(data[i]);
                }
            }

            if (brushData.length > 0) {
                this.reset(brushData);
            }
        });

        //鼠标滚轮: 放大缩小
        this.svg.on(MouseWheel, () => {
            let {detail: {delta}} = d3.event;
            let {modelMap, tableBackup} = this;
            let brushData: any[] = [];
            let data: any[];
            let time = <TimeModel>modelMap['time'];
            let sxValue, exValue;

            this.min = this.min === 0 ? (<Date>time.min).getTime() : this.min;
            this.max = this.max === 0 ? (<Date>time.max).getTime() : this.max;

            //let min = (<Date>time.min).getTime();
            //let max = (<Date>time.max).getTime();
            let min = this.min;
            let max = this.max;
            let increment = (max - min) * 0.05;
            console.log('MouseWheel:increment:', increment);

            let time_difference = time.time_difference !== 0 ? time.time_difference : day;
            let time_difference_new = time_difference * Math.abs(delta) / 120;
            if (delta > 0) {//向上滚动:放大
                //sxValue = formatTime(new Date(min - time_difference_new));
                //exValue = formatTime(new Date(max + time_difference_new));
                //this.min = min - time_difference_new;
                //this.max = max + time_difference_new;

                this.min = min - increment;
                this.max = max + increment;
                sxValue = formatTime(new Date(min - increment));
                exValue = formatTime(new Date(max + increment));
            } else {//向下滚动:缩小
                //sxValue = formatTime(new Date(min + time_difference_new));
                //exValue = formatTime(new Date(max - time_difference_new));
                //this.min = min + time_difference_new;
                //this.max = max - time_difference_new;

                this.min = min + increment;
                this.max = max - increment;
                sxValue = formatTime(new Date(min + increment));
                exValue = formatTime(new Date(max - increment));
            }

            if(sxValue > exValue) {
                console.log('error:MouseWheel: sxValue > exValue :', sxValue, exValue, increment);
                return;
            }

            let sql = `SuvDate>='${sxValue}' and SuvDate<='${exValue}'`;
            console.log('MouseWheel:sql:', sql);
            data = tableBackup.select(sql);
            console.log('MouseWheel:data:', data);

            for (let i = 0; i < data.length; i++) {
                brushData.push(data[i]);
            }

            if (brushData.length > 0) {
                this.reset(brushData);
            }
        });

        //左右平移
        this.svg.on(MouseLeft, () => {
            let {detail: {startPosition, endPosition}} = d3.event;
            let {modelMap, tableBackup} = this;

            let [sx, sy] = startPosition;
            let [ex, ey] = endPosition;

            let time = <TimeModel>modelMap['time'];
            let minLast = (<Date>time.min).getTime();
            let maxLast = (<Date>time.max).getTime();

            let sxValue, exValue;
            sxValue = time.scale.invert(sx);
            exValue = time.scale.invert(ex);

            let time_difference_new = exValue - sxValue;
            let minCurrent = new Date(minLast + time_difference_new);
            let maxCurrent = new Date(maxLast + time_difference_new);
            sxValue = formatTime(minCurrent);
            exValue = formatTime(maxCurrent);

            let brushData: any[] = [];
            let data: any[];

            let sql = `SuvDate>='${sxValue}' and SuvDate<='${exValue}'`;
            console.log('MouseLeft:sql:', sql);
            data = tableBackup.select(sql);

            for (let i = 0; i < data.length; i++) {
                brushData.push(data[i]);
            }

            if (brushData.length > 0) {
                //console.log("MouseLeft:brushData:", brushData);
                //let row = table.insert([pointId, unit, legend, suvDate, value]);
                brushData.push([null, null, null, minCurrent, null]);//用于保持 x 轴格式不变
                brushData.push([null, null, null, maxCurrent, null]);//用于保持 x 轴格式不变
                this.reset(brushData);
            }
        });
    }

    protected onBrushEvent(zoom: number) {
        let {detail: {delta}} = d3.event;
    }

}
