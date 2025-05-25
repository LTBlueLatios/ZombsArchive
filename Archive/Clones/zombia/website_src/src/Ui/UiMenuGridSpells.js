import { Game } from "../Game.js";
import { UiMenuGrid } from "./UiMenuGrid.js";
import { UiSpellItem } from "./UiSpellItem.js";

class UiMenuGridSpells extends UiMenuGrid {
    constructor() {
        super("Spells");

        Game.ui.components.uiMenuGridSpells = this;

        this.element.innerHTML = `
        <div class="hud-grid-exit"></div>
        <h3>Spells</h3>
        <div id="hud-spells-grid" class="hud-spells-grid"></div>
        `;

        this.init();
    }

    init() {
        Game.eventEmitter.on("SpellInfoRpcReceived", this.onSpellDataReceived.bind(this));
    }

    onSpellDataReceived(data) {
        document.getElementById("hud-spells-grid").innerHTML = "";

        const spells = data.spellData;

        for (let i in spells) {
            const spell = spells[i];

            const spellDiv = new UiSpellItem(spell);
            document.getElementById("hud-spells-grid").appendChild(spellDiv.element);

            spellDiv.init?.();
        }
    }
}

export { UiMenuGridSpells };