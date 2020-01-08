import {SvgAttribute, SvgObject} from "./SvgObject";

export class Style extends SvgObject {

    static readonly TagName: string = 'style';

    constructor(attribute?: SvgAttribute) {
        super(attribute);
    }

}
