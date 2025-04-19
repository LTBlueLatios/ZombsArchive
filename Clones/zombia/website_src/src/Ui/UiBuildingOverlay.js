import { Game } from "../Game.js";
import { Util } from "../Util.js";
import { UiComponent } from "./UiComponent.js";
import { CircleSelectorIndicatorModel } from "../Renderer/Entities/CircleSelectorIndicatorModel.js";
import { DrawEntity } from "../Renderer/Entities/DrawEntity.js";

const BUILDING_TIER_COUNT = 8;

class UiBuildingOverlay extends UiComponent {
    constructor() {
        let buildingOverlayDiv = document.createElement("div");
        buildingOverlayDiv.className = "hud-building-overlay hud-tooltip hud-tooltip-top";
        document.getElementById("hud").appendChild(buildingOverlayDiv);

        super(buildingOverlayDiv);

        this.element.innerHTML =
        `
        <div class="hud-tooltip-building">
            <h2 class="hud-building-name"></h2>
            <h3 class="harvester-drone-count"></h3>
            <h3>Tier <span id="hud-building-tier" class="hud-building-tier"></span></h3>
            <div class="hud-tooltip-body">
                <div id="hud-building-stats" class="hud-building-stats"></div>
                <p class="hud-building-actions">
                    <a class="btn hud-building-aggro"></a>
                    <span class="hud-building-dual-btn">
                        <a class="btn hud-building-harvester-drone">Buy Drone</a>
                        <a class="btn hud-building-harvester-set-target">Set Target</a>
                    </span>
                    <a class="btn btn-green hud-building-upgrade"></a>
                    <a class="btn btn-red hud-building-sell">Sell</a>
                </p>
            </div>
        </div>
        `;
        this.nameElem = this.element.querySelector(".hud-building-name");
        this.tierElem = this.element.querySelector(".hud-building-tier");
        this.statsElem = this.element.querySelector(".hud-building-stats");
        this.harvesterDroneCountElem = this.element.querySelector(".harvester-drone-count");
        this.aggroElem = this.element.querySelector(".hud-building-aggro");
        this.dualBtnElem = this.element.querySelector(".hud-building-dual-btn");
        this.harvesterSetTargetElem = this.element.querySelector(".hud-building-harvester-set-target");
        this.harvesterPurchaseDroneElem = this.element.querySelector(".hud-building-harvester-drone");
        this.upgradeElem = this.element.querySelector(".hud-building-upgrade");
        this.sellElem = this.element.querySelector(".hud-building-sell");

        this.upgradeElem.addEventListener("mouseup", this.upgradeBuilding.bind(this));
        this.sellElem.addEventListener("mouseup", this.sellBuilding.bind(this));
        this.aggroElem.addEventListener("mouseup", this.togglePrimaryAggro.bind(this));
        this.harvesterSetTargetElem.addEventListener("mouseup", this.toggleHarvesterTargetDisplay.bind(this));
        this.harvesterPurchaseDroneElem.addEventListener("mouseup", this.purchaseHarvesterDrone.bind(this));

        this.element.addEventListener("mousedown", this.onMouseDown.bind(this));
        this.element.addEventListener("mouseup", this.onMouseUp.bind(this));

        this.hasInitialised = false;
    }

