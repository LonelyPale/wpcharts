/**
 * # 相关图
 * # correlation
 */
import {Chart} from "./Chart";
import {fun_scale} from "../util/utils";
import {Point} from "../math/geometry/Point";
import {GrahamsScan} from "../math/geometry/algorithm/GrahamsScan";

export class Correlation extends Chart {

    constructor(selector) {
        super(selector);
        this.title = "相关图"; //标题
    }

    _initData(data) {
        //super._initData(data);
        this.data = JSON.parse(JSON.stringify(data && data.designcode ? data : data.object));
        this.title = this.data.title;

        let sourceData = this.data;
        let targetData = this.physical;

        let values_x = [];
        let values_y = [];

        //散点
        if(sourceData.scatterDataList && sourceData.scatterDataList.length > 0) {
            for(let i = 0, len = sourceData.scatterDataList.length; i < len; i++) {
                let item = sourceData.scatterDataList[i];
                values_x.push(parseFloat(item.valueX));
                values_y.push(parseFloat(item.valueY));
            }
        }

        //直线
        if(sourceData.lineDataList && sourceData.lineDataList.length > 0) {
            for(let i = 0, len = sourceData.lineDataList.length; i < len; i++) {
                let item = sourceData.lineDataList[i];
                values_x.push(parseFloat(item.valueX));
                values_y.push(parseFloat(item.valueY));
            }
        }

        //曲线
        if(sourceData.polynomialDataList && sourceData.polynomialDataList.length > 0) {
            for(let i = 0, len = sourceData.polynomialDataList.length; i < len; i++) {
                let item = sourceData.polynomialDataList[i];
                values_x.push(parseFloat(item.valueX));
                values_y.push(parseFloat(item.valueY));
            }
        }

        targetData.set("axisXLabel", {values: values_x, unit: sourceData.axisXLabel});
        targetData.set("axisYLabel", {values: values_y, unit: sourceData.axisYLabel});

        targetData.forEach(function (value, key) {
            value.max = d3.max(value.values);
            value.min = d3.min(value.values);
        });

        this._initLegend();
        this._initToolbox();
    }

    _initToolbox() {
        super._initToolbox();
        let toolbox = this.toolbox;

        toolbox.push({
            title: "包络图",
            run: () => {
                //console.log(this);
                let data = this.data;
                let scatterDataList = data.scatterDataList;
                let scale = this.scale;
                let scaleX = scale["axisXLabel"];
                let scaleY = scale["axisYLabel"];
                let points = [];
                let pointsMap = {};

                for(let i = 0, len = scatterDataList.length; i < len; i++) {
                    let item = scatterDataList[i];
                    let valueX = scaleX(parseFloat(item.valueX));
                    let valueY = scaleY(parseFloat(item.valueY));
                    let index = valueX + "-" + valueY;
                    if(!pointsMap[index]) {
                        points.push(new Point(valueX, valueY));
                        pointsMap[index] = 1;
                    }
                }

                let pointsConvexHull = new GrahamsScan().getConvexHull(points);

                let lineGenerator = d3.line()
                    .x(function(d) {
                        return (d.x);
                    })
                    .y(function(d) {
                        return (d.y);
                    });

                if(pointsConvexHull && pointsConvexHull.length > 0) {
                    let color = '#FF9966';// #FFFF00 #FF9966 #FF9999
                    let context = this.svg;
                    context.append('path')
                        //.attr('stroke-dasharray', '5,5')//虚线样式
                        .attr('stroke', color)//线条颜色 gray DarkGray
                        .attr('stroke-width', 1)//线条宽度
                        .attr('fill', color)//是否填充区域
                        .attr('fill-opacity', '0.5')//设置描边透明度可以使用stroke-opacity属性，设置元素透明度可以使用fill-opacity属性。
                        .attr('d', lineGenerator(pointsConvexHull));
                }
            },
        });

        toolbox.push({
            title: "分年连线",
            run: () => {
            },
        });

    }

    _drawLegend(context) {
        let data = this.data;
        let x = this.graph.left.width;
        let y = this.graph.top.height - 40;
        let rectWidth = 80;
        let rectHeight = 20;

        context = context.append('g')
            .attr("class", "legend")
            .attr("transform", `translate(${x}, ${y})`);

        //只处理3个图例
        let lines = ["实测值", "直线相关拟合线", "多项式相关拟合线"];
        for(let i = 0, i_len = lines.length; i < i_len; i++) {
            let line = lines[i];
            let unit = "";
            let pointId = line;
            let legend = this.legend[i];

            let x_legend = i * rectWidth + i * 5;
            let y_legend = rectHeight / 2;
            context.append("rect")
                .attr("x", x_legend)
                .attr("width", rectWidth)
                .attr("height", rectHeight);

            if(i === 0) {
                context.append("text")
                    .text(pointId)
                    .attr("transform", `translate(${x_legend + 20}, ${y_legend - 15})`);
                context.append("text")
                    .text(unit)
                    .attr("transform", `translate(${x_legend + 20}, ${y_legend - 30})`);
            } else if(i === 1) {
                context.append("text")
                    .text(pointId)
                    .attr("transform", `translate(${x_legend + 40}, ${y_legend - 15})`);
                context.append("text")
                    .text(unit)
                    .attr("transform", `translate(${x_legend + 40}, ${y_legend - 30})`);
            } else if(i === 2) {
                context.append("text")
                    .text(pointId)
                    .attr("transform", `translate(${x_legend + 50}, ${y_legend - 15})`);
                context.append("text")
                    .text(unit)
                    .attr("transform", `translate(${x_legend + 50}, ${y_legend - 30})`);
            }


            context.append("line")
                .attr("x1", x_legend + 5)
                .attr("y1", y_legend)
                .attr("x2", x_legend + rectWidth - 5)
                .attr("y2", y_legend)
                .attr("stroke", legend.color);
            legend.draw(context, x_legend + 40, y_legend, 80);
        }

    }

