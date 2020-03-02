let d1 = new Date(2018, 0, 7); //新建一个时间，用于表示2018年1月7日。
let d2 = new Date(2018, 0, 8);
// @ts-ignore
let d = d2 - d1; // 86400000
console.log(d, typeof d);

let date = new Date();
let timestamp1 = date.valueOf();//获取当前毫秒的时间戳，准确！
let timestamp2 = date.getTime();//返回数值单位是毫秒；
console.log(timestamp1, timestamp2, date);
console.log(date.toString());
console.log(date.toDateString());
console.log(date.toTimeString());
console.log(date.toISOString());
console.log(date.toUTCString());

function printDate(date) {
    console.log(date.getFullYear(), date.getMonth(), date.getDate());
}

function test() {
    let year = 2020;
    for(let month = -12; month <= 11; month++) {
        let date = new Date(year, month, 1);
        printDate(date);
    }
}

function test1() {
    let d = new Date('Thu Jan 02 2014 21:06:56');
    let d1 = new Date('Wed Jan 01 2014 00:00:00');
    console.log(d);
    console.log(d1);
}
test();
