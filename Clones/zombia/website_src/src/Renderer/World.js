import { NetworkEntity } from "./Entities/NetworkEntity.js";
import { Game } from "../Game.js";
import { EntityGrid } from "./EntityGrid.js";

class World {
    constructor() {
        this.entities = {};
        this.localPlayer = null;
    }

    init() {
        Game.eventEmitter.on("EnterWorldResponse", this.onEnterWorld.bind(this));
        Game.eventEmitter.on("RendererUpdated", this.onRendererTick.bind(this));
        Game.renderer.replicator.setTargetTickUpdatedCallback(this.updateEntities.bind(this));
    }

    onServerDesync() {
        for (let uid in this.entities) this.removeEntity(uid, false);
        this.entities = {};
        console.log("Server desynced, world has removed all entities.");
    }

    onEnterWorld(data) {
        for (let uid in this.entities) this.removeEntity(uid, false);

        this.entities = {};
        this.localPlayer = data.uid;

        this.entityGrid = new EntityGrid(data.x, data.y);
    }

    onRendererTick(delta) {
        if (Game.network.connected == false) return;
        const msInThisTick = Game.renderer.replicator.getMsInThisTick();
        for (const entity of Object.values(this.entities)) entity.tick(msInThisTick, Game.renderer.replicator.msPerTick);
    }

    updateEntities(entities) {
        for (let uid in this.entities) {
            if (!(uid in entities)) this.removeEntity(uid);
            else if (entities[uid] !== true) this.updateEntity(entities[uid], uid);
            else this.updateEntity({}, uid, true);
        }

        for (let uid in entities) {
            if (entities[uid] === true) continue;
            if (!(uid in this.entities)) this.createEntity(entities[uid]);
        }
    }

    createEntity(data) {
        let entity = new NetworkEntity(data);
        if (data.uid === this.localPlayer) Game.renderer.followingObject = entity;
        this.entities[entity.uid] = entity;

        Game.renderer.add(entity, data.entityClass);
        this.entityGrid.updateEntity(this.entities[entity.uid]);
    }

    removeEntity(uid, shouldCreateFadingEffect = true) {
        Game.renderer.remove(this.entities[uid], shouldCreateFadingEffect);
        delete this.entities[uid];
        this.entityGrid.removeEntity(parseInt(uid));
    }

    updateEntity(entity, uid, duplicateTick = false) {
        if (duplicateTick === true) {   
            if (!this.entities[uid].hasRunTick) {
                this.entities[uid].hasRunTick = true;
                this.entities[uid].setTargetTick(entity, duplicateTick);
            }
        } else {
            this.entities[uid].hasRunTick = false;
            this.entities[uid].setTargetTick(entity, duplicateTick);
        }
        this.entityGrid.updateEntity(this.entities[uid]);
    }

    getLocalPlayer() {
        return this.localPlayer;
    }
}

export { World };