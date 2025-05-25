import { SpriteEntity } from "../SpriteEntity.js";
import { CharacterModel } from "../CharacterModel.js";
import { HealthBar } from "./HealthBar.js";

class Zombie extends CharacterModel {
    constructor() {
        super();
        this.healthBar = new HealthBar({ r: 183, g: 70, b: 20 });
        this.healthBar.setPosition(0, -5);
        this.healthBar.setScale(0.6);
        this.addAttachment(this.healthBar, 0);

        this.hasDeathFadeEffect = true;
        this.deathFadeEffect.fadeOutTime = 100;
        this.deathFadeEffect.maxScaleIncreasePercent = 0.15;
    }

    update(dt, tick) {
        const networkEntity = this.getParent();
        if (tick) {
            if (this.base === undefined) {
                this.updateModel(tick, networkEntity);
            }
            this.healthBar.setVisible(tick.health < tick.maxHealth);

            if (tick.yaw !== undefined) networkEntity.targetTick.aimingYaw = tick.yaw;
        }
        super.update(dt, tick);
    }

    updateModel(tick, networkEntity) {
        const zombieTiers = 10;

        if (tick.tier < 0 || tick.tier > zombieTiers) throw new Error(`Invalid zombie tier received: ${tick.tier}`);

        if (tick.tier == 3) {
            this.base = new SpriteEntity(`./asset/images/Entity/Zombie/Zombie${tick.colour}/Zombie${tick.colour}Tier${tick.tier}Base.svg`);
            this.weaponLeft = new SpriteEntity(`./asset/images/Entity/Zombie/Zombie${tick.colour}/Zombie${tick.colour}Tier${tick.tier}WeaponLeft.svg`);
            this.weaponRight = new SpriteEntity(`./asset/images/Entity/Zombie/Zombie${tick.colour}/Zombie${tick.colour}Tier${tick.tier}WeaponRight.svg`);

            this.weaponLeft.setAnchor(0.5, 0.5);
            this.weaponRight.setAnchor(0.5, 0.5);
            this.weaponUpdateFunc = this.updateStabbingWeapon(500);

            this.addAttachment(this.base, 2);
            this.addAttachment(this.weaponLeft, 1);
            this.addAttachment(this.weaponRight, 1);
        } else {
            this.base = new SpriteEntity(`./asset/images/Entity/Zombie/Zombie${tick.colour}/Zombie${tick.colour}Tier${tick.tier}Base.svg`);
            this.weapon = new SpriteEntity(`./asset/images/Entity/Zombie/Zombie${tick.colour}/Zombie${tick.colour}Tier${tick.tier}Weapon.svg`);

            switch (tick.tier) {
                case 2:
                    this.weapon.setAnchor(0.5, 0.5);
                    this.weaponUpdateFunc = this.updateAntiClockwiseSwingingWeapon(300, 100);
                    break;
                case 4:
                case 5:
                    this.weapon.setAnchor(0.5, 0.5);
                    this.weaponUpdateFunc = this.updateClockwiseSwingingWeapon(300, 100);
                    break;
                case 6:
                case 7:
                case 8:
                    this.weapon.setAnchor(0.5, 0.5);
                    this.weaponUpdateFunc = this.updateClockwiseSwingingWeapon(300, 100);
                    break;
                default:
                    this.weapon.setAnchor(0.5, 0.5);
                    this.weaponUpdateFunc = this.updateAntiClockwiseSwingingWeapon(300, 100);
                    break;
            }

            this.addAttachment(this.base, 2);
            this.addAttachment(this.weapon, 1);
        }
    }
}

export { Zombie };