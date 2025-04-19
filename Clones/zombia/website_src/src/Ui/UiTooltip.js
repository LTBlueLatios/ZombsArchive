import { Game } from "../Game.js";
import { Util } from "../Util.js";
import { UiComponent } from "./UiComponent.js";

class UiTooltip extends UiComponent {
    constructor(direction) {
        const tooltipDiv = `<div id="hud-tooltip" class="hud-tooltip"></div>`;

        document.body.insertAdjacentHTML("beforeend", tooltipDiv);

        super(document.getElementById("hud-tooltip"));

        this.targetElem = null;
        this.direction = direction;
        this.element.classList.add(`hud-tooltip-${direction}`);
    }

    init() {
        Game.eventEmitter.on("PlayerTickUpdated", this.updateText.bind(this));
    }

    hide() {
        this.targetElem = null;

        super.hide();
    }

    moveTo(targetElem) {
        this.targetElem = targetElem;

        this.show();
        this.element.classList.remove(`hud-tooltip-${this.direction}`);

        this.updateText();

        this.element.classList.add(`hud-tooltip-${this.direction}`);

        const elementOffset = targetElem.getBoundingClientRect();
        const tooltipOffset = {
            left: 0,
            top: 0
        };
        if (this.direction == "top") {
            tooltipOffset.left = elementOffset.left + elementOffset.width / 2 - this.element.offsetWidth / 2;
            tooltipOffset.top = elementOffset.top - this.element.offsetHeight - 40;
        } else if (this.direction == "bottom") {
            tooltipOffset.left = elementOffset.left + elementOffset.width / 2 - this.element.offsetWidth / 2;
            tooltipOffset.top = elementOffset.top + elementOffset.height + 35;
        } else if (this.direction == "left") {
            tooltipOffset.left = elementOffset.left - this.element.offsetWidth - 30;
            tooltipOffset.top = elementOffset.top + elementOffset.height / 2 - this.element.offsetHeight / 2;
        } else if (this.direction == "right") {
            tooltipOffset.left = elementOffset.left + elementOffset.width + 30;
            tooltipOffset.top = elementOffset.top + elementOffset.height / 2 - this.element.offsetHeight / 2;
        }
        this.element.style.left = tooltipOffset.left + "px";
        this.element.style.top = tooltipOffset.top + "px";
    }

    updateText() {
        if (this.targetElem == null) return;

        if (this.targetElem.getAttribute("BuildingType") !== null) {
            this.direction = "top";
            const buildingData = Game.ui.buildingData[this.targetElem.getAttribute("BuildingType")];

            if (buildingData !== undefined) {
                this.element.innerHTML = `
                <div class="hud-tooltip-toolbar">
                    <h2>${buildingData.name.split(/(?=[A-Z])/).join(" ")}</h2>
                    <span class="hud-tooltip-built"><strong ${buildingData.built >= buildingData.limit ? "class='hud-resource-low'" : ""}>${buildingData.built}</strong>/${buildingData.limit}</span>
                    <div class="hud-tooltip-body">${buildingData.description}</div>
                    <div class="hud-tooltip-body">${Util.createResourceCostString(buildingData).elem}</div>
                </div>`;
            }
        } else if (this.targetElem.getAttribute("potion-type") !== null) {
            this.direction = "top";
            const potionType = Game.ui.toolData[this.targetElem.getAttribute("potion-type")];

            if (potionType !== undefined) {
                this.element.innerHTML = `
                <div class="hud-tooltip-toolbar">
                    <h2>${potionType.name.split(/(?=[A-Z])/).join(" ")}</h2>
                    <span>${potionType.description}</span>
                    <div class="hud-tooltip-body">${Util.createResourceCostString(potionType).elem}</div>
                </div>`;
            }
        } else if (this.targetElem.getAttribute("item-type") !== null) {
            this.direction = "top";
            const itemType = Game.ui.toolData[this.targetElem.getAttribute("item-type")];

            switch (itemType.name) {
                case "ZombieShield":
                    this.element.innerHTML = `
                    <div class="hud-tooltip-toolbar">
                        <h2>${itemType.name.split(/(?=[A-Z])/).join(" ")}</h2>
                        <h3>Tier ${Game.ui.components.uiArmourIndicator.tier}</h3>
                        <h3>${itemType.description}</h3>
                    </div>`;
                    break;
            }
        } else if (this.targetElem.getAttribute("icon-type") !== null) {
            this.direction = "bottom";
            const iconType = this.targetElem.getAttribute("icon-type");

            this.element.innerHTML = `
            <div class="hud-tooltip-toolbar">
                <h2>${iconType}</h2>
            </div>
            `;
        } else if (this.targetElem.getAttribute("spell-type") !== null) {
            this.direction = "left";
            const spellType = this.targetElem.getAttribute("spell-type");
            let description = "";

            switch (spellType) {
                case "Timeout":
                    description = "Your base is timed out for the next wave.";
                    break;
            }

            this.element.innerHTML = `
            <div class="hud-tooltip-toolbar">
                <h2>${spellType}</h2>
                <h3>${description}</h3>
            </div>
            `;
        } else if (this.targetElem.className == "hud-chat-toggle-channel") {
            this.direction = "bottom";

            this.element.innerHTML = `<div class="hud-tooltip-toolbar">Toggle Chat Channel</div>`;
        }
    }
}

export { UiTooltip };