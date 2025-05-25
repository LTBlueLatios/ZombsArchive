import { UiComponent } from "./UiComponent.js";
import { Game } from "../Game.js";
import { Util } from "../Util.js";

class UiShopItem extends UiComponent {
    constructor(tool, itemClass) {
        const toolDiv = document.createElement("div");
        toolDiv.className = "hud-shop-item";
        toolDiv.setAttribute("item-type", itemClass);
        super(toolDiv);

        this.disabled = false;
        this.toolData = tool;
        // The ZombieShield only has 1 image for all of its tiers so it needs an exception
        if (tool.name == "ZombieShield") {
            this.element.innerHTML = `
            <img class="hud-shop-info-preview" src="./asset/images/Ui/Icons/Armour/ZombieShield.svg">
            <strong style="font-size:20px;margin-left: 5px;">${tool.name.split(/(?=[A-Z])/).join(" ")}</strong> <small class="hud-shop-item-tier" style="color: rgba(255, 255, 255, 0.4); font-size: 12px;">Tier 1</small>
            <div class="hud-shop-item-cost"></div>
            `;
        } else {
            this.element.innerHTML = `
            <img class="hud-shop-info-preview" src="./asset/images/Ui/Icons/Tools/${tool.name}${tool.tiers > 0 ? "Tier1" : ""}.svg">
            <strong style="font-size:20px;margin-left: 5px;">${tool.name.split(/(?=[A-Z])/).join(" ")}</strong> <small class="hud-shop-item-tier" style="color: rgba(255, 255, 255, 0.4); font-size: 12px;">Tier 1</small>
            <div class="hud-shop-item-cost"></div>
            `;
        }

        this.tierElem = this.element.querySelector(".hud-shop-item-tier");
        this.previewElem = this.element.querySelector(".hud-shop-info-preview");
        this.costElem = this.element.querySelector(".hud-shop-item-cost");

        this.tier = 0;
        this.tiers = tool.tiers;

        this.element.addEventListener("click", this.onClick.bind(this));
        this.element.addEventListener("mousedown", this.onMouseDown);

        this.element.addEventListener("mouseenter", () => {
            Game.ui.components.uiMenuGridShop.shopInfo.setTargetItem(this.toolData, this.tier);
        });

        this.element.addEventListener("mouseleave", () => {
            Game.ui.components.uiMenuGridShop.shopInfo.setTargetItem(null);
        });

        this.update();
    }

    init() {
        Game.eventEmitter.on("SetToolRpcReceived", response => {
            for (let res of response) {
                if (res.toolName == this.toolData.name) this.update(res.toolTier);
            }
        });

        Game.eventEmitter.on("PlayerTickUpdated", this.updateResourceCosts.bind(this));
    }

    onClick() {
        if (this.disabled) return;
        Game.network.sendRpc({
            name: "BuyTool",
            toolName: this.toolData.name
        });
    }

    onMouseDown(event) {
        event.stopPropagation();
        event.preventDefault();
    }

    update(tier = 0) {
        this.tier = tier;

        const maxTier = tier >= this.tiers;
        const nextTier = maxTier ? tier : tier + 1;
        this.element.classList[maxTier ? "add" : "remove"]("is-disabled");
        this.disabled = maxTier;

        // The ZombieShield only has 1 image for all its tiers so it requires an exception
        if (this.toolData.name == "ZombieShield") {
            this.previewElem.src = `./asset/images/Ui/Icons/Armour/ZombieShield.svg`;
        } else {
            this.previewElem.src = `./asset/images/Ui/Icons/Tools/${this.toolData.name}${this.tiers > 0 ? `Tier${tier == 0 ? 1 : nextTier}` : ""}.svg`;
        }

        this.tierElem.textContent = tier == 0 ? "Not Purchased" : `Tier ${nextTier}`;

        this.updateResourceCosts();
    }

    updateResourceCosts() {
        const maxTier = this.tier >= (this.tiers || 1);
        const nextTier = maxTier ? this.tier : this.tier + 1;

        this.costElem.innerHTML = `<small>${Util.createResourceCostString(this.toolData, nextTier, 1, maxTier ? false : true).elem.split(", ").join("<br>")}</small>`
    }
}

export { UiShopItem };