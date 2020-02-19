import d3, {ArrayLike} from "d3";
import {Svg} from "../svg/Svg";
import {Text} from "../svg/Text";
import {MenuItem} from "../component/menu/MenuItem";
import {Menu} from "../component/menu/Menu";
import {MenuSeparator} from "../component/menu/MenuSeparator";
import {Component} from "../component/Component";
import {clone, extend, isFunction} from "../util/common";
import {formurlencoded} from "../util/utils";
import {Model} from "../model/Model";
import {Rect} from "../svg/Rect";
import {Line} from "../svg/Line";
import {Title} from "../svg/Title";
import {G} from "../svg/G";
import {Tooltips} from "../component/tooltips/Tooltips";
import {Rdb} from "../rdb/Rdb";
import {LegendManager} from "../component/legend/LegendManager";
import {Table} from "../rdb/Table";
import {formatTimeSimple} from "../model/TimeModel";
import {Style} from "../svg/Style";
import {config, isBrowser, isNode} from "../config";
import {BrushEvent, MouseLeft, MouseWheel, TooltipsEvent, TranslationEvent, ZoomEvent} from "../event/EventTypes";
import {Series} from "../component/Series";
import {LinearModel} from "../model/LinearModel";
import {Legend} from "../component/legend/Legend";
import {SvgObject} from "../svg/SvgObject";
import {ImageProperty} from "../svg/ImageSvg";
import {LineObject} from "../object/LineObject";
import {after, before} from "../aop/decorators";
import {concat} from "../util/url";
import {Message} from "../ui/Message";

export type ActionType = 'all' | 'reset' | 'add';

export interface IOption {
    type: string;
    action: ActionType;
    url: string;
    request: {
        method: string;
        body?: string;
        credentials: string;
        mode?: string;
        headers: {
            'Content-Type': string;
        }
    };
    data: any;//原始数据

    //# 分布图
    isHorizontal?: boolean;//是:水平图  否:垂直图  #默认是水平图 分布图用
    defaultDraw?: boolean;// #默认绘制所有点 分布图用

    layout: {};
    view: {
        width: number;
        height: number;
        top: number;
        bottom: number;
        left: number;
        right: number;
    }
    style: {
        lineWidth: number;
        rotate: number;
    };
}

export interface IChart {
    setOption(option: IOption, callbacks?: () => {}): IChart;

    outputSvg(callbacks?: (() => {})[]): string;
}

const defaultOption: IOption = {
    type: '',
    action: 'all', // all add
    url: '',
    request: {
        //method: 'GET',
        method: 'POST',
        //body: JSON.stringify(testData),
        credentials: 'include',
        //mode: 'cors',
        headers: {
            //'Content-Type': 'application/json'
            'Content-Type': 'application/x-www-form-urlencoded'
        }//new Headers()
    },
    data: null,
    //isHorizontal: true,
    layout: {},
    view: {
        width: 1000,
        height: 500,
        top: 100,
        bottom: 100,
        left: 100,
        right: 100,
    },
    style: {
        lineWidth: 1,
        rotate: 0,
    }
};

//# node
let _fetch;
try {
    _fetch = window.fetch || require('node-fetch');
} catch (e) {
    _fetch = require('node-fetch');
}
const fetch = _fetch;

type WarningValue = {
    Unit: string;
    Values: number[];
};

export interface State {
    eventType: string,//事件类型: 自定义
    mouse: {
        isMove: boolean,//鼠标: 是否移动
        isBrush: boolean,//鼠标: 是否框选-刷子
    },
    keyboard: {
        isCtrl: boolean,//键盘: 是否按下 Ctrl
        isShift: boolean,//键盘: 是否按下 Shift
    },
    menuStatus: {[key:string]: any},//菜单: 状态
}

export abstract class Chart implements IChart {

    public static readonly clazz: string = "chart";
    public static readonly title: string = "基础图表";

    selector: string; //选择器
    option: IOption;
    action: ActionType = 'all';

    node: any;
    svg!: Svg;
    menu!: Menu;

    db: Rdb;
    table!: Table; //数据表
    tableBackup!: Table; //备份表

    state: State = {
        eventType: '',
        mouse: { isMove: false, isBrush: false },
        keyboard: { isCtrl: false, isShift: false },
        menuStatus: {},
    };

    cache: { [key: string]: any } = {};
    pointIdMap: { [key: string]: number } = {}; //测点
    modelMap: { [key: string]: Model<number | string | Date> } = {}; //物理量
    lineMap: { [key: string]: LineObject } = {}; //线
    legendManager: LegendManager = new LegendManager(); //图例

    deletedLineMap: { [key: string]: LineObject } = {}; //已删除的线

    seriesMap: { [key: string]: Series } = {}; //#连续视图

    data: any; //原始数据
    title: string; //标题
    backgroundImage: string = ''; //背景图片

    reverseAxis: boolean = false; //反转Y轴
    initReverse!: string[]; //初始-反转Y轴

    warningValue!: WarningValue; //警戒值-红线
    initWarningValue!: string[]; //初始-绘制警戒值线

    styleComponent!: SvgObject; //css

    topComponent!: Component;
    bottomComponent!: Component;
    leftComponent!: Component;
    rightComponent!: Component;
    gridComponent!: Component;

    backgroundComponent!: Component;
    warningValueComponent!: Component;

    linesComponent!: Component;
    pointsComponent!: Component;
    legendsComponent!: Component;

    protected constructor(selector: string) {
        this.db = new Rdb('wpchartsDB');
        this.selector = selector;
        this.option = clone(defaultOption); //拷贝默认选项
        this.title = (<ChartConstructor>this.constructor).title || ''; //默认标题

        //console.log(`wpcharts:${constructor.clazz}:`, this);
    }

