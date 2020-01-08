import {Component, ComponentProperty} from "../Component";
import {Model} from "../../model/Model";

export interface AxisProperty extends ComponentProperty {
    model: Model<number | string | Date>;
    type?: 'axisTop' | 'axisBottom' | 'axisLeft' | 'axisRight';
}

export abstract class Axis extends Component {

    public static readonly ClassName: string = 'axis';

    model: Model<number | string | Date>;
    type?: 'axisTop' | 'axisBottom' | 'axisLeft' | 'axisRight';

    protected constructor(property: AxisProperty) {
        super(property);
        this.model = property.model;
        this.type = property.type;
    }

}
