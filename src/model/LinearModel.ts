import d3 from "d3";
import {Model, ModelType} from "./Model";
import {NumberInfo} from "../util/NumberInfo";

export class LinearModel extends Model<number> {

    minNice!: number;
    maxNice!: number;

    constructor(name: string, type: ModelType, data: number[] = []) {
        super(name, type, data);
    }

    init(): void {
        this.min = <number>d3.min(this.data);
        this.max = <number>d3.max(this.data);
        //this.tickValues = fun_scale(min, max, 7);
        this.tickValues = this.nice(this.min, this.max, this.ticks);
        this.minNice = this.tickValues[0];
        this.maxNice = this.tickValues[this.tickValues.length - 1];
        this.domain = [this.minNice, this.maxNice];
        this.scale = d3.scaleLinear().domain(this.domain).range(this.range);//.nice()
    }

    reverse(): void {
        this.range = this.range.reverse();
        this.scale = d3.scaleLinear().domain(this.domain).range(this.range);
    }

    nice(min: number, max: number, size?: number): number[] {
        let tickNumber = size || 7;
        let step = (max - min) / tickNumber;

        let minNew = min - step * 0.8;
        let maxNew = max + step * 0.8;
        let stepNew = (maxNew - minNew) / tickNumber;

        let stepNumInfo = new NumberInfo(stepNew);
        let stepNice = stepNumInfo.nice();
        stepNice = stepNice || stepNew;

        let minInfo = new NumberInfo(minNew);
        let minNice = minInfo.niceMin(new NumberInfo(stepNice));
        minNice = minNice || minNew;
        if (Math.abs(minNice - minNew) > Math.abs(stepNice)) {
            minNice = minNew;
        }

        let tickValues = [];
        for (let i = 0; i <= tickNumber; i++) {
            tickValues.push(minNice + stepNice * i);
        }

        let maxNice = tickValues[tickValues.length - 1];
        if (minNice > min || maxNice < max) {
            tickValues = [];
            for (let i = 0; i <= tickNumber; i++) {
                tickValues.push(minNew + stepNew * i);
            }
        }

        return tickValues;
    }

}
