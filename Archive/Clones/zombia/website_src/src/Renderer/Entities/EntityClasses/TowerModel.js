import { SpriteEntity } from "../SpriteEntity.js";
import { HealthBar } from "./HealthBar.js";
import { ModelEntity } from "../ModelEntity.js";
import { Util } from "../../../Util.js";

class TowerModel extends ModelEntity {
    constructor(type) {
        super();
        this.type = type;
        this.healthBar = new HealthBar();
        this.healthBar.setSize(82, 16);
        this.healthBar.setPivotPoint(82 / 2, -25);
        this.healthBar.setVisible(false);
        this.addAttachment(this.healthBar, 100);
        this.lastYaw = 0;
    }

    update(dt, tick) {
        if (tick) {
            this.updateModel(tick.tier);
            this.updateHealthBar(tick);
            this.head?.setRotation(tick.aimingYaw);
        }
        super.update(dt, tick);
    }

    updateModel(tier = 1) {
        if (tier == this.currentTier) return;
        this.currentTier = tier;
        this.removeAttachment(this.base);
        this.removeAttachment(this.head);
        if ([1, 2, 3, 4, 5, 6, 7, 8].includes(tier)) {
            this.base = new SpriteEntity(`./asset/images/Entity/${this.type}/${this.type}Tier${tier}Base.svg`);
            this.head = new SpriteEntity(`./asset/images/Entity/${this.type}/${this.type}Tier${tier}Head.svg`);
        } else throw new Error(`Unknown tier encountered for ${this.type} tower: ${tier}`);
        this.addAttachment(this.base, 2);
        this.addAttachment(this.head, 3);
    }

    updateHealthBar(tick) {
        this.healthBar.setVisible(tick.health !== tick.maxHealth);
    }
}

export { TowerModel };