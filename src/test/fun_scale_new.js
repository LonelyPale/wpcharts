let fun_scale_new = function (min, max, n) {
    let tickNumber = n || 7;
    let step = (max - min) / tickNumber;
    let stepStr = step.toString();

    let integerDigit = 0; //整数位数
    let decimalDigit = 0; //小数位数
    //let integerStr = ''; //整数部分
    //let decimalStr = ''; //小数部分
    let integerArr = []; //整数部分 number[]
    let decimalArr = []; //小数部分 number[]

    let decimalPointIndex = stepStr.indexOf('.');
    if (decimalPointIndex > -1) {
        let stepArr = stepStr.split('.');
        for (let i = 0; i < stepArr[0].length; i++) {
            integerArr.push(parseInt(stepArr[0][i]));
        }
        for (let i = 0; i < stepArr[1].length; i++) {
            decimalArr.push(parseInt(stepArr[1][i]));
        }
        integerDigit = integerArr.length;
        decimalDigit = decimalArr.length;
    } else {
        let stepArr = stepStr.split('');
        for (let i = 0; i < stepArr.length; i++) {
            integerArr.push(parseInt(stepArr[i]));
        }
        integerDigit = integerArr.length;
    }

    if (integerArr.length >= 3) {

    } else if (integerArr.length === 2) {
        addFigures(integerArr);

    } else if (integerArr.length === 1) {

    }

    console.log(stepStr, decimalPointIndex);
    console.log('integer', integerArr, integerDigit);
    console.log('decimal:', decimalArr, decimalDigit);

    return 0;
};

function addFigures(integerArr, decimalArr) {
    let num = integerArr[1];
    if (num === 9) {
        if (integerArr[0] === 9) {
            integerArr.unshift(1);
            integerArr[0] = 0;
            integerArr[1] = 0;
        } else {
            integerArr[0] = integerArr[0] + 1;
            integerArr[1] = 0;
        }
    } else if (num === 8) {
        if (numArr[2] > 0) {
            if (numArr[0] === 9) {
                numArr.unshift(1);
                numArr[0] = 0;
                numArr[1] = 0;
            } else {
                numArr[0] = numArr[0] + 1;
                numArr[1] = 0;
            }
        }
    } else if (num === 7) {
        numArr[1] = 8;
    } else if (num === 6) {
        if (numArr[2] > 0) {
            numArr[1] = 8;
        }
    } else if (num === 5) {
        if (numArr[2] > 0) {
            numArr[1] = 6;
        }
    } else if (num === 4) {
        if (numArr[2] > 0) {
            numArr[1] = 5;
        }
    } else if (num === 3) {
        numArr[1] = 4;
    } else if (num === 2) {
        if (numArr[2] > 0) {
            numArr[1] = 4;
        }
    } else if (num === 1) {
        numArr[1] = 2;
    } else if (num === 0) {
        if (numArr[2] > 0) {
            numArr[1] = 2;
        }
    }
}

let a = fun_scale_new(10, 100, 7);
console.log(a);


// 123.456
