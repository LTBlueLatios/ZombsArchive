import { Game } from "../Game.js";
import { UiComponent } from "./UiComponent.js";

class UiPopupOverlay extends UiComponent {
    constructor() {
        let popupOverlayDiv = document.createElement("div");
        popupOverlayDiv.className = "hud-popup-overlay";
        document.getElementById("hud").appendChild(popupOverlayDiv);


        super(popupOverlayDiv);
        this.popupElems = {};
        this.popupTimers = {};
        this.hintMessages = {};

        this.confirmationOverlayDiv = document.createElement("div");
        this.confirmationOverlayDiv.className = "hud-confirmation-overlay";
        document.getElementById("hud").appendChild(this.confirmationOverlayDiv);

        this.confirmationMessages = {};
    }

    init() {
        Game.eventEmitter.on("FailureRpcReceived", this.onFailure.bind(this));
    }

    onFailure(data) {
        this.showHint(data.failure, 4000);
    }

    showHint(message, timeoutInMs = 8000) {
        for (const popupId in this.hintMessages) {
            if (this.hintMessages[popupId] == message) return null;
        }

        const popupId = Math.round(Math.random() * 10000000);

        const popupElem = document.createElement("div");
        popupElem.className = "hud-popup-message hud-popup-hint is-visible";
        popupElem.textContent = message;
        this.element.insertBefore(popupElem, this.element.firstChild);

        this.popupElems[popupId] = popupElem;
        this.popupTimers[popupId] = setTimeout(() => {
            this.removePopup(popupId);
        }, timeoutInMs);
        this.hintMessages[popupId] = message;
        return popupId;
    }

    showTutorialMessage(message) {
        const popupId = Math.round(Math.random() * 10000000);
        const popupElem = document.createElement("div")
        popupElem.className = "hud-popup-confirmation is-tutorial is-visible";
        popupElem.innerHTML = `
        <span style="font-size: 16px; white-space: break-spaces;">${message}</span>
        <a class="hud-skip-tutorial">Skip Tutorial</a>
        `
        // TODO
        //  <img style="position: absolute; top: 10px; right: 10px; height: 100px; width: 100px;"></img>
        this.confirmationOverlayDiv.prepend(popupElem);

        popupElem.querySelectorAll(".hud-skip-tutorial")[0].addEventListener("mousedown", event => {
            event.stopPropagation();
        });

        popupElem.querySelectorAll(".hud-skip-tutorial")[0].addEventListener("mouseup", event => {
            event.stopPropagation();
            Game.ui.components.uiTutorial.stopTutorial();
            window.storage.setItem("settings-skip-tutorial", "true");
        })

        this.popupElems[popupId] = popupElem;

        return popupId;
    }

    showConfirmation(message, timeoutInMs = 30000, acceptCallback = null, declineCallback = null, forceRepeats = false) {
        // Some confirmation messages can be repeated (for example multiple party requests from players with the same name)
        if (forceRepeats == false) {
            for (const popupId in this.confirmationMessages) {
                if (this.confirmationMessages[popupId] == message) return null;
            }
        }

        const popupId = Math.round(Math.random() * 10000000);
        const popupElem = document.createElement("div")
        popupElem.className = "hud-popup-confirmation is-visible";
        popupElem.innerHTML = `
        <span>${message}</span>
        <div class="hud-confirmation-actions">
            <a class="btn btn-green hud-confirmation-accept">&check;</a>
            <a class="btn btn-red hud-confirmation-decline">&cross;</a>
        </div>
        `
        popupElem.addEventListener("mousedown", event => event.stopPropagation());
        this.confirmationOverlayDiv.appendChild(popupElem);

        this.popupElems[popupId] = popupElem;

        const acceptDiv = popupElem.querySelector(".hud-confirmation-accept");
        const declineDiv = popupElem.querySelector(".hud-confirmation-decline");

        acceptDiv.addEventListener("mousedown", event => event.stopPropagation());
        acceptDiv.addEventListener("click", event => {
            event.stopPropagation();
            this.removePopup(popupId);
            if (acceptCallback) acceptCallback();
        });

        declineDiv.addEventListener("mousedown", event => event.stopPropagation());
        declineDiv.addEventListener("click", event => {
            event.stopPropagation();
            this.removePopup(popupId);
            if (declineCallback) declineCallback();
        });

        this.popupTimers[popupId] = setTimeout(() => {
            this.removePopup(popupId);
        }, timeoutInMs);

        this.confirmationMessages[popupId] = message;

        return popupId;
    }

    removePopup(popupId) {
        const popupElem = this.popupElems[popupId];
        if (!popupElem) return;
        if (this.popupTimers[popupId]) clearInterval(this.popupTimers[popupId]);
        delete this.popupElems[popupId];
        delete this.popupTimers[popupId];
        delete this.confirmationMessages[popupId];
        delete this.hintMessages[popupId];
        popupElem.classList.remove("is-visible");
        setTimeout(() => {
            popupElem.remove();
        }, 500);
    }
}

export { UiPopupOverlay };