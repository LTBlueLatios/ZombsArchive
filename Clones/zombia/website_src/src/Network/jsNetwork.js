import { Game } from "../Game.js";
import { PacketIds } from "./PacketIds.js";
import { InputPacketManager } from "./InputPacketManager.js";
import ByteBuffer from "bytebuffer";

const grawlix = require("grawlix");
const grawlixRacism = require("grawlix-racism");

grawlix.loadPlugin(grawlixRacism);

grawlix.setDefaults({
    randomize: false
});

class Network {
    constructor() {
        this.socket = null;
        this.connected = false;
        this.connecting = false;
        this.outOfSync = false;

        this.ping = 0;
        this.pingStart = null;
        this.pingCompletion = null;
        this.entityUpdateTimeDelta = performance.now();
        this.lastEntityUpdateMessageReceived = 0;

        this.options = { name: "", partyKey: "" };
        this.rpcMap = {};
        this.languageFilterEnabled = true;
        this.currentTickNumber = 0;
        this.knownEntities = {};
        this.packetArr = [];
        this.packetCountLimit = 200;

        this.inputPacketManager = new InputPacketManager();

        this.modelProps = {
            "ArrowProjectile": {
                name: "ArrowProjectile",
                index: 0,
                props: ["position", "yaw"],
                entityClass: "Projectile"
            },
            "CannonProjectile": {
                name: "CannonProjectile",
                index: 1,
                props: ["position", "yaw"],
                entityClass: "Projectile"
            },
            "DynamiteProjectile": {
                name: "DynamiteProjectile",
                index: 2,
                props: ["position", "tier", "yaw"],
                entityClass: "Projectile"
            },
            "MageProjectile": {
                name: "MageProjectile",
                index: 3,
                props: ["position", "yaw"],
                entityClass: "Projectile"
            },
            "RocketProjectile": {
                name: "RocketProjectile",
                index: 4,
                props: ["position", "tier", "yaw"],
                entityClass: "Projectile"
            },
            "ArrowTower": {
                name: "ArrowTower",
                index: 5,
                props: ["aimingYaw", "firingTick", "health", "lastDamagedTick", "maxHealth", "position", "tier"],
                entityClass: "Building"
            },
            "CannonTower": {
                name: "CannonTower",
                index: 6,
                props: ["aimingYaw", "firingTick", "health", "lastDamagedTick", "maxHealth", "position", "tier"],
                entityClass: "Building"
            },
            "LightningTower": {
                name: "LightningTower",
                index: 7,
                props: ["firingTick", "health", "lastDamagedTick", "maxHealth", "position", "targetBeams", "tier"],
                entityClass: "Building"
            },
            "MageTower": {
                name: "MageTower",
                index: 8,
                props: ["aimingYaw", "firingTick", "health", "lastDamagedTick", "maxHealth", "position", "tier"],
                entityClass: "Building"
            },
            "RocketTower": {
                name: "RocketTower",
                index: 9,
                props: ["aimingYaw", "firingTick", "health", "lastDamagedTick", "maxHealth", "position", "tier"],
                entityClass: "Building"
            },
            "SawTower": {
                name: "SawTower",
                index: 10,
                props: ["firingTick", "health", "lastDamagedTick", "maxHealth", "position", "tier", "yaw"],
                entityClass: "Building"
            },
            "Wall": {
                name: "Wall",
                index: 11,
                props: ["health", "lastDamagedTick", "maxHealth", "position", "tier"],
                entityClass: "Building"
            },
            "LargeWall": {
                name: "LargeWall",
                index: 12,
                props: ["health", "lastDamagedTick", "maxHealth", "position", "tier"],
                entityClass: "Building"
            },
            "Door": {
                name: "Door",
                index: 13,
                props: ["health", "lastDamagedTick", "maxHealth", "partyId", "position", "tier"],
                entityClass: "Building"
            },
            "SpikeTrap": {
                name: "SpikeTrap",
                index: 14,
                props: ["lastDamagedTick", "partyId", "position", "tier"],
                entityClass: "Building"
            },
            "Drill": {
                name: "Drill",
                index: 15,
                props: ["health", "lastDamagedTick", "maxHealth", "position", "tier"],
                entityClass: "Building"
            },
            "Harvester": {
                name: "Harvester",
                index: 16,
                props: ["droneCount", "health", "lastDamagedTick", "maxHealth", "position", "targetResourceUid", "tier", "yaw"],
                entityClass: "Building"
            },
            "HarvesterDrone": {
                name: "HarvesterDrone",
                index: 17,
                props: ["currentHarvestStage", "health", "lastDamagedTick", "maxHealth", "position", "tier", "yaw"],
                entityClass: "Npc"
            },
            "ResourcePickup": {
                name: "ResourcePickup",
                index: 18,
                props: ["position", "resourceAmount", "resourcePickupType"],
                entityClass: "ResourcePickup"
            },
            "Factory": {
                name: "Factory",
                index: 19,
                props: ["aggroEnabled", "health", "lastDamagedTick", "maxHealth", "partyId", "position", "tier", "warmingUp"],
                entityClass: "Building"
            },
            "Player": {
                name: "Player",
                index: 20,
                privateProps: ["aimingYaw", "dead", "firingTick", "invulnerable", "gold", "health", "lastDamagedTick", "lastPlayerDamages", "maxHealth", "name", "partyId", "position", "stone", "tokens", "wave", "weaponName", "weaponTier", "wood", "zombieShieldHealth", "zombieShieldMaxHealth"],
                publicProps: ["aimingYaw", "dead", "firingTick", "invulnerable", "health", "lastDamagedTick", "maxHealth", "name", "position", "weaponName", "weaponTier", "zombieShieldHealth", "zombieShieldMaxHealth"],
                entityClass: "Player"
            },
            "Tree1": {
                name: "Tree1",
                index: 21,
                props: ["aimingYaw", "hits", "position", "radius", "resourceType"],
                entityClass: "Resource"
            },
            "Tree2": {
                name: "Tree2",
                index: 22,
                props: ["aimingYaw", "hits", "position", "radius", "resourceType"],
                entityClass: "Resource"
            },
            "Stone1": {
                name: "Stone1",
                index: 23,
                props: ["aimingYaw", "hits", "position", "radius", "resourceType"],
                entityClass: "Resource"
            },
            "Stone2": {
                name: "Stone2",
                index: 24,
                props: ["aimingYaw", "hits", "position", "radius", "resourceType"],
                entityClass: "Resource"
            },
            "Zombie": {
                name: "Zombie",
                index: 25,
                props: ["colour", "maxHealth", "position", "tier", "yaw"],
                entityClass: "Zombie"
            },
            "SpellIndicator": {
                name: "SpellIndicator",
                index: 26,
                props: ["position", "radius", "spellType"],
                entityClass: "Spell"
            },
            "Visualiser": {
                name: "Visualiser",
                index: 27,
                props: ["position", "yaw"],
                entityClass: "Visualiser"
            },
        };

        this.propTypes = {
            "aimingYaw": "Uint16",
            "aggroEnabled": "Boolean",
            "currentHarvestStage": "Uint8",
            "dead": "Boolean",
            "droneCount": "Uint8",
            "entityClass": "String",
            "experience": "Uint16",
            "firingTick": "Uint32",
            "hatName": "String",
            "health": "Uint16",
            "hits": "ArrayUint32",
            "targetBeams": "ArrayUint32",
            "lastPlayerDamages": "ArrayUint32",
            "lastPetDamage": "Uint16",
            "lastPetDamageTarget": "Uint16",
            "lastPetDamageTick": "Uint32",
            "lastDamagedTick": "Uint32",
            "maxHealth": "Uint16",
            "gold": "Uint32",
            "model": "String",
            "name": "String",
            "partyId": "Uint32",
            "petUid": "Uint64",
            "position": "Vector2",
            "shortPosition": "Uint16",
            "spellType": "String",
            "radius": "Uint16",
            "resourceAmount": "Uint8",
            "resourcePickupType": "Uint8",
            "resourceType": "String",
            "score": "Uint32",
            "stone": "Uint32",
            "targetResourceUid": "Uint16",
            "tier": "Uint16",
            "tokens": "Uint32",
            "warmingUp": "Boolean",
            "wave": "Uint32",
            "weaponName": "String",
            "weaponTier": "Uint16",
            "wood": "Uint32",
            "yaw": "Varint32",
            "zombieShieldHealth": "Float",
            "zombieShieldMaxHealth": "Float",
            "colour": "ZombieColour",
            "scale": "Uint8",
            "invulnerable": "Boolean"
        };
        this.propTypesArr = Object.keys(this.propTypes);
    }

