function setProtoOf(obj: any, proto: object | null): any {
    obj.__proto__ = proto;
    return obj;
}

function mixinProperties(obj: any, proto: object | null): any {
    for (let prop in proto) {
        if (!Object.prototype.hasOwnProperty.call(obj, prop)) {
            // @ts-ignore
            obj[prop] = proto[prop];
        }
    }
    return obj;
}

Object.setPrototypeOf = Object.setPrototypeOf || ({__proto__: []} instanceof Array ? setProtoOf : mixinProperties);

export default {
    setPrototypeOf: setProtoOf
}
