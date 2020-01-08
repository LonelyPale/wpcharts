import {SvgAttribute, SvgObject} from "./SvgObject";

export class Line extends SvgObject {

    static readonly TagName: string = 'line';

    constructor(attribute?: SvgAttribute) {
        super(attribute);
    }

}