    public setOption(option: IOption, callbacks?: () => {}): IChart {
        this.option = extend(this.option, option);
        this.action = this.option.action || this.action;

        let self = this;
        let {url, request, request: {body}} = this.option;

        if (url) {
            if (typeof body === 'object') {
                this.option.request.body = formurlencoded(body);
            }

            fetch(url, <RequestInit>request).then(function (response: Response) {
                try {
                    return response.json();
                } catch (e) {
                    return response.text().then((data) => {
                        return new Promise((resolve, reject) => {
                            try {
                                resolve(JSON.parse(data));
                            } catch (e) {
                                reject(e);
                                console.log('text:', data);
                            }
                        });
                    });
                }
                /*
                //#
                let contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    return response.json();
                } else if (contentType && contentType.includes('text/html')) {
                    let content = response.text();
                    console.log("setOption: error-data:", content);
                    throw Error("setOption: bad data");
                } else {
                    let content = response.text();
                    console.log("setOption: error-data:", content);
                    throw Error("setOption: bad data");
                }
                */
            }).then(function (data: any) {
                self.option.data = data;
                self.init();
                if (callbacks && typeof callbacks === "function") callbacks();
            }).catch(function (error: any) {
                console.error(error);
            });
        } else if (this.option.data) {
            this.init();
            if (callbacks && typeof callbacks === "function") callbacks();
        } else {
        }

        return this;
    }

    protected init(): this {
        if (this.action !== 'reset') this.initData();
        this.initView();
        this.initBackground();
        this.initCSS();
        this.initModel();
        this.initLegend();
        this.initReverseAxis();
        this.initWarningValueLine();
        this.initAxis();
        this.initLines();
        this.initPoints();
        this.initTitle();
        this.initOther();
        this.initEvent();
        this.initMenu();
        return this;
    }

    protected initMenu() {
        this.menu = new Menu();
        this.svg.contextmenu(this.menu);

        let {menu: rootMenu} = this;
        let self = this;

        let resetMenuItem = new MenuItem({
            text: '重置',
            action() {
                console.log("重置");
                self.reset();
            }
        });

        let reverseYAxisMenuItem = new MenuItem({
            text: '反转Y轴',
            type: this.reverseAxis ? 'check' : 'normal',
            action() {
                console.log("反转Y轴");
                self.reverseAxis = !self.reverseAxis;
                self.reset(self.table.getData());
            }
        });

        let copyMenuItem = new MenuItem({
            text: '复制',
            type: 'menu',
        });
        let copyMenu = new Menu();

        let copyPNGMenuItem = new MenuItem({
            text: 'PNG',
            action() {
                console.log("复制PNG");
                self.copyPng();
            }
        });
        let copyEMFMenuItem = new MenuItem({
            text: 'EMF',
            action() {
                console.log("复制EMF");
                self.copyEmf();
            }
        });

        let downloadMenuItem = new MenuItem({
            text: '下载',
            type: 'menu',
        });
        let downloadMenu = new Menu();

        let downloadPNGMenuItem = new MenuItem({
            text: 'PNG',
            action() {
                console.log("下载PNG");
                self.downloadPng();
            }
        });
        let downloadEMFMenuItem = new MenuItem({
            text: 'EMF',
            action() {
                console.log("下载EMF");
                self.downloadEmf();
            }
        });

        rootMenu.append(resetMenuItem);

        let clazz = (<ChartConstructor>this.constructor).clazz;
        if (clazz === 'hydrograph' || clazz === 'distribution') {
            rootMenu.append(reverseYAxisMenuItem);
        }

        //# 警戒值-红线-菜单
        let {warningValue} = this;
        if (warningValue && warningValue.Unit && warningValue.Values && warningValue.Values.length > 0) {
            let selection = d3.selectAll('.warning-value-line');
            rootMenu.append(new MenuItem({
                text: '警戒值线',
                type: (selection && selection.size() > 0) ? 'check' : 'normal',
                action(menuItem: MenuItem) {
                    console.log("绘制: 警戒值线");
                    selection = d3.selectAll('.warning-value-line');
                    if (selection && selection.size() > 0) {
                        menuItem.setType('normal');
                        selection.remove();

                        //直接移除图例后父节点重绘时，计算视图位置错误，所以把删除改为隐藏。
                        let commonlyLegend = d3.select('.commonly-legend');
                        if (commonlyLegend.size() > 0) self.legendsComponent.getChildren(commonlyLegend.attr('_id')).hide();
                        let seriousLegend = d3.select('.serious-legend');
                        if (seriousLegend.size() > 0) self.legendsComponent.getChildren(seriousLegend.attr('_id')).hide();
                    } else {
                        menuItem.setType('check');
                        self.drawWarningValueLine();
                    }
                }
            }));
        }

        rootMenu.append(new MenuSeparator());
        rootMenu.append(copyMenuItem);
        copyMenuItem.append(copyMenu);
        copyMenu.append(copyPNGMenuItem);
        copyMenu.append(copyEMFMenuItem);

        rootMenu.append(downloadMenuItem);
        downloadMenuItem.append(downloadMenu);
        downloadMenu.append(downloadPNGMenuItem);
        downloadMenu.append(downloadEMFMenuItem);

        let deleteChartMenuItem = new MenuItem({
            text: '删除图',
            action() {
                console.log("删除 Chart");
                self.clear();
                self.remove();
            }
        });

        let deleteLineMenuItem = new MenuItem({
            text: '删除线',
            action(menuItem: MenuItem) {
                console.log("删除 Line:", menuItem);
                let path = menuItem.event.path;
                for(let item of path) {
                    //let attrNode = item.attributes.getNamedItem("pointId");
                    //let type = attrNode ? attrNode.value : '';
                    //if(item.attributes && item.attributes.pointId) {}

                    if(item.getAttribute && item.getAttribute("pointId")) {
                        let pointId = item.getAttribute("pointId");
                        let unit = item.getAttribute("unit");
                        let legend = item.getAttribute("legend");

                        let id = pointId + '-' + unit + '-' + legend;
                        self.deletedLineMap[id] = self.lineMap[id];

                        console.log('删除:', id);
                        self.deleteLine(pointId, unit, legend);
                    }
                }
            }
        });

        rootMenu.append(new MenuSeparator());
        rootMenu.append(deleteChartMenuItem);
        rootMenu.append(deleteLineMenuItem);

        if (config.debug) {
            // 键盘控制
            let keyEvent = (function () {
                document.onkeydown = function (e) {
                    if (e.keyCode === 38) { // up rotate
                        alert("38");
                    } else if (e.keyCode === 40) { // down
                        alert("40");
                    } else if (e.keyCode === 37) { // left
                        alert("37");
                    } else if (e.keyCode === 39) { // right
                        alert("39");
                    } else if (e.keyCode === 32) { //  space  下坠
                        alert("32");
                    }
                }
            })();

            rootMenu.append(new MenuSeparator());
            rootMenu.append(new MenuItem({
                text: 'debug',
                action() {
                    console.log("debug:", self);
                    Message.info('debug...');
                    layui.layer.confirm('您是否要<span style="color: red">保存粗差</span>？', {
                        title: ['操作', 'font-size:18px;'],
                        btn: ['保存粗差', '取消粗差'],
                        btnAlign: 'c',
                    }, function () {
                        Message.msg('<span style="color: darkgreen">保存粗差</span>');
                    }, function () {
                        Message.msg('取消粗差');
                    });
                }
            }));

            copyMenu.append(new MenuSeparator());
            copyMenu.append(new MenuItem({
                text: 'SVG',
                action() {
                    console.log("复制SVG");
                    self.copySvg();
                }
            }));

            downloadMenu.append(new MenuSeparator());
            downloadMenu.append(new MenuItem({
                text: 'SVG',
                action() {
                    console.log("下载SVG");
                    self.downloadSvg();
                }
            }));
        }

    }

