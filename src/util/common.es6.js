
let objToString = Object.prototype.toString;

let baseUID = 0;

/**
 * @memberOf module:util
 * @param {*} value
 * @return {boolean}
 */
export function isObject(value) {
    // Avoid a V8 JIT bug in Chrome 19-20.
    // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
    let type = typeof value;
    return type === 'function' || (!!value && type === 'object');
}

/**
 * @memberOf module:util
 * @param {*} value
 * @return {boolean}
 */
export function isArray(value) {
    return objToString.call(value) === '[object Array]';
}

/**
 * @memberOf module:util
 * @param {*} value
 * @return {boolean}
 */
export function isFunction(value) {
    return typeof value === 'function';
}

/**
 * @memberOf module:util
 * @param {*} value
 * @return {boolean}
 */
export function isString(value) {
    return objToString.call(value) === '[object String]';
}

/**
 * @memberOf module:util
 * @param {*} value
 * @return {boolean}
 */
export function isNumber(value) {
    return objToString.call(value) === '[object Number]';
}

/**
 * @memberOf module:util
 * @param {*} value
 * @return {boolean}
 */
export function isBoolean(value) {
    return objToString.call(value) === '[object Boolean]';
}

/**
 * @memberOf module:util
 * @param {*} value
 * @return {boolean}
 */
export function isDom(value) {
    return typeof value === 'object'
        && typeof value.nodeType === 'number'
        && typeof value.ownerDocument === 'object';
}

/**
 * Whether is exactly NaN. Notice isNaN('a') returns true.
 * @param {*} value
 * @return {boolean}
 */
export function eqNaN(value) {
    return value !== value;
}

export function noop() {}

/**
 * @public
 * @param {string} type
 * @return {string}
 */
export function getUID(type) {
    return [(type || ''), baseUID++, Math.random().toFixed(5)].join('_');
}

/**
 * json clone : deep copy
 * @param {*} source
 * @return {*} new
 */
export function clone(source) {
    return JSON.parse(JSON.stringify(source));
}

/**
 * 合并
 * @memberOf module:util
 * @param {*} target
 * @param {*} source
 * @param {boolean} [overwrite=false]
 */
export function merge(target, source, overwrite) {
    if(overwrite) source = clone(source);
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
export function extend(target, source, overwrite) {
    if(overwrite) source = clone(source);
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

