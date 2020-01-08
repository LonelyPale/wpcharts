
//浅合并 object
export function extend(target, source) {
    for (let key in source) {
        target[key] = target[key] && target[key].toString() === "[object Object]" ? extend(target[key], source[key]) : target[key] = source[key];
    }
    return target;
}

//计算是否是闰年
export function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 100 === 0 && year % 400 === 0);
}

//得到一个月的总天数
//初始化d为月份的第0天，由于JavaScript中day的范围为1~31中的值，所以当设为0时，会向前一天，也即表示上个月的最后一天。自动处理闰年。特殊情况:此处传入的月份应为 1 - 12 (其他时候正常情况应为: 0 - 11)
export function getDayCount(year, month) {
    let d = new Date(year, month, 0);
    return d.getDate();
}

//美化时间轴最大、最小值
export function beautifyDatetime(date, type, time_level, date2) {
    //let date = new Date(timestamp);
    let year = date.getFullYear();
    let month = date.getMonth();
    let day = date.getDate();
    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();
    let millisecond = date.getMilliseconds();

    let year2, year_difference, year_len;

    if(type === "start") {//开始时间
        minute = 0;
        second = 0;
        millisecond = 0;
        if(time_level === "time_level1") {
        } else if(time_level === "time_level2") {
            hour = 0;
        } else if(time_level === "time_level3") {
            hour = 0;
            day = 1;
        } else if(time_level === "time_level4") {
            if(month === 0 || month === 1 || month === 2) {
                month = 0;
            } else if(month === 3 || month === 4 || month === 5) {
                month = 3;
            } else if(month === 6 || month === 7 || month === 8) {
                month = 6;
            } else if(month === 9 || month === 10 || month === 11) {
                month = 9;
            }
            hour = 0;
            day = 1;
        } else if(time_level === "time_level5") {
            hour = 0;
            day = 1;
            month = 0;
        } else if(time_level === "time_level6") {
            hour = 0;
            day = 1;
            month = 0;
        } else if(time_level === "time_level7") {
            hour = 0;
            day = 1;
            month = 0;
        } else if(time_level === "time_level99") {
            hour = 0;
            day = 1;
            month = 0;
        }
    } else if(type === "end") {//结束时间
        minute = 59;
        second = 59;
        millisecond = 999;
        if(time_level === "time_level1") {
        } else if(time_level === "time_level2") {
            hour = 23;
        } else if(time_level === "time_level3") {
            hour = 23;
            day = getDayCount(year, month + 1);
        } else if(time_level === "time_level4") {
            if(month === 0 || month === 1 || month === 2) {
                month = 2;
            } else if(month === 3 || month === 4 || month === 5) {
                month = 5;
            } else if(month === 6 || month === 7 || month === 8) {
                month = 8;
            } else if(month === 9 || month === 10 || month === 11) {
                month = 11;
            }
            hour = 23;
            day = getDayCount(year, month + 1);
        } else if(time_level === "time_level5") {
            hour = 23;
            day = 31;
            month = 11;
        } else if(time_level === "time_level6") {
            hour = 23;
            day = 31;
            month = 11;
            year2 = date2.getFullYear();
            year_difference = year - year2;
            year_len = Math.ceil(year_difference / 2);
            year = year2 + year_len * 2;
        } else if(time_level === "time_level7") {
            hour = 23;
            day = 31;
            month = 11;
            year2 = date2.getFullYear();
            year_difference = year - year2;
            year_len = Math.ceil(year_difference / 3);
            year = year2 + year_len * 3;
        } else if(time_level === "time_level99") {
            hour = 23;
            day = 31;
            month = 11;
            //todo
        }
    }

    return new Date(year, month, day, hour, minute, second, millisecond);
}

