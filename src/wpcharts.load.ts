import {detect, detectOS} from "./util/bom";

let config: any = {};
let {userAgent, platform} = navigator;

detect.call(config, userAgent, platform);
detectOS.call(config, userAgent, platform);

let hookCallbacks: (() => void)[] = [];

//外部样式
loadCSS('/wpcharts/dist/css/wpcharts.css', () => console.log("done: wpcharts.css"));

//组件：文件下载
loadJS('/wpcharts/lib/FileSaver.min.js', () => console.log("done: FileSaver.min.js"));

//组件：layui 消息提示、弹出框、按钮
loadCSS('/wpcharts/lib/layui-v2.5.5/layui/css/layui.css', () => console.log("done: layui.css"));
loadJS('/wpcharts/lib/layui-v2.5.5/layui/layui.js', () => {
    console.log("done: layui.js");
    layui.use('layer', function () {
        console.log("init layui: [ layer ]");
    });
});

if (config.browser.ie) {
    loadJS("/wpcharts/lib/browser-polyfill.min.js", () => {
        console.log("done: browser-polyfill.min.js");
        loadJS("/wpcharts/lib/bluebird.min.js", () => {
            console.log("done: bluebird.min.js");
            loadJS("/wpcharts/lib/fetch.umd.js", () => {
                console.log("done: fetch.umd.js");
                loadJS('/wpcharts/lib/d3.min.js', () => {
                    console.log("done: d3.js");
                    loadJS("/wpcharts/dist/wpcharts.core.js", () => {
                        console.log("done: wpcharts.core.js");
                        finish();
                    });
                });
            });
        });
    });
} else {
    loadJS('/wpcharts/lib/d3.min.js', () => {
        console.log("done: d3.js");
        loadJS("/wpcharts/dist/wpcharts.core.js", () => {
            console.log("done: wpcharts.core.js");
            finish();
        });
    });
}

export function loadJS(url: string, callback?: () => void) {
    if (!url || url.length === 0) {
        throw new Error('argument "url" is required !');
    }

    let script: any = document.createElement("script");
    script.type = "text/javascript";
    script.async = true;
    if (typeof (callback) === "function") {
        if (script.readyState) {
            script.onreadystatechange = function () {
                if (script.readyState == "loaded" || script.readyState == "complete") {
                    script.onreadystatechange = null;
                    callback();
                }
            }
        } else {
            script.onload = function () {
                callback();
            }
        }
    }
    script.src = url;
    document.head.appendChild(script);
    //document.body.appendChild(script);
    //document.getElementsByTagName("head")[0].appendChild(script);
}

export function loadCSS(url: string, callback?: () => void) {
    if (!url || url.length === 0) {
        throw new Error('argument "url" is required !');
    }

    let link: any = document.createElement("link");
    link.type = 'text/css';
    link.rel = 'stylesheet';
    if (typeof (callback) === "function") {
        if (link.readyState) {
            link.onreadystatechange = function () {
                if (link.readyState == "loaded" || link.readyState == "complete") {
                    link.onreadystatechange = null;
                    callback();
                }
            }
        } else {
            link.onload = function () {
                callback();
            }
        }
    }
    link.href = url;
    document.head.appendChild(link);
}

function onload(asyncLoad: () => void) {
    // @ts-ignore
    let {addEventListener, attachEvent} = window;
    if (addEventListener) {
        addEventListener("load", asyncLoad);
    } else {//ie10-
        attachEvent("onload", asyncLoad);
    }
}

function ready(this: any, callback: () => void) {
    // @ts-ignore
    if (window._wpcharts) {
        callback && callback.call(window);
    } else {
        hookCallbacks.push(callback);
    }
}

function finish() {
    // @ts-ignore
    ready.init = window._wpcharts.init;
    // @ts-ignore
    ready.config = window._wpcharts.config;

    for (let i = 0; i < hookCallbacks.length; i++) {
        let callback = hookCallbacks[i];
        callback && callback.call(window);
    }

    hookCallbacks = [];
}

exports = ready;
