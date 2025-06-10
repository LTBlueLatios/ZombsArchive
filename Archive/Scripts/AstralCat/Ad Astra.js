// ==UserScript==
// @name         Ad Astra
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Ad astra per aspera
// @author       NigLabs
// @match        *://zombs.io/*
// @match        *://localhost/*
// @icon         https://i.postimg.cc/PJPFGcYJ/shootingstar.png
// @grant        none
// ==/UserScript==

/* STYLE */
let styleString = `
/* Scrollbar */
::-webkit-scrollbar {
    width: 4px;
}
::-webkit-scrollbar-track {
    background: transparent;
}
::-webkit-scrollbar-thumb {
    background-color: #bbb;
}
::-webkit-scrollbar-thumb:hover {
    background-color: #999;
}
::-webkit-scrollbar-thumb:active {
    background-color: #777;
}
/* Intro */
.hud-intro::before {
    background: none;
}
.hud-intro video {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    max-height: 100%;
    max-width: 100%;
    min-height: fit-content;
    min-width: fit-content;
    z-index: -1;
}
.hud-intro::after {
    background: none;
}
.hud-intro .hud-intro-form {
    width: 310px;
    height: 330px;
    margin-top: 8px;
    background-color: none;
}
.hud-intro .hud-intro-form .hud-intro-name {
    color: white;
    border: none;
    border-bottom: 2px solid white;
    border-radius: 0;
    background: radial-gradient(55% 25px at bottom, rgba(125,20,255, 0.8), transparent);
    outline: none;
}
.hud-intro .hud-intro-form .hud-intro-name::placeholder {
    color: #ccc;
}
.hud-intro .hud-intro-form .hud-intro-server {
    color: white;
    border: 0;
    border-bottom: 2px solid white;
    border-radius: 0;
    background: radial-gradient(55% 25px at bottom, rgba(125,20,255, 0.8), transparent);
    outline: none;
}
.hud-intro .hud-intro-form .hud-intro-server.has-error {
    border: 0;
    border-bottom: 2px solid #b6290e;
}
.hud-intro .hud-intro-form .hud-intro-server optgroup {
    line-height: unset;
    color: black;
}
.hud-intro .hud-intro-form .hud-intro-play {
    color: white;
    padding: 1px;
    margin-top: 15px;
}
.hud-intro .hud-intro-guide {
    width: 400px;
    height: 260px;
    margin-top: 15px;
}
.hud-intro .hud-intro-left {
    width: 400px;
    height: 260px;
    margin-top: 15px;
    overflow-y: auto;
}
/* Menus */
#hud-menu-shop {
    top: 60%;
    width: 690px;
    height: 470px;
    margin: -350px 0 0 -350px;
    padding: 20px;
    background: linear-gradient(rgba(20, 150, 255, 0.5), rgba(40, 0, 255, 0.5)) !important;
    z-index: 20;
}
.hud-shop-tabs-link {
    text-align: center;
    background: none !important;
    height: 40px;
    padding: 0;
}
.hud-shop-tabs-link.is-active {
    border-bottom: 2px solid !important;
}
#hud-menu-party {
    width: 610px;
    height: 480px;
    background: linear-gradient(rgba(20, 150, 255, 0.5), rgba(40, 0, 255, 0.5)) !important;
}
.hud-party-tabs-link {
    text-align: center;
    background: none !important;
    height: 40px;
    padding: 0;
}
.hud-party-tabs-link.is-active {
    border-bottom: 2px solid !important;
}
#hud-menu-settings {
    background: linear-gradient(rgba(20, 150, 255, 0.5), rgba(40, 0, 255, 0.5)) !important;
}
#hud-menu-script {
    display: none;
    position: fixed;
    top: 42.5%;
    left: 50%;
    width: 840px;
    height: 720px;
    margin: -300px 0 0 -410px;
    padding: 20px;
    background: linear-gradient(rgba(20, 150, 255, 0.5), rgba(40, 0, 255, 0.5)) !important;
    opacity: 1;
    color: #eee;
    border-radius: 4px;
    z-index: 15;
}
.hud-menu-script h3 {
    margin: 0;
    line-height: 20px;
}
.hud-menu-script .hud-script-box {
    display: flex;
    height: 640px;
    margin: 20px 0 0;
}
.hud-menu-script .hud-script-tabs {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: left;
    width: 15%;
    height: 640px;
    line-height: 40px;
    overflow-y: auto;
}
.hud-menu-script .hud-script-tabs::-webkit-scrollbar {
    display: none;
}
.hud-menu-script .hud-script-tabs a {
    float: left;
    padding: 0 14px 0 3.5px;
    margin: 0 1px 0 0;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.4);
    transition: all 0.15s ease-in-out;
}
.hud-menu-script .hud-script-tabs a.is-active, .hud-menu-script .hud-script-tabs a:hover, .hud-menu-script .hud-script-tabs a:active {
    color: #eee;
}
.hud-script-tabs-link.is-active {
    border-right: 2px solid !important;
}
.hud-script-grid {
    position: relative;
    width: 85%;
    height: 640px;
    padding: 15px;
    background: rgba(0, 0, 0, 0.2);
    overflow-y: auto;
    border-radius: 3px;
}
.hud-script-grid h3 {
    font-family: "Open Sans";
    margin: 0 0 5px;
    width: 520px;
}
.hud-script-grid span {
    display: block;
    width: 520px;
    color: rgba(255, 255, 255, 0.4);
    font-size: 14px;
    white-space: pre-wrap;
    overflow-wrap: break-word;
}
.hud-script-grid button {
    height: 30px;
    width: 100px;
    color: #eee;
    background: rgba(255, 255, 255, 0.2);
    border: none;
    font-family: Helvetica, Arial, sans-serif;
    font-size: 14px;
    border-radius: 3px;
    cursor: pointer;
    transition: all 0.15s ease-in-out;
}
.hud-script-grid button:hover {
    background: rgba(255, 255, 255, 0.4);
}
.hud-script-grid button.is-disabled {
    background: rgba(255, 100, 100, 0.2);
}
.hud-script-grid button.is-disabled:hover {
    background: rgba(255, 100, 100, 0.4);
}
.hud-script-grid input {
    height: 30px;
    width: 100px;
    color: #eee;
    background: none;
    border: none;
    border-bottom: 2px solid rgba(255, 255, 255, 0.6);
    font-family: Helvetica, Arial, sans-serif;
    font-size: 14px;
    text-align: center;
    border-radius: 0;
    padding: 0 6px;
    outline: none;
    transition: all 0.15s ease-in-out;
}
.hud-script-grid input::placeholder {
    color: #bbb;
    text-align: center;
}
.hud-script-grid input:placeholder-shown {
    caret-color: transparent;
}
.hud-script-grid input:focus {
    border-bottom: 2px solid white;
}
.hud-script-item {
    display: block;
    position: relative;
    background: rgba(255, 255, 255, 0.1);
    height: fit-content;
    margin-bottom: 10px;
    padding: 10px;
    border-radius: 3px;
}
.hud-script-item.has-options {
    margin-bottom: 0px;
    border-radius: 3px 3px 0 0;
}
.hud-script-item button {
    position: absolute;
    top: calc(50% - 15px);
    right: 10px;
}
.hud-script-item-options {
    display: block;
    position: relative;
    background: rgba(255, 255, 255, 0.05);
    height: fit-content;
    column-count: 2;
    column-gap: 5px;
    margin-bottom: 10px;
    padding: 10px;
    border-radius: 3px 3px 0 0;
}
.hud-script-item-options div {
    display: flex;
    align-items: center;
    font-size: 14px;
    line-height: 40px;
    padding: 0 5px;
}
.hud-script-item-options span {
    width: unset;
    color: rgba(255, 255, 255, 0.8);
}
.hud-script-item-options button {
    margin-left: auto;
}
.hud-script-item-options input {
    margin-left: auto;
}
.hud-menu-icons .hud-menu-icon[data-type="Script"]::before {
    width: 48px;
    height: 48px;
    top: 0px;
    left: 5px;
    transform: rotate(-15deg);
    background-image: url("https://i.postimg.cc/Dzz5GLDK/comet.png");
}
`;
function applyStyle (styleStr) {
    let style = document.createElement("style");
    style.textContent = styleStr;
    document.head.append(style);
}

