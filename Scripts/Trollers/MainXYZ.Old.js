//  &#120;&#121;&#120;&#121;  

window.thisWeapon = "Pickaxe";

let lyrics = `We're no strangers to love
You know the rules and so do I
A full commitment's what I'm thinking of
You wouldn't get this from any other guy
I just wanna tell you how I'm feeling
Gotta make you understand
Never gonna give you up
Never gonna let you down
Never gonna run around and desert you
Never gonna make you cry
Never gonna say goodbye
Never gonna tell a lie and hurt you
We've known each other for so long
Your heart's been aching but you're too shy to say it
Inside we both know what's been going on
We know the game and we're gonna play it
And if you ask me how I'm feeling
Don't tell me you're too blind to see
Never gonna give you up
Never gonna let you down
Never gonna run around and desert you
Never gonna make you cry
Never gonna say goodbye
Never gonna tell a lie and hurt you
Never gonna give you up
Never gonna let you down
Never gonna run around and desert you
Never gonna make you cry
Never gonna say goodbye
Never gonna tell a lie and hurt you
Never gonna give, never gonna give
(Give you up)
We've known each other for so long
Your heart's been aching but you're too shy to say it
Inside we both know what's been going on
We know the game and we're gonna play it
I just wanna tell you how I'm feeling
Gotta make you understand
Never gonna give you up
Never gonna let you down
Never gonna run around and desert you
Never gonna make you cry
Never gonna say goodbye
Never gonna tell a lie and hurt you
Never gonna give you up
Never gonna let you down
Never gonna run around and desert you
Never gonna make you cry
Never gonna say goodbye
Never gonna tell a lie and hurt you
Never gonna give you up
Never gonna let you down
Never gonna run around and desert you
Never gonna make you cry
Never gonna say goodbye`.split('\n');

let thislyric = 0;

altName = " ";
// packets

window.packets = {
    joinpsk(psk) {
        sendPacket(9, { name: "JoinPartyByShareKey", partyShareKey: psk + "" });
    },
    leave() {
        sendPacket(9, { name: "LeaveParty" });
    },
    buy(item, tier) {
        sendPacket(9, { name: "BuyItem", itemName: item, tier: tier });
    },
    equip(item, tier) {
        sendPacket(9, { name: "EquipItem", itemName: item, tier: tier });
    },
    kick(uid) {
        sendPacket(9, { name: "KickParty", uid: uid });
    },
    sendmsg(msg) {
        sendPacket(9, { name: "SendChatMessage", channel: "Local", message: msg + "" });
    }
}

let sendPacket = (event, data) => {
    game.network.socket.readyState == 1 && game.network.socket.send(game.network.codec.encode(event, data));
}

window.joinpsk = window.packets.joinpsk;
window.leave = window.packets.leave;
window.buy = window.packets.buy;
window.equip = window.packets.equip;
window.kick = window.packets.kick;
window.sendmsg = window.packets.sendmsg;
window.sendPacket = sendPacket;

// toggles

let ahrc_1 = false;

window.scripts = {
    autoheal: { enabled: true, healSet: 20 /* best heal set*/, autobuypotion: true },
    autopetheal: { enabled: true, healSet: 70 /* best pet heal set*/, autobuypotion: false },
    autoRevivePets: false,
    autoEvolvePets: true,
    autobuildsetting: { autobuild: false, autoupgrade: false, autodeletenonfromautobuildedtowers: false, autodeleteinvalidtypetowers: false, upgradeTowerHealth: false, upgradeTowerHealAt: 35, upgradeTowerHealthTierMin: 1, upgradeTowerHealthTierMax: 8 },
    ahrc: { enabled: () => ahrc_1, toggle: () => { ahrc_1 = !ahrc_1 }, toTrue: () => { ahrc_1 = true }, toFalse: () => { ahrc_1 = false } },
    aito: {
        enabled: () => window.startaito, toggle: () => {
            window.startaito = !window.startaito;
            window.startaito ? window.sendAitoAlt() : null;
        }, toTrue: () => {
            window.startaito = true;
            window.startaito ? window.sendAitoAlt() : null;
        }, toFalse: () => {
            window.startaito = false;
            window.startaito ? window.sendAitoAlt() : null;
        }
    },
    autoclearmessages: false,
    autowalls: { _3x3: false, _5x5: false, _7x7: false, _9x9: false },
    autospammessage: false,
    showplayersinfo: false,
    autoupgrade: false,
    autobow: false,
    antikick: false,
    autohi: false,
    w3x3walls: { enabled: false, w3x3: 1 },
    w3x3doors: { enabled: false, w3x3: 1 },
    w3x3traps: { enabled: false, w3x3: 1 },
    xkey: false,
    autoShield: false,
    socketMouseDown: true,
    socketFollowMouse: false,
    socketRoundPlayer: false,
    socketFreezeMouse: false,
    detectPlayers: true,
    LogScore: false,
    autorespawn: true,
    respawnWhenDeadWithoutBase: false,
    autoaim: false,
    advancedwallplacer: false,
    chattoswear: false
}
window.activated = false;
// html of main xyz

// main x
let waituntilload = setInterval(() => {
    if (document.getElementsByClassName("mainxskripts")[0]) {
        clearInterval(waituntilload);
        document.getElementsByClassName("mainxskripts")[0].innerHTML = `
<button class="M1" onclick="window.mainxbygridtype('M1G');" style="width: 20%">Main (1)</button>
<button class="M2" onclick="window.mainxbygridtype('M2G');" style="width: 20%">Main (2)</button>
<button class="AB" onclick="window.mainxbygridtype('ABG');" style="width: 20%">Autobuild</button>
<button class="SL" onclick="window.mainxbygridtype('SLG');" style="width: 20%">Score Logger</button>
<br><br>

<div class="M1G" style="display: none;">
<button class="btn btn-green 0i" style="width: 45%;" onclick="window.SellAll();">Sell All?</button>
<button class="btn btn-green 1i" style="width: 45%;" onclick="window.SellTower("Wall");">Sell Walls?</button>
<button class="btn btn-green 2i" style="width: 45%;" onclick="window.SellTower("Door");">Sell Doors?</button>
<button class="btn btn-green 3i" style="width: 45%;" onclick="window.SellPets();">Sell Pets?</button>
<button class="btn btn-${window.scripts.autoupgrade ? "red" : "blue"} 4i" style="width: 45%;" onclick="window.upgradealltgl();">${window.scripts.autoupgrade ? "Disable" : "Enable"} Upgrade All</button>
<button class="btn btn-${window.scripts.ahrc.enabled() ? "red" : "blue"} 5i" style="width: 45%;" onclick="ahrctgl();">${window.scripts.ahrc.enabled() ? "Disable" : "Enable"} AHRC</button>
<button class="btn btn-${window.scripts.autobow ? "red" : "blue"} 6i" style="width: 45%;" onclick="autobowtgl();">${window.scripts.autobow ? "Disable" : "Enable"} Autobow</button>
<button class="btn btn-${window.scripts.autoclearmessages ? "red" : "blue"} 7i" style="width: 45%;" onclick="autocleartgl();">${window.scripts.autoclearmessages ? "Disable" : "Enable"} Auto Clear Chat</button>
<button class="btn btn-${window.scripts.aito.enabled() ? "red" : "blue"} aito" style="width: 45%;" onclick="aitotgl();">${window.scripts.aito.enabled() ? "Disable" : "Enable"} AITO</button>

<br><br>
<input style="width: 45%; type="text" class="btn btn-white 8i" placeholder="Party Key" maxLength="20">
<button class="btn btn-blue 9i" style="width: 45%;" onclick="join9i();">join?</button>

<input style="width: 45%; type="text" class="btn btn-white 10i" placeholder="Party Key" maxLength="20">
<button class="btn btn-blue 11i" style="width: 45%;" onclick="join11i();">join?</button>

<input style="width: 45%; type="text" class="btn btn-white 12i" placeholder="Party Key" maxLength="20">
<button class="btn btn-${window.scripts.antikick ? "red" : "blue"} 13i" style="width: 45%;" onclick="join13i();">${window.scripts.antikick ? "Disable" : "Enable"} Anti Kick</button>
<button class="btn btn-blue 14i" style="width: 45%;" onclick="leave();">Leave Party</button>


</div>

<div class="M2G" style="display: none;">
<button class="btn btn-green sellpet" style="width: 45%;" onclick="window.SellMyPet()">Sell Pet?</button>
<button class="btn btn-${window.scripts.autoheal.autobuypotion ? "red" : "blue"} autopotion" style="width: 45%;" onclick="autopotion();">${window.scripts.autoheal.autobuypotion ? "Disable" : "Enable"} Autobuy Potion</button>
<button class="btn btn-${window.scripts.showplayersinfo ? "red" : "blue"} 15i" style="width: 45%;" onclick="getgetrss();">${window.scripts.showplayersinfo ? "Disable" : "Enable"} Resource detector</button>
<button class="btn btn-${window.scripts.autohi ? "red" : "blue"} 16i" style="width: 45%;" onclick="autohi();">${window.scripts.autohi ? "Disable" : "Enable"} Auto Hi</button>
<input style="width: 45%; type="text" class="btn btn-white 17i" placeholder="Player Heal Speed" maxLength="2" value="${window.scripts.autoheal.healSet}">
<button class="btn btn-${window.scripts.autoheal.enabled ? "red" : "blue"} 18i" style="width: 45%;" onclick="autoheal();">${window.scripts.autoheal.enabled ? "Disable" : "Enable"} Autoheal</button>
<input style="width: 45%; type="text" class="btn btn-white 19i" placeholder="Pet Heal Speed" maxLength="2" value="${window.scripts.autopetheal.healSet}">
<button class="btn btn-${window.scripts.autopetheal.enabled ? "red" : "blue"} 20i" style="width: 45%;" onclick="autopetheal();">${window.scripts.autopetheal.enabled ? "Disable" : "Enable"} Pet Autoheal</button>
<button class="btn btn-${window.scripts.autoRevivePets ? "red" : "blue"} 21i" style="width: 45%;" onclick="autorevivepets();">${window.scripts.autoRevivePets ? "Disable" : "Enable"} Auto Revive Pet</button>
<button class="btn btn-${window.scripts.autoEvolvePets ? "red" : "blue"} 22i" style="width: 45%;" onclick="autoevolvepets();">${window.scripts.autoEvolvePets ? "Disable" : "Enable"} Auto Evolve Pet</button>
<br><br>
<button class="btn btn-green w3x3w" style="width: 45%;" onclick="w3x3w()">3x3 Walls?</button>
<button class="btn btn-green w5x5w" style="width: 45%;" onclick="w5x5w()">5x5 Walls?</button>
<button class="btn btn-green w7x7w" style="width: 45%;" onclick="w7x7w()">7x7 Walls?</button>
<button class="btn btn-green w9x9w" style="width: 45%;" onclick="w9x9w()">9x9 Walls?</button>
<br>
<button class="btn btn-${window.scripts.w3x3walls.enabled ? "red" : "blue"} 23i" style="width: 45%;" onclick="ew3x3w();">${window.scripts.w3x3walls.enabled ? "Disable" : "Enable"} ${window.scripts.w3x3walls.w3x3 == 1 ? "3x3" : window.scripts.w3x3walls.w3x3 == 2 ? "5x5" : window.scripts.w3x3walls.w3x3 == 3 ? "7x7" : window.scripts.w3x3walls.w3x3 == 4 ? "9x9" : "1x1"} Walls</button>
<br><br>
<button class="btn btn-green w3x3d" style="width: 45%;" onclick="w3x3d()">3x3 Doors?</button>
<button class="btn btn-green w5x5d" style="width: 45%;" onclick="w5x5d()">5x5 Doors?</button>
<button class="btn btn-green w7x7d" style="width: 45%;" onclick="w7x7d()">7x7 Doors?</button>
<button class="btn btn-green w9x9d" style="width: 45%;" onclick="w9x9d()">9x9 Doors?</button>
<br>
<button class="btn btn-${window.scripts.w3x3doors.enabled ? "red" : "blue"} 24i" style="width: 45%;" onclick="ew3x3d();">${window.scripts.w3x3doors.enabled ? "Disable" : "Enable"} ${window.scripts.w3x3doors.w3x3 == 1 ? "3x3" : window.scripts.w3x3doors.w3x3 == 2 ? "5x5" : window.scripts.w3x3doors.w3x3 == 3 ? "7x7" : window.scripts.w3x3doors.w3x3 == 4 ? "9x9" : "1x1"} Doors</button>
<br><br>
<button class="btn btn-green w3x3t" style="width: 45%;" onclick="w3x3t()">3x3 Traps?</button>
<button class="btn btn-green w5x5t" style="width: 45%;" onclick="w5x5t()">5x5 Traps?</button>
<button class="btn btn-green w7x7t" style="width: 45%;" onclick="w7x7t()">7x7 Traps?</button>
<button class="btn btn-green w9x9t" style="width: 45%;" onclick="w9x9t()">9x9 Traps?</button>
<br>
<button class="btn btn-${window.scripts.w3x3traps.enabled ? "red" : "blue"} 25i" style="width: 45%;" onclick="ew3x3t();">${window.scripts.w3x3traps.enabled ? "Disable" : "Enable"} ${window.scripts.w3x3traps.w3x3 == 1 ? "3x3" : window.scripts.w3x3traps.w3x3 == 2 ? "5x5" : window.scripts.w3x3traps.w3x3 == 3 ? "7x7" : window.scripts.w3x3traps.w3x3 == 4 ? "9x9" : "1x1"} Traps</button>
</div>

<div class="ABG" style="display: none;">
<button class="btn btn-green 1i2" style="width: 45%;" onclick="targetRecordedBase('15001wavebase');">Target 15001W base?</button>
<button class="btn btn-green 2i2" style="width: 45%;" onclick="targetRecordedBase('15001wavebasewithmaze');">Target mazed 15001W base?</button>
<input style="width: 45%; type="text" class="btn btn-white 3i2" placeholder="Base Name">
<button class="btn btn-green 4i2" style="width: 45%;" onclick="recordbase()">Record Base?</button>
<button class="btn btn-green 4i2" style="width: 45%;" onclick="targetbase()">Target Base?</button>
<button class="btn btn-green 4i2" style="width: 45%;" onclick="deletebase()">Delete Recorded Base?</button>
<div class="targetbasetext" style="width: 100%;">Target: 15001wavebase</div>
<button class="btn btn-green 4i2" style="width: 45%;" onclick="buildTargetedBase()">Build Targeted Base?</button>
<br><br>
<button class="btn btn-${window.scripts.autobuildsetting.autobuild ? "red" : "blue"} 5i2" style="width: 45%;" onclick="autobuildtargetedbase()">${window.scripts.autobuildsetting.autobuild ? "Disable" : "Enable"} Autobuild?</button>
<button class="btn btn-${window.scripts.autobuildsetting.autoupgrade ? "red" : "blue"} 6i2" style="width: 45%;" onclick="autoupgradetargetedbase()">${window.scripts.autobuildsetting.autoupgrade ? "Disable" : "Enable"} Autoupgrade?</button>
<button class="btn btn-${window.scripts.autobuildsetting.autodeletenonfromautobuildedtowers ? "red" : "blue"} 7i2" style="width: 45%;" onclick="autodeletenonfromautobuildedtowerstargetedbase()">${window.scripts.autobuildsetting.autodeletenonfromautobuildedtowers ? "Disable" : "Enable"} Autodelete irbt?</button>
<button class="btn btn-${window.scripts.autobuildsetting.autodeleteinvalidtypetowers ? "red" : "blue"} 8i2" style="width: 45%;" onclick="autodeleteinvalidtypetowerstargetedbase()">${window.scripts.autobuildsetting.autodeleteinvalidtypetowers ? "Disable" : "Enable"} Autodelete itt?</button>
<br><br>
<button class="btn btn-${window.scripts.autobuildsetting.upgradeTowerHealth ? "red" : "blue"} 9i2" style="width: 45%;" onclick="upgradeTowerHealthtargetedbase()">${window.scripts.autobuildsetting.upgradeTowerHealth ? "Disable" : "Enable"} UTH?</button>
<input style="width: 45%; type="text" class="btn btn-white UTHP" placeholder="UTH Percent" maxLength="2" value="${window.scripts.autobuildsetting.upgradeTowerHealAt}">
<input style="width: 45%; type="text" class="btn btn-white UTHMIN" placeholder="Min Tier" maxLength="1" value="${window.scripts.autobuildsetting.upgradeTowerHealthTierMin}">
<input style="width: 45%; type="text" class="btn btn-white UTHMAX" placeholder="Max Tier" maxLength="1" value="${window.scripts.autobuildsetting.upgradeTowerHealthTierMax}">

</div>

<div class="SLG" style="display: none;">

</div>

`

        // main y
        /*
        document.getElementsByClassName("mainyskripts")[0].innerHTML = `

`
        // only has server scanner, player finder is impossible now so removed
*/
        // main z
        document.getElementsByClassName("mainzskripts")[0].innerHTML = `
<button class="M3" onclick="window.mainxbygridtype('M3G');" style="width: 20%">Main (3)</button>
<button class="M4" onclick="window.mainxbygridtype('M4G');" style="width: 20%">Raid Tool</button>
<br><br>

<div class="M3G" style="display: none;">
<button class="btn btn-green 0i3" style="width: 45%;" onclick="window.sendAlt();">Send Alt?</button>
</div>

<div class="M4G" style="display: none;">
<button class="btn btn-blue 0i4" style="width: 45%;" onclick="window.xkey();">Enable X Key?</button>
<button class="btn btn-blue 1i4" style="width: 45%;" onclick="window.autoaim();">Enable AutoAim?</button>
</div>
`
        window.mainxbygridtype = function (type) {
            document.getElementsByClassName("M1G")[0].style.display = "none";
            document.getElementsByClassName("M2G")[0].style.display = "none";
            document.getElementsByClassName("ABG")[0].style.display = "none";
            document.getElementsByClassName("SLG")[0].style.display = "none";

            document.getElementsByClassName("M3G")[0].style.display = "none";
            document.getElementsByClassName("M4G")[0].style.display = "none";

            document.getElementsByClassName("M1")[0].innerText = "Main (1)";
            document.getElementsByClassName("M2")[0].innerText = "Main (2)";
            document.getElementsByClassName("AB")[0].innerText = "Autobuild";
            document.getElementsByClassName("SL")[0].innerText = "Score Logger";

            document.getElementsByClassName("M3")[0].innerText = "Main (3)";
            document.getElementsByClassName("M4")[0].innerText = "Raid Tool";

            document.getElementsByClassName(type.split("G")[0])[0].innerText = "- Selected -";
            document.getElementsByClassName(type)[0].style.display = "";
        }
    }
}, 100)

// start
let myPlayer = {};
let myPet = {};
sockets = {};
let socketsByUid = {};
let entities = new Map();
let npcs = {};
let inventory = {};
isDay = null;
let activeBuildingsByPos = new Map();
let rotatableBuildings = new Map();
let buildingsByhealth = new Map();
let rebuilder = [];
let reDITT = [];
let reDNFABT = [];
let reupgrader = [];
let buildingsSaved = {};

window.myPlayer = myPlayer;
window.myPet = myPet;
window.inventory = inventory;
window.activeBuildingsByPos = activeBuildingsByPos;
window.rotatableBuildings = rotatableBuildings;
window.socketsByUid = socketsByUid;
window.entities = entities;

window.setElementToggleTo = (enabled, classname) => {
    if (!enabled) {
        document.getElementsByClassName(classname)[0].innerText = document.getElementsByClassName(classname)[0].innerText.replace("Disable", "Enable");
        document.getElementsByClassName(classname)[0].className = document.getElementsByClassName(classname)[0].className.replace("red", "blue");
    } else {
        document.getElementsByClassName(classname)[0].innerText = document.getElementsByClassName(classname)[0].innerText.replace("Enable", "Disable");
        document.getElementsByClassName(classname)[0].className = document.getElementsByClassName(classname)[0].className.replace("blue", "red");
    }
}

let evolvePetTiersAndExp = {
    "1, 9, 100": 1,
    "2, 17, 100": 1,
    "3, 25, 100": 1,
    "4, 33, 100": 1,
    "5, 49, 200": 1,
    "6, 65, 200": 1,
    "7, 97, 300": 1
}

let includeEntity = { "name": 1, "uid": 1, "model": 1, "entityClass": 1, "health": 1, "maxHealth": 1, "yaw": 1, "position": 1, "dead": 1, "experience": 1, "tier": 1, "wood": 1, "stone": 1, "gold": 1, "token": 1, "partyId": 1, "petUid": 1, "score": 1, "wave": 1, "weaponName": 1 }
let addMissingTickFields = function (tick, lastTick) {
    let obj = Object.keys(lastTick);
    for (let i = 0; i < obj.length; i++) {
        let e = obj[i];
        includeEntity[e] && (tick[e] = lastTick[e]);
    }
};

let returnRequiredLevelIfHigher = (level, returnRequiredLevelIfHigher) => {
    return level > returnRequiredLevelIfHigher ? returnRequiredLevelIfHigher : level;
}

let detectPetLevelIfHigherReturnItsRequiredLevel = (tier, level) => {
    let evolveLevel = [9, 17, 25, 33, 49, 65, 97][tier - 1] | 0;
    return returnRequiredLevelIfHigher(level, evolveLevel);
}

let detectPetTokenIfHigherReturnItsRequiredLevel = (tier, token) => {
    let evolveToken = [100, 100, 100, 100, 200, 200, 300][tier - 1] | 0;
    return returnRequiredLevelIfHigher(token, evolveToken);
}

const measureDistance = (obj1, obj2) => {
    let a = (obj2.x - obj1.x) | 0;
    let b = (obj2.y - obj1.y) | 0;
    let c = (a * a + b * b) | 0;
    return (c ** 0.5) | 0;
}

let mouse = {};

let angleTo = (xFrom, yFrom, xTo, yTo) => {
    return ((Math.atan2(yTo - yFrom, xTo - xFrom) / (Math.PI / 180) + 450) % 360) | 0;
};

let screenToYaw = function (x, y) {
    return angleTo(game.renderer.getWidth() / 2, game.renderer.getHeight() / 2, x, y);
};

let screenToWorld = (x, y) => {
    let ratio = Math.max((window.innerWidth * window.devicePixelRatio) / 1920, (window.innerHeight * window.devicePixelRatio) / 1080);
    let scale = ratio == game.renderer.scale ? ratio : game.renderer.scale;
    let halfX = (window.innerWidth * window.devicePixelRatio) / 2;
    let halfY = (window.innerHeight * window.devicePixelRatio) / 2;
    let position = { x: -(myPlayer.position.x * scale) + halfX, y: -(myPlayer.position.y * scale) + halfY };
    return {
        x: (-position.x * (1 / scale)) + (x * (1 / scale) * window.devicePixelRatio),
        y: (-position.y * (1 / scale)) + (y * (1 / scale) * window.devicePixelRatio)
    };
}

let aimToYaw = (num) => !(num > 90 + 23) && !(num < 90 - 23)
    ? 90 : !(num > 225 + 23) && !(num < 225 - 23)
        ? 225 : !(num > 135 + 23) && !(num < 135 - 23)
            ? 135 : !(num > 360 + 23) && !(num < 360 - 23)
                ? 359 : !(num > 0 + 23) && !(num < 0 - 23)
                    ? 359 : !(num > 180 + 23) && !(num < 180 - 23)
                        ? 180 : !(num > 270 + 23) && !(num < 270 - 23)
                            ? 270 : !(num > 315 + 23) && !(num < 315 - 23)
                                ? 314 : !(num > 45 + 23) && !(num < 45 - 23)
                                    ? 44 : null

let RoundPlayer = (a = 0) => {
    let n = a % 8;
    if (n == 0) {
        return { x: myPlayer.position.x + 500, y: myPlayer.position.y };
    }
    if (n == 1) {
        return { x: myPlayer.position.x + 250, y: myPlayer.position.y + 250 };
    }
    if (n == 2) {
        return { x: myPlayer.position.x, y: myPlayer.position.y + 500 };
    }
    if (n == 3) {
        return { x: myPlayer.position.x - 250, y: myPlayer.position.y + 250 };
    }
    if (n == 4) {
        return { x: myPlayer.position.x - 500, y: myPlayer.position.y };
    }
    if (n == 5) {
        return { x: myPlayer.position.x - 250, y: myPlayer.position.y - 250 };
    }
    if (n == 6) {
        return { x: myPlayer.position.x, y: myPlayer.position.y - 500 };
    }
    if (n == 7) {
        return { x: myPlayer.position.x + 250, y: myPlayer.position.y - 250 };
    }
}

let myMouse = {};
let spinning;

let reversedYaw = false;

document.addEventListener("mousemove", e => {
    myMouse = { x: e.clientX, y: e.clientY };
});
document.getElementsByClassName("hud")[0].addEventListener("mousedown", function (e) {
    if (e.button == 2) {
        reversedYaw = true;
    }
});
document.getElementsByClassName("hud")[0].addEventListener("mouseup", function (e) {
    if (e.button == 2) {
        reversedYaw = false;
    }
});

