import conf, {GlobalConfig, GlobalConfigOption, init as initConfig} from "./config"; //# 优先
import {ChartConstructor, IChart, IOption} from "./chart/Chart";
import {Hydrograph} from "./chart/Hydrograph";
import {Statistical} from "./chart/Statistical";
import {Distribution} from "./chart/Distribution";
import {DistributionBackground} from "./chart/DistributionBackground";
import {Correlation} from "./chart/Correlation";

let ChartType: Hydrograph | Distribution | DistributionBackground | Correlation | Statistical;

initConfig();

//水利工程图
class WPCharts {

    selector: string; //html 选择器
    chart: IChart | null; //Chart 实例

    static factory: Record<string, ChartConstructor> = {}; //Chart 工厂
    //static factory: any; //Chart 工厂
    //static factory: {[key:string] : typeof Chart};
    //static map: {[key:number] : any} = {};

    constructor(selector: string) {
        this.selector = selector;
        this.chart = null;
    }

    setOption(option: IOption, callbacks?: () => void): this {
        if (!this.chart) {
            const type: string = option.type;
            if (!!type) {
                this.chart = new WPCharts.factory[type](this.selector);
            } else {
                throw new Error(`error: not find type ${type}`);
            }
        }

        //# ts:高亮显示联合变量类型保护缩小范围
        //# ts:Highlights variable usages where variable type is narrowed by a type guard. Note that severity level doesn't affect this inspection.
        //const chart: IChart = this.chart; //# 联合变量类型保护
        //const chart: IChart = this['chart']; //# 没有高亮提示
        //const {chart}: { chart: IChart | null } = this;
        //const {chart: chart} = this;
        const {chart} = this;

        //this.chart.setOption(option); //# 联合变量类型保护
        //(<IChart>this.chart).setOption(option); //# 联合变量类型保护

        chart.setOption(option, () => {
            setInstance(chart?.svg.id(), chart); //缓存实例
            if (callbacks && typeof callbacks === "function") callbacks();
        });

        return this;
    }

    outputSvg(): string {
        const {chart} = this;
        if (chart) {
            return chart.outputSvg();
        } else {
            return '';
        }
    }

    test() {
        let isBrowser: boolean = typeof window !== 'undefined';
        let isNode: boolean = typeof global !== 'undefined';
        let Global: any = typeof window === 'undefined' ? global : window;
        if (isBrowser) {
            console.log("isBrowser:", isBrowser);
            (<any>window).WPCharts = WPCharts;
            let win: any = window;
            console.log("window:", window);
            console.log("win:", win);
            console.log("d3:", win.d3);
        } else if (isNode) {
            console.log("isNode:", isNode);
            console.log("Global:", Global);
        }

        let obj = new Hydrograph('');
        console.log.call(obj, "console.log:", 1);
        console.info.call(obj, "console.info:", 2);
        console.warn.call(obj, "console.warn:", 3);
        console.error.call(obj, "console.error:", 4);
        console.log("console.debug:", typeof console.debug, console.debug);
        console.debug("123123123");
    }

}

//const classList: Array<ChartConstructor> = [
const classList: ChartConstructor[] = [
    Hydrograph,//过程线 1
    Distribution,//分布图 2
    DistributionBackground,//分布图-背景图 通用或渗压 2-1
    Correlation,//相关图 3
    Statistical,//统计模型过程线 4
];
for (let i = 0, len = classList.length; i < len; i++) {
    const item: ChartConstructor = classList[i];
    WPCharts.factory[item.clazz] = item;
}

export function init(selector: string, globalConfigOption?: GlobalConfigOption) {
    /** @deprecated */
    if (globalConfigOption) {//todo #待处理
        GlobalConfig.request = globalConfigOption.request || GlobalConfig.request;
        GlobalConfig.response = globalConfigOption.response || GlobalConfig.response;
        GlobalConfig.document = globalConfigOption.document || GlobalConfig.document;
        GlobalConfig.style = globalConfigOption.style || GlobalConfig.style;
    }

    let wpcharts = new WPCharts(selector);
    console.log("wpcharts:", wpcharts);
    return wpcharts;
}

function setInstance(id: string, chart: IChart) {
    instance[id] = chart;
}

export function getInstance(id: string): IChart {
    return instance[id];
}

export const instance: {[key:string]: IChart} = {}; //缓存实例

export const config = conf;
