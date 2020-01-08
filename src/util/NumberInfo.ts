import {clone} from "./common";

export class NumberInfo {

    num: number;
    numStr: string;
    numArr: number[] = [];

    decimalPointIndex: number;//小数点位置索引
    isMinus: boolean;//是否负数

    integerDigit: number = 0;//整数位数
    decimalDigit: number = 0;//小数位数

    integerArr: number[] = [];//整数部分
    decimalArr: number[] = [];//小数部分

    constructor(num: number) {
        this.num = num;
        this.numStr = num.toString();
        this.decimalPointIndex = this.numStr.indexOf('.');
        this.isMinus = num < 0;

        let start = 0;
        if (this.isMinus) start = 1;
        let array = this.numStr.split('.');
        for (let i = start; i < array[0].length; i++) {
            this.integerArr.push(parseInt(array[0][i]));
        }
        if (this.decimalPointIndex > -1) {
            for (let i = 0; i < array[1].length; i++) {
                this.decimalArr.push(parseInt(array[1][i]));
            }
        }

        this.integerDigit = this.integerArr.length;
        this.decimalDigit = this.decimalArr.length;
        this.numArr = [...this.integerArr, ...this.decimalArr];
    }

    nice(): number {
        let numArrNew = clone(this.numArr);
        let numNew = this.beautiful(numArrNew);
        return numNew;
    }

    beautiful(numArr: number[]): number {
        let supply: number;
        let typePlusReduce: 'plus' | 'reduce';
        let type: 'integer' | 'decimal' | 'integerANDdecimal';

        let numNew = 0;
        let isCarry = false;
        let ordinal: number;
        if (this.integerDigit >= 2) {//12.12345
            isCarry = this.addFigures(numArr);
            if (isCarry) {
                ordinal = this.integerDigit + 1;
                numNew = 10 ** (ordinal - 1) * numArr[0] + 10 ** (ordinal - 2) * numArr[1] + 10 ** (ordinal - 3) * numArr[2];
            } else {
                ordinal = this.integerDigit;
                numNew = 10 ** (ordinal - 1) * numArr[0] + 10 ** (ordinal - 2) * numArr[1];
            }
        } else if (this.integerArr[0] > 0) {//1.12345
            isCarry = this.addFigures(numArr);
            if (isCarry) {
                numNew = 10 * numArr[0] + numArr[1] + 0.1 * numArr[2];
            } else {
                numNew = numArr[0] + 0.1 * numArr[1];
            }
        } else {//0.12345
            numArr.shift();
            let numZero = [];
            let numNum: number[] = [];
            for (let i = 0; i < numArr.length; i++) {
                if (numArr[i] === 0) {
                    numZero.push(0);
                } else {
                    numNum = [numArr[i], numArr[i + 1]];
                    break;
                }
            }
            isCarry = this.addFigures(numNum);
            if (numZero.length === 0) {
                if (isCarry) {
                    numNew = numNum[0] + 10 ** (-1) * numNum[1] + 10 ** (-2) * numNum[2];
                } else {
                    numNew = 10 ** (-1) * numNum[0] + 10 ** (-2) * numNum[1];
                }
            } else {
                if (isCarry) {
                    numNew = 10 ** (-numZero.length) * numNum[0] + 10 ** (-numZero.length - 1) * numNum[1] + 10 ** (-numZero.length - 2) * numNum[2];
                } else {
                    numNew = 10 ** (-numZero.length - 1) * numNum[0] + 10 ** (-numZero.length - 2) * numNum[1];
                }
            }
        }

        return numNew;
    }

    addFigures(numArr: number[]): boolean {
        let isCarry = false;
        let first = 0, second = 1;
        switch (numArr[second]) {
            case 9 :
                numArr[second] = 8;
                break;
            case 8:
                numArr[second] = 8;
                break;
            case 7:
                numArr[second] = 8;
                break;
            case 6:
                numArr[second] = 6;
                break;
            case 5:
                numArr[second] = 5;
                break;
            case 4:
                numArr[second] = 4;
                break;
            case 3:
                numArr[second] = 4;
                break;
            case 2:
                numArr[second] = 2;
                break;
            case 1:
                numArr[second] = 1;
                break;
            case 0:
                numArr[second] = 0;
                break;
            default:
                break;
        }
        return isCarry;
    }