document.addEventListener('keydown', e => {
    if (document.activeElement.tagName.toLowerCase() !== "input" && document.activeElement.tagName.toLowerCase() !== "textarea") {
        switch (e.code) {
            case "KeyQ":
                Object.values(sockets).forEach(e => {
                    !e.thisWeapon && (e.thisWeapon = 'Pickaxe');
                    var nextWeapon = 'Pickaxe';
                    var weaponOrder = ['Pickaxe', 'Spear', 'Bow', 'Bomb'];
                    var foundCurrent = false;
                    for (var i in weaponOrder) {
                        if (foundCurrent) {
                            if (e.inventory[weaponOrder[i]]) {
                                nextWeapon = weaponOrder[i];
                                break;
                            }
                        } else if (weaponOrder[i] == e.thisWeapon) {
                            foundCurrent = true;
                        }
                    }
                    e.sendPacket(9, { name: 'EquipItem', itemName: nextWeapon, tier: e.inventory[nextWeapon].tier });
                    e.thisWeapon = nextWeapon;
                    e.inventory[e.thisWeapon] && e.sendPacket(9, { name: 'EquipItem', itemName: e.thisWeapon, tier: e.inventory[e.thisWeapon].tier });
                })
                break;
            case "KeyP":
                window.scripts.socketFreezeMouse = !window.scripts.socketFreezeMouse;
                break;
            case "KeyH":
                Object.keys(sockets).forEach(ii => {
                    sockets[ii].sendPacket(9, { name: 'LeaveParty' });
                })
                break;
            case "KeyJ":
                for (let ii = 1; ii < 4; ii++) {
                    sockets[ii] && sockets[ii].sendPacket(9, { name: 'JoinPartyByShareKey', partyShareKey: game.ui.playerPartyShareKey });
                }
                break;
            case "Space":
                if (window.scripts.socketMouseDown) {
                    Object.keys(sockets).forEach(ii => {
                        setTimeout(() => {
                            sockets[ii].sendPacket(3, { space: 0 });
                            sockets[ii].sendPacket(3, { space: 1 });
                        }, 100 * sockets[ii].hitDelay);
                    })
                }
                break;
            case "KeyR":
                if (game.ui.components.BuildingOverlay.buildingUid) {
                    if (game.ui.components.BuildingOverlay.shouldUpgradeAll) {
                        for (let i in game.ui.buildings) {
                            if (game.ui.buildings[i].type == game.ui.components.BuildingOverlay.buildingId && game.ui.buildings[i].tier == game.ui.components.BuildingOverlay.buildingTier) {
                                Object.keys(sockets).forEach(ii => {
                                    sockets[ii].sendPacket(9, { name: "UpgradeBuilding", uid: game.ui.buildings[i].uid });
                                })
                            }
                        }
                    } else {
                        Object.keys(sockets).forEach(ii => {
                            sockets[ii].sendPacket(9, { name: "UpgradeBuilding", uid: game.ui.components.BuildingOverlay.buildingUid })
                        })
                    }
                }
                break;
            case "KeyY":
                if (game.ui.components.BuildingOverlay.buildingUid && game.ui.components.BuildingOverlay.buildingId !== "GoldStash") {
                    if (game.ui.components.BuildingOverlay.shouldUpgradeAll) {
                        for (let i in game.ui.buildings) {
                            if (game.ui.buildings[i].type == game.ui.components.BuildingOverlay.buildingId && game.ui.buildings[i].tier == game.ui.components.BuildingOverlay.buildingTier) {
                                Object.keys(sockets).forEach(ii => {
                                    sockets[ii].sendPacket(9, { name: "DeleteBuilding", uid: game.ui.buildings[i].uid })
                                })
                            }
                        }
                    } else {
                        Object.keys(sockets).forEach(ii => {
                            sockets[ii].sendPacket(9, { name: "DeleteBuilding", uid: game.ui.components.BuildingOverlay.buildingUid })
                        })
                    }
                }
                break;
            case "KeyV":
                Object.keys(sockets).forEach(ii => {
                    if (sockets[ii].myPet) {
                        sockets[ii].sendPacket(9, { name: "DeleteBuilding", uid: sockets[ii].myPet.uid || 0 });
                    }
                })
                break;
            case "BracketRight":
                Object.keys(sockets).forEach(ii => {
                    sendPacket(9, { name: "JoinPartyByShareKey", partyShareKey: sockets[ii].psk.response.partyShareKey })
                })
                break;
            case "KeyN":
                Object.keys(sockets).forEach(ii => {
                    sockets[ii].sendPacket(9, { name: "BuyItem", itemName: "PetRevive", tier: 1 })
                    sockets[ii].sendPacket(9, { name: "EquipItem", itemName: "PetRevive", tier: 1 })
                })
                break;
            case "KeyW":
                scripts.wasd && Object.keys(sockets).forEach(ii => {
                    sockets[ii].sendPacket(3, { up: 1, down: 0 });
                })
                break;
            case "KeyD":
                scripts.wasd && Object.keys(sockets).forEach(ii => {
                    sockets[ii].sendPacket(3, { right: 1, left: 0 });
                })
                break;
            case "KeyS":
                scripts.wasd && Object.keys(sockets).forEach(ii => {
                    sockets[ii].sendPacket(3, { down: 1, up: 0 });
                })
                break;
            case "KeyA":
                scripts.wasd && Object.keys(sockets).forEach(ii => {
                    sockets[ii].sendPacket(3, { left: 1, right: 0 });
                })
                break;
        }
    }
})
document.addEventListener('keyup', e => {
    if (document.activeElement.tagName.toLowerCase() !== "input" && document.activeElement.tagName.toLowerCase() !== "textarea") {
        switch (e.code) {
            case "KeyW":
                scripts.wasd && Object.keys(sockets).forEach(ii => {
                    sockets[ii].sendPacket(3, { up: 0 });
                })
                break;
            case "KeyD":
                scripts.wasd && Object.keys(sockets).forEach(ii => {
                    sockets[ii].sendPacket(3, { right: 0 });
                })
                break;
            case "KeyS":
                scripts.wasd && Object.keys(sockets).forEach(ii => {
                    sockets[ii].sendPacket(3, { down: 0 });
                })
                break;
            case "KeyA":
                scripts.wasd && Object.keys(sockets).forEach(ii => {
                    sockets[ii].sendPacket(3, { left: 0 });
                })
                break;
        }
    }
})
document.getElementsByClassName("hud")[0].addEventListener("mousedown", function (e) {
    if (window.scripts.socketMouseDown) {
        if (!e.button) {
            Object.keys(sockets).forEach(ii => {
                sockets[ii].sendPacket(3, { mouseDown: sockets[ii].aimingYaw });
            })
        }
    }
});
document.getElementsByClassName("hud")[0].addEventListener("mouseup", function (e) {
    if (window.scripts.socketMouseDown) {
        if (!e.button) {
            Object.keys(sockets).forEach(ii => {
                sockets[ii].sendPacket(3, { mouseUp: 1 });
            })
        }
    }
});
document.getElementsByClassName("hud-shop-item")[0].addEventListener('click', function () {
    Object.keys(sockets).forEach(ii => {
        sockets[ii].sendPacket(9, { name: "BuyItem", itemName: "Pickaxe", tier: sockets[ii].inventory.Pickaxe.tier + 1 });
    })
});
document.getElementsByClassName("hud-shop-item")[1].addEventListener('click', function () {
    Object.keys(sockets).forEach(ii => {
        sockets[ii].sendPacket(9, { name: "BuyItem", itemName: "Spear", tier: sockets[ii].inventory.Spear ? sockets[ii].inventory.Spear.tier + 1 : 1 });
    })
});
document.getElementsByClassName("hud-shop-item")[2].addEventListener('click', function () {
    Object.keys(sockets).forEach(ii => {
        sockets[ii].sendPacket(9, { name: "BuyItem", itemName: "Bow", tier: sockets[ii].inventory.Bow ? sockets[ii].inventory.Bow.tier + 1 : 1 });
    })
});
document.getElementsByClassName("hud-shop-item")[3].addEventListener('click', function () {
    Object.keys(sockets).forEach(ii => {
        sockets[ii].sendPacket(9, { name: "BuyItem", itemName: "Bomb", tier: sockets[ii].inventory.Bomb ? sockets[ii].inventory.Bomb.tier + 1 : 1 });
    })
});
document.getElementsByClassName("hud-shop-item")[4].addEventListener('click', function () {
    Object.keys(sockets).forEach(ii => {
        sockets[ii].sendPacket(9, { name: "BuyItem", itemName: "ZombieShield", tier: sockets[ii].inventory.ZombieShield ? sockets[ii].inventory.ZombieShield.tier + 1 : 1 });
    })
});
document.getElementsByClassName("hud-respawn-btn")[0].addEventListener('click', function () {
    Object.keys(sockets).forEach(ii => {
        sockets[ii].sendPacket(3, { respawn: 1 });
    })
})
document.getElementsByClassName("hud-toolbar-item")[0].addEventListener('mouseup', function (e) {
    if (!e.button) {
        window.thisWeapon = "Pickaxe";
        Object.keys(sockets).forEach(ii => {
            sockets[ii].sendPacket(9, { name: "EquipItem", itemName: "Pickaxe", tier: sockets[ii].inventory.Pickaxe.tier });
            sockets[ii].thisWeapon = "Pickaxe";
        })
    }
});
document.getElementsByClassName("hud-toolbar-item")[1].addEventListener('mouseup', function (e) {
    if (!e.button) {
        window.thisWeapon = "Spear";
        Object.keys(sockets).forEach(ii => {
            sockets[ii].inventory.Spear && (sockets[ii].thisWeapon = "Spear") && sockets[ii].sendPacket(9, { name: "EquipItem", itemName: "Spear", tier: sockets[ii].inventory.Spear.tier });
        })
    }
});
document.getElementsByClassName("hud-toolbar-item")[2].addEventListener('mouseup', function (e) {
    if (!e.button) {
        window.thisWeapon = "Bow";
        Object.keys(sockets).forEach(ii => {
            sockets[ii].inventory.Bow && (sockets[ii].thisWeapon = "Bow") && sockets[ii].sendPacket(9, { name: "EquipItem", itemName: "Bow", tier: sockets[ii].inventory.Bow.tier });
        })
    }
});
document.getElementsByClassName("hud-toolbar-item")[3].addEventListener('mouseup', function (e) {
    if (!e.button) {
        window.thisWeapon = "Bomb";
        Object.keys(sockets).forEach(ii => {
            sockets[ii].inventory.Bomb && (sockets[ii].thisWeapon = "Bomb") && sockets[ii].sendPacket(9, { name: "EquipItem", itemName: "Bomb", tier: sockets[ii].inventory.Bomb.tier });
        })
    }
});
document.getElementsByClassName("hud-toolbar-item")[4].addEventListener('mouseup', function (e) {
    if (!e.button) {
        Object.keys(sockets).forEach(ii => {
            sockets[ii].sendPacket(9, { name: "EquipItem", itemName: "HealthPotion", tier: 1 });
        })
    }
});
document.getElementsByClassName("hud-toolbar-item")[5].addEventListener('mouseup', function (e) {
    if (!e.button) {
        Object.keys(sockets).forEach(ii => {
            sockets[ii].sendPacket(9, { name: "EquipItem", itemName: "PetHealthPotion", tier: 1 });
        })
    }
});
document.getElementsByClassName("hud-toolbar-item")[6].addEventListener("mouseup", function (e) {
    if (!e.button) {
        Object.keys(sockets).forEach(ii => {
            sockets[ii].sendPacket(9, { name: "RecallPet" });
            sockets[ii].sendPacket(3, { respawn: 1 });
            sockets[ii].automove = !sockets[ii].automove;
            if (sockets[ii].automove) {
                window.move = true;
            } else {
                window.move = false;
            }
        })
    }
});
document.getElementsByClassName('hud-respawn-btn')[0].addEventListener('click', () => {
    Object.keys(sockets).forEach(ii => {
        sockets[ii].sendPacket(3, { respawn: 1 });
    })
});

let ahrc_turn_id = "main";
let SpinToggle;
let thisAim = 0;

let aimm = 0;

let autotier1spear = false;
let autotier2spear = false;
let autotier4spear = false;

game.network.sendInput2 = game.network.sendInput;
game.network.sendInput = data => {
    if (spinning && data.mouseDown !== undefined) data.mouseDown = thisAim;
    if (spinning && data.mouseMoved !== undefined) data.mouseMoved = thisAim;
    if (spinning && data.mouseMovedWhileDown !== undefined) data.mouseMovedWhileDown = thisAim;
    game.network.sendInput2(data);
}

let ticks = [
    { tick: 0, resetTick: 31, deposit: 0.4, tier: 1 },
    { tick: 0, resetTick: 29, deposit: 0.6, tier: 2 },
    { tick: 0, resetTick: 27, deposit: 0.7, tier: 3 },
    { tick: 0, resetTick: 24, deposit: 1, tier: 4 },
    { tick: 0, resetTick: 22, deposit: 1.2, tier: 5 },
    { tick: 0, resetTick: 20, deposit: 1.4, tier: 6 },
    { tick: 0, resetTick: 18, deposit: 2.4, tier: 7 },
    { tick: 0, resetTick: 16, deposit: 3, tier: 8 }
];
let depositAhrc = (tick) => {
    Object.values(buildingsSaved).forEach(e => {
        if (e.tier == tick.tier) {
            sendPacket(9, { name: "AddDepositToHarvester", uid: e.uid, deposit: tick.deposit })
        }
    })
}
let collectAhrc = (tick) => {
    Object.values(buildingsSaved).forEach(e => {
        if (e.tier == tick.tier) {
            sendPacket(9, { name: "CollectHarvester", uid: e.uid })
        }
    })
}

setInterval(() => {
    if (window.scripts.autoclearmessages) {
        for (let i = 0; i < document.getElementsByClassName('hud-chat-message').length; i++) {
            document.getElementsByClassName('hud-chat-message')[i].remove();
        }
    }
});

// required

game.network.addPacketHandler(4, data => {
    myPlayer.uid = data.uid;
    myPlayer.name = data.effectiveDisplayName;
    altName = data.effectiveDisplayName;
})

let buildingUids_1 = {};

// required

game.network.addPacketHandler(9, data => {
    if (data.name == "SetItem") {
        inventory[data.response.itemName] = data.response;
        if (inventory.HatHorns) {
            if (!inventory.HatHorns.stacks) {
                sendPacket(9, { name: "BuyItem", itemName: "HatHorns", tier: 1 });
                sendPacket(9, { name: "BuyItem", itemName: "Crossbow", tier: 1 });
            }
        }
        if (!inventory[data.response.itemName].stacks) {
            delete inventory[data.response.itemName];
        }
    }
    if (data.name == "DayCycle") {
        isDay = data.response.isDay;
        if (window.scripts.LogScore && lastwave !== (myPlayer.wave || 0) && !isDay) {
            lastwave = myPlayer.wave;
            console.log(scoreStats());
            scoreData.push(scoreStats());
            (myPlayer.score - lastScore) > highestspw && (highestspw = myPlayer.score - lastScore);
            lastScore = myPlayer.score;
            lastid = lastid + 1;
            lastms = Date.now();
            let scorestats = scoreStats();
            let el = document.createElement('div');
            el.innerText = `${scorestats.id}, wave: ${scorestats.wave}, score: ${scorestats.score}, spw: ${scorestats.spw}, hspw: ${scorestats.hspw}, wavelength: ${scorestats.ticker}`;
            el.className = `spw${lastid}`;
            document.getElementsByClassName('SLG')[0].appendChild(el);
        }
    }
    if (data.name == "LocalBuilding") {
        data.response.forEach(e => {
            if (buildingUids_1[e.uid]) {
                return;
            }
            if (e.dead && !buildingUids_1[e.uid]) {
                buildingUids_1[e.uid] = 1;
                setTimeout(() => {
                    delete buildingUids_1[e.uid];
                }, 500)
            }
            if (e.type == "GoldStash") {
                gs = e;
            }
            if (e.type == "GoldStash" && e.dead) {
                gs = undefined;
            }
            let index = getEntitiesInGrid(e.x, e.y);
            activeBuildingsByPos.set(index, e);
            if (activeBuildingsByPos.get(index).dead) activeBuildingsByPos.delete(index);
            e.type == "Harvester" && (buildingsSaved[index] = e);
        })
        localbuildingUpdate();
    }
    if (data.name == "Dead") {
        window.thisWeapon = "Pickaxe";
    }
    if (data.name == "PartyInfo") {
        partyInfoAlt = data.response;
        if (data.response[0].playerUid == game.world.myUid) {
            data.response.forEach(e => {
                if (socketsByUid[e.playerUid] && !e.canSell) {
                    game.network.sendPacket(9, { name: "SetPartyMemberCanSell", uid: e.playerUid, canSell: 1 });
                }
            })
        }
    }
})

let localbuildingUpdate = () => {
    rebuilder = [];
    reDITT = [];
    reDNFABT = [];
    reupgrader = [];
    if (game.network.socket && game.network.socket.readyState == 1 && gs) {
        if (window.scripts.autobuildsetting.autobuild || window.scripts.autobuildsetting.autodeleteinvalidtypetowers) {
            sirrMXBArr.forEach(e => {
                if (window.scripts.autobuildsetting.autobuild) {
                    if (!e.buffer || (e.buffer && e.gs !== gs)) {
                        e.buffer = game.network.codec.encode(9, { name: "MakeBuilding", type: e.type, x: e.x + gs.x, y: e.y + gs.y, yaw: e.yaw | 0 })
                        e.gs = gs;
                    }
                    let index = getEntitiesInGrid(e.x + gs.x, e.y + gs.y);
                    let building = activeBuildingsByPos.get(index);
                    if (!building || building.dead) {
                        rebuilder.push(e);
                    }
                }
                if (window.scripts.autobuildsetting.autodeleteinvalidtypetowers) {
                    let index = getEntitiesInGrid(e.x + gs.x, e.y + gs.y);
                    let building = activeBuildingsByPos.get(index);
                    if (building) {
                        if (building.type !== e.type && building.type !== "Harvester") {
                            reDITT.push(building);
                        }
                    }
                }
            })
        }
        if (window.scripts.autobuildsetting.autodeletenonfromautobuildedtowers) {
            activeBuildingsByPos.forEach(e => {
                if (!sirrMXB[getEntitiesInGrid((e.x - gs.x) + 864, (e.y - gs.y) + 864)] && e.type !== "Harvester") {
                    reDNFABT.push(e);
                }
            })
        }
        if (window.scripts.autobuildsetting.autoupgrade) {
            sirrMXBArr.forEach(e => {
                let index = getEntitiesInGrid(e.x + gs.x, e.y + gs.y);
                let building = activeBuildingsByPos.get(index);
                if (building && building.tier < e.tier) {
                    let uid = building.uid;
                    if (!e.upgradebuffer || (e.upgradebuffer && uid !== e.uid)) {
                        e.uid = uid;
                        e.upgradebuffer = game.network.codec.encode(9, { name: "UpgradeBuilding", uid: uid })
                    }
                    e.currentTier = building.tier;
                    reupgrader.push(e);
                }
            })
        }
    }
}
let _showRss = true;

let spamMessagesTicks = 0;
let upgradeTicks = 0;
let deleteTicks = 0;

let Upgradetick = 7;
// required

game.network.addEntityUpdateHandler((_e) => {
    let e = _e.entities;
    e.forEach(e1 => {
        if (e1.model == "GamePlayer" || e1.model == "Tree" || e1.model == "Stone" || e1.model == "PetCARL" || e1.model == "PetMiner") {
            if (entities.get(e1.uid) == undefined) entities.set(e1.uid, { uid: e1.uid, entityClass: e1.entityClass, model: e1.model, targetTick: e1 });
        }
        if (e1.model == "MeleeTower" || e1.model == "Harvester") {
            if (rotatableBuildings.get(e1.uid) == undefined) rotatableBuildings.set(e1.uid, { uid: e1.uid, partyId: e1.partyId, yaw: e1.yaw, x: e1.position.x, y: e1.position.y });
        }
        if (e1.model == "Door" || e1.model == "SlowTrap" || e1.model == "ArrowTower" || e1.model == "BombTower" || e1.model == "CannonTower" || e1.model == "MeleeTower" || e1.model == "MagicTower" || e1.model == "GoldMine" || e1.model == "Harvester" || e1.model == "GoldStash") {
            if (buildingsByhealth.get(e1.uid) == undefined) buildingsByhealth.set(e1.uid, { uid: e1.uid, partyId: e1.partyId, x: e1.position.x, y: e1.position.y, health: e1.health, maxHealth: e1.maxHealth, tier: e1.tier });
        }
        if (e1.model == "GoldStash") {
            window.lines && window.lines.length && lines.forEach(e => e.destroy());
            window.lines && (window.lines.length = 0);
            if (window.makeBoarder) {
                window.gr && window.gr.destroy();
                window.gr = new PIXI.Graphics();
                window.gr.fill(0xffffff);
                window.gr.circle(e1.position.x, e1.position.y, 1302);
                window.gr.endFill();
                window.gr.alpha = 0.1;
                window.ad = e1.position;
                game.world.renderer.entities.node.addChild(window.gr)
                window.makeBoarder(e1.position.x - 864, e1.position.y - 864, (864 * 2), 3, 1, "red");
                window.makeBoarder(e1.position.x - 864, e1.position.y + 864, (864 * 2), 3, 1, "red");
                window.makeBoarder(e1.position.x + 864, e1.position.y - 864, 3, (864 * 2), 1, "red");
                window.makeBoarder(e1.position.x - 864, e1.position.y - 864, 3, (864 * 2), 1, "red");

                window.makeBoarder(e1.position.x - 1680, e1.position.y - 1680, (1680 * 2), 3, 1, "yellow");
                window.makeBoarder(e1.position.x - 1680, e1.position.y + 1680, (1680 * 2), 3, 1, "yellow");
                window.makeBoarder(e1.position.x + 1680, e1.position.y - 1680, 3, (1680 * 2), 1, "yellow");
                window.makeBoarder(e1.position.x - 1680, e1.position.y - 1680, 3, (1680 * 2), 1, "yellow");

                window.makeBoarder(e1.position.x - 2544, e1.position.y - 2544, (2544 * 2), 3, 1, "green");
                window.makeBoarder(e1.position.x - 2544, e1.position.y + 2544, (2544 * 2), 3, 1, "green");
                window.makeBoarder(e1.position.x + 2544, e1.position.y - 2544, 3, (2544 * 2), 1, "green");
                window.makeBoarder(e1.position.x - 2544, e1.position.y - 2544, 3, (2544 * 2), 1, "green");

                window.makeBoarder(e1.position.x - 5040, e1.position.y - 5040, (5040 * 2), 3, 1, "blue");
                window.makeBoarder(e1.position.x - 5040, e1.position.y + 5040, (5040 * 2), 3, 1, "blue");
                window.makeBoarder(e1.position.x + 5040, e1.position.y - 5040, 3, (5040 * 2), 1, "blue");
                window.makeBoarder(e1.position.x - 5040, e1.position.y - 5040, 3, (5040 * 2), 1, "blue");
            }
        }
        let e2 = entities.get(e1.uid);
        if (e2) {
            addMissingTickFields(e2.targetTick, e1);
        }
        let bbh = buildingsByhealth.get(e1.uid);
        if (bbh) {
            if (e1.health) {
                bbh.health = e1.health;
            }
            if (e1.maxHealth) {
                bbh.maxHealth = e1.maxHealth;
            }
            if (e1.tier) {
                bbh.tier = e1.tier;
            }
        }
    })
    let targets = [];
    let trees = [];
    let stones = [];
    const myPos = myPlayer.position;
    entities.forEach(e2 => {
        let t = e2.targetTick;
        if (t.model == "GamePlayer" && t.uid !== myPlayer.uid && !socketsByUid[t.uid] && t.partyId !== myPlayer.partyId && !t.dead) {
            targets.push(t);
        }
        if (t.model == "Tree") {
            trees.push(t);
        }
        if (t.model == "Stone") {
            stones.push(t);
        }
        if (!e.get(t.uid)) {
            entities.delete(t.uid);
        }
    })
    rotatableBuildings.forEach(t => {
        if (t.partyId == myPlayer.partyId) {
            let index = getEntitiesInGrid(t.x, t.y);
            let building = activeBuildingsByPos.get(index);
            if (building && building.yaw !== t.yaw) {
                building.yaw = t.yaw;
            }
        }
        if (!e.get(t.uid)) {
            rotatableBuildings.delete(t.uid);
        }
    })
    if (gs && window.scripts.autobuildsetting.upgradeTowerHealth) {
        let t = buildingsByhealth.get(gs.uid);
        if (t) {
            if ((t.health / t.maxHealth) * 100 < 20) {
                let x = (myPlayer.position.x - t.x) ** 2;
                let y = (myPlayer.position.y - t.y) ** 2;
                let r2 = 768 ** 2;
                if (x + y <= r2) {
                    if (!t.startedTick) {
                        t.startedTick = 1;
                        sendPacket(9, { name: "UpgradeBuilding", uid: t.uid });
                    }
                }
            }
        }
    }
    buildingsByhealth.forEach(t => {
        if (gs && window.scripts.autobuildsetting.upgradeTowerHealth && t.tier < (gs.tier < window.scripts.autobuildsetting.upgradeTowerHealthTierMax ? gs.tier : window.scripts.autobuildsetting.upgradeTowerHealthTierMax) && t.tier >= window.scripts.autobuildsetting.upgradeTowerHealthTierMin && t.partyId == myPlayer.partyId && (t.health / t.maxHealth) * 100 < window.scripts.autobuildsetting.upgradeTowerHealAt) {
            let x = (myPlayer.position.x - t.x) ** 2;
            let y = (myPlayer.position.y - t.y) ** 2;
            let r2 = 768 ** 2;
            if (x + y <= r2) {
                if (!t.startedTick) {
                    t.startedTick = 1;
                    sendPacket(9, { name: "UpgradeBuilding", uid: t.uid });
                }
            }
        }
        if (t.startedTick) {
            t.startedTick = (t.startedTick + 1) % 10;
        }
        if (!e.get(t.uid)) {
            buildingsByhealth.delete(t.uid);
        }
    })
    let player = entities.get(myPlayer.uid);
    let _player = e.get(myPlayer.uid);
    if (player && _player && _player.uid) {
        myPlayer = player.targetTick;
        if (!window.scripts.socketFreezeMouse) {
            mouse = screenToWorld(myMouse.x, myMouse.y);
        }
        window.myPlayer = myPlayer;

        if ((myPlayer.health / myPlayer.maxHealth) * 100 < window.scripts.autoheal.healSet && (myPlayer.health / myPlayer.maxHealth) * 100 > 0) {
            if (window.scripts.autoheal.enabled && !window.scripts.xkey) {
                if (!window.healPlayer) {
                    sendPacket(9, { name: "BuyItem", itemName: "HealthPotion", tier: 1 })
                    sendPacket(9, { name: "EquipItem", itemName: "HealthPotion", tier: 1 })
                    sendPacket(9, { name: "BuyItem", itemName: "HealthPotion", tier: 1 })
                    window.healPlayer = true;
                    setTimeout(() => {
                        window.healPlayer = false;
                    }, 1000);
                }
            }
        }
    }
    if (myPlayer.petUid) {
        window.activated = true;
        if (_player && _player.uid) {
            let pet = entities.get(myPlayer.petUid);
            if (pet) {
                myPet = pet.targetTick;
                window.myPet = myPet;
                if (myPet) {
                    if (window.scripts.autopetheal.enabled && !window.scripts.xkey) {
                        if ((myPet.health / myPet.maxHealth) * 100 < window.scripts.autopetheal.healSet && (myPet.health / myPet.maxHealth) * 100 > 0) {
                            if (!window.healPet) {
                                sendPacket(9, { name: "BuyItem", itemName: "PetHealthPotion", tier: 1 })
                                sendPacket(9, { name: "EquipItem", itemName: "PetHealthPotion", tier: 1 })
                                window.healPet = true;
                                setTimeout(() => {
                                    window.healPet = false;
                                }, 500);
                            }
                        }
                    }
                    if (window.scripts.autoEvolvePets && evolvePetTiersAndExp[`${myPet.tier}, ${detectPetLevelIfHigherReturnItsRequiredLevel(myPet.tier, Math.floor(myPet.experience / 100) + 1)}, ${detectPetTokenIfHigherReturnItsRequiredLevel(myPet.tier, myPlayer.token)}`]) {
                        if (!window.EvolveOnceEverySecond) {
                            sendPacket(9, { name: "BuyItem", itemName: myPet.model, tier: myPet.tier + 1 });
                            window.EvolveOnceEverySecond = true;
                            setTimeout(() => {
                                window.EvolveOnceEverySecond = false;
                            }, 1000)
                        }
                    }
                    if (scripts.model !== myPet.model) scripts.model = myPet.model;
                    if (scripts.tier !== myPet.tier) scripts.tier = myPet.tier;
                }
            }
        }
    }
    if (window.scripts.autoRevivePets && window.activated) {
        sendPacket(9, { name: "BuyItem", itemName: "PetRevive", tier: 1 });
        sendPacket(9, { name: "EquipItem", itemName: "PetRevive", tier: 1 });
    }
    if (myPos) {
        target = targets.sort((a, b) => measureDistance(myPos, a.position) - measureDistance(myPos, b.position))[0];
        tree = trees.sort((a, b) => measureDistance(myPos, a.position) - measureDistance(myPos, b.position))[0];
        stone = stones.sort((a, b) => measureDistance(myPos, a.position) - measureDistance(myPos, b.position))[0];
    }
    let sockets2 = [];
    for (let i in sockets) {
        (sockets[i].mouseDownHit || sockets[i].myPlayer.dead) ? null : sockets2.push(sockets[i]);
    }
    nearestAltMouse = sockets2.sort((a, b) => {
        return measureDistance(mouse, a.myPlayer.position) - measureDistance(mouse, b.myPlayer.position);
    })[0];
    if (window.scripts.playerFollower) {
        mover(e, "name", window.scripts.playerFollowerByUid);
    }
    if (gs) {
        if (stashhitalarm) {
            let stash = e.get(gs.uid);
            if (stash) {
                if (stash.health !== stash.maxHealth) {
                    !onlyOpenOnceOnTimeout && (onlyOpenOnceOnTimeout = true, videoalert(), setTimeout(() => { onlyOpenOnceOnTimeout = false }, 24000))
                }
            }
        }
    }
    if (health65palarm) {
        if (_player && _player.health && (_player.health / 500) * 100 < 65) {
            !onlyOpenOnceOnTimeout && (onlyOpenOnceOnTimeout = true, videoalert(), setTimeout(() => { onlyOpenOnceOnTimeout = false }, 24000));
        }
    }
    if (health80ptoweralarm) {
        entities.forEach(e2 => {
            if (e2) {
                let t = e2.targetTick;
                if (game.ui.playerTick && t.partyId == game.ui.playerTick.partyId) {
                    if (t.model == "Harvester" || t.model == "ArrowTower" || t.model == "CannonTower" || t.model == "MagicTower" || t.model == "BombTower" || t.model == "MeleeTower") {
                        if ((t.health / t.maxHealth) * 100 < 80) {
                            !onlyOpenOnceOnTimeout && (onlyOpenOnceOnTimeout = true, videoalert(), setTimeout(() => { onlyOpenOnceOnTimeout = false }, 30000))
                        }
                    }
                }
            }
        })
    }
    //let n = "Pussy Ultra Dick Slayer Mega Super Slut 123 Cesur!";
    //n = "KFC SLAYERS KILLED SUFFERING KIRBY SIMPS OF KENTUCKY SLAVES OF KASAP SCAREDNESS OF KURT SUCKERS";

    if (messagespam) {
        spamMessagesTicks = (spamMessagesTicks + 1) % 5;
        if (spamMessagesTicks == 0) {
            let encoded = game.network.codec.encode(9, { name: "SendChatMessage", channel: "Local", message: lyrics[thislyric] });
            game.network.socket.send(encoded);
            Object.values(sockets).forEach(e => {
                e.ws.send(encoded);
            });
        }
    }
    if (window.scripts.autohi) {
        e.forEach(e1 => {
            if (e1.name) {
                window.sendmsg("hi " + e1.name);
            }
        })
    }
    if (window.scripts.xkey) {
        document.getElementsByClassName("hud-respawn-btn")[0].click();
        if (!inventory.Bomb) {
            sendPacket(9, { name: "BuyItem", itemName: "Bomb", tier: 1 })
            sendPacket(9, { name: "EquipItem", itemName: "Bomb", tier: 1 })
        }
        if (inventory.Bomb && window.thisWeapon !== "Bomb") {
            window.thisWeapon = "Bomb";
            sendPacket(9, { name: "EquipItem", itemName: "Bomb", tier: inventory.Bomb.tier })
        }
        if (window.scripts.autoShield && !inventory.ZombieShield) {
            sendPacket(9, { name: "BuyItem", itemName: "ZombieShield", tier: 1 })
        }
        Object.values(sockets).forEach(e => {
            if (!e.inventory.Bomb) {
                e.sendPacket(9, { name: "BuyItem", itemName: "Bomb", tier: 1 })
                e.sendPacket(9, { name: "EquipItem", itemName: "Bomb", tier: 1 })
            }
            if (e.inventory.Bomb && e.thisWeapon !== "Bomb") {
                e.thisWeapon = "Bomb";
                e.sendPacket(9, { name: "EquipItem", itemName: "Bomb", tier: e.inventory.Bomb.tier })
            }
            if (window.scripts.autoShield && !e.inventory.ZombieShield) {
                e.sendPacket(9, { name: "BuyItem", itemName: "ZombieShield", tier: 1 })
            }
        })
    }

    let scorestats = scoreStats();
    document.getElementsByClassName(`spw${lastid}`)[0] && (document.getElementsByClassName(`spw${lastid}`)[0].innerHTML = `${scorestats.id}, wave: ${scorestats.wave}, score: ${scorestats.score}, spw: ${scorestats.spw}, hspw: ${scorestats.hspw}, wavelength: ${scorestats.ticker}`);

    if (window.scripts.showplayersinfo) {
        !_showRss && (_showRss = true);
    }
    if (window.scripts.showplayersinfo || _showRss) {
        entities.forEach(e2 => {
            let t = e2.targetTick;
            if (t.name && game.world.entities.get(t.uid)) {
                let player = game.world.entities.get(t.uid).targetTick;
                if (player) {
                    let wood_1 = counter(player.wood);
                    let stone_1 = counter(player.stone);
                    let gold_1 = counter(player.gold);
                    let token_1 = counter(player.token);
                    let px_1 = counter(player.position.x);
                    let py_1 = counter(player.position.y);
                    if (window.scripts.showplayersinfo && !player.oldName) {
                        player.oldName = player.name;
                        player.oldWood = wood_1;
                        player.oldStone = stone_1;
                        player.oldGold = gold_1;
                        player.oldToken = token_1;
                        player.oldPX = px_1;
                        player.oldPY = py_1;
                        player.info = `${player.oldName}, W: ${wood_1}, S: ${stone_1}, G: ${gold_1}, T: ${token_1};\nx: ${Math.round(player.position.x)}, y: ${Math.round(player.position.y)}, partyId: ${player.partyId}` + (socketsByUid[player.uid] ? `, id: ${socketsByUid[player.uid].id};` : `;`);
                        player.name = player.info;
                    }
                    if (!window.scripts.showplayersinfo && player.oldName) {
                        player.info = player.oldName;
                        player.name = socketsByUid[player.uid] ? "" + socketsByUid[player.uid].id : player.info;
                        player.oldName = null;
                    }
                    if (window.scripts.showplayersinfo) {
                        if (player.oldGold !== gold_1 || player.oldWood !== wood_1 || player.oldStone !== stone_1 || player.oldToken !== token_1 || player.oldPX !== px_1 || player.oldPY !== py_1) {
                            player.oldWood = wood_1;
                            player.oldStone = stone_1;
                            player.oldGold = gold_1;
                            player.oldToken = token_1;
                            player.oldPX = px_1;
                            player.oldPY = py_1;
                            player.info = `${player.oldName}, W: ${wood_1}, S: ${stone_1}, G: ${gold_1}, T: ${token_1};\nx: ${Math.round(player.position.x)}, y: ${Math.round(player.position.y)}, partyId: ${player.partyId}` + (socketsByUid[player.uid] ? `, id: ${socketsByUid[player.uid].id};` : `;`);
                            player.name = player.info;
                        }
                    }
                }
            }
        })
    }
    if (!window.scripts.showplayersinfo) {
        _showRss = false;
    }
    if (game.network.socket && game.network.socket.readyState == 1 && gs) {
        if (window.scripts.autobuildsetting.autobuild) {
            rebuilder.forEach(e => {
                if (Math.abs(myPlayer.position.y - (e.y + gs.y)) < 576 && Math.abs(myPlayer.position.x - (e.x + gs.x)) < 576) {
                    game.network.socket.send(e.buffer);
                }
            })
        }
        if (window.scripts.autobuildsetting.autodeleteinvalidtypetowers) {
            reDITT[0] && sendPacket(9, { name: "DeleteBuilding", uid: reDITT[0].uid });
        }
        if (window.scripts.autobuildsetting.autodeletenonfromautobuildedtowers) {
            reDNFABT[0] && sendPacket(9, { name: "DeleteBuilding", uid: reDNFABT[0].uid });
        }
        upgradeTicks = (upgradeTicks + 1) % Upgradetick;
        if (upgradeTicks == 0) {
            if (window.scripts.autoupgrade) {
                activeBuildingsByPos.forEach(e => {
                    if (e.tier < gs.tier) {
                        let x = (myPlayer.position.x - e.x) ** 2;
                        let y = (myPlayer.position.y - e.y) ** 2;
                        let r2 = 768 ** 2;
                        if (x + y <= r2) {
                            sendPacket(9, { name: "UpgradeBuilding", uid: e.uid });
                        }
                    }
                })
            }
            if (window.scripts.autobuildsetting.autoupgrade) {
                reupgrader.forEach(e => {
                    if (e.currentTier < e.tier) {
                        let x = (myPlayer.position.x - (e.x + gs.x)) ** 2;
                        let y = (myPlayer.position.y - (e.y + gs.y)) ** 2;
                        let r2 = 768 ** 2;
                        if (x + y <= r2) {
                            game.network.socket.send(e.upgradebuffer);
                        }
                    }
                })
            }
        }
    }
    window.scripts.autoheal.autobuypotion && !window.scripts.xkey && sendPacket(9, { name: "BuyItem", itemName: "HealthPotion", tier: 1 });
    window.scripts.autopetheal.autobuypotion && sendPacket(9, { name: "BuyItem", itemName: "PetHealthPotion", tier: 1 });
    ahrc_1 && ticks.forEach(tick => {
        tick.tick++;
        if (tick.tick >= tick.resetTick) {
            tick.tick = 0;
            ahrc_turn_id == "main" ? depositAhrc(tick) : sockets[ahrc_turn_id] && sockets[ahrc_turn_id].depositAhrc(tick);
        }
        if (tick.tick == 1) {
            ahrc_turn_id == "main" ? collectAhrc(tick) : sockets[ahrc_turn_id] && sockets[ahrc_turn_id].collectAhrc(tick);
        }
    });
    if (window.scripts.autobow) {
        if (thisWeapon == "Bow") {
            sendPacket(3, { space: 0 });
            sendPacket(3, { space: 1 });
        } else {
            sendPacket(3, { mouseDown: game.inputPacketCreator.lastAnyYaw });
        }
        Object.values(sockets).forEach(e => {
            if (e.thisWeapon == "Bow") {
                e.sendPacket(3, { space: 0 });
                e.sendPacket(3, { space: 1 });
            } else {
                e.sendPacket(3, { mouseDown: e.aimingYaw });
            }
        })
    }
    if (spinning) {
        SpinToggle = !SpinToggle;
        thisAim = SpinToggle ? (179 + game.inputPacketCreator.lastAnyYaw) % 360 : (359 + game.inputPacketCreator.lastAnyYaw) % 360;
        game.network.sendPacket(3, { mouseMoved: thisAim });
        Object.keys(sockets).forEach(i => {
            sockets[i].sendPacket(3, { mouseMoved: SpinToggle ? (179 + sockets[i].aimingYaw) % 360 : (359 + sockets[i].aimingYaw) % 360 })
        })
    }
    if (spinifdisabled) {
        aimm = (aimm + 1) % 360;
        Object.keys(sockets).forEach(i => {
            if (sockets[i].sendPacket == "() => {}") {
                sockets[i].sendPacket2(3, { mouseMoved: aimm })
            }
        })
    }
    if (autotier1spear || autotier2spear || autotier4spear) {
        let price = 500;
        let tier = 2;
        if (autotier2spear) {
            price = 500;
            tier = 2;
        }
        if (autotier1spear) {
            price = 100;
            tier = 1;
        }
        if (autotier4spear) {
            price = 45000;
            tier = 6;
        }
        Object.keys(sockets).forEach(i => {
            if (!sockets[i].mouseDownHit && sockets[i].myPlayer.gold < price && !sockets[i].inventory.Spear || (sockets[i].myPlayer.gold < price && sockets[i].inventory.Spear.tier < tier)) {
                sockets[i].join(game.ui.playerPartyShareKey)
            } else {
                game.network.sendRpc({ name: "KickParty", uid: sockets[i].uid });
                sockets[i].leave();
            }
        })
    }
    !gs && window.scripts.respawnWhenDeadWithoutBase && sendPacket(3, { respawn: 1 });
    if (window.scripts.autoaim) {
        target && sendPacket(3, { mouseMoved: angleTo(myPlayer.position.x, myPlayer.position.y, target.position.x, target.position.y) })
    }
})

