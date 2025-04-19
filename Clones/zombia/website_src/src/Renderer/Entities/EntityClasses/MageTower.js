import { Game } from "../../../Game.js";
import { TowerModel } from "./TowerModel.js";
import { SpriteEntity } from "../SpriteEntity.js";

class MageTower extends TowerModel {
    constructor() {
        super("MageTower");
    }

    update(dt, tick) {
        super.update(dt, tick);
        if (tick) {
            if (tick.firingTick) {
                const msSinceFiring = Game.renderer.replicator.getMsSinceTick(tick.firingTick);
                const scaleLengthInMs = 250;
                const scaleAmplitude = 0.4;
                const animationPercent = Math.min(msSinceFiring / scaleLengthInMs, 1);
                const deltaScale = 1 + Math.sin(animationPercent * Math.PI) * scaleAmplitude;
                this.head.setScale(deltaScale);
            }
        }
    }

    updateModel(tier = 1) {
        if (tier == this.currentTier) return;
        this.currentTier = tier;
        this.removeAttachment(this.base);
        this.removeAttachment(this.head);
        if ([1, 2, 3, 4, 5, 6, 7, 8].includes(this.currentTier)) {
                this.base = new SpriteEntity(`./asset/images/Entity/${this.type}/${this.type}Tier${tier}Base.svg`);
                this.head = new SpriteEntity(`./asset/images/Entity/${this.type}/${this.type}Head.svg`);
        } else throw new Error(`Unknown tier encountered for ${this.type} tower: ${tier}`);
        this.addAttachment(this.base, 2);
        this.addAttachment(this.head, 3);
    }
}

export { MageTower };