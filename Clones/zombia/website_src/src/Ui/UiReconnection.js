import { Game } from "../Game.js";
import { UiComponent } from "./UiComponent.js";

class UiReconnection extends UiComponent {
    constructor() {
        let reconnectionDiv = document.createElement("div");
        reconnectionDiv.className = "hud-reconnect";
        document.getElementById("hud").appendChild(reconnectionDiv);
        super(reconnectionDiv);
    }

    updateReconnectionText() {
        this.element.innerHTML = `
            <div class="hud-reconnect-wrapper">
                <div class="hud-reconnect-main">
                    <span class="hud-loading"></span>
                    <p>You've lost connection to the server.</p>
                    <small>Not your internet? Report to the <a target="_blank" href="https://discord.gg/4cxREnV4WE">Discord server</a>.</small>
                    <p style="position:absolute;bottom:0;left:50%;transform:translateX(-50%);">Server ID: ${Game.network.options.serverData.id}</p>
                </div>
            </div>
        `;
    }

    show() {
        if (!this.isVisible()) this.updateReconnectionText();
        super.show();
    }
}

export { UiReconnection };