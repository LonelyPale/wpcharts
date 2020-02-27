export type SortFn = (a: any, b: any) => boolean;

export function bubbleSort(data: any[], fun?: SortFn): any[] {
    for (let i = data.length; i > 0; i--) {
        let moveFlag = false;
        for (let j = 0; j < i - 1; j++) {
            if (fun) {
                if (fun(data[j], data[j + 1])) {
                    let temp = data[j];
                    data[j] = data[j + 1];
                    data[j + 1] = temp;
                    moveFlag = true;
                }
            } else {
                if (data[j] > data[j + 1]) {
                    let temp = data[j];
                    data[j] = data[j + 1];
                    data[j + 1] = temp;
                    moveFlag = true;
                }
            }
        }
        if (!moveFlag) break;
    }
    return data;
}
