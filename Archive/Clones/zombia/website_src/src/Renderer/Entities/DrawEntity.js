import * as PIXI from "pixi.js";
import { Game } from "../../Game.js";
import { Entity } from "./Entity.js";

class DrawEntity extends Entity {
    constructor() {
        super();
        this.draw = new PIXI.Graphics();
        this.clear();
        this.setNode(this.draw);
    }
    drawTriangle(point0, point1, point2, fill = null, lineFill = null, lineWidth = null) {
        this.draw.poly([point0.x, point0.y, point1.x, point1.y, point2.x, point2.y]);
        if (fill) this.draw.fill({ color: (fill.r << 16) | (fill.g << 8) | (fill.b), alpha: fill.a == undefined ? 1 : fill.a });
        if (lineWidth && lineWidth > 0) this.draw.stroke({ width: lineWidth, color: (lineFill.r << 16) | (lineFill.g << 8) | (lineFill.b), alpha: lineFill.a == undefined ? 1 : fill.a });
    }
    drawArc(cx, cy, radius, startAngle, endAngle, antiClockwise, fill = null, lineFill = null, lineWidth = null) {
        this.draw.arc(cx, cy, radius, startAngle, endAngle, antiClockwise);
        if (fill) this.draw.fill({ color: (fill.r << 16) | (fill.g << 8) | (fill.b), alpha: fill.a == undefined ? 1 : fill.a });
        if (lineWidth && lineWidth > 0) this.draw.stroke({ width: lineWidth, color: (lineFill.r << 16) | (lineFill.g << 8) | (lineFill.b), alpha: lineFill.a == undefined ? 1 : fill.a });

        startAngle *= Math.PI / 180.0;
        endAngle *= Math.PI / 180.0;
    }
    drawCircle(x, y, radius, fill = null, lineFill = null, lineWidth = null) {
        this.draw.circle(x, y, radius);
        if (fill) this.draw.fill({ color: (fill.r << 16) | (fill.g << 8) | (fill.b), alpha: fill.a == undefined ? 1 : fill.a });
        if (lineWidth && lineWidth > 0) this.draw.stroke({ width: lineWidth, color: (lineFill.r << 16) | (lineFill.g << 8) | (lineFill.b), alpha: lineFill.a == undefined ? 1 : fill.a });
    }
    drawRect(x1, y1, x2, y2, fill = null, lineFill = null, lineWidth = null, alpha = 1) {
        this.draw.rect(x1, y1, x2 - x1, y2 - y1);
        if (fill) this.draw.fill({ color: (fill.r << 16) | (fill.g << 8) | (fill.b), alpha });
        if (lineWidth && lineWidth > 0) this.draw.stroke({ width: lineWidth, color: (lineFill.r << 16) | (lineFill.g << 8) | (lineFill.b)});
    }
    drawRoundedRect(x1, y1, x2, y2, radius, fill = null, lineFill = null, lineWidth = null, alpha = 1) {
        this.draw.roundRect(x1, y1, x2 - x1, y2 - y1, radius);
        if (fill) this.draw.fill({ color: (fill.r << 16) | (fill.g << 8) | (fill.b), alpha });
        if (lineWidth && lineWidth > 0) this.draw.stroke({ width: lineWidth, color: (lineFill.r << 16) | (lineFill.g << 8) | (lineFill.b)});
    }
    drawEllipse(x, y, width, height, fill = null, lineFill = null, lineWidth = null) {
        this.draw.ellipse(x, y, width, height);
        if (fill) this.draw.fill({ color: (fill.r << 16) | (fill.g << 8) | (fill.b), alpha: fill.a == undefined ? 1 : fill.a });
        if (lineWidth && lineWidth > 0) this.draw.stroke({ width: lineWidth, color: (lineFill.r << 16) | (lineFill.g << 8) | (lineFill.b), alpha: lineFill.a == undefined ? 1 : fill.a });
    }
    getTexture() {
        return Game.renderer.getInternalRenderer().generateTexture(this.draw);
    }
    clear() {
        this.draw.clear();
    }
    setParent(parent) {
        super.setParent(parent);

        if (parent == null) this.draw.destroy();
    }
}
export { DrawEntity };