import {SvgContext} from "../../svg/SvgObject";
import {Component} from "../Component";
import {View} from "../../view/View";
import {Rect} from "../../svg/Rect";
import {Line} from "../../svg/Line";

export class MenuSeparator extends Component {

    public static readonly ClassName: string = 'menu-separator';

    static readonly Width = 128;
    static readonly Height = 10;

    constructor() {
        super();
        this.setView({width: MenuSeparator.Width, height: MenuSeparator.Height});
    }

    protected draw(parentSvgContext: SvgContext): this {
        super.draw(parentSvgContext);

        let {width, height} = <View>this.view;
        let layout = new Rect({width: width, height: height});
        this.append(layout);

        let separator = new Line({x2: width}).setView({y: 5});
        this.append(separator);

        return this;
    }

}
