import { CharacterModel } from "../CharacterModel.js";
import { HealthBar } from "./HealthBar.js";
import { ShieldBar } from "./ShieldBar.js";
import { SpriteEntity } from "../SpriteEntity.js";
import { TextEntity } from "../TextEntity.js";
import { Game } from "../../../Game.js";
import { Util } from "../../../Util.js";

const grawlix = require("grawlix");
const grawlixRacism = require("grawlix-racism");

grawlix.loadPlugin(grawlixRacism);

grawlix.setDefaults({
    randomize: false
});

class Player extends CharacterModel {
    constructor() {
        super();
        this.base = new SpriteEntity("./asset/images/Entity/Player/Player.svg");
        this.addAttachment(this.base, 2);
        this.nameEntity = new TextEntity("Player", { fontFamily: "Hammersmith One", fontSize: 20, strokeWidth: 6 });
        this.nameEntity.setAnchor(0.45, 0.45);
        this.nameEntity.setPivotPoint(0, 70);
        this.nameEntity.setColor(220, 220, 220);
        this.nameEntity.setFontWeight("bold");
        this.nameEntity.setLetterSpacing(1);
        this.addAttachment(this.nameEntity, 0);
        this.healthBar = new HealthBar();
        this.addAttachment(this.healthBar, 0);
        this.shieldBar = new ShieldBar();
        this.addAttachment(this.shieldBar, 0);
        this.shieldBar.setVisible(false);

        this.rotationLocked = true;
        this.nameFiltered = undefined;
        this.invulnerabilityAnimationProps = {
            isForward: true,
            elapsedTime: 0,
            animationDuration: 750
        }

        if (process.env.NODE_ENV == "development") {
            this.UKeyDown = false;
            Game.eventEmitter.on("85Down", () => {
                this.UKeyDown = true;
            });

            Game.eventEmitter.on("85Up", () => {
                this.UKeyDown = false;
            });
        }
    }

    update(dt, tick) {
        const entity = this.getParent();
        if (tick) {
            if (entity.isLocal() && entity.getTargetTick().dead !== true && Game.network.inputPacketManager.inputsLocked == false) entity.getTargetTick().aimingYaw = entity.getFromTick().aimingYaw = Game.network.inputPacketManager.getLastSentYaw();

            if (tick.name !== this.lastName) {
                this.lastName = tick.name;
                this.nameEntity.setString(tick.name);
            }

            if (this.nameFiltered !== Game.network.languageFilterEnabled) {
                this.nameFiltered = !!Game.network.languageFilterEnabled;
                this.nameEntity.setString(this.nameFiltered ? grawlix(this.lastName) : this.lastName);
            }

            if (process.env.NODE_ENV == "development") {
                if (this.UKeyDown == true) {
                    this.nameEntity.setString(`${this.lastName}\nUID: ${entity.getTargetTick().uid}\n\n\n`);
                } else {
                    this.nameEntity.setString(this.nameFiltered ? grawlix(this.lastName) : this.lastName);
                }
            }

            if (tick.weaponName !== this.lastWeaponName || tick.weaponTier !== this.lastWeaponTier) this.updateWeapon(tick);
            this.healthBar.setVisible(tick.health < tick.maxHealth);
            if (tick.zombieShieldMaxHealth > 0) this.shieldBar.setVisible(tick.zombieShieldHealth < tick.zombieShieldMaxHealth);
            else this.shieldBar.setVisible(false);

            if (tick.invulnerable !== undefined) this.updateInvulnerabilityIndicator(dt, tick);
        }

        super.update(dt, tick);

        this.nameEntity.setRotation(-entity.getRotation());
    }

    updateInvulnerabilityIndicator(dt, tick) {
        if (tick.invulnerable == true) {
            let redColour = 0xFF9F9F;
            let noColour = 0xFFFFFF;

            this.invulnerabilityAnimationProps.elapsedTime += dt;

            let progress = Math.min(this.invulnerabilityAnimationProps.elapsedTime / this.invulnerabilityAnimationProps.animationDuration, 1);

            if (!this.invulnerabilityAnimationProps.isForward) progress = 1 - progress;

            const initialR = (noColour >> 16) & 0xFF;
            const initialG = (noColour >> 8) & 0xFF;
            const initialB = noColour & 0xFF;

            const targetR = (redColour >> 16) & 0xFF;
            const targetG = (redColour >> 8) & 0xFF;
            const targetB = redColour & 0xFF;

            const currentR = initialR + (targetR - initialR) * progress;
            const currentG = initialG + (targetG - initialG) * progress;
            const currentB = initialB + (targetB - initialB) * progress;

            const colour = (currentR << 16) + (currentG << 8) + currentB;

            this.base.setTint(colour);
            this.weapon.setTint(colour);

            if (progress >= 1 || progress <= 0) {
                this.invulnerabilityAnimationProps.isForward = !this.invulnerabilityAnimationProps.isForward;
                this.invulnerabilityAnimationProps.elapsedTime = 0;
            }
        } else {
            this.base.setTint(0xFFFFFF);
            this.weapon.setTint(0xFFFFFF);
        }
    }

