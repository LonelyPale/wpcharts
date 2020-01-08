
let a = typeof undefined;
let b = typeof a;
let c = typeof null;

if(a === "undefined"){
    console.log(1, a);
} else if(a === "string") {
    console.log(2, a);
}

console.log(a === "undefined");
console.log(a === "string");
console.log("c:", c);

class A {
}
let aa = new A();
console.log("type->class:", typeof aa, aa instanceof A);