    protected initView() {
        let {width, height, top, bottom, left, right} = this.option.view;
        let {rotate} = this.option.style;

        this.remove();
        this.svg = new Svg(d3.select(this.selector), {width, height});
        if (rotate) {
            this.svg.transform(`rotate(${rotate})`);
        }

        this.styleComponent = new Style({"type": "text/css", "media": "screen"});

        this.topComponent = new Component({attribute: {class: 'top'}});
        this.bottomComponent = new Component({attribute: {class: 'bottom'}});
        this.leftComponent = new Component({attribute: {class: 'left'}});
        this.rightComponent = new Component({attribute: {class: 'right'}});
        this.gridComponent = new Component({attribute: {class: 'grid'}});

        this.topComponent.setView({x: 0, y: 0, width, height: top});
        this.bottomComponent.setView({x: 0, y: height - bottom, width, height: bottom, left: left, right: right});
        this.leftComponent.setView({x: 0, y: top, width: left, height: height - top - bottom});
        this.rightComponent.setView({x: width - right, y: top, width: right, height: height - top - bottom});
        this.gridComponent.setView({x: left, y: top, width: width - left - right, height: height - top - bottom});

        this.svg.append(this.styleComponent); //添加 css 样式文件

        //# 全图背景, 解决 node 转换为 png 时没有背景的问题, 注意: 自带背景图的就不需要了。
        this.svg.append(new Rect({width, height, fill: 'white', class: 'background'}));

        this.svg.append(this.topComponent);
        this.svg.append(this.bottomComponent);
        this.svg.append(this.leftComponent);
        this.svg.append(this.rightComponent);
        this.svg.append(this.gridComponent);

        //# 线、点、图例
        this.linesComponent = <Component>this.gridComponent.append(new Component({attribute: {class: 'lines'}}));
        this.pointsComponent = <Component>this.gridComponent.append(new Component({attribute: {class: 'points'}}));
        this.legendsComponent = <Component>new Component({attribute: {class: 'legends'}}).setView({
            x: 50,
            y: 25,
            width: 900,
            height: 70,
            boxOrient: "horizontal"
        });
        this.topComponent.append(this.legendsComponent);

        //# 警戒值-红线
        let {warningValue} = this;
        if (warningValue && warningValue.Unit && warningValue.Values && warningValue.Values.length > 0) {
            this.warningValueComponent = <Component>this.gridComponent.append(new Component({attribute: {class: 'warning-value'}}));
        }
    }

    //# 局部背景, 中央绘画区, 用于为事件提供背景
    protected initBackground() {
        let {width: gw, height: gh} = this.gridComponent.getView();

        this.backgroundComponent = new Component({attribute: {class: 'background'}});
        this.gridComponent.append(this.backgroundComponent);
        this.backgroundComponent.append(new Rect({x: 0.5, y: 0, width: gw - 1, height: gh, fill: 'none', stroke: 'black', 'stroke-width': 1}));

        //this.gridComponent.style({cursor: 'crosshair'});
        //this.gridComponent.style({cursor: 'url("http://ued.taobao.com/blog/wp-content/themes/taobaoued/images/cursor.ico"),crosshair'});
        //this.gridComponent.style({cursor: 'url("/wpcharts/dist/favicon.ico"),crosshair'});
        //this.gridComponent.style({cursor: 'url("/wpcharts/dist/transparent.ico"),crosshair'});

        if (isBrowser) {
            if (config.browser.chrome && config.os.group.indexOf('windows') > -1) {
                this.gridComponent.style({cursor: 'url("/wpcharts/dist/css/image/empty-1x1-white.png"),crosshair'});
            } else {
                this.gridComponent.style({cursor: 'url("/wpcharts/dist/css/image/empty-1x1.png"),crosshair'});
            }
        }

    }

    protected initWarningValueLine() {
        let {initWarningValue, warningValue, warningValueComponent} = this;
        if (warningValueComponent && initWarningValue && initWarningValue.length > 0) {
            if (initWarningValue[0] === warningValue.Unit) {
                this.drawWarningValueLine();
            }
        }
    }

    protected initReverseAxis() {
        let {modelMap, initReverse} = this;
        for (let model of Object.values(modelMap)) {
            if (initReverse && initReverse.includes(model.name)) {
                model.reverse();
            }
        }
        if ((<ChartConstructor>this.constructor).clazz === 'hydrograph') {
            this.drawReverseAxis();
        }
    }

