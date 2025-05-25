import { Game } from "../Game.js";
import { UiComponent } from "./UiComponent.js";

class UiPipOverlay extends UiComponent {
    constructor() {
        const pipDiv = document.createElement("div");
        pipDiv.className = pipDiv.id = "hud-pip-overlay";
        document.getElementById("hud").appendChild(pipDiv);

        super(pipDiv);

        this.resourceGainElems = {};
        this.lastPlayerTick = { wood: 0, stone: 0, gold: 0, tokens: 0 };
    }

    init() {
        Game.eventEmitter.on("PlayerTickUpdated", this.onPlayerTickUpdated.bind(this));
    }

    onPlayerTickUpdated() {
        const tick = Game.ui.getPlayerTick();
        const lastTick = Game.ui.getLastPlayerTick();

        if (!(tick && lastTick)) return;

        // If the game is left in the background, this number will increase
        // If the game keeps making popups when the game is in the background, it will cause extreme lag when switched back
        if (Game.renderer.replicator.getMsSinceTick(Game.renderer.replicator.currentTick.tick) > 500) return;

        for (let i = 0; i < tick.lastPlayerDamages.length; i += 3) {
            this.showDamage(tick.lastPlayerDamages[i], tick.lastPlayerDamages[i + 1], tick.lastPlayerDamages[i + 2]);
        }

        const resourcesToBeDisplayed = ["gold", "wood", "stone", "tokens"];

        for (let resource of resourcesToBeDisplayed) {
            if (resource == "gold" && tick[resource] > lastTick[resource]) continue;
            if (tick[resource] == lastTick[resource]) continue;

            const delta = tick[resource] - lastTick[resource];
            this.showResourceGain(tick.uid, resource, delta);
        }
    }

    showDamage(x, y, value) {
        const damageElem = document.createElement("div");
        damageElem.className = "hud-pip-damage";
        damageElem.innerHTML = value.toLocaleString();

        const screenPos = Game.renderer.worldToScreen(x, y);
        this.element.appendChild(damageElem);
        damageElem.style.left = (screenPos.x - damageElem.offsetWidth / 2) + 'px';
        damageElem.style.top = (screenPos.y - damageElem.offsetHeight - 10) + 'px';

        setTimeout(() => {
            damageElem.remove();
        }, 500);
    }

    showResourceGain(uid, resourceName, value) {
        if (Math.abs(value) < 0.5) return;

        value = Math.round(value);

        const resourceGainElemId = Math.round(Math.random() * 10000);
        const resourceGainElem = document.createElement("div");
        resourceGainElem.className = "hud-pip-resource-gain";
        resourceGainElem.innerText = `${(value > 0 ? "+" + value.toLocaleString() : value.toLocaleString())} ${resourceName}`;

        const networkEntity = Game.renderer.world.entities[uid];
        if (!networkEntity) return;

        this.element.appendChild(resourceGainElem);
        const screenPos = Game.renderer.worldToScreen(networkEntity.getPositionX(), networkEntity.getPositionY());
        resourceGainElem.style.left = (screenPos.x - resourceGainElem.offsetWidth / 2) + "px";
        resourceGainElem.style.top = (screenPos.y - resourceGainElem.offsetHeight - 70 + Object.keys(this.resourceGainElems).length * 16) + "px";
        this.resourceGainElems[resourceGainElemId] = resourceGainElem;

        setTimeout(() => {
            resourceGainElem.remove();
        }, 500);

        setTimeout(() => {
            delete this.resourceGainElems[resourceGainElemId];
        }, 250);
    }
}

export { UiPipOverlay };