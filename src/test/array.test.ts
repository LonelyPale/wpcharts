function test_1() {
    let arr = [1, 2, 3, 4];
    console.log(arr, arr.length);
    console.log('toString:', arr.toString());

    delete arr[1];
    console.log(arr, arr.length);

    let a = {a: 0, b: 'a'};
    let b = {a: 1, b: 'b'};
    let c = {a: 2, b: 'c'};
    let d = {a: 3, b: 'd'};
    let e = {a: 4, b: 'e'};
    let f = {a: 5, b: 'f'};
    let array = [a, b, c, d, e, f];
    let i = array.indexOf(c);
    console.log(i);

    console.log(arr[5]);
}

function test_2() {
    let array = [0, 1, 2, 3, 4, 5];
    console.log(array.length, array);
    for (let i = 0; i < 6; i++) {
        array.shift();
        console.log(i, array.length, array);
    }
}

test_2();
