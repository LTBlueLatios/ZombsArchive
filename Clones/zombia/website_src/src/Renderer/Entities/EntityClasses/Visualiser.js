import { TextEntity } from "../TextEntity.js";
import { ModelEntity } from "../ModelEntity.js";

class Visualiser extends ModelEntity {
    constructor(targetTick) {
        super();
        this.text = new TextEntity("↑", { fontFamily: "Hammersmith One", fontSize: 20 });
        this.addAttachment(this.text);
        this.setRotation(targetTick.yaw);
        targetTick.position.x += 24;
        targetTick.position.y += 24;
    }
}

export { Visualiser };