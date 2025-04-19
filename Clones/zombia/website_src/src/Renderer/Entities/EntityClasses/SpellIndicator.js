import { DrawEntity } from "../DrawEntity.js";
import { ModelEntity } from "../ModelEntity.js";
import { SpriteEntity } from "../SpriteEntity.js";

const spellTypes = ["Rapidfire"];

class SpellIndicator extends ModelEntity {
    constructor(targetTick) {
        super();
        this.spellIndicatorModel = new DrawEntity();
        this.spellIndicatorModel.setAlpha(0.1);
        this.addAttachment(this.spellIndicatorModel);

        this.spellType = spellTypes[targetTick.spellType];
        this.radius = targetTick.radius;

        this.currentPulse = 0;
        const pulsesPerSecond = 0.5;
        this.pulseSpeed = pulsesPerSecond * 2 * Math.PI;
        this.minAlpha = 0.05;
        this.maxAlpha = 0.12;

        this.icons = {};
        this.iconOffsets = {};
        this.iconMaxOffset = 50;
        this.iconSpawnTolerance = 0.1;
        this.iconTotal = 10;
        this.iconMoveRatePerSecond = 144;

        let fill = { r: 216, g: 0, b: 39 };
        let lineFill = { r: 216, g: 77, b: 92 };

        switch (this.spellType) {
            case "Rapidfire":
                fill = { r: 255, g: 254, b: 119 };
                lineFill = { r: 255, g: 255, b: 0 };
                break;
        }

        this.spellIndicatorModel.drawCircle(0, 0, this.radius, fill, lineFill, 8);

        this.hasDeathFadeEffect = true;
        this.deathFadeEffect.fadeOutTime = 1000;
        this.deathFadeEffect.maxScaleIncreasePercent = 0;
    }

    update(dt, tick) {
        if (tick) {
            this.updatePulse(dt);
            this.updateIcons(dt);
        }
        super.update(dt, tick);
    }

    updatePulse(dt) {
        this.currentPulse += dt / 1000;
        const sineValue = Math.sin(this.currentPulse * this.pulseSpeed);
        const normalisedSine = (sineValue + 1) / 2;

        this.spellIndicatorModel.setAlpha(this.minAlpha + (this.maxAlpha - this.minAlpha) * normalisedSine);
    }

    updateIcons(dt) {
        for (let i = 0; i < this.iconTotal; i++) {
            if (!this.icons[i]) {
                if (Math.random() > this.iconSpawnTolerance) continue;

                this.icons[i] = new SpriteEntity(`./asset/images/Entity/Spells/${this.spellType}Icon.svg`);
                this.iconOffsets[i] = 0;
                const randomAngle = Math.random() * Math.PI * 2;
                const randomX = Math.cos(randomAngle) * Math.random() * this.radius;
                const randomY = Math.sin(randomAngle) * Math.random() * this.radius;
                this.icons[i].setPosition(randomX, randomY);
                this.icons[i].setAlpha(0.5);
                this.addAttachment(this.icons[i]);
                continue;
            }

            const offsetRate = this.iconMoveRatePerSecond / 1000  * dt;

            this.iconOffsets[i] += offsetRate;
            this.icons[i].setPositionY(this.icons[i].getPositionY() - offsetRate);
            this.icons[i].setAlpha(0.5 - 0.5 * Math.min(1, this.iconOffsets[i] / this.iconMaxOffset));
            if (this.iconOffsets[i] >= this.iconMaxOffset) {
                this.removeAttachment(this.icons[i]);
                delete this.icons[i];
                delete this.iconOffsets[i];
            }
        }
    };
}

export { SpellIndicator };