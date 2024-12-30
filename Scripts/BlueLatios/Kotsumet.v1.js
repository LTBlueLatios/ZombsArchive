/* eslint-disable */
import WasmModule from "./WasmModule";

class WebSocketHandler {
    constructor() {
        this.sockets = [];
        this.altID = 0;

        this.altProperties = {
            scripts: {
                mouseMove: true,
                autoXKey: false,
            },
            states: {
                controlled: true,
                locked: false,
                dead: false,
                reversedYaw: false,
                mousePosition: { x: 0, y: 0 },
                showAltID: true,
            }
        };

        // Naming thing

        // Fuck you SeaWorld
        // Dolphins should never be kept in captivity
        // Fuck you and your greed for entertainment purposes
        // Spreading lies whilst hurting lives in the process
        // Making orcas seem all cute and cuddly when in reality they can casually ram you to death
        // This is a list of 32 dead orcas
        this.deadOrcas = [
            { orca: { name: "Kandu 1, F | 1971, 5", altNamed: false } },
            { orca: { name: "Kilroy, M | 1978, 8", altNamed: false } },
            { orca: { name: "Ramu, M | 1986, 14", altNamed: false } },
            { orca: { name: "Kona, F | 1987, 6", altNamed: false } },
            { orca: { name: "Orky 2, M | 1988, 20", altNamed: false } },
            { orca: { name: "Kenau, F | 1991, 11", altNamed: false } },
            { orca: { name: "Kandu 5, F | 1991, 15", altNamed: false } },
            { orca: { name: "Nootka 5, F | 1994, 13", altNamed: false } },
            { orca: { name: "Splash, M | 1994, 17", altNamed: false } },
            { orca: { name: "Shamu, F | 1971, 14", altNamed: false } },
            { orca: { name: "Kalina, F | 2010, 25", altNamed: false } },
            { orca: { name: "Taima, F | 2010, 20", altNamed: false } },
            { orca: { name: "Sumar, M | 2010, 12", altNamed: false } },
            { orca: { name: "Taku, M | 2007, 14", altNamed: false } },
            { orca: { name: "Tilikum, M | 2017, 36", altNamed: false } },
            { orca: { name: "Kayla, F | 2019, 30", altNamed: false } },
            { orca: { name: "Unna, F | 2015, 18", altNamed: false } },
            { orca: { name: "Kyara, F | 2017, 0.25", altNamed: false } },
            { orca: { name: "Kasatka, F | 2017, 42", altNamed: false } },
            { orca: { name: "Vicky, F | 2013, 17", altNamed: false } },
            { orca: { name: "Nakai, M | 2021, 20", altNamed: false } },
            { orca: { name: "Kalia, F | 2022, 22", altNamed: false } },
            { orca: { name: "Halyn, F | 2022, 2", altNamed: false } },
            { orca: { name: "Kohana, F | 2022, 20", altNamed: false } },
            { orca: { name: "Skyla, F | 2021, 17", altNamed: false } },
            { orca: { name: "Keto, M | 2023, 33", altNamed: false } },
            { orca: { name: "Amaya, F | 2021, 6", altNamed: false } },
            { orca: { name: "Corky 2, F | 2017, 53", altNamed: false } },
            { orca: { name: "Ulises, M | 1994, 18", altNamed: false } },
            { orca: { name: "Winston, M | 1986, 11", altNamed: false } },
            { orca: { name: "Kanduke, M | 1990, 17", altNamed: false } }
        ];
    }

    init() {
        this.hookEntityHandler();
        this.initEventHandler();
    }

