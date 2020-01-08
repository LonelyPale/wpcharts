import {Schema} from "./Schema";
import {Row, RowData, RowIndex} from "./Row";
import {Rdb} from "./Rdb";
import {isFunction} from "../util/common";
import {formatTime, parseTime} from "../model/TimeModel";

export type ColumnIndex = { [key: string]: number };
export type ValueFn = (value: any) => boolean;

export class Table {

    private readonly db: Rdb;
    private readonly name: string;

    private readonly columnIndex: ColumnIndex = {};
    private readonly columnNames: string[] = [];
    private readonly columnTypes: string[] = [];
    private readonly columnDefaults: any[] = [];

    private rows: Row[] = [];
    private data: RowData[] = [];

    constructor(db: Rdb, schema: Schema) {
        let {name, properties} = schema;

        this.db = db;
        this.name = name;

        let keys = Object.keys(properties);
        for (let i = 0; i < keys.length; i++) {
            let key = keys[i];
            let value = properties[key];
            let type: string, defaults: any;
            if (typeof value === "string") {
                type = value;
                defaults = undefined;
            } else {
                type = value.type;
                defaults = value.default;
            }
            this.columnIndex[key] = i;
            this.columnNames.push(key);
            this.columnTypes.push(type);
            this.columnDefaults.push(defaults);
        }
    }

    $resetIndex() {
        for (let i = 0; i < this.rows.length; i++) {
            let row = this.rows[i];
            row.$setIndex(i);
        }
    }

    public getName(): string {
        return this.name;
    }

    public getData(): any[][] {
        return this.data;
    }

    public getRows(): Row[] {
        return this.rows;
    }

    public getColumnLength(): number {
        return this.columnNames.length;
    }

    getColumnIndex(): ColumnIndex;
    getColumnIndex(key: string): number;
    getColumnIndex(key?: string): number | ColumnIndex {
        if (key === undefined) {
            return this.columnIndex;
        } else {
            return this.columnIndex[key];
        }
    }

    public drop() {
        this.db.drop(this.name);
    }

    public insert(data: any): Row {
        let rowData: RowData = [];
        let index = this.data.push(rowData) - 1;
        let rowIndex: RowIndex = [index];
        let row = new Row(this, rowIndex, rowData);
        this.rows.push(row);
        row.set(data);
        return row;
    }

    public delete(): this;
    public delete(condition: number): this;
    public delete(condition: string): this;
    public delete(condition?: number | string): this {
        if (condition === undefined) {
            this.data = [];
            this.rows = [];
        } else if (typeof condition === "number") {
            delete this.data[condition];
            delete this.rows[condition];
        } else {
            //todo
        }
        this.$resetIndex();
        return this;
    }

    public update(condition: number, key: string, value: any): Row;
    public update(condition: string, key: string, value: any): Row;
    public update(condition: number | string, key: string, value: any): Row | void {
        if (typeof condition === "number") {
            let row = this.rows[condition];
            row.set(key, value);
            return row;
        } else {
            //todo
        }
    }

    /**
     * PointId='J6-1-1' and Unit='温度℃' and Value!='-99'
     * */
    public select(condition: number): Row;
    public select(condition: string): any[];
    public select(condition: number | string): Row | any[] {
        if (typeof condition === "number") {
            return this.rows[condition];
        } else {
            let array: any[] = [];
            let data = this.data;

            let relation = condition.split(' and ');
            for (let i = 0; i < relation.length; i++) {
                let rel = relation[i];
                let item = rel.split('=');
                let key = item[0];
                let value: any = item[1].split("'")[1];
                let columnIndex: number = this.columnIndex[key];

                if (key.indexOf('!') > -1) {
                    key = key.substring(0, key.length - 1);
                    columnIndex = this.columnIndex[key];
                    let type = this.columnTypes[columnIndex];
                    if (type === 'number') {
                        value = parseFloat(value);
                    } else if (type === 'Date') {
                        value = parseTime(value);
                    }
                    for (let i = 0; i < data.length; i++) {
                        let row = data[i];
                        let val = row[columnIndex];
                        if (val !== value) {
                            array.push(row)
                        }
                    }
                } else if (key.indexOf('>') > -1) {
                    key = key.substring(0, key.length - 1);
                    columnIndex = this.columnIndex[key];
                    let type = this.columnTypes[columnIndex];
                    if (type === 'number') {
                        value = parseFloat(value);
                    } else if (type === 'Date') {
                        value = parseTime(value);
                    }
                    for (let i = 0; i < data.length; i++) {
                        let row = data[i];
                        let val = row[columnIndex];
                        if (val >= value) {
                            array.push(row)
                        }
                    }
                } else if (key.indexOf('<') > -1) {
                    key = key.substring(0, key.length - 1);
                    columnIndex = this.columnIndex[key];
                    let type = this.columnTypes[columnIndex];
                    if (type === 'number') {
                        value = parseFloat(value);
                    } else if (type === 'Date') {
                        value = parseTime(value);
                    }
                    for (let i = 0; i < data.length; i++) {
                        let row = data[i];
                        let val = row[columnIndex];
                        if (val <= value) {
                            array.push(row)
                        }
                    }
                } else {
                    let type = this.columnTypes[columnIndex];
                    if (type === 'number') {
                        value = parseFloat(value);
                    } else if (type === 'Date') {
                        value = parseTime(value);
                    }
                    for (let i = 0; i < data.length; i++) {
                        let row = data[i];
                        let val = row[columnIndex];
                        if (val === value) {
                            array.push(row)
                        }
                    }
                }

                data = array;
                array = [];
            }

            return data;
        }
    }

