import {SvgAttribute, SvgObject} from "./SvgObject";

export class Path extends SvgObject {

    static readonly TagName: string = 'path';

    constructor(attribute?: SvgAttribute) {
        super(attribute);
    }

}
