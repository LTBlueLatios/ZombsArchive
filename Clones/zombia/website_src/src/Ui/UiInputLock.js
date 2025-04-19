import { UiComponent } from "./UiComponent";

class UiInputLock extends UiComponent {
    constructor() {
        const element = document.createElement("div");
        element.className = "hud-ui-input-lock";
        document.getElementById("hud").appendChild(element);

        super(element);

        this.lockAlertElem = document.createElement("div");
        this.lockAlertElem.className = "hud-ui-input-lock-alert";
        this.lockAlertElem.innerHTML = "<span>Inputs are disabled. Press [G] to re-enable inputs.</span>";

        document.getElementById("hud").appendChild(this.lockAlertElem);

        this.timeVisible = 0;
        this.timeAlerted = 0;
    }

    toggle(enabled) {
        this.element.style.opacity = "1";
        this.element.style.display = "block";

        let timeVisible = Date.now();
        this.timeVisible = timeVisible;

        setTimeout(() => {
            if (timeVisible == this.timeVisible) this.element.style.opacity = "0";
        }, 3000);

        this.element.classList[enabled ? "add" : "remove"]("enabled");
    }

    alert() {
        let timeAlerted = Date.now();
        this.timeAlerted = timeAlerted;

        this.lockAlertElem.style.opacity = "1";

        setTimeout(() => {
            if (timeAlerted == this.timeAlerted) this.lockAlertElem.style.opacity = "0";
        }, 3000);
    }
}

export { UiInputLock };