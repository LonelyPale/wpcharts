import {Schema} from "./Schema";
import {Table} from "./Table";

export class Rdb {

    private readonly name: string;
    private readonly tables: { [key: string]: Table } = {};

    constructor(name: string) {
        this.name = name;
    }

    public getName(): string {
        return this.name;
    }

    public create(schema: Schema): Table {
        let table = new Table(this, schema);
        this.tables[schema.name] = table;//todo:同名会覆盖
        return table;
    }

    public drop(name: string) {
        delete this.tables[name];
    }

    public table(name: string): Table {
        return this.tables[name];
    }

}
