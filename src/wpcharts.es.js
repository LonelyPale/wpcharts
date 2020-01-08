import {Hydrograph} from "./chart/Hydrograph";
import {Distribution} from "./chart/Distribution";
import {DistributionBackground} from "./chart/DistributionBackground";
import {Correlation} from "./chart/Correlation";
import {Statistical} from "./chart/Statistical";
import {Chart} from "./chart/Chart";

class WPCharts {

    constructor(selector) {
        this.selector = selector;
        this.chart = null;
        this.factory = {};

        let clazzList = [
            Chart,//普通图表 0
            Hydrograph,//过程线 1
            Distribution,//分布图 2
            DistributionBackground,//分布图-背景图 通用或渗压 2-1
            Correlation,//相关图 3
            Statistical,//统计模型过程线 4
        ];
        for(let i = 0, len = clazzList.length; i < len; i++) {
            let item = clazzList[i];
            this.factory[item.clazz] = item;
        }
    }

    setOption(option) {
        if(!this.chart) {
            if(!!option.type) {
                this.chart = new this.factory[option.type](this.selector);
            } else {
                console.log("error: not find type ", option.type);
            }
        }
        this.chart.setOption(option);
        return this;
    }

}

export function init(selector) {
    return new WPCharts(selector);
}
