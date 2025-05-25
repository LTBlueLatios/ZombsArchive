import { UiComponent } from "../UiComponent.js";
import { Game } from "../../Game.js";

class UiRespawn extends UiComponent {
    constructor() {
        let respawnDiv = document.createElement("div");
        respawnDiv.className = "hud-respawn";

        respawnDiv.innerHTML = `
        <div class="hud-respawn-wrapper">
            <div class="hud-respawn-main">
                <div class="hud-respawn-info">
                    <div class="hud-respawn-text"></div>
                    <button type="submit" class="hud-respawn-btn">Respawn</button>
                    <div class="hud-respawn-share">
                        <a href="https://discord.gg/4cxREnV4WE" target="_blank" class="btn btn-discord"></a>
                    </div>
                </div>
            </div>
        </div>`;

        document.getElementById("hud").appendChild(respawnDiv);

        super(respawnDiv);

        this.respawnTextElem = this.element.querySelector(".hud-respawn-text");

        this.element.querySelector(".hud-respawn-btn").addEventListener("mouseup", () => {
            Game.network.sendRpc({
                name: "Respawn"
            })
        });
    }

    init() {
        Game.eventEmitter.on("DeadRpcReceived", this.onDead.bind(this));
        Game.eventEmitter.on("RespawnedRpcReceived", this.onRespawned.bind(this));
    }

    onDead(data) {
        this.show();

        switch (data.reason) {
            case "FactoryDied":
                let wave = parseInt(data.wave);
                let waveString = wave.toLocaleString();

                this.respawnTextElem.innerHTML = `<h2>Your base was destroyed!</h2><p>- Survived for ${waveString} wave${wave == 1 ? "" : "s"}</p><p>- Your score: ${parseInt(data.score).toLocaleString()}</p><p>- Your party's score: ${parseInt(data.partyScore).toLocaleString()}</p>`;
                break;
            case "KilledWithBase":
                this.respawnTextElem.innerHTML = `<h2>You died!</h2><p>- Died at wave ${parseInt(data.wave)?.toLocaleString()}</p><p>- Lost ${parseInt(data.score)?.toLocaleString()} score</p></h2>`;
                break;
            case "Killed":
                this.respawnTextElem.innerHTML = `<h2>You died!</h2>`;
                break;
        }

        Game.ui.components["uiMenuGridParties"].hide();
        Game.ui.components["uiMenuGridSettings"].hide();
        Game.ui.components["uiMenuGridShop"].hide();
        Game.ui.components["uiMenuGridSpells"].hide();
    }

    onRespawned() {
        this.hide();
    }
}

export { UiRespawn };