import d3 from "d3";
import {Model, ModelType} from "./Model";

export class OrdinalModel extends Model<string> {

    constructor(name: string, type: ModelType, data: string[] = []) {
        super(name, type, data);
        this.domain = data;
        this.tickValues = data;
    }

    init(): void {
        let {domain, range} = this;
        if (domain.length !== range.length) {
            let length = Math.abs(range[0] - range[1]);
            let min = d3.min(range) || 0;
            let count = domain.length;
            let space = length / (count - 1);
            range = [];
            for (let i = 0; i < count; i++) {
                range.push(min + space * i);
            }
            this.range = range;
        }
        this.scale = d3.scaleOrdinal().domain(this.domain).range(this.range);
    }

    reverse(): void {
        this.range = this.range.reverse();
        this.scale = d3.scaleOrdinal().domain(this.domain).range(this.range);
    }

}
