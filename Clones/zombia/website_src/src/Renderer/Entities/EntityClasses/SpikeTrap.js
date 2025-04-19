import { SpriteEntity } from "../SpriteEntity.js";
import { ModelEntity } from "../ModelEntity.js";
import { Game } from "../../../Game.js";

class SpikeTrap extends ModelEntity {
    constructor() {
        super();
        this.currentTier = null;
        this.updateModel();

        this.spikeSprite = new SpriteEntity(`./asset/images/Entity/SpikeTrap/SpikeTrapSpike.svg`);
        this.spikeSprite.setVisible(false);
        Game.renderer.projectiles.addAttachment(this.spikeSprite, 10);
    }

    onDie() {
        Game.renderer.projectiles.removeAttachment(this.spikeSprite);
        this.spikeSprite = null;
    }

    update(dt, tick) {
        if (tick) {
            if (tick.position !== undefined) {
                this.spikeSprite.setPosition(this.getPositionX(), this.getPositionY());
            }

            this.updateModel(tick.tier);
            this.updateFiringAnimation(tick);
        }
        super.update(dt, tick);
    }

    updateModel(tier = 1) {
        if (tier === this.currentTier) return;
        this.currentTier = tier;
        this.removeAttachment(this.base);
        if ([1, 2, 3, 4, 5, 6, 7, 8].includes(tier)) {
            this.base = new SpriteEntity(`./asset/images/Entity/SpikeTrap/SpikeTrapBaseTier${tier}.svg`);
        } else {
            throw new Error(`Unknown tier encountered for SpikeTrap: ${tier}`);
        }
        this.addAttachment(this.base, 2);
        this.base.setAlpha(0.5);
    }

    updateFiringAnimation(tick) {
        const currentTick = Game.renderer.replicator.getTickIndex();
        if (Math.abs(tick.firingTick - currentTick) < 10) this.spikeSprite.setVisible(true);
        else this.spikeSprite.setVisible(false);
    }
}

export { SpikeTrap };