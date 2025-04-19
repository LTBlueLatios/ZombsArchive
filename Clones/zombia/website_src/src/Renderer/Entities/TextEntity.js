import * as PIXI from "pixi.js";
import { Entity } from "./Entity.js";

class TextEntity extends Entity {
    constructor(text, options) {
        super();
        this.text = new PIXI.Text({
            text,
            style: new PIXI.TextStyle({
                fontFamily: options.fontFamily, 
                fontSize: options.fontSize,
                lineJoin: "round",
                padding: 10,
                stroke: { color: "#333333", width: options.strokeWidth, join: "round" }
            })
        });
        this.text.resolution = 2 * window.devicePixelRatio;
        this.setNode(this.text);
    }
    setColor(r, g, b) {
        this.text.style.fill = (r << 16) | (g << 8) | b;
    }
    setFontWeight(weight) {
        this.text.style.fontWeight = weight;
    }
    setLetterSpacing(spacing) {
        this.text.style.letterSpacing = spacing;
    }
    setAnchor(x, y) {
        this.text.anchor.set(x, y);
    }
    setString(text) {
        this.text.text = text;
    }
    getString() {
        return this.text.text;
    }
}

export { TextEntity };