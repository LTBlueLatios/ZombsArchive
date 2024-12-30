/* eslint-disable max-classes-per-file */
/* eslint-disable no-empty-function */

class WasmInstance {
    constructor(wasmBuffer, id) {
        this.id = id;
        this.repeater = 0;
        this.ready = false;
        this.opcode5Queue = [];
        this.hostname = null;
        this.blended = null;

        this.instantiate(wasmBuffer);
    }

    decodeBlendInternal(blended) {
        this.asm.j(24, 132);
        const pos = this.asm.j(228, 132);
        const extra = new Uint8Array(blended);
        for (let i = 0; i < 132; i++) {
            this.HEAPU8[pos + i] = extra[i + 1];
        }
        this.asm.j(172, 36);
        const index = this.asm.j(4, 152);
        const arraybuffer = new ArrayBuffer(64);
        const list = new Uint8Array(arraybuffer);
        for (let i = 0; i < 64; i++) {
            list[i] = this.HEAPU8[index + i];
        }
        return arraybuffer;
    }

    onDecodeOpcode5(blended, hostname, callback) {
        if (this.ready) {
            this.processOpcode5(blended, callback);
        } else {
            this.opcode5Queue.push({ blended, callback });
            this.hostname = hostname;
            this.blended = blended;
        }
    }

    processOpcode5(blended, callback) {
        this.asm.j(255, 140);
        const decoded = this.decodeBlendInternal(blended);
        const mcs = this.asm.j(187, 22);
        const opcode6Data = [6];
        for (let i = 0; i < 16; i++) {
            opcode6Data.push(this.HEAPU8[mcs + i]);
        }
        callback({ 5: decoded, 6: new Uint8Array(opcode6Data) });
    }

    finalizeOpcode10(blended) {
        const decoded = this.decodeBlendInternal(blended);
        const list = new Uint8Array(decoded);
        const data = [10];
        for (let i = 0; i < decoded.byteLength; i++) {
            data.push(list[i]);
        }
        return new Uint8Array(data);
    }

    instantiate(wasmBuffer) {
        WebAssembly.instantiate(wasmBuffer, {
            "a": {
                "d": () => { },
                "f": () => { },
                "c": () => { },
                "e": () => { },
                "b": () => {
                    this.repeater %= 5;
                    return [0, 0, 1, 0, 24][this.repeater++];
                },
                "a": () => {
                    this.HEAPU8.set(new Uint8Array([...new TextEncoder().encode(this.hostname)]), 200);
                    return 200;
                }
            }
        }).then(asm => {
            this.asm = asm.instance.exports;
            this.HEAPU8 = new Uint8Array(this.asm.g.buffer);
            this.asm.h();
            this.asm.i(0, 0);
            this.ready = true;
            this.processOpcode5Queue();
        });
    }

    processOpcode5Queue() {
        while (this.opcode5Queue.length > 0) {
            const { blended, callback } = this.opcode5Queue.shift();
            this.processOpcode5(blended, callback);
        }
    }
}

class WasmModule {
    constructor() {
        this.wasmBuffers = null;
        this.instances = new Map();
    }

    async loadWasm(wasmUrl = "http://localhost/zombs/zombs_wasm.wasm") {
        if (!this.wasmBuffers) {
            const response = await fetch(wasmUrl);
            const buffer = await response.arrayBuffer();
            this.wasmBuffers = new Uint8Array(buffer);
        }
    }

    createInstance(id) {
        if (!this.wasmBuffers) {
            throw new Error("Wasm module not loaded yet. Call loadWasm() first.");
        }
        if (this.instances.has(id)) {
          throw new Error(`Wasm instance with id ${id} already exists`);
        }
        const instance = new WasmInstance(this.wasmBuffers, id);
        this.instances.set(id, instance);
        return instance;
    }

    closeInstance(id) {
        const instance = this.instances.get(id);
        if (instance) {
            instance.asm = null;
            instance.HEAPU8 = null;
            this.instances.delete(id);
        }
    }

    onDecodeOpcode5(blended, hostname, callback, id) {
        const instance = this.instances.get(id);
        if (!instance) throw new Error(`Wasm instance with id ${id} does not exist`);

        instance.onDecodeOpcode5(blended, hostname, callback);
    }

    finalizeOpcode10(blended, id) {
        const instance = this.instances.get(id);
        if (!instance) throw new Error(`Wasm instance with id ${id} does not exist`);

        return instance.finalizeOpcode10(blended);
    }
}

const wasmModule = new WasmModule();

self.onmessage = async function ({ data }) {
    const { id, task, payload } = data;
    let result;
    switch (task) {
        case "load":
            await wasmModule.loadWasm();
            self.postMessage({ task: "loaded" });
            break;
        case "instantiate":
            wasmModule.createInstance(id);
            self.postMessage({ id, task: "instantiated" });
            break;
        case "opcode5":
            wasmModule.onDecodeOpcode5(payload.blended, payload.hostname, result => {
                self.postMessage({ id, task: "opcode5", result });
            }, id);
            console.log("opcode 5 solved");
            break;
        case "opcode10":
            result = wasmModule.finalizeOpcode10(payload, id);
            self.postMessage({ id, task: "opcode10", result });
            break;
        case "close":
            wasmModule.closeInstance(id);
            self.postMessage({ id, task: "closed" });
            break;
        default:
            self.postMessage({ id, error: `Unknown task: ${task}` });
    }
};
