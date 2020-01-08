/**
 * # 过程线
 * # hydrograph
 */
import {Chart} from "./Chart";

export class Hydrograph extends Chart {

    constructor(selector) {
        super(selector);
        this.title = "过程线"; //标题
    }

    log() {
        console.log("log--", 112233);
    }

}

Hydrograph.clazz = "hydrograph";
