import d3 from "d3";
import {SvgContext, SvgObject} from "../../svg/SvgObject";
import {Component, ComponentProperty} from "../Component";
import {MenuSeparator} from "./MenuSeparator";
import {MenuItem} from "./MenuItem";
import {View} from "../../view/View";
import {Rect} from "../../svg/Rect";

export class Menu extends Component {

    public static readonly ClassName: string = 'menu';

    private layout!: Rect;

    constructor(property?: ComponentProperty) {
        super(property);
        this.setView({
            x: 0,
            y: 0,
            width: 129,
            height: 0,
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

}
