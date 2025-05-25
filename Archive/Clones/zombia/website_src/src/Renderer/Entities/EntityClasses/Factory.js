import { Game } from "../../../Game.js";
import { ModelEntity } from "../ModelEntity.js";
import { SpriteEntity } from "../SpriteEntity.js";
import { HealthBar } from "./HealthBar.js";

class Factory extends ModelEntity {
    constructor() {
        super();
        this.healthBar = new HealthBar();
        this.healthBar.setSize(82, 16);
        this.healthBar.setPivotPoint(82 / 2, -25);
        this.healthBar.setVisible(false);
        this.addAttachment(this.healthBar, 3);

        this.currentTier = null;
        this.updateModel();
    }

    update(dt, tick) {
        if (tick) {
            this.updateModel(tick.tier);
            this.updateHealthBar(tick);

            if (tick.partyId == Game.ui.playerTick.partyId) Game.ui.components.uiBuildingBar.updateBuildingButtons(tick);
        }
        super.update(dt, tick);
    }

    updateModel(tier = 1) {
        if (tier === this.currentTier) return;
        this.currentTier = tier;
        this.removeAttachment(this.base);
        if ([1, 2, 3, 4, 5, 6, 7, 8].includes(tier)) {
            this.base = new SpriteEntity(`./asset/images/Entity/Factory/FactoryTier${tier}Base.svg`);
        } else {
            throw new Error(`Unknown tier encountered for gold stash: ${tier}`);
        }
        this.addAttachment(this.base, 2);
    }

    updateHealthBar(tick) {
        this.healthBar.setVisible(tick.health !== tick.maxHealth);
    }
}

export { Factory };