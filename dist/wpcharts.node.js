'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var d3 = _interopDefault(require('d3'));

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __awaiter(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
}

var mode = {
    debug: false,
    type: 'debug',
    setMode: setMode,
};
var output = {
    console: {
        log: console.log,
        info: console.info,
        warn: console.warn,
        error: console.error,
        time: console.time,
        timeEnd: console.timeEnd
    }
};
function setMode(type) {
    var flag = type ? type : mode.type;
    if (flag == 'debug') {
        console.log = log;
        console.info = log.i;
        console.warn = log.w;
        console.error = log.e;
    }
    else if (flag == 'native') {
        console.log = output.console.log;
        console.info = output.console.info;
        console.warn = output.console.warn;
        console.error = output.console.error;
    }
}
function generateTag() {
    if (!this)
        return '';
    var stack = [];
    var proto = this.__proto__;
    while (proto) {
        stack.push(proto.constructor.name);
        proto = proto.__proto__;
    }
    return stack.join(':') + ':';
}
function log() {
    var _a, _b;
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    if (!mode.debug)
        return;
    if (this && this !== log && this !== console) {
        var tag = generateTag.apply(this);
        (_a = output.console).log.apply(_a, __spreadArrays([tag], args));
    }
    else {
        (_b = output.console).log.apply(_b, args);
    }
}
log.i = function () {
    var _a, _b;
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    if (!mode.debug)
        return;
    if (this && this !== log && this !== console) {
        (_a = output.console).info.apply(_a, __spreadArrays([generateTag.apply(this)], args));
    }
    else {
        (_b = output.console).info.apply(_b, args);
    }
};
log.w = function () {
    var _a, _b;
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    if (this && this !== log && this !== console) {
        (_a = output.console).warn.apply(_a, __spreadArrays([generateTag.apply(this)], args));
    }
    else {
        (_b = output.console).warn.apply(_b, args);
    }
};
log.e = function () {
    var _a, _b;
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    if (this && this !== log && this !== console) {
        (_a = output.console).error.apply(_a, __spreadArrays([generateTag.apply(this)], args));
    }
    else {
        (_b = output.console).error.apply(_b, args);
    }
};

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

function setProtoOf(obj, proto) {
    obj.__proto__ = proto;
    return obj;
}
function mixinProperties(obj, proto) {
    for (var prop in proto) {
        if (!Object.prototype.hasOwnProperty.call(obj, prop)) {
            obj[prop] = proto[prop];
        }
    }
    return obj;
}
Object.setPrototypeOf = Object.setPrototypeOf || ({ __proto__: [] } instanceof Array ? setProtoOf : mixinProperties);

var isBrowser = typeof window !== 'undefined';
var isNode = typeof global !== 'undefined';
var config = {};
function init() {
    if (isBrowser) {
        if (typeof window.console === "undefined") {
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
        var userAgent = navigator.userAgent, platform = navigator.platform;
        detect.call(config, userAgent, platform);
        detectOS.call(config, userAgent, platform);
        if (typeof (Storage) !== "undefined") {
            config.debug = localStorage.debug;
        }
        else {
            console.error("抱歉！不支持 Web Storage ..");
        }
        console.log('navigator:', window.navigator);
        console.log('userAgent:', window.navigator.userAgent);
        console.log('chrome:', window['chrome']);
        console.log('compatMode:', document.compatMode);
    }
    mode.debug = true;
    console.log('mode:', mode);
    console.log('config:', config);
}
var GlobalConfig = { request: undefined, response: undefined, document: undefined, style: undefined };

var K_MAX_LENGTH = 0x7fffffff;
var hexSliceLookupTable = (function () {
    var alphabet = '0123456789abcdef';
    var table = new Array(256);
    for (var i = 0; i < 16; ++i) {
        var i16 = i * 16;
        for (var j = 0; j < 16; ++j) {
            table[i16 + j] = alphabet[i] + alphabet[j];
        }
    }
    return table;
})();
function assertSize(size) {
    if (typeof size !== 'number') {
        throw new TypeError('"size" argument must be of type number');
    }
    else if (size < 0) {
        throw new RangeError('The value "' + size + '" is invalid for option "size"');
    }
}
function createBuffer(length) {
    if (length === void 0) { length = 0; }
    if (length > K_MAX_LENGTH) {
        throw new RangeError('The value "' + length + '" is invalid for option "size"');
    }
    var buf = new Uint8Array(length);
    Object.setPrototypeOf(buf, BufferCustom.prototype);
    return buf;
}
function hexSlice(buf, start, end) {
    var len = buf.length;
    if (!start || start < 0)
        start = 0;
    if (!end || end < 0 || end > len)
        end = len;
    var out = '';
    for (var i = start; i < end; ++i) {
        out += hexSliceLookupTable[buf[i]];
    }
    return out;
}
var BufferCustom = (function (_super) {
    __extends(BufferCustom, _super);
    function BufferCustom() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BufferCustom.prototype.toString = function (encoding, start, end) {
        if (!start || start < 0)
            start = 0;
        if (!end || end > this.length)
            end = this.length;
        if (end <= 0) {
            return '';
        }
        if (end <= start) {
            return '';
        }
        end >>>= 0;
        start >>>= 0;
        if (!encoding)
            encoding = 'utf8';
        switch (encoding) {
            case 'hex':
                return hexSlice(this, start, end);
            case 'utf8':
            case 'utf-8':
                return '';
            case 'ascii':
                return '';
            case 'latin1':
            case 'binary':
                return '';
            case 'base64':
                return '';
            case 'ucs2':
            case 'ucs-2':
            case 'utf16le':
            case 'utf-16le':
                return '';
            default:
                throw new TypeError('Unknown encoding: ' + encoding);
        }
    };
    BufferCustom.alloc = function (size, fill, encoding) {
        assertSize(size);
        return createBuffer(size);
    };
    return BufferCustom;
}(Uint8Array));
var hasBufferType = false;
try {
    if (Buffer && Buffer.alloc)
        hasBufferType = true;
}
catch (err) {
    hasBufferType = false;
}
if (!hasBufferType) {
    var Buffer = BufferCustom;
}

var hexTable = [];
for (var i = 0; i < 256; i++) {
    hexTable[i] = (i <= 15 ? '0' : '') + i.toString(16);
}
function insecureRandomBytes(size) {
    var result = new Uint8Array(size);
    for (var i = 0; i < size; ++i)
        result[i] = Math.floor(Math.random() * 256);
    return result;
}
var randomBytes = insecureRandomBytes;
var ObjectId = (function () {
    function ObjectId() {
        this._id = '';
        this.id = ObjectId.generate();
        if (ObjectId.cacheHexString)
            this._id = this.toString();
    }
    ObjectId.prototype.toHexString = function () {
        if (ObjectId.cacheHexString && this._id)
            return this._id;
        var hexString = '';
        if (Buffer && Buffer.alloc) {
            hexString = this.id.toString('hex');
        }
        else {
            for (var i = 0; i < this.id.length; i++) {
                var hexChar = hexTable[this.id[i]];
                hexString += hexChar;
            }
        }
        if (ObjectId.cacheHexString)
            this._id = hexString;
        return hexString;
    };
    ObjectId.prototype.toString = function () {
        return this.toHexString();
    };
    ObjectId.generate = function (time) {
        if ('number' !== typeof time) {
            time = ~~(Date.now() / 1000);
        }
        var PROCESS_UNIQUE = randomBytes(5);
        var inc = ObjectId.getInc();
        var buffer = Buffer.alloc(12);
        buffer[3] = time & 0xff;
        buffer[2] = (time >> 8) & 0xff;
        buffer[1] = (time >> 16) & 0xff;
        buffer[0] = (time >> 24) & 0xff;
        buffer[4] = PROCESS_UNIQUE[0];
        buffer[5] = PROCESS_UNIQUE[1];
        buffer[6] = PROCESS_UNIQUE[2];
        buffer[7] = PROCESS_UNIQUE[3];
        buffer[8] = PROCESS_UNIQUE[4];
        buffer[11] = inc & 0xff;
        buffer[10] = (inc >> 8) & 0xff;
        buffer[9] = (inc >> 16) & 0xff;
        return buffer;
    };
    ObjectId.getInc = function () {
        return (ObjectId.index = (ObjectId.index + 1) % 0xffffff);
    };
    ObjectId.cacheHexString = true;
    ObjectId.index = ~~(Math.random() * 0xffffff);
    return ObjectId;
}());

var View = (function () {
    function View(option, context) {
        this.tx = 0;
        this.ty = 0;
        this.cx = 0;
        this.cy = 0;
        this.cw = 0;
        this.ch = 0;
        this.children = {};
        var x = option.x, y = option.y, width = option.width, height = option.height, top = option.top, right = option.right, bottom = option.bottom, left = option.left, boxOrient = option.boxOrient;
        this.x = x || 0;
        this.y = y || 0;
        this.width = width || 0;
        this.height = height || 0;
        this.top = top || 0;
        this.right = right || 0;
        this.bottom = bottom || 0;
        this.left = left || 0;
        this.boxOrient = boxOrient || 'default';
        this.cx = this.left;
        this.cy = this.top;
        this.context = context;
    }
    View.prototype.append = function (view) {
        this.children[this.context.id()] = view;
        view.parent = this;
        view.transform();
    };
    View.prototype.remove = function () {
        if (!this.parent)
            return;
        delete this.parent.children[this.context.id()];
        this.parent.refresh();
    };
    View.prototype.refresh = function () {
        this.reset();
        for (var _i = 0, _a = Object.values(this.children); _i < _a.length; _i++) {
            var view = _a[_i];
            view.transform();
        }
    };
    View.prototype.reset = function () {
        this.cx = this.left;
        this.cy = this.top;
        this.cw = 0;
        this.ch = 0;
    };
    View.prototype.translate = function () {
        if (!this.parent) {
            this.tx = this.x;
            this.ty = this.y;
            return;
        }
        var _a = this.parent, ptop = _a.top, pright = _a.right, pbottom = _a.bottom, pleft = _a.left;
        var _b = this.parent, pwidth = _b.width, pheight = _b.height, pcx = _b.cx, pcy = _b.cy, pcw = _b.cw, pch = _b.ch, pboxOrient = _b.boxOrient;
        var _c = this, x = _c.x, y = _c.y, width = _c.width, height = _c.height;
        if (pboxOrient === 'horizontal') {
            if (pcx + x + width <= pwidth) {
                this.tx = pcx + x;
                this.ty = pcy + y;
                this.parent.cx = this.tx + width;
                this.parent.ch = pch > y + height ? pch : y + height;
            }
            else {
                this.tx = pleft + x;
                this.ty = pcy + pch + y;
                this.parent.cx = this.tx + width;
                this.parent.cy = pcy + pch;
                this.parent.ch = y + height;
            }
        }
        else if (pboxOrient === 'vertical') {
            if (pcy + y + height <= pheight) {
                this.tx = pcx + x;
                this.ty = pcy + y;
                this.parent.cy = this.ty + height;
                this.parent.cw = pcw > x + width ? pcw : x + width;
            }
            else {
                this.tx = pcx + pcw + x;
                this.ty = ptop + y;
                this.parent.cx = pcx + pcw;
                this.parent.cy = this.ty + height;
                this.parent.cw = x + width;
            }
        }
        else if (pboxOrient === 'free') {
            this.tx = x;
            this.ty = y;
        }
        else {
            this.tx = pleft + x;
            this.ty = ptop + y;
        }
    };
    View.prototype.transform = function () {
        this.translate();
        var _a = this, tx = _a.tx, ty = _a.ty;
        if (tx !== 0 && ty === 0) {
            var translate = "translate(" + this.tx + ")";
            this.context.attr('transform', translate);
        }
        else if (tx !== 0 || ty !== 0) {
            var translate = "translate(" + this.tx + ", " + this.ty + ")";
            this.context.attr('transform', translate);
        }
    };
    return View;
}());

var id = "_id";
var SvgObject = (function () {
    function SvgObject(attribute) {
        this.children = {};
        this.attribute = attribute || {};
        this.attribute[id] = new ObjectId().toString();
    }
    SvgObject.prototype.getTagName = function () {
        var constructor = this.constructor;
        return constructor.TagName;
    };
    SvgObject.prototype.getClassName = function () {
        var constructor = this.constructor;
        return constructor.ClassName;
    };
    SvgObject.prototype.setView = function (option) {
        this.view = new View(option, this);
        return this;
    };
    SvgObject.prototype.getView = function () {
        return this.view;
    };
    SvgObject.prototype.initAttribute = function () {
        if (!this.svgContext) {
            log.e.call(this, "this.context is undefined or null");
            return this;
        }
        for (var key in this.attribute) {
            if (this.attribute.hasOwnProperty(key)) {
                var value = this.attribute[key];
                if (value === null || value === undefined) {
                    delete this.attribute[key];
                }
                this.svgContext.attr(key, value);
            }
        }
        return this;
    };
    SvgObject.prototype.initView = function () {
        if (!this.view) {
            return this;
        }
        if (this.parent && this.parent.view) {
            this.parent.view.append(this.view);
        }
        else {
            this.view.transform();
        }
        return this;
    };
    SvgObject.prototype.initOther = function () {
        var className = this.getClassName();
        if (className) {
            this.classed(className, true);
        }
        return this;
    };
    SvgObject.prototype.draw = function (parentSvgContext) {
        this.parentSvgContext = parentSvgContext;
        this.svgContext = this.parentSvgContext.append(this.getTagName());
        this.initAttribute();
        this.initView();
        this.initOther();
        return this;
    };
    SvgObject.prototype.append = function (svgObject) {
        if (!this.svgContext) {
            log.e.call(this, "this.context is undefined or null");
            return this;
        }
        this.children[svgObject.id()] = svgObject;
        svgObject.parent = this;
        svgObject.draw(this.svgContext);
        return svgObject;
    };
    SvgObject.prototype.remove = function () {
        if (this.svgContext) {
            this.svgContext.remove();
        }
        if (this.view) {
            this.view.remove();
        }
        if (this.parent) {
            delete this.parent.children[this.id()];
        }
        return this;
    };
    SvgObject.prototype.show = function () {
        return this.style("display", null);
    };
    SvgObject.prototype.hide = function () {
        return this.style("display", "none");
    };
    SvgObject.prototype.transform = function (value, overwrite) {
        if (overwrite === void 0) { overwrite = false; }
        if (overwrite) {
            this.attr('transform', value);
        }
        else {
            var transform = this.attr('transform');
            if (transform) {
                this.attr('transform', transform + value);
            }
            else {
                this.attr('transform', value);
            }
        }
        return this;
    };
    SvgObject.prototype.attr = function (name, value) {
        if (!this.svgContext) {
            log.e.call(this, "this.context is undefined or null");
            return this;
        }
        if (typeof name === 'object' && name !== null) {
            for (var key in name) {
                if (name.hasOwnProperty(key)) {
                    var val = name[key];
                    if (val === null || val === undefined) {
                        delete this.attribute[key];
                    }
                    else {
                        this.attribute[key] = val;
                    }
                    this.svgContext.attr(key, val);
                }
            }
        }
        else if (value === undefined) {
            return this.svgContext.attr(name);
        }
        else if (value === null) {
            delete this.attribute[name];
            this.svgContext.attr(name, value);
        }
        else if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
            this.attribute[name] = value;
            this.svgContext.attr(name, value);
        }
        else {
            this.svgContext.attr(name, value);
        }
        return this;
    };
    SvgObject.prototype.classed = function (names, value) {
        if (!this.svgContext) {
            log.e.call(this, "this.context is undefined or null");
            return this;
        }
        if (value === undefined) {
            return this.svgContext.classed(names);
        }
        else if (typeof value === "boolean") {
            this.svgContext.classed(names, value);
        }
        else {
            this.svgContext.classed(names, value);
        }
        return this;
    };
    SvgObject.prototype.style = function (name, value, priority) {
        if (!this.svgContext) {
            log.e.call(this, "this.context is undefined or null");
            return this;
        }
        if (typeof name === 'object' && name !== null) {
            for (var key in name) {
                if (name.hasOwnProperty(key)) {
                    this.svgContext.style(key, name[key]);
                }
            }
        }
        else if (value === undefined) {
            return this.svgContext.style(name);
        }
        else if (value === null) {
            this.svgContext.style(name, value);
        }
        else if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
            this.svgContext.style(name, value, priority);
        }
        else {
            this.svgContext.style(name, value, priority);
        }
        return this;
    };
    SvgObject.prototype.text = function (value) {
        if (!this.svgContext) {
            log.e.call(this, "this.context is undefined or null");
            return this;
        }
        if (value === undefined) {
            return this.svgContext.text();
        }
        else if (value === null) {
            this.svgContext.text(value);
        }
        else if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
            this.svgContext.text(value);
        }
        else {
            this.svgContext.text(value);
        }
        return this;
    };
    SvgObject.prototype.on = function (typenames, listener, capture) {
        if (!this.svgContext) {
            log.e.call(this, "this.context is undefined or null");
            return this;
        }
        if (listener === undefined) {
            return this.svgContext.on(typenames);
        }
        else if (listener === null) {
            this.svgContext.on(typenames, listener);
        }
        else {
            this.svgContext.on(typenames, listener, capture);
        }
        return this;
    };
    SvgObject.prototype.dispatch = function (type, parameters) {
        if (!this.svgContext) {
            log.e.call(this, "this.context is undefined or null");
            return this;
        }
        if (!parameters) {
            parameters = {
                bubbles: true,
                cancelable: true,
                detail: null
            };
        }
        if (typeof parameters === "object") {
            this.svgContext.dispatch(type, parameters);
        }
        else if (typeof parameters === "function") {
            this.svgContext.dispatch(type, parameters);
        }
        else {
            this.svgContext.dispatch(type);
        }
        return this;
    };
    SvgObject.prototype.call = function (func) {
        var _a;
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (!this.svgContext) {
            log.e.call(this, "this.context is undefined or null");
            return this;
        }
        (_a = this.svgContext).call.apply(_a, __spreadArrays([func], args));
        return this;
    };
    SvgObject.prototype.getSvgContext = function () {
        return this.svgContext;
    };
    SvgObject.prototype.getChildren = function (id) {
        return this.children[id];
    };
    SvgObject.prototype.id = function () {
        return this.attribute[id];
    };
    SvgObject.prototype.test = function (event) {
        console.log(111, event, arguments, this);
        d3.event.preventDefault();
        var btnNum = event.button;
        if (btnNum == 2) {
            alert("您点击了鼠标右键！");
        }
        else if (btnNum == 0) {
            alert("您点击了鼠标左键！");
        }
        else if (btnNum == 1) {
            alert("您点击了鼠标中键！");
        }
        else {
            alert("您点击了" + btnNum + "号键，我不能确定它的名称。");
        }
        console.log(112233);
    };
    return SvgObject;
}());

var Svg = (function (_super) {
    __extends(Svg, _super);
    function Svg(parentSvgContext, attribute) {
        var _this = this;
        attribute = attribute || {};
        attribute['xmlns'] = Svg.SvgNamespace;
        attribute['version'] = Svg.SvgVersion;
        _this = _super.call(this, attribute) || this;
        _this.draw(parentSvgContext);
        return _this;
    }
    Svg.prototype.contextmenu = function (menu) {
        var _this = this;
        this.append(menu);
        this.on('click', function () { return menu.hide(); });
        this.on('contextmenu', function () {
            console.log('event: contextmenu', d3.event);
            d3.event.preventDefault();
            var event = d3.event;
            if (event.ctrlKey || event.shiftKey)
                return;
            var node = document.elementFromPoint(event.x, event.y);
            console.log('event: contextmenu: node:', node);
            var path = event.path;
            if (path && path.length > 0) {
                for (var i = 0; i < path.length; i++) {
                    var node_1 = path[i];
                    var classList = node_1.classList;
                    if (classList && classList.length > 0) {
                        for (var j = 0; j < classList.length; j++) {
                            if (classList[j] === 'legends')
                                console.log("123321");
                        }
                    }
                }
            }
            var x = event.offsetX || 0;
            var y = event.offsetY || 0;
            var menuWidth = menu.getView().width;
            var menuHeight = menu.getView().height;
            var svgWidth = _this.attr('width');
            var svgHeight = _this.attr('height');
            if (x + menuWidth > svgWidth) {
                x -= menuWidth;
            }
            if (y + menuHeight > svgHeight) {
                y -= menuHeight;
            }
            menu.attr('transform', "translate(" + x + ", " + y + ")");
            menu.show();
        });
        return this;
    };
    Svg.prototype.log = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        log("this:", this);
        log("constructor:", this.constructor);
        log("prototype:", this.prototype);
        log("__proto__:", this.__proto__);
        var a = { a: 1 };
        log("test-object:", a, a.constructor);
    };
    Svg.SvgNamespace = d3.namespaces.svg;
    Svg.SvgVersion = 1.1;
    Svg.TagName = 'svg';
    return Svg;
}(SvgObject));

var Text = (function (_super) {
    __extends(Text, _super);
    function Text(attribute) {
        var _this = this;
        attribute = attribute || {};
        attribute.y = attribute.y || 17;
        _this = _super.call(this, attribute) || this;
        return _this;
    }
    Text.TagName = 'text';
    return Text;
}(SvgObject));

var G = (function (_super) {
    __extends(G, _super);
    function G(attribute) {
        return _super.call(this, attribute) || this;
    }
    G.TagName = 'g';
    return G;
}(SvgObject));

var Component = (function (_super) {
    __extends(Component, _super);
    function Component(property) {
        var _this = this;
        property = property || {};
        property.attribute = property.attribute || {};
        _this = _super.call(this, property.attribute) || this;
        _this.property = property;
        return _this;
    }
    Component.ClassName = 'component';
    return Component;
}(G));

var Rect = (function (_super) {
    __extends(Rect, _super);
    function Rect(attribute) {
        return _super.call(this, attribute) || this;
    }
    Rect.TagName = 'rect';
    return Rect;
}(SvgObject));

var Path = (function (_super) {
    __extends(Path, _super);
    function Path(attribute) {
        return _super.call(this, attribute) || this;
    }
    Path.TagName = 'path';
    return Path;
}(SvgObject));

var MenuDefaultWidth = 180;
var MenuDefaultHeight = 0;

