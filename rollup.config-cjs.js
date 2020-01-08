//# es6
//import json from 'rollup-plugin-json';
//import resolve from 'rollup-plugin-node-resolve';
//import babel from 'rollup-plugin-babel';

//# ts
//import resolve from 'rollup-plugin-node-resolve';
import typescript from 'rollup-plugin-typescript';

let file_name = "";

export default {
    input: 'src/wpcharts.ts',
    output: {
        //file: 'bundle.js',
        file: 'dist/wpcharts' + file_name + '.node.js',
        format: 'cjs',
        //format: 'iife',
        name: 'wpcharts',
        globals: {
            d3: 'd3'
        },
    },
    external: ['d3'],
    plugins: [
        typescript()
    ]
};
