const zero = 0;
if (zero) {
    console.log("zero:", true);
} else {
    console.log("zero:", false);
}

console.log(zero);
console.log(typeof zero);
console.log(zero || 666);
console.log(!zero);
console.log(!!zero);
