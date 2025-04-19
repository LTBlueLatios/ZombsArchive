import { Entity } from "./Entity.js";
import * as PIXI from "pixi.js";
import { Game } from "../../Game.js";

class SpriteEntity extends Entity {
    constructor(textureString, tiled = false) {
        super();

        const texture = PIXI.Assets.get(textureString);

        if (tiled) {
            texture.source.scaleMode = "nearest";
            this.sprite = new PIXI.TilingSprite(texture);
        } else {
            this.sprite = new PIXI.Sprite(texture);
        }

        this.sprite.anchor.x = 0.5;
        this.sprite.anchor.y = 0.5;
        this.setNode(this.sprite);
    }
    getAnchor() {
        return this.sprite.anchor;
    }
    setAnchor(x, y) {
        this.sprite.anchor.x = x;
        this.sprite.anchor.y = y;
    }
    getTint() {
        return this.node.tint;
    }
    setTint(tint) {
        this.node.tint = tint;
    }
    getBlendMode() {
        return this.node.tint;
    }
    setBlendMode(blendMode) {
        this.node.blendMode = blendMode;
    }
    getMask() {
        return this.node.mask;
    }
    setMask(entity) {
        this.node.mask = entity.getNode();
    }
    setDimensions(x, y, width, height) {
        this.sprite.x = x;
        this.sprite.y = y;
        this.sprite.width = width;
        this.sprite.height = height;
    }
    setParent(parent) {
        super.setParent(parent);

        if (parent == null) this.sprite.destroy();
    }
}
export { SpriteEntity };