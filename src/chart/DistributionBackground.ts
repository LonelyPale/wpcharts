import d3 from "d3";
import {Svg} from "../svg/Svg";
import {Rect} from "../svg/Rect";
import {Path} from "../svg/Path";
import {Line} from "../svg/Line";
import {ImageSvg} from "../svg/ImageSvg";
import {Distribution} from "./Distribution";
import {Component} from "../component/Component";
import {TimeAxis} from "../component/axis/TimeAxis";
import {Style} from "../svg/Style";
import {LineObject} from "../object/LineObject";
import {Legend} from "../component/legend/Legend";

export class DistributionBackground extends Distribution {

    public static readonly clazz: string = "distribution-background";
    public static readonly title: string = "带背景分布图";

    zoom: number = 0.55; //缩放比例

    constructor(selector: string) {
        super(selector);
        this.isHorizontal = true; //只能画水平方向的背景图
        this.option.view.height = 750;
    }

    protected initData() {
        super.initData();

        let width = this.option.view.width;
        let imageWidth = this.data.imageWidth;
        let imageHeight = this.data.imageHeight;
        let zoom = !imageWidth || !imageHeight ? 1 :
            imageWidth > width ? width / imageWidth : 1;

        this.zoom = zoom;
        this.option.view.height = this.option.view.top + imageHeight * zoom + this.option.view.bottom;

        let {imageFile} = this.data;
        if (imageFile && !imageFile.startsWith('http://') && !imageFile.startsWith('https://')) {
            //console.log('Window Location:', window.location);
            if (imageFile.startsWith('/')) {
                imageFile = window.location.origin + imageFile;
            } else {
                imageFile = window.location.origin + '/' + imageFile;
            }
        }
        this.backgroundImage = imageFile;

    }

    protected initView() {
        let {width, height, top, bottom, left, right} = this.option.view;
        let {rotate} = this.option.style;

        this.remove();
        this.svg = new Svg(d3.select(this.selector), {width, height});
        if (rotate) {
            this.svg.transform(`rotate(${rotate})`);
        }

        this.styleComponent = new Style({"type": "text/css", "media": "screen"});

        this.topComponent = new Component({attribute: {class: 'top'}});
        this.bottomComponent = new Component({attribute: {class: 'bottom'}});
        this.gridComponent = new Component({attribute: {class: 'grid'}});

        this.topComponent.setView({x: 0, y: 0, width, height: top});
        this.bottomComponent.setView({x: 0, y: height - bottom, width, height: bottom, left: left, right: right});
        this.gridComponent.setView({x: left, y: top, width: width - left - right, height: height - top - bottom});

        this.svg.append(this.styleComponent); //添加 css 样式文件

        //# 全图背景, 解决 node 转换为 png 时没有背景的问题, 注意: 自带背景图的就不需要了。
        //this.svg.append(new Rect({width, height, fill: 'white', class: 'background'}));

        //插入背景图片
        let {zoom} = this;
        let {imageWidth, imageHeight, imageFile} = this.data;
        let image = new ImageSvg({x: 0, y: top, width: imageWidth * zoom, height: imageHeight * zoom, "xlink:href": imageFile, class: 'background-image'});
        this.svg.append(image);

        this.svg.append(this.topComponent);
        this.svg.append(this.bottomComponent);
        this.svg.append(this.gridComponent);

        //# 线、点、图例
        this.linesComponent = <Component>this.gridComponent.append(new Component({attribute: {class: 'lines'}}));
        this.pointsComponent = <Component>this.gridComponent.append(new Component({attribute: {class: 'points'}}));
        this.legendsComponent = <Component>new Component({attribute: {class: 'legends'}}).setView({
            x: 50,
            y: 25,
            width: 900,
            height: 70,
            boxOrient: "horizontal"
        });
        this.topComponent.append(this.legendsComponent);

        //# 粘合-移动线
        this.moveLineComponent = <Component>this.gridComponent.append(new Component({attribute: {class: 'move-line'}}));
    }

    protected initBackground(): void {
        //# 不需要背景框
    }

