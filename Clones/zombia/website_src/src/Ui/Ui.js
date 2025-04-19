import { Game } from "../Game.js";
import { UiComponent } from "./UiComponent.js";

import { UiIntro } from "./UiIntro/UiIntro.js";
import { UiIntroLeaderboard } from "./UiIntro/UiIntroLeaderboard.js";
import { UiReconnection } from "./UiReconnection.js";
import { UiBuildingBar } from "./UiBuildingBar.js";
import { UiPlacementOverlay } from "./UiPlacementOverlay.js";
import { UiBuildingOverlay } from "./UiBuildingOverlay.js";
import { UiMap } from "./UiMap/UiMap.js";
import { UiChat } from "./UiChat.js";
import { UiTopBar } from "./UiTopBar.js";
import { UiResources } from "./UiResources.js";
import { UiPopupOverlay } from "./UiPopupOverlay.js";
import { UiPipOverlay } from "./UiPipOverlay.js";
import { UiRespawn } from "./UiRespawn/UiRespawn.js";
import { UiDayNightTicker } from "./UiDayNightTicker/UiDayNightTicker.js";
import { UiDayNightOverlay } from "./UiDayNightOverlay.js";
import { UiAnnouncementOverlay } from "./UiAnnouncementOverlay.js";
import { UiLeaderboard } from "./UiLeaderboard.js";
import { UiPartyMemberIndicator } from "./UiPartyMemberIndicator.js";
import { UiArmourIndicator } from "./UiArmourIndicator.js";
import { UiActiveSpells } from "./UiActiveSpells.js";
import { UiWalkthrough } from "./UiWalkthrough.js";
import { UiInputLock } from "./UiInputLock.js";
import { UiTutorial } from "./UiTutorial.js";
import { UiDevHud } from "./UiDevHud.js";

class Ui extends UiComponent {
    constructor() {
        super(document.getElementById("hud"));

        this.components = {};
        this.components["uiIntro"] = new UiIntro();
        this.components["uiIntroLeaderboard"] = new UiIntroLeaderboard;
        this.components["uiReconnection"] = new UiReconnection();
        this.components["uiMap"] = new UiMap();
        this.components["uiBuildingBar"] = new UiBuildingBar();
        this.components["uiChat"] = new UiChat();
        this.components["uiTopBar"] = new UiTopBar();
        this.components["uiResources"] = new UiResources();
        this.components["uiPlacementOverlay"] = new UiPlacementOverlay();
        this.components["uiBuildingOverlay"] = new UiBuildingOverlay();
        this.components["uiPopupOverlay"] = new UiPopupOverlay();
        this.components["uiPipOverlay"] = new UiPipOverlay();
        this.components["uiRespawn"] = new UiRespawn();
        this.components["uiDayNightTicker"] = new UiDayNightTicker();
        this.components["uiDayNightOverlay"] = new UiDayNightOverlay();
        this.components["uiAnnouncementOverlay"] = new UiAnnouncementOverlay();
        this.components["uiLeaderboard"] = new UiLeaderboard();
        this.components["uiPartyMemberIndicator"] = new UiPartyMemberIndicator();
        this.components["uiArmourIndicator"] = new UiArmourIndicator();
        this.components["uiActiveSpells"] = new UiActiveSpells();
        this.components["uiWalkthrough"] = new UiWalkthrough();
        this.components["uiInputLock"] = new UiInputLock();
        this.components["uiTutorial"] = new UiTutorial();
        if (process.env.NODE_ENV == "development") this.components["uiDevHud"] = new UiDevHud();

        this.hasInitialised = false;

        this.playerTick = null;
        this.lastPlayerTick = null;
        this.factory = null;
        this.buildings = {};
        this.buildingData = null;
        this.mousePosition = { x: 0, y: 0 };
        this.castingSpell = false;

        this.playerPartyMembers = [];
        this.playerPartyLeader = false;
        this.playerPartyCanSell = false;
        this.playerPartyCanPlace = false;
    }

