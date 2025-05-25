/* global game */

const altObjects = {
    sockets: [],
    altId: 0,
    mousePosition: { x: 0, y: 0 },
    mouseMove: true,
    keyboard: true,
    states: {
        controlled: true,
        locked: false
    },
    sendPacketToAll: (opcode, packetData = {}) => {
        altObjects.sockets.forEach((ws) => {
            if (!altObjects.states.controlled) return;
            ws.network.sendPacket(opcode, packetData, ws);
        });
    },
    forEachSocket: (callback) => {
        altObjects.sockets.forEach((ws) => {
            callback(ws);
        })
    },
    getClosestPlayerToMouse: () => {
        const { x: mouseX, y: mouseY } = altObjects.mousePosition;
        let closestUID = null;
        let closestDistanceSquared = Number.MAX_VALUE;

        altObjects.sockets.forEach(({ myPlayer }) => {
            if (myPlayer.entityClass === "PlayerEntity") {
                const dx = mouseX - myPlayer.position.x;
                const dy = mouseY - myPlayer.position.y;
                const distanceSquared = dx * dx + dy * dy;
                if (distanceSquared < closestDistanceSquared) {
                    closestDistanceSquared = distanceSquared;
                    closestUID = myPlayer.uid;
                }
            }
        });

        return closestUID;
    },
    setupEventHandler() {
        document.addEventListener('wsEvent', (data) => {
            const { action, payload } = data.detail;

            altObjects.forEachSocket((ws) => {
                if (action === 'BuyItem') {
                    const tier = ws.inventory[payload.itemName]?.tier ? ws.inventory[payload.itemName].tier + 1 : 1;
                    ws.network.sendRpc({
                        name: "BuyItem",
                        itemName: payload.itemName,
                        tier: tier
                    });
                }

                if (action === "EquipItem") {
                    const tier = ws.inventory[payload.itemName].tier ? ws.inventory[payload.itemName].tier : 1;
                    ws.network.sendRpc({
                        name: "EquipItem",
                        itemName: payload.itemName,
                        tier: tier
                    })
                }
            })
        });
    },
};

altObjects.setupEventHandler();

class WebSocketHandler {
    constructor(name = "", sid = "") {
        this.name = name;
        this.sid = sid;
        this.enterworld2data = null;
        this.worker = new Worker("worker.js");
        // this.workerSever = new WebSocket('ws://localhost:3000');
        this.createWebSocket();
        this.setupWorker();
    }

    createWebSocket() {
        const serverId = this.sid || game.options.serverId;
        const server = game.options.servers[serverId];
        this.ws = new WebSocket(`wss://${server.hostname}:443/`);
        this.ws.binaryType = "arraybuffer";

        this.ws.onopen = () => this.handleOpen();
        this.ws.onmessage = (msg) => this.handleMessage(msg);
        this.ws.onclose = (e) => this.handleClose(e);
        this.ws.onRpc = () => this.handleRpc();
    }

    setupWorker() {
        this.worker.onmessage = (event) => {
            const {
                status,
                result,
                extra,
                enterworld2
            } = event.data;

            if (status === "finalizeOpcode10") {
                this.ws.send(result);
            } else if (status === "opcode5Complete") {
                this.ws.network.sendPacket(4, {
                    displayName: this.name,
                    extra: extra
                });
                this.enterworld2data = enterworld2;
            }
        };
    }

    handleOpen() {
        this.ws.network = new game.networkType();
        this.ws.network.sendPacket = (e, t) => {
            this.ws.send(this.ws.network.codec.encode(e, t));
        };
        this.ws.player = {};
        this.ws.myPlayer = { uid: null, position: { x: 0, y: 0 }, model: "GamePlayer" };
        this.ws.inventory = {};
        this.ws.buildings = {};
        this.ws.reversedYaw = false;
    }

    handleRpc() {
        switch (this.ws.data.name) {
            case "Dead":
                this.ws.network.sendPacket(3, { respawn: 1 });
                break;
            case "SetItem":
                this.ws.inventory[this.ws.data.response.itemName] = this.ws.data.response;
                !this.ws.inventory[this.ws.data.response.itemName].stacks ? delete this.ws.inventory[this.ws.data.response.itemName] : 0;
                break;
            case "PartyShareKey":
                this.ws.psk = this.ws.data.response.partyShareKey;
                break;
            case "DayCycle":
                this.ws.isDay = this.ws.data.response.isDay;
                break;
            case "LocalBuilding":
                for (let i in this.ws.data.response) {
                    this.ws.buildings[this.ws.data.response[i].uid] = this.ws.data.response[i];
                    this.ws.buildings[this.ws.data.response[i].uid].dead ? delete this.ws.buildings[this.ws.data.response[i].uid] : 0;
                }
                break;
        }
    }

