import {SvgAttribute, SvgObject} from "./SvgObject";

export class Circle extends SvgObject {

    static readonly TagName: string = 'circle';

    constructor(attribute?: SvgAttribute) {
        super(attribute);
    }

}