    init() {
        if (this.hasInitialised == true) return;
        this.hasInitialised = true;

        Game.eventEmitter.on("EnterWorldResponse", this.onEnterWorld.bind(this));
        Game.eventEmitter.on("EntityUpdate", this.onEntityUpdate.bind(this));
        Game.eventEmitter.on("PlayerTickUpdated", this.updateText.bind(this));

        Game.eventEmitter.on("CameraUpdate", () => {
            this.shouldUpdateRanges = true;
            this.update();
        });

        Game.eventEmitter.on("BuildingsUpdated", () => {
            this.shouldUpdateRanges = true;
            this.update();
            this.updateText();
        });

        Game.eventEmitter.on("16Down", this.updateText.bind(this));
        Game.eventEmitter.on("16Up", this.updateText.bind(this));
        Game.eventEmitter.on("69Up", this.upgradeBuilding.bind(this));
        Game.eventEmitter.on("84Up", this.sellBuilding.bind(this));
        Game.eventEmitter.on("27Up", this.stopWatching.bind(this));

        this.shiftDown = false;
        this.displayingHarvesterRange = false;

        const toggleShift = direction => {
            this.shouldUpdateRanges = true;
            if (direction == "Up") {
                if (this.shiftDown == true) {
                    this.shiftDown = false;
                    this.update();
                }
            } else if (direction == "Down") {
                if (this.shiftDown == false) {
                    this.shiftDown = true;
                    this.update();
                }
            }
        }

        Game.eventEmitter.on("16Down", toggleShift.bind(this, "Down"));
        Game.eventEmitter.on("16Up", toggleShift.bind(this, "Up"));

        this.harvesterSelectorModel = new CircleSelectorIndicatorModel({
            radius: 120
        });

        Game.renderer.groundLayer.addAttachment(this.harvesterSelectorModel, 10);

        this.harvesterSelectorModel.setVisible(false);

        this.draw = new DrawEntity();
        Game.renderer.groundLayer.addAttachment(this.draw, 10);

        this.numberOfRangesToDraw = 0;
        this.shouldUpdateRanges = true;
        this.lastRangeDrawTick = 0;

        this.draw.setAlpha(0.1);
    }

    onEnterWorld(data) {
        this.stopWatching();
        this.maxFactoryDistance = data.maxFactoryBuildDistance;
    }

    onEntityUpdate(data) {
        if (this.buildingUid == null) return;
        if (data.entities[this.buildingUid] !== undefined) this.update();
    }
    
    onMouseDown(event) {
        event.stopPropagation();
    }

    onMouseUp(event) {
        // Allow the overlay to be clicked through to use the harvester
        if (this.buildingId == "Harvester") return;

        event.stopPropagation();
    }

    onWorldMouseUp(event) {
        if (this.buildingId == "Harvester") {
            if (this.displayingHarvesterRange == false) return this.stopWatching();
        } else return this.stopWatching();

        if (this.displayingHarvesterRange == false) return;

        const networkEntity = Game.renderer.world.entities[this.buildingUid];
        const buildingData = Game.ui.buildingData[this.buildingId];

        const harvestRange = buildingData.harvestRange[Game.ui.buildings[this.buildingUid].tier - 1];
        const sceneryLayer = Game.renderer.scenery;
        const resources = [];
        const worldMousePos = Game.renderer.screenToWorld(Game.ui.mousePosition.x, Game.ui.mousePosition.y);

        for (const attachment of sceneryLayer.attachments) {
            if (attachment.entityClass == "Resource") {
                const distMouseToResource = Math.sqrt(Util.measureDistance(attachment.getPosition(), worldMousePos));
                const distResourceToHarvester = Math.sqrt(Util.measureDistance(attachment.getPosition(), networkEntity.getPosition())) + attachment.targetTick.radius;

                if (distMouseToResource <= 120 && distResourceToHarvester <= harvestRange) {
                    resources.push(attachment);
                }
            }
        }

        if (resources.length == 0) return;

        resources.sort((a, b) => {
            const distMouseToA = Util.measureDistance(worldMousePos, a.getPosition());
            const distMouseToB = Util.measureDistance(worldMousePos, b.getPosition());

            if (distMouseToA < distMouseToB) {
                return -1;
            } else if (distMouseToA > distMouseToB) {
                return 1;
            }
            return 0;
        });

        // Change harvester target
        Game.network.sendRpc({
            name: "UpdateHarvesterTarget",
            harvesterUid: this.buildingUid,
            targetUid: resources[0].uid
        });

        this.show();
        this.displayingHarvesterRange = false;
    }

    upgradeBuilding(event) {
        // Only run if using the left mouse button or if using the keybind
        if (event.which !== 1 && event.which !== 69) return;

        event.stopPropagation();

        if (!this.buildingUid) return;

        let uids = new Set();
        uids.add(this.buildingUid);

        if (Game.network.inputPacketManager.shiftDown) {
            for (const uid in Game.ui.buildings) {
                const building = Game.ui.buildings[uid];
                if (building.type == this.buildingId && building.tier == this.buildingTier && uid !== this.buildingUid) {
                    uids.add(building.uid);
                }
            }
        }

        Game.network.sendRpc({
            name: "UpgradeBuilding",
            uids: Array.from(uids)
        });
    }

