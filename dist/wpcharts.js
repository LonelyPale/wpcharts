var wpcharts = (function (exports) {
    'use strict';

    function detect(ua, platform) {
        var os = this.os = {}, browser = this.browser = {}, webkit = ua.match(/Web[kK]it[\/]{0,1}([\d.]+)/), android = ua.match(/(Android);?[\s\/]+([\d.]+)?/), osx = !!ua.match(/\(Macintosh\; Intel /), ipad = ua.match(/(iPad).*OS\s([\d_]+)/), ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/), iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/), webos = ua.match(/(webOS|hpwOS)[\s\/]([\d.]+)/), win = /Win\d{2}|Windows/.test(platform), wp = ua.match(/Windows Phone ([\d.]+)/), touchpad = webos && ua.match(/TouchPad/), kindle = ua.match(/Kindle\/([\d.]+)/), silk = ua.match(/Silk\/([\d._]+)/), blackberry = ua.match(/(BlackBerry).*Version\/([\d.]+)/), bb10 = ua.match(/(BB10).*Version\/([\d.]+)/), rimtabletos = ua.match(/(RIM\sTablet\sOS)\s([\d.]+)/), playbook = ua.match(/PlayBook/), chrome = ua.match(/Chrome\/([\d.]+)/) || ua.match(/CriOS\/([\d.]+)/), firefox = ua.match(/Firefox\/([\d.]+)/), firefoxos = ua.match(/\((?:Mobile|Tablet); rv:([\d.]+)\).*Firefox\/[\d.]+/), ie = ua.match(/MSIE\s([\d.]+)/) || ua.match(/Trident\/[\d](?=[^\?]+).*rv:([0-9.].)/), webview = !chrome && ua.match(/(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/), safari = webview || ua.match(/Version\/([\d.]+)([^S](Safari)|[^M]*(Mobile)[^S]*(Safari))/);
        if (browser.webkit = !!webkit)
            browser.version = webkit[1];
        if (android)
            os.android = true, os.version = android[2];
        if (iphone && !ipod)
            os.ios = os.iphone = true, os.version = iphone[2].replace(/_/g, '.');
        if (ipad)
            os.ios = os.ipad = true, os.version = ipad[2].replace(/_/g, '.');
        if (ipod)
            os.ios = os.ipod = true, os.version = ipod[3] ? ipod[3].replace(/_/g, '.') : null;
        if (wp)
            os.wp = true, os.version = wp[1];
        if (webos)
            os.webos = true, os.version = webos[2];
        if (touchpad)
            os.touchpad = true;
        if (blackberry)
            os.blackberry = true, os.version = blackberry[2];
        if (bb10)
            os.bb10 = true, os.version = bb10[2];
        if (rimtabletos)
            os.rimtabletos = true, os.version = rimtabletos[2];
        if (playbook)
            browser.playbook = true;
        if (kindle)
            os.kindle = true, os.version = kindle[1];
        if (silk)
            browser.silk = true, browser.version = silk[1];
        if (!silk && os.android && ua.match(/Kindle Fire/))
            browser.silk = true;
        if (chrome)
            browser.chrome = true, browser.version = chrome[1];
        if (firefox)
            browser.firefox = true, browser.version = firefox[1];
        if (firefoxos)
            os.firefoxos = true, os.version = firefoxos[1];
        if (ie)
            browser.ie = true, browser.version = ie[1];
        if (safari && (osx || os.ios || win)) {
            browser.safari = true;
            if (!os.ios)
                browser.version = safari[1];
        }
        if (webview)
            browser.webview = true;
        os.tablet = !!(ipad || playbook || (android && !ua.match(/Mobile/)) ||
            (firefox && ua.match(/Tablet/)) || (ie && !ua.match(/Phone/) && ua.match(/Touch/)));
        os.phone = !!(!os.tablet && !os.ipod && (android || iphone || webos || blackberry || bb10 ||
            (chrome && ua.match(/Android/)) || (chrome && ua.match(/CriOS\/([\d.]+)/)) ||
            (firefox && ua.match(/Mobile/)) || (ie && ua.match(/Touch/))));
    }
    function detectOS(ua, platform) {
        var OSData = [
            { name: 'Windows 2000', group: 'windows_server', identifier: 'Windows NT 5.0', version: '5.0' },
            { name: 'Windows XP', group: 'windows', identifier: 'Windows NT 5.1', version: '5.1' },
            { name: 'Windows 2003', group: 'windows_server', identifier: 'Windows NT 5.2', version: '5.2' },
            { name: 'Windows Vista', group: 'windows', identifier: 'Windows NT 6.0', version: '6.0' },
            { name: 'Windows 7', group: 'windows', identifier: 'Windows NT 6.1', version: '7.0' },
            { name: 'Windows 8', group: 'windows', identifier: 'Windows NT 6.2', version: '8.0' },
            { name: 'Windows 8.1', group: 'windows', identifier: 'Windows NT 6.3', version: '8.1' },
            { name: 'Windows 10', group: 'windows', identifier: 'Windows NT 10.0', version: '10.0' },
            { name: 'Windows 2008', group: 'windows_server', identifier: 'Windows NT 6.0; WOW64', version: '6.0' },
            { name: 'Windows 2008', group: 'windows_server', identifier: 'Windows NT 6.1; WOW64', version: '6.1' },
            { name: 'Windows 2012', group: 'windows_server', identifier: 'Windows NT 6.3; Win64', version: '6.3' },
            { name: 'Chrome OS', group: 'windows', identifier: 'CrOS' },
            { name: 'Mac OS X Capitan', group: 'mac', identifier: 'Mac OS X (10([_|\.])11([0-9_\.]*))', versionSeparator: '[_|\.]' },
            { name: 'Mac OS X Yosemite', group: 'mac', identifier: 'Mac OS X (10([_|\.])10([0-9_\.]*))', versionSeparator: '[_|\.]' },
            { name: 'Mac OS X Mavericks', group: 'mac', identifier: 'Mac OS X (10([_|\.])9([0-9_\.]*))', versionSeparator: '[_|\.]' },
            { name: 'Mac OS X Mountain Lion', group: 'mac', identifier: 'Mac OS X (10([_|\.])8([0-9_\.]*))', versionSeparator: '[_|\.]' },
            { name: 'Mac OS X Lion', group: 'mac', identifier: 'Mac OS X (10([_|\.])7([0-9_\.]*))', versionSeparator: '[_|\.]' },
            { name: 'Mac OS X Snow Leopard', group: 'mac', identifier: 'Mac OS X (10([_|\.])6([0-9_\.]*))', versionSeparator: '[_|\.]' },
            { name: 'Mac OS X Leopard', group: 'mac', identifier: 'Mac OS X (10([_|\.])5([0-9_\.]*))', versionSeparator: '[_|\.]' },
            { name: 'Mac OS X Tiger', group: 'mac', identifier: 'Mac OS X (10([_|\.])4([0-9_\.]*))', versionSeparator: '[_|\.]' },
            { name: 'Mac OS X Panther', group: 'mac', identifier: 'Mac OS X (10([_|\.])3([0-9_\.]*))', versionSeparator: '[_|\.]' },
            { name: 'Mac OS X Jaguar', group: 'mac', identifier: 'Mac OS X (10([_|\.])2([0-9_\.]*))', versionSeparator: '[_|\.]' },
            { name: 'Mac OS X Puma', group: 'mac', identifier: 'Mac OS X (10([_|\.])1([0-9_\.]*))', versionSeparator: '[_|\.]' },
            { name: 'Mac OS X Cheetah', group: 'mac', identifier: 'Mac OS X (10([_|\.])0([0-9_\.]*))', versionSeparator: '[_|\.]' },
            { name: 'Mac OS', group: 'mac', identifier: 'Mac OS' },
            { name: 'Ubuntu', group: 'linux_server', identifier: 'Ubuntu', versionIdentifier: 'Ubuntu/([0-9\.]*)' },
            { name: 'CentOs', group: 'linux_server', identifier: 'CentOs', versionIdentifier: 'CentOs/([0-9\.]*)' },
            { name: 'Debian', group: 'linux_server', identifier: 'Debian' },
            { name: 'Gentoo', group: 'linux_server', identifier: 'Gentoo' },
            { name: '国产系统', group: 'linux', identifier: 'Linux' }
        ];
        var setOSData = function (os) {
            var userAgent = navigator.userAgent.toLowerCase();
            for (var i = 0; i < OSData.length; i++) {
                var osRegExp = new RegExp(OSData[i].identifier.toLowerCase());
                var osRegExpResult = osRegExp.exec(userAgent);
                if (osRegExpResult != null) {
                    os.name = OSData[i].name;
                    os.group = OSData[i].group;
                    break;
                }
            }
            return true;
        };
        this.os = this.os || {};
        setOSData(this.os);
    }

    var config = {};
    var userAgent = navigator.userAgent, platform = navigator.platform;
    detect.call(config, userAgent, platform);
    detectOS.call(config, userAgent, platform);
    var hookCallbacks = [];
    loadCSS('/wpcharts/dist/css/wpcharts.css', function () { return console.log("done: wpcharts.css"); });
    loadJS('/wpcharts/lib/FileSaver.min.js', function () { return console.log("done: FileSaver.min.js"); });
    loadCSS('/wpcharts/lib/layui-v2.5.5/layui/css/layui.css', function () { return console.log("done: layui.css"); });
    loadJS('/wpcharts/lib/layui-v2.5.5/layui/layui.js', function () {
        console.log("done: layui.js");
        layui.use('layer', function () {
            console.log("init layui: [ layer ]");
        });
    });
    if (config.browser.ie) {
        loadJS("/wpcharts/lib/browser-polyfill.min.js", function () {
            console.log("done: browser-polyfill.min.js");
            loadJS("/wpcharts/lib/bluebird.min.js", function () {
                console.log("done: bluebird.min.js");
                loadJS("/wpcharts/lib/fetch.umd.js", function () {
                    console.log("done: fetch.umd.js");
                    loadJS('/wpcharts/lib/d3.min.js', function () {
                        console.log("done: d3.js");
                        loadJS("/wpcharts/dist/wpcharts.core.js", function () {
                            console.log("done: wpcharts.core.js");
                            finish();
                        });
                    });
                });
            });
        });
    }
    else {
        loadJS('/wpcharts/lib/d3.min.js', function () {
            console.log("done: d3.js");
            loadJS("/wpcharts/dist/wpcharts.core.js", function () {
                console.log("done: wpcharts.core.js");
                finish();
            });
        });
    }
    function loadJS(url, callback) {
        if (!url || url.length === 0) {
            throw new Error('argument "url" is required !');
        }
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.async = true;
        if (typeof (callback) === "function") {
            if (script.readyState) {
                script.onreadystatechange = function () {
                    if (script.readyState == "loaded" || script.readyState == "complete") {
                        script.onreadystatechange = null;
                        callback();
                    }
                };
            }
            else {
                script.onload = function () {
                    callback();
                };
            }
        }
        script.src = url;
        document.head.appendChild(script);
    }
    function loadCSS(url, callback) {
        if (!url || url.length === 0) {
            throw new Error('argument "url" is required !');
        }
        var link = document.createElement("link");
        link.type = 'text/css';
        link.rel = 'stylesheet';
        if (typeof (callback) === "function") {
            if (link.readyState) {
                link.onreadystatechange = function () {
                    if (link.readyState == "loaded" || link.readyState == "complete") {
                        link.onreadystatechange = null;
                        callback();
                    }
                };
            }
            else {
                link.onload = function () {
                    callback();
                };
            }
        }
        link.href = url;
        document.head.appendChild(link);
    }
    function ready(callback) {
        if (window._wpcharts) {
            callback && callback.call(window);
        }
        else {
            hookCallbacks.push(callback);
        }
    }
    function finish() {
        ready.init = window._wpcharts.init;
        ready.config = window._wpcharts.config;
        for (var i = 0; i < hookCallbacks.length; i++) {
            var callback = hookCallbacks[i];
            callback && callback.call(window);
        }
        hookCallbacks = [];
    }
    exports = ready;

    exports.loadCSS = loadCSS;
    exports.loadJS = loadJS;

    return exports;

}({}));
