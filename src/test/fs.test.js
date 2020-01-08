const fs = require('fs');

fs.copyFile('../../src/css/wpcharts.css', '../../dist/css/wpcharts.css', (err) => {
    if (err) throw err;
    console.log('src/css to dist/css');
});
