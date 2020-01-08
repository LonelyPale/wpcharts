/**
 * # 分布图
 * # distribution
 */
import {Chart} from "./Chart";
import {beautifyDatetime, fun_scale, fun_time_level} from "../util/utils";
import {Correlation} from "./Correlation";

//let parseTime = d3.timeParse("%Y-%m-%dT%H:%M:%S");
let parseTime = d3.timeParse("%Y-%m-%d %H:%M:%S");
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

export class Distribution extends Chart {

    constructor(selector) {
        super(selector);
        this.option.bottomHeight = 100;
        this.title = "分布图"; //标题
        this.pointList = [];
        this.isHorizontal = true; //是:水平图  否:垂直图  #默认是水平图
    }

    _initData(data) {
        this.data = JSON.parse(JSON.stringify(data && data.pointCategories ? data : data.object));
        this.title = this.option.title ? this.option.title :
            this.data.title ? this.data.title : this.title;

        if(this.option.isHorizontal !== undefined) {
            this.isHorizontal = this.option.isHorizontal
        } else if(this.data.isHorizontal !== undefined) {
            this.isHorizontal = this.data.isHorizontal;
        }

        if(!this.isHorizontal) {
            this.option.height = 750;
            this.option.leftWidth = 350;
            this.option.rightWidth = 350;
        }

        let sourceData = this.data;
        let targetData = this.physical;
        let datetime = [];
        let values = [];
        let points = [];

        for(let i = 0, len = sourceData.suvDateList.length; i < len; i++) {
            let date = sourceData.suvDateList[i];
            let lines = [];
            for(let j = 0, length = sourceData.pointCategories.length; j < length; j++) {
                let point = sourceData.pointCategories[j];
                let value = sourceData.dataList[j][i];
                let pointObj = {
                    index: j,
                    point: point,
                    value: value ? parseFloat(value) : value,
                    date: date
                };

                if(!!sourceData.imageFile) {
                    let pointX = sourceData.pointX;
                    let pointY = sourceData.pointY;
                    let plotAngle = sourceData.plotAngle;
                    pointObj.pointX = pointX[j];
                    pointObj.pointY = pointY[j];
                    pointObj.plotAngle = plotAngle[j];

                    let dataYList = sourceData.dataYList;
                    if(!!dataYList) {
                        let valueY = dataYList[j][i];
                        pointObj.valueY = valueY ? parseFloat(valueY) : valueY;
                    }
                }

                lines.push(pointObj);
                values.push(value ? parseFloat(value) : value);
            }
            this.lineMap[date] = lines;
            datetime.push(parseTime(date));
        }

        let phys = {};
        phys.values = values;
        phys.unit = sourceData.valueAxisName ? sourceData.valueAxisName : "物理量XXX";
        phys.max = d3.max(values);
        phys.min = d3.min(values);
        targetData.set("ValueAxisName", phys);

        if(sourceData.pointCategories[sourceData.pointCategories.length - 1] === "孔底") {//测斜仪分布图
            for(let i = sourceData.pointCategories.length - 1; i >= 0; i--) {
                points.push(sourceData.pointCategories[i]);
            }
        } else {
            for(let i = 0, len = sourceData.pointCategories.length; i < len; i++) {
                points.push(sourceData.pointCategories[i]);
            }
        }
        targetData.set("CategoryAxisName", {values: points, unit: sourceData.categoryAxisName ? sourceData.categoryAxisName : "测点"});

        //处理日期 X 轴
        let max = d3.max(datetime);
        let min = d3.min(datetime);
        let phys_datetime = {};
        phys_datetime.unit = "datetime";
        phys_datetime.max = max;
        phys_datetime.min = min;
        phys_datetime.values = datetime;

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
        phys_datetime.time_difference = time_difference;
        phys_datetime.time_level = time_level;
        phys_datetime.time_group = fun_time_level[time_level](max, min);

        //console.log(time_difference/24/3600/1000, formatTime(info_datetime.get("max")), formatTime(info_datetime.get("min")));

        targetData.set("datetime", phys_datetime);

        this._initLegend();
        this._initToolbox();

        //console.log("PointCategories:", sourceData.PointCategories.length);
        //console.log("SuvDateList:", sourceData.SuvDateList.length);
        //console.log("DataList:", sourceData.DataList.length);
        //console.log("DataList[0]:", sourceData.DataList[0].length);
    }