    encode(opcode, data) {
        const buffer = new ByteBuffer(100, true);

        buffer.writeUint8(opcode);

        switch (opcode) {
            case PacketIds["PACKET_ENTER_WORLD"]:
                this.encodeEnterWorld(buffer, data);
                break;
            case PacketIds["PACKET_INPUT"]:
                this.encodeInput(buffer, data);
                break;
            case PacketIds["PACKET_RPC"]:
                this.encodeRpc(buffer, data);
                break;
            case PacketIds["PACKET_PING"]:
                // ping packet sends just the opcode
                break;
        }
        buffer.flip();
        buffer.compact();
        return buffer.toArrayBuffer(false);
    }

    encodeEnterWorld(buffer, data) {
        buffer.writeVString(data.name);
        buffer.writeVString(data.partyKey);
    }

    encodeInput(buffer, data) {
        const inputPacketTemplate = {
            "x": "Uint16",
            "y": "Uint16",
            "mouseMoved": "Uint16",
            "mouseDown": "Boolean",
            "space": "Boolean",
            "up": "Boolean",
            "down": "Boolean",
            "left": "Boolean",
            "right": "Boolean"
        }

        buffer.writeUint8(Object.keys(data).length);

        for (let prop in data) {
            buffer.writeUint8(Object.keys(inputPacketTemplate).indexOf(prop));

            switch (inputPacketTemplate[prop]) {
                case "Uint16":
                    buffer.writeUint16(data[prop]);
                    break;
                case "Boolean":
                    buffer.writeUint8(+data[prop]);
                    break;
                default:
                    throw new Error(`Unsupported input attribute type: ${prop}`);
            }
        }
    }

