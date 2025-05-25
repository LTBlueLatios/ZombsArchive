import { Game } from "../Game.js";
import { UiComponent } from "./UiComponent.js";
import { TextEntity } from "../Renderer/Entities/TextEntity.js";
import { entities } from "../Renderer/Entities/Entities.js";
import { SpriteEntity } from "../Renderer/Entities/SpriteEntity.js";
import { PlacementIndicatorModel } from "../Renderer/Entities/PlacementIndicatorModel.js";
import { RangeIndicatorModel } from "../Renderer/Entities/RangeIndicatorModel.js";

class UiPlacementOverlay extends UiComponent {
    constructor() {
        super("<span></span>");
        this.placeholderTints = [];
        this.borderTints = [];
        this.direction = 0;
        this.disableDirection = true;
        this.placeholderEntity = null;
        this.buildingRangeIndicator = null;
        this.placeholderText = new TextEntity("Press R to rotate...", { fontFamily: "Hammersmith One", fontSize: 16, strokeWidth: 3 });
        this.placeholderText.setAnchor(0.5, 0.5);
        this.placeholderText.setColor(220, 220, 220);
        this.placeholderText.setFontWeight("bold");
        this.placeholderText.setLetterSpacing(1);
        this.placeholderText.setAlpha(0);
        this.placeholderText.setPosition(-1000, -1000);
    }

    init() {
        Game.renderer.uiLayer.addAttachment(this.placeholderText);
        Game.eventEmitter.on("82Up", this.cycleDirection.bind(this));
        Game.eventEmitter.on("EnterWorldResponse", this.onEnterWorld.bind(this));
        Game.eventEmitter.on("CameraUpdate", this.update.bind(this));
        Game.eventEmitter.on("DeadRpcReceived", this.onDead.bind(this));
        Game.eventEmitter.on("27Up", this.cancelPlacing.bind(this));
        Game.eventEmitter.on("BuildingsUpdated", this.onBuildingData.bind(this));
    }

    onBuildingData(data) {
        for (let i in data) {
            const building = data[i];
            if (building.type == this.buildingType && Game.ui.buildingData[building.type].built >= Game.ui.buildingData[building.type].limit) this.cancelPlacing();
        }
    }

    onEnterWorld(data) {
        this.cancelPlacing();
        this.minWallDistance = data.minimumBuildDistanceFromWall;
        this.maxFactoryDistance = data.maxFactoryBuildDistance;
        this.maxPlayerDistance = data.maxPlayerBuildDistance;
    }

    cycleDirection() {
        if (this.disableDirection === true || this.placeholderEntity === null) return;
        this.direction = (this.direction + 1) % 4;
        this.placeholderEntity.setRotation(this.direction * 90);

        this.update();
    }

    onDead() {
        this.cancelPlacing();
    }

    startPlacing(buildingType) {
        if (this.buildingType) this.cancelPlacing();

        Game.ui.components.uiBuildingOverlay.stopWatching();

        this.buildingType = buildingType;

        const buildingData = Game.ui.buildingData[buildingType];
        if (["SawTower", "Harvester"].includes(this.buildingType)) {
            this.disableDirection = false;
            this.placeholderText.setAlpha(0.75);
            this.placeholderText.setPosition(-1000, -1000);
        } else {
            this.disableDirection = true;
            this.direction = 0;
            this.placeholderText.setAlpha(0);
            this.placeholderText.setPosition(-1000, -1000);
        }
        const world = Game.renderer.world;
        const cellSize = world.entityGrid.cellSize;
        const totalCellsUsed = buildingData.gridWidth * buildingData.gridHeight;

        if (entities[buildingType]) {
            this.placeholderEntity = new SpriteEntity(`./asset/images/Ui/Buildings/${buildingType}/${buildingType}Tier1.svg`);
            this.placeholderEntity.setAlpha(0.5);
            this.placeholderEntity.setRotation(this.direction * 90);
            Game.renderer.uiLayer.addAttachment(this.placeholderEntity);
        }

        for (let i = 0; i < totalCellsUsed; i++) {
            this.placeholderTints[i] = new PlacementIndicatorModel({
                width: cellSize,
                height: cellSize
            });
            Game.renderer.uiLayer.addAttachment(this.placeholderTints[i]);
        }

        this.buildingRangeIndicator = new RangeIndicatorModel({
            width: this.maxFactoryDistance * cellSize * 2,
            height: this.maxFactoryDistance * cellSize * 2,
            fill: { r: 0, b: 0, g: 0 },
            lineFill: { r: 255, b: 0, g: 0 },
            lineWidth: 12
        });
        Game.renderer.groundLayer.addAttachment(this.buildingRangeIndicator);

        const columns = Game.renderer.worldSize.x / cellSize;
        const rows = Game.renderer.worldSize.y / cellSize;

        for (let i = 0; i < 4; i++) {
            const halfWallDistance = this.minWallDistance / 2;
            if (i == 0 || i == 1) {
                this.borderTints[i] = new PlacementIndicatorModel({
                    width: cellSize * this.minWallDistance,
                    height: cellSize * rows
                });
            } else if (i == 2 || i == 3) {
                this.borderTints[i] = new PlacementIndicatorModel({
                    width: cellSize * (columns - this.minWallDistance * 2),
                    height: cellSize * this.minWallDistance
                });
            }
            Game.renderer.groundLayer.addAttachment(this.borderTints[i]);
            if (i == 0) {
                this.borderTints[i].setPosition(cellSize * halfWallDistance, cellSize * (rows / 2));
            } else if (i == 1) {
                this.borderTints[i].setPosition(cellSize * (columns - halfWallDistance), cellSize * (rows / 2));
            } else if (i == 2) {
                this.borderTints[i].setPosition(cellSize * (columns / 2), cellSize * halfWallDistance);
            } else if (i == 3) {
                this.borderTints[i].setPosition(cellSize * (columns / 2), cellSize * (rows - halfWallDistance));
            }
            this.borderTints[i].setIsOccupied(true);
        }
        this.update();
    }

