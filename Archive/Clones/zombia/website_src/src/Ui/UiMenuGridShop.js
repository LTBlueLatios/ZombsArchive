import { Game } from "../Game.js";
import { UiMenuGrid } from "./UiMenuGrid.js";
import { UiShopItem } from "./UiShopItem.js";
import { UiPotion } from "./UiPotion.js";
import { UiMenuGridShopInfo } from "./UiMenuGridShopInfo.js";

class UiMenuGridShop extends UiMenuGrid {
    constructor() {
        super("Shop");

        Game.ui.components.uiMenuGridShop = this;

        this.element.innerHTML = `
        <div class="hud-grid-exit"></div>
        <h3>Shop</h3>
        <div class="hud-shop-tabs">
            <a class="hud-shop-tabs-link">Tools</a>
            <a class="hud-shop-tabs-link">Armour</a>
            <a class="hud-shop-tabs-link">Hats</a>
        </div>
        <div class="hud-shop-items">
            <div id="hud-shop-grid" class="hud-shop-grid"></div>
            <div id="hud-shop-info" class="hud-shop-info"></div>
        </div>
        `;

        this.init();
    }

    init() {
        const tabDivs = this.element.querySelectorAll(".hud-shop-tabs-link");
        for (let tab of tabDivs) {
            tab.addEventListener("mouseup", this.setTab.bind(this, tab));
        }

        Game.eventEmitter.on("ToolDataReceived", () => {
            // Clear the tools made to prevent duplicate items
            document.getElementById("hud-shop-grid").innerHTML = "<h1 id='hud-shop-coming-soon' style='display:none;'>Coming soon</h1>";
            for (const potion of document.querySelectorAll(".hud-ui-potion")) potion.remove();

            const toolData = Game.ui.toolData;
            for (let i in toolData) {
                const tool = toolData[i];

                let toolDiv;

                if (tool.class == "Potion") {
                    toolDiv = new UiPotion(tool);
                } else {
                    toolDiv = new UiShopItem(tool, tool.class);
                    document.getElementById("hud-shop-grid").appendChild(toolDiv.element);
                    toolDiv.init();
                }
            };
            this.setTab(tabDivs[0]);
        });

        setTimeout(() => {
            this.shopInfo = new UiMenuGridShopInfo();
        }, 0);
    }

    setTab(tab) {
        const tabDivs = this.element.querySelectorAll(".hud-shop-tabs-link");
        tab.classList.add("is-active");
        for (let tabDiv of tabDivs) {
            if (tabDiv.textContent !== tab.textContent) tabDiv.classList.remove("is-active");
        }

        const itemDivs = this.element.querySelectorAll(".hud-shop-item");

        let gridHasItem = false;
        for (let itemDiv of itemDivs) {
            if (itemDiv.getAttribute("item-type") == tab.textContent) {
                itemDiv.style.display = "block";
                gridHasItem = true;
            } else {
                itemDiv.style.display = "none";
            }
        }

        document.getElementById("hud-shop-coming-soon").style.display = gridHasItem ? "none" : "block";
    }
}

export { UiMenuGridShop };