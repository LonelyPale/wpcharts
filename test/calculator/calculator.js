function fuli(num, year) {
    let count = 0;
    let m = 0.1;
    for (let i = 1; i <= year; i++) {
        count = count + num + (count + num) * m;
    }
    return count;
}

let num = 120000;
let year = 50;
let count = fuli(num, year);
let cb = num * year;
let lr = count - cb;
console.log('num:', num);
console.log('year:', year);
console.log('收入:', count);
console.log('成本:', cb);
console.log('利润:', lr);
