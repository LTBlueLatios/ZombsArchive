import { DrawEntity } from "./DrawEntity.js";
import { ModelEntity } from "./ModelEntity.js";

class RangeIndicatorModel extends ModelEntity {
    constructor(args) {
        super();
        this.goldRegion = new DrawEntity();
        this.goldRegion.setAlpha(0.1);
        this.goldRegion.setRotation(-90);

        if (args.isTriangular) {
            this.goldRegion.drawTriangle(
                { x: 0, y: 0 },
                { x: args.range, y: -args.maxYawDeviation },
                { x: args.range, y: args.maxYawDeviation },
                args.fill || { r: 200, g: 160, b: 0 },
                args.lineFill || { r: 255, g: 200, b: 0 },
                8
            );
        } else if (args.isCircular) {
            this.goldRegion.drawCircle(0, 0, args.radius, args.fill || { r: 200, g: 160, b: 0 }, args.lineFill || { r: 255, g: 200, b: 0 }, 8);
        } else {
            this.goldRegion.drawRect(-args.width / 2, -args.height / 2, args.width / 2, args.height / 2, args.fill || {
                r: 200,
                g: 160,
                b: 0
            }, args.lineFill || {
                r: 255,
                g: 200,
                b: 0
            }, args.lineWidth || 8)
        }
        this.addAttachment(this.goldRegion);
    }
}

export { RangeIndicatorModel };