    sellBuilding(event) {
        // Only run if using the left mouse button or if using the keybind
        if (event.which !== 1 && event.which !== 84) return;

        if (!this.buildingUid || !Game.ui.playerPartyCanSell) return;
        let uids = new Set();
        uids.add(this.buildingUid);

        if (Game.network.inputPacketManager.shiftDown) {
            for (const uid in Game.ui.buildings) {
                const building = Game.ui.buildings[uid];
                if (building.type == this.buildingId && building.tier == this.buildingTier) {
                    uids.add(building.uid);
                }
            }
        }

        if (uids.size > 1) {
            Game.ui.components.uiPopupOverlay.showConfirmation(`Are you sure you want to sell all <b>${this.buildingId}</b>s?`, 5000, () => {
                Game.network.sendRpc({
                    name: "SellBuilding",
                    uids: Array.from(uids)
                });
            });
        } else {
            Game.network.sendRpc({
                name: "SellBuilding",
                uids: Array.from(uids)
            });
        }
    }

    togglePrimaryAggro(event) {
        // Only run if using the left mouse button
        if (event.which !== 1) return event.stopPropagation();

        if (!this.buildingUid) return;
        const networkEntity = Game.renderer.world.entities[this.buildingUid];
        if (!networkEntity) return;

        const isPartyLeader = Game.ui.playerPartyLeader == Game.renderer.world.localPlayer;
        if (!isPartyLeader) return;

        Game.network.sendRpc({
            name: "TogglePrimaryAggro"
        })
    }

    update() {
        if (!this.buildingUid) return;
        const networkEntity = Game.renderer.world.entities[this.buildingUid];
        if (!networkEntity) return this.stopWatching();

        const screenPos = Game.renderer.worldToScreen(networkEntity.getPositionX(), networkEntity.getPositionY());
        const buildingData = Game.ui.buildingData[this.buildingId];

        const building = Game.ui.buildings[this.buildingUid];
        if (!building) return this.stopWatching();

        if (this.isVisible()) {
            const gridHeight = buildingData.gridHeight;
            const entityHeight = gridHeight / 2 * 48 * (Game.renderer.scale / window.devicePixelRatio);

            this.element.style.left = (screenPos.x - this.element.offsetWidth / 2) + "px";
            this.element.style.top = (screenPos.y - entityHeight - this.element.offsetHeight - 20) + "px";
        }

        if (this.shouldUpdateRanges == true && this.lastRangeDrawTick !== Game.renderer.replicator.currentTick.tick) {
            this.shouldUpdateRanges = false;
            this.lastRangeDrawTick = Game.renderer.replicator.currentTick.tick;

            this.draw.clear();
            this.numberOfRangesToDraw = 0;

            if (buildingData.name == "Harvester") {
                if (networkEntity.targetTick.targetResourceUid == 0) this.harvesterSetTargetElem.innerHTML = "Set Target";
                else this.harvesterSetTargetElem.innerHTML = "Clear Target";

                const harvestRange = buildingData.harvestRange[building.tier - 1];

                // Draw harvest range
                this.draw.drawCircle(
                    building.x, // x
                    building.y, // y
                    harvestRange, // radius
                    { r: 200, g: 160, b: 0 }, // fill
                    { r: 255, g: 200, b: 0 }, // linefill
                    8 // linewidth
                )

                // Draw circle selector on targeted resource
                this.harvesterSelectorModel.setVisible(true);
                const targetResource = Game.renderer.world.entities[networkEntity.targetTick.targetResourceUid];
                if (targetResource == undefined) {
                    this.harvesterSelectorModel.setPosition(networkEntity.getPositionX(), networkEntity.getPositionY());
                } else {
                    this.harvesterSelectorModel.setPosition(targetResource.getPositionX(), targetResource.getPositionY());
                }

                if (this.displayingHarvesterRange) {
                    // Loop through all the resources in the viewport, and circle any within harvest range
                    const sceneryLayer = Game.renderer.scenery;
                    for (const attachment of sceneryLayer.attachments) {
                        if (attachment.entityClass !== "Resource") continue;

                        const targetTick = attachment.targetTick;
                        const distToResource = Math.sqrt(Util.measureDistance(building, targetTick.position));

                        if (distToResource + targetTick.radius <= harvestRange) {
                            this.draw.drawCircle(
                                targetTick.position.x, // x
                                targetTick.position.y, // y
                                100, // radius
                                { r: 0, g: 0, b: 0 }, // fill
                                { r: 255, g: 0, b: 0 }, // linefill
                                8 // linewidth
                            )
                        }
                    }
                }
            } else {
                this.harvesterSelectorModel.setVisible(false);

                this.drawRange(this.buildingUid);

                if (Game.network.inputPacketManager.shiftDown) {
                    for (let uid in Game.ui.buildings) {
                        if (Game.ui.buildings[uid].type == this.buildingId && Game.ui.buildings[uid].uid !== this.buildingUid) this.drawRange(uid);
                    }
                }
            }
        }
    }

