import { SpriteEntity } from "../SpriteEntity.js";
import { HealthBar } from "./HealthBar.js";
import { ModelEntity } from "../ModelEntity.js";

class Harvester extends ModelEntity {
    constructor() {
        super();
        this.healthBar = new HealthBar();
        this.healthBar.setSize(82, 16);
        this.healthBar.setPivotPoint(82 / 2, -75);
        this.healthBar.setVisible(false);
        this.addAttachment(this.healthBar, 3);

        this.currentTier = null;
        this.updateModel();
    }

    update(dt, tick) {
        if (tick) {
            this.updateModel(tick.tier);
            this.updateHealthBar(tick);
        }
        super.update(dt, tick);
    }

    updateModel(tier = 1) {
        if (tier === this.currentTier) return;
        this.currentTier = tier;
        this.removeAttachment(this.base);
        if ([1, 2, 3, 4, 5, 6, 7, 8].includes(tier)) {
            this.base = new SpriteEntity(`./asset/images/Entity/Harvester/HarvesterBaseTier${tier}.svg`);
        } else {
            throw new Error(`Unknown tier encountered for Harvester: ${tier}`);
        }
        this.addAttachment(this.base, 2);
    }

    updateHealthBar(tick) {
        this.healthBar.setVisible(tick.health !== tick.maxHealth);
    }
}

export { Harvester };