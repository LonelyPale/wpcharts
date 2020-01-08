import {SvgAttribute, SvgContext, SvgObject} from "../svg/SvgObject";
import {G} from "../svg/G";

export interface ComponentProperty extends Record<string, any> {
    attribute?: SvgAttribute;
}

export class Component extends G {

    public static readonly ClassName: string = 'component';

    public readonly property: ComponentProperty;

    constructor(property?: ComponentProperty) {
        property = property || {};
        property.attribute = property.attribute || {};
        super(property.attribute);
        this.property = property;
    }

}
