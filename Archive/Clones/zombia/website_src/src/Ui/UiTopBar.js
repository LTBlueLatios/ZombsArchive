import { Game } from "../Game.js";
import { UiComponent } from "./UiComponent.js";
import { UiToolButton } from "./UiToolButton.js";
import { UiMenuIcon } from "./UiMenuIcon.js";

class UiTopBar extends UiComponent {
    constructor() {
        let topBarDiv = document.createElement("div");
        topBarDiv.className = "hud-top-bar";
        topBarDiv.innerHTML = `
        <div id="hud-top-bar-left" class="hud-top-bar-left"></div>
        <div id="hud-top-bar-tools" class="hud-top-bar-tools"></div>
        <div id="hud-top-bar-right" class="hud-top-bar-right"></div>
        `;
        document.getElementById("hud-top").appendChild(topBarDiv);
        super(topBarDiv);
        this.tools = {};
    }

    init() {
        this.menuIcons = {};
        for (const type of ["Shop", "Settings"]) {
            const icon = new UiMenuIcon(type);
            document.getElementById("hud-top-bar-left").appendChild(icon.element);
            this.menuIcons[type] = icon;
        }

        for (const type of ["Spells", "Parties"]) {
            const icon = new UiMenuIcon(type);
            document.getElementById("hud-top-bar-right").appendChild(icon.element);
            this.menuIcons[type] = icon;
        }

        for (let i in this.menuIcons) {
            this.menuIcons[i].element.addEventListener("mouseenter", () => {
                Game.ui.components["uiBuildingBar"].buildingTooltip.moveTo(this.menuIcons[i].element);
            });
    
            this.menuIcons[i].element.addEventListener("mouseleave", () => {
                Game.ui.components["uiBuildingBar"].buildingTooltip.hide();
            });
        }

        Game.eventEmitter.on("ToolDataReceived", this.onToolDataReceived.bind(this));
        Game.eventEmitter.on("81Up", this.onToggleWeapon.bind(this));
        Game.eventEmitter.on("SetToolRpcReceived", response => {
            for (const res of response) {
                if (this.tools[res.toolName] !== undefined) this.tools[res.toolName] = res.toolTier > 0;
            }
        });
    }

    onToolDataReceived() {
        this.tools = {};
        const toolData = Game.ui.toolData;

        const toolsDiv = document.getElementById("hud-top-bar-tools");
        toolsDiv.innerHTML = "";

        for (let i in toolData) {
            const tool = toolData[i];

            if (tool.class !== "Tools") continue;

            this.tools[tool.name] = false;

            const toolButton = new UiToolButton(tool.name);
            toolsDiv.appendChild(toolButton.element);
            toolButton.init();
        }
    }

    onToggleWeapon() {
        const ownedTools = [];

        for (let i in this.tools) if (this.tools[i] === true) ownedTools.push(i);

        let nextTool = ownedTools[0];
        let foundCurrent = false;
        for (let tool of ownedTools) {
            if (foundCurrent) {
                nextTool = tool;
                break;
            } else if (tool == Game.ui.playerTick.weaponName) foundCurrent = true;
        }

        if (nextTool === Game.ui.playerTick.weaponName) return;

        Game.network.sendRpc({
            name: "EquipTool",
            toolName: nextTool
        });
    }
}

export { UiTopBar };