import { SpriteEntity } from "../SpriteEntity.js";
import { ModelEntity } from "../ModelEntity.js";

class Projectile extends ModelEntity {
    constructor(targetTick) {
        super();
        this.base = new SpriteEntity(`./asset/images/Entity/Projectile/${targetTick.model}.svg`);
        this.addAttachment(this.base);

        this.hasDeathFadeEffect = true;
        this.deathFadeEffect.fadeOutTime = 150;
        this.deathFadeEffect.maxScaleIncreasePercent = 0.2;
    }
}

export { Projectile };