import { Game } from "../Game.js";
import { UiComponent } from "./UiComponent.js";

class UiPotion extends UiComponent {
    constructor(potion) {
        const potionDiv = document.createElement("div");
        potionDiv.className = "hud-ui-potion";
        potionDiv.setAttribute("potion-type", potion.name);
        document.getElementById("hud-bottom").appendChild(potionDiv);
        super(potionDiv);

        this.potionName = potion.name;
        this.element.addEventListener("mouseup", this.onMouseUp.bind(this));
        this.element.addEventListener("mousedown", event => {
            event.stopPropagation();
        });

        this.element.addEventListener("mouseenter", () => {
            Game.ui.components["uiBuildingBar"].buildingTooltip.moveTo(this.element);
        });

        this.element.addEventListener("mouseleave", () => {
            Game.ui.components["uiBuildingBar"].buildingTooltip.hide();
        });
    }

    onMouseUp(event) {
        event.stopPropagation();

        switch (this.potionName) {
            case "HealthPotion":
                Game.network.sendRpc({
                    name: "BuyTool",
                    toolName: "HealthPotion"
                });
                break;
        }
    }
}

export { UiPotion };