const counter = (e = 0) => {
    return e <= 999.5 ? Math.round(e) + "" : e <= 999500 ? Math.round(e / 1e2) / 10 + "K" : e <= 999500000 ? Math.round(e / 1e5) / 10 + "M" : e <= 999500000000 ? Math.round(e / 1e8) / 10 + "B" : e <= 999500000000000 ? Math.round(e / 1e11) / 10 + "T" : "Many";
}
window.SellTower = function (tower, tier) {
    activeBuildingsByPos.forEach(obj => {
        if (obj.type == tower) {
            if (!tier) {
                sendPacket(9, { name: "DeleteBuilding", uid: obj.uid })
            } else {
                if (obj.tier == tier) {
                    sendPacket(9, { name: "DeleteBuilding", uid: obj.uid })
                }
            }
        }
    })
}

window.SellAll = () => {
    Game.currentGame.ui.getComponent("PopupOverlay").showConfirmation("Are you sure you want to Sell All?", 1e4, function () {
        Game.currentGame.ui.getComponent("PopupOverlay").showConfirmation("Are you very sure? For safty.", 1e4, function () {
            game.ui.components.PopupOverlay.showHint("Successfully Sold All!");
            activeBuildingsByPos.forEach(obj => {
                sendPacket(9, { name: "DeleteBuilding", uid: obj.uid })
            })
        })
    })
}
window.SellPets = () => {
    for (let i in game.ui.playerPartyMembers) {
        sendPacket(9, { name: "DeleteBuilding", uid: game.world.entities.get(game.ui.playerPartyMembers[i].playerUid).fromTick.petUid });
    }
}

window.SellMyPet = () => {
    sendPacket(9, { name: "DeleteBuilding", uid: myPlayer.petUid });
}

window.upgradealltgl = () => {
    window.scripts.autoupgrade = !window.scripts.autoupgrade;
    window.setElementToggleTo(window.scripts.autoupgrade, "4i");
}

window.ahrctgl = () => {
    window.scripts.ahrc.toggle();
    window.setElementToggleTo(window.scripts.ahrc.enabled(), "5i");
}

window.enableahrc = () => {
    window.scripts.ahrc.toTrue();
    window.setElementToggleTo(window.scripts.ahrc.enabled(), "5i");
}

window.disableahrc = () => {
    window.scripts.ahrc.toFalse();
    window.setElementToggleTo(window.scripts.ahrc.enabled(), "5i");
}

window.aitotgl = () => {
    window.scripts.aito.toggle();
    window.setElementToggleTo(window.scripts.aito.enabled(), "aito");
}

window.enableaito = () => {
    window.scripts.aito.toTrue();
    window.setElementToggleTo(window.scripts.aito.enabled(), "aito");
}

window.disableaito = () => {
    window.scripts.aito.toFalse();
    window.setElementToggleTo(window.scripts.aito.enabled(), "aito");
}

window.autobowtgl = () => {
    window.scripts.autobow = !window.scripts.autobow;
    window.setElementToggleTo(window.scripts.autobow, "6i");
}

window.autocleartgl = () => {
    window.scripts.autoclearmessages = !window.scripts.autoclearmessages;
    window.setElementToggleTo(window.scripts.autoclearmessages, "7i");
}

window.join9i = () => {
    window.joinpsk(document.getElementsByClassName("8i")[0].value);
}

window.join11i = () => {
    window.joinpsk(document.getElementsByClassName("10i")[0].value);
}
let akpsk = "";
window.join13i = () => {
    akpsk = document.getElementsByClassName("12i")[0].value;
    window.scripts.antikick = !window.scripts.antikick;
    window.setElementToggleTo(window.scripts.antikick, "13i");
    window.joinpsk(akpsk);
}

window.getgetrss = () => {
    window.scripts.showplayersinfo = !window.scripts.showplayersinfo;
    window.setElementToggleTo(window.scripts.showplayersinfo, "15i");
}

window.autohi = () => {
    window.scripts.autohi = !window.scripts.autohi;
    window.setElementToggleTo(window.scripts.autohi, "16i");
}

window.autoheal = (healset) => {
    healset && (document.getElementsByClassName("17i")[0].value = healset + "");
    window.scripts.autoheal.healSet = document.getElementsByClassName("17i")[0].value - "";
    window.scripts.autoheal.enabled = !window.scripts.autoheal.enabled;
    window.setElementToggleTo(window.scripts.autoheal.enabled, "18i");
}
window.enableautoheal = (healset) => {
    healset && (document.getElementsByClassName("17i")[0].value = healset + "");
    window.scripts.autoheal.healSet = document.getElementsByClassName("17i")[0].value - "";
    window.scripts.autoheal.enabled = true;
    window.setElementToggleTo(window.scripts.autoheal.enabled, "18i");
}
window.disableautoheal = (healset) => {
    healset && (document.getElementsByClassName("17i")[0].value = healset + "");
    window.scripts.autoheal.healSet = document.getElementsByClassName("17i")[0].value - "";
    window.scripts.autoheal.enabled = false;
    window.setElementToggleTo(window.scripts.autoheal.enabled, "18i");
}
window.autopetheal = (healset) => {
    healset && (document.getElementsByClassName("19i")[0].value = healset + "");
    window.scripts.autopetheal.healSet = document.getElementsByClassName("19i")[0].value - "";
    window.scripts.autopetheal.enabled = !window.scripts.autopetheal.enabled;
    window.setElementToggleTo(window.scripts.autopetheal.enabled, "20i");
}
window.enableautopetheal = (healset) => {
    healset && (document.getElementsByClassName("19i")[0].value = healset + "");
    window.scripts.autopetheal.healSet = document.getElementsByClassName("19i")[0].value - "";
    window.scripts.autopetheal.enabled = true;
    window.setElementToggleTo(window.scripts.autopetheal.enabled, "20i");
}
window.disableautopetheal = (healset) => {
    healset && (document.getElementsByClassName("19i")[0].value = healset + "");
    window.scripts.autopetheal.healSet = document.getElementsByClassName("19i")[0].value - "";
    window.scripts.autopetheal.enabled = false;
    window.setElementToggleTo(window.scripts.autopetheal.enabled, "20i");
}
window.autorevivepets = () => {
    window.scripts.autoRevivePets = !window.scripts.autoRevivePets;
    window.setElementToggleTo(window.scripts.autoRevivePets, "21i");
}
window.autoevolvepets = () => {
    window.scripts.autoEvolvePets = !window.scripts.autoEvolvePets;
    window.setElementToggleTo(window.scripts.autoEvolvePets, "22i");
}
window.autopotion = () => {
    window.scripts.autoheal.autobuypotion = !window.scripts.autoheal.autobuypotion;
    window.setElementToggleTo(window.scripts.autoheal.autobuypotion, "autopotion");
}
window.w3x3w = () => {
    window.scripts.w3x3walls.w3x3 = 1;
    document.getElementsByClassName("23i")[0].innerText = `${window.scripts.w3x3walls.enabled ? "Disable" : "Enable"} ${window.scripts.w3x3walls.w3x3 == 1 ? "3x3" : window.scripts.w3x3walls.w3x3 == 2 ? "5x5" : window.scripts.w3x3walls.w3x3 == 3 ? "7x7" : window.scripts.w3x3walls.w3x3 == 4 ? "9x9" : "1x1"} Walls`;
}
window.w5x5w = () => {
    window.scripts.w3x3walls.w3x3 = 2;
    document.getElementsByClassName("23i")[0].innerText = `${window.scripts.w3x3walls.enabled ? "Disable" : "Enable"} ${window.scripts.w3x3walls.w3x3 == 1 ? "3x3" : window.scripts.w3x3walls.w3x3 == 2 ? "5x5" : window.scripts.w3x3walls.w3x3 == 3 ? "7x7" : window.scripts.w3x3walls.w3x3 == 4 ? "9x9" : "1x1"} Walls`;
}
window.w7x7w = () => {
    window.scripts.w3x3walls.w3x3 = 3;
    document.getElementsByClassName("23i")[0].innerText = `${window.scripts.w3x3walls.enabled ? "Disable" : "Enable"} ${window.scripts.w3x3walls.w3x3 == 1 ? "3x3" : window.scripts.w3x3walls.w3x3 == 2 ? "5x5" : window.scripts.w3x3walls.w3x3 == 3 ? "7x7" : window.scripts.w3x3walls.w3x3 == 4 ? "9x9" : "1x1"} Walls`;
}
window.w9x9w = () => {
    window.scripts.w3x3walls.w3x3 = 4;
    document.getElementsByClassName("23i")[0].innerText = `${window.scripts.w3x3walls.enabled ? "Disable" : "Enable"} ${window.scripts.w3x3walls.w3x3 == 1 ? "3x3" : window.scripts.w3x3walls.w3x3 == 2 ? "5x5" : window.scripts.w3x3walls.w3x3 == 3 ? "7x7" : window.scripts.w3x3walls.w3x3 == 4 ? "9x9" : "1x1"} Walls`;
}
window.ew3x3w = () => {
    window.scripts.w3x3walls.enabled = !window.scripts.w3x3walls.enabled;
    document.getElementsByClassName("23i")[0].innerText = `${window.scripts.w3x3walls.enabled ? "Disable" : "Enable"} ${window.scripts.w3x3walls.w3x3 == 1 ? "3x3" : window.scripts.w3x3walls.w3x3 == 2 ? "5x5" : window.scripts.w3x3walls.w3x3 == 3 ? "7x7" : window.scripts.w3x3walls.w3x3 == 4 ? "9x9" : "1x1"} Walls`;
    window.setElementToggleTo(window.scripts.w3x3walls.enabled, "23i");
}
window.enablew3x3w = () => {
    window.scripts.w3x3walls.enabled = true;
    document.getElementsByClassName("23i")[0].innerText = `${window.scripts.w3x3walls.enabled ? "Disable" : "Enable"} ${window.scripts.w3x3walls.w3x3 == 1 ? "3x3" : window.scripts.w3x3walls.w3x3 == 2 ? "5x5" : window.scripts.w3x3walls.w3x3 == 3 ? "7x7" : window.scripts.w3x3walls.w3x3 == 4 ? "9x9" : "1x1"} Walls`;
    window.setElementToggleTo(window.scripts.w3x3walls.enabled, "23i");
}
window.disablew3x3w = () => {
    window.scripts.w3x3walls.enabled = false;
    document.getElementsByClassName("23i")[0].innerText = `${window.scripts.w3x3walls.enabled ? "Disable" : "Enable"} ${window.scripts.w3x3walls.w3x3 == 1 ? "3x3" : window.scripts.w3x3walls.w3x3 == 2 ? "5x5" : window.scripts.w3x3walls.w3x3 == 3 ? "7x7" : window.scripts.w3x3walls.w3x3 == 4 ? "9x9" : "1x1"} Walls`;
    window.setElementToggleTo(window.scripts.w3x3walls.enabled, "23i");
}
window.w3x3d = () => {
    window.scripts.w3x3doors.w3x3 = 1;
    document.getElementsByClassName("24i")[0].innerText = `${window.scripts.w3x3doors.enabled ? "Disable" : "Enable"} ${window.scripts.w3x3doors.w3x3 == 1 ? "3x3" : window.scripts.w3x3doors.w3x3 == 2 ? "5x5" : window.scripts.w3x3doors.w3x3 == 3 ? "7x7" : window.scripts.w3x3doors.w3x3 == 4 ? "9x9" : "1x1"} Doors`;
}
window.w5x5d = () => {
    window.scripts.w3x3doors.w3x3 = 2;
    document.getElementsByClassName("24i")[0].innerText = `${window.scripts.w3x3doors.enabled ? "Disable" : "Enable"} ${window.scripts.w3x3doors.w3x3 == 1 ? "3x3" : window.scripts.w3x3doors.w3x3 == 2 ? "5x5" : window.scripts.w3x3doors.w3x3 == 3 ? "7x7" : window.scripts.w3x3doors.w3x3 == 4 ? "9x9" : "1x1"} Doors`;
}
window.w7x7d = () => {
    window.scripts.w3x3doors.w3x3 = 3;
    document.getElementsByClassName("24i")[0].innerText = `${window.scripts.w3x3doors.enabled ? "Disable" : "Enable"} ${window.scripts.w3x3doors.w3x3 == 1 ? "3x3" : window.scripts.w3x3doors.w3x3 == 2 ? "5x5" : window.scripts.w3x3doors.w3x3 == 3 ? "7x7" : window.scripts.w3x3doors.w3x3 == 4 ? "9x9" : "1x1"} Doors`;
}
window.w9x9d = () => {
    window.scripts.w3x3doors.w3x3 = 4;
    document.getElementsByClassName("24i")[0].innerText = `${window.scripts.w3x3doors.enabled ? "Disable" : "Enable"} ${window.scripts.w3x3doors.w3x3 == 1 ? "3x3" : window.scripts.w3x3doors.w3x3 == 2 ? "5x5" : window.scripts.w3x3doors.w3x3 == 3 ? "7x7" : window.scripts.w3x3doors.w3x3 == 4 ? "9x9" : "1x1"} Doors`;
}
window.ew3x3d = () => {
    window.scripts.w3x3doors.enabled = !window.scripts.w3x3doors.enabled;
    document.getElementsByClassName("24i")[0].innerText = `${window.scripts.w3x3doors.enabled ? "Disable" : "Enable"} ${window.scripts.w3x3doors.w3x3 == 1 ? "3x3" : window.scripts.w3x3doors.w3x3 == 2 ? "5x5" : window.scripts.w3x3doors.w3x3 == 3 ? "7x7" : window.scripts.w3x3doors.w3x3 == 4 ? "9x9" : "1x1"} Doors`;
    window.setElementToggleTo(window.scripts.w3x3doors.enabled, "24i");
}

window.w3x3t = () => {
    window.scripts.w3x3traps.w3x3 = 1;
    document.getElementsByClassName("25i")[0].innerText = `${window.scripts.w3x3traps.enabled ? "Disable" : "Enable"} ${window.scripts.w3x3traps.w3x3 == 1 ? "3x3" : window.scripts.w3x3traps.w3x3 == 2 ? "5x5" : window.scripts.w3x3traps.w3x3 == 3 ? "7x7" : window.scripts.w3x3traps.w3x3 == 4 ? "9x9" : "1x1"} Traps`;
}
window.w5x5t = () => {
    window.scripts.w3x3traps.w3x3 = 2;
    document.getElementsByClassName("25i")[0].innerText = `${window.scripts.w3x3traps.enabled ? "Disable" : "Enable"} ${window.scripts.w3x3traps.w3x3 == 1 ? "3x3" : window.scripts.w3x3traps.w3x3 == 2 ? "5x5" : window.scripts.w3x3traps.w3x3 == 3 ? "7x7" : window.scripts.w3x3traps.w3x3 == 4 ? "9x9" : "1x1"} Traps`;
}
window.w7x7t = () => {
    window.scripts.w3x3traps.w3x3 = 3;
    document.getElementsByClassName("25i")[0].innerText = `${window.scripts.w3x3traps.enabled ? "Disable" : "Enable"} ${window.scripts.w3x3traps.w3x3 == 1 ? "3x3" : window.scripts.w3x3traps.w3x3 == 2 ? "5x5" : window.scripts.w3x3traps.w3x3 == 3 ? "7x7" : window.scripts.w3x3traps.w3x3 == 4 ? "9x9" : "1x1"} Traps`;
}
window.w9x9t = () => {
    window.scripts.w3x3traps.w3x3 = 4;
    document.getElementsByClassName("25i")[0].innerText = `${window.scripts.w3x3traps.enabled ? "Disable" : "Enable"} ${window.scripts.w3x3traps.w3x3 == 1 ? "3x3" : window.scripts.w3x3traps.w3x3 == 2 ? "5x5" : window.scripts.w3x3traps.w3x3 == 3 ? "7x7" : window.scripts.w3x3traps.w3x3 == 4 ? "9x9" : "1x1"} Traps`;
}
window.ew3x3t = () => {
    window.scripts.w3x3traps.enabled = !window.scripts.w3x3traps.enabled;
    document.getElementsByClassName("25i")[0].innerText = `${window.scripts.w3x3traps.enabled ? "Disable" : "Enable"} ${window.scripts.w3x3traps.w3x3 == 1 ? "3x3" : window.scripts.w3x3traps.w3x3 == 2 ? "5x5" : window.scripts.w3x3traps.w3x3 == 3 ? "7x7" : window.scripts.w3x3traps.w3x3 == 4 ? "9x9" : "1x1"} Traps`;
    window.setElementToggleTo(window.scripts.w3x3traps.enabled, "25i");
}
//break
window.recordbase = () => {
    Game.currentGame.ui.getComponent("PopupOverlay").showConfirmation("Are you sure you want to record base?", 1e4, function () {
        window.recordBase(document.getElementsByClassName("3i2")[0].value);
        window.targetRecordedBase(document.getElementsByClassName("3i2")[0].value);
    })
}
window.targetbase = () => {
    window.targetRecordedBase(document.getElementsByClassName("3i2")[0].value);
}
window.deletebase = () => {
    Game.currentGame.ui.getComponent("PopupOverlay").showConfirmation("Are you sure you want to delete recorded base?", 1e4, function () {
        window.deleteRecordedBase(document.getElementsByClassName("3i2")[0].value);
    })
}

window.autobuildtargetedbase = () => {
    window.scripts.autobuildsetting.autobuild = !window.scripts.autobuildsetting.autobuild;
    window.setElementToggleTo(window.scripts.autobuildsetting.autobuild, "5i2");
}

window.autoupgradetargetedbase = () => {
    window.scripts.autobuildsetting.autoupgrade = !window.scripts.autobuildsetting.autoupgrade;
    window.setElementToggleTo(window.scripts.autobuildsetting.autoupgrade, "6i2");
}

window.autodeletenonfromautobuildedtowerstargetedbase = () => {
    !window.scripts.autobuildsetting.autodeletenonfromautobuildedtowers && Game.currentGame.ui.getComponent("PopupOverlay").showConfirmation("Are you sure you want to enable auto delete towers non from autorebuilder towers? it'll delete everything except the autorebuilder towers. becareful", 1e4, function () {
        window.scripts.autobuildsetting.autodeletenonfromautobuildedtowers = !window.scripts.autobuildsetting.autodeletenonfromautobuildedtowers;
        window.setElementToggleTo(window.scripts.autobuildsetting.autodeletenonfromautobuildedtowers, "7i2");
    })
    if (window.scripts.autobuildsetting.autodeletenonfromautobuildedtowers) {
        window.scripts.autobuildsetting.autodeletenonfromautobuildedtowers = !window.scripts.autobuildsetting.autodeletenonfromautobuildedtowers;
        window.setElementToggleTo(window.scripts.autobuildsetting.autodeletenonfromautobuildedtowers, "7i2");
    }
}

window.autodeleteinvalidtypetowerstargetedbase = () => {
    !window.scripts.autobuildsetting.autodeleteinvalidtypetowers && Game.currentGame.ui.getComponent("PopupOverlay").showConfirmation("Are you sure you want to enable auto delete incorrect autorebuilder models? it'll delete incorrect tower types from the autorebuilder towers. becareful", 1e4, function () {
        window.scripts.autobuildsetting.autodeleteinvalidtypetowers = !window.scripts.autobuildsetting.autodeleteinvalidtypetowers;
        window.setElementToggleTo(window.scripts.autobuildsetting.autodeleteinvalidtypetowers, "8i2");
    });
    if (window.scripts.autobuildsetting.autodeleteinvalidtypetowers) {
        window.scripts.autobuildsetting.autodeleteinvalidtypetowers = !window.scripts.autobuildsetting.autodeleteinvalidtypetowers;
        window.setElementToggleTo(window.scripts.autobuildsetting.autodeleteinvalidtypetowers, "8i2");
    }
}

window.upgradeTowerHealthtargetedbase = () => {
    !window.scripts.autobuildsetting.upgradeTowerHealth && Game.currentGame.ui.getComponent("PopupOverlay").showConfirmation("Are you sure you want to enable Upgrade Tower Health? it'll upgrade towers at 35% health.", 1e4, function () {
        window.scripts.autobuildsetting.upgradeTowerHealth = !window.scripts.autobuildsetting.upgradeTowerHealth;
        window.setElementToggleTo(window.scripts.autobuildsetting.upgradeTowerHealth, "9i2");
        window.scripts.autobuildsetting.upgradeTowerHealAt = document.getElementsByClassName("UTHP")[0].value - "";
        window.scripts.autobuildsetting.upgradeTowerHealthTierMin = document.getElementsByClassName("UTHMIN")[0].value - "";
        window.scripts.autobuildsetting.upgradeTowerHealthTierMax = document.getElementsByClassName("UTHMAX")[0].value - "";
    });
    if (window.scripts.autobuildsetting.upgradeTowerHealth) {
        window.scripts.autobuildsetting.upgradeTowerHealth = !window.scripts.autobuildsetting.upgradeTowerHealth;
        window.setElementToggleTo(window.scripts.autobuildsetting.upgradeTowerHealth, "9i2");
    }
}
window.xkey = () => {
    window.scripts.xkey = !window.scripts.xkey;
    window.setElementToggleTo(window.scripts.xkey, "0i4");
}
window.autoaim = () => {
    window.scripts.autoaim = !window.scripts.autoaim;
    window.setElementToggleTo(window.scripts.autoaim, "1i4");
}

window.sendAitoAlt = () => {
    if (window.startaito) {
        let ws = new WebSocket(`wss://${game.options.servers[game.options.serverId].host}:443/`);
        ws.binaryType = "arraybuffer";
        ws.onclose = () => (ws.isclosed = true);
        ws.network = new game.networkType();
        ws.sendPacket = (e, t) => { if (!ws.isclosed) { ws.send(ws.network.codec.encode(e, t)); } };
        ws.onPreEnterWorld = (data) => {
            wasmmodule(new Uint8Array(data.extra), game.options.servers[game.options.serverId].hostname).then((e) => {
                if (new Uint8Array(e[5].extra)[0] == 0 && new Uint8Array(e[5].extra)[1] == 0 && new Uint8Array(e[5].extra)[2] == 0) {
                    window.sendAitoAlt();
                } else {
                    ws.sendPacket(4, { displayName: " ", extra: new Uint8Array(e[5].extra) });
                    ws.enterworld2 = new Uint8Array(e[6]);
                }
            });
        }
        ws.onEnterWorld = (data) => {
            if (data.uid) {
                ws.send(ws.enterworld2);
                ws.uid = data.uid;
                ws.join = (psk) => {
                    ws.sendPacket(9, { name: "JoinPartyByShareKey", partyShareKey: psk + "" });
                }
                ws.leave = () => {
                    ws.sendPacket(9, { name: "LeaveParty" });
                }
                ws.buy = (e, t) => {
                    ws.sendPacket(9, { name: "BuyItem", itemName: e, tier: t });
                }
                ws.equip = (e, t) => {
                    ws.sendPacket(9, { name: "EquipItem", itemName: e, tier: t });
                }
                ws.kick = (uid) => {
                    ws.sendPacket(9, { name: "KickParty", uid: uid });
                }
                ws.timeout = () => {
                    ws.buy("Pause", 1);
                }
                ws.sendPacket(9, { name: "JoinPartyByShareKey", partyShareKey: game.ui.getPlayerPartyShareKey() });
                ws.sendPacket(3, { up: 1, down: 0 });
                ws.hitDelay = 0;
            }
        }
        ws.onRpcUpdate = (data) => {
            if (data.name == "DayCycle") {
                ws.isDay = data.response.isDay;
                if (ws.isDay) {
                    ws.verified = true;
                }
            }
            if (data.name == "Dead") {
                ws.sendPacket(3, { respawn: 1 });
            }
            if (data.name == "Leaderboard") {
                if (ws.psk) {
                    if (game.ui.getPlayerPartyShareKey() !== ws.psk.response.partyShareKey) {
                        ws.sendPacket(9, { name: "JoinPartyByShareKey", partyShareKey: game.ui.getPlayerPartyShareKey() });
                    }
                    if (ws.psk.response.partyShareKey == game.ui.getPlayerPartyShareKey()) {
                        ws.sendPacket(9, { name: "BuyItem", itemName: "Pause", tier: 1 });
                    }
                }
            }
            if (data.name == "PartyShareKey") {
                ws.psk = data;
            }
        }
        ws.onEntityUpdate = (data) => {
            if (!window.startaito && !ws.isclosed) {
                ws.isclosed = true;
                ws.close();
            }
            if (ws.verified) {
                if (!ws.isDay && !ws.isclosed) {
                    ws.isclosed = true;
                    ws.close();
                    window.sendAitoAlt();
                }
            }
        }
        ws.onmessage = msg => {
            let data = ws.network.codec.decode(msg.data);
            switch (data.opcode) {
                case 5:
                    ws.onPreEnterWorld(data);
                    break;
                case 4:
                    ws.onEnterWorld(data);
                    break;
                case 9:
                    ws.onRpcUpdate(data);
                    break;
                case 0:
                    ws.onEntityUpdate(data);
                    break;
            }
        }
    }
}

setInterval(() => {
    if (window.scripts.antikick) {
        window.joinpsk(akpsk);
    }
})

const getEntitiesInGrid = (x, y) => {
    return (((x / 24) | 0) + ((y / 24) | 0) * 1000) | 0;
}

const getInGridPos = (index) => {
    return { x: index % 1000, y: index / 1000 | 0 };
}

const buildingTypeKeys = { 0: "Wall", 1: "Door", 2: "SlowTrap", 3: "ArrowTower", 4: "CannonTower", 5: "MeleeTower", 6: "BombTower", 7: "MagicTower", 8: "GoldMine", 9: "Harvester", 10: "GoldStash", "Wall": 0, "Door": 1, "SlowTrap": 2, "ArrowTower": 3, "CannonTower": 4, "MeleeTower": 5, "BombTower": 6, "MagicTower": 7, "GoldMine": 8, "Harvester": 9, "GoldStash": 10 };

