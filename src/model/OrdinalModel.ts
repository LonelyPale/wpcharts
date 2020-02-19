import d3 from "d3";
import {Model, ModelType} from "./Model";

export class OrdinalModel extends Model<string> {

    position?: number[];

    constructor(name: string, fieldName: string, type: ModelType, data: string[] = [], position?: number[]) {
        super(name, fieldName, type, data);
        this.domain = data;
        this.tickValues = data;
        this.position = position;
    }

    init(): void {
        let {domain, range} = this;
        if (domain.length !== range.length) {
            let length = Math.abs(range[0] - range[1]);
            let min = d3.min(range) || 0;
            let max = d3.max(range) || 0;
            let count = domain.length;
            range = [];

            if(this.position && this.position.length > 0) {
                let pos = this.position;
                let posMax = pos[pos.length - 1] - pos[0];
                let zoomScale = max / posMax;
                for(let p of pos) {
                    p = p - pos[0];
                    range.push(min + p * zoomScale);
                }
            } else {
                let space = length / (count - 1);
                for (let i = 0; i < count; i++) {
                    range.push(min + space * i);
                }
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
