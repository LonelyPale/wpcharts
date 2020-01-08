// 求数组最逼近目标值，计算误差 #d3.bisector
export function lately<T extends number | Date>(dataset: T[], value: T, limitError: T): T | null {
    if (!dataset || dataset.length === 0) return null;

    let minDifference: T = limitError;
    let minValue!: T;
    let isHit: boolean = false;

    for (let i = 0; i < dataset.length; i++) {
        let currentValue = dataset[i];

        // @ts-ignore
        let currentDifference = <T>Math.abs(currentValue - value);
        if (currentDifference < minDifference) {
            minDifference = currentDifference;
            minValue = currentValue;
            isHit = true;
        }
    }

    return isHit ? minValue : null;
}
