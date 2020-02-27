
/**
 * 数组反转逆序
*/
export function reverse(data: any[]): any[] {
    let temp;
    for (let i = 0, m = data.length; i < m / 2; i++) {
        temp = data[i];
        data[i] = data[m - i - 1];
        data[m - i - 1] = temp;
    }
    return data;
}
