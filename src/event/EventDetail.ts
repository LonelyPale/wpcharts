import {SvgObject} from "../svg/SvgObject";

//# d3.event.detail
export interface EventDetail {
    mouse: [number, number];
    target: SvgObject;
}