    hookEntityHandler() {
        const { scripts, states } = this.altProperties;

        const worldToScreenScaleFactor = 100;
        const coordinateToPercentScaleFactor = 1 / 240;

        game.network.addEntityUpdateHandler(() => {
            this.sockets.forEach((ws) => {
                if (!ws.inWorld) return;

                const entity = game.world.entities[ws.myPlayer.uid];
                if (entity && states.showAltID) {
                    entity.targetTick.name = ws.cloneID.toString();
                }

                ws.player.style.left = (ws.myPlayer.position.x * coordinateToPercentScaleFactor).toFixed() + "%";
                ws.player.style.top = (ws.myPlayer.position.y * coordinateToPercentScaleFactor).toFixed() + "%";

                const aimOffsetX = -ws.myPlayer.position.x + states.mousePosition.x;
                const aimOffsetY = -ws.myPlayer.position.y + states.mousePosition.y;
                const mouseMovedPacket = game.inputPacketCreator.screenToYaw(aimOffsetX * worldToScreenScaleFactor, aimOffsetY * worldToScreenScaleFactor);
                this.sendPacket(3, { mouseMoved: mouseMovedPacket }, "Singular", ws);

                if (game.ui.playerPartyLeader) {
                    const partyMember = game.ui.playerPartyMembers[ws.myPlayer.uid];
                    if (partyMember && partyMember.canSell === 0) {
                        game.network.sendPacket(9, { name: "SetPartyMemberCanSell", uid: ws.myPlayer.uid, canSell: 1 }, "Singular", ws);
                    }
                }

                if (!states.locked) states.mousePosition = game.renderer.screenToWorld(game.ui.mousePosition.x, game.ui.mousePosition.y);

                if (scripts.mouseMove) {
                    const aimingYaw = game.inputPacketCreator.screenToYaw(aimOffsetX * worldToScreenScaleFactor, aimOffsetY * worldToScreenScaleFactor);
                    const yaw = DirectionMapper.aimToYaw(aimingYaw, states.reversedYaw ? true : false);

                    if (yaw && Object.prototype.hasOwnProperty.call(DirectionMapper.yawActions, yaw) && ws.lastYawSent !== yaw) {
                        ws.lastYawSent = yaw;
                        this.sendPacket(3, DirectionMapper.yawActions[yaw], "Singular", ws);
                    }
                }

                if (scripts.autoXKey) {
                    Object.values(game.world.entities).forEach(e => {
                        if (e.uid == ws.myPlayer.uid) {
                            if (e.targetTick.gold < 100) {
                                if (!ws.inventory.Bomb) {
                                    ws.network.sendPacket(9, { name: "BuyItem", itemName: "Bomb", tier: 1 });
                                }
                                if (ws.myPlayer.weaponName !== "Bomb") {
                                    ws.network.sendPacket(9, { name: "EquipItem", itemName: "Bomb", tier: ws.inventory.Bomb.tier });
                                }
                            }
                        }
                    });
                }

                const buildingCount = Object.values(ws.buildings).length;
                if (buildingCount > 0 && !ws.hasStashAlreadySet) {
                    ws.hasStash = true;
                    createEvent("wsEvent", {
                        detail: {
                            action: "Stash Placed"
                        }
                    });
                    console.log("stash placed");
                    ws.hasStashAlreadySet = true;
                } else if (buildingCount === 0 && ws.hasStashAlreadySet) {
                    ws.hasStash = false;
                    ws.hasStashAlreadySet = false;
                    showPopup(`Stash died for Alt ID: ${ws.cloneID}`);
                }
            });
        });
    }

    initEventHandler() {
        document.addEventListener("wsEvent", (data) => {
            const { action, payload } = data.detail;

            this.sockets.forEach((ws) => {
                switch (action) {
                    case "BuyItem":
                        const buyTier = ws.inventory[payload.itemName]?.tier ? ws.inventory[payload.itemName].tier + 1 : 1;
                        this.sendPacket(9, {
                            name: "BuyItem",
                            itemName: payload.itemName,
                            tier: buyTier
                        }, "Singular", ws);
                        break;
                    case "EquipItem":
                        if (ws.inventory[payload.itemName] === undefined || ws.inventory[payload.itemName] === null) return;

                        const equipTier = ws.inventory[payload.itemName].tier;
                        this.sendPacket(9, {
                            name: "EquipItem",
                            itemName: payload.itemName,
                            tier: equipTier
                        }, "Singular", ws);
                        break;
                    case "JoinMain":
                        this.sendPacket(9, { name: "JoinPartyByShareKey", partyShareKey: game.ui.playerPartyShareKey }, "Singular", ws);
                        break;
                    case "LeaveParty":
                        this.sendPacket(9, { name: "LeaveParty" }, "Singular", ws);
                        break;
                }
            })
        });
    }

