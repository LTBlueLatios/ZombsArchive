import { ModelEntity } from "../ModelEntity.js";
import { SpriteEntity } from "../SpriteEntity.js";

class ResourcePickup extends ModelEntity {
    constructor(targetTick) {
        super();
        const resources = ["wood", "stone", "gold"];
        this.resourceType = resources[targetTick.resourcePickupType];
        this.resourceType = this.resourceType.charAt(0).toUpperCase() + this.resourceType.slice(1);

        const sprite = new SpriteEntity(`./asset/images/Entity/Harvester/${this.resourceType}Pickup.svg`);
        this.addAttachment(sprite, 1);

        this.hasDeathFadeEffect = true;
        this.deathFadeEffect.fadeOutTime = 150;
        this.deathFadeEffect.maxScaleIncreasePercent = 0.15;
        this.deathFadeEffect.shouldUpdatePosition = false;
    }
}

export { ResourcePickup };