import { Game } from "../../../Game.js";
import { DrawEntity } from "../DrawEntity.js";
import { SpriteEntity } from "../SpriteEntity.js";
import { TowerModel } from "./TowerModel.js";

class SawTower extends TowerModel {
    constructor() {
        super("SawTower");

        this.currentRotation = 0;
        this.extensionPosition = 0;
        this.lastExtensionPosition = undefined;

        this.arm = new DrawEntity();
        this.arm.drawRect(-8, 0, 8, 48, { r: 0, g: 0, b: 0 });
        this.arm.setRotation(180);
        this.addAttachment(this.arm, 2);

        this.updateModel();
    }

    update(dt, tick) {
        if (tick) {
            this.updateModel(tick.tier);
            this.updateAnimation(dt, tick);
            this.updateHealthBar(tick);
        }
        super.update(dt, tick);
    }

    updateModel(tier = 1) {
        if (tier == this.currentTier) return;
        this.currentTier = tier;

        this.removeAttachment(this.base);
        this.removeAttachment(this.blade);
        this.removeAttachment(this.top);
        this.removeAttachment(this.brace);

        if ([1, 2, 3, 4, 5, 6, 7, 8].includes(tier)) {
            this.base = new SpriteEntity(`./asset/images/Entity/SawTower/SawTowerTier${tier}Base.svg`);
            this.blade = new SpriteEntity(`./asset/images/Entity/SawTower/SawTowerBlade.svg`);
            this.top = new SpriteEntity(`./asset/images/Entity/SawTower/SawTowerTier${tier}Top.svg`);
            this.top.setPositionY(-16);
            this.brace = new SpriteEntity(`./asset/images/Entity/SawTower/SawTowerTier${tier}Brace.svg`);

            this.blade.setPositionY(this.extensionPosition - 12 - 16);
            this.arm.draw.height = -this.extensionPosition;
            this.brace.setPositionY(this.extensionPosition - 16);
        } else throw new Error(`Unknown tier encountered for SawTower: ${tier}`);

        this.addAttachment(this.base, 1);
        this.addAttachment(this.blade, 3);
        this.addAttachment(this.top, 4);
        this.addAttachment(this.brace, 5);
        this.brace.setAnchor(0.5, 1);
    }

    updateHealthBar(tick) {
        this.healthBar.setVisible(tick.health !== tick.maxHealth);
    }

    updateAnimation(dt, tick) {
        if (tick.firingTick !== 0) {
            this.currentRotation += 720 * dt / 1000;
            this.currentRotation %= 360;
            this.blade.setRotation(this.currentRotation);
            this.extending = true;
        } else {
            this.extending = false;
        }

        if (this.extending === true) {
            this.extensionPosition -= 4;
            if (this.extensionPosition < -64) this.extensionPosition = -64;
        } else {
            this.extensionPosition += 8;
            if (this.extensionPosition > 0) this.extensionPosition = 0;
        }

        if (this.extensionPosition !== this.lastExtensionPosition) {
            this.lastExtensionPosition = this.extensionPosition;

            // The first -12 is to center the blade relative to the brace and the second is to offset it from the centre of the base to make the top better
            this.blade.setPositionY(this.extensionPosition - 12 - 16);
            this.arm.draw.height = -this.extensionPosition;
            this.brace.setPositionY(this.extensionPosition - 16);
        }
    }
}

export { SawTower };