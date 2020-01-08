import {SvgAttribute, SvgObject} from "./SvgObject";

export class Title extends SvgObject {

    static readonly TagName: string = 'title';

    constructor(attribute?: SvgAttribute) {
        super(attribute);
    }

}
