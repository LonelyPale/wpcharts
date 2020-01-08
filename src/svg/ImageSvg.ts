import {SvgAttribute, SvgObject} from "./SvgObject";

export type ImageProperty = {
    href: string;
    x: number;
    y: number;
    width: number;
    height: number;
    object?: HTMLImageElement;
};

export class ImageSvg extends SvgObject {

    static readonly TagName: string = 'image';

    constructor(attribute?: SvgAttribute) {
        super(attribute);
    }

}
