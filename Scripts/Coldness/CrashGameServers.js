// ==UserScript==
// @name         crash game servers make the game suffer
// @namespace    https://discord.gg/rHJhc8Qyv5
// @version      8.3
// @description  asdf
// @author       ehScripts, Asmodeus
// @match        zombs.io
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @require      https://greasyfork.org/scripts/423702-msgpack/code/msgpack.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/445424/crash%20game%20servers%20make%20the%20game%20suffer.user.js
// @updateURL https://update.greasyfork.org/scripts/445424/crash%20game%20servers%20make%20the%20game%20suffer.meta.js
// ==/UserScript==

// no turkeys allowed
// fuck you TC

// building size: 67px
// smaller ones: 37px
game.network.sendEnterWorld2 = game.network.sendEnterWorld;
game.network.sendEnterWorld = (data) => {
    let nameVal = document.getElementById("nameArea").value;
    data.displayName = nameVal;
    localStorage.name = nameVal;
    game.network.sendEnterWorld2(data);
    console.log(data);
};

const nameArea = document.createElement("textarea");

nameArea.id = "nameArea";
nameArea.style.width = "250px";
nameArea.style.height = "50px";
nameArea.style.borderRadius = "8px";
nameArea.value = localStorage.name;

document.querySelector("#hud-intro > div.hud-intro-wrapper > div > div.hud-intro-form > input").style.display = "none";
document.querySelector("#hud-intro > div.hud-intro-wrapper > div > div.hud-intro-form > input").parentNode.insertBefore(nameArea, document.querySelector("#hud-intro > div.hud-intro-wrapper > div > div.hud-intro-form > input"));

let stashSrc = "/asset/image/entity/gold-stash/gold-stash-t1-base.svg";
let bombSrc = "/asset/image/entity/bomb-tower/bomb-tower-t1-base.svg";
let doorSrc = "/asset/image/entity/door/door-t1-base.svg";
let trapSrc = "/asset/image/entity/slow-trap/slow-trap-t1-base.svg";
let wallSrc = "/asset/image/entity/wall/wall-t1-base.svg";

let mineBase = "/asset/image/entity/gold-mine/gold-mine-t1-base.svg";
let mineHead = "/asset/image/entity/gold-mine/gold-mine-t1-head.svg";

let cannonBase = "/asset/image/entity/cannon-tower/cannon-tower-t1-base.svg";
let cannonHead = "/asset/image/entity/cannon-tower/cannon-tower-t1-head.svg";

let arrowBase = "/asset/image/entity/arrow-tower/arrow-tower-t1-base.svg";
let arrowHead = "/asset/image/entity/arrow-tower/arrow-tower-t1-head.svg";

let harvBase = "/asset/image/entity/harvester/harvester-t1-base.svg"
let harvHead = "/asset/image/entity/harvester/harvester-t1-head.svg";

let mageBase = "/asset/image/entity/mage-tower/mage-tower-t1-base.svg";
let mageHead = "/asset/image/entity/mage-tower/mage-tower-t1-head.svg";

let meleeBase = "/asset/image/entity/melee-tower/melee-tower-t1-base.svg";
let meleeMiddle = "/asset/image/entity/melee-tower/melee-tower-t1-middle.svg";
let meleeHead = "/asset/image/entity/melee-tower/melee-tower-t1-head.svg";

function positionOnMap(el, x, y) {
    el.style.left = `${x * devicePixelRatio}px`;
    el.style.top = `${y * devicePixelRatio}px`;
};

window.saveTowers = () => {
    let towers = [];
    Object.values(game.world.entities).forEach((entity => {
        if (entity.fromTick.model.includes("Tower") || entity.fromTick.model === "Wall" || entity.fromTick.model === "Door" || entity.fromTick.model === "SlowTrap" || entity.fromTick.model === "GoldStash" || entity.fromTick.model === "GoldMine") {
            towers.push({
                model: entity.fromTick.model,
                screened: game.renderer.worldToScreen(entity.targetTick.position.x, entity.targetTick.position.y)
            });
        };
    }));
    return towers;
};

window.placeTowers = arr => {
    arr.forEach((item => {
        switch (item.model) {
            case "CannonTower":
                window.makeImageOnMap(74, 67, true, cannonBase, item.screened.x, item.screened.y);
                window.makeImageOnMap(74, 67, true, cannonHead, item.screened.x, item.screened.y);
                break;
            case "ArrowTower":
                window.makeImageOnMap(74, 67, true, arrowBase, item.screened.x, item.screened.y);
                window.makeImageOnMap(74, 67, true, arrowHead, item.screened.x, item.screened.y);
                break;
            case "BombTower":
                window.makeImageOnMap(67, 67, true, bombSrc, item.screened.x, item.screened.y);
                break;
            case "MagicTower":
                window.makeImageOnMap(67, 67, true, mageBase, item.screened.x, item.screened.y);
                window.makeImageOnMap(37, 37, true, mageHead, item.screened.x + 16, item.screened.y + 16);
                break;
            case "GoldStash":
                window.makeImageOnMap(67, 67, true, stashSrc, item.screened.x, item.screened.y);
                break;
            case "Harvester":
                window.makeImageOnMap(74, 67, true, harvBase, item.screened.x, item.screened.y);
                window.makeImageOnMap(74, 67, true, harvHead, item.screened.x, item.screened.y);
                break;
            case "MeleeTower":
                window.makeImageOnMap(74, 67, true, meleeBase, item.screened.x, item.screened.y, "0.42", "4");
                window.makeImageOnMap(74, 67, true, meleeMiddle, item.screened.x + 8, item.screened.y, "0.22", "3");
                window.makeImageOnMap(74, 67, true, meleeHead, item.screened.x, item.screened.y, "0.42", "5");
                break;
            case "GoldMine":
                window.makeImageOnMap(74, 67, true, mineBase, item.screened.x, item.screened.y);
                window.makeImageOnMap(74, 67, true, mineHead, item.screened.x, item.screened.y);
                break;
            case "Wall":
                window.makeImageOnMap(37, 37, true, wallSrc, item.screened.x, item.screened.y);
                break;
            case "Door":
                window.makeImageOnMap(37, 37, true, doorSrc, item.screened.x, item.screened.y);
                break;
            case "SlowTrap":
                window.makeImageOnMap(37, 37, true, trapSrc, item.screened.x, item.screened.y);
                break;
        };
    }));
};

document.getElementsByClassName("hud-intro-play")[0].style.backgroundColor = "#4d7785";

window.makeImageOnMap = (sizeX = 67, sizeY = 67, useSize = true, src, wx, wy, opacity = "0.42", zIndex = "5") => {
    let j = document.createElement("img");
    let jid = `vi${Math.floor(Math.random() * 348934857984)}`;
    j.id = jid;
    j.src = src;
    if (useSize) {
        j.width = sizeX;
        j.height = sizeY;
    };
    j.style.position = "absolute";
    j.style.zIndex = zIndex;
    j.style.opacity = opacity;
    document.querySelector('canvas').before(j);
    let jd = document.getElementById(jid);
    positionOnMap(jd, wx, wy);
};

