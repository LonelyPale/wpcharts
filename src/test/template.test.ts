
function test1() {
    const tag = function (strings: string, aPLUSb: number, aSTARb: number) {
        // strings is: ['a+b equals', 'and a*b equals']
        // aPLUSb is: 30
        // aSTARb is: 200
        aPLUSb = 666;
        aSTARb = 999;
        return `a+b equals ${aPLUSb} and a*b equals ${aSTARb}`;
    };
    const a = 20;
    const b = 10;
    // @ts-ignore
    let str = tag `a+b equals ${a + b} and a*b equals ${a * b}`;
    console.log(str);
    //output “a+b equals 200 and a*b equals 30”
}

function test2() {
    let a = 12;
    let b = 20;
    function fn (strArr: string, ...rest: any) {
        console.log(strArr, rest);
    }

    // @ts-ignore
    fn `the sum of ${a} and ${b} is ${a + b}`;
}

function test3() {
    function concat (arrStr:string, ...rest:any) {
        let str = arrStr[0];
        rest.forEach((value:any, index:any) => {
            // 在此处可以对字符串做出处理，返回需要的字符串格式
            str += value + arrStr[index + 1];
        });
        console.log(str);
    }

    // 使用上述函数能够将模板字符串完整地显示出来（虽然好像没有什么太大用处）
    let a = 10;
    let b = 20;
    // @ts-ignore
    concat `the sum of ${a} and ${b} is ${a + b}`; // log 'the sum of 10 and 20 is 30'
}

test1();
test2();
test3();
