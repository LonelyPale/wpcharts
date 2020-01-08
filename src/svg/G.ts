import {SvgAttribute, SvgObject} from "./SvgObject";

export class G extends SvgObject {

    static readonly TagName: string = 'g';

    constructor(attribute?: SvgAttribute) {
        super(attribute);
    }

}