    addFigures_bak(numArr: number[]): boolean {
        let isCarry = false;
        let first = 0, second = 1;
        switch (numArr[second]) {
            case 9 :
                numArr[second] = 0;
                if (numArr[first] === 9) {
                    numArr[first] = 0;
                    numArr.unshift(1);
                    isCarry = true;
                } else {
                    numArr[first] = numArr[first] + 1;//todo: 进位优化 0.08999 为小数时有特殊情况
                    numArr[second] = 0;
                }
                break;
            case 8:
                numArr[second] = 0;
                if (numArr[first] === 9) {
                    numArr[first] = 0;
                    numArr.unshift(1);
                    isCarry = true;
                } else {
                    numArr[first] = numArr[first] + 1;//todo: 进位优化 0.08999 为小数时有特殊情况
                    numArr[second] = 0;
                }
                break;
            case 7:
                numArr[second] = 8;
                break;
            case 6:
                numArr[second] = 8;
                break;
            case 5:
                numArr[second] = 6;
                break;
            case 4:
                numArr[second] = 5;
                break;
            case 3:
                numArr[second] = 4;
                break;
            case 2:
                numArr[second] = 4;
                break;
            case 1:
                numArr[second] = 2;
                break;
            case 0:
                numArr[second] = 1;
                break;
            default:
                break;
        }
        return isCarry;
    }

    niceMin(stepNumInfo: NumberInfo): number {
        if (stepNumInfo.decimalPointIndex > -1) {
            let n = stepNumInfo.decimalArr.length - 1;
            let toNum = stepNumInfo.decimalArr[n];
            let num = this.decimalArr[n];
            this.decimalArr[n] = this.beautifulNumber(num, toNum);
            let decArr = [];
            for (let i = 0; i <= n; i++) {
                decArr.push(this.decimalArr[i]);
            }
            this.decimalArr = decArr;
        } else {
            for (let i = 0; i < stepNumInfo.integerArr.length; i++) {
                if (stepNumInfo.integerArr[i] === 0) {
                    this.integerArr[i] = 0;
                } else {
                    this.integerArr[i] = this.beautifulNumber(this.integerArr[i], stepNumInfo.integerArr[i]);
                    break;
                }
            }
            this.decimalArr = [];
        }
        return parseFloat(this.toStr());
    }

    beautifulNumber(num: number, toNum: number): number {
        if (toNum === 0) {
            switch (num) {
                case 9:
                    return 8;
                case 8:
                    return 8;
                case 7:
                    return 6;
                case 6:
                    return 6;
                case 5:
                    return 5;
                case 4:
                    return 4;
                case 3:
                    return 2;
                case 2:
                    return 2;
                case 1:
                    return 1;
                case 0:
                    return 0;
                default:
                    break;
            }
        } else if (toNum === 1) {
            return num;
        } else if (toNum === 2) {
            switch (num) {
                case 9:
                    return 8;
                case 8:
                    return 8;
                case 7:
                    return 6;
                case 6:
                    return 6;
                case 5:
                    return 4;
                case 4:
                    return 4;
                case 3:
                    return 2;
                case 2:
                    return 2;
                case 1:
                    return 0;
                case 0:
                    return 0;
                default:
                    break;
            }
        } else if (toNum === 5) {
            return 5;
        }

        return toNum;
    }

    toStr(): string {
        let s = this.isMinus ? '-' : '';
        for (let i = 0; i < this.integerArr.length; i++) {
            if (this.integerArr[i] !== null && this.integerArr[i] !== undefined) {
                s += this.integerArr[i].toString();
            }
        }
        if (this.decimalArr.length > 0) {
            s += '.';
            for (let i = 0; i < this.decimalArr.length; i++) {
                if (this.decimalArr[i] !== null && this.decimalArr[i] !== undefined) {
                    s += this.decimalArr[i].toString();
                }
            }
        }
        return s;
    }
}
