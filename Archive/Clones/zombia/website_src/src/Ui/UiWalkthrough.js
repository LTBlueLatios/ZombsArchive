import { Game } from "../Game";
import { UiComponent } from "./UiComponent";

class UiWalkthrough extends UiComponent {
    constructor() {
        const walkthroughElem = document.createElement("div");
        walkthroughElem.className = "hud-ui-walkthrough";
        document.getElementById("hud").appendChild(walkthroughElem);

        super(walkthroughElem);

        // Set default values for walkthrough
        if (window.storage.getItem("walkthrough_BuildingBar") == undefined) window.storage.setItem("walkthrough_BuildingBar", "false");

        this.buildingBarIndicator = document.createElement("div");
        this.buildingBarIndicator.className = "hud-ui-walkthrough building-bar";
        this.buildingBarIndicator.innerHTML = "<h3>Hover to reveal buildings</h3>";
        this.element.appendChild(this.buildingBarIndicator);
    }

    init() {
        Game.eventEmitter.on("EnterWorldResponse", this.onEnterWorldResponse.bind(this));
    }

    onEnterWorldResponse(data) {
        if (window.storage.getItem("walkthrough_BuildingBar") == "false" && window.storage.getItem("settings-building-bar") == "false") {
            this.showBuildingBarIndicator();
        }
    }

    showBuildingBarIndicator() {
        this.buildingBarIndicator.style.display = "block";
    }

    hideBuildingBarIndicator() {
        this.buildingBarIndicator.style.display = "none";
    }
}

export { UiWalkthrough };