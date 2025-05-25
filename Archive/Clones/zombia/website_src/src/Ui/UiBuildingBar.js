import { Game } from "../Game.js";

import { UiComponent } from "./UiComponent.js";
import { UiBuildingButton } from "./UiBuildingButton.js";
import { UiWallSelector } from "./UiWallSelector.js";
import { UiTooltip } from "./UiTooltip.js";

class UiBuildingBar extends UiComponent {
    constructor() {
        let buildingBarDiv = document.createElement("div");
        buildingBarDiv.className = "hud-buildingbar";
        buildingBarDiv.id = "hud-buildingbar";
        document.getElementById("hud-bottom").appendChild(buildingBarDiv);

        super(buildingBarDiv);

        this.buildingButtons = [];

        this.buildingTooltip = new UiTooltip("top");

        this.wallSelector = new UiWallSelector();
        this.element.appendChild(this.wallSelector.element);

        this.element.addEventListener("mouseenter", () => {
            window.storage.setItem("walkthrough_BuildingBar", "true");
            Game.ui.components.uiWalkthrough.hideBuildingBarIndicator();
        })

        this.element.addEventListener("mousedown", e => {
            e.stopPropagation();
        })
    }

    init() {
        this.wallSelector.init();
        this.buildingTooltip.init();

        Game.eventEmitter.on("BuildingDataReceived", this.onDataReceived.bind(this));
    }

    updateBuildingButtons(tick) {
        if (tick.warmingUp == undefined) return;

        if (tick.warmingUp == true) {
            for (let i = 0; i < this.buildingButtons.length; i++) {
                this.buildingButtons[i].element.classList.add("warming-up");
            }
        } else {
            for (let i = 0; i < this.buildingButtons.length; i++) {
                this.buildingButtons[i].element.classList.remove("warming-up");
            }
        }

        this.wallSelector.updateBuildingButtons(tick);
    }

    unlock() {
        this.element.classList.remove("locked");
    }

    lock() {
        this.element.classList.add("locked");
    }

    onDataReceived() {
        const data = Game.ui.buildingData;
        for (let i = 0; i < this.buildingButtons.length; i++) {
            this.buildingButtons[i].destroy();
            this.buildingButtons[i].element.remove();
            this.buildingButtons.shift();
            i--;
        }
        for (const i in data) {
            if (["Wall", "LargeWall", "Door", "SpikeTrap"].includes(data[i].name)) continue;

            let buildingButton = new UiBuildingButton(data[i].name);

            this.element.appendChild(buildingButton.element);
            this.buildingButtons.push(buildingButton);
            buildingButton.init();
        }
    }
}

export { UiBuildingBar };