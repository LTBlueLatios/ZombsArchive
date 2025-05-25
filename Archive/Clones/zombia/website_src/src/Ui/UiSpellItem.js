import { UiComponent } from "./UiComponent.js";
import { DrawEntity } from "../Renderer/Entities/DrawEntity.js";
import { Game } from "../Game.js";
import { Util } from "../Util.js";

class UiSpellItem extends UiComponent {
    constructor(spell) {
        const spellDiv = document.createElement("div");
        spellDiv.className = "hud-spells-item";
        super(spellDiv);

        this.disabled = false;
        this.spellData = spell;
        this.element.innerHTML = `
        <img class="hud-spells-item-preview" src="./asset/images/Ui/Icons/Spells/${spell.name}${spell.tiers > 0 ? "Tier1" : ""}.svg">
        <strong>${spell.name.split(/(?=[A-Z])/).join(" ")}</strong> <small class="hud-spells-item-tier" style="color: rgba(255, 255, 255, 0.4); font-size: 12px;">Tier 1</small>
        <div class="hud-spells-item-description">${spell.description || ""}</div>
        <div class="hud-spells-item-stats"></div>
        <div class="hud-spells-item-cost"></div>
        `;

        this.tierElem = this.element.querySelector(".hud-spells-item-tier");
        this.previewElem = this.element.querySelector(".hud-spells-item-preview");
        this.statsElem = this.element.querySelector(".hud-spells-item-stats");
        this.costElem = this.element.querySelector(".hud-spells-item-cost");

        this.element.addEventListener("click", this.onClick.bind(this));
        this.element.addEventListener("mousedown", this.onMouseDown);

        this.update();

        this.castingSpell = false;

        if (this.spellData.name == "Rapidfire") {
            this.spellIndicatorModel = new DrawEntity();
            this.spellIndicatorModel.setAlpha(0.1);
            this.spellIndicatorModel.setVisible(false);
            Game.renderer.uiLayer.addAttachment(this.spellIndicatorModel);
        }
    }

    init() {
        Game.eventEmitter.on("CastSpellResponseRpcReceived", response => {
            if (response.name == this.spellData.name) {
                this.disabled = true;
                this.element.classList.add("is-disabled");

                setTimeout(() => {
                    this.disabled = false;
                    this.element.classList.remove("is-disabled");
                }, response.cooldown);
            }
        });

        Game.eventEmitter.on("ClearActiveSpellRpcReceived", response => {
            if (response.name == this.spellData.name) {
                this.disabled = false;
                this.element.classList.remove("is-disabled");
            }
        });

        Game.eventEmitter.on("PlayerTickUpdated", this.updateResourceCosts.bind(this));
        Game.eventEmitter.on("CameraUpdate", this.updateSpellIndicator.bind(this));
        Game.eventEmitter.on("mouseMoved", this.updateSpellIndicator.bind(this));
        Game.eventEmitter.on("mouseUp", this.onMouseUp.bind(this));

        Game.eventEmitter.on("rightMouseUp", this.stopCasting.bind(this));
        Game.eventEmitter.on("27Up", this.stopCasting.bind(this));
    }

    onClick() {
        if (this.disabled) return;

        if (process.env.NODE_ENV == "development") {
            if (this.spellData.name == "Rapidfire") {
                if (Game.ui.getFactory() == null) return;

                this.startCasting();

                return;
            }
        } else {
            if (this.spellData.name == "Rapidfire") {
                if (!Util.canAfford(Game.ui.playerTick, this.spellData)) return;
                if (Game.ui.getFactory() == null) return;

                this.startCasting();

                return;
            }
        }

        Game.network.sendRpc({
            name: "CastSpell",
            spellName: this.spellData.name,
            x: 0,
            y: 0
        });
    }

    onMouseUp(event) {
        if (this.castingSpell == true) {
            this.stopCasting(undefined, false);

            const mousePosition = Game.ui.mousePosition;
            const worldPos = Game.renderer.screenToWorld(mousePosition.x, mousePosition.y);

            Game.network.sendRpc({
                name: "CastSpell",
                spellName: this.spellData.name,
                x: Math.floor(worldPos.x),
                y: Math.floor(worldPos.y)
            });
        }
    }

    onMouseDown(event) {
        event.stopPropagation();
        event.preventDefault();
    }

    startCasting() {
        if (this.castingSpell == true) return;

        this.castingSpell = true;
        Game.ui.castingSpell = true;

        this.spellIndicatorModel.setVisible(true);

        this.spellIndicatorModel.drawCircle(0, 0, this.spellData.radius, { r: 120, g: 120, b: 120 }, { r: 255, g: 255, b: 255 }, 8);
        this.updateSpellIndicator();

        Game.ui.components.uiMenuGridSpells.hide();
    }

    stopCasting(event, cancelled = true) {
        if (this.castingSpell == false) return;

        this.castingSpell = false;
        Game.ui.castingSpell = false;

        this.spellIndicatorModel.clear();
        this.spellIndicatorModel.setVisible(false);

        // If the spell was used, we don't show the menu, but if it was cancelled, we do show it
        if (cancelled == true) Game.ui.components.uiMenuGridSpells.show();
    }

    updateSpellIndicator() {
        if (this.spellIndicatorModel == undefined || this.castingSpell == false) return;

        const mousePosition = Game.ui.mousePosition;
        const worldPos = Game.renderer.screenToWorld(mousePosition.x, mousePosition.y);
        const uiPos = Game.renderer.worldToUi(worldPos.x, worldPos.y);
        this.spellIndicatorModel.setPosition(uiPos.x, uiPos.y);
    }

    update(tier = 0) {
        const maxTier = tier >= (this.spellData.tiers || 1);
        this.element.classList[maxTier ? "add" : "remove"]("is-disabled");
        this.disabled = maxTier;

        const requiredInfo = {}

        let currentStats = "";
        const nextTier = maxTier ? tier : tier + 1;
        let nextStats = "";

        for (const dataKey in requiredInfo) {
            if (!this.spellData[requiredInfo[dataKey]]) continue;
            currentStats += `<p>${dataKey}: <strong class="hud-stats-current">${this.spellData[requiredInfo[dataKey]][tier - 1] || "&mdash;"}</strong></p>`;
            nextStats += `<p>${dataKey}: <strong class="hud-stats-next">${this.spellData[requiredInfo[dataKey]][nextTier - 1]}</strong></p>`;
        }

        if (currentStats !== "" && nextStats !== "") {
            this.statsElem.innerHTML =
            `<div class="hud-stats-current hud-stats-values">${currentStats}</div>
            <div class="hud-stats-next hud-stats-values">${nextStats}</div>`;
        } else {
            this.statsElem.innerHTML = "";
        }

        this.previewElem = this.element.querySelector(".hud-spells-item-preview").src = `./asset/images/Ui/Icons/Spells/${this.spellData.name}${this.spellData.tiers > 0 ? `Tier${nextTier}` : ""}.svg`;

        if (this.spellData.tiers !== undefined) this.tierElem.textContent = `Tier ${nextTier}`;
        else this.tierElem.textContent = "";

        this.updateResourceCosts();
    }

    updateResourceCosts() {
        const maxTier = this.tier >= (this.spellData.tiers || 1);
        const nextTier = maxTier ? this.tier : this.tier + 1;

        this.costElem.innerHTML = `<small>${Util.createResourceCostString(this.spellData, nextTier, 1, true).elem.split(", ").join("<br>")}</small>`
    }
}

export { UiSpellItem };