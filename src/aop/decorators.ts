export function before(fun: (...rest: any[]) => void) {
    //console.log(1, arguments);
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        let oldMethod = descriptor.value;
        descriptor.value = function (...rest: any[]) {
            //console.log(2, arguments);
            fun.apply(this, rest);
            return oldMethod.apply(this, rest)
        };
    }
}

export function after(fun: (...rest: any[]) => void) {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        let oldMethod = descriptor.value;
        descriptor.value = function (...rest: any[]) {
            let result = oldMethod.apply(this, rest);
            fun.apply(this, rest);
            return result;
        };
    }
}
