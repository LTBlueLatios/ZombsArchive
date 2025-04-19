import { Game } from "../Game.js";
import { UiComponent } from "./UiComponent.js";

class UiArmourIndicator extends UiComponent {
    constructor() {
        const indicatorDiv = document.createElement("div");
        indicatorDiv.className = "hud-ui-armour-indicator";
        indicatorDiv.setAttribute("item-type", "ZombieShield");
        document.getElementById("hud-bottom").appendChild(indicatorDiv);
        super(indicatorDiv);

        this.element.addEventListener("mousedown", event => {
            event.stopPropagation();
        });

        this.element.addEventListener("mouseenter", () => {
            Game.ui.components["uiBuildingBar"].buildingTooltip.moveTo(this.element);
        });

        this.element.addEventListener("mouseleave", () => {
            Game.ui.components["uiBuildingBar"].buildingTooltip.hide();
        });

        this.tier = 0;
    }

    init() {
        Game.eventEmitter.on("SetToolRpcReceived", response => {
            for (let res of response) {
                if (res.toolName == "ZombieShield") {
                    if (res.toolTier > 0) this.show();
                    else this.hide();
                    this.tier = res.toolTier;
                }
            }
        });
        Game.eventEmitter.on("EnterWorldResponse", this.hide.bind(this));
    }
}

export { UiArmourIndicator };