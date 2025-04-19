import { Game } from "../../../Game.js";
import { SpriteEntity } from "../SpriteEntity.js";
import { ModelEntity } from "../ModelEntity.js";

class Resource extends ModelEntity {
    constructor(targetTick) {
        super();
        this.base = new SpriteEntity(`./asset/images/Map/${targetTick.resourceType}${targetTick.resourceVariant}.svg`);
        this.addAttachment(this.base, 1);
    }

    update(dt, tick) {
        if (tick) {
            if (tick.hits !== undefined) this.updateHit(tick);
            if (Math.round(this.base.getRotation()) !== tick.aimingYaw) this.base.setRotation(tick.aimingYaw);
        }
        super.update(dt, tick);
    }

    updateHit(tick) {
        let sumX = 0;
        let sumY = 0;
        const animationLengthInMs = 250;
        const moveDistance = 10;
        for (let i = 0; i < tick.hits.length / 2; i++) {
            const hitTick = tick.hits[i * 2 + 0];
            const hitYaw = tick.hits[i * 2 + 1];
            const msSinceHit = Game.renderer.replicator.getMsSinceTick(hitTick);
            if (msSinceHit >= animationLengthInMs) continue;
            const percent = Math.min(msSinceHit / animationLengthInMs, 1);
            const xDirection = Math.sin(hitYaw * Math.PI / 180);
            const yDirection = Math.cos(hitYaw * Math.PI / 180) * -1;
            sumX += xDirection * moveDistance * Math.sin(percent * Math.PI);
            sumY += yDirection * moveDistance * Math.sin(percent * Math.PI);
        }
        const length = Math.sqrt((sumX * sumX) + (sumY * sumY));
        if (length > moveDistance) {
            sumX /= length;
            sumY /= length;
            sumX *= moveDistance;
            sumY *= moveDistance;
        }
        this.base.setPosition(sumX, sumY);
    }
}


export { Resource };