    createSocket(nameType = "fuckSeaWorld", name = "", preset = "") {
        const server = game.options.servers[game.options.serverId];
        const ws = new WebSocket(`wss://${server.hostname}:443/`);
        ws.binaryType = "arraybuffer";

        // Name
        ws.socketName;
        switch (nameType) {
            case "Main":
                ws.socketName = game.options.nickname;
                break;
            case "Custom":
                ws.socketName = name;
                break;
            case "RandomUnicode":
                function generateRandomUnicode() {
                    const startUnicode = 0x0021; // !
                    const endUnicode = 0x007E; // ~

                    let result = "";
                    for (let i = 0; i < 28; i++) {
                        const randomUnicode = Math.floor(Math.random() * (endUnicode - startUnicode + 1)) + startUnicode;
                        result += String.fromCharCode(randomUnicode);
                    }
                    return result;
                }
                ws.socketName = generateRandomUnicode();
                break;
            case "Preset":
                if (preset == "longName") ws.socketName = "أفاستسقيناكموها".repeat(28);
                break;
            case "fuckSeaWorld":
                // Matryoshka Javascript Object moment
                const orcas = this.deadOrcas.find(orca => !orca.orca.altNamed);
                console.log(orcas.orca);
                ws.socketName = orcas.orca.name;
                orcas.orca.altNamed = true;
                break;
        }

        this.sockets.push(ws);

        ws.onopen = () => this.handleOpen(ws);
        ws.onmessage = (msg) => this.handleMessage(ws, msg);
        ws.onclose = () => this.handleClose(ws);
    }

    sendPacket(opcode, data, type = "All", ws, worldException = false) {
        switch (type) {
            case "Singular":
                ws.send(ws.codec.encode(opcode, data));
                break;
            case "All":
                this.sockets.forEach((ws) => {
                    if (ws.readyState !== 1 || (!worldException && !ws.inWorld)) return;
                    ws.send(ws.codec.encode(opcode, data));
                });
                break;
            case "Specific":
                // Send via selected alt ids or some shit
                break;
        }
    }

    handleOpen(ws) {
        ws.codec = new game.networkType().codec;
        ws.player = {};
        ws.myPlayer = {
            uid: null,
            position: { x: 0, y: 0 },
            model: "GamePlayer"
        };
        ws.inventory = {};
        ws.buildings = {};
        ws.hasStash = false;
        ws.hasStashAlreadySet = false;
        ws.inWorld = false;
        ws.wasmModule = WasmModule();
    }

