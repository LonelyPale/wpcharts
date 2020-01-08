let objToString = Object.prototype.toString;

let baseUID = 0;

/**
 * @memberOf module:util
 * @param {*} value
 * @return {boolean}
 */
export function isObject(value: any) {
    // Avoid a V8 JIT bug in Chrome 19-20.
    // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
    let type: string = typeof value;
    return type === 'function' || (!!value && type === 'object');
}

/**
 * @memberOf module:util
 * @param {*} value
 * @return {boolean}
 */
export function isArray(value: any) {
    return objToString.call(value) === '[object Array]';
}

/**
 * @memberOf module:util
 * @param {*} value
 * @return {boolean}
 */
export function isFunction(value: any) {
    return typeof value === 'function';
}

/**
 * @memberOf module:util
 * @param {*} value
 * @return {boolean}
 */
export function isString(value: any) {
    return objToString.call(value) === '[object String]';
}

/**
 * @memberOf module:util
 * @param {*} value
 * @return {boolean}
 */
export function isNumber(value: any) {
    return objToString.call(value) === '[object Number]';
}

/**
 * @memberOf module:util
 * @param {*} value
 * @return {boolean}
 */
export function isBoolean(value: any) {
    return objToString.call(value) === '[object Boolean]';
}

/**
 * @memberOf module:util
 * @param {*} value
 * @return {boolean}
 */
export function isDom(value: any) {
    return typeof value === 'object'
        && typeof value.nodeType === 'number'
        && typeof value.ownerDocument === 'object';
}

/**
 * Whether is exactly NaN. Notice isNaN('a') returns true.
 * @param {*} value
 * @return {boolean}
 */
export function eqNaN(value: any) {
    return value !== value;
}

export function noop() {
}

/**
 * @public
 * @param {string} type
 * @return {string}
 */
export function getUID(type: string) {
    return [(type || ''), baseUID++, Math.random().toFixed(5)].join('_');
}

/**
 * 克隆
 * json clone : deep copy
 * @param {*} source
 * @return {*} new
 */
export function clone(source: any) {
    return JSON.parse(JSON.stringify(source));
}

/**
 * 合并
 * @memberOf module:util
 * @param {*} target
 * @param {*} source
 * @param {boolean} [overwrite=false]
 */
export function merge(target: any, source: any, overwrite: boolean = false) {
    if (overwrite) source = clone(source);
    for (let key in source) {
        if (source.hasOwnProperty(key)) {
            target[key] = target[key] && target[key].toString() === "[object Object]" ?
                merge(target[key], source[key]) : target[key] = source[key];
        }
    }
}

/**
 * 扩展
 * shallow copy
 * @memberOf module:util
 * @param {*} target
 * @param {*} source
 * @param {boolean} [overwrite=false]
 */
export function extend(target: any, source: any, overwrite: boolean = false) {
    if (overwrite) source = clone(source);
    for (let key in source) {
        if (source.hasOwnProperty(key)) {
            target[key] = target[key] && target[key].toString() === "[object Object]" ?
                extend(target[key], source[key]) : target[key] = source[key];
        }
    }
    return target;

    /*
    //#只拷贝第一层属性
    for (let key in source) {
        if (source.hasOwnProperty(key)) {
            target[key] = source[key];
        }
    }
    return target;
    */

}

export function uuid(len: number = 0, radix: number = 0): string {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    let uuid = [], i;
    radix = radix || chars.length;

    if (len) {
        // Compact form
        for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
    } else {
        // rfc4122, version 4 form
        let r;

        // rfc4122 requires these characters
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
        uuid[14] = '4';

        // Fill in random data.  At i==19 set the high bits of clock sequence as
        // per rfc4122, sec. 4.1.5
        for (i = 0; i < 36; i++) {
            if (!uuid[i]) {
                r = 0 | Math.random() * 16;
                uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
            }
        }
    }

    return uuid.join('');
}

export function guid(): string {
    //return uuid();
    //return uuid(10, 10);
    return uuid(10);
}
