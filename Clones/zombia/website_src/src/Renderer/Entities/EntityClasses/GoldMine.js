import { ModelEntity } from "../ModelEntity.js";
import { SpriteEntity } from "../SpriteEntity.js";
import { HealthBar } from "./HealthBar.js";

class GoldMine extends ModelEntity {
    constructor() {
        super();
        this.healthBar = new HealthBar();
        this.healthBar.setSize(82, 16);
        this.healthBar.setPivotPoint(82 / 2, -25);
        this.healthBar.setVisible(false);
        this.addAttachment(this.healthBar, 4);

        this.currentRotation = 0;
        this.currentTier = null;
        this.updateModel();
    }

    update(dt, tick) {
        if (tick) {
            this.updateModel(tick.tier);
            this.updateHealthBar(tick);
            this.currentRotation += this.currentTier;
            this.currentRotation %= 360;
            // this.currentRotation += this.currentTier / 2;
            this.head.setRotation(this.currentRotation % 360);
        }
        super.update(dt, tick);
    }
    
    updateModel(tier = 1) {
        if (tier == this.currentTier) return;
        this.currentTier = tier;
        this.removeAttachment(this.base);
        this.removeAttachment(this.head);
        if ([1, 2, 3, 4, 5, 6, 7, 8].includes(tier)) {
                this.base = new SpriteEntity(`./asset/images/Entity/GoldMine/GoldMineTier${tier}Base.svg`);
                this.head = new SpriteEntity(`./asset/images/Entity/GoldMine/GoldMineTier${tier}Head.svg`);
        } else throw new Error(`Unknown tier encountered for gold mine: ${tier}`);
        this.addAttachment(this.base, 2);
        this.addAttachment(this.head, 3);
    }

    updateHealthBar(tick) {
        this.healthBar.setVisible(tick.health !== tick.maxHealth);
    }
}

export { GoldMine };