const encodeBuildingData = (x, y, type, tier, yaw) => {
    return `${x | 0},${y | 0},${buildingTypeKeys[type]},${tier | 0},${(yaw | 0) / 90};`
}

const decodeBuildingData = (encoded) => {
    if (encoded) {
        let arr = encoded.split(",");
        return { x: arr[0] | 0, y: arr[1] | 0, type: buildingTypeKeys[arr[2]], tier: arr[3] | 0, yaw: (arr[4] | 0) * 90 };
    }
}

const decodeBuildingsData = (encoded) => {
    let arr = encoded.split(';');
    let obj = {};
    arr.forEach(e => {
        let decoded = decodeBuildingData(e);
        if (decoded) {
            let index = getEntitiesInGrid(decoded.x + 864, decoded.y + 864);
            //let pos = getInGridPos(index);
            //pos = {x: (pos.x * 24) - 864, y: (pos.y * 24) - 864}
            obj[index] = decoded;
        }
    })
    return obj;
}

localStorage["xyz.15001wavebasewithmaze"] = '240,336,3,8,0;240,432,3,8,0;240,528,3,8,0;480,-144,3,8,0;384,-144,3,8,0;336,384,3,8,0;-48,336,3,8,0;-48,528,3,8,0;-48,624,3,8,0;-384,144,3,8,0;-480,144,3,8,0;336,-240,3,8,0;528,192,3,8,0;432,192,3,8,0;144,-480,3,8,0;-48,240,3,8,0;-240,528,3,8,0;-288,144,3,8,0;-576,48,3,8,0;-480,48,3,8,0;-384,48,3,8,0;624,-48,3,8,0;336,480,7,8,0;432,432,7,8,0;-576,-48,7,8,0;-528,-144,7,8,0;-432,-336,7,8,0;528,-240,7,8,0;240,-528,7,8,0;-288,-480,7,8,0;-192,-528,7,8,0;-96,-576,7,8,0;0,-624,7,8,0;48,624,7,8,0;480,-336,7,8,0;336,-480,7,8,0;-336,480,7,8,0;-576,144,7,8,0;576,288,7,8,0;624,192,7,8,0;672,96,7,8,0;576,-144,7,8,0;144,-576,7,8,0;-480,336,7,8,0;-480,-240,7,8,0;-168,-312,0,8,0;-168,-360,0,8,0;216,-360,0,8,0;216,-312,0,8,0;312,312,0,8,0;-216,360,0,8,0;-216,312,0,8,0;-600,216,0,8,0;-600,-120,0,8,0;-552,-216,0,8,0;-552,312,0,8,0;-504,408,0,8,0;-408,504,0,8,0;-312,552,0,8,0;-216,600,0,8,0;-72,696,0,8,0;72,696,0,8,0;-504,-312,0,8,0;-456,-408,0,8,0;-264,-552,0,8,0;-168,-600,0,8,0;-72,-648,0,8,0;312,-552,0,8,0;216,-600,0,8,0;120,648,0,8,0;216,600,0,8,0;312,552,0,8,0;408,504,0,8,0;600,360,0,8,0;648,264,0,8,0;696,168,0,8,0;696,-24,0,8,0;648,-120,0,8,0;600,-216,0,8,0;552,-312,0,8,0;408,-504,0,8,0;264,216,0,8,0;-24,-168,0,8,0;-72,168,0,8,0;24,168,0,8,0;168,216,0,8,0;72,24,1,8,0;120,24,1,8,0;120,72,1,8,0;168,24,1,8,0;216,24,1,8,0;264,24,1,8,0;312,24,1,8,0;360,24,1,8,0;408,24,1,8,0;456,24,1,8,0;504,24,1,8,0;552,24,1,8,0;72,-504,1,8,0;72,-456,1,8,0;72,-408,1,8,0;72,-360,1,8,0;72,-312,1,8,0;72,-264,1,8,0;72,-216,1,8,0;648,24,1,8,0;696,24,1,8,0;600,24,1,8,0;72,-600,1,8,0;72,-552,1,8,0;72,-648,1,8,0;-24,-120,1,8,0;24,-120,1,8,0;24,-72,1,8,0;72,-168,1,8,0;-72,-24,1,8,0;-120,24,1,8,0;-120,-24,1,8,0;-72,120,1,8,0;-24,120,1,8,0;-24,72,1,8,0;24,120,1,8,0;-360,552,1,8,0;-360,600,1,8,0;-312,600,1,8,0;-264,648,1,8,0;-216,648,1,8,0;-168,696,1,8,0;-120,744,1,8,0;-72,744,1,8,0;-24,744,1,8,0;24,744,1,8,0;120,696,1,8,0;168,696,1,8,0;216,648,1,8,0;264,648,1,8,0;312,600,1,8,0;360,600,1,8,0;408,552,1,8,0;504,504,1,8,0;456,552,1,8,0;456,504,1,8,0;-552,408,1,8,0;-552,360,1,8,0;-600,360,1,8,0;-600,312,1,8,0;-648,264,1,8,0;-648,216,1,8,0;-648,-120,1,8,0;-504,-408,1,8,0;-504,-360,1,8,0;-552,-360,1,8,0;-552,-312,1,8,0;-600,-216,1,8,0;-648,-168,1,8,0;-600,-264,1,8,0;-312,-552,1,8,0;-264,-600,1,8,0;-216,-648,1,8,0;-168,-648,1,8,0;-120,-696,1,8,0;-72,-696,1,8,0;120,-696,1,8,0;72,-696,1,8,0;168,-696,1,8,0;216,-648,1,8,0;264,-648,1,8,0;312,-600,1,8,0;360,-552,1,8,0;360,-600,1,8,0;552,-408,1,8,0;552,-360,1,8,0;600,-360,1,8,0;600,-312,1,8,0;648,-264,1,8,0;600,408,1,8,0;648,360,1,8,0;696,312,1,8,0;648,312,1,8,0;696,264,1,8,0;744,216,1,8,0;744,168,1,8,0;792,120,1,8,0;792,72,1,8,0;744,24,1,8,0;744,-24,1,8,0;648,-216,1,8,0;744,-72,1,8,0;696,-120,1,8,0;696,-168,1,8,0;-24,168,1,8,0;792,168,1,8,0;-456,-456,1,8,0;-360,-552,1,8,0;72,744,1,8,0;168,168,2,8,0;216,168,2,8,0;216,216,2,8,0;264,264,2,8,0;120,168,2,8,0;72,120,2,8,0;72,168,2,8,0;72,-120,2,8,0;72,-72,2,8,0;72,-24,2,8,0;-216,-216,2,8,0;-168,-216,2,8,0;-168,-168,2,8,0;120,-120,2,8,0;216,-168,2,8,0;216,-216,2,8,0;-120,-120,2,8,0;264,-264,2,8,0;-120,-72,2,8,0;-72,-72,2,8,0;-216,-264,2,8,0;-24,-72,2,8,0;312,-408,2,8,0;-264,-408,2,8,0;-168,120,2,8,0;-120,72,2,8,0;-72,72,2,8,0;-72,24,2,8,0;-312,-408,2,8,0;360,-408,2,8,0;168,-120,2,8,0;-168,-120,2,8,0;-312,408,2,8,0;-360,408,2,8,0;216,264,2,8,0;216,-120,2,8,0;-216,120,2,8,0;-216,168,2,8,0;-216,216,2,8,0;-264,216,2,8,0;408,360,2,8,0;-120,120,2,8,0;312,264,2,8,0;456,360,2,8,0;24,72,2,8,0;72,72,2,8,0;216,-264,2,8,0;-264,264,2,8,0;144,384,6,8,0;-336,-144,4,8,0;-288,-240,4,8,0;-384,-240,4,8,0;0,-336,6,8,0;144,288,6,8,0;336,-48,6,8,0;-192,-48,6,8,0;432,-240,4,8,0;-432,-144,4,8,0;-480,-48,4,8,0;-288,-48,6,8,0;-240,-144,4,8,0;240,-48,6,8,0;240,-432,4,8,0;-96,-480,4,8,0;0,-432,4,8,0;-96,-384,4,8,0;-336,-336,4,8,0;48,240,6,8,0;144,576,6,8,0;384,-336,4,8,0;-192,-432,4,8,0;-240,432,4,8,0;-384,336,4,8,0;-432,240,4,8,0;-336,240,4,8,0;480,288,4,8,0;480,96,6,8,0;384,96,6,8,0;-96,-192,6,8,0;144,-48,6,8,0;0,-240,6,8,0;288,-144,6,8,0;-96,-288,6,8,0;-384,-48,6,8,0;-528,240,4,8,0;144,-384,6,8,0;144,-288,6,8,0;144,-192,6,8,0;576,96,4,8,0;-192,48,6,8,0;-48,432,6,8,0;336,192,6,8,0;288,96,6,8,0;0,-528,4,8,0;144,480,8,8,0;48,336,8,8,0;48,432,8,8,0;48,528,8,8,0;192,96,8,8,0;-288,48,8,8,0;528,-48,8,8,0;432,-48,8,8,0;0,0,10,8,0;432,-432,9,8,0;-384,-432,9,8,0;-240,-336,9,8,0;528,384,9,8,0;-432,432,9,8,0;288,-336,9,8,0;-288,336,9,8,0;384,288,9,8,0;24,-696,1,8,0;264,-216,0,8,0;-168,-264,0,8,0;-216,264,0,8,0;264,168,0,8,0;648,-168,1,8,0;696,-72,1,8,0;600,-264,1,8,0;696,216,1,8,0;744,72,1,8,0;120,120,0,8,0;24,-168,0,8,0;120,216,0,8,0;-120,696,1,8,0;-120,648,0,8,0;-144,576,7,8,0;-144,480,4,8,0;-144,384,4,8,0;-144,288,3,8,0;-144,192,3,8,0;-72,-120,1,8,0;-648,-72,1,8,0;-600,264,1,8,0;-600,-168,1,8,0;504,-408,0,8,0;792,216,0,8,0;744,312,0,8,0;-168,744,0,8,0;-408,552,1,8,0;408,-552,1,8,0;-552,-408,0,8,0;-408,600,0,8,0;-360,648,0,8,0;-312,696,0,8,0;216,-744,0,8,0;168,-744,0,8,0;360,-648,0,8,0;264,-696,0,8,0;120,-744,0,8,0;72,-744,0,8,0;24,-744,0,8,0;24,-792,0,8,0;-24,-744,0,8,0;-24,-792,0,8,0;-72,-744,0,8,0;-72,-792,0,8,0;-120,-744,0,8,0;-216,-696,0,8,0;-312,-648,0,8,0;-360,-600,0,8,0;-360,696,0,8,0;-408,648,0,8,0;-312,744,0,8,0;-264,696,0,8,0;-264,744,0,8,0;-216,744,0,8,0;-168,792,0,8,0;-120,792,0,8,0;-72,792,0,8,0;-24,792,0,8,0;-696,312,0,8,0;-600,408,0,8,0;-696,360,0,8,0;-648,408,0,8,0;-744,264,0,8,0;-696,264,0,8,0;-648,360,0,8,0;-744,216,0,8,0;-744,168,0,8,0;-744,120,0,8,0;-792,120,0,8,0;-792,72,0,8,0;-744,72,0,8,0;-792,168,0,8,0;-792,24,0,8,0;-744,24,0,8,0;-792,-24,0,8,0;-744,-24,0,8,0;-744,-72,0,8,0;-744,-120,0,8,0;-696,-168,0,8,0;-744,-168,0,8,0;-744,-216,0,8,0;-696,-216,0,8,0;-792,216,0,8,0;-600,-360,0,8,0;-600,-408,0,8,0;-648,-312,0,8,0;-696,-264,0,8,0;-648,-264,0,8,0;-168,-744,0,8,0;72,-792,0,8,0;600,-408,0,8,0;-504,-456,1,8,0;168,-792,0,8,0;264,-744,0,8,0;312,-744,0,8,0;312,-696,0,8,0;360,-696,0,8,0;408,-648,0,8,0;408,-600,0,8,0;792,264,0,8,0;744,-264,0,8,0;744,-216,0,8,0;696,-264,0,8,0;696,-312,0,8,0;696,-360,0,8,0;744,-360,0,8,0;696,-408,0,8,0;648,-456,0,8,0;648,-360,0,8,0;648,-408,0,8,0;600,-456,0,8,0;408,-696,0,8,0;-216,-744,0,8,0;-264,-696,0,8,0;552,-504,0,8,0;-360,-648,0,8,0;-648,-360,0,8,0;-696,-312,0,8,0;-744,312,0,8,0;-456,600,0,8,0;-792,264,0,8,0;-360,744,0,8,0;-456,648,0,8,0;408,648,0,8,0;168,744,0,8,0;-456,504,1,8,0;744,360,0,8,0;360,792,0,8,0;24,792,0,8,0;312,792,0,8,0;264,744,0,8,0;264,792,0,8,0;360,648,0,8,0;216,744,0,8,0;168,792,0,8,0;216,840,0,8,0;312,696,0,8,0;312,744,0,8,0;216,792,0,8,0;120,744,1,8,0;264,696,0,8,0;72,792,0,8,0;360,696,0,8,0;360,744,0,8,0;504,552,0,8,0;456,648,0,8,0;408,696,0,8,0;456,696,0,8,0;408,744,0,8,0;408,792,0,8,0;456,744,0,8,0;504,648,0,8,0;504,600,0,8,0;456,600,0,8,0;744,-168,0,8,0;552,-456,1,8,0;504,-504,1,8,0;312,-648,0,8,0;-24,-696,1,8,0;-168,-696,0,8,0;-120,-648,1,8,0;-264,-648,0,8,0;-744,360,0,8,0;-744,408,0,8,0;-696,408,0,8,0;-552,-264,1,8,0;-600,-312,0,8,0;-408,696,0,8,0;-456,552,1,8,0;-648,-216,0,8,0;-696,-120,0,8,0;-216,792,0,8,0;-264,792,0,8,0;-312,792,0,8,0;-360,792,0,8,0;-504,504,1,8,0;-696,24,1,8,0;-696,120,1,8,0;-696,72,1,8,0;-696,-72,1,8,0;-696,-24,1,8,0;-696,168,1,8,0;-696,216,0,8,0;-648,-24,0,8,0;-648,120,0,8,0;-648,168,1,8,0;120,792,0,8,0;216,696,0,8,0;168,648,1,8,0;264,600,1,8,0;312,648,0,8,0;360,552,1,8,0;408,600,1,8,0;504,-456,1,8,0;360,-744,0,8,0;120,-648,0,8,0;-696,-360,0,8,0;-744,-312,0,8,0;168,-648,1,8,0;216,-696,0,8,0;-744,-264,0,8,0;-24,840,0,8,0;24,840,0,8,0;-168,648,1,8,0;-264,600,1,8,0;-24,696,1,8,0;-312,648,0,8,0;24,696,1,8,0;-216,696,0,8,0;744,264,0,8,0;696,360,0,8,0;264,-600,1,8,0;-216,-600,1,8,0;-312,-600,1,8,0;216,-792,0,8,0;408,-744,0,8,0;-456,-504,1,8,0;648,-312,0,8,0;696,-216,0,8,0;792,-168,0,8,0;792,-120,0,8,0;792,-72,0,8,0;792,-216,0,8,0;792,-24,0,8,0;744,-312,0,8,0;792,-312,0,8,0;792,-264,0,8,0;792,24,1,8,0;744,-408,0,8,0;744,-120,1,8,0;840,-168,0,8,0;120,-792,0,8,0;264,-792,0,8,0;-120,-792,0,8,0;-648,312,0,8,0;-648,24,0,8,0;-648,72,0,8,0;-360,-504,0,8,0;264,840,0,8,0;312,840,0,8,0;360,840,0,8,0;72,840,0,8,0;168,840,0,8,0;120,840,0,8,0;-408,744,0,8,0;408,840,0,8,0;504,456,1,8,0;600,456,1,8,0;792,-360,0,8,0;696,-456,0,8,0;600,-504,0,8,0;312,-792,0,8,0;360,-792,0,8,0;264,-840,0,8,0;312,-840,0,8,0;-24,-840,0,8,0;-168,-792,0,8,0;-216,-792,0,8,0;-264,-792,0,8,0;-264,-744,0,8,0;-312,-696,0,8,0;-360,-696,0,8,0;-312,-744,0,8,0;-648,-408,0,8,0;-792,-120,0,8,0;-792,-72,0,8,0;-840,120,0,8,0;840,-264,0,8,0;840,-216,0,8,0;840,-72,0,8,0;840,-24,0,8,0;840,-120,0,8,0;840,24,1,8,0;840,-312,0,8,0;840,168,0,8,0;696,456,0,3,0;792,312,0,8,0;840,216,0,8,0;840,-360,0,8,0;840,120,0,8,0;792,-408,0,8,0;840,264,0,8,0;840,312,0,8,0;792,360,0,8,0;696,504,0,3,0;840,72,0,8,0;840,360,0,8,0;792,408,0,3,0;456,840,0,8,0;792,456,0,3,0;792,504,0,3,0;456,792,0,8,0;792,552,0,3,0;504,696,0,8,0;504,744,0,8,0;504,840,0,8,0;696,552,0,3,0;504,792,0,8,0;696,600,0,3,0;600,600,0,3,0;-72,840,0,8,0;-120,840,0,8,0;-168,840,0,8,0;-216,840,0,8,0;-264,840,0,8,0;696,648,0,3,0;-312,840,0,8,0;600,504,0,3,0;600,552,0,3,0;552,792,0,3,0;792,648,0,3,0;600,648,0,3,0;600,792,0,3,0;648,792,0,3,0;792,792,0,3,0;600,744,0,3,0;696,792,0,3,0;696,744,0,3,0;696,696,0,3,0;744,792,0,3,0;792,744,0,3,0;792,696,0,3,0;744,696,0,3,0;744,744,0,3,0;-360,840,0,8,0;-408,792,0,8,0;-408,840,0,8,0;-504,600,0,3,0;-456,840,0,8,0;-456,792,0,8,0;-552,600,0,3,0;-600,600,0,3,0;-456,744,0,8,0;-504,792,0,3,0;-696,504,0,3,0;-696,456,0,3,0;-648,600,0,3,0;-696,600,0,3,0;-456,696,0,8,0;-696,696,0,3,0;-648,792,0,3,0;-648,696,0,3,0;-744,456,0,3,0;-600,696,0,3,0;-552,696,0,3,0;-744,696,0,3,0;-840,72,0,8,0;-840,264,0,8,0;-840,168,0,8,0;-840,216,0,8,0;-840,360,0,8,0;-792,360,0,8,0;-792,312,0,8,0;-840,312,0,8,0;-792,408,0,8,0;-792,456,0,3,0;-792,504,0,3,0;-840,408,0,8,0;-792,552,0,3,0;-792,600,0,3,0;-792,648,0,3,0;-744,792,0,3,0;-792,696,0,3,0;-792,744,0,3,0;-792,792,0,3,0;-840,24,0,8,0;-600,792,0,3,0;-552,792,0,3,0;-504,552,0,3,0;-600,504,0,3,0;-600,456,0,3,0;-648,456,0,3,0;-840,-24,0,8,0;-840,-72,0,8,0;-840,-120,0,8,0;-792,-216,0,8,0;-840,-216,0,8,0;-792,-168,0,8,0;-840,-168,0,8,0;-792,-264,0,8,0;-840,-264,0,8,0;-744,-360,0,8,0;-792,-360,0,8,0;-840,-360,0,8,0;-792,-312,0,8,0;-840,-312,0,8,0;-696,-408,0,8,0;-792,-408,0,8,0;-744,-408,0,8,0;-840,-408,0,8,0;-552,-552,0,3,0;-648,-456,0,3,0;-648,-552,0,3,0;-744,-456,0,3,0;-696,-456,0,3,0;-792,-504,0,3,0;-792,-456,0,3,0;-744,-552,0,3,0;-792,-552,0,3,0;-408,-648,0,3,0;-552,-648,0,3,0;-552,-600,0,3,0;-456,-600,0,3,0;-648,-600,0,3,0;-648,-648,0,3,0;-792,-600,0,3,0;-744,-600,0,3,0;-408,-696,0,3,0;-456,-696,0,3,0;-552,-696,0,3,0;-648,-696,0,3,0;-744,-696,0,3,0;-792,-696,0,3,0;-312,-792,0,8,0;-408,-744,0,3,0;-360,-792,0,8,0;-408,-792,0,3,0;-552,-792,0,3,0;-360,-744,0,8,0;-456,-792,0,3,0;-504,-792,0,3,0;-648,-792,0,3,0;-600,-792,0,3,0;-648,-744,0,3,0;-792,-792,0,3,0;-744,-792,0,3,0;-696,-792,0,3,0;-696,-744,0,3,0;-744,-744,0,3,0;-792,-744,0,3,0;24,-840,0,8,0;-72,-840,0,8,0;-168,-840,0,8,0;-120,-840,0,8,0;-312,-840,0,8,0;-264,-840,0,8,0;-216,-840,0,8,0;-360,-840,0,8,0;72,-840,0,8,0;-552,-504,0,3,0;-552,-456,0,3,0;-408,-600,0,3,0;120,-840,0,8,0;168,-840,0,8,0;216,-840,0,8,0;360,-840,0,8,0;408,-792,0,8,0;408,-840,0,8,0;456,-792,0,3,0;552,-696,0,3,0;504,-792,0,3,0;552,-792,0,3,0;648,-504,0,8,0;600,-600,0,3,0;600,-696,0,3,0;648,-696,0,3,0;648,-792,0,3,0;600,-792,0,3,0;648,-600,0,3,0;744,-456,0,8,0;744,-696,0,3,0;744,-792,0,3,0;744,-504,0,8,0;696,-504,0,8,0;696,-696,0,3,0;744,-600,0,3,0;840,-456,0,8,0;792,-456,0,8,0;840,-408,0,8,0;840,-504,0,8,0;792,-696,0,3,0;792,-744,0,3,0;792,-504,0,8,0;792,-792,0,3,0;792,-552,0,3,0;792,-648,0,3,0;792,-600,0,3,0;456,-600,0,3,0;504,-600,0,3,0;552,-600,0,3,0;504,-696,0,3,0;744,120,1,8,0;'
localStorage["xyz.15001wavebase"] = '240,336,3,8,0;240,432,3,8,0;240,528,3,8,0;480,-144,3,8,0;384,-144,3,8,0;336,384,3,8,0;-48,336,3,8,0;-48,528,3,8,0;-48,624,3,8,0;-384,144,3,8,0;-480,144,3,8,0;336,-240,3,8,0;528,192,3,8,0;432,192,3,8,0;144,-480,3,8,0;-48,240,3,8,0;-240,528,3,8,0;-288,144,3,8,0;-576,48,3,8,0;-480,48,3,8,0;-384,48,3,8,0;624,-48,3,8,0;336,480,7,8,0;432,432,7,8,0;-576,-48,7,8,0;-528,-144,7,8,0;-432,-336,7,8,0;528,-240,7,8,0;240,-528,7,8,0;-288,-480,7,8,0;-192,-528,7,8,0;-96,-576,7,8,0;0,-624,7,8,0;48,624,7,8,0;480,-336,7,8,0;336,-480,7,8,0;-336,480,7,8,0;-576,144,7,8,0;576,288,7,8,0;624,192,7,8,0;672,96,7,8,0;576,-144,7,8,0;144,-576,7,8,0;-480,336,7,8,0;-480,-240,7,8,0;-168,-312,0,8,0;-168,-360,0,8,0;216,-360,0,8,0;216,-312,0,8,0;312,312,0,8,0;-216,360,0,8,0;-216,312,0,8,0;-600,216,0,8,0;-600,-120,0,8,0;-552,-216,0,8,0;-552,312,0,8,0;-504,408,0,8,0;-408,504,0,8,0;-312,552,0,8,0;-216,600,0,8,0;-72,696,0,8,0;72,696,0,8,0;-504,-312,0,8,0;-456,-408,0,8,0;-264,-552,0,8,0;-168,-600,0,8,0;-72,-648,0,8,0;312,-552,0,8,0;216,-600,0,8,0;120,648,0,8,0;216,600,0,8,0;312,552,0,8,0;408,504,0,8,0;600,360,0,8,0;648,264,0,8,0;696,168,0,8,0;696,-24,0,8,0;648,-120,0,8,0;600,-216,0,8,0;552,-312,0,8,0;408,-504,0,8,0;264,216,0,8,0;-24,-168,0,8,0;-72,168,0,8,0;24,168,0,8,0;168,216,0,8,0;72,24,1,8,0;120,24,1,8,0;120,72,1,8,0;168,24,1,8,0;216,24,1,8,0;264,24,1,8,0;312,24,1,8,0;360,24,1,8,0;408,24,1,8,0;456,24,1,8,0;504,24,1,8,0;552,24,1,8,0;72,-504,1,8,0;72,-456,1,8,0;72,-408,1,8,0;72,-360,1,8,0;72,-312,1,8,0;72,-264,1,8,0;72,-216,1,8,0;648,24,1,8,0;696,24,1,8,0;600,24,1,8,0;72,-600,1,8,0;72,-552,1,8,0;72,-648,1,8,0;-24,-120,1,8,0;24,-120,1,8,0;24,-72,1,8,0;72,-168,1,8,0;-72,-24,1,8,0;-120,24,1,8,0;-120,-24,1,8,0;-72,120,1,8,0;-24,120,1,8,0;-24,72,1,8,0;24,120,1,8,0;-360,552,1,8,0;-360,600,1,8,0;-312,600,1,8,0;-264,648,1,8,0;-216,648,1,8,0;-168,696,1,8,0;-120,744,1,8,0;-72,744,1,8,0;-24,744,1,8,0;24,744,1,8,0;120,696,1,8,0;168,696,1,8,0;216,648,1,8,0;264,648,1,8,0;312,600,1,8,0;360,600,1,8,0;408,552,1,8,0;504,504,1,8,0;456,552,1,8,0;456,504,1,8,0;-552,408,1,8,0;-552,360,1,8,0;-600,360,1,8,0;-600,312,1,8,0;-648,264,1,8,0;-648,216,1,8,0;-648,-120,1,8,0;-504,-408,1,8,0;-504,-360,1,8,0;-552,-360,1,8,0;-552,-312,1,8,0;-600,-216,1,8,0;-648,-168,1,8,0;-600,-264,1,8,0;-312,-552,1,8,0;-264,-600,1,8,0;-216,-648,1,8,0;-168,-648,1,8,0;-120,-696,1,8,0;-72,-696,1,8,0;120,-696,1,8,0;72,-696,1,8,0;168,-696,1,8,0;216,-648,1,8,0;264,-648,1,8,0;312,-600,1,8,0;360,-552,1,8,0;360,-600,1,8,0;552,-408,1,8,0;552,-360,1,8,0;600,-360,1,8,0;600,-312,1,8,0;648,-264,1,8,0;600,408,1,8,0;648,360,1,8,0;696,312,1,8,0;648,312,1,8,0;696,264,1,8,0;744,216,1,8,0;744,168,1,8,0;792,120,1,8,0;792,72,1,8,0;744,24,1,8,0;744,-24,1,8,0;648,-216,1,8,0;744,-72,1,8,0;696,-120,1,8,0;696,-168,1,8,0;-24,168,1,8,0;792,168,1,8,0;-456,-456,1,8,0;-360,-552,1,8,0;72,744,1,8,0;168,168,2,8,0;216,168,2,8,0;216,216,2,8,0;264,264,2,8,0;120,168,2,8,0;72,120,2,8,0;72,168,2,8,0;72,-120,2,8,0;72,-72,2,8,0;72,-24,2,8,0;-216,-216,2,8,0;-168,-216,2,8,0;-168,-168,2,8,0;120,-120,2,8,0;216,-168,2,8,0;216,-216,2,8,0;-120,-120,2,8,0;264,-264,2,8,0;-120,-72,2,8,0;-72,-72,2,8,0;-216,-264,2,8,0;-24,-72,2,8,0;312,-408,2,8,0;-264,-408,2,8,0;-168,120,2,8,0;-120,72,2,8,0;-72,72,2,8,0;-72,24,2,8,0;-312,-408,2,8,0;360,-408,2,8,0;168,-120,2,8,0;-168,-120,2,8,0;-312,408,2,8,0;-360,408,2,8,0;216,264,2,8,0;216,-120,2,8,0;-216,120,2,8,0;-216,168,2,8,0;-216,216,2,8,0;-264,216,2,8,0;408,360,2,8,0;-120,120,2,8,0;312,264,2,8,0;456,360,2,8,0;24,72,2,8,0;72,72,2,8,0;216,-264,2,8,0;-264,264,2,8,0;144,384,6,8,0;-336,-144,4,8,0;-288,-240,4,8,0;-384,-240,4,8,0;0,-336,6,8,0;144,288,6,8,0;336,-48,6,8,0;-192,-48,6,8,0;432,-240,4,8,0;-432,-144,4,8,0;-480,-48,4,8,0;-288,-48,6,8,0;-240,-144,4,8,0;240,-48,6,8,0;240,-432,4,8,0;-96,-480,4,8,0;0,-432,4,8,0;-96,-384,4,8,0;-336,-336,4,8,0;48,240,6,8,0;144,576,6,8,0;384,-336,4,8,0;-192,-432,4,8,0;-240,432,4,8,0;-384,336,4,8,0;-432,240,4,8,0;-336,240,4,8,0;480,288,4,8,0;480,96,6,8,0;384,96,6,8,0;-96,-192,6,8,0;144,-48,6,8,0;0,-240,6,8,0;288,-144,6,8,0;-96,-288,6,8,0;-384,-48,6,8,0;-528,240,4,8,0;144,-384,6,8,0;144,-288,6,8,0;144,-192,6,8,0;576,96,4,8,0;-192,48,6,8,0;-48,432,6,8,0;336,192,6,8,0;288,96,6,8,0;0,-528,4,8,0;144,480,8,8,0;48,336,8,8,0;48,432,8,8,0;48,528,8,8,0;192,96,8,8,0;-288,48,8,8,0;528,-48,8,8,0;432,-48,8,8,0;0,0,10,8,0;432,-432,9,8,0;-384,-432,9,8,0;-240,-336,9,8,0;528,384,9,8,0;-432,432,9,8,0;288,-336,9,8,0;-288,336,9,8,0;384,288,9,8,0;24,-696,1,8,0;264,-216,0,8,0;-168,-264,0,8,0;-216,264,0,8,0;264,168,0,8,0;648,-168,1,8,0;696,-72,1,8,0;600,-264,1,8,0;696,216,1,8,0;744,72,1,8,0;120,120,0,8,0;24,-168,0,8,0;120,216,0,8,0;-120,696,1,8,0;-120,648,0,8,0;-144,576,7,8,0;-144,480,4,8,0;-144,384,4,8,0;-144,288,3,8,0;-144,192,3,8,0;-72,-120,1,8,0;-648,-72,1,8,0;-600,264,1,8,0;-600,-168,1,8,0;504,-408,0,8,0;792,216,0,8,0;744,312,0,8,0;-168,744,0,8,0;-408,552,1,8,0;408,-552,1,8,0;-552,-408,0,8,0;-408,600,0,8,0;-360,648,0,8,0;-312,696,0,8,0;216,-744,0,8,0;168,-744,0,8,0;360,-648,0,8,0;264,-696,0,8,0;120,-744,0,8,0;72,-744,0,8,0;24,-744,0,8,0;24,-792,0,8,0;-24,-744,0,8,0;-24,-792,0,8,0;-72,-744,0,8,0;-72,-792,0,8,0;-120,-744,0,8,0;-216,-696,0,8,0;-312,-648,0,8,0;-360,-600,0,8,0;-360,696,0,8,0;-408,648,0,8,0;-312,744,0,8,0;-264,696,0,8,0;-264,744,0,8,0;-216,744,0,8,0;-168,792,0,8,0;-120,792,0,8,0;-72,792,0,8,0;-24,792,0,8,0;-696,312,0,8,0;-600,408,0,8,0;-744,264,0,8,0;-696,264,0,8,0;-648,360,0,8,0;-744,216,0,8,0;-744,168,0,8,0;-744,120,0,8,0;-792,120,0,8,0;-792,72,0,8,0;-744,72,0,8,0;-792,168,0,8,0;-792,24,0,8,0;-744,24,0,8,0;-792,-24,0,8,0;-744,-24,0,8,0;-744,-72,0,8,0;-744,-120,0,8,0;-696,-168,0,8,0;-744,-168,0,8,0;-744,-216,0,8,0;-696,-216,0,8,0;-792,216,0,8,0;-600,-360,0,8,0;-600,-408,0,8,0;-648,-312,0,8,0;-696,-264,0,8,0;-648,-264,0,8,0;-168,-744,0,8,0;72,-792,0,8,0;600,-408,0,8,0;-504,-456,1,8,0;168,-792,0,8,0;264,-744,0,8,0;312,-696,0,8,0;408,-600,0,8,0;792,264,0,8,0;744,-264,0,8,0;744,-216,0,8,0;696,-264,0,8,0;696,-312,0,8,0;696,-360,0,8,0;744,-360,0,8,0;696,-408,0,8,0;648,-360,0,8,0;648,-408,0,8,0;600,-456,0,8,0;-216,-744,0,8,0;-264,-696,0,8,0;552,-504,0,8,0;-360,-648,0,8,0;-648,-360,0,8,0;-696,-312,0,8,0;-456,600,0,8,0;-360,744,0,8,0;408,648,0,8,0;168,744,0,8,0;-456,504,1,8,0;744,360,0,8,0;360,792,0,8,0;24,792,0,8,0;312,792,0,8,0;264,744,0,8,0;264,792,0,8,0;360,648,0,8,0;216,744,0,8,0;168,792,0,8,0;216,840,0,8,0;312,696,0,8,0;312,744,0,8,0;216,792,0,8,0;120,744,1,8,0;264,696,0,8,0;72,792,0,8,0;360,696,0,8,0;360,744,0,8,0;504,552,0,8,0;456,648,0,8,0;408,696,0,8,0;408,744,0,8,0;408,792,0,8,0;456,744,0,8,0;504,648,0,8,0;504,600,0,8,0;456,600,0,8,0;744,-168,0,8,0;552,-456,1,8,0;504,-504,1,8,0;312,-648,0,8,0;-24,-696,1,8,0;-168,-696,0,8,0;-120,-648,1,8,0;-264,-648,0,8,0;-552,-264,1,8,0;-600,-312,0,8,0;-408,696,0,8,0;-456,552,1,8,0;-648,-216,0,8,0;-696,-120,0,8,0;-216,792,0,8,0;-264,792,0,8,0;-312,792,0,8,0;-360,792,0,8,0;-504,504,1,8,0;-696,24,1,8,0;-696,120,1,8,0;-696,72,1,8,0;-696,-72,1,8,0;-696,-24,1,8,0;-696,168,1,8,0;-696,216,0,8,0;-648,-24,0,8,0;-648,120,0,8,0;-648,168,1,8,0;120,792,0,8,0;216,696,0,8,0;168,648,1,8,0;264,600,1,8,0;312,648,0,8,0;360,552,1,8,0;408,600,1,8,0;504,-456,1,8,0;120,-648,0,8,0;-696,-360,0,8,0;168,-648,1,8,0;216,-696,0,8,0;-744,-264,0,8,0;-24,840,0,8,0;24,840,0,8,0;-168,648,1,8,0;-264,600,1,8,0;-24,696,1,8,0;-312,648,0,8,0;24,696,1,8,0;-216,696,0,8,0;744,264,0,8,0;696,360,0,8,0;264,-600,1,8,0;-216,-600,1,8,0;-312,-600,1,8,0;-456,-504,1,8,0;648,-312,0,8,0;696,-216,0,8,0;792,-168,0,8,0;792,-120,0,8,0;792,-72,0,8,0;792,-216,0,8,0;792,-24,0,8,0;744,-312,0,8,0;792,-312,0,8,0;792,-264,0,8,0;792,24,1,8,0;744,-120,1,8,0;120,-792,0,8,0;-120,-792,0,8,0;-648,312,0,8,0;-648,24,0,8,0;-648,72,0,8,0;-360,-504,0,8,0;264,840,0,8,0;312,840,0,8,0;360,840,0,8,0;72,840,0,8,0;168,840,0,8,0;120,840,0,8,0;-408,744,0,8,0;504,456,1,8,0;600,456,1,8,0;792,-360,0,8,0;-24,-840,0,8,0;-168,-792,0,8,0;840,-216,0,8,0;840,168,0,8,0;792,312,0,8,0;840,216,0,8,0;840,120,0,8,0;840,264,0,8,0;840,312,0,8,0;792,360,0,8,0;-72,840,0,8,0;-120,840,0,8,0;-168,840,0,8,0;-216,840,0,8,0;-264,840,0,8,0;-312,840,0,8,0;-840,72,0,8,0;24,-840,0,8,0;-72,-840,0,8,0;-120,-840,0,8,0;72,-840,0,8,0;744,120,1,8,0;456,696,0,8,0;840,24,1,8,0;840,72,0,8,0;840,-24,0,8,0;840,-120,0,8,0;840,-168,0,8,0;840,-264,0,8,0;840,-312,0,8,0;-648,-408,0,8,0;-744,-312,0,8,0;-792,-120,0,8,0;-792,-72,0,8,0;-792,-216,0,8,0;-792,-168,0,8,0;-792,-264,0,8,0;-744,-360,0,8,0;-792,-312,0,8,0;-840,-24,0,8,0;-840,24,0,8,0;-360,840,0,8,0;120,-840,0,8,0;168,-840,0,8,0;744,-408,0,8,0;-216,-792,0,8,0;-168,-840,0,8,0;216,-792,0,8,0;216,-840,0,8,0;-216,-840,0,8,0;264,-840,0,8,0;648,-456,0,8,0;-264,-792,0,8,0;264,-792,0,8,0;-264,-744,0,8,0;744,-456,0,8,0;792,-456,0,8,0;792,-408,0,8,0;312,-744,0,8,0;840,-72,0,8,0;840,-360,0,8,0;-264,-840,0,8,0;840,-408,0,8,0;696,-456,0,8,0;408,-840,0,8,0;840,-456,0,8,0;840,-504,0,8,0;600,-504,0,8,0;840,360,0,8,0;360,-696,0,8,0;792,-504,0,8,0;744,-504,0,8,0;408,-648,0,8,0;696,-504,0,8,0;648,-504,0,8,0;504,744,0,8,0;504,696,0,8,0;456,792,0,8,0;504,792,0,8,0;408,840,0,8,0;456,840,0,8,0;504,840,0,8,0;-456,648,0,8,0;-456,696,0,8,0;-456,744,0,8,0;-408,792,0,8,0;-408,840,0,8,0;-456,840,0,8,0;-456,792,0,8,0;-648,408,0,8,0;-696,360,0,8,0;-744,312,0,8,0;-744,360,0,8,0;-744,408,0,8,0;-696,408,0,8,0;-792,264,0,8,0;-792,312,0,8,0;-792,360,0,8,0;-792,408,0,8,0;-840,120,0,8,0;-840,168,0,8,0;-840,216,0,8,0;-840,264,0,8,0;-840,312,0,8,0;-840,360,0,8,0;-840,408,0,8,0;-840,-72,0,8,0;-840,-120,0,8,0;-840,-216,0,8,0;-840,-168,0,8,0;-840,-264,0,8,0;-840,-312,0,8,0;-792,-360,0,8,0;-840,-360,0,8,0;-696,-408,0,8,0;-792,-408,0,8,0;-744,-408,0,8,0;-840,-408,0,8,0;-312,-696,0,8,0;-360,-696,0,8,0;-312,-744,0,8,0;-312,-792,0,8,0;-360,-792,0,8,0;-360,-744,0,8,0;-312,-840,0,8,0;-360,-840,0,8,0;312,-792,0,8,0;312,-840,0,8,0;408,-696,0,8,0;360,-744,0,8,0;408,-744,0,8,0;360,-792,0,8,0;360,-840,0,8,0;408,-792,0,8,0;';
localStorage["xyz.abm4"] = '0,0,10,4,0;192,-48,8,4,0;192,48,8,4,0;192,-144,8,4,0;192,144,8,4,0;-192,-48,8,4,0;-192,48,8,4,0;-192,-144,8,4,0;-192,144,8,4,0;-96,-192,3,4,0;0,-192,3,4,0;96,-192,3,4,0;96,192,3,4,0;0,192,3,4,0;-96,192,3,4,0;-192,-240,6,4,0;-288,0,6,4,0;-192,240,6,4,0;192,-240,6,4,0;288,0,6,4,0;192,240,6,4,0;288,96,3,4,0;288,-96,3,4,0;-288,-96,3,4,0;-288,96,3,4,0;-288,192,3,4,0;288,-192,3,4,0;288,192,6,4,0;-288,-192,6,4,0;96,-288,6,4,0;-96,-288,6,4,0;96,288,6,4,0;-96,288,6,4,0;';
localStorage["xyz.abm2"] = '0,0,10,2,0;192,-48,8,2,0;192,48,8,2,0;192,-144,8,2,0;192,144,8,2,0;-192,-48,8,2,0;-192,48,8,2,0;-192,-144,8,2,0;-192,144,8,2,0;-96,-192,3,2,0;0,-192,3,2,0;96,-192,3,2,0;96,192,3,2,0;0,192,3,2,0;-96,192,3,2,0;-192,-240,6,2,0;-288,0,6,2,0;-192,240,6,2,0;192,-240,6,2,0;288,0,6,2,0;192,240,6,2,0;288,96,3,2,0;288,-96,3,2,0;-288,-96,3,2,0;-288,96,3,2,0;-288,192,3,2,0;288,-192,3,2,0;288,192,6,2,0;-288,-192,6,2,0;96,-288,6,2,0;-96,-288,6,2,0;96,288,6,2,0;-96,288,6,2,0;';
localStorage["xyz.abm1"] = '0,0,10,1,0;0,96,6,1,0;96,96,8,1,0;96,0,8,1,0;96,-96,8,1,0;-96,96,8,1,0;-96,0,8,1,0;-96,-96,8,1,0;0,-96,8,1,0;0,-192,8,1,0;96,-192,6,1,0;-96,-192,6,1,0;';
localStorage["xyz.abm"] = '0,0,10,3,0;192,-48,8,3,0;192,48,8,3,0;192,-144,8,3,0;192,144,8,3,0;-192,-48,8,3,0;-192,48,8,3,0;-192,-144,8,3,0;-192,144,8,3,0;-96,-192,3,3,0;0,-192,3,3,0;96,-192,3,3,0;96,192,3,3,0;0,192,3,3,0;-96,192,3,3,0;-192,-240,6,3,0;-288,0,6,3,0;-192,240,6,3,0;192,-240,6,3,0;288,0,6,3,0;192,240,6,3,0;288,96,3,3,0;288,-96,3,3,0;-288,-96,3,3,0;-288,96,3,3,0;-288,192,3,3,0;288,-192,3,3,0;288,192,6,3,0;-288,-192,6,3,0;96,-288,6,3,0;-96,-288,6,3,0;96,288,6,3,0;-96,288,6,3,0;';
localStorage["xyz.abg"] = '0,0,10,1,0;-48,-576,8,1,0;48,-576,8,1,0;-96,-480,6,1,0;0,-480,6,1,0;96,-480,6,1,0;-432,-432,6,1,0;-336,-432,3,1,0;-240,-432,6,1,0;240,-432,6,1,0;336,-432,3,1,0;432,-432,6,1,0;-96,-384,4,1,0;0,-384,4,1,0;96,-384,4,1,0;-432,-336,3,1,0;-336,-336,3,1,0;-240,-336,3,1,0;240,-336,3,1,0;336,-336,3,1,0;432,-336,3,1,0;-96,-288,4,1,0;0,-288,4,1,0;96,-288,4,1,0;-168,-264,2,1,0;168,-264,2,1,0;-432,-240,6,1,0;-336,-240,3,1,0;-240,-240,3,1,0;240,-240,3,1,0;336,-240,3,1,0;432,-240,6,1,0;-168,-216,2,1,0;168,-216,2,1,0;-264,-168,2,1,0;-216,-168,2,1,0;-168,-168,2,1,0;-120,-168,2,1,0;-72,-168,2,1,0;-24,-168,2,1,0;24,-168,2,1,0;72,-168,2,1,0;120,-168,2,1,0;168,-168,2,1,0;216,-168,2,1,0;264,-168,2,1,0;168,-120,2,1,0;-480,-96,6,1,0;-384,-96,4,1,0;-288,-96,4,1,0;0,-96,7,1,0;96,-96,7,1,0;288,-96,4,1,0;384,-96,4,1,0;-168,-72,2,1,0;168,-72,2,1,0;-576,-48,8,1,0;-168,-24,2,1,0;168,-24,2,1,0;-480,0,6,1,0;-384,0,4,1,0;-288,0,4,1,0;-96,0,7,1,0;96,0,9,1,0;288,0,4,1,0;384,0,4,1,0;-168,24,2,1,0;168,24,2,1,0;-576,48,8,1,0;-168,72,2,1,0;168,72,2,1,0;-480,96,6,1,0;-384,96,4,1,0;-288,96,4,1,0;-96,96,7,1,0;0,96,9,1,0;96,96,9,1,0;288,96,4,1,0;384,96,4,1,0;-168,120,2,1,0;168,120,2,1,0;-264,168,2,1,0;-216,168,2,1,0;-168,168,2,1,0;-120,168,2,1,0;-72,168,2,1,0;-24,168,2,1,0;24,168,2,1,0;72,168,2,1,0;168,168,2,1,0;216,168,2,1,0;264,168,2,1,0;-168,216,2,1,0;168,216,2,1,0;-432,240,6,1,0;-336,240,3,1,0;-240,240,3,1,0;240,240,3,1,0;336,240,3,1,0;432,240,6,1,0;-168,264,2,1,0;168,264,2,1,0;-96,288,4,1,0;0,288,4,1,0;96,288,4,1,0;-432,336,3,1,0;-336,336,3,1,0;-240,336,3,1,0;240,336,3,1,0;336,336,3,1,0;432,336,3,1,0;-96,384,4,1,0;0,384,4,1,0;96,384,4,1,0;-432,432,6,1,0;-336,432,3,1,0;-240,432,6,1,0;240,432,6,1,0;336,432,3,1,0;432,432,6,1,0;-168,-120,2,1,0;-96,-96,7,1,0;480,-96,6,1,0;480,0,6,1,0;480,96,6,1,0;576,-48,8,1,0;576,48,8,1,0;-96,480,6,1,0;0,480,6,1,0;96,480,6,1,0;-48,576,8,1,0;48,576,8,1,0;120,168,2,1,0;';
localStorage["xyz.arb"] = '-48,-288,3,8,0;-192,384,3,8,0;-96,336,3,8,0;48,384,3,8,0;240,480,3,8,0;432,288,3,8,0;192,-288,3,8,0;288,-48,3,8,0;384,-48,3,8,0;-432,-288,3,8,0;-288,-192,3,8,0;-240,-96,3,8,0;-384,240,3,8,0;-288,48,3,8,0;-432,-384,3,8,0;48,288,3,8,0;-480,336,3,8,0;-528,432,3,8,0;-384,480,3,8,0;576,-336,3,8,0;-336,-384,3,8,0;384,-144,3,8,0;-432,-480,3,8,0;-528,-288,3,8,0;96,-432,7,8,0;192,-480,7,8,0;288,-528,7,8,0;-48,-480,7,8,0;-480,-192,7,8,0;-432,-96,7,8,0;-192,480,7,8,0;-96,432,7,8,0;48,480,7,8,0;144,528,7,8,0;240,576,7,8,0;528,288,7,8,0;480,192,7,8,0;432,96,7,8,0;528,-144,7,8,0;480,-48,7,8,0;384,-624,7,8,0;-528,144,7,8,0;-576,240,7,8,0;-480,48,7,8,0;-672,336,7,8,0;-144,-528,7,8,0;-240,-576,7,8,0;-528,-384,7,8,0;552,-600,0,8,0;-504,552,0,8,0;312,648,0,8,0;-456,120,0,8,0;-456,168,0,8,0;552,360,0,8,0;552,408,0,8,0;264,648,0,8,0;408,552,0,8,0;360,600,0,8,0;312,600,0,8,0;504,456,0,8,0;552,-552,0,8,0;-360,-552,0,8,0;-312,-552,0,8,0;456,-168,0,8,0;456,-120,0,8,0;120,456,0,8,0;168,456,0,8,0;552,-264,0,8,0;552,-408,0,8,0;-264,504,0,8,0;-264,408,0,8,0;-264,456,0,8,0;-696,408,0,8,0;-600,504,0,8,0;-408,600,0,8,0;-408,-552,0,8,0;-600,-360,0,8,0;-600,-312,0,8,0;600,312,0,8,0;-216,552,0,8,0;504,-648,0,8,0;-648,264,0,8,0;-744,360,0,8,0;408,-696,0,8,0;-504,-456,0,8,0;-168,-456,0,8,0;-120,-456,0,8,0;312,-600,0,8,0;600,360,0,8,0;456,-648,0,8,0;504,360,1,8,0;408,456,1,8,0;360,456,1,8,0;312,456,1,8,0;552,-456,1,8,0;552,-504,1,8,0;600,-456,1,8,0;600,-408,1,8,0;456,-312,1,8,0;456,504,1,8,0;600,-504,1,8,0;408,360,1,8,0;408,408,1,8,0;456,408,1,8,0;456,360,1,8,0;504,-312,1,8,0;408,504,1,8,0;456,456,1,8,0;504,408,1,8,0;-312,648,1,8,0;-264,600,1,8,0;-264,552,1,8,0;-312,552,1,8,0;-360,552,1,8,0;-408,552,1,8,0;-456,552,1,8,0;-360,600,1,8,0;-312,600,1,8,0;-504,504,1,8,0;-456,504,1,8,0;-312,504,1,8,0;-456,456,1,8,0;-312,456,1,8,0;-456,408,1,8,0;-408,408,1,8,0;-360,408,1,8,0;-312,408,1,8,0;360,552,1,8,0;360,504,1,8,0;312,504,1,8,0;312,552,1,8,0;600,-216,1,8,0;648,-264,1,8,0;648,-312,1,8,0;648,-360,1,8,0;648,-408,1,8,0;648,-456,1,8,0;600,-264,1,8,0;504,-264,1,8,0;456,-264,1,8,0;408,-264,1,8,0;360,-264,1,8,0;360,-216,1,8,0;408,-216,1,8,0;456,-216,1,8,0;504,-216,1,8,0;552,-216,1,8,0;-552,504,1,8,0;-360,648,1,8,0;24,-456,2,8,0;24,-408,2,8,0;24,-360,2,8,0;24,-312,2,8,0;24,-264,2,8,0;264,24,2,8,0;312,24,2,8,0;360,24,2,8,0;408,24,2,8,0;456,24,2,8,0;-24,456,2,8,0;-24,408,2,8,0;-24,360,2,8,0;-24,312,2,8,0;-24,264,2,8,0;-456,-24,2,8,0;-408,-24,2,8,0;-360,-24,2,8,0;-312,-24,2,8,0;-264,-24,2,8,0;384,-528,4,8,0;288,-432,4,8,0;192,-384,4,8,0;96,-336,4,8,0;-48,-384,4,8,0;-240,-480,4,8,0;-240,-384,4,8,0;-336,-96,4,8,0;-384,-192,4,8,0;240,384,6,8,0;288,192,6,8,0;336,288,6,8,0;336,384,6,8,0;240,288,6,8,0;384,192,4,8,0;-240,-288,6,8,0;-192,-192,6,8,0;288,-336,4,8,0;288,-240,6,8,0;-192,192,6,8,0;240,96,6,8,0;-288,336,6,8,0;-288,240,6,8,0;192,192,6,8,0;-384,48,4,8,0;-480,240,4,8,0;480,-576,4,8,0;-96,240,6,8,0;-192,288,6,8,0;384,-432,4,8,0;-384,336,6,8,0;-384,144,4,8,0;-288,144,4,8,0;-336,-288,6,8,0;96,-240,6,8,0;288,-144,6,8,0;336,96,4,8,0;384,-336,6,8,0;480,-384,6,8,0;480,-480,6,8,0;-336,-480,4,8,0;144,288,6,8,0;144,384,4,8,0;-576,336,4,8,0;-624,432,4,8,0;192,-192,6,8,0;-144,-384,4,8,0;-144,-288,4,8,0;-144,-96,8,8,0;96,-144,8,8,0;144,96,8,8,0;-96,144,8,8,0;96,192,8,8,0;192,-96,8,8,0;-96,-192,8,8,0;-192,96,8,8,0;0,0,10,8,0;528,48,9,8,0;-528,-48,9,8,0;48,-528,9,8,0;-48,528,9,8,0;192,0,9,1,0;0,-192,9,1,0;-192,0,9,1,0;0,192,9,1,0;';
localStorage["xyz.sirr"] = '0,0,10,8,0;24,72,1,8,0;24,120,1,8,0;72,120,1,8,0;72,72,1,8,0;120,72,1,8,0;168,72,1,8,0;120,120,1,8,0;168,120,1,8,0;96,192,6,8,0;-72,168,0,8,0;-144,144,8,8,0;-96,240,3,8,0;48,288,3,8,0;48,384,4,8,0;48,480,7,8,0;144,528,7,8,0;240,576,7,8,0;144,432,3,8,0;240,480,8,8,0;336,528,8,8,0;336,432,3,8,0;240,384,6,8,0;144,336,6,8,0;120,264,0,8,0;-96,336,4,8,0;-96,432,7,8,0;-192,480,7,8,0;-288,528,3,8,0;-288,432,6,8,0;-288,336,6,8,0;-288,240,6,8,0;-192,288,6,8,0;-192,384,3,8,0;-384,528,8,8,0;-432,432,3,8,0;-528,432,4,8,0;-480,336,4,8,0;-384,240,4,8,0;-336,144,4,8,0;-384,48,4,8,0;-240,144,3,8,0;-288,48,3,8,0;-216,72,0,8,0;-168,72,0,8,0;-120,24,1,8,0;-72,24,1,8,0;-120,72,1,8,0;-72,72,1,8,0;-72,120,1,8,0;-24,-72,1,8,0;-24,-120,1,8,0;-72,-120,1,8,0;-72,-72,1,8,0;-144,-96,6,8,0;-240,-96,3,8,0;-288,-192,3,8,0;-336,-288,3,8,0;-192,-192,6,8,0;-96,-192,6,8,0;-240,-288,6,8,0;-336,-96,4,8,0;-384,-192,4,8,0;-432,-288,4,8,0;-432,-96,7,8,0;-480,-192,7,8,0;-528,-288,7,8,0;-528,-384,3,8,0;-432,-480,3,8,0;-432,-384,6,8,0;-336,-384,4,8,0;-240,-384,4,8,0;-240,-480,4,8,0;-336,-480,4,8,0;-144,-432,4,8,0;-48,-384,4,8,0;-144,-336,3,8,0;-48,-288,3,8,0;-120,-264,0,8,0;-168,-264,0,8,0;-48,-480,7,8,0;-144,-528,7,8,0;-240,-576,7,8,0;96,-528,7,8,0;96,-432,4,8,0;96,-336,3,8,0;96,-240,3,8,0;96,-144,8,8,0;120,-72,1,8,0;72,-72,1,8,0;72,-24,1,8,0;120,-24,1,8,0;192,-96,6,8,0;192,-192,6,8,0;192,-288,6,8,0;288,-144,6,8,0;288,-240,6,8,0;288,-336,6,8,0;384,-240,8,8,0;384,-336,6,8,0;480,-240,6,8,0;480,-336,6,8,0;480,-432,6,8,0;576,-336,3,8,0;504,-504,0,8,0;456,-504,0,8,0;480,-576,4,8,0;384,-528,4,8,0;384,-432,4,8,0;288,-432,4,8,0;192,-384,4,8,0;192,-480,7,8,0;288,-528,7,8,0;384,-624,7,8,0;552,-408,0,8,0;552,-264,0,8,0;648,-312,0,8,0;-480,48,7,8,0;-432,144,7,8,0;-480,240,7,8,0;-576,336,7,8,0;-504,504,0,8,0;-456,504,0,8,0;-384,336,3,8,0;-360,456,0,8,0;-360,408,0,8,0;-168,216,0,8,0;-216,216,0,8,0;480,384,8,8,0;432,288,8,8,0;360,264,0,8,0;360,312,0,8,0;312,264,0,8,0;264,264,0,8,0;288,192,6,8,0;240,96,6,8,0;336,96,3,8,0;384,192,3,8,0;432,96,4,8,0;528,96,7,8,0;480,192,7,8,0;528,288,7,8,0;600,312,0,8,0;552,360,0,8,0;480,-48,7,8,0;528,-144,7,8,0;456,-168,0,8,0;456,-120,0,8,0;384,-144,3,8,0;288,-48,3,8,0;384,-48,4,8,0;-504,-120,0,8,0;-600,-312,0,8,0;-600,-360,0,8,0;-504,-456,0,8,0;-312,-600,0,8,0;-312,-552,0,8,0;-360,-552,0,8,0;-408,-552,0,8,0;-168,-600,0,8,0;-72,-552,0,8,0;72,-600,0,8,0;312,-600,0,8,0;600,-168,0,8,0;552,-72,0,8,0;600,72,0,8,0;456,504,0,8,0;408,504,0,8,0;408,552,0,8,0;360,600,0,8,0;312,600,0,8,0;312,648,0,8,0;264,648,0,8,0;168,600,0,8,0;72,552,0,8,0;-120,504,0,8,0;-216,552,0,8,0;-312,600,0,8,0;-360,600,0,8,0;-552,264,0,8,0;-552,24,0,8,0;-24,-648,1,8,0;-72,-600,1,8,0;-120,-600,1,8,0;-168,-648,1,8,0;24,-648,2,8,0;-216,-648,1,8,0;-264,-648,1,8,0;-312,-648,1,8,0;-360,-600,1,8,0;-216,-696,1,8,0;-264,-696,1,8,0;-408,-600,1,8,0;-456,-552,1,8,0;-504,-504,1,8,0;-552,-456,1,8,0;-600,-408,1,8,0;-648,-360,1,8,0;-648,-312,1,8,0;-600,-264,1,8,0;-552,-216,2,8,0;-552,-168,2,8,0;-552,-120,1,8,0;-600,-72,1,8,0;-600,24,1,8,0;-552,72,1,8,0;-504,120,1,8,0;-504,168,1,8,0;-552,216,1,8,0;-600,264,1,8,0;-648,312,1,8,0;-648,360,1,8,0;-600,408,1,8,0;-600,456,1,8,0;-552,504,1,8,0;-504,552,1,8,0;-456,552,1,8,0;-456,600,1,8,0;-408,600,1,8,0;-408,648,1,8,0;-360,648,1,8,0;-312,648,1,8,0;-264,648,1,8,0;-120,552,1,8,0;-168,552,1,8,0;-168,600,1,8,0;-120,600,1,8,0;-216,600,1,8,0;-264,600,1,8,0;-312,696,1,8,0;-264,696,1,8,0;-216,648,1,8,0;-72,600,2,8,0;-24,600,1,8,0;24,600,1,8,0;24,552,1,8,0;72,600,1,8,0;120,600,1,8,0;72,648,1,8,0;120,648,1,8,0;168,648,1,8,0;216,648,1,8,0;168,696,1,8,0;216,696,1,8,0;264,696,1,8,0;312,696,1,8,0;360,648,1,8,0;264,744,1,8,0;216,744,1,8,0;168,168,1,8,0;168,216,1,8,0;216,264,1,8,0;216,312,1,8,0;264,312,1,8,0;216,216,1,8,0;216,168,1,8,0;168,264,1,8,0;312,360,1,8,0;360,360,1,8,0;312,312,1,8,0;408,408,1,8,0;408,360,1,8,0;408,456,1,8,0;456,456,1,8,0;504,456,1,8,0;552,456,1,8,0;552,408,1,8,0;600,360,1,8,0;648,312,1,8,0;600,408,1,8,0;648,360,1,8,0;600,264,1,8,0;552,216,1,8,0;552,168,1,8,0;600,120,1,8,0;648,72,1,8,0;648,24,2,8,0;648,-24,1,8,0;600,-72,1,8,0;600,-120,1,8,0;648,-216,1,8,0;600,-216,1,8,0;552,-216,1,8,0;600,-264,1,8,0;648,-264,1,8,0;696,-264,1,8,0;696,-312,1,8,0;696,-360,1,8,0;648,-360,1,8,0;600,-408,1,8,0;552,-456,1,8,0;648,-408,1,8,0;600,-456,1,8,0;600,-504,1,8,0;552,-504,1,8,0;552,-552,1,8,0;552,-600,1,8,0;504,-648,1,8,0;456,-648,1,8,0;408,-696,1,8,0;360,-696,1,8,0;312,-648,1,8,0;264,-600,1,8,0;216,-552,1,8,0;168,-552,1,8,0;120,-600,1,8,0;72,-648,1,8,0;-600,-24,2,8,0;360,24,2,8,0;312,24,2,8,0;264,24,2,8,0;456,24,2,8,0;504,24,2,8,0;120,24,2,8,0;408,24,2,8,0;24,-504,2,8,0;24,-456,2,8,0;24,-408,2,8,0;24,-360,2,8,0;24,-312,2,8,0;24,-120,2,8,0;24,-72,2,8,0;-72,-24,2,8,0;-120,-24,2,8,0;-264,-24,2,8,0;-312,-24,2,8,0;-360,-24,2,8,0;-408,-24,2,8,0;-456,-24,2,8,0;24,-264,2,8,0;-24,120,2,8,0;-24,264,2,8,0;-24,312,2,8,0;-24,360,2,8,0;-24,408,2,8,0;-24,456,2,8,0;72,24,2,8,0;-24,72,2,8,0;0,-576,9,8,0;0,-192,9,8,0;-192,0,9,8,0;-528,-48,9,8,0;192,0,9,8,0;576,0,9,8,0;0,192,9,8,0;-48,528,9,8,0;';
localStorage["xyz.sirr2"] = '0,0,10,8,0;216,-72,1,8,0;552,-72,0,8,0;600,-72,1,8,0;288,-48,3,8,0;384,-48,4,8,0;480,-48,7,8,0;648,-24,1,8,0;360,24,2,8,0;600,120,1,8,0;216,168,0,8,0;552,168,1,8,0;288,192,6,8,0;480,192,7,8,0;216,216,1,8,0;552,216,1,8,0;120,264,0,8,0;168,264,0,8,0;216,264,1,8,0;264,264,1,8,0;312,264,1,8,0;360,264,0,8,0;600,264,1,8,0;432,288,8,8,0;528,288,7,8,0;264,312,0,8,0;312,312,1,8,0;360,312,1,8,0;600,312,0,8,0;648,312,1,8,0;696,312,0,8,0;144,336,6,8,0;312,360,0,8,0;360,360,1,8,0;408,360,1,8,0;552,360,0,8,0;600,360,0,8,0;648,360,1,8,0;240,384,6,8,0;480,384,3,8,0;408,408,1,8,0;552,408,0,8,0;600,408,1,8,0;144,432,3,8,0;336,432,3,8,0;408,456,1,8,0;456,456,1,8,0;504,456,0,8,0;552,456,1,8,0;240,480,6,8,0;408,504,0,8,0;456,504,1,8,0;144,528,7,8,0;336,528,3,8,0;408,552,0,8,0;456,552,2,8,0;240,576,7,8,0;120,600,1,8,0;168,600,1,8,0;312,600,0,8,0;360,600,0,8,0;408,600,1,8,0;216,648,1,8,0;264,648,0,8,0;312,648,0,8,0;360,648,1,8,0;264,696,1,8,0;312,696,1,8,0;72,24,2,8,0;72,72,1,8,0;72,648,1,8,0;48,288,6,8,0;48,384,3,8,0;48,480,4,8,0;24,72,1,8,0;-24,72,2,8,0;-24,264,2,8,0;-24,312,2,8,0;-24,360,2,8,0;-24,408,2,8,0;-72,264,1,8,0;-72,696,1,8,0;-96,336,3,8,0;-96,432,4,8,0;-96,528,7,8,0;-120,264,1,8,0;-120,648,1,8,0;-72,-24,2,8,0;-72,-72,1,8,0;-24,-72,1,8,0;24,-72,2,8,0;600,-120,1,8,0;240,-144,6,8,0;336,-144,8,8,0;432,-144,4,8,0;528,-144,7,8,0;-168,-72,1,8,0;-168,552,0,8,0;648,-168,1,8,0;72,-216,1,8,0;-192,288,6,8,0;-192,384,6,8,0;-192,480,8,8,0;-216,72,1,8,0;-216,216,1,8,0;-216,552,0,8,0;-216,600,1,8,0;288,-240,8,8,0;384,-240,8,8,0;480,-240,8,8,0;-168,-264,1,8,0;-240,-96,3,8,0;-240,144,6,8,0;-264,648,1,8,0;-240,-288,6,8,0;-48,-288,3,8,0;192,-288,6,8,0;24,-312,2,8,0;456,-312,0,8,0;504,-312,0,8,0;-288,-192,6,8,0;-288,240,6,8,0;-288,336,6,8,0;-288,432,3,8,0;-288,528,8,8,0;-312,-264,0,8,0;-312,-24,2,8,0;-312,600,0,8,0;-312,648,1,8,0;-312,696,1,8,0;-336,-96,4,8,0;-336,144,4,8,0;-336,-336,6,8,0;-144,-336,3,8,0;96,-336,3,8,0;288,-336,6,8,0;384,-336,8,8,0;576,-336,3,8,0;-360,-264,0,8,0;-360,408,0,8,0;-360,456,0,8,0;-360,600,0,8,0;-360,648,1,8,0;-360,696,1,8,0;24,-360,2,8,0;-384,-192,4,8,0;-384,240,4,8,0;-384,336,3,8,0;-384,528,7,8,0;-408,648,1,8,0;-240,-384,4,8,0;-48,-384,4,8,0;192,-384,4,8,0;480,-384,3,8,0;-432,-384,3,8,0;-432,-288,3,8,0;-432,-96,7,8,0;-432,144,7,8,0;-432,432,4,8,0;-456,504,0,8,0;-456,552,0,8,0;-456,600,1,8,0;-336,-432,3,8,0;-144,-432,4,8,0;96,-432,4,8,0;288,-432,4,8,0;384,-432,3,8,0;-480,-192,7,8,0;-480,240,7,8,0;-480,336,3,8,0;-432,-480,3,8,0;-240,-480,4,8,0;-48,-480,7,8,0;192,-480,7,8,0;480,-480,4,8,0;-504,-456,0,8,0;-504,-120,0,8,0;-504,120,1,8,0;-504,168,1,8,0;-504,504,0,8,0;-504,552,1,8,0;-504,-504,1,8,0;552,-504,0,8,0;-528,-384,3,8,0;-528,-288,7,8,0;-528,432,4,8,0;-552,-456,1,8,0;-552,-120,1,8,0;-552,216,1,8,0;-552,504,1,8,0;-576,336,7,8,0;-600,-408,1,8,0;-600,-360,0,8,0;-600,-312,0,8,0;-600,-72,1,8,0;-600,264,1,8,0;-600,408,0,8,0;-600,456,1,8,0;-648,-312,1,8,0;-648,312,1,8,0;-648,360,1,8,0;-648,408,1,8,0;-336,-528,4,8,0;-144,-528,7,8,0;96,-528,7,8,0;288,-528,7,8,0;384,-528,4,8,0;-456,-552,1,8,0;-408,-552,0,8,0;-72,-552,0,8,0;216,-552,1,8,0;-240,-576,7,8,0;-408,-600,1,8,0;-72,-600,1,8,0;72,-600,0,8,0;120,-600,1,8,0;264,-600,1,8,0;312,-600,0,8,0;384,-624,7,8,0;-360,-648,1,8,0;-312,-648,1,8,0;-264,-648,0,8,0;-24,-648,1,8,0;312,-648,1,8,0;456,-648,1,8,0;-312,-696,1,8,0;-264,-696,1,8,0;480,-576,4,8,0;504,-648,1,8,0;552,-600,1,8,0;600,-552,1,8,0;648,-504,1,8,0;384,192,4,8,0;168,-552,1,8,0;-120,-600,1,8,0;-168,-600,1,8,0;-216,-648,1,8,0;-168,600,1,8,0;-120,600,0,8,0;-552,-168,1,8,0;-600,-24,2,8,0;72,-648,1,8,0;-216,-168,1,8,0;-168,72,1,8,0;-72,168,1,8,0;-72,216,1,8,0;72,168,1,8,0;576,-240,6,8,0;576,-432,6,8,0;120,-264,0,8,0;216,312,1,8,0;24,-264,2,8,0;72,-264,1,8,0;-528,-48,9,8,0;-264,-24,2,8,0;576,0,9,8,0;-552,24,0,8,0;264,24,2,8,0;312,24,2,8,0;-480,48,7,8,0;-384,48,4,8,0;-288,48,3,8,0;0,-576,9,8,0;-552,72,1,8,0;240,96,6,8,0;336,96,3,8,0;432,96,4,8,0;528,96,7,8,0;600,72,0,8,0;48,576,7,8,0;-48,624,9,8,0;24,648,0,8,0;-24,696,2,8,0;24,-648,2,8,0;648,24,2,8,0;648,72,1,8,0;24,696,1,8,0;72,-168,1,8,0;360,-696,1,8,0;408,-696,1,8,0;360,-744,1,8,0;504,504,1,8,0;168,-72,1,8,0;216,-216,1,8,0;-120,-264,0,8,0;-552,264,0,8,0;-552,-216,0,8,0;-600,-216,1,8,0;-648,-264,1,8,0;-600,-264,0,8,0;-72,24,1,8,0;72,-24,1,8,0;72,-72,1,8,0;696,-456,0,8,0;696,-408,0,8,0;696,-360,0,8,0;696,-312,0,8,0;696,-264,0,8,0;696,-216,0,8,0;744,-408,0,8,0;744,-360,0,8,0;744,-312,0,8,0;744,-264,0,8,0;792,-360,0,8,0;792,-312,0,8,0;-600,24,1,8,0;648,-456,0,8,0;648,-408,0,8,0;648,-360,0,8,0;648,-312,0,8,0;648,-264,0,8,0;648,-216,0,8,0;-216,-216,0,8,0;-264,600,0,8,0;-408,600,0,8,0;-312,-600,0,8,0;600,-168,0,8,0;72,216,1,8,0;168,72,1,8,0;-72,-216,1,8,0;-72,-168,1,8,0;-360,-600,0,8,0;600,-504,0,8,0;552,-552,0,8,0;-72,72,1,8,0;72,-120,1,1,0;120,-120,1,1,0;120,-72,1,1,0;120,-24,1,1,0;120,72,1,1,0;120,120,1,1,0;72,120,1,1,0;24,120,1,1,0;-72,120,1,1,0;-120,120,1,1,0;-120,72,1,1,0;-120,24,1,1,0;-120,-72,1,1,0;-120,-120,1,1,0;-72,-120,1,1,0;-24,-120,1,1,0;0,192,9,1,0;192,0,9,1,0;0,-192,9,1,0;-192,0,9,1,0;'


