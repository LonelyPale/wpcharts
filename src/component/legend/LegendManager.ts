import {Legend} from "./Legend";
import {LegendIndex} from "./LegendIndex";

export class LegendManager {

    private readonly legends: Legend[] = [];
    private readonly legendsMap: Record<string, Legend> = {};
    private readonly LegendSizeMax: number = 12;

    private readonly usedLegends: Record<string, Legend> = {};
    private readonly unusedLegends: Legend[] = [];

    private readonly legendIndex: LegendIndex;

    constructor(legendIndex: LegendIndex) {
        this.legendIndex = legendIndex;
        for(let i = 0; i < this.LegendSizeMax; i++) {
            let legendIndexNode = legendIndex.index[i];
            let legend = legendIndexNode.legend;
            this.legends.push(legend);
            this.legendsMap[legend.name] = legend;
            this.unusedLegends.push(legend);
        }
    }

    add(key: string): Legend {
        let {unusedLegends} = this;
        if (unusedLegends.length > 0) {
            let legend = <Legend>unusedLegends.shift();
            this.usedLegends[key] = legend;
            return legend;
        } else {
            let usedArray = Object.values(this.usedLegends);
            return usedArray[usedArray.length - 1];
        }
    }

    remove(key: string): Legend {
        let legend = this.usedLegends[key];
        if (!legend) {
            return this.legends[0];
        }
        this.unusedLegends.push(legend);
        delete this.usedLegends[key];
        return legend;
    }

    get(key: string): Legend {
        return this.usedLegends[key];
    }

    getSize(): number {
        return this.unusedLegends.length;
    }

}