var MenuItem = (function (_super) {
    __extends(MenuItem, _super);
    function MenuItem(property) {
        var _this = _super.call(this, property) || this;
        _this.property.type = _this.property.type || 'normal';
        _this.setView({ width: MenuItem.Width, height: MenuItem.Height, left: 15, boxOrient: "horizontal" });
        return _this;
    }
    MenuItem.prototype.append = function (svgObject) {
        _super.prototype.append.call(this, svgObject);
        if (svgObject.getClassName() === 'menu') {
            this.menu = svgObject;
            this.menu.transform("translate(" + (MenuItem.Width - 16) + ", -16)");
        }
        return svgObject;
    };
    MenuItem.prototype.draw = function (parentSvgContext) {
        var _this = this;
        _super.prototype.draw.call(this, parentSvgContext);
        this.attr('type', this.property.type);
        var _a = this.view, width = _a.width, height = _a.height;
        var layout = new Rect({ width: width, height: height });
        this.append(layout);
        var text = new Text().setView({ width: MenuItem.Width - 30 });
        this.append(text).text(this.property.text);
        if (this.property.type === 'menu') {
            var symbolGenerator = d3.symbol().type(d3.symbolTriangle).size(30);
            var pathData = symbolGenerator();
            this.append(new Path({ d: pathData }).setView({ x: -2, y: 11 })).classed('icon-triangle', true).transform('rotate(90)');
        }
        else if (this.property.type === 'check') {
            var d = 'M14.1 27.2l7.1 7.2 16.7-16.8';
            this.append(new Path({ d: d }).setView({ x: -22, y: -10 })).classed('icon-hook', true).transform('scale(0.8)');
        }
        else {
            this.append(new Path({}).setView({ x: -22, y: -10 })).classed('icon-hook', true).transform('scale(0.8)').hide();
        }
        if (this.property.type === 'menu') {
            this.on('mouseover', function () { return _this.menu.show(); });
            this.on('mouseout', function () { return _this.menu.hide(); });
        }
        else {
            this.on('click', function () { return _this.action(); });
        }
        return this;
    };
    MenuItem.prototype.setType = function (type) {
        this.property.type = type;
        d3.selectAll('.icon-hook').remove();
        if (this.property.type === 'check') {
            var d = 'M14.1 27.2l7.1 7.2 16.7-16.8';
            this.append(new Path({ d: d }).setView({ x: 0, y: -10 })).classed('icon-hook', true).transform('scale(0.8)');
        }
    };
    MenuItem.prototype.action = function () {
        if (this.property.action && typeof this.property.action === "function") {
            this.property.action(this);
        }
    };
    MenuItem.ClassName = 'menu-item';
    MenuItem.Width = MenuDefaultWidth - 1;
    MenuItem.Height = 22;
    return MenuItem;
}(Component));

var Line = (function (_super) {
    __extends(Line, _super);
    function Line(attribute) {
        return _super.call(this, attribute) || this;
    }
    Line.TagName = 'line';
    return Line;
}(SvgObject));

var MenuSeparator = (function (_super) {
    __extends(MenuSeparator, _super);
    function MenuSeparator() {
        var _this = _super.call(this) || this;
        _this.setView({ width: MenuSeparator.Width, height: MenuSeparator.Height });
        return _this;
    }
    MenuSeparator.prototype.draw = function (parentSvgContext) {
        _super.prototype.draw.call(this, parentSvgContext);
        var _a = this.view, width = _a.width, height = _a.height;
        var layout = new Rect({ width: width, height: height });
        this.append(layout);
        var separator = new Line({ x2: width }).setView({ y: 5 });
        this.append(separator);
        return this;
    };
    MenuSeparator.ClassName = 'menu-separator';
    MenuSeparator.Width = MenuDefaultWidth - 1;
    MenuSeparator.Height = 10;
    return MenuSeparator;
}(Component));

var Menu = (function (_super) {
    __extends(Menu, _super);
    function Menu(property) {
        var _this = _super.call(this, property) || this;
        _this.setView({
            x: 0,
            y: 0,
            width: MenuDefaultWidth,
            height: MenuDefaultHeight,
            top: 5,
            right: 0.5,
            bottom: 5,
            left: 0.5,
            boxOrient: "vertical"
        });
        return _this;
    }
    Menu.prototype.append = function (svgObject) {
        if (svgObject instanceof Menu || svgObject instanceof MenuItem || svgObject instanceof MenuSeparator) {
            var menuItemCount = 0;
            var menuSeparatorCount = 0;
            for (var _i = 0, _a = Object.values(this.children); _i < _a.length; _i++) {
                var menu = _a[_i];
                if (menu instanceof MenuItem) {
                    menuItemCount++;
                }
                else if (menu instanceof MenuSeparator) {
                    menuSeparatorCount++;
                }
            }
            if (svgObject instanceof MenuItem) {
                menuItemCount++;
            }
            else if (svgObject instanceof MenuSeparator) {
                menuSeparatorCount++;
            }
            var _b = this.view, top = _b.top, bottom = _b.bottom;
            this.view.height = top + bottom + menuItemCount * MenuItem.Height + menuSeparatorCount * MenuSeparator.Height;
            this.layout.attr('height', this.view.height);
        }
        return _super.prototype.append.call(this, svgObject);
    };
    Menu.prototype.draw = function (parentSvgContext) {
        var _this = this;
        _super.prototype.draw.call(this, parentSvgContext);
        var _a = this.view, width = _a.width, height = _a.height;
        var layout = new Rect({ class: 'layout', width: width, height: height, rx: 5 });
        this.append(layout);
        this.layout = layout;
        this.hide();
        this.on('click', function () {
            var path = d3.event.path || [];
            for (var i = 0; i < path.length; i++) {
                var item = path[i];
                if (item.className && typeof item.className === "object") {
                    var className = item.className.baseVal;
                    if (className === Menu.ClassName || className === MenuSeparator.ClassName) {
                        d3.event.stopPropagation();
                    }
                    else if (item.className.baseVal === MenuItem.ClassName) {
                        var attrNode = item.attributes.getNamedItem("type");
                        var type = attrNode ? attrNode.value : '';
                        if (type === 'menu') {
                            d3.event.stopPropagation();
                        }
                        else {
                            _this.hide();
                            break;
                        }
                    }
                }
            }
        });
        return this;
    };
    Menu.ClassName = 'menu';
    return Menu;
}(Component));

var objToString = Object.prototype.toString;
function isArray(value) {
    return objToString.call(value) === '[object Array]';
}
function isFunction(value) {
    return typeof value === 'function';
}
function clone(source) {
    return JSON.parse(JSON.stringify(source));
}
function extend(target, source, overwrite) {
    if (overwrite === void 0) { overwrite = false; }
    if (overwrite)
        source = clone(source);
    for (var key in source) {
        if (source.hasOwnProperty(key)) {
            target[key] = target[key] && target[key].toString() === "[object Object]" ?
                extend(target[key], source[key]) : target[key] = source[key];
        }
    }
    return target;
}

function getDayCount(year, month) {
    var d = new Date(year, month, 0);
    return d.getDate();
}
var formurlencoded = function (data) {
    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
        return typeof obj;
    } : function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
    var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var sorted = Boolean(opts.sorted), skipIndex = Boolean(opts.skipIndex), ignorenull = Boolean(opts.ignorenull), encode = function encode(value) {
        return String(value).replace(/(?:[\0-\x1F"-&\+-\}\x7F-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])/g, encodeURIComponent).replace(/ /g, '+').replace(/[!'()~\*]/g, function (ch) {
            return '%' + ch.charCodeAt().toString(16).slice(-2).toUpperCase();
        });
    }, keys = function keys(obj) {
        var keyarr = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Object.keys(obj);
        return sorted ? keyarr.sort() : keyarr;
    }, filterjoin = function filterjoin(arr) {
        return arr.filter(function (e) {
            return e;
        }).join('&');
    }, objnest = function objnest(name, obj) {
        return filterjoin(keys(obj).map(function (key) {
            return nest(name + '[' + key + ']', obj[key]);
        }));
    }, arrnest = function arrnest(name, arr) {
        return arr.length ? filterjoin(arr.map(function (elem, index) {
            return skipIndex ? nest(name + '[]', elem) : nest(name + '[' + index + ']', elem);
        })) : encode(name + '[]');
    }, nest = function nest(name, value) {
        var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : typeof value === 'undefined' ? 'undefined' : _typeof(value);
        var f = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
        if (value === f)
            f = ignorenull ? f : encode(name) + '=' + f;
        else if (/string|number|boolean/.test(type))
            f = encode(name) + '=' + encode(value);
        else if (Array.isArray(value))
            f = arrnest(name, value);
        else if (type === 'object')
            f = objnest(name, value);
        return f;
    };
    return data && filterjoin(keys(data).map(function (key) {
        return nest(key, data[key]);
    }));
};

var Title = (function (_super) {
    __extends(Title, _super);
    function Title(attribute) {
        return _super.call(this, attribute) || this;
    }
    Title.TagName = 'title';
    return Title;
}(SvgObject));

var Tooltips = (function (_super) {
    __extends(Tooltips, _super);
    function Tooltips(property) {
        var _this = _super.call(this, property) || this;
        _this.setView({ width: 150, height: 0, left: 5, right: 5, top: 15, bottom: 5, boxOrient: "vertical" });
        return _this;
    }
    Tooltips.prototype.draw = function (parentSvgContext) {
        _super.prototype.draw.call(this, parentSvgContext);
        return this.hide();
    };
    Tooltips.prototype.clear = function () {
        this.children = {};
        this.getSvgContext().selectAll("*").remove();
        return this;
    };
    Tooltips.prototype.refresh = function (recordsNumber, mouse, parentView, tooltipsView, nodeView, minWidth) {
        var width, height;
        var tw = tooltipsView.width, th = tooltipsView.height, tt = tooltipsView.top, tb = tooltipsView.bottom, tl = tooltipsView.left, tr = tooltipsView.right;
        var nw = nodeView.width, nh = nodeView.height, nt = nodeView.top, nb = nodeView.bottom, nl = nodeView.left, nr = nodeView.right;
        height = tt + tb + recordsNumber * (nh + nt + nb);
        if (height <= th) {
            width = minWidth > nw ? minWidth : nw;
        }
        else if (height <= th * 2) {
            width = nw * 2;
            height = th;
        }
        else if (height <= th * 3) {
            width = nw * 3;
            height = th;
        }
        else {
            width = tw;
            height = th;
        }
        var x = mouse[0], y = mouse[1];
        var pwidth = parentView.width, pheight = parentView.height, pleft = parentView.left, ptop = parentView.top;
        if (pleft + x + width + 5 > pwidth) {
            x -= width + 5;
        }
        else {
            x += 5;
        }
        if (ptop + y + height + 5 > pheight) {
            y -= height + 5;
        }
        else {
            y += 5;
        }
        this.clear();
        this.setView({ width: width, height: height, top: tt, bottom: tb, left: tl, right: tr, boxOrient: "vertical" });
        this.append(new Rect({ width: width, height: height, opacity: 0.8 }));
        this.attr('transform', "translate(" + x + ", " + y + ")");
        this.show();
        return this;
    };
    Tooltips.ClassName = 'tooltips';
    return Tooltips;
}(Component));

var Row = (function () {
    function Row(table, index, data) {
        this.table = table;
        this.index = index;
        this.data = data;
    }
    Row.prototype.$setIndex = function (i) {
        this.index[0] = i;
    };
    Row.prototype.getIndex = function () {
        return this.index[0];
    };
    Row.prototype.get = function (key) {
        if (key === undefined) {
            return this.data;
        }
        else if (typeof key === "number") {
            return this.data[key];
        }
        else {
            var i = this.table.getColumnIndex(key);
            if (i === undefined) {
                return undefined;
            }
            else {
                return this.data[i];
            }
        }
    };
    Row.prototype.set = function (key, value) {
        if (isArray(key)) {
            value = key;
            var columnLength = this.table.getColumnLength();
            for (var i = 0; i < columnLength; i++) {
                this.data[i] = value[i];
            }
        }
        else if (key && typeof key === "object" && typeof key !== "function") {
            value = key;
            var columnIndex = this.table.getColumnIndex();
            for (var _i = 0, _a = Object.keys(columnIndex); _i < _a.length; _i++) {
                var k = _a[_i];
                var i = columnIndex[k];
                this.data[i] = value[k];
            }
        }
        else if (typeof key === "number") {
            this.data[key] = value;
        }
        else if (typeof key === "string") {
            var i = this.table.getColumnIndex(key);
            if (i === undefined) {
                console.warn.call(this, "Field does not exist");
                return this;
            }
            else {
                this.data[i] = value;
            }
        }
        return this;
    };
    Row.prototype.remove = function () {
        this.table.delete(this.getIndex());
    };
    return Row;
}());

var Model = (function () {
    function Model(name, fieldName, type, data) {
        if (data === void 0) { data = []; }
        this.ticks = 0;
        this.tickSize = 0;
        this.tickPadding = 0;
        this.name = name;
        this.fieldName = fieldName;
        this.type = type;
        this.data = data;
    }
    return Model;
}());

var parseTime = d3.timeParse("%Y-%m-%d %H:%M:%S");
var parseTimeT = d3.timeParse("%Y-%m-%dT%H:%M:%S");
var formatTime = d3.timeFormat("%Y-%m-%d %H:%M:%S");
var formatTimeSimple = d3.timeFormat("%Y-%m-%d_%H-%M-%S");
var day = 24 * 60 * 60 * 1000;
var month = 31 * day;
var year = 12 * month;
var time_level1 = day;
var time_level2 = month;
var time_level3 = 3 * year;
var time_level4 = 8 * year;
var time_level5 = 20 * year;
var time_level6 = 50 * year;
var time_level7 = 75 * year;
function get_time_level(time_difference) {
    var time_level;
    if (time_difference <= time_level1) {
        time_level = "time_level1";
    }
    else if (time_difference <= time_level2) {
        time_level = "time_level2";
    }
    else if (time_difference <= time_level3) {
        time_level = "time_level3";
    }
    else if (time_difference <= time_level4) {
        time_level = "time_level4";
    }
    else if (time_difference <= time_level5) {
        time_level = "time_level5";
    }
    else if (time_difference <= time_level6) {
        time_level = "time_level6";
    }
    else if (time_difference <= time_level7) {
        time_level = "time_level7";
    }
    else {
        time_level = "time_level99";
    }
    return time_level;
}
var fun_time_level = {
    "time_level1": function (max, min) {
        var maxYear = max.getFullYear();
        var minYear = min.getFullYear();
        var maxMonth = max.getMonth() + 1;
        var minMonth = min.getMonth() + 1;
        var maxDay = max.getDate();
        var minDay = min.getDate();
        var maxHour = max.getHours();
        var minHour = min.getHours();
        var year_difference = maxYear - minYear;
        var month_difference;
        var day_difference;
        var hour_difference;
        var time_group = {
            times1: [],
            times2: []
        };
        if (year_difference === 0) {
            month_difference = maxMonth - minMonth;
            if (month_difference === 0) {
                day_difference = maxDay - minDay;
                if (day_difference === 0) {
                    hour_difference = maxHour - minHour + 1;
                    for (var i = 0; i < hour_difference; i++) {
                        time_group.times1.push(minHour + i);
                    }
                    time_group.times2.push({
                        text: minYear + "-" + minMonth + "-" + minDay,
                        len: hour_difference
                    });
                }
                else {
                    hour_difference = 23 - minHour + 1;
                    for (var i = 0; i < hour_difference; i++) {
                        time_group.times1.push(minHour + i);
                    }
                    time_group.times2.push({
                        text: minYear + "-" + minMonth + "-" + minDay,
                        len: hour_difference
                    });
                    for (var j = 0; j <= maxHour; j++) {
                        time_group.times1.push(j);
                    }
                    time_group.times2.push({
                        text: maxYear + "-" + maxMonth + "-" + maxDay,
                        len: maxHour + 1
                    });
                }
            }
            else {
                hour_difference = 23 - minHour + 1;
                for (var i = 0; i < hour_difference; i++) {
                    time_group.times1.push(minHour + i);
                }
                time_group.times2.push({
                    text: minYear + "-" + minMonth + "-" + minDay,
                    len: hour_difference
                });
                for (var j = 0; j <= maxHour; j++) {
                    time_group.times1.push(j);
                }
                time_group.times2.push({
                    text: maxYear + "-" + maxMonth + "-" + maxDay,
                    len: maxHour + 1
                });
            }
        }
        else if (year_difference === 1) {
            hour_difference = 23 - minHour + 1;
            for (var i = 0; i < hour_difference; i++) {
                time_group.times1.push(minHour + i);
            }
            time_group.times2.push({
                text: minYear + "-" + minMonth + "-" + minDay,
                len: hour_difference
            });
            for (var j = 0; j <= maxHour; j++) {
                time_group.times1.push(j);
            }
            time_group.times2.push({
                text: maxYear + "-" + maxMonth + "-" + maxDay,
                len: maxHour + 1
            });
        }
        return time_group;
    },
    "time_level2": function (max, min) {
        var maxYear = max.getFullYear();
        var minYear = min.getFullYear();
        var maxMonth = max.getMonth() + 1;
        var minMonth = min.getMonth() + 1;
        var maxDay = max.getDate();
        var minDay = min.getDate();
        var year_difference = maxYear - minYear;
        var month_difference;
        var day_difference;
        var time_group = {
            times1: [],
            times2: []
        };
        if (year_difference === 0) {
            month_difference = maxMonth - minMonth;
            if (month_difference === 0) {
                day_difference = maxDay - minDay + 1;
                for (var i = 0; i < day_difference; i++) {
                    time_group.times1.push(minDay + i);
                }
                time_group.times2.push({
                    text: minYear + "-" + minMonth,
                    len: day_difference
                });
            }
            else if (month_difference === 1) {
                day_difference = getDayCount(minYear, minMonth) - minDay + 1;
                for (var i = 0; i < day_difference; i++) {
                    time_group.times1.push(minDay + i);
                }
                time_group.times2.push({
                    text: minYear + "-" + minMonth,
                    len: day_difference
                });
                for (var j = 0; j < maxDay; j++) {
                    time_group.times1.push(1 + j);
                }
                time_group.times2.push({
                    text: maxYear + "-" + maxMonth,
                    len: maxDay
                });
            }
            else {
                day_difference = getDayCount(minYear, minMonth) - minDay + 1;
                for (var i = 0; i < day_difference; i++) {
                    time_group.times1.push(minDay + i);
                }
                time_group.times2.push({
                    text: minYear + "-" + minMonth,
                    len: day_difference
                });
                for (var m = 1; m < month_difference; m++) {
                    var dayCount = getDayCount(minYear, minMonth + m);
                    for (var n = 1; n <= dayCount; n++) {
                        time_group.times1.push(n);
                    }
                    time_group.times2.push({
                        text: minYear + "-" + (minMonth + m),
                        len: dayCount
                    });
                }
                for (var j = 0; j < maxDay; j++) {
                    time_group.times1.push(1 + j);
                }
                time_group.times2.push({
                    text: maxYear + "-" + maxMonth,
                    len: maxDay
                });
            }
        }
        else if (year_difference === 1) {
            day_difference = getDayCount(minYear, minMonth) - minDay + 1;
            for (var i = 0; i < day_difference; i++) {
                time_group.times1.push(minDay + i);
            }
            time_group.times2.push({
                text: minYear + "-" + minMonth,
                len: day_difference
            });
            for (var j = 0; j < maxDay; j++) {
                time_group.times1.push(1 + j);
            }
            time_group.times2.push({
                text: maxYear + "-" + maxMonth,
                len: maxDay
            });
        }
        return time_group;
    },
    "time_level3": function (max, min) {
        var maxYear = max.getFullYear();
        var minYear = min.getFullYear();
        var maxMonth = max.getMonth() + 1;
        var minMonth = min.getMonth() + 1;
        var year_difference = maxYear - minYear;
        var month_difference;
        var time_group = {
            times1: [],
            times2: []
        };
        if (year_difference === 0) {
            month_difference = maxMonth - minMonth + 1;
            for (var i = 0; i < month_difference; i++) {
                time_group.times1.push(minMonth + i);
            }
            time_group.times2.push({
                text: minYear,
                len: month_difference
            });
        }
        else if (year_difference === 1) {
            month_difference = 12 - minMonth + 1;
            for (var i = 0; i < month_difference; i++) {
                time_group.times1.push(minMonth + i);
            }
            time_group.times2.push({
                text: minYear,
                len: month_difference
            });
            for (var j = 0; j < maxMonth; j++) {
                time_group.times1.push(1 + j);
            }
            time_group.times2.push({
                text: maxYear,
                len: maxMonth
            });
        }
        else {
            month_difference = 12 - minMonth + 1;
            for (var i = 0; i < month_difference; i++) {
                time_group.times1.push(minMonth + i);
            }
            time_group.times2.push({
                text: minYear,
                len: month_difference
            });
            for (var m = 1; m < year_difference; m++) {
                for (var n = 1; n <= 12; n++) {
                    time_group.times1.push(n);
                }
                time_group.times2.push({
                    text: minYear + m,
                    len: 12
                });
            }
            for (var j = 0; j < maxMonth; j++) {
                time_group.times1.push(1 + j);
            }
            time_group.times2.push({
                text: maxYear,
                len: maxMonth
            });
        }
        return time_group;
    },
    "time_level4": function (max, min) {
        var maxYear = max.getFullYear();
        var minYear = min.getFullYear();
        var maxMonth = max.getMonth() + 1;
        var minMonth = min.getMonth() + 1;
        var year_difference = maxYear - minYear;
        var time_group = {
            times1: [],
            times2: []
        };
        if (minMonth === 1 || minMonth === 2 || minMonth === 3) {
            time_group.times1.push("Q1");
            time_group.times1.push("Q2");
            time_group.times1.push("Q3");
            time_group.times1.push("Q4");
            time_group.times2.push({
                text: minYear,
                len: 4
            });
        }
        else if (minMonth === 4 || minMonth === 5 || minMonth === 6) {
            time_group.times1.push("Q2");
            time_group.times1.push("Q3");
            time_group.times1.push("Q4");
            time_group.times2.push({
                text: minYear,
                len: 3
            });
        }
        else if (minMonth === 7 || minMonth === 8 || minMonth === 9) {
            time_group.times1.push("Q3");
            time_group.times1.push("Q4");
            time_group.times2.push({
                text: minYear,
                len: 2
            });
        }
        else if (minMonth === 10 || minMonth === 11 || minMonth === 12) {
            time_group.times1.push("Q4");
            time_group.times2.push({
                text: minYear,
                len: 1
            });
        }
        for (var m = 1; m < year_difference; m++) {
            for (var n = 1; n <= 4; n++) {
                time_group.times1.push("Q" + n);
            }
            time_group.times2.push({
                text: minYear + m,
                len: 4
            });
        }
        if (maxMonth === 1 || maxMonth === 2 || maxMonth === 3) {
            time_group.times1.push("Q1");
            time_group.times2.push({
                text: maxYear,
                len: 1
            });
        }
        else if (maxMonth === 4 || maxMonth === 5 || maxMonth === 6) {
            time_group.times1.push("Q1");
            time_group.times1.push("Q2");
            time_group.times2.push({
                text: maxYear,
                len: 2
            });
        }
        else if (maxMonth === 7 || maxMonth === 8 || maxMonth === 9) {
            time_group.times1.push("Q1");
            time_group.times1.push("Q2");
            time_group.times1.push("Q3");
            time_group.times2.push({
                text: maxYear,
                len: 3
            });
        }
        else if (maxMonth === 10 || maxMonth === 11 || maxMonth === 12) {
            time_group.times1.push("Q1");
            time_group.times1.push("Q2");
            time_group.times1.push("Q3");
            time_group.times1.push("Q4");
            time_group.times2.push({
                text: maxYear,
                len: 4
            });
        }
        return time_group;
    },
    "time_level5": function (max, min) {
        var maxYear = max.getFullYear();
        var minYear = min.getFullYear();
        var year_difference = maxYear - minYear;
        var time_group = {
            times1: [],
            times2: []
        };
        for (var m = 0; m <= year_difference; m++) {
            time_group.times1.push(minYear + m);
        }
        return time_group;
    },
    "time_level6": function (max, min) {
        var maxYear = max.getFullYear();
        var minYear = min.getFullYear();
        var year_difference = maxYear - minYear;
        var time_group = {
            times1: [],
            times2: []
        };
        var year_len = Math.ceil(year_difference / 2);
        for (var m = 0; m <= year_len; m++) {
            time_group.times1.push(minYear + m * 2);
        }
        return time_group;
    },
    "time_level7": function (max, min) {
        var maxYear = max.getFullYear();
        var minYear = min.getFullYear();
        var year_difference = maxYear - minYear;
        var time_group = {
            times1: [],
            times2: []
        };
        var year_len = Math.ceil(year_difference / 3);
        for (var m = 0; m <= year_len; m++) {
            time_group.times1.push(minYear + m * 3);
        }
        return time_group;
    },
    "time_level99": function (max, min) {
        var time_group = {
            times1: [],
            times2: []
        };
        return time_group;
    }
};
function beautifyDatetime(date, type, time_level, date2) {
    if (date2 === void 0) { date2 = new Date(); }
    var year = date.getFullYear();
    var month = date.getMonth();
    var day = date.getDate();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();
    var millisecond = date.getMilliseconds();
    var year2, year_difference, year_len;
    if (type === "start") {
        minute = 0;
        second = 0;
        millisecond = 0;
        if (time_level === "time_level1") ;
        else if (time_level === "time_level2") {
            hour = 0;
        }
        else if (time_level === "time_level3") {
            hour = 0;
            day = 1;
        }
        else if (time_level === "time_level4") {
            if (month === 0 || month === 1 || month === 2) {
                month = 0;
            }
            else if (month === 3 || month === 4 || month === 5) {
                month = 3;
            }
            else if (month === 6 || month === 7 || month === 8) {
                month = 6;
            }
            else if (month === 9 || month === 10 || month === 11) {
                month = 9;
            }
            hour = 0;
            day = 1;
        }
        else if (time_level === "time_level5") {
            hour = 0;
            day = 1;
            month = 0;
        }
        else if (time_level === "time_level6") {
            hour = 0;
            day = 1;
            month = 0;
        }
        else if (time_level === "time_level7") {
            hour = 0;
            day = 1;
            month = 0;
        }
        else if (time_level === "time_level99") {
            hour = 0;
            day = 1;
            month = 0;
        }
    }
    else if (type === "end") {
        minute = 59;
        second = 59;
        millisecond = 999;
        if (time_level === "time_level1") ;
        else if (time_level === "time_level2") {
            hour = 23;
        }
        else if (time_level === "time_level3") {
            hour = 23;
            day = getDayCount(year, month + 1);
        }
        else if (time_level === "time_level4") {
            if (month === 0 || month === 1 || month === 2) {
                month = 2;
            }
            else if (month === 3 || month === 4 || month === 5) {
                month = 5;
            }
            else if (month === 6 || month === 7 || month === 8) {
                month = 8;
            }
            else if (month === 9 || month === 10 || month === 11) {
                month = 11;
            }
            hour = 23;
            day = getDayCount(year, month + 1);
        }
        else if (time_level === "time_level5") {
            hour = 23;
            day = 31;
            month = 11;
        }
        else if (time_level === "time_level6") {
            hour = 23;
            day = 31;
            month = 11;
            year2 = date2.getFullYear();
            year_difference = year - year2;
            year_len = Math.ceil(year_difference / 2);
            year = year2 + year_len * 2;
        }
        else if (time_level === "time_level7") {
            hour = 23;
            day = 31;
            month = 11;
            year2 = date2.getFullYear();
            year_difference = year - year2;
            year_len = Math.ceil(year_difference / 3);
            year = year2 + year_len * 3;
        }
        else if (time_level === "time_level99") {
            hour = 23;
            day = 31;
            month = 11;
        }
    }
    return new Date(year, month, day, hour, minute, second, millisecond);
}
var TimeModel = (function (_super) {
    __extends(TimeModel, _super);
    function TimeModel(name, fieldName, type, data) {
        if (data === void 0) { data = []; }
        return _super.call(this, name, fieldName, type, data) || this;
    }
    TimeModel.prototype.init = function () {
        this.min = d3.min(this.data);
        this.max = d3.max(this.data);
        this.time_difference = this.max.getTime() - this.min.getTime();
        this.time_level = get_time_level(this.time_difference);
        this.time_group = fun_time_level[this.time_level](this.max, this.min);
        this.tickValues = this.time_group.times1;
        var _a = this, min = _a.min, max = _a.max, time_level = _a.time_level;
        this.domain = [beautifyDatetime(min, "start", time_level), beautifyDatetime(max, "end", time_level, min)];
        this.scale = d3.scaleTime().domain(this.domain).range(this.range);
    };
    TimeModel.prototype.reverse = function () {
    };
    return TimeModel;
}(Model));