export let fun_time_level = {
    "time_level1": function (max, min) {
        let maxYear = max.getFullYear();
        let minYear = min.getFullYear();
        let maxMonth = max.getMonth() + 1;
        let minMonth = min.getMonth() + 1;
        let maxDay = max.getDate();
        let minDay = min.getDate();
        let maxHour = max.getHours();
        let minHour = min.getHours();

        let year_difference = maxYear - minYear;
        let month_difference;
        let day_difference;
        let hour_difference;

        let time_group = {
            times1: [],
            times2: []
        };

        //只有两种情况：1、同年同月同日；2、同年同月跨日、同年跨月跨日、跨年跨月跨日(情况相同，代码可精简，不精简是为了逻辑更清晰)
        if(year_difference === 0) {//同年
            month_difference = maxMonth - minMonth;
            if(month_difference === 0) {//同月
                day_difference = maxDay - minDay;
                if(day_difference === 0) {//同日
                    hour_difference = maxHour - minHour + 1;
                    for(let i = 0; i < hour_difference; i++) {
                        time_group.times1.push(minHour + i);
                    }
                    time_group.times2.push({
                        text: minYear + "-" + minMonth + "-" + minDay,
                        len: hour_difference
                    });
                } else {//跨日
                    hour_difference = 23 - minHour + 1; //0 至 23
                    for(let i = 0; i < hour_difference; i++) {
                        time_group.times1.push(minHour + i);
                    }
                    time_group.times2.push({
                        text: minYear + "-" + minMonth + "-" + minDay,
                        len: hour_difference
                    });

                    for(let j = 0; j <= maxHour; j++) {
                        time_group.times1.push(j);
                    }
                    time_group.times2.push({
                        text: maxYear + "-" + maxMonth + "-" + maxDay,
                        len: maxHour + 1
                    });
                }
            } else {//跨月
                hour_difference = 23 - minHour + 1; //0 至 23
                for(let i = 0; i < hour_difference; i++) {
                    time_group.times1.push(minHour + i);
                }
                time_group.times2.push({
                    text: minYear + "-" + minMonth + "-" + minDay,
                    len: hour_difference
                });

                for(let j = 0; j <= maxHour; j++) {
                    time_group.times1.push(j);
                }
                time_group.times2.push({
                    text: maxYear + "-" + maxMonth + "-" + maxDay,
                    len: maxHour + 1
                });
            }
        } else if(year_difference === 1) {//跨年
            hour_difference = 23 - minHour + 1; //0 至 23
            for(let i = 0; i < hour_difference; i++) {
                time_group.times1.push(minHour + i);
            }
            time_group.times2.push({
                text: minYear + "-" + minMonth + "-" + minDay,
                len: hour_difference
            });

            for(let j = 0; j <= maxHour; j++) {
                time_group.times1.push(j);
            }
            time_group.times2.push({
                text: maxYear + "-" + maxMonth + "-" + maxDay,
                len: maxHour + 1
            });
        }

        return time_group;
    },
    "time_level2": function (max, min) {
        let maxYear = max.getFullYear();
        let minYear = min.getFullYear();
        let maxMonth = max.getMonth() + 1;
        let minMonth = min.getMonth() + 1;
        let maxDay = max.getDate();
        let minDay = min.getDate();

        let year_difference = maxYear - minYear;
        let month_difference;
        let day_difference;

        let time_group = {
            times1: [],
            times2: []
        };

        if(year_difference === 0) {
            month_difference = maxMonth - minMonth;
            if(month_difference === 0) {
                day_difference = maxDay - minDay + 1;
                for(let i = 0; i < day_difference; i++) {
                    time_group.times1.push(minDay + i);
                }
                time_group.times2.push({
                    text: minYear + "-" + minMonth,
                    len: day_difference
                });
            } else if(month_difference === 1) {
                day_difference = getDayCount(minYear, minMonth) - minDay + 1;
                for(let i = 0; i < day_difference; i++) {
                    time_group.times1.push(minDay + i);
                }
                time_group.times2.push({
                    text: minYear + "-" + minMonth,
                    len: day_difference
                });

                for(let j = 0; j < maxDay; j++) {
                    time_group.times1.push(1 + j);
                }
                time_group.times2.push({
                    text: maxYear + "-" + maxMonth,
                    len: maxDay
                });
            } else {
                day_difference = getDayCount(minYear, minMonth) - minDay + 1;
                for(let i = 0; i < day_difference; i++) {
                    time_group.times1.push(minDay + i);
                }
                time_group.times2.push({
                    text: minYear + "-" + minMonth,
                    len: day_difference
                });

                for(let m = 1; m < month_difference; m++) {
                    let dayCount = getDayCount(minYear, minMonth + m);
                    for(let n = 1; n <= dayCount; n++) {
                        time_group.times1.push(n);
                    }
                    time_group.times2.push({
                        text: minYear + "-" + (minMonth + m),
                        len: dayCount
                    });
                }

                for(let j = 0; j < maxDay; j++) {
                    time_group.times1.push(1 + j);
                }
                time_group.times2.push({
                    text: maxYear + "-" + maxMonth,
                    len: maxDay
                });
            }
        } else if(year_difference === 1) {
            day_difference = getDayCount(minYear, minMonth) - minDay + 1;
            for(let i = 0; i < day_difference; i++) {
                time_group.times1.push(minDay + i);
            }
            time_group.times2.push({
                text: minYear + "-" + minMonth,
                len: day_difference
            });

            for(let j = 0; j < maxDay; j++) {
                time_group.times1.push(1 + j);
            }
            time_group.times2.push({
                text: maxYear + "-" + maxMonth,
                len: maxDay
            });
        }

        return time_group;
    },
    "time_level3": function (max, min) {
        let maxYear = max.getFullYear();
        let minYear = min.getFullYear();
        let maxMonth = max.getMonth() + 1;
        let minMonth = min.getMonth() + 1;

        let year_difference = maxYear - minYear;
        let month_difference;

        let time_group = {
            times1: [],
            times2: []
        };

        if(year_difference === 0) {
            month_difference = maxMonth - minMonth + 1;
            for(let i = 0; i < month_difference; i++) {
                time_group.times1.push(minMonth + i);
            }
            time_group.times2.push({
                text: minYear,
                len: month_difference
            });
        } else if(year_difference === 1) {
            month_difference = 12 - minMonth + 1;
            for(let i = 0; i < month_difference; i++) {
                time_group.times1.push(minMonth + i);
            }
            time_group.times2.push({
                text: minYear,
                len: month_difference
            });

            for(let j = 0; j < maxMonth; j++) {
                time_group.times1.push(1 + j);
            }
            time_group.times2.push({
                text: maxYear,
                len: maxMonth
            });
        } else {
            month_difference = 12 - minMonth + 1;
            for(let i = 0; i < month_difference; i++) {
                time_group.times1.push(minMonth + i);
            }
            time_group.times2.push({
                text: minYear,
                len: month_difference
            });

            for(let m = 1; m < year_difference; m++) {
                for(let n = 1; n <= 12; n++) {
                    time_group.times1.push(n);
                }
                time_group.times2.push({
                    text: minYear + m,
                    len: 12
                });
            }

            for(let j = 0; j < maxMonth; j++) {
                time_group.times1.push(1 + j);
            }
            time_group.times2.push({
                text: maxYear,
                len: maxMonth
            });
        }

        return time_group;
    },
    "time_level4": function (max, min) {
        let maxYear = max.getFullYear();
        let minYear = min.getFullYear();
        let maxMonth = max.getMonth() + 1;
        let minMonth = min.getMonth() + 1;

        let year_difference = maxYear - minYear;

        let time_group = {
            times1: [],
            times2: []
        };

        if(minMonth === 1 || minMonth === 2 || minMonth === 3) {
            time_group.times1.push("Q1");
            time_group.times1.push("Q2");
            time_group.times1.push("Q3");
            time_group.times1.push("Q4");
            time_group.times2.push({
                text: minYear,
                len: 4
            });
        } else if(minMonth === 4 || minMonth === 5 || minMonth === 6) {
            time_group.times1.push("Q2");
            time_group.times1.push("Q3");
            time_group.times1.push("Q4");
            time_group.times2.push({
                text: minYear,
                len: 3
            });
        } else if(minMonth === 7 || minMonth === 8 || minMonth === 9) {
            time_group.times1.push("Q3");
            time_group.times1.push("Q4");
            time_group.times2.push({
                text: minYear,
                len: 2
            });
        } else if(minMonth === 10 || minMonth === 11 || minMonth === 12) {
            time_group.times1.push("Q4");
            time_group.times2.push({
                text: minYear,
                len: 1
            });
        }

        for(let m = 1; m < year_difference; m++) {
            for(let n = 1; n <= 4; n++) {
                time_group.times1.push("Q" + n);
            }
            time_group.times2.push({
                text: minYear + m,
                len: 4
            });
        }

        if(maxMonth === 1 || maxMonth === 2 || maxMonth === 3) {
            time_group.times1.push("Q1");
            time_group.times2.push({
                text: maxYear,
                len: 1
            });
        } else if(maxMonth === 4 || maxMonth === 5 || maxMonth === 6) {
            time_group.times1.push("Q1");
            time_group.times1.push("Q2");
            time_group.times2.push({
                text: maxYear,
                len: 2
            });
        } else if(maxMonth === 7 || maxMonth === 8 || maxMonth === 9) {
            time_group.times1.push("Q1");
            time_group.times1.push("Q2");
            time_group.times1.push("Q3");
            time_group.times2.push({
                text: maxYear,
                len: 3
            });
        } else if(maxMonth === 10 || maxMonth === 11 || maxMonth === 12) {
            time_group.times1.push("Q1");
            time_group.times1.push("Q2");
            time_group.times1.push("Q3");
            time_group.times1.push("Q4");
            time_group.times2.push({
                text: maxYear,
                len: 4
            });
        }

        return time_group;
    },
    "time_level5": function (max, min) {
        let maxYear = max.getFullYear();
        let minYear = min.getFullYear();

        let year_difference = maxYear - minYear;

        let time_group = {
            times1: [],
            times2: []
        };

        for(let m = 0; m <= year_difference; m++) {
            time_group.times1.push(minYear + m);
        }

        return time_group;
    },
    "time_level6": function (max, min) {
        let maxYear = max.getFullYear();
        let minYear = min.getFullYear();

        let year_difference = maxYear - minYear;

        let time_group = {
            times1: [],
            times2: []
        };

        let year_len = Math.ceil(year_difference / 2);
        for(let m = 0; m <= year_len; m++) {
            time_group.times1.push(minYear + m * 2);
        }

        return time_group;
    },
    "time_level7": function (max, min) {
        let maxYear = max.getFullYear();
        let minYear = min.getFullYear();

        let year_difference = maxYear - minYear;

        let time_group = {
            times1: [],
            times2: []
        };

        let year_len = Math.ceil(year_difference / 3);
        for(let m = 0; m <= year_len; m++) {
            time_group.times1.push(minYear + m * 3);
        }

        return time_group;
    },
    "time_level99": function (max, min) {
        //todo
    }
};