/* Intro */
function modifyIntro () {
    document.title = "AD ASTRA - We Build, We Defend, We Survive";
    document.querySelectorAll(".ad-unit, .hud-intro-youtuber, .hud-intro-footer, .hud-intro-stone, .hud-intro-tree, .hud-respawn-corner-bottom-left, .hud-intro-social, .hud-intro-more-games, .hud-intro-form > label, .hud-intro-stone, .hud-intro-tree, .hud-intro-corner-bottom-left, .hud-intro-corner-bottom-right").forEach(elem => elem.remove());
    document.getElementsByClassName("hud-intro")[0].insertAdjacentHTML("afterbegin", `<video autoplay muted loop id="myVideo"><source src="https://ik.imagekit.io/popcatuwu/stars-in-the-universe-4k-live.mp4" type="video/mp4"></video>`);
    document.getElementsByClassName("hud-intro-name")[0].setAttribute("maxlength", 29);
    document.getElementsByClassName("hud-party-tag")[0].setAttribute("maxlength", 49);
    document.getElementsByClassName("hud-chat-input")[0].setAttribute("maxlength", 249);
    document.getElementsByClassName("hud-intro-wrapper")[0].childNodes[1].innerHTML = `<br style="height: 20px;"><Custom><b><font size="23">AD ASTRA</font></b></Custom>`;
    document.getElementsByClassName("hud-intro-wrapper")[0].childNodes[3].innerHTML = "We Build, We Defend, We Survive";
    document.getElementsByClassName("hud-intro-play")[0].classList.remove("btn-green");
}

