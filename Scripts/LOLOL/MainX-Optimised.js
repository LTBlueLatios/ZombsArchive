// ==UserScript==
// @name         main x
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        *://*.zombs.io/*
// @grant        none
// ==/UserScript==
let css2 = `
.btn:hover {
cursor: pointer;
}
.btn-blue {
background-color: #144b7a;
}
.btn-blue:hover .btn-blue:active {
background-color: #4fa7ee;
}
.box {
display: block;
width: 100%;
height: 50px;
line-height: 34px;
padding: 8px 14px;
margin: 0 0 10px;
background: #eee;
border: 0;
font-size: 14px;
box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
border-radius: 4px;
}
.codeIn, .joinOut {
height: 50px;
}
.hud-menu-zipp3 {
display: none;
position: fixed;
top: 48%;
left: 50%;
width: 600px;
height: 470px;
margin: -270px 0 0 -300px;
padding: 20px;
background: rgba(0, 0, 0, 0.6);
color: #eee;
border-radius: 4px;
z-index: 15;
}
.hud-menu-zipp3 h3 {
display: block;
margin: 0;
line-height: 20px;
}
.hud-menu-zipp3 .hud-zipp-grid3 {
display: block;
height: 380px;
padding: 10px;
margin-top: 18px;
background: rgba(0, 0, 0, 0.2);
}
.hud-spell-icons .hud-spell-icon[data-type="Zippity3"]::before {
background-image: url("https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/samsung/220/right-pointing-magnifying-glass_1f50e.png");
}
.hud-menu-zipp3 .hud-the-tab {
position: relative;
height: 40px;
line-height: 40px;
margin: 20px;
border: 0px solid rgb(0, 0, 0, 0);
}
.hud-menu-zipp3 .hud-the-tab {
display: block;
float: left;
padding: 0 14px;
margin: 0 1px 0 0;
font-size: 14px;
background: rgba(0, 0, 0, 0.4);
color: rgba(255, 255, 255, 0.4);
transition: all 0.15s ease-in-out;
}
.hud-menu-zipp3 .hud-the-tab:hover {
background: rgba(0, 0, 0, 0.2);
color: #eee;
cursor: pointer;
}
`;
let styles = document.createElement("style");
styles.appendChild(document.createTextNode(css2));
document.head.appendChild(styles);
styles.type = "text/css";
document.getElementsByClassName("hud-intro-form")[0].style.height = "300px";
document.getElementsByClassName("hud-intro-play")[0].setAttribute("class", "btn btn-blue hud-intro-play");
let spell = document.createElement("div");
spell.classList.add("hud-spell-icon");
spell.setAttribute("data-type", "Zippity3");
spell.classList.add("hud-zipp3-icon");
document.getElementsByClassName("hud-spell-icons")[0].appendChild(spell);
let modHTML = `
<div class="hud-menu-zipp3">
<br />
<div style="text-align:center">
<button class="SE" style="width: 20%">Main (1)</button>
<button class="AB" style="width: 20%">Auto Build</button>
<button class="BS" style="width: 20%">Base Saver</button>
<button class="SI" style="width: 20%">Main (2)</button>
<div class="hud-zipp-grid3">
</div>
</div>
`;
document.body.insertAdjacentHTML("afterbegin", modHTML);
let zipz123 = document.getElementsByClassName("hud-menu-zipp3")[0];
document.getElementsByClassName("hud-zipp3-icon")[0].addEventListener("click", () => {
    zipz123.style.display == "none" || zipz123.style.display == "" ? zipz123.style.display = "block" : zipz123.style.display = "none";
});
let _menu = document.getElementsByClassName("hud-menu-icon");
let _spell = document.getElementsByClassName("hud-spell-icon");
let allIcon = [
    _menu[0],
    _menu[1],
    _menu[2],
    _spell[0],
    _spell[1]
];
allIcon.forEach(elem => {
    elem.addEventListener("click", () => {
        zipz123.style.display == "block" ? zipz123.style.display = "none" : 0;
    });
});
document.getElementsByClassName("SE")[0].addEventListener("click", () => {
    displayAllToNone();
    document.getElementsByClassName("SE")[0].innerText = "- - -";
    document.getElementsByClassName("etc.Class")[0].innerText = "Main";
    for (let i = 0; i < 50; i++) {
        document.getElementsByClassName(i + "i")[0] ? document.getElementsByClassName(i + "i")[0].style.display = "" : 0;
    }
})
document.getElementsByClassName("AB")[0].addEventListener("click", () => {
    displayAllToNone();
    document.getElementsByClassName("AB")[0].innerText = "- - -";
    document.getElementsByClassName("etc.Class")[0].innerText = "Main 3";
    for (let i = 0; i < 50; i++) {
        document.getElementsByClassName(i + "i2")[0] ? document.getElementsByClassName(i + "i2")[0].style.display = "" : 0;
    }
})
document.getElementsByClassName("BS")[0].addEventListener("click", () => {
    displayAllToNone();
    document.getElementsByClassName("BS")[0].innerText = "- - -";
    document.getElementsByClassName("etc.Class")[0].innerText = "Base Saver (1.69)";
    for (let i = 0; i < 50; i++) {
        document.getElementsByClassName(i + "i3")[0] ? document.getElementsByClassName(i + "i3")[0].style.display = "" : 0;
    }
})
document.getElementsByClassName("SI")[0].addEventListener("click", () => {
    displayAllToNone();
    document.getElementsByClassName("SI")[0].innerText = "- - -";
    document.getElementsByClassName("etc.Class")[0].innerText = "Main 2";
    for (let i = 0; i < 50; i++) {
        document.getElementsByClassName(i + "i5")[0] ? document.getElementsByClassName(i + "i5")[0].style.display = "" : 0;
    }
})
function displayAllToNone() {
    document.getElementsByClassName("SE")[0].innerText = "Main (1)";
    document.getElementsByClassName("AB")[0].innerText = "Main (3)";
    document.getElementsByClassName("BS")[0].innerText = "Base Saver";
    document.getElementsByClassName("SI")[0].innerText = "Main (2)";
    for (let i = 0; i < 50; i++) {
        document.getElementsByClassName(i + "i")[0] ? document.getElementsByClassName(i + "i")[0].style.display = "none" : 0;
        document.getElementsByClassName(i + "i2")[0] ? document.getElementsByClassName(i + "i2")[0].style.display = "none" : 0;
        document.getElementsByClassName(i + "i3")[0] ? document.getElementsByClassName(i + "i3")[0].style.display = "none" : 0;
        document.getElementsByClassName(i + "i5")[0] ? document.getElementsByClassName(i + "i5")[0].style.display = "none" : 0;
    }
}
document.getElementsByClassName("hud-zipp-grid3")[0].innerHTML = `
<div style="text-align:center"><br>
<hr />
<h3 class="etc.Class">Normal Scripts!</h3>
<hr />
<button class="btn btn-green 0i" style="width: 45%;">Sell Stash!</button>
<button class="btn btn-blue 1i" style="width: 45%;">Active Sell All!</button>
<button class="btn btn-blue 2i" style="width: 45%;">Active Sell Walls!</button>
<button class="btn btn-blue 3i" style="width: 45%;">Active Sell Doors!</button>
<button class="btn btn-blue 4i" style="width: 45%;">Active Sell Traps!</button>
<button class="btn btn-blue 5i" style="width: 45%;">Active Sell Arrows!</button>
<button class="btn btn-blue 6i" style="width: 45%;">Active Sell Mages!</button>
<button class="btn btn-green 7i" style="width: 45%;">Sell Pets!</button>
<button class="btn btn-blue 8i" style="width: 45%;">Active Upgrade All!</button>
<button class="btn btn-blue 9i" style="width: 45%;">Active AHRC!</button>
<button class="btn btn-blue 10i" style="width: 45%;">Enable Autobow</button>
<button class="btn btn-blue 13i" style="width: 45%;">Enable Auto Accepter</button>
<button class="btn btn-blue 14i" style="width: 45%;">Enable Auto Kicker</button>
<br class="15i"><br class="16i">
<button class="btn btn-green 0i5" style="width: 45%;">Can Members Sell!</button>
<button class="btn btn-green 1i5" style="width: 45%;"">Kick All Members!</button>
<button class="btn btn-blue 3i5" style="width: 45%;">Enable hi Script!</button>
<button class="btn btn-blue 5i5" style="width: 45%;">Enable Send Info!</button>
<button class="btn btn-red 8i5" style="width: 45%;">!(Auto heal and Pet Heal)</button>
<button class="btn btn-red 9i5" style="width: 45%;">!(Revive and Evolve Pets)</button>
<button class="btn btn-blue 6i5" style="width: 45%;">Enable Speed Run</button>
<button class="btn btn-blue 10i5" style="width: 45%;">Clear Messages!</button>
<input style="width: 45%; type="text" class="btn btn-white 12i5" placeholder="Player Party Name">
<button class="btn btn-white 13i5" style="width: 45%;">Active Player Kicker</button>
<br class="14i5"><br class="15i5">
<button class="0i2">Send Alt!</button>
<button class="1i2">Enable Aim!</button>
<button class="2i2">Enable Player Follower!</button>
<button class="10i2 emm">Enable MouseMove!</button>
<br class="23i2"><br class="24i2">
<button class="3i2">Delete Alt!</button>
<input type="number" class="4i2" placeholder="Alt Id">
<button class="7i2">Delete All Alts!</button>
<br class="5i2"><br class="6i2">
<button class="8i2">Show Resources!</button>
<button class="21i2">Uncontrol Alts!</button>
<button class="22i2">Lock Alts!</button>
<br class="9i2"><br class="10i2">
<button class="11i2">Start Aito!</button>
<button class="12i2">Active 4 Player Trick</button>
<button class="13i2">Enable L Key!</button>
<br class="14i2"><br class="15i2">
<input type="text" value="1" class="16i2" placeholder="Player Rank" style="width: 25%;">
<button class="18i2">Active Player Finder</button>
<button class="25i2">Follow Position</button> &nbsp;
<br class="19i2"><br class="20i2">
<button class="0i3">Record Base!</button>
<button class="1i3">Build Recorded Base!</button>
<button class="2i3">Delete Recorded Base!</button>
<br class="3i3"><br class="4i3">
<button class="5i3">Record Base (2)!</button>
<button class="6i3">Build Recorded Base (2)!</button>
<button class="7i3">Delete Recorded Base (2)!</button>
<br class="8i3"><br class="9i3">
<button class="10i3">Record Base (3)!</button>
<button class="11i3">Build Recorded Base (3)!</button>
<button class="12i3">Delete Recorded Base (3)!</button>
<br class="13i3"><br class="14i3">
<button class="15i3">Save Towers!</button>
<button class="16i3">Build Saved Towers!</button>
<br class="17i3"><br class="18i3">
<button class="21i3">Enable Auto Build Saved Towers!</button>
<button class="26i3">Enable Upgrade All!</button>
<br class="28i3"><br class="29i3">
<input type="text" class="30i3" placeholder='Click "Save Towers!" and build your favorite base to get their codes.' style="width: 100%" disabled="true">
<br class="31i3"><br class="32i3">
`;
displayAllToNone();
game.renderer.ground.setVisible(false);
// variables
let altId = 0;
let mousePosition = { x: 0, y: 0 };
let s = { x: 0, y: 0 };
let p = { x: 0, y: 0 };
let s2 = { x: 0, y: 0 };
let p2 = { x: 0, y: 0 };
let s3 = { x: 0, y: 0 };
let p3 = { x: 0, y: 0 };
let s4 = { x: 0, y: 0 };
let p4 = { x: 0, y: 0 };
let pop = 0;
let totalSockets = 0;
let petHealth = 0;
let t = 0;
let af;
let m1;
let m2;
let m3;
let m4;
let m5;
let m6;
let m7;
let m8;
let bowInt;
let bowInt2;
let isPushed = false;
let isPushed2 = false;
let isPushed3 = false;
let isPushed4 = false;
let dataCodes = '';
let dataCodes2 = '';
let dataCodes3 = '';
let dataCodes4 = '';
let arb = [];
let arb2 = [];
let arb3 = [];
let arb4 = [];
let sockets = [];
let space = false;
let sl0 = false;
let sl1 = false;
let sl2 = false;
let sl3 = false;
let sl4 = false;
let sl5 = false;
let sl6 = false;
let sl7 = false;
let sl8 = false;
let sl9 = false;
let slall = false;
let sellall = false;
let sellwalls = false;
let selldoors = false;
let selltraps = false;
let sellarrows = false;
let sellmages = false;
let upgradeall = false;
let ahrc = false;
let autobow = false;
let autoaccepter = false;
let autokicker = false;
let autohi = false;
let sendinfo = false;
let speedrun = false;
let autohealandpetheal = true;
let reviveandevolvepets = true;
let clearmessages = false;
let playerkicker = false;
let autobuildsavedtowers = false;
let upgradeall2 = false;
let aim = false;
let playerfollower = false;
let mousemove = false;
let showresources = false;
let playerfinder = false;
let followposition = false;
let isFound = false;
let isOnControl = true;
let lock = false;
let aito = false;
let fourplayertrick = false;
let spam = false;
let autospear = false;
let autoSpearTier = 0;
let selectedTier = 0;
let requiredGold = 0;
let xkey = false;
let autoSpear = false;
let autoShield = false;
let movements = [90, 225, 44, 314, 135, 359, 180, 270];
let yaws = [];
for (let i = 0; i < 360; i++) {
    yaws.push(i);
}
let angleTo = (xFrom, yFrom, xTo, yTo) => {
    var dx = xTo - xFrom;
    var dy = yTo - yFrom;
    var yaw = Math.atan2(dy, dx) * 180.0 / Math.PI;
    var nonZeroYaw = yaw + 180.0;
    var reversedYaw = nonZeroYaw;
    var shiftedYaw = (360.0 + reversedYaw - 90.0) % 360.0;
    return shiftedYaw;
};
let screenToYaw = function (x, y) {
    var angle = Math.round(angleTo(game.renderer.getWidth() / 2, game.renderer.getHeight() / 2, x, y));
    return angle % 360;
};
let movement_1 = {
    movements: [90, 225, 44, 314, 135, 359, 180, 270],
    typeToValue: { "top": 359, "top right": 44, "right": 90, "bottom right": 135, "bottom": 180, "bottom left": 225, "left": 270, "top left": 314 },
    valueToType: { 359: "top", 44: "top right", 90: "right", 135: "bottom right", 180: "bottom", 225: "bottom left", 270: "left", 314: "top left" },
    aimToYaw: (num) => !(num > 90 + 23) && !(num < 90 - 23)
        ? 90 : !(num > 225 + 23) && !(num < 225 - 23)
            ? 225 : !(num > 135 + 23) && !(num < 135 - 23)
                ? 135 : !(num > 360 + 23) && !(num < 360 - 23)
                    ? 359 : !(num > 0 + 23) && !(num < 0 - 23)
                        ? 359 : !(num > 180 + 23) && !(num < 180 - 23)
                            ? 180 : !(num > 270 + 23) && !(num < 270 - 23)
                                ? 270 : !(num > 315 + 23) && !(num < 315 - 23)
                                    ? 314 : !(num > 45 + 23) && !(num < 45 - 23)
                                        ? 44 : null
};
// handlers
game.network.addEntityUpdateHandler((e) => {
    (t < 10) ? ++t : t = 0;
    game.network.sendPacket(9, { name: "BuyItem", itemName: "HealthPotion", tier: 1 });
    sellall ? Object.values(game.ui.buildings).forEach(i => i.type !== "GoldStash" ? game.network.sendPacket(9, { name: "DeleteBuilding", uid: i.uid }) : 0) : 0;
    sellwalls ? Object.values(game.ui.buildings).forEach(i => i.type == "Wall" ? game.network.sendPacket(9, { name: "DeleteBuilding", uid: i.uid }) : 0) : 0;
    selldoors ? Object.values(game.ui.buildings).forEach(i => i.type == "Door" ? game.network.sendPacket(9, { name: "DeleteBuilding", uid: i.uid }) : 0) : 0;
    selltraps ? Object.values(game.ui.buildings).forEach(i => i.type == "SlowTrap" ? game.network.sendPacket(9, { name: "DeleteBuilding", uid: i.uid }) : 0) : 0;
    sellarrows ? Object.values(game.ui.buildings).forEach(i => i.type == "ArrowTower" ? game.network.sendPacket(9, { name: "DeleteBuilding", uid: i.uid }) : 0) : 0;
    sellmages ? Object.values(game.ui.buildings).forEach(i => i.type == "MagicTower" ? game.network.sendPacket(9, { name: "DeleteBuilding", uid: i.uid }) : 0) : 0;
    upgradeall ? Object.values(game.ui.buildings).forEach(i => i.type !== "GoldStash" && i.tier < 8 ? game.network.sendPacket(9, { name: "UpgradeBuilding", uid: i.uid }) : 0) : 0;
    if (ahrc) {
        Object.values(game.ui.buildings).forEach(obj => {
            game.network.sendPacket(9, { name: "CollectHarvester", uid: obj.uid });
            obj.type == "Harvester" && obj.tier == 1 ? game.network.sendPacket(9, { name: "AddDepositToHarvester", uid: obj.uid, deposit: 0.07 }) : 0;
            obj.type == "Harvester" && obj.tier == 2 ? game.network.sendPacket(9, { name: "AddDepositToHarvester", uid: obj.uid, deposit: 0.11 }) : 0;
            obj.type == "Harvester" && obj.tier == 3 ? game.network.sendPacket(9, { name: "AddDepositToHarvester", uid: obj.uid, deposit: 0.17 }) : 0;
            obj.type == "Harvester" && obj.tier == 4 ? game.network.sendPacket(9, { name: "AddDepositToHarvester", uid: obj.uid, deposit: 0.22 }) : 0;
            obj.type == "Harvester" && obj.tier == 5 ? game.network.sendPacket(9, { name: "AddDepositToHarvester", uid: obj.uid, deposit: 0.25 }) : 0;
            obj.type == "Harvester" && obj.tier == 6 ? game.network.sendPacket(9, { name: "AddDepositToHarvester", uid: obj.uid, deposit: 0.28 }) : 0;
            obj.type == "Harvester" && obj.tier == 7 ? game.network.sendPacket(9, { name: "AddDepositToHarvester", uid: obj.uid, deposit: 0.42 }) : 0;
            obj.type == "Harvester" && obj.tier == 8 ? game.network.sendPacket(9, { name: "AddDepositToHarvester", uid: obj.uid, deposit: 0.65 }) : 0;
        });
    }
    if (autobow) {
        game.network.sendPacket(3, { space: 0 });
        game.network.sendPacket(3, { space: 1 });
        Object.values(sockets).forEach(ws => {
            if (!ws.isclosed) {
                if (isOnControl) {
                    if (ws.inventory) {
                        !ws.inventory.Bow ? ws.network.sendPacket(9, { name: "BuyItem", itemName: "Bow", tier: 1 }) : (ws.myPlayer.weaponName !== "Bow" ? ws.network.sendPacket(9, { name: "EquipItem", itemName: "Bow", tier: ws.inventory.Bow.tier }) : 0);
                    }
                    ws.network.sendPacket(3, { space: 1 });
                    ws.network.sendPacket(3, { space: 0 });
                    ws.network.sendPacket(3, { space: 1 });
                    !autobow ? (ws.network.sendPacket(3, { space: 0 }), ws.network.sendPacket(3, { space: 0 })) : 0;
                }
            }
        });
    };

    autoaccepter ? (document.getElementsByClassName("btn btn-green hud-confirmation-accept")[0] !== undefined ? document.getElementsByClassName("btn btn-green hud-confirmation-accept")[0].click() : 0) : 0;
    autokicker ? (game.ui.playerPartyMembers.length > 1 ? game.network.sendPacket(9, { name: "KickParty", uid: game.ui.playerPartyMembers[1].playerUid }) : 0) : 0;
    autohi ? Object.values(game.world.entities).forEach(i => i.targetTick.name && i.uid !== game.world.myUid ? game.network.sendPacket(9, { name: "SendChatMessage", channel: "Local", message: `hi ${i.targetTick.name}` }) : 0) : 0;
    sendinfo ? Object.values(game.world.entities).forEach(i => i.targetTick.name && i.uid !== game.world.myUid ? game.network.sendPacket(9, { name: "SendChatMessage", channel: "Local", message: `${i.targetTick.name}: [${i.targetTick.wood}, ${i.targetTick.stone}, ${i.targetTick.gold}, ${i.targetTick.token}, ${i.targetTick.partyId}];` }) : 0) : 0;
    speedrun ? (document.getElementsByClassName("hud-shop-actions-equip")[1].click(), document.getElementsByClassName("hud-shop-actions-equip")[2].click()) : 0;
    if (autohealandpetheal) {


        if (game.ui.playerPetTick) {
            petHealth = (game.ui.playerPetTick.health / game.ui.playerPetTick.maxHealth) * 100;
            petHealth < 70 ? (game.network.sendPacket(9, { name: "BuyItem", itemName: "PetHealthPotion", tier: 1 }), game.network.sendPacket(9, { name: "EquipItem", itemName: "PetHealthPotion", tier: 1 })) : 0;
        }
    }
    if (reviveandevolvepets) {
        if (game.ui.playerPetTick) {
            game.ui.playerPetTick.dead ? (game.network.sendPacket(9, { name: "BuyItem", itemName: "PetRevive", tier: 1 }), game.network.sendPacket(9, { name: "EquipItem", itemName: "PetRevive", tier: 1 })) : 0;
            game.ui.playerTick.token >= 100 ? game.network.sendPacket(9, { name: "BuyItem", itemName: game.ui.playerPetName, tier: game.ui.playerPetTick.tier + 1 }) : 0;
        }
    }
    clearmessages ? (document.getElementsByClassName("hud-chat-message").length > 0 ? document.getElementsByClassName("hud-chat-message")[0].remove() : 0) : 0;
    if (playerkicker) {
        game.ui.playerPartyMembers.forEach(i => {
            if (i.playerUid !== game.world.myUid) {
                i.displayName == document.getElementsByClassName("12i5")[0].value ? game.network.sendPacket(9, { name: "KickParty", uid: i.playerUid }) : 0;
            }
        });
    }
    if (autobuildsavedtowers) {
        if (t == 10) {
            s4 = { x: 0, y: 0 };
            dataCodes4 = '';
            Object.values(game.ui.buildings).forEach(e => e.type == "GoldStash" ? (s4.x = e.x, s4.y = e.y) : 0);
            Object.values(arb4).forEach(e => dataCodes4 += `game.network.sendPacket(9, {name: "MakeBuilding", type: "${e.type}", x: s4.x + (${e.x} - p4.x), y: s4.y + (${e.y} - p4.y), yaw: 0});`);
            eval(dataCodes4);
        }
    }
    upgradeall2 ? Object.values(game.ui.buildings).forEach(i => i.type !== "GoldStash" && i.tier < 8 ? game.network.sendPacket(9, { name: "UpgradeBuilding", uid: i.uid }) : 0) : 0;
    if (space) {
        Object.values(sockets).forEach(ws => {
            if (!ws.isclosed) {
                if (isOnControl) {
                    ws.network.sendPacket(3, { mouseDown: game.inputPacketCreator.screenToYaw((-ws.myPlayer.position.x + mousePosition.x) * 100, (-ws.myPlayer.position.y + mousePosition.y) * 100) });
                }
            }
        });
    };
    Object.values(sockets).forEach(ws => {
        if (!ws.isclosed) {
            if (isOnControl) {
                aim ? ws.network.sendPacket(3, { mouseMoved: game.inputPacketCreator.screenToYaw((-ws.myPlayer.position.x + game.ui.playerTick.position.x) * 100, (-ws.myPlayer.position.y + game.ui.playerTick.position.y) * 100) }) : 0;
                !lock ? mousePosition = game.renderer.screenToWorld(game.ui.mousePosition.x, game.ui.mousePosition.y) : 0;
                !aim ? ws.network.sendPacket(3, { mouseMoved: game.inputPacketCreator.screenToYaw((-ws.myPlayer.position.x + mousePosition.x) * 100, (-ws.myPlayer.position.y + mousePosition.y) * 100) }) : 0;
                Object.values(game.world.entities).forEach(e => e.uid == ws.myPlayer.uid ? (e.targetTick.name = ws.cloneId + "") : 0);
                ws.player.style.left = (ws.myPlayer.position.x / 240).toFixed() + "%";
                ws.player.style.top = (ws.myPlayer.position.y / 240).toFixed() + "%";
                if (playerfollower) {
                    (ws.myPlayer.position.x - game.ui.playerTick.position.x) < -1 ? ws.network.sendPacket(3, { right: 1 }) : ws.network.sendPacket(3, { right: 0 });
                    (ws.myPlayer.position.x - game.ui.playerTick.position.x) > 1 ? ws.network.sendPacket(3, { left: 1 }) : ws.network.sendPacket(3, { left: 0 });
                    (ws.myPlayer.position.y - game.ui.playerTick.position.y) < -1 ? ws.network.sendPacket(3, { down: 1 }) : ws.network.sendPacket(3, { down: 0 });
                    (ws.myPlayer.position.y - game.ui.playerTick.position.y) > 1 ? ws.network.sendPacket(3, { up: 1 }) : ws.network.sendPacket(3, { up: 0 });
                }
                if (mousemove) {
                    ws.a77 != null && (ws.a77 = null);
                    ws.a77r != null && (ws.a77r = null);
                    let aimingYaw1 = screenToYaw((-ws.myPlayer.position.x + mousePosition.x) * 100, (-ws.myPlayer.position.y + mousePosition.y) * 100);
                    let yaw = movement_1.aimToYaw(aimingYaw1);
                    if (yaw) {
                        if (!ws.reversedYaw) {
                            ws.a77r != null && (ws.a77r = null);
                            yaw == 90 ? (ws.a77 != 90 ? (ws.a77 = 90, ws.network.sendPacket(3, { right: 1, left: 0, up: 0, down: 0 })) : 0) : 0;
                            yaw == 225 ? (ws.a77 != 225 ? (ws.a77 = 225, ws.network.sendPacket(3, { down: 1, left: 1, up: 0, right: 0 })) : 0) : 0;
                            yaw == 44 ? (ws.a77 != 44 ? (ws.a77 = 44, ws.network.sendPacket(3, { down: 0, left: 0, up: 1, right: 1 })) : 0) : 0;
                            yaw == 314 ? (ws.a77 != 314 ? (ws.a77 = 314, ws.network.sendPacket(3, { down: 0, left: 1, up: 1, right: 0 })) : 0) : 0;
                            yaw == 135 ? (ws.a77 != 135 ? (ws.a77 = 135, ws.network.sendPacket(3, { down: 1, left: 0, up: 0, right: 1 })) : 0) : 0;
                            yaw == 359 ? (ws.a77 != 359 ? (ws.a77 = 359, ws.network.sendPacket(3, { up: 1, down: 0, right: 0, left: 0 })) : 0) : 0;
                            yaw == 180 ? (ws.a77 != 180 ? (ws.a77 = 180, ws.network.sendPacket(3, { down: 1, up: 0, right: 0, left: 0 })) : 0) : 0;
                            yaw == 270 ? (ws.a77 != 270 ? (ws.a77 = 270, ws.network.sendPacket(3, { left: 1, right: 0, up: 0, down: 0 })) : 0) : 0;
                        } else {
                            ws.a77 != null && (ws.a77 = null);
                            yaw == 90 ? (ws.a77r != 90 ? (ws.a77r = 90, ws.network.sendPacket(3, { left: 1, right: 0, up: 0, down: 0 })) : 0) : 0;
                            yaw == 225 ? (ws.a77r != 225 ? (ws.a77r = 225, ws.network.sendPacket(3, { down: 0, left: 0, up: 1, right: 1 })) : 0) : 0;
                            yaw == 44 ? (ws.a77r != 44 ? (ws.a77r = 44, ws.network.sendPacket(3, { down: 1, left: 1, up: 0, right: 0 })) : 0) : 0;
                            yaw == 314 ? (ws.a77r != 314 ? (ws.a77r = 314, ws.network.sendPacket(3, { down: 1, left: 0, up: 0, right: 1 })) : 0) : 0;
                            yaw == 135 ? (ws.a77r != 135 ? (ws.a77r = 135, ws.network.sendPacket(3, { down: 0, left: 1, up: 1, right: 0 })) : 0) : 0;
                            yaw == 359 ? (ws.a77r != 359 ? (ws.a77r = 359, ws.network.sendPacket(3, { up: 0, down: 1, right: 0, left: 0 })) : 0) : 0;
                            yaw == 180 ? (ws.a77r != 180 ? (ws.a77r = 180, ws.network.sendPacket(3, { down: 0, up: 1, right: 0, left: 0 })) : 0) : 0;
                            yaw == 270 ? (ws.a77r != 270 ? (ws.a77r = 270, ws.network.sendPacket(3, { left: 0, right: 1, up: 0, down: 0 })) : 0) : 0;
                        }
                    }
                }
                showresources ? Object.values(game.world.entities).forEach(e => e.uid == ws.myPlayer.uid ? (e.targetTick.name = `${ws.cloneId}\n[${e.targetTick.wood}, ${e.targetTick.stone}, ${e.targetTick.gold}, ${e.targetTick.token}, ${e.targetTick.partyId}]`) : 0) : 0;
                Object.values(game.ui.playerPartyMembers).forEach(e => game.ui.playerPartyLeader && e.uid == ws.myPlayer.uid && e.canSell == 0 ? game.network.sendPacket(9, { name: "SetPartyMemberCanSell", uid: ws.myPlayer.uid, canSell: 1 }) : 0);
                t == 10 ? (game.network.sendRpc({ name: "SetPartyMemberCanSell", uid: ws.myPlayer.uid, canSell: 1 }), ws.network.sendRpc({ name: "SetPartyMemberCanSell", uid: game.world.myUid, canSell: 1 })) : 0;
                ws.network.sendPacket(9, { name: "BuyItem", itemName: "HealthPotion", tier: 1 });
                sl0 ? Object.values(ws.buildings).forEach(e => e.type == "ResourceHarvester" ? ws.network.sendPacket(9, { name: "DeleteBuilding", uid: e.uid }) : 0) : 0;
                sl1 ? Object.values(ws.buildings).forEach(e => e.type == "Wall" ? ws.network.sendPacket(9, { name: "DeleteBuilding", uid: e.uid }) : 0) : 0;
                sl2 ? Object.values(ws.buildings).forEach(e => e.type == "Door" ? ws.network.sendPacket(9, { name: "DeleteBuilding", uid: e.uid }) : 0) : 0;
                sl3 ? Object.values(ws.buildings).forEach(e => e.type == "SlowTrap" ? ws.network.sendPacket(9, { name: "DeleteBuilding", uid: e.uid }) : 0) : 0;
                sl4 ? Object.values(ws.buildings).forEach(e => e.type == "ArrowTower" ? ws.network.sendPacket(9, { name: "DeleteBuilding", uid: e.uid }) : 0) : 0;
                sl5 ? Object.values(ws.buildings).forEach(e => e.type == "CannonTower" ? ws.network.sendPacket(9, { name: "DeleteBuilding", uid: e.uid }) : 0) : 0;
                sl6 ? Object.values(ws.buildings).forEach(e => e.type == "MeleeTower" ? ws.network.sendPacket(9, { name: "DeleteBuilding", uid: e.uid }) : 0) : 0;
                sl7 ? Object.values(ws.buildings).forEach(e => e.type == "BombTower" ? ws.network.sendPacket(9, { name: "DeleteBuilding", uid: e.uid }) : 0) : 0;
                sl8 ? Object.values(ws.buildings).forEach(e => e.type == "MagicTower" ? ws.network.sendPacket(9, { name: "DeleteBuilding", uid: e.uid }) : 0) : 0;
                sl9 ? Object.values(ws.buildings).forEach(e => e.type == "GoldMine" ? ws.network.sendPacket(9, { name: "DeleteBuilding", uid: e.uid }) : 0) : 0;
                slall ? Object.values(ws.buildings).forEach(e => e.type !== "GoldStash" ? ws.network.sendPacket(9, { name: "DeleteBuilding", uid: e.uid }) : 0) : 0;
                spam ? ws.network.sendPacket(9, { name: "SendChatMessage", channel: "Local", message: "﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽" }) : 0;
                if (autospear) {
                    if (autoSpearTier == selectedTier) {
                        ws.myPlayer.gold < requiredGold ? ws.network.sendPacket(9, { name: "JoinPartyByShareKey", partyShareKey: game.ui.playerPartyShareKey }) : ws.network.sendPacket(9, { name: "LeaveParty" });
                    }
                }
                if (xkey) {
                    !ws.inventory.Bomb ? ws.network.sendPacket(9, { name: "BuyItem", itemName: "Bomb", tier: 1 }) : 0;
                    ws.myPlayer.weaponName !== "Bomb" ? ws.network.sendPacket(9, { name: "EquipItem", itemName: "Bomb", tier: ws.inventory.Bomb.tier }) : 0;
                }
                if (autoSpear) {
                    !ws.inventory.Spear ? ws.network.sendPacket(9, { name: "BuyItem", itemName: "Spear", tier: 1 }) : 0;
                    ws.myPlayer.weaponName !== "Spear" ? ws.network.sendPacket(9, { name: "EquipItem", itemName: "Spear", tier: ws.inventory.Spear.tier }) : 0;
                }
                if (autoShield) {
                    !ws.inventory.ZombieShield ? ws.network.sendPacket(9, { name: "BuyItem", itemName: "ZombieShield", tier: 1 }) : 0;
                }
                ws.myPlayer.health < 100 ? ws.network.sendPacket(9, { name: "EquipItem", itemName: "HealthPotion", tier: 1 }) : 0;
                if (playerfinder) {
                    Object.values(ws.data.entities).forEach(e => {
                        !isFound ? (e.uid == game.ui.components.Leaderboard.leaderboardData[document.getElementsByClassName("16i2")[0].value - 1].uid ? (game.ui.components.Chat.onMessageReceived({ displayName: "PlayerFinder", message: `Found #${document.getElementsByClassName("16i2")[0].value} at {x: ${e.position.x}, y: ${e.position.y}}` }), game.ui.components.PopupOverlay.showHint(`Successfully found #${document.getElementsByClassName("16i2")[0].value} at {x: ${e.position.x}, y: ${e.position.y}}`), isFound = true) : 0) : 0;
                        followposition ? goTo(e.position.x, e.position.y) : 0;
                    });
                }
                if (fourplayertrick) {
                    if (!ws.isDay) {
                        m4 = setTimeout(() => {
                            ws.network.sendPacket(9, { name: "LeaveParty" });
                        }, 20000);
                        m5 = setTimeout(() => {
                            ws.network.sendPacket(9, { name: "JoinPartyByShareKey", partyShareKey: game.ui.playerPartyShareKey });
                        }, 115000);
                    }
                } else {
                    clearTimeout(m4);
                    clearTimeout(m5);
                }
            }
        }
    });
});
function sendAlt() {
    let iframe = document.createElement("iframe");
    iframe.src = window.location.origin;
    iframe.style.display = "none";
    iframe.addEventListener("load", () => {
        iframe.contentWindow.game.network.connectionOptions = game.options.servers[document.getElementsByClassName("hud-intro-server")[0].value];
        iframe.contentWindow.game.network.connected = true;
        let ws = new WebSocket(`ws://${game.options.servers[document.getElementsByClassName("hud-intro-server")[0].value].hostname}:8000`);
        ws.binaryType = "arraybuffer";
        ws.onopen = (data) => {
            ws.network = new game.networkType();
            ws.network.sendPacket = (e, t) => {
                ws.send(ws.network.codec.encode(e, t));
            }
            ws.player = {};
            ws.myPlayer = {};
            ws.inventory = {};
            ws.buildings = {};
            ws.reversedYaw = false;
            ws.cloneId = ++altId;
            ws.onRpc = (data) => {
                if (!ws.isclosed) {
                    switch (ws.data.name) {
                        case "Dead":
                            ws.network.sendPacket(3, { respawn: 1 });
                            ws.reversedYaw = true;
                            m6 = setTimeout(() => {
                                ws.reversedYaw = false;
                                clearTimeout(m6);
                            }, 500);
                            break;
                        case "SetItem":
                            ws.inventory[ws.data.response.itemName] = ws.data.response;
                            !ws.inventory[ws.data.response.itemName].stacks ? delete ws.inventory[ws.data.response.itemName] : 0;
                            break;
                        case "PartyShareKey":
                            ws.psk = ws.data.response.partyShareKey;
                            break;
                        case "DayCycle":
                            ws.isDay = ws.data.response.isDay;
                            break;
                        case "LocalBuilding":
                            for (let i in ws.data.response) {
                                ws.buildings[ws.data.response[i].uid] = ws.data.response[i];
                                ws.buildings[ws.data.response[i].uid].dead ? delete ws.buildings[ws.data.response[i].uid] : 0;
                            }
                            break;
                    }
                }
            }
            ws.onmessage = (msg) => {
                if (new Uint8Array(msg.data)[0] == 5) {
                    game.network.codec.decodePreEnterWorldResponse = rsp => {
                        return rsp;
                    };
                    let rsp = game.network.codec.decode(msg.data);
                    let data = iframe.contentWindow.game.network.codec.decodePreEnterWorldResponse(rsp);
                    ws.network.sendPacket(4, { displayName: document.getElementsByClassName("hud-intro-name")[0].value, extra: data.extra });
                    return;
                }
                ws.data = ws.network.codec.decode(msg.data);
                switch (ws.data.opcode) {
                    case 0:
                        if (!ws.isclosed) {
                            for (let uid in ws.data.entities[ws.myPlayer.uid]) {
                                uid !== "uid" ? ws.myPlayer[uid] = ws.data.entities[ws.myPlayer.uid][uid] : 0;
                            }
                        }
                        break;
                    case 4:
                        ws.send(iframe.contentWindow.game.network.codec.encode(6, {}));
                        iframe.remove();
                        ws.myPlayer.uid = ws.data.uid;
                        ws.network.sendPacket(3, { up: 1 });
                        game.world.inWorld ? ws.network.sendPacket(9, { name: "JoinPartyByShareKey", partyShareKey: game.ui.playerPartyShareKey }) : 0;
                        ws.player = document.createElement("div");
                        ws.player.classList.add("hud-map-player");
                        ws.player.style.display = "block";
                        ws.player.dataset.index = "4";
                        document.getElementsByClassName('hud-map')[0].appendChild(ws.player);
                        break;
                    case 9:
                        !ws.isclosed ? ws.onRpc(ws.data) : 0;
                        break;
                }
            };
            ws.onclose = (e) => {
                iframe.remove();
                ws.isclosed = true;
                ws.player.remove();
            }
        };
        sockets.push(ws);
    });
    document.body.append(iframe);
}
function sendAitoAlt() {
    let iframe = document.createElement("iframe");
    iframe.src = window.location.origin;
    iframe.style.display = "none";
    iframe.addEventListener("load", () => {
        iframe.contentWindow.game.network.connectionOptions = game.options.servers[document.getElementsByClassName("hud-intro-server")[0].value];
        iframe.contentWindow.game.network.connected = true;
        let ws = new WebSocket(`ws://${game.options.servers[document.getElementsByClassName("hud-intro-server")[0].value].hostname}:8000`);
        ws.binaryType = "arraybuffer";
        ws.onopen = (data) => {
            ws.network = new game.networkType();
            ws.network.sendPacket = (e, t) => {
                ws.send(ws.network.codec.encode(e, t));
            }
            ws.myPlayer = {};
            ws.onRpc = (data) => {
                if (!ws.isclosed) {
                    switch (ws.data.name) {
                        case "Dead":
                            ws.network.sendPacket(3, { respawn: 1 });
                            break;
                        case "PartyShareKey":
                            ws.psk = ws.data.response.partyShareKey;
                            break;
                    }
                }
            }
            ws.onmessage = (msg) => {
                if (new Uint8Array(msg.data)[0] == 5) {
                    game.network.codec.decodePreEnterWorldResponse = rsp => {
                        return rsp;
                    };
                    let rsp = game.network.codec.decode(msg.data);
                    let data = iframe.contentWindow.game.network.codec.decodePreEnterWorldResponse(rsp);
                    ws.network.sendPacket(4, { displayName: document.getElementsByClassName("hud-intro-name")[0].value, extra: data.extra });
                    return;
                }
                ws.data = ws.network.codec.decode(msg.data);
                switch (ws.data.opcode) {
                    case 0:
                        if (!ws.isclosed) {
                            for (let uid in ws.data.entities[ws.myPlayer.uid]) {
                                uid !== "uid" ? ws.myPlayer[uid] = ws.data.entities[ws.myPlayer.uid][uid] : 0;
                            }
                        }
                        if (ws.myPlayer.gold > 10000) {
                            ws.close();
                            aito ? sendAitoAlt() : 0;
                        }
                        break;
                    case 4:
                        ws.send(iframe.contentWindow.game.network.codec.encode(6, {}));
                        iframe.remove();
                        ws.myPlayer.uid = ws.data.uid;
                        ws.network.sendPacket(3, { up: 1 });
                        game.world.inWorld ? ws.network.sendPacket(9, { name: "JoinPartyByShareKey", partyShareKey: game.ui.playerPartyShareKey }) : 0;
                        break;
                    case 9:
                        !ws.isclosed ? ws.onRpc(ws.data) : 0;
                        break;
                }
            };
            ws.onclose = (e) => {
                iframe.remove();
                ws.isclosed = true;
                ws.player.remove();
            }
        };
        sockets.push(ws);
    });
    document.body.append(iframe);
}
function nearestAlt() {
    let dist = (a, b) => {
        return Math.sqrt(Math.pow((b.y - a.y), 2) + Math.pow((b.x - a.x), 2));
    };
    let mousePosition = game.renderer.screenToWorld(game.ui.mousePosition.x, game.ui.mousePosition.y);
    let players = [];
    for (let e of Object.entries(sockets)) {
        if (e[1].myPlayer.entityClass == "PlayerEntity") {
            players.push(e[1]);
        };
    };
    return players.map(e => {
        return {
            x: e.myPlayer.position.x,
            y: e.myPlayer.position.y,
            uid: e.myPlayer.uid
        };
    }).sort((a, b) => dist(a, mousePosition) - dist(b, mousePosition))[0];
};
function goTo(x, y) {
    (game.ui.playerTick.position.x - x) < -1 ? game.network.sendPacket(3, { right: 1 }) : game.network.sendPacket(3, { right: 0 });
    (game.ui.playerTick.position.x - x) > 1 ? game.network.sendPacket(3, { left: 1 }) : game.network.sendPacket(3, { left: 0 });
    (game.ui.playerTick.position.y - y) < -1 ? game.network.sendPacket(3, { down: 1 }) : game.network.sendPacket(3, { down: 0 });
    (game.ui.playerTick.position.y - y) > 1 ? game.network.sendPacket(3, { up: 1 }) : game.network.sendPacket(3, { up: 0 });
}
game.network.sendRpc2 = game.network.sendRpc;
game.network.sendRpc = (e) => {
    if (e.name == "SendChatMessage") {
        e.message == "!c" ? isOnControl = true : 0;
        e.message == "!u" ? isOnControl = false : 0;
        if (e.message == "!af") {
            sendAlt();
            af = setInterval(() => {
                sendAlt();
            }, 5000);
        }
        e.message == "!!af" ? clearInterval(af) : 0;
        e.message == "!pop" ? game.ui.components.PopupOverlay.showHint(`Players in server: ${pop}/32`) : 0;
        if (e.message == "!sockets") {
            totalSockets = 0;
            Object.values(sockets).forEach(ws => !ws.isclosed ? (totalSockets += 1) : 0);
            game.ui.components.PopupOverlay.showHint(`Sockets in server: ${totalSockets}`);
        }
        e.message.startsWith("!join") ? (e.message.length > 25 ? (game.network.sendPacket(9, { name: "JoinPartyByShareKey", partyShareKey: e.message[6] + e.message[7] + e.message[8] + e.message[9] + e.message[10] + e.message[11] + e.message[12] + e.message[13] + e.message[14] + e.message[15] + e.message[16] + e.message[17] + e.message[18] + e.message[19] + e.message[20] + e.message[21] + e.message[22] + e.message[23] + e.message[24] + e.message[25] + "" })) : 0) : 0;
        Object.values(sockets).forEach(ws => {
            if (!ws.isclosed) {
                if (isOnControl) {
                    e.message == "!s" ? (ws.myPlayer.name ? game.ui.components.Chat.onMessageReceived({ displayName: ws.cloneId, message: `[${ws.myPlayer.wood}, ${ws.myPlayer.stone}, ${ws.myPlayer.gold}, ${ws.myPlayer.token}, ${ws.myPlayer.partyId}]` }) : 0) : 0;
                    e.message == "!l" ? lock = true : 0;
                    e.message == "!!l" ? lock = false : 0;
                    e.message == "!ja" ? (Object.values(ws.buildings).length == 0 ? game.network.sendPacket(9, { name: "JoinPartyByShareKey", partyShareKey: ws.psk }) : 0) : 0;
                    e.message == `!j${ws.cloneId}` ? ws.network.sendPacket(9, { name: "JoinPartyByShareKey", partyShareKey: game.ui.playerPartyShareKey }) : 0;
                    e.message == `!J${ws.cloneId}` ? game.network.sendPacket(9, { name: "JoinPartyByShareKey", partyShareKey: ws.psk }) : 0;
                    e.message == `!L${ws.cloneId}` ? ws.network.sendPacket(9, { name: "LeaveParty" }) : 0;
                    e.message == "!up0" ? Object.values(ws.buildings).forEach(e => e.type == "ResourceHarvester" ? ws.network.sendPacket(9, { name: "UpgradeBuilding", uid: e.uid }) : 0) : 0;
                    e.message == "!up1" ? Object.values(ws.buildings).forEach(e => e.type == "Wall" ? ws.network.sendPacket(9, { name: "UpgradeBuilding", uid: e.uid }) : 0) : 0;
                    e.message == "!up2" ? Object.values(ws.buildings).forEach(e => e.type == "Door" ? ws.network.sendPacket(9, { name: "UpgradeBuilding", uid: e.uid }) : 0) : 0;
                    e.message == "!up3" ? Object.values(ws.buildings).forEach(e => e.type == "SlowTrap" ? ws.network.sendPacket(9, { name: "UpgradeBuilding", uid: e.uid }) : 0) : 0;
                    e.message == "!up4" ? Object.values(ws.buildings).forEach(e => e.type == "ArrowTower" ? ws.network.sendPacket(9, { name: "UpgradeBuilding", uid: e.uid }) : 0) : 0;
                    e.message == "!up5" ? Object.values(ws.buildings).forEach(e => e.type == "CannonTower" ? ws.network.sendPacket(9, { name: "UpgradeBuilding", uid: e.uid }) : 0) : 0;
                    e.message == "!up6" ? Object.values(ws.buildings).forEach(e => e.type == "MeleeTower" ? ws.network.sendPacket(9, { name: "UpgradeBuilding", uid: e.uid }) : 0) : 0;
                    e.message == "!up7" ? Object.values(ws.buildings).forEach(e => e.type == "BombTower" ? ws.network.sendPacket(9, { name: "UpgradeBuilding", uid: e.uid }) : 0) : 0;
                    e.message == "!up8" ? Object.values(ws.buildings).forEach(e => e.type == "MagicTower" ? ws.network.sendPacket(9, { name: "UpgradeBuilding", uid: e.uid }) : 0) : 0;
                    e.message == "!up9" ? Object.values(ws.buildings).forEach(e => e.type == "GoldMine" ? ws.network.sendPacket(9, { name: "UpgradeBuilding", uid: e.uid }) : 0) : 0;
                    e.message == "!upstash" ? Object.values(ws.buildings).forEach(e => e.type == "GoldStash" ? ws.network.sendPacket(9, { name: "UpgradeBuilding", uid: e.uid }) : 0) : 0;
                    e.message == "!upall" ? Object.values(ws.buildings).forEach(e => e.type !== "GoldStash" ? ws.network.sendPacket(9, { name: "UpgradeBuilding", uid: e.uid }) : 0) : 0;
                    e.message == "!sl0" ? sl0 = true : 0;
                    e.message == "!sl1" ? sl1 = true : 0;
                    e.message == "!sl2" ? sl2 = true : 0;
                    e.message == "!sl3" ? sl3 = true : 0;
                    e.message == "!sl4" ? sl4 = true : 0;
                    e.message == "!sl5" ? sl5 = true : 0;
                    e.message == "!sl6" ? sl6 = true : 0;
                    e.message == "!sl7" ? sl7 = true : 0;
                    e.message == "!sl8" ? sl8 = true : 0;
                    e.message == "!sl9" ? sl9 = true : 0;
                    e.message == "!slall" ? slall = true : 0;
                    e.message == "!!sl0" ? sl0 = false : 0;
                    e.message == "!!sl1" ? sl1 = false : 0;
                    e.message == "!!sl2" ? sl2 = false : 0;
                    e.message == "!!sl3" ? sl3 = false : 0;
                    e.message == "!!sl4" ? sl4 = false : 0;
                    e.message == "!!sl5" ? sl5 = false : 0;
                    e.message == "!!sl6" ? sl6 = false : 0;
                    e.message == "!!sl7" ? sl7 = false : 0;
                    e.message == "!!sl8" ? sl8 = false : 0;
                    e.message == "!!sl9" ? sl9 = false : 0;
                    e.message == "!!slall" ? slall = false : 0;
                    e.message == "!spam" ? spam = true : 0;
                    e.message == "!!spam" ? spam = false : 0;
                    e.message == "!!as" ? autospear = false : 0;
                    e.message == "!autobomb" ? xkey = true : 0;
                    e.message == "!!autobomb" ? xkey = false : 0;
                    e.message == "!autospear" ? autoSpear = true : 0;
                    e.message == "!!autospear" ? autoSpear = false : 0;
                    e.message == "!autoshield" ? autoShield = true : 0;
                    e.message == "!!autoshield" ? autoShield = false : 0;
                    if (e.message == ws.cloneId) {
                        ws.network.sendPacket(3, { mouseDown: game.inputPacketCreator.screenToYaw((-ws.myPlayer.position.x + mousePosition.x) * 100, (-ws.myPlayer.position.y + mousePosition.y) * 100) });
                        if (ws.myPlayer.weaponName == "Bow") {
                            bowInt = setInterval(() => {
                                ws.network.sendPacket(3, { space: 1 });
                                ws.network.sendPacket(3, { space: 0 });
                                ws.network.sendPacket(3, { space: 1 });
                            }, 50);
                        }
                        m7 = setTimeout(() => {
                            clearInterval(bowInt);
                            ws.network.sendPacket(3, { mouseUp: 1 });
                            clearTimeout(m7);
                        }, 5e3);
                    }
                    if (e.message == "!as2") {
                        autospear = true;
                        autoSpearTier = 2;
                        selectedTier = 2;
                        requiredGold = 4200;
                    }
                    if (e.message == "!as4") {
                        autospear = true;
                        autoSpearTier = 4;
                        selectedTier = 4;
                        requiredGold = 21000;
                    }
                    if (e.message == "!as5") {
                        autospear = true;
                        autoSpearTier = 5;
                        selectedTier = 5;
                        requiredGold = 43500;
                    }
                    if (e.message == "!as6") {
                        autospear = true;
                        autoSpearTier = 6;
                        selectedTier = 6;
                        requiredGold = 88500;
                    }
                }
            }
        });
        if (e.message.startsWith("!")) {
            return;
        }
    }
    game.network.sendRpc2(e);
}
game.network.addRpcHandler("SetPartyList", e => {
    pop = 0;
    Object.keys(game.ui.parties).forEach(e => (pop = pop + game.ui.parties[e].memberCount));
    game.ui.components.PopupOverlay.showHint(`Players in server: ${pop}/32`);
});
// main 1
document.getElementsByClassName("0i")[0].addEventListener("click", () => {
    game.ui.components.PopupOverlay.showHint("Sell Stash is patched you retard");
});
document.getElementsByClassName("1i")[0].addEventListener("click", () => {
    sellall = !sellall;
    if (sellall) {
        document.getElementsByClassName("1i")[0].innerHTML = "Inactive Sell All!";
        document.getElementsByClassName("1i")[0].className = "btn btn-red 1i";
    } else {
        document.getElementsByClassName("1i")[0].innerHTML = "Active Sell All!";
        document.getElementsByClassName("1i")[0].className = "btn btn-blue 1i";
    }
});
document.getElementsByClassName("2i")[0].addEventListener("click", () => {
    sellwalls = !sellwalls;
    if (sellwalls) {
        document.getElementsByClassName("2i")[0].innerHTML = "Inactive Sell Walls!";
        document.getElementsByClassName("2i")[0].className = "btn btn-red 2i";
    } else {
        document.getElementsByClassName("2i")[0].innerHTML = "Active Sell Walls!";
        document.getElementsByClassName("2i")[0].className = "btn btn-blue 2i";
    }
});
document.getElementsByClassName("3i")[0].addEventListener("click", () => {
    selldoors = !selldoors;
    if (selldoors) {
        document.getElementsByClassName("3i")[0].innerHTML = "Inactive Sell Doors!";
        document.getElementsByClassName("3i")[0].className = "btn btn-red 3i";
    } else {
        document.getElementsByClassName("3i")[0].innerHTML = "Active Sell Doors!";
        document.getElementsByClassName("3i")[0].className = "btn btn-blue 3i";
    }
});
document.getElementsByClassName("4i")[0].addEventListener("click", () => {
    selltraps = !selltraps;
    if (selltraps) {
        document.getElementsByClassName("4i")[0].innerHTML = "Inactive Sell Traps!";
        document.getElementsByClassName("4i")[0].className = "btn btn-red 4i";
    } else {
        document.getElementsByClassName("4i")[0].innerHTML = "Active Sell Traps!";
        document.getElementsByClassName("4i")[0].className = "btn btn-blue 4i";
    }
});
document.getElementsByClassName("5i")[0].addEventListener("click", () => {
    sellarrows = !sellarrows;
    if (sellarrows) {
        document.getElementsByClassName("5i")[0].innerHTML = "Inactive Sell Arrows!";
        document.getElementsByClassName("5i")[0].className = "btn btn-red 5i";
    } else {
        document.getElementsByClassName("5i")[0].innerHTML = "Active Sell Arrows!";
        document.getElementsByClassName("5i")[0].className = "btn btn-blue 5i";
    }
});
document.getElementsByClassName("6i")[0].addEventListener("click", () => {
    sellmages = !sellmages;
    if (sellmages) {
        document.getElementsByClassName("6i")[0].innerHTML = "Inactive Sell Mages!";
        document.getElementsByClassName("6i")[0].className = "btn btn-red 6i";
    } else {
        document.getElementsByClassName("6i")[0].innerHTML = "Active Sell Mages!";
        document.getElementsByClassName("6i")[0].className = "btn btn-blue 6i";
    }
});
document.getElementsByClassName("7i")[0].addEventListener("click", () => {
    Object.values(game.world.entities).forEach(e => e.partyId == game.ui.playerPartyId ? game.network.sendPacket(9, { name: "DeleteBuilding", uid: e.petUid }) : 0);
});
document.getElementsByClassName("8i")[0].addEventListener("click", () => {
    upgradeall = !upgradeall;
    if (upgradeall) {
        document.getElementsByClassName("8i")[0].innerHTML = "Inactive Upgrade All!";
        document.getElementsByClassName("8i")[0].className = "btn btn-red 8i";
    } else {
        document.getElementsByClassName("8i")[0].innerHTML = "Active Upgrade All!";
        document.getElementsByClassName("8i")[0].className = "btn btn-blue 8i";
    }
});
document.getElementsByClassName("9i")[0].addEventListener("click", () => {
    ahrc = !ahrc;
    if (ahrc) {
        document.getElementsByClassName("9i")[0].innerHTML = "Inactive AHRC!";
        document.getElementsByClassName("9i")[0].className = "btn btn-red 9i";
    } else {
        document.getElementsByClassName("9i")[0].innerHTML = "Active AHRC!";
        document.getElementsByClassName("9i")[0].className = "btn btn-blue 9i";
    }
});
document.getElementsByClassName("10i")[0].addEventListener("click", () => {
    autobow = !autobow;
    if (autobow) {
        document.getElementsByClassName("10i")[0].innerHTML = "Disable Autobow";
        document.getElementsByClassName("10i")[0].className = "btn btn-red 10i";
    } else {
        document.getElementsByClassName("10i")[0].innerHTML = "Enable Autobow";
        document.getElementsByClassName("10i")[0].className = "btn btn-blue 10i";
    }
});
document.getElementsByClassName("13i")[0].addEventListener("click", () => {
    autoaccepter = !autoaccepter;
    if (autoaccepter) {
        document.getElementsByClassName("13i")[0].innerHTML = "Disable Auto Accepter";
        document.getElementsByClassName("13i")[0].className = "btn btn-red 13i";
    } else {
        document.getElementsByClassName("13i")[0].innerHTML = "Enable Auto Accepter";
        document.getElementsByClassName("13i")[0].className = "btn btn-blue 13i";
    }
});
document.getElementsByClassName("14i")[0].addEventListener("click", () => {
    autokicker = !autokicker;
    if (autokicker) {
        document.getElementsByClassName("14i")[0].innerHTML = "Disable Auto Kicker";
        document.getElementsByClassName("14i")[0].className = "btn btn-red 14i";
    } else {
        document.getElementsByClassName("14i")[0].innerHTML = "Enable Auto Kicker";
        document.getElementsByClassName("14i")[0].className = "btn btn-blue 14i";
    }
});
// main 2
document.getElementsByClassName("0i5")[0].addEventListener("click", () => {
    game.ui.playerPartyMembers.length > 1 ? game.network.sendPacket(9, { name: "SetPartyMemberCanSell", uid: game.ui.playerPartyMembers[1].playerUid }) : 0;
    let m1 = setTimeout(() => {
        game.ui.playerPartyMembers.length > 2 ? game.network.sendPacket(9, { name: "SetPartyMemberCanSell", uid: game.ui.playerPartyMembers[2].playerUid }) : 0;
        clearTimeout(m1);
    }, 175);
    let m2 = setTimeout(() => {
        game.ui.playerPartyMembers.length > 3 ? game.network.sendPacket(9, { name: "SetPartyMemberCanSell", uid: game.ui.playerPartyMembers[3].playerUid }) : 0;
        clearTimeout(m2);
    }, 350);
});
document.getElementsByClassName("1i5")[0].addEventListener("click", () => {
    autokicker = true;
    let m3 = setTimeout(() => {
        autokicker = false;
        clearTimeout(m3);
    }, 5250);
});
document.getElementsByClassName("3i5")[0].addEventListener("click", () => {
    autohi = !autohi;
    if (autohi) {
        document.getElementsByClassName("3i5")[0].innerHTML = "Disable hi Script!";
        document.getElementsByClassName("3i5")[0].className = "btn btn-red 3i5";
    } else {
        document.getElementsByClassName("3i5")[0].innerHTML = "Enable hi Script!";
        document.getElementsByClassName("3i5")[0].className = "btn btn-blue 3i5";
    }
});
document.getElementsByClassName("5i5")[0].addEventListener("click", () => {
    sendinfo = !sendinfo;
    if (sendinfo) {
        document.getElementsByClassName("5i5")[0].innerHTML = "Disable Send Info!";
        document.getElementsByClassName("5i5")[0].className = "btn btn-red 5i5";
    } else {
        document.getElementsByClassName("5i5")[0].innerHTML = "Enable Send Info!";
        document.getElementsByClassName("5i5")[0].className = "btn btn-blue 5i5";
    }
});
document.getElementsByClassName("6i5")[0].addEventListener("click", () => {
    speedrun = !speedrun;
    if (speedrun) {
        document.getElementsByClassName("6i5")[0].innerHTML = "Disable Speed Run";
        document.getElementsByClassName("6i5")[0].className = "btn btn-red 6i5";
    } else {
        document.getElementsByClassName("6i5")[0].innerHTML = "Enable Speed Run";
        document.getElementsByClassName("6i5")[0].className = "btn btn-blue 6i5";
    }
});
document.getElementsByClassName("8i5")[0].addEventListener("click", () => {
    autohealandpetheal = !autohealandpetheal;
    if (!autohealandpetheal) {
        document.getElementsByClassName("8i5")[0].innerHTML = "Auto heal and Pet Heal";
        document.getElementsByClassName("8i5")[0].className = "btn btn-blue 8i5";
    } else {
        document.getElementsByClassName("8i5")[0].innerHTML = "!(Auto heal and Pet Heal)";
        document.getElementsByClassName("8i5")[0].className = "btn btn-red 8i5";
    }
});
document.getElementsByClassName("9i5")[0].addEventListener("click", () => {
    reviveandevolvepets = !reviveandevolvepets;
    if (!reviveandevolvepets) {
        document.getElementsByClassName("9i5")[0].innerHTML = "Revive and Evolve Pets";
        document.getElementsByClassName("9i5")[0].className = "btn btn-blue 9i5";
    } else {
        document.getElementsByClassName("9i5")[0].innerHTML = "!(Revive and Evolve Pets)";
        document.getElementsByClassName("9i5")[0].className = "btn btn-red 9i5";
    }
});
document.getElementsByClassName("10i5")[0].addEventListener("click", () => {
    clearmessages = !clearmessages;
    if (clearmessages) {
        document.getElementsByClassName("10i5")[0].innerHTML = "!(Clear Messages!)";
        document.getElementsByClassName("10i5")[0].className = "btn btn-red 10i5";
    } else {
        document.getElementsByClassName("10i5")[0].innerHTML = "Clear Messages!";
        document.getElementsByClassName("10i5")[0].className = "btn btn-blue 10i5";
    }
});
document.getElementsByClassName("13i5")[0].addEventListener("click", () => {
    playerkicker = !playerkicker;
    if (playerkicker) {
        document.getElementsByClassName("13i5")[0].innerHTML = "!(Active Player Kicker)";
        document.getElementsByClassName("13i5")[0].className = "btn btn-red 13i5";
    } else {
        document.getElementsByClassName("13i5")[0].innerHTML = "Active Player Kicker";
        document.getElementsByClassName("13i5")[0].className = "btn btn-blue 13i5";
    }
});
// base saver
document.getElementsByClassName("0i3")[0].addEventListener("click", () => {
    game.ui.getComponent("PopupOverlay").showConfirmation("Are you sure you want to record base? If you recorded it twice, the first recorded base will be deleted.", 1e4, () => {
        s = { x: 0, y: 0 };
        p = { x: 0, y: 0 };
        dataCodes = '';
        isPushed = false;
        localStorage.p = '';
        arb = [];
        Object.values(game.ui.buildings).forEach(e => {
            e.type == "GoldStash" ? (s.x = e.x, s.y = e.y) : arb.push(e);
            e.type == "GoldStash" && !isPushed ? (p.x = e.x, p.y = e.y, isPushed = true, localStorage.p = JSON.stringify(p)) : 0;
        });
        localStorage.arb = JSON.stringify(arb);
        arb = JSON.parse(localStorage.arb);
        Object.values(arb).forEach(e => dataCodes += `game.network.sendPacket(9, {name: "MakeBuilding", type: "${e.type}", x: s.x + (${e.x} - p.x), y: s.y + (${e.y} - p.y), yaw: 0});`);
        Object.values(game.ui.buildings).length == 0 ? game.ui.components.PopupOverlay.showHint("No gold stash found! Try again.") : game.ui.components.PopupOverlay.showHint("Successfully recorded base!");
    });
});
document.getElementsByClassName("1i3")[0].addEventListener("click", () => {
    s = { x: 0, y: 0 };
    p = JSON.parse(localStorage.p);
    dataCodes = '';
    Object.values(game.ui.buildings).forEach(e => e.type == "GoldStash" ? (s.x = e.x, s.y = e.y) : 0);
    arb = JSON.parse(localStorage.arb);
    Object.values(arb).forEach(e => dataCodes += `game.network.sendPacket(9, {name: "MakeBuilding", type: "${e.type}", x: s.x + (${e.x} - p.x), y: s.y + (${e.y} - p.y), yaw: 0});`);
    game.ui.buildings.length !== arb.length ? eval(dataCodes) : 0;
});
document.getElementsByClassName("2i3")[0].addEventListener("click", () => {
    game.ui.getComponent("PopupOverlay").showConfirmation("Are you sure you want to delete this recorded base?", 1e4, () => {
        arb = [];
        localStorage.arb = '';
        game.ui.components.PopupOverlay.showHint("Successfully deleted recorded base!");
    });
});
document.getElementsByClassName("5i3")[0].addEventListener("click", () => {
    game.ui.getComponent("PopupOverlay").showConfirmation("Are you sure you want to record base? If you recorded it twice, the first recorded base will be deleted.", 1e4, () => {
        s2 = { x: 0, y: 0 };
        p2 = { x: 0, y: 0 };
        dataCodes2 = '';
        isPushed2 = false;
        localStorage.p2 = '';
        arb2 = [];
        Object.values(game.ui.buildings).forEach(e => {
            e.type == "GoldStash" ? (s2.x = e.x, s2.y = e.y) : arb2.push(e);
            e.type == "GoldStash" && !isPushed2 ? (p2.x = e.x, p2.y = e.y, isPushed2 = true, localStorage.p2 = JSON.stringify(p2)) : 0;
        });
        localStorage.arb2 = JSON.stringify(arb2);
        arb2 = JSON.parse(localStorage.arb2);
        Object.values(arb2).forEach(e => dataCodes2 += `game.network.sendPacket(9, {name: "MakeBuilding", type: "${e.type}", x: s2.x + (${e.x} - p2.x), y: s2.y + (${e.y} - p2.y), yaw: 0});`);
        Object.values(game.ui.buildings).length == 0 ? game.ui.components.PopupOverlay.showHint("No gold stash found! Try again.") : game.ui.components.PopupOverlay.showHint("Successfully recorded base!");
    });
});
document.getElementsByClassName("6i3")[0].addEventListener("click", () => {
    s2 = { x: 0, y: 0 };
    p2 = JSON.parse(localStorage.p2);
    dataCodes2 = '';
    Object.values(game.ui.buildings).forEach(e => e.type == "GoldStash" ? (s2.x = e.x, s2.y = e.y) : 0);
    arb2 = JSON.parse(localStorage.arb2);
    Object.values(arb2).forEach(e => dataCodes2 += `game.network.sendPacket(9, {name: "MakeBuilding", type: "${e.type}", x: s2.x + (${e.x} - p2.x), y: s2.y + (${e.y} - p2.y), yaw: 0});`);
    game.ui.buildings.length !== arb2.length ? eval(dataCodes2) : 0;
});
document.getElementsByClassName("7i3")[0].addEventListener("click", () => {
    game.ui.getComponent("PopupOverlay").showConfirmation("Are you sure you want to delete this recorded base?", 1e4, () => {
        arb2 = [];
        localStorage.arb2 = '';
        game.ui.components.PopupOverlay.showHint("Successfully deleted recorded base!");
    });
});
document.getElementsByClassName("10i3")[0].addEventListener("click", () => {
    game.ui.getComponent("PopupOverlay").showConfirmation("Are you sure you want to record base? If you recorded it twice, the first recorded base will be deleted.", 1e4, () => {
        s3 = { x: 0, y: 0 };
        p3 = { x: 0, y: 0 };
        dataCodes3 = '';
        localStorage.p3 = '';
        isPushed3 = false;
        arb3 = [];
        Object.values(game.ui.buildings).forEach(e => {
            e.type == "GoldStash" ? (s3.x = e.x, s3.y = e.y) : arb3.push(e);
            e.type == "GoldStash" && !isPushed3 ? (p3.x = e.x, p3.y = e.y, isPushed3 = true, localStorage.p3 = JSON.stringify(p3)) : 0;
        });
        localStorage.arb3 = JSON.stringify(arb3);
        arb3 = JSON.parse(localStorage.arb3);
        Object.values(arb3).forEach(e => dataCodes3 += `game.network.sendPacket(9, {name: "MakeBuilding", type: "${e.type}", x: s3.x + (${e.x} - p3.x), y: s3.y + (${e.y} - p3.y), yaw: 0});`);
        Object.values(game.ui.buildings).length == 0 ? game.ui.components.PopupOverlay.showHint("No gold stash found! Try again.") : game.ui.components.PopupOverlay.showHint("Successfully recorded base!");
    });
});
document.getElementsByClassName("11i3")[0].addEventListener("click", () => {
    s3 = { x: 0, y: 0 };
    p3 = JSON.parse(localStorage.p3);
    dataCodes3 = '';
    Object.values(game.ui.buildings).forEach(e => e.type == "GoldStash" ? (s3.x = e.x, s3.y = e.y) : 0);
    arb3 = JSON.parse(localStorage.arb3);
    Object.values(arb3).forEach(e => dataCodes3 += `game.network.sendPacket(9, {name: "MakeBuilding", type: "${e.type}", x: s3.x + (${e.x} - p3.x), y: s3.y + (${e.y} - p3.y), yaw: 0});`);
    game.ui.buildings.length !== arb3.length ? eval(dataCodes3) : 0;
});
document.getElementsByClassName("12i3")[0].addEventListener("click", () => {
    game.ui.getComponent("PopupOverlay").showConfirmation("Are you sure you want to delete this recorded base?", 1e4, () => {
        arb3 = [];
        localStorage.arb3 = '';
        game.ui.components.PopupOverlay.showHint("Successfully deleted recorded base!");
    });
});
document.getElementsByClassName("15i3")[0].addEventListener("click", () => {
    s4 = { x: 0, y: 0 };
    p4 = { x: 0, y: 0 };
    dataCodes4 = '';
    isPushed4 = false;
    arb4 = [];
    Object.values(game.ui.buildings).forEach(e => {
        e.type == "GoldStash" ? (s4.x = e.x, s4.y = e.y) : arb4.push(e);
        e.type == "GoldStash" && !isPushed4 ? (p4.x = e.x, p4.y = e.y, isPushed4 = true) : 0;
    });
    Object.values(arb4).forEach(e => dataCodes4 += `game.network.sendPacket(9, {name: "MakeBuilding", type: "${e.type}", x: s4.x + (${e.x} - p4.x), y: s4.y + (${e.y} - p4.y), yaw: 0});`);
    Object.values(game.ui.buildings).length == 0 ? game.ui.components.PopupOverlay.showHint("No gold stash found! Try again.") : (game.ui.components.PopupOverlay.showHint("Successfully saved base!"), document.getElementsByClassName("30i3")[0].value = JSON.stringify(arb4));
});
document.getElementsByClassName("16i3")[0].addEventListener("click", () => {
    s4 = { x: 0, y: 0 };
    dataCodes4 = '';
    Object.values(game.ui.buildings).forEach(e => e.type == "GoldStash" ? (s4.x = e.x, s4.y = e.y) : 0);
    Object.values(arb4).forEach(e => dataCodes4 += `game.network.sendPacket(9, {name: "MakeBuilding", type: "${e.type}", x: s4.x + (${e.x} - p4.x), y: s4.y + (${e.y} - p4.y), yaw: 0});`);
    game.ui.buildings.length !== arb4.length ? eval(dataCodes4) : 0;
});
document.getElementsByClassName("21i3")[0].addEventListener("click", () => {
    autobuildsavedtowers = !autobuildsavedtowers;
    autobuildsavedtowers ? document.getElementsByClassName("21i3")[0].innerHTML = "Disable Auto Build Saved Towers!" : document.getElementsByClassName("21i3")[0].innerHTML = "Enable Auto Build Saved Towers!";
});
document.getElementsByClassName("26i3")[0].addEventListener("click", () => {
    upgradeall2 = !upgradeall2;
    upgradeall2 ? document.getElementsByClassName("26i3")[0].innerHTML = "Disable Upgrade All!" : document.getElementsByClassName("26i3")[0].innerHTML = "Enable Upgrade All!";
});
// main 3
document.getElementsByClassName("0i2")[0].addEventListener("click", () => {
    sendAlt();
});
document.getElementsByClassName("1i2")[0].addEventListener("click", () => {
    aim = !aim;
    aim ? document.getElementsByClassName("1i2")[0].innerHTML = "Disable Aim!" : document.getElementsByClassName("1i2")[0].innerHTML = "Enable Aim!";
});
document.getElementsByClassName("2i2")[0].addEventListener("click", () => {
    playerfollower = !playerfollower;
    playerfollower ? document.getElementsByClassName("2i2")[0].innerHTML = "Disable Player Follower!" : document.getElementsByClassName("2i2")[0].innerHTML = "Enable Player Follower!";
});
document.getElementsByClassName("3i2")[0].addEventListener("click", () => {
    Object.values(sockets).forEach(ws => document.getElementsByClassName("4i2")[0].value == ws.cloneId ? ws.close() : 0);
});
document.getElementsByClassName("7i2")[0].addEventListener("click", () => {
    Object.values(sockets).forEach(ws => ws.close());
});
document.getElementsByClassName("8i2")[0].addEventListener("click", () => {
    showresources = !showresources;
    showresources ? document.getElementsByClassName("8i2")[0].innerHTML = "Hide Resources!" : document.getElementsByClassName("8i2")[0].innerHTML = "Show Resources!";
});
document.getElementsByClassName("10i2 emm")[0].addEventListener("click", () => {
    mousemove = !mousemove;
    mousemove ? document.getElementsByClassName("10i2 emm")[0].innerHTML = "Disable MouseMove!" : document.getElementsByClassName("10i2 emm")[0].innerHTML = "Enable MouseMove!";
});
document.getElementsByClassName("11i2")[0].addEventListener("click", () => {
    aito = !aito;
    aito ? document.getElementsByClassName("11i2")[0].innerHTML = "Stop Aito!" : document.getElementsByClassName("11i2")[0].innerHTML = "Start Aito!";
});
document.getElementsByClassName("12i2")[0].addEventListener("click", () => {
    fourplayertrick = !fourplayertrick;
    fourplayertrick ? document.getElementsByClassName("12i2")[0].innerHTML = "!(Active 4 Player Trick)" : document.getElementsByClassName("12i2")[0].innerHTML = "Active 4 Player Trick";
});
document.getElementsByClassName("13i2")[0].addEventListener("click", () => {
    game.ui.components.PopupOverlay.showHint("L Key is patched you retard");
});
document.getElementsByClassName("18i2")[0].addEventListener("click", () => {
    playerfinder = !playerfinder;
    playerfinder ? (isFound = false, document.getElementsByClassName("18i2")[0].innerHTML = "!(Active Player Finder)") : document.getElementsByClassName("18i2")[0].innerHTML = "Active Player Finder";
});
document.getElementsByClassName("21i2")[0].addEventListener("click", () => {
    isOnControl = !isOnControl;
    !isOnControl ? document.getElementsByClassName("21i2")[0].innerHTML = "Control Alts!" : document.getElementsByClassName("21i2")[0].innerHTML = "Uncontrol Alts!";
});
document.getElementsByClassName("22i2")[0].addEventListener("click", () => {
    lock = !lock;
    lock ? document.getElementsByClassName("22i2")[0].innerHTML = "Unlock Alts!" : document.getElementsByClassName("22i2")[0].innerHTML = "Lock Alts!";
});
document.getElementsByClassName("25i2")[0].addEventListener("click", () => {
    followposition = !followposition;
    followposition ? document.getElementsByClassName("25i2")[0].innerHTML = "Unfollow Position" : document.getElementsByClassName("25i2")[0].innerHTML = "Follow Position";
});
document.addEventListener('keyup', function (e) {
    if (e.key == "Enter" && game.ui.playerTick.dead == 1) {
        game.ui.components.Chat.startTyping();
    };
});
document.getElementsByClassName("hud-shop-item")[0].addEventListener("click", () => {
    Object.values(sockets).forEach(ws => {
        if (!ws.isclosed) {
            if (isOnControl) {
                ws.inventory ? ws.network.sendPacket(9, { name: "BuyItem", itemName: "Pickaxe", tier: ws.inventory.Pickaxe.tier + 1 }) : 0;
            }
        }
    });
});
document.getElementsByClassName("hud-shop-item")[1].addEventListener("click", () => {
    Object.values(sockets).forEach(ws => {
        if (!ws.isclosed) {
            if (isOnControl) {
                if (ws.inventory) {
                    !ws.inventory.Spear ? ws.network.sendPacket(9, { name: "BuyItem", itemName: "Spear", tier: 1 }) : ws.network.sendPacket(9, { name: "BuyItem", itemName: "Spear", tier: ws.inventory.Spear.tier + 1 });
                }
            }
        }
    });
});
document.getElementsByClassName("hud-shop-item")[2].addEventListener("click", () => {
    Object.values(sockets).forEach(ws => {
        if (!ws.isclosed) {
            if (isOnControl) {
                if (ws.inventory) {
                    !ws.inventory.Bow ? ws.network.sendPacket(9, { name: "BuyItem", itemName: "Bow", tier: 1 }) : ws.network.sendPacket(9, { name: "BuyItem", itemName: "Bow", tier: ws.inventory.Bow.tier + 1 });
                }
            }
        }
    });
});
document.getElementsByClassName("hud-shop-item")[3].addEventListener("click", () => {
    Object.values(sockets).forEach(ws => {
        if (!ws.isclosed) {
            if (isOnControl) {
                if (ws.inventory) {
                    !ws.inventory.Bomb ? ws.network.sendPacket(9, { name: "BuyItem", itemName: "Bomb", tier: 1 }) : ws.network.sendPacket(9, { name: "BuyItem", itemName: "Bomb", tier: ws.inventory.Bomb.tier + 1 });
                }
            }
        }
    });
});
document.getElementsByClassName("hud-shop-item")[4].addEventListener("click", () => {
    Object.values(sockets).forEach(ws => {
        if (!ws.isclosed) {
            if (isOnControl) {
                if (ws.inventory) {
                    !ws.inventory.ZombieShield ? ws.network.sendPacket(9, { name: "BuyItem", itemName: "ZombieShield", tier: 1 }) : ws.network.sendPacket(9, { name: "BuyItem", itemName: "ZombieShield", tier: ws.inventory.ZombieShield.tier + 1 });
                }
            }
        }
    });
});
document.getElementsByClassName("hud-shop-item")[10].addEventListener("click", () => {
    Object.values(sockets).forEach(ws => {
        if (!ws.isclosed) {
            if (isOnControl) {
                if (ws.inventory) {
                    !ws.inventory.HealthPotion ? ws.network.sendPacket(9, { name: "BuyItem", itemName: "HealthPotion", tier: 1 }) : 0;
                }
            }
        }
    });
});
document.getElementsByClassName("hud-shop-item")[11].addEventListener("click", () => {
    Object.values(sockets).forEach(ws => {
        if (!ws.isclosed) {
            if (isOnControl) {
                if (ws.inventory) {
                    !ws.inventory.PetHealthPotion ? ws.network.sendPacket(9, { name: "BuyItem", itemName: "PetHealthPotion", tier: 1 }) : 0;
                }
            }
        }
    });
});
document.getElementsByClassName("hud-toolbar-item")[0].addEventListener("click", () => {
    Object.values(sockets).forEach(ws => {
        if (!ws.isclosed) {
            if (isOnControl) {
                if (ws.inventory) {
                    ws.inventory.Pickaxe ? ws.network.sendPacket(9, { name: "EquipItem", itemName: "Pickaxe", tier: ws.inventory.Pickaxe.tier }) : 0;
                }
            }
        }
    });
});
document.getElementsByClassName("hud-toolbar-item")[1].addEventListener("click", () => {
    Object.values(sockets).forEach(ws => {
        if (!ws.isclosed) {
            if (isOnControl) {
                if (ws.inventory) {
                    ws.inventory.Spear ? ws.network.sendPacket(9, { name: "EquipItem", itemName: "Spear", tier: ws.inventory.Spear.tier }) : 0;
                }
            }
        }
    });
});
document.getElementsByClassName("hud-toolbar-item")[2].addEventListener("click", () => {
    Object.values(sockets).forEach(ws => {
        if (!ws.isclosed) {
            if (isOnControl) {
                if (ws.inventory) {
                    ws.inventory.Bow ? ws.network.sendPacket(9, { name: "EquipItem", itemName: "Bow", tier: ws.inventory.Bow.tier }) : 0;
                }
            }
        }
    });
});
document.getElementsByClassName("hud-toolbar-item")[3].addEventListener("click", () => {
    Object.values(sockets).forEach(ws => {
        if (!ws.isclosed) {
            if (isOnControl) {
                if (ws.inventory) {
                    ws.inventory.Bomb ? ws.network.sendPacket(9, { name: "EquipItem", itemName: "Bomb", tier: ws.inventory.Bomb.tier }) : 0;
                }
            }
        }
    });
});
document.getElementsByClassName("hud-toolbar-item")[4].addEventListener("click", () => {
    Object.values(sockets).forEach(ws => {
        if (!ws.isclosed) {
            if (isOnControl) {
                if (ws.inventory) {
                    ws.inventory.HealthPotion ? ws.network.sendPacket(9, { name: "EquipItem", itemName: "HealthPotion", tier: 1 }) : 0;
                }
            }
        }
    });
});
document.getElementsByClassName("hud-toolbar-item")[5].addEventListener("click", () => {
    Object.values(sockets).forEach(ws => {
        if (!ws.isclosed) {
            if (isOnControl) {
                if (ws.inventory) {
                    ws.inventory.PetHealthPotion ? ws.network.sendPacket(9, { name: "EquipItem", itemName: "PetHealthPotion", tier: 1 }) : 0;
                }
            }
        }
    });
});
document.getElementsByClassName("hud-toolbar-item")[6].addEventListener("click", () => {
    Object.values(sockets).forEach(ws => {
        if (!ws.isclosed) {
            if (isOnControl) {
                if (ws.inventory) {
                    ws.inventory.PetWhistle ? ws.network.sendPacket(9, { name: "EquipItem", itemName: "PetWhistle", tier: 1 }) : 0;
                }
            }
        }
    });
});
document.getElementsByClassName("hud")[0].addEventListener("mousedown", (e) => {
    if (e.button == 0) {
        Object.values(sockets).forEach(ws => {
            if (!ws.isclosed) {
                if (isOnControl) {
                    ws.myPlayer.name ? ws.network.sendPacket(3, { mouseDown: game.inputPacketCreator.screenToYaw((-ws.myPlayer.position.x + mousePosition.x) * 100, (-ws.myPlayer.position.y + mousePosition.y) * 100) }) : 0;
                }
            }
        });
    }
    if (e.button == 2) {
        Object.values(sockets).forEach(ws => {
            if (!ws.isclosed) {
                isOnControl ? ws.reversedYaw = true : 0;
            }
        });
    }
});
document.getElementsByClassName("hud")[0].addEventListener("mouseup", (e) => {
    if (e.button == 0) {
        isOnControl ? space = false : 0;
        Object.values(sockets).forEach(ws => {
            if (!ws.isclosed) {
                if (isOnControl) {
                    !space ? ws.network.sendPacket(3, { mouseUp: 1 }) : 0;
                }
            }
        });
    }
    if (e.button == 2) {
        Object.values(sockets).forEach(ws => {
            if (!ws.isclosed) {
                isOnControl ? ws.reversedYaw = false : 0;
            }
        });
    }
});
document.addEventListener("keydown", e => {
    if (document.activeElement.tagName.toLowerCase() !== "input" && document.activeElement.tagName.toLowerCase() !== "textarea") {
        switch (e.code) {
            case "KeyJ":
                Object.values(sockets).forEach(ws => {
                    if (!ws.isclosed) {
                        if (isOnControl) {
                            ws.network.sendPacket(9, { name: "JoinPartyByShareKey", partyShareKey: game.ui.playerPartyShareKey });
                        }
                    }
                });
                break;
            case "KeyH":
                Object.values(sockets).forEach(ws => {
                    if (!ws.isclosed) {
                        if (isOnControl) {
                            ws.network.sendPacket(9, { name: "LeaveParty" });
                        }
                    }
                });
                break;
            case "KeyI":
                game.network.sendPacket(9, { name: "LeaveParty" });
                break;
            case "KeyL":
                sendAlt();
                break;
            case "KeyZ":
                document.getElementsByClassName("10i")[0].click();
                break;
            case "Space":
                space = !space;
                Object.values(sockets).forEach(ws => {
                    if (!ws.isclosed) {
                        if (isOnControl) {
                            !space ? ws.network.sendPacket(3, { mouseUp: 1 }) : 0;
                        }
                    }
                });
                break;
            case "KeyV":
                document.getElementsByClassName("10i2 emm")[0].click();
                Object.values(sockets).forEach(ws => {
                    if (!ws.isclosed) {
                        if (isOnControl) {
                            if (!mousemove) {
                                ws.network.sendPacket(3, { up: 0 });
                                ws.network.sendPacket(3, { left: 0 });
                                ws.network.sendPacket(3, { down: 0 });
                                ws.network.sendPacket(3, { right: 0 });
                            }
                        }
                    }
                });
                break;
            case "KeyN":
                game.ui.inventory.PetCARL ? (game.network.sendPacket(9, { name: "BuyItem", itemName: "PetCARL", tier: 1 }), game.network.sendPacket(9, { name: "EquipItem", itemName: "PetCARL", tier: 1 })) : game.network.sendPacket(9, { name: "EquipItem", itemName: "PetCARL", tier: game.ui.inventory.PetCARL.tier });
                Object.values(sockets).forEach(ws => {
                    if (!ws.isclosed) {
                        if (isOnControl) {
                            if (ws.inventory) {
                                ws.network.sendPacket(9, { name: "BuyItem", itemName: "PetCARL", tier: 1 });
                                ws.network.sendPacket(9, { name: "EquipItem", itemName: "PetCARL", tier: 1 });
                            }
                        }
                    }
                });
                break;
            case "KeyM":
                Object.values(sockets).forEach(ws => {
                    if (!ws.isclosed) {
                        if (isOnControl) {
                            if (ws.inventory) {
                                ws.network.sendPacket(9, { name: "BuyItem", itemName: "PetRevive", tier: 1 });
                                ws.network.sendPacket(9, { name: "EquipItem", itemName: "PetRevive", tier: 1 });
                            }
                        }
                    }
                });
                break;
            case "KeyX":
                document.getElementsByClassName("8i")[0].click();
                break;
            case "KeyY":
                document.getElementsByClassName("21i2")[0].click();
                break;
            case "KeyC":
                document.getElementsByClassName("22i2")[0].click();
                break;
            case "Key/":
                document.getElementsByClassName("6i5")[0].click();
                break;
            case "KeyK":
                document.getElementsByClassName("10i5")[0].click();
                break;
            case "KeyR":
                game.network.sendPacket(9, { name: "BuyItem", itemName: "HealthPotion", tier: 1 });
                game.network.sendPacket(9, { name: "EquipItem", itemName: "HealthPotion", tier: 1 });
                break;
            case "KeyG":
                Object.values(sockets).forEach(ws => {
                    if (!ws.isclosed) {
                        if (isOnControl) {
                            if (ws.inventory) {
                                ws.inventory.PetCARL ? ws.network.sendPacket(9, { name: "DeleteBuilding", uid: ws.myPlayer.petUid }) : 0;
                            }
                        }
                    }
                });
                break;
            case "Period":
                Object.values(sockets).forEach(ws => {
                    if (!ws.isclosed) {
                        if (isOnControl) {
                            if (ws.myPlayer.uid == nearestAlt().uid) {
                                ws.network.sendPacket(3, { mouseDown: game.inputPacketCreator.screenToYaw((-ws.myPlayer.position.x + mousePosition.x) * 100, (-ws.myPlayer.position.y + mousePosition.y) * 100) });
                                if (ws.myPlayer.weaponName == "Bow") {
                                    bowInt2 = setInterval(() => {
                                        ws.network.sendPacket(3, { space: 1 });
                                        ws.network.sendPacket(3, { space: 0 });
                                        ws.network.sendPacket(3, { space: 1 });
                                    }, 50);
                                }
                                m8 = setTimeout(() => {
                                    clearInterval(bowInt2);
                                    ws.network.sendPacket(3, { mouseUp: 1 });
                                    clearTimeout(m8);
                                }, 5e3);
                            };
                        }
                    }
                });
                break;
            case "KeyW":
                Object.values(sockets).forEach(ws => {
                    if (!ws.isclosed) {
                        if (isOnControl) {
                            !mousemove ? ws.network.sendPacket(3, { up: 1 }) : 0;
                        }
                    }
                });
                break;
            case "KeyA":
                Object.values(sockets).forEach(ws => {
                    if (!ws.isclosed) {
                        if (isOnControl) {
                            !mousemove ? ws.network.sendPacket(3, { left: 1 }) : 0;
                        }
                    }
                });
                break;
            case "KeyS":
                Object.values(sockets).forEach(ws => {
                    if (!ws.isclosed) {
                        if (isOnControl) {
                            !mousemove ? ws.network.sendPacket(3, { down: 1 }) : 0;
                        }
                    }
                });
                break;
            case "KeyD":
                Object.values(sockets).forEach(ws => {
                    if (!ws.isclosed) {
                        if (isOnControl) {
                            !mousemove ? ws.network.sendPacket(3, { right: 1 }) : 0;
                        }
                    }
                });
                break;
        }
    }
});
document.addEventListener("keyup", e => {
    if (document.activeElement.tagName.toLowerCase() !== "input" && document.activeElement.tagName.toLowerCase() !== "textarea") {
        switch (e.code) {
            case "KeyW":
                Object.values(sockets).forEach(ws => {
                    if (!ws.isclosed) {
                        if (isOnControl) {
                            !mousemove ? ws.network.sendPacket(3, { up: 0 }) : 0;
                        }
                    }
                });
                break;
            case "KeyA":
                Object.values(sockets).forEach(ws => {
                    if (!ws.isclosed) {
                        if (isOnControl) {
                            !mousemove ? ws.network.sendPacket(3, { left: 0 }) : 0;
                        }
                    }
                });
                break;
            case "KeyS":
                Object.values(sockets).forEach(ws => {
                    if (!ws.isclosed) {
                        if (isOnControl) {
                            !mousemove ? ws.network.sendPacket(3, { down: 0 }) : 0;
                        }
                    }
                });
                break;
            case "KeyD":
                Object.values(sockets).forEach(ws => {
                    if (!ws.isclosed) {
                        if (isOnControl) {
                            !mousemove ? ws.network.sendPacket(3, { right: 0 }) : 0;
                        }
                    }
                });
                break;
        }
    }
});