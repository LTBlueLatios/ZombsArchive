const AutoBuild = {
    name: "autoRebuild",
    status: false,
    session: null,
    autoRebuildTarget: new Map(),
    buildingQueue: [],

    init(session) {
        this.session = session;
    },

    onEnable() {
        this.session.events.on("EntityUpdate", () => this.handleTick());
        this.session.events.on("RPC", (data) => this.handleRPC(data));

        Object.values(this.session.buildings).forEach(building => {
            const key = `${building.x},${building.y}`;
            this.autoRebuildTarget.set(key, [building.x, building.y, building.type, building.tier]);
        });
    },
    onDisable() {
        this.session.events.off("EntityUpdate", () => this.handleTick());
        this.session.events.off("RPC", (data) => this.handleRPC(data));

        this.buildingQueue = [];
        this.autoRebuildTarget.clear();
    },

    handleRPC({ name, response }) {
        if (!(name === "LocalBuilding")) return;

        response.forEach(building => {
            if (building.dead && this.autoRebuildTarget.has(`${building.x},${building.y}`)) {
                if (building.type === "GoldStash") {
                    this.onDisable();
                    console.log("Stash died!", Date.now());
                    return;
                }

                this.buildingQueue.push({
                    x: building.x,
                    y: building.y,
                    type: building.type,
                    yaw: building.yaw ? building.yaw : 0,
                    originalTier: building.tier
                });
            }
        });
    },
    handleTick() {
        this.buildingQueue.forEach(queuedBuilding => {
            const placedBuilding = Object.values(this.session.buildings).some(building =>
                building.x === queuedBuilding.x &&
                building.y === queuedBuilding.y &&
                building.type === queuedBuilding.type &&
                !building.dead
            );

            if (!placedBuilding) {
                this.session.sendRpc({
                    name: "MakeBuilding",
                    x: queuedBuilding.x,
                    y: queuedBuilding.y,
                    type: queuedBuilding.type,
                    yaw: queuedBuilding.yaw
                });
            } else {
                const currentTier = placedBuilding.tier;
                const targetTier = placedBuilding.originalTier;

                for (let tier = currentTier + 1; tier <= targetTier; tier += 1) {
                    this.session.sendRpc({
                        name: "UpgradeBuilding",
                        uid: placedBuilding.uid
                    });
                }

                this.buildingQueue.splice(this.buildingQueue.indexOf(queuedBuilding), 1);
            }
        });
    },
}

export default AutoBuild;