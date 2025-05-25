import { DrawEntity } from "./DrawEntity.js";
import { ModelEntity } from "./ModelEntity.js";
import { Game } from "../../Game.js";

class CircleSelectorIndicatorModel extends ModelEntity {
    constructor(args) {
        super();
        this.circleRegion = new DrawEntity();
        this.circleRegion.setAlpha(0.1);
        this.addAttachment(this.circleRegion);

        this.args = args;
        this.minRadius = args.radius - 10;
        this.maxRadius = args.radius + 10;
        this.currentRadius = this.minRadius;
        this.increasingSize = true;
    }

    update(dt, tick) {
        super.update(dt, tick);

        if (this.isVisible == false) return;

        this.circleRegion.clear();

        if (this.increasingSize == true) {
            if (this.currentRadius >= this.maxRadius) {
                this.increasingSize = false;
            } else {
                this.currentRadius += 0.2;
            }
        } else {
            if (this.currentRadius <= this.minRadius) {
                this.increasingSize = true;
            } else {
                this.currentRadius -= 0.2;
            }
        }

        this.circleRegion.drawCircle(0, 0, this.currentRadius,
            this.args.fill || {
                r: 255,
                g: 255,
                b: 255,
                a: 0
            },
            this.args.lineFill || {
                r: 255,
                g: 255,
                b: 255
            },
            this.args.lineWidth || 8
        )
    }
}

export { CircleSelectorIndicatorModel };