import {Model} from "../model/Model";
import {Legend} from "../component/legend/Legend";
import {Component} from "../component/Component";
import d3 from "d3";
import {Table} from "../rdb/Table";
import {Path} from "../svg/Path";

export type LineObjectTag = 'pointId' | 'unit' | 'legend';

export class LineObject {

    id: string;

    pointId: string;
    unit: string;
    legend: string;

    data!: any[];
    table!: Table;
    legendObject!: Legend;

    xModel!: Model<number | string | Date>; //x 轴模型
    yModel!: Model<number | string | Date>; //y 轴模型

    //visualComponent!: Component; //可视化组件-预留

    constructor(pointId: string, unit: string, legend: string) {
        this.pointId = pointId;
        this.unit = unit;
        this.legend = legend;
        this.id = LineObject.id(pointId, unit, legend);
    }

    draw(lineComponent: Component, pointComponent: Component, newLegendObject?: Legend) {
        this.drawLine(lineComponent, newLegendObject);
        this.drawPoint(pointComponent, newLegendObject);
    }

    drawLine(component: Component, newLegendObject?: Legend) {
        let {table, xModel, yModel, data, legendObject} = this;
        let {fieldName: xFieldName, scale: xScale} = xModel;
        let {fieldName: yFieldName, scale: yScale} = yModel;

        if (!data || data.length === 0) return;//跳过没有数据的线

        legendObject = newLegendObject || legendObject;

        let lineGenerator = d3.line()
            .x(function (d: any, index: number, data: any[]) {
                //console.log(d, index, data);
                //console.log("xFieldName:", xFieldName, table.field(xFieldName, d));
                return xScale(table.field(xFieldName, d));
            })
            .y(function (d: any, index: number, data: any[]) {
                //console.log("yFieldName:", yFieldName, table.field(yFieldName, d));
                return yScale(table.field(yFieldName, d));
            })
            .defined(function (d: any) {
                return table.field(xFieldName, d) !== null && table.field(yFieldName, d) !== null;
            });

        component.append(new Path({d: <string>lineGenerator(data), stroke: legendObject.color, class: 'line'}));
    }

    drawPoint(component: Component, newLegendObject?: Legend) {
        let {table, xModel, yModel, data, legendObject} = this;
        let {fieldName: xFieldName, scale: xScale} = xModel;
        let {fieldName: yFieldName, scale: yScale} = yModel;

        if (!data || data.length === 0) return;//跳过没有数据的线

        legendObject = newLegendObject || legendObject;

        let pointsLength = data.length;
        let pointsSpace = Math.floor(data.length / 10);
        let point, j, x, y;
        if (pointsLength <= 12) {
            //显示所有的点
            for (j = 0; j < pointsLength; j++) {
                point = data[j];
                x = xScale(table.field(xFieldName, point));
                y = yScale(table.field(yFieldName, point));
                legendObject.draw(component, x, y);
            }
        } else {
            //显示最多12个点
            for (j = 1; j <= 10; j++) {
                if (pointsLength === (j * pointsSpace)) {
                    //能整除的情况，最后一个点会重合，如：20，300
                    point = data[j * pointsSpace - Math.floor(pointsSpace / 2)];
                } else {
                    point = data[j * pointsSpace];
                }
                x = xScale(table.field(xFieldName, point));
                y = yScale(table.field(yFieldName, point));
                legendObject.draw(component, x, y);
            }
            legendObject.draw(component, xScale(table.field(xFieldName, data[0])), yScale(table.field(yFieldName, data[0])));//第一个点
            legendObject.draw(component, xScale(table.field(xFieldName, data[pointsLength - 1])), yScale(table.field(yFieldName, data[pointsLength - 1])));//最后一个点
        }
    }

    //不做处理，统一按 legend 字段显示
    //根据 tags 生成图例名称
    /** @deprecated */
    generateLegendName(tags: LineObjectTag[]): string {
        let map: Record<string, string> = {};
        let arr: string[] = [];

        for (let i = 0; i < tags.length; i++) {
            let val = this[tags[i]];
            if (!map[val]) {
                arr.push(val);
                map[val] = val;
            }
        }

        return arr.join(' ');
    }

    //不做处理，统一按 legend 字段显示
    //生成 tags，辅助生成图例名称
    /** @deprecated */
    static generateTags(pointIdsLen: number, modelsLen: number): LineObjectTag[] {
        let tags: LineObjectTag[];
        if (pointIdsLen === 1) {//一个测点
            if (modelsLen === 2) {//一个物理量
                tags = ['legend']
            } else {//多个物理量
                tags = ['legend', 'unit']
            }
        } else {//多个测点
            if (modelsLen === 2) {//一个物理量
                tags = ['pointId', 'legend']
            } else {//多个物理量
                tags = ['pointId', 'legend', 'unit']
            }
        }
        return tags;
    }

    static id(pointId: string, unit: string, legend: string): string {
        return pointId + '-' + unit + '-' + legend;
    }

}