sirrMXB = decodeBuildingsData(localStorage["xyz.15001wavebasewithmaze"]);
localStorage.scwt = "1";
sirrMXBArr = Object.values(sirrMXB);
let absmb = false;
let ausmb = false;
let adsmb = false;
let ansmb = false;
window.recordBase = (basename) => {
    let str = "";
    if (gs) {
        activeBuildingsByPos.forEach(e => {
            str += encodeBuildingData(e.x - gs.x, e.y - gs.y, e.type, e.tier, e.yaw | 0);
        })
        localStorage["xyz." + basename] = str;
        game.ui.components.PopupOverlay.showHint("Successfully recorded base!");
    } else {
        game.ui.components.PopupOverlay.showHint("Oops! You haven't placed stash yet or it was killed (if yes so rip).");
    }
}
window.targetRecordedBase = (basename) => {
    if (basename) {
        if (localStorage["xyz." + basename]) {
            sirrMXB = decodeBuildingsData(localStorage["xyz." + basename]);
            sirrMXBArr = Object.values(sirrMXB);
            localbuildingUpdate();
            let a = document.getElementsByClassName("targetbasetext")[0].innerText.split(" ");
            a[1] = basename;
            let b = a.join(" ");
            document.getElementsByClassName("targetbasetext")[0].innerText = b;
        } else {
            game.ui.components.PopupOverlay.showHint("Oops! name doesn't exist.");
        };
    } else {
        game.ui.components.PopupOverlay.showHint("Oops! name doesn't exist.");
    }
}
window.buildTargetedBase = () => {
    if (gs) {
        localbuildingUpdate();
        rebuilder.forEach(e => {
            if (Math.abs(myPlayer.position.y - (e.y + gs.y)) < 576 && Math.abs(myPlayer.position.x - (e.x + gs.x)) < 576) {
                game.network.socket.send(e.buffer);
            }
        })
        game.ui.components.PopupOverlay.showHint("Successfully built targeted base!");
    } else {
        game.ui.components.PopupOverlay.showHint("Oops! You haven't placed stash yet or it was killed (if yes so rip).");
    }
}
window.deleteRecordedBase = (basename) => {
    if (localStorage["xyz." + basename]) {
        game.ui.components.PopupOverlay.showHint("Successfully deleted recorded base!");
        delete localStorage["xyz." + basename];
    } else {
        game.ui.components.PopupOverlay.showHint("Oops! Looks like base is invalid or already deleted.");
    }
}
let gs;
let gsUid;
let sellOnce_1;
let sellOnce_2;