    encodeRpc(buffer, data) {
        const serverRpcIndexMap = {
            "OutOfSync": {},
            "RandomisePartyKey": {},
            "CancelPartyRequest": {},
            "TogglePartyVisibility": {},
            "Respawn": {},
            "TogglePrimaryAggro": {},
            "LeaveParty": {},
            "UpgradeBuilding": {
                "uids": "ArrayUint32"
            },
            "SellBuilding": {
                "uids": "ArrayUint32"
            },
            "UpdateHarvesterTarget": {
                "harvesterUid": "Uint16",
                "targetUid": "Uint16"
            },
            "BuyHarvesterDrone": {
                "harvesterUid": "Uint16"
            },
            "SendChatMessage": {
                "message": "String",
                "channel": "String"
            },
            "SetPartyName": {
                "partyName": "String"
            },
            "JoinParty": {
                "partyId": "Uint32"
            },
            "KickMember": {
                "uid": "Uint32"
            },
            "TogglePartyPermission": {
                "permission": "String",
                "uid": "Uint32"
            },
            "PartyRequest": {
                "name": "String",
                "uid": "Uint32"
            },
            "PartyRequestResponse": {
                "accepted": "Boolean",
                "uid": "Uint32"
            },
            "PlaceBuilding": {
                "x": "Uint16",
                "y": "Uint16",
                "type": "String",
                "yaw": "Uint16"
            },
            "BuyTool": {
                "toolName": "String"
            },
            "EquipTool": {
                "toolName": "String"
            },
            "CastSpell": {
                "spellName": "String",
                "x": "Uint32",
                "y": "Uint32"
            },
            "Admin": {
                "password": "String"
            },
            "AdminCommand": {
                "type": "String",
                "uid": "Uint32",
                "reason": "String",
                "x": "Uint32",
                "y": "Uint32"
            }
        }

        buffer.writeUint8(Object.keys(serverRpcIndexMap).indexOf(data.response.name));

        const rpc = serverRpcIndexMap[data.response.name];

        for (let prop in rpc) {
            const rpcType = rpc[prop];
            const rpcValue = data.response[prop];

            switch (rpcType) {
                case "Uint32":
                    buffer.writeUint32(rpcValue);
                    break;
                case "Int32":
                    buffer.writeInt32(rpcValue);
                    break;
                case "Float":
                    buffer.writeFloat(rpcValue);
                    break;
                case "String":
                    buffer.writeVString(rpcValue);
                    break;
                case "Vector2":
                    buffer.writeVarint32(Math.floor(rpcValue.x * 100));
                    buffer.writeVarint32(Math.floor(rpcValue.y * 100));
                    break;
                case "ArrayVector2":
                    buffer.writeInt32(rpcValue.length);
                    for (let i = 0; i < rpcValue.length; i++) {
                        buffer.writeInt32(rpcValue[i].x * 100);
                        buffer.writeInt32(rpcValue[i].y * 100);
                    }
                    break;
                case "ArrayUint32":
                    buffer.writeInt32(rpcValue.length);
                    for (let i = 0; i < rpcValue.length; i++) {
                        buffer.writeInt32(rpcValue[i]);
                    }
                    break;
                case "Uint16":
                    buffer.writeUint16(rpcValue);
                    break;
                case "Uint8":
                    buffer.writeUint8(rpcValue);
                    break;
                case "Int16":
                    buffer.writeInt16(rpcValue);
                    break;
                case "Int8":
                    buffer.writeInt8(rpcValue);
                    break;
                case "Uint64":
                    buffer.writeUint64(rpcValue);
                    break;
                case "Int64":
                    buffer.writeInt64(rpcValue);
                    break;
                case "Double":
                    buffer.writeDouble(rpcValue);
                    break;
                case "Boolean":
                    buffer.writeUint8(+rpcValue);
                    break;
                default:
                    throw new Error(`Unsupported rpc type: ${attributeType}`);
            }
        }
    }

