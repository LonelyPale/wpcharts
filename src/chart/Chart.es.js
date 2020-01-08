/**
 * # 普通图表
 * # chart
 */
import {extend, formurlencoded, fun_time_level, beautifyDatetime, fun_scale} from "../util/utils"

const fetch = window.fetch || require('node-fetch');
const d3 = window.d3 || require('d3');

let parseTime = d3.timeParse("%Y-%m-%d %H:%M:%S");
//let parseTime = d3.timeParse("%Y-%m-%dT%H:%M:%S");
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

const defaultOptions = {
    url: null,
    request: {
        //method: 'GET',
        method: 'POST',
        //body: JSON.stringify(testData),
        credentials: 'include',
        //mode: 'cors',
        headers: {
            //'Content-Type': 'application/json'
            'Content-Type': 'application/x-www-form-urlencoded'
        }//new Headers()
    },
    data: null,
    action: '', // add
    width: 1000,
    height: 400,
    topHeight: 100,
    bottomHeight: 50,
    leftWidth: 100,
    rightWidth: 100,
    lineWidth: 1
};

//#
export class Chart {

    constructor(selector) {
        this.selector = selector; //选择器
        this.node = undefined; //nodejs

        //this.option = Object.assign({}, defaultOptions); //浅拷贝合并
        //this.option = JSON.parse(JSON.stringify(defaultOptions)); //参数选项
        this.option = extend({}, defaultOptions); //参数选项

        this.physical = new Map(); //物理量 不使用 Object
        this.scale = {}; //比例尺
        this.legend = []; //图例
        this.graph = null; //图形坐标、宽高信息
        this.data = null; //数据集
        this.title = "普通图表"; //标题
        this.svg = null; //svg 对象

        this.lineMap = {};//temp
        this.toolbox = [];//工具箱
    }

    setOption(option) {
        //this.option = Object.assign(this.option, option);
        //# bug-1 todo
        this.option = extend(this.option, option);//console.log(JSON.stringify(this.option.request));

        let self = this;

        if(this.option.url) {
            /*
            d3.json(this.option.url, {}).then(function (data) {
                self.option.data = data;
                self._initData(data);
                self._drawGraph();
                console.log("self.physical:", self.physical);
            });
            */

            let body = this.option.request.body;
            if(typeof body === 'object') {
                //this.option.request.body = JSON.stringify(body);
                this.option.request.body = formurlencoded(body);
                //this.option.request.headers = new Headers({
                //'Content-Type': 'application/json'
                //'Content-Type': 'application/x-www-form-urlencoded'
                //});
            }

            fetch(this.option.url, this.option.request).then(function(response) {
                return response.json();
            }).then(function(data) {
                self.option.data = data;
                self._initData(data);
                self._initGraph();
                self._drawGraph();
                //console.log("self.physical:", self.physical);
            }).catch(function(error) {
                console.log(error);
            });
        } else if(this.option.data) {
            self._initData(this.option.data);
            self._initGraph();
            self._drawGraph();
            //console.log("self.physical:", self.physical);
        }

        return this;
    }

