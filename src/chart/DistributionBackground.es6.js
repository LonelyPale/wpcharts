import {Distribution} from "./Distribution";
import {beautifyDatetime, fun_scale} from "../util/utils";

let parseTime = d3.timeParse("%Y-%m-%d %H:%M:%S");
let formatTime = d3.timeFormat("%Y-%m-%d %H:%M:%S");

export class DistributionBackground extends Distribution {

    constructor(selector) {
        super(selector);
        this.title = "带背景分布图"; //标题
        this.option.height = 750;
        this.option.isHorizontal = true; //只能画水平方向的背景图
        this.zoom = 0.55; // 缩放比例
    }

    _initData(data) {
        super._initData(data);
        let width = this.option.width;
        let imageWidth = this.data.imageWidth;
        let imageHeight = this.data.imageHeight;
        let zoom = !imageWidth || !imageHeight ? 1 :
            imageWidth > width ? width / imageWidth : 1;
        this.zoom = zoom;
        this.option.height = this.option.topHeight + imageHeight * zoom + this.option.bottomHeight;
    }

    _drawGraph(callback) {
        super._drawGraph(null, () => {
            let path = "/wpcharts/dist/image/";
            // 插入背景图片
            this.svg.selectAll("image")
                .data([""])
                .enter()
                .append("image")
                .attr("x",0)
                .attr("y", this.graph.top.height)
                .attr("width", this.data.imageWidth * this.zoom)
                .attr("height", this.data.imageHeight * this.zoom)
                .attr("xlink:href", this.data.imageFile);
        });
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
        let xScale = (v) => {
            let zoom = this.zoom;
            let plotExpandCoef = this.data.plotExpandCoef;
            let topHeight = this.graph.top.height;

            let pointX = v.pointX;
            let pointY = v.pointY;
            let plotAngle = v.plotAngle;
            let value = v.value;
            let valueY = v.valueY;

            let x;
            if(!!this.data.dataYList) {
                x = (pointX) * zoom;
            } else {
                x = (pointX + value * Math.cos(plotAngle * Math.PI / 180) * plotExpandCoef) * zoom;
            }

            return x;
        };
        let xAxis;

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
        }

        let t = tick1.append("g")
            .attr("class", 'tick')
            .attr("transform", `translate(${width - 1}, 0)`);
        t.append("line")
            .attr("y1", xAxis_y)
            .attr("y2", xAxis_y + 20);

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

    }

    _drawAxisY(context) {
        let scale = this.scale;
        scale["DataList"] = (v) => {
            let zoom = this.zoom;
            let plotExpandCoef = this.data.plotExpandCoef;
            let topHeight = this.graph.top.height;

            let pointX = v.pointX;
            let pointY = v.pointY;
            let plotAngle = v.plotAngle;
            let value = v.value;
            let valueY = v.valueY;

            let y;
            if(!!this.data.dataYList) {
                y = (valueY) * zoom + topHeight;
            } else {
                y = (pointY - value * Math.sin(plotAngle * Math.PI / 180) * plotExpandCoef) * zoom + topHeight;
            }

            return y;
        };
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
        let legend = this.legend[i];// todo bug fix

        lineGenerator = d3.line()
            .x(function(d) {
                return scaleX(d);
            })
            .y(function(d) {
                return scaleY(d);
            })
            .defined(function(d) {
                console.log("clear:", d);
                return !!d.value && !!d.plotAngle;
            });

        if(points && points.length > 0) {
            let groupPointLength = 0;//last
            let groupPointCount = this.data.groupPointCount;
            if(groupPointCount.length > 1) {
                for(let i = 0, len = groupPointCount.length; i < len; i++) {
                    let count = groupPointLength + groupPointCount[i];
                    let pointsGroup = [];

                    for(let j = groupPointLength; j < count; j++) {
                        pointsGroup.push(points[j]);
                    }

                    groupPointLength = count;

                    context.append('path')
                    //.attr('stroke-dasharray', '5,5')//虚线样式
                        .attr('stroke', legend.color)//线条颜色 gray DarkGray
                        .attr('stroke-width', 1)//线条宽度
                        .attr('fill', 'none')//是否填充区域
                        .attr('d', lineGenerator(pointsGroup));
                }
            } else {
                context.append('path')
                //.attr('stroke-dasharray', '5,5')//虚线样式
                    .attr('stroke', legend.color)//线条颜色 gray DarkGray
                    .attr('stroke-width', 1)//线条宽度
                    .attr('fill', 'none')//是否填充区域
                    .attr('d', lineGenerator(points));
            }
        }

    }

    _drawPointClick(context, data) {
        let scale = this.scale;
        let isHorizontal = this.isHorizontal;
        let scaleX = scale["PointCategories"];
        let scaleY = scale["DataList"];
        let AxisX = this.graph.AxisX;
        let AxisY = this.graph.AxisY;
        let topHeight = this.graph.top.height;

        let i = this.pointList.length === 0 ? 0 : this.pointList.length - 1;
        let legend = this.legend[i];

        for(let i = 0, len = data.length; i < len; i++) {
            if(!data[i].pointX || !data[i].value) continue;

            let valueX = data[i].pointX * this.zoom;
            let valueY = data[i].pointY * this.zoom + topHeight;

            let x, y;
            x = scaleX(data[i]);
            y = scaleY(data[i]);

            let line_ext = context.append("line")
                .attr("class", "line_ext")
                .attr("stroke", legend.color)
                .attr("x1", x)
                .attr("y1", y)
                .attr("x2", valueX)
                .attr("y2", valueY);
        }

        /*
        // 画原始测点，用来校对线是否正确
        for(let i = 0, len = data.length; i < len; i++) {
            let valueX = data[i].pointX;
            let valueY = data[i].pointY;
            if(0 !== valueY && !valueY) continue;
            let x, y;
            x = valueX * this.zoom;
            y = valueY * this.zoom + topHeight;
            legend.draw(context, x, y);
        }
        */
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
        this._drawLegendClick(this.svg, datetime);
        if(!this.data.dataYList) this._drawPointClick(this.svg, line);
    }

}

DistributionBackground.clazz = "distribution-background";