let srvr = 0;

for (let i in game.options.servers) {
    srvr += 1;
    try {
        document.getElementsByClassName("hud-intro-server")[0][srvr].innerHTML = game.options.servers[i].name + ", serverId: " + game.options.servers[i].id + ", hostname: " + game.options.servers[i].hostname;
    } catch {
        console.log('listed server data');
    };
};

let css3 = `
.btn-grey {
  border-radius: 8px;
  margin-bottom: 2.5px;
  margin-right: 2.5px;
  margin-left: 2.5px;
  outline: none;
  background-color: darkgrey;
  font-size: 18px;
  text-shadow: 1px 1px black;
}
.btn-rainbow {
  border-radius: 8px;
  margin-bottom: 2.5px;
  margin-right: 2.5px;
  margin-left: 2.5px;
  outline: none;
  background: linear-gradient(90deg, rgba(255,0,0,1) 0%, rgba(255,154,0,1) 10%, rgba(208,222,33,1) 20%, rgba(79,220,74,1) 30%, rgba(63,218,216,1) 40%, rgba(47,201,226,1) 50%, rgba(28,127,237,1) 60%, rgba(95,21,242,1) 70%, rgba(186,12,248,1) 80%, rgba(251,7,217,1) 90%, rgba(255,0,0,1) 100%);
  font-size: 18px;
  text-shadow: 1px 1px black;
}
.hud-intro .hud-intro-form .hud-intro-server {
    display: inline-block;
    width: 100%;
    height: 50px;
    line-height: 34px;
    padding: 8px 14px;
    background: #ffffff2e;
    border: 2px solid #000;
    font-size: 14px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    border-radius: 4px;
    transition: all 0.15s ease-in-out;
}
a {
    text-decoration: none;
}
`;


let stylerr = document.createElement("style");
stylerr.appendChild(document.createTextNode(css3));

navigator.getBattery().then((bm => {
    bm.onlevelchange = (level => {
        if (level <= 0.1 && !bm.charging) {
            game.ui.getComponent("PopupOverlay").showHint("You might want to plug in your device, it is lower than 10% and is not charging");
        };
    });
}));

