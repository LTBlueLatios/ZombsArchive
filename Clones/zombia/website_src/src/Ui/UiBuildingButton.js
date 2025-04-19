import { Game } from "../Game.js";
import { UiComponent } from "./UiComponent.js";

class UiBuildingButton extends UiComponent {
    constructor(type) {
        const buildingButton = document.createElement("div");
        buildingButton.className = "hud-buildingbar-building";

        if (type !== "Factory") {
            if (Game.ui.buildingData[type].hotkey !== null) {
                buildingButton.innerHTML += `<span>${Game.ui.buildingData[type].hotkey}</span>`;
            }
        } else {
            buildingButton.classList.add("gold-stash");
        }

        super(buildingButton);

        this.type = type;
        this.element.setAttribute("BuildingType", type);

        this.element.addEventListener("mouseenter", () => {
            if (!["Wall", "LargeWall", "Door", "SpikeTrap"].includes(type)) Game.ui.components.uiBuildingBar.wallSelector.wallsDiv.style.display = "none";

            this.element.style.cursor = "pointer";
            Game.ui.components["uiBuildingBar"].buildingTooltip.moveTo(this.element);
        });

        this.element.addEventListener("mouseleave", () => {
            Game.ui.components["uiBuildingBar"].buildingTooltip.hide();
        });

        this.element.addEventListener("mouseup", this.onMouseUp.bind(this));

        this.tier = null;

        this.update();
    }

    init() {
        Game.eventEmitter.on("BuildingsUpdated", this.updateBuildingData.bind(this));
        if (Game.ui.buildingData[this.type].hotkey !== null) {
            Game.eventEmitter.on(`${Game.ui.buildingData[this.type].hotkey.toString().charCodeAt(0)}Up`, () => {
                this.onMouseUp();
            });
        }

        Game.eventEmitter.on("PartyMembersUpdatedRpcReceived", this.updateBuildingData.bind(this));
    }

    destroy() {
        Game.eventEmitter.removeListener("PartyMembersUpdatedRpcReceived", this.updateBuildingData.bind(this));
    }

    updateBuildingData() {
        this.update(Game.ui.factory?.tier || 1);
    }

    update(tier = 1) {
        if (this.type !== "Factory") {
            if (Game.ui.factory !== null) {
                const buildingData = Game.ui.buildingData[this.type];
                this.element.classList[buildingData.built >= buildingData.limit ? "add" : "remove"]("disabled");
                this.show();
                Game.ui.components["uiBuildingBar"].unlock();
            } else {
                this.hide();
                Game.ui.components["uiBuildingBar"].lock();
            }
        } else {
            if (Game.ui.factory !== null) this.hide();
            else this.show();
        }
        if (tier === this.tier) return;
        this.tier = tier;
        this.element.style["background-image"] = `url('./asset/images/Ui/Buildings/${this.type}/${this.type}Tier${tier}.svg')`;
    }

    onMouseUp(event) {
        for (let i in Game.ui.components.uiTopBar.menuIcons) {
            Game.ui.components.uiTopBar.menuIcons[i].hide();
        }

        if (Game.network.connected === true &&
            Game.ui.playerTick.health > 0 &&
            Game.ui.buildingData[this.type].built < Game.ui.buildingData[this.type].limit &&
            !this.element.classList.contains("warming-up")) {
            if ((Game.ui.factory == null && this.type == "Factory") || (Game.ui.factory !== null && this.type !== "Factory")) {
                Game.ui.components["uiPlacementOverlay"].startPlacing(this.type);
                Game.ui.components["uiBuildingBar"].buildingTooltip.hide();
            }
        }
    }
}

export { UiBuildingButton };