import { Game } from "../Game.js";
import { UiComponent } from "./UiComponent.js";
import { UiMenuGridShop } from "./UiMenuGridShop.js";
import { UiMenuGridSettings } from "./UiMenuGridSettings.js";
import { UiMenuGridSpells } from "./UiMenuGridSpells.js";
import { UiMenuGridParties } from "./UiMenuGridParties.js";

class UiMenuIcon extends UiComponent {
    constructor(type) {
        let menuIconDiv = document.createElement("div");
        menuIconDiv.className = "hud-icon";
        menuIconDiv.setAttribute("icon-type", type);
        super(menuIconDiv);

        this.type = type;
        this.visible = false;

        this.element.addEventListener("click", this.onClick.bind(this));
        this.element.addEventListener("mousedown", this.onMouseClick.bind(this));
        this.element.addEventListener("mouseup", this.onMouseClick.bind(this));

        let keyBind;
        switch (this.type) {
            case "Shop":
                this.menuGrid = new UiMenuGridShop();
                keyBind = 66;
                break;
            case "Settings":
                this.menuGrid = new UiMenuGridSettings();
                break;
            case "Spells":
                this.menuGrid = new UiMenuGridSpells();
                break;
            case "Parties":
                keyBind = 80;
                this.menuGrid = new UiMenuGridParties();
                break;
        }

        document.body.appendChild(this.menuGrid.element);

        this.menuGrid.element.querySelector(".hud-grid-exit").addEventListener("click", () => {
            this.hide();
        });

        if (keyBind !== undefined) Game.eventEmitter.on(`${keyBind}Up`, this.onClick.bind(this));
        Game.eventEmitter.on(`27Up`, this.hide.bind(this));
    }

    onClick(event) {
        if (Game.network.connected === true && Game.ui.playerTick?.health > 0) {
            for (let type in Game.ui.components["uiTopBar"].menuIcons) {
                if (type == this.type) {
                    if (this.visible) {
                        this.hide();
                    } else {
                        this.show();

                        Game.ui.components["uiPlacementOverlay"].cancelPlacing();
                        Game.ui.components["uiBuildingOverlay"].stopWatching()
                    }
                } else {
                    Game.ui.components["uiTopBar"].menuIcons[type].hide();
                }
            }
        }

        if (event) {
            event.stopPropagation();
            event.preventDefault();
        }
    }

    show() {
        this.visible = true;
        this.menuGrid.show();
    }

    hide() {
        this.visible = false;
        this.menuGrid.hide();
    }

    onMouseClick(event) {
        event.stopPropagation();
        event.preventDefault();
    }
}

export { UiMenuIcon };