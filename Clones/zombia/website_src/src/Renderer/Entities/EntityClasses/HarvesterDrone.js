import { SpriteEntity } from "../SpriteEntity.js";
import { HealthBar } from "./HealthBar.js";
import { ModelEntity } from "../ModelEntity.js";

class HarvesterDrone extends ModelEntity {
    constructor() {
        super();
        this.healthBar = new HealthBar();
        this.healthBar.setSize(35, 10);
        this.healthBar.setPivotPoint(35 / 2, -24);
        this.healthBar.setVisible(false);
        this.addAttachment(this.healthBar, 3);

        this.currentTier = null;
        this.harvestStage = undefined;

        this.stageColours = {
            0: "Green",
            1: "Green",
            2: "Red",
            3: "Yellow"
        }

        this.updateModel();
    }

    update(dt, tick) {
        if (tick) {
            this.updateModel(tick.tier);
            this.updateHealthBar(tick);
            if (tick.harvestStage !== undefined) this.updateHarvestStage(tick.harvestStage);
        }
        super.update(dt, tick);
    }

    updateHarvestStage(harvestStage) {
        if (harvestStage == this.harvestStage) return;
        this.harvestStage = harvestStage;

        this.removeAttachment(this.stageIndicator);
        this.stageIndicator = new SpriteEntity(`./asset/images/Entity/Harvester/HarvesterDrone${this.stageColours[harvestStage]}.svg`);
        this.addAttachment(this.stageIndicator, 3);
    }

    updateModel(tier = 1) {
        if (tier === this.currentTier) return;
        this.currentTier = tier;
        this.removeAttachment(this.base);
        if ([1, 2, 3, 4, 5, 6, 7, 8].includes(tier)) {
            this.base = new SpriteEntity(`./asset/images/Entity/Harvester/HarvesterDroneTier${tier}.svg`);
        } else {
            throw new Error(`Unknown tier encountered for HarvesterDrone: ${tier}`);
        }
        this.addAttachment(this.base, 2);
    }

    updateHealthBar(tick) {
        this.healthBar.setVisible(tick.health !== tick.maxHealth);
    }
}

export { HarvesterDrone };