    public columns(fields: string, data?: ValueFn): any[];
    public columns(fields: string, data: any[], callback?: ValueFn): any[];
    public columns(fields: string, data?: any[] | ValueFn, callback?: ValueFn): any[] {
        let array: any[][] = [];
        let fieldArr = fields.split(',');
        let fieldLen = fieldArr.length;

        if (data === undefined) {
            data = this.data;
        } else if (isFunction(data)) {
            callback = <ValueFn>data;
            data = this.data;
        } else {
            data = <any[]>data;
        }

        for (let i = 0; i < fieldLen; i++) {
            let field = fieldArr[i];
            let index = this.getColumnIndex(field);
            if (fieldLen > 1) {
                let fieldData: any[] = [];
                for (let j = 0; j < data.length; j++) {
                    let value = data[j][index];
                    if (callback) {
                        if (callback(value)) fieldData.push(value);
                    } else {
                        fieldData.push(value);
                    }
                }
                array.push(fieldData);
            } else {
                for (let j = 0; j < data.length; j++) {
                    let value = data[j][index];
                    if (callback) {
                        if (callback(value)) array.push(value);
                    } else {
                        array.push(value);
                    }
                }
            }
        }

        return array;
    }

    public field(name: string, data: any[]): any {
        return data[this.getColumnIndex(name)];
    }

    public copy(newTableName: string): Table {
        let properties: any = {};
        let schema: Schema = {name: newTableName, properties: properties};
        let {columnNames, columnTypes, columnDefaults} = this;

        for (let i = 0; i < columnNames.length; i++) {
            let name = columnNames[i];
            let type = columnTypes[i];
            let defaults = columnDefaults[i];
            properties[name] = {type, defaults};
        }

        let copyTable = this.db.create(schema);

        for (let i = 0; i < this.data.length; i++) {
            copyTable.insert(this.data[i]);
        }

        return copyTable;
    }

    public min(field: number | string): number {
        let min: number, columnIndex: number;
        let data = this.data;

        if (typeof field === "number") {
            columnIndex = field;
        } else {
            columnIndex = this.columnIndex[field];
        }

        min = data[0][columnIndex];
        for (let i = 1; i < data.length; i++) {
            let value = data[i][columnIndex];
            if (value < min) {
                min = value;
            }
        }

        return min;
    }

    public max(field: number | string): number {
        let max: number, columnIndex: number;
        let data = this.data;

        if (typeof field === "number") {
            columnIndex = field;
        } else {
            columnIndex = this.columnIndex[field];
        }

        max = data[0][columnIndex];
        for (let i = 1; i < data.length; i++) {
            let value = data[i][columnIndex];
            if (value > max) {
                max = value;
            }
        }

        return max;
    }

    public range(scope: { field: number | string, start: any, end: any }[]): any[] {
        let array: any[] = [];
        let data = this.data;

        for (let i = 0; i < scope.length; i++) {
            let {field, start, end} = scope[i];
            let min, max;
            if (start < end) {
                min = start;
                max = end;
            } else {
                min = end;
                max = start;
            }

            let columnIndex: number;
            if (typeof field === "number") {
                columnIndex = field;
            } else {
                columnIndex = this.columnIndex[field];
            }

            for (let i = 0; i < data.length; i++) {
                let row = data[i];
                let value = row[columnIndex];
                if (value >= min && value <= max) {
                    array.push(row)
                }
            }

            data = array;
            array = [];
        }

        return data;
    }

}
