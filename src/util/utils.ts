//浅合并 object
export function extend(target: any, source: any) {
    for (let key in source) {
        target[key] = target[key] && target[key].toString() === "[object Object]" ? extend(target[key], source[key]) : target[key] = source[key];
    }
    return target;
}

//计算是否是闰年
export function isLeapYear(year: number) {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 100 === 0 && year % 400 === 0);
}

//得到一个月的总天数
//初始化d为月份的第0天，由于JavaScript中day的范围为1~31中的值，所以当设为0时，会向前一天，也即表示上个月的最后一天。自动处理闰年。特殊情况:此处传入的月份应为 1 - 12 (其他时候正常情况应为: 0 - 11)
export function getDayCount(year: number, month: number) {
    let d = new Date(year, month, 0);
    return d.getDate();
}

export let fun_scale_new = function (min: number, max: number, n: number) {
    let tickNumber = n || 7;
    let step = (max - min) / tickNumber;
    let stepStr = step.toString();

    let integerDigit: number = 0; //整数位数
    let decimalDigit: number = 0; //小数位数
    let integerStr: string = ''; //整数部分
    let decimalStr: string = ''; //小数部分

    let i = stepStr.indexOf('.');
    if (i > -1) {

    } else {
        integerDigit = stepStr.length;
        integerStr = stepStr;
    }


    return 0;
};

export let fun_scale = (min: number, max: number, n: number) => {
    //let tickNumber = 7;
    let tickNumber = n || 7;
    let step = (max - min) / tickNumber;
    //step = parseFloat(step.toFixed(2));//#误差太大
    let ticks = [];
    ticks.push(min);
    for (let i = 1, num = min; i < tickNumber; i++) {
        num += step;
        ticks.push(num);
    }
    ticks.push(max);
    return ticks;
};

//Return an object as an `x-www-form-urlencoded` string
// @ts-ignore
export let formurlencoded = function (data: any) {
    let _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj: any) {
        return typeof obj;
    } : function (obj: any) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };

    let opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    let sorted = Boolean(opts.sorted),
        skipIndex = Boolean(opts.skipIndex),
        ignorenull = Boolean(opts.ignorenull),
        encode = function encode(value: any) {
            return String(value).replace(/(?:[\0-\x1F"-&\+-\}\x7F-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])/g, encodeURIComponent).replace(/ /g, '+').replace(/[!'()~\*]/g, function (ch: any) {
                return '%' + ch.charCodeAt().toString(16).slice(-2).toUpperCase();
            });
        },
        keys = function keys(obj: any) {
            let keyarr = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Object.keys(obj);
            return sorted ? keyarr.sort() : keyarr;
        },
        filterjoin = function filterjoin(arr: any) {
            return arr.filter(function (e: any) {
                return e;
            }).join('&');
        },
        objnest = function objnest(name: any, obj: any) {
            return filterjoin(keys(obj).map(function (key: any) {
                return nest(name + '[' + key + ']', obj[key]);
            }));
        },
        arrnest = function arrnest(name: any, arr: any) {
            return arr.length ? filterjoin(arr.map(function (elem: any, index: any) {
                return skipIndex ? nest(name + '[]', elem) : nest(name + '[' + index + ']', elem);
            })) : encode(name + '[]');
        },
        nest = function nest(name: any, value: any) {
            let type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : typeof value === 'undefined' ? 'undefined' : _typeof(value);
            let f = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

            if (value === f) f = ignorenull ? f : encode(name) + '=' + f; else if (/string|number|boolean/.test(type)) f = encode(name) + '=' + encode(value); else if (Array.isArray(value)) f = arrnest(name, value); else if (type === 'object') f = objnest(name, value);

            return f;
        };

    return data && filterjoin(keys(data).map(function (key: any) {
        return nest(key, data[key]);
    }));
};




