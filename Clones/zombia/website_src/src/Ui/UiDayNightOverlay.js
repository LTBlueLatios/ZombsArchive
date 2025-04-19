import { Game } from "../Game.js";
import { UiComponent } from "./UiComponent.js";

class UiDayNightOverlay extends UiComponent {
    constructor() {
        const dayNightOverlay = document.createElement("div");
        dayNightOverlay.className = "hud-day-night-overlay";
        dayNightOverlay.id = "hud-day-night-overlay";

        document.getElementById("hud").appendChild(dayNightOverlay);

        super(dayNightOverlay);
    }

    init() {
        Game.eventEmitter.on("EnterWorldResponse", this.onEnterWorld.bind(this));
        Game.eventEmitter.on("RendererUpdated", this.update.bind(this));
    }

    update() {
        if (document.getElementsByClassName("hud-settings-day-night-opacity")[0].checked) {
            this.element.style.opacity = "0";
            return;
        }

        const currentTick = Game.renderer.replicator.getTickIndex();
        
        const isDay = currentTick % this.cycleLength < this.dayLength;
        let dayRatio = 0;
        let nightRatio = 0;
        let nightOverlayOpacity = 0;

        if (isDay == true) {
            let ticksToDayEnd = this.dayLength - currentTick % this.cycleLength;
            dayRatio = 1 - ticksToDayEnd / this.dayLength;

            if (dayRatio < 0.1) {
                nightOverlayOpacity = 0.5 * (1 - dayRatio / 0.1);
            } else if (dayRatio > 0.8) {
                nightOverlayOpacity = 0.5 * ((dayRatio - 0.8) / 0.2);
            } else {
                nightOverlayOpacity = 0;
            }
        } else {
            const ticksToNightEnd = this.nightLength - (currentTick - this.dayLength) % this.cycleLength;
            dayRatio = 1;
            nightRatio = 1 - ticksToNightEnd / this.nightLength;

            if (nightRatio < 0.2) {
                nightOverlayOpacity = 0.5 + 0.5 * (nightRatio / 0.2);
            } else if (nightRatio > 0.8) {
                nightOverlayOpacity = 0.5 + 0.5 * (1 - (nightRatio - 0.8) / 0.2);
            } else {
                nightOverlayOpacity = 1;
            }
        }

        this.element.style.opacity = nightOverlayOpacity.toString();
    }

    onEnterWorld(data) {
        this.nightLength = data.nightLength;
        this.dayLength = data.dayLength;
        this.cycleLength = this.dayLength + this.nightLength;
    }
}

export { UiDayNightOverlay };