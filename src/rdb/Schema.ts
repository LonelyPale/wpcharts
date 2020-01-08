export type Schema = {
    name: string;
    properties: { [key: string]: string | { type: string, default: any } };
}
