import d3 from "d3";
import {Symbol} from "../component/legend/Legend";

export type LineStyleType = 'style1' | 'style2' | 'style3' | 'style4' | 'style5' | 'style6';
export type LineLegendType = 'symbolCircleSolid' | 'symbolCircleHollow' | 'symbolSquareSolid' | 'symbolSquareHollow' |
    'symbolTriangleSolid' | 'symbolTriangleHollow' | 'symbolTriangleSolidInverted' | 'symbolTriangleHollowInverted' |
    'symbolDiamondSolid' | 'symbolDiamondHollow' | 'symbolCrossSolid' | 'symbolCrossHollow' | 'symbolStarSolid' | 'symbolStarHollow' |
    'symbolWyeSolid' | 'symbolWyeHollow';

export const LegendSymbolMap: { [key: string]: Symbol } = {};
LegendSymbolMap['symbolCircleSolid'] = d3.symbol().type(d3.symbolCircle);
LegendSymbolMap['symbolCircleHollow'] = d3.symbol().type(d3.symbolCircle);
LegendSymbolMap['symbolSquareSolid'] = d3.symbol().type(d3.symbolSquare);
LegendSymbolMap['symbolSquareHollow'] = d3.symbol().type(d3.symbolSquare);
LegendSymbolMap['symbolTriangleSolid'] = d3.symbol().type(d3.symbolTriangle);
LegendSymbolMap['symbolTriangleHollow'] = d3.symbol().type(d3.symbolTriangle);
LegendSymbolMap['symbolTriangleSolidInverted'] = d3.symbol().type(d3.symbolTriangle);
LegendSymbolMap['symbolTriangleHollowInverted'] = d3.symbol().type(d3.symbolTriangle);
LegendSymbolMap['symbolDiamondSolid'] = d3.symbol().type(d3.symbolDiamond);
LegendSymbolMap['symbolDiamondHollow'] = d3.symbol().type(d3.symbolDiamond);
LegendSymbolMap['symbolCrossSolid'] = d3.symbol().type(d3.symbolCross);
LegendSymbolMap['symbolCrossHollow'] = d3.symbol().type(d3.symbolCross);
LegendSymbolMap['symbolStarSolid'] = d3.symbol().type(d3.symbolStar);
LegendSymbolMap['symbolStarHollow'] = d3.symbol().type(d3.symbolStar);
LegendSymbolMap['symbolWyeSolid'] = d3.symbol().type(d3.symbolWye);
LegendSymbolMap['symbolWyeHollow'] = d3.symbol().type(d3.symbolWye);

export class LineSet {

    color: string;
    width: number;
    style: LineStyleType;
    legend: LineLegendType;

    constructor(color: string, width: number, style: LineStyleType, legend: LineLegendType) {
        this.color = color;
        this.width = width;
        this.style = style;
        this.legend = legend;
    }

}
