import json from 'rollup-plugin-json';
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';

export default {
    input: 'src/wpcharts.js',
    output: {
        //file: 'bundle.js',
        file: 'dist/wpcharts.js',
        //format: 'cjs'
        format: 'iife',
        name: 'wpcharts'
    },
    plugins: [
        json(),
        resolve(),
        babel({
            exclude: 'node_modules/**' // 仅仅转译我们的源码
        })
    ]
};