    _drawLegend(context) {

    }

    _drawLegendClick(context, datatime) {
        let data = this.pointList;
        let rectWidth = 80;
        let rectHeight = 20;
        let x, y;

        if(this.isHorizontal) {
            x = this.graph.left.width;
            y = this.graph.top.height - 40;
        } else {
            x = this.graph.right.x + 10;
            y = this.graph.top.height + 10;
        }

        context = context.append('g')
            .attr("class", "legend")
            .attr("transform", `translate(${x}, ${y})`);

        //只处理10根线
        let unit = "";
        let pointId = datatime.substr(0, 10);
        let i = data.length === 0 ? 0 : data.length - 1;
        let legend = this.legend[i];

        let x_legend, y_legend;
        if(this.isHorizontal) {
            x_legend = i * rectWidth + i * 5;
            y_legend = rectHeight / 2;

            context.append("rect")
                .attr("x", x_legend)
                .attr("width", rectWidth)
                .attr("height", rectHeight);

            context.append("text")
                .text(pointId)
                .attr("transform", `translate(${x_legend + 32}, ${y_legend - 15})`);
            context.append("text")
                .text(unit)
                .attr("transform", `translate(${x_legend + 20}, ${y_legend - 30})`);

            context.append("line")
                .attr("x1", x_legend + 5)
                .attr("y1", y_legend)
                .attr("x2", x_legend + rectWidth - 5)
                .attr("y2", y_legend)
                .attr("stroke", legend.color);
            legend.draw(context, x_legend + 40, y_legend, 80);
        } else {
            x_legend = 0;
            y_legend = (rectHeight / 2) * i + 35 * i;

            context.append("rect")
                .attr("x", x_legend)
                .attr("y", y_legend)
                .attr("width", rectWidth)
                .attr("height", rectHeight);

            context.append("text")
                .text(pointId)
                .attr("transform", `translate(${x_legend + 35}, ${y_legend - 5})`);
            context.append("text")
                .text(unit)
                .attr("transform", `translate(${x_legend + 20}, ${y_legend - 15})`);

            context.append("line")
                .attr("x1", x_legend + 5)
                .attr("y1", y_legend + 10)
                .attr("x2", x_legend + rectWidth - 5)
                .attr("y2", y_legend + 10)
                .attr("stroke", legend.color);
            legend.draw(context, x_legend + 40, y_legend + 10, 80);
        }
    }

