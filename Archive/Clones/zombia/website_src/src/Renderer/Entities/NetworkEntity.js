import { Game } from "../../Game.js";
import { Entity } from "./Entity.js";
import { Util } from "../../Util.js";
import { entities } from "./Entities.js";

class NetworkEntity extends Entity {
    constructor(tick) {
        super();
        this.uid = tick.uid;
        this.setVisible(true);

        this.fromTick = {};
        this.targetTick = {
            firingTick: 0,
            lastDamagedTick: 0,
            position: { x: 0, y: 0 },
            yaw: 0
        };

        this.setTargetTick(tick);
        this.fromTick = this.targetTick;
        this.hasRunTick = false;
    }
    reset() {
        this.uid = 0;
        this.currentModel = this.entityClass = this.fromTick = this.targetTick = null;
        this.setVisible(true);
    }
    isLocal() {
        return this.uid == Game.renderer.world.getLocalPlayer();
    }
    getTargetTick() {
        return this.targetTick;
    }
    getFromTick() {
        return this.fromTick;
    }
    setTargetTick(tick) {
        // These arrays are only sent once, so this clears the cached array so it doesn't run more than once
        if (this.targetTick.lastPlayerDamages !== undefined && tick.lastPlayerDamages == undefined) tick.lastPlayerDamages = [];
        if (this.targetTick.hits !== undefined && tick.hits == undefined) tick.hits = [];

        this.addMissingTickFields(tick, this.targetTick);

        if (tick.shortPosition !== undefined) {
            tick.position = {
                x: this.targetTick.position.x + tick.shortPosition.x,
                y: this.targetTick.position.y + tick.shortPosition.y
            }

            delete tick.shortPosition;
        }

        this.fromTick = this.targetTick;
        this.targetTick = tick;

        if (tick.scale !== undefined) this.setScale(tick.scale);
        if (this.fromTick.model !== this.targetTick.model) this.refreshModel();
        if (this.targetTick.entityClass !== this.entityClass) this.entityClass = this.targetTick.entityClass;
        if (this.isLocal()) Game.ui.setPlayerTick(this.targetTick);

        if (this.targetTick.model == "Harvester" && Game.ui.components.uiBuildingOverlay.buildingId == "Harvester") {
            if (this.targetTick.targetResourceUid !== this.fromTick.targetResourceUid) {
                Game.ui.components.uiBuildingOverlay.shouldUpdateRanges = true;
                Game.ui.components.uiBuildingOverlay.update();
            }
            if (this.targetTick.droneCount !== this.fromTick.droneCount) {
                Game.ui.components.uiBuildingOverlay.updateText();
            }
        }
    }
    tick(msInThisTick, msPerTick) {
        if (!this.fromTick) return;
        const tickPercent = msInThisTick / msPerTick;
        if (!this.isVisible) this.setVisible(true);
        this.setPositionX(Util.lerp(this.fromTick.position?.x, this.targetTick.position?.x, tickPercent));
        this.setPositionY(Util.lerp(this.fromTick.position?.y, this.targetTick.position?.y, tickPercent));
        if (this.currentModel?.rotationLocked !== true) this.setRotation(Util.interpolateYaw(this.fromTick.yaw, this.targetTick.yaw));
    }
    update(dt) {
        if (this.currentModel) this.currentModel.update(dt, this.fromTick);
    }
    refreshModel() {
        let model = this.targetTick.model;

        let modelName = model;
        if (!(model in entities)) {
            switch (model) {
                case "Tree1":
                case "Tree2":
                case "Stone1":
                case "Stone2":
                    modelName = "Resource";
                    break;
                case "MageProjectile":
                case "ArrowProjectile":
                case "CannonProjectile":
                case "BombProjectile":
                    modelName = "Projectile";
                    break;
                default:
                    return console.log(`Model ${model} could not be found.\n${JSON.stringify(this.targetTick)}`);
            }
        }
        this.currentModel = new entities[modelName](this.targetTick);
        this.currentModel.modelName = modelName;
        this.currentModel.setParent(this);
        this.setNode(this.currentModel.getNode());
    }

    addMissingTickFields(tick, lastTick) {
        for (var fieldName in lastTick) {
            var fieldValue = lastTick[fieldName];
            if (tick[fieldName] == undefined) {
                tick[fieldName] = fieldValue;
            }
        }
    }
}

export { NetworkEntity };