    updateText() {
        if (!this.isActive()) return;
        if (!Game.ui.buildings[this.buildingUid]) return this.stopWatching();

        const buildingData = Game.ui.buildingData[this.buildingId];
        this.buildingId = Game.ui.buildings[this.buildingUid].type;
        this.buildingTier = Game.ui.buildings[this.buildingUid].tier;

        const networkEntity = Game.renderer.world.entities[this.buildingUid];
        if (!networkEntity) return this.stopWatching();

        if (this.buildingId == "Factory" && Game.network.options.serverData.gameMode !== "scarcity") {
            if (networkEntity.targetTick.aggroEnabled == true) {
                this.aggroElem.classList.add("btn-red");
                this.aggroElem.classList.remove("btn-green");
                this.aggroElem.innerHTML = "Attack all enemies";
            } else {
                this.aggroElem.classList.add("btn-green");
                this.aggroElem.classList.remove("btn-red");
                this.aggroElem.innerHTML = "Attack aggressive enemies";
            }

            this.aggroElem.style.display = "block";

            const isPartyLeader = Game.ui.playerPartyLeader == Game.renderer.world.localPlayer;

            if (isPartyLeader) this.aggroElem.classList.remove("is-disabled");
            else this.aggroElem.classList.add("is-disabled");

        } else this.aggroElem.style.display = "none";

        if (this.buildingId == "Harvester") {
            this.dualBtnElem.style.display = "block";
            this.harvesterDroneCountElem.style.display = "block";
            this.harvesterDroneCountElem.innerHTML = `${networkEntity.targetTick.droneCount}/${buildingData.maxDrones[networkEntity.targetTick.tier - 1]} Drones`;

            if (Game.network.options.serverData.gameMode == "scarcity") {
                this.harvesterPurchaseDroneElem.classList.add("is-disabled");
                this.harvesterPurchaseDroneElem.innerHTML = "Buy Drone";
            } else {
                if (networkEntity.targetTick.droneCount >= buildingData.maxDrones[networkEntity.targetTick.tier - 1]) {
                    this.harvesterPurchaseDroneElem.classList.add("is-disabled");
                    this.harvesterPurchaseDroneElem.innerHTML = "Buy Drone";
                } else {
                    this.harvesterPurchaseDroneElem.classList.remove("is-disabled");

                    const droneCostString = Util.createResourceCostString({ goldCosts: buildingData.droneGoldCosts }, this.buildingTier, 1, true);
                    this.harvesterPurchaseDroneElem.innerHTML = `Buy Drone (${droneCostString.elem})`;
                }
            }
        } else {
            this.dualBtnElem.style.display = "none";
            this.harvesterDroneCountElem.style.display = "none";
        }

        const maxTier = this.buildingTier >= BUILDING_TIER_COUNT || (this.buildingId !== "Factory" && this.buildingTier >= Game.ui.getFactory().tier);
        this.nameElem.innerHTML = this.buildingId;
        this.tierElem.innerHTML = this.buildingTier;
        let numberOfTowers = 1;
        if (Game.network.inputPacketManager.shiftDown) {
            for (const uid in Game.ui.buildings) {
                const building = Game.ui.buildings[uid];
                if (building.type == this.buildingId && building.tier == this.buildingTier && building.uid !== this.buildingUid) numberOfTowers++;
            }
        }

        if (maxTier) this.upgradeElem.classList.add("is-disabled");

        const resourceRefundString = Util.createResourceRefundString(buildingData, this.buildingTier, numberOfTowers);

        if (["Factory"].includes(this.buildingId)) {
            this.sellElem.classList.add("is-disabled");
            this.sellElem.innerHTML = `<span>Can't sell</span>`;
        } else {
            if (!Game.ui.playerPartyCanSell) {
                this.sellElem.classList.add("is-disabled");
                this.sellElem.innerHTML = "<span>Need permission to sell</span>";
            } else {
                this.sellElem.classList.remove("is-disabled");
                this.sellElem.innerHTML = `<span>Sell${Game.network.inputPacketManager.shiftDown ? " All" : ""} (${resourceRefundString})</span>`;
            }
        }

        const resourceCostString = Util.createResourceCostString(buildingData, maxTier ? this.buildingTier : this.buildingTier + 1, numberOfTowers, true);

        const factory = Game.ui.getFactory();
        if (maxTier) {
            if (["Factory"].includes(this.buildingId)) {
                this.upgradeElem.innerHTML = "<span>Maximum tier!</span>";
            } else {
                if (factory.tier == this.buildingTier && factory.tier >= BUILDING_TIER_COUNT) {
                    this.upgradeElem.innerHTML = "<span>Maximum tier!</span>";
                } else {
                    this.upgradeElem.innerHTML = "<span>Upgrade your Factory</span>";
                }
            }
        } else this.upgradeElem.innerHTML = `<span>Upgrade ${Game.network.inputPacketManager.shiftDown ? "All " : ""} (${resourceCostString.elem})</span>`;

        const requiredInfo = {
            "Max Health": "health",
            "Range": "towerRadius",
            "Harvest Range": "harvestRange",
            "Gold/Second": "goldPerSecond",
            "Firing Rate": "msBetweenFires",
            "Projectile Speed": "projectileSpeed",
            "Damage to Zombies": "damageToZombies",
            "Target Limit": "attackTargetLimit",
            "Max Drone Count": "maxDrones"
        }

        let currentStats = "";
        let nextStats = "";
        for (let dataKey in requiredInfo) {
            if (!buildingData[requiredInfo[dataKey]]) continue;
            currentStats += `<p>${dataKey}: <strong class="hud-stats-current">${buildingData[requiredInfo[dataKey]][this.buildingTier - 1]}</strong></p>`;
            nextStats += `<p>${dataKey}: <strong class="hud-stats-next">${buildingData[requiredInfo[dataKey]][this.buildingTier - (this.buildingTier >= BUILDING_TIER_COUNT ? 1 : 0)]}</strong></p>`;
        }
        this.statsElem.innerHTML =
        `<div class="hud-stats-current hud-stats-values">${currentStats}</div>
        <div class="hud-stats-next hud-stats-values">${nextStats}</div>`;
    }