var Table = (function () {
    function Table(db, schema) {
        this.columnIndex = {};
        this.columnNames = [];
        this.columnTypes = [];
        this.columnDefaults = [];
        this.rows = [];
        this.data = [];
        var name = schema.name, properties = schema.properties;
        this.db = db;
        this.name = name;
        var keys = Object.keys(properties);
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var value = properties[key];
            var type = void 0, defaults = void 0;
            if (typeof value === "string") {
                type = value;
                defaults = undefined;
            }
            else {
                type = value.type;
                defaults = value.default;
            }
            this.columnIndex[key] = i;
            this.columnNames.push(key);
            this.columnTypes.push(type);
            this.columnDefaults.push(defaults);
        }
    }
    Table.prototype.$resetIndex = function () {
        for (var i = 0; i < this.rows.length; i++) {
            var row = this.rows[i];
            row.$setIndex(i);
        }
    };
    Table.prototype.getName = function () {
        return this.name;
    };
    Table.prototype.getData = function () {
        return this.data;
    };
    Table.prototype.getRows = function () {
        return this.rows;
    };
    Table.prototype.getColumnLength = function () {
        return this.columnNames.length;
    };
    Table.prototype.getColumnIndex = function (key) {
        if (key === undefined) {
            return this.columnIndex;
        }
        else {
            return this.columnIndex[key];
        }
    };
    Table.prototype.drop = function () {
        this.db.drop(this.name);
    };
    Table.prototype.insert = function (data) {
        var rowData = [];
        var index = this.data.push(rowData) - 1;
        var rowIndex = [index];
        var row = new Row(this, rowIndex, rowData);
        this.rows.push(row);
        row.set(data);
        return row;
    };
    Table.prototype.delete = function (condition) {
        if (condition === undefined) {
            this.data = [];
            this.rows = [];
        }
        else if (typeof condition === "number") {
            delete this.data[condition];
            delete this.rows[condition];
        }
        this.$resetIndex();
        return this;
    };
    Table.prototype.update = function (condition, key, value) {
        if (typeof condition === "number") {
            var row = this.rows[condition];
            row.set(key, value);
            return row;
        }
    };
    Table.prototype.select = function (condition) {
        if (typeof condition === "number") {
            return this.rows[condition];
        }
        else {
            var array = [];
            var data = this.data;
            var relation = condition.split(' and ');
            for (var i = 0; i < relation.length; i++) {
                var rel = relation[i];
                var item = rel.split('=');
                var key = item[0];
                var value = item[1].split("'")[1];
                var columnIndex = this.columnIndex[key];
                if (key.indexOf('!') > -1) {
                    key = key.substring(0, key.length - 1);
                    columnIndex = this.columnIndex[key];
                    var type = this.columnTypes[columnIndex];
                    if (type === 'number') {
                        value = parseFloat(value);
                    }
                    else if (type === 'Date') {
                        value = parseTime(value);
                    }
                    for (var i_1 = 0; i_1 < data.length; i_1++) {
                        var row = data[i_1];
                        var val = row[columnIndex];
                        if (val !== value) {
                            array.push(row);
                        }
                    }
                }
                else if (key.indexOf('>') > -1) {
                    key = key.substring(0, key.length - 1);
                    columnIndex = this.columnIndex[key];
                    var type = this.columnTypes[columnIndex];
                    if (type === 'number') {
                        value = parseFloat(value);
                    }
                    else if (type === 'Date') {
                        value = parseTime(value);
                    }
                    for (var i_2 = 0; i_2 < data.length; i_2++) {
                        var row = data[i_2];
                        var val = row[columnIndex];
                        if (val >= value) {
                            array.push(row);
                        }
                    }
                }
                else if (key.indexOf('<') > -1) {
                    key = key.substring(0, key.length - 1);
                    columnIndex = this.columnIndex[key];
                    var type = this.columnTypes[columnIndex];
                    if (type === 'number') {
                        value = parseFloat(value);
                    }
                    else if (type === 'Date') {
                        value = parseTime(value);
                    }
                    for (var i_3 = 0; i_3 < data.length; i_3++) {
                        var row = data[i_3];
                        var val = row[columnIndex];
                        if (val <= value) {
                            array.push(row);
                        }
                    }
                }
                else {
                    var type = this.columnTypes[columnIndex];
                    if (type === 'number') {
                        value = parseFloat(value);
                    }
                    else if (type === 'Date') {
                        value = parseTime(value);
                    }
                    for (var i_4 = 0; i_4 < data.length; i_4++) {
                        var row = data[i_4];
                        var val = row[columnIndex];
                        if (val === value) {
                            array.push(row);
                        }
                    }
                }
                data = array;
                array = [];
            }
            return data;
        }
    };
    Table.prototype.columns = function (fields, data, callback) {
        var array = [];
        var fieldArr = fields.split(',');
        var fieldLen = fieldArr.length;
        if (data === undefined) {
            data = this.data;
        }
        else if (isFunction(data)) {
            callback = data;
            data = this.data;
        }
        else {
            data = data;
        }
        for (var i = 0; i < fieldLen; i++) {
            var field = fieldArr[i];
            var index = this.getColumnIndex(field);
            if (fieldLen > 1) {
                var fieldData = [];
                for (var j = 0; j < data.length; j++) {
                    var value = data[j][index];
                    if (callback) {
                        if (callback(value))
                            fieldData.push(value);
                    }
                    else {
                        fieldData.push(value);
                    }
                }
                array.push(fieldData);
            }
            else {
                for (var j = 0; j < data.length; j++) {
                    var value = data[j][index];
                    if (callback) {
                        if (callback(value))
                            array.push(value);
                    }
                    else {
                        array.push(value);
                    }
                }
            }
        }
        return array;
    };
    Table.prototype.field = function (name, data) {
        return data[this.getColumnIndex(name)];
    };
    Table.prototype.copy = function (newTableName) {
        var properties = {};
        var schema = { name: newTableName, properties: properties };
        var _a = this, columnNames = _a.columnNames, columnTypes = _a.columnTypes, columnDefaults = _a.columnDefaults;
        for (var i = 0; i < columnNames.length; i++) {
            var name = columnNames[i];
            var type = columnTypes[i];
            var defaults = columnDefaults[i];
            properties[name] = { type: type, defaults: defaults };
        }
        var copyTable = this.db.create(schema);
        for (var i = 0; i < this.data.length; i++) {
            copyTable.insert(this.data[i]);
        }
        return copyTable;
    };
    Table.prototype.min = function (field) {
        var min, columnIndex;
        var data = this.data;
        if (typeof field === "number") {
            columnIndex = field;
        }
        else {
            columnIndex = this.columnIndex[field];
        }
        min = data[0][columnIndex];
        for (var i = 1; i < data.length; i++) {
            var value = data[i][columnIndex];
            if (value < min) {
                min = value;
            }
        }
        return min;
    };
    Table.prototype.max = function (field) {
        var max, columnIndex;
        var data = this.data;
        if (typeof field === "number") {
            columnIndex = field;
        }
        else {
            columnIndex = this.columnIndex[field];
        }
        max = data[0][columnIndex];
        for (var i = 1; i < data.length; i++) {
            var value = data[i][columnIndex];
            if (value > max) {
                max = value;
            }
        }
        return max;
    };
    Table.prototype.range = function (scope) {
        var array = [];
        var data = this.data;
        for (var i = 0; i < scope.length; i++) {
            var _a = scope[i], field = _a.field, start = _a.start, end = _a.end;
            var min = void 0, max = void 0;
            if (start < end) {
                min = start;
                max = end;
            }
            else {
                min = end;
                max = start;
            }
            var columnIndex = void 0;
            if (typeof field === "number") {
                columnIndex = field;
            }
            else {
                columnIndex = this.columnIndex[field];
            }
            for (var i_5 = 0; i_5 < data.length; i_5++) {
                var row = data[i_5];
                var value = row[columnIndex];
                if (value >= min && value <= max) {
                    array.push(row);
                }
            }
            data = array;
            array = [];
        }
        return data;
    };
    return Table;
}());

var Rdb = (function () {
    function Rdb(name) {
        this.tables = {};
        this.name = name;
    }
    Rdb.prototype.getName = function () {
        return this.name;
    };
    Rdb.prototype.create = function (schema) {
        var table = new Table(this, schema);
        this.tables[schema.name] = table;
        return table;
    };
    Rdb.prototype.drop = function (name) {
        delete this.tables[name];
    };
    Rdb.prototype.table = function (name) {
        return this.tables[name];
    };
    return Rdb;
}());

var Legend = (function () {
    function Legend(legend) {
        var name = legend.name, color = legend.color, generator = legend.generator, fill = legend.fill, attribute = legend.attribute, clazz = legend.clazz;
        this.name = name;
        this.color = color;
        this.generator = generator;
        this.fill = fill;
        this.attribute = attribute || {};
        if (clazz)
            this.clazz = clazz;
        this.attribute['d'] = this.generator.size(Legend.DefaultLegendSize)();
        if (this.fill) {
            this.attribute['fill'] = this.color;
        }
        else {
            this.attribute['fill'] = 'none';
            this.attribute['stroke'] = this.color;
            this.attribute['stroke-width'] = Legend.DefaultStrokeWidth;
        }
    }
    Legend.prototype.draw = function (context, x, y, size) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (size === void 0) { size = Legend.DefaultLegendSize; }
        var attribute = clone(this.attribute);
        if (size !== Legend.DefaultLegendSize && size > 0) {
            attribute['d'] = this.generator.size(size)();
        }
        if (x !== 0 || y !== 0) {
            var transform = attribute['transform'] || '';
            attribute['transform'] = "translate(" + x + ", " + y + ")" + transform;
        }
        if (size > 0) {
            var path = new Path(attribute);
            context.append(path);
        }
        return context;
    };
    Legend.prototype.drawLegend = function (context, content, size, attr) {
        if (size === void 0) { size = 60; }
        var content15 = content;
        if (content.length > 15) {
            content15 = content.substring(0, 15) + '....';
        }
        var g1 = new G(attr).setView({ width: 148, height: 22, top: 5, bottom: 5, left: 5, right: 5, boxOrient: "horizontal" });
        context.append(g1);
        var rect = g1.append(new Rect({ width: 148, height: 22, class: 'legend-rect' }).setView({}));
        rect.on('contextmenu', function () { console.log(222); });
        var g2 = new G().setView({ width: 148, height: 22, top: 5, bottom: 5, left: 3, right: 5, boxOrient: "horizontal" });
        g1.append(g2);
        var line = g2.append(new Line({ x1: 0, y1: 6, x2: 25, y2: 6, stroke: this.color, class: 'legend-line' }).setView({}));
        var text = g2.append(new Text({ x: 28, y: 10, class: 'legend-text' }).setView({})).text(content15).append(new Title()).text(content);
        this.draw(g2, 15, 11, size);
        return context;
    };
    Legend.DefaultLegendSize = 20;
    Legend.DefaultStrokeWidth = 1;
    return Legend;
}());

var LegendManager = (function () {
    function LegendManager() {
        this.usedLegends = {};
        this.unusedLegends = [];
        for (var i = 0; i < LegendManager.legends.length; i++) {
            var legend = LegendManager.legends[i];
            this.unusedLegends.push(legend);
        }
    }
    LegendManager.prototype.add = function (key) {
        var unusedLegends = this.unusedLegends;
        if (unusedLegends.length > 0) {
            var legend = unusedLegends.shift();
            this.usedLegends[key] = legend;
            return legend;
        }
        else {
            var usedArray = Object.values(this.usedLegends);
            return usedArray[usedArray.length - 1];
        }
    };
    LegendManager.prototype.remove = function (key) {
        var legend = this.usedLegends[key];
        if (!legend) {
            return LegendManager.legends[0];
        }
        this.unusedLegends.push(legend);
        delete this.usedLegends[key];
        return legend;
    };
    LegendManager.prototype.get = function (key) {
        return this.usedLegends[key];
    };
    LegendManager.prototype.getSize = function () {
        return this.unusedLegends.length;
    };
    LegendManager.init = function () {
        LegendManager.legends.push(new Legend({
            name: 'solid_circle',
            color: 'Blue',
            generator: d3.symbol().type(d3.symbolCircle),
            fill: true
        }));
        LegendManager.legends.push(new Legend({
            name: 'hollow_circle',
            color: '#996600',
            generator: d3.symbol().type(d3.symbolCircle),
            fill: false
        }));
        LegendManager.legends.push(new Legend({
            name: 'solid_rect',
            color: 'Cyan',
            generator: d3.symbol().type(d3.symbolSquare),
            fill: true
        }));
        LegendManager.legends.push(new Legend({
            name: 'hollow_rect',
            color: '#6600FF',
            generator: d3.symbol().type(d3.symbolSquare),
            fill: false
        }));
        LegendManager.legends.push(new Legend({
            name: 'solid_triangle',
            color: 'Green',
            generator: d3.symbol().type(d3.symbolTriangle),
            fill: true
        }));
        LegendManager.legends.push(new Legend({
            name: 'hollow_triangle',
            color: 'Purple',
            generator: d3.symbol().type(d3.symbolTriangle),
            fill: false
        }));
        LegendManager.legends.push(new Legend({
            name: 'solid_inverted_triangle',
            color: 'LightBlue',
            generator: d3.symbol().type(d3.symbolTriangle),
            fill: true,
            attribute: { transform: 'rotate(180)' }
        }));
        LegendManager.legends.push(new Legend({
            name: 'hollow_inverted_triangle',
            color: '#9999FF',
            generator: d3.symbol().type(d3.symbolTriangle),
            fill: false,
            attribute: { transform: 'rotate(180)' }
        }));
        LegendManager.legends.push(new Legend({
            name: 'solid_rhombus',
            color: 'SeaGreen',
            generator: d3.symbol().type(d3.symbolDiamond),
            fill: true
        }));
        LegendManager.legends.push(new Legend({
            name: 'hollow_rhombus',
            color: 'Yellow',
            generator: d3.symbol().type(d3.symbolDiamond),
            fill: false
        }));
        LegendManager.legends.push(new Legend({
            name: 'solid_cross',
            color: 'DarkCyan',
            generator: d3.symbol().type(d3.symbolCross),
            fill: true
        }));
        LegendManager.legends.push(new Legend({
            name: 'hollow_cross',
            color: 'DarkGoldenRod',
            generator: d3.symbol().type(d3.symbolCross),
            fill: false
        }));
        for (var i = 0; i < LegendManager.legends.length; i++) {
            var legend = LegendManager.legends[i];
            LegendManager.legendsMap[legend.name] = legend;
        }
    };
    LegendManager.legends = [];
    LegendManager.legendsMap = {};
    LegendManager.LegendSizeMax = 12;
    return LegendManager;
}());
LegendManager.init();

var Style = (function (_super) {
    __extends(Style, _super);
    function Style(attribute) {
        return _super.call(this, attribute) || this;
    }
    Style.TagName = 'style';
    return Style;
}(SvgObject));

var BrushEvent = 'BrushEvent';
var TooltipsEvent = 'TooltipsEvent';
var ZoomEvent = 'ZoomEvent';
var TranslationEvent = 'TranslationEvent';
var MouseWheel = 'MouseWheel';
var MouseLeft = 'MouseLeft';

function before(fun) {
    return function (target, propertyKey, descriptor) {
        var oldMethod = descriptor.value;
        descriptor.value = function () {
            var rest = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                rest[_i] = arguments[_i];
            }
            fun.apply(this, rest);
            return oldMethod.apply(this, rest);
        };
    };
}
function after(fun) {
    return function (target, propertyKey, descriptor) {
        var oldMethod = descriptor.value;
        descriptor.value = function () {
            var rest = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                rest[_i] = arguments[_i];
            }
            var result = oldMethod.apply(this, rest);
            fun.apply(this, rest);
            return result;
        };
    };
}

function concat(first, second) {
    var url;
    if (first.endsWith('/')) {
        url = second.startsWith('/') ? first + second.substring(1) : first + second;
    }
    else {
        url = second.startsWith('/') ? first + second : first + '/' + second;
    }
    return url;
}

var MessageOption = {
    icon: 0,
    time: 1500,
    offset: 'rt',
};
var Message = (function () {
    function Message() {
    }
    Message.info = function (content, options, end) {
        options = options || __assign({ icon: 0 }, MessageOption);
        layui.layer.msg(content, options, end);
    };
    Message.success = function (content, options, end) {
        options = options || __assign({ icon: 1 }, MessageOption);
        layui.layer.msg(content, options, end);
    };
    Message.error = function (content, options, end) {
        options = options || __assign({ icon: 2 }, MessageOption);
        layui.layer.msg(content, options, end);
    };
    Message.warn = function (content, options, end) {
        options = options || __assign({ icon: 3 }, MessageOption);
        layui.layer.msg(content, options, end);
    };
    Message.msg = function (content, x, y) {
        if (x && typeof x === "object") {
            return layui.layer.msg(content, x, y);
        }
        else if (typeof x === "function") {
            return layui.layer.msg(content, x);
        }
        else {
            return layui.layer.msg(content);
        }
    };
    return Message;
}());

