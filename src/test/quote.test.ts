let a = {n: 1};
let b = {n: 2};
let c = {n: 3};
let d = {n: 4};
let e = {n: 5};
let object = {a: a, b: b, c: c, d: d, e: e};

console.log(1, a, b, c, d, e);
console.log(2, object);
console.log("===== ===== ===== ===== ===== ===== ===== ===== ===== =====");

let obj = object;
delete object.a;
delete object.b;
delete object.c;

console.log(11, a, b, c, d, e);
console.log(22, object);
console.log(33, obj);
console.log("===== ===== ===== ===== ===== ===== ===== ===== ===== =====");