    handleMessage(msg) {
        const opcode = new Uint8Array(msg.data)[0];
        if (opcode == 5) {
            console.log(msg.data);
            this.worker.postMessage({
                action: "opcode5",
                data: new Uint8Array(msg.data),
                ipAddress: game.network.connectionOptions.ipAddress,
            });
            return;
        }

        if (opcode == 10) {
            this.worker.postMessage({
                action: "opcode10",
                data: msg.data
            });
            return;
        }

        this.ws.data = this.ws.network.codec.decode(msg.data);
        switch (this.ws.data.opcode) {
            case 0:
                for (let uid in this.ws.data.entities[this.ws.myPlayer.uid]) {
                    uid !== "uid" ? this.ws.myPlayer[uid] = this.ws.data.entities[this.ws.myPlayer.uid][uid] : 0;
                }
                break;
            case 4:
                this.enterworld2data && this.ws.send(this.enterworld2data);
                this.ws.myPlayer.uid = this.ws.data.uid;
                this.ws.network.sendPacket(3, {
                    up: 1
                });

                if (game.world.inWorld) {
                    this.ws.network.sendPacket(9, {
                        name: "JoinPartyByShareKey",
                        partyShareKey: game.ui.playerPartyShareKey
                    });
                }

                // Load Leaderboard
                for (let i = 0; i < 26; i++) this.ws.send(new Uint8Array([3, 17, 123, 34, 117, 112, 34, 58, 49, 44, 34, 100, 111, 119, 110, 34, 58, 48, 125]));
                this.ws.send(new Uint8Array([7, 0]));
                this.ws.send(new Uint8Array([9, 6, 0, 0, 0, 126, 8, 0, 0, 108, 27, 0, 0, 146, 23, 0, 0, 82, 23, 0, 0, 8, 91, 11, 0, 8, 91, 11, 0, 0, 0, 0, 0, 32, 78, 0, 0, 76, 79, 0, 0, 172, 38, 0, 0, 120, 155, 0, 0, 166, 39, 0, 0, 140, 35, 0, 0, 36, 44, 0, 0, 213, 37, 0, 0, 100, 0, 0, 0, 120, 55, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 134, 6, 0, 0]));
                this.ws.cloneId = ++altObjects.altId;

                this.ws.network.sendRpc({
                    name: "BuyItem",
                    itemName: "PetCARL",
                    tier: 1
                });
                this.ws.network.sendRpc({
                    name: "BuyItem",
                    itemName: "PetMiner",
                    tier: 1
                });

                this.ws.player = document.createElement("div");
                this.ws.player.classList.add("hud-map-player");
                this.ws.player.style.display = "block";
                this.ws.player.dataset.index = "4";
                document.getElementsByClassName("hud-map")[0].appendChild(this.ws.player);

                altObjects.sockets.push(this.ws)
                break;
            case 9:
                !this.ws.isclosed ? this.ws.onRpc(this.ws.data) : 0;
                break;
        }
    }

    handleClose() {
        this.ws.isclosed = true;
        this.ws.player.remove();
        this.worker.terminate();
    }
};

const scriptObjects = {
    pop: 0,
    screenToYaw: (x, y) => {
        const angle = Math.round(scriptObjects.angleTo(game.renderer.getWidth() / 2, game.renderer.getHeight() / 2, x, y));
        return angle % 360;
    },
    angleTo: (xFrom, yFrom, xTo, yTo) => {
        var dx = xTo - xFrom;
        var dy = yTo - yFrom;
        var yaw = Math.atan2(dy, dx) * 180.0 / Math.PI;
        var nonZeroYaw = yaw + 180.0;
        var reversedYaw = nonZeroYaw; 3
        var shiftedYaw = (360.0 + reversedYaw - 90.0) % 360.0;
        return shiftedYaw;
    },
    hud: {
        showPopup: (msg = "Message is not provided!", delay = 2500) => {
            game.ui.getComponent("PopupOverlay")
                .showHint(msg, delay);
        }
    },
};

const originalSendRpc = game.network.sendRpc;
game.network.sendRpc = function () {
    const args = Array.from(arguments);
    const rpcName = args[0].name;

    if (rpcName === "BuyItem" && args[0].itemName) {
        console.log("Buying item:", args[0].itemName);

        document.dispatchEvent(new CustomEvent("wsEvent", {
            detail: {
                action: "BuyItem",
                payload: {
                    itemName: args[0].itemName
                }
            }
        }));
    }

    if (rpcName === "EquipItem" && args[0].itemName) {
        console.log("Equipping item:", args[0].itemName);

        document.dispatchEvent(new CustomEvent("wsEvent", {
            detail: {
                action: "EquipItem",
                payload: {
                    itemName: args[0].itemName
                }
            }
        }));
    }

    const result = originalSendRpc.apply(this, args);
    return result;
};