    // sourceData, targetData
    _initData(data) {
        if(this.option.action === 'add') {
            data = JSON.parse(JSON.stringify(data && data.ObservLineList ? data : data.object));
            for(let ii = 0, ii_len = data.ObservLineList.length; ii < ii_len; ii++) {
                let _line = data.ObservLineList[ii];
                let _unit = _line.Unit;
                let _line_id = _line.PointId;
                let _idx = _line_id + '-' + _unit;
                if(!this.lineMap[_idx]) {
                    this.lineMap[_idx] = _line;
                    this.data.ObservLineList.push(_line);
                }
            }
        } else {
            this.data = JSON.parse(JSON.stringify(data && data.ObservLineList ? data : data.object));
        }

        this.title = this.data.Title;

        let sourceData = this.data;
        let targetData = this.physical;
        let datetime = [];

        //只处理10根线
        for(let i = 0, i_len = sourceData.ObservLineList.length < 10 ? sourceData.ObservLineList.length : 10; i < i_len; i++) {
            let line = sourceData.ObservLineList[i];
            let unit = line.Unit;
            let line_id = line.PointId;
            let phys = targetData.get(unit);
            let idx = line_id + '-' + unit;

            //add
            if(!this.lineMap[idx]) {
                this.lineMap[idx] = line;
            }

            if(!phys) {
                //只显示4个物理量
                if(this.option.action === 'add') {
                    if(targetData.size >= 5) {//还有时间 add
                        continue;
                    }
                } else {
                    if(targetData.size >= 4) {
                        continue;
                    }
                }

                phys = {values: []};
                targetData.set(unit, phys);
            }
            let del = [];

            for(let j = 0, j_len = line.ObservPointList.length; j < j_len; j++) {
                let point = line.ObservPointList[j];
                if(point.Value === -99) {
                    // -99为无效值
                    del.unshift(j);//无效值，待删除
                    continue;
                }

                datetime.push(parseTime(point.SuvDate));
                phys.values.push(parseFloat(point.Value));
            }

            //从后向前删除无效值
            for(let k = 0, k_len = del.length; k < k_len; k++) {
                line.ObservPointList.splice(del[k], 1);
            }
        }

        targetData.forEach(function (value, key) {
            value.unit = key;
            value.max = d3.max(value.values);
            value.min = d3.min(value.values);
        });

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
    }

    _initGraph() {
        this.graph = {
            width: this.option.width,
            height: this.option.height,
            top: {
                width: this.option.width,
                height: this.option.topHeight,
                x: 0,
                y: 0
            },
            bottom: {
                width: this.option.width,
                height: this.option.bottomHeight,
                x: 0,
                y: this.option.height - this.option.bottomHeight
            },
            left: {
                width: this.option.leftWidth,
                height: this.option.height - this.option.topHeight - this.option.bottomHeight,
                x: 0,
                y: this.option.topHeight
            },
            right: {
                width: this.option.rightWidth,
                height: this.option.height - this.option.topHeight - this.option.bottomHeight,
                x: this.option.width - this.option.rightWidth,
                y: this.option.topHeight
            }
        };

        this.graph.AxisX = {
            //x: this.option.width * 0.05,
            x: this.graph.left.width,
            y: this.graph.bottom.y,
            //y: this.option.height * 0.9,
            width: this.graph.width - this.graph.left.width - this.graph.right.width,
            height: 40
        };

        this.graph.AxisY = {
            x: this.graph.left.width,
            y: this.graph.left.y,
            height: this.graph.left.height
        };

        //this.graph.x = this.option.width * 0.05;
        //this.graph.y = this.option.height * 0.9;
        //this.graph.xWidth = this.option.width * 0.9;
    }

    _initScale() {

    }

