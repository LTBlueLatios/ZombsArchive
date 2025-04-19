import { Game } from "../Game";
import { UiComponent } from "./UiComponent";

class UiMenuGridShopInfo extends UiComponent {
    constructor() {
        super(document.getElementById("hud-shop-info"));

        this.targetItem = null;
        this.statsElem = null;

        Game.eventEmitter.on("SetToolRpcReceived", response => {
            if (this.targetItem !== null) {
                for (let res of response) {
                    if (res.toolName == this.targetItem.name) this.updateItemStats(res.toolTier);
                }
            }
        });
    }

    setTargetItem(item, tier) {
        this.targetItem = item;

        if (item !== null) {
            this.element.innerHTML = `
            <strong id="hud-shop-info-name">${item.name.split(/(?=[A-Z])/).join(" ")} <small class="hud-shop-info-tier" style="color: rgba(255, 255, 255, 0.4); font-size: 12px;">Tier 1</small></strong>
            <img class="hud-shop-info-preview shop-info" src="./asset/images/Ui/Icons/Tools/${item.name}${item.tiers > 0 ? "Tier1" : ""}.svg">
            <div class="hud-shop-item-description">${item.description || ""}</div>
            <div class="hud-shop-item-stats"></div>
            `;

            this.statsElem = this.element.querySelector(".hud-shop-item-stats");

            this.updateItemStats(tier);
        } else {
            this.element.innerHTML = "";
        }

    }

    updateItemStats(tier) {
        const maxTier = tier >= (this.targetItem.tiers || 1);
        this.element.classList[maxTier ? "add" : "remove"]("is-disabled");
        this.disabled = maxTier;

        const requiredInfo = {
            "Range": "towerRadius",
            "Damage to zombies": "damageToZombies",
            "Damage to buildings": "damageToBuildings",
            "Damage to players": "damageToPlayers",
            "Harvest Amount": "harvestAmount",
            "Firing Rate": "msBetweenFires",
            "Health Regen/sec": "healthRegenPerSecond",
            "Max Health": "health"
        }

        let currentStats = "";
        const nextTier = maxTier ? tier : tier + 1;
        let nextStats = "";

        for (const dataKey in requiredInfo) {
            if (!this.targetItem[requiredInfo[dataKey]]) continue;

            if (this.targetItem.name == "Sword" && dataKey == "Damage to buildings") {
                let currentTierData = this.targetItem[requiredInfo[dataKey]][tier - 1] * 100;
                if (isNaN(currentTierData)) currentTierData = "&mdash;";
                else currentTierData = currentTierData + "%";

                let nextTierData = this.targetItem[requiredInfo[dataKey]][nextTier - 1] * 100;
                if (isNaN(nextTierData)) nextTierData = "&mdash;";
                else nextTierData = nextTierData + "%";

                currentStats += `<p>${dataKey}: <strong class="hud-stats-current">${currentTierData}</strong></p>`;
                nextStats += `<p>${dataKey}: <strong class="hud-stats-next">${nextTierData}</strong></p>`;
            } else {
                currentStats += `<p>${dataKey}: <strong class="hud-stats-current">${this.targetItem[requiredInfo[dataKey]][tier - 1] || "&mdash;"}</strong></p>`;
                nextStats += `<p>${dataKey}: <strong class="hud-stats-next">${this.targetItem[requiredInfo[dataKey]][nextTier - 1]}</strong></p>`;
            }
        }

        if (currentStats !== "" && nextStats !== "") {
            this.statsElem.innerHTML =
            `<div class="hud-stats-current hud-stats-values">${currentStats}</div>
            <div class="hud-stats-next hud-stats-values">${nextStats}</div>`;
        } else {
            this.statsElem.innerHTML = "";
        }

        if (this.targetItem.name == "ZombieShield") {
            document.getElementsByClassName("hud-shop-info-preview shop-info")[0].src = `./asset/images/Ui/Icons/Armour/ZombieShield.svg`;
            document.getElementsByClassName("hud-shop-info-tier")[0].innerHTML = tier == 0 ? "Not Purchased" : `Tier ${nextTier}`;
        } else {
            if (tier == 0)  {
                document.getElementsByClassName("hud-shop-info-tier")[0].innerHTML = `Tier 1`;
                document.getElementsByClassName("hud-shop-info-preview shop-info")[0].src = `./asset/images/Ui/Icons/Tools/${this.targetItem.name}Tier1.svg`;
            } else {
                document.getElementsByClassName("hud-shop-info-tier")[0].innerHTML = `Tier ${nextTier}`;
                document.getElementsByClassName("hud-shop-info-preview shop-info")[0].src = `./asset/images/Ui/Icons/Tools/${this.targetItem.name}Tier${nextTier}.svg`;
            }
        }
    }
}

export { UiMenuGridShopInfo };