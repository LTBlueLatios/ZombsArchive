import { Game } from "../Game.js";
import { UiMenuGrid } from "./UiMenuGrid.js";

class UiMenuGridSettings extends UiMenuGrid {
    constructor() {
        super("Settings");

        Game.ui.components.uiMenuGridSettings = this;

        this.element.innerHTML = `
        <div class="hud-grid-exit"></div>
        <div class="hud-grid-settings-controls">
            <h1 style="margin: 0;">Controls</h1>
            <span style="font-size: 24px;">Buildings</span><br>
            <span>Move your mouse to the bottom of the screen to reveal the buildings</span><br><br>
            <span style="font-size: 24px;">Hotkeys</span><br>
            <span>
            Scroll your mouse wheel to zoom in/out<br>
            [Enter] - Toggle the chat<br>
            [T] - Sell selected building - Hold [Shift] to sell all of the same type and tier<br>
            [E] - Upgrade selected building - Hold [Shift] to upgrade all of the same type and tier<br>
            [F8] - Toggle debugging statistics<br>
            [B] - Toggle the shop menu<br>
            [P] - Toggle the party menu<br>
            [0-9] - Selects a building from the building bar<br>
            [G] - Lock/Unlock inputs
            </span>
        </div>
        <div class="hud-grid-settings-divider"></div>
        <div class="hud-grid-settings-options" style="display:flex;flex-direction: column; padding-left: 5px;">
            <h1 style="margin: 0;">Settings</h1>
            <input type="checkbox" class="hud-settings-day-night-opacity dark" id="hud-settings-day-night-opacity">
            <label style="word-wrap:break-word" for="hud-settings-day-night-opacity">Disable night's screen darkening</label>
            <input type="checkbox" class="hud-settings-language-filter dark" id="hud-settings-language-filter">
            <label style="word-wrap:break-word" for="hud-settings-language-filter">Enable language filter</label>
            <input type="checkbox" class="hud-settings-building-bar dark" id="hud-settings-building-bar">
            <label style="word-wrap:break-word" for="hud-settings-building-bar">Keep building bar visible</label>
            <input type="checkbox" class="hud-settings-special-effects dark" id="hud-settings-special-effects">
            <label style="word-wrap:break-word" for="hud-settings-special-effects">Disable special effects</label>
            <input type="checkbox" class="hud-settings-delete-chat dark" id="hud-settings-delete-chat">
            <label style="word-wrap:break-word" for="hud-settings-delete-chat">Delete old chat messages</label>
        </div>
        <div class="hud-grid-settings-socials">
            <p><a target="_blank" href="https://discord.gg/4cxREnV4WE">Discord Server</a></p>
            <p>Programmed by <a target="_blank" href="https://www.youtube.com/channel/UCrVyJ-ivzuBDETc7y0MZf9A"><b>Apex</b></a></p>
            <p>Designed by <a target="_blank" href="https://www.youtube.com/c/XperienceYT"><b>Xperience</b></a></p>
        </div>
        `;

        this.element.querySelector(".hud-settings-language-filter").addEventListener("change", () => {
            window.storage.setItem("settings-language-filter", this.element.querySelector(".hud-settings-language-filter").checked);
            Game.network.languageFilterEnabled = this.element.querySelector(".hud-settings-language-filter").checked;
        })

        this.element.querySelector(".hud-settings-building-bar").addEventListener("change", () => {
            let checked = this.element.querySelector(".hud-settings-building-bar").checked;
            window.storage.setItem("settings-building-bar", checked);
            Game.ui.components.uiBuildingBar.element.classList[checked ? "add" : "remove"]("remain-visible");

            if (checked == false && window.storage.getItem("walkthrough_BuildingBar") == "false") Game.ui.components.uiWalkthrough.showBuildingBarIndicator();
            else if (checked == true) Game.ui.components.uiWalkthrough.hideBuildingBarIndicator();
        })

        this.element.querySelector(".hud-settings-special-effects").addEventListener("change", () => {
            window.storage.setItem("settings-special-effects", this.element.querySelector(".hud-settings-special-effects").checked);
            Game.settings.specialEffectsDisabled = this.element.querySelector(".hud-settings-special-effects").checked;
        })

        this.element.querySelector(".hud-settings-delete-chat").addEventListener("change", () => {
            const checked = this.element.querySelector(".hud-settings-delete-chat").checked;
            window.storage.setItem("settings-delete-chat", checked);

            if (checked == true) {
                while (document.getElementsByClassName("hud-chat-message").length > 100) {
                    document.getElementsByClassName("hud-chat-message")[0].remove();
                }
            }
        })

        // Default values
        if (window.storage.getItem("settings-language-filter") == null) window.storage.setItem("settings-language-filter", "true");
        this.element.querySelector(".hud-settings-language-filter").checked = window.storage.getItem("settings-language-filter") === "true";

        if (window.storage.getItem("settings-building-bar") == null) window.storage.setItem("settings-building-bar", "true");
        this.element.querySelector(".hud-settings-building-bar").checked = window.storage.getItem("settings-building-bar") === "true";

        this.element.querySelector(".hud-settings-special-effects").checked = window.storage.getItem("settings-special-effects") === "true";

        this.element.querySelector(".hud-settings-delete-chat").checked = window.storage.getItem("settings-delete-chat") === "true";

        Game.network.languageFilterEnabled = this.element.querySelector(".hud-settings-language-filter").checked;
        Game.settings.specialEffectsDisabled = this.element.querySelector(".hud-settings-special-effects").checked;
        Game.settings.deleteOldChat = this.element.querySelector(".hud-settings-delete-chat").checked;

        Game.ui.components.uiBuildingBar.element.classList[this.element.querySelector(".hud-settings-building-bar").checked ? "add" : "remove"]("remain-visible");
    }
}

export { UiMenuGridSettings };