/* SCRIPT MENU */
// Icon
function loadIcon (icon) {
    icon.classList.add("hud-menu-icon");
    icon.classList.add("hud-script-icon");
    icon.setAttribute("data-type", "Script");
    document.getElementsByClassName("hud-menu-icons")[0].appendChild(icon);
}
// Menu
let menuScript = `
<div id="hud-menu-script" class="hud-menu hud-menu-script">
    <a class="hud-menu-close"></a>
    <h3>Script</h3>
    <div class="hud-script-box">
        <div class="hud-script-tabs">
            <a class="hud-script-tabs-link is-active" data-type="General">General</a>
            <a class="hud-script-tabs-link" data-type="Defense">Defense</a>
            <a class="hud-script-tabs-link" data-type="Sockets">Sockets</a>
            <a class="hud-script-tabs-link" data-type="Bases">Bases</a>
            <a class="hud-script-tabs-link" data-type="Sessions">Sessions</a>
            <a class="hud-script-tabs-link" data-type="Visuals">Visuals</a>
        </div>
        <div class="hud-script-grid"></div>
    </div>
</div>
`;
function loadMenu (menu) {
    document.getElementsByClassName("hud-menu-settings")[0].insertAdjacentHTML("afterend", menu);
}
// Menu behavior
function addScriptMenuEventListeners (targetElem) {
    // Hide when other menu icons are clicked
    game.ui.components.MenuIcons.iconElems.forEach(elem => {
        elem.addEventListener("click", function () {
            targetElem.style.display = "none";
        });
    });
    game.ui.components.PartyIcons.iconElems.forEach(elem => {
        elem.addEventListener("click", function () {
            targetElem.style.display = "none";
        });
    });
    // Vice versa (as well as overlays)
    scriptIconElem.addEventListener("click", function () {
        game.ui.components.BuildingOverlay.stopWatching();
        game.ui.components.PlacementOverlay.cancelPlacing();
        game.ui.components.SpellOverlay.cancelCasting();
        game.ui.components.MenuShop.hide();
        game.ui.components.MenuParty.hide();
        game.ui.components.MenuSettings.hide();
        if (targetElem.style.display == "block") {
            targetElem.style.display = "none";
        } else {
            targetElem.style.display = "block";
        }
    });
    // Tooltip
    scriptIconElem.addEventListener("mouseenter", function () {
        let tooltipHtml = `
        <div id="hud-tooltip" class="hud-tooltip">
            <div class="hud-tooltip-menu-icon">
                <h4>Script</h4>
            </div>
        </div>
        `;
        document.body.insertAdjacentHTML("beforeend", tooltipHtml);
        scriptIconElem.tooltipElem = document.getElementById("hud-tooltip");
        let elementOffset = scriptIconElem.getBoundingClientRect();
        scriptIconElem.tooltipElem.className = "hud-tooltip hud-tooltip-left";
        scriptIconElem.tooltipElem.style.left = (elementOffset.left - scriptIconElem.tooltipElem.offsetWidth - 20) + "px";
        scriptIconElem.tooltipElem.style.top = (elementOffset.top + elementOffset.height / 2 - scriptIconElem.tooltipElem.offsetHeight / 2) + "px";
    });
    scriptIconElem.addEventListener("mouseleave", function () {
        if (scriptIconElem.tooltipElem) {
            scriptIconElem.tooltipElem.remove();
            delete scriptIconElem.tooltipElem;
        }
    });
    // Close button
    targetElem.querySelector(".hud-menu-close").addEventListener("click", function () {
        targetElem.style.display = "none";
    });
    // Hide when UI is clicked
    game.inputManager.on("mouseUp", function () {
        if (!(game.ui.components.Intro.isVisible() || game.ui.components.Reconnect.isVisible() || game.ui.components.Respawn.isVisible())) {
            targetElem.style.display = "none";
        }
    });
    // Hide when other menu hotkeys are pressed
    game.inputManager.on("keyRelease", function (event) {
        let keyCode = event.keyCode;
        let activeTag = document.activeElement.tagName.toLowerCase();
        if ("input" != activeTag && "textarea" != activeTag && !(game.ui.components.Intro.isVisible() || game.ui.components.Reconnect.isVisible() || game.ui.components.Respawn.isVisible())) {
            if (27 === keyCode) {
                targetElem.style.display = "none";
                return;
            }
            if (80 === keyCode) {
                targetElem.style.display = "none";
                return;
            }
            if (66 === keyCode || 79 == keyCode) {
                targetElem.style.display = "none";
                return;
            }
        }
    });
    // Hide when respawn overlay shows
    game.network.addRpcHandler("Dead", function () {
        targetElem.style.display = "none";
    });
    // Hide when a weapon is equipped
    game.ui.on("itemEquippedOrUsed", function (itemId, itemTier) {
        if ("Weapon" === game.ui.itemSchema[itemId].type) {
            targetElem.style.display = "none";
        }
    });
    // Prevents clicking on UI in menu
    targetElem.addEventListener("mousedown", function (event) {
        event.stopPropagation();
    });
    targetElem.addEventListener("mouseup", function (event) {
        event.stopPropagation();
    });
};
// Content
let menuScriptContent = {
    "General": {},
    "Defense": {},
    "Sockets": {},
    "Bases": {},
    "Sessions": {},
    "Visuals": {
        "Zoom": {
            description: "Enables zooming in and out through scrolling.",
            type: "button",
            configName: "zoom",
            callback: toggleZoom,
            options: {
                "Reset zoom": {
                    type: "button",
                    configName: "resetZoom",
                    isCustom: true,
                    text: "Reset",
                    callback: resetZoom
                }
            }
        },
        "Ground": {
            description: "Toggles the rendering of the ground entity (grass).\nRenderer background color can also be changed in the options.",
            type: "button",
            configName: "ground",
            callback: toggleGround,
            options: {
                "Renderer background color": {
                    type: "input",
                    attributes: {
                        "placeholder": "0x222222",
                        "maxLength": 8
                    },
                    configName: "rendererBackgroundColor",
                    callback: setRendererBackgroundColor
                }
            }
        },
        "Projectiles": {
            description: "Toggles the rendering of projectile entities.",
            type: "button",
            configName: "projectiles",
            callback: toggleProjectiles
        },
        "Players": {
            description: "Toggles the rendering of players.",
            type: "button",
            configName: "players",
            callback: togglePlayers
        },
        "NPCs": {
            description: "Toggles the rendering of NPCs.",
            type: "button",
            configName: "npcs",
            callback: toggleNpcs
        },
        "Scenery": {
            description: "Toggles the rendering of environmental objects and buildings.",
            type: "button",
            configName: "scenery",
            callback: toggleScenery
        },
        "Day/Night Overlay": {
            description: "Toggles the rendering of the day/night overlay, whose opacity changes over time.",
            type: "button",
            configName: "dayNightOverlay",
            callback: toggleDayNightOverlay
        },
        "ST Tower Grouping": {
            description: "Displays the 200x200 range grouping grid for Single Target damage towers in blue.",
            type: "button",
            configName: "blueTowerGrouping",
            callback: toggleBlueTowerGrouping
        },
        "AoE Tower Grouping": {
            description: "Displays the 200x200 range grouping grid for Area of Effect damage towers in red.",
            type: "button",
            configName: "redTowerGrouping",
            callback: toggleRedTowerGrouping
        },
        "Borders": {
            description: "Displays the border (in white) and surrounding areas of a stash.\nThe red border shows its building range.\nThe yellow border shows the area where no regular buildings can be placed.\nThe green border shows the area where no stashes can be placed.\nThe blue border shows the maximum distance to another stash for their green border to touch each other.",
            type: "button",
            configName: "borders",
            callback: toggleBorders
        },
        "Zombie Spawn Range": {
            description: "Displays the zombie spawning area of a base.",
            type: "button",
            configName: "zombieSpawnRange",
            callback: toggleZombieSpawnRange
        },
        "ESP": {
            description: "Displays the weapon range of visible players and draws a line between you and them.\nGolden for your player, green for sockets (coming soon), blue for party members, and white for others.",
            type: "button",
            configName: "esp",
            callback: toggleEsp
        },
        "Projectile Hit Marks": {
            description: "Toggles the rendering of hit marks (in white) and AoE area indicators when projectiles land.\nRed for cannonballs, yellow for player bombs, green for tower bombs, blue for fireballs.",
            type: "button",
            configName: "hitMarks",
            callback: toggleHitMarks
        },
        "Projectile Range Indicators": {
            description: "Toggles the rendering of hitboxes (in white) and AoE area indicators of flying projectiles.\nRed for cannonballs, yellow for player bombs, green for tower bombs, blue for fireballs.",
            type: "button",
            configName: "projRangeIndicators",
            callback: toggleProjRangeIndicators
        },
        "Freecam": {
            description: "Allows you to move the camera without moving your player.",
            type: "button",
            configName: "freecam",
            isCustom: true,
            text: "Activate",
            callback: function () {},
            /*
            options: {
                "Hotkey": {
                    type: "button",
                    configName: "freecamHotkey",
                    isCustom: true,
                    text: "",
                    callback: function () {}
                }
            }
            */
        },
        "Screenshot Mode": {
            description: "Hides the UI for screenshots.\nCan also press Esc key to leave this mode.",
            type: "button",
            configName: "ssMode",
            isCustom: true,
            text: "Enter",
            callback: function () {},
            /*
            options: {
                "Hotkey": {
                    type: "button",
                    configName: "ssModeHotkey",
                    isCustom: true,
                    text: "",
                    callback: function () {}
                }
            }
            */
        },
        "Scene": {
            description: "Toggles the rendering of the game scene.",
            type: "button",
            configName: "scene",
            callback: function () {}
        },
        "Game Rendering": {
            description: "Game rendering will stop if disabled.",
            type: "button",
            configName: "rendering",
            callback: function () {}
        },
        "Renderer Restart": {
            description: "Restarts the renderer.",
            type: "button",
            isCustom: true,
            text: "Restart",
            callback: function () {}
        }
    }
};