var defaultOption = {
    type: '',
    action: 'all',
    url: '',
    request: {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    },
    data: null,
    layout: {},
    view: {
        width: 1000,
        height: 500,
        top: 100,
        bottom: 100,
        left: 100,
        right: 100,
    },
    style: {
        lineWidth: 1,
        rotate: 0,
    }
};
var _fetch;
try {
    _fetch = window.fetch || require('node-fetch');
}
catch (e) {
    _fetch = require('node-fetch');
}
var fetch = _fetch;
var Chart = (function () {
    function Chart(selector) {
        this.action = 'all';
        this.state = {
            eventType: '',
            mouse: { isMove: false, isBrush: false },
            keyboard: { isCtrl: false, isShift: false },
            menuStatus: {},
        };
        this.cache = {};
        this.pointIdMap = {};
        this.modelMap = {};
        this.lineMap = {};
        this.legendManager = new LegendManager();
        this.seriesMap = {};
        this.backgroundImage = '';
        this.reverseAxis = false;
        this.db = new Rdb('wpchartsDB');
        this.selector = selector;
        this.option = clone(defaultOption);
        this.title = this.constructor.title || '';
    }
    Chart.prototype.setOption = function (option, callbacks) {
        this.option = extend(this.option, option);
        this.action = this.option.action || this.action;
        var self = this;
        var _a = this.option, url = _a.url, request = _a.request, body = _a.request.body;
        if (url) {
            if (typeof body === 'object') {
                this.option.request.body = formurlencoded(body);
            }
            fetch(url, request).then(function (response) {
                try {
                    return response.json();
                }
                catch (e) {
                    return response.text().then(function (data) {
                        return new Promise(function (resolve, reject) {
                            try {
                                resolve(JSON.parse(data));
                            }
                            catch (e) {
                                reject(e);
                                console.log('text:', data);
                            }
                        });
                    });
                }
            }).then(function (data) {
                self.option.data = data;
                self.init();
                if (callbacks && typeof callbacks === "function")
                    callbacks();
            }).catch(function (error) {
                console.error(error);
            });
        }
        else if (this.option.data) {
            this.init();
            if (callbacks && typeof callbacks === "function")
                callbacks();
        }
        return this;
    };
    Chart.prototype.init = function () {
        if (this.action !== 'reset')
            this.initData();
        this.initView();
        this.initBackground();
        this.initCSS();
        this.initModel();
        this.initLegend();
        this.initReverseAxis();
        this.initWarningValueLine();
        this.initAxis();
        this.initLines();
        this.initPoints();
        this.initTitle();
        this.initOther();
        this.initEvent();
        this.initMenu();
        return this;
    };
    Chart.prototype.initMenu = function () {
        this.menu = new Menu();
        this.svg.contextmenu(this.menu);
        var rootMenu = this.menu;
        var self = this;
        var resetMenuItem = new MenuItem({
            text: '重置',
            action: function () {
                console.log("重置");
                self.reset();
            }
        });
        var reverseYAxisMenuItem = new MenuItem({
            text: '反转Y轴',
            type: this.reverseAxis ? 'check' : 'normal',
            action: function () {
                console.log("反转Y轴");
                self.reverseAxis = !self.reverseAxis;
                self.reset(self.table.getData());
            }
        });
        var copyMenuItem = new MenuItem({
            text: '复制',
            type: 'menu',
        });
        var copyMenu = new Menu();
        var copyPNGMenuItem = new MenuItem({
            text: 'PNG',
            action: function () {
                console.log("复制PNG");
                self.copyPng();
            }
        });
        var copyEMFMenuItem = new MenuItem({
            text: 'EMF',
            action: function () {
                console.log("复制EMF");
                self.copyEmf();
            }
        });
        var downloadMenuItem = new MenuItem({
            text: '下载',
            type: 'menu',
        });
        var downloadMenu = new Menu();
        var downloadPNGMenuItem = new MenuItem({
            text: 'PNG',
            action: function () {
                console.log("下载PNG");
                self.downloadPng();
            }
        });
        var downloadEMFMenuItem = new MenuItem({
            text: 'EMF',
            action: function () {
                console.log("下载EMF");
                self.downloadEmf();
            }
        });
        rootMenu.append(resetMenuItem);
        var clazz = this.constructor.clazz;
        if (clazz === 'hydrograph' || clazz === 'distribution') {
            rootMenu.append(reverseYAxisMenuItem);
        }
        var warningValue = this.warningValue;
        if (warningValue && warningValue.Unit && warningValue.Values && warningValue.Values.length > 0) {
            var selection_1 = d3.selectAll('.warning-value-line');
            rootMenu.append(new MenuItem({
                text: '警戒值线',
                type: (selection_1 && selection_1.size() > 0) ? 'check' : 'normal',
                action: function (menuItem) {
                    console.log("绘制: 警戒值线");
                    selection_1 = d3.selectAll('.warning-value-line');
                    if (selection_1 && selection_1.size() > 0) {
                        menuItem.setType('normal');
                        selection_1.remove();
                        var commonlyLegend = d3.select('.commonly-legend');
                        if (commonlyLegend.size() > 0)
                            self.legendsComponent.getChildren(commonlyLegend.attr('_id')).hide();
                        var seriousLegend = d3.select('.serious-legend');
                        if (seriousLegend.size() > 0)
                            self.legendsComponent.getChildren(seriousLegend.attr('_id')).hide();
                    }
                    else {
                        menuItem.setType('check');
                        self.drawWarningValueLine();
                    }
                }
            }));
        }
        rootMenu.append(new MenuSeparator());
        rootMenu.append(copyMenuItem);
        copyMenuItem.append(copyMenu);
        copyMenu.append(copyPNGMenuItem);
        copyMenu.append(copyEMFMenuItem);
        rootMenu.append(downloadMenuItem);
        downloadMenuItem.append(downloadMenu);
        downloadMenu.append(downloadPNGMenuItem);
        downloadMenu.append(downloadEMFMenuItem);
        if (config.debug) {
            var keyEvent = (function () {
                document.onkeydown = function (e) {
                    if (e.keyCode === 38) {
                        alert("38");
                    }
                    else if (e.keyCode === 40) {
                        alert("40");
                    }
                    else if (e.keyCode === 37) {
                        alert("37");
                    }
                    else if (e.keyCode === 39) {
                        alert("39");
                    }
                    else if (e.keyCode === 32) {
                        alert("32");
                    }
                };
            })();
            rootMenu.append(new MenuSeparator());
            rootMenu.append(new MenuItem({
                text: 'debug',
                action: function () {
                    console.log("debug:", self);
                    Message.info('debug...');
                    layui.layer.confirm('您是否要<span style="color: red">保存粗差</span>？', {
                        title: ['操作', 'font-size:18px;'],
                        btn: ['保存粗差', '取消粗差'],
                        btnAlign: 'c',
                    }, function () {
                        Message.msg('<span style="color: darkgreen">保存粗差</span>');
                    }, function () {
                        Message.msg('取消粗差');
                    });
                }
            }));
            copyMenu.append(new MenuSeparator());
            copyMenu.append(new MenuItem({
                text: 'SVG',
                action: function () {
                    console.log("复制SVG");
                    self.copySvg();
                }
            }));
            downloadMenu.append(new MenuSeparator());
            downloadMenu.append(new MenuItem({
                text: 'SVG',
                action: function () {
                    console.log("下载SVG");
                    self.downloadSvg();
                }
            }));
        }
    };
    Chart.prototype.initView = function () {
        var _a = this.option.view, width = _a.width, height = _a.height, top = _a.top, bottom = _a.bottom, left = _a.left, right = _a.right;
        var rotate = this.option.style.rotate;
        this.remove();
        this.svg = new Svg(d3.select(this.selector), { width: width, height: height });
        if (rotate) {
            this.svg.transform("rotate(" + rotate + ")");
        }
        this.styleComponent = new Style({ "type": "text/css", "media": "screen" });
        this.topComponent = new Component({ attribute: { class: 'top' } });
        this.bottomComponent = new Component({ attribute: { class: 'bottom' } });
        this.leftComponent = new Component({ attribute: { class: 'left' } });
        this.rightComponent = new Component({ attribute: { class: 'right' } });
        this.gridComponent = new Component({ attribute: { class: 'grid' } });
        this.topComponent.setView({ x: 0, y: 0, width: width, height: top });
        this.bottomComponent.setView({ x: 0, y: height - bottom, width: width, height: bottom, left: left, right: right });
        this.leftComponent.setView({ x: 0, y: top, width: left, height: height - top - bottom });
        this.rightComponent.setView({ x: width - right, y: top, width: right, height: height - top - bottom });
        this.gridComponent.setView({ x: left, y: top, width: width - left - right, height: height - top - bottom });
        this.svg.append(this.styleComponent);
        this.svg.append(new Rect({ width: width, height: height, fill: 'white', class: 'background' }));
        this.svg.append(this.topComponent);
        this.svg.append(this.bottomComponent);
        this.svg.append(this.leftComponent);
        this.svg.append(this.rightComponent);
        this.svg.append(this.gridComponent);
        this.linesComponent = this.gridComponent.append(new Component({ attribute: { class: 'lines' } }));
        this.pointsComponent = this.gridComponent.append(new Component({ attribute: { class: 'points' } }));
        this.legendsComponent = new Component({ attribute: { class: 'legends' } }).setView({
            x: 50,
            y: 25,
            width: 900,
            height: 70,
            boxOrient: "horizontal"
        });
        this.topComponent.append(this.legendsComponent);
        var warningValue = this.warningValue;
        if (warningValue && warningValue.Unit && warningValue.Values && warningValue.Values.length > 0) {
            this.warningValueComponent = this.gridComponent.append(new Component({ attribute: { class: 'warning-value' } }));
        }
    };
    Chart.prototype.initBackground = function () {
        var _a = this.gridComponent.getView(), gw = _a.width, gh = _a.height;
        this.backgroundComponent = new Component({ attribute: { class: 'background' } });
        this.gridComponent.append(this.backgroundComponent);
        this.backgroundComponent.append(new Rect({ x: 0.5, y: 0, width: gw - 1, height: gh, fill: 'none', stroke: 'black', 'stroke-width': 1 }));
        if (isBrowser) {
            if (config.browser.chrome && config.os.group.indexOf('windows') > -1) {
                this.gridComponent.style({ cursor: 'url("/wpcharts/dist/css/image/empty-1x1-white.png"),crosshair' });
            }
            else {
                this.gridComponent.style({ cursor: 'url("/wpcharts/dist/css/image/empty-1x1.png"),crosshair' });
            }
        }
    };
    Chart.prototype.initWarningValueLine = function () {
        var _a = this, initWarningValue = _a.initWarningValue, warningValue = _a.warningValue, warningValueComponent = _a.warningValueComponent;
        if (warningValueComponent && initWarningValue && initWarningValue.length > 0) {
            if (initWarningValue[0] === warningValue.Unit) {
                this.drawWarningValueLine();
            }
        }
    };
    Chart.prototype.initReverseAxis = function () {
        var _a = this, modelMap = _a.modelMap, initReverse = _a.initReverse;
        for (var _i = 0, _b = Object.values(modelMap); _i < _b.length; _i++) {
            var model = _b[_i];
            if (initReverse && initReverse.includes(model.name)) {
                model.reverse();
            }
        }
        if (this.constructor.clazz === 'hydrograph') {
            this.drawReverseAxis();
        }
    };
    Chart.prototype.initCSS = function () {
        var self = this;
        if (isBrowser) {
            fetch("/wpcharts/dist/css/wpcharts.css").then(function (response) {
                return response.text();
            }).then(function (text) {
                self.styleComponent.text(text);
            }).catch(function (error) {
                console.error(error);
            });
        }
        else if (isNode) {
            var fs = require("fs");
            var style = fs.readFileSync('./lib/css/wpcharts.css').toString();
            self.styleComponent.text(style);
        }
    };
    Chart.prototype.initEvent = function () {
        var _this = this;
        var _a = this.gridComponent.getView(), gw = _a.width, gh = _a.height;
        var g = this.gridComponent.append(new G({ class: 'mouse-event' }));
        var hline = new Line({ x2: gw, stroke: 'red', 'stroke-width': 1 });
        var vline = new Line({ y2: gh, stroke: 'red', 'stroke-width': 1 });
        var rect = new Rect({ width: gw, height: gh, stroke: 'none', opacity: 0, 'pointer-events': 'all' });
        var tooltips = new Tooltips();
        var brushRect = new Rect({ class: 'brush', fill: '#777', 'fill-opacity': 0.5, stroke: '#fff', 'shape-rendering': 'crispEdges' });
        g.append(hline).hide();
        g.append(vline).hide();
        g.append(brushRect).hide();
        g.append(rect);
        g.append(tooltips);
        var timer;
        var startPosition;
        var endPosition;
        rect.on('mouseover', function () {
            d3.event.preventDefault();
            hline.show();
            vline.show();
        });
        rect.on('mouseout', function () {
            d3.event.preventDefault();
            hline.hide();
            vline.hide();
            setTimeout(function () { return tooltips.hide(); }, 200);
        });
        rect.on('mousedown', function (datum, index, groups) {
            d3.event.preventDefault();
            _this.state.mouse.isBrush = true;
            startPosition = d3.mouse(groups[index]);
            if (d3.event.ctrlKey) {
                _this.state.keyboard.isCtrl = true;
                _this.state.eventType = ZoomEvent;
                var x = startPosition[0], y = startPosition[1];
                startPosition = [x, 0];
            }
            else if (d3.event.shiftKey) {
                _this.state.keyboard.isShift = true;
                _this.state.eventType = BrushEvent;
            }
            else if (d3.event.button === 0) {
                console.log(3, d3.event);
                _this.state.eventType = TranslationEvent;
                if (isBrowser) {
                    _this.gridComponent.style({ cursor: 'pointer' });
                }
            }
            else {
                console.log(4, d3.event);
            }
        });
        rect.on('mouseup', function (datum, index, groups) {
            d3.event.preventDefault();
            brushRect.attr({ width: 0, height: 0, x: 0, y: 0 }).hide();
            endPosition = d3.mouse(groups[index]);
            if (_this.state.eventType === ZoomEvent) {
                var x = endPosition[0], y = endPosition[1];
                endPosition = [x, gh];
                _this.svg.dispatch(BrushEvent, { bubbles: false, cancelable: false, detail: { startPosition: startPosition, endPosition: endPosition } });
            }
            else if (_this.state.eventType === BrushEvent) {
                layui.layer.confirm('您是否要<span style="color: red">保存粗差</span>？', {
                    title: ['操作', 'font-size:18px;'],
                    btn: ['保存粗差', '取消粗差'],
                    btnAlign: 'c',
                }, function () {
                    Message.msg('<span style="color: darkgreen">保存粗差</span>');
                }, function () {
                    Message.msg('取消粗差');
                });
                _this.svg.dispatch(BrushEvent, { bubbles: false, cancelable: false, detail: { startPosition: startPosition, endPosition: endPosition } });
            }
            else if (_this.state.eventType === TranslationEvent) {
                _this.svg.dispatch(MouseLeft, { bubbles: false, cancelable: false, detail: { startPosition: startPosition, endPosition: endPosition } });
                if (isBrowser) {
                    if (config.browser.chrome && config.os.group.indexOf('windows') > -1) {
                        _this.gridComponent.style({ cursor: 'url("/wpcharts/dist/css/image/empty-1x1-white.png"),crosshair' });
                    }
                    else {
                        _this.gridComponent.style({ cursor: 'url("/wpcharts/dist/css/image/empty-1x1.png"),crosshair' });
                    }
                }
            }
            startPosition = undefined;
            endPosition = undefined;
            _this.state.eventType = '';
            _this.state.mouse.isBrush = false;
        });
        rect.on('mousemove', function (datum, index, groups) {
            d3.event.preventDefault();
            var mouse = d3.mouse(groups[index]);
            var x = mouse[0], y = mouse[1];
            if (x > 0 && y > 0) {
                var xDeviation = 0;
                var yDeviation = 0;
                if (startPosition) {
                    var sx = startPosition[0], sy = startPosition[1];
                    if (x > sx) {
                        xDeviation = 1.5;
                    }
                    else {
                        xDeviation = -1.5;
                    }
                    if (y > sy) {
                        yDeviation = 1.5;
                    }
                    else {
                        yDeviation = -1.5;
                    }
                }
                hline.attr({ y1: y + yDeviation, y2: y + yDeviation });
                vline.attr({ x1: x + xDeviation, x2: x + xDeviation });
                if (startPosition) {
                    if (_this.state.eventType === ZoomEvent) {
                        y = gh;
                        var sx = startPosition[0], sy = startPosition[1];
                        var w = Math.abs(x - sx);
                        var h = Math.abs(y - sy);
                        var mx = void 0, my = void 0;
                        if (x > sx) {
                            mx = sx;
                        }
                        else {
                            mx = sx - w;
                        }
                        if (y > sy) {
                            my = sy;
                        }
                        else {
                            my = sy - h;
                        }
                        brushRect.attr({ width: w, height: h, x: mx, y: my }).show();
                    }
                    else if (_this.state.eventType === BrushEvent) {
                        var sx = startPosition[0], sy = startPosition[1];
                        var w = Math.abs(x - sx);
                        var h = Math.abs(y - sy);
                        var mx = void 0, my = void 0;
                        if (x > sx) {
                            mx = sx;
                        }
                        else {
                            mx = sx - w;
                        }
                        if (y > sy) {
                            my = sy;
                        }
                        else {
                            my = sy - h;
                        }
                        brushRect.attr({ width: w, height: h, x: mx, y: my }).show();
                    }
                    else if (_this.state.eventType === TranslationEvent) ;
                }
            }
            else {
                return;
            }
            _this.state.mouse.isMove = true;
            tooltips.hide();
            clearTimeout(timer);
            timer = setTimeout(function () {
                _this.state.mouse.isMove = false;
                _this.svg.dispatch(TooltipsEvent, {
                    bubbles: false, cancelable: false, detail: {
                        mouse: mouse,
                        target: tooltips,
                    }
                });
            }, 200);
        });
        rect.on('mousewheel', function () {
            d3.event.preventDefault();
            var event = d3.event;
            var delta = 0;
            if (event.wheelDelta) {
                delta = event.wheelDelta / 120;
                if (window.opera)
                    delta = -delta;
            }
            else if (event.detail) {
                delta = -event.detail / 3;
            }
            if (delta > 0) {
                console.log('上', delta);
            }
            else if (delta < 0) {
                console.log('下', delta);
            }
            _this.svg.dispatch(MouseWheel, {
                bubbles: false, cancelable: false, detail: {
                    delta: delta
                }
            });
        });
    };
    Chart.prototype.initTitle = function () {
        var textComponent = new Text({ x: this.option.view.width / 2, y: 15, 'text-anchor': 'middle', 'dominant-baseline': 'middle' });
        this.topComponent.append(textComponent).text(this.title);
        textComponent.append(new Title()).text(this.title);
    };
    Chart.prototype.initAxis = function () {
        this.initXAxis();
        this.initYAxis();
    };
    Chart.prototype.initOther = function () {
        if (isBrowser) {
            fetch("/api/image/config").then(function (response) {
                return response.json();
            }).then(function (data) {
                extend(config, data);
            }).catch(function (error) {
                console.error(error);
                extend(config, { node: 'http://192.168.1.25:8888' });
            });
        }
    };
    Chart.prototype.clear = function () {
        this.cache = {};
        this.pointIdMap = {};
        this.modelMap = {};
        this.lineMap = {};
        this.legendManager = new LegendManager();
        this.table.delete();
    };
    Chart.prototype.remove = function () {
        d3.select(this.selector).select("svg").remove();
    };
    Chart.prototype.drawDottedLine = function (num, type) {
        var _a = this.gridComponent.getView(), width = _a.width, height = _a.height;
        var space = type === 'horizontal' ? height / num : width / num;
        if (type === 'horizontal') {
            for (var i = 1; i < num; i++) {
                var interval = space * i + 0.5;
                var line = new Line({ y1: interval, y2: interval, x2: width, stroke: 'black', 'stroke-width': 1, "stroke-dasharray": 2, opacity: 0.5 });
                this.backgroundComponent.append(line);
            }
        }
        else if (type === 'vertical') {
            for (var i = 1; i < num; i++) {
                var interval = space * i + 0.5;
                var line = new Line({ x1: interval, x2: interval, y2: height, stroke: 'black', 'stroke-width': 1, "stroke-dasharray": 2, opacity: 0.5 });
                this.backgroundComponent.append(line);
            }
        }
    };
    Chart.prototype.drawWarningValueLine = function () {
        var _a = this, selector = _a.selector, warningValue = _a.warningValue, modelMap = _a.modelMap, gridComponent = _a.gridComponent, warningValueComponent = _a.warningValueComponent;
        if (!warningValueComponent || !warningValue || !warningValue.Unit || !warningValue.Values || warningValue.Values.length <= 0)
            return;
        var warnColor = ['#FF99FF', '#FF99FF', '#FF0000', '#FF0000'];
        var commonlyLegend, seriousLegend;
        var width = gridComponent.getView().width;
        var Unit = warningValue.Unit, Values = warningValue.Values;
        var model = modelMap[Unit];
        if (!model)
            return;
        var scale = model.scale, minNice = model.minNice, maxNice = model.maxNice;
        for (var i = 0; i < Values.length; i++) {
            var value = Values[i];
            if (value >= minNice && value <= maxNice) {
                var y = scale(value);
                warningValueComponent.append(new Line({ x1: 1, x2: width - 1, y1: y, y2: y, class: 'warning-value-line', stroke: warnColor[i] }));
                var content = i === 0 || i === 1 ? '一般异常指标' : '严重异常指标';
                content = content + ' ' + Unit;
                if (!commonlyLegend && (i === 0 || i === 1)) {
                    commonlyLegend = new Legend({
                        name: 'commonlyLegend',
                        color: warnColor[i],
                        generator: d3.symbol().type(d3.symbolStar),
                        fill: false
                    });
                    var commonlyNode = d3.select(selector + " .commonly-legend");
                    if (commonlyNode.size() > 0) {
                        var legend = this.legendsComponent.getChildren(commonlyNode.attr('_id'));
                        legend.show();
                    }
                    else {
                        commonlyLegend.drawLegend(this.legendsComponent, content, 0, { class: 'commonly-legend' });
                    }
                }
                else if (!seriousLegend && (i === 2 || i === 3)) {
                    seriousLegend = new Legend({
                        name: 'seriousLegend',
                        color: warnColor[i],
                        generator: d3.symbol().type(d3.symbolStar),
                        fill: false
                    });
                    var seriousNode = d3.select(selector + " .serious-legend");
                    if (seriousNode.size() > 0) {
                        var legend = this.legendsComponent.getChildren(seriousNode.attr('_id'));
                        legend.show();
                    }
                    else {
                        seriousLegend.drawLegend(this.legendsComponent, content, 0, { class: 'serious-legend' });
                    }
                }
            }
        }
    };
    Chart.prototype.drawReverseAxis = function () {
        var _a = this, modelMap = _a.modelMap, reverseAxis = _a.reverseAxis;
        for (var _i = 0, _b = Object.values(modelMap); _i < _b.length; _i++) {
            var model = _b[_i];
            if (model.name !== 'time') {
                if (reverseAxis) {
                    model.reverse();
                }
            }
        }
    };
    Chart.prototype.reset = function (data) {
        if (data === null)
            return this;
        this.action = 'reset';
        this.clear();
        var _a = this, table = _a.table, tableBackup = _a.tableBackup;
        if (data === undefined)
            data = tableBackup.getData();
        for (var i = 0; i < data.length; i++) {
            table.insert(data[i]);
        }
        return this.init();
    };
    Chart.prototype.outputPreprocessing = function () {
        this.menu.hide();
    };
    Chart.prototype.outputSvg = function (callbacks) {
        if (callbacks && isFunction(callbacks[0])) {
            callbacks[0]();
        }
        this.outputPreprocessing();
        var svg = this.svg.getSvgContext();
        var hideTime;
        var clazz = this.constructor.clazz;
        if (clazz === 'distribution' || clazz === "distribution-background") {
            hideTime = true;
        }
        if (hideTime) {
            svg.selectAll(".time-axis").style("display", "none");
        }
        var serializer = new XMLSerializer();
        var source = serializer.serializeToString(svg.node());
        source = '<?xml version="1.0" standalone="no"?>\r\n' + source;
        if (hideTime) {
            svg.selectAll(".time-axis").style("display", null);
        }
        if (callbacks && isFunction(callbacks[1])) {
            callbacks[1]();
        }
        return source;
    };
    Chart.prototype.outputPng = function (svgDataURL) {
        return __awaiter(this, void 0, Promise, function () {
            var loadImg, canvas, graph, imgUrls, backgroundImage, backgroundImageElement, href, x, y, width, height, imgObjs, i, _a, img, x, y, width, height;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        loadImg = function (src) { return __awaiter(_this, void 0, Promise, function () {
                            var paths, promise;
                            return __generator(this, function (_a) {
                                paths = Array.isArray(src) ? src : [src];
                                promise = paths.map(function (path) {
                                    return new Promise(function (resolve, reject) {
                                        var img = new Image();
                                        img.setAttribute("crossOrigin", "anonymous");
                                        img.src = path.href;
                                        img.onload = function () {
                                            path.object = img;
                                            resolve(path);
                                        };
                                        img.onerror = function (err) {
                                            reject(err);
                                        };
                                    });
                                });
                                return [2, Promise.all(promise)];
                            });
                        }); };
                        canvas = document.createElement("canvas");
                        canvas.width = this.option.view.width;
                        canvas.height = this.option.view.height;
                        graph = canvas.getContext("2d");
                        graph.fillStyle = "#FFFFFF";
                        graph.fillRect(0, 0, canvas.width, canvas.height);
                        imgUrls = [];
                        backgroundImage = this.backgroundImage;
                        if (backgroundImage) {
                            backgroundImageElement = document.querySelector(this.selector + ' .background-image');
                            if (backgroundImageElement) {
                                href = backgroundImage;
                                x = backgroundImageElement.x.baseVal.value;
                                y = backgroundImageElement.y.baseVal.value;
                                width = backgroundImageElement.width.baseVal.value;
                                height = backgroundImageElement.height.baseVal.value;
                                imgUrls.push({ href: href, x: x, y: y, width: width, height: height });
                            }
                        }
                        imgUrls.push({ href: svgDataURL, x: 0, y: 0, width: canvas.width, height: canvas.height });
                        return [4, loadImg(imgUrls)];
                    case 1:
                        imgObjs = _b.sent();
                        for (i = 0; i < imgObjs.length; i++) {
                            _a = imgObjs[i], img = _a.object, x = _a.x, y = _a.y, width = _a.width, height = _a.height;
                            graph.drawImage(img, x, y, width, height);
                        }
                        return [2, canvas.toDataURL("image/png")];
                }
            });
        });
    };
    Chart.prototype.downloadFile_last = function (content, filename, isConvert) {
        if (isConvert === void 0) { isConvert = false; }
        filename = filename || this.title + '_' + formatTimeSimple(new Date());
        if (config.browser.ie) {
            window.saveAs(new Blob([content]), filename);
        }
        else {
            if (isConvert) {
                var blob = new Blob([content]);
                content = URL.createObjectURL(blob);
            }
            var aEle = document.createElement("a");
            aEle.download = filename;
            aEle.href = content;
            aEle.click();
        }
    };
    Chart.prototype.downloadFile = function (content, filename) {
        filename = filename || this.title + '_' + formatTimeSimple(new Date()) + '.tmp';
        if (typeof content === "string") {
            content = new Blob([content]);
        }
        else if (!(content instanceof Blob)) {
            throw new Error('download data not is blob');
        }
        var saveAs = window.saveAs;
        saveAs(content, filename);
    };
    Chart.prototype.downloadImage = function (format) {
        var self = this;
        var filename = this.title + '_' + formatTimeSimple(new Date()) + "." + format;
        var content = this.outputSvg();
        var url = concat(config.node, '/image/svg/' + format);
        if (this.backgroundImage) {
            url += '?img=' + this.backgroundImage;
        }
        fetch(url, {
            method: 'POST',
            body: content,
            mode: 'cors',
            headers: {
                'Content-Type': 'text/plain; charset=utf-8'
            }
        }).then(function (response) {
            return response.blob();
        }).then(function (data) {
            self.downloadFile(data, filename);
        }).catch(function (error) {
            console.error(error);
        });
    };
    Chart.prototype.downloadSvg = function () {
        var filename = this.title + '_' + formatTimeSimple(new Date()) + ".svg";
        var content = this.outputSvg();
        this.downloadFile(content, filename);
    };
    Chart.prototype.downloadPng_last = function () {
        var self = this;
        var filename = self.title + '_' + formatTimeSimple(new Date()) + ".png";
        var svg = this.svg.getSvgContext();
        var svgSourceString = this.outputSvg();
        var svgDataURL = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgSourceString);
        var outputPng = this.outputPng(svgDataURL);
        outputPng.then(function (dataURL) {
            self.downloadFile(dataURL, filename);
        }).catch(function (err) {
            console.log("图片加载失败:", err);
        });
    };
    Chart.prototype.downloadPng = function () {
        this.downloadImage('png');
    };
    Chart.prototype.downloadEmf = function () {
        this.downloadImage('emf');
    };
    Chart.prototype.selectNodeCopy = function (targetNode) {
        if (window.getSelection) {
            var selection = window.getSelection();
            var range = document.createRange();
            range.selectNode(targetNode);
            try {
                selection.removeAllRanges();
            }
            catch (e) {
                console.error('selectNodeCopy:', e);
            }
            selection.addRange(range);
        }
        else if (document.body.createTextRange) {
            var range = document.body.createTextRange();
            range.moveToElementText(targetNode);
            range.select();
        }
        document.execCommand('copy');
    };
    Chart.prototype.copyText = function (text, callback) {
        var copyId = 'copy_input';
        var tag = document.createElement('input');
        tag.setAttribute('id', copyId);
        tag.value = text;
        document.getElementsByTagName('body')[0].appendChild(tag);
        document.getElementById(copyId).select();
        document.execCommand('copy');
        if (config.browser.ie) {
            tag.removeNode(true);
        }
        else {
            tag.remove();
        }
        if (callback) {
            callback(text);
        }
    };
    Chart.prototype.copyImage = function (url, callback) {
        var self = this;
        var copyId = 'copy_input';
        var tag = document.createElement('img');
        tag.setAttribute('id', copyId);
        tag.src = url;
        document.getElementsByTagName('body')[0].appendChild(tag);
        tag.onload = function () {
            self.selectNodeCopy(tag);
            if (config.browser.ie) {
                tag.removeNode(true);
            }
            else {
                tag.remove();
            }
        };
        if (callback) {
            callback(url);
        }
    };
    Chart.prototype.copySvg = function () {
        console.log('copySvg: run');
        var content = this.outputSvg();
        this.copyText(content);
    };
    Chart.prototype.copyPng = function () {
        var self = this;
        var svg = this.svg.getSvgContext();
        var content = this.outputSvg();
        var url = concat(config.node, '/image/svg/png?cache=true');
        if (this.backgroundImage) {
            url += '&img=' + this.backgroundImage;
        }
        fetch(url, {
            method: 'POST',
            body: content,
            mode: 'cors',
            headers: {
                'Content-Type': 'text/plain; charset=utf-8'
            }
        }).then(function (response) {
            return response.text();
        }).then(function (text) {
            console.log("cache image url:", text);
            self.copyImage(text);
        }).catch(function (error) {
            console.error(error);
        });
    };
    Chart.prototype.copyEmf = function () {
        var self = this;
        var svg = this.svg.getSvgContext();
        var content = this.outputSvg();
        var url = concat(config.node, '/image/svg/emf?cache=true');
        if (this.backgroundImage) {
            url += '&img=' + this.backgroundImage;
        }
        fetch(url, {
            method: 'POST',
            body: content,
            mode: 'cors',
            headers: {
                'Content-Type': 'text/plain; charset=utf-8'
            }
        }).then(function (response) {
            return response.text();
        }).then(function (text) {
            console.log("cache image url:", text);
            self.copyImage(text);
        }).catch(function (error) {
            console.error(error);
        });
    };
    Chart.clazz = "chart";
    Chart.title = "基础图表";
    __decorate([
        before(function () { return console.log('copySvg: before'); }),
        after(function () { return console.log('copySvg: after'); })
    ], Chart.prototype, "copySvg", null);
    return Chart;
}());
var ChartInstance = (function (_super) {
    __extends(ChartInstance, _super);
    function ChartInstance() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ChartInstance.prototype.initData = function () {
    };
    ChartInstance.prototype.initModel = function () {
    };
    ChartInstance.prototype.initXAxis = function () {
    };
    ChartInstance.prototype.initYAxis = function () {
    };
    ChartInstance.prototype.initLines = function () {
    };
    ChartInstance.prototype.initPoints = function () {
    };
    ChartInstance.prototype.initLegend = function () {
    };
    return ChartInstance;
}(Chart));