    drawRange(buildingUid) {
        const building = Game.ui.buildings[buildingUid];
        const networkEntity = Game.renderer.world.entities[buildingUid];

        this.numberOfRangesToDraw++;

        if (building == undefined || networkEntity == undefined) return;

        const buildingData = Game.ui.buildingData[building.type];

        if (building.type == "Factory") {
            const world = Game.renderer.world;
            const cellSize = world.entityGrid.cellSize;

            this.draw.drawRect(
                building.x - this.maxFactoryDistance * cellSize, // x1
                building.y - this.maxFactoryDistance * cellSize, // y1
                building.x + this.maxFactoryDistance * cellSize, // x2
                building.y + this.maxFactoryDistance * cellSize, // y2
                { r: 0, b: 0, g: 0 }, // fill
                { r: 255, b: 0, g: 0 }, // linefill
                12 // linewidth
            );
        } else if (buildingData.towerRadius !== undefined) {
            this.draw.drawCircle(
                building.x, // x
                building.y, // y
                buildingData.towerRadius[building.tier - 1], // radius
                this.numberOfRangesToDraw == 1 ? { r: 200, g: 160, b: 0 } : { r: 0, g: 0, b: 0, a: 0 }, // fill
                { r: 255, g: 200, b: 0 }, // linefill
                8 // linewidth
            )
        } else if (buildingData.range !== undefined && building.type == "SawTower") {
            let point2;
            let point3;

            if (building.yaw == 0) {
                point2 = {
                    x: building.x - buildingData.maxYawDeviation[building.tier - 1],
                    y: building.y - buildingData.range[building.tier - 1]
                }
                point3 = {
                    x: building.x + buildingData.maxYawDeviation[building.tier - 1],
                    y: building.y - buildingData.range[building.tier - 1]
                }
            } else if (building.yaw == 90) {
                point2 = {
                    x: building.x + buildingData.range[building.tier - 1],
                    y: building.y + buildingData.maxYawDeviation[building.tier - 1]
                }
                point3 = {
                    x: building.x + buildingData.range[building.tier - 1],
                    y: building.y - buildingData.maxYawDeviation[building.tier - 1]
                }
            } else if (building.yaw == 180) {
                point2 = {
                    x: building.x + buildingData.maxYawDeviation[building.tier - 1],
                    y: building.y + buildingData.range[building.tier - 1]
                }
                point3 = {
                    x: building.x - buildingData.maxYawDeviation[building.tier - 1],
                    y: building.y + buildingData.range[building.tier - 1]
                }
            } else if (building.yaw == 270) {
                point2 = {
                    x: building.x - buildingData.range[building.tier - 1],
                    y: building.y - buildingData.maxYawDeviation[building.tier - 1]
                }
                point3 = {
                    x: building.x - buildingData.range[building.tier - 1],
                    y: building.y + buildingData.maxYawDeviation[building.tier - 1]
                }
            }

            this.draw.drawTriangle(
                { x: building.x, y: building.y }, // point1
                point2, // point2
                point3, // point3
                { r: 200, g: 160, b: 0 }, // fill
                { r: 255, g: 200, b: 0 }, // linefill
                8 // linewidth
            );
        }
    }