    protected initModel(): void {
        super.initModel();

        let {modelMap, xAxisName, yAxisName, data, zoom, table} = this;

        modelMap[xAxisName].scale = (d: any): number => {
            let zoom = this.zoom;
            let plotExpandCoef = this.data.plotExpandCoef;

            let value = table.field('Value', d);
            let pointX = table.field('pointX', d);
            let pointY = table.field('pointY', d);
            let plotAngle = table.field('plotAngle', d);
            let valueY = table.field('valueY', d);

            let x;
            if (!!this.data.dataYList) {
                x = (pointX) * zoom;
            } else {
                x = (pointX + value * Math.cos(plotAngle * Math.PI / 180) * plotExpandCoef) * zoom;
            }

            return x;
        };

        modelMap[yAxisName].scale = (d: any): number => {
            let plotExpandCoef = data.plotExpandCoef;

            let value = table.field('Value', d);
            let pointX = table.field('pointX', d);
            let pointY = table.field('pointY', d);
            let plotAngle = table.field('plotAngle', d);
            let valueY = table.field('valueY', d);

            let y;
            if (!!data.dataYList) {
                y = (valueY) * zoom;
            } else {
                y = (pointY - value * Math.sin(plotAngle * Math.PI / 180) * plotExpandCoef) * zoom;
            }

            return y;
        };

    }

    protected initXAxis(): void {
        this.bottomComponent.getView().boxOrient = 'vertical';

        let {isHorizontal, option} = this;
        let {width} = this.gridComponent.getView();
        let {time} = this.modelMap;
        let timeAxis = new TimeAxis({
            model: time,
            // @ts-ignore
            click: (time: string) => {
                this.onClickTime(time);
            }
        });

        timeAxis.setView({width, height: 80, boxOrient: "vertical"});

        //# 分布图: 时间轴移动鼠标时的事件需要的范围  - timeAxisView.left - timeAxisView.right
        let timeAxisView = timeAxis.getView();
        this.bottomComponent.append(new Rect({x: timeAxisView.x, width: timeAxisView.width, height: timeAxisView.height, class:'bottom-rect', fill: 'white'}).setView({}));

        this.bottomComponent.append(timeAxis);
    }

    protected initYAxis(): void {
    }

    protected initEvent(): void {
        super.initEvent();
    }

    protected drawLineClick(line: LineObject, targetComponent?: Component, newLegendObject?: Legend): void {
        targetComponent = targetComponent || this.linesComponent;

        let {modelMap, table, option: {view: {left}}} = this;

        let points = line.data;
        let legend = newLegendObject || line.legendObject;

        let scaleX = modelMap[this.xAxisName].scale;
        let scaleY = modelMap[this.yAxisName].scale;

        let lineGenerator = d3.line()
            .x(function (d: any) {
                return scaleX(d) - left;
            })
            .y(function (d: any) {
                return scaleY(d);
            })
            .defined(function (d: any): boolean {
                return !!table.field('Value', d) && !!table.field('plotAngle', d);
            });

        if (points && points.length > 0) {
            let groupPointLength = 0;//last
            let groupPointCount = this.data.groupPointCount;
            if (groupPointCount.length > 1) {
                for (let i = 0, len = groupPointCount.length; i < len; i++) {
                    let count = groupPointLength + groupPointCount[i];
                    let pointsGroup = [];

                    for (let j = groupPointLength; j < count; j++) {
                        pointsGroup.push(points[j]);
                    }

                    groupPointLength = count;

                    targetComponent.append(new Path({
                        d: <string>lineGenerator(pointsGroup),
                        stroke: legend.color,
                        'stroke-width': 1,
                        fill: 'none',
                        class: 'line'
                    }));
                }
            } else {
                targetComponent.append(new Path({d: <string>lineGenerator(points), stroke: legend.color, 'stroke-width': 1, fill: 'none', class: 'line'}));
            }
        }

    }

    protected drawPointClick(line: LineObject, targetComponent?: Component, newLegendObject?: Legend) {
        targetComponent = targetComponent || this.linesComponent;

        let {modelMap, table, option: {view: {left}}} = this;

        let points = line.data;
        let legend = newLegendObject || line.legendObject;

        let scaleX = modelMap[this.xAxisName].scale;
        let scaleY = modelMap[this.yAxisName].scale;

        for (let i = 0, len = points.length; i < len; i++) {
            let point = points[i];

            let value = table.field('Value', point);
            let pointX = table.field('pointX', point);
            let pointY = table.field('pointY', point);
            let plotAngle = table.field('plotAngle', point);
            let valueY = table.field('valueY', point);

            if (!pointX || !value) continue;

            let x1 = scaleX(point) - left;
            let y1 = scaleY(point);

            let x2 = pointX * this.zoom - left;
            let y2 = pointY * this.zoom;

            targetComponent.append(new Line({x1: x1, y1: y1, x2: x2, y2: y2, stroke: legend.color, class: 'line'}));
        }
    }

    //显示移动线
    showMoveLine(line: LineObject) {
        let legendObject = new Legend({
            name: 'solid_star',
            color: 'Red',
            generator: d3.symbol().type(d3.symbolStar),
            fill: true
        });
        this.drawLineClick(line, this.moveLineComponent, legendObject);
        if (!this.data.dataYList) this.drawPointClick(line, this.moveLineComponent, legendObject);
    }

}
