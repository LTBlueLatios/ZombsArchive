import { Entity } from "../Entity.js";
import { DrawEntity } from "../DrawEntity.js";

class HealthBar extends Entity {
    constructor(barColor) {
        super();
        this.barColor = barColor || { r: 180, g: 0, b: 10 };
        this.width = 84;
        this.height = 12;
        this.backgroundNode = new DrawEntity();
        this.backgroundNode.drawRoundedRect(0, 0, this.width, this.height, 3, { r: 0, g: 0, b: 0 });
        this.backgroundNode.setAlpha(0.3);
        this.barNode = new DrawEntity();
        this.barNode.drawRoundedRect(2, 2, this.width - 2, this.height - 2, 2, this.barColor);
        this.addAttachment(this.backgroundNode);
        this.addAttachment(this.barNode);
        this.setPivotPoint(this.width / 2, -64);
        this.setMaxHealth(100);
        this.setHealth(100);
    }
    setSize(width, height) {
        const percent = this.percent;
        this.width = width;
        this.height = height;
        this.percent = null;
        this.backgroundNode.clear();
        this.backgroundNode.drawRoundedRect(0, 0, this.width, this.height, 3, { r: 0, g: 0, b: 0 });
        this.barNode.clear();
        this.barNode.drawRoundedRect(2, 2, this.width - 2, this.height - 2, 2, this.barColor);
        this.setPivotPoint(this.width / 2, -64);
        this.setPercent(percent);
    }
    setHealth(health) {
        this.health = health;
        this.setPercent(this.health / this.maxHealth);
    }
    setMaxHealth(max) {
        this.maxHealth = max;
        this.setPercent(this.health / this.maxHealth);
    }
    setPercent(percent) {
        if (this.percent === percent) return;
        this.percent = percent;
        this.barNode.setScaleX(this.percent);
    }
    update(dt, tick) {
        if (tick) {
            this.setHealth(tick.health);
            this.setMaxHealth(tick.maxHealth);
        }
        this.setRotation(-this.getParent()?.getParent().getRotation());
        super.update(dt, tick);
    }
}
export { HealthBar };