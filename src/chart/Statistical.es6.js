/**
 * # 统计模型过程线
 * # statistical
 */
import {Chart} from "./Chart";
import {beautifyDatetime, fun_scale, fun_time_level} from "../util/utils";

let parseTime = d3.timeParse("%Y-%m-%dT%H:%M:%S");
//let parseTime = d3.timeParse("%Y-%m-%d %H:%M:%S");
let formatTime = d3.timeFormat("%Y-%m-%d %H:%M:%S");

let day = 24 * 60 * 60 * 1000; // 1天
let month = 31 * day; // 1月,计算间隔是31天,实际显示是32天
let year = 12 * month; // 1年
let time_level1 = day; // 1天
let time_level2 = month; // 1月
let time_level3 = 3 * year; // 3年
let time_level4 = 8 * year; // 8年
let time_level5 = 20 * year; // 20年
let time_level6 = 50 * year; // 60年
//let time_level6 = 60 * year; // 60年
let time_level7 = 75 * year; // 100年
//let time_level7 = 100 * year; // 100年

export class Statistical extends Chart {

    constructor(selector) {
        super(selector);
        this.title = "统计模型过程线"; //标题
    }

    _initData(data) {
        this.option.height = 700;//570
        this.option.topHeight = 20;

        this.data = JSON.parse(JSON.stringify(data && data.PlotList ? data : data.object));
        this.title = this.data.Title || this.title;
        this.storage = {series: [], datetime_model: undefined};
        this.cache = {};
        this.buffer = {};

        let datetime = [];

        let pointId, unit;
        let plotList = this.data.PlotList;
        for(let i = 0, len_i = plotList.length; i < len_i; i++) {//图
            let item_i = plotList[i];
            let observLineList = item_i.ObservLineList;

            let plot = {
                original: item_i,
                lines: [],
                unit: undefined,
                pointId: undefined,
                model: {
                    minY: undefined,
                    maxY: undefined,
                    valuesY: [],
                },
            };

            for(let j = 0, len_j = observLineList.length; j <len_j; j++) {//线
                let item_j = observLineList[j];
                if (!pointId) pointId = item_j.PointId;
                if(!unit) unit = item_j.Unit;
                let legend = item_j.Legend;
                let observPointList = item_j.ObservPointList;

                let line = {
                    original: item_j,
                    points: [],
                    legend: legend,
                    unit: unit,
                    pointId: pointId,
                };

                for(let k = 0, len_k = observPointList.length; k <len_k; k++) {//点
                    let item_k = observPointList[k];
                    let suvDate = item_k.SuvDate;
                    let val = item_k.Val;

                    let date = parseTime(suvDate);
                    let value = parseFloat(val);

                    let point = {
                        original: item_k,
                        date: date,
                        value: value,
                    };

                    datetime.push(date);
                    plot.model.valuesY.push(value);
                    line.points.push(point);
                }

                plot.lines.push(line);
            }

            plot.model.minY = d3.min(plot.model.valuesY);
            plot.model.maxY = d3.max(plot.model.valuesY);
            plot.unit = unit;
            plot.pointId = pointId;
            this.storage.series.push(plot);
        }

        //处理日期 X 轴
        let min = d3.min(datetime);
        let max = d3.max(datetime);
        let datetime_model = {};
        datetime_model.unit = "datetime";
        datetime_model.min = min;
        datetime_model.max = max;
        datetime_model.values = datetime;
        let time_difference = max - min;
        let time_level = null;
        if(time_difference <= time_level1){
            time_level = "time_level1";
        } else if(time_difference <= time_level2) {
            time_level = "time_level2";
        } else if(time_difference <= time_level3) {
            time_level = "time_level3";
        } else if(time_difference <= time_level4) {
            time_level = "time_level4";
        } else if(time_difference <= time_level5) {
            time_level = "time_level5";
        } else if(time_difference <= time_level6) {
            time_level = "time_level6";
        } else if(time_difference <= time_level7) {
            time_level = "time_level7";
        } else {
            time_level = "time_level99";
        }
        datetime_model.time_difference = time_difference;
        datetime_model.time_level = time_level;
        datetime_model.time_group = fun_time_level[time_level](max, min);
        this.storage.datetime_model = datetime_model;

        this._initLegend();
        this._initToolbox();
    }

