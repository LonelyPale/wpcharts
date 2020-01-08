import Buffer from "./Buffer";

// Precomputed hex table enables speedy hex string conversion
const hexTable: string[] = [];
for (let i = 0; i < 256; i++) {
    hexTable[i] = (i <= 15 ? '0' : '') + i.toString(16);
}

function insecureRandomBytes(size: number) {
    const result = new Uint8Array(size);
    for (let i = 0; i < size; ++i) result[i] = Math.floor(Math.random() * 256);
    return result;
}

let randomBytes = insecureRandomBytes;

// constants
//const PROCESS_UNIQUE = randomBytes(5); // Machine and PID

export class ObjectId {

    public static cacheHexString: boolean = true;
    private static index = ~~(Math.random() * 0xffffff);

    private readonly id: Buffer;
    private _id: string = '';

    constructor() {
        this.id = ObjectId.generate();// Generate a new id
        if (ObjectId.cacheHexString) this._id = this.toString();// If we are caching the hex string
    }

    toHexString(): string {
        if (ObjectId.cacheHexString && this._id) return this._id;

        let hexString = '';
        if (Buffer && Buffer.alloc) {
            hexString = this.id.toString('hex');
        } else {
            for (let i = 0; i < this.id.length; i++) {
                const hexChar = hexTable[this.id[i]];
                hexString += hexChar;
            }
        }

        if (ObjectId.cacheHexString) this._id = hexString;

        return hexString;
    }

    toString(): string {
        return this.toHexString();
    }

    private static generate(time?: number) {
        if ('number' !== typeof time) {
            time = ~~(Date.now() / 1000);
        }

        const PROCESS_UNIQUE = randomBytes(5);

        const inc = ObjectId.getInc();
        const buffer = Buffer.alloc(12);

        // 4-byte timestamp
        buffer[3] = time & 0xff;
        buffer[2] = (time >> 8) & 0xff;
        buffer[1] = (time >> 16) & 0xff;
        buffer[0] = (time >> 24) & 0xff;

        // 5-byte process unique
        buffer[4] = PROCESS_UNIQUE[0];
        buffer[5] = PROCESS_UNIQUE[1];
        buffer[6] = PROCESS_UNIQUE[2];
        buffer[7] = PROCESS_UNIQUE[3];
        buffer[8] = PROCESS_UNIQUE[4];

        // 3-byte counter
        buffer[11] = inc & 0xff;
        buffer[10] = (inc >> 8) & 0xff;
        buffer[9] = (inc >> 16) & 0xff;

        return buffer;
    }

    private static getInc() {
        return (ObjectId.index = (ObjectId.index + 1) % 0xffffff);
    }

}