    init() {
        if (!this.hasInitialised) {
            this.hasInitialised = true;
            for (let i in this.components) {
                if (this.components[i].init) {
                    this.components[i].init();
                }
            }

            Game.eventEmitter.on("SocketOpened", this.onSocketOpened.bind(this));
            Game.eventEmitter.on("SocketClosed", this.onSocketClosed.bind(this));
            Game.eventEmitter.on("EnterWorldResponse", this.onEnterWorld.bind(this));
            Game.eventEmitter.on("BuildingInfoRpcReceived", this.onBuildingDataReceived.bind(this));
            Game.eventEmitter.on("ToolInfoRpcReceived", this.onItemDataReceived.bind(this));
            Game.eventEmitter.on("PartyMembersUpdatedRpcReceived", this.onPartyInfoUpdate.bind(this));
    
            Game.eventEmitter.on("mouseMoved", this.onMouseMoved.bind(this));
            Game.eventEmitter.on("mouseUp", this.onMouseUp.bind(this));
            Game.eventEmitter.on("mouseDown", this.onMouseDown.bind(this));
            Game.eventEmitter.on("rightMouseUp", this.onRightMouseUp.bind(this));

            Game.eventEmitter.on("PartyBuildingRpcReceived", this.onPartyBuildingUpdate.bind(this));
    
            window.addEventListener("beforeunload", this.onBeforeUnload);
            window.addEventListener("keydown", e => {
                if (e.code == "Space" && e.target == document.body) e.preventDefault();
            })
        }
    }

    onEnterWorld() {
        this.factory = null;
        this.playerTick = null;
        this.buildings = {};
    }

    onBuildingDataReceived(data) {
        this.buildingData = data.buildingData;
        for (const buildingId in this.buildingData) {
            this.buildingData[buildingId].built = 0;
        }
        Game.eventEmitter.emit("BuildingDataReceived");
    }

    onItemDataReceived(data) {
        this.toolData = data.toolData;
        Game.eventEmitter.emit("ToolDataReceived");
    }

    onPartyInfoUpdate(data) {
        const partySize = data.length;
        const myUid = Game.renderer.world.getLocalPlayer();

        this.playerPartyMembers = data;
        this.playerPartyCanSell = data.find(member => member.uid === myUid).canSell === true;
        this.playerPartyCanPlace = data.find(member => member.uid === myUid).canPlace === true;

        Game.eventEmitter.emit("PartyMembersUpdated", data);

        for (const buildingId in this.buildingData) {
            const building = this.buildingData[buildingId];
            building.limit = building.limitPerMember * (building.limitStatic === false ? partySize : 1);
        }

        
        Game.eventEmitter.emit("BuildingDataUpdated");
    }

    onMouseMoved({ event }) {
        this.mousePosition = {
            x: event.clientX,
            y: event.clientY
        };
        this.components["uiPlacementOverlay"].update();
        if (this.components["uiPlacementOverlay"].isActive() && Game.network.inputPacketManager.mouseDown === true) this.components["uiPlacementOverlay"].placeBuilding();

        if (process.env.NODE_ENV == "development") {
            if (this.components.uiDevHud.teleportTarget == null || this.components.uiDevHud.devEnabled == false) return;
            if (Game.renderer.world.entities[this.components.uiDevHud.teleportTarget] == undefined) return this.components.uiDevHud.teleportTarget = null;

            const mouseWorldPosition = Game.renderer.screenToWorld(this.mousePosition.x, this.mousePosition.y);
            window.teleportEntity(this.components.uiDevHud.teleportTarget, mouseWorldPosition.x, mouseWorldPosition.y);
        }
    }

    onMouseDown({ event }) {
        if (this.components["uiPlacementOverlay"].isActive()) this.components["uiPlacementOverlay"].placeBuilding();
        for (let icon in this.components["uiTopBar"].menuIcons) {
            this.components["uiTopBar"].menuIcons[icon].hide();
        }

        if (process.env.NODE_ENV == "development") {
            if (this.components.uiDevHud.teleportingEntity == true) {
                const world = Game.renderer.world;
                const worldPos = Game.renderer.screenToWorld(game.ui.mousePosition.x, game.ui.mousePosition.y);
                const cellIndices = world.entityGrid.getCellIndices(worldPos.x, worldPos.y, {
                    width: 1,
                    height: 1
                });
                const cellIndex = cellIndices.length > 0 ? cellIndices[0] : false;
                if (cellIndex === false) return;

                const entities = world.entityGrid.getEntitiesInCell(cellIndex);

                this.components.uiDevHud.teleportTarget = parseInt(Object.keys(entities)[0]);
            }
        }
    }

