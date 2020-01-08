import {SvgAttribute, SvgObject} from "./SvgObject";

export class Text extends SvgObject {

    static readonly TagName: string = 'text';

    constructor(attribute?: SvgAttribute) {
        attribute = attribute || {};
        attribute.y = attribute.y || 17;//默认Y轴偏移
        super(attribute);
    }

}
