const fs = require('fs');

/**
 * 复制目录中的所有文件包括子目录
 * @param src { String } 需要复制的目录
 * @param dst { String } 复制到指定的目录
 **/
function copy(src, dst) {
    // 读取目录中的所有文件/目录
    fs.readdir(src, function (err, paths) {
        if (err) {
            throw err;
        }

        paths.forEach(function (path) {
            let _src = src + '/' + path,
                _dst = dst + '/' + path,
                readable, writable;

            fs.stat(_src, function (err, st) {
                if (err) {
                    throw err;
                }

                if (st.isFile()) {// 判断是否为文件
                    readable = fs.createReadStream(_src);// 创建读取流
                    writable = fs.createWriteStream(_dst);// 创建写入流
                    readable.pipe(writable);// 通过管道来传输流
                } else if (st.isDirectory()) {// 如果是目录则递归调用自身
                    exists(_src, _dst, copy);
                }
            });
        });
    });
}

// 在复制目录前需要判断该目录是否存在，不存在需要先创建目录
function exists(src, dst, callback) {
    let existsSync = fs.existsSync(dst);
    if (existsSync) {// 已存在
        if (callback) callback(src, dst);
    } else {// 不存在
        fs.mkdir(dst, function () {
            if (callback) callback(src, dst);
        });
    }
    return existsSync;
}

// 复制目录
function copys(src, dst) {
    exists(src, dst, copy);
}

module.exports = {
    copys,
    copy,
    exists,
};