const originalSendInput = game.network.sendInput;
game.network.sendInput = function (...args) {
    const { sendPacketToAll } = altObjects;
    const [inputData] = args;

    if (Object.prototype.hasOwnProperty.call(inputData, "space")) {
        sendPacketToAll(3, {
            space: inputData.space
        });
    }

    if (Object.prototype.hasOwnProperty.call(inputData, "mouseDown")) {
        sendPacketToAll(3, {
            mouseDown: inputData.mouseDown
        });
    } else if (Object.prototype.hasOwnProperty.call(inputData, "mouseUp")) {
        sendPacketToAll(3, {
            mouseUp: inputData.mouseUp
        });
    }

    const result = originalSendInput.apply(this, args);
    return result;
};

const sendPackets = {
    packetList: {
        joinParty: (psk) => {
            game.network.sendRpc({
                name: "JoinPartyByShareKey",
                partyShareKey: psk
            });
        },
        leaveParty: () => {
            game.network.sendRpc({
                name: "LeaveParty"
            });
        },
    },
    send(packetType, ...args) {
        if (this.packetList.hasOwnProperty(packetType)) {
            this.packetList[packetType](...args);
        } else {
            console.error(`Packet type '${packetType}' not found in packetList.`);
        }
    },
};

const DirectionMapper = {
    yawActions: {
        90: { right: 1, left: 0, up: 0, down: 0 },
        225: { down: 1, left: 1, up: 0, right: 0 },
        44: { down: 0, left: 0, up: 1, right: 1 },
        314: { down: 0, left: 1, up: 1, right: 0 },
        135: { down: 1, left: 0, up: 0, right: 1 },
        359: { up: 1, down: 0, right: 0, left: 0 },
        180: { down: 1, up: 0, right: 0, left: 0 },
        270: { left: 1, right: 0, up: 0, down: 0 }
    },
    // Might be used in the future
    typeToValue: {
        "top": 359,
        "top right": 44,
        "right": 90,
        "bottom right": 135,
        "bottom": 180,
        "bottom left": 225,
        "left": 270,
        "top left": 314
    },
    aimToYaw: (num) => {
        const tolerance = 23;
        num = num % 360;
        let matchingMovement = null;
        for (let angle in DirectionMapper.yawActions) {
            angle = parseInt(angle);
            if (num >= angle - tolerance && num <= angle + tolerance ||
                num + 360 >= angle - tolerance && num <= angle - 360 + tolerance) {
                matchingMovement = angle;
                break; // Exit the loop early as we found a valid match.
            }
        }
        return matchingMovement;
    }
};

game.network.addEntityUpdateHandler(() => {
    const worldToScreenScaleFactor = 100;
    const coordinateToPercentScaleFactor = 1 / 240;

    altObjects.sockets.forEach((ws) => {
        const entity = game.world.entities[ws.myPlayer.uid];
        if (entity) {
            entity.targetTick.name = ws.cloneId + "";
        }

        ws.player.style.left = (ws.myPlayer.position.x * coordinateToPercentScaleFactor).toFixed() + "%";
        ws.player.style.top = (ws.myPlayer.position.y * coordinateToPercentScaleFactor).toFixed() + "%";

        const aimOffsetX = -ws.myPlayer.position.x + altObjects.mousePosition.x;
        const aimOffsetY = -ws.myPlayer.position.y + altObjects.mousePosition.y;
        const mouseMovedPacket = game.inputPacketCreator.screenToYaw(aimOffsetX * worldToScreenScaleFactor, aimOffsetY * worldToScreenScaleFactor);
        ws.network.sendPacket(3, { mouseMoved: mouseMovedPacket });

        if (game.ui.playerPartyLeader) {
            const partyMember = game.ui.playerPartyMembers[ws.myPlayer.uid];
            if (partyMember && partyMember.canSell === 0) {
                game.network.sendPacket(9, { name: "SetPartyMemberCanSell", uid: ws.myPlayer.uid, canSell: 1 });
            }
        }

        if (!altObjects.states.locked) altObjects.mousePosition = game.renderer.screenToWorld(game.ui.mousePosition.x, game.ui.mousePosition.y);

        if (altObjects.mouseMove) {
            const aimingYaw = game.inputPacketCreator.screenToYaw(aimOffsetX * worldToScreenScaleFactor, aimOffsetY * worldToScreenScaleFactor);
            const yaw = DirectionMapper.aimToYaw(aimingYaw);

            if (yaw && DirectionMapper.yawActions.hasOwnProperty(yaw) && ws.lastYawSent !== yaw) {
                ws.lastYawSent = yaw;
                ws.network.sendPacket(3, DirectionMapper.yawActions[yaw]);
            }
        }
    });
});

