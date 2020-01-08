export const wasmBrowserInstantiate = async (wasmModuleUrl, importObject) => {
    let response = undefined;

    if (!importObject) {
        importObject = {
            env: {
                abort: () => console.log("Abort!")
            }
        };
    }

    // Check if the browser supports streaming instantiation
    if (WebAssembly.instantiateStreaming) {
        // Fetch the module, and instantiate it as it is downloading
        response = await WebAssembly.instantiateStreaming(
            fetch(wasmModuleUrl),
            importObject
        );
    } else {
        // Fallback to using fetch to download the entire module
        // And then instantiate the module
        const fetchAndInstantiateTask = async () => {
            const wasmArrayBuffer = await fetch(wasmModuleUrl).then(response =>
                response.arrayBuffer()
            );
            return WebAssembly.instantiate(wasmArrayBuffer, importObject);
        };
        response = await fetchAndInstantiateTask();
    }

    return response;
};

export const runWasmAdd = async () => {
    // Instantiate our wasm module
    const wasmModule = await wasmBrowserInstantiate("./f.wasm");

    // Call the Add function export from wasm, save the result
    const addResult = wasmModule.instance.exports.add(24, 24);

    let label = '斐波那契-wasm:';
    console.time(label);
    const addResult1 = wasmModule.instance.exports.f(40);
    console.timeEnd(label);

    // Set the result onto the body
    document.body.textContent = `Hello World! addResult: add: ${addResult}, f: ${addResult1}`;
};

runWasmAdd();


function f(x) {
    if (x === 1 || x === 2) {
        return 1;
    }
    return f(x - 1) + f(x - 2);
}

let label = '斐波那契-js:';
console.time(label);
console.log('f:', f(40));
console.timeEnd(label);

console.log("%cHello", "color:red");

/*
<!--
asc f.ts -o f.wasm
asc f.ts -b f.wasm

http://localhost:8082/wpcharts/test/AssemblyScript/f.html
-->
*/