    _drawGraph(callback) {
        super._drawGraph(() => {
            //console.log("this:", this);

            let graph = this.graph;
            let AxisX = graph.AxisX;
            let AxisY = graph.AxisY;
            let height = graph.height;
            let top = graph.top;
            let bottom = graph.bottom;
            let series = [];

            let h_all = height - top.height - bottom.height;
            let h_interval = h_all / 5;
            let top_mini_height = 45;

            let h_total = 0;
            for(let i = 0; i < 3; i++) {
                let h = i === 1 ? h_interval : h_interval * 2;
                let obj = {
                    height: h,
                    y: top.height + h_total,
                    y1: top.height + h_total + top_mini_height,
                    y2: top.height + h_total + h,
                    top: {
                        height: top_mini_height,
                        y: top.height + h_total + top_mini_height,
                    }
                };
                series.push(obj);
                h_total += h;
            }

            AxisY.series = series;
        });
    }

    _drawLegend(context) {
        let seriesdata = this.storage.series;
        let seriesAxisY = this.graph.AxisY.series;

        let x = this.graph.left.width;
        //let y = this.graph.top.height - 40;
        let rectWidth = 80;
        let rectHeight = 20;

        for(let m = 0, len_m = seriesdata.length; m < len_m; m++) {
            let plot = seriesdata[m];
            let lines = plot.lines;

            let y = seriesAxisY[m].top.y - 25;
            let legend_context = context.append('g')
                .attr("class", "legend")
                .attr("transform", `translate(${x}, ${y})`);

            for(let i = 0, i_len = lines.length < 10 ? lines.length : 10; i < i_len; i++) {
                let line = lines[i];
                let legend_text = line.legend;
                let legend = this.legend[i];

                let x_legend = i * rectWidth + i * 5;
                let y_legend = rectHeight / 2;
                legend_context.append("rect")
                    .attr("x", x_legend)
                    .attr("width", rectWidth)
                    .attr("height", rectHeight);

                legend_context.append("text")
                    .text(legend_text)
                    .attr("transform", `translate(${x_legend + 20}, ${y_legend - 15})`);
                //context.append("text").text(unit).attr("transform", `translate(${x_legend + 20}, ${y_legend - 30})`);

                legend_context.append("line")
                    .attr("x1", x_legend + 5)
                    .attr("y1", y_legend)
                    .attr("x2", x_legend + rectWidth - 5)
                    .attr("y2", y_legend)
                    .attr("stroke", legend.color);
                legend.draw(legend_context, x_legend + 40, y_legend, 80);
            }
        }

    }