var NumberInfo = (function () {
    function NumberInfo(num) {
        this.numArr = [];
        this.integerDigit = 0;
        this.decimalDigit = 0;
        this.integerArr = [];
        this.decimalArr = [];
        this.num = num;
        this.numStr = num.toString();
        this.decimalPointIndex = this.numStr.indexOf('.');
        this.isMinus = num < 0;
        var start = 0;
        if (this.isMinus)
            start = 1;
        var array = this.numStr.split('.');
        for (var i = start; i < array[0].length; i++) {
            this.integerArr.push(parseInt(array[0][i]));
        }
        if (this.decimalPointIndex > -1) {
            for (var i = 0; i < array[1].length; i++) {
                this.decimalArr.push(parseInt(array[1][i]));
            }
        }
        this.integerDigit = this.integerArr.length;
        this.decimalDigit = this.decimalArr.length;
        this.numArr = __spreadArrays(this.integerArr, this.decimalArr);
    }
    NumberInfo.prototype.nice = function () {
        var numArrNew = clone(this.numArr);
        var numNew = this.beautiful(numArrNew);
        return numNew;
    };
    NumberInfo.prototype.beautiful = function (numArr) {
        var numNew = 0;
        var isCarry = false;
        var ordinal;
        if (this.integerDigit >= 2) {
            isCarry = this.addFigures(numArr);
            if (isCarry) {
                ordinal = this.integerDigit + 1;
                numNew = Math.pow(10, (ordinal - 1)) * numArr[0] + Math.pow(10, (ordinal - 2)) * numArr[1] + Math.pow(10, (ordinal - 3)) * numArr[2];
            }
            else {
                ordinal = this.integerDigit;
                numNew = Math.pow(10, (ordinal - 1)) * numArr[0] + Math.pow(10, (ordinal - 2)) * numArr[1];
            }
        }
        else if (this.integerArr[0] > 0) {
            isCarry = this.addFigures(numArr);
            if (isCarry) {
                numNew = 10 * numArr[0] + numArr[1] + 0.1 * numArr[2];
            }
            else {
                numNew = numArr[0] + 0.1 * numArr[1];
            }
        }
        else {
            numArr.shift();
            var numZero = [];
            var numNum = [];
            for (var i = 0; i < numArr.length; i++) {
                if (numArr[i] === 0) {
                    numZero.push(0);
                }
                else {
                    numNum = [numArr[i], numArr[i + 1]];
                    break;
                }
            }
            isCarry = this.addFigures(numNum);
            if (numZero.length === 0) {
                if (isCarry) {
                    numNew = numNum[0] + Math.pow(10, (-1)) * numNum[1] + Math.pow(10, (-2)) * numNum[2];
                }
                else {
                    numNew = Math.pow(10, (-1)) * numNum[0] + Math.pow(10, (-2)) * numNum[1];
                }
            }
            else {
                if (isCarry) {
                    numNew = Math.pow(10, (-numZero.length)) * numNum[0] + Math.pow(10, (-numZero.length - 1)) * numNum[1] + Math.pow(10, (-numZero.length - 2)) * numNum[2];
                }
                else {
                    numNew = Math.pow(10, (-numZero.length - 1)) * numNum[0] + Math.pow(10, (-numZero.length - 2)) * numNum[1];
                }
            }
        }
        return numNew;
    };
    NumberInfo.prototype.addFigures = function (numArr) {
        var isCarry = false;
        var second = 1;
        switch (numArr[second]) {
            case 9:
                numArr[second] = 8;
                break;
            case 8:
                numArr[second] = 8;
                break;
            case 7:
                numArr[second] = 8;
                break;
            case 6:
                numArr[second] = 6;
                break;
            case 5:
                numArr[second] = 5;
                break;
            case 4:
                numArr[second] = 4;
                break;
            case 3:
                numArr[second] = 4;
                break;
            case 2:
                numArr[second] = 2;
                break;
            case 1:
                numArr[second] = 1;
                break;
            case 0:
                numArr[second] = 0;
                break;
            default:
                break;
        }
        return isCarry;
    };
    NumberInfo.prototype.addFigures_bak = function (numArr) {
        var isCarry = false;
        var first = 0, second = 1;
        switch (numArr[second]) {
            case 9:
                numArr[second] = 0;
                if (numArr[first] === 9) {
                    numArr[first] = 0;
                    numArr.unshift(1);
                    isCarry = true;
                }
                else {
                    numArr[first] = numArr[first] + 1;
                    numArr[second] = 0;
                }
                break;
            case 8:
                numArr[second] = 0;
                if (numArr[first] === 9) {
                    numArr[first] = 0;
                    numArr.unshift(1);
                    isCarry = true;
                }
                else {
                    numArr[first] = numArr[first] + 1;
                    numArr[second] = 0;
                }
                break;
            case 7:
                numArr[second] = 8;
                break;
            case 6:
                numArr[second] = 8;
                break;
            case 5:
                numArr[second] = 6;
                break;
            case 4:
                numArr[second] = 5;
                break;
            case 3:
                numArr[second] = 4;
                break;
            case 2:
                numArr[second] = 4;
                break;
            case 1:
                numArr[second] = 2;
                break;
            case 0:
                numArr[second] = 1;
                break;
            default:
                break;
        }
        return isCarry;
    };
    NumberInfo.prototype.niceMin = function (stepNumInfo) {
        if (stepNumInfo.decimalPointIndex > -1) {
            var n = stepNumInfo.decimalArr.length - 1;
            var toNum = stepNumInfo.decimalArr[n];
            var num = this.decimalArr[n];
            this.decimalArr[n] = this.beautifulNumber(num, toNum);
            var decArr = [];
            for (var i = 0; i <= n; i++) {
                decArr.push(this.decimalArr[i]);
            }
            this.decimalArr = decArr;
        }
        else {
            for (var i = 0; i < stepNumInfo.integerArr.length; i++) {
                if (stepNumInfo.integerArr[i] === 0) {
                    this.integerArr[i] = 0;
                }
                else {
                    this.integerArr[i] = this.beautifulNumber(this.integerArr[i], stepNumInfo.integerArr[i]);
                    break;
                }
            }
            this.decimalArr = [];
        }
        return parseFloat(this.toStr());
    };
    NumberInfo.prototype.beautifulNumber = function (num, toNum) {
        if (toNum === 0) {
            switch (num) {
                case 9:
                    return 8;
                case 8:
                    return 8;
                case 7:
                    return 6;
                case 6:
                    return 6;
                case 5:
                    return 5;
                case 4:
                    return 4;
                case 3:
                    return 2;
                case 2:
                    return 2;
                case 1:
                    return 1;
                case 0:
                    return 0;
                default:
                    break;
            }
        }
        else if (toNum === 1) {
            return num;
        }
        else if (toNum === 2) {
            switch (num) {
                case 9:
                    return 8;
                case 8:
                    return 8;
                case 7:
                    return 6;
                case 6:
                    return 6;
                case 5:
                    return 4;
                case 4:
                    return 4;
                case 3:
                    return 2;
                case 2:
                    return 2;
                case 1:
                    return 0;
                case 0:
                    return 0;
                default:
                    break;
            }
        }
        else if (toNum === 5) {
            return 5;
        }
        return toNum;
    };
    NumberInfo.prototype.toStr = function () {
        var s = this.isMinus ? '-' : '';
        for (var i = 0; i < this.integerArr.length; i++) {
            if (this.integerArr[i] !== null && this.integerArr[i] !== undefined) {
                s += this.integerArr[i].toString();
            }
        }
        if (this.decimalArr.length > 0) {
            s += '.';
            for (var i = 0; i < this.decimalArr.length; i++) {
                if (this.decimalArr[i] !== null && this.decimalArr[i] !== undefined) {
                    s += this.decimalArr[i].toString();
                }
            }
        }
        return s;
    };
    return NumberInfo;
}());

var LinearModel = (function (_super) {
    __extends(LinearModel, _super);
    function LinearModel(name, fieldName, type, data) {
        if (data === void 0) { data = []; }
        return _super.call(this, name, fieldName, type, data) || this;
    }
    LinearModel.prototype.init = function () {
        this.min = d3.min(this.data);
        this.max = d3.max(this.data);
        this.tickValues = this.nice(this.min, this.max, this.ticks);
        this.minNice = this.tickValues[0];
        this.maxNice = this.tickValues[this.tickValues.length - 1];
        this.domain = [this.minNice, this.maxNice];
        this.scale = d3.scaleLinear().domain(this.domain).range(this.range);
    };
    LinearModel.prototype.reverse = function () {
        this.range = this.range.reverse();
        this.scale = d3.scaleLinear().domain(this.domain).range(this.range);
    };
    LinearModel.prototype.nice = function (min, max, size) {
        var tickNumber = size || 7;
        var step = (max - min) / tickNumber;
        var minNew = min - step * 0.8;
        var maxNew = max + step * 0.8;
        var stepNew = (maxNew - minNew) / tickNumber;
        var stepNumInfo = new NumberInfo(stepNew);
        var stepNice = stepNumInfo.nice();
        stepNice = stepNice || stepNew;
        var minInfo = new NumberInfo(minNew);
        var minNice = minInfo.niceMin(new NumberInfo(stepNice));
        minNice = minNice || minNew;
        if (Math.abs(minNice - minNew) > Math.abs(stepNice)) {
            minNice = minNew;
        }
        var tickValues = [];
        for (var i = 0; i <= tickNumber; i++) {
            tickValues.push(minNice + stepNice * i);
        }
        var maxNice = tickValues[tickValues.length - 1];
        if (minNice > min || maxNice < max) {
            tickValues = [];
            for (var i = 0; i <= tickNumber; i++) {
                tickValues.push(minNew + stepNew * i);
            }
        }
        return tickValues;
    };
    return LinearModel;
}(Model));

var Axis = (function (_super) {
    __extends(Axis, _super);
    function Axis(property) {
        var _this = _super.call(this, property) || this;
        _this.model = property.model;
        _this.type = property.type;
        return _this;
    }
    Axis.ClassName = 'axis';
    return Axis;
}(Component));

var Circle = (function (_super) {
    __extends(Circle, _super);
    function Circle(attribute) {
        return _super.call(this, attribute) || this;
    }
    Circle.TagName = 'circle';
    return Circle;
}(SvgObject));

var TimeAxis = (function (_super) {
    __extends(TimeAxis, _super);
    function TimeAxis(property) {
        return _super.call(this, property) || this;
    }
    TimeAxis.prototype.draw = function (parentSvgContext) {
        _super.prototype.draw.call(this, parentSvgContext);
        this._drawAxis();
        return this;
    };
    TimeAxis.prototype._drawAxis = function () {
        var _a = this, model = _a.model, view = _a.view;
        var _b = view, width = _b.width, height = _b.height;
        var _c = model, data = _c.data, scale = _c.scale, time_group = _c.time_group;
        var click = this.property.click;
        if (click && typeof click === "function") {
            var clickAxis = this.append(new G({ class: 'clickAxis' }).setView({ width: width, height: 15 }));
            var svgContext = clickAxis.getSvgContext();
            for (var i = 0, len = data.length; i < len; i++) {
                var date = data[i];
                var xAxis_circle_x = scale(date);
                clickAxis.append(new Circle({
                    cx: xAxis_circle_x,
                    cy: 4,
                    r: 3,
                    fill: 'green',
                    stroke: 'orange',
                    "stroke-width": 0,
                    "data-time": formatTime(date),
                })).on("click", function (a, b, c) {
                    click(c[b].attributes["data-time"].nodeValue);
                });
            }
        }
        var timeAxis = this.append(new G({ class: 'timeAxis' }).setView({ width: width, height: height - 15 }));
        var line1 = timeAxis.append(new Line({ x2: width, class: 'tick-line' }));
        var line2 = timeAxis.append(new Line({ y1: 20, x2: width, y2: 20, class: 'tick-line' }));
        var tick_group = timeAxis.append(new G()).classed('tick-group', true).transform('translate(0.5, 0)');
        var ticks1_len = time_group.times1.length;
        var tick1_width = width / ticks1_len;
        var tick1_text = tick1_width / 2;
        var tick1 = tick_group.append(new G()).classed('tick1', true);
        for (var i = 0; i < ticks1_len; i++) {
            var tick = tick1.append(new G()).classed('tick', true).transform("translate(" + tick1_width * i + ", 0)");
            tick.append(new Line({ y2: 20, class: 'tick-line' }));
            tick.append(new Text({ class: 'tick-text' })).text(time_group.times1[i]).transform("translate(" + tick1_text + ", -3)");
        }
        var t = tick1.append(new G()).classed('tick', true).transform("translate(" + (width - 1) + ", 0)");
        t.append(new Line({ y2: 20, class: 'tick-line' }));
        if (time_group.times2.length > 0) {
            var line3 = timeAxis.append(new Line({ y1: 40, x2: width, y2: 40, class: 'tick-line' }));
            var tick2 = tick_group.append(new G()).classed('tick2', true).transform("translate(0, 20)");
            tick2.append(new G()).classed('tick', true).append(new Line({ y2: 20, class: 'tick-line' }));
            var ticks2_len = time_group.times2.length;
            var tick2_width = 0;
            var tick2_text = 0;
            for (var j = 0; j < ticks2_len; j++) {
                var time2 = time_group.times2[j];
                tick2_width += tick1_width * time2.len;
                tick2_text = tick1_width * time2.len / 2;
                var tick = tick2.append(new G()).classed('tick', true);
                if (j === ticks2_len - 1) {
                    tick.transform("translate(" + (tick2_width - 1) + ", 0)");
                }
                else {
                    tick.transform("translate(" + tick2_width + ", 0)");
                }
                tick.append(new Line({ y2: 20, class: 'tick-line' }));
                tick.append(new Text({ class: 'tick-text' })).text(time2.text).transform("translate(" + -tick2_text + ", -3)");
            }
        }
    };
    TimeAxis.ClassName = 'time-axis ' + Axis.ClassName;
    return TimeAxis;
}(Axis));

