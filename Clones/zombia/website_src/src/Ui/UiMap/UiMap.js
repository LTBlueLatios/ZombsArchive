import { UiComponent } from "../UiComponent.js";
import { Game } from "../../Game.js";

class UiMap extends UiComponent {
    constructor() {
        const mapDiv = document.createElement("div");
        mapDiv.className = "hud-map";
        document.getElementById("hud-bottom").appendChild(mapDiv);

        super(mapDiv);

        this.element.addEventListener("mousedown", this.onMouseDown.bind(this));
        this.element.addEventListener("mouseup", this.onMouseUp.bind(this));

        this.playerElems = {};
        this.buildingElems = {};
        this.hasInitialised = false;
    }

    init() {
        if (this.hasInitialised == true) return;
        this.hasInitialised = true;
        Game.eventEmitter.on("RendererUpdated", this.update.bind(this));
        Game.eventEmitter.on("PartyMembersUpdated", this.onPartyMembersUpdate.bind(this));
        Game.eventEmitter.on("BuildingsUpdated", this.onBuildingsUpdate.bind(this));
        Game.eventEmitter.on("EnterWorldResponse", this.onEnterWorld.bind(this));
    }

    onEnterWorld() {
        for (let i in this.buildingElems) this.buildingElems[i].remove(), delete this.buildingElems[i];
    }

    onMouseDown(event) {
        event.stopPropagation();
        event.preventDefault();
    }

    onMouseUp(event) {
        event.stopPropagation();
        event.preventDefault();
    }

    update() {
        for (const playerUid in this.playerElems) {
            const playerData = this.playerElems[playerUid];
            const networkEntity = Game.renderer.world.entities[playerUid];
            if (!networkEntity) {
                playerData.marker.style.display = "none";
                continue;
            }
            const xPos = networkEntity.getPositionX() / Game.renderer.worldSize.x * 100;
            const yPos = networkEntity.getPositionY() / Game.renderer.worldSize.y * 100;
            playerData.marker.setAttribute("data-index", playerData.index.toString());
            playerData.marker.style.display = "block";
            playerData.marker.style.left = xPos + "%";
            playerData.marker.style.top = yPos + "%";
        }
    }

    onPartyMembersUpdate(data) {
        const staleElems = {};
        for (const playerUid in this.playerElems) staleElems[playerUid] = true;
        for (const i in data) {
            const index = parseInt(i);
            const playerUid = Object.values(data)[i].uid;
            delete staleElems[playerUid];
            if (this.playerElems[playerUid]) this.playerElems[playerUid].index = index;
            else {
                const partyMemberElem = document.createElement("div");
                partyMemberElem.className = "hud-map-player";
                partyMemberElem.setAttribute("data-index", index);
                this.element.appendChild(partyMemberElem);
                this.playerElems[playerUid] = {
                    index: index,
                    marker: partyMemberElem
                }
            }
        }

        for (const playerUid in staleElems) {
            if (!this.playerElems[playerUid]) continue;
            this.playerElems[playerUid].marker.remove();
            delete this.playerElems[playerUid];
        }
    }

    onBuildingsUpdate(data) {
        const staleElems = {};
        for (const buildingIndex in data) {
            if (data[buildingIndex].dead === true) {
                staleElems[data[buildingIndex].uid] = true;
                continue;
            }

            if (this.buildingElems[data[buildingIndex].uid] === undefined) {
                const buildingElem = document.createElement("div");
                buildingElem.className = "hud-map-building";
                const xPos = data[buildingIndex].x / Game.renderer.worldSize.x * 100;
                const yPos = data[buildingIndex].y / Game.renderer.worldSize.y * 100;
                buildingElem.style.left = xPos + "%";
                buildingElem.style.top = yPos + "%";
                this.element.appendChild(buildingElem);
                this.buildingElems[data[buildingIndex].uid] = buildingElem;
            }
        }

        for (const buildingUid in staleElems) {
            if (!this.buildingElems[buildingUid]) continue;
            this.buildingElems[buildingUid].remove();
            delete this.buildingElems[buildingUid];
        }
    }
}

export { UiMap };