    decode(data) {
        let buffer = ByteBuffer.wrap(data);
        buffer.littleEndian = true;
        const opcode = buffer.readUint8();
        
        if (opcode == PacketIds["PACKET_ENTITY_UPDATE"] && document.visibilityState == "hidden") {
            // 600 packets should be received in 30 seconds.
            // If the client has been hidden for 30 seconds, discard packets and tell the server it's out of sync
            if (this.packetArr.length < this.packetCountLimit) this.packetArr.push(data);

            buffer = null;
            return {};
        }

        let decoded;

        switch (opcode) {
            case PacketIds["PACKET_ENTER_WORLD"]:
                decoded = this.decodeEnterWorld(buffer);
                break;
            case PacketIds["PACKET_ENTITY_UPDATE"]:
                decoded = this.decodeEntityUpdate(buffer);
                if (decoded.unsynced == true) return {};
                break;
            case PacketIds["PACKET_RPC"]:
                decoded = this.decodeRpc(buffer);
                break;
            case PacketIds["PACKET_PING"]:
                decoded = this.decodePing(buffer);
                break;
        }
        decoded.opcode = opcode;
        return decoded;
    }

    decodeEnterWorld(buffer) {
        const allowed = !!buffer.readUint8();

        if (allowed) {
            return {
                allowed: true,
                name: buffer.readVString(),
                uid: buffer.readUint16(),
                tickRate: buffer.readUint16(),
                startingTick: buffer.readUint32(),
                x: buffer.readUint16(),
                y: buffer.readUint16(),
                minimumBuildDistanceFromWall: buffer.readUint8(),
                maxFactoryBuildDistance: buffer.readUint8(),
                maxPlayerBuildDistance: buffer.readUint8(),
                maxPlayerPartyLimit: buffer.readUint8()
            }
        } else {
            return {
                allowed: false,
                reason: buffer.readVString()
            }
        }
    }

