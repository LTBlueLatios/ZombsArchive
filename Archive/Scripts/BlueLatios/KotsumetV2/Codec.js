/* global ByteBuffer */
const AttributeType = Object.freeze({
    Uninitialized: 0,
    Uint32: 1,
    Int32: 2,
    Float: 3,
    String: 4,
    Vector2: 5,
    EntityType: 6,
    ArrayVector2: 7,
    ArrayUint32: 8,
    Uint16: 9,
    Uint8: 10,
    Int16: 11,
    Int8: 12,
    Uint64: 13,
    Int64: 14,
    Double: 15
});

const ParameterType = Object.freeze({
    Uint32: 0,
    Int32: 1,
    Float: 2,
    String: 3,
    Uint64: 4,
    Int64: 5
});

const PacketIds = Object.freeze({
    PACKET_ENTITY_UPDATE: 0,
    PACKET_PLAYER_COUNTER_UPDATE: 1,
    PACKET_SET_WORLD_DIMENSIONS: 2,
    PACKET_INPUT: 3,
    PACKET_ENTER_WORLD: 4,
    PACKET_PRE_ENTER_WORLD: 5,
    PACKET_ENTER_WORLD2: 6,
    PACKET_PING: 7,
    PACKET_RPC: 9
});

class Codec {
    attributeMaps = {};
    entityTypeNames = {};
    rpcMaps = [];
    rpcMapsByName = {};
    sortedUidsByType = {};
    removedEntities = {};
    absentEntitiesFlags = [];
    updatedEntityFlags = [];

    attributeTypeHandlers = {
        [AttributeType.Uint32]: (buffer) => buffer.readUint32(),
        [AttributeType.Int32]: (buffer) => buffer.readInt32(),
        [AttributeType.Float]: (buffer) => buffer.readInt32() / 100.0,
        [AttributeType.String]: (buffer) => this.safeReadVString(buffer),
        [AttributeType.Vector2]: (buffer) => ({
            x: buffer.readInt32() / 100.0,
            y: buffer.readInt32() / 100.0,
        }),
        [AttributeType.ArrayVector2]: (buffer) => this.readArray(buffer, AttributeType.Vector2),
        [AttributeType.ArrayUint32]: (buffer) => this.readArray(buffer, AttributeType.Uint32),
        [AttributeType.Uint16]: (buffer) => buffer.readUint16(),
        [AttributeType.Uint8]: (buffer) => buffer.readUint8(),
        [AttributeType.Int16]: (buffer) => buffer.readInt16(),
        [AttributeType.Int8]: (buffer) => buffer.readInt8(),
        [AttributeType.Uint64]: (buffer) => buffer.readUint32() + buffer.readUint32() * 4294967296,
        [AttributeType.Int64]: (buffer) => this.readInt64OrDouble(buffer),
        [AttributeType.Double]: (buffer) => this.readInt64OrDouble(buffer, 100.0),
    };

    encode(name, item) {
        const buffer = new ByteBuffer(100, true);
        switch (name) {
            case PacketIds.PACKET_ENTER_WORLD:
                buffer.writeUint8(PacketIds.PACKET_ENTER_WORLD);
                this.encodeEnterWorld(buffer, item);
                break;
            case PacketIds.PACKET_ENTER_WORLD2:
                buffer.writeUint8(PacketIds.PACKET_ENTER_WORLD2);
                break;
            case PacketIds.PACKET_INPUT:
                buffer.writeUint8(PacketIds.PACKET_INPUT);
                this.encodeInput(buffer, item);
                break;
            case PacketIds.PACKET_PING:
                buffer.writeUint8(PacketIds.PACKET_PING);
                this.encodePing(buffer, item);
                break;
            case PacketIds.PACKET_RPC:
                buffer.writeUint8(PacketIds.PACKET_RPC);
                this.encodeRpc(buffer, item);
                break;
        }
        buffer.flip();
        buffer.compact();
        return buffer.toArrayBuffer(false);
    }

    decode(data) {
        const buffer = ByteBuffer.wrap(data);
        buffer.littleEndian = true;
        const opcode = buffer.readUint8();
        let decoded;
        switch (opcode) {
            case PacketIds.PACKET_ENTER_WORLD:
                decoded = this.decodeEnterWorldResponse(buffer);
                break;
            case PacketIds.PACKET_ENTITY_UPDATE:
                decoded = this.decodeEntityUpdate(buffer);
                break;
            case PacketIds.PACKET_PING:
                decoded = this.decodePing(buffer);
                break;
            case PacketIds.PACKET_RPC:
                decoded = this.decodeRpc(buffer);
                break;
        }
        decoded.opcode = opcode;
        return decoded;
    }

