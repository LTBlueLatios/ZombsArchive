import { Game } from "../Game.js";
import { UiComponent } from "./UiComponent.js";
import { UiBuildingButton } from "./UiBuildingButton.js";

class UiWallSelector extends UiComponent {
    constructor() {
        const buildingButton = document.createElement("div");
        buildingButton.className = "hud-buildingbar-multi-selector";

        super(buildingButton);

        this.wallsDiv = document.createElement("div");
        this.wallsDiv.className = "multi-selector-background";
        this.wallsDiv.style.display = "none";
        this.element.appendChild(this.wallsDiv);

        this.element.addEventListener("mouseenter", () => {
            this.element.style.cursor = "pointer";
            this.wallsDiv.style.display = "grid";

            clearTimeout(this.displayTimer);
        });

        this.element.addEventListener("mouseleave", () => {
            // Check if the player enabled the remain-visible setting
            // If they have not, set it temporarily so that the bar does not disappear when selecting a wall
            let settingEnabled = Game.ui.components.uiMenuGridSettings.element.querySelector(".hud-settings-building-bar").checked;

            if (settingEnabled == false) {
                Game.ui.components.uiBuildingBar.element.classList.add("remain-visible");
            }

            clearTimeout(this.displayTimer);

            this.displayTimer = setTimeout(() => {
                if (settingEnabled == false) {
                    Game.ui.components.uiBuildingBar.element.classList.remove("remain-visible");
                }

                this.wallsDiv.style.display = "none";
            }, 250);
        });

        this.wallButtons = [];

        this.displayTimer = null;
        this.tier = 1;
        this.currentIconIndex = -1;
        this.icons = ["Wall", "LargeWall", "Door", "SpikeTrap"];
        this.updateIcon(true);
    }

    init() {
        Game.eventEmitter.on("BuildingDataReceived", this.onDataReceived.bind(this));
        Game.eventEmitter.on("BuildingsUpdated", this.updateBuildingData.bind(this));
        Game.eventEmitter.on("PartyMembersUpdatedRpcReceived", this.updateBuildingData.bind(this));
    }

    updateBuildingButtons(tick) {
        if (tick.warmingUp == undefined) return;

        if (tick.warmingUp == true) {
            for (let i = 0; i < this.wallButtons.length; i++) {
                this.wallButtons[i].element.classList.add("warming-up");
            }
        } else {
            for (let i = 0; i < this.wallButtons.length; i++) {
                this.wallButtons[i].element.classList.remove("warming-up");
            }
        }
    }

    onDataReceived() {
        const data = Game.ui.buildingData;
        for (let i = 0; i < this.wallButtons.length; i++) {
            this.wallButtons[i].element.remove();
            this.wallButtons.shift();
            i--;
        }
        for (const i in data) {
            if (!["Wall", "LargeWall", "Door", "SpikeTrap"].includes(data[i].name)) continue;

            let buildingButton = new UiBuildingButton(data[i].name);

            this.wallsDiv.appendChild(buildingButton.element);
            this.wallButtons.push(buildingButton);
            buildingButton.init();
        }
    }

    updateBuildingData() {
        this.update(Game.ui.factory?.tier || 1);
    }

    update(tier = 1) {
        if (Game.ui.factory !== null) this.show();
        else this.hide();

        this.tier = tier;
        this.updateIcon(false);
    }

    updateIcon(shouldSwitchIcon = true) {
        if (shouldSwitchIcon == true) {
            this.currentIconIndex++;
            if (this.currentIconIndex >= this.icons.length - 1) {
                this.currentIconIndex = 0;
            }

            setTimeout(this.updateIcon.bind(this), 10000);
        }

        this.element.style["background-image"] = `url('./asset/images/Ui/Buildings/${this.icons[this.currentIconIndex]}/${this.icons[this.currentIconIndex]}Tier${this.tier}.svg')`;
    }
}

export { UiWallSelector };