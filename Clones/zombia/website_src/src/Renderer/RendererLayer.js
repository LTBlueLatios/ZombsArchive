import { Entity } from "./Entities/Entity.js";
import * as PIXI from "pixi.js";

class RendererLayer extends Entity {
    constructor() {
        super();
        this.setNode(new PIXI.Container());
    }
}

export { RendererLayer };