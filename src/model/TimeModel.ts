import d3 from "d3";
import {Model, ModelType} from "./Model";
import {getDayCount} from "../util/utils";

export let parseTime = d3.timeParse("%Y-%m-%d %H:%M:%S");
export let parseTimeT = d3.timeParse("%Y-%m-%dT%H:%M:%S");
export let formatTime = d3.timeFormat("%Y-%m-%d %H:%M:%S");
export let formatTimeSimple = d3.timeFormat("%Y-%m-%d_%H-%M-%S");

export const hour = 60 * 60 * 1000; // 1小时
export const day = 24 * 60 * 60 * 1000; // 1天
export const month = 31 * day; // 1月,计算间隔是31天,实际显示是32天
export const year = 12 * month; // 1年
export const time_level1 = day; // 1天: 每格一小时
export const time_level2 = month; // 1月: 每格一天
export const time_level3 = 3 * year; // 3年: 每格一月
export const time_level4 = 8 * year; // 8年: 每格一季度
export const time_level5 = 20 * year; // 20年: 每格一年
export const time_level6 = 50 * year; // 50年: 每格两年
//const time_level6 = 60 * year; // 60年
export const time_level7 = 75 * year; // 75年: 每格三年
//const time_level7 = 100 * year; // 100年

//时间级别间隔
export function getTimeLevelInterval(level: string): number {
    switch (level) {
        case 'time_level1':
            return hour;
        case 'time_level2':
            return day;
        case 'time_level3':
            return month;
        case 'time_level4':
            return month * 3;
        case 'time_level5':
            return year;
        case 'time_level6':
            return year * 2;
        case 'time_level7':
            return year * 3;
        default:
            return 0;
    }
}

function get_time_level(time_difference: number): string {
    let time_level;
    if (time_difference <= time_level1) {
        time_level = "time_level1";
    } else if (time_difference <= time_level2) {
        time_level = "time_level2";
    } else if (time_difference <= time_level3) {
        time_level = "time_level3";
    } else if (time_difference <= time_level4) {
        time_level = "time_level4";
    } else if (time_difference <= time_level5) {
        time_level = "time_level5";
    } else if (time_difference <= time_level6) {
        time_level = "time_level6";
    } else if (time_difference <= time_level7) {
        time_level = "time_level7";
    } else {
        time_level = "time_level99";
    }
    return time_level;
}

