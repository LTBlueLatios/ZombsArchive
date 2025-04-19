import { ModelEntity } from "./ModelEntity.js";
import { Game } from "../../Game.js";
import { Util } from "../../Util.js";

class CharacterModel extends ModelEntity {
    constructor() {
        super();
        this.lastDamagedTick = 0;
        this.lastDamagedAnimationDone = true;
        this.lastFiringTick = 0;
        this.lastFiringAnimationDone = true;
    }

    update(dt, tick) {
        const networkEntity = this.getParent();
        if (tick) {
            if (Game.settings.specialEffectsDisabled == false) this.updateDamageTint(tick);
            this.weaponUpdateFunc?.(tick, networkEntity);
        }
        super.update(dt, tick);
    }

    updateDamageTint(tick) {
        if (tick.lastDamagedTick && (tick.lastDamagedTick !== this.lastDamagedTick || !this.lastDamagedAnimationDone)) {
            this.lastDamagedTick = tick.lastDamagedTick;
            this.lastDamagedAnimationDone = false;
            const msSinceDamaged = Game.renderer.replicator.getMsSinceTick(tick.lastDamagedTick);
            const flashDurationMs = 100;
            const flashPercent = Math.min(msSinceDamaged / flashDurationMs, 1);
            const flashMultiplier = Math.sin(flashPercent * Math.PI);
            let tint = (255 << 16) | ((255 - 255 * flashMultiplier / 4) << 8) | ((255 - 255 * flashMultiplier / 4) << 0);
            if (flashPercent === 1) {
                tint = 0xFFFFFF;
                this.lastDamagedAnimationDone = true;
            }
            this.base.setTint(tint);
            if (this.weapon) this.weapon.setTint(tint);
        }
    }

    updatePunchingWeapon(punchLengthInMs = 300) {
        return ((tick, networkEntity) => {
            if (tick.firingTick && (tick.firingTick !== this.lastFiringTick || !this.lastFiringAnimationDone)) {
                this.lastFiringTick = tick.firingTick;
                this.lastFiringAnimationDone = false;
                const msSinceFiring = Game.currentGame.world.getReplicator().getMsSinceTick(tick.firingTick);
                const punchPercent = Math.min(msSinceFiring / punchLengthInMs, 1);
                const animationMultiplier = Math.sin(punchPercent * 2 * Math.PI) / Math.PI * -1;
                if (punchPercent === 1) this.lastFiringAnimationDone = true;
                this.weapon.setPositionY(20 * animationMultiplier);
            }
        })
    }

    updateStabbingWeapon(stabLengthInMs = 300) {
        return ((tick, networkEntity) => {
            if (tick.firingTick && (tick.firingTick !== this.lastFiringTick || !this.lastFiringAnimationDone)) {
                this.lastFiringTick = tick.firingTick;
                this.lastFiringAnimationDone = false;
                const msSinceFiring = Game.renderer.replicator.getMsSinceTick(tick.firingTick);
                const stabPercent = Math.min(msSinceFiring / stabLengthInMs, 1);
                const animationMultiplier = Math.sin(stabPercent * 2 * Math.PI) / Math.PI * -1;
                if (stabPercent === 1) this.lastFiringAnimationDone = true;

                if (msSinceFiring < (stabLengthInMs / 2)) {
                    this.weaponLeft.setPositionY(20 * animationMultiplier);
                } else {
                    this.weaponRight.setPositionY(20 * animationMultiplier);
                }
            }
        })
    }

    updateAntiClockwiseSwingingWeapon(swingLengthInMs = 300, swingAmplitude = 100) {
        return ((tick, networkEntity) => {
            if (tick.firingTick && (tick.firingTick !== this.lastFiringTick || !this.lastFiringAnimationDone)) {
                this.lastFiringTick = tick.firingTick;
                this.lastFiringAnimationDone = false;
                const msSinceFiring = Game.renderer.replicator.getMsSinceTick(tick.firingTick);
                const swingPercent = Math.min(msSinceFiring / swingLengthInMs, 1.0);
                const swingDeltaRotation = Math.sin(swingPercent * Math.PI) * swingAmplitude;
                if (swingPercent === 1) {
                    this.lastFiringAnimationDone = true;
                }
                this.weapon.setRotation(-swingDeltaRotation);
            }
        })
    }

    updateClockwiseSwingingWeapon(swingLengthInMs = 300, swingAmplitude = 100) {
        return ((tick, networkEntity) => {
            if (tick.firingTick && (tick.firingTick !== this.lastFiringTick || !this.lastFiringAnimationDone)) {
                this.lastFiringTick = tick.firingTick;
                this.lastFiringAnimationDone = false;
                const msSinceFiring = Game.renderer.replicator.getMsSinceTick(tick.firingTick);
                const swingPercent = Math.min(msSinceFiring / swingLengthInMs, 1.0);
                const swingDeltaRotation = Math.sin(swingPercent * Math.PI) * swingAmplitude;
                if (swingPercent === 1) {
                    this.lastFiringAnimationDone = true;
                }
                this.weapon.setRotation(swingDeltaRotation);
            }
        })
    }

    updateBowWeapon(pullLengthInMs = 500, releaseLengthInMs = 250) {
        return ((tick, networkEntity) => {
            if (tick.firingTick && (tick.firingTick !== this.lastFiringTick || !this.lastFiringAnimationDone)) {
                if (tick.startChargingTick) {
                    this.lastFiringAnimationDone = false;
                    const msSinceFiring = Game.renderer.replicator.getMsSinceTick(tick.startChargingTick);
                    const pullPercent = Math.min(msSinceFiring / pullLengthInMs, 1);
                    this.bowHands.setPositionY(10 * pullPercent);
                } else if (tick.firingTick && (tick.firingTick !== this.lastFiringTick || !this.lastFiringAnimationDone)) {
                    this.lastFiringTick = tick.firingTick;
                    this.lastFiringAnimationDone = false;
                    const msSinceFiring = Game.renderer.replicator.getMsSinceTick(tick.firingTick);
                    const releasePercent = Math.min(msSinceFiring / releaseLengthInMs, 1);
                    if (releasePercent === 1) this.lastFiringAnimationDone = true;
                    this.bowHands.setPositionY(10 - 10 * releasePercent);
                }
            }
        });
    }
}
export { CharacterModel };