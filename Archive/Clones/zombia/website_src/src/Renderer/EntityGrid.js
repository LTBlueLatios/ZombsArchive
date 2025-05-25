import { Game } from "../Game.js";

class EntityGrid {
    constructor(mapWidth, mapHeight) {
        this.cellEntities = []
        this.entityMap = {};
        this.cellSize = 48;
        this.columns = mapWidth / this.cellSize;
        this.rows = mapHeight / this.cellSize;
        this.totalCells = this.columns * this.rows;
        for (let i = 0; i < this.totalCells; i++) {
            this.cellEntities[i] = {};
        }

        this.entityData = {
            Player: { gridWidth: 1, gridHeight: 1 },
            Stone: { gridWidth: 2, gridHeight: 2 },
            Tree: { gridWidth: 3, gridHeight: 3},
            // TODO
            Zombie: { gridWidth: null, gridHeight: null }
        };

        Game.eventEmitter.on("BuildingDataReceived", this.onBuildingDataReceived.bind(this));
    }

    onBuildingDataReceived() {
        const data = Game.ui.buildingData;
        for (let model in data) {
            this.entityData[model] = {
                gridWidth: data[model].gridWidth,
                gridHeight: data[model].gridHeight
            };
        }
    }

    getEntitiesInCell(index) {
        return index in this.cellEntities ? this.cellEntities[index] : false;
    }

    onEntityData(data) {
        this.entityData = JSON.parse(data.json);
    }

    updateEntity(entity) {
        // TODO: figure out why this needs to run every tick?
        const gridSize = { width: 1, height: 1 };
        const tick = entity.getTargetTick();
        if (tick && "model" in tick) {
            let entityData = this.entityData[tick.model];
            if (entityData === undefined) {
                if (tick.entityClass === "Resource") entityData = this.entityData[tick.resourceType];
            }
            if (entityData !== undefined) {
                if ("gridWidth" in entityData && "gridHeight" in entityData) {
                    gridSize.width = entityData.gridWidth;
                    gridSize.height = entityData.gridHeight;

                    if (tick.yaw == 90 || tick.yaw == 270) {
                        gridSize.width = entityData.gridHeight;
                        gridSize.height = entityData.gridWidth;
                    }
                }
            }
        }

        const cellIndices = this.getCellIndices(entity.getPositionX(), entity.getPositionY(), gridSize);

        if (!(entity.uid in this.entityMap)) return this.addEntityToCells(entity.uid, cellIndices);

        const isDirty = this.entityMap[entity.uid].length !== cellIndices.length || !this.entityMap[entity.uid].every((element, i) => {
            return element === cellIndices[i];
        });
        if (isDirty) {
            this.removeEntityFromCells(entity.uid, this.entityMap[entity.uid]);
            this.addEntityToCells(entity.uid, cellIndices);
        }
    }

    removeEntity(uid) {
        this.removeEntityFromCells(uid, this.entityMap[uid]);
    }

    getCellIndices(x, y, gridSize) {
        const indices = [];
        for (let xOffset = -gridSize.width / 2 + 0.5; xOffset < gridSize.width / 2; xOffset++) {
            for (let yOffset = -gridSize.height / 2 + 0.5; yOffset < gridSize.height / 2; yOffset++) {
                const index = this.columns * Math.floor(y / this.cellSize + yOffset) + Math.floor(x / this.cellSize + xOffset);
                indices.push(index >= 0 && index < this.totalCells ? index : false);
            }
        }
        return indices;
    }

    getCellCoords(index) {
        return {
            x: index % this.columns,
            y: Math.floor(index / this.columns)
        }
    }

    removeEntityFromCells(uid, indices) {
        if (indices) {
            if (indices.length > 1) {
                for (const i in indices) {
                    if (!indices[i]) continue;
                    delete this.cellEntities[indices[i]][uid];
                }
            } else {
                if (indices[0]) delete this.cellEntities[indices[0]][uid];
            }
        }
        delete this.entityMap[uid];
    }

    addEntityToCells(uid, indices) {
        if (indices.length > 1) {
            for (const i in indices) {
                if (!indices[i]) continue;
                this.cellEntities[indices[i]][uid] = true;
            }
        } else {
            if (indices[0]) this.cellEntities[indices[0]][uid] = true;
        }
        this.entityMap[uid] = indices;
    }
}

export { EntityGrid };