var LinearAxis = (function (_super) {
    __extends(LinearAxis, _super);
    function LinearAxis(property) {
        return _super.call(this, property) || this;
    }
    LinearAxis.prototype.draw = function (parentSvgContext) {
        _super.prototype.draw.call(this, parentSvgContext);
        this._drawAxis();
        return this;
    };
    LinearAxis.prototype._drawAxis = function () {
        var _a = this, view = _a.view, model = _a.model, type = _a.type;
        var _b = view, width = _b.width, height = _b.height;
        var _c = model, tickSize = _c.tickSize, tickPadding = _c.tickPadding, tickValues = _c.tickValues, scale = _c.scale, name = _c.name;
        var axis, x, y;
        if (type === 'axisTop') {
            axis = d3.axisTop(scale);
            x = width + 40;
            y = 0;
        }
        else if (type === 'axisBottom') {
            axis = d3.axisBottom(scale);
            x = width + 40;
            y = 0;
        }
        else if (type === 'axisLeft') {
            axis = d3.axisLeft(scale);
            x = 0;
            y = -10;
        }
        else if (type === 'axisRight') {
            axis = d3.axisRight(scale);
            x = 0;
            y = -10;
        }
        else {
            return this;
        }
        var format = d3.format(".2f");
        axis.tickSize(tickSize).tickPadding(tickPadding).tickValues(tickValues).tickFormat(format);
        this.call(axis);
        this.append(new Text({ x: x, y: y, class: 'axis-text' })).text(name);
    };
    LinearAxis.ClassName = 'linear-axis ' + Axis.ClassName;
    return LinearAxis;
}(Axis));

function lately(dataset, value, limitError) {
    if (!dataset || dataset.length === 0)
        return null;
    var minDifference = limitError;
    var minValue;
    var isHit = false;
    for (var i = 0; i < dataset.length; i++) {
        var currentValue = dataset[i];
        var currentDifference = Math.abs(currentValue - value);
        if (currentDifference < minDifference) {
            minDifference = currentDifference;
            minValue = currentValue;
            isHit = true;
        }
    }
    return isHit ? minValue : null;
}

var LineObject = (function () {
    function LineObject(pointId, unit, legend) {
        this.pointId = pointId;
        this.unit = unit;
        this.legend = legend;
        this.id = LineObject.id(pointId, unit, legend);
    }
    LineObject.prototype.draw = function (lineComponent, pointComponent) {
        this.drawLine(lineComponent);
        this.drawPoint(pointComponent);
    };
    LineObject.prototype.drawLine = function (component) {
        var _a = this, table = _a.table, xModel = _a.xModel, yModel = _a.yModel, data = _a.data, legendObject = _a.legendObject;
        var xFieldName = xModel.fieldName, xScale = xModel.scale;
        var yFieldName = yModel.fieldName, yScale = yModel.scale;
        if (!data || data.length === 0)
            return;
        var lineGenerator = d3.line()
            .x(function (d, index, data) {
            return xScale(table.field(xFieldName, d));
        })
            .y(function (d, index, data) {
            return yScale(table.field(yFieldName, d));
        });
        component.append(new Path({ d: lineGenerator(data), stroke: legendObject.color, class: 'line' }));
    };
    LineObject.prototype.drawPoint = function (component) {
        var _a = this, table = _a.table, xModel = _a.xModel, yModel = _a.yModel, data = _a.data, legendObject = _a.legendObject;
        var xFieldName = xModel.fieldName, xScale = xModel.scale;
        var yFieldName = yModel.fieldName, yScale = yModel.scale;
        if (!data || data.length === 0)
            return;
        var pointsLength = data.length;
        var pointsSpace = Math.floor(data.length / 10);
        var point, j, x, y;
        if (pointsLength <= 12) {
            for (j = 0; j < pointsLength; j++) {
                point = data[j];
                x = xScale(table.field(xFieldName, point));
                y = yScale(table.field(yFieldName, point));
                legendObject.draw(component, x, y);
            }
        }
        else {
            for (j = 1; j <= 10; j++) {
                if (pointsLength === (j * pointsSpace)) {
                    point = data[j * pointsSpace - Math.floor(pointsSpace / 2)];
                }
                else {
                    point = data[j * pointsSpace];
                }
                x = xScale(table.field(xFieldName, point));
                y = yScale(table.field(yFieldName, point));
                legendObject.draw(component, x, y);
            }
            legendObject.draw(component, xScale(table.field(xFieldName, data[0])), yScale(table.field(yFieldName, data[0])));
            legendObject.draw(component, xScale(table.field(xFieldName, data[pointsLength - 1])), yScale(table.field(yFieldName, data[pointsLength - 1])));
        }
    };
    LineObject.prototype.generateLegendName = function (tags) {
        var map = {};
        var arr = [];
        for (var i = 0; i < tags.length; i++) {
            var val = this[tags[i]];
            if (!map[val]) {
                arr.push(val);
                map[val] = val;
            }
        }
        return arr.join(' ');
    };
    LineObject.generateTags = function (pointIdsLen, modelsLen) {
        var tags;
        if (pointIdsLen === 1) {
            if (modelsLen === 2) {
                tags = ['legend'];
            }
            else {
                tags = ['legend', 'unit'];
            }
        }
        else {
            if (modelsLen === 2) {
                tags = ['pointId', 'legend'];
            }
            else {
                tags = ['pointId', 'legend', 'unit'];
            }
        }
        return tags;
    };
    LineObject.id = function (pointId, unit, legend) {
        return pointId + '-' + unit + '-' + legend;
    };
    return LineObject;
}());

var TimeModelName = 'time';
var TimeFieldName = 'SuvDate';

var Hydrograph = (function (_super) {
    __extends(Hydrograph, _super);
    function Hydrograph(selector) {
        var _this = _super.call(this, selector) || this;
        _this.min = 0;
        _this.max = 0;
        var schema = {
            name: Hydrograph.clazz,
            properties: {
                PointId: 'string',
                Unit: 'string',
                Legend: 'string',
                SuvDate: 'Date',
                Value: 'number'
            }
        };
        _this.table = _this.db.create(schema);
        return _this;
    }
    Hydrograph.prototype.initData = function () {
        this.clear();
        var _a = this, action = _a.action, table = _a.table, modelMap = _a.modelMap, lineMap = _a.lineMap, data = _a.option.data;
        if (action === 'add') {
            data = clone(data && data.ObservLineList ? data : data.object);
            for (var i = 0; i < data.ObservLineList.length; i++) {
                var line = data.ObservLineList[i];
                this.data.ObservLineList.push(line);
            }
        }
        else {
            this.data = clone(data && data.ObservLineList ? data : data.object);
        }
        var usedData = this.data;
        modelMap[TimeModelName] = new TimeModel(TimeModelName, TimeFieldName, 'horizontal');
        for (var i = 0, i_len = usedData.ObservLineList.length < 12 ? usedData.ObservLineList.length : 12; i < i_len; i++) {
            var line = usedData.ObservLineList[i];
            var pointId = line.PointId;
            var unit = line.Unit;
            var legend = line.Legend;
            var id = LineObject.id(pointId, unit, legend);
            var model = modelMap[unit];
            if (!lineMap[id]) {
                if (!model) {
                    if (Object.keys(modelMap).length < 5) {
                        modelMap[unit] = new LinearModel(unit, 'Value', 'vertical');
                    }
                    else {
                        continue;
                    }
                }
                lineMap[id] = new LineObject(pointId, unit, legend);
            }
            else {
                continue;
            }
            for (var j = 0, j_len = line.ObservPointList.length; j < j_len; j++) {
                var point = line.ObservPointList[j];
                var value = parseFloat(point.Value);
                var suvDate = parseTime(point.SuvDate);
                var row = table.insert([pointId, unit, legend, suvDate, value]);
            }
        }
        this.title = this.data.Title || this.title;
        this.warningValue = this.data.WarningValue;
        this.initWarningValue = this.data.InitWarningValue;
        this.initReverse = this.data.InitReverse;
        this.tableBackup = table.copy(Hydrograph.clazz + '-backup');
    };
    Hydrograph.prototype.initModel = function () {
        var _a = this.gridComponent.getView(), width = _a.width, height = _a.height;
        var _b = this, action = _b.action, table = _b.table, pointIdMap = _b.pointIdMap, modelMap = _b.modelMap, lineMap = _b.lineMap, cache = _b.cache, legendManager = _b.legendManager, reverseAxis = _b.reverseAxis, initReverse = _b.initReverse;
        if (action === 'reset')
            modelMap[TimeModelName] = new TimeModel(TimeModelName, TimeFieldName, 'horizontal');
        var rows = table.getRows();
        for (var i = 0; i < rows.length; i++) {
            var row = rows[i];
            var pointId = row.get('PointId');
            var unit = row.get('Unit');
            var legend = row.get('Legend');
            var id = LineObject.id(pointId, unit, legend);
            var suvDate = row.get('SuvDate');
            var value = row.get('Value');
            var model = modelMap[unit];
            if (action === 'reset') {
                if (!lineMap[id]) {
                    if (!model) {
                        modelMap[unit] = new LinearModel(unit, 'Value', 'vertical');
                    }
                    lineMap[id] = new LineObject(pointId, unit, legend);
                }
            }
            if (pointIdMap[pointId]) {
                pointIdMap[pointId] += 1;
            }
            else {
                pointIdMap[pointId] = 1;
            }
            var key = suvDate.toString();
            var objCache = cache[key];
            if (objCache) {
                objCache.push(row);
            }
            else {
                cache[key] = [row];
            }
        }
        for (var _i = 0, _c = Object.values(lineMap); _i < _c.length; _i++) {
            var line = _c[_i];
            var pointId = line.pointId, unit = line.unit, legend = line.legend, id = line.id;
            line.data = table.select("PointId='" + pointId + "' and Unit='" + unit + "' and Legend='" + legend + "' and Value!='-99'");
            line.table = table;
            line.legendObject = legendManager.add(id);
            line.xModel = modelMap[TimeModelName];
            line.yModel = modelMap[unit];
            if (line.data.length === 0)
                delete lineMap[id];
        }
        for (var _d = 0, _e = Object.values(modelMap); _d < _e.length; _d++) {
            var model = _e[_d];
            if (model.name === TimeModelName) {
                model.data = table.columns(TimeFieldName);
                model.range = [0, width];
            }
            else {
                var rowData = table.select("Unit='" + model.name + "'");
                model.data = table.columns('Value', rowData, function (value) { return value !== -99; });
                model.range = [height, 0];
                model.tickSize = 0;
                model.tickPadding = 20;
                if (model.data.length === 0)
                    delete modelMap[model.name];
            }
            model.init();
        }
    };
    Hydrograph.prototype.initLegend = function () {
        var lines = Object.values(this.lineMap);
        for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
            var line = lines_1[_i];
            var legend = line.legend, legendObject = line.legendObject;
            legendObject.drawLegend(this.legendsComponent, legend);
        }
    };
    Hydrograph.prototype.initXAxis = function () {
        var width = this.gridComponent.getView().width;
        var time = this.modelMap.time;
        var datetimeAxis = new TimeAxis({ model: time }).setView({ width: width });
        this.bottomComponent.append(datetimeAxis);
        this.drawDottedLine(time.tickValues.length, 'vertical');
    };
    Hydrograph.prototype.initYAxis = function () {
        var _a = this.gridComponent.getView(), width = _a.width, height = _a.height;
        var count = 0;
        for (var _i = 0, _b = Object.values(this.modelMap); _i < _b.length; _i++) {
            var model = _b[_i];
            if (model.name !== 'time') {
                var lw = this.leftComponent.getView().width;
                var rw = this.rightComponent.getView().width;
                count += 1;
                if (count === 1) {
                    model.tickSize = 0;
                    var linearAxis = new LinearAxis({ model: model, type: 'axisLeft' }).setView({ x: lw, y: -0.5, height: height });
                    this.leftComponent.append(linearAxis);
                    this.drawDottedLine(model.tickValues.length - 1, "horizontal");
                }
                else if (count === 2) {
                    model.tickSize = 0;
                    var linearAxis = new LinearAxis({ model: model, type: 'axisRight' }).setView({ x: -1, y: -0.5, height: height });
                    this.rightComponent.append(linearAxis);
                }
                else if (count === 3) {
                    model.tickSize = 5;
                    var linearAxis = new LinearAxis({ model: model, type: 'axisLeft' }).setView({ x: lw / 2, height: height });
                    this.leftComponent.append(linearAxis);
                }
                else if (count === 4) {
                    model.tickSize = 5;
                    var linearAxis = new LinearAxis({ model: model, type: 'axisRight' }).setView({ x: rw / 2, height: height });
                    this.rightComponent.append(linearAxis);
                }
                else {
                    break;
                }
            }
        }
    };
    Hydrograph.prototype.initLines = function () {
        var _a = this, lineMap = _a.lineMap, linesComponent = _a.linesComponent;
        for (var _i = 0, _b = Object.values(lineMap); _i < _b.length; _i++) {
            var line = _b[_i];
            line.drawLine(linesComponent);
        }
    };
    Hydrograph.prototype.initPoints = function () {
        var _a = this, lineMap = _a.lineMap, pointsComponent = _a.pointsComponent;
        for (var _i = 0, _b = Object.values(lineMap); _i < _b.length; _i++) {
            var line = _b[_i];
            line.drawPoint(pointsComponent);
        }
    };
    Hydrograph.prototype.initEvent = function () {
        var _this = this;
        _super.prototype.initEvent.call(this);
        this.svg.on(TooltipsEvent, function (datum, index, groups) {
            var _a = d3.event.detail, mouse = _a.mouse, tooltips = _a.target;
            var _b = _this, cache = _b.cache, legendManager = _b.legendManager, parentView = _b.option.view;
            var _c = _this.modelMap['time'], scale = _c.scale, data = _c.data;
            var valueX = scale.invert(mouse[0]);
            var valueX2 = scale.invert(mouse[0] + 3);
            var limitError = Math.abs(valueX - valueX2);
            var value = lately(data, valueX, limitError);
            if (value === null)
                return;
            var pointRowArray = cache[value];
            if (!pointRowArray)
                return;
            var tooltipsView = new View({
                width: parentView.width / 2,
                height: parentView.height / 2,
                top: 22,
                bottom: 5,
                left: 5,
                right: 5
            }, tooltips.getSvgContext());
            var nodeView = new View({ width: 120, height: 37 }, tooltips.getSvgContext());
            tooltips.refresh(pointRowArray.length, mouse, parentView, tooltipsView, nodeView, 145);
            tooltips.append(new Text({ x: 5 })).text(formatTime(value));
            for (var i = 0; i < pointRowArray.length; i++) {
                var row = pointRowArray[i];
                var pointId = row.get('PointId');
                var unit = row.get('Unit');
                var legend = row.get('Legend');
                var value_1 = row.get('Value');
                var id = LineObject.id(pointId, unit, legend);
                var legendObject = legendManager.get(id);
                var g = tooltips.append(new G().setView({ width: 120, height: 15 }));
                legendObject.draw(g, 5, 12, 50);
                g.append(new Text({ x: 15 })).text("" + legend);
                tooltips.append(new Text().setView({ width: 120, height: 22 })).text(unit + ": " + value_1);
            }
        });
        this.svg.on(BrushEvent, function () {
            var _a = d3.event.detail, startPosition = _a.startPosition, endPosition = _a.endPosition;
            var _b = _this, modelMap = _b.modelMap, table = _b.table;
            var sx = startPosition[0], sy = startPosition[1];
            var ex = endPosition[0], ey = endPosition[1];
            var brushData = [];
            var tempmax;
            var sxValue, exValue;
            for (var _i = 0, _c = Object.values(modelMap); _i < _c.length; _i++) {
                var model = _c[_i];
                var name = model.name, type = model.type, scale = model.scale;
                if (type === 'horizontal') {
                    sxValue = scale.invert(sx);
                    exValue = scale.invert(ex);
                    if (sxValue > exValue) {
                        tempmax = sxValue;
                        sxValue = exValue;
                        exValue = tempmax;
                    }
                    sxValue = formatTime(sxValue);
                    exValue = formatTime(exValue);
                    break;
                }
            }
            for (var _d = 0, _e = Object.values(modelMap); _d < _e.length; _d++) {
                var model = _e[_d];
                var name = model.name, type = model.type, scale = model.scale;
                var syValue = void 0, eyValue = void 0;
                if (type === 'vertical') {
                    syValue = scale.invert(sy);
                    eyValue = scale.invert(ey);
                    if (syValue > eyValue) {
                        tempmax = syValue;
                        syValue = eyValue;
                        eyValue = tempmax;
                    }
                }
                else {
                    continue;
                }
                var data = void 0;
                data = table.select("Unit='" + name + "' and SuvDate>='" + sxValue + "' and SuvDate<='" + exValue + "' and Value>='" + syValue + "' and Value<='" + eyValue + "'");
                for (var i = 0; i < data.length; i++) {
                    brushData.push(data[i]);
                }
            }
            if (brushData.length > 0) {
                _this.reset(brushData);
            }
        });
        this.svg.on(MouseWheel, function () {
            var delta = d3.event.detail.delta;
            var _a = _this, modelMap = _a.modelMap, tableBackup = _a.tableBackup;
            var brushData = [];
            var data;
            var sxValue, exValue;
            var minCurrent, maxCurrent;
            var time = modelMap['time'];
            var minLast = time.min.getTime();
            var maxLast = time.max.getTime();
            var increment = (maxLast - minLast) * 0.05;
            increment = increment || 24 * 60 * 60 * 1000;
            if (delta > 0) {
                minCurrent = new Date(minLast - increment);
                maxCurrent = new Date(maxLast + increment);
                sxValue = formatTime(minCurrent);
                exValue = formatTime(maxCurrent);
            }
            else {
                minCurrent = new Date(minLast + increment);
                maxCurrent = new Date(maxLast - increment);
                sxValue = formatTime(minCurrent);
                exValue = formatTime(maxCurrent);
            }
            if (sxValue > exValue) {
                console.log('error:MouseWheel: sxValue > exValue :', sxValue, exValue, increment);
                return;
            }
            var sql = "SuvDate>='" + sxValue + "' and SuvDate<='" + exValue + "'";
            console.log('MouseWheel:sql:', sql);
            data = tableBackup.select(sql);
            for (var i = 0; i < data.length; i++) {
                brushData.push(data[i]);
            }
            if (brushData.length > 0) {
                brushData.push([null, null, null, minCurrent, null]);
                brushData.push([null, null, null, maxCurrent, null]);
                _this.reset(brushData);
            }
        });
        this.svg.on(MouseLeft, function () {
            var _a = d3.event.detail, startPosition = _a.startPosition, endPosition = _a.endPosition;
            var _b = _this, modelMap = _b.modelMap, tableBackup = _b.tableBackup;
            var sx = startPosition[0], sy = startPosition[1];
            var ex = endPosition[0], ey = endPosition[1];
            var time = modelMap['time'];
            var minLast = time.min.getTime();
            var maxLast = time.max.getTime();
            var sxValue, exValue;
            sxValue = time.scale.invert(sx);
            exValue = time.scale.invert(ex);
            var time_difference_new = -(exValue - sxValue);
            var minCurrent = new Date(minLast + time_difference_new);
            var maxCurrent = new Date(maxLast + time_difference_new);
            sxValue = formatTime(minCurrent);
            exValue = formatTime(maxCurrent);
            var brushData = [];
            var data;
            var sql = "SuvDate>='" + sxValue + "' and SuvDate<='" + exValue + "'";
            console.log('MouseLeft:sql:', sql);
            data = tableBackup.select(sql);
            for (var i = 0; i < data.length; i++) {
                brushData.push(data[i]);
            }
            if (brushData.length > 0) {
                brushData.push([null, null, null, minCurrent, null]);
                brushData.push([null, null, null, maxCurrent, null]);
                _this.reset(brushData);
            }
        });
    };
    Hydrograph.prototype.onBrushEvent = function (zoom) {
        var delta = d3.event.detail.delta;
    };
    Hydrograph.clazz = "hydrograph";
    Hydrograph.title = "过程线";
    return Hydrograph;
}(Chart));

