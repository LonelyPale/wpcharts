import {Legend} from "./Legend";

export class LegendIndexNode {
    private readonly index: string[] = [];
    private readonly legend: Legend;

    constructor(index: string[], legend: Legend) {
        this.index = [...index];
        this.legend = legend;
    }

    get(key: string): Legend | null {
        if (this.index.indexOf(key) > -1) {
            return this.legend;
        } else {
            return null;
        }
    }
}

export class LegendIndex {
    private readonly index: LegendIndexNode[] = [];

    constructor(index?: LegendIndexNode[]) {
        if(index) this.index = [...index];
    }

    add(node: LegendIndexNode) {
        this.index.push(node);
    }

    get(key: string): Legend | null {
        for (let node of this.index) {
            let legend = node.get(key);
            if (legend) return legend;
        }
        return null;
    }
}