    safeReadVString(buffer) {
        let offset = buffer.offset;
        const len = buffer.readVarint32(offset);
        try {
            const func = buffer.readUTF8String.bind(buffer);
            const str = func(len["value"], ByteBuffer.METRICS_BYTES, offset += len["length"]);
            offset += str["length"];
            buffer.offset = offset;
            return str["string"];
        }
        catch (e) {
            offset += len["value"];
            buffer.offset = offset;
            return "?";
        }
    }

    decodeEnterWorldResponse(buffer) {
        const allowed = buffer.readUint32();
        const uid = buffer.readUint32();
        const startingTick = buffer.readUint32();
        const ret = {
            allowed: allowed,
            uid: uid,
            startingTick: startingTick,
            tickRate: buffer.readUint32(),
            effectiveTickRate: buffer.readUint32(),
            players: buffer.readUint32(),
            maxPlayers: buffer.readUint32(),
            chatChannel: buffer.readUint32(),
            effectiveDisplayName: this.safeReadVString(buffer),
            x1: buffer.readInt32(),
            y1: buffer.readInt32(),
            x2: buffer.readInt32(),
            y2: buffer.readInt32()
        };

        const attributeMapCount = buffer.readUint32();
        this.attributeMaps = {};
        this.entityTypeNames = {};
        for (let i = 0; i < attributeMapCount; i += 1) {
            const attributeMap = [];
            const entityType = buffer.readUint32();
            const entityTypeString = buffer.readVString();
            const attributeCount = buffer.readUint32();
            for (let j = 0; j < attributeCount; j += 1) {
                const name_1 = buffer.readVString();
                const type = buffer.readUint32();
                attributeMap.push({
                    name: name_1,
                    type: type
                });
            }
            this.attributeMaps[entityType] = attributeMap;
            this.entityTypeNames[entityType] = entityTypeString;
            this.sortedUidsByType[entityType] = [];
        }

        const rpcCount = buffer.readUint32();
        this.rpcMaps = [];
        this.rpcMapsByName = {};
        for (let i = 0; i < rpcCount; i += 1) {
            const rpcName = buffer.readVString();
            const paramCount = buffer.readUint8();
            const isArray = buffer.readUint8() != 0;
            const parameters = [];
            for (let j = 0; j < paramCount; j += 1) {
                const paramName = buffer.readVString();
                const paramType = buffer.readUint8();
                parameters.push({
                    name: paramName,
                    type: paramType
                });
            }
            const rpc = {
                name: rpcName,
                parameters: parameters,
                isArray: isArray,
                index: this.rpcMaps.length
            };
            this.rpcMaps.push(rpc);
            this.rpcMapsByName[rpcName] = rpc;
        }

        return ret;
    }

    readArray(buffer, type) {
        const count = buffer.readInt32();
        const array = [];
        const handler = this.attributeTypeHandlers[type];
        if (!handler) {
            throw new Error(`Unsupported array element type: ${type}`);
        }
        for (let i = 0; i < count; i += 1) {
            array.push(handler(buffer));
        }
        return array;
    }

    readInt64OrDouble(buffer, divisor = 1) {
        const lowBits = BigInt(buffer.readUint32());
        const highBits = BigInt(buffer.readInt32());

        const value = highBits >= 0n
            ? lowBits + (highBits * 0x1_0000_0000n)
            : -lowBits + (highBits * 0x1_0000_0000n);

        return Number(value) / divisor;
    }

    updateEntityData(buffer, entityType, uid) {
        const attributeMap = this.attributeMaps[entityType];
        const player = { uid };
        this.updatedEntityFlags.length = 0;
        for (let j = 0; j < Math.ceil(attributeMap.length / 8); j += 1) {
            this.updatedEntityFlags.push(buffer.readUint8());
        }
        for (let j = 0; j < attributeMap.length; j += 1) {
            const attribute = attributeMap[j];
            const flagIndex = Math.floor(j / 8);
            const bitIndex = j % 8;
            if (this.updatedEntityFlags[flagIndex] & (1 << bitIndex)) {
                player[attribute.name] = this.readAttributeValue(buffer, attribute);
            }
        }
        return player;
    }

    readAttributeValue(buffer, attribute) {
        const handler = this.attributeTypeHandlers[attribute.type];
        if (!handler) {
            console.error(`Unsupported attribute type: ${attribute.type} for attribute ${attribute.name}`);
            return null;
        }
        return handler(buffer);
    }

