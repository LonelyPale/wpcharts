import {Legend} from "./Legend";
import d3 from "d3";

export class LegendIndexNode {
    public readonly index: string[] = [];
    public readonly legend: Legend;

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
    public readonly index: LegendIndexNode[] = [];

    constructor(index?: LegendIndexNode[]) {
        if(index) this.index = [...index];
    }

    //未查重，可添加相同索引的重复对象 #todo
    add(node: LegendIndexNode) {
        this.index.push(node);
    }

    get(key: string | number): Legend | null {
        if(typeof key === 'string') {
            for (let node of this.index) {
                let legend = node.get(key);
                if (legend) return legend;
            }
        } else {
            return this.index[key].legend;
        }
        return null;
    }

    /**
     d3中有7个符号生成器。
     symbolCircle 圆形
     symbolCross 十字架
     symbolDiamond 菱形
     symbolSquare 正方形
     symbolStar 五角星
     symbolTriangle 三角形
     symbolWye Y形
     **/
    static initDefault(): LegendIndex {
        let legendIndex = new LegendIndex();
        legendIndex.add(new LegendIndexNode(['symbolCircleSolid', 'solid_circle'], new Legend({
            name: 'solid_circle',
            color: 'Blue',
            generator: d3.symbol().type(d3.symbolCircle),
            fill: true,
            width: 1,
            style: 'style1',
            legend: 'symbolCircleSolid'
        }))); //# 1
        legendIndex.add(new LegendIndexNode(['symbolCircleHollow', 'hollow_circle'], new Legend({
            name: 'hollow_circle',
            color: '#996600',//Red
            generator: d3.symbol().type(d3.symbolCircle),
            fill: false,
            width: 1,
            style: 'style1',
            legend: 'symbolCircleHollow'
        }))); //# 2
        legendIndex.add(new LegendIndexNode(['symbolSquareSolid', 'solid_rect'], new Legend({
            name: 'solid_rect',
            color: 'Cyan',
            generator: d3.symbol().type(d3.symbolSquare),
            fill: true,
            width: 1,
            style: 'style1',
            legend: 'symbolSquareSolid'
        }))); //# 3
        legendIndex.add(new LegendIndexNode(['symbolSquareHollow', 'hollow_rect'], new Legend({
            name: 'hollow_rect',
            color: '#6600FF',//Pink
            generator: d3.symbol().type(d3.symbolSquare),
            fill: false,
            width: 1,
            style: 'style1',
            legend: 'symbolSquareHollow'
        }))); //# 4
        legendIndex.add(new LegendIndexNode(['symbolTriangleSolid', 'solid_triangle'], new Legend({
            name: 'solid_triangle',
            color: 'Green',
            generator: d3.symbol().type(d3.symbolTriangle),
            fill: true,
            width: 1,
            style: 'style1',
            legend: 'symbolTriangleSolid'
        }))); //# 5
        legendIndex.add(new LegendIndexNode(['symbolTriangleHollow', 'hollow_triangle'], new Legend({
            name: 'hollow_triangle',
            color: 'Purple',
            generator: d3.symbol().type(d3.symbolTriangle),
            fill: false,
            width: 1,
            style: 'style1',
            legend: 'symbolTriangleHollow'
        }))); //# 6
        legendIndex.add(new LegendIndexNode(['symbolTriangleSolidInverted', 'solid_inverted_triangle'], new Legend({
            name: 'solid_inverted_triangle',
            color: 'LightBlue',
            generator: d3.symbol().type(d3.symbolTriangle),
            fill: true,
            attribute: {transform: 'rotate(180)'},
            width: 1,
            style: 'style1',
            legend: 'symbolTriangleSolidInverted'
        }))); //# 7
        legendIndex.add(new LegendIndexNode(['symbolTriangleHollowInverted', 'hollow_inverted_triangle'], new Legend({
            name: 'hollow_inverted_triangle',
            color: '#9999FF',//PaleVioletRed
            generator: d3.symbol().type(d3.symbolTriangle),
            fill: false,
            attribute: {transform: 'rotate(180)'},
            width: 1,
            style: 'style1',
            legend: 'symbolTriangleHollowInverted'
        }))); //# 8
        legendIndex.add(new LegendIndexNode(['symbolDiamondSolid', 'solid_rhombus'], new Legend({
            name: 'solid_rhombus',
            color: 'SeaGreen',
            generator: d3.symbol().type(d3.symbolDiamond),
            fill: true,
            width: 1,
            style: 'style1',
            legend: 'symbolDiamondSolid'
        }))); //# 9
        legendIndex.add(new LegendIndexNode(['symbolDiamondHollow', 'hollow_rhombus'], new Legend({
            name: 'hollow_rhombus',
            color: 'Yellow',
            generator: d3.symbol().type(d3.symbolDiamond),
            fill: false,
            width: 1,
            style: 'style1',
            legend: 'symbolDiamondHollow'
        }))); //# 10
        legendIndex.add(new LegendIndexNode(['symbolCrossSolid', 'solid_cross'], new Legend({
            name: 'solid_cross',
            color: 'DarkCyan',
            generator: d3.symbol().type(d3.symbolCross),
            fill: true,
            width: 1,
            style: 'style1',
            legend: 'symbolCrossSolid'
        }))); //# 11
        legendIndex.add(new LegendIndexNode(['symbolCrossHollow', 'hollow_cross'], new Legend({
            name: 'hollow_cross',
            color: 'DarkGoldenRod',
            generator: d3.symbol().type(d3.symbolCross),
            fill: false,
            width: 1,
            style: 'style1',
            legend: 'symbolCrossHollow'
        }))); //# 12
        legendIndex.add(new LegendIndexNode(['symbolStarSolid', 'solid_star'], new Legend({
            name: 'solid_star',
            color: '#FF00FF',
            generator: d3.symbol().type(d3.symbolStar),
            fill: true,
            width: 1,
            style: 'style1',
            legend: 'symbolStarSolid'
        }))); //# 13
        legendIndex.add(new LegendIndexNode(['symbolStarHollow', 'hollow_star'], new Legend({
            name: 'hollow_star',
            color: '#00FF00',
            generator: d3.symbol().type(d3.symbolStar),
            fill: false,
            width: 1,
            style: 'style1',
            legend: 'symbolStarHollow'
        }))); //# 14
        legendIndex.add(new LegendIndexNode(['symbolWyeSolid', 'solid_wye'], new Legend({
            name: 'solid_wye',
            color: '#00FF00',
            generator: d3.symbol().type(d3.symbolWye),
            fill: true,
            width: 1,
            style: 'style1',
            legend: 'symbolWyeSolid'
        }))); //# 15
        legendIndex.add(new LegendIndexNode(['symbolWyeHollow', 'hollow_wye'], new Legend({
            name: 'hollow_wye',
            color: '#FAEBD7',
            generator: d3.symbol().type(d3.symbolWye),
            fill: false,
            width: 1,
            style: 'style1',
            legend: 'symbolWyeHollow'
        }))); //# 16
        return legendIndex;
    }

}