    update() {
        if (!this.buildingType) return;

        const buildingData = Game.ui.buildingData[this.buildingType];
        const mousePosition = Game.ui.mousePosition;
        const world = Game.renderer.world;
        const worldPos = Game.renderer.screenToWorld(mousePosition.x, mousePosition.y);

        let gridWidth = buildingData.gridWidth;
        let gridHeight = buildingData.gridHeight;

        if (this.direction == 1 || this.direction == 3) {
            gridWidth = buildingData.gridHeight;
            gridHeight = buildingData.gridWidth;
        }

        const cellIndices = world.entityGrid.getCellIndices(worldPos.x, worldPos.y, {
            width: gridWidth,
            height: gridHeight
        });
        const cellSize = world.entityGrid.cellSize;
        let cellAverages = {
            x: 0,
            y: 0
        };

        for (let i in cellIndices) {
            if (!cellIndices[i]) {
                this.placeholderTints[i].setVisible(false);
                continue;
            }
            const cellPos = world.entityGrid.getCellCoords(cellIndices[i]);
            let gridPos = {
                x: cellPos.x * cellSize + cellSize / 2,
                y: cellPos.y * cellSize + cellSize / 2
            };
            const uiPos = Game.renderer.worldToUi(gridPos.x, gridPos.y);
            const isOccupied = this.checkIsOccupied(cellIndices[i], cellPos);
            this.placeholderTints[i].setPosition(uiPos.x, uiPos.y);
            this.placeholderTints[i].setIsOccupied(isOccupied);
            this.placeholderTints[i].setVisible(true);
            cellAverages.x += cellPos.x;
            cellAverages.y += cellPos.y;
        }
        cellAverages.x = cellAverages.x / cellIndices.length;
        cellAverages.y = cellAverages.y / cellIndices.length;
        let gridPos = {
            x: cellAverages.x * cellSize + cellSize / 2,
            y: cellAverages.y * cellSize + cellSize / 2
        };

        // Update position of the building range indicator
        let primaryX = Game.ui.getFactory()?.x;
        let primaryY = Game.ui.getFactory()?.y;

        if (Game.ui.getFactory() == null) {
            primaryX = gridPos.x;
            primaryY = gridPos.y;
        }

        this.buildingRangeIndicator.setPosition(primaryX, primaryY);

        const uiPos = Game.renderer.worldToUi(gridPos.x, gridPos.y);
        if (this.placeholderEntity !== null) {
            this.placeholderEntity.setPosition(uiPos.x, uiPos.y);
            this.placeholderText.setPosition(uiPos.x, uiPos.y - 110);
        }
    }