    stopWatching() {
        if (!this.buildingUid) return;

        this.harvesterSelectorModel.setVisible(false);
        this.draw.clear();

        this.element.style.left = "-1000px";
        this.element.style.top = "-1000px";
        this.upgradeElem.classList.remove("is-disabled");
        this.buildingUid = null;
        this.buildingId = null;
        this.buildingTier = null;
        this.displayingHarvesterRange = false;

        this.hide();
    }

    startWatching(buildingUid) {
        if (this.buildingUid !== null) this.stopWatching();

        Game.ui.components.uiPlacementOverlay.cancelPlacing();

        this.buildingUid = buildingUid;
        if (!Game.ui.buildings[buildingUid]) return;

        const networkEntity = Game.renderer.world.entities[this.buildingUid];
        if (!networkEntity) return this.stopWatching();

        this.buildingId = Game.ui.buildings[buildingUid].type;
        this.buildingTier = Game.ui.buildings[buildingUid].tier;

        this.shouldUpdateRanges = true;
        this.updateText();
        this.show();
        this.update();
    }

    isActive() {
        return !!this.buildingUid;
    }


    onRightMouseUp(event) {
        if (this.buildingId == "Harvester" && this.displayingHarvesterRange == true) {
            this.displayingHarvesterRange = false;
            this.show();

            this.shouldUpdateRanges = true;
            this.update();
            return;
        }

        this.stopWatching();
    }

    toggleHarvesterTargetDisplay(event) {
        event.stopPropagation();

        // Only run if using the left mouse button
        if (event.which !== 1) return;

        const networkEntity = Game.renderer.world.entities[this.buildingUid];

        if (networkEntity.targetTick.targetResourceUid == 0) {
            this.displayingHarvesterRange = true;
            this.hide();
        } else {
            Game.network.sendRpc({
                name: "UpdateHarvesterTarget",
                harvesterUid: this.buildingUid,
                targetUid: 0
            });
        }

        this.shouldUpdateRanges = true;
        this.update();
    }

    purchaseHarvesterDrone(event) {
        // Only run if using the left mouse button
        if (event.which !== 1) return;

        event.stopPropagation();

        Game.network.sendRpc({
            name: "BuyHarvesterDrone",
            harvesterUid: this.buildingUid
        })
    }
}

export { UiBuildingOverlay };