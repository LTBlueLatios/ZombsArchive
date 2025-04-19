import { Game } from "../Game.js";
import { UiComponent } from "./UiComponent.js";

class UiResources extends UiComponent {
    constructor() {
        const resourcesDiv = document.createElement("div");
        resourcesDiv.className = "hud-resources";
        resourcesDiv.innerHTML = `
        <div class="hud-resources-resource hud-resources-wood" id="hud-resources-wood"></div>
        <div class="hud-resources-resource hud-resources-stone" id="hud-resources-stone"></div>
        <div class="hud-resources-resource hud-resources-gold" id="hud-resources-gold"></div>
        <div class="hud-resources-resource hud-resources-tokens" id="hud-resources-tokens"></div>`;
        document.getElementById("hud-bottom").appendChild(resourcesDiv);

        super(resourcesDiv);

        this.woodElem = document.getElementById("hud-resources-wood");
        this.stoneElem = document.getElementById("hud-resources-stone");
        this.goldElem = document.getElementById("hud-resources-gold");
        this.tokensElem = document.getElementById("hud-resources-tokens");
    }

    init() {
        const resources = ["wood", "stone", "gold", "tokens"];
        for (let resource of resources) {
            Game.eventEmitter.on(`${resource}CountUpdated`, () => {
                let resourceAmount = Math.round(Game.ui.getPlayerTick()[resource]);
                if (resourceAmount >= 10000) resourceAmount = abbreviateNumber(resourceAmount, 2);
                this[`${resource}Elem`].innerHTML = resourceAmount;
            });
        }
    }
}

export { UiResources };

const abbreviateNumber = (number, decPlaces) => {
    const units = ["K", "M", "B", "T", "q", "Q", "s", "S", "O", "N", "D"];
    decPlaces = Math.pow(10, decPlaces);

    for (let i = units.length - 1; i >= 0; i--) {
        const size = Math.pow(10, (i + 1) * 3);
        if (size <= number) {
            number = Math.round(number * decPlaces / size) / decPlaces;
            if ((number === 1000) && (i < units.length - 1)) {
                number = 1;
                i++;
            };
            number += units[i];
            break;
        }
    }
    return number;
}