    handleMessage(ws, msg) {
        const opcode = new Uint8Array(msg.data)[0];
        const m = new Uint8Array(msg.data);

        if (opcode == 5) {
            ws.wasmModule.onDecodeOpcode5(m, game.network.connectionOptions.ipAddress, decodedopcode5 => {
                this.sendPacket(4, {
                    displayName: ws.socketName,
                    extra: decodedopcode5[5]
                }, "Singular", ws);
                ws.enterworld2data = decodedopcode5[6];
            });
            return;
        }

        if (opcode == 10) {
            ws.send(ws.wasmModule.finalizeOpcode10(m));
            return;
        }

        ws.data = ws.codec.decode(msg.data);
        switch (ws.data.opcode) {
            case 0:
                for (let uid in ws.data.entities[ws.myPlayer.uid]) {
                    uid !== "uid" ? ws.myPlayer[uid] = ws.data.entities[ws.myPlayer.uid][uid] : 0;
                }
                break;
            case 4:
                if (!ws.data.allowed) {
                    ws.close();
                    showPopup("Alt failed to join, server is full!");
                    return;
                }

                ws.enterworld2data && ws.send(ws.enterworld2data);
                ws.myPlayer.uid = ws.data.uid;
                ws.inWorld = true;
                ws.cloneID = ++this.altID;
                const message = `Alt with ID ${ws.cloneID} joined!`
                showPopup(message, 2000);

                this.sendPacket(3, {
                    up: 1
                }, "Singular", ws);
                this.sendPacket(9, {
                    name: "JoinPartyByShareKey",
                    partyShareKey: game.ui.playerPartyShareKey
                }, "Singular", ws);

                // Load Leaderboard
                for (let i = 0; i < 26; i++) ws.send(new Uint8Array([3, 17, 123, 34, 117, 112, 34, 58, 49, 44, 34, 100, 111, 119, 110, 34, 58, 48, 125]));
                ws.send(new Uint8Array([7, 0]));
                ws.send(new Uint8Array([9, 6, 0, 0, 0, 126, 8, 0, 0, 108, 27, 0, 0, 146, 23, 0, 0, 82, 23, 0, 0, 8, 91, 11, 0, 8, 91, 11, 0, 0, 0, 0, 0, 32, 78, 0, 0, 76, 79, 0, 0, 172, 38, 0, 0, 120, 155, 0, 0, 166, 39, 0, 0, 140, 35, 0, 0, 36, 44, 0, 0, 213, 37, 0, 0, 100, 0, 0, 0, 120, 55, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 134, 6, 0, 0]));

                this.sendPacket(9, {
                    name: "BuyItem",
                    itemName: "PetCARL",
                    tier: 1
                }, "Singular", ws);
                this.sendPacket(9, {
                    name: "BuyItem",
                    itemName: "PetMiner",
                    tier: 1
                }, "Singular", ws);

                ws.player = document.createElement("div");
                ws.player.classList.add("hud-map-player");
                ws.player.style.display = "block";
                ws.player.dataset.index = "4";
                document.getElementsByClassName("hud-map")[0].appendChild(ws.player);
                break;
            case 9:
                this.handleRpc(ws, ws.data);
                break;
        }
    }

    handleRpc(ws, data) {
        switch (data.name) {
            case "Dead":
                this.sendPacket(3, { respawn: 1 }, "Singular", ws);
                ws.autoBow ? clearInterval(ws.autoBow) : this.sendPacket(3, { mouseUp: 1 }, "Singular", ws);
                ws.reverseYaw = true;
                setTimeout(() => {
                    ws.reverseYaw = false;
                }, 250);
                break;
            case "SetItem":
                ws.inventory[ws.data.response.itemName] = ws.data.response;
                !ws.inventory[ws.data.response.itemName].stacks ? delete ws.inventory[ws.data.response.itemName] : 0;
                break;
            case "PartyShareKey":
                ws.psk = ws.data.response.partyShareKey;
                break;
            case "DayCycle":
                ws.isDay = ws.data.response.isDay;
                break;
            case "LocalBuilding":
                for (let i in ws.data.response) {
                    ws.buildings[ws.data.response[i].uid] = ws.data.response[i];
                    ws.buildings[ws.data.response[i].uid].dead ? delete ws.buildings[ws.data.response[i].uid] : 0;
                }
                break;
        }
    }

    handleClose(ws) {
        ws.player?.remove?.();

        const orcaNameToFind = ws.socketName;
        const index = this.deadOrcas.findIndex(orca => orca.orca.name === orcaNameToFind);
        if (index !== -1) {
            this.deadOrcas[index].orca.altNamed = false;
            console.log(`AltNamed property for ${orcaNameToFind} set to false.`);
        } else {
            console.log("Orca not found, this shouldn't happen!");
        }

        const message = ws.inWorld ? `Connection closed for Alt ID: ${ws.cloneID}` : "Alt connection closed, failed to join world (IP Limit?)";
        showPopup(message);

        const socketIndex = this.sockets.indexOf(ws);
        if (socketIndex !== -1) {
            this.sockets.splice(socketIndex, 1);
        } else {
            console.log("Socket not found in the sockets array ???");
        }
    }

