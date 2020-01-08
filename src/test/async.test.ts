let sleep = function (time: number) {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve('ok');// 返回 ‘ok’
            //reject('err');// 返回 ‘err’
        }, time);
    });
};

let start = async function () {
    let result = await sleep(1000);
    console.log(result); // 收到 ‘ok’
    return 'start';
};

let start_for = async function () {
    for (let i = 1; i <= 10; i++) {
        await sleep(1000);
        console.log(`当前是第${i}次等待..`);
    }
    return 'start_for';
};

let start_each = async function (num: number) {
    if (num > 0) {
        let a = await start_each(num - 1);
    }
    await sleep(1000);
    console.log(`等待: ${num} - ${Date.now()}`);
    return 'each';
};

function test_a() {
    let a = start();
    console.log(a);
    a.then(data => {
        console.log(11, data)
    }).catch((err) => {
        console.log(12, err);
    });
}

function test_b() {
    let b = start_for();
    console.log(b);
    b.then(data => {
        console.log(21, data)
    }).catch((err) => {
        console.log(22, err);
    });
}

function test_c() {
    let c = start_each(5);
    console.log(c);
    c.then(data => {
        console.log(31, data)
    }).catch((err) => {
        console.log(32, err);
    });
}

//test_a();
//test_b();
test_c();