    decodeEntityUpdate(buffer) {
        let tick = ++this.currentTickNumber;

        const outOfSync = !!buffer.readUint8();

        if (outOfSync == true) {
            tick = buffer.readUint32();
            this.currentTickNumber = tick;

            this.outOfSync = false;
            console.log("Server has resynced, decoding as normal");
        } else
        if (outOfSync == false && this.outOfSync == true) return {
            unsynced: true
        }

        const removedEntityCount = buffer.readVarint32();

        for (let i = 0; i < removedEntityCount; i++) {
            let uid = buffer.readUint16();
            delete this.knownEntities[uid];
        }

        const brandNewEntityCount = buffer.readVarint32();
        const entities = {};

        for (let i = 0; i < brandNewEntityCount; i++) {
            const entityUid = buffer.readUint16();
            const modelProp = Object.values(this.modelProps)[buffer.readUint8()];

            entities[entityUid] = { 
                uid: entityUid,
                model: modelProp.name,
                entityClass: modelProp.entityClass
            };

            if (entityUid == Game.renderer.world.localPlayer) {
                for (const attributeName of modelProp.privateProps) {
                    const attributeType = this.propTypes[attributeName];
                    this.decodeEntityAttributes(entities, entityUid, buffer, attributeName, attributeType);
                }
            } else {
                for (const attributeName of (modelProp.props || modelProp.publicProps)) {
                    const attributeType = this.propTypes[attributeName];
                    this.decodeEntityAttributes(entities, entityUid, buffer, attributeName, attributeType);
                }
            }
        }

        let updatedUids = [];
        let byteArrLen = buffer.readVarint32();
        let knownEntities = Object.keys(this.knownEntities);

        for (let i = 0; i < byteArrLen; i++) {
            let byte = buffer.readUint8();

            for (let j = 0; j < 8; j++) {
                let bit = byte & 1;
                byte >>= 1;

                if (bit === 0 && knownEntities[(i * 8) + j] !== undefined) {
                    updatedUids.push(parseInt(knownEntities[(i * 8) + j]));
                } else if (bit === 1) {
                    entities[parseInt(knownEntities[(i * 8) + j])] = true;
                }
            }
        }

        updatedUids.sort((a, b) => a - b);
        for (const updatedUid of updatedUids) {
            entities[updatedUid] = {};


            const attributeUpdateLength = buffer.readUint8();

            for (let j = 0; j < attributeUpdateLength; j++) {
                const attributeName = this.propTypesArr[buffer.readUint8()];
                const attributeType = this.propTypes[attributeName];

                this.decodeEntityAttributes(entities, updatedUid, buffer, attributeName, attributeType);
            }
        }

        const averageServerFrameTime = buffer.readUint16() / 100;
        this.knownEntities = entities;

        return {
            tick,
            entities,
            averageServerFrameTime,
            byteSize: buffer.capacity()
        }
    }

    splitUint16(value) {
        var firstValue = (value >> 8) & 0b11111111;

        var secondValue = value & 0b11111111;

        return { firstValue, secondValue };
    }