setInterval(() => {
    if (game.network.socket) {
        if (game.network.socket.readyState !== 1) {
            if (disconnectalarm) {
                !onlyOpenOnceOnTimeout && (onlyOpenOnceOnTimeout = true, videoalert(), setTimeout(() => { onlyOpenOnceOnTimeout = false }, 29000))
            }
        }
    }
}, 500)
let isOnOrNot = false;
let stashhitalarm = false;
let deadalarm = false;
let disconnectalarm = false;
let health65palarm = false;
let health80ptoweralarm = false;
let twokpingalarm = false;
onlyOpenOnceOnTimeout = false;

game.network.addRpcHandler("LocalBuilding", e => {
    e.forEach(r => {
        if (r.dead) {
            if (r.type !== "Wall" && r.type !== "Door") {
                if (isOnOrNot) {
                    !onlyOpenOnceOnTimeout && (onlyOpenOnceOnTimeout = true, videoalert(), setTimeout(() => { onlyOpenOnceOnTimeout = false }, 14000))
                }
            }
        }
    })
})

game.network.addPingHandler(() => {
    if (twokpingalarm) {
        let ping = game.network.ping * 2;
        if (ping > 2000) {
            !onlyOpenOnceOnTimeout && (onlyOpenOnceOnTimeout = true, videoalert(), setTimeout(() => { onlyOpenOnceOnTimeout = false }, 30000));
        }
    }
})
game.network.addRpcHandler("Dead", () => {
    if (deadalarm) {
        !onlyOpenOnceOnTimeout && (onlyOpenOnceOnTimeout = true, videoalert(), setTimeout(() => { onlyOpenOnceOnTimeout = false }, 14000))
    }
})
//let a = new Audio();
//a.src = "https://media.discordapp.net/attachments/776401978414727179/865225219651403816/Rick_Roll_Different_link_no_ads.mp4"
//videoalert = () => {
//    a.play();
//}

alarm = () => {
    isOnOrNot = !isOnOrNot;

    document.getElementsByClassName("alarm")[0].innerText = document.getElementsByClassName("alarm")[0].innerText.replace(isOnOrNot ? "Enable" : "Disable", isOnOrNot ? "Disable" : "Enable");

    document.getElementsByClassName("alarm")[0].className = document.getElementsByClassName("alarm")[0].className.replace(isOnOrNot ? "green" : "red", isOnOrNot ? "red" : "green");

}

stashHitAlarm = () => {
    stashhitalarm = !stashhitalarm;

    document.getElementsByClassName("stashHitAlarm")[0].innerText = document.getElementsByClassName("stashHitAlarm")[0].innerText.replace(stashhitalarm ? "Enable" : "Disable", stashhitalarm ? "Disable" : "Enable");

    document.getElementsByClassName("stashHitAlarm")[0].className = document.getElementsByClassName("stashHitAlarm")[0].className.replace(stashhitalarm ? "green" : "red", stashhitalarm ? "red" : "green");

}

deadAlarm = () => {
    deadalarm = !deadalarm;

    document.getElementsByClassName("deadAlarm")[0].innerText = document.getElementsByClassName("deadAlarm")[0].innerText.replace(deadalarm ? "Enable" : "Disable", deadalarm ? "Disable" : "Enable");

    document.getElementsByClassName("deadAlarm")[0].className = document.getElementsByClassName("deadAlarm")[0].className.replace(deadalarm ? "green" : "red", deadalarm ? "red" : "green");

}

disconnectAlarm = () => {
    disconnectalarm = !disconnectalarm;

    document.getElementsByClassName("disconnectAlarm")[0].innerText = document.getElementsByClassName("disconnectAlarm")[0].innerText.replace(disconnectalarm ? "Enable" : "Disable", disconnectalarm ? "Disable" : "Enable");

    document.getElementsByClassName("disconnectAlarm")[0].className = document.getElementsByClassName("disconnectAlarm")[0].className.replace(disconnectalarm ? "green" : "red", disconnectalarm ? "red" : "green");

}

health65pAlarm = () => {
    health65palarm = !health65palarm;

    document.getElementsByClassName("health65pAlarm")[0].innerText = document.getElementsByClassName("health65pAlarm")[0].innerText.replace(health65palarm ? "Enable" : "Disable", health65palarm ? "Disable" : "Enable");

    document.getElementsByClassName("health65pAlarm")[0].className = document.getElementsByClassName("health65pAlarm")[0].className.replace(health65palarm ? "green" : "red", health65palarm ? "red" : "green");

}

health65pAlarm = () => {
    health65palarm = !health65palarm;

    document.getElementsByClassName("health65pAlarm")[0].innerText = document.getElementsByClassName("health65pAlarm")[0].innerText.replace(health65palarm ? "Enable" : "Disable", health65palarm ? "Disable" : "Enable");

    document.getElementsByClassName("health65pAlarm")[0].className = document.getElementsByClassName("health65pAlarm")[0].className.replace(health65palarm ? "green" : "red", health65palarm ? "red" : "green");

}

health80ptowerAlarm = () => {
    health80ptoweralarm = !health80ptoweralarm;

    document.getElementsByClassName("health80ptowerAlarm")[0].innerText = document.getElementsByClassName("health80ptowerAlarm")[0].innerText.replace(health80ptoweralarm ? "Enable" : "Disable", health80ptoweralarm ? "Disable" : "Enable");

    document.getElementsByClassName("health80ptowerAlarm")[0].className = document.getElementsByClassName("health80ptowerAlarm")[0].className.replace(health80ptoweralarm ? "green" : "red", health80ptoweralarm ? "red" : "green");

}

health80ptowerAlarm = () => {
    health80ptoweralarm = !health80ptoweralarm;

    document.getElementsByClassName("health80ptowerAlarm")[0].innerText = document.getElementsByClassName("health80ptowerAlarm")[0].innerText.replace(health80ptoweralarm ? "Enable" : "Disable", health80ptoweralarm ? "Disable" : "Enable");

    document.getElementsByClassName("health80ptowerAlarm")[0].className = document.getElementsByClassName("health80ptowerAlarm")[0].className.replace(health80ptoweralarm ? "green" : "red", health80ptoweralarm ? "red" : "green");

}

twokpingAlarm = () => {
    twokpingalarm = !twokpingalarm;

    document.getElementsByClassName("twokpingAlarm")[0].innerText = document.getElementsByClassName("twokpingAlarm")[0].innerText.replace(twokpingalarm ? "Enable" : "Disable", twokpingalarm ? "Disable" : "Enable");

    document.getElementsByClassName("twokpingAlarm")[0].className = document.getElementsByClassName("twokpingAlarm")[0].className.replace(twokpingalarm ? "green" : "red", twokpingalarm ? "red" : "green");

}

autosellScript = () => {
    autoSellPermVerifiedPpl = !autoSellPermVerifiedPpl;
    document.getElementsByClassName("autosellScript")[0].innerText = document.getElementsByClassName("autosellScript")[0].innerText.replace(autoSellPermVerifiedPpl ? "Enable" : "Disable", autoSellPermVerifiedPpl ? "Disable" : "Enable");

    document.getElementsByClassName("autosellScript")[0].className = document.getElementsByClassName("autosellScript")[0].className.replace(autoSellPermVerifiedPpl ? "green" : "red", autoSellPermVerifiedPpl ? "red" : "green");

};

!window.lastScore && (lastScore = myPlayer.score || 0);
!window.lastid && (lastid = 0);
!window.highestspw && (highestspw = 0);
!window.lastms && (lastms = Date.now());
!window.scoreData && (scoreData = []);
!window.lastwave && (lastwave = 0);
scoreStats = () => {
    return { id: lastid, wave: counter(myPlayer.wave), score: counter(myPlayer.score), spw: counter(myPlayer.score - lastScore), hspw: (myPlayer.score - lastScore) > highestspw ? counter(myPlayer.score - lastScore) : counter(highestspw), ticker: Math.round((Date.now() - lastms) / 1000) };
}

document.getElementsByClassName("hud-settings-grid")[0].innerHTML += `
<button class="btn btn-green alarm" onclick="alarm();">Enable Tower Destroy Alarm</button>
<br>
<button class="btn btn-green stashHitAlarm" onclick="stashHitAlarm();">Enable Stash Damage Alarm</button>
<br>
<button class="btn btn-green deadAlarm" onclick="deadAlarm();">Enable Player Death Alarm</button>
<br>
<button class="btn btn-green disconnectAlarm" onclick="disconnectAlarm();">Enable Disconnect Alarm</button>
<br>
<button class="btn btn-green health65pAlarm" onclick="health65pAlarm();">Enable 65% Player Health Alarm</button>
<br>
<button class="btn btn-green health80ptowerAlarm" onclick="health80ptowerAlarm();">Enable 80% Tower Health Alarm</button>
<br>
<button class="btn btn-green twokpingAlarm" onclick="twokpingAlarm();">Enable 2k Ping Alarm</button>
`;

game.network.addRpcHandler("ReceiveChatMessage", e => {
    if (e.message == lyrics[thislyric] && e.uid == game.world.myUid) {
        thislyric = (thislyric + 1) % lyrics.length;
    }
})

let s = {};
let playerX = -1;
let playerY = -1;
let yaw = 0;

function mover(e, type = "name", uid) {
    let isActive = e.get(uid);
    if (isActive) {
        let player = entities.get(uid);
        if (player) {
            playerX = player.targetTick.position.x;
            playerY = player.targetTick.position.y;
        }
        if (isActive) {
            yaw = isActive.yaw;
            myPlayer.yyaw = yaw;
        }
    }
    s.playerX = playerX;
    s.playerY = playerY;
    if (yaw) {
        s.isYaw = true;
        if (yaw == 90) {
            sendPacket(3, { right: 1, left: 0, up: 0, down: 0 })
            for (let i in sockets) {
                sockets[i].sendPacket(3, { right: 1, left: 0, up: 0, down: 0 })
            }
        }
        if (yaw == 225) {
            sendPacket(3, { down: 1, left: 1, up: 0, right: 0 })
            for (let i in sockets) {
                sockets[i].sendPacket(3, { down: 1, left: 1, up: 0, right: 0 })
            }
        }
        if (yaw == 44) {
            sendPacket(3, { down: 0, left: 0, up: 1, right: 1 })
            for (let i in sockets) {
                sockets[i].sendPacket(3, { down: 0, left: 0, up: 1, right: 1 })
            }
        }
        if (yaw == 314) {
            sendPacket(3, { down: 0, left: 1, up: 1, right: 0 })
            for (let i in sockets) {
                sockets[i].sendPacket(3, { down: 0, left: 1, up: 1, right: 0 })
            }
        }
        if (yaw == 135) {
            sendPacket(3, { down: 1, left: 0, up: 0, right: 1 })
            for (let i in sockets) {
                sockets[i].sendPacket(3, { down: 1, left: 0, up: 0, right: 1 })
            }
        }
        if (yaw == 359) {
            sendPacket(3, { up: 1, down: 0, right: 0, left: 0 })
            for (let i in sockets) {
                sockets[i].sendPacket(3, { up: 1, down: 0, right: 0, left: 0 })
            }
        }
        if (yaw == 180) {
            sendPacket(3, { down: 1, up: 0, right: 0, left: 0 })
            for (let i in sockets) {
                sockets[i].sendPacket(3, { down: 1, up: 0, right: 0, left: 0 })
            }
        }
        if (yaw == 270) {
            sendPacket(3, { left: 1, right: 0, up: 0, down: 0 })
            for (let i in sockets) {
                sockets[i].sendPacket(3, { left: 1, right: 0, up: 0, down: 0 })
            }
        }
    }
    if (!yaw) {
        if (s.isYaw) {
            s.isYaw = false;
            sendPacket(3, { right: 0, left: 0, up: 0, down: 0 })
            for (let i in sockets) {
                sockets[i].sendPacket(3, { right: 0, left: 0, up: 0, down: 0 })
            }
        }
    }
    if (myPlayer.position) {
        if (myPlayer.position.y - s.playerY > 100 || Math.sqrt(Math.pow((myPlayer.position.y - s.playerY), 2) + Math.pow((myPlayer.position.x - s.playerX), 2)) < 100) {
            if (!s.stopped) {
                s.isYaw = true;
            }
        } else {
            s.stopped = false;
            if (!yaw) {
                sendPacket(3, { down: 1 })
                for (let i in sockets) {
                    sockets[i].sendPacket(3, { down: 1 })
                }
            }
        }
        if (-myPlayer.position.y + s.playerY > 100 || Math.sqrt(Math.pow((myPlayer.position.y - s.playerY), 2) + Math.pow((myPlayer.position.x - s.playerX), 2)) < 100) {
            if (!s.stopped) {
                s.isYaw = true;
            }
        } else {
            s.stopped = false;
            if (!yaw) {
                sendPacket(3, { up: 1 })
                for (let i in sockets) {
                    sockets[i].sendPacket(3, { up: 1 })
                }
            }
        }
        if (-myPlayer.position.x + s.playerX > 100 || Math.sqrt(Math.pow((myPlayer.position.y - s.playerY), 2) + Math.pow((myPlayer.position.x - s.playerX), 2)) < 100) {
            if (!s.stopped) {
                s.isYaw = true;
            }
        } else {
            s.stopped = false;
            if (!yaw) {
                sendPacket(3, { left: 1 })
                for (let i in sockets) {
                    sockets[i].sendPacket(3, { left: 1 })
                }
            }
        }
        if (myPlayer.position.x - s.playerX > 100 || Math.sqrt(Math.pow((myPlayer.position.y - s.playerY), 2) + Math.pow((myPlayer.position.x - s.playerX), 2)) < 100) {
            if (!s.stopped) {
                s.isYaw = true;
            }
        } else {
            s.stopped = false;
            if (!yaw) {
                sendPacket(3, { right: 1 })
                for (let i in sockets) {
                    sockets[i].sendPacket(3, { right: 1 })
                }
            }
        }
        if (Math.sqrt(Math.pow((myPlayer.position.y - s.playerY), 2) + Math.pow((myPlayer.position.x - s.playerX), 2)) < 100) s.stopped = true;
    }
}

let getElement = (Element) => {
    return document.getElementsByClassName(Element);
}
let getId = (Element) => {
    return document.getElementById(Element);
}
getElement("hud-party-members")[0].style.display = "block";
getElement("hud-party-grid")[0].style.display = "none";
let privateTab = document.createElement("a");
privateTab.className = "hud-party-tabs-link";
privateTab.id = "privateTab";
privateTab.innerHTML = "Closed Parties";
let privateHud = document.createElement("div");
privateHud.className = "hud-private hud-party-grid";
privateHud.id = "privateHud";
privateHud.style = "display: none;";
getElement("hud-party-tabs")[0].appendChild(privateTab);
getElement("hud-menu hud-menu-party")[0].insertBefore(privateHud, getElement("hud-party-actions")[0]);
let keyTab = document.createElement("a");
keyTab.className = "hud-party-tabs-link";
keyTab.id = "keyTab";
keyTab.innerHTML = "Keys";
getElement("hud-party-tabs")[0].appendChild(keyTab);
let keyHud = document.createElement("div");
keyHud.className = "hud-keys hud-party-grid";
keyHud.id = "keyHud";
keyHud.style = "display: none;";
getElement("hud-menu hud-menu-party")[0].insertBefore(keyHud, getElement("hud-party-actions")[0]);
getId("privateTab").onclick = e => {
    for (let i = 0; i < getElement("hud-party-tabs-link").length; i++) {
        getElement("hud-party-tabs-link")[i].className = "hud-party-tabs-link";
    }
    getId("privateTab").className = "hud-party-tabs-link is-active";
    getId("privateHud").setAttribute("style", "display: block;");
    if (getElement("hud-party-members")[0].getAttribute("style") == "display: block;") {
        getElement("hud-party-members")[0].setAttribute("style", "display: none;");
    }
    if (getElement("hud-party-grid")[0].getAttribute("style") == "display: block;") {
        getElement("hud-party-grid")[0].setAttribute("style", "display: none;");
    }
    if (getId("privateHud").getAttribute("style") == "display: none;") {
        getId("privateHud").setAttribute("style", "display: block;");
    }
    if (getId("keyHud").getAttribute("style") == "display: block;") {
        getId("keyHud").setAttribute("style", "display: none;");
    }
}
getElement("hud-party-tabs-link")[0].onmouseup = e => {
    getId("privateHud").setAttribute("style", "display: none;");
    getId("keyHud").setAttribute("style", "display: none;");
    if (getId("privateTab").className == "hud-party-tabs-link is-active") {
        getId("privateTab").className = "hud-party-tabs-link"
    }
    if (getId("keyTab").className == "hud-party-tabs-link is-active") {
        getId("keyTab").className = "hud-party-tabs-link"
    }
}
getElement("hud-party-tabs-link")[1].onmouseup = e => {
    getId("privateHud").setAttribute("style", "display: none;");
    getId("keyHud").setAttribute("style", "display: none;");
    if (getId("privateTab").className == "hud-party-tabs-link is-active") {
        getId("privateTab").className = "hud-party-tabs-link"
    }
    if (getId("keyTab").className == "hud-party-tabs-link is-active") {
        getId("keyTab").className = "hud-party-tabs-link"
    }
}
getId("keyTab").onmouseup = e => {
    for (let i = 0; i < getElement("hud-party-tabs-link").length; i++) {
        getElement("hud-party-tabs-link")[i].className = "hud-party-tabs-link";
    }
    getId("keyTab").className = "hud-party-tabs-link is-active";
    getId("keyHud").setAttribute("style", "display: block;");
    if (getElement("hud-party-members")[0].getAttribute("style") == "display: block;") {
        getElement("hud-party-members")[0].setAttribute("style", "display: none;");
    }
    if (getElement("hud-party-grid")[0].getAttribute("style") == "display: block;") {
        getElement("hud-party-grid")[0].setAttribute("style", "display: none;");
    }
    if (getId("privateHud").getAttribute("style") == "display: block;") {
        getId("privateHud").setAttribute("style", "display: none;");
    }
    if (getId("keyHud").getAttribute("style") == "display: none;") {
        getId("keyHud").setAttribute("style", "display: block;");
    }
}
let num = 0;
Game.currentGame.network.addRpcHandler("PartyShareKey", e => {
    let el = document.createElement('div');
    el.innerText = e.partyShareKey;
    el.className = `tag${num++}`;
    document.getElementsByClassName('hud-keys hud-party-grid')[0].appendChild(el);
    document.getElementsByClassName(`${el.className}`)[0].addEventListener('click', e => {
        game.network.sendRpc({ name: "JoinPartyByShareKey", partyShareKey: el.innerText });
    })
});
let parties = "";
let players = 0;
let oldPlayers = 0;
Game.currentGame.network.addRpcHandler("SetPartyList", _e => {
    players = 0;
    parties = "";
    _e.forEach(e => {
        players += e.memberCount;
        if (e.isOpen == 0) {
            parties += "<div style=\"width: relative; height: relative;\" class=\"hud-party-link is-disabled\"><strong>" + Sanitize(e.partyName) + "</strong><span>" + e.memberCount + "/4<span></div>";
        }
    })
    if (window.scripts.detectPlayers && oldPlayers !== players) {
        oldPlayers = players;
        game.ui.components.PopupOverlay.showHint(`There are ${players} players in the server.`);
    }
    getId("privateHud").innerHTML = parties;
});
isAllowedToGrabLb = true;

