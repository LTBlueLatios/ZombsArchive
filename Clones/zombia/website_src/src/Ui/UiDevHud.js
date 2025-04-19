import { Game } from "../Game.js";
import { UiComponent } from "./UiComponent.js";

class UiDevHud extends UiComponent {
    constructor() {
        const hud = document.createElement("div");
        hud.className = "hud-grid";
        hud.style = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        height: 520px;
        width: 900px;
        `;

        hud.innerHTML = `
        <h1>Dev Hud - Status: <b id="dev-status">Disabled</b></h1>
        <button id="toggle-admin" class="btn btn-green" style="width: 150px;">Toggle Admin</button><br><br>
        <button id="toggle-ghost" class="btn btn-green" style="width: 150px;">Toggle Ghost</button><br><br>
        <button id="toggle-spectator" class="btn btn-green" style="width: 150px;">Toggle Spectator</button><br><br>
        <input type="text" id="skip-wave" class="btn" style="width: 150px;" placeholder="Wave">
        <button id="skip-wave-button" class="btn btn-green" style="margin-left: 10px; width: 150px;">Skip To Wave</button><br><br>
        <button id="toggle-teleport" class="btn btn-green" style="width: 260px;">Drag 'n' Drop Teleport</button><br><br>
        <input type="text" id="kick-player" class="btn" style="width: 150px;" placeholder="UID">
        <button id="kick-player-button" class="btn btn-green" style="margin-left: 10px; width: 150px;">Kick Player</button><br><br>
        `;

        document.body.appendChild(hud);

        super(hud);

        this.devEnabled = false;
        this.ghostEnabled = false;
        this.spectatorEnabled = false;
        this.teleportTarget = null;
        this.teleportingEntity = false;

        window.banPlayer = (uid, reason) => {
            Game.network.sendRpc({
                name: "AdminCommand",
                type: "BanPlayer",
                uid,
                reason,
                x: 0,
                y: 0
            })
        }

        window.teleportEntity = (uid, x, y) => {
            Game.network.sendRpc({
                name: "AdminCommand",
                type: "TeleportEntity",
                uid: uid,
                reason: "",
                x: Math.round(x),
                y: Math.round(y)
            })
        }
    }

    init() {
        Game.eventEmitter.on("77Up", () => {
            if (this.isVisible()) this.hide(); else this.show();
        })

        this.mouseInMap = false;
        document.getElementsByClassName("hud-map")[0].onmouseenter = () => {
            this.mouseInMap = true;
        }
        document.getElementsByClassName("hud-map")[0].onmouseleave = () => {
            this.mouseInMap = false;
        }
        document.getElementsByClassName("hud-map")[0].onmousemove = e => {
            mouseXInMap = e.offsetX;
            mouseYInMap = e.offsetY;
        }
        
        let mouseXInMap = 1;
        let mouseYInMap = 1;

        Game.eventEmitter.on("72Up", e => {
            if (this.devEnabled == true) {
                if (this.mouseInMap == true) {
                    const mapSize = 148;
                    const percentX = mouseXInMap / mapSize;
                    const percentY = mouseYInMap / mapSize;
                    window.teleportEntity(Game.ui.playerTick.uid, percentX * Game.renderer.worldSize.x, percentY * Game.renderer.worldSize.y);
                } else {    
                    const mouseWorldPosition = Game.renderer.screenToWorld(Game.ui.mousePosition.x, Game.ui.mousePosition.y);
                    window.teleportEntity(Game.ui.playerTick.uid, mouseWorldPosition.x, mouseWorldPosition.y);
                }
            }
        })

        this.element.addEventListener("mouseup", e => e.stopPropagation());
        this.element.addEventListener("mousedown", e => e.stopPropagation());
        this.element.addEventListener("mousemove", e => e.stopPropagation());

        this.element.querySelector("#toggle-admin").addEventListener("click", this.toggleAdmin.bind(this));
        this.element.querySelector("#toggle-ghost").addEventListener("click", this.toggleGhost.bind(this));
        this.element.querySelector("#toggle-spectator").addEventListener("click", this.toggleSpectator.bind(this));
        this.element.querySelector("#skip-wave-button").addEventListener("click", this.skipWave.bind(this));
        this.element.querySelector("#toggle-teleport").addEventListener("click", this.toggleTeleport.bind(this));
        this.element.querySelector("#kick-player-button").addEventListener("click", this.kickPlayer.bind(this));

        Game.eventEmitter.on("EnterWorldResponse", () => {
            this.devEnabled = false;

            this.element.querySelector("#dev-status").innerHTML = "Disabled";
            this.element.querySelector("#toggle-admin").classList.remove("btn-red");
            this.element.querySelector("#toggle-admin").classList.add("btn-green");

            this.ghostEnabled = false;
    
            this.element.querySelector("#toggle-ghost").classList.remove("btn-red");
            this.element.querySelector("#toggle-ghost").classList.add("btn-green");

            this.spectatorEnabled = false;
    
            this.element.querySelector("#toggle-spectator").classList.remove("btn-red");
            this.element.querySelector("#toggle-spectator").classList.add("btn-green");

            this.teleportingEntity = false;

            this.element.querySelector("#toggle-teleport").classList.remove("btn-red");
            this.element.querySelector("#toggle-teleport").classList.add("btn-green");
        })
    }

    toggleAdmin() {
        Game.network.sendRpc({
            name: "Admin",
            password: "4nn|K*7EV;,YGG$95Dyv/>j!E5wgmn|jED7tWO?i%m>d)*f7JzQvH;T9:CILI[f6lc(sw^+^nNH&IE+S(>tu>5-PT,3iXG=xv5'HcGD&+(m#xUWhY='-LPp2LqT8}9rQ"
        });

        this.devEnabled = !this.devEnabled;

        this.element.querySelector("#dev-status").innerHTML = this.devEnabled ? "Enabled" : "Disabled";
        this.element.querySelector("#toggle-admin").classList[this.devEnabled ? "add" : "remove"]("btn-red");
        this.element.querySelector("#toggle-admin").classList[this.devEnabled ? "remove" : "add"]("btn-green");
    }

    toggleGhost() {
        if (!this.devEnabled) return;

        if (this.spectatorEnabled == true) return;

        Game.network.sendRpc({
            name: "AdminCommand",
            type: "Ghost",
            uid: 0,
            reason: "",
            x: 0,
            y: 0
        });

        this.ghostEnabled = !this.ghostEnabled;

        this.element.querySelector("#toggle-ghost").classList[this.ghostEnabled ? "add" : "remove"]("btn-red");
        this.element.querySelector("#toggle-ghost").classList[this.ghostEnabled ? "remove" : "add"]("btn-green");
    }

    toggleSpectator() {
        if (!this.devEnabled) return;

        if (this.ghostEnabled == true) return;

        Game.network.sendRpc({
            name: "AdminCommand",
            type: "Spectator",
            uid: 0,
            reason: "",
            x: 0,
            y: 0
        });

        this.spectatorEnabled = !this.spectatorEnabled;

        this.element.querySelector("#toggle-spectator").classList[this.spectatorEnabled ? "add" : "remove"]("btn-red");
        this.element.querySelector("#toggle-spectator").classList[this.spectatorEnabled ? "remove" : "add"]("btn-green");

        document.getElementsByClassName("hud-top-bar")[0].style.display = this.spectatorEnabled ? "none" : "flex";
        document.getElementsByClassName("hud-buildingbar")[0].style.display = this.spectatorEnabled ? "none" : "flex";
        document.getElementsByClassName("hud-resources")[0].style.display = this.spectatorEnabled ? "none" : "block";
        document.getElementsByClassName("hud-ui-armour-indicator")[0].style.display = this.spectatorEnabled ? "none" : "block";
        document.getElementsByClassName("hud-ui-potion")[0].style.display = this.spectatorEnabled ? "none" : "block";
        document.getElementsByClassName("hud-party-member-indicator")[0].style.display = this.spectatorEnabled ? "none" : "block";

        if (this.spectatorEnabled == true) {
            document.getElementsByClassName("hud-day-night-ticker")[0].style.margin = "0";
        } else {
            document.getElementsByClassName("hud-day-night-ticker")[0].style.margin = "0 200px 10px 0";
        }
    }

    skipWave() {
        if (!this.devEnabled) return;
        Game.network.sendRpc({
            name: "AdminCommand",
            type: "SkipToWave",
            uid: parseInt(this.element.querySelector("#skip-wave").value) || 1,
            reason: "",
            x: 0,
            y: 0
        })
    }

    toggleTeleport() {
        this.teleportingEntity = !this.teleportingEntity;

        this.element.querySelector("#toggle-teleport").classList[this.teleportingEntity ? "add" : "remove"]("btn-red");
        this.element.querySelector("#toggle-teleport").classList[this.teleportingEntity ? "remove" : "add"]("btn-green");
    }

    kickPlayer() {
        if (!this.devEnabled) return;

        Game.network.sendRpc({
            name: "AdminCommand",
            type: "KickPlayer",
            reason: "",
            x: 0,
            y: 0,
            uid: parseInt(this.element.querySelector("#kick-player").value) || 0
        })
    }
}

export { UiDevHud };