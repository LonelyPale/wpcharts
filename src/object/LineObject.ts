import {Model} from "../model/Model";
import {Legend} from "../component/legend/Legend";

export type LineObjectTag = 'pointId' | 'unit' | 'legend';

export class LineObject {

    id: string;

    pointId: string;
    unit: string;
    legend: string;

    data!: any[];
    model!: Model<number | string | Date>;
    legendObject!: Legend;

    constructor(pointId: string, unit: string, legend: string) {
        this.pointId = pointId;
        this.unit = unit;
        this.legend = legend;
        this.id = LineObject.id(pointId, unit, legend);
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
