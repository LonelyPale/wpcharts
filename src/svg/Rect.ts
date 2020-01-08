import {SvgAttribute, SvgObject} from "./SvgObject";

export class Rect extends SvgObject {

    static readonly TagName: string = 'rect';

    constructor(attribute?: SvgAttribute) {
        super(attribute);
    }

}