    _initLegend() {
        let legend = this.legend;
        let defaultLegendSize = 20;

        legend[0] = {
            name: "solid_circle",
            color: "Blue",
            draw: function(context, x, y, size) {
                let legendSize = size || defaultLegendSize;
                let symbolGenerator = d3.symbol()
                    .type(d3.symbolCircle)
                    .size(legendSize);
                let pathData = symbolGenerator();

                context.append('path')
                    .attr("transform", `translate(${x}, ${y})`)
                    .attr("d", pathData)
                    .attr("fill", "Blue");

                /*
                let points = [[x, y]];
                context.selectAll("path")
                    .data(points).enter()
                    .append("path")
                    .attr("transform", function(d, index, node) {
                        return "translate(" + d + ")";
                    })
                    .attr("d", pathData)
                    .attr("fill", "Blue");
                */
            }
        };

        legend[1] = {
            name: "hollow_circle",
            color: "Red",
            draw: function(context, x, y, size) {
                let legendSize = size || defaultLegendSize;
                let symbolGenerator = d3.symbol()
                    .type(d3.symbolCircle)
                    .size(legendSize);
                let pathData = symbolGenerator();

                context.append('path')
                    .attr("transform", `translate(${x}, ${y})`)
                    .attr("d", pathData)
                    .attr("fill", "none")
                    .attr("stroke", "Red")
                    .attr("stroke-width", 1);
            }
        };

        legend[2] = {
            name: "solid_rect",
            color: "Cyan",
            draw: function(context, x, y, size) {
                let legendSize = size || defaultLegendSize;
                let symbolGenerator = d3.symbol()
                    .type(d3.symbolSquare)
                    .size(legendSize);
                let pathData = symbolGenerator();

                context.append('path')
                    .attr("transform", `translate(${x}, ${y})`)
                    .attr("d", pathData)
                    .attr("fill", "Cyan");
            }
        };

        legend[3] = {
            name: "hollow_rect",
            color: "Pink",
            draw: function(context, x, y, size) {
                let legendSize = size || defaultLegendSize;
                let symbolGenerator = d3.symbol()
                    .type(d3.symbolSquare)
                    .size(legendSize);
                let pathData = symbolGenerator();

                context.append('path')
                    .attr("transform", `translate(${x}, ${y})`)
                    .attr("d", pathData)
                    .attr("fill", "none")
                    .attr("stroke", "Pink")
                    .attr("stroke-width", 1);
            }
        };

        legend[4] = {
            name: "solid_triangle",
            color: "Green",
            draw: function(context, x, y, size) {
                let legendSize = size || defaultLegendSize;
                let symbolGenerator = d3.symbol()
                    .type(d3.symbolTriangle)
                    .size(legendSize);
                let pathData = symbolGenerator();

                context.append('path')
                    .attr("transform", `translate(${x}, ${y})`)
                    .attr("d", pathData)
                    .attr("fill", "Green");
            }
        };

        legend[5] = {
            name: "hollow_triangle",
            color: "Purple",
            draw: function(context, x, y, size) {
                let legendSize = size || defaultLegendSize;
                let symbolGenerator = d3.symbol()
                    .type(d3.symbolTriangle)
                    .size(legendSize);
                let pathData = symbolGenerator();

                context.append('path')
                    .attr("transform", `translate(${x}, ${y})`)
                    .attr("d", pathData)
                    .attr("fill", "none")
                    .attr("stroke", "Purple")
                    .attr("stroke-width", 1);
            }
        };

        legend[6] = {
            name: "solid_inverted_triangle",
            color: "LightBlue",
            draw: function(context, x, y, size) {
                let legendSize = size || defaultLegendSize;
                let symbolGenerator = d3.symbol()
                    .type(d3.symbolTriangle)
                    .size(legendSize);
                let pathData = symbolGenerator();

                context.append('path')
                    .attr("transform", `translate(${x}, ${y})rotate(180)`)
                    .attr("d", pathData)
                    .attr("fill", "LightBlue");
            }
        };

        legend[7] = {
            name: "hollow_inverted_triangle",
            color: "PaleVioletRed",
            draw: function(context, x, y, size) {
                let legendSize = size || defaultLegendSize;
                let symbolGenerator = d3.symbol()
                    .type(d3.symbolTriangle)
                    .size(legendSize);
                let pathData = symbolGenerator();

                context.append('path')
                    .attr("transform", `translate(${x}, ${y})rotate(180)`)
                    .attr("d", pathData)
                    .attr("fill", "none")
                    .attr("stroke", "PaleVioletRed")
                    .attr("stroke-width", 1)
            }
        };

        legend[8] = {
            name: "solid_rhombus",
            color: "SeaGreen",
            draw: function(context, x, y, size) {
                let legendSize = size || defaultLegendSize;
                let symbolGenerator = d3.symbol()
                    .type(d3.symbolDiamond)
                    .size(legendSize);
                let pathData = symbolGenerator();

                context.append('path')
                    .attr("transform", `translate(${x}, ${y})`)
                    .attr("d", pathData)
                    .attr("fill", "SeaGreen");
            }
        };

        legend[9] = {
            name: "hollow_rhombus",
            color: "Yellow",
            draw: function(context, x, y, size) {
                let legendSize = size || defaultLegendSize;
                let symbolGenerator = d3.symbol()
                    .type(d3.symbolDiamond)
                    .size(legendSize);
                let pathData = symbolGenerator();

                context.append('path')
                    .attr("transform", `translate(${x}, ${y})`)
                    .attr("d", pathData)
                    .attr("fill", "none")
                    .attr("stroke", "Yellow")
                    .attr("stroke-width", 1);
            }
        };
    }