    onMouseUp({ event }) {
        // TODO: separate this out, it's real weird spreading everything else into its own files except this
        if (this.components["uiReconnection"].isVisible() || this.components["uiRespawn"].isVisible()) return;

        if (this.components["uiPlacementOverlay"].isActive()) return;

        for (let icon in this.components["uiTopBar"].menuIcons) {
            this.components["uiTopBar"].menuIcons[icon].hide();
        }

        if (this.playerTick?.weaponName !== "Pickaxe") return this.components["uiBuildingOverlay"].onWorldMouseUp(event);

        if (this.castingSpell == true) return;

        const world = Game.renderer.world;
        const worldPos = Game.renderer.screenToWorld(this.mousePosition.x, this.mousePosition.y);
        const cellIndices = world.entityGrid.getCellIndices(worldPos.x, worldPos.y, {
            width: 1,
            height: 1
        });
        const cellIndex = cellIndices.length > 0 ? cellIndices[0] : false;
        if (cellIndex === false) return;

        const entities = world.entityGrid.getEntitiesInCell(cellIndex);

        const buildingOverlay = this.components["uiBuildingOverlay"];
        for (const uid in entities) {
            const entityUid = parseInt(uid);

            if (entityUid == buildingOverlay.buildingUid) return buildingOverlay.onWorldMouseUp(event);

            const entity = world.entities[entityUid];
            const entityTick = entity.getTargetTick();

            for (const buildingId in this.buildingData) {
                if (buildingId == entityTick.model) {
                    buildingOverlay.onWorldMouseUp(event);
                    buildingOverlay.startWatching(entityUid);
                    return;
                }
            }
        }
        buildingOverlay.onWorldMouseUp(event);

        if (process.env.NODE_ENV == "development") this.components.uiDevHud.teleportTarget = null;
    }

    onRightMouseUp({ event }) {
        this.components["uiBuildingOverlay"].onRightMouseUp(event);
        this.components["uiPlacementOverlay"].cancelPlacing();
    }

    onSocketOpened() {
        this.components["uiReconnection"].hide();
    }

    onSocketClosed() {
        this.components["uiMenuGridParties"].hide();
        this.components["uiMenuGridSettings"].hide();
        this.components["uiMenuGridShop"].hide();
        this.components["uiMenuGridSpells"].hide();
        if (process.env.NODE_ENV == "development") this.components["uiDevHud"].hide();

        this.components["uiRespawn"].hide();
        this.components["uiReconnection"].show();
    }

    onBeforeUnload(event) {
        if (Game.getInWorld() || this.playerTick !== undefined || this.playerTick?.dead === 1) {
            event.returnValue = "Leaving the page will cause you to lose all progress. Are you sure?";
            return event.returnValue;
        }
    }

    getFactory() {
        return this.factory;
    }

    setPlayerTick(tick) {
        this.lastPlayerTick = this.playerTick;
        this.playerTick = tick;

        for (let resource of ["wood", "stone", "gold", "tokens", "wave"]) {
            if (this.lastPlayerTick !== null) {
                if (this.lastPlayerTick[resource] !== this.playerTick[resource]) {
                    Game.eventEmitter.emit(`${resource}CountUpdated`);
                }
            } else {
                Game.eventEmitter.emit(`${resource}CountUpdated`);
            }
        }

        Game.eventEmitter.emit("PlayerTickUpdated", tick);
    }

    getPlayerTick() {
        return this.playerTick;
    }

    getLastPlayerTick() {
        return this.lastPlayerTick;
    }

    onPartyBuildingUpdate(response) {
        for (let id in response) {
            const update = response[id];
            if (update.dead == true) {
                delete this.buildings[update.uid];
            } else {
                this.buildings[update.uid] = update;
            }
            if (update.type == "Factory") {
                this.factory = update.dead ? null : update;
                for (const buildingId in this.buildingData) {
                    this.buildingData[buildingId].disabled = update.dead;
                }
                this.buildingData.Factory.disabled = !update.dead;
            }
            this.buildingData[update.type].built = 0;
            for (const uid in this.buildings) {
                if (this.buildings[uid].type == update.type) this.buildingData[update.type].built++;
            }
        }
        Game.eventEmitter.emit("BuildingsUpdated", response);
    }
}

export { Ui };