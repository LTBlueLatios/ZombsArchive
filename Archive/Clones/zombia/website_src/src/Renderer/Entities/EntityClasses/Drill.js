import { ModelEntity } from "../ModelEntity.js";
import { SpriteEntity } from "../SpriteEntity.js";
import { HealthBar } from "./HealthBar.js";

class Drill extends ModelEntity {
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
            this.currentRotation += 45 * tick.tier * dt / 1000;
            this.currentRotation %= 360;
            this.drill.setRotation(this.currentRotation);
        }
        super.update(dt, tick);
    }
    
    updateModel(tier = 1) {
        if (tier == this.currentTier) return;
        this.currentTier = tier;
        this.removeAttachment(this.head);
        this.removeAttachment(this.drill);
        if ([1, 2, 3, 4, 5, 6, 7, 8].includes(tier)) {
            this.drill = new SpriteEntity(`./asset/images/Entity/Drill/Drill.svg`);
            this.head = new SpriteEntity(`./asset/images/Entity/Drill/DrillTier${tier}Head.svg`);
        } else throw new Error(`Unknown tier encountered for drill: ${tier}`);
        this.addAttachment(this.drill, 2);
        this.addAttachment(this.head, 3);
    }

    updateHealthBar(tick) {
        this.healthBar.setVisible(tick.health !== tick.maxHealth);
    }
}

export { Drill };