    protected initCSS() {
        let self = this;
        if (isBrowser) {
            fetch("/wpcharts/dist/css/wpcharts.css").then(function (response: Response) {
                return response.text();
            }).then(function (text: string) {
                //console.log("css:", text);
                self.styleComponent.text(text);
            }).catch(function (error: any) {
                console.error(error);
            });
        } else if (isNode) {
            const fs = require("fs");
            const style = fs.readFileSync('./lib/css/wpcharts.css').toString();
            //const style = fs.readFileSync('../../lib/css/wpcharts.css').toString();
            self.styleComponent.text(style);
        }
    }

    protected initEvent() {
        let {width: gw, height: gh} = this.gridComponent.getView();
        //let {width, height, top, bottom, left, right} = this.option.view;

        let g = this.gridComponent.append(new G({class: 'mouse-event'}));
        let hline = new Line({x2: gw, stroke: 'red', 'stroke-width': 1});
        let vline = new Line({y2: gh, stroke: 'red', 'stroke-width': 1});
        let rect = new Rect({width: gw, height: gh, stroke: 'none', opacity: 0, 'pointer-events': 'all'});
        let tooltips = new Tooltips();
        let brushRect = new Rect({class: 'brush', fill: '#777', 'fill-opacity': 0.5, stroke: '#fff', 'shape-rendering': 'crispEdges'});

        g.append(hline).hide();
        g.append(vline).hide();
        g.append(brushRect).hide();
        g.append(rect);
        g.append(tooltips);

        //# d3原始刷子框选操作
        //let select = new G({class:'brush'});
        //let brush = d3.brush();
        //g.append(select).call(brush);

        let timer: any;
        let startPosition: number[] | undefined;
        let endPosition: number[] | undefined;

        //鼠标移入
        rect.on('mouseover', () => {
            //console.log("event: mouseover");
            d3.event.preventDefault();
            hline.show();
            vline.show();
        });

        //鼠标移出
        rect.on('mouseout', () => {
            //console.log("event: mouseout");
            d3.event.preventDefault();
            hline.hide();
            vline.hide();
            setTimeout(() => tooltips.hide(), 200);
        });

        //鼠标按下
        rect.on('mousedown', (datum: any, index: number, groups: any[] | ArrayLike<any>) => {
            d3.event.preventDefault();
            this.state.mouse.isBrush = true;
            startPosition = d3.mouse(groups[index]);

            if (d3.event.ctrlKey) {//按下 Ctrl 键
                //console.log(1, d3.event);
                this.state.keyboard.isCtrl = true;
                this.state.eventType = ZoomEvent;
                let [x, y] = startPosition;
                startPosition = [x, 0];
            } else if(d3.event.shiftKey) {//按下 Shift 键
                //console.log(2, d3.event);
                this.state.keyboard.isShift = true;
                this.state.eventType = BrushEvent;
            } else if(d3.event.button === 0) {
                console.log(3, d3.event);
                this.state.eventType = TranslationEvent;
                //hline.hide();
                //vline.hide();
                if (isBrowser) {
                    this.gridComponent.style({cursor: 'pointer'});
                }
            } else {
                console.log(4, d3.event);
            }
        });

        //鼠标放开
        rect.on('mouseup', (datum: any, index: number, groups: any[] | ArrayLike<any>) => {
            d3.event.preventDefault();
            brushRect.attr({width: 0, height: 0, x: 0, y: 0}).hide();
            endPosition = d3.mouse(groups[index]);

            if(this.state.eventType === ZoomEvent) {
                //console.log('startPosition', startPosition);
                //console.log('endPosition', endPosition);
                //console.log('d3.event', d3.event);
                let [x, y] = endPosition;
                endPosition = [x, gh];
                this.svg.dispatch(BrushEvent, {bubbles: false, cancelable: false, detail: {startPosition, endPosition}});
            } else if(this.state.eventType === BrushEvent) {
                layui.layer.confirm('您是否要<span style="color: red">保存粗差</span>？', {
                    title: ['操作', 'font-size:18px;'],
                    btn: ['保存粗差', '取消粗差'],
                    btnAlign: 'c',
                }, function () {
                    Message.msg('<span style="color: darkgreen">保存粗差</span>');
                }, function () {
                    Message.msg('取消粗差');
                });
                //# 触发刷子框选事件
                this.svg.dispatch(BrushEvent, {bubbles: false, cancelable: false, detail: {startPosition, endPosition}});
            } else if(this.state.eventType === TranslationEvent) {
                this.svg.dispatch(MouseLeft, {bubbles: false, cancelable: false, detail: {startPosition, endPosition}});
                //hline.show();
                //vline.show();
                if (isBrowser) {
                    if (config.browser.chrome && config.os.group.indexOf('windows') > -1) {
                        this.gridComponent.style({cursor: 'url("/wpcharts/dist/css/image/empty-1x1-white.png"),crosshair'});
                    } else {
                        this.gridComponent.style({cursor: 'url("/wpcharts/dist/css/image/empty-1x1.png"),crosshair'});
                    }
                }
            }

            //清空数据
            startPosition = undefined;
            endPosition = undefined;
            this.state.eventType = '';
            this.state.mouse.isBrush = false;
        });

        //鼠标移动
        rect.on('mousemove', (datum: any, index: number, groups: any[] | ArrayLike<any>) => {
            d3.event.preventDefault();

            //# 移动十字线
            let mouse = d3.mouse(groups[index]);
            let [x, y] = mouse;
            if (x > 0 && y > 0) {
                let xDeviation = 0;//十字线偏移值x，避免被矩形框遮住
                let yDeviation = 0;//十字线偏移值y，避免被矩形框遮住
                if(startPosition) {
                    let [sx, sy] = startPosition;
                    if(x > sx) {
                        xDeviation = 1.5;
                    } else {
                        xDeviation = -1.5;
                    }
                    if (y > sy) {
                        yDeviation = 1.5;
                    } else {
                        yDeviation = -1.5;
                    }
                }

                hline.attr({y1: y + yDeviation, y2: y + yDeviation});//水平线
                vline.attr({x1: x + xDeviation, x2: x + xDeviation});//垂直线

                if(startPosition) {
                    if (this.state.eventType === ZoomEvent) {
                        y = gh;//可框选的最大高度
                        let [sx, sy] = startPosition;
                        let w = Math.abs(x - sx);
                        let h = Math.abs(y - sy);
                        let mx, my;
                        if (x > sx) {
                            mx = sx;
                        } else {
                            mx = sx - w;
                        }
                        if (y > sy) {
                            my = sy;
                        } else {
                            my = sy - h;
                        }
                        brushRect.attr({width: w, height: h, x: mx, y: my}).show();
                    } else if(this.state.eventType === BrushEvent) {//# brush 选择, 显示矩形框
                        let [sx, sy] = startPosition;
                        let w = Math.abs(x - sx);
                        let h = Math.abs(y - sy);
                        let mx, my;
                        if (x > sx) {
                            mx = sx;
                        } else {
                            mx = sx - w;
                        }
                        if (y > sy) {
                            my = sy;
                        } else {
                            my = sy - h;
                        }
                        brushRect.attr({width: w, height: h, x: mx, y: my}).show();
                    } else if (this.state.eventType === TranslationEvent) {

                    }
                }
            } else {
                return;
            }

            //# 判断鼠标是否连续移动，还是短暂停留
            this.state.mouse.isMove = true;
            tooltips.hide();
            clearTimeout(timer);
            timer = setTimeout(() => {
                this.state.mouse.isMove = false;

                //# 触发提示信息事件
                this.svg.dispatch(TooltipsEvent, {
                    bubbles: false, cancelable: false, detail: {
                        mouse: mouse,
                        target: tooltips,
                    }
                });
            }, 200);

        });

        //鼠标滚轮
        rect.on('mousewheel', () => {//鼠标滚轮: 向上放大、向下缩小
            d3.event.preventDefault(); //停止向上冒泡
            const event = d3.event;

            let delta = 0; //步长
            if (event.wheelDelta) {//IE、chrome浏览器使用的是wheelDelta，并且值为“正负120的倍数”
                delta = event.wheelDelta / 120;
                // @ts-ignore
                if (window.opera) delta = -delta;//因为IE、chrome等向下滚动是负值，FF是正值，为了处理一致性，在此取反处理
            } else if (event.detail) {//FF浏览器使用的是detail,其值为“正负3的倍数”
                delta = -event.detail / 3;
            }

            if (delta > 0) {//向上滚动
                console.log('上', delta);
            } else if (delta < 0) {//向下滚动
                console.log('下', delta);
            }

            this.svg.dispatch(MouseWheel, {
                bubbles: false, cancelable: false, detail: {
                    delta: delta
                }
            });
        });

    }