    _initToolbox() {
        let self = this;
        let toolbox = this.toolbox;
        // 操作：下载图片
        toolbox.push({
            title: "PNG",
            run: self._downloadPNG,
        });
        toolbox.push({
            title: "SVG",
            run: self._downloadSVG,
        });
        toolbox.push({
            title: "EMF",
            run: self._downloadEMF,
        });

        toolbox.push({
            title: "重置",
            run: () => self._drawGraph(),
        });

    }

    _drawClear() {
        //d3.selectAll("svg").remove();
        d3.select(this.selector).select("svg").remove();
    }

    _drawGraph(callback, cb) {
        if(callback) callback();

        let self = this;

        this._drawClear();

        this.svg = d3.select(this.selector).append("svg")
            .attr('xmlns', 'http://www.w3.org/2000/svg')
            .attr("width", this.graph.width)
            .attr("height", this.graph.height);

        if(cb) cb();

        this.svg.append("text")
            .attr("class", "title")
            .text(this.title)
            //.attr("transform", `translate(${this.graph.top.width / 2 - 60}, ${this.graph.top.height / 2 - 30})`);
            .attr("transform", `translate(${this.graph.top.width / 2 - 60}, ${20})`);

        this._drawLegend(this.svg);
        this._drawAxis(this.svg);
        this._drawLine(this.svg);
        this._drawPoint(this.svg);
        this._drawToolbox(this.svg);

        /*
        d3.text("/d3/d3-v5.9.7/plugins/d3.hydrograph.css", {}).then(function (data) {
            //console.log("css:", data);
            self.svg.append("style").attr("type", "text/css").attr("media", "screen").text(data);
        });
        */
        if(self.node) {//node
            if(self.node.style) {
                self.svg.append("style").attr("type", "text/css").attr("media", "screen").text(self.node.style);
            }
            if(self.node.response && self.node.document) {
                self.node.response.statusCode = 200;
                self.node.response.setHeader('Content-Type', 'image/svg+xml');
                self.node.response.send(self.node.document.body.innerHTML);
            }
        } else {
            fetch("/d3/d3-v5.9.7/plugins/d3.hydrograph.css").then(function(response) {
                return response.text();
            }).then(function(text) {
                //console.log("css:", text);
                self.svg.append("style").attr("type", "text/css").attr("media", "screen").text(text);
            }).catch(function(error) {
                console.log(error);
            });
        }

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

        /*
        let physical = this.physical;
        physical.forEach(function (value, key) {
            if(key === "datetime") return;
            context.append();
        });
        */

        //只处理10根线
        let lines = data.ObservLineList;
        for(let i = 0, i_len = lines.length < 10 ? lines.length : 10; i < i_len; i++) {
            let line = lines[i];
            let unit = line.Unit;
            let pointId = line.PointId;
            let legend = this.legend[i];

            let x_legend = i * rectWidth + i * 5;
            let y_legend = rectHeight / 2;
            context.append("rect")
                .attr("x", x_legend)
                .attr("width", rectWidth)
                .attr("height", rectHeight);

            context.append("text")
                .text(pointId)
                .attr("transform", `translate(${x_legend + 20}, ${y_legend - 15})`);
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
        }

        /*
        this.legend[0].draw(this.svg, 50, 20);
        this.legend[1].draw(this.svg, 70, 20);
        this.legend[2].draw(this.svg, 90, 20);
        this.legend[3].draw(this.svg, 110, 20);
        this.legend[4].draw(this.svg, 130, 20);
        this.legend[5].draw(this.svg, 150, 20);
        this.legend[6].draw(this.svg, 170, 20);
        this.legend[7].draw(this.svg, 190, 20);
        this.legend[8].draw(this.svg, 210, 20);
        this.legend[9].draw(this.svg, 230, 20);
        */

    }

