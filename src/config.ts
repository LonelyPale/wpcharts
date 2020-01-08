import mode, {setMode} from "./util/debug";
import {detect, detectOS} from "./util/bom";
import ie10polyfill from "./util/polyfill/ie10.polyfill"; //# must

export const isBrowser: boolean = typeof window !== 'undefined';// In browser

export const isNode: boolean = typeof global !== 'undefined';// In node

export const Global: any = (typeof window === "undefined" ? global : window);

export const __WPCHARTS_DEV__: boolean = typeof Global.__WPCHARTS_DEV__ === 'undefined' ? false : Global.__WPCHARTS_DEV__; //# 全局环境变量

export default mode;

export const config: any = {};

export function init() {
    if(isBrowser) {
        if (typeof window.console === "undefined") {
            // @ts-ignore
            window['console'] = {
                log: function () {
                },
                info: function () {
                },
                warn: function () {
                },
                error: function () {
                },
                time: function () {
                },
                timeEnd: function () {
                },
            };
        }

        let {userAgent, platform} = navigator;
        detect.call(config, userAgent, platform);
        detectOS.call(config, userAgent, platform);

        let test = typeof ie10polyfill.setPrototypeOf;

        if (typeof(Storage) !== "undefined") {
            // 针对 localStorage/sessionStorage 的代码
            config.debug = localStorage.debug;
        } else {
            //抱歉！不支持 Web Storage ..
            console.error("抱歉！不支持 Web Storage ..");
        }

        /**/
        console.log('navigator:', window.navigator);
        console.log('userAgent:', window.navigator.userAgent);
        // @ts-ignore
        console.log('chrome:', window['chrome']);
        console.log('compatMode:', document.compatMode);
    }

    mode.debug = true;
    if (isBrowser) {
        //setMode('debug');
    } else {
        //setMode('native');
    }

    console.log('mode:', mode);
    console.log('config:', config);
}

export function printConfig() {
    console.log('isBrowser:', isBrowser);
    console.log('isNode:', isNode);
    console.log('Global:', Global);
    console.log('__WPCHARTS_DEV__:', __WPCHARTS_DEV__);
    console.log('navigator:', navigator);
}

export interface GlobalConfigOption {
    request: any,
    response: any,
    document: any,
    style: any,
}

export const GlobalConfig: GlobalConfigOption = {request: undefined, response: undefined, document: undefined, style: undefined};

//printConfig();

//# test
//tsc && node build/test/test.js
//tsc && node build/config.js