    _drawAxisX(context) {
        let axisObj = this.physical.get("axisXLabel");

        let graph = this.graph;
        let AxisX = this.graph.AxisX;
        let x = AxisX.x;
        let y = AxisX.y;
        let width = AxisX.width;
        let AxisY = this.graph.AxisY;

        let scale = this.scale;
        let scaleMaster;
        let scaleObj;
        let min = axisObj.min;
        let max = axisObj.max;

        if(scaleMaster) {
            scaleObj = scaleMaster.copy().domain([min, max]);//.nice()
        } else {
            scaleObj = d3.scaleLinear()
                .domain([min, max])
                .range([AxisX.x, AxisX.x + AxisX.width]);//.nice()
            scaleMaster = scaleObj;
        }
        scale["axisXLabel"] = scaleObj;

        let axisRoot = context.append('g')
            .attr("class", "x-axis")
            .attr("transform", `translate(${x},${y})`);

        let axisX = d3.axisBottom(scaleObj).tickSize(0).tickPadding(12)
        //.ticks(7)
            .tickValues(fun_scale(min, max)).tickFormat(d3.format(".2f"));
        context.append('g')
            .attr("class", "x-axis")
            .attr("transform", `translate(${0}, ${y-1})`)
            .call(axisX);
        context.append('text')
            .attr("font-family", "sans-serif")
            .attr("font-size", "11px")
            .attr("fill", "black")
            .attr("x", x + width + 28)
            .attr("y", y)
            .text(axisObj.unit);

        //虚线 X
        context.selectAll(".x-axis .tick").append("line")
            .attr("stroke-dasharray", 2)
            .attr("y2", -graph.AxisY.height)
            .style("opacity", 0.5);

    }

    _drawAxisY(context) {
        let axisObj = this.physical.get("axisYLabel");

        let graph = this.graph;
        let AxisY = this.graph.AxisY;
        let height = AxisY.height;

        let scale = this.scale;
        let scaleMaster;

        let yScale, yAxis;
        let x, y;

        //let diff = value.max - value.min;
        //let space = diff * 0.1;
        //let min = value.min - space;
        //let max = value.max + space;
        let min = axisObj.min;
        let max = axisObj.max;

        if(scaleMaster) {
            yScale = scaleMaster.copy().domain([min, max]);//.nice()
        } else {
            yScale = d3.scaleLinear()
                .domain([min, max])
                .range([AxisY.y + AxisY.height, AxisY.y]);//.nice()
            scaleMaster = yScale;
        }
        scale["axisYLabel"] = yScale;

        x = AxisY.x;
        y = AxisY.y;
        yAxis = d3.axisLeft(yScale).tickSize(0).tickPadding(20)
        //.ticks(7)
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
    }

    _drawLine(context) {
        let data = this.data;
        let scale = this.scale;

        //直线
        let points = data.lineDataList;
        let designcode = data.designcode;

        let scaleX = scale["axisXLabel"];
        let scaleY = scale["axisYLabel"];
        let legend = this.legend[1];
        let lineGenerator = null;

        lineGenerator = d3.line()
            .x(function(d) {
                return scaleX(parseFloat(d.valueX));
            })
            .y(function(d) {
                return scaleY(parseFloat(d.valueY));
            });

        if(points && points.length > 0) {
            context.append('path')
            //.attr('stroke-dasharray', '5,5')//虚线样式
                .attr('stroke', legend.color)//线条颜色 gray DarkGray
                .attr('stroke-width', 1)//线条宽度
                .attr('fill', 'none')//是否填充区域
                .attr('d', lineGenerator(points));
        }

        //曲线
        points = data.polynomialDataList;
        legend = this.legend[2];
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
        let data = this.data.scatterDataList;
        let legend = this.legend[0];
        let scale = this.scale;
        let scaleX = scale["axisXLabel"];
        let scaleY = scale["axisYLabel"];

        for(let i = 0, len = data.length; i < len; i++) {
            let valueX = data[i].valueX;
            let valueY = data[i].valueY;
            let x = scaleX(parseFloat(valueX));
            let y = scaleY(parseFloat(valueY));
            legend.draw(context, x, y);
            if(valueY < 0) {
                console.log("valueY:", valueY);
            }
        }
    }

}

Correlation.clazz = "correlation";
