import { TowerModel } from "./TowerModel.js";
import { SpriteEntity } from "../SpriteEntity.js";
import { DrawEntity } from "../DrawEntity.js";
import { Game } from "../../../Game.js";
import { Util } from "../../../Util.js";

class LightningTower extends TowerModel {
    constructor() {
        super("LightningTower");

        this.targetBeams = new DrawEntity();
        Game.renderer.projectiles.addAttachment(this.targetBeams, 2);
        this.lastFiringTick = 0;
        this.hasFired = false;
        this.branchTextures = [];

        this.currentRotation = 0;
        this.currentRotationSpeed = 0;
    }

    removedParentFunction() {
        Game.renderer.projectiles.removeAttachment(this.targetBeams);
    }

    createLightningTexture(startingPosition, endingPosition) {
        const angleToTarget = Util.angleTo(startingPosition, endingPosition);
        const distanceToTarget = Math.sqrt(Util.measureDistance(startingPosition, endingPosition));

        // Choose a random number of beams between 4, 6 and 8
        const numberOfBeamPoints = 2 * (2 + Math.floor(Math.random() * 3));

        this.targetBeams.draw.moveTo(startingPosition.x, startingPosition.y);

        let lastBeamPosition = { x: startingPosition.x, y: startingPosition.y };
        for (let i = 0; i <= numberOfBeamPoints; i++) {
            if (i == numberOfBeamPoints) {
                // The last beam needs to go directly to the target
                this.targetBeams.draw.lineTo(endingPosition.x, endingPosition.y);
            } else
            // If the beam number is even, the beam will go left
            if (i % 2 == 0) {
                const randomAngleOffset = 40 - Math.floor(Math.random() * 10);
                const angleToFace = (angleToTarget - randomAngleOffset + 360) % 360;

                const positionToFace = {
                    x: lastBeamPosition.x + Math.sin(angleToFace * Math.PI / 180) * (distanceToTarget / numberOfBeamPoints * 1.25),
                    y: lastBeamPosition.y - Math.cos(angleToFace * Math.PI / 180) * (distanceToTarget / numberOfBeamPoints * 1.25)
                }
                this.targetBeams.draw.lineTo(positionToFace.x, positionToFace.y);

                lastBeamPosition = positionToFace;
            } else {
                // If the beam number is odd, the beam will go right
                const randomAngleOffset = 40 - Math.floor(Math.random() * 10);
                const angleToFace = (angleToTarget + randomAngleOffset + 360) % 360;

                const positionToFace = {
                    x: lastBeamPosition.x + Math.sin(angleToFace * Math.PI / 180) * (distanceToTarget / numberOfBeamPoints * 1.25),
                    y: lastBeamPosition.y - Math.cos(angleToFace * Math.PI / 180) * (distanceToTarget / numberOfBeamPoints * 1.25)
                }
                this.targetBeams.draw.lineTo(positionToFace.x, positionToFace.y);

                lastBeamPosition = positionToFace;
            }
        }

        this.targetBeams.draw.stroke({ width: 3, color: 0xFFFFFF });
    }

    update(dt, tick) {
        if (tick) {
            this.updateSpinningAnimation(dt, tick);
            this.updateFiringAnimation(dt, tick);
        }
        super.update(dt, tick);
    }

    updateSpinningAnimation(dt, tick) {
        if (Game.renderer.replicator.getMsSinceTick(this.lastFiringTick) > 1000) {
            this.currentRotationSpeed = Math.max(0, this.currentRotationSpeed - 15 * dt / 1000);
        } else {
            this.currentRotationSpeed = Math.min(this.currentRotationSpeed + 36 * dt / 1000, 720 * dt / 1000);
        }

        if (this.currentRotationSpeed > 0) {
            this.currentRotation += this.currentRotationSpeed;
            this.currentRotation %= 360;
            this.coil.setRotation(this.currentRotation);
        }
    }

    clearLightning(res) {
        this.hasFired = false;
        this.targetBeams.draw.clear();
        this.branchTextures.forEach(e => {
            this.targetBeams.removeAttachment(e);
        });
        this.branchTextures = [];
    }

    updateFiringAnimation(dt, tick) {
        if (tick.firingTick == 0) return;

        const msSinceFiring = Game.renderer.replicator.getMsSinceTick(tick.firingTick);

        // If the ticks aren't the same, then there's been a new attack
        if (tick.firingTick !== this.lastFiringTick) {
            // Clear the previous beams off the screen
            this.clearLightning();

            const towerPosition = this.parent.targetTick.position;
            // Make sure the beams are visible
            this.targetBeams.setAlpha(1);
            this.hasFired = true;

            // Initialise first strike at the origin
            let previousBeamDestination = { x: 0, y: 0 };

            // Offset the original strike to be within the blue part of the texture in the direction of the target
            const directionToTarget = Util.angleTo(towerPosition, { x: tick.targetBeams[0], y: tick.targetBeams[1] });
            previousBeamDestination.x += Math.sin(directionToTarget * Math.PI / 180) * (Math.floor(Math.random() * 8) + 22);
            previousBeamDestination.y -= Math.cos(directionToTarget * Math.PI / 180) * (Math.floor(Math.random() * 8) + 22);

            // Offset the starting beam to be relative to the world instead of the tower
            previousBeamDestination.x += towerPosition.x;
            previousBeamDestination.y += towerPosition.y;

            for (let i = 0; i < tick.targetBeams.length; i += 2) {
                const nextBeamDestination = {
                    x: tick.targetBeams[i],
                    y: tick.targetBeams[i + 1]
                }

                this.createLightningTexture(previousBeamDestination, nextBeamDestination);

                previousBeamDestination = nextBeamDestination;
            }

            this.lastFiringTick = tick.firingTick;
        } else {
            if (this.hasFired == true) {
                // The tower has not had a new attack and is not going to clear the beams yet
                // in this case we want to decrease the alpha relative to the time
                // left in the beam
                const alpha = Math.min(1, Math.max(0, msSinceFiring / 50));
                this.targetBeams.setAlpha(1 - alpha);
            }
        }

        if (msSinceFiring >= 100 && this.hasFired == true) {
            this.clearLightning();
        }
    }

    updateModel(tier = 1) {
        if (tier == this.currentTier) return;
        this.currentTier = tier;
        this.removeAttachment(this.base);
        this.removeAttachment(this.coil);
        if ([1, 2, 3, 4, 5, 6, 7, 8].includes(tier)) {
                this.base = new SpriteEntity(`./asset/images/Entity/${this.type}/${this.type}Tier${tier}Base.svg`);
                this.coil = new SpriteEntity(`./asset/images/Entity/${this.type}/${this.type}Tier${tier}Coil.svg`);
        } else throw new Error(`Unknown tier encountered for ${this.type} tower: ${tier}`);
        this.addAttachment(this.base, 2);
        this.addAttachment(this.coil, 3);

        this.coil.setRotation(this.currentRotation);
    }
}

export { LightningTower };