    _drawAxis(context) {
        let axis = context.append('g')
            .attr("class", "axis");
        this._drawAxisX(axis);
        this._drawAxisY(axis);
    }

    _drawAxisX(context) {
        let datetime = this.physical.get("datetime");
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
            if(i !== 0) {
                //虚线X
                tick.append("line")
                    .attr("stroke-dasharray", 2)
                    .attr("y2", -AxisY.height)
                    .style("opacity", 0.5);
            }
        }
        let t = tick1.append("g")
            .attr("class", 'tick')
            .attr("transform", `translate(${width - 1}, 0)`);
        t.append("line")
            .attr("y2", 20);

        //虚线X right
        t.append("line")
            .attr("stroke-dasharray", 2)
            .attr("y2", -AxisY.height)
            .style("opacity", 0.5);

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
        let phys = this.physical;
        let phys_index = 0;

        let graph = this.graph;
        let AxisY = this.graph.AxisY;
        //let x = AxisY.x;
        //let y = AxisY.y;
        let height = AxisY.height;

        let scale = this.scale;
        let scaleMaster;

        //只处理4个物理量
        phys.forEach(function(value, key) {
            //console.log("phys-key:", key);
            if(key === "datetime") return;
            phys_index += 1;

            let yScale, yAxis;
            let x, y;

            //let diff = value.max - value.min;
            //let space = diff * 0.1;
            //let min = value.min - space;
            //let max = value.max + space;
            let min = value.min;
            let max = value.max;

            if(scaleMaster) {
                yScale = scaleMaster.copy().domain([min, max]);//.nice()
            } else {
                yScale = d3.scaleLinear()
                    .domain([min, max])
                    .range([AxisY.y + AxisY.height, AxisY.y]);//.nice()
                scaleMaster = yScale;
            }
            scale[key] = yScale;

            if(phys_index === 1) {
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
                    .text(value.unit);
            } else if(phys_index === 2) {
                x = graph.right.x;
                y = AxisY.y;

                yAxis = d3.axisRight(yScale)
                    .tickValues(fun_scale(min, max))
                    //.ticks(7) //刻度数量
                    .tickSize(0) //控制刻度的大小
                    .tickPadding(20) //设置标签数字与坐标轴的距离
                    .tickFormat(d3.format(".2f")); //设置标签数字的格式
                context.append('g')
                    .attr("class", "y-axis-2")
                    .attr("transform", `translate(${x-1}, ${-0.5})`)
                    .call(yAxis);

                context.append('text')
                    .attr("font-family", "sans-serif")
                    .attr("font-size", "11px")
                    .attr("fill", "black")
                    .attr("x", x)
                    .attr("y", y-6)
                    .text(value.unit);
            } else if(phys_index === 3) {
                x = AxisY.x - 50;
                y = AxisY.y;
                yAxis = d3.axisLeft(yScale).tickSize(0).tickPadding(20)
                //.ticks(7)
                    .tickValues(fun_scale(min, max)).tickFormat(d3.format(".2f"));
                context.append('g')
                    .attr("class", "y-axis-3")
                    .attr("transform", `translate(${x}, ${-0.5})`)
                    .call(yAxis);
                context.append('text')
                    .attr("font-family", "sans-serif")
                    .attr("font-size", "11px")
                    .attr("fill", "black")
                    .attr("x", x)
                    .attr("y", graph.bottom.y + 20)
                    .text(value.unit);
            } else if(phys_index === 4) {
                x = graph.right.x + 50;
                y = AxisY.y;

                yAxis = d3.axisRight(yScale)
                //.ticks(7)
                    .tickValues(fun_scale(min, max))
                    .tickSize(0) //控制刻度的大小
                    .tickPadding(20) //设置标签数字与坐标轴的距离
                    .tickFormat(d3.format(".2f")); //设置标签数字的格式
                context.append('g')
                    .attr("class", "y-axis-4")
                    .attr("transform", `translate(${x-1}, ${-0.5})`)
                    .call(yAxis);

                context.append('text')
                    .attr("font-family", "sans-serif")
                    .attr("font-size", "11px")
                    .attr("fill", "black")
                    .attr("x", x)
                    .attr("y", graph.bottom.y + 20)
                    .text(value.unit);
            }
        });