/* CONFIG */
// Config event emitter
let configEventEmitter = {
    listeners: {},
    on: function (eventName, callback) {
        this.listeners[eventName] = this.listeners[eventName] || [];
        this.listeners[eventName].push(callback);
    },
    emit: function (eventName, ...args) {
        if (this.listeners[eventName]) {
            for (let i = 0; i < this.listeners[eventName].length; i++) {
                this.listeners[eventName][i].apply(null, args);
            }
        }
    }
};
// Default config
let config = {
    // Renderer
    zoom: true,
    magnification: 1.5,
    currentMagnification: 1.5,
    ground: true,
    rendererBackgroundColor: "0x222222",
    projectiles: true,
    players: true,
    npcs: true,
    scenery: true,
    dayNightOverlay: true,
    blueTowerGrouping: false,
    redTowerGrouping: false,
    borders: false,
    zombieSpawnRange: false,
    esp: false,
    hitMarks: false,
    projRangeIndicators: false,
    freecam: false,
    ssMode: false,
    scene: true,
    rendering: true
};
// Renderer config representing the localStorage value
let localRendererConfig = {
    zoom: true,
    ground: true,
    rendererBackgroundColor: "0x222222",
    dayNightOverlay: true,
    blueTowerGrouping: false,
    redTowerGrouping: false,
    borders: false,
    zombieSpawnRange: false,
    esp: false,
    hitMarks: false,
    projRangeIndicators: false
};
function syncRendererConfig (rendererConfig) {
    // Read localStorage value
    if (localStorage.localRendererConfig) {
        let importedRendererConfig = JSON.parse(localStorage.localRendererConfig);
        for (let name in importedRendererConfig) {
            if (rendererConfig[name] !== undefined) {
                rendererConfig[name] = importedRendererConfig[name];
            }
        }
    }
    // Update localStorage value
    localStorage.localRendererConfig = JSON.stringify(rendererConfig);
    // Update config and menu
    configEventEmitter.on("setRendererConfig", function () {
        config.zoom = rendererConfig.zoom;
        config.ground = rendererConfig.ground;
        config.rendererBackgroundColor = rendererConfig.rendererBackgroundColor;
        game.renderer.renderer.backgroundColor = parseInt(config.rendererBackgroundColor);
        config.dayNightOverlay = rendererConfig.dayNightOverlay;
        document.getElementsByClassName("hud-day-night-overlay")[0].style.display = config.dayNightOverlay ? "block" : "none";
        config.blueTowerGrouping = rendererConfig.blueTowerGrouping;
        config.redTowerGrouping = rendererConfig.redTowerGrouping;
        config.borders = rendererConfig.borders;
        config.zombieSpawnRange = rendererConfig.zombieSpawnRange;
        config.esp = rendererConfig.esp;
        config.hitMarks = rendererConfig.hitMarks;
        config.projRangeIndicators = rendererConfig.projRangeIndicators;
    });
    configEventEmitter.emit("setRendererConfig");
    // Update localStorage value everytime config changes
    configEventEmitter.on("rendererConfigUpdate", function (configName) {
        rendererConfig[configName] = config[configName];
        localStorage.localRendererConfig = JSON.stringify(rendererConfig);
    });
};
// Set toggle button state
function setToggleButton (targetElem, value) {
    targetElem.innerText = value ? "Enabled" : "Disabled";
    value ? targetElem.classList.remove("is-disabled") : targetElem.classList.add("is-disabled");
}
// Load menu content
function loadMenuContent (menuContent) {
    for (let tabName in menuContent) {
        let tabContentElem = document.createElement("div");
        document.getElementsByClassName("hud-script-grid")[0].appendChild(tabContentElem);
        tabContentElem.classList.add("hud-script-tabs-content");
        tabContentElem.setAttribute("data-type", tabName);
        for (let itemName in menuContent[tabName]) {
            let item = menuContent[tabName][itemName];
            let itemElem = document.createElement("div");
            tabContentElem.appendChild(itemElem);
            itemElem.classList.add("hud-script-item");
            itemElem.innerHTML = `<h3>${itemName}</h3>`;
            itemElem.innerHTML += `<span>${item.description}</span>`;
            if (!item.noAction) {
                let itemType = item.type;
                let configName = item.configName;
                itemElem.innerHTML += `<${itemType} id="hud-script-item-actions-${configName}"></${itemType}>`;
                switch (itemType) {
                    case "button":
                        let actionElem = document.getElementById("hud-script-item-actions-" + configName);
                        if (item.isCustom) {
                            actionElem.innerText = item.text;
                            actionElem.addEventListener("click", function () {
                                item.callback(actionElem);
                            });
                        } else {
                            setToggleButton(actionElem, config[configName]);
                            actionElem.addEventListener("click", function () {
                                item.callback(actionElem);
                                setToggleButton(actionElem, config[configName]);
                            });
                        }
                        break;
                }
            }
            if (item.options) {
                itemElem.classList.add("has-options");
                let optionsElem = document.createElement("div");
                tabContentElem.appendChild(optionsElem);
                optionsElem.classList.add("hud-script-item-options");
                for (let optionName in item.options) {
                    let option = item.options[optionName];
                    let optionType = option.type;
                    let configName = option.configName;
                    let containerElem = document.createElement("div");
                    optionsElem.appendChild(containerElem);
                    containerElem.innerHTML += `<span>${optionName}<span>`;
                    containerElem.innerHTML += `<${optionType} id="hud-script-item-actions-${configName}"></${optionType}>`;
                    let actionElem = document.getElementById("hud-script-item-actions-" + configName);
                    switch (optionType) {
                        case "button":
                            if (option.isCustom) {
                                actionElem.innerText = option.text;
                                actionElem.addEventListener("click", option.callback);
                            } else {
                                setToggleButton(actionElem, config[configName]);
                                actionElem.addEventListener("click", function () {
                                    option.callback();
                                    setToggleButton(actionElem, config[configName]);
                                });
                            }
                            break;
                        case "input":
                            actionElem.addEventListener("change", function () {
                                option.callback(actionElem);
                            });
                            if (option.attributes) {
                                for (let attributeName in option.attributes) {
                                    actionElem.setAttribute(attributeName, option.attributes[attributeName]);
                                }
                                if (localRendererConfig[configName]) {
                                    if (localRendererConfig[configName].toString() != option.attributes.placeholder) {
                                        actionElem.value = localRendererConfig[configName].toString();
                                    }
                                }
                            }
                            break;
                    }
                }
            }
        }
    }
};
// Tab listeners
function addTabListeners (targetElem) {
    targetElem.activeType = "General";
    function setTab () {
        let tabContents = document.getElementsByClassName("hud-script-tabs-content");
        for (let i = 0; i < tabContents.length; i++) {
            if (targetElem.activeType === tabContents[i].getAttribute("data-type")) {
                tabContents[i].style.display = "block";
            } else {
                tabContents[i].style.display = "none";
            }
        }
    }
    let tabElems = document.getElementsByClassName("hud-script-tabs-link");
    for (let i = 0; i < tabElems.length; i++) {
        tabElems[i].addEventListener("click", function () {
            let type = tabElems[i].getAttribute("data-type");
            for (var j = 0; j < tabElems.length; j++) {
                if (type === tabElems[j].getAttribute("data-type")) {
                    tabElems[j].classList.add("is-active");
                } else {
                    tabElems[j].classList.remove("is-active");
                }
                targetElem.activeType = type;
                setTab();
            }
        });
    }
    setTab();
};