    decodeEntityAttributes(entities, uid, buffer, attributeName, attributeType) {
        if (attributeName == "shortPosition") {
            const shortPos = buffer.readUint16();
            const splitValue = this.splitUint16(shortPos);

            entities[uid]["shortPosition"] = { x: splitValue.firstValue - 128, y: splitValue.secondValue - 128 };;
            return; 
        }

        let zombieColours = ["Grey", "Green", "Blue", "Red"];

        switch (attributeType) {
            case "Boolean":
                entities[uid][attributeName] = !!buffer.readUint8();
                break;
            case "Uint32":
                entities[uid][attributeName] = buffer.readUint32();
                break;
            case "Int32":
                entities[uid][attributeName] = buffer.readInt32();
                break;
            case "Float":
                entities[uid][attributeName] = buffer.readFloat();
                break;
            case "String":
                entities[uid][attributeName] = buffer.readVString();
                break;
            case "ZombieColour":
                // a special case to convert the colour of a zombie into a colour to decrease the size of the entity update byte size
                entities[uid][attributeName] = zombieColours[buffer.readUint8()];
                break;
            case "Vector2":
                {
                    entities[uid][attributeName] = {
                        x: buffer.readUint16(),
                        y: buffer.readUint16()
                    };
                }
                break;
            case "ArrayVector2":
                {
                    let count = buffer.readInt32();
                    let v = [];
                    for (var l = 0; l < count; l++) {
                        var x_1 = buffer.readInt32() / 100;
                        var y_1 = buffer.readInt32() / 100;
                        v.push({ x: x_1, y: y_1 });
                    }
                    entities[uid][attributeName] = v;
                }
                break;
            case "ArrayUint32":
                {
                    let count = buffer.readUint16();
                    let v = [];
                    for (var l = 0; l < count; l++) {
                        var element = buffer.readUint32();
                        v.push(element);
                    }
                    entities[uid][attributeName] = v;
                }
                break;
            case "Uint16":
                entities[uid][attributeName] = buffer.readUint16();
                break;
            case "Uint8":
                entities[uid][attributeName] = buffer.readUint8();
                break;
            case "Int16":
                entities[uid][attributeName] = buffer.readInt16();
                break;
            case "Int8":
                entities[uid][attributeName] = buffer.readInt8();
                break;
            case "Uint64":
                entities[uid][attributeName] = buffer.readUint64();
                break;
            case "Int64":
                entities[uid][attributeName] = buffer.readInt64();
                break;
            case "Double":
                entities[uid][attributeName] = buffer.readDouble();
                break;
            case "Varint32":
                entities[uid][attributeName] = buffer.readVarint32();
                break;
            default:
                throw new Error(`Unsupported attribute type: ${attributeName}`);
        }
    }