const fun_time_level: { [key: string]: (max: Date, min: Date) => {} } = {
    "time_level1": function (max: Date, min: Date) {
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

        let time_group: { times1: number[], times2: {}[] } = {
            times1: [],
            times2: []
        };

        //只有两种情况：1、同年同月同日；2、同年同月跨日、同年跨月跨日、跨年跨月跨日(情况相同，代码可精简，不精简是为了逻辑更清晰)
        if (year_difference === 0) {//同年
            month_difference = maxMonth - minMonth;
            if (month_difference === 0) {//同月
                day_difference = maxDay - minDay;
                if (day_difference === 0) {//同日
                    hour_difference = maxHour - minHour + 1;
                    for (let i = 0; i < hour_difference; i++) {
                        time_group.times1.push(minHour + i);
                    }
                    time_group.times2.push({
                        text: minYear + "-" + minMonth + "-" + minDay,
                        len: hour_difference
                    });
                } else {//跨日
                    hour_difference = 23 - minHour + 1; //0 至 23
                    for (let i = 0; i < hour_difference; i++) {
                        time_group.times1.push(minHour + i);
                    }
                    time_group.times2.push({
                        text: minYear + "-" + minMonth + "-" + minDay,
                        len: hour_difference
                    });

                    for (let j = 0; j <= maxHour; j++) {
                        time_group.times1.push(j);
                    }
                    time_group.times2.push({
                        text: maxYear + "-" + maxMonth + "-" + maxDay,
                        len: maxHour + 1
                    });
                }
            } else {//跨月
                hour_difference = 23 - minHour + 1; //0 至 23
                for (let i = 0; i < hour_difference; i++) {
                    time_group.times1.push(minHour + i);
                }
                time_group.times2.push({
                    text: minYear + "-" + minMonth + "-" + minDay,
                    len: hour_difference
                });

                for (let j = 0; j <= maxHour; j++) {
                    time_group.times1.push(j);
                }
                time_group.times2.push({
                    text: maxYear + "-" + maxMonth + "-" + maxDay,
                    len: maxHour + 1
                });
            }
        } else if (year_difference === 1) {//跨年
            hour_difference = 23 - minHour + 1; //0 至 23
            for (let i = 0; i < hour_difference; i++) {
                time_group.times1.push(minHour + i);
            }
            time_group.times2.push({
                text: minYear + "-" + minMonth + "-" + minDay,
                len: hour_difference
            });

            for (let j = 0; j <= maxHour; j++) {
                time_group.times1.push(j);
            }
            time_group.times2.push({
                text: maxYear + "-" + maxMonth + "-" + maxDay,
                len: maxHour + 1
            });
        }

        return time_group;
    },
    "time_level2": function (max: Date, min: Date) {
        let maxYear = max.getFullYear();
        let minYear = min.getFullYear();
        let maxMonth = max.getMonth() + 1;
        let minMonth = min.getMonth() + 1;
        let maxDay = max.getDate();
        let minDay = min.getDate();

        let year_difference = maxYear - minYear;
        let month_difference;
        let day_difference;

        let time_group: { times1: number[], times2: {}[] } = {
            times1: [],
            times2: []
        };

        if (year_difference === 0) {
            month_difference = maxMonth - minMonth;
            if (month_difference === 0) {
                day_difference = maxDay - minDay + 1;
                for (let i = 0; i < day_difference; i++) {
                    time_group.times1.push(minDay + i);
                }
                time_group.times2.push({
                    text: minYear + "-" + minMonth,
                    len: day_difference
                });
            } else if (month_difference === 1) {
                day_difference = getDayCount(minYear, minMonth) - minDay + 1;
                for (let i = 0; i < day_difference; i++) {
                    time_group.times1.push(minDay + i);
                }
                time_group.times2.push({
                    text: minYear + "-" + minMonth,
                    len: day_difference
                });

                for (let j = 0; j < maxDay; j++) {
                    time_group.times1.push(1 + j);
                }
                time_group.times2.push({
                    text: maxYear + "-" + maxMonth,
                    len: maxDay
                });
            } else {
                day_difference = getDayCount(minYear, minMonth) - minDay + 1;
                for (let i = 0; i < day_difference; i++) {
                    time_group.times1.push(minDay + i);
                }
                time_group.times2.push({
                    text: minYear + "-" + minMonth,
                    len: day_difference
                });

                for (let m = 1; m < month_difference; m++) {
                    let dayCount = getDayCount(minYear, minMonth + m);
                    for (let n = 1; n <= dayCount; n++) {
                        time_group.times1.push(n);
                    }
                    time_group.times2.push({
                        text: minYear + "-" + (minMonth + m),
                        len: dayCount
                    });
                }

                for (let j = 0; j < maxDay; j++) {
                    time_group.times1.push(1 + j);
                }
                time_group.times2.push({
                    text: maxYear + "-" + maxMonth,
                    len: maxDay
                });
            }
        } else if (year_difference === 1) {
            day_difference = getDayCount(minYear, minMonth) - minDay + 1;
            for (let i = 0; i < day_difference; i++) {
                time_group.times1.push(minDay + i);
            }
            time_group.times2.push({
                text: minYear + "-" + minMonth,
                len: day_difference
            });

            for (let j = 0; j < maxDay; j++) {
                time_group.times1.push(1 + j);
            }
            time_group.times2.push({
                text: maxYear + "-" + maxMonth,
                len: maxDay
            });
        }

        return time_group;
    },
    "time_level3": function (max: Date, min: Date) {
        let maxYear = max.getFullYear();
        let minYear = min.getFullYear();
        let maxMonth = max.getMonth() + 1;
        let minMonth = min.getMonth() + 1;

        let year_difference = maxYear - minYear;
        let month_difference;

        let time_group: { times1: number[], times2: {}[] } = {
            times1: [],
            times2: []
        };

        if (year_difference === 0) {
            month_difference = maxMonth - minMonth + 1;
            for (let i = 0; i < month_difference; i++) {
                time_group.times1.push(minMonth + i);
            }
            time_group.times2.push({
                text: minYear,
                len: month_difference
            });
        } else if (year_difference === 1) {
            month_difference = 12 - minMonth + 1;
            for (let i = 0; i < month_difference; i++) {
                time_group.times1.push(minMonth + i);
            }
            time_group.times2.push({
                text: minYear,
                len: month_difference
            });

            for (let j = 0; j < maxMonth; j++) {
                time_group.times1.push(1 + j);
            }
            time_group.times2.push({
                text: maxYear,
                len: maxMonth
            });
        } else {
            month_difference = 12 - minMonth + 1;
            for (let i = 0; i < month_difference; i++) {
                time_group.times1.push(minMonth + i);
            }
            time_group.times2.push({
                text: minYear,
                len: month_difference
            });

            for (let m = 1; m < year_difference; m++) {
                for (let n = 1; n <= 12; n++) {
                    time_group.times1.push(n);
                }
                time_group.times2.push({
                    text: minYear + m,
                    len: 12
                });
            }

            for (let j = 0; j < maxMonth; j++) {
                time_group.times1.push(1 + j);
            }
            time_group.times2.push({
                text: maxYear,
                len: maxMonth
            });
        }

        return time_group;
    },
    "time_level4": function (max: Date, min: Date) {
        let maxYear = max.getFullYear();
        let minYear = min.getFullYear();
        let maxMonth = max.getMonth() + 1;
        let minMonth = min.getMonth() + 1;

        let year_difference = maxYear - minYear;

        let time_group: { times1: string[], times2: {}[] } = {
            times1: [],
            times2: []
        };

        if (minMonth === 1 || minMonth === 2 || minMonth === 3) {
            time_group.times1.push("Q1");
            time_group.times1.push("Q2");
            time_group.times1.push("Q3");
            time_group.times1.push("Q4");
            time_group.times2.push({
                text: minYear,
                len: 4
            });
        } else if (minMonth === 4 || minMonth === 5 || minMonth === 6) {
            time_group.times1.push("Q2");
            time_group.times1.push("Q3");
            time_group.times1.push("Q4");
            time_group.times2.push({
                text: minYear,
                len: 3
            });
        } else if (minMonth === 7 || minMonth === 8 || minMonth === 9) {
            time_group.times1.push("Q3");
            time_group.times1.push("Q4");
            time_group.times2.push({
                text: minYear,
                len: 2
            });
        } else if (minMonth === 10 || minMonth === 11 || minMonth === 12) {
            time_group.times1.push("Q4");
            time_group.times2.push({
                text: minYear,
                len: 1
            });
        }

        for (let m = 1; m < year_difference; m++) {
            for (let n = 1; n <= 4; n++) {
                time_group.times1.push("Q" + n);
            }
            time_group.times2.push({
                text: minYear + m,
                len: 4
            });
        }

        if (maxMonth === 1 || maxMonth === 2 || maxMonth === 3) {
            time_group.times1.push("Q1");
            time_group.times2.push({
                text: maxYear,
                len: 1
            });
        } else if (maxMonth === 4 || maxMonth === 5 || maxMonth === 6) {
            time_group.times1.push("Q1");
            time_group.times1.push("Q2");
            time_group.times2.push({
                text: maxYear,
                len: 2
            });
        } else if (maxMonth === 7 || maxMonth === 8 || maxMonth === 9) {
            time_group.times1.push("Q1");
            time_group.times1.push("Q2");
            time_group.times1.push("Q3");
            time_group.times2.push({
                text: maxYear,
                len: 3
            });
        } else if (maxMonth === 10 || maxMonth === 11 || maxMonth === 12) {
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
    "time_level5": function (max: Date, min: Date) {
        let maxYear = max.getFullYear();
        let minYear = min.getFullYear();

        let year_difference = maxYear - minYear;

        let time_group: { times1: number[], times2: {}[] } = {
            times1: [],
            times2: []
        };

        for (let m = 0; m <= year_difference; m++) {
            time_group.times1.push(minYear + m);
        }

        return time_group;
    },
    "time_level6": function (max: Date, min: Date) {
        let maxYear = max.getFullYear();
        let minYear = min.getFullYear();

        let year_difference = maxYear - minYear;

        let time_group: { times1: number[], times2: {}[] } = {
            times1: [],
            times2: []
        };

        let year_len = Math.ceil(year_difference / 2);
        for (let m = 0; m <= year_len; m++) {
            time_group.times1.push(minYear + m * 2);
        }

        return time_group;
    },
    "time_level7": function (max: Date, min: Date) {
        let maxYear = max.getFullYear();
        let minYear = min.getFullYear();

        let year_difference = maxYear - minYear;

        let time_group: { times1: number[], times2: {}[] } = {
            times1: [],
            times2: []
        };

        let year_len = Math.ceil(year_difference / 3);
        for (let m = 0; m <= year_len; m++) {
            time_group.times1.push(minYear + m * 3);
        }

        return time_group;
    },
    "time_level99": function (max: Date, min: Date) {//# todo
        let time_group: { times1: number[], times2: {}[] } = {
            times1: [],
            times2: []
        };
        return time_group;
    }
};

//美化时间轴最大、最小值
function beautifyDatetime(date: Date, type: string, time_level: string, date2: Date = new Date()): Date {
    //let date = new Date(timestamp);
    let year = date.getFullYear();
    let month = date.getMonth();
    let day = date.getDate();
    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();
    let millisecond = date.getMilliseconds();

    let year2, year_difference, year_len;

    if (type === "start") {//开始时间
        minute = 0;
        second = 0;
        millisecond = 0;
        if (time_level === "time_level1") {
        } else if (time_level === "time_level2") {
            hour = 0;
        } else if (time_level === "time_level3") {
            hour = 0;
            day = 1;
        } else if (time_level === "time_level4") {
            if (month === 0 || month === 1 || month === 2) {
                month = 0;
            } else if (month === 3 || month === 4 || month === 5) {
                month = 3;
            } else if (month === 6 || month === 7 || month === 8) {
                month = 6;
            } else if (month === 9 || month === 10 || month === 11) {
                month = 9;
            }
            hour = 0;
            day = 1;
        } else if (time_level === "time_level5") {
            hour = 0;
            day = 1;
            month = 0;
        } else if (time_level === "time_level6") {
            hour = 0;
            day = 1;
            month = 0;
        } else if (time_level === "time_level7") {
            hour = 0;
            day = 1;
            month = 0;
        } else if (time_level === "time_level99") {
            hour = 0;
            day = 1;
            month = 0;
        }
    } else if (type === "end") {//结束时间
        minute = 59;
        second = 59;
        millisecond = 999;
        if (time_level === "time_level1") {
        } else if (time_level === "time_level2") {
            hour = 23;
        } else if (time_level === "time_level3") {
            hour = 23;
            day = getDayCount(year, month + 1);
        } else if (time_level === "time_level4") {
            if (month === 0 || month === 1 || month === 2) {
                month = 2;
            } else if (month === 3 || month === 4 || month === 5) {
                month = 5;
            } else if (month === 6 || month === 7 || month === 8) {
                month = 8;
            } else if (month === 9 || month === 10 || month === 11) {
                month = 11;
            }
            hour = 23;
            day = getDayCount(year, month + 1);
        } else if (time_level === "time_level5") {
            hour = 23;
            day = 31;
            month = 11;
        } else if (time_level === "time_level6") {
            hour = 23;
            day = 31;
            month = 11;
            year2 = date2.getFullYear();
            year_difference = year - year2;
            year_len = Math.ceil(year_difference / 2);
            year = year2 + year_len * 2;
        } else if (time_level === "time_level7") {
            hour = 23;
            day = 31;
            month = 11;
            year2 = date2.getFullYear();
            year_difference = year - year2;
            year_len = Math.ceil(year_difference / 3);
            year = year2 + year_len * 3;
        } else if (time_level === "time_level99") {
            hour = 23;
            day = 31;
            month = 11;
            //todo
        }
    }

    return new Date(year, month, day, hour, minute, second, millisecond);
}

export class TimeModel extends Model<Date> {

    time_difference!: number;
    time_level!: string;
    time_group: any;

    constructor(name: string, fieldName: string, type: ModelType, data: Date[] = []) {
        super(name, fieldName, type, data);
    }

    init(): void {
        this.min = <Date>d3.min(this.data);
        this.max = <Date>d3.max(this.data);
        this.time_difference = this.max.getTime() - this.min.getTime();
        this.time_level = get_time_level(this.time_difference);
        this.time_group = fun_time_level[this.time_level](this.max, this.min);
        this.tickValues = this.time_group.times1;
        let {min, max, time_level} = this;
        this.domain = [beautifyDatetime(min, "start", time_level), beautifyDatetime(max, "end", time_level, min)];
        this.scale = d3.scaleTime().domain(this.domain).range(this.range);
    }

    reverse(): void {
    }

}