let count = 0;
let spinifdisabled;
let nearestAltMouse = {};

let socketObjects = {};
let shouldSendFromSession = true;
let preIds = 0;
window.sendAlt = (joinParty = true) => {
    let ws = new WebSocket(`wss://${game.options.servers[game.options.serverId].host}:443/`);
    let bot = { ws: ws };
    let id;
    ws.binaryType = "arraybuffer";
    let network = new game.networkType();
    bot.uidType = game.world.myUid;
    bot.network = network;
    let codec = network.codec;
    bot.sendPacket = (event, data) => ws.readyState == 1 && ws.send(codec.encode(event, data));
    network.sendPing = () => ws.send(new Uint8Array([7, 0]));
    bot.world = {};
    bot.activeBuildingsByPos = new Map();
    bot.buildings = {};
    bot.buildingsSaved = {};
    bot.inventory = {};
    bot.entities = new Map();
    bot.myPlayer = {};
    bot.myPet = {};
    bot.buildingUids_1 = {};
    bot.preId = preIds++;
    bot.Module = wasmmodule();
    let rpcs = (data) => {
        if (data.name == "LocalBuilding") {
            data.response.forEach(e => {
                if (bot.buildingUids_1[e.uid]) {
                    return;
                }
                if (e.dead && !bot.buildingUids_1[e.uid]) {
                    bot.buildingUids_1[e.uid] = 1;
                    setTimeout(() => {
                        delete bot.buildingUids_1[e.uid];
                    }, 500)
                }
                if (e.type == "GoldStash") {
                    bot.gs = e;
                }
                if (e.type == "GoldStash" && e.dead) {
                    bot.gs = undefined;
                }
                let index = getEntitiesInGrid(e.x, e.y);
                bot.activeBuildingsByPos.set(index, e);
                if (bot.activeBuildingsByPos.get(index).dead) bot.activeBuildingsByPos.delete(index);
                e.type == "Harvester" && (bot.buildingsSaved[index] = e);
            })
        }
        if (data.name == "PartyShareKey") {
            bot.psk = data;
        }
        if (data.name == "Dead") {
            bot.thisWeapon = "Pickaxe";
            bot.sendPacket(9, { name: "BuyItem", itemName: "HatHorns", tier: 1 });
            if (scripts.socketFollowMouse && !scripts.wasd) {
                bot.reversedYaw = true;
                setTimeout(() => {
                    bot.reversedYaw = false;
                }, 500)
            }
        }
        if (data.name == "SetItem") {
            bot.inventory[data.response.itemName] = data.response;
            if (bot.inventory.HatHorns) {
                if (!bot.inventory.HatHorns.stacks) {
                    bot.sendPacket(9, { name: "BuyItem", itemName: "HatHorns", tier: 1 });
                }
            }
            if (!bot.inventory[data.response.itemName].stacks) {
                delete bot.inventory[data.response.itemName];
            }
            if (data.response.itemName == "ZombieShield" && data.response.stacks) {
                bot.sendPacket(9, { name: "EquipItem", itemName: "ZombieShield", tier: data.response.tier })
            }
        }
        if (data.name == "PartyInfo") {
            let response = data.response;
            if (response[0].playerUid == bot.uid) {
                response.forEach(e => {
                    if ((e.playerUid == game.world.myUid || socketsByUid[e.playerUid]) && !e.canSell) {
                        bot.sendPacket(9, { name: "SetPartyMemberCanSell", uid: e.playerUid, canSell: 1 });
                    }
                })
            }
        }
    }
    let onEnterWorld = (data) => {
        bot.world = { players: data.players, allowed: data.allowed };
        players = data.players;
        if (window.scripts.detectPlayers) {
            oldPlayers = players;
            game.ui.components.PopupOverlay.showHint(`There are ${players} players in the server.`);
        }
        bot.myPlayer.uid = data.uid;

        bot.myPlayer.position = { x: 0, y: 0 }
        bot.uid = data.uid;
        bot.join = (psk) => {
            bot.sendPacket(9, { name: "JoinPartyByShareKey", partyShareKey: psk + "" });
        }
        bot.leave = () => {
            bot.sendPacket(9, { name: "LeaveParty" });
        }
        bot.buy = (e, t) => {
            bot.sendPacket(9, { name: "BuyItem", itemName: e, tier: t });
        }
        bot.equip = (e, t) => {
            bot.sendPacket(9, { name: "EquipItem", itemName: e, tier: t });
        }
        bot.kick = (uid) => {
            bot.sendPacket(9, { name: "KickParty", uid: uid });
        }
        bot.timeout = () => {
            bot.buy("Pause", 1);
        }
        if (data.allowed) {
            sockets[id] = bot;
            socketsByUid[bot.uid] = bot;
            bot.id = id;
            joinParty && bot.sendPacket(9, { name: "JoinPartyByShareKey", partyShareKey: game.ui.playerPartyShareKey });
            bot.sendPacket(9, { name: "BuyItem", itemName: "HatHorns", tier: 1 });
            bot.sendPacket(9, { name: "BuyItem", itemName: "PetCARL", tier: 1 });
            bot.sendPacket(9, { name: "EquipItem", itemName: "PetCARL", tier: 1 });
            bot.sendPacket(9, { name: "BuyItem", itemName: "PetMiner", tier: 1 });
            bot.sendPacket(3, { space: 1 });
            function loadLbPacket() {
                for (let i = 0; i < 50; i++) ws.send(new Uint8Array([3, 17, 123, 34, 117, 112, 34, 58, 49, 44, 34, 100, 111, 119, 110, 34, 58, 48, 125]));
                ws.send(new Uint8Array([7, 0]));
                ws.send(new Uint8Array([9, 6, 0, 0, 0, 126, 8, 0, 0, 108, 27, 0, 0, 146, 23, 0, 0, 82, 23, 0, 0, 8, 91, 11, 0, 8, 91, 11, 0, 0, 0, 0, 0, 32, 78, 0, 0, 76, 79, 0, 0, 172, 38, 0, 0, 120, 155, 0, 0, 166, 39, 0, 0, 140, 35, 0, 0, 36, 44, 0, 0, 213, 37, 0, 0, 100, 0, 0, 0, 120, 55, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 134, 6, 0, 0]));
            };
            loadLbPacket();
            game.ui.components.Map.onPartyMembersUpdate(partyInfoAlt);
        }
    }
    let playerX = -1;
    let playerY = -1;
    let yaw = 0;
    let s = {};
    scripts.me = 1;
    bot.rounds = 999999999999999;
    bot.depositAhrc = (tick) => {
        Object.values(bot.buildingsSaved).forEach(e => {
            if (e.tier == tick.tier) {
                bot.sendPacket(9, { name: "AddDepositToHarvester", uid: e.uid, deposit: tick.deposit })
            }
        })
    }
    bot.collectAhrc = (tick) => {
        Object.values(bot.buildingsSaved).forEach(e => {
            if (e.tier == tick.tier) {
                bot.sendPacket(9, { name: "CollectHarvester", uid: e.uid })
            }
        })
    }
    bot.mover = function (e, type = "name", uid = bot.uidType) {
        let isActive = e.get(uid);
        if (isActive) {
            yaw = isActive.yaw;
            if (isActive) {
                playerX = isActive.position.x;
                playerY = isActive.position.y;
            }
        } else {
            if (scripts.me) {
                yaw = myPlayer.yyaw;
                if (!isActive) {
                    playerX = myPlayer.position.x;
                    playerY = myPlayer.position.y;
                }
            }
        }
        s.playerX = playerX;
        s.playerY = playerY;
        if (yaw) {
            s.isYaw = true;
            if (yaw == 90) {
                bot.sendPacket(3, { right: 1, left: 0, up: 0, down: 0 })
            }
            if (yaw == 225) {
                bot.sendPacket(3, { down: 1, left: 1, up: 0, right: 0 })
            }
            if (yaw == 44) {
                bot.sendPacket(3, { down: 0, left: 0, up: 1, right: 1 })
            }
            if (yaw == 314) {
                bot.sendPacket(3, { down: 0, left: 1, up: 1, right: 0 })
            }
            if (yaw == 135) {
                bot.sendPacket(3, { down: 1, left: 0, up: 0, right: 1 })
            }
            if (yaw == 359) {
                bot.sendPacket(3, { up: 1, down: 0, right: 0, left: 0 })
            }
            if (yaw == 180) {
                bot.sendPacket(3, { down: 1, up: 0, right: 0, left: 0 })
            }
            if (yaw == 270) {
                bot.sendPacket(3, { left: 1, right: 0, up: 0, down: 0 })
            }
        }
        if (!yaw) {
            if (s.isYaw) {
                s.isYaw = false;
                bot.sendPacket(3, { right: 0, left: 0, up: 0, down: 0 })
            }
        }
        if (bot.myPlayer.position) {
            if (bot.aiming) {
                let yaw = angleTo(bot.myPlayer.position.x, bot.myPlayer.position.y, s.playerX, s.playerY);
                bot.sendPacket(3, { mouseDown: yaw });
                ((bot.myPlayer.uid == game.world.myUid) && (game.inputPacketCreator.lastAnyYaw = yaw))
            };
            if (bot.myPlayer.position.y - s.playerY > 100 || Math.sqrt(Math.pow((bot.myPlayer.position.y - s.playerY), 2) + Math.pow((bot.myPlayer.position.x - s.playerX), 2)) < 100) {
                if (!bot.stopped) {
                    bot.isYaw = true;
                }
            } else {
                s.stopped = false;
                if (!yaw) bot.sendPacket(3, { down: 1 })
            }
            if (-bot.myPlayer.position.y + s.playerY > 100 || Math.sqrt(Math.pow((bot.myPlayer.position.y - s.playerY), 2) + Math.pow((bot.myPlayer.position.x - s.playerX), 2)) < 100) {
                if (!s.stopped) {
                    s.isYaw = true;
                }
            } else {
                s.stopped = false;
                if (!yaw) bot.sendPacket(3, { up: 1, down: 0 })
            }
            if (-bot.myPlayer.position.x + s.playerX > 100 || Math.sqrt(Math.pow((bot.myPlayer.position.y - s.playerY), 2) + Math.pow((bot.myPlayer.position.x - s.playerX), 2)) < 100) {
                if (!s.stopped) {
                    s.isYaw = true;
                }
            } else {
                s.stopped = false;
                if (!yaw) bot.sendPacket(3, { left: 1 })
            }
            if (bot.myPlayer.position.x - s.playerX > 100 || Math.sqrt(Math.pow((bot.myPlayer.position.y - s.playerY), 2) + Math.pow((bot.myPlayer.position.x - s.playerX), 2)) < 100) {
                if (!s.stopped) {
                    s.isYaw = true;
                }
            } else {
                s.stopped = false;
                if (!yaw) bot.sendPacket(3, { right: 1 })
            }
            if (Math.sqrt(Math.pow((bot.myPlayer.position.y - s.playerY), 2) + Math.pow((bot.myPlayer.position.x - s.playerX), 2)) < 100) s.stopped = true;
        }
    }
    let yaws = [];
    for (let i = 0; i < 360; i++) {
        yaws.push(i);
    }
    bot.a77 = null;
    bot.a77r = null;
    bot.moverbymouse = function (data, type = "name", pos, isMouseMoving = true, isPlayerMoving) {
        playerX = mouse.x;
        playerY = mouse.y;
        s.playerX = playerX;
        s.playerY = playerY;
        let aimingYaw1 = angleTo(bot.myPlayer.position.x, bot.myPlayer.position.y, mouse.x, mouse.y);
        if (isMouseMoving || isPlayerMoving) {
            yaw = aimToYaw(aimingYaw1);
        } else yaw = null;
        if (yaw) {
            if (!reversedYaw && !bot.reversedYaw) {
                bot.a77r != null && (bot.a77r = null);
                if (yaw == 90) {
                    if (bot.a77 != 90) {
                        bot.a77 = 90;
                        bot.sendPacket(3, { right: 1, left: 0, up: 0, down: 0 })
                    }
                }
                if (yaw == 225) {
                    if (bot.a77 != 225) {
                        bot.a77 = 225;
                        bot.sendPacket(3, { down: 1, left: 1, up: 0, right: 0 })
                    }
                }
                if (yaw == 44) {
                    if (bot.a77 != 44) {
                        bot.a77 = 44;
                        bot.sendPacket(3, { down: 0, left: 0, up: 1, right: 1 })
                    }
                }
                if (yaw == 314) {
                    if (bot.a77 != 314) {
                        bot.a77 = 314;
                        bot.sendPacket(3, { down: 0, left: 1, up: 1, right: 0 })
                    }
                }
                if (yaw == 135) {
                    if (bot.a77 != 135) {
                        bot.a77 = 135;
                        bot.sendPacket(3, { down: 1, left: 0, up: 0, right: 1 })
                    }
                }
                if (yaw == 359) {
                    if (bot.a77 != 359) {
                        bot.a77 = 359;
                        bot.sendPacket(3, { up: 1, down: 0, right: 0, left: 0 })
                    }
                }
                if (yaw == 180) {
                    if (bot.a77 != 180) {
                        bot.a77 = 180;
                        bot.sendPacket(3, { down: 1, up: 0, right: 0, left: 0 })
                    }
                }
                if (yaw == 270) {
                    if (bot.a77 != 270) {
                        bot.a77 = 270;
                        bot.sendPacket(3, { left: 1, right: 0, up: 0, down: 0 })
                    }
                }
            } else {
                bot.a77 != null && (bot.a77 = null);
                if (yaw == 90) {
                    if (bot.a77r != 90) {
                        bot.a77r = 90;
                        bot.sendPacket(3, { left: 1, right: 0, up: 0, down: 0 })
                    }
                }
                if (yaw == 225) {
                    if (bot.a77r != 225) {
                        bot.a77r = 225;
                        bot.sendPacket(3, { down: 0, left: 0, up: 1, right: 1 })
                    }
                }
                if (yaw == 44) {
                    if (bot.a77r != 44) {
                        bot.a77r = 44;
                        bot.sendPacket(3, { down: 1, left: 1, up: 0, right: 0 })
                    }
                }
                if (yaw == 314) {
                    if (bot.a77r != 314) {
                        bot.a77r = 314;
                        bot.sendPacket(3, { down: 1, left: 0, up: 0, right: 1 })
                    }
                }
                if (yaw == 135) {
                    if (bot.a77r != 135) {
                        bot.a77r = 135;
                        bot.sendPacket(3, { down: 0, left: 1, up: 1, right: 0 })
                    }
                }
                if (yaw == 359) {
                    if (bot.a77r != 359) {
                        bot.a77r = 359;
                        bot.sendPacket(3, { up: 0, down: 1, right: 0, left: 0 })
                    }
                }
                if (yaw == 180) {
                    if (bot.a77r != 180) {
                        bot.a77r = 180;
                        bot.sendPacket(3, { down: 0, up: 1, right: 0, left: 0 })
                    }
                }
                if (yaw == 270) {
                    if (bot.a77r != 270) {
                        bot.a77r = 270;
                        bot.sendPacket(3, { left: 0, right: 1, up: 0, down: 0 })
                    }
                }
            }
        }
    }
    let a76 = null;
    bot.moverbyrounds = function (data, type = "name", pos, isMouseMoving = true, isPlayerMoving) {
        let pos17 = RoundPlayer(bot.rounds);
        playerX = pos17.x;
        playerY = pos17.y;
        s.playerX = playerX;
        s.playerY = playerY;
        let aimingYaw1 = angleTo(bot.myPlayer.position.x, bot.myPlayer.position.y, pos17.x, pos17.y);
        if (isMouseMoving || isPlayerMoving) {
            yaw = aimToYaw(aimingYaw1);
        } else yaw = null;
        if (yaw) {
            if (yaw == 90) {
                if (a76 != 90) {
                    a76 = 90;
                    bot.sendPacket(3, { right: 1, left: 0, up: 0, down: 0 })
                }
            }
            if (yaw == 225) {
                if (a76 != 225) {
                    a76 = 225;
                    bot.sendPacket(3, { down: 1, left: 1, up: 0, right: 0 })
                }
            }
            if (yaw == 44) {
                if (a76 != 44) {
                    a76 = 44;
                    bot.sendPacket(3, { down: 0, left: 0, up: 1, right: 1 })
                }
            }
            if (yaw == 314) {
                if (a76 != 314) {
                    a76 = 314;
                    bot.sendPacket(3, { down: 0, left: 1, up: 1, right: 0 })
                }
            }
            if (yaw == 135) {
                if (a76 != 135) {
                    a76 = 135;
                    bot.sendPacket(3, { down: 1, left: 0, up: 0, right: 1 })
                }
            }
            if (yaw == 359) {
                if (a76 != 359) {
                    a76 = 359;
                    bot.sendPacket(3, { up: 1, down: 0, right: 0, left: 0 })
                }
            }
            if (yaw == 180) {
                if (a76 != 180) {
                    a76 = 180;
                    bot.sendPacket(3, { down: 1, up: 0, right: 0, left: 0 })
                }
            }
            if (yaw == 270) {
                if (a76 != 270) {
                    a76 = 270;
                    bot.sendPacket(3, { left: 1, right: 0, up: 0, down: 0 })
                }
            }
        }
        if (bot.myPlayer.position) {
            if (Math.sqrt(Math.pow((bot.myPlayer.position.y - s.playerY), 2) + Math.pow((bot.myPlayer.position.x - s.playerX), 2)) < 135) {
                reversedYaw && (bot.rounds = bot.rounds + 1)
                !reversedYaw && (bot.rounds = bot.rounds - 1)
            }
        }
    }
    function entitiesUpdater(e) {
        window.scripts.autoheal.autobuypotion && !window.scripts.xkey && bot.sendPacket(9, { name: "BuyItem", itemName: "HealthPotion", tier: 1 });
        (window.scripts.autorespawn || window.scripts.xkey) && bot.sendPacket(3, { respawn: 1 });
        e.forEach(e1 => {
            if (e1.model == "Tree" || e1.model == "Stone" || e1.model == "NeutralCamp") {
                !game.world.entities.get(e1.uid) && game.world.createEntity(toInclude({ model: e1.model, position: e1.position, uid: e1.uid }));
            }
            if (e1.model == "GamePlayer" || ((e1.model == "PetCARL" || e1.model == "PetMiner") && (e1.uid == e.get(bot.myPlayer.uid).petUid))) {
                if (bot.entities.get(e1.uid) == undefined) bot.entities.set(e1.uid, { uid: e1.uid, entityClass: e1.entityClass, model: e1.model, targetTick: e1 });
            }
            let e2 = bot.entities.get(e1.uid);
            if (e2) {
                addMissingTickFields(e2.targetTick, e1);
            }
        })
        let targets = [];
        let trees = [];
        let stones = [];
        const myPos = bot.myPlayer.position;
        bot.entities.forEach(e2 => {
            let t = e2.targetTick;
            if (t.model && t.uid !== bot.myPlayer.uid) {
                targets.push(t);
            }
            if (!e.get(t.uid)) {
                bot.entities.delete(t.uid);
            }
        })
        let player = bot.entities.get(bot.myPlayer.uid);
        let _player = e.get(bot.myPlayer.uid);
        if (player) {
            if (_player) {
                if (bot.myPlayer.position) {
                    bot.aimingYaw = angleTo(bot.myPlayer.position.x, bot.myPlayer.position.y, mouse.x, mouse.y);
                    !bot.aiming && !spinning && bot.sendPacket(3, { mouseMoved: bot.aimingYaw });
                }
                if (_player.uid) {
                    bot.myPlayer = bot.entities.get(bot.myPlayer.uid).targetTick;
                    if ((bot.myPlayer.health / bot.myPlayer.maxHealth) * 100 < window.scripts.autoheal.healSet && (bot.myPlayer.health / bot.myPlayer.maxHealth) * 100 > 0) {
                        if (window.scripts.autoheal.enabled) {
                            if (!bot.healPlayer) {
                                bot.sendPacket(9, { name: "EquipItem", itemName: "HealthPotion", tier: 1 })
                                bot.sendPacket(9, { name: "BuyItem", itemName: "HealthPotion", tier: 1 })
                                bot.healPlayer = true;
                                setTimeout(() => {
                                    bot.healPlayer = false;
                                }, 500);
                            }
                        }
                    }
                }
            }
        }
        if (bot.myPlayer.petUid) {
            bot.petActivated = true;
            if (_player && _player.uid) {
                let pet = bot.entities.get(bot.myPlayer.petUid);
                if (pet) {
                    bot.myPet = pet.targetTick;
                    if (bot.myPet) {
                        if (window.scripts.autopetheal.enabled) {
                            if ((bot.myPet.health / bot.myPet.maxHealth) * 100 < window.scripts.autopetheal.healSet && (bot.myPet.health / bot.myPet.maxHealth) * 100 > 0) {
                                if (!bot.healPet) {
                                    bot.sendPacket(9, { name: "BuyItem", itemName: "PetHealthPotion", tier: 1 })
                                    bot.sendPacket(9, { name: "EquipItem", itemName: "PetHealthPotion", tier: 1 })
                                    bot.healPet = true;
                                    setTimeout(() => {
                                        bot.healPet = false;
                                    }, 500);
                                }
                            }
                        }
                        if (evolvePetTiersAndExp[`${bot.myPet.tier}, ${detectPetLevelIfHigherReturnItsRequiredLevel(bot.myPet.tier, Math.floor(bot.myPet.experience / 100) + 1)}, ${detectPetTokenIfHigherReturnItsRequiredLevel(bot.myPet.tier, bot.myPlayer.token)}`]) {
                            if (!bot.EvolveOnceEverySecond) {
                                bot.EvolveOnceEverySecond = true;
                                setTimeout(() => {
                                    bot.EvolveOnceEverySecond = false;
                                }, 1000)
                                bot.sendPacket(9, { name: "BuyItem", itemName: bot.myPet.model, tier: bot.myPet.tier + 1 });
                            }
                        }
                        if (bot.model !== bot.myPet.model) bot.model = bot.myPet.model;
                        if (bot.tier !== bot.myPet.tier) bot.tier = bot.myPet.tier;
                    }
                }
            }
        }
        if (window.scripts.autoRevivePets && bot.petActivated) {
            bot.sendPacket(9, { name: "BuyItem", itemName: "PetRevive", tier: 1 });
            bot.sendPacket(9, { name: "EquipItem", itemName: "PetRevive", tier: 1 });
        }
        bot.target = targets.sort((a, b) => {
            return measureDistance(myPos, a.position) - measureDistance(myPos, b.position);
        })[0];
        if (scripts.socketFollowMouse) {
            !scripts.wasd && bot.moverbymouse(e, 0, { x: 0, y: 0 }, true, true, reversedYaw);
        }
        if (scripts.socketRoundPlayer) {
            !scripts.wasd && bot.moverbyrounds(e, 0, { x: 0, y: 0 }, true, true, reversedYaw);
        }
    }
    ws.onopen = () => {
        count = count + 1;
        id = count;
        ws.onmessage = (msg) => {
            let m = new Uint8Array(msg.data);
            if (m[0] == 5) {
                bot.Module.onDecodeOpcode5(m, game.network.connectionOptions.hostname, decodedopcode5 => {
                    bot.sendPacket(4, { displayName: altName, extra: decodedopcode5[5] });
                    bot.enterworld2 = decodedopcode5[6];
                });
                return;
            }
            if (m[0] == 10) {
                bot.ws.send(bot.Module.finalizeOpcode10(m));
                return;
            }
            let data = codec.decode(msg.data);
            if (bot.sendPacket + "" == "() => {}") {
                switch (data.opcode) {
                    case 0:
                        !isNaN(data.entities[bot.uid].wave) && (bot.wave = data.entities[bot.uid].wave);
                        break;
                    case 9:
                        rpcs(data);
                        break;
                }
            }
            if (!(bot.sendPacket + "" == "() => {}")) {
                switch (data.opcode) {
                    case 5:
                        /*const myWorker = new Worker("worker.js");
                        myWorker.onmessage = (event) => {
                            if (new Uint8Array(event.data[5].extra)[0] == 0 && new Uint8Array(event.data[5].extra)[1] == 0 && new Uint8Array(event.data[5].extra)[2] == 0) {
                                sendAlt(joinParty);
                            } else {
                                bot.enterworld2 = new Uint8Array(event.data[6]);
                                bot.sendPacket(4, {displayName: altName, extra: new Uint8Array(event.data[5].extra)});
                            }
                            myWorker.terminate();
                        };
                        myWorker.postMessage([
                            new Uint8Array(data.extra),
                            game.options.servers[game.options.serverId].hostname,
                            wasmbuffers_1
                        ]);*/


                        console.log(`socket with id ${id} connected.`)
                        break;
                    case 4:
                        data.allowed && bot.enterworld2 && bot.ws.send(bot.enterworld2);
                        onEnterWorld(data);
                        console.log(`socket with id ${id} joined.`);
                        openCall();
                        break;
                    case 9:
                        rpcs(data);
                        break;
                    case 0:
                        entitiesUpdater(data.entities);
                        if (!(bot.id in sockets)) {
                            sockets[bot.id] = bot;
                            socketsByUid[bot.uid] = bot;
                        };
                        break;
                }
            }
        }
        ws.onclose = () => {
            delete sockets[bot.id];
            delete socketsByUid[bot.uid];
            console.log(`socket with id ${id} closed.`)
        }
    }
};

let messagespam = false;
let ft = false;
let thisfnc = () => { };
setInterval(() => {
    if (ft) {
        thisfnc();
    }
}, 50)

window.wsTypeLb = (id = document.getElementsByClassName("hud-intro-server")[0].value) => {
    let sendPacket;
    let ws = new WebSocket(`wss://${game.options.servers[id].host}:443/`);
    ws.binaryType = "arraybuffer";
    function loadLbPacket() {
        ws.send(new Uint8Array([7, 0]));
        ws.send(new Uint8Array([9, 6, 0, 0, 0, 126, 8, 0, 0, 108, 27, 0, 0, 146, 23, 0, 0, 82, 23, 0, 0, 8, 91, 11, 0, 8, 91, 11, 0, 0, 0, 0, 0, 32, 78, 0, 0, 76, 79, 0, 0, 172, 38, 0, 0, 120, 155, 0, 0, 166, 39, 0, 0, 140, 35, 0, 0, 36, 44, 0, 0, 213, 37, 0, 0, 100, 0, 0, 0, 120, 55, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 134, 6, 0, 0]));
    };
    ws.onopen = () => {
        ws.network = new game.networkType();
        sendPacket = (e, t) => {
            if (!ws.isclosed) {
                ws.send(ws.network.codec.encode(e, t));
            }
        };
        !game.network.connectionOptions && (game.network.connectionOptions = {});
        game.network.connectionOptions.host = game.options.servers[id].host;
        game.network.connected = true;
    };
    ws.onEnterWorld = (data) => {
        if (!data.allowed) {
            ws.close();
            game.ui.components.Leaderboard.leaderboardData = [{ name: "Full Server...", uid: 0, wave: 0, score: 0, rank: 0 }];
            game.ui.components.Leaderboard.update();
            return;
        }
        ws.send(ws.enterworld2);
        for (let i = 0; i < 50; i++) ws.send(new Uint8Array([3, 17, 123, 34, 117, 112, 34, 58, 49, 44, 34, 100, 111, 119, 110, 34, 58, 48, 125]));
        loadLbPacket();
    }
    ws.onRpcMapUpdate = (data) => {
        if (data.name == "Leaderboard") {
            if (!ws.shouldLoadIt) {
                ws.shouldLoadIt = true;
                return;
            }
            ws.close();
            game.ui.components.Leaderboard.leaderboardData = data.response;
            game.ui.components.Leaderboard.update();
        }
    }
    ws.onPreEnterWorld = (data) => {
        wasmmodule(new Uint8Array(data.extra), game.options.servers[document.getElementsByClassName("hud-intro-server")[0].value].hostname).then((e) => {
            ws.enterworld2 = new Uint8Array(e[6]);
            sendPacket(4, { displayName: " ", extra: new Uint8Array(e[5].extra) });
        });
    }
    ws.onmessage = msg => {
        let data = ws.network.codec.decode(msg.data);
        switch (data.opcode) {
            case 5:
                ws.onPreEnterWorld(data);
                break;
            case 4:
                ws.onEnterWorld(data);
                break;
            case 9:
                ws.onRpcMapUpdate(data);
                break;
        }
    }
}
// credits apex
if (localStorage.getItem("blockedNames") == null) {
    localStorage.setItem("blockedNames", "[]");
}

getElement("hud-settings-grid")[0].innerHTML += `<center><h3>Chat filter</h3>\n<button class="btn btn-green" style="width: 99%;" id="chatFilter" filter="all">All</button>\n<input type="text" class="btn" id="nameToBlock" style="width: 99%; margin-top: 1%;" maxlength=35 placeholder="Name of person you want to block/unblock..."></input>\n<button class="btn btn-red" id="blockName" style="width: 45%; margin-top: 1%;">Block</button><button class="btn btn-green" id="unblockName" style="margin-top: 1%; margin-left: 1%; width: 45%;">Unblock</button>\n<button class="btn btn-green" id="showBlocked" style="width:99%; margin-top: 1%;">Show Blocked Names</button></center>\n<div style="margin-top: 1%;" id="blockNamesList"></div>`;
let filterButton = getId("chatFilter");
filterButton.onclick = () => {
    let f = filterButton.getAttribute("filter");
    let newF = "all";
    if (f == "all") {
        newF = "party";
    } else if (f == "party") {
        newF = "none";
    } else if (f == "none") {
        newF = "all";
    }
    filterButton.setAttribute("filter", newF);
    switch (newF) {
        case "all":
            filterButton.setAttribute("class", "btn btn-green");
            filterButton.textContent = "All";
            break;
        case "party":
            filterButton.setAttribute("class", "btn btn-gold");
            filterButton.textContent = "Party";
            break;
        case "none":
            filterButton.setAttribute("class", "btn btn-red");
            filterButton.textContent = "None";
            break;
    }
}

let blockButton = getId("blockName");
blockButton.onclick = () => {
    let blocked = JSON.parse(localStorage.getItem("blockedNames"));
    let nameToBlock = getId("nameToBlock").value;
    if (blocked.includes(nameToBlock)) return;
    blocked.push(nameToBlock);
    localStorage.setItem("blockedNames", JSON.stringify(blocked));
}

let unblockButton = getId("unblockName");
unblockButton.onclick = () => {
    let blocked = JSON.parse(localStorage.getItem("blockedNames"));
    let nameToUnblock = getId("nameToBlock").value;
    if (blocked.indexOf(nameToUnblock) == -1) return;
    blocked.splice(blocked.indexOf(nameToUnblock), 1);
    localStorage.setItem("blockedNames", JSON.stringify(blocked));
}

