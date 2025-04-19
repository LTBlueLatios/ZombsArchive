import { Entity } from "./Entity.js";
import { Game } from "../../Game.js";

class ModelEntity extends Entity {
    constructor() {
        super();

        this.hasDeathFadeEffect = false;
        this.deathFadeEffect = {
            inUse: false,
            id: 0,
            diedTick: 0,
            lastFramePosition: { x: 0, y: 0 },
            lastFrameVelocity: { x: 0, y: 0 },
            shouldUpdatePosition: true,
            fadeOutTime: 0,
            maxScaleIncreasePercent: 0
        };
    }

    reset() {
        this.setParent(null);
    }

    updateDeathFadeEffect(dt, tick) {
        const currentTickNumber = Game.renderer.replicator.currentTick.tick;
        const ticksSinceDied = currentTickNumber - this.deathFadeEffect.diedTick;

        // Update Alpha
        const fadeOutTimeTicks = this.deathFadeEffect.fadeOutTime / Game.renderer.replicator.msPerTick;
        const alpha = 1 - (ticksSinceDied / fadeOutTimeTicks);
        if (alpha <= 0) {
            Game.renderer.deleteFadingAttachment(this.deathFadeEffect.id);
            return;
        }
        this.setAlpha(alpha);

        // Update scale
        const scale = 1 + (ticksSinceDied / fadeOutTimeTicks) * this.deathFadeEffect.maxScaleIncreasePercent;
        this.setScale(scale);

        if (this.deathFadeEffect.shouldUpdatePosition == true) {
            this.parent.setPositionX(this.deathFadeEffect.lastFramePosition.x);
            this.parent.setPositionY(this.deathFadeEffect.lastFramePosition.y);
            // Update position to continue with the last frame velocity
            this.deathFadeEffect.lastFramePosition.x += this.deathFadeEffect.lastFrameVelocity.x / 2 / Game.renderer.replicator.msPerTick * dt;
            this.deathFadeEffect.lastFramePosition.y += this.deathFadeEffect.lastFrameVelocity.y / 2 / Game.renderer.replicator.msPerTick * dt;
        }
    }

    update(dt, tick) {
        super.update(dt, tick);

        if (this.hasDeathFadeEffect == true && this.deathFadeEffect?.inUse == true) {
            this.updateDeathFadeEffect(dt, tick);
        }
    }
}

export { ModelEntity };