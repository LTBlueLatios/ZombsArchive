class EntityGrid {
    constructor(mapWidth, mapHeight) {
        this.cellEntities = []
        this.entityMap = {};
        this.cellSize = 48;
        this.columns = mapWidth / this.cellSize;
        this.rows = mapHeight / this.cellSize;
        this.totalCells = this.columns * this.rows;
        this.entityData = {};
        for (let i = 0; i < this.totalCells; i++) {
            this.cellEntities[i] = {};
        }
        Game.eventEmitter.on("EntityDataRpcReceived", this.onEntityData.bind(this));
    }
}