    _drawAxisX(context) {
        let category_physical = this.physical.get("CategoryAxisName");
        let value_physical = this.physical.get("ValueAxisName");
        let datetime = this.physical.get("datetime");
        let time_level = datetime.time_level;
        let time_group = datetime.time_group;

        let AxisX = this.graph.AxisX;
        let x = this.isHorizontal ? AxisX.x : 100;
        let y = AxisX.y;
        let width = this.isHorizontal ? AxisX.width : 800;
        let AxisY = this.graph.AxisY;

        let xAxis_y = 30;

        //# update
        let scaleTime = d3.scaleTime()
            .domain([beautifyDatetime(datetime.min, "start", time_level), beautifyDatetime(datetime.max, "end", time_level, datetime.min)])
            .range([x, x + width]);
        this.scale["datetime"] = scaleTime;

        let class_ = this.isHorizontal ? "" : " time-axis";
        let axisX = context.append('g')
            .attr("class", "x-axis" + class_)
            .attr("transform", `translate(${x},${y})`);
        let line1 = axisX.append("line")
            .attr("y1", xAxis_y)
            .attr("x2", width)
            .attr("y2", xAxis_y);
        let line2 = axisX.append("line")
            .attr("y1", xAxis_y + 20)
            .attr("x2", width)
            .attr("y2", xAxis_y + 20);
        let tick_group = axisX.append("g")
            .attr("class", 'tick-group')
            .attr("transform", `translate(0.5, 0)`);

        //# new
        //let line0 = axisX.append("line").attr("x2", width);

        let self = this;
        for (let i = 0, len = datetime.values.length; i < len; i++) {
            let date = datetime.values[i];
            let xAxis_circle_x = scaleTime(date);
            axisX.append("circle").attr("data-datetime", formatTime(date))
                .attr("cx", xAxis_circle_x - x)//圆心坐标从左向右依次递增，注意：i表示引入数据在数组的下标，如：d=5,i=0
                .attr("cy", 20)//将圆心放到svg高度中间
                .attr("r", 3)//半径
                .attr("fill", "green")//给圆填充黄色
                .attr("stroke", "orange")//给圆边涂成橘黄
                .attr("stroke-width", 0)//设置圆边的厚度
                .on("click", function(a, b, c, d, e, f) {
                    console.log("this-obj:", this.attributes["data-datetime"].nodeValue, typeof this.attributes["data-datetime"].nodeValue);
                    console.log("this:", this, typeof this);
                    console.log("event:", d3.event);
                    console.log("click:", a, b, c, d, e, f);
                    self._onClickDatetime(this.attributes["data-datetime"].nodeValue);
                });
        }
        //# 1
        let xScale;
        let xAxis;
        if(this.isHorizontal) {
            let line_index_array = [];
            let line_name_array = category_physical.values;
            let point_count = category_physical.values.length;
            let w = AxisX.width / (point_count - 1);
            for(let i = 0; i < point_count; i++) {
                line_index_array.push(w * i);
                //虚线X
                if(i === 0) {
                    axisX.append("line").attr("data-test", "111")
                        .attr("stroke-dasharray", 2)
                        //.attr("y1", this.graph.top.height)
                        //.attr("y2", this.graph.bottom.y)
                        .attr("x1", w * i + 1)
                        .attr("y1", 0)
                        .attr("x2", w * i + 1)
                        .attr("y2", -AxisY.height)
                        .style("opacity", 0.5);
                } else {
                    axisX.append("line").attr("data-test", "222")
                        .attr("stroke-dasharray", 2)
                        //.attr("y1", this.graph.top.height)
                        //.attr("y2", this.graph.bottom.y)
                        .attr("x1", w * i)
                        .attr("y1", 0)
                        .attr("x2", w * i)
                        .attr("y2", -AxisY.height)
                        .style("opacity", 0.5);
                }
            }
            xScale = d3.scaleOrdinal()
                .domain(line_name_array)
                .range(line_index_array);
            xAxis = d3.axisBottom(xScale).tickSize(0);

            axisX.append('g')
                .attr("class", "axis")
                .attr("transform", `translate(${0},${-1})`)
                .call(xAxis);
        } else {
            let axisX_new = context.append('g')
                .attr("class", "x-axis")
                .attr("transform", `translate(${AxisX.x},${AxisX.y})`);

            let min = value_physical.min;
            let max = value_physical.max;
            xScale = d3.scaleLinear()
                .domain([min, max])
                .range([0, AxisX.width]);//.nice();
            xAxis = d3.axisBottom(xScale).tickSize(0).tickPadding(5)//.ticks(7)
                .tickValues(fun_scale(min, max)).tickFormat(d3.format(".2f"));;

            axisX_new.append('g')
                .attr("class", "axis")
                .attr("transform", `translate(${0},${-1})`)
                .call(xAxis);
            axisX_new.append('text')
                .attr("font-family", "sans-serif")
                .attr("font-size", "11px")
                .attr("fill", "black")
                .attr("x", AxisX.width + 60)
                .attr("y", 12)
                .text(value_physical.unit);

            //虚线 Y
            context.selectAll(".x-axis .axis .tick").append("line")
                .attr("stroke-dasharray", 2)
                .attr("y2", -AxisY.height)
                .style("opacity", 0.5);
        }

        this.scale["PointCategories"] = xScale;

        let ticks1_len = time_group.times1.length;
        let tick1_width = (width / ticks1_len).toFixed(2);
        let tick1_text = (tick1_width / 2).toFixed(2);

        let tick1 = tick_group.append("g")
            .attr("class", 'tick1')
            .attr("transform", `translate(0, ${0})`);
        for(let i = 0; i < ticks1_len; i++) {
            let tick = tick1.append("g")
                .attr("class", 'tick')
                .attr("transform", `translate(${tick1_width * i}, 0)`);
            tick.append("line")
                .attr("y1", xAxis_y)
                .attr("y2", xAxis_y + 20);
            tick.append("text")
                .text(time_group.times1[i])
                .attr("transform", `translate(${tick1_text}, ${xAxis_y + 14})`);

            /*
            if(i !== 0) {
                //虚线X
                tick.append("line").attr("id", "flag-123")
                    .attr("stroke-dasharray", 2)
                    //.attr("y1", this.graph.top.height)
                    //.attr("y2", this.graph.bottom.y)
                    .attr("y2", -AxisY.height)
                    .style("opacity", 0.5);
            }
            */
        }
        let t = tick1.append("g")
            .attr("class", 'tick')
            .attr("transform", `translate(${width - 1}, 0)`);
        t.append("line")
            .attr("y1", xAxis_y)
            .attr("y2", xAxis_y + 20);

        if(this.isHorizontal) {
            //虚线X right
            t.append("line")
                .attr("stroke-dasharray", 2)
                .attr("y2", -AxisY.height)
                .style("opacity", 0.5);
        }

        if(time_group.times2.length > 0) {
            let line3 = axisX.append("line")
                .attr("y1", xAxis_y + 40)
                .attr("x2", width)
                .attr("y2", xAxis_y + 40);

            let tick2 = tick_group.append("g")
                .attr("class", 'tick2')
                .attr("transform", `translate(0, 20)`);
            tick2.append("g")
                .attr("class", 'tick')
                .append("line")
                .attr("y1", xAxis_y)
                .attr("y2", xAxis_y + 20);
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
                    .attr("y1", xAxis_y)
                    .attr("y2", xAxis_y + 20);
                tick.append("text")
                    .text(time2.text)
                    .attr("transform", `translate(${-tick2_text}, ${xAxis_y + 14})`);
            }
        }