    checkIsOccupied(cellIndex, cellPos) {
        const world = Game.renderer.world;
        const cellSize = world.entityGrid.cellSize;
        const entities = world.entityGrid.getEntitiesInCell(cellIndex);
        const gridPos = {
            x: cellPos.x * cellSize + cellSize / 2,
            y: cellPos.y * cellSize + cellSize / 2
        }

        if (!entities) return true;

        for (const uid in entities) {
            const networkEntity = world.entities[parseInt(uid)];
            if (!networkEntity) continue;
            const entityTick = networkEntity.getTargetTick();
            if (!entityTick) continue;

            if (entityTick.model == "HarvesterDrone") continue;

            if (entityTick.entityClass !== "Projectile") return true;
        }

        const wallDistanceX = Math.min(cellPos.x, world.entityGrid.columns - 1 - cellPos.x);
        const wallDistanceY = Math.min(cellPos.y, world.entityGrid.rows - 1 - cellPos.y);

        if (wallDistanceX < this.minWallDistance || wallDistanceY < this.minWallDistance) return true;

        if (world.getLocalPlayer()) {
            const localEntity = world.entities[world.getLocalPlayer()];
            if (localEntity) {
                const cellDistanceX = Math.abs(localEntity.getPositionX() - gridPos.x) / cellSize;
                const cellDistanceY = Math.abs(localEntity.getPositionY() - gridPos.y) / cellSize;
                if (cellDistanceX > this.maxPlayerDistance || cellDistanceY > this.maxPlayerDistance) return true;
            }
        }

        if (Game.ui.factory !== null && this.buildingType !== "Harvester") {
            const cellDistanceX = Math.abs(Game.ui.factory.x - gridPos.x) / cellSize;
            const cellDistanceY = Math.abs(Game.ui.factory.y - gridPos.y) / cellSize;
            if (cellDistanceX > this.maxFactoryDistance || cellDistanceY > this.maxFactoryDistance) return true;
        }
        return false;
    }

    cancelPlacing() {
        if (!this.buildingType) return;
        Game.renderer.uiLayer.removeAttachment(this.placeholderEntity);
        for (let i in this.placeholderTints) {
            Game.renderer.uiLayer.removeAttachment(this.placeholderTints[i]);
        }
        for (let i in this.borderTints) {
            Game.renderer.groundLayer.removeAttachment(this.borderTints[i]);
        }

        if (this.buildingRangeIndicator) {
            Game.renderer.groundLayer.removeAttachment(this.buildingRangeIndicator);
            delete this.buildingRangeIndicator;
        }

        this.placeholderText.setAlpha(0);
        this.placeholderText.setPosition(-1000, -1000);
        this.placeholderEntity = null;
        this.placeholderTints = [];
        this.borderTints = [];
        this.buildingType = null;
    }

    placeBuilding() {
        if (!this.buildingType) return;

        const localPlayer = Game.renderer.world.getLocalPlayer();
        if (!localPlayer) return false;
        const localEntity = Game.renderer.world.entities[localPlayer];
        if (!localEntity) return false;

        const buildingData = Game.ui.buildingData[this.buildingType];
        const mousePosition = Game.ui.mousePosition;
        const world = Game.renderer.world;
        const worldPos = Game.renderer.screenToWorld(mousePosition.x, mousePosition.y);

        let gridWidth = buildingData.gridWidth;
        let gridHeight = buildingData.gridHeight;

        if (this.direction == 1 || this.direction == 3) {
            gridWidth = buildingData.gridHeight;
            gridHeight = buildingData.gridWidth;
        }

        const cellIndices = world.entityGrid.getCellIndices(worldPos.x, worldPos.y, {
            width: gridWidth,
            height: gridHeight
        });

        const cellSize = world.entityGrid.cellSize;
        let cellAverages = {
            x: 0,
            y: 0
        };

        for (let i in cellIndices) {
            if (!cellIndices[i]) return false;
            const cellPos = world.entityGrid.getCellCoords(cellIndices[i]);
            cellAverages.x += cellPos.x;
            cellAverages.y += cellPos.y;
        }

        cellAverages.x /= cellIndices.length;
        cellAverages.y /= cellIndices.length;

        let gridPos = {
            x: cellAverages.x * cellSize + cellSize / 2,
            y: cellAverages.y * cellSize + cellSize / 2
        };

        Game.network.sendRpc({
            name: "PlaceBuilding",
            x: gridPos.x,
            y: gridPos.y,
            type: this.buildingType,
            yaw: this.direction * 90
        });
        return true;
    }

    isActive() {
        return !!this.buildingType;
    }
}

export { UiPlacementOverlay };