/* FUNCTIONS */
// Menu functions
function toggleZoom () {
    config.zoom = !config.zoom;
    configEventEmitter.emit("rendererConfigUpdate", "zoom");
}
function resetZoom () {
    config.magnification = 1.5;
    config.currentMagnification = 1.5;
    window.onresize();
}
function toggleGround () {
    config.ground = !config.ground;
    game.renderer.ground.attachments[0].setVisible(config.ground);
    configEventEmitter.emit("rendererConfigUpdate", "ground");
}
function setRendererBackgroundColor (elem) {
    let value = elem.value;
    if (value == "") {
        value = "0x222222";
    }
    let intValue = parseInt(value);
    if (!isNaN(intValue)) {
        if (intValue > 16777215) {
            if (value.startsWith("0x")) {
                value = "0xFFFFFF";
            } else {
                value = "16777215";
            }
            elem.value = value;
        } else if (intValue < 0) {
            if (value.startsWith("-0x")) {
                value = "0x000000";
            } else {
                value = "0";
            }
            elem.value = value;
        }
        config.rendererBackgroundColor = value;
        game.renderer.renderer.backgroundColor = parseInt(config.rendererBackgroundColor);
        configEventEmitter.emit("rendererConfigUpdate", "rendererBackgroundColor");
    }
}
function toggleProjectiles () {
    config.projectiles = !config.projectiles;
    game.renderer.projectiles.setVisible(config.projectiles);
}
function togglePlayers () {
    config.players = !config.players;
    game.renderer.players.setVisible(config.players);
}
function toggleNpcs () {
    config.npcs = !config.npcs;
    game.renderer.npcs.setVisible(config.npcs);
}
function toggleScenery () {
    config.scenery = !config.scenery;
    game.renderer.scenery.setVisible(config.scenery);
}
function toggleDayNightOverlay () {
    config.dayNightOverlay = !config.dayNightOverlay;
    document.getElementsByClassName("hud-day-night-overlay")[0].style.display = config.dayNightOverlay ? "block" : "none";
    configEventEmitter.emit("rendererConfigUpdate", "dayNightOverlay");
}
function toggleBlueTowerGrouping () {
    config.blueTowerGrouping = !config.blueTowerGrouping;
    blueTowerGrouping.visible = config.blueTowerGrouping;
    configEventEmitter.emit("rendererConfigUpdate", "blueTowerGrouping");
}
function toggleRedTowerGrouping () {
    config.redTowerGrouping = !config.redTowerGrouping;
    redTowerGrouping.visible = config.redTowerGrouping;
    configEventEmitter.emit("rendererConfigUpdate", "redTowerGrouping");
}
function toggleBorders () {
    config.borders = !config.borders;
    borders.visible = config.borders;
    configEventEmitter.emit("rendererConfigUpdate", "borders");
}
function toggleZombieSpawnRange () {
    config.zombieSpawnRange = !config.zombieSpawnRange;
    zombieSpawnRange.visible = config.zombieSpawnRange;
    configEventEmitter.emit("rendererConfigUpdate", "zombieSpawnRange");
}
function toggleEsp() {
    config.esp = !config.esp;
    configEventEmitter.emit("rendererConfigUpdate", "esp");
}
function toggleHitMarks () {
    config.hitMarks = !config.hitMarks;
    hitMarks.visible = config.hitMarks;
    configEventEmitter.emit("rendererConfigUpdate", "hitMarks");
}
function toggleProjRangeIndicators () {
    config.projRangeIndicators = !config.projRangeIndicators;
    for (let i = 0; i < game.renderer.projectiles.attachments.length; i++) {
        let attachment = game.renderer.projectiles.attachments[i];
        attachment.node.children[0].visible = !config.projRangeIndicators;
        attachment.node.children[1].visible = config.projRangeIndicators;
    }
    configEventEmitter.emit("rendererConfigUpdate", "projRangeIndicators");
}
// Zoom
function addZoom () {
    window.onresize = function () {
        let canvasWidth = window.innerWidth * window.devicePixelRatio;
        let canvasHeight = window.innerHeight * window.devicePixelRatio;
        let ratio = Math.max(canvasWidth / (1920 * config.currentMagnification), canvasHeight / (1080 * config.currentMagnification));
        game.renderer.scale = ratio;
        game.renderer.entities.setScale(ratio);
        game.renderer.ui.setScale(ratio);
        game.renderer.renderer.resize(canvasWidth, canvasHeight);
        game.renderer.viewport.width = game.renderer.renderer.width / game.renderer.scale + 2 * game.renderer.viewportPadding;
        game.renderer.viewport.height = game.renderer.renderer.height / game.renderer.scale + 2 * game.renderer.viewportPadding;
    }
    window.onresize();
    window.onwheel = function (event) {
        if (config.zoom) {
            if (event.deltaY > 0) {
                if (config.magnification < 50) {
                    config.magnification += 0.5;
                }
            } else if (config.magnification > 1) {
                config.magnification -= 0.5;
            }
        }
    }
}
// Prevents zooming in intro and menus
function registerWheelEvent () {
    document.getElementsByClassName("hud-intro")[0].addEventListener("wheel", function (event) {
        event.stopPropagation();
    })
    menuShopElem.addEventListener("wheel", function (event) {
        event.stopPropagation();
    })
    menuSettingsElem.addEventListener("wheel", function (event) {
        event.stopPropagation();
    })
    menuPartyElem.addEventListener("wheel", function (event) {
        event.stopPropagation();
    })
    menuScriptElem.addEventListener("wheel", function (event) {
        event.stopPropagation();
    })
};
// Tower grouping
let blueTowerGroupingTile;
let blueTowerGroupingTileTexture;
let blueTowerGrouping;
let redTowerGroupingTile;
let redTowerGroupingTileTexture;
let redTowerGrouping;
function addTowerGrouping () {
    blueTowerGroupingTile = new PIXI.Graphics();
    blueTowerGroupingTile.lineStyle(8, 0x008EFF, 0.3).moveTo(4, 0).lineTo(4, 200).moveTo(0, 4).lineTo(200, 4).moveTo(196, 0).lineTo(196, 200).moveTo(0, 196).lineTo(200, 196);
    blueTowerGroupingTileTexture = PIXI.RenderTexture.create(blueTowerGroupingTile.width, blueTowerGroupingTile.height, 0, window.devicePixelRatio);
    blueTowerGrouping = new PIXI.extras.TilingSprite(blueTowerGroupingTileTexture, 24000, 24000);
    blueTowerGrouping.visible = config.blueTowerGrouping;
    game.renderer.entities.node.addChild(blueTowerGrouping);
    game.renderer.renderer.render(blueTowerGroupingTile, blueTowerGroupingTileTexture);
    redTowerGroupingTile = new PIXI.Graphics();
    redTowerGroupingTile.lineStyle(16, 0xFF0000, 0.3).moveTo(48, 0).lineTo(48, 200).moveTo(0, 48).lineTo(200, 48);
    redTowerGroupingTileTexture = PIXI.RenderTexture.create(redTowerGroupingTile.width, redTowerGroupingTile.height, 0, window.devicePixelRatio);
    redTowerGrouping = new PIXI.extras.TilingSprite(redTowerGroupingTileTexture, 24000, 24000);
    redTowerGrouping.visible = config.redTowerGrouping;
    game.renderer.entities.node.addChild(redTowerGrouping);
    game.renderer.renderer.render(redTowerGroupingTile, redTowerGroupingTileTexture);
}
// Borders
let borders;
function createBorders () {
    borders = new PIXI.Graphics();
    let colors = [0xFFFFFF, 0xFF0000, 0xFFFF00, 0x00FF00, 0x0000FF];
    let sizes = [48, 864, 1680, 2544, 5040];
    for (let i = 0; i < 5; i++) {
        borders.lineStyle(4, colors[i]).drawRect(-sizes[i], -sizes[i], 2 * sizes[i], 2 * sizes[i]);
    }
    borders.visible = config.borders;
}
// Zombie spawn range
let zombieSpawnRange;
function createZombieSpawnRange () {
    zombieSpawnRange = new PIXI.Graphics().beginFill(0xFFFFFF, 0.1).drawCircle(0, 0, 1302);
    zombieSpawnRange.visible = config.zombieSpawnRange;
}
// ESP
function lerp (start, end, ratio) {
    return ~~(start + (end - start) * (ratio > 1.2 ? 1 : ratio));
}
function mod (a, b) {
    return ((a % b + b) % b) | 0;
}
function interpolateYaw (target, from) {
    let tickPercent = game.world.replicator.msInThisTick / game.world.msPerTick;
    let rotationalDifference = ~~lerp(0, mod(target - from + 180, 360) - 180, tickPercent);
    let yaw = ~~(from + rotationalDifference);
    return ~~((yaw + 360) % 360);
}
let tracers = {};
let rangeIndicators = {};
let angles = {
    pickaxe: {
        start: 335 * Math.PI / 180,
        end: 200 * Math.PI / 180
    },
    spear: {
        start: 320 * Math.PI / 180,
        end: 225 * Math.PI / 180
    }
};
let startPoints = {
    pickaxe: {
        x: Math.cos(angles.pickaxe.start) * 100,
        y: Math.sin(angles.pickaxe.start) * 100
    },
    spear: {
        x: Math.cos(angles.spear.start) * 100,
        y: Math.sin(angles.spear.start) * 100
    }
};
function updateEsp () {
    if (game.world.inWorld && config.esp) {
        for (let i in tracers) {
            if (!game.world.entities[i]) {
                tracers[i].destroy();
                delete tracers[i];
            }
        }
        for (let i in rangeIndicators) {
            if (!game.world.entities[i]) {
                rangeIndicators[i].destroy();
                delete rangeIndicators[i];
            }
        }
        let myPlayerEntity = game.world.entities[game.world.myUid];
        game.renderer.players.attachments.forEach(entity => {
            let tickPercent = game.world.replicator.msInThisTick / game.world.msPerTick;
            let vx = entity.targetTick.position.x - entity.fromTick.position.x;
            let vy = entity.targetTick.position.y - entity.fromTick.position.y;
            entity.targetTick.lastVx = entity.targetTick.vx || vx;
            entity.targetTick.vx = vx;
            entity.targetTick.lastVy = entity.targetTick.vy || vy;
            entity.targetTick.vy = vy;
            if (entity.uid != game.world.myUid) {
                if (!tracers[entity.uid]) {
                    tracers[entity.uid] = new PIXI.Graphics();
                    game.renderer.entities.node.addChild(tracers[entity.uid]);
                }
                tracers[entity.uid].clear();
                if (entity.targetTick.dead == 0) {
                    let myPosition = {
                        x: lerp(myPlayerEntity.fromTick.position.x, myPlayerEntity.targetTick.position.x, tickPercent),
                        y: lerp(myPlayerEntity.fromTick.position.y, myPlayerEntity.targetTick.position.y, tickPercent)
                    };
                    let entityPosition = {
                        x: lerp(entity.fromTick.position.x, entity.targetTick.position.x, tickPercent),
                        y: lerp(entity.fromTick.position.y, entity.targetTick.position.y, tickPercent)
                    };
                    tracers[entity.uid].lineStyle(3, (entity.targetTick.partyId == game.ui.playerPartyId) ? 0x0000FF : 0xFFFFFF).moveTo(myPosition.x, myPosition.y).lineTo(entityPosition.x, entityPosition.y);
                }
            }
            if (!rangeIndicators[entity.uid]) {
                rangeIndicators[entity.uid] = new PIXI.Graphics();
                game.renderer.entities.node.addChild(rangeIndicators[entity.uid]);
            }
            rangeIndicators[entity.uid].clear();
            let position = {
                x: lerp(entity.fromTick.position.x, entity.targetTick.position.x, tickPercent) - vx,
                y: lerp(entity.fromTick.position.y, entity.targetTick.position.y, tickPercent) - vy
            };
            rangeIndicators[entity.uid].position = position;
            let rotation = entity.uid == game.world.myUid ? game.inputPacketCreator.lastAnyYaw * Math.PI / 180 : interpolateYaw(entity.targetTick.aimingYaw, entity.fromTick.aimingYaw) * Math.PI / 180;
            rangeIndicators[entity.uid].rotation = rotation;
            if (entity.targetTick.dead == 0) {
                let color = (entity.uid == game.world.myUid) ? 0xFFD700 : (entity.targetTick.partyId == game.ui.playerPartyId) ? 0x0000FF : 0xFFFFFF;
                switch (entity.targetTick.weaponName) {
                    case 'Pickaxe':
                        rangeIndicators[entity.uid].beginFill(color, 0.3).moveTo(0, 0).lineTo(startPoints.pickaxe.x, startPoints.pickaxe.y).arc(0, 0, 100, angles.pickaxe.start, angles.pickaxe.end, true).endFill();
                        break;
                    case 'Spear':
                        rangeIndicators[entity.uid].beginFill(color, 0.3).moveTo(0, 0).lineTo(startPoints.spear.x, startPoints.spear.y).arc(0, 0, 100, angles.spear.start, angles.spear.end, true).endFill();
                        break;
                    case 'Bow':
                        rangeIndicators[entity.uid].position = {
                            x: lerp(entity.fromTick.position.x, entity.targetTick.position.x, tickPercent),
                            y: lerp(entity.fromTick.position.y, entity.targetTick.position.y, tickPercent)
                        };
                        rangeIndicators[entity.uid].lineStyle(7, color, 0.3).moveTo(0, 0).lineTo((-vx * Math.cos(-rotation) - -vy * Math.sin(-rotation)) * 11, -550 + (-vx * Math.sin(-rotation) + -vy * Math.cos(-rotation)) * 11);
                        break;
                    case 'Bomb':
                        rangeIndicators[entity.uid].lineStyle(7, color, 0.3).moveTo(0, 0).lineTo((-vx * Math.cos(-rotation) - -vy * Math.sin(-rotation)) * 14, -280 + (-vx * Math.sin(-rotation) + -vy * Math.cos(-rotation)) * 14);
                        break;
                }
            }
        });
    } else {
        for (let i in tracers) {
            tracers[i].destroy();
            delete tracers[i];
        }
        for (let i in rangeIndicators) {
            rangeIndicators[i].destroy();
            delete rangeIndicators[i];
        }
    }
}
// Hit marks
let hitMarks;
let arrowMarks = [];
let bombMarks = [];
let cannonMarks = [];
let mageMarks = [];
let arrowMarkTemplate;
let arrowMarkTexture;
let bombMarkTemplate;
let bombMarkTexture;
let cannonMarkTemplate;
let cannonMarkTexture;
let mageMarkTemplate;
let mageMarkTexture;
function addHitMarks () {
    hitMarks = new PIXI.Container();
    hitMarks.zHack = 1;
    game.renderer.ground.node.addChild(hitMarks);
    arrowMarkTemplate = new PIXI.Graphics().beginFill(0xFFFFFF, 0.1).drawCircle(0, 0, 10).endFill();
    arrowMarkTexture = PIXI.RenderTexture.create(arrowMarkTemplate.width, arrowMarkTemplate.height, 0, window.devicePixelRatio);
    game.renderer.renderer.render(arrowMarkTemplate, arrowMarkTexture, null, new PIXI.Matrix(1, 0, 0, 1, arrowMarkTemplate.width / 2, arrowMarkTemplate.height / 2));
    bombMarkTemplate = new PIXI.Graphics().beginFill(0xFFFFFF, 0.1).drawCircle(0, 0, 10).endFill().lineStyle(3, 0x00DD00, 0.1).beginFill(0x00AA00, 0.1).drawCircle(0, 0, 250).endFill().lineStyle(3, 0xDDDD00, 0.1).beginFill(0xAAAA00, 0.1).drawCircle(0, 0, 50).endFill();
    bombMarkTexture = PIXI.RenderTexture.create(bombMarkTemplate.width, bombMarkTemplate.height, 0, window.devicePixelRatio);
    game.renderer.renderer.render(bombMarkTemplate, bombMarkTexture, null, new PIXI.Matrix(1, 0, 0, 1, bombMarkTemplate.width / 2, bombMarkTemplate.height / 2));
    cannonMarkTemplate = new PIXI.Graphics().beginFill(0xFFFFFF, 0.1).drawCircle(0, 0, 10).endFill().lineStyle(3, 0xDD0000, 0.1).beginFill(0xAA0000, 0.1).drawCircle(0, 0, 250).endFill();
    cannonMarkTexture = PIXI.RenderTexture.create(cannonMarkTemplate.width, cannonMarkTemplate.height, 0, window.devicePixelRatio);
    game.renderer.renderer.render(cannonMarkTemplate, cannonMarkTexture, null, new PIXI.Matrix(1, 0, 0, 1, cannonMarkTemplate.width / 2, cannonMarkTemplate.height / 2));
    mageMarkTemplate = new PIXI.Graphics().beginFill(0xFFFFFF, 0.1).drawCircle(0, 0, 10).endFill().lineStyle(3, 0x00DDDD, 0.1).beginFill(0x00AAAA, 0.1).drawCircle(0, 0, 100).endFill();
    mageMarkTexture = PIXI.RenderTexture.create(mageMarkTemplate.width, mageMarkTemplate.height, 0, window.devicePixelRatio);
    game.renderer.renderer.render(mageMarkTemplate, mageMarkTexture, null, new PIXI.Matrix(1, 0, 0, 1, mageMarkTemplate.width / 2, mageMarkTemplate.height / 2));
}
// Projectile range indicators
let newProjTextures = {};
function addProjRangeIndicatorTextures () {
    let projSpriteSrcs = {
        ProjectileArrowModel: "/asset/image/entity/arrow-tower/arrow-tower-projectile.svg",
        ProjectileBombModel: "/asset/image/entity/bomb-tower/bomb-tower-projectile.svg",
        ProjectileCannonModel: "/asset/image/entity/cannon-tower/cannon-tower-projectile.svg",
        ProjectileMageModel: "/asset/image/entity/mage-tower/mage-tower-projectile.svg"
    };
    let projRangeIndicators = {
        ProjectileArrowModel: new PIXI.Graphics().beginFill(0xFFFFFF, 1).drawCircle(0, 0, 10).endFill(),
        ProjectileBombModel: new PIXI.Graphics().beginFill(0xFFFFFF, 1).drawCircle(0, 0, 10).endFill().lineStyle(3, 0x00FF00).drawCircle(0, 0, 250).lineStyle(3, 0xFFFF00).drawCircle(0, 0, 50),
        ProjectileCannonModel: new PIXI.Graphics().beginFill(0xFFFFFF, 1).drawCircle(0, 0, 10).endFill().lineStyle(3, 0xFF0000).drawCircle(0, 0, 250),
        ProjectileMageModel: new PIXI.Graphics().beginFill(0xFFFFFF, 1).drawCircle(0, 0, 10).endFill().lineStyle(3, 0x00FFFF).drawCircle(0, 0, 100)
    };
    for (let modelName in projSpriteSrcs) {
        let spriteTexture = PIXI.Texture.fromImage(projSpriteSrcs[modelName]);
        let createTexture = function () {
            let sprite = new PIXI.Sprite(spriteTexture);
            sprite.anchor.set(0.5);
            let projRangeIndicator = projRangeIndicators[modelName];
            let textureContainer = new PIXI.Container();
            textureContainer.addChild(sprite, projRangeIndicator);
            newProjTextures[modelName] = game.renderer.renderer.generateTexture(textureContainer);
        }
        if (spriteTexture.valid) {
            createTexture();
        } else {
            spriteTexture.on('update', createTexture);
        }
    }
};