    getClosestPlayerToMouse() {
        const { x: mouseX, y: mouseY } = this.altProperties.states.mousePosition;
        let closestUID = null;
        let closestDistanceSquared = Number.MAX_VALUE;

        this.sockets.forEach(({ myPlayer }) => {
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
    }
}

const wsHandler = new WebSocketHandler();
wsHandler.init();

// Credits to trollers :3
class AutoBuild {
    constructor() {
        this.buildingSchemaObj = { "Wall": 0, "Door": 1, "SlowTrap": 2, "ArrowTower": 3, "CannonTower": 4, "MeleeTower": 5, "BombTower": 6, "MagicTower": 7, "GoldMine": 8, "Harvester": 9, "GoldStash": 10 };
        this.buildingSchemaArr = ["Wall", "Door", "SlowTrap", "ArrowTower", "CannonTower", "MeleeTower", "BombTower", "MagicTower", "GoldMine", "Harvester", "GoldStash"];
        this.confirmedBase = null;
    }

    getBaseCode() {
        const buildingsArr = Object.values(game.ui.buildings);
        const stash = buildingsArr.shift();
        const arr = [stash.x / 48 + (stash.y / 48) * 500];
        console.log(handler);
        buildingsArr.forEach(e => arr.push(this.encodeBuilding((e.x - stash.x) / 48, (e.y - stash.y) / 48, e.tier, (handler.yawBuildings.get(e.uid)?.targetTick?.yaw || 0) / 90, this.buildingSchemaObj[e.type])));
        return JSON.stringify(arr);
    }

    async buildBase(baseCode) {
        const arr = JSON.parse(baseCode);
        let stash = Object.values(game.ui.buildings)[0];
        if (!stash) {
            stash = { x: Math.floor(arr[0] % 500) * 48, y: Math.floor(arr[0] / 500) * 48 };
            game.network.sendRpc({ name: "MakeBuilding", x: stash.x, y: stash.y, type: "GoldStash", yaw: 0 });
        }
        for (let i = 1; i < arr.length; i++) {
            const index = arr[i];
            const e = this.decodeBuilding(index);
            game.network.sendRpc({ name: "MakeBuilding", x: stash.x + e[0] * 48, y: stash.y + e[1] * 48, type: this.buildingSchemaArr[e[4]], yaw: e[3] * 90 });
        }
    }

    encodeBuilding(x, y, tier, yaw, key) {
        if (key <= 2) return yaw * 10 ** 6 + (y + 18.5) * 10 ** 4 + (x + 18.5) * 10 ** 2 + tier * 10 + key;
        if (key == 9) return yaw * 10 ** 8 + (y + 492) * 10 ** 5 + (x + 492) * 10 ** 2 + tier * 10 + key;
        return yaw * 10 ** 6 + (y + 18) * 10 ** 4 + (x + 18) * 10 ** 2 + tier * 10 + key;
    }

    decodeBuilding(num) {
        if (num % 10 <= 2) return [Math.round(Math.floor(num / 10 ** 2) % 100) - 18.5, Math.round(Math.floor(num / 10 ** 4) % 100) - 18.5, Math.round(Math.floor(num / 10) % 10), Math.floor(num / 10 ** 6), num % 10];
        if (num % 10 == 9) return [Math.round(Math.floor(num / 10 ** 2) % 1000) - 492, Math.round(Math.floor(num / 10 ** 5) % 1000) - 492, Math.round(Math.floor(num / 10) % 10), Math.floor(num / 10 ** 8), num % 10];
        return [Math.round(Math.floor(num / 10 ** 2) % 100) - 18, Math.round(Math.floor(num / 10 ** 4) % 100) - 18, Math.round(Math.floor(num / 10) % 10), Math.floor(num / 10 ** 6), num % 10];
    }
}

const autoBuild = new AutoBuild();

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
    aimToYaw: (num, reverseYaw = false) => {
        // Note: There's apparently been a weird edge case where the alts would fly off
        // I have only been able to replicate this once, and that was due to network lag
        // Idk how to fix this, and unless I can properly reproduce this
        // I'll probably never will
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
        if (reverseYaw && matchingMovement !== null) {
            matchingMovement = (matchingMovement + 180) % 360;
        }
        return matchingMovement;
    }
};

function createEvent(type, data) {
    document.dispatchEvent(new CustomEvent(type, data));
}

function showPopup(msg, delay) {
    game.ui.getComponent("PopupOverlay")
        .showHint(msg, delay);
}

document.addEventListener("keydown", function (event) {
    if (event.ctrlKey) return; // Prevent triggering during key combinations

    if (game.world.inWorld && document.activeElement.tagName.toLowerCase() !== "input" && document.activeElement.tagName.toLowerCase() !== "textarea") {
        const { states, scripts } = wsHandler.altProperties;
        let message;

        switch (event.code) {
            case "KeyL":
                wsHandler.createSocket();
                break;
            case "Slash":
                game.ui.components.Chat.startTyping()
                break;
            case "Period":
                const closestPlayerUID = wsHandler.getClosestPlayerToMouse();
                wsHandler.sockets.forEach((ws) => {
                    if (ws.myPlayer.uid === closestPlayerUID) {
                        if (ws.myPlayer.weaponName == "Bow") {
                            ws.autoBow = setInterval(() => {
                                wsHandler.sendPacket(3, { space: 0 }, "Singular", ws);
                                wsHandler.sendPacket(3, { space: 1 }, "Singular", ws);
                                wsHandler.sendPacket(3, { space: 0 }, "Singular", ws);
                                wsHandler.sendPacket(3, { space: 1 }, "Singular", ws);
                            }, 50);
                        } else {
                            wsHandler.sendPacket(3, { mouseDown: 1 }, "Singular", ws);
                        }
                    }
                });
                break;
            case "KeyJ":
                createEvent("wsEvent", {
                    detail: {
                        action: "JoinMain"
                    }
                });
                break;
            case "KeyH":
                createEvent("wsEvent", {
                    detail: {
                        action: "LeaveParty"
                    }
                })
                break;
            case "KeyI":
                game.network.sendRpc({
                    name: "LeaveParty"
                });
                break;
            case "KeyU":
                states.locked = !states.locked;
                message = states.locked ? "Alt's are now: Locked" : "Alt's are now: Unlocked";
                showPopup(message, 2000);
                break;
            case "KeyC":
                states.controlled = !states.controlled;
                message = states.controlled ? "Alt's are now: Controlled" : "Alt's are now: Not Controlled";
                showPopup(message, 2000);
                break;
            case "KeyG":
                if (!states.controlled) return;

                wsHandler.sendPacket(9, { name: "DeleteBuilding", uid: ws.myPlayer.petUid });
                break;
            case "KeyN":
                if (!states.controlled) return;

                wsHandler.sendPacket(9, { name: "BuyItem", itemName: "PetMiner", tier: 1 });
                wsHandler.sendPacket(9, { name: "EquipItem", itemName: "PetMiner", tier: 1 });
                break;
            case "KeyM":
                if (!states.controlled) return;

                wsHandler.sendPacket(9, { name: "BuyItem", itemName: "PetRevive", tier: 1 });
                wsHandler.sendPacket(9, { name: "EquipItem", itemName: "PetRevive", tier: 1 });
                break;
            case "BracketLeft":
                wsHandler.sockets.forEach((ws) => {
                    (Object.values(ws.buildings).length == 0 ? game.network.sendPacket(9, { name: "JoinPartyByShareKey", partyShareKey: ws.psk }) : 0);
                });
                break;
            case "BracketRight":
                // TODO: Make this customizable
                const base = "[0,171214,191214,172414,192414,212511,222511,232511,242511,252511,252411,252311,252211,252111,251611,251511,251411,251311,251211,241211,231211,221211,211211,161211,151211,141211,131211,121211,121311,121411,121511,121611,122111,122211,122311,122411,122511,132511,142511,152511,162511,131313,151313,132313,132113,212313,232313,231513,231313,171416,191416,172216,192216,121914,121714,141916,141716,241914,241714,221916,221716,211518,211318,131518,151518,152118,152318,212118,232118]"
                autoBuild.buildBase(base);
                break;
        }
    }
});

document.addEventListener("mousedown", function (event) {
    if (event.button === 2) {
        wsHandler.altProperties.states.reversedYaw = true;
    }
});

document.addEventListener("mouseup", function (event) {
    if (event.button === 2) {
        wsHandler.altProperties.states.reversedYaw = false;
    }
});

const originalSendRpc = game.network.sendRpc;
game.network.sendRpc = function () {
    const { scripts, states } = wsHandler.altProperties;
    const args = Array.from(arguments);
    const rpcName = args[0].name;

    if (rpcName == "BuyItem" && args[0].itemName) {
        createEvent("wsEvent", {
            detail: {
                action: "BuyItem",
                payload: {
                    itemName: args[0].itemName
                }
            }
        });
    } j

    if (rpcName == "EquipItem" && args[0].itemName) {
        createEvent("wsEvent", {
            detail: {
                action: "EquipItem",
                payload: {
                    itemName: args[0].itemName
                }
            }
        });
    }

    if (rpcName == "SendChatMessage") {
        let command;
        if (args[0].message.startsWith("/")) {
            command = args[0].message.substring(1);
        } else {
            originalSendRpc.apply(this, args);
            return;
        }
        // params
        switch (command) {
            case "test":
                showPopup("test!");
                break;
            case "showAltID":
                states.showAltID = !states.showAltID;
                message = `Alt-ID Visible State ${states.showAltID ? "enabled" : "disabled"}.`;
                showPopup(message, 2e3);
                break;
            case "upStash":
                wsHandler.sockets.forEach((ws) => {
                    Object.values(ws.buildings).forEach(e => e.type == "GoldStash" ? ws.network.sendPacket(9, { name: "UpgradeBuilding", uid: e.uid }, "Singular", ws) : 0);
                });
                break;
            default:
                showPopup(`Unknown command ${command}`);
                break;
        }

        return; // prevent it from registering in chat
    }

    const result = originalSendRpc.apply(this, args);
    return result;
};

const originalSendInput = game.network.sendInput;
game.network.sendInput = function (...args) {
    const result = originalSendInput.apply(this, args);

    if (!wsHandler.altProperties.states.controlled) return;
    const [inputData] = args;

    if (Object.prototype.hasOwnProperty.call(inputData, "space")) {
        wsHandler.sendPacket(3, {
            space: inputData.space
        });
    }

    if (Object.prototype.hasOwnProperty.call(inputData, "mouseDown")) {
        wsHandler.sendPacket(3, {
            mouseDown: inputData.mouseDown
        });
    } else if (Object.prototype.hasOwnProperty.call(inputData, "mouseUp")) {
        wsHandler.sendPacket(3, {
            mouseUp: inputData.mouseUp
        });
    }

    return result;
};

const gameRenderer = {
    dimension: 1,
    maxDimension: 1.35,
    minDimension: 0.1,
    baseWidth: 1920,
    baseHeight: 1080,
    getRenderer() {
        return game.renderer;
    },
    updateScale() {
        const { innerWidth, innerHeight, devicePixelRatio } = window;
        const scaleWidth = innerWidth * devicePixelRatio / (this.baseWidth * this.dimension);
        const scaleHeight = innerHeight * devicePixelRatio / (this.baseHeight * this.dimension);
        const ratio = Math.max(scaleWidth, scaleHeight);

        const renderer = this.getRenderer();
        renderer.scale = ratio;
        renderer.entities.setScale(ratio);
        renderer.ui.setScale(ratio);
        renderer.renderer.resize(innerWidth * devicePixelRatio, innerHeight * devicePixelRatio);
        renderer.viewport.width = renderer.renderer.width / renderer.scale + 2 * renderer.viewportPadding;
        renderer.viewport.height = renderer.renderer.height / renderer.scale + 2 * renderer.viewportPadding;
    },
    adjustDimension(deltaY) {
        this.dimension += (deltaY > 0 ? 0.01 : -0.01);
        this.dimension = Math.min(this.maxDimension, Math.max(this.minDimension, this.dimension));
        this.updateScale();
    },
    initialize() {
        window.addEventListener("resize", this.updateScale.bind(this));
        window.addEventListener("wheel", event => this.adjustDimension(event.deltaY));
        this.updateScale(); // Initial adjustment
    }
};

gameRenderer.initialize();