import SessionIntro from "../components/SessionIntro";
import SessionList from "../components/SessionList";

class SessionClient {
    constructor() {
        this.socket = null;
        this.servers = this.loadServers();
        this.connect();

        this.connectionAttempts = 0;
        this.maxConnectAttempts = 5;

        // Session Web Component
        this.sessionIntro = new SessionIntro(this);
        this.sessionList = new SessionList(this);

        this.sessionIntro.appendTo(".hud-intro-guide");
        this.sessionList.appendTo(".hud-intro-guide");
    }

    loadServers() {
        const savedServers = localStorage.getItem("SessionSaver-IPList");
        return savedServers ? JSON.parse(savedServers) : this.createIPList();
    }

    createIPList() {
        const defaultList = {
            "Default Server": "ws://localhost:3000"
        };
        localStorage.setItem("SessionSaver-IPList", JSON.stringify(defaultList));
        return defaultList;
    }

    connect(serverName = "Default Server") {
        const serverIp = this.servers[serverName];
        if (!serverIp) {
            console.error(`Server "${serverName}" not found in the list.`);
            return;
        }
        this.socket = new WebSocket(serverIp);

        this.socket.onopen = () => this.handleOpen();
        this.socket.onmessage = (msg) => this.handleMessage(msg);
        this.socket.onclose = (err) => this.handleClose(err);
    }

    handleOpen() {
        console.log("Connection to session server established!");
        this.sessionIntro.setState({ connected: true });

        this.connectionAttempts = 0;
        this.getSessions();
    }

    handleClose(err) {
        console.log("Connection to session saver closed", err);
        this.sessionIntro.setState({ connected: false });
    }

    handleMessage(msg) {
        const message = JSON.parse(msg.data);
        const { type, ...rest } = message;

        switch (type) {
            case "SessionList":
                this.sessionList.setState({ sessionList: rest.sessions });
                break;
            case "SyncWorldData":
                this.handleSyncWorldData(rest);
                break;
            case "EntityUpdate":
                game.network.emitter.emit("PACKET_ENTITY_UPDATE", rest.data);
                break;
            case "RPCUpdate":
                game.network.emitter.emit("PACKET_RPC", rest.data);
                break;
        }
    }

    handleSyncWorldData(data) {
        game.network.codec = {
            ...game.network.codec,
            ...data.codec,
            ...data.sessionData.codecData,
        };
        game.network.socket = {
            readyState: 1
        };

        game.options.serverId = data.serverId;
        game.network.connectionOptions = game.options.servers[data.serverId];

        const schemas = ["BuildingShopPrices", "ItemShopPrices", "Spells"];
        schemas.forEach(schema => {
            if (data.sessionData[schema]) {
                game.network.emitter.emit("PACKET_RPC", {
                    name: schema,
                    response: { json: data.sessionData[schema].json }
                });
            } else {
                console.error("Missing schema rpc: ", schema);
            }
        });

        game.network.emitter.emit("PACKET_ENTER_WORLD", data.sessionData.enterWorldData);

        data.rpcSync.forEach(rpc => {
            console.log(rpc);
            game.network.emitter.emit("PACKET_RPC", {
                name: rpc.name,
                response: rpc.response
            });
        });

        data.messages.forEach(message => {
            game.ui.components.Chat.onMessageReceived(message);
        });

        if (data.castSpellResponse && data.castSpellResponse.cooldownStartTick && (data.tick - data.castSpellResponse.cooldownStartTick) * 50 < 240000) {
            game.network.emitter.emit("PACKET_RPC", {
                name: "CastSpellResponse",
                response: data.castSpellResponse,
                opcode: 9
            });
        }

        if (data.isPaused) {
            game.ui.onLocalItemUpdate({
                itemName: "Pause",
                tier: 1,
                stacks: 1
            });
            game.ui.emit("wavePaused");
        }

        this.handleInventory(data.inventory);
        this.handleEntities(data.entities, {
            uid: data.sessionData.enterWorldData.uid,
            localBuildings: data.localBuildings,
            tick: data.tick,
            byteSize: data.byteSize
        });
    }

    handleInventory(inventory) {
        for (const key in inventory) {
            const item = inventory[key];
            game.network.emitter.emit("PACKET_RPC", {
                name: "SetItem",
                response: {
                    itemName: item.itemName,
                    tier: item.tier,
                    stacks: item.stacks
                },
            });
        }
    }

    handleEntities(entitiesData, rest = {}) {
        console.log(entitiesData)
        if (entitiesData[rest.uid].dead) {
            game.ui.components.Respawn.respawnTextElem.innerHTML = "You died!"
            game.ui.components.Respawn.show();
        }

        game.network.emitter.emit("PACKET_RPC", {
            name: "LocalBuilding",
            response: rest.localBuildings
        });

        game.network.emitter.emit("PACKET_ENTITY_UPDATE", {
            tick: rest.tick,
            entities: entitiesData,
            byteSize: rest.byteSize
        });
    }

    sendSession(sessionName, options = {}) {
        const rest = {
            "name": options.playerName,
            "partyKey": options.psk,
            "serverId": options.serverId,
            "sessionName": sessionName,
        };

        this.sendMessage({
            type: "CreateSession",
            ...rest
        });
    }

    joinSession(id) {
        this.sendMessage({ type: "JoinSession", id: id });
        game.network.sendRpc = (rpc) => this.sendMessage({ type: "ClientRpc", rpc: rpc });
        game.network.sendInput = (input) => this.sendMessage({ type: "ClientInput", input: input });
    }

    getSessions() {
        this.sendMessage({
            type: "GetSessions"
        });
    }

    closeSession(id) {
        this.sendMessage({
            type: "CloseSession",
            id: id
        });
    }

    toggleScript(scriptName) {
        this.sendMessage({
            type: "ToggleScript",
            scriptName: scriptName
        });
    }

    sendMessage(message) {
        if (this.socket.readyState === 1) this.socket.send(JSON.stringify(message));
    }
}

// Debugging / Standalone Purposes
const sessionInstance = new SessionClient();
globalThis.sessionInstance = sessionInstance;