document.addEventListener("keydown", function (event) {
    if (document.activeElement.tagName.toLowerCase() !== "input" && document.activeElement.tagName.toLowerCase() !== "textarea") {
        switch (event.code) {
            case "KeyJ":
                altObjects.sendPacketToAll(9, {
                    name: "JoinPartyByShareKey",
                    partyShareKey: game.ui.playerPartyShareKey
                })
                break;
            case "KeyH":
                altObjects.sendPacketToAll(9, {
                    name: "LeaveParty"
                });
                break;
            case "Slash":
                game.ui.components.Chat.startTyping()
                break;
            case "Period":
                const closestPlayerUID = altObjects.getClosestPlayerToMouse();
                console.log(closestPlayerUID);
                altObjects.forEachSocket((ws) => {
                    if (ws.myPlayer.uid === closestPlayerUID) {
                        ws.network.sendPacket(3, { mouseDown: 1 });
                    }
                });
                break;
        }
    }
});

game.network.sendRpc2 = game.network.sendRpc;
game.network.sendRpc = (data) => {
    if (data.name == "SendChatMessage") {
        altObjects.forEachSocket((ws) => {
            if (data.message === "!ja") {
                if (Object.values(ws.buildings).length == 0) game.network.sendRpc({ name: "JoinPartyByShareKey", partyShareKey: ws.psk });
                console.log(Object.values(ws.buildings).length, ws.cloneId);
            }
        });

        if (data.message.startsWith("!")) {
            return;
        }
    }
    game.network.sendRpc2(data);
}

const chatCommands = {
    commands: {
        sendAlt: () => {
            new WebSocketHandler();
        },
        lock: () => {
            altObjects.states.locked = !altObjects.states.locked;
            console.log(`Locked state is now: ${altObjects.states.locked}`);
        },
        test: () => {
            console.log("Testing…");

            altObjects.forEachSocket((ws) => {
                console.log(ws);
            })
        },
        openAltParty: () => {
            altObjects.forEachSocket((ws) => {
                ws.network.sendPacket(9, {
                    name: "SetOpenParty",
                    isOpen: 1
                });

                ws.network.sendPacket(9, {
                    name: "SetPartyName",
                    partyName: `${ws.cloneId}`
                });
            });
        },
        closeAlt: (cloneId) => {
            altObjects.forEachSocket((ws) => {
                if (cloneId === ws.cloneId) ws.close();
            });
        },
        bind: (commandName, key) => {
            chatCommands.keybinds[commandName] = key;
            scriptObjects.hud.showPopup(`Bound key "${key}" to command "${commandName}"`);
            chatCommands.bind(key, commandName);
        },
    },
    init() {
        this.setKeybinds();
        this.hookChatRPC(game);
    },
    setKeybinds() {
        Object.entries(chatCommands.keybinds)
            .forEach(([commandName, key]) => {
                chatCommands.bind(key, commandName);
            });
    },
    hookChatRPC(game) {
        const originalSendRpc = game.network.sendRpc;
        game.network.sendRpc = (data) => {
            if (data.name === "SendChatMessage" && data.message.startsWith("/")) {
                const [command, ...args] = data.message.substring(1)
                    .split(" ");
                if (command === "bind" && args.length === 2) {
                    chatCommands.commands.bind(args[0], args[1]);
                    return;
                }
                chatCommands.executeCommand(command);
                return;
            }
            originalSendRpc.call(game.network, data);
        };
    },
    executeCommand(commandName) {
        if (Object.prototype.hasOwnProperty.call(this.commands, commandName)) {
            this.commands[commandName]();
        } else {
            console.log(`Command "${commandName}" not found!`);
        }
    },
    bind(key, commandName) {
        document.addEventListener("keydown", (event) => {
            if (document.activeElement.tagName.toLowerCase() !== "input" && document.activeElement.tagName.toLowerCase() !== "textarea") {
                if (event.key === key) {
                    chatCommands.executeCommand(commandName);
                }
            }
        });
    },
    keybinds: {
        lock: "i",
        test: "t",
    }
};

chatCommands.init();