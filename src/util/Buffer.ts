const K_MAX_LENGTH = 0x7fffffff;

const hexSliceLookupTable = (function () {
    const alphabet = '0123456789abcdef';
    const table = new Array(256);
    for (let i = 0; i < 16; ++i) {
        let i16 = i * 16;
        for (let j = 0; j < 16; ++j) {
            table[i16 + j] = alphabet[i] + alphabet[j];
        }
    }
    return table;
})();

function assertSize(size?: number) {
    if (typeof size !== 'number') {
        throw new TypeError('"size" argument must be of type number');
    } else if (size < 0) {
        throw new RangeError('The value "' + size + '" is invalid for option "size"');
    }
}

function createBuffer(length: number = 0) {
    if (length > K_MAX_LENGTH) {
        throw new RangeError('The value "' + length + '" is invalid for option "size"');
    }
    // Return an augmented `Uint8Array` instance
    let buf = new Uint8Array(length);
    Object.setPrototypeOf(buf, BufferCustom.prototype);
    return buf;
}

function hexSlice(buf: Uint8Array, start: number, end: number) {
    let len = buf.length;

    if (!start || start < 0) start = 0;
    if (!end || end < 0 || end > len) end = len;

    let out = '';
    for (let i = start; i < end; ++i) {
        out += hexSliceLookupTable[buf[i]];
    }
    return out;
}

class BufferCustom extends Uint8Array {

    toString(encoding?: string, start?: number, end?: number): string {
        if (!start || start < 0) start = 0;
        if (!end || end > this.length) end = this.length;
        if (end <= 0) {
            return '';
        }
        if (end <= start) {
            return '';
        }

        // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
        end >>>= 0;
        start >>>= 0;

        if (!encoding) encoding = 'utf8';
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
    }

    static alloc(size: number, fill?: string | BufferCustom | number, encoding?: BufferEncoding): BufferCustom {
        assertSize(size);
        return createBuffer(size);
    }

}

export let hasBufferType = false;

// Check if buffer exists
try {
    if (Buffer && Buffer.alloc) hasBufferType = true;
} catch (err) {
    hasBufferType = false;
}

if (!hasBufferType) {
    const Buffer = BufferCustom;
}

export default Buffer;