    _drawAxisX(context) {
        let seriesAxisY = this.graph.AxisY.series;
        let datetime = this.storage.datetime_model;
        let time_level = datetime.time_level;
        let time_group = datetime.time_group;

        let AxisX = this.graph.AxisX;
        let x = AxisX.x;
        let y = AxisX.y;
        let width = AxisX.width;
        let AxisY = this.graph.AxisY;

        let axisX = context.append('g')
            .attr("class", "x-axis")
            .attr("transform", `translate(${x},${y})`);
        let line1 = axisX.append("line")
            .attr("x2", width);
        let line2 = axisX.append("line")
            .attr("y1", 20)
            .attr("x2", width)
            .attr("y2", 20);
        let tick_group = axisX.append("g")
            .attr("class", 'tick-group')
            .attr("transform", `translate(0.5, 0)`);

        let ticks1_len = time_group.times1.length;
        let tick1_width = (width / ticks1_len).toFixed(2);
        let tick1_text = (tick1_width / 2).toFixed(2);

        let tick1 = tick_group.append("g")
            .attr("class", 'tick1');
        for(let i = 0; i < ticks1_len; i++) {
            let tick = tick1.append("g")
                .attr("class", 'tick')
                .attr("transform", `translate(${tick1_width * i}, 0)`);
            tick.append("line")
                .attr("y2", 20);
            tick.append("text")
                .text(time_group.times1[i])
                .attr("transform", `translate(${tick1_text}, 14)`);

            let h_total = 0; // #1
            for(let n = 0, len = seriesAxisY.length; n < len; n++) {
                let h = seriesAxisY[n].height;
                let h1 = seriesAxisY[n].height - seriesAxisY[n].top.height;

                if(i !== 0) {
                    //虚线X
                    tick.append("line")
                        .attr("stroke-dasharray", 2)
                        //.attr("y1", -h * n)   // 平均 1h 1h 1h
                        //.attr("y2", -h * n - h1)
                        .attr("y1", -h_total)   // 不均 2h 1h 2h
                        .attr("y2", -h_total - h1)
                        .style("opacity", 0.5);
                }
                h_total += h;
            }
        }
        let t = tick1.append("g")
            .attr("class", 'tick')
            .attr("transform", `translate(${width - 1}, 0)`);
        t.append("line")
            .attr("y2", 20);

        let h_total = 0; // #2
        for(let n = 0, len = seriesAxisY.length; n < len; n++) {
            let h = seriesAxisY[n].height;
            let h1 = seriesAxisY[n].height - seriesAxisY[n].top.height;

            //虚线X right
            t.append("line")
                .attr("stroke-dasharray", 2)
                //.attr("y1", -h * n)   // 平均 1h 1h 1h
                //.attr("y2", -h * n - h1)
                .attr("y1", -h_total)   // 不均 2h 1h 2h
                .attr("y2", -h_total - h1)
                .style("opacity", 0.5);
            h_total += h;
        }

        if(time_group.times2.length > 0) {
            let line3 = axisX.append("line")
                .attr("y1", 40)
                .attr("x2", width)
                .attr("y2", 40);

            let tick2 = tick_group.append("g")
                .attr("class", 'tick2')
                .attr("transform", `translate(0, 20)`);
            tick2.append("g")
                .attr("class", 'tick')
                .append("line")
                .attr("y2", 20);
            let ticks2_len = time_group.times2.length;
            let tick2_width = 0;
            let tick2_text = 0;
            for(let j = 0; j < ticks2_len; j++) {
                let time2 = time_group.times2[j];
                tick2_width += tick1_width * time2.len;
                tick2_text = (tick1_width * time2.len / 2).toFixed(2);
                let tick = tick2.append("g")
                    .attr("class", 'tick');
                if(j === ticks2_len - 1) {
                    tick.attr("transform", `translate(${tick2_width - 1}, 0)`);
                } else {
                    tick.attr("transform", `translate(${tick2_width}, 0)`);
                }
                tick.append("line")
                    .attr("y2", 20);
                tick.append("text")
                    .text(time2.text)
                    .attr("transform", `translate(${-tick2_text}, 14)`);
            }
        }

        let scaleTime = d3.scaleTime()
            .domain([beautifyDatetime(datetime.min, "start", time_level), beautifyDatetime(datetime.max, "end", time_level, datetime.min)])
            .range([AxisX.x, AxisX.x + AxisX.width]);
        this.scale["datetime"] = scaleTime;
    }

