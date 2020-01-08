
let typeList = [
    //复杂类型
    ["object", {}],
    ["array", []],
    ["function", function() {}],

    //特殊类型
    ["null", null],
    ["undefined", undefined],

    //基础类型
    ["string", ""],
    ["number", 0.123],
    ["boolean", true],

    //复合类型
    ["Date", new Date()],
];

function printTypeof(value, name) {
    let type = typeof value;
    console.log("typeof", name, ":", type);
}

function printToString(value, name) {
    let type = Object.prototype.toString.call(value);
    console.log("toString(", name, "):", type);
}

function printType() {
    for([name, value] of typeList) {
        console.log();
        printTypeof(value, name);
        printToString(value, name);
    }
}

function testType() {
    //复杂类型
    let object = {};
    let array = [];
    let function_ = function() {};

    //特殊类型
    let null_ = null;
    let undefined_ = undefined;

    //基础类型
    let string = "";
    let number = 1;
    let boolean = true;

    //复合类型
    let date = new Date();

    let object_type = typeof object;
    let array_type = typeof array;
    let function_type = typeof function_;

    let null_type = typeof null_;
    let undefined_type = typeof undefined_;

    let string_type = typeof string;
    let number_type = typeof number;
    let boolean_type = typeof boolean;

    let date_type = typeof date;

    console.log("----- ----- 复杂类型 ----- -----");
    console.log("object_type:", object_type);
    console.log("array_type:", array_type);
    console.log("function_type:", function_type);

    console.log("----- ----- 特殊类型 ----- -----");
    console.log("null_type:", null_type);
    console.log("undefined_type:", undefined_type);

    console.log("----- ----- 基础类型 ----- -----");
    console.log("string_type:", string_type);
    console.log("number_type:", number_type);
    console.log("boolean_type:", boolean_type);

    console.log("----- ----- 复合类型 ----- -----");
    console.log("date_type:", date_type);
}


let a = '1%';
let b = 2;

function printString() {
    let str_en = "123!@#qwe";
    console.log("str_en len:", str_en.length, str_en);

    let str_zh = "123!@#qwe 你好北京！";
    console.log("str_zh len:", str_zh.length, str_zh);

}

function main() {
    //printType();
    printString();

    let a = 0;
    let b = !a;
    let c = !!a;
    console.log("test:", a, b, c);

    console.log("\n\n", this);
}

main();