    protected initTitle(): void {
        let textComponent = new Text({x: this.option.view.width / 2, y: 15, 'text-anchor': 'middle', 'dominant-baseline': 'middle'});
        this.topComponent.append(textComponent).text(this.title);
        textComponent.append(new Title()).text(this.title);
    }

    protected initAxis() {
        this.initXAxis();
        this.initYAxis();
    }

    //#必须在派生类中实现
    protected abstract initData(): void;

    protected abstract initModel(): void;

    protected abstract initLegend(): void;

    protected abstract initXAxis(): void;

    protected abstract initYAxis(): void;

    protected abstract initLines(): void;

    protected abstract initPoints(): void;

    protected initOther(): void {
        if (isBrowser) {
            fetch("/api/image/config").then(function (response: Response) {
                return response.json();
            }).then(function (data: any) {
                extend(config, data);
            }).catch(function (error: any) {
                console.error(error);
                //extend(config, {node: 'http://127.0.0.1:8888'});
                extend(config, {node: 'http://192.168.1.25:8888'});
                //extend(config, {node: 'http://192.168.199.100:8888'});
                //extend(config, {node: 'http://119.57.135.180:8888'});
            });
        }
    }

    //# 清空数据
    protected clear() {
        this.cache = {};
        this.pointIdMap = {};
        this.modelMap = {};
        this.lineMap = {};
        this.legendManager = new LegendManager();
        this.table.delete();
    }

    //# 移除 svg dom 节点
    protected remove() {
        //d3.selectAll("svg").remove();
        d3.select(this.selector).select("svg").remove();
    }

    protected drawDottedLine(num: number[], type: 'horizontal' | 'vertical'): void;
    protected drawDottedLine(num: number, type: 'horizontal' | 'vertical'): void;
    protected drawDottedLine(num: number | number[], type: 'horizontal' | 'vertical'): void {
        let {width, height} = this.gridComponent.getView();
        if(num instanceof Array) {
            if (type === 'horizontal') {
                for(let i = 0; i < num.length; i++) {
                    let n = num[i];
                    if(i === 0) n -= 0.5;
                    let line = new Line({y1: n, y2: n, x2: width, stroke: 'black', 'stroke-width': 1, "stroke-dasharray": 2, opacity: 0.5});
                    this.backgroundComponent.append(line);
                }
            } else if (type === 'vertical') {
                for(let i = 0; i < num.length; i++) {
                    let n = num[i];
                    if(i === 0) n += 0.5;
                    let line = new Line({x1: n, x2: n, y2: height, stroke: 'black', 'stroke-width': 1, "stroke-dasharray": 2, opacity: 0.5});
                    this.backgroundComponent.append(line);
                }
            }
        } else {
            let space = type === 'horizontal' ? height / num : width / num;
            if (type === 'horizontal') {
                for (let i = 1; i < num; i++) {
                    let interval = space * i + 0.5;
                    let line = new Line({y1: interval, y2: interval, x2: width, stroke: 'black', 'stroke-width': 1, "stroke-dasharray": 2, opacity: 0.5});
                    this.backgroundComponent.append(line);
                }
            } else if (type === 'vertical') {
                for (let i = 1; i < num; i++) {
                    let interval = space * i + 0.5;
                    let line = new Line({x1: interval, x2: interval, y2: height, stroke: 'black', 'stroke-width': 1, "stroke-dasharray": 2, opacity: 0.5});
                    this.backgroundComponent.append(line);
                }
            }
        }
    }

