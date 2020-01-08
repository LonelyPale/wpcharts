const mode = {
    debug: false,
    type: 'debug', //# debug | native
    setMode: setMode,
};

const output = {
    console: {
        log: console.log,
        info: console.info,
        warn: console.warn,
        error: console.error,
        time: console.time,
        timeEnd: console.timeEnd
    }
};

export function setMode(type?: string) {
    let flag = type ? type : mode.type;
    if (flag == 'debug') {
        console.log = log;
        console.info = log.i;
        console.warn = log.w;
        console.error = log.e;
        //(...rest: any) => log(...rest)
    } else if (flag == 'native') {
        console.log = output.console.log;
        console.info = output.console.info;
        console.warn = output.console.warn;
        console.error = output.console.error;
    }
}

function generateTag(this: any): string {
    if (!this) return '';
    const stack = [];
    let proto = this.__proto__;
    while (proto) {
        stack.push(proto.constructor.name);
        proto = proto.__proto__;
    }
    return stack.join(':') + ':';
}

//# define
export interface log {
    i(...rest: any[]): void;

    w(...rest: any[]): void;

    e(...rest: any[]): void;
}

export function log(this: any, ...args: any[]) {
    if (!mode.debug) return;
    if (this && this !== log && this !== console) {
        //const tag = `${this.constructor.name}:`;
        const tag = generateTag.apply(this);
        output.console.log(tag, ...args);
    } else {
        output.console.log(...args);
    }
}

log.i = function (this: any, ...args: any[]) {
    if (!mode.debug) return;
    if (this && this !== log && this !== console) {
        output.console.info(generateTag.apply(this), ...args);
    } else {
        output.console.info(...args);
    }
};

log.w = function (this: any, ...args: any[]) {
    if (this && this !== log && this !== console) {
        output.console.warn(generateTag.apply(this), ...args);
    } else {
        output.console.warn(...args);
    }
};

log.e = function (this: any, ...args: any[]) {
    if (this && this !== log && this !== console) {
        output.console.error(generateTag.apply(this), ...args);
    } else {
        output.console.error(...args);
    }
};

export default mode;