(() => {

    window.macros = {};
    let lastMacroId;
    let macroIsActive = false;

    game.network.sendPacket2 = game.network.sendPacket;
    game.network.sendPacket = function (a, m) {
        if (macroIsActive && a !== 7) {
            window.macros[lastMacroId].actions.push({
                data: [a, m],
                timeout: Date.now() - window.macros[lastMacroId].startTime
            });
        };
        game.network.sendPacket2(a, m);
    };

    window.startRecordingMacro = (id) => {
        lastMacroId = id;
        window.macros[id] = { startTime: Date.now(), actions: [] };
        macroIsActive = true;
    };

    window.executeMacro = (id) => {
        let macro = window.macros[id];
        if (macro) {
            macro.actions.forEach((action => {
                setTimeout(() => {
                    game.network.sendPacket2(action.data[0], action.data[1]);
                }, action.timeout);
            }));
        };
    };

    window.stopRecordingMacro = () => {
        macroIsActive = false;
        lastMacroId = null;
    };

    let isTabAlt = location.hash.toLowerCase().includes("altmode");

    if (isTabAlt) {
        document.querySelector("#hud-intro > div.hud-intro-wrapper > h1").innerHTML = `AltMode`;
    } else {
        document.querySelector("#hud-intro > div.hud-intro-wrapper > h1").innerHTML = `444<small>x3</small>`;
    };


    document.querySelector("#hud-intro > div.hud-intro-corner-top-left").remove();
    $("span").remove();
    document.querySelector("#hud-intro > div.hud-intro-footer").remove();
    document.querySelector("#hud-intro > div.hud-intro-corner-bottom-left > div").remove();
    document.querySelector("#hud-intro > div.hud-intro-corner-bottom-right > div > a").remove();
    document.querySelector("#hud-intro > div.hud-intro-wrapper > div > div.hud-intro-guide").style.visibility = "hidden";
    document.querySelector("#hud-intro > div.hud-intro-wrapper > div > div.hud-intro-left > a").style.visibility = "hidden";
    document.querySelector("#hud-intro > div.hud-intro-wrapper > div > div.hud-intro-form > label").remove();
    $(".ad-unit").remove();

    const SettingsGrid = document.getElementsByClassName("hud-settings-grid")[0];
    const SettingsMenu = document.getElementById("hud-menu-settings");

    let ul = "data:image/jpg;base64,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";
    SettingsMenu.style.backgroundImage = `linear-gradient(to bottom, rgba(0,0,0,0.6) 0%,rgba(0,0,0,0.6) 100%), url(${ul})`;
    SettingsMenu.style.backgroundSize = "cover";

    const entirePop = document.getElementsByClassName("hud-intro-wrapper")[0].children[1];
    let request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let data = JSON.parse(request.responseText);
            entirePop.innerHTML = `People in game now: ${data.players} / ${(data.players / data.capacity * 100).toFixed(2)}%`;
            entirePop.style.marginTop = "10px";
            let servers = ["US East", "US West", "Europe", "Asia", "Australia", "South America"];
            for (let i in servers) {
                game.ui.components.Intro.serverElem.children[i].setAttribute("label", `${servers[i]} ${data.regions[servers[i]].players} / ${data.regions[servers[i]].capacity}`);
            };
        };
    };
    request.open("GET", "/capacity", true);
    request.send();

    const SettingsHTML = `
<h1 style="display:inline-block;margin-right:10px;">Render</h1><button class="btn" id="renderOpen" style="display:inline-block;margin-top:25px;">></button>
<br>
<div id="renderContents" style="display:none;">
<input type="text" id="playerPerspInput" style="margin-right:10px;" placeholder="Player name..." /><button class="btn btn-blue" id="playerPersp" style="margin-top:6px;">Entity Perspective</button><button class="btn btn-red" id="resetPersp" style="margin-top:6px;">Reset View</button>
<select id="perspType"><option value="name" selected>Player Name</option><option value="uid">UID</option></select>
<br>
<br>
<label style="display:inline-block;margin-right:10px;" id="blurView">Blur: 0 pixels</label><br><input type="range" id="blur" style="display:inline-block;" min=0 max=100 value=0 /><button class="btn btn-red" id="resetBlur" style="margin-left:10px;">Reset Blur</button><label style="display:inline-block;margin-left:10px;">Blur the whole page?</label><input type="checkbox" id="blurFull" style="display:inline-block;" />
<br>
<br>
<label style="display:inline-block;margin-right:10px;">FreeCam?</label><input type="checkbox" id="freecam" style="display:inline-block;" />
<br>
<label style="display:inline-block;margin-right:10px;">Ghost?</label><input type="checkbox" id="Ghost" style="display:inline-block;" />
<br>
<label style="display:inline-block;margin-right:10px;">Lock Camera?</label><input type="checkbox" id="lockCam" style="display:inline-block;" />
<br>
<h1>Base Overlay</h1>
<hr>
<br>
<button class="btn btn-blue" id="saveBase">Show Base</button>
</div>
<h1 style="display:inline-block;margin-right:10px;">Automation</h1><button class="btn" id="autoOpen" style="display:inline-block;margin-top:25px;">></button>
<br>
<div id="autoContents" style="display:none;">
<input type="number" id="xauto" placeholder="X Pos" style="border-radius:15px;width:75px;margin-top:10px;" min=13 max=23973 /><input type="number" id="yauto" placeholder="Y Pos" style="border-radius:15px;width:75px;margin-right:10px;margin-top:10px;" min=13 max=23973 /><button class="btn btn-blue" id="automoveBtn" style="display:inline-block;margin-right:10px;">Move!</button><button class="btn btn-red" style="display:none;" id="moveStop">Stop</button>
<br>
<h2>Macros</h2>
<hr>
<input type="text" placeholder="Macro ID..." id="macroid"><button class="btn btn-blue" id="macrobtn">Start Recording Macro</button>
</div>
<h1 style="display:inline-block;margin-right:10px;">Exploit</h1><button class="btn" id="exploitOpen" style="display:inline-block;margin-top:25px;">></button>
<div id="exploitContents" style="display:none;">
<label style="display:inline-block;margin-right:10px;">Reduce Zombie Damage? (requires shield)</label><input type="checkbox" id="zombieInvinc" style="display:inline-block;" />
</div>
<br>
<h1 style="display:inline-block;margin-right:10px;">Alts</h1><button class="btn" id="altsOpen" style="display:inline-block;margin-top:25px;">></button>
<div id="altsContents" style="display:none;">
<button class="btn btn-blue" onclick="makeAltWithDisplay();">Make Alt With Display</button><button class="btn btn-red" onclick="makeAltWithoutDisplay();">Make Alt Without Display</button>
<br>
<h2>Alt Displays</h2>
<hr>
<div id="altDisplays">
</div>
</div>
<br>
<h1 style="display:inline-block;margin-right:10px;">Movement</h1><button class="btn" id="moveOpen" style="display:inline-block;margin-top:25px;">></button>
<div id="moveContents" style="display:none;">
<label style="display:inline-block;margin-right:10px;">Grappling Hook?</label><input type="checkbox" id="grappl" style="display:inline-block;" /><label style="display:inline-block;margin-right:10px;margin-left:10px;"> on </label><select id="grapplOn" style="display:inline-block;"><option value="rc" selected>Right Click</option><option value="lc">Left Click</option></select><br>
<label style="display:inline-block;margin-right:10px;">Anchor: </label>
<div id="anchorBtns" style="display:inline-block;">
<button style=\"border-top-left-radius: 25%; border-bottom-left-radius: 25%; z-index: 5; background-color: red; \">←</button><button style=\"z-index: 5; background-color: red; \">→</button><button style=\"z-index: 5; background-color: red; \">↑</button><button style=\"border-top-right-radius: 25%; border-bottom-right-radius: 25%; z-index: 5; background-color: red; \">↓</button>
</div>
</div>
<br>
<h1 style="display:inline-block;margin-right:10px;">Menu</h1><button class="btn" id="menuOpen" style="display:inline-block;margin-top:25px;">></button>
<div id="menuContents" style="display:none;">
<h1 style="display:inline-block;margin-right:10px;margin-left:25px;">Party</h1><button class="btn" id="partyStuffOpen" style="display:inline-block;margin-top:25px;">></button>
<div id="partyStuffContents" style="display:none;margin-left:25px;">
<input type="text" maxlength="20" placeholder="Share key..." class="btn btn-red" id="partyShareKey">
<button class="btn btn-grey" id="join" style="margin-top:0px;">Join Party</button>
<br><br>
<input type="text" maxlength="20" placeholder="Share key..." class="btn btn-red" id="partyShareKey2">
<button class="btn btn-grey" id="join2" style="margin-top:0px;">Join Party</button>
<br><br>
<input type="text" maxlength="20" placeholder="Share key..." class="btn btn-red" id="partyShareKey3">
<button class="btn btn-grey" id="join3" style="margin-top:0px;">Join Party</button>
<br><br>
<button class="btn btn-red" id="leaveParty" style="margin-top:6px;">Leave Party</button>
<br>
<h2>Share Key Logs</h2>
<div id="skl">
</div>
</div>
</div>
<br>
<h1 style="display:inline-block;margin-right:10px;">Info</h1><button class="btn" id="infoOpen" style="display:inline-block;margin-top:25px;">></button>
<br>
<div id="infoContents" style="display:none;">
<p id="playedFor">Played for <strong>0 seconds</strong></p>
<strong>Entity Data: </strong>
<p>(Hover over an entity to see its targetTick here)</p>
<pre id="eDataPre">
</pre>
`;

    const VoiceMessageDiv = document.createElement('div');

    const VoiceMessageHTML = `
<br>
<br>
<button class="btn btn-red" id="micButton" style="margin-left:50px;">🎤</button>
`;

    VoiceMessageDiv.innerHTML = VoiceMessageHTML;

    SettingsGrid.innerHTML = SettingsHTML;

    // SettingsGrid.style.textAlign = "center"

    const PlayerPerspectiveInput = document.getElementById("playerPerspInput");
    const PlayerPerspectiveButton = document.getElementById("playerPersp");
    const PlayerPerspectiveResetButton = document.getElementById("resetPersp");

    const OpenRender = document.getElementById("renderOpen");
    const RenderContents = document.getElementById("renderContents");

    const OpenAlts = document.getElementById("altsOpen");
    const AltsContents = document.getElementById("altsContents");

    const OpenMove = document.getElementById("moveOpen");
    const MoveContents = document.getElementById("moveContents");

    const GhostInput = document.getElementById("Ghost");
    const FreecamInput = document.getElementById("freecam");
    const LockInput = document.getElementById("lockCam");

    const PerspectiveTypeSelect = document.getElementById("perspType");

    const BlurRange = document.getElementById("blur");
    const ViewBlur = document.getElementById("blurView");
    const ResetBlur = document.getElementById("resetBlur");

    const FullBlur = document.getElementById("blurFull");

    const OpenInfo = document.getElementById("infoOpen");
    const InfoContents = document.getElementById("infoContents");

    const menuContents = document.getElementById("menuContents");
    const menuOpen = document.getElementById("menuOpen");

    const partyStuffContents = document.getElementById("partyStuffContents");
    const partyStuffOpen = document.getElementById("partyStuffOpen");
    const leavePartyBtn = document.getElementById("leaveParty");
    const join = document.getElementById("join");
    const join2 = document.getElementById("join2");
    const join3 = document.getElementById("join3");
    const partyShareKey = document.getElementById("partyShareKey1");
    const partyShareKey2 = document.getElementById("partyShareKey2");
    const partyShareKey3 = document.getElementById("partyShareKey3");

    const OpenAutomation = document.getElementById("autoOpen");
    const AutomationContents = document.getElementById("autoContents");

    const PositionXMove = document.getElementById("xauto");
    const PositionYMove = document.getElementById("yauto");

    const MoveStop = document.getElementById("moveStop");

    const AutoMove = document.getElementById("automoveBtn");

    const StartTime = new Date(Date.now());
    const TimePlayedFor = document.getElementById("playedFor");

    const EntityDataPre = document.getElementById("eDataPre");

    const OpenExploit = document.getElementById("exploitOpen");
    const ExploitContents = document.getElementById("exploitContents");

    const ZombieInvinc = document.getElementById("zombieInvinc");

    const AltDisplays = document.getElementById("altDisplays");

    const Grappl = document.getElementById("grappl");
    const AnchorButtons = document.getElementById("anchorBtns");

    const GrapplOn = document.getElementById("grapplOn");

    const MacroButton = document.getElementById("macrobtn");
    const MacroID = document.getElementById("macroid");

    const ShowBase = document.getElementById("saveBase");

    PlayerPerspectiveInput.style.borderRadius = "25px";
    PlayerPerspectiveInput.style.width = "200px";
    PlayerPerspectiveInput.style.height = "50px";

    let hasBeenInWorld = false;
    let hiddenNames = false;

    let playerPerspectiveType = "name";

    let mouseX;
    let mouseY;

    let isInMenu;

    let spinToggle;
    let zombieInvincibilityToggle = false;

    let zombieInvincibilityInterval;

    let grapplingHook = false;

    let anchorLeftInterval;
    let anchorRightInterval;
    let anchorUpInterval;
    let anchorDownInterval;

    // let colors = ["red", "green", "orange", "yellow", "cyan", "turquoise", "purple", "grey", "white"];

    let colors = ["white"];

    window.makeAltWithDisplay = () => {
        if (!isTabAlt) {
            if (altNum < 7) {
                let iElem = document.createElement('iframe');
                iElem.src = `http://zombs.io/#/${game.options.serverId}/${game.ui.getPlayerPartyShareKey()}#altMode`;
                let iElemId = `alt${Math.floor(Math.random() * 99999)}`;
                iElem.id = iElemId;
                iElem.width = "575";
                iElem.height = "300";
                AltDisplays.append(iElem);
                setTimeout(() => { document.getElementById(iElemId).contentWindow.window.eval('document.querySelector(".btn-green").click();'); }, 3750);
                setTimeout(() => { document.getElementById(iElemId).contentWindow.window.eval('document.querySelector(".btn-green").remove();'); }, 4000);
            } else {
                console.log("stopped make alt because alt number was higher than 7");
            };
            altNum++;
        } else {
            AltDisplays.append("You cannot make alts inside of an alt window");
        };
    };

    window.makeAltWithoutDisplay = () => {
        if (!isTabAlt) {
            if (altNum < 7) {
                let iElem = document.createElement('iframe');
                iElem.src = `http://zombs.io/#/${game.options.serverId}/${game.ui.getPlayerPartyShareKey()}`;
                let iElemId = `alt${Math.floor(Math.random() * 99999)}`;
                iElem.id = iElemId;
                iElem.style.display = "none";
                document.body.append(iElem);
                setTimeout(() => { document.getElementById(iElemId).contentWindow.window.eval('document.querySelector(".btn-green").click();'); }, 3750);
            } else {
                console.log("stopped make alt because alt number was higher than 7");
            };
            altNum++;
        } else {
            AltDisplays.append("You cannot make alts inside of an alt window");
        };
    }
    function leaveParty() {
        game.network.sendRpc({ name: "LeaveParty" })
    };
    const getAllElements = () => {
        return document.getElementsByTagName("*");
    };


    document.querySelector("#hud-menu-settings > h3")
        .innerHTML = `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAAAyCAYAAACqNX6+AAADcUlEQVR4nO3WX0hTURwH8O/dvXdXHV7vWLM2zVtjaEsJQ2PEpALxwVhQUASS5FMQhETgSwRBPfTgQ9hbL1YvUSjhQ0SiyIpC6B9KaGVMcM0MmaKJ2tbc4kwF/+yqc1NJfx924Z7d3+/cc3d2fucChBBCCCGEEEII2UbKgNMNwJc64JFWzHXgCYtxAqdYuwK4xNo1QL1Wzm2gg8UcApysXQXcYO3zQF28eAngG4BuFmMB9qfm6TafkGwHBiArBzgQAn5pxewGVBbDYlk7EzCxtg/4pJVjAewKsDc9dgtAAfawHCOQHS+eA8CuA9CLgD7Z59oquq0eAFks6RXyvzKZTAdVVT0TiUT+er3exxMTE/6tHhNSOSE8IMhzJWkpncZ9BEDUyuFmq9AyrBzFy5FiQ1gbWZbzKisr3w0ODj4TBCGroKDgSktLiyMYDE6utY+NkrIJyQPKGoGxRHKOAOfYkUjOcaCWHQkPcIGcnJyKcDg87vF4LgqCIFVVVU2ZzeZSv9//Kpl+UyHpPWQA6AkD04nkDAHdESCcSE4/8BFAJNHxmUym/PLy8qeiKEqqqp50uVx3/X5/a0dHx5loNBrV6/UZbEGGw+Fgon1vhKRXyFfgQw1g4mNVI747QJsVKJ1vdwIvugBFF6tA8d0DPmcBufPtl8CD10Azp1Ga0gD+PvATS96wRkdHv8uyXGC326ttNlv1wMBAE9sv2GG1Wk84nc6GoaGh58PDw+/X9QOkWEpK1p/ZFaK5SqJxVsM0sGK9jsY+i00BE1rxMxoTxVZBT09PfUlJST3HcUJfX1/j/DVWriRJ2hUIBN5GIpGZlcazWXbEa29/f38Tz/Oy1+t9GAqFpua/9/l8re3t7RU2m+0ye+va2lHO2hETYrFYjvE8n5adne2aax8tLCy8ys5HRkZ62d5kMBhyV+1oE2zKhPwGfGPAt2DsdG3GAS/LCcUq1epYfRsD+ljODBBaeM3hcNT29vbeyszMdFitVpfBYFCLi4tv6vX6dEVR7Ox3mJyc/LGeZ0u1uO/624nRaLS73e6u5uZmtaio6JrRaCz0eDwX3G53pyiKsk6nSwsEAm/a2trOIs6+RVJMkqQsWZb3sXNRFDMURcnH3IbOVovZbD7Mcdy2/2MSQgghhBBCCCGEEEIIIYQQQgghhBBCCCGELPcPuvTqOaSl/nIAAAAASUVORK5CYII=">`;

    SettingsGrid.style.background = "rgba(0, 0, 0, 0)";
    SettingsMenu.style.overflow = "hidden";
    /*
    let diagram = document.createElement('div');
    diagram.id = "diagram";

    SettingsGrid.append(diagram);

    document.getElementById("diagram").innerHTML = brain.utilities.toSVG(window.net);
    document.getElementById("diagram").style.position = "absolute"
    */

    const toggleSpin = () => {
        if (spinToggle) {
            clearInterval(window.spinInterval);
        } else {
            let spin = 0;
            window.spinInterval = setInterval(() => {
                spin = (spin + 1) % 2;
                spin ? game.network.sendInput({
                    mouseMoved: 179
                }) : game.network.sendInput({
                    mouseMoved: 359
                });
            }, 49);
        }
        spinToggle = !spinToggle;
        game.ui.getComponent("PopupOverlay")
            .showHint("Toggled Spin", 3e3);
    };


    const lookAtPlayer = name => {
        Object.values(game.world.entities)
            .forEach((entity => {
                if (entity.entityClass === "PlayerEntity") {
                    if (entity.targetTick.name === name) {
                        game.renderer.followingObject = entity;
                    };
                };
            }));
    };

    const lookAtEntity = uid => {
        Object.values(game.world.entities)
            .forEach((entity => {
                if (entity.uid === uid) {
                    game.renderer.followingObject = entity;
                };
            }));
    };

    const anchor = (dir) => {
        eval(`anchor${dir}Interval = setInterval(() => { game.network.sendInput({ ${dir.toLowerCase()}: 1 }); });`)
    };

    const unanchor = (dir) => {
        eval(`clearInterval(anchor${dir}Interval);`);
        game.network.sendInput({ left: 0, right: 0, up: 0, down: 0 });
    };

    const turnTowards = (x, y) => {
        let worldPos = game.renderer.worldToScreen(x, y);
        game.inputManager.emit('mouseMoved', { clientX: worldPos.x, clientY: worldPos.y });
    };

    const moveTowards = (targetX, targetY, movesMade) => {
        let player = game.world.localPlayer.entity.targetTick.position;
        if (player.x <= targetX && player.y <= targetY) {
            game.network.sendInput({
                right: 1,
                left: 0,
                up: 0,
                down: 1
            });
        } else if (player.x >= targetX && player.y <= targetY) {
            game.network.sendInput({
                right: 0,
                left: 1,
                up: 0,
                down: 1
            });
        } else if (player.x <= targetX && player.y >= targetY) {
            game.network.sendInput({
                right: 1,
                left: 0,
                up: 1,
                down: 0
            });
        } else if (player.x >= targetX && player.y >= targetY) {
            game.network.sendInput({
                right: 0,
                left: 1,
                up: 1,
                down: 0
            });
        };
        turnTowards(targetX, targetY);
        return movesMade + 1;
    };

    const moveAwayFrom = (targetX, targetY, movesMade) => {
        let player = game.world.localPlayer.entity.targetTick.position;
        if (player.x <= targetX && player.y <= targetY) {
            game.network.sendInput({
                right: 0,
                left: 1,
                up: 1,
                down: 0
            });
        } else if (player.x >= targetX && player.y <= targetY) {
            game.network.sendInput({
                right: 1,
                left: 0,
                up: 1,
                down: 0
            });
        } else if (player.x <= targetX && player.y >= targetY) {
            game.network.sendInput({
                right: 0,
                left: 1,
                up: 0,
                down: 1
            });
        } else if (player.x >= targetX && player.y >= targetY) {
            game.network.sendInput({
                right: 1,
                left: 0,
                up: 0,
                down: 1
            });
        };
        turnTowards(targetX, targetY);
        return movesMade + 1;
    };

    const timeSince = date => {

        var seconds = Math.floor((new Date() - date) / 1000);

        var interval = seconds / 31537000;

        if (interval > 1) {
            return Math.floor(interval) + " years";
        }
        interval = seconds / 2592000;
        if (interval > 1) {
            return Math.floor(interval) + " months";
        }
        interval = seconds / 86400;
        if (interval > 1) {
            return Math.floor(interval) + " days";
        }
        interval = seconds / 3700;
        if (interval > 1) {
            return Math.floor(interval) + " hours";
        }
        interval = seconds / 60;
        if (interval > 1) {
            return Math.floor(interval) + " minutes";
        }
        return Math.floor(seconds) + " seconds";
    }

    const restoreView = () => {
        lookAtPlayer(game.world.localPlayer.entity.targetTick.name);
    };

    const onGhost = event => {
        game.world.localPlayer.entity.targetTick.position = game.renderer.screenToWorld(event.clientX, event.clientY);
    };

    const toggleGhost = checked => {
        if (!checked) {
            removeEventListener('mousemove', onGhost);
        } else {
            addEventListener('mousemove', onGhost);
        };
    };

    const extend = (object1, ...object2) => {

        let mergedObject = Object.assign(object1, ...object2);

        return mergedObject;
    };

    const toggleZombieInvincibility = () => {
        if (zombieInvincibilityToggle = !zombieInvincibilityToggle) {
            zombieInvincibilityInterval = setInterval(() => {
                if (game.ui.inventory.ZombieShield) {
                    game.network.sendPacket(9, { name: "EquipItem", itemName: "ZombieShield", tier: game.ui.inventory.ZombieShield.tier });
                };
            });
        } else {
            clearInterval(zombieInvincibilityInterval);
        };
    };

    const moveToPosition = (x, y) => {
        let moveCount = 0;
        window.moveInterval = setInterval(() => {
            if (!isPlayerCloseTo(x, y)) {
                moveCount = moveTowards(x, y, moveCount);
            } else {
                clearInterval(window.moveInterval);
                game.network.sendRpc({ name: "SendChatMessage", channel: "Local", message: ` Done moving, with ${moveCount} moves in total! ` });
                AutoMove.classList.replace('btn-red', 'btn-blue');
                AutoMove.innerHTML = "Move!";
                game.network.sendInput({ right: 0, left: 0, up: 0, down: 0 });
            };
        }, 250);
    };

    const moveCameraTo = (x, y) => {
        game.renderer.follow({ getPositionX: () => x, getPositionY: () => y }); // The game doesn't even check if its an entity lol
    };

    const onFreecam = event => {
        let worldPos = game.renderer.screenToWorld(event.clientX, event.clientY);
        moveCameraTo(worldPos.x, worldPos.y);
    };

    const toggleFreecam = checked => {
        if (!checked) {
            removeEventListener('mousemove', onFreecam);
            game.renderer.followingObject = game.world.localPlayer.entity;
        } else {
            addEventListener('mousemove', onFreecam);
        };
    };

    const lockCamera = () => {
        let xSave = game.world.localPlayer.entity.getPositionX();
        let ySave = game.world.localPlayer.entity.getPositionY();
        window.lockCameraInterval = setInterval(() => {
            moveCameraTo(xSave, ySave);
        });
    };

    const unlockCamera = () => {
        clearInterval(window.lockCameraInterval);
        game.renderer.follow(game.world.localPlayer.entity);
    };

    const UpdateRangesFromMenu = () => {
        let newBlur = BlurRange.value;
        if (FullBlur.checked) {
            document.documentElement.style.filter = `blur(${newBlur}px)`;
        } else {
            document.querySelector('canvas').style.filter = `blur(${newBlur}px)`;
        };
        ViewBlur.innerHTML = parseInt(newBlur) === 1 ? `Blur: 1 pixel` : `Blur: ${newBlur} pixels`
    };

    const GetEntitiesByClass = Class => {
        for (let entity of Object.values(game.world.entities)) {
            if (entity.targetTick.entityClass !== Class) continue;
            return entity;
        };
    };

    const GetEntitiesByModel = Model => {
        for (let entity of Object.values(game.world.entities)) {
            if (entity.targetTick.model !== Model) continue;
            return entity;
        };
    };

    const getPseudoElement = (elem, ps) => {
        return window.getComputedStyle(elem, `:${ps}`);
    };

    const sendVoiceMessage = () => {
        var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
        var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
        var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent

        var words = ['hi', 'hello', 'stop', 'base', 'sup', 'base', 'raid', 'wood', 'stone', 'gold', 'score', 'wave', 'waves', 'raider'];
        var grammar = '#JSGF V1.0; grammar word; public <word> = ' + words.join(' | ') + ' ;'

        var recognition = new SpeechRecognition();
        var speechRecognitionList = new SpeechGrammarList();
        speechRecognitionList.addFromString(grammar, 1);
        recognition.grammars = speechRecognitionList;
        recognition.continuous = false;
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onresult = function (event) {
            var said = event.results[0][0].transcript;
            game.network.sendRpc({ name: "SendChatMessage", channel: "Local", message: said });
        };

        recognition.onspeechend = function () {
            recognition.stop();
        };

        recognition.start();

        // if(navigator.userAgent.includes('Chrome')) {
        alert('Insecure sites cannot access the microphone in some browsers.');
        // };
    };

    const fakeMessage = (name, message) => {
        let chatUi = game.ui.getComponent("Chat");
        var messageElem = chatUi.ui.createElement("<div class=\"hud-chat-message\"><strong style=\"color:blue;\">" + name + "</strong>: " + message + "</div>");
        chatUi.messagesElem.appendChild(messageElem);
        chatUi.messagesElem.scrollTop = chatUi.messagesElem.scrollHeight;
    };

    const chatLog = msg => {
        let chatUi = game.ui.getComponent("Chat");
        var messageElem = chatUi.ui.createElement("<div class=\"hud-chat-message\"><p style=\"color: " + colors[Math.floor(Math.random() * colors.length)] + "\">" + msg + "</p></div>");
        chatUi.messagesElem.appendChild(messageElem);
        chatUi.messagesElem.scrollTop = chatUi.messagesElem.scrollHeight;
    };


    const dist = (a, b) => {
        return Math.sqrt(Math.pow((b.y - a[2]), 2) + Math.pow((b.x - a[1]), 2));
    };

    const grabEntity = (reject) => {
        let nearest = Object.values(game.world.entities).sort((a, b) => dist(a.targetTick.position, game.world.localPlayer.entity.targetTick.position) - dist(b.targetTick.position, game.world.localPlayer.entity.targetTick.position))[0];
        if (nearest !== reject) {
            return nearest;
        } else if (nearest) {
            let entitiesClone = game.world.entities;
            delete entitiesClone[reject.uid];
            let nearest = Object.values(entitiesClone).sort((a, b) => dist(a.targetTick.position, game.world.localPlayer.entity.targetTick.position) - dist(b.targetTick.position, game.world.localPlayer.entity.targetTick.position))[0];
            if (nearest) {
                return nearest;
            };
        }
    };

    window.botPrototype = () => {
        let lastGrabbed = { uid: 0 };
        let grabNum = 0;
        let space = 0;
        setInterval(() => {
            let grabbed = grabEntity(lastGrabbed);
            if (grabbed.error !== "NoEntitiesExist") {
                let grabt = grabbed.targetTick;
                let grabtp = grabt.position;
                if ((grabt.model === "Tree" || grabt.model === "Stone") && !space) {
                    game.network.sendInput({ space: 1 });
                    space = true;
                } else {
                    game.network.sendInput({ space: 0 });
                    space = false;
                };
                if (grabNum > 899) {
                    lastGrabbed = grabbed;
                    grabNum = 0;
                } else {
                    grabNum++;
                };
                moveTowards(grabtp.x, grabtp.y, 0);
            };
        }, 10);
    };

    window.smoothSpinPrototype = () => {
        let x = 1300;
        let y = 1300;
        setInterval(() => {
            turnTowards(x + 100, y + 100);
            x += (x * Math.PI) / 20000 % x + 20000;
            y += (y * Math.PI) / -20000 % y + 20000;
        }, 10)
    };

    ZombieInvinc.addEventListener('change', toggleZombieInvincibility);

    PlayerPerspectiveButton.addEventListener('click', function (event) {
        if (playerPerspectiveType === "name") {
            let PlayerNameVal = PlayerPerspectiveInput.value;
            lookAtPlayer(PlayerNameVal);
        } else {
            let EntityUidVal = PlayerPerspectiveInput.value;
            lookAtEntity(parseInt(EntityUidVal));
        };
    });

    leavePartyBtn.addEventListener('click', function (event) {
        leaveParty();
    });

    join.addEventListener('click', function (event) {
        let partyKey = partyShareKey.value
        Game.currentGame.network.sendRpc({
            name: "JoinPartyByShareKey",
            partyShareKey: partyKey
        })
    });
    join2.addEventListener('click', function (event) {
        let partyKey = partyShareKey2.value
        Game.currentGame.network.sendRpc({
            name: "JoinPartyByShareKey",
            partyShareKey: partyKey
        })
    });

    join3.addEventListener('click', function (event) {
        let partyKey = partyShareKey3.value
        Game.currentGame.network.sendRpc({
            name: "JoinPartyByShareKey",
            partyShareKey: partyKey
        })
    });

    let chatSocket = new WebSocket('wss://HighlevelEqualBetaversion.eh7644.repl.co/');

    const objToArray = obj => {
        let arr = [];
        for (let i in obj) {
            arr.push(obj[i]);
        };
        return arr;
    };

    chatSocket.onmessage = msg => {
        let parsed = JSON.parse(msg.data);
        switch (parsed.type) {
            case "chat":
                fakeMessage(parsed.name, parsed.message);
                break;
            case "dm":
                fakeMessage(parsed.from, parsed.message);
            case "log":
                chatLog(parsed.content);
                break;
        };
    };

    window.getScreen = () => {
        let gameCanvas = document.querySelector('canvas');
        let stream = gameCanvas.captureStream();
        return stream;
    };

    const classToObject = theClass => {
        const originalClass = theClass || {}
        const keys = Object.getOwnPropertyNames(Object.getPrototypeOf(originalClass))
        return keys.reduce((classAsObj, key) => {
            classAsObj[key] = originalClass[key]
            return classAsObj
        }, {})
    }

    window.sendGlobalMsg = (author, content) => {
        chatSocket.send(JSON.stringify({ type: "chat", name: author, message: content }));
    };

    window.sendDM = (to, content) => {
        chatSocket.send(JSON.stringify({ type: "dm", to: to, content: content }));
    };

    PlayerPerspectiveResetButton.addEventListener('click', function (event) {
        restoreView();
    });

    GhostInput.addEventListener('change', function () {
        toggleGhost(this.checked);
    });

    FreecamInput.addEventListener('change', function () {
        toggleFreecam(this.checked);
    });

    LockInput.addEventListener('change', function () {
        if (this.checked) {
            lockCamera();
        } else {
            unlockCamera();
        };
    });

    AnchorButtons.childNodes[1].addEventListener('click', function () {
        if (this.style.backgroundColor === "red") {
            this.style.backgroundColor = "green";
            anchor("Left");
        } else {
            this.style.backgroundColor = "red";
            unanchor("Left");
        };
    });

    AnchorButtons.childNodes[2].addEventListener('click', function () {
        if (this.style.backgroundColor === "red") {
            this.style.backgroundColor = "green";
            anchor("Right");
        } else {
            this.style.backgroundColor = "red";
            unanchor("Right");
        };
    });

    AnchorButtons.childNodes[3].addEventListener('click', function () {
        if (this.style.backgroundColor === "red") {
            this.style.backgroundColor = "green";
            anchor("Up");
        } else {
            this.style.backgroundColor = "red";
            unanchor("Up");
        };
    });

    AnchorButtons.childNodes[4].addEventListener('click', function () {
        if (this.style.backgroundColor === "red") {
            this.style.backgroundColor = "green";
            anchor("Down");
        } else {
            this.style.backgroundColor = "red";
            unanchor("Down");
        };
    });

    PerspectiveTypeSelect.addEventListener('change', function (event) {
        switch (this.value) {
            case "uid":
                PlayerPerspectiveInput.placeholder = "Entity UID...";
                break;
            case "name":
                PlayerPerspectiveInput.placeholder = "Player Name...";
                break;
        };
        playerPerspectiveType = this.value;
    });

    ResetBlur.addEventListener('click', function () {
        document.documentElement.style.filter = ``;
        document.querySelector('canvas').style.filter = ``;
    });

    OpenRender.addEventListener('click', function (event) {
        RenderContents.style.display = RenderContents.style.display === "block" ? "none" : "block";
        this.innerText = RenderContents.style.display === "block" ? "ᐯ" : ">";
    });

    OpenMove.addEventListener('click', function (event) {
        MoveContents.style.display = MoveContents.style.display === "block" ? "none" : "block";
        this.innerText = MoveContents.style.display === "block" ? "ᐯ" : ">";
    });

    OpenAlts.addEventListener('click', function (event) {
        AltsContents.style.display = AltsContents.style.display === "block" ? "none" : "block";
        this.innerText = AltsContents.style.display === "block" ? "ᐯ" : ">";
    });

    MacroButton.addEventListener('click', function () {
        if (this.innerText === "Start Recording Macro") {
            this.classList.replace("btn-blue", "btn-red");
            this.innerText = "Stop Recording Macro";
            window.startRecordingMacro(MacroID.value);
        } else {
            window.stopRecordingMacro();
            this.classList.replace("btn-red", "btn-blue");
            this.innerText = "Start Recording Macro";
            let macroKeybind = prompt("What key do you want to bind to this macro?");
            let macroVal = MacroID.value;
            addEventListener('keydown', function (e) {
                if (e.key === macroKeybind) {
                    window.executeMacro(macroVal);
                };
            });
        };
    });
    menuOpen.addEventListener('click', function (event) {
        menuContents.style.display = menuContents.style.display === "block" ? "none" : "block";
        this.innerText = menuContents.style.display === "block" ? "ᐯ" : ">";
    });

    partyStuffOpen.addEventListener('click', function (event) {
        partyStuffContents.style.display = partyStuffContents.style.display === "block" ? "none" : "block";
        this.innerText = partyStuffContents.style.display === "block" ? "ᐯ" : ">";
    });

    OpenExploit.addEventListener('click', function (event) {
        ExploitContents.style.display = ExploitContents.style.display === "block" ? "none" : "block";
        this.innerText = ExploitContents.style.display === "block" ? "ᐯ" : ">";
    });

    OpenInfo.addEventListener('click', function (event) {
        InfoContents.style.display = InfoContents.style.display === "block" ? "none" : "block";
        this.innerText = InfoContents.style.display === "block" ? "ᐯ" : ">";
    });

    ShowBase.addEventListener('click', function () {
        window.placeTowers(window.saveTowers());
    });

    game.network.addRpcHandler("PartyShareKey", function (e) {
        let sklDiv = document.createElement("div");
        let cpKeyId = `skl${Math.floor(Math.random() * 999999)}`;
        let cpLnkId = `skl${Math.floor(Math.random() * 999999)}`;
        let psk = e.partyShareKey;
        let lnk = `http://zombs.io/#/${game.options.serverId}/${psk}/`;
        sklDiv.innerHTML = `<div style="display:inline-block;margin-right:10px;"><p>${psk} <a href="${lnk}" target="_blank" color="blue">[Link]</a></p></div><button class="btn btn-blue" id="${cpKeyId}" style="display:inline-block;">Copy Key</button><button class="btn btn-blue" id="${cpLnkId}" style="display:inline-block;">Copy Link</button>`
        document.getElementById("skl").append(sklDiv);
        document.getElementById(cpKeyId).addEventListener('click', function (e) {
            const elem = document.createElement('textarea');
            elem.value = psk;
            document.body.appendChild(elem);
            elem.select();
            document.execCommand('copy');
            document.body.removeChild(elem);
            game.ui.getComponent("PopupOverlay").showHint("Copied to clipboard", 3e3);
        });
        document.getElementById(cpLnkId).addEventListener('click', function (e) {
            const elem = document.createElement('textarea');
            elem.value = lnk;
            document.body.appendChild(elem);
            elem.select();
            document.execCommand('copy');
            document.body.removeChild(elem);
            game.ui.getComponent("PopupOverlay").showHint("Copied to clipboard", 3e3);
        });
    });

    OpenAutomation.addEventListener('click', function (event) {
        AutomationContents.style.display = AutomationContents.style.display === "block" ? "none" : "block";
        this.innerText = AutomationContents.style.display === "block" ? "ᐯ" : ">";
    });

    Grappl.addEventListener('change', function () {
        grapplingHook = this.checked;
    });

    AutoMove.addEventListener('click', function () {
        switch (this.innerHTML) {
            case "Pause":
                clearInterval(window.moveInterval);
                game.network.sendRpc({ name: "SendChatMessage", channel: "Local", message: "Paused move..." });
                game.network.sendInput({ right: 0, left: 0, up: 0, down: 0 });
                MoveStop.style.display = "inline-block";
                this.classList.replace('btn-red', 'btn-blue');
                this.innerHTML = "Resume";
                break;
            case "Resume":
                this.classList.replace('btn-blue', 'btn-red');
                moveToPosition(PositionXMove.value, PositionYMove.value);
                game.network.sendRpc({ name: "SendChatMessage", channel: "Local", message: `Resumed move to X:${PositionXMove.value},Y:${PositionYMove.value}` });
                MoveStop.style.display = "none";
                this.innerText = "Pause";
                break;
            case "Move!":
                this.classList.replace('btn-blue', 'btn-red');
                this.innerText = "Pause";
                moveToPosition(PositionXMove.value, PositionYMove.value);
                game.network.sendRpc({ name: "SendChatMessage", channel: "Local", message: `Starting move to X:${PositionXMove.value},Y:${PositionYMove.value}` });
                break;
        };
    });

    MoveStop.addEventListener('click', function () {
        clearInterval(window.moveInterval);
        this.style.display = "none";
        AutoMove.innerHTML = "Move!";
        AutoMove.classList.replace('btn-red', 'btn-blue');
        game.network.sendRpc({ name: "SendChatMessage", channel: "Local", message: "Stopped move" });
    });

    addEventListener("keypress", function (event) {
        switch (event.key) {
            case "]":
                toggleSpin();
                break;
            case "[":
                hiddenNames = !hiddenNames;
                game.ui.getComponent("PopupOverlay")
                    .showHint("Toggled Hidden Names", 3e3)
                break;
        };
    });

    addEventListener('mousemove', function (event) {
        mouseX = event.clientX;
        mouseY = event.clientY;
        if (game.world.inWorld) {
            for (let entity of Object.values(game.world.entities)) {
                let eTick = entity.targetTick;
                let ePos = eTick.position;

                let mxWorld = game.renderer.screenToWorld(mouseX, mouseY).x;
                let myWorld = game.renderer.screenToWorld(mouseX, mouseY).y;

                if (!isPositionCloseTo(mxWorld, myWorld, ePos.x, ePos.y)) continue;
                EntityDataPre.textContent = JSON.stringify(eTick, undefined, 2);
            };
        };
    });

    addEventListener('contextmenu', function (e) {
        e.preventDefault();
        if (grapplingHook) {
            if (GrapplOn.value === "rc") {
                let pos = game.renderer.screenToWorld(mouseX, mouseY);
                moveTowards(pos.x, pos.y, 0);
                setTimeout(() => {
                    game.network.sendInput({ right: 0, left: 0, up: 0, down: 0 });
                }, 650);
            };
        };
    });

    addEventListener('click', function () {
        if (grapplingHook) {
            if (GrapplOn.value === "lc" && SettingsMenu.style.display !== "block") {
                let pos = game.renderer.screenToWorld(mouseX, mouseY);
                moveTowards(pos.x, pos.y, 0);
                setTimeout(() => {
                    game.network.sendInput({ right: 0, left: 0, up: 0, down: 0 });
                }, 650);
            };
        };
    });

    const randomString = length => {
        var result = [];
        var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-=_+[]{};";
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
        };
        return result.join('');
    };

    const isPlayerCloseTo = (x, y) => {
        let playerTargetTick = game.world.localPlayer.entity.targetTick.position;
        const radius = 50;
        return ((x <= (playerTargetTick.x + radius) && x >= (playerTargetTick.x - radius)) && (y <= (playerTargetTick.y + radius) && y >= (playerTargetTick.y -
            radius)));
    };

    const isPositionCloseTo = (x, y, targetX, targetY) => {
        let targetPos = { x: targetX, y: targetY };
        const radius = 50;
        return ((x <= (targetPos.x + radius) && x >= (targetPos.x - radius)) && (y <= (targetPos.y + radius) && y >= (targetPos.y -
            radius)));
    };

    document.hasFocus3 = true;
    let lastTick = Date.now();
    let _inactiveTick = () => {
        if (!document.hasFocus() && !document.hasFocus3) game.renderer.ticker._tick2();
        if ((Date.now() - lastTick) > 500) {
            document.hasFocus3 = false;
        }
        if (document.hasFocus()) {
            if (document.hasFocus3 == false) {
                document.hasFocus3 = true;
            }
        }
    }
    let _Tick = () => {
        if (document.hasFocus() || document.hasFocus3) game.renderer.ticker._tick2();
        requestAnimationFrame(_Tick);
        lastTick = Date.now();
    }
    !game.renderer.ticker._tick2 && (game.renderer.ticker._tick2 = game.renderer.ticker._tick, _Tick(), game.network.addPacketHandler(0, () => _inactiveTick()));
    game.renderer.ticker._tick = () => { };

    game.network.addEnterWorldHandler(() => {
        if (!hasBeenInWorld) {
            theme.pause();
            theme2.play();
            hasBeenInWorld = true;
            setInterval(() => {
                Object.values(game.world.entities)
                    .forEach((entity => {
                        if (entity.targetTick.model === "GamePlayer" && hiddenNames) {
                            entity.currentModel.attachments[3].setString("");
                        } else if (entity.targetTick.model === "GamePlayer" && !hiddenNames) {
                            entity.currentModel.attachments[3].setString(entity.targetTick.name);
                        };
                    }));
                TimePlayedFor.innerHTML = `Played for <strong>${timeSince(StartTime)}</strong>`;
                Array.from(getAllElements()).forEach((elem => {
                    elem.style.userSelect = "text";
                }));
            }, 100);
            setInterval(UpdateRangesFromMenu, 0)
            let itemCrossbow = document.createElement('a');

            itemCrossbow.classList.add('hud-toolbar-item');
            itemCrossbow.id = "crossbowItem";

            document.getElementsByClassName("hud-toolbar-inventory")[0].append(itemCrossbow);

            game.network.sendRpc({ name: "BuyItem", itemName: "Crossbow", tier: 1 });

            document.getElementById("crossbowItem").addEventListener('click', function () {
                game.network.sendRpc({ name: "EquipItem", itemName: "Crossbow", tier: 1 });
            });

            document.getElementById("hud-chat").append(VoiceMessageDiv);

            const VoiceButton = document.getElementById("micButton");

            VoiceButton.addEventListener('click', sendVoiceMessage);

            document.querySelector("#hud-chat > input").addEventListener('keypress', function (e) {
                if (e.keyCode === 13) {
                    if (this.value.toLowerCase().startsWith('/chat')) {
                        window.sendGlobalMsg(game.world.localPlayer.entity.targetTick.name, this.value.slice(6));
                        this.value = "";
                    } else if (this.value.toLowerCase().startsWith('/dm')) {
                        let args = this.value.split(' ');
                        window.sendDM(args[1], this.value.slice(args[1].length + 4));
                        this.value = "";
                    } else if (this.value.toLowerCase().startsWith('/users')) {
                        chatSocket.send(JSON.stringify({ type: "getUsers" }));
                        this.value = "";
                    };
                };
            });

            setTimeout(() => {
                chatSocket.send(JSON.stringify({ type: "init", username: game.world.localPlayer.entity.targetTick.name }));
            }, 750);
        };
    });

    SettingsMenu.style.backgroundColor = "rgba(0, 0, 0, 0.45)";
})();


let css =
    `.hud-intro::after { background: url('${spaceimg}'); background-size: cover; opacity: 0.8; }`;
let style = document.createElement('style');
style.appendChild(document.createTextNode(css));
document.head.appendChild(style);
css =
    `.hud-intro-footer { background: url('${spaceimg}'); background-size: cover; opacity: 0.8; }`;
style = document.createElement('style');
style.appendChild(document.createTextNode(css));
document.head.appendChild(style);