        //context.selectAll(".y-axis .tick line").remove();
        //context.selectAll(".y-axis-2 .tick line").remove();
        //context.selectAll(".y-axis-3 .tick line").remove();
        //context.selectAll(".y-axis-4 .tick line").remove();

        //虚线 Y
        context.selectAll(".y-axis .tick").append("line")
            .attr("stroke-dasharray", 2)
            .attr("x2", graph.AxisX.width)
            .style("opacity", 0.5);

        /*
        let yDataSet = [1010, 1050, 1100, 1150, 1190, 1245];
        let yScale = d3.scaleLinear()
            .domain([d3.min(yDataSet), d3.max(yDataSet)])
            .range([canvasHeight - padding.top - padding.bottom, 0]);
        let yAxis = d3.axisRight(yScale).tickValues(yDataSet);
        svg.append('g')
            .attr("class", "axis")
            .attr("transform", `translate(${canvasWidth - padding.right}, ${padding.top})`)
            .call(yAxis);
            */
    }

    _drawLine(context) {
        let data = this.data;
        let scale = this.scale;
        let scaleX = scale["datetime"];

        //只处理10根线
        let lines = data.ObservLineList;
        for(let i = 0, i_len = lines.length < 10 ? lines.length : 10; i < i_len; i++) {
            let line = lines[i];
            let points = line.ObservPointList;
            let unit = line.Unit;
            //let pointId = line.PointId;

            let scaleY = scale[unit];
            let legend = this.legend[i];
            let lineGenerator = null;

            if(points.length === 0) continue;//跳过没有数据的线

            //用闭包保存住当前循环的i的值。
            (function(scaleY){
                lineGenerator = d3.line()
                    .x(function(d) {
                        //console.log(d.SuvDate, scaleX(parseTime(d.SuvDate)));
                        //console.log(d.SuvDate, parseTime(d.SuvDate), typeof parseTime(d.SuvDate));
                        return scaleX(parseTime(d.SuvDate));
                    })
                    .y(function(d) {
                        return scaleY(d.Value);
                    });
            })(scaleY);

            context.append('path')
            //.attr('stroke-dasharray', '5,5')//虚线样式
                .attr('stroke', legend.color)//线条颜色 gray DarkGray
                .attr('stroke-width', 1)//线条宽度
                .attr('fill', 'none')//是否填充区域
                .attr('d', lineGenerator(points));

            //for(let j = 0, j_len = points.length; j < j_len; j++) {
            //}
        }
    }

    _drawPoint(context) {
        let data = this.data;
        let scale = this.scale;
        let scaleX = scale["datetime"];

        //只处理10根线
        let lines = data.ObservLineList;
        for(let i = 0, i_len = lines.length < 10 ? lines.length : 10; i < i_len; i++) {
            let line = lines[i];
            let points = line.ObservPointList;
            let unit = line.Unit;
            //let pointId = line.PointId;

            let scaleY = scale[unit];
            let legend = this.legend[i];

            let pointsLength = points.length;
            let pointsSpace = Math.floor(points.length / 10);
            let point, j, x, y;
            if(pointsLength <= 12) {
                //显示所有的点
                for(j = 0; j < pointsLength; j++) {
                    point = points[j];
                    x = scaleX(parseTime(point.SuvDate));
                    y = scaleY(point.Value);
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
                    x = scaleX(parseTime(point.SuvDate));
                    y = scaleY(point.Value);
                    legend.draw(context, x, y);
                }
                legend.draw(context, scaleX(parseTime(points[0].SuvDate)), scaleY(points[0].Value));//第一个点
                legend.draw(context, scaleX(parseTime(points[pointsLength - 1].SuvDate)), scaleY(points[pointsLength - 1].Value));//最后一个点
            }

            /*
                .on('mouseover', function(a) {
                                console.log("mouseover:", a);
                            })
                            .on('mouseout', function(a) {
                                console.log("mouseout:", a);
                            });
            */
        }
    }

    _drawToolbox(context) {
        let self = this;
        let toolbox = this.toolbox;
        for(let i = 0, len = toolbox.length; i < len; i++) {
            let action = toolbox[i];
            this.svg.append('text')
                .attr("class", "op-download")
                .attr("font-family", "sans-serif")
                .attr("font-size", "11px")
                .attr("fill", "#FF0000")
                .attr("x", 30 * i)
                .attr("y", 25)
                .text(action.title)
                .on("click", function() {
                    action.run(self);
                });
        }
    }

    //png
    _downloadPNG(self) {
        let svg = self.svg;
        svg.selectAll(".op-download").style("display", "none");
        svg.selectAll(".time-axis").style("display", "none");

        let serializer = new XMLSerializer();
        let source = serializer.serializeToString(self.svg.node());//console.log(source);

        svg.selectAll(".op-download").style("display", "");
        svg.selectAll(".time-axis").style("display", "");

        //let css = '<?xml-stylesheet type="text/css" href="d3.hydrograph.css"?>\r\n';

        source = '<?xml version="1.0" standalone="no"?>\r\n' + source;
        let url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(source);
        //document.write('<img src="' + url + '"/>');//输出svg图像,会覆盖源html文档页面

        let root = document.getElementById(self.selector.substr(1));
        let img = document.getElementById("download_image");
        if(img) {
            img.src = url;//重复下载时刷新图片
        } else {
            img = document.createElement("img");
            img.style.display = "none";//不显示图片
            img.id = "download_image";
            img.src = url;
            root.appendChild(img);//可以重复添加
        }

        let canvas = document.createElement("canvas");
        canvas.width = self.graph.width;
        canvas.height = self.graph.height;

        let context = canvas.getContext("2d");
        context.fillStyle = "#FFFFFF";//必须先设置背景色
        context.fillRect(0, 0, canvas.width, canvas.height);//然后再设置背景大小

        let image = new Image;
        image.src = document.getElementsByTagName('img')[0].src;
        image.onload = function() {
            context.drawImage(image, 0, 0);//再绘制svg图
            let a = document.createElement("a");//console.log(a);
            //a.target = "_blank";
            a.download = self.title + ".png";
            a.href = canvas.toDataURL("image/png");//获取图片合并后的data-URL,参数可选图片格式，图片质量，详自查API
            a.click();
            //canvas.style.display = "none";
        };
    }

    //svg
    _downloadSVG(self) {
        self.option.request.body += "&callback=http://192.168.1.139:8060";
        fetch("http://192.168.1.149:8888/hydrograph", self.option.request).then(function(response) {
            return response.blob();
        }).then(function(blob) {
            let a = document.createElement('a');
            let url = window.URL.createObjectURL(blob);   // 获取 blob 本地文件连接 (blob 为纯二进制对象，不能够直接保存到磁盘上)
            //let filename = res.headers.get('Content-Disposition');
            a.href = url;
            //a.download = filename;
            a.download = self.title + ".svg";
            a.click();
            window.URL.revokeObjectURL(url);
        }).catch(function(error) {
            console.log(error);
        });
    }

    //emf
    _downloadEMF(self) {
        fetch("/api/image/hydrograph", self.option.request).then(function(response) {
            return response.blob();
        }).then(function(blob) {
            let a = document.createElement('a');
            let url = window.URL.createObjectURL(blob);   // 获取 blob 本地文件连接 (blob 为纯二进制对象，不能够直接保存到磁盘上)
            //let filename = res.headers.get('Content-Disposition');
            a.href = url;
            //a.download = filename;
            a.download = self.title + ".emf";
            a.click();
            window.URL.revokeObjectURL(url);
        }).catch(function(error) {
            console.log(error);
        });
    }

}

Chart.clazz = "chart";//静态属性

Chart.print = function(msg) {//静态方法
    console.log("print:", msg);
};

Chart.prototype.title = "普通图表";//原型属性

Chart.prototype.log = function (msg) {//原型方法
    console.log("log:", msg);
};

//实例属性 this.attr = 1;
//实例方法 this.fun = function() {};
