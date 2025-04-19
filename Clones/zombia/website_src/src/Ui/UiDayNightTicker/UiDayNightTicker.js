import { UiComponent } from "../UiComponent.js";
import { Game } from "../../Game.js";
import { Util } from "../../Util.js";

class UiDayNightTicker extends UiComponent {
    constructor() {
        let dayNightTickerDiv = document.createElement("div");
        dayNightTickerDiv.className = "hud-day-night-ticker";
        document.getElementById("hud-bottom").appendChild(dayNightTickerDiv);
        super(dayNightTickerDiv);

        this.clockCircle = document.createElement("div");
        this.clockCircle.className = "hud-day-night-ticker-clock";
        this.element.appendChild(this.clockCircle);

        this.waveElement = document.createElement("div");
        this.waveElement.className = "hud-day-night-ticker-wave";
        this.element.appendChild(this.waveElement);

        this.lastArmRotation = 0;
        this.announcedNight = false;
    }

    init() {
        Game.eventEmitter.on("EnterWorldResponse", this.onEnterWorld.bind(this));
        Game.eventEmitter.on("RendererUpdated", this.onRendererUpdate.bind(this));

        Game.eventEmitter.on(`waveCountUpdated`, () => {
            this.waveElement.innerHTML = `<span>${Game.ui.getPlayerTick().wave.toLocaleString()}</span>`;
        });
    }

    onEnterWorld(data) {
        this.nightLength = data.nightLength;
        this.dayLength = data.dayLength;
        this.cycleLength = this.dayLength + this.nightLength;

        let dayRatio = this.dayLength / this.cycleLength * 360;

        this.clockCircle.style.background = `conic-gradient(#d6ab35ff 0deg ${dayRatio}deg, #8473d4ff ${dayRatio}deg 0deg)`;
    }

    onRendererUpdate() {
        if (this.cycleLength == undefined) return;
        const currentTick = Game.renderer.replicator.getTickIndex();
        const ticksToCycleEnd = this.cycleLength - currentTick % this.cycleLength;
        const isDay = currentTick % this.cycleLength < this.dayLength;

        if (isDay === true) {
            let ticksToDayEnd = this.dayLength - currentTick % this.cycleLength;
            if (this.announcedNight === false && ticksToDayEnd <= this.dayLength / 5) {
                this.announcedNight = true;
                Game.ui.components.uiAnnouncementOverlay.showAnnouncement("Night is fast approaching. Get to safety...", this.dayLength / 5 * Game.renderer.replicator.msPerTick);
            }
        } else if (isDay === false) {
            this.announcedNight = false;
        }

        const cycleRatio = ticksToCycleEnd / this.cycleLength * 360;
        if (cycleRatio < 0) return;

        const angleInterpolated = Util.interpolateYaw(this.lastArmRotation, cycleRatio);
        this.clockCircle.style.rotate = `${angleInterpolated}deg`;
        this.lastArmRotation = angleInterpolated;
    }
}

export { UiDayNightTicker };