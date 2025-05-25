import { Game } from "../../../Game.js";
import { SpriteEntity } from "../SpriteEntity.js";
import { ModelEntity } from "../ModelEntity.js";
import { DrawEntity } from "../DrawEntity.js";

class RocketProjectile extends ModelEntity {
    constructor(targetTick) {
        super();
        this.tier = targetTick.tier;
        this.currentRotation = 0;
        this.base = new SpriteEntity(`./asset/images/Entity/Projectile/RocketProjectile.svg`);
        this.addAttachment(this.base);
    }

    onDie() {
        if (Game.settings.specialEffectsDisabled == true) return;
        if (Game.renderer.replicator.getMsSinceTick(Game.renderer.replicator.currentTick.tick) > 500) return;

        const shockwave = new DrawEntity();
        Game.renderer.groundLayer.addAttachment(shockwave);

        const position = this.getParent().targetTick.position;
        let shockwaveRadius = 0;
        const maxRadius = Game.ui.buildingData.RocketTower.projectileAoeRadius[this.tier - 1];

        shockwave.update = dt => {
            shockwave.draw.clear();
            shockwave.draw.circle(position.x, position.y, shockwaveRadius);
            shockwave.draw.stroke({ width: 10, color: 0xFFFFFF, alpha: 0.1 });

            const targetTimeMs = 100;
            const rateOfIncrease = (maxRadius / targetTimeMs) * dt;
            shockwaveRadius += rateOfIncrease;

            if (shockwaveRadius >= maxRadius) {
                // Animation complete, remove the shockwave from the stage.
                Game.renderer.groundLayer.removeAttachment(shockwave);
                Game.renderer.renderingFilters.splice(Game.renderer.renderingFilters.indexOf(shockwave), 1);
            }
        }

        Game.renderer.renderingFilters.push(shockwave);
    }
}

export { RocketProjectile };