        //let a = scaleTime(datetime.min);
        //let b = scaleTime.invert(a);
        //console.log("a:", a, datetime.min, formatTime(datetime.min));
        //console.log("b:", b, a);
        //console.log("instanceof:", datetime.min instanceof Date);

        //axisX.call(scaleTime);
        //let xAxisTime = d3.axisBottom(scaleTime).tickFormat(d3.timeFormat("%Y-%m-%d %H:%M:%S")).ticks(7);
        //axisX.call(xAxisTime);
    }

    _drawAxisY(context) {
        //if(!!this.data.imageFile) return;

        let axisObj;

        if(this.isHorizontal) {
            axisObj = this.physical.get("ValueAxisName");
        } else {
            axisObj = this.physical.get("CategoryAxisName");
        }

        let graph = this.graph;
        let AxisY = this.graph.AxisY;
        let AxisX = this.graph.AxisX;
        let height = AxisY.height;

        let scale = this.scale;
        let scaleMaster;

        let yScale, yAxis;
        let x, y;
        x = AxisY.x;
        y = AxisY.y;

        //let diff = value.max - value.min;
        //let space = diff * 0.1;
        //let min = value.min - space;
        //let max = value.max + space;
        let min = axisObj.min;
        let max = axisObj.max;

        if(this.isHorizontal) {
            if(scaleMaster) {
                yScale = scaleMaster.copy().domain([min, max]);//.nice()
            } else {
                yScale = d3.scaleLinear()
                    .domain([min, max])
                    .range([AxisY.y + AxisY.height, AxisY.y]);//.nice()
                scaleMaster = yScale;
            }

            yAxis = d3.axisLeft(yScale).tickSize(0).tickPadding(20)//.ticks(7)
                .tickValues(fun_scale(min, max)).tickFormat(d3.format(".2f"));
            context.append('g')
                .attr("class", "y-axis")
                .attr("transform", `translate(${x}, ${-0.5})`)
                .call(yAxis);
            context.append('text')
                .attr("font-family", "sans-serif")
                .attr("font-size", "11px")
                .attr("fill", "black")
                .attr("x", x)
                .attr("y", y-6)
                .text(axisObj.unit);

            //虚线 Y
            context.selectAll(".y-axis .tick").append("line")
                .attr("stroke-dasharray", 2)
                .attr("x2", graph.AxisX.width)
                .style("opacity", 0.5);
        } else {
            let axisX = context.append('g')
                .attr("class", "y-axis")
                .attr("transform", `translate(${x},${y})`);
            let line_index_array = [];
            let line_name_array = axisObj.values;
            let point_count = axisObj.values.length;
            let w = AxisY.height / (point_count - 1);
            for(let i = 0; i < point_count; i++) {
                line_index_array.push(w * (point_count - 1 - i));
                //虚线X
                if(i === 0) {
                    axisX.append("line").attr("data-test", "111-y")
                        .attr("stroke-dasharray", 2)
                        //.attr("y1", this.graph.top.height)
                        //.attr("y2", this.graph.bottom.y)
                        .attr("x1", 0)
                        .attr("y1", w * i + 1)
                        .attr("x2", AxisX.width)
                        .attr("y2", w * i + 1)
                        .style("opacity", 0.5);
                } else {
                    axisX.append("line").attr("data-test", "222-y")
                        .attr("stroke-dasharray", 2)
                        //.attr("y1", this.graph.top.height)
                        //.attr("y2", this.graph.bottom.y)
                        .attr("x1", 0)
                        .attr("y1", w * i)
                        .attr("x2", AxisX.width)
                        .attr("y2", w * i)
                        .style("opacity", 0.5);
                }
            }
            yScale = d3.scaleOrdinal()
                .domain(line_name_array)
                .range(line_index_array);
            yAxis = d3.axisLeft(yScale).tickSize(0).tickPadding(20);

            axisX.append('g')
                .attr("class", "axis")
                .attr("transform", `translate(${0},${-1})`)
                .call(yAxis);
            context.append('text')
                .attr("font-family", "sans-serif")
                .attr("font-size", "11px")
                .attr("fill", "black")
                .attr("x", x)
                .attr("y", y - 16)
                .text(axisObj.unit);
        }

        scale["DataList"] = yScale;

    }

    _drawLine(context) {

    }

    _drawLineClick(context, data) {
        let scale = this.scale;
        let AxisX = this.graph.AxisX;
        let AxisY = this.graph.AxisY;

        //直线
        let points = data;
        let isHorizontal = this.isHorizontal;
        let scaleX = scale["PointCategories"];
        let scaleY = scale["DataList"];
        let lineGenerator = null;

        let i = this.pointList.length === 0 ? 0 : this.pointList.length - 1;
        let legend = this.legend[i];

        lineGenerator = d3.line()
            .x(function(d) {
                if(isHorizontal) {
                    return scaleX(d.point) + AxisX.x;
                } else {
                    return scaleX(parseFloat(d.value)) + AxisX.x;
                }
            })
            .y(function(d) {
                if(isHorizontal) {
                    return scaleY(parseFloat(d.value));
                } else {
                    return scaleY(d.point) + AxisY.y;
                }
            })
            .defined(function(d) {
                console.log("clear:", d);
                return d.value !== null;
            });

        if(points && points.length > 0) {
            context.append('path')
            //.attr('stroke-dasharray', '5,5')//虚线样式
                .attr('stroke', legend.color)//线条颜色 gray DarkGray
                .attr('stroke-width', 1)//线条宽度
                .attr('fill', 'none')//是否填充区域
                .attr('d', lineGenerator(points));
        }
    }

    _drawPoint(context) {

    }

    _drawPointClick(context, data) {
        let scale = this.scale;
        let isHorizontal = this.isHorizontal;
        let scaleX = scale["PointCategories"];
        let scaleY = scale["DataList"];
        let AxisX = this.graph.AxisX;
        let AxisY = this.graph.AxisY;

        let i = this.pointList.length === 0 ? 0 : this.pointList.length - 1;
        let legend = this.legend[i];

        for(let i = 0, len = data.length; i < len; i++) {
            let valueX = data[i].point;
            let valueY = data[i].value;
            if(0 !== valueY && !valueY) continue;
            let x, y;
            if(isHorizontal) {
                x = scaleX(valueX) + AxisX.x;
                y = scaleY(parseFloat(valueY));
            } else {
                x = scaleX(parseFloat(valueY)) + AxisX.x;
                y = scaleY(valueX) + AxisY.y;
            }
            legend.draw(context, x, y);
            //if(i===len-1)console.log(123, data[i]);
        }
    }

    _onClickDatetime(datetime) {
        let line = this.lineMap[datetime];console.log("_onClickDatetime", datetime, line);

        let data = this.pointList;
        if(data.length < 10) {
            data.push(datetime);
        } else {
            return;
        }

        this._drawLineClick(this.svg, line);
        this._drawPointClick(this.svg, line);
        this._drawLegendClick(this.svg, datetime);
    }

}

Distribution.clazz = "distribution";
