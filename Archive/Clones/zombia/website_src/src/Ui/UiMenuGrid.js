import { UiComponent } from "./UiComponent.js";

class UiMenuGrid extends UiComponent {
    constructor(type) {
        let menuGrid = document.createElement("div");
        menuGrid.className = "hud-grid";
        menuGrid.setAttribute("grid-type", type);

        super(menuGrid);

        this.type = type;

        this.element.addEventListener("mousedown", this.onMouseDown);
        this.element.addEventListener("mouseup", this.onMouseUp);
    }

    onMouseDown(event) {
        event.stopPropagation();
    }

    onMouseUp(event) {
        event.stopPropagation();
    }
}

export { UiMenuGrid };