let showBlockedButton = getId("showBlocked");
showBlockedButton.onclick = () => {
    let blocked = JSON.parse(localStorage.getItem("blockedNames"));
    let str = "<h3>";
    str += blocked.join(", ");
    str += "</h3>";
    getId("blockNamesList").innerHTML = str;
}

Game.currentGame.network.emitter.removeListener("PACKET_RPC", Game.currentGame.network.emitter._events.PACKET_RPC[1]);
let onMessageReceived = msg => {
    let filter = filterButton.getAttribute("filter");
    switch (filter) {
        case "party":
            {
                let party = Game.currentGame.ui.playerPartyMembers;
                let uids = [];
                for (let member of party) {
                    uids.push(member.playerUid);
                }
                if (!uids.includes(msg.uid)) return;
            }
            break;
        case "none":
            return;
            break;
    }
    let blockedNames = JSON.parse(localStorage.getItem("blockedNames"));
    let a = Game.currentGame.ui.getComponent("Chat"),
        b = Sanitize(msg.displayName),
        c = Sanitize(msg.message),
        d = a.ui.createElement(`<div class="hud-chat-message"><strong>${b}</strong>: ${c}</div>`);
    if (blockedNames.includes(b) || window.scripts.autoclearmessages) return;
    a.messagesElem.appendChild(d);
    a.messagesElem.scrollTop = a.messagesElem.scrollHeight;
}
Game.currentGame.network.addRpcHandler("ReceiveChatMessage", onMessageReceived);


let mousePs = { x: 0, y: 0 };
let buildingType = "Wall";
let placeflood = false;
function placeWall(x, y) {
    sendPacket(9, { name: 'MakeBuilding', x: x, y: y, type: buildingType, yaw: 0 });
}

let w3x3 = 0;
// 1 for 3x3
// 2 for 5x5
// 3 for 7x7
// 4 for 9x9
document.addEventListener('mousemove', e => {
    if (window.scripts.advancedwallplacer && game.inputManager.mouseDown && game.ui.components.PlacementOverlay.buildingId == "Wall") {
        if (placeflood) {
            let oldWorldPos = screenToWorld(mousePs.x, mousePs.y);
            let worldPos = screenToWorld(e.clientX, e.clientY);
            let oldGridPos = {
                x: ((oldWorldPos.x / 48 | 0) + 0.5) * 48,
                y: ((oldWorldPos.y / 48 | 0) + 0.5) * 48
            }
            let gridPos = {
                x: ((worldPos.x / 48 | 0) + 0.5) * 48,
                y: ((worldPos.y / 48 | 0) + 0.5) * 48
            }
            while (oldGridPos.y != gridPos.y || oldGridPos.x != gridPos.x) {
                let x = (Math.round(((Math.atan2(gridPos.y - oldGridPos.y, gridPos.x - oldGridPos.x) * 180 / Math.PI + 450) % 360) / 45) * 45) % 360;
                if (x == 0) {
                    oldGridPos.y -= 48;
                }
                if (x == 45) {
                    oldGridPos.x += 48;
                    oldGridPos.y -= 48;
                }
                if (x == 90) {
                    oldGridPos.x += 48;
                }
                if (x == 135) {
                    oldGridPos.x += 48;
                    oldGridPos.y += 48;
                }
                if (x == 180) {
                    oldGridPos.y += 48;
                }
                if (x == 225) {
                    oldGridPos.x -= 48;
                    oldGridPos.y += 48;
                }
                if (x == 270) {
                    oldGridPos.x -= 48;
                }
                if (x == 315) {
                    oldGridPos.x -= 48;
                    oldGridPos.y -= 48;
                }
                placeWall(oldGridPos.x, oldGridPos.y);
            }
        }
        placeflood = true;
    }
    if (game.inputManager.mouseDown && ((game.ui.components.PlacementOverlay.buildingId == "Wall" && window.scripts.w3x3walls.enabled) || (game.ui.components.PlacementOverlay.buildingId == "Door" && window.scripts.w3x3doors.enabled) || (game.ui.components.PlacementOverlay.buildingId == "SlowTrap" && window.scripts.w3x3traps.enabled))) {
        if (game.ui.components.PlacementOverlay.buildingId == "Wall") {
            buildingType = "Wall";
            w3x3 = window.scripts.w3x3walls.w3x3;
        }
        if (game.ui.components.PlacementOverlay.buildingId == "Door") {
            buildingType = "Door";
            w3x3 = window.scripts.w3x3doors.w3x3;
        }
        if (game.ui.components.PlacementOverlay.buildingId == "SlowTrap") {
            buildingType = "SlowTrap";
            w3x3 = window.scripts.w3x3traps.w3x3;
        }
        let oldWorldPos = screenToWorld(mousePs.x, mousePs.y);
        let worldPos = screenToWorld(e.clientX, e.clientY);
        let oldGridPos = {
            x: ((oldWorldPos.x / 48 | 0) + 0.5) * 48,
            y: ((oldWorldPos.y / 48 | 0) + 0.5) * 48
        }
        let gridPos = {
            x: ((worldPos.x / 48 | 0) + 0.5) * 48,
            y: ((worldPos.y / 48 | 0) + 0.5) * 48
        }
        let columns = w3x3 == 1 ? 3 : w3x3 == 2 ? 5 : w3x3 == 3 ? 7 : w3x3 == 4 ? 9 : 0; // x
        let rows = w3x3 == 1 ? 3 : w3x3 == 2 ? 5 : w3x3 == 3 ? 7 : w3x3 == 4 ? 9 : 0; // y
        for (let x = -Math.floor(columns / 2); x < Math.round(columns / 2); x++) {
            for (let y = -Math.floor(rows / 2); y < Math.round(rows / 2); y++) {
                placeWall(gridPos.x + x * 48, gridPos.y + y * 48);
            }
        }
    }
    mousePs = { x: e.clientX, y: e.clientY };
})

document.addEventListener("mouseup", () => {
    placeflood = false;
})

let tick = 0;
let altAmt = 5;
let _amt = null;

const openCall = () => {
    tick = game.world.replicator.currentTick.tick;
}

const sendAltTimeout = () => {
    const amt = 32 - players;
    if (game.world.replicator.currentTick.tick - tick > 100) {
        altAmt = 5;
    }
    const min = Math.min(altAmt, amt);
    if (min != 0) {
        tick = game.world.replicator.currentTick.tick;
        for (let i = 0; i < min; i++) {
            sendAlt(false);
        }
        altAmt -= min;
    }
    if (isDay && altAmt == 5) {
        tick = game.world.replicator.currentTick.tick;
        sendAlt(false);
        altAmt -= 1;
    }
}

game.network.addEntityUpdateHandler(() => {
    scripts.filler && sendAltTimeout();
});
// personal commands (not shown for others)


let prefix = "!";
game.network.sendRpc2 = game.network.sendRpc;
game.network.sendRpc = (e) => {
    if (window.log_1) console.log(e);
    if (e.name == "SendChatMessage") {
        if (e.message.startsWith(prefix)) {
            let msg = e.message.toLowerCase();
            if (msg.startsWith(prefix + "aito")) {
                window.enableaito();
            }
            if (msg.startsWith(prefix + prefix + "aito")) {
                window.disableaito();
            }
            if (msg.startsWith(prefix + "ahrc")) {
                let args = msg.split(" ");
                ahrc_turn_id = args[1] || "main";
                window.enableahrc();
            }
            if (msg.startsWith(prefix + prefix + "ahrc")) {
                window.disableahrc();
            }
            if (msg.startsWith(prefix + "send ")) {
                let amt = msg.split(" ")[1] > 5 ? 5 : msg.split(" ")[1];
                for (let i = 0; i < amt; i++) {
                    sendAlt();
                }
            }
            if (msg == prefix + "p") {
                let a = Object.values(sockets);
                sockets = {};
                for (let i = 0; i < a.length; i++) {
                    a[i].id = i + 1;
                    sockets[i + 1] = a[i];
                }
                b16 = a.length;
                game.ui.components.Map.onPartyMembersUpdate(partyInfoAlt);
            }
            if (msg.startsWith(prefix + "close ")) {
                let amt = msg.split(" ")[1] - "";
                sockets[amt].ws.send([]);
            }
            if (msg.startsWith(prefix + "reset")) {
                for (let i in sockets) {
                    sockets[i].ws.send([]);
                }
            }
            if (msg.startsWith(prefix + "up")) {
                for (let i in sockets) {
                    sockets[i].sendPacket(3, { up: 1, down: 0 });
                }
            }
            if (msg.startsWith(prefix + "down")) {
                for (let i in sockets) {
                    sockets[i].sendPacket(3, { up: 0, down: 1 });
                }
            }
            if (msg.startsWith(prefix + "right")) {
                for (let i in sockets) {
                    sockets[i].sendPacket(3, { right: 1, left: 0 });
                }
            }
            if (msg.startsWith(prefix + "left")) {
                for (let i in sockets) {
                    sockets[i].sendPacket(3, { right: 0, left: 1 });
                }
            }
            if (msg.startsWith(prefix + "stop")) {
                for (let i in sockets) {
                    sockets[i].sendPacket(3, { right: 0, left: 0, up: 0, down: 0, mouseUp: 1 });
                }
            }
            if (msg.startsWith(prefix + "att")) {
                window.scripts.socketMouseDown = true;
            }
            if (msg.startsWith(prefix + prefix + "att")) {
                window.scripts.socketMouseDown = false;
            }
            if (msg.startsWith(prefix + "spin")) {
                spinning = true;
            }
            if (msg.startsWith(prefix + prefix + "spin")) {
                spinning = false;
            }
            if (msg == prefix + "sd") {
                spinifdisabled = true;
            }
            if (msg == prefix + prefix + "sd") {
                spinifdisabled = false;
            }
            if (msg.startsWith(prefix + "d") && !msg.startsWith(prefix + "da")) {
                let args = msg.split(" ");
                let id = args[1];
                if (id) {
                    !sockets[id].sendPacket2 && (sockets[id].sendPacket2 = sockets[id].sendPacket);
                    sockets[id].sendPacket = () => { }
                }
            }
            if (msg == prefix + "dp") {
                window.scripts.detectPlayers = true;
            }
            if (msg == prefix + prefix + "dp") {
                window.scripts.detectPlayers = false;
                oldPlayers = 0;
            }
            if (msg == prefix + "xkey" || msg == prefix + "xk") {
                window.scripts.xkey = true;
            }
            if (msg == prefix + prefix + "xkey" || msg == prefix + prefix + "xk") {
                window.scripts.xkey = false;
            }
            if (msg == prefix + "azs") {
                window.scripts.autoShield = true;
            }
            if (msg == prefix + prefix + "azs") {
                window.scripts.autoShield = false;
            }
            if (msg.startsWith(prefix + "respawn") || msg.startsWith(prefix + "r")) {
                let args = msg.split(" ");
                let id = args[1];
                if (id) {
                    sockets[id].sendPacket(3, { respawn: 1 });
                }
            }
            if (msg.startsWith(prefix + "altname")) {
                altName = msg.split(prefix + "altname ")[1];
            }
            if (msg.startsWith(prefix + prefix + "d") && !msg.startsWith(prefix + prefix + "da")) {
                let args = msg.split(" ");
                let id = args[1];
                if (id) {
                    !sockets[id].sendPacket2 && (sockets[id].sendPacket2 = sockets[id].sendPacket);
                    sockets[id].sendPacket = sockets[id].sendPacket2;
                }
            }
            if (msg.startsWith(prefix + "da")) {
                let args = msg.split(" ");
                let id = args[1];
                if (id) {
                    sockets[id].disableAim = true;
                    sockets[id].disableAimDir = sockets[id].aimingYaw;
                }
            }
            if (msg.startsWith(prefix + prefix + "da")) {
                let args = msg.split(" ");
                let id = args[1];
                if (id) {
                    sockets[id].disableAim = false;
                }
            }
            if (msg == prefix + "s") {
                for (let i in sockets) {
                    sockets[i].sendPacket(9, { name: "SendChatMessage", channel: "Local", message: `${sockets[i].myPlayer.name}, W: ${counter(sockets[i].myPlayer.wood)}, S: ${counter(sockets[i].myPlayer.stone)}, G: ${counter(sockets[i].myPlayer.gold)};` })
                }
            }
            if (msg == prefix + "as") {
                autotier2spear = true;
                autotier1spear = false;
                autotier4spear = false;
            }
            if (msg == prefix + "as1") {
                autotier1spear = true;
                autotier2spear = false;
                autotier4spear = false;
            }
            if (msg == prefix + "as4") {
                autotier1spear = false;
                autotier2spear = false;
                autotier4spear = true;
            }
            if (msg == prefix + prefix + "as" || msg == prefix + prefix + "as4" || msg == prefix + prefix + "as1") {
                autotier2spear = false;
                autotier1spear = false;
                autotier4spear = false;
            }
            if (msg.startsWith(prefix + "findtop ") || msg.startsWith(prefix + "ft ")) {
                const rank = (msg.split(" ")[1] - "") - 1;
                const uid = game.ui.components.Leaderboard.leaderboardData[rank].uid;
                const name = game.ui.components.Leaderboard.leaderboardData[rank].name;
                const interval = setInterval(() => {
                    Object.values(sockets).forEach(e => {
                        const player = e.entities.get(uid);
                        if (player) {
                            console.log(player.targetTick);
                            game.ui.components.PopupOverlay.showHint(name + "found, position: {x: " + player.targetTick.position.x + ", y: " + player.targetTick.position.y + "}");
                            game.ui.components.Chat.onMessageReceived({ displayName: "PlayerFinder", message: name + "found, position: {x: " + player.targetTick.position.x + ", y: " + player.targetTick.position.y + "}" });
                            clearInterval(interval);
                        }
                    })
                }, 50)
            }
            if (msg == prefix + "ft") {
                const uid = game.ui.components.Leaderboard.leaderboardData[0].uid;
                const interval = setInterval(() => {
                    Object.values(sockets).forEach(e => {
                        const player = e.entities.get(uid);
                        if (player) {
                            console.log(player.targetTick);
                            game.ui.components.PopupOverlay.showHint(player.targetTick.name + "found, position: {x: " + player.targetTick.position.x + ", y: " + player.targetTick.position.y + "}");
                            game.ui.components.Chat.onMessageReceived({ displayName: "PlayerFinder", message: player.targetTick.name + "found, position: {x: " + player.targetTick.position.x + ", y: " + player.targetTick.position.y + "}" });
                            clearInterval(interval);
                        }
                    });
                }, 50)
            }
            if (msg == prefix + "sp") {
                messagespam = true;
            }
            if (msg == prefix + prefix + "sp") {
                messagespam = false;
            }
            if (msg == prefix + "h" || msg == prefix + "heal") {
                window.enableautoheal();
            }
            if (msg == prefix + prefix + "h" || msg == prefix + prefix + "heal") {
                window.disableautoheal();
            }
            if (msg == prefix + "st" || msg == prefix + "scoretrick") {
                window.shouldStartScript = true;
            }
            if (msg == prefix + prefix + "st" || msg == prefix + prefix + "scoretrick") {
                window.shouldStartScript = false;
            }
            if (msg == prefix + "ls" || msg == prefix + "logscore") {
                window.scripts.LogScore = true;
            }
            if (msg == prefix + prefix + "ls" || msg == prefix + prefix + "logscore") {
                window.scripts.LogScore = false;
            }
            if (msg == prefix + "ar") {
                window.scripts.autorespawn = true;
            }
            if (msg == prefix + prefix + "ar") {
                window.scripts.autorespawn = false;
            }
            if (msg == prefix + "rwd") {
                window.scripts.respawnWhenDeadWithoutBase = true;
            }
            if (msg == prefix + prefix + "rwd") {
                window.scripts.respawnWhenDeadWithoutBase = false;
            }
            if (msg.startsWith(`${prefix}join `)) {
                let args = msg.split(`${prefix}join `);
                if (args[1].length == 20) {
                    sendPacket(9, { name: "JoinPartyByShareKey", partyShareKey: args[1] });
                } else {
                    if (sockets[args[1]]) {
                        sendPacket(9, { name: "JoinPartyByShareKey", partyShareKey: sockets[args[1]].psk.response.partyShareKey });
                    }
                }
            }
            if (msg.startsWith(`${prefix}altjoin `)) {
                let args = msg.split(`${prefix}altjoin `);
                let socket1 = args[1].split(" ")[0];
                let socket2 = args[1].split(" ")[1];
                if (sockets[socket1]) {
                    if (sockets[socket1].activeBuildingsByPos.size) {
                        Game.currentGame.ui.getComponent("PopupOverlay").showConfirmation(`Are you sure you want to add ${socket1} in your party?`, 1e4, function () {
                            sockets[socket2] ? sockets[socket1].sendPacket(9, { name: "JoinPartyByShareKey", partyShareKey: sockets[socket2].psk.response.partyShareKey }) : sockets[socket1].sendPacket(9, { name: "JoinPartyByShareKey", partyShareKey: game.ui.playerPartyShareKey });
                        })
                    } else {
                        sockets[socket2] ? sockets[socket1].sendPacket(9, { name: "JoinPartyByShareKey", partyShareKey: sockets[socket2].psk.response.partyShareKey }) : sockets[socket1].sendPacket(9, { name: "JoinPartyByShareKey", partyShareKey: game.ui.playerPartyShareKey });
                    }
                }
            }
            if (msg.startsWith(`${prefix}altleave `)) {
                let socket1 = msg.split(`${prefix}altleave `)[1];
                if (sockets[socket1]) {
                    sockets[socket1].sendPacket(9, { name: "LeaveParty" });
                    sockets[socket1].undoleave = sockets[socket1].psk.response.partyShareKey;
                }
            }
            if (msg.startsWith(`${prefix}undoleave`)) {
                Object.values(sockets).forEach(e => {
                    if (e.undoleave) {
                        e.join(e.undoleave);
                        e.undoleave = null;
                    }
                })
            }
            if (msg.startsWith(`${prefix}ja`)) {
                Object.keys(sockets).forEach(i => {
                    if (!sockets[i].activeBuildingsByPos.size) {
                        sendPacket(9, { name: "JoinPartyByShareKey", partyShareKey: sockets[i].psk.response.partyShareKey });
                    }
                })
            }
            if (msg.startsWith(`${prefix}aj`)) {
                let count = 0;
                Object.keys(sockets).forEach(i => {
                    if (!sockets[i].activeBuildingsByPos.size) {
                        if (++count <= 3) {
                            sockets[i].sendPacket(9, { name: "JoinPartyByShareKey", partyShareKey: game.ui.playerPartyShareKey });
                        }
                    }
                })
            }
            if (msg.startsWith(`${prefix}hit`)) {
                let socket = sockets[msg.split(`${prefix}hit `)[1]];
                if (socket && !socket.mouseDownHit) {
                    socket.mouseDownHit = 1;
                    setTimeout(() => {
                        socket.sendPacket(3, { mouseDown: socket.aimingYaw });
                    }, 100)
                    setTimeout(() => {
                        socket.sendPacket(3, { mouseUp: 1 });
                        setTimeout(() => {
                            socket.mouseDownHit = 0;
                        }, 100)
                    }, 25000)
                }
            }
            if (msg.startsWith(`${prefix}healset`)) {
                let args = msg.split(" ");
                window.enableautoheal(args[1] - "");
            }
            if (msg.startsWith(`${prefix}hs`)) {
                let args = msg.split(" ");
                window.enableautoheal(args[1] - "");
            }
            if (msg.startsWith(`${prefix}pethealset`)) {
                let args = msg.split(" ");
                window.enableautopetheal(args[1] - "");
            }
            if (msg.startsWith(`${prefix}phs`)) {
                let args = msg.split(" ");
                window.enableautopetheal(args[1] - "");
            }
            if (msg.startsWith(`${prefix}abg`)) {
                window.targetRecordedBase("abg");
            }
            if (msg.startsWith(`${prefix}abm`)) {
                window.targetRecordedBase("abm");
            }
            if (msg.startsWith(`${prefix}abm1`)) {
                window.targetRecordedBase("abm1");
            }
            if (msg.startsWith(`${prefix}abm2`)) {
                window.targetRecordedBase("abm2");
            }
            if (msg.startsWith(`${prefix}abm4`)) {
                window.targetRecordedBase("abm4");
            }
            if (msg.startsWith(`${prefix}arb`)) {
                window.targetRecordedBase("arb");
            }
            if (msg.startsWith(`${prefix}sirr`)) {
                window.targetRecordedBase("sirr");
            }
            if (msg.startsWith(`${prefix}abs`)) {
                window.scripts.autobuildsetting.autobuild = true;
                localbuildingUpdate();
            }
            if (msg.startsWith(`${prefix}${prefix}abs`)) {
                window.scripts.autobuildsetting.autobuild = false;
            }
            if (msg.startsWith(`${prefix}aus`)) {
                window.scripts.autobuildsetting.autoupgrade = true;
                localbuildingUpdate();
            }
            if (msg.startsWith(`${prefix}${prefix}aus`)) {
                window.scripts.autobuildsetting.autoupgrade = false;
            }
            if (msg.startsWith(`${prefix}ads`)) {
                window.scripts.autobuildsetting.autodeletenonfromautobuildedtowers = true;
                localbuildingUpdate();
            }
            if (msg.startsWith(`${prefix}${prefix}ads`)) {
                window.scripts.autobuildsetting.autodeletenonfromautobuildedtowers = false;
            }
            if (msg.startsWith(`${prefix}ans`)) {
                window.scripts.autobuildsetting.autodeleteinvalidtypetowers = true;
                localbuildingUpdate();
            }
            if (msg.startsWith(`${prefix}${prefix}ans`)) {
                window.scripts.autobuildsetting.autodeleteinvalidtypetowers = false;
            }
            if (msg == prefix + "1x1") {
                window.disablew3x3w();
            }
            if (msg == prefix + "3x3") {
                window.w3x3w();
                window.enablew3x3w();
            }
            if (msg == prefix + "5x5") {
                window.w5x5w();
                window.enablew3x3w();
            }
            if (msg == prefix + "7x7") {
                window.w7x7w();
                window.enablew3x3w();
            }
            if (msg == prefix + "9x9") {
                window.w9x9w();
                window.enablew3x3w();
            }
            if (msg.startsWith(prefix + "dps")) {
                window.disablepopups = true;
            }
            if (msg.startsWith(prefix + prefix + "dps")) {
                window.disablepopups = false;
            }
            if (msg.startsWith(prefix + "pop")) {
                game.ui.components.PopupOverlay.showHint(`There are ${players} players in the server.`);
            }
            if (msg.startsWith(prefix + "sockets")) {
                let a = Object.values(sockets);
                sockets = {};
                for (let i = 0; i < a.length; i++) {
                    a[i].id = i + 1;
                    sockets[i + 1] = a[i];
                }
                b16 = a.length;
                game.ui.components.Map.onPartyMembersUpdate(partyInfoAlt);
                game.ui.components.PopupOverlay.showHint(`There are ${a.length} sockets in the server.`);
            }
            if (msg.startsWith(prefix + "sas")) {
                game.world.removeEntity = (uid) => {
                    if (game.world.entities.get(uid).fromTick.model == "Tree" || game.world.entities.get(uid).fromTick.model == "Stone" || game.world.entities.get(uid).fromTick.model == "NeutralCamp") return;
                    game.world.removeEntity2(uid);
                };
                for (let i in game.world.spots) {
                    let entity = game.world.toInclude(game.world.spots[i]);
                    game.world.createEntity(entity);
                }
            }
            if (msg.startsWith(prefix + prefix + "sas")) {
                game.world.removeEntity = game.world.removeEntity2;
            }
            if (msg.startsWith(`${prefix}timeout `)) {
                let args = msg.split(`${prefix}timeout `);
                let socket = args[1].split(" ")[0];
                if (sockets[socket]) {
                    sockets[socket].timeout();
                }
            }
            if (msg == prefix + "timeoutall") {
                Object.values(sockets).forEach(e => {
                    e.timeout();
                });
            }
            if (msg == prefix + "fill") {
                scripts.filler = true;
            }
            if (msg == prefix + prefix + "fill") {
                scripts.filler = false;
            }
            return;
        } else {
            if (scripts.chattoswear) {
                let m = sentenceToSwear(e.message);
                //let m = e.message;
                e.message = m;
                game.network.sendRpc2(e);
            } else {
                game.network.sendRpc2(e);
            }
        }
    }
    game.network.sendRpc2(e);
}

let sweardetect = function (e = "u") {
    switch (e) {
        case "u":
            return "&#117;";
            break;
        case "i":
            return "&#105;";
            break;
        case "a":
            return "&#97;";
            break;
        case "o":
            return "&#111;";
            break;
        case "g":
            return "&#103;"
            break;
        case "U":
            return "&#85;";
            break;
        case "I":
            return "&#73;";
            break;
        case "A":
            return "&#65;";
            break;
        case "O":
            return "&#79;";
            break;
        case "G":
            return "&#71;";
            break;
    }
    return e;
}

let sentenceToSwear = function (s = "") {
    if (s.startsWith("#") || s.startsWith("/")) return s;
    return s.split("").map(e => sweardetect(e)).join("");
}

// keys

document.addEventListener("keydown", (e) => {
    if (e.repeat) return;
    if (document.activeElement.tagName.toLowerCase() !== "input" && document.activeElement.tagName.toLowerCase() !== "textarea") {
        switch (e.code) {
            case "KeyX":
                window.upgradealltgl();
                game.ui.components.PopupOverlay.showHint(`Auto Upgrade ${window.scripts.autoupgrade ? "On" : "Off"}! ${e.code}.`);
                break;
            case "KeyN":
                window.autorevivepets();
                Object.keys(sockets).forEach(i => {
                    sockets[i].autoRevivePets = window.scripts.autoRevivePets;
                })
                game.ui.components.PopupOverlay.showHint(`Auto Revive Pets ${window.scripts.autoRevivePets ? "On" : "Off"}! ${e.code}.`);
                break;
            case "KeyM":
                sendPacket(9, { name: "EquipItem", itemName: "PetCARL", tier: myPet.tier || 1 });
                Object.keys(sockets).forEach(i => {
                    sockets[i].sendPacket(9, { name: "EquipItem", itemName: "PetCARL", tier: sockets[i].myPet.tier || 1 });
                })
                game.ui.components.PopupOverlay.showHint(`PetCARL Equipped! ${e.code}.`);
                break;
            case "KeyG":
                scripts.playerFollower = !scripts.playerFollower;
                if (scripts.playerFollower) {
                    window.scripts.playerFollowerByUid = target.uid;
                    scripts.me = 0;
                    Object.keys(sockets).forEach(i => {
                        sockets[i].uidType = target.uid;
                    })
                } else {
                    scripts.me = 1;
                    Object.keys(sockets).forEach(i => {
                        sockets[i].uidType = game.world.myUid;
                        sockets[i].sendPacket(3, { mouseUp: 1 });
                    })
                }
                break;
            case "KeyV":
                sendPacket(9, { name: "DeleteBuilding", uid: myPet.uid || 1 });
                game.ui.components.PopupOverlay.showHint(`Sold Pet! ${e.code}.`);
                break;
            case "Minus":
                game.ui.components.PlacementOverlay.startPlacing("GoldStash");
                break;
            case "KeyK":
                window.autocleartgl();
                game.ui.components.PopupOverlay.showHint(`Auto Clear Messages ${window.scripts.autoclearmessages ? "On" : "Off"}! ${e.code}.`);
                break;
            case "KeyZ":
                window.autobowtgl();
                game.ui.components.PopupOverlay.showHint(`Auto Bow ${window.scripts.autobow ? "On" : "Off"}! ${e.code}.`);
                break;
            case "Backquote":
                window.getgetrss();
                game.ui.components.PopupOverlay.showHint(`Show Player Info ${window.scripts.showplayersinfo ? "Enabled" : "Disabled"}! ${e.code}.`);
                break;
            case "BracketLeft":
                sendPacket(9, { name: "LeaveParty" });
                game.ui.components.PopupOverlay.showHint(`Left Party! ${e.code}.`);
                break;
            case "Slash":
                if (!scripts.socketFollowMouse) {
                    scripts.socketRoundPlayer = false;
                    scripts.socketFollowMouse = true;
                    Object.keys(sockets).forEach(i => {
                        sockets[i].aiming = false;
                        sockets[i].sendPacket(3, { mouseUp: 1 });
                    })
                } else {
                    scripts.socketFollowMouse = false;
                    Object.keys(sockets).forEach(i => {
                        sockets[i].aiming = false;
                        sockets[i].sendPacket(3, { mouseUp: 1 });
                        sockets[i].sendPacket(3, { down: 0, left: 0, up: 0, right: 0 })
                        sockets[i].a77 = null;
                        sockets[i].a77r = null;
                    })
                }
                break;
            case "Semicolon":
                scripts.wasd = !scripts.wasd;
                break;
            case "Period":
                let oldSocket = nearestAltMouse;
                if (oldSocket && !oldSocket.mouseDownHit) {
                    oldSocket.mouseDownHit = 1;
                    oldSocket.sendPacket(9, { name: "EquipItem", itemName: "HealthPotion", tier: 1 });
                    setTimeout(() => {
                        oldSocket.sendPacket(3, { mouseDown: oldSocket.aimingYaw });
                    }, 100)
                    setTimeout(() => {
                        oldSocket.sendPacket(3, { mouseUp: 1 });
                        setTimeout(() => {
                            oldSocket.mouseDownHit = 0;
                        }, 100)
                    }, 7000)
                }
                break;
            case "Equal":
                scripts.socketRoundPlayer = true;
                scripts.socketFollowMouse = false;
                Object.keys(sockets).forEach(i => {
                    sockets[i].aiming = false;
                    sockets[i].sendPacket(3, { mouseUp: 1 });
                })
                break;
            case "Comma":
                let encoded = game.network.codec.encode(9, { name: "CastSpell", spell: "HealTowersSpell", x: Math.round(mouse.x), y: Math.round(mouse.y), tier: 1 });
                game.network.socket.send(encoded);
                Object.keys(sockets).forEach(i => {
                    sockets[i].ws.send(encoded);
                })
                break;
            case "KeyL":
                sendAlt();
                break;
            case "KeyF":
                if (!window.healPlayer) {
                    sendPacket(9, { name: "BuyItem", itemName: "HealthPotion", tier: 1 })
                    sendPacket(9, { name: "EquipItem", itemName: "HealthPotion", tier: 1 })
                    sendPacket(9, { name: "BuyItem", itemName: "HealthPotion", tier: 1 })
                    window.healPlayer = true;
                    setTimeout(() => {
                        window.healPlayer = false;
                    }, 1000);
                }
                break;
        }
    }
})

/*
fetch("https://api.ipify.org").then(e => e.text()).then(e => {
    ws.ip = e
});
*/

document.getElementsByClassName("hud-party-joining")[0].remove();