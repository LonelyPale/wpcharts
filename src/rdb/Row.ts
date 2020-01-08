import {Table} from "./Table";
import {isArray} from "../util/common";

export type RowIndex = number[];
export type RowData = any[];

export class Row {

    private readonly table: Table;

    private readonly index: RowIndex;
    private readonly data: RowData;

    constructor(table: Table, index: RowIndex, data: RowData) {
        this.table = table;
        this.index = index;
        this.data = data;
    }

    $setIndex(i: number) {
        this.index[0] = i;
    }

    public getIndex():number{
        return this.index[0];
    }

    public get(): any[];
    public get(key: number): any;
    public get(key: string): any
    public get(key?: number | string): any {
        if (key === undefined) {
            return this.data;
        } else if (typeof key === "number") {
            return this.data[key];
        } else {
            let i = this.table.getColumnIndex(key);
            if (i === undefined) {
                return undefined;
            } else {
                return this.data[i];
            }
        }
    }

    public set(key: any[]): this;
    public set(key: { [key: string]: any }): this;
    public set(key: number, value: any): this;
    public set(key: string, value: any): this;
    public set(key: number | string | { [key: string]: any } | any, value?: any): this {
        if (isArray(key)) {
            value = key;
            let columnLength = this.table.getColumnLength();
            for (let i = 0; i < columnLength; i++) {
                this.data[i] = value[i];
            }
        } else if (key && typeof key === "object" && typeof key !== "function") {
            value = key;
            let columnIndex = this.table.getColumnIndex();
            for (let k of Object.keys(columnIndex)) {
                let i = columnIndex[k];
                this.data[i] = value[k];
            }
        } else if (typeof key === "number") {
            this.data[key] = value;
        } else if (typeof key === "string") {
            let i = this.table.getColumnIndex(key);
            if (i === undefined) {
                console.warn.call(this, "Field does not exist");
                return this;
            } else {
                this.data[i] = value;
            }
        }
        return this;
    }

    public remove(){
        this.table.delete(this.getIndex());
    }

}
