import d3 from "d3";
import {Legend} from "./Legend";

export class LegendManager {

    public static readonly legends: Legend[] = [];
    private static readonly legendsMap: Record<string, Legend> = {};
    private static readonly LegendSizeMax: number = 12;

    private readonly usedLegends: Record<string, Legend> = {};
    private readonly unusedLegends: Legend[] = [];

    constructor() {
        for (let i = 0; i < LegendManager.legends.length; i++) {
            let legend: Legend = LegendManager.legends[i];
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
            return LegendManager.legends[0];
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

    static init() {
        LegendManager.legends.push(new Legend({
            name: 'solid_circle',
            color: 'Blue',
            generator: d3.symbol().type(d3.symbolCircle),
            fill: true
        })); //# 1
        LegendManager.legends.push(new Legend({
            name: 'hollow_circle',
            color: '#996600',//Red
            generator: d3.symbol().type(d3.symbolCircle),
            fill: false
        })); //# 2
        LegendManager.legends.push(new Legend({
            name: 'solid_rect',
            color: 'Cyan',
            generator: d3.symbol().type(d3.symbolSquare),
            fill: true
        })); //# 3
        LegendManager.legends.push(new Legend({
            name: 'hollow_rect',
            color: '#6600FF',//Pink
            generator: d3.symbol().type(d3.symbolSquare),
            fill: false
        })); //# 4
        LegendManager.legends.push(new Legend({
            name: 'solid_triangle',
            color: 'Green',
            generator: d3.symbol().type(d3.symbolTriangle),
            fill: true
        })); //# 5
        LegendManager.legends.push(new Legend({
            name: 'hollow_triangle',
            color: 'Purple',
            generator: d3.symbol().type(d3.symbolTriangle),
            fill: false
        })); //# 6
        LegendManager.legends.push(new Legend({
            name: 'solid_inverted_triangle',
            color: 'LightBlue',
            generator: d3.symbol().type(d3.symbolTriangle),
            fill: true,
            attribute: {transform: 'rotate(180)'}
        })); //# 7
        LegendManager.legends.push(new Legend({
            name: 'hollow_inverted_triangle',
            color: '#9999FF',//PaleVioletRed
            generator: d3.symbol().type(d3.symbolTriangle),
            fill: false,
            attribute: {transform: 'rotate(180)'}
        })); //# 8
        LegendManager.legends.push(new Legend({
            name: 'solid_rhombus',
            color: 'SeaGreen',
            generator: d3.symbol().type(d3.symbolDiamond),
            fill: true
        })); //# 9
        LegendManager.legends.push(new Legend({
            name: 'hollow_rhombus',
            color: 'Yellow',
            generator: d3.symbol().type(d3.symbolDiamond),
            fill: false
        })); //# 10
        LegendManager.legends.push(new Legend({
            name: 'solid_cross',
            color: 'DarkCyan',
            generator: d3.symbol().type(d3.symbolCross),
            fill: true
        })); //# 11
        LegendManager.legends.push(new Legend({
            name: 'hollow_cross',
            color: 'DarkGoldenRod',
            generator: d3.symbol().type(d3.symbolCross),
            fill: false
        })); //# 12

        for (let i = 0; i < LegendManager.legends.length; i++) {
            let legend: Legend = LegendManager.legends[i];
            LegendManager.legendsMap[legend.name] = legend;
        }
    }

}

LegendManager.init();
