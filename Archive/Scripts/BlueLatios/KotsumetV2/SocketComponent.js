import WasmModule from "../WasmModule";
import DEAD_ORCAS from "./DeadOrcas";

// type, opcode
const PACKETS = Object.freeze({
    ENTITY_UPDATE: 0,
    ENTER_WORLD: 4,
    PRE_ENTER_WORLD: 5,
    RPC: 9,
    WASM_KEEPALIVE: 10,
});

const SocketComponent = {
    init(socketHandler) {
        this.socketHandler = socketHandler;
        this.codecWorker = new Worker("http://localhost/zombs/Kotsumet/CodecWorker.js");
        this.codecWorker.onmessage = ({ data }) => this.handleCodecWorker(data);
        this.codecWorker.onerror = console.error;

        this.wasmWorker = new Worker("http://localhost/zombs/Kotsumet/WasmWorker.js");
        this.wasmWorker.onmessage = ({ data }) => this.handleWasmWorker(data);
        this.wasmWorker.postMessage({ task: "load" });
        this.wasmWorker.onerror = console.error;
    },
    handleCodecWorker(data) {
        const { id, action, result, opcode } = data;
        const socket = this.socketHandler.getSocketById(id);
        if (action === "decoded") {
            const packetType = Object.keys(PACKETS).find(key => PACKETS[key] === opcode);
            switch (packetType) {
                case "ENTITY_UPDATE":
                    this.handleEntityUpdate(JSON.parse(result), socket);
                    break;
                case "ENTER_WORLD":
                    this.handleEnterWorld(result, socket);
                    break;
                case "RPC":
                    this.handleRPC(result, socket);
                    break;
            }
        } else if (action === "encoded") {
            socket.send(result);
        }
    },
    handleWasmWorker(data) {
        const { id, task, result } = data;
        const socket = this.socketHandler.getSocketById(id);
        if (task === "opcode5") {
            this.sendPacket(socket, 4, {
                displayName: socket.name,
                extra: result[5]
            });
            socket.enterWorld2 = result[6];
        }

        if (task === "opcode10") {
            socket.send(result);
        }
    },
    handleOpen(event, socket) {
        this.codecWorker.postMessage({
            task: "initialise",
            id: socket.socketID
        });
        this.wasmWorker.postMessage({
            task: "instantiate",
            id: socket.socketID
        })
        socket.mapPointer = {};
        socket.myPlayer = {
            uid: null,
            position: { x: 0, y: 0 },
            model: "GamePlayer"
        };
        socket.inventory = {};
        socket.buildings = {};
        socket.hasStash = false;
        socket.hasStashAlreadySet = false;
        socket.inWorld = false;
        socket.wasmModule = WasmModule();
        socket.name = this.generateName();
    },
    generateName(type = "FuckSeaWorld", options) {
        const orca = DEAD_ORCAS.find(orca => !orca.altNamed);
        switch (type) {
            case "Main":
                return game.options.nickname;
            case "RandomUnicode":
                return this.enerateRandomUnicode();
            case "Preset":
                if (options.preset == "longName") return "أفاستسقيناكموها".repeat(28);
                break;
            case "FuckSeaWorld":
                orca.altNamed = true;
                return orca.name;
        }
    },
    generateRandomUnicode() {
        // !
        const startUnicode = 0x0021;
        // ~
        const endUnicode = 0x007E;
        let result = "";
        // 28 is the max name length
        for (let i = 0; i < 28; i++) {
            const randomUnicode = Math.floor(Math.random() * (endUnicode - startUnicode + 1)) + startUnicode;
            result += String.fromCharCode(randomUnicode);
        }
        return result;
    },
    handleMessage(event, socket) {
        const opcode = new Uint8Array(event.data)[0];
        const message = new Uint8Array(event.data);

        if (opcode === PACKETS.PRE_ENTER_WORLD) {
            this.wasmWorker.postMessage({
                task: "opcode5",
                payload: {
                    blended: message,
                    hostname: game.network.connectionOptions.ipAddress
                },
                id: socket.socketID
            });
            // socket.wasmModule.onDecodeOpcode5(message, game.network.connectionOptions.ipAddress, decodedopcode5 => {
            //     this.sendPacket(socket, 4, {
            //         displayName: socket.name,
            //         extra: decodedopcode5[5]
            //     });
            //     socket.enterWorld2 = decodedopcode5[6];
            // });
            return;
        }

        if (opcode === PACKETS.WASM_KEEPALIVE) {
            // socket.send(socket.wasmModule.finalizeOpcode10(message));
            this.wasmWorker.postMessage({
                task: "opcode10",
                payload: message,
                id: socket.socketID
            });
            return;
        }
        this.codecWorker.postMessage({
            task: "decode",
            id: socket.socketID,
            opcode: new Uint8Array(event.data)[0],
            buffer: new Uint8Array(event.data)
        });
    },
    handleClose(event, socket) {
        game.ui.getComponent("PopupOverlay").showHint("Socket closed", event.message);

        this.wasmWorker.postMessage({
            task: "close",
            id: socket.socketID
        });

        const orcaNameToFind = socket.name;
        const index = DEAD_ORCAS.findIndex(orca => orca.name === orcaNameToFind);
        if (index !== -1) {
            DEAD_ORCAS[index].altNamed = false;
            console.log(`AltNamed property for ${orcaNameToFind} set to false.`);
        } else {
            console.log("Orca not found, this shouldn't happen!");
        }

        socket.player?.remove?.();
        if (this.socketHandler.sockets.has(socket.socketID)) {
            this.socketHandler.sockets.delete(socket.socketID);
        } else {
            console.log("Socket not found in the sockets map ???");
        }
    },
    handleEnterWorld(decodedMessage, socket) {
        if (!decodedMessage.allowed) {
            socket.close();
            game.ui.getComponent("PopupOverlay").showHint("Socket closed, server is at max capacity");
            return;
        }
        socket.send(socket.enterWorld2);

        socket.myPlayer.uid = decodedMessage.uid;
        socket.inWorld = true;
        game.ui.getComponent("PopupOverlay").showHint(`Socket with id ${socket.socketID} joined`);

        this.sendPacket(socket, 3, {
            up: 1
        });
        this.sendPacket(socket, 9, {
            name: "JoinPartyByShareKey",
            partyShareKey: game.ui.playerPartyShareKey
        });
        // Speed exploit
        socket.send(new Uint8Array([8, 18]));

        this.sendPacket(socket, 9, {
            name: "BuyItem",
            itemName: "PetCARL",
            tier: 1
        });
        this.sendPacket(socket, 9, {
            name: "BuyItem",
            itemName: "PetMiner",
            tier: 1
        });

        socket.send(new Uint8Array([7, 0]));
        socket.send(new Uint8Array([9, 6, 0, 0, 0, 126, 8, 0, 0, 108, 27, 0, 0, 146, 23, 0, 0, 82, 23, 0, 0, 8, 91, 11, 0, 8, 91, 11, 0, 0, 0, 0, 0, 32, 78, 0, 0, 76, 79, 0, 0, 172, 38, 0, 0, 120, 155, 0, 0, 166, 39, 0, 0, 140, 35, 0, 0, 36, 44, 0, 0, 213, 37, 0, 0, 100, 0, 0, 0, 120, 55, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 134, 6, 0, 0]));

        socket.mapPointer = document.createElement("div");
        socket.mapPointer.classList.add("hud-map-player");
        socket.mapPointer.style.display = "block";
        socket.mapPointer.dataset.index = "4";
        document.getElementsByClassName("hud-map")[0].appendChild(socket.mapPointer);
    },
    handleEntityUpdate(decodedMessage, socket) {
        for (const uid in decodedMessage.entities[socket.myPlayer.uid]) {
            if (uid !== "uid") {
                socket.myPlayer[uid] = decodedMessage.entities[socket.myPlayer.uid][uid];
                if (socket.myPlayer[uid].petUid?.targetTick) {
                    socket.petUid = socket.myPlayer[uid].petUid.targetTick;
                }
            }
        }

        socket.mapPointer.style.left = `${(socket.myPlayer.position.x * 1 / 240).toFixed()}%`
        socket.mapPointer.style.top = `${(socket.myPlayer.position.y * 1 / 240).toFixed()}%`;

        const entity = game.world.entities[socket.myPlayer.uid];
        if (!entity) return;
        if (this.socketHandler.states.showAltID) {
            entity.targetTick.name = socket.socketID.toString();
        } else {
            entity.targetTick.name = socket.name;
        }
    },
    handleRPC(decodedMessage, socket) {
        const { name } = decodedMessage;
        switch (name) {
            case "Dead":
                this.sendPacket(socket, 3, {
                    respawn: 1
                });
                this.sendPacket(socket, 3, {
                    mouseUp: 1
                });
                break;
            case "SetItem":
                socket.inventory[decodedMessage.response.itemName] = decodedMessage.response;
                !socket.inventory[decodedMessage.response.itemName].stacks ? delete socket.inventory[decodedMessage.response.itemName] : 0;
                break;
            case "LocalBuilding":
                for (const i in decodedMessage.response) {
                    socket.buildings[decodedMessage.response[i].uid] = decodedMessage.response[i];
                    socket.buildings[decodedMessage.response[i].uid].dead ? delete socket.buildings[decodedMessage.response[i].uid] : 0;
                }
                break;
            case "PartyShareKey":
                socket.partyShareKey = decodedMessage.response.partyShareKey;
                break;
        }
    },
    sendPacket(socket, opcode, data, all = false) {
        if (all === true) {
            this.socketHandler.sockets.forEach(socket => {
                if (!socket.inWorld) return;
                this.codecWorker.postMessage({
                    task: "encode",
                    id: socket.socketID,
                    opcode: opcode,
                    buffer: data
                });
            });
            return;
        }

        if (socket.readyState === 1) {
            this.codecWorker.postMessage({
                task: "encode",
                id: socket.socketID,
                opcode: opcode,
                buffer: data
            });
        }
    }
};

export default SocketComponent;