var Series = (function (_super) {
    __extends(Series, _super);
    function Series(property) {
        var _this = _super.call(this, property) || this;
        _this.legends = [];
        _this.cache = {};
        _this.modelMap = {};
        _this.lineMap = {};
        _this.legendManager = new LegendManager();
        _this.table = property.table;
        return _this;
    }
    Series.prototype.drawDottedLine = function (num, type) {
        var _a = this.gridComponent.getView(), width = _a.width, height = _a.height;
        var space = type === 'horizontal' ? height / num : width / num;
        if (type === 'horizontal') {
            for (var i = 1; i < num; i++) {
                var interval = space * i + 0.5;
                var line = new Line({ y1: interval, y2: interval, x2: width, stroke: 'black', 'stroke-width': 1, "stroke-dasharray": 2, opacity: 0.5 });
                this.backgroundComponent.append(line);
            }
        }
        else if (type === 'vertical') {
            for (var i = 1; i < num; i++) {
                var interval = space * i + 0.5;
                var line = new Line({ x1: interval, x2: interval, y2: height, stroke: 'black', 'stroke-width': 1, "stroke-dasharray": 2, opacity: 0.5 });
                this.backgroundComponent.append(line);
            }
        }
    };
    Series.prototype.init = function () {
        if (!this.getSvgContext()) {
            log.e.call(this, "this.context is undefined or null");
            return this;
        }
        this.view = this.view || new View({}, this);
        var _a = this.view, width = _a.width, height = _a.height, top = _a.top, bottom = _a.bottom, left = _a.left, right = _a.right;
        this.topComponent = new Component({ attribute: { class: 'top' } });
        this.bottomComponent = new Component({ attribute: { class: 'bottom' } });
        this.leftComponent = new Component({ attribute: { class: 'left' } });
        this.rightComponent = new Component({ attribute: { class: 'right' } });
        this.gridComponent = new Component({ attribute: { class: 'grid' } });
        this.topComponent.setView({ x: 0, y: 0, width: width, height: top });
        this.bottomComponent.setView({ x: 0, y: height - bottom, width: width, height: bottom, left: left, right: right });
        this.leftComponent.setView({ x: 0, y: top, width: left, height: height - top - bottom });
        this.rightComponent.setView({ x: width - right, y: top, width: right, height: height - top - bottom });
        this.gridComponent.setView({ x: left, y: top, width: width - left - right, height: height - top - bottom });
        this.append(this.topComponent);
        this.append(this.bottomComponent);
        this.append(this.leftComponent);
        this.append(this.rightComponent);
        this.append(this.gridComponent);
        var _b = this.gridComponent.getView(), gw = _b.width, gh = _b.height;
        if (config.browser.chrome && config.os.group.indexOf('windows') > -1) {
            this.gridComponent.style({ cursor: 'url("/wpcharts/dist/css/image/empty-1x1-white.png"),crosshair' });
        }
        else {
            this.gridComponent.style({ cursor: 'url("/wpcharts/dist/css/image/empty-1x1.png"),crosshair' });
        }
        this.backgroundComponent = new Component({ attribute: { class: 'background' } });
        this.gridComponent.append(this.backgroundComponent);
        this.backgroundComponent.append(new Rect({ x: 0.5, y: 0, width: gw - 1, height: gh, fill: 'none', stroke: 'black', 'stroke-width': 1 }));
        this.linesComponent = this.gridComponent.append(new Component({ attribute: { class: 'lines' } }));
        this.pointsComponent = this.gridComponent.append(new Component({ attribute: { class: 'points' } }));
        this.legendsComponent = new Component({ attribute: { class: 'legends' } }).setView({
            x: 0,
            y: 8,
            width: width,
            height: top,
            boxOrient: "horizontal"
        });
        this.topComponent.append(this.legendsComponent);
        return this;
    };
    Series.prototype.initXAxis = function () {
        var time = this.modelMap.time;
        this.drawDottedLine(time.tickValues.length, 'vertical');
        return this;
    };
    Series.prototype.initYAxis = function () {
        var modelMap = this.modelMap;
        var modelArray = Object.values(modelMap);
        for (var i = 0; i < modelArray.length; i++) {
            var model = modelArray[i];
            if (model.name === 'time')
                continue;
            var linearAxis = new LinearAxis({ model: model, type: 'axisLeft' }).setView({ x: 0, y: -0.5, height: this.gridComponent.getView().height });
            this.leftComponent.append(linearAxis);
            this.drawDottedLine(model.tickValues.length - 1, "horizontal");
        }
        return this;
    };
    Series.prototype.initLegend = function () {
        var _a = this, legendManager = _a.legendManager, legends = _a.legends, legendsComponent = _a.legendsComponent;
        for (var i = 0; i < legends.length; i++) {
            var legendName = legends[i];
            legendManager.get(legendName).drawLegend(legendsComponent, legendName);
        }
        return this;
    };
    Series.prototype.initLines = function () {
        var _a = this, lineMap = _a.lineMap, modelMap = _a.modelMap, table = _a.table;
        var scaleX = modelMap.time.scale;
        var _loop_1 = function (line) {
            var data = line.data, scaleY = line.model.scale, legend = line.legend;
            var lineGenerator = null;
            if (data.length === 0)
                return "continue";
            (function (scaleY) {
                lineGenerator = d3.line()
                    .x(function (d, index, data) {
                    return scaleX(table.field('SuvDate', d));
                })
                    .y(function (d, index, data) {
                    return scaleY(table.field('Val', d));
                });
            })(scaleY);
            this_1.linesComponent.append(new Path({ d: lineGenerator(data), stroke: legend.color, class: 'line' }));
        };
        var this_1 = this;
        for (var _i = 0, _b = Object.values(lineMap); _i < _b.length; _i++) {
            var line = _b[_i];
            _loop_1(line);
        }
    };
    Series.prototype.initPoints = function () {
        var _a = this, lineMap = _a.lineMap, modelMap = _a.modelMap, table = _a.table;
        var scaleX = modelMap.time.scale;
        for (var _i = 0, _b = Object.values(lineMap); _i < _b.length; _i++) {
            var line = _b[_i];
            var data = line.data, scaleY = line.model.scale, legend = line.legend;
            var pointsLength = data.length;
            var pointsSpace = Math.floor(data.length / 10);
            var point = void 0, j = void 0, x = void 0, y = void 0;
            if (pointsLength <= 12) {
                for (j = 0; j < pointsLength; j++) {
                    point = data[j];
                    x = scaleX(table.field('SuvDate', point));
                    y = scaleY(table.field('Val', point));
                    legend.draw(this.pointsComponent, x, y);
                }
            }
            else {
                for (j = 1; j <= 10; j++) {
                    if (pointsLength === (j * pointsSpace)) {
                        point = data[j * pointsSpace - Math.floor(pointsSpace / 2)];
                    }
                    else {
                        point = data[j * pointsSpace];
                    }
                    x = scaleX(table.field('SuvDate', point));
                    y = scaleY(table.field('Val', point));
                    legend.draw(this.pointsComponent, x, y);
                }
                legend.draw(this.pointsComponent, scaleX(table.field('SuvDate', data[0])), scaleY(table.field('Val', data[0])));
                legend.draw(this.pointsComponent, scaleX(table.field('SuvDate', data[pointsLength - 1])), scaleY(table.field('Val', data[pointsLength - 1])));
            }
        }
    };
    Series.ClassName = 'series';
    return Series;
}(Component));

var Statistical = (function (_super) {
    __extends(Statistical, _super);
    function Statistical(selector) {
        var _this = _super.call(this, selector) || this;
        _this.pointId = '';
        _this.unit = '';
        var schema = {
            name: Statistical.clazz,
            properties: {
                PlotId: 'number',
                Legend: 'string',
                SuvDate: 'Date',
                Val: 'number'
            }
        };
        _this.table = _this.db.create(schema);
        return _this;
    }
    Statistical.prototype.initData = function () {
        var _a = this, seriesMap = _a.seriesMap, table = _a.table, modelMap = _a.modelMap, lineMap = _a.lineMap, legendManager = _a.legendManager, data = _a.option.data;
        this.option.view.height = 750;
        this.option.view.top = 60;
        this.option.view.bottom = 60;
        this.data = clone(data && data.PlotList ? data : data.object);
        var pointId, unit;
        var plotList = this.data.PlotList;
        for (var i = 0, len_i = plotList.length; i < len_i; i++) {
            var item_i = plotList[i];
            var observLineList = item_i.ObservLineList;
            var series = new Series({ table: table });
            seriesMap[i] = series;
            for (var j = 0, len_j = observLineList.length; j < len_j; j++) {
                var item_j = observLineList[j];
                if (!pointId)
                    pointId = item_j.PointId || '';
                if (!unit)
                    unit = item_j.Unit || '';
                var legend = item_j.Legend;
                var observPointList = item_j.ObservPointList;
                series.legends.push(legend);
                for (var k = 0, len_k = observPointList.length; k < len_k; k++) {
                    var item_k = observPointList[k];
                    var suvDate = item_k.SuvDate;
                    var val = item_k.Val;
                    var date = parseTimeT(suvDate);
                    var value = parseFloat(val);
                    table.insert([i, legend, date, value]);
                }
            }
        }
        this.pointId = pointId;
        this.unit = unit;
        this.title = this.data.Title || this.title;
        this.tableBackup = table.copy(Statistical.clazz + '-backup');
    };
    Statistical.prototype.initModel = function () {
        var _a = this, table = _a.table, modelMap = _a.modelMap, seriesMap = _a.seriesMap, unit = _a.unit, gridComponent = _a.gridComponent;
        var _b = this.gridComponent.getView(), width = _b.width, height = _b.height;
        var _c = this.option.view, w = _c.width, h = _c.height, t = _c.top, b = _c.bottom, l = _c.left, r = _c.right;
        var sw = w - l - r;
        var st = 40;
        var shSupply = 80;
        var shInterval = (h - t - b - (st + shSupply) * 3) / 7;
        this.gridComponent.getView().boxOrient = 'vertical';
        modelMap['time'] = new TimeModel(TimeModelName, TimeFieldName, 'horizontal', table.columns('SuvDate'));
        modelMap['time'].range = [0, width];
        modelMap['time'].init();
        var seriesArray = Object.values(seriesMap);
        for (var i = 0; i < seriesArray.length; i++) {
            var series = seriesArray[i];
            var legends = series.legends;
            series.setView({ width: sw, height: shInterval * legends.length + st + shSupply, top: st, boxOrient: 'free' });
            gridComponent.append(series);
            series.init();
            var rowsData = table.select("PlotId='" + i + "'");
            var columnsData = table.columns('Val', rowsData);
            var model = new LinearModel(unit, 'Val', 'vertical', columnsData);
            model.range = [series.gridComponent.getView().height, 0];
            model.ticks = 4;
            model.tickSize = 0;
            model.tickPadding = 20;
            model.init();
            modelMap[i] = model;
            series.modelMap[unit] = model;
            series.modelMap['time'] = modelMap['time'];
            for (var j = 0; j < legends.length; j++) {
                var legendName = legends[j];
                var data = table.select("PlotId='" + i + "' and Legend='" + legendName + "'");
                var legend = series.legendManager.add(legendName);
                series.lineMap[legendName] = { data: data, model: model, legend: legend };
            }
        }
    };
    Statistical.prototype.initXAxis = function () {
        var width = this.gridComponent.getView().width;
        var time = this.modelMap.time;
        var datetimeAxis = new TimeAxis({ model: time }).setView({ width: width });
        this.bottomComponent.append(datetimeAxis);
        var seriesMap = this.seriesMap;
        var seriesArray = Object.values(seriesMap);
        for (var i = 0; i < seriesArray.length; i++) {
            seriesArray[i].initXAxis();
        }
    };
    Statistical.prototype.initYAxis = function () {
        var seriesMap = this.seriesMap;
        var seriesArray = Object.values(seriesMap);
        for (var i = 0; i < seriesArray.length; i++) {
            seriesArray[i].initYAxis();
        }
    };
    Statistical.prototype.initLegend = function () {
        var seriesMap = this.seriesMap;
        var seriesArray = Object.values(seriesMap);
        for (var i = 0; i < seriesArray.length; i++) {
            seriesArray[i].initLegend();
        }
    };
    Statistical.prototype.initLines = function () {
        var seriesMap = this.seriesMap;
        var seriesArray = Object.values(seriesMap);
        for (var i = 0; i < seriesArray.length; i++) {
            seriesArray[i].initLines();
        }
    };
    Statistical.prototype.initPoints = function () {
        var seriesMap = this.seriesMap;
        var seriesArray = Object.values(seriesMap);
        for (var i = 0; i < seriesArray.length; i++) {
            seriesArray[i].initPoints();
        }
    };
    Statistical.prototype.initBackground = function () {
    };
    Statistical.prototype.initEvent = function () {
    };
    Statistical.clazz = "statistical";
    Statistical.title = "统计模型过程线";
    return Statistical;
}(Chart));

var OrdinalAxis = (function (_super) {
    __extends(OrdinalAxis, _super);
    function OrdinalAxis(property) {
        return _super.call(this, property) || this;
    }
    OrdinalAxis.prototype.draw = function (parentSvgContext) {
        _super.prototype.draw.call(this, parentSvgContext);
        this._drawAxis();
        return this;
    };
    OrdinalAxis.prototype._drawAxis = function () {
        var _a = this, model = _a.model, type = _a.type, view = _a.view;
        var _b = model, tickSize = _b.tickSize, tickPadding = _b.tickPadding, tickValues = _b.tickValues, scale = _b.scale, name = _b.name;
        var x = 0, y = 0;
        var axis;
        if (type === 'axisTop') {
            axis = d3.axisTop(scale);
            x = view.width + 40;
            y = 0;
        }
        else if (type === 'axisBottom') {
            axis = d3.axisBottom(scale);
            x = view.width + 40;
            y = 0;
        }
        else if (type === 'axisLeft') {
            axis = d3.axisLeft(scale);
            y = -10;
        }
        else if (type === 'axisRight') {
            axis = d3.axisRight(scale);
            y = -10;
        }
        else {
            return this;
        }
        axis.tickSize(tickSize).tickPadding(tickPadding);
        this.call(axis);
        this.append(new Text({ x: x, y: y, class: 'axis-text' })).text(name);
    };
    OrdinalAxis.ClassName = 'ordinal-axis ' + Axis.ClassName;
    return OrdinalAxis;
}(Axis));

var OrdinalModel = (function (_super) {
    __extends(OrdinalModel, _super);
    function OrdinalModel(name, fieldName, type, data) {
        if (data === void 0) { data = []; }
        var _this = _super.call(this, name, fieldName, type, data) || this;
        _this.domain = data;
        _this.tickValues = data;
        return _this;
    }
    OrdinalModel.prototype.init = function () {
        var _a = this, domain = _a.domain, range = _a.range;
        if (domain.length !== range.length) {
            var length = Math.abs(range[0] - range[1]);
            var min = d3.min(range) || 0;
            var count = domain.length;
            var space = length / (count - 1);
            range = [];
            for (var i = 0; i < count; i++) {
                range.push(min + space * i);
            }
            this.range = range;
        }
        this.scale = d3.scaleOrdinal().domain(this.domain).range(this.range);
    };
    OrdinalModel.prototype.reverse = function () {
        this.range = this.range.reverse();
        this.scale = d3.scaleOrdinal().domain(this.domain).range(this.range);
    };
    return OrdinalModel;
}(Model));

var Distribution = (function (_super) {
    __extends(Distribution, _super);
    function Distribution(selector) {
        var _this = _super.call(this, selector) || this;
        _this.isHorizontal = true;
        _this.points = [];
        _this.lines = {};
        var schema = {
            name: Distribution.clazz,
            properties: {
                PointId: 'string',
                Unit: 'string',
                SuvDate: 'Date',
                Value: 'number',
                pointX: 'number',
                pointY: 'number',
                plotAngle: 'number',
                valueY: 'number',
            }
        };
        _this.table = _this.db.create(schema);
        return _this;
    }
    Distribution.prototype.initData = function () {
        this.clear();
        var _a = this, data = _a.option.data, table = _a.table;
        this.data = clone(data && data.pointCategories ? data : data.object);
        if (this.option.isHorizontal !== undefined) {
            this.isHorizontal = this.option.isHorizontal;
        }
        else if (this.data.isHorizontal !== undefined) {
            this.isHorizontal = this.data.isHorizontal;
        }
        if (!this.isHorizontal) {
            this.option.view.height = 750;
            this.option.view.left = 300;
            this.option.view.right = 300;
            this.xAxisName = data.valueAxisName;
            this.yAxisName = data.categoryAxisName;
        }
        else {
            this.xAxisName = data.categoryAxisName;
            this.yAxisName = data.valueAxisName;
        }
        var usedData = this.data;
        for (var i = 0, len = usedData.suvDateList.length; i < len; i++) {
            var date = usedData.suvDateList[i];
            for (var j = 0, length = usedData.pointCategories.length; j < length; j++) {
                var pointId = usedData.pointCategories[j];
                var unit = usedData.valueAxisName;
                var suvDate = parseTime(date);
                var value = usedData.dataList[j][i];
                var pointX = void 0, pointY = void 0, plotAngle = void 0, valueY = void 0;
                value = value ? parseFloat(value) : value;
                if (!!usedData.imageFile) {
                    pointX = usedData.pointX[j];
                    pointY = usedData.pointY[j];
                    plotAngle = usedData.plotAngle[j];
                    var dataYList = usedData.dataYList;
                    if (!!dataYList) {
                        valueY = dataYList[j][i];
                        valueY = valueY ? parseFloat(valueY) : valueY;
                    }
                }
                var row = table.insert([pointId, unit, suvDate, value, pointX, pointY, plotAngle, valueY]);
            }
        }
        for (var i = 0, len = usedData.pointCategories.length; i < len; i++) {
            this.points.push(usedData.pointCategories[i]);
        }
        this.title = this.data.title || this.title;
        this.tableBackup = table.copy(Distribution.clazz + '-backup');
    };
    Distribution.prototype.initModel = function () {
        var _a = this, modelMap = _a.modelMap, lineMap = _a.lineMap, cache = _a.cache, isHorizontal = _a.isHorizontal, points = _a.points, table = _a.table, option = _a.option, reverseAxis = _a.reverseAxis;
        var _b = this.gridComponent.getView(), width = _b.width, height = _b.height;
        modelMap[TimeModelName] = new TimeModel(TimeModelName, TimeFieldName, 'horizontal', table.columns('SuvDate'));
        modelMap[TimeModelName].range = isHorizontal ? [0, width] : [0, option.view.width - 200];
        modelMap[TimeModelName].init();
        var xModel, yModel;
        if (!isHorizontal) {
            xModel = new LinearModel(this.xAxisName, 'Value', 'horizontal', table.columns('Value'));
            yModel = new OrdinalModel(this.yAxisName, 'PointId', 'vertical', points);
        }
        else {
            xModel = new OrdinalModel(this.xAxisName, 'PointId', 'horizontal', points);
            yModel = new LinearModel(this.yAxisName, 'Value', 'vertical', table.columns('Value'));
        }
        modelMap[this.xAxisName] = xModel;
        modelMap[this.yAxisName] = yModel;
        xModel.range = [0, width];
        yModel.range = [height, 0];
        xModel.tickSize = 0;
        yModel.tickSize = 0;
        xModel.tickPadding = 5;
        yModel.tickPadding = 20;
        xModel.init();
        yModel.init();
        var usedData = this.data;
        if (reverseAxis) {
            if (usedData.pointCategories[usedData.pointCategories.length - 1] === "孔底") {
                yModel.reverse();
            }
            else {
                if (isHorizontal) {
                    yModel.reverse();
                }
                else {
                    xModel.reverse();
                }
            }
        }
        var rows = table.getRows();
        for (var i = 0; i < rows.length; i++) {
            var row = rows[i];
            var suvDate = row.get('SuvDate');
            var niceDate = formatTime(suvDate);
            if (!lineMap[niceDate]) {
                lineMap[niceDate] = { data: [row.get()] };
            }
            else {
                lineMap[niceDate].data.push(row.get());
            }
        }
    };
    Distribution.prototype.initLegend = function () {
    };
    Distribution.prototype.initXAxis = function () {
        var _this = this;
        this.bottomComponent.getView().boxOrient = 'vertical';
        var _a = this, isHorizontal = _a.isHorizontal, option = _a.option;
        var width = this.gridComponent.getView().width;
        var time = this.modelMap.time;
        var timeAxis = new TimeAxis({
            model: time,
            click: function (time) {
                _this.onClickTime(time);
            }
        });
        if (isHorizontal) {
            timeAxis.setView({ width: width, height: 80, boxOrient: "vertical" });
        }
        else {
            timeAxis.setView({ x: -200, width: option.view.width - 200, height: 80, boxOrient: "vertical" });
        }
        var xAxisModel = this.modelMap[this.xAxisName];
        var xAxis;
        if (isHorizontal) {
            xAxis = new OrdinalAxis({ model: xAxisModel, type: "axisBottom" }).setView({ width: width, height: 20 });
        }
        else {
            xAxis = new LinearAxis({ model: xAxisModel, type: "axisBottom" }).setView({ width: width, height: 20 });
        }
        this.bottomComponent.append(xAxis);
        this.bottomComponent.append(timeAxis);
        this.drawDottedLine(xAxisModel.tickValues.length - 1, 'vertical');
    };
    Distribution.prototype.initYAxis = function () {
        var isHorizontal = this.isHorizontal;
        var width = this.leftComponent.getView().width;
        var height = this.gridComponent.getView().height;
        var yAxis;
        var yAxisModel = this.modelMap[this.yAxisName];
        if (isHorizontal) {
            yAxis = new LinearAxis({ model: yAxisModel, type: "axisLeft" }).setView({ x: width, y: -0.5, height: height });
        }
        else {
            yAxis = new OrdinalAxis({ model: yAxisModel, type: "axisLeft" }).setView({ x: width, y: -0.5, height: height });
        }
        this.leftComponent.append(yAxis);
        this.drawDottedLine(yAxisModel.tickValues.length - 1, 'horizontal');
    };
    Distribution.prototype.initLines = function () {
        var _a = this, lineMap = _a.lineMap, legendManager = _a.legendManager;
        var defaultDraw = this.option.defaultDraw;
        if (defaultDraw) {
            var lineKeys = Object.keys(lineMap);
            var len = lineKeys.length > 12 ? 12 : lineKeys.length;
            for (var i = 0; i < len; i++) {
                var time = lineKeys[i];
                var lineObj = lineMap[time];
                lineObj.time = time;
                lineObj.legend = legendManager.add(time);
                this.drawLineClick(lineObj);
                this.drawLegendClick(lineObj);
                if (!this.data.dataYList)
                    this.drawPointClick(lineObj);
            }
            var svg = this.svg.getSvgContext();
            svg.selectAll(".time-axis").style("display", "none");
        }
    };
    Distribution.prototype.initPoints = function () {
    };
    Distribution.prototype.drawLineClick = function (line) {
        var _a = this, modelMap = _a.modelMap, table = _a.table;
        var points = line.data;
        var legend = line.legend;
        var isHorizontal = this.isHorizontal;
        var scaleX = modelMap[this.xAxisName].scale;
        var scaleY = modelMap[this.yAxisName].scale;
        var lineGenerator = null;
        lineGenerator = d3.line()
            .x(function (d) {
            if (isHorizontal) {
                return scaleX(table.field('PointId', d));
            }
            else {
                return scaleX(table.field('Value', d));
            }
        })
            .y(function (d) {
            if (isHorizontal) {
                return scaleY(table.field('Value', d));
            }
            else {
                return scaleY(table.field('PointId', d));
            }
        })
            .defined(function (d) {
            return table.field('Value', d) !== null;
        });
        if (points && points.length > 0) {
            this.linesComponent.append(new Path({ d: lineGenerator(points), stroke: legend.color, 'stroke-width': 1, fill: 'none', class: 'line' }));
        }
    };
    Distribution.prototype.drawPointClick = function (line) {
        var _a = this, modelMap = _a.modelMap, table = _a.table;
        var points = line.data;
        var legend = line.legend;
        var isHorizontal = this.isHorizontal;
        var scaleX = modelMap[this.xAxisName].scale;
        var scaleY = modelMap[this.yAxisName].scale;
        for (var i = 0, len = points.length; i < len; i++) {
            var valueX = isHorizontal ? table.field('PointId', points[i]) : table.field('Value', points[i]);
            var valueY = isHorizontal ? table.field('Value', points[i]) : table.field('PointId', points[i]);
            if (!valueY && valueY !== 0)
                continue;
            var x = scaleX(valueX);
            var y = scaleY(valueY);
            legend.draw(this.pointsComponent, x, y);
        }
    };
    Distribution.prototype.drawLegendClick = function (line) {
        var time = line.time, legend = line.legend;
        legend.drawLegend(this.legendsComponent, time.substr(0, 10));
    };
    Distribution.prototype.onClickTime = function (time) {
        var _a = this, legendManager = _a.legendManager, lineMap = _a.lineMap, lines = _a.lines, isHorizontal = _a.isHorizontal, cache = _a.cache, table = _a.table;
        if (lines[time] || Object.keys(lines).length >= 12)
            return;
        var size = legendManager.getSize();
        if (size > 0) {
            console.log('onClickTime:', time);
            var lineObj = lineMap[time];
            lineObj.time = time;
            lineObj.legend = legendManager.add(time);
            this.drawLineClick(lineObj);
            this.drawLegendClick(lineObj);
            if (!this.data.dataYList)
                this.drawPointClick(lineObj);
            lines[time] = lineObj;
            for (var i = 0; i < lineObj.data.length; i++) {
                var row = lineObj.data[i];
                var pointId = table.field('PointId', row);
                var value = table.field('Value', row);
                var key = void 0;
                if (isHorizontal) {
                    key = pointId;
                }
                else {
                    key = value;
                }
                var objCache = cache[key];
                if (objCache) {
                    objCache.push(row);
                }
                else {
                    cache[key] = [row];
                }
            }
        }
    };
    Distribution.prototype.initEvent = function () {
        var _this = this;
        _super.prototype.initEvent.call(this);
        this.svg.on(TooltipsEvent, function (datum, index, groups) {
            var _a = d3.event.detail, mouse = _a.mouse, tooltips = _a.target;
            var _b = _this, table = _b.table, cache = _b.cache, modelMap = _b.modelMap, legendManager = _b.legendManager, parentView = _b.option.view, xAxisName = _b.xAxisName, isHorizontal = _b.isHorizontal;
            var _c = modelMap[xAxisName], scale = _c.scale, data = _c.data;
            var value;
            if (isHorizontal) {
                var valueX = mouse[0];
                var valueX2 = mouse[0] + 3;
                var limitError = Math.abs(valueX - valueX2);
                var range = modelMap[xAxisName].range;
                var domain = modelMap[xAxisName].domain;
                value = lately(range, valueX, limitError);
                if (value === null)
                    return;
                var i = range.indexOf(value);
                value = domain[i];
            }
            else {
                var valueX = scale.invert(mouse[0]);
                var valueX2 = scale.invert(mouse[0] + 3);
                var limitError = Math.abs(valueX - valueX2);
                value = lately(Object.keys(cache), valueX, limitError);
                if (value === null)
                    return;
            }
            var pointRowArray = cache[value];
            if (!pointRowArray)
                return;
            var tooltipsView = new View({
                width: parentView.width / 2,
                height: parentView.height / 2,
                top: 22,
                bottom: 5,
                left: 5,
                right: 5
            }, tooltips.getSvgContext());
            var nodeView = new View({ width: 145, height: isHorizontal ? 52 : 37 }, tooltips.getSvgContext());
            tooltips.refresh(pointRowArray.length, mouse, parentView, tooltipsView, nodeView, 145);
            tooltips.append(new Text({ x: 5 })).text(xAxisName + ": " + value);
            for (var i = 0; i < pointRowArray.length; i++) {
                var row = pointRowArray[i];
                var pointId = table.field('PointId', row);
                var unit = table.field('Unit', row);
                var value_1 = table.field('Value', row);
                var date = table.field('SuvDate', row);
                var niceDate = formatTime(date);
                var legend = legendManager.get(niceDate);
                var g = tooltips.append(new G().setView({ width: 145, height: 15 }));
                legend.draw(g, 5, 12, 50);
                g.append(new Text({ x: 15 })).text("" + pointId);
                if (isHorizontal) {
                    tooltips.append(new Text().setView({ width: 120, height: 15 })).text(unit + ": " + value_1);
                    tooltips.append(new Text().setView({ width: 145, height: 22 })).text(niceDate);
                }
                else {
                    tooltips.append(new Text().setView({ width: 145, height: 22 })).text(niceDate);
                }
            }
        });
    };
    Distribution.prototype.clear = function () {
        _super.prototype.clear.call(this);
        this.lines = [];
    };
    Distribution.clazz = "distribution";
    Distribution.title = "分布图";
    return Distribution;
}(Chart));

