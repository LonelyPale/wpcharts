export type ModelType = 'horizontal' | 'vertical';

export abstract class Model<T extends number | string | Date> {

    name: string;
    fieldName: string;
    type: ModelType;
    data: T[];

    min!: T;
    max!: T;

    domain!: T[]; //#值范围
    range!: number[]; //#坐标范围
    scale: any; //#比例尺

    ticks: number = 0;
    tickSize: number = 0;
    tickPadding: number = 0;
    tickValues!: T[]; //#刻度值范围

    protected constructor(name: string, fieldName: string, type: ModelType, data: T[] = []) {
        this.name = name;
        this.fieldName = fieldName;
        this.type = type;
        this.data = data;
    }

    public abstract init(): void;

    public abstract reverse(): void;

}
