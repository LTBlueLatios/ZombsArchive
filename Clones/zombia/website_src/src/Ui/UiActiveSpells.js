import { UiComponent } from "./UiComponent.js";
import { Game } from "../Game.js";

class UiActiveSpells extends UiComponent {
    constructor() {
        const activeSpellsDiv = document.createElement("div");
        activeSpellsDiv.className = "hud-active-spells";
        super(activeSpellsDiv);

        this.activeSpells = {};

        document.getElementById("hud").appendChild(activeSpellsDiv);
    }

    init() {
        Game.eventEmitter.on("CastSpellResponseRpcReceived", this.createActiveSpellIcon.bind(this));
        Game.eventEmitter.on("ClearActiveSpellRpcReceived", response => {
            this.clearActiveSpell(response.name, true);
        });
    }

    createActiveSpellIcon(data) {
        const activeSpellIcon = document.createElement("img");
        activeSpellIcon.className = "hud-active-spell";
        activeSpellIcon.setAttribute("spell-type", data.name);
        this.element.appendChild(activeSpellIcon);

        activeSpellIcon.src = `./asset/images/Ui/Icons/Spells/${data.name}.svg`;

        activeSpellIcon.addEventListener("mouseenter", () => {
            Game.ui.components["uiBuildingBar"].buildingTooltip.moveTo(activeSpellIcon);
        });

        activeSpellIcon.addEventListener("mouseleave", () => {
            Game.ui.components["uiBuildingBar"].buildingTooltip.hide();
        });

        const id = this.generateIconId(data.name);
        this.activeSpells[id] = activeSpellIcon;

        setTimeout(() => {
            this.clearActiveSpell(id);
        }, data.iconCooldown);
    }

    generateIconId(type) {
        const randomNumber = Math.floor(Math.random() * 10000);
        const id = `${randomNumber}-${type}`;

        if (this.activeSpells[id] !== undefined) return this.generateIconId(type);

        return id;
    }

    clearActiveSpell(id, shouldRemoveAll) {
        if (id.includes(Game.ui.components["uiBuildingBar"].buildingTooltip.element.innerText)) Game.ui.components["uiBuildingBar"].buildingTooltip.hide();
        if (shouldRemoveAll == true) {
            for (let i in this.activeSpells) {
                if (i.includes(id)) this.activeSpells[i].remove();
            }
        } else {
            this.activeSpells[id].remove();
        }
    }
}

export { UiActiveSpells };