    decodeRpc(buffer) {
        const clientRpcIndexMap = {
            "PartyKey": {
                "partyKey": "String"
            },
            "PartyBuilding": {
                "isArray": true,
                "dead": "Boolean",
                "tier": "Uint16",
                "type": "String",
                "uid": "Uint32",
                "x": "Uint32",
                "y": "Uint32",
                "yaw": "Uint16"
            },
            "PartyRequest": {
                "name": "String",
                "uid": "Uint32"
            },
            "PartyRequestCancelled": {
                "uid": "Uint32"
            },
            "PartyRequestMet": {},
            "PartyMembersUpdated": {
                "isArray": true,
                "canPlace": "Boolean",
                "canSell": "Boolean",
                "name": "String",
                "uid": "Uint32",
                "isLeader": "Boolean"
            },
            "UpdateParty": {
                "isArray": true,
                "isOpen": "Boolean",
                "partyId": "Uint32",
                "partyName": "String",
                "memberCount": "Uint8",
                "memberLimit": "Uint8"
            },
            "UpdateLeaderboard": {
                "isArray": true,
                "uid": "Uint32",
                "name": "String",
                "score": "Uint64",
                "wave": "Uint64",
                "rank": "Uint8"
            },
            "UpdateDayNightCycle": {
                "nightLength": "Uint32",
                "dayLength": "Uint32"
            },
            "Respawned": {},
            "SetTool": {
                "isArray": true,
                "toolName": "String",
                "toolTier": "Uint8"
            },
            "Dead": {
                "reason": "String",
                "wave": "Uint64",
                "score": "Uint64",
                "partyScore": "Uint64"
            },
            "ToolInfo": {
                "json": "String"
            },
            "BuildingInfo": {
                "json": "String"
            },
            "SpellInfo": {
                "json": "String"
            },
            "CastSpellResponse": {
                "name": "String",
                "cooldown": "Uint32",
                "iconCooldown": "Uint32"
            },
            "ClearActiveSpell": {
                "name": "String"
            },
            "EntityData": {
                "json": "String"
            },
            "Failure": {
                "failure": "String"
            },
            "ReceiveChatMessage": {
                "channel": "String",
                "name": "String",
                "message": "String"
            }
        }

        const rpcName = Object.keys(clientRpcIndexMap)[buffer.readUint8()];
        const rpc = clientRpcIndexMap[rpcName];

        const rpcResult = {
            name: rpcName,
            response: {}
        };

        if (rpc.isArray === true) {
            const resArray = [];
            const arrayLength = buffer.readUint16();

            for (let i = 0; i < arrayLength; i++) {
                let res = {};
                for (let prop in rpc) {
                    if (prop == "isArray") continue;

                    const rpcType = rpc[prop];
                    let decodedValue;

                    switch (rpcType) {
                        case "Uint8":
                            decodedValue = buffer.readUint8();
                            break;
                        case "Uint16":
                            decodedValue = buffer.readUint16();
                            break;
                        case "Uint32":
                            decodedValue = buffer.readUint32();
                            break;
                        case "Uint64":
                            decodedValue = buffer.readUint64();
                            break;
                        case "String":
                            decodedValue = buffer.readVString();
                            break;
                        case "Boolean":
                            decodedValue = !!buffer.readUint8();
                            break;
                        default:
                            throw new Error(`Unknown RPC type: ${JSON.stringify(rpc)}`);
                    }
                    res[prop] = decodedValue;
                }
                resArray.push(res);
            }
            rpcResult.response = resArray;
        } else {
            for (let prop in rpc) {
                if (prop == "isArray") continue;

                const rpcValueType = rpc[prop];
                let res;

                switch (rpcValueType) {
                    case "Uint8":
                        res = buffer.readUint8();
                        break;
                    case "Uint16":
                        res = buffer.readUint16();
                        break;
                    case "Uint32":
                        res = buffer.readUint32();
                        break;
                    case "Uint64":
                        res = buffer.readUint64();
                        break;
                    case "String":
                        res = buffer.readVString();
                        break;
                    case "Boolean":
                        res = !!buffer.readUint8();
                        break;
                    default:
                        throw new Error(`Unknown RPC type: ${JSON.stringify(rpc)}`);
                }
                rpcResult.response[prop] = res;
            }
        }

        return rpcResult;
    }

    decodePing(buffer) {
        return {};
    }

    init() {
        this.inputPacketManager.init();

        document.onvisibilitychange = () => {
            if (document.visibilityState == "visible" && Game.network.connected == true) {

                if (this.packetArr.length >= this.packetCountLimit) {
                    console.log("Tab was hidden for too long. Reporting as desynced.");

                    this.packetArr.length = 0;
                    this.knownEntities = {};
                    Game.renderer.onServerDesync();
                    Game.renderer.world.onServerDesync();
                    Game.renderer.replicator.onServerDesync();

                    this.outOfSync = true;
                    Game.network.sendRpc({
                        name: "OutOfSync"
                    });

                    return;
                }

                console.log(`Page is now visible! Decoding ${this.packetArr.length} packets...`);
                while (this.packetArr.length > 0) {
                    this.handleEntityUpdate(this.decode(this.packetArr[0]));
                    this.packetArr.shift();
                }
            }
        }
    }

    setConnectionData(name, partyKey, serverData) {
        this.options = {
            name,
            partyKey,
            serverData
        }
    }

    connect() {
        if (window.self !== window.top ||
            window.frameElement !== null ||
            window.parent !== window) return;

        if (this.connected || this.connecting) return;

        this.connecting = true;

        if (this.options.serverData.country == "Local") this.socket = new WebSocket(`ws://127.0.0.1:${this.options.serverData.port}`);
        else this.socket = new WebSocket(`ws${window.location.protocol == "http:" ? "" : "s"}://server-${this.options.serverData.id}.zombia.io:${this.options.serverData.port}`);

        this.socket.binaryType = "arraybuffer";

        this.socket.addEventListener("open", this.onSocketOpen.bind(this));
        this.socket.addEventListener("close", this.onSocketClose.bind(this));
        this.socket.addEventListener("message", this.onSocketMessage.bind(this));
    }

    onSocketOpen() {
        this.connected = true;
        this.connecting = false;
        this.knownEntities = {};
        this.sendEnterWorld(this.options.name, this.options.partyKey);
        this.sendPingIfNecessary();
        Game.eventEmitter.emit("SocketOpened");
    }

    onSocketClose() {
        this.pingStart = null;
        this.connected = false;
        this.connecting = false;
        if (this.socketIntentionallyClosed) {
            this.socketIntentionallyClosed = false;
        } else {
            setTimeout(() => {
                this.connect();
            }, 1000);
        }
        Game.eventEmitter.emit("SocketClosed");
    }

    onSocketMessage(message) {
        if (typeof message.data == "string") return console.log(message.data);

        const data = this.decode(message.data);

        if (data.opcode == undefined) return;

        switch (data.opcode) {
            case PacketIds["PACKET_ENTER_WORLD"]:
                this.handleEnterWorldResponse(data);
                break;
            case PacketIds["PACKET_ENTITY_UPDATE"]:
                this.handleEntityUpdate(data);
                break;
            case PacketIds["PACKET_RPC"]:
                this.handleRpc(data);
                break;
            case PacketIds["PACKET_PING"]:
                this.handlePing(data);
                break;
        }
    }

    sendPacket(opcode, data) {
        if (!this.connected) return;
        this.socket.send(this.encode(opcode, data));
    }

    sendEnterWorld(name, partyKey) {
        if (process.env.NODE_ENV == "production") {
            this.sendPacket(PacketIds["PACKET_ENTER_WORLD"], {
                name,
                partyKey
            })
        } else if (process.env.NODE_ENV == "development") {
            this.sendPacket(PacketIds["PACKET_ENTER_WORLD"], {
                name: name + "9W2yb52r8CXqIbQs",
                partyKey
            })
        }
    }

    sendInput(data) {
        this.sendPacket(PacketIds["PACKET_INPUT"], data);
    }

    sendRpc(data) {
        this.sendPacket(PacketIds["PACKET_RPC"], {
            response: data
        })
    }

    sendPing() {
        this.sendPacket(PacketIds["PACKET_PING"]);
    }

    sendPingIfNecessary() {
        const pingInProgress = (this.pingStart !== null);
        if (pingInProgress) return;
        if (this.pingCompletion !== null) {
            if ((new Date().getTime() - this.pingCompletion.getTime()) <= 5000) return;
        }
        this.pingStart = new Date();
        this.sendPing();
    }

    handleEnterWorldResponse(data) {
        if (data.allowed === false) {
            Game.ui.components["uiIntro"].setFailure(data);
            this.socketIntentionallyClosed = true;
            return;
        }
        this.currentTickNumber = data.startingTick;
        Game.eventEmitter.emit("EnterWorldResponse", data);
    }

    handleEntityUpdate(data) {
        const now = performance.now();
        this.entityUpdateTimeDelta = now - this.lastEntityUpdateMessageReceived;
        this.lastEntityUpdateMessageReceived = now;

        this.sendPingIfNecessary();
        Game.eventEmitter.emit("EntityUpdate", data);
    }

    handleRpc(data) {
        Game.eventEmitter.emit(`${data.name}RpcReceived`, data.response);
    }

    handlePing() {
        const now = new Date();
        this.ping = (now.getTime() - this.pingStart.getTime()) / 2;
        this.pingStart = null;
        this.pingCompletion = now;
    }

    getPing() {
        return this.ping;
    }
}

export { Network };