    _drawAxisY(context) {
        let seriesdata = this.storage.series;
        let seriesAxisY = this.graph.AxisY.series;

        let graph = this.graph;
        let AxisY = this.graph.AxisY;
        let height = AxisY.height;

        let scale = this.scale;
        let scaleMaster;

        let yScale, yAxis;
        let x, y;

        for(let i = 0, len = seriesdata.length; i < len; i++) {
            let data = seriesdata[i];
            let model = data.model;

            let min = model.minY;
            let max = model.maxY;

            let yScale = d3.scaleLinear()
                .domain([min, max])
                .range([seriesAxisY[i].y2, seriesAxisY[i].y1]);//.nice()
            scale["plot-" + i] = yScale;

            x = AxisY.x;
            //y = AxisY.y;
            y = seriesAxisY[i].y2;
            yAxis = d3.axisLeft(yScale).tickSize(0).tickPadding(20)//.ticks(5)
                .tickValues(fun_scale(min, max, 4)).tickFormat(d3.format(".2f"));
            context.append('g')
                .attr("class", "y-axis")
                .attr("transform", `translate(${x}, ${-0.5})`)
                .call(yAxis);
            context.append('text')
                .attr("font-family", "sans-serif")
                .attr("font-size", "11px")
                .attr("fill", "black")
                .attr("x", x - 70)
                .attr("y", seriesAxisY[i].y1 + 5)
                .text(data.unit);
        }

        //虚线 Y
        context.selectAll(".y-axis .tick").append("line")
            .attr("stroke-dasharray", 2)
            .attr("x2", graph.AxisX.width)
            .style("opacity", 0.5);
    }

    _drawLine(context) {
        let seriesdata = this.storage.series;
        let seriesAxisY = this.graph.AxisY.series;

        let scale = this.scale;
        let scaleX = scale["datetime"];

        for(let j = 0, j_len = seriesdata.length; j < j_len; j++) {
            let data = seriesdata[j];

            //只处理10根线
            let lines = data.lines;
            for(let i = 0, i_len = lines.length < 10 ? lines.length : 10; i < i_len; i++) {
                let line = lines[i];
                let points = line.points;

                let scaleY = scale["plot-" + j];
                let legend = this.legend[i];
                let lineGenerator = null;

                if(points.length === 0) continue;//跳过没有数据的线

                //用闭包保存住当前循环的i的值。
                (function(scaleY){
                    lineGenerator = d3.line()
                        .x(function(d) {
                            return scaleX(d.date);
                        })
                        .y(function(d) {
                            return scaleY(d.value);
                        });
                })(scaleY);

                context.append('path')
                //.attr('stroke-dasharray', '5,5')//虚线样式
                    .attr('stroke', legend.color)//线条颜色 gray DarkGray
                    .attr('stroke-width', 1)//线条宽度
                    .attr('fill', 'none')//是否填充区域
                    .attr('d', lineGenerator(points));
            }
        }

    }

    _drawPoint(context) {
        let seriesdata = this.storage.series;
        let seriesAxisY = this.graph.AxisY.series;

        let scale = this.scale;
        let scaleX = scale["datetime"];

        for(let m = 0, len_m = seriesdata.length; m < len_m; m++) {
            let data = seriesdata[m];

            //只处理10根线
            let lines = data.lines;
            for(let i = 0, i_len = lines.length < 10 ? lines.length : 10; i < i_len; i++) {
                let line = lines[i];
                let points = line.points;

                let scaleY = scale["plot-" + m];
                let legend = this.legend[i];

                let pointsLength = points.length;
                let pointsSpace = Math.floor(points.length / 10);
                let point, j, x, y;
                if(pointsLength <= 12) {
                    //显示所有的点
                    for(j = 0; j < pointsLength; j++) {
                        point = points[j];
                        x = scaleX(point.date);
                        y = scaleY(point.value);
                        legend.draw(context, x, y);
                    }
                } else {
                    //显示12个点
                    for(j = 1; j <= 10; j++) {
                        if(pointsLength === (j * pointsSpace)) {
                            //能整除的情况，最后一个点会重合，如：20，300
                            point = points[j * pointsSpace - Math.floor(pointsSpace / 2)];
                        } else {
                            point = points[j * pointsSpace];
                        }
                        x = scaleX(point.date);
                        y = scaleY(point.value);
                        legend.draw(context, x, y);
                    }
                    legend.draw(context, scaleX(points[0].date), scaleY(points[0].value));//第一个点
                    legend.draw(context, scaleX(points[pointsLength - 1].date), scaleY(points[pointsLength - 1].value));//最后一个点
                }
            }
        }

    }

}

Statistical.clazz = "statistical";