    updateAntiClockwiseSwingingWeapon(swingLengthInMs = 300, swingAmplitude = 100) {
        return ((tick, networkEntity) => {
            const aimingYaw = Util.interpolateYaw(networkEntity.getFromTick().aimingYaw, networkEntity.getTargetTick().aimingYaw);
            this.setRotation(aimingYaw);
            if (tick.firingTick && (tick.firingTick !== this.lastFiringTick || !this.lastFiringAnimationDone)) {
                this.lastFiringTick = tick.firingTick;
                this.lastFiringAnimationDone = false;
                var msSinceFiring = Game.renderer.replicator.getMsSinceTick(tick.firingTick);
                var swingPercent = Math.min(msSinceFiring / swingLengthInMs, 1.0);
                var swingDeltaRotation = Math.sin(swingPercent * Math.PI) * swingAmplitude;
                if (swingPercent === 1) this.lastFiringAnimationDone = true;
                this.setRotation(aimingYaw - swingDeltaRotation);
            }
        })
    }

    updateBowWeapon(pullLengthInMs = 500, releaseLengthInMs = 250) {
        return ((tick, networkEntity) => {
            const aimingYaw = Util.interpolateYaw(networkEntity.getFromTick().aimingYaw, networkEntity.getTargetTick().aimingYaw);
            this.setRotation(aimingYaw);
            if (tick.startChargingTick) {
                this.lastFiringAnimationDone = false;
                let msSinceFiring = Game.renderer.replicator.getMsSinceTick(tick.startChargingTick);
                let pullPercent = Math.min(msSinceFiring / pullLengthInMs, 1.0);
                this.bowHands.setPositionY(10 * pullPercent);
            }
            else if (tick.firingTick && (tick.firingTick !== this.lastFiringTick || !this.lastFiringAnimationDone)) {
                this.lastFiringTick = tick.firingTick;
                this.lastFiringAnimationDone = false;
                const msSinceFiring = Game.renderer.replicator.getMsSinceTick(tick.firingTick);
                const releasePercent = Math.min(msSinceFiring / releaseLengthInMs, 1.0);
                if (releasePercent === 1) this.lastFiringAnimationDone = true;
                this.bowHands.setPositionY(10 - 10 * releasePercent);
            }
        })
    }

    updateDynamiteWeapon(swingLengthInMs = 300, swingAmplitude = 100) {
        return ((tick, networkEntity) => {
            const aimingYaw = Util.interpolateYaw(networkEntity.getFromTick().aimingYaw, networkEntity.getTargetTick().aimingYaw);
            this.setRotation(aimingYaw);
            if (tick.firingTick && (tick.firingTick !== this.lastFiringTick || !this.lastFiringAnimationDone)) {
                this.lastFiringTick = tick.firingTick;
                this.lastFiringAnimationDone = false;
                var msSinceFiring = Game.renderer.replicator.getMsSinceTick(tick.firingTick);
                var swingPercent = Math.min(msSinceFiring / swingLengthInMs, 1.0);
                var swingDeltaRotation = Math.sin(swingPercent * Math.PI) * swingAmplitude;
                if (swingPercent === 1) this.lastFiringAnimationDone = true;
                this.weapon.setRotation(-swingDeltaRotation);
            }
        })
    }

    updateWeapon(tick) {
        this.lastWeaponName = tick.weaponName;
        this.lastWeaponTier = tick.weaponTier;

        this.removeAttachment(this.weapon);
        this.removeAttachment(this.dormantArm);

        this.removeAttachment(this.bowHands);
        this.bowHands = null;

        switch (tick.weaponName) {
            case "Pickaxe":
            case "Sword":
                let meleeWeapon = new SpriteEntity(`./asset/images/Entity/Player/Player${tick.weaponName}Tier${tick.weaponTier}.svg`);
                meleeWeapon.setAnchor(0.5, 0.9);
                this.weapon = meleeWeapon;
                this.weaponUpdateFunc = this.updateAntiClockwiseSwingingWeapon(Game.ui.toolData[tick.weaponName].msBetweenFires[tick.weaponTier - 1], 100);
                break;
            case "Crossbow":
                let bow = new SpriteEntity(`./asset/images/Entity/Player/PlayerCrossbowTier${tick.weaponTier}.svg`);
                let bowHands = new SpriteEntity(`./asset/images/Entity/Player/PlayerCrossbowHandTier${tick.weaponTier}.svg`);
                bowHands.setAnchor(1, 1);
                bow.setAnchor(0.5, 1);
                this.weapon = bow;
                this.bowHands = bowHands;
                this.weaponUpdateFunc = this.updateBowWeapon(Game.ui.toolData[tick.weaponName].msBetweenFires[tick.weaponTier - 1], 250);
                break;
            case "Dynamite":
                let dynamiteArm = new SpriteEntity(`./asset/images/Entity/Player/PlayerDynamiteHandTier${tick.weaponTier}.svg`);
                dynamiteArm.setAnchor(0.5, 0.9);
                this.dormantArm = new SpriteEntity(`./asset/images/Entity/Player/PlayerEmptyDynamiteHand.svg`);
                this.dormantArm.setAnchor(0.5, 1.35);
                this.addAttachment(this.dormantArm, 1);
                this.weapon = dynamiteArm;
                this.weaponUpdateFunc = this.updateDynamiteWeapon(250, 75);
                break;
            default:
                throw new Error(`Unknown player weapon: ${tick.weaponName}`);
        }

        if (this.bowHands !== null) this.addAttachment(this.bowHands);
        this.addAttachment(this.weapon, 1);
    }

    updateDamageTint(tick) {
        if (tick.invulnerable == true) return;

        if (tick.zombieShieldHealth > 0) {
            this.base.setTint(0xFFFFFF);
            this.weapon.setTint(0xFFFFFF);
            return;
        }

        super.updateDamageTint(tick);
    }
}


export { Player };