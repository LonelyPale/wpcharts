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
