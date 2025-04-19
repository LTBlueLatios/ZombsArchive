import { Game } from "../Game.js";
import { UiComponent } from "./UiComponent.js";

class UiTutorial extends UiComponent {
    constructor() {
        const elem = document.createElement("div");
        elem.className = "hud-tutorial";

        document.getElementById("hud").appendChild(elem);

        super(elem);

        this.tutorialSteps = [
            "PlaceFactory",
            "PlaceArrow",
            "PlaceDrill",
            "PlaceWalls",
            "Survive"
        ];

        this.tutorialMessages = {
            "PlaceFactory": "To start, find a good spot to place your Factory. You'll have to defend this Factory from waves of zombies.",
            "PlaceArrow": "Place an Arrow Tower to begin your defenses.",
            "PlaceDrill": "Place a Drill to start earning some gold. You'll need it later.",
            "PlaceWalls": "Place some walls to protect your towers.",
            "Survive": "You have completed the tutorial. Good luck, have fun!"
        };

        this.tutorialIndex = 0;
        this.tutorialRunning = false;
        this.currentStepPopupId = 0;

        document.getElementsByClassName("hud-settings-skip-tutorial")[0].addEventListener("change", () => {
            window.storage.setItem("settings-skip-tutorial", document.getElementsByClassName("hud-settings-skip-tutorial")[0].checked);
        })

        document.getElementsByClassName("hud-settings-skip-tutorial")[0].checked = window.storage.getItem("settings-skip-tutorial") === "true";
    }

    init() {
        Game.eventEmitter.on("EnterWorldResponse", this.onEnterWorld.bind(this));
        Game.eventEmitter.on("PartyBuildingRpcReceived", this.onPartyBuildingUpdate.bind(this));
    }

    stopTutorial() {
        this.tutorialRunning = false;
        Game.ui.components.uiPopupOverlay.removePopup(this.currentStepPopupId);
    }

    onEnterWorld(data) {
        Game.ui.components.uiPopupOverlay.removePopup(this.currentStepPopupId);

        if (document.getElementsByClassName("hud-settings-skip-tutorial")[0].checked == false) this.tutorialRunning = true;

        if (this.tutorialRunning == true) {
            this.currentStepPopupId = Game.ui.components.uiPopupOverlay.showTutorialMessage(this.tutorialMessages["PlaceFactory"]);
        }
    }

    markStepAsCompleted(shouldRemovePopup = true) {
        // If players complete the steps in the wrong order, we don't want the popups to show steps they've already completed
        if (shouldRemovePopup == true) Game.ui.components.uiPopupOverlay.removePopup(this.currentStepPopupId);

        this.tutorialIndex++;

        switch (this.tutorialSteps[this.tutorialIndex]) {
            case "PlaceFactory":
                if (Game.ui.getFactory() !== null) {
                    this.markStepAsCompleted(false);
                    return;
                }
                break;
            case "PlaceDrill":
                if (Game.network.options.serverData.gameMode == "scarcity" || Game.ui.buildingData.Drill.built >= 1) {
                    this.markStepAsCompleted(false);
                    return;
                }
                break;
            case "PlaceArrow":
                if (Game.ui.buildingData.ArrowTower.built >= 1) {
                    this.markStepAsCompleted(false);
                    return;
                }
                break;
            case "PlaceWalls":
                if (Game.ui.buildingData.Wall.built >= 5) {
                    this.markStepAsCompleted(false);
                    return;
                }
                break;
            case "Survive":
                window.storage.setItem("settings-skip-tutorial", "true");

                setTimeout(() => {
                    Game.ui.components.uiPopupOverlay.removePopup(this.currentStepPopupId);

                    this.tutorialRunning = false;
                }, 5000);
                break;
        }

        this.currentStepPopupId = Game.ui.components.uiPopupOverlay.showTutorialMessage(this.tutorialMessages[this.tutorialSteps[this.tutorialIndex]]);
    }

    onPartyBuildingUpdate(response) {
        if (this.tutorialRunning == false) return;

        for (let id in response) {
            const building = response[id];

            if (this.tutorialSteps[this.tutorialIndex] == "PlaceFactory") {
                if (building.type == "Factory") this.markStepAsCompleted();
            }

            if (this.tutorialSteps[this.tutorialIndex] == "PlaceArrow") {
                if (building.type == "ArrowTower") this.markStepAsCompleted();
            }

            if (this.tutorialSteps[this.tutorialIndex] == "PlaceDrill") {
                if (building.type == "Drill") this.markStepAsCompleted();
            }

            if (this.tutorialSteps[this.tutorialIndex] == "PlaceWalls") {
                // The step is completed after the player places 5, this code is run before .built is incremented
                if (Game.ui.buildingData.Wall.built >= 4) this.markStepAsCompleted();
            }
        }
    }
}

export { UiTutorial };