import SocketComponent from "./SocketComponent";

class SocketHandler {
    sockets = new Map();
    socketPlugins = new Map();
    socketID = 0;
    states = {
        mousePosition: { x: 0, y: 0 },
        locked: false,
        controlled: true,
        showAltID: true,
    };

    constructor() {
        SocketComponent.init(this);
        game.network.addEntityUpdateHandler(() => this.handleTick());

        document.addEventListener("SocketEvent", (data) => {
            const { action, payload } = data.detail;
            this.sockets.forEach((socket) => {
                let buyTier,
                    equipTier;
                switch (action) {
                    case "BuyItem":
                        // who the hell wants alts with tier 5 pickaxes?
                        if (payload.itemName === "Pickaxe") return;
                        buyTier = socket.inventory[payload.itemName]?.tier ? socket.inventory[payload.itemName].tier + 1 : 1;
                        SocketComponent.sendPacket(socket, 9, {
                            name: "BuyItem",
                            itemName: payload.itemName,
                            tier: buyTier
                        });
                        break;
                    case "EquipItem":
                        if (socket.inventory[payload.itemName] === undefined || socket.inventory[payload.itemName] === null) return;

                        equipTier = socket.inventory[payload.itemName].tier;
                        SocketComponent.sendPacket(socket, 9, {
                            name: "EquipItem",
                            itemName: payload.itemName,
                            tier: equipTier
                        });
                        break;
                    case "JoinMain":
                        SocketComponent.sendPacket(socket, 9, { name: "JoinPartyByShareKey", partyShareKey: game.ui.playerPartyShareKey });
                        break;
                    case "LeaveParty":
                        SocketComponent.sendPacket(socket, 9, { name: "LeaveParty" });
                        break;
                }
            })
        });
    }

    registerPlugins(plugins) {
        plugins.forEach(plugin => {
            this.socketPlugins.set(plugin.name, plugin);
        });
    }

    createSocket() {
        const server = game.options.servers[game.options.serverId];
        const socket = new WebSocket(`wss://${server.hostname}:443/`);
        socket.binaryType = "arraybuffer";

        const id = this.socketID++;
        socket.socketID = id;
        this.bindListeners(socket);
        this.sockets.set(id, socket);
    }

    bindListeners(socket) {
        socket.onopen = (event) => SocketComponent.handleOpen(event, socket);
        socket.onmessage = (event) => SocketComponent.handleMessage(event, socket);
        socket.onclose = (event) => SocketComponent.handleClose(event, socket);
    }

    handleTick() {
        if (!this.states.locked) this.states.mousePosition = game.renderer.screenToWorld(game.ui.mousePosition.x, game.ui.mousePosition.y);
        this.socketPlugins.forEach(plugin => {
            if (typeof plugin.update === "function") {
                this.sockets.forEach((socket) => {
                    if (!socket.inWorld) return;
                    plugin.update(socket);
                });
            }
        });
    }

    getSocketById(socketID) {
        return this.sockets.get(socketID) || null;
    }

    getClosestPlayerToMouse() {
        const { x: mouseX, y: mouseY } = this.states.mousePosition;
        let closestSocket = null;
        let closestDistanceSquared = Number.MAX_VALUE;

        this.sockets.forEach((socket) => {
            if (socket.myPlayer.entityClass === "PlayerEntity") {
                const dx = mouseX - socket.myPlayer.position.x;
                const dy = mouseY - socket.myPlayer.position.y;
                const distanceSquared = dx * dx + dy * dy;
                if (distanceSquared < closestDistanceSquared) {
                    closestDistanceSquared = distanceSquared;
                    closestSocket = socket;
                }
            }
        });

        return closestSocket;
    }
}

export default SocketHandler;