/* INITIALIZATION */
applyStyle(styleString);
modifyIntro();
// Menu
let scriptIconElem = document.createElement("div");
loadIcon(scriptIconElem);
loadMenu(menuScript);
let menuShopElem = document.getElementsByClassName("hud-menu-shop")[0];
let menuSettingsElem = document.getElementsByClassName("hud-menu-settings")[0];
let menuPartyElem = document.getElementsByClassName("hud-menu-party")[0];
let menuScriptElem = document.getElementsByClassName("hud-menu-script")[0];
addScriptMenuEventListeners(menuScriptElem);
// Menu content
syncRendererConfig(localRendererConfig);
loadMenuContent(menuScriptContent);
addTabListeners(menuScriptElem);
// Functions
addZoom();
game.renderer.addTickCallback(function () {
    // Smooth zoom
    if (config.currentMagnification != config.magnification) {
        config.currentMagnification += (config.magnification - config.currentMagnification) * 0.1;
        window.onresize();
    }
    // ESP
    updateEsp();
});
registerWheelEvent();
addTowerGrouping();
createBorders();
createZombieSpawnRange();
addHitMarks();
addProjRangeIndicatorTextures();
game.renderer.ground.AddAttachment = game.renderer.ground.addAttachment;
game.renderer.ground.addAttachment = function (attachment, zIndex) {
    // Hide grass only
    if (game.renderer.ground.attachments.length == 0) {
        attachment.setVisible(config.ground);
    }
    game.renderer.ground.AddAttachment(attachment, zIndex);
}
game.renderer.projectiles.AddAttachment = game.renderer.projectiles.addAttachment;
game.renderer.projectiles.addAttachment = function (attachment, zIndex) {
    // Adding projectile range indicators
    if (attachment.node.children.length == 1) {
        let projRangeIndicatorSprite = new PIXI.Sprite(newProjTextures[attachment.currentModel.modelName]);
        projRangeIndicatorSprite.anchor.set(0.5);
        attachment.node.addChild(projRangeIndicatorSprite);
    }
    attachment.node.children[0].visible = !config.projRangeIndicators;
    attachment.node.children[1].visible = config.projRangeIndicators;
    game.renderer.projectiles.AddAttachment(attachment, zIndex);
}
game.world.CreateEntity = game.world.createEntity;
game.world.createEntity = function (targetTick) {
    // Fixes player rendering bug
    if (targetTick.entityClass == "PlayerEntity") {
        targetTick.entityClass = "Player";
    }
    // Add borders and zombie spawn range to stash
    if (targetTick.model == "GoldStash") {
        borders.position = targetTick.position;
        zombieSpawnRange.position = targetTick.position;
        if (!game.renderer.entities.node.children.includes(borders)) {
            game.renderer.entities.node.addChild(borders);
        };
        if (!game.renderer.entities.node.children.includes(zombieSpawnRange)) {
            game.renderer.entities.node.addChild(zombieSpawnRange);
        };
    };
    game.world.CreateEntity(targetTick);
}
game.world.RemoveEntity = game.world.removeEntity;
game.world.removeEntity = function (uid) {
    if (!game.world.entities[uid]) return;
    function isInViewRange (p1, p2) {
        let deltaX = ~~(p2.x / 200) - ~~(p1.x / 200);
        let deltaY = ~~(p2.y / 200) - (~~((p1.y + 100) / 200) - 0.5);
        return -5 <= deltaX && -3.5 <= deltaY && deltaX <= 5 && deltaY <= 3.5;
    };
    let model = game.world.entities[uid].targetTick.model;
    if (game.ui.playerTick) {
        let playerPosition = game.ui.playerTick.position;
        let entityPosition = game.world.entities[uid].targetTick.position;
        if (["ArrowProjectile", "BowProjectile", "BombProjectile", "CannonProjectile", "FireballProjectile"].includes(model)) {
            if (isInViewRange(playerPosition, entityPosition)) {
                switch (model) {
                    case "ArrowProjectile":
                    case "BowProjectile":
                        var arrowMark;
                        if (arrowMarks[0] && !arrowMarks[0].visible) {
                            arrowMark = arrowMarks.shift();
                            arrowMark.position = game.world.entities[uid].node.position;
                        }
                        else {
                            arrowMark = new PIXI.Sprite(arrowMarkTexture);
                            arrowMark.anchor.set(0.5);
                            arrowMark.position = game.world.entities[uid].node.position;
                        };
                        hitMarks.addChild(arrowMark);
                        if (!arrowMark.visible) arrowMark.visible = true;
                        arrowMarks.push(arrowMark);
                        setTimeout(function () {
                            arrowMark.visible = false;
                        }, 5000);
                        break;
                    case "BombProjectile":
                        var bombMark;
                        if (bombMarks[0] && !bombMarks[0].visible) {
                            bombMark = bombMarks.shift();
                            bombMark.position = game.world.entities[uid].node.position;
                        } else {
                            bombMark = new PIXI.Sprite(bombMarkTexture);
                            bombMark.anchor.set(0.5);
                            bombMark.position = game.world.entities[uid].node.position;
                        };
                        hitMarks.addChild(bombMark);
                        if (!bombMark.visible) bombMark.visible = true;
                        bombMarks.push(bombMark);
                        setTimeout(function () {
                            bombMark.visible = false;
                        }, 5000);
                        break;
                    case "CannonProjectile":
                        var cannonMark;
                        if (cannonMarks[0] && !cannonMarks[0].visible) {
                            cannonMark = cannonMarks.shift();
                            cannonMark.position = game.world.entities[uid].node.position;
                        } else {
                            cannonMark = new PIXI.Sprite(cannonMarkTexture);
                            cannonMark.anchor.set(0.5);
                            cannonMark.position = game.world.entities[uid].node.position;
                        };
                        hitMarks.addChild(cannonMark);
                        if (!cannonMark.visible) cannonMark.visible = true;
                        cannonMarks.push(cannonMark);
                        setTimeout(function () {
                            cannonMark.visible = false;
                        }, 5000);
                        break;
                    case "FireballProjectile":
                        var mageMark;
                        if (mageMarks[0] && !mageMarks[0].visible) {
                            mageMark = mageMarks.shift();
                            mageMark.position = game.world.entities[uid].node.position;
                        } else {
                            mageMark = new PIXI.Sprite(mageMarkTexture);
                            mageMark.anchor.set(0.5);
                            mageMark.position = game.world.entities[uid].node.position;
                        };
                        hitMarks.addChild(mageMark);
                        if (!mageMark.visible) mageMark.visible = true;
                        mageMarks.push(mageMark);
                        setTimeout(function () {
                            mageMark.visible = false;
                        }, 5000);
                        break;
                }
            }
        }
    }
    game.world.RemoveEntity(uid);
}