export let fun_scale_new = function(min, max, n) {
    //let tickNumber = 7;
    let tickNumber = n || 7;
    let step = (max - min) / tickNumber;
    step = parseFloat(step.toFixed(2));
    let step2 = step / 2;
    let ticks = [];
    let start = min + step2;//# todo

    for(let i = 0, num = start; i <= tickNumber; i++) {
        num += step;
        ticks.push(num);
    }

    return ticks;
};

export let fun_scale = (min, max, n) => {
    //let tickNumber = 7;
    let tickNumber = n || 7;
    let step = (max - min) / tickNumber;
    step = parseFloat(step.toFixed(2));
    let ticks = [];
    ticks.push(min);
    for(let i = 1, num = min; i < tickNumber; i++) {
        num += step;
        ticks.push(num);
    }
    ticks.push(max);
    return ticks;
};

//Return an object as an `x-www-form-urlencoded` string
export let formurlencoded = function (data) {
    let _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

    let opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    let sorted = Boolean(opts.sorted),
        skipIndex = Boolean(opts.skipIndex),
        ignorenull = Boolean(opts.ignorenull),
        encode = function encode(value) {
            return String(value).replace(/(?:[\0-\x1F"-&\+-\}\x7F-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])/g, encodeURIComponent).replace(/ /g, '+').replace(/[!'()~\*]/g, function (ch) {
                return '%' + ch.charCodeAt().toString(16).slice(-2).toUpperCase();
            });
        },
        keys = function keys(obj) {
            let keyarr = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Object.keys(obj);
            return sorted ? keyarr.sort() : keyarr;
        },
        filterjoin = function filterjoin(arr) {
            return arr.filter(function (e) {
                return e;
            }).join('&');
        },
        objnest = function objnest(name, obj) {
            return filterjoin(keys(obj).map(function (key) {
                return nest(name + '[' + key + ']', obj[key]);
            }));
        },
        arrnest = function arrnest(name, arr) {
            return arr.length ? filterjoin(arr.map(function (elem, index) {
                return skipIndex ? nest(name + '[]', elem) : nest(name + '[' + index + ']', elem);
            })) : encode(name + '[]');
        },
        nest = function nest(name, value) {
            let type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : typeof value === 'undefined' ? 'undefined' : _typeof(value);
            let f = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

            if (value === f) f = ignorenull ? f : encode(name) + '=' + f;else if (/string|number|boolean/.test(type)) f = encode(name) + '=' + encode(value);else if (Array.isArray(value)) f = arrnest(name, value);else if (type === 'object') f = objnest(name, value);

            return f;
        };

    return data && filterjoin(keys(data).map(function (key) {
        return nest(key, data[key]);
    }));
};