var ImageSvg = (function (_super) {
    __extends(ImageSvg, _super);
    function ImageSvg(attribute) {
        return _super.call(this, attribute) || this;
    }
    ImageSvg.TagName = 'image';
    return ImageSvg;
}(SvgObject));

var DistributionBackground = (function (_super) {
    __extends(DistributionBackground, _super);
    function DistributionBackground(selector) {
        var _this = _super.call(this, selector) || this;
        _this.zoom = 0.55;
        _this.isHorizontal = true;
        _this.option.view.height = 750;
        return _this;
    }
    DistributionBackground.prototype.initData = function () {
        _super.prototype.initData.call(this);
        var width = this.option.view.width;
        var imageWidth = this.data.imageWidth;
        var imageHeight = this.data.imageHeight;
        var zoom = !imageWidth || !imageHeight ? 1 :
            imageWidth > width ? width / imageWidth : 1;
        this.zoom = zoom;
        this.option.view.height = this.option.view.top + imageHeight * zoom + this.option.view.bottom;
        var imageFile = this.data.imageFile;
        if (imageFile && !imageFile.startsWith('http://') && !imageFile.startsWith('https://')) {
            if (imageFile.startsWith('/')) {
                imageFile = window.location.origin + imageFile;
            }
            else {
                imageFile = window.location.origin + '/' + imageFile;
            }
        }
        this.backgroundImage = imageFile;
    };
    DistributionBackground.prototype.initView = function () {
        var _a = this.option.view, width = _a.width, height = _a.height, top = _a.top, bottom = _a.bottom, left = _a.left, right = _a.right;
        var rotate = this.option.style.rotate;
        this.remove();
        this.svg = new Svg(d3.select(this.selector), { width: width, height: height });
        if (rotate) {
            this.svg.transform("rotate(" + rotate + ")");
        }
        this.styleComponent = new Style({ "type": "text/css", "media": "screen" });
        this.topComponent = new Component({ attribute: { class: 'top' } });
        this.bottomComponent = new Component({ attribute: { class: 'bottom' } });
        this.gridComponent = new Component({ attribute: { class: 'grid' } });
        this.topComponent.setView({ x: 0, y: 0, width: width, height: top });
        this.bottomComponent.setView({ x: 0, y: height - bottom, width: width, height: bottom, left: left, right: right });
        this.gridComponent.setView({ x: left, y: top, width: width - left - right, height: height - top - bottom });
        this.svg.append(this.styleComponent);
        var zoom = this.zoom;
        var _b = this.data, imageWidth = _b.imageWidth, imageHeight = _b.imageHeight, imageFile = _b.imageFile;
        var image = new ImageSvg({ x: 0, y: top, width: imageWidth * zoom, height: imageHeight * zoom, "xlink:href": imageFile, class: 'background-image' });
        this.svg.append(image);
        this.svg.append(this.topComponent);
        this.svg.append(this.bottomComponent);
        this.svg.append(this.gridComponent);
        this.linesComponent = this.gridComponent.append(new Component({ attribute: { class: 'lines' } }));
        this.pointsComponent = this.gridComponent.append(new Component({ attribute: { class: 'points' } }));
        this.legendsComponent = new Component({ attribute: { class: 'legends' } }).setView({
            x: 50,
            y: 25,
            width: 900,
            height: 70,
            boxOrient: "horizontal"
        });
        this.topComponent.append(this.legendsComponent);
    };
    DistributionBackground.prototype.initBackground = function () {
    };
    DistributionBackground.prototype.initModel = function () {
        var _this = this;
        _super.prototype.initModel.call(this);
        var _a = this, modelMap = _a.modelMap, xAxisName = _a.xAxisName, yAxisName = _a.yAxisName, data = _a.data, zoom = _a.zoom, table = _a.table;
        modelMap[xAxisName].scale = function (d) {
            var zoom = _this.zoom;
            var plotExpandCoef = _this.data.plotExpandCoef;
            var value = table.field('Value', d);
            var pointX = table.field('pointX', d);
            var pointY = table.field('pointY', d);
            var plotAngle = table.field('plotAngle', d);
            var valueY = table.field('valueY', d);
            var x;
            if (!!_this.data.dataYList) {
                x = (pointX) * zoom;
            }
            else {
                x = (pointX + value * Math.cos(plotAngle * Math.PI / 180) * plotExpandCoef) * zoom;
            }
            return x;
        };
        modelMap[yAxisName].scale = function (d) {
            var plotExpandCoef = data.plotExpandCoef;
            var value = table.field('Value', d);
            var pointX = table.field('pointX', d);
            var pointY = table.field('pointY', d);
            var plotAngle = table.field('plotAngle', d);
            var valueY = table.field('valueY', d);
            var y;
            if (!!data.dataYList) {
                y = (valueY) * zoom;
            }
            else {
                y = (pointY - value * Math.sin(plotAngle * Math.PI / 180) * plotExpandCoef) * zoom;
            }
            return y;
        };
    };
    DistributionBackground.prototype.initXAxis = function () {
        var _this = this;
        this.bottomComponent.getView().boxOrient = 'vertical';
        var _a = this, isHorizontal = _a.isHorizontal, option = _a.option;
        var width = this.gridComponent.getView().width;
        var time = this.modelMap.time;
        var timeAxis = new TimeAxis({
            model: time,
            click: function (time) {
                _this.onClickTime(time);
            }
        });
        timeAxis.setView({ width: width, height: 80, boxOrient: "vertical" });
        this.bottomComponent.append(timeAxis);
    };
    DistributionBackground.prototype.initYAxis = function () {
    };
    DistributionBackground.prototype.initEvent = function () {
    };
    DistributionBackground.prototype.drawLineClick = function (line) {
        var _a = this, modelMap = _a.modelMap, table = _a.table, left = _a.option.view.left;
        var points = line.data;
        var legend = line.legend;
        var scaleX = modelMap[this.xAxisName].scale;
        var scaleY = modelMap[this.yAxisName].scale;
        var lineGenerator = d3.line()
            .x(function (d) {
            return scaleX(d) - left;
        })
            .y(function (d) {
            return scaleY(d);
        })
            .defined(function (d) {
            return !!table.field('Value', d) && !!table.field('plotAngle', d);
        });
        if (points && points.length > 0) {
            var groupPointLength = 0;
            var groupPointCount = this.data.groupPointCount;
            if (groupPointCount.length > 1) {
                for (var i = 0, len = groupPointCount.length; i < len; i++) {
                    var count = groupPointLength + groupPointCount[i];
                    var pointsGroup = [];
                    for (var j = groupPointLength; j < count; j++) {
                        pointsGroup.push(points[j]);
                    }
                    groupPointLength = count;
                    this.linesComponent.append(new Path({
                        d: lineGenerator(pointsGroup),
                        stroke: legend.color,
                        'stroke-width': 1,
                        fill: 'none',
                        class: 'line'
                    }));
                }
            }
            else {
                this.linesComponent.append(new Path({ d: lineGenerator(points), stroke: legend.color, 'stroke-width': 1, fill: 'none', class: 'line' }));
            }
        }
    };
    DistributionBackground.prototype.drawPointClick = function (line) {
        var _a = this, modelMap = _a.modelMap, table = _a.table, left = _a.option.view.left;
        var points = line.data;
        var legend = line.legend;
        var scaleX = modelMap[this.xAxisName].scale;
        var scaleY = modelMap[this.yAxisName].scale;
        for (var i = 0, len = points.length; i < len; i++) {
            var point = points[i];
            var value = table.field('Value', point);
            var pointX = table.field('pointX', point);
            var pointY = table.field('pointY', point);
            var plotAngle = table.field('plotAngle', point);
            var valueY = table.field('valueY', point);
            if (!pointX || !value)
                continue;
            var x1 = scaleX(point) - left;
            var y1 = scaleY(point);
            var x2 = pointX * this.zoom - left;
            var y2 = pointY * this.zoom;
            this.linesComponent.append(new Line({ x1: x1, y1: y1, x2: x2, y2: y2, stroke: legend.color, class: 'line' }));
        }
    };
    DistributionBackground.clazz = "distribution-background";
    DistributionBackground.title = "带背景分布图";
    return DistributionBackground;
}(Distribution));

var Correlation = (function (_super) {
    __extends(Correlation, _super);
    function Correlation(selector) {
        var _this = _super.call(this, selector) || this;
        var schema = {
            name: Correlation.clazz,
            properties: {
                type: 'string',
                valueX: 'number',
                valueY: 'number'
            }
        };
        _this.table = _this.db.create(schema);
        return _this;
    }
    Correlation.prototype.initData = function () {
        var _a = this, action = _a.action, table = _a.table, modelMap = _a.modelMap, lineMap = _a.lineMap, legendManager = _a.legendManager, data = _a.option.data;
        this.data = clone(data && data.designcode ? data : data.object);
        var usedData = this.data;
        this.xAxisName = this.data.axisXLabel;
        this.yAxisName = this.data.axisYLabel;
        if (usedData.scatterDataList && usedData.scatterDataList.length > 0) {
            var type = 'scatter';
            for (var i = 0, len = usedData.scatterDataList.length; i < len; i++) {
                var item = usedData.scatterDataList[i];
                var valueX = item.valueX, valueY = item.valueY;
                table.insert([type, parseFloat(valueX), parseFloat(valueY)]);
            }
        }
        if (usedData.lineDataList && usedData.lineDataList.length > 0) {
            var type = 'line';
            for (var i = 0, len = usedData.lineDataList.length; i < len; i++) {
                var item = usedData.lineDataList[i];
                var valueX = item.valueX, valueY = item.valueY;
                table.insert([type, parseFloat(valueX), parseFloat(valueY)]);
            }
        }
        if (usedData.polynomialDataList && usedData.polynomialDataList.length > 0) {
            var type = 'polynomial';
            for (var i = 0, len = usedData.polynomialDataList.length; i < len; i++) {
                var item = usedData.polynomialDataList[i];
                var valueX = item.valueX, valueY = item.valueY;
                table.insert([type, parseFloat(valueX), parseFloat(valueY)]);
            }
        }
        this.title = this.data.title || this.title;
        this.tableBackup = table.copy(Correlation.clazz + '-backup');
    };
    Correlation.prototype.initModel = function () {
        var _a = this, table = _a.table, modelMap = _a.modelMap;
        var _b = this.gridComponent.getView(), width = _b.width, height = _b.height;
        var xModel = new LinearModel(this.xAxisName, 'valueX', 'horizontal', table.columns('valueX'));
        var yModel = new LinearModel(this.yAxisName, 'valueY', 'vertical', table.columns('valueY'));
        modelMap[this.xAxisName] = xModel;
        modelMap[this.yAxisName] = yModel;
        xModel.range = [0, width];
        yModel.range = [height, 0];
        xModel.tickSize = 0;
        yModel.tickSize = 0;
        xModel.tickPadding = 5;
        yModel.tickPadding = 20;
        xModel.init();
        yModel.init();
    };
    Correlation.prototype.initXAxis = function () {
        var width = this.gridComponent.getView().width;
        var xAxisModel = this.modelMap[this.xAxisName];
        var xAxis = new LinearAxis({ model: xAxisModel, type: "axisBottom" }).setView({ width: width, height: 20 });
        this.bottomComponent.append(xAxis);
        this.drawDottedLine(xAxisModel.tickValues.length - 1, 'vertical');
    };
    Correlation.prototype.initYAxis = function () {
        var width = this.leftComponent.getView().width;
        var height = this.gridComponent.getView().height;
        var yAxisModel = this.modelMap[this.yAxisName];
        var yAxis = new LinearAxis({ model: yAxisModel, type: "axisLeft" }).setView({ x: width, y: -0.5, height: height });
        this.leftComponent.append(yAxis);
        this.drawDottedLine(yAxisModel.tickValues.length - 1, 'horizontal');
    };
    Correlation.prototype.initLegend = function () {
        var legendManager = this.legendManager;
        legendManager.add('scatter').drawLegend(this.legendsComponent, '实测值');
    };
    Correlation.prototype.initLines = function () {
    };
    Correlation.prototype.initPoints = function () {
        var _a = this, modelMap = _a.modelMap, xAxisName = _a.xAxisName, yAxisName = _a.yAxisName, legendManager = _a.legendManager;
        var data = this.data.scatterDataList;
        var type = 'scatter';
        var legend = legendManager.get(type);
        var scaleX = modelMap[xAxisName].scale;
        var scaleY = modelMap[yAxisName].scale;
        for (var i = 0, len = data.length; i < len; i++) {
            var valueX = data[i].valueX;
            var valueY = data[i].valueY;
            var x = scaleX(parseFloat(valueX));
            var y = scaleY(parseFloat(valueY));
            this.pointsComponent.append(new Circle({
                cx: x,
                cy: y,
                r: 3,
                fill: legend.color,
                stroke: 'orange',
                "stroke-width": 0,
                class: 'point',
            }));
        }
    };
    Correlation.prototype.initMenu = function () {
        _super.prototype.initMenu.call(this);
        var self = this;
        var _a = this, rootMenu = _a.menu, modelMap = _a.modelMap, xAxisName = _a.xAxisName, yAxisName = _a.yAxisName, state = _a.state;
        var _b = this, linesComponent = _b.linesComponent, legendsComponent = _b.legendsComponent, legendManager = _b.legendManager, data = _b.data;
        var scaleX = modelMap[xAxisName].scale;
        var scaleY = modelMap[yAxisName].scale;
        var lineGenerator = d3.line()
            .x(function (d) {
            return scaleX(parseFloat(d.valueX));
        })
            .y(function (d) {
            return scaleY(parseFloat(d.valueY));
        });
        rootMenu.append(new MenuSeparator());
        rootMenu.append(new MenuItem({
            text: '直线相关拟合线',
            type: this.state.menuStatus['直线相关拟合线'] ? 'check' : 'normal',
            action: function () {
                var menuType = '直线相关拟合线';
                console.log(menuType);
                var flag = state.menuStatus[menuType];
                if (flag) {
                    state.menuStatus[menuType] = false;
                }
                else {
                    state.menuStatus[menuType] = true;
                }
                var pointsLine = data.lineDataList;
                var typeLine = 'line';
                legendManager.add(typeLine).drawLegend(legendsComponent, '直线相关拟合线');
                var legendLine = legendManager.get(typeLine);
                if (pointsLine && pointsLine.length > 0) {
                    linesComponent.append(new Path({
                        d: lineGenerator(pointsLine),
                        fill: 'none',
                        stroke: legendLine.color,
                        'stroke-width': 1,
                        class: 'line'
                    }));
                }
            }
        }));
        rootMenu.append(new MenuItem({
            text: '多项式相关拟合线',
            type: 'check',
            action: function () {
                console.log("多项式相关拟合线");
                var pointsPolynomial = data.polynomialDataList;
                var typePolynomial = 'polynomial';
                legendManager.add(typePolynomial).drawLegend(legendsComponent, '多项式相关拟合线');
                var legendPolynomial = legendManager.get(typePolynomial);
                if (pointsPolynomial && pointsPolynomial.length > 0) {
                    linesComponent.append(new Path({
                        d: lineGenerator(pointsPolynomial),
                        fill: 'none',
                        stroke: legendPolynomial.color,
                        'stroke-width': 1,
                        class: 'line'
                    }));
                }
            }
        }));
        rootMenu.append(new MenuItem({
            text: '分年连线',
            action: function () {
                console.log("分年连线");
            }
        }));
        rootMenu.append(new MenuItem({
            text: '包络图',
            action: function () {
                console.log("包络图");
                var modelMap = self.modelMap, data = self.data, xAxisName = self.xAxisName, yAxisName = self.yAxisName;
                var scaleX = modelMap[xAxisName].scale;
                var scaleY = modelMap[yAxisName].scale;
                var scatterDataList = data.scatterDataList;
                var points = [];
                for (var i = 0, len = scatterDataList.length; i < len; i++) {
                    var item = scatterDataList[i];
                    var valueX = scaleX(parseFloat(item.valueX));
                    var valueY = scaleY(parseFloat(item.valueY));
                    points.push([valueX, valueY]);
                }
                var pointsConvexHull = d3.polygonHull(points);
                var lineGenerator = d3.line()
                    .x(function (d) {
                    return (d[0]);
                })
                    .y(function (d) {
                    return (d[1]);
                });
                if (pointsConvexHull && pointsConvexHull.length > 0) {
                    var color = '#FF9966';
                    self.pointsComponent.append(new Path({
                        d: lineGenerator(pointsConvexHull),
                        fill: color,
                        stroke: color,
                        'stroke-width': 1,
                        'fill-opacity': 0.5,
                    }));
                }
            }
        }));
    };
    Correlation.clazz = "correlation";
    Correlation.title = "相关图";
    return Correlation;
}(Chart));

init();
var WPCharts = (function () {
    function WPCharts(selector) {
        this.selector = selector;
        this.chart = null;
    }
    WPCharts.prototype.setOption = function (option, callbacks) {
        if (!this.chart) {
            var type = option.type;
            if (!!type) {
                this.chart = new WPCharts.factory[type](this.selector);
            }
            else {
                throw new Error("error: not find type " + type);
            }
        }
        var chart = this.chart;
        chart.setOption(option, callbacks);
        return this;
    };
    WPCharts.prototype.outputSvg = function () {
        var chart = this.chart;
        if (chart) {
            return chart.outputSvg();
        }
        else {
            return '';
        }
    };
    WPCharts.prototype.test = function () {
        var isBrowser = typeof window !== 'undefined';
        var isNode = typeof global !== 'undefined';
        var Global = typeof window === 'undefined' ? global : window;
        if (isBrowser) {
            console.log("isBrowser:", isBrowser);
            window.WPCharts = WPCharts;
            var win = window;
            console.log("window:", window);
            console.log("win:", win);
            console.log("d3:", win.d3);
        }
        else if (isNode) {
            console.log("isNode:", isNode);
            console.log("Global:", Global);
        }
        var obj = new Hydrograph('');
        console.log.call(obj, "console.log:", 1);
        console.info.call(obj, "console.info:", 2);
        console.warn.call(obj, "console.warn:", 3);
        console.error.call(obj, "console.error:", 4);
        console.log("console.debug:", typeof console.debug, console.debug);
        console.debug("123123123");
    };
    WPCharts.factory = {};
    return WPCharts;
}());
var classList = [
    Hydrograph,
    Distribution,
    DistributionBackground,
    Correlation,
    Statistical,
];
for (var i$1 = 0, len = classList.length; i$1 < len; i$1++) {
    var item = classList[i$1];
    WPCharts.factory[item.clazz] = item;
}
function init$1(selector, globalConfigOption) {
    if (globalConfigOption) {
        GlobalConfig.request = globalConfigOption.request || GlobalConfig.request;
        GlobalConfig.response = globalConfigOption.response || GlobalConfig.response;
        GlobalConfig.document = globalConfigOption.document || GlobalConfig.document;
        GlobalConfig.style = globalConfigOption.style || GlobalConfig.style;
    }
    var wpcharts = new WPCharts(selector);
    console.log("wpcharts:", wpcharts);
    return wpcharts;
}
var config$1 = mode;

exports.config = config$1;
exports.init = init$1;