    /**
     * 警戒值顺序[一般异常指标上限值,一般异常指标下限值,严重异常指标上限值,严重异常指标下限值]
     **/
    protected drawWarningValueLine() {
        let {selector, warningValue, modelMap, gridComponent, warningValueComponent} = this;
        if (!warningValueComponent || !warningValue || !warningValue.Unit || !warningValue.Values || warningValue.Values.length <= 0) return;

        //let warnColor = ['#ffbea8', '#ffbdce', '#ffa5be', '#ff9095'];
        let warnColor = ['#FF99FF', '#FF99FF', '#FF0000', '#FF0000'];
        let commonlyLegend, seriousLegend;
        let {width} = gridComponent.getView();
        let {Unit, Values} = warningValue;

        let model = <LinearModel>modelMap[Unit]; //警告值的物理量模型
        if (!model) return; //# 框选放大时，如果没有选到包含警告值的物理量，就不画警告线。

        let {scale, minNice, maxNice} = model;

        for (let i = 0; i < Values.length; i++) {
            let value = Values[i];
            if (value >= minNice && value <= maxNice) {
                let y = scale(value);
                warningValueComponent.append(new Line({x1: 1, x2: width - 1, y1: y, y2: y, class: 'warning-value-line', stroke: warnColor[i]}));

                let content = i === 0 || i === 1 ? '一般异常指标' : '严重异常指标';
                content = content + ' ' + Unit;
                if (!commonlyLegend && (i === 0 || i === 1)) {
                    commonlyLegend = new Legend({
                        name: 'commonlyLegend',
                        color: warnColor[i],
                        generator: d3.symbol().type(d3.symbolStar),
                        fill: false
                    });

                    let commonlyNode = d3.select(`${selector} .commonly-legend`);
                    if (commonlyNode.size() > 0) {
                        let legend = this.legendsComponent.getChildren(commonlyNode.attr('_id'));
                        legend.show();
                    } else {
                        commonlyLegend.drawLegend(this.legendsComponent, content, 0, {class: 'commonly-legend'});
                    }
                } else if (!seriousLegend && (i === 2 || i === 3)) {
                    seriousLegend = new Legend({
                        name: 'seriousLegend',
                        color: warnColor[i],
                        generator: d3.symbol().type(d3.symbolStar),
                        fill: false
                    });

                    let seriousNode = d3.select(`${selector} .serious-legend`);
                    if (seriousNode.size() > 0) {
                        let legend = this.legendsComponent.getChildren(seriousNode.attr('_id'));
                        legend.show();
                    } else {
                        seriousLegend.drawLegend(this.legendsComponent, content, 0, {class: 'serious-legend'});
                    }
                }
            }
        }
    }

    /**
     * 反转Y轴
     **/
    protected drawReverseAxis() {
        let {modelMap, reverseAxis} = this;
        for (let model of Object.values(modelMap)) {
            if (model.name !== 'time') {
                if (reverseAxis) {
                    model.reverse();
                }
            }
        }
    }

    protected reset(): this;
    protected reset(data: any[][], isRefreshDeleted?: boolean): this;
    protected reset(data?: any[][], isRefreshDeleted: boolean = false): this {
        if (data === null) return this;

        this.action = 'reset';
        this.clear();

        let {table, tableBackup} = this;
        if (data === undefined) {
            data = tableBackup.getData();
            this.deletedLineMap = {}; //只有全部重置时才清除已删除数据线
        }
        for (let i = 0; i < data.length; i++) {
            table.insert(data[i])
        }

        this.init();

        if(isRefreshDeleted) {
            for(let line of <LineObject[]>Object.values(this.deletedLineMap)) {
                let pointId = line.pointId;
                let unit = line.unit;
                let legend = line.legend;
                this.deleteLine(pointId, unit, legend);
            }
        }

        return this;
    }

    public deleteLine(pointId: string, unit: string, legend: string) {
        let {table} = this;
        let newData: any[] = [];
        let deletedData: any[] = [];

        let data = table.getData();
        for(let i = 0; i < data.length; i++) {
            let row = data[i];
            let p = table.field('PointId', row);
            let u = table.field('Unit', row);
            let l = table.field('Legend', row);
            if(p !== pointId || u !== unit || l !== legend) {
                newData.push(row);
            } else {
                deletedData.push(row);
            }
        }

        if (newData.length > 0) {
            this.reset(newData);
        }
    }

    outputPreprocessing() {
        this.menu.hide();
    }

    outputSvg(callbacks?: (() => {})[]): string {
        if (callbacks && isFunction(callbacks[0])) {
            callbacks[0]();
        }

        this.outputPreprocessing();
        let svg = this.svg.getSvgContext();

        let hideTime;
        let clazz = (<ChartConstructor>this.constructor).clazz;
        if (clazz === 'distribution' || clazz === "distribution-background") {
            hideTime = true;
        }
        if (hideTime) {
            svg.selectAll(".time-axis").style("display", "none");
        }

        let serializer = new XMLSerializer();
        let source = serializer.serializeToString(svg.node());
        source = '<?xml version="1.0" standalone="no"?>\r\n' + source;

        if (hideTime) {
            svg.selectAll(".time-axis").style("display", null);
        }

        if (callbacks && isFunction(callbacks[1])) {
            callbacks[1]();
        }

        return source;
    }

    async outputPng(svgDataURL: string): Promise<string> {
        const loadImg = async (src: ImageProperty | ImageProperty[]): Promise<ImageProperty[]> => {
            let paths = Array.isArray(src) ? src : [src];
            let promise: Promise<ImageProperty>[] = paths.map((path) => {
                return new Promise((resolve, reject) => {
                    let img: HTMLImageElement = new Image();
                    img.setAttribute("crossOrigin", "anonymous");
                    img.src = path.href;
                    //只是更新了DOM对象,图片数据信息还未加载完成，加载资源是异步执行的,需要监听load事件的,事件发生后,就能获取资源
                    img.onload = () => {
                        path.object = img;
                        resolve(path);
                    };
                    img.onerror = (err) => {
                        reject(err);
                    };
                });
            });
            return Promise.all<ImageProperty>(promise);
        };

        let canvas = document.createElement("canvas");
        canvas.width = this.option.view.width;
        canvas.height = this.option.view.height;
        //canvas.style.display = "none";

        let graph = <CanvasRenderingContext2D>canvas.getContext("2d");
        graph.fillStyle = "#FFFFFF";//必须先设置背景色
        graph.fillRect(0, 0, canvas.width, canvas.height);//然后再设置背景大小

        let imgUrls = [];

        //# 处理背景图片
        let {backgroundImage} = this;
        if (backgroundImage) {
            //document.querySelector('#root2-3 .background-image');
            //document.querySelectorAll('#root2-3 .background-image');
            let backgroundImageElement = document.querySelector(this.selector + ' .background-image');//console.log(backgroundImageElement, backgroundImageElement.width);
            if (backgroundImageElement) {//处理背景图偏移位置
                let href = backgroundImage;
                let x = (<SVGImageElement>backgroundImageElement).x.baseVal.value;
                let y = (<SVGImageElement>backgroundImageElement).y.baseVal.value;
                let width = (<SVGImageElement>backgroundImageElement).width.baseVal.value;
                let height = (<SVGImageElement>backgroundImageElement).height.baseVal.value;
                imgUrls.push({href, x, y, width, height});
            }
        }

        imgUrls.push({href: svgDataURL, x: 0, y: 0, width: canvas.width, height: canvas.height});
        let imgObjs = await loadImg(imgUrls);
        for (let i = 0; i < imgObjs.length; i++) {
            let {object: img, x, y, width, height} = imgObjs[i];//console.log(img);
            graph.drawImage(<CanvasImageSource>img, x, y, width, height); //1、在画布上先绘制背景图 //2、再绘制svg图
        }

        //获取图片合并后的data-URL,参数可选图片格式，图片质量
        return canvas.toDataURL("image/png");
    }

    downloadFile_last(content: string, filename?: string, isConvert: boolean = false) {
        filename = filename || this.title + '_' + formatTimeSimple(new Date());// 设置下载文件的文件名

        if (config.browser.ie) {
            // @ts-ignore
            window.saveAs(new Blob([content]), filename);
        } else {
            if (isConvert) {
                let blob = new Blob([content]);
                content = URL.createObjectURL(blob);//待释放
            }

            let aEle = document.createElement("a");// 创建a标签
            aEle.download = filename;
            aEle.href = content;

            //aEle.target = '_blank';
            //document.body.appendChild(aEle);
            //window.open('./todo.txt');

            aEle.click();// 触发点击事件
        }
    }

    downloadFile(content: string | Blob, filename?: string) {
        filename = filename || this.title + '_' + formatTimeSimple(new Date()) + '.tmp';// 设置下载文件的文件名

        if (typeof content === "string") {
            content = new Blob([content]);
        } else if (!(content instanceof Blob)) {
            throw new Error('download data not is blob')
        }

        // @ts-ignore
        let saveAs = window.saveAs;
        saveAs(content, filename);
    }

    downloadImage(format: string) {
        let self = this;
        let filename = this.title + '_' + formatTimeSimple(new Date()) + "." + format;

        let content = this.outputSvg();

        let url = concat(config.node, '/image/svg/' + format);
        if (this.backgroundImage) {
            url += '?img=' + this.backgroundImage;
        }

        fetch(url, {
            method: 'POST',
            body: content,
            mode: 'cors',
            headers: {
                //'Content-Type':'image/svg+xml'
                'Content-Type': 'text/plain; charset=utf-8'
            }
        }).then(function (response: Response) {
            //return response.arrayBuffer();
            return response.blob();
        }).then(function (data: Blob) {//ArrayBuffer
            //self.downloadFile(URL.createObjectURL(new Blob([data])), filename, false);
            self.downloadFile(data, filename);
        }).catch(function (error: any) {
            console.error(error);
        });
    }

    downloadSvg() {
        let filename = this.title + '_' + formatTimeSimple(new Date()) + ".svg";
        let content = this.outputSvg();
        this.downloadFile(content, filename);
    }

    downloadPng_last() {
        let self = this;
        let filename = self.title + '_' + formatTimeSimple(new Date()) + ".png";

        let svg = this.svg.getSvgContext();
        let svgSourceString = this.outputSvg();

        let svgDataURL = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgSourceString);

        let outputPng = this.outputPng(svgDataURL);
        outputPng.then((dataURL) => {
            //console.log(dataURL);
            self.downloadFile(dataURL, filename);
        }).catch((err) => {
            console.log("图片加载失败:", err);
        });
    }

    downloadPng() {
        this.downloadImage('png');
    }

    downloadEmf() {
        this.downloadImage('emf');
    }

    selectNodeCopy(targetNode: Node) {
        if (window.getSelection) {
            //chrome等主流浏览器
            let selection = <Selection>window.getSelection();
            let range = document.createRange();
            range.selectNode(targetNode);
            try {
                selection.removeAllRanges();
            } catch (e) {
                console.error('selectNodeCopy:', e);
            }
            selection.addRange(range);
            // @ts-ignore
        } else if (document.body.createTextRange) {
            //ie
            // @ts-ignore
            let range = document.body.createTextRange();
            range.moveToElementText(targetNode);
            range.select();
        }
        document.execCommand('copy');
    }

    copyText(text: string, callback?: (text: string) => void) {
        let copyId = 'copy_input';
        let tag = document.createElement('input');
        tag.setAttribute('id', copyId);
        //tag.setAttribute('type', 'hidden');
        tag.value = text;
        document.getElementsByTagName('body')[0].appendChild(tag);
        // @ts-ignore
        (<HTMLElement>document.getElementById(copyId)).select();
        document.execCommand('copy');
        if (config.browser.ie) {
            // @ts-ignore
            tag.removeNode(true);
        } else {
            //(<HTMLElement>document.getElementById(copyId)).remove();
            tag.remove();
        }
        if (callback) {
            callback(text);
        }
    }

    copyImage(url: string, callback?: (url: string) => void) {
        let self = this;
        let copyId = 'copy_input';
        let tag = document.createElement('img');
        tag.setAttribute('id', copyId);
        tag.src = url;
        //tag.width = 10;
        //tag.height = 10;
        //tag.src = 'http://img0.bdstatic.com/static/searchresult/img/logo-2X_b99594a.png';
        //tag.src = 'http://192.168.199.172:8888/svg2png';

        document.getElementsByTagName('body')[0].appendChild(tag);
        tag.onload = function () {
            self.selectNodeCopy(tag);
            if (config.browser.ie) {
                // @ts-ignore
                tag.removeNode(true);
            } else {
                tag.remove();
                //tag.style.display = 'none';
            }
        };

        if (callback) {
            callback(url);
        }
    }

    @before(() => console.log('copySvg: before'))
    @after(() => console.log('copySvg: after'))
    copySvg() {
        console.log('copySvg: run');
        let content = this.outputSvg();
        this.copyText(content);
    }

    copyPng() {
        /*
        // test clipboardData blob
        document.getElementsByTagName("svg")[0].addEventListener('paste', (event: ClipboardEvent) => {
            let clipboardData = (event.clipboardData || window.clipboardData);

            console.log(1, clipboardData.files);
            console.log(2, clipboardData.items);

            for (let i = 0; i < clipboardData.files.length; i++) {
                console.log(11, clipboardData.files[i]);
                let tag = document.createElement('img');
                let data = URL.createObjectURL(clipboardData.files[i].getAsFile());
                tag.src = data;
            }

            for (let i = 0; i < clipboardData.items.length; i++) {
                console.log(22, clipboardData.items[i]);
            }

            event.preventDefault();
        });
        return;
        */

        /*
        // test clipboardData text
        document.getElementsByTagName("svg")[0].addEventListener('copy', (event: ClipboardEvent) => {debugger
            let {clipboardData} = event;
            if (!clipboardData) return console.warn("event.clipboardData is null");

            //clipboardData.clearData();
            //event.clipboardData.setData('text/plain', "I im is test text. 你好，北京！");

            console.log(1, clipboardData.items);

            fetch("http://127.0.0.1:8888/svg2png").then(function (response: Response) {
                return response.blob();
            }).then(function (blob: Blob) {
                let a = document.createElement('a');
                let url = window.URL.createObjectURL(blob);   // 获取 blob 本地文件连接 (blob 为纯二进制对象，不能够直接保存到磁盘上)
                //let filename = res.headers.get('Content-Disposition');
                a.href = url;
                //a.download = filename;
                a.download = "000" + ".png";
                a.click();
                window.URL.revokeObjectURL(url);

                if (!clipboardData) return console.warn("event.clipboardData is null");
                clipboardData.setData('image/png', url);
            }).catch(function (error: Error) {
                console.log(error);
            });

            event.preventDefault();
        });
        document.execCommand('copy');
        */

        let self = this;
        let svg = this.svg.getSvgContext();

        let content = this.outputSvg();

        let url = concat(config.node, '/image/svg/png?cache=true');
        if (this.backgroundImage) {
            url += '&img=' + this.backgroundImage;
        }
        //console.log(url);

        fetch(url, {
            method: 'POST',
            body: content,
            mode: 'cors',
            headers: {
                //'Content-Type':'image/svg+xml'
                'Content-Type': 'text/plain; charset=utf-8'
            }
        }).then(function (response: Response) {
            return response.text();
        }).then(function (text: string) {
            console.log("cache image url:", text);
            self.copyImage(text);
        }).catch(function (error: any) {
            console.error(error);
        });
    }

    copyEmf() {
        let self = this;
        let svg = this.svg.getSvgContext();

        let content = this.outputSvg();

        let url = concat(config.node, '/image/svg/emf?cache=true');
        if (this.backgroundImage) {
            url += '&img=' + this.backgroundImage;
        }
        //console.log(url);

        fetch(url, {
            method: 'POST',
            body: content,
            mode: 'cors',
            headers: {
                //'Content-Type':'image/svg+xml'
                'Content-Type': 'text/plain; charset=utf-8'
            }
        }).then(function (response: Response) {
            return response.text();
        }).then(function (text: string) {
            console.log("cache image url:", text);
            self.copyImage(text);
        }).catch(function (error: any) {
            console.error(error);
        });

        /*
        //url: string, callback?: (url: string) => void
        let self = this;
        let copyId = 'copy_input';
        let tag = document.createElement('img');
        tag.setAttribute('id', copyId);
        //tag.src = 'http://img0.bdstatic.com/static/searchresult/img/logo-2X_b99594a.png';
        tag.src = 'http://192.168.199.172:8888/svg2emf';
        document.getElementsByTagName('body')[0].appendChild(tag);
        tag.onload = function () {
            self.selectNodeCopy(tag);
            if (config.browser.ie) {
                // @ts-ignore
                tag.removeNode(true);
            } else {
                tag.remove();
                //tag.style.display = 'none';
            }
        };
        */
    }
}

//# 构造器定义
export interface ChartConstructor {
    new(selector: string): Chart;

    clazz: string;
    title: string;
}

//# 只用来表示图表类的类型，不生成实例。
class ChartInstance extends Chart {
    protected initData(): void {
    }

    protected initModel(): void {
    }

    protected initXAxis(): void {
    }

    protected initYAxis(): void {
    }

    protected initLines(): void {
    }

    protected initPoints(): void {
    }

    protected initLegend(): void {
    }
}

export type ChartClass = typeof ChartInstance;
