let obj = {
    a: 1,
    b: 2,
    c: 3,
    d: undefined,
    e: null,
};

console.log(obj);
console.log(delete obj.d, delete obj.d);
console.log();
console.log(delete obj.e, delete obj.e);
console.log();
// @ts-ignore
console.log(delete obj.f);
console.log(obj);

