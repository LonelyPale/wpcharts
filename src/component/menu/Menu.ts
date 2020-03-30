import d3 from "d3";
import {SvgContext, SvgObject} from "../../svg/SvgObject";
import {Component, ComponentProperty} from "../Component";
import {MenuSeparator} from "./MenuSeparator";
import {MenuItem} from "./MenuItem";
import {View} from "../../view/View";
import {Rect} from "../../svg/Rect";
import {MenuDefaultWidth, MenuDefaultHeight} from "./MenuConstants";

export class Menu extends Component {

    public static readonly ClassName: string = 'menu';

    private layout!: Rect;

    public event!: any;

    constructor(property?: ComponentProperty) {
        super(property);
        this.setView({
            x: 0,
            y: 0,
            width: MenuDefaultWidth,
            height: MenuDefaultHeight,
            top: 5,
            right: 0.5,
            bottom: 5,
            left: 0.5,
            boxOrient: "vertical"
        });
    }

    append(svgObject: SvgObject): SvgObject {
        if (svgObject instanceof Menu || svgObject instanceof MenuItem || svgObject instanceof MenuSeparator) {
            let menuItemCount = 0;
            let menuSeparatorCount = 0;
            for (let menu of Object.values(this.children)) {
                if (menu instanceof MenuItem) {
                    menuItemCount++;
                } else if (menu instanceof MenuSeparator) {
                    menuSeparatorCount++;
                }
            }
            if (svgObject instanceof MenuItem) {
                menuItemCount++;
            } else if (svgObject instanceof MenuSeparator) {
                menuSeparatorCount++;
            }
            let {top, bottom} = <View>this.view;
            (<View>this.view).height = top + bottom + menuItemCount * MenuItem.Height + menuSeparatorCount * MenuSeparator.Height;
            this.layout.attr('height', (<View>this.view).height);
        }
        return super.append(svgObject);
    }

    protected draw(parentSvgContext: SvgContext): SvgObject {
        super.draw(parentSvgContext);

        let {width, height} = <View>this.view;
        let layout = new Rect({class: 'layout', width: width, height: height, rx: 5});
        this.append(layout);
        this.layout = layout;

        this.hide();
        this.on('click', () => {
            let path: any[] = d3.event.path || [];
            for (let i = 0; i < path.length; i++) {
                let item = path[i];
                if (item.className && typeof item.className === "object") {
                    let className = item.className.baseVal;
                    if (className === Menu.ClassName || className === MenuSeparator.ClassName) {
                        d3.event.stopPropagation();
                    } else if (item.className.baseVal === MenuItem.ClassName) {
                        let attrNode = item.attributes.getNamedItem("type");
                        let type = attrNode ? attrNode.value : '';
                        if (type === 'menu') {
                            d3.event.stopPropagation();
                        } else {
                            this.hide();
                            break;
                        }
                    }
                }
            }
        });

        return this;
    }

    show(): this;
    show(node : any): this;
    show(): this {
        //是否触发图例的删除线菜单项
        let isDelete = false;
        let path = d3.event.path;
        if(path.length > 0) {
            for(let i = 0; i < path.length; i++) {
                let node = path[i];
                let classList = node.classList;
                if(classList && classList.length > 0) {
                    for(let j = 0; j < classList.length; j++) {
                        if(classList[j] === 'legends') {
                            isDelete = true;
                            break;
                        }
                    }
                }
                if(isDelete) break;
            }
        }

        //let children = this.children;
        //let menuItemList = <MenuItem[]>Object.values(children);
        //for (let menuItem of <MenuItem[]>Object.values(this.children)) {}

        //显示或隐藏图例的菜单项：删除线
        for (let menuItem of Object.values(this.children)) {
            if (menuItem instanceof MenuItem) {
                if(menuItem.property.text === '删除线' || menuItem.property.text === '设置线') {
                    if(isDelete) {
                        menuItem.event = this.event;
                        menuItem.show();
                    } else {
                        menuItem.hide();
                    }
                }
            }
        }

        //调整有隐藏项的菜单高度
        let countHideItem = 0;
        for (let item of Object.values(this.children)) {
            let view = (<SvgObject>item).getView();
            if(item instanceof Menu) {
                if(item.style('display') === 'none') {
                    countHideItem++;
                } else {
                    item.transform(`translate(${view.tx}, ${view.ty - countHideItem * MenuItem.Height})`, true);
                }
            } else if (item instanceof MenuItem) {
                if(item.style('display') === 'none') {
                    countHideItem++;
                } else {
                    item.transform(`translate(${view.tx}, ${view.ty - countHideItem * MenuItem.Height})`, true);
                }
            } else if (item instanceof MenuSeparator) {
                if(item.style('display') === 'none') {
                    countHideItem++;
                } else {
                    item.transform(`translate(${view.tx}, ${view.ty - countHideItem * MenuItem.Height})`, true);
                }
            }
        }
        this.layout.attr('height', (<View>this.view).height - countHideItem * MenuItem.Height);

        return super.show();
    }

}
