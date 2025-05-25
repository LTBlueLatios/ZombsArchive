import { UiComponent } from "./UiComponent";

class UiAnnouncementOverlay extends UiComponent {
    constructor() {
        let announcementOverlay = document.createElement("div");
        announcementOverlay.className = "hud-announcement-overlay";
        document.getElementById("hud").appendChild(announcementOverlay);

        super(announcementOverlay);
    }

    showAnnouncement(message, timeout = 8000) {
        const announcementElem = document.createElement("div");
        announcementElem.className = "hud-announcement-message";
        announcementElem.style["animation-duration"] = `${timeout}ms`;
        announcementElem.innerHTML = message;
        this.element.appendChild(announcementElem);

        setTimeout(() => {
            announcementElem.remove();
        }, timeout);
    }
}

export { UiAnnouncementOverlay };