    decodeEntityUpdate(buffer) {
        const tick = buffer.readUint32();
        this.updateRemovedEntities(buffer);
        const entityUpdateData = {
            tick: tick,
            entities: new Map(),
            byteSize: buffer.capacity(),
        };

        this.addBrandNewEntities(buffer);
        this.cleanSortedUidsByType();

        while (buffer.remaining()) {
            const entityType = buffer.readUint32();
            if (!(entityType in this.attributeMaps)) throw new Error(`Entity type is not in attribute map: ${entityType}`);

            const absentEntitiesFlagsLength = Math.floor((this.sortedUidsByType[entityType].length + 7) / 8);
            this.absentEntitiesFlags.length = 0;
            for (let i = 0; i < absentEntitiesFlagsLength; i += 1) {
                this.absentEntitiesFlags.push(buffer.readUint8());
            }

            for (let tableIndex = 0; tableIndex < this.sortedUidsByType[entityType].length; tableIndex += 1) {
                const uid = this.sortedUidsByType[entityType][tableIndex];
                if ((this.absentEntitiesFlags[Math.floor(tableIndex / 8)] & (1 << (tableIndex % 8))) !== 0) {
                    entityUpdateData.entities[uid] = true;
                    continue;
                }
                entityUpdateData.entities[uid] = this.updateEntityData(buffer, entityType, uid);
            }
        }
        return entityUpdateData;
    }

    cleanSortedUidsByType() {
        for (const [key, uids] of Object.entries(this.sortedUidsByType)) {
            this.sortedUidsByType[key] = uids
                .filter(uid => !(uid in this.removedEntities))
                .sort((a, b) => a - b);
        }
    }

    updateRemovedEntities(buffer) {
        const removedEntityCount = buffer.readVarint32();

        Object.keys(this.removedEntities).forEach(entity => delete this.removedEntities[entity]);
        for (let i = 0; i < removedEntityCount; i += 1) {
            const uid = buffer.readUint32();
            this.removedEntities[uid] = true;
        }
    }

    addBrandNewEntities(buffer) {
        const brandNewEntityTypeCount = buffer.readVarint32();

        for (let i = 0; i < brandNewEntityTypeCount; i += 1) {
            const brandNewEntityCount = buffer.readVarint32();
            const brandNewEntityType = buffer.readUint32();
            for (let j = 0; j < brandNewEntityCount; j += 1) {
                const entityUid = buffer.readUint32();
                if (!this.sortedUidsByType[brandNewEntityType]) {
                    this.sortedUidsByType[brandNewEntityType] = [];
                }
                this.sortedUidsByType[brandNewEntityType].push(entityUid);
            }
        }
    }

    decodePing() {
        return {};
    }

    encodeRpc(buffer, item) {
        if (!(item.name in this.rpcMapsByName)) {
            // Idk why this error exists, it's annoying so this patches it
            if (item.name == "Metrics") return;
            throw new Error(`RPC not in map: ${item.name}`);
        }

        const rpc = this.rpcMapsByName[item.name];
        buffer.writeUint32(rpc.index);
        for (let i = 0; i < rpc.parameters.length; i += 1) {
            const param = item[rpc.parameters[i].name];
            switch (rpc.parameters[i].type) {
                case ParameterType.Float:
                    buffer.writeInt32(Math.floor(param * 100.0));
                    break;
                case ParameterType.Int32:
                    buffer.writeInt32(param);
                    break;
                case ParameterType.String:
                    buffer.writeVString(param);
                    break;
                case ParameterType.Uint32:
                    buffer.writeUint32(param);
                    break;
            }
        }
    }

    decodeRpcObject(buffer, parameters) {
        const result = {};
        for (let i = 0; i < parameters.length; i += 1) {
            switch (parameters[i].type) {
                case ParameterType.Uint32:
                    result[parameters[i].name] = buffer.readUint32();
                    break;
                case ParameterType.Int32:
                    result[parameters[i].name] = buffer.readInt32();
                    break;
                case ParameterType.Float:
                    result[parameters[i].name] = buffer.readInt32() / 100.0;
                    break;
                case ParameterType.String:
                    result[parameters[i].name] = this.safeReadVString(buffer);
                    break;
                case ParameterType.Uint64:
                    result[parameters[i].name] = buffer.readUint32() + buffer.readUint32() * 4294967296;
                    break;
            }
        }
        return result;
    }

    decodeRpc(buffer) {
        const rpcIndex = buffer.readUint32(),
            rpc = this.rpcMaps[rpcIndex],
            result = {
                name: rpc.name,
                response: null
            };

        if (!rpc.isArray) {
            result.response = this.decodeRpcObject(buffer, rpc.parameters);
        } else {
            const response = [];
            const count = buffer.readUint16();
            for (let i = 0; i < count; i += 1) {
                response.push(this.decodeRpcObject(buffer, rpc.parameters));
            }
            result.response = response;
        }

        return result;
    }

    encodeEnterWorld(buffer, item) {
        buffer.writeVString(item.displayName);

        const e = new Uint8Array(item.extra);
        for (let i = 0; i < item.extra.byteLength; i += 1) {
            buffer.writeUint8(e[i]);
        }
    }

    encodeInput(buffer, item) {
        buffer.writeVString(JSON.stringify(item));
    }

    encodePing(buffer) {
        buffer.writeUint8(0);
    }
}

export default Codec;