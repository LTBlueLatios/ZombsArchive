import { Game } from "../Game.js";
import { UiComponent } from "./UiComponent.js";

class UiToolButton extends UiComponent {
    constructor(type) {
        const toolButton = document.createElement("div");
        toolButton.className = "hud-tool";
        super(toolButton);
        this.type = type;

        this.element.addEventListener("click", this.onClick.bind(this));
        this.element.addEventListener("mousedown", this.onMouseDown);

        this.update();
    }

    init() {
        Game.eventEmitter.on("SetToolRpcReceived", response => {
            for (let res of response) {
                if (res.toolName == this.type) this.update(res.toolTier);
            }
        });
    }

    onClick() {
        Game.network.sendRpc({
            name: "EquipTool",
            toolName: this.type
        });
    }

    onMouseDown(event) {
        event.stopPropagation();
        event.preventDefault();
    }

    update(tier = 0) {
        this.element.classList[tier > 0 ? "remove" : "add"]("is-empty");

        if (tier > 0) this.element.style["background-image"] = `url('./asset/images/Ui/Icons/Tools/${this.type}Tier${tier}.svg')`;
        else this.element.style["background-image"] = ``;
    }
}

export { UiToolButton };