// ==UserScript==
// @namespace Zombs.io
// @name         Zombs.io Main XYZ
// @version      1.2.9
// @description  none
// @author       Droaqfcs
// @match        zombs.io
// @downloadURL https://update.greasyfork.org/scripts/448643/Zombsio%20Main%20XYZ.user.js
// @updateURL https://update.greasyfork.org/scripts/448643/Zombsio%20Main%20XYZ.meta.js
// ==/UserScript==

let E = (Element) => { return document.getElementsByClassName(Element); }
let I = (Element) => { return document.getElementById(Element); }
document.querySelectorAll('.ad-unit').forEach(function (a) { a.remove(); });

let XYZc = `
.hud-Droaqfcs-mod {
display: none;
position: fixed;
top: 50%;
left: 50%;
width: 600px;
height: 470px;
margin: -270px 0 0 -300px;
padding: 20px;
background: rgba(0, 0, 0, 0.6);
color: #fff;
border-radius: 4px;
z-index: 15;
}
.hud-Droaqfcs-mod .hud-mod-menu {
display: block;
height: 380px;
padding: 10px;
margin-top: 18px;
background: rgba(0, 0, 0, 0.2);
}
`
let styles = document.createElement("style");
styles.appendChild(document.createTextNode(XYZc));
document.head.appendChild(styles);
styles.type = "text/css";

let XYZh = `
<div class="hud-Droaqfcs-mod">
<button class="Xg" style="width: 30%">X</button>
<button class="Yg" style="width: 37%">Y</button>
<button class="Zg" style="width: 30%">Z</button>
<div class="hud-mod-menu">
</div>
</div>
`;
document.body.insertAdjacentHTML("afterbegin", XYZh);
let XYZi = document.getElementsByClassName("hud-Droaqfcs-mod")[0];

//Onclick
document.getElementsByClassName("hud-toolbar-item")[0].addEventListener("click", function () {
    if (XYZi.style.display == "none" || XYZi.style.display == "") {
        XYZi.style.display = "block";
    } else {
        XYZi.style.display = "none";
    };
});

E("Xg")[0].addEventListener("click", function () {
    BlockMenu();
    E("Xg")[0].innerText = "- X -";
    E("XYZ")[0].innerText = "- X -";
    for (let i = 0; i < 50; i++) {
        if (E(i + "xXg")[0]) {
            E(i + "xXg")[0].style.display = "";
        }
    }
})
E("Yg")[0].addEventListener("click", function () {
    BlockMenu();
    E("Yg")[0].innerText = "- Y -";
    E("XYZ")[0].innerText = "- Y -";
    for (let i = 0; i < 50; i++) {
        if (E(i + "xYg")[0]) {
            E(i + "xYg")[0].style.display = "";
        }
    }
})
E("Zg")[0].addEventListener("click", function () {
    BlockMenu();
    E("Zg")[0].innerText = "- Z -";
    E("XYZ")[0].innerText = "- Z -";
    for (let i = 0; i < 50; i++) {
        if (E(i + "xZg")[0]) {
            E(i + "xZg")[0].style.display = "";
        }
    }
})
function modm() { if (XYZi.style.display == "none" || XYZi.style.display == "") { XYZi.style.display = "block"; } else { XYZi.style.display = "none"; }; };
function BlockMenu() {
    E("Xg")[0].innerText = "X";
    E("Yg")[0].innerText = "Y";
    E("Zg")[0].innerText = "Z";
    for (let x = 0; x < 50; x++) {
        if (E(x + "xXg")[0]) {
            E(x + "xXg")[0].style.display = "none";
        }
    }
    for (let x = 0; x < 50; x++) {
        if (E(x + "xYg")[0]) {
            E(x + "xYg")[0].style.display = "none";
        }
    }
    for (let x = 0; x < 50; x++) {
        if (E(x + "xZg")[0]) {
            E(x + "xZg")[0].style.display = "none";
        }
    }
}
E("hud-mod-menu")[0].innerHTML = `
<div style="text-align:center">
<hr>
<h3 class="XYZ">Main XYZ<h3>
<hr>
<!--/*X*/--!>
<button id="sendws" class="0xXg">Send Alt</button>
<button id="msmovews" class="1xXg">Stay</button>
<button id="delallws" class="2xXg">Delete All Alts</button>
<button id="4pplws" class="3xXg">4 Player Trick</button>
<button class="4xXg" id="delalt">Delete Alt</button>
<input class="5xXg" id="delid" style="width: 10%" placeholder="Alt's Id">
<hr class="6xXg">
<button class="7xXg">Fill Party</button>
<button class="8xXg">Delete Party Alts</button>
<button class="10xXg">Fill Server</button>
<button class="11xXg">Delete Filler</button>
<button class="12xXg" id="buytmo">Buy Timeout</button>
<hr class="13xXg">
<h4 class="14xXg">Alt Ä°tems</h4>
<hr class="15xXg">
<button class="16xXg rr" id="buyht">Buy Heal Towers</button>
<button class="17xXg fr" id="pcx">Pickaxe</button>
<button class="18xXg xr" id="spr">Spear</button>
<button class="19xXg rn" id="bmb">Bomb</button>
<button class="20xXg tb" id="bow">Bow</button>
<div class="21xXg" id="items"><hr><h1>Items Tier List...</div>
<!--/*Y*/--!>
<input class="scanpplinput1  0xYg" value="Player" type="text" placeholder="name">
<button class="scanpplbutton1 1xYg">Scan?</button>
<br class="2xYg">
<input class="scanpplinput21 3xYg" value="1000" type="number" placeholder="highestwave">
<button class="highestwavebutton1 4xYg">Get hws?</button>
<br class="5xYg">
<input class="scanpplinput31 6xYg" value="1000000000" type="number" placeholder="highestscore">
<button class="highestscorebutton1 7xYg">Get hss?</button>
<p class = "idk1 8xYg"></p>
<!--/*Z*/--!>
</div>
`
BlockMenu();
/*Aito/Filler/Alts/Scripts*/
function buytmo() {
    for (let ws of document.getElementsByClassName('iframeAlts')) {
        ws.contentWindow.eval(`
game.network.sendRpc({
name: "BuyItem",
itemName: "Pause",
tier: 1
});
        `);
    };
};
function buyht() {
    for (let ws of document.getElementsByClassName('iframeAlts')) {
        ws.contentWindow.eval(`
    Game.currentGame.network.sendRpc({
    name:"CastSpell",
    spell:"HealTowersSpell",
    x: Math.round(Game.currentGame.ui.playerTick.position.x),
    y: Math.round(Game.currentGame.ui.playerTick.position.y),
    tier: 1
    })
        `);
    };
};
document.getElementsByClassName("12xXg")[0].addEventListener('click', function () {
    buytmo();
})
document.getElementsByClassName("16xXg")[0].addEventListener('click', function () {
    buyht();
})
window.partyfiller = () => {
    let iframe = document.createElement("iframe")
    iframe.className = "PartyAlts";
    iframe.src = `http://zombs.io/#/${game.options.serverId}/${game.ui.playerPartyShareKey}/`;
    iframe.addEventListener('load', function () {
        iframe.contentWindow.eval(`
        document.getElementsByClassName('hud-intro-name')[0].value = '-_|-Party Filler-|_-';
        game.renderer.scene.setVisible(false);
        document.getElementsByClassName("hud-intro-play")[0].click();
        game.network.addEntityUpdateHandler(() => {
          game.network.sendPacket(3, { left: 1, up: 1 });
        })
        `);
    })
    iframe.style.display = 'none';
    document.body.append(iframe);
}

window.deleteAllParty = () => {
    let deleteAltLoop = setInterval(function () {
        if (document.getElementsByClassName('PartyAlts').length > 0) {
            for (let iframe of document.getElementsByClassName('PartyAlts')) {
                iframe.remove();
            }
        }
        else {
            clearInterval(deleteAltLoop);
        }
    })
}
window.fillParty = () => {
    if (game.ui.playerPartyMembers.length == 1) {
        window.partyfiller();
        window.partyfiller();
        window.partyfiller();
    };
    if (game.ui.playerPartyMembers.length == 2) {
        window.partyfiller();
        window.partyfiller();
    };
    if (game.ui.playerPartyMembers.length == 3) {
        window.partyfiller();
    };
    if (game.ui.playerPartyMembers.length == 4) {
        game.ui.components.PopupOverlay.showHint("Your Party Is Already Full!");
    };
};
document.getElementsByClassName("7xXg")[0].addEventListener('click', function () {
    window.fillParty();
})
document.getElementsByClassName("8xXg")[0].addEventListener('click', function () {
    window.deleteAllParty();
})

window.Serverfiller = () => {
    let siframe = document.createElement("iframe")
    siframe.className = "PartyAlts";
    siframe.src = `http://zombs.io/#/${game.options.serverId}/${game.ui.playerPartyShareKey}/`;
    siframe.addEventListener('load', function () {
        siframe.contentWindow.eval(`
        document.getElementsByClassName('hud-intro-name')[0].value = '-_|-Server Filler-|_-';
        game.renderer.scene.setVisible(false);
        document.getElementsByClassName("hud-intro-play")[0].click();
        game.network.addEntityUpdateHandler(() => {
          game.network.sendPacket(3, { left: 1, up: 1 });
        })
        `);
    })
    siframe.style.display = 'none';
    document.body.append(siframe);
}

window.deleteAllFillers = () => {
    let sdeleteAltLoop = setInterval(function () {
        if (document.getElementsByClassName('PartyAlts').length > 0) {
            for (let iframe of document.getElementsByClassName('PartyAlts')) {
                iframe.remove();
            }
        }
        else {
            clearInterval(sdeleteAltLoop);
        }
    })
}
window.fillServer = () => {
    if (game.ui.playerPartyMembers.length == 1) {
        window.Serverfiller();
        window.Serverfiller();
        window.Serverfiller();
        window.Serverfiller();
        window.Serverfiller();
        window.Serverfiller();
        window.Serverfiller();
        window.Serverfiller();
    };
    if (game.ui.playerPartyMembers.length == 2) {
        window.Serverfiller();
        window.Serverfiller();
        window.Serverfiller();
        window.Serverfiller();
        window.Serverfiller();
        window.Serverfiller();
        window.Serverfiller();
        window.Serverfiller();
    };
    if (game.ui.playerPartyMembers.length == 3) {
        window.Serverfiller();
        window.Serverfiller();
        window.Serverfiller();
        window.Serverfiller();
        window.Serverfiller();
        window.Serverfiller();
        window.Serverfiller();
        window.Serverfiller();
    };
    if (game.ui.playerPartyMembers.length == 4) {
        window.Serverfiller();
        window.Serverfiller();
        window.Serverfiller();
        window.Serverfiller();
        window.Serverfiller();
        window.Serverfiller();
        window.Serverfiller();
        window.Serverfiller();
    };
};
document.getElementsByClassName("10xXg")[0].addEventListener('click', function () {
    window.fillServer();
})
document.getElementsByClassName("11xXg")[0].addEventListener('click', function () {
    window.deleteAllFillers();
})
document.getElementById("delalt").addEventListener("click", function deleteAlt() {
    let deletealtnum = parseInt(document.getElementById('delid').value);
    document.getElementById(deletealtnum).remove();
    V_IframesCount--;
});
document.getElementsByClassName('hud-intro-name')[0].value = 'SerplentScripts';
let V_IframesCount = 0;
let V_NearestToCursor;
document.getElementById('sendws').addEventListener('click', function () {
    let iframe = document.createElement('iframe');
    iframe.id = V_IframesCount;
    V_IframesCount++;
    iframe.className = "iframeAlts";
    iframe.src = `http://zombs.io/#/${game.options.serverId}/${game.ui.playerPartyShareKey}/${iframe.id}`;
    iframe.addEventListener('load', function (e) {
        iframe.contentWindow.eval(`
    document.getElementsByClassName('hud-intro-name')[0].value = '${iframe.id}';
          window.nearestToCursor = false;
          let iframeId = location.hash.substring(8);
          game.renderer.scene.setVisible(false);

          document.getElementsByClassName("hud-intro-play")[0].click();
          var joinedGameCheck = setTimeout(function(){
            if (document.getElementsByClassName('hud-intro-error')[0].innerHTML !== "" && !game.world.inWorld) {
              parent.game.ui.getComponent('PopupOverlay').showHint(document.getElementsByClassName('hud-intro-error')[0].innerHTML, 3000);
              parent.V_IframesCount--;
              parent.document.getElementById("iframeId" + iframeId).remove();
            }
          }, 20000)

          game.network.addEnterWorldHandler(function(e) {
                clearTimeout(joinedGameCheck);
          })

          function MoveAltTo(position){
            let x = Math.round(position.x);
            let y = Math.round(position.y);

            if (game.ui.playerTick.position.y-y > 100) {
              game.network.sendInput({down: 0})
            } else {
              game.network.sendInput({down: 1})
            }
            if (-game.ui.playerTick.position.y+y > 100) {
               game.network.sendInput({up: 0})
            } else {
               game.network.sendInput({up: 1})
            }
            if (-game.ui.playerTick.position.x+x > 100) {
               game.network.sendInput({left: 0})
            } else {
               game.network.sendInput({left: 1})
            }
            if (game.ui.playerTick.position.x-x > 100) {
               game.network.sendInput({right: 0})
            } else {
               game.network.sendInput({right: 1})
            }
          }

          game.network.addEntityUpdateHandler(() => {
            if (game.ui.playerTick){
              switch (parent.document.getElementById('msmovews').innerText){
                case "Follow Player":
                  MoveAltTo(parent.game.ui.playerTick.position);
                  break;
                case "Follow Cursor":
                  MoveAltTo(parent.game.renderer.screenToWorld(parent.game.ui.mousePosition.x, parent.game.ui.mousePosition.y));
                  break;
                case "Stay":
                  game.network.sendInput({left: 0});
                  game.network.sendInput({right: 0});
                  game.network.sendInput({up: 0});
                  game.network.sendInput({down: 0});
                  break;
                case "Move Exactly":
                  if(parent.document.getElementById('hud-chat').className.includes('is-focus')) break;
                  let xyVel = {x: 0, y: 0};
                  if (parent.game.inputManager.keysDown[87]) xyVel.y++; // w
                  if (parent.game.inputManager.keysDown[65]) xyVel.x--; // a
                  if (parent.game.inputManager.keysDown[83]) xyVel.y--; // s
                  if (parent.game.inputManager.keysDown[68]) xyVel.x++; // d
                  game.network.sendInput({up: xyVel.y > 0 ? 1 : 0});
                  game.network.sendInput({left: xyVel.x < 0 ? 1 : 0});
                  game.network.sendInput({down: xyVel.y < 0 ? 1 : 0});
                  game.network.sendInput({right: xyVel.x > 0 ? 1 : 0});
                  break;
              }

              //Aim
              let worldMousePos = parent.game.renderer.screenToWorld(parent.game.ui.mousePosition.x, parent.game.ui.mousePosition.y);
              if (parent.game.inputManager.mouseDown) {
                game.network.sendInput({mouseDown: 0});
                game.network.sendInput({mouseMoved: game.inputPacketCreator.screenToYaw((-game.ui.playerTick.position.x + worldMousePos.x)*100, (-game.ui.playerTick.position.y + worldMousePos.y)*100)});
              }
              if (!parent.game.inputManager.mouseDown) {
                if (!window.nearestToCursor && parent.game.inputManager.keysDown[73]) game.network.sendInput({mouseUp: 0});
                game.network.sendInput({mouseMoved: game.inputPacketCreator.screenToYaw((-game.ui.playerTick.position.x + worldMousePos.x)*100, (-game.ui.playerTick.position.y + worldMousePos.y)*100)});
              }

              if(!parent.game.inputManager.mouseDown){
                if (window.nearestToCursor && parent.game.inputManager.keysDown[73]) {
                  game.network.sendRpc({name: "JoinPartyByShareKey",partyShareKey: parent.document.getElementById('B_AltHitInput').value});
                  game.network.sendInput({mouseDown: 0});
                }
                if(parent.game.inputManager.keysDown[73] && game.ui.playerPartyShareKey === parent.document.getElementById('B_AltHitInput').value){
                  game.network.sendRpc({ name: "LeaveParty"})
                  game.network.sendInput({mouseUp: 0});
                }
                else{
                  game.network.sendInput({mouseUp: 0});
                }
              }
              //////////////////////////////////////////////////////////////////////////////////////////////////
              game.network.addRpcHandler("Dead", function(e) {
                game.network.sendPacket(3, { respawn: 1 })
              })
            }
          })
          function GetDistanceToCursor(cursorPos){
            let pos = game.ui.playerTick.position;
            let xDistance = Math.abs(pos.x - cursorPos.x);;
            let yDistance = Math.abs(pos.y - cursorPos.y);
            return Math.sqrt((xDistance * xDistance) + (yDistance * yDistance));
          }
          game.network.sendRpc({name: "BuyItem",itemName: "spear",tier: 1});
          game.network.sendRpc({name: "EquipItem",itemName: "spear",tier: 1});
          game.network.sendRpc({name: "BuyItem",itemName: "spear",tier: 2});
          game.network.sendRpc({name: "EquipItem",itemName: "spear",tier: 2});
        `);
    })
    iframe.style.display = 'none';
    document.body.append(iframe);
})

let V_AltMoveClicks = 0;
var V_AltMoveStyle = "Stay";
document.getElementById('msmovews').addEventListener('click', function () {
    let moveOrder = ["Stay", "Follow Cursor", "Follow Player", "Move Exactly"];
    V_AltMoveClicks++;
    V_AltMoveStyle = moveOrder[V_AltMoveClicks % 4]
    document.getElementById('msmovews').innerText = V_AltMoveStyle;
})

document.getElementById('delallws').addEventListener('click', function () {
    let deleteAltLoop = setInterval(function () {
        if (document.getElementsByClassName('iframeAlts').length > 0) {
            for (let iframe of document.getElementsByClassName('iframeAlts')) {
                iframe.remove();
            }
            V_IframesCount--;
        }
        else {
            clearInterval(deleteAltLoop);
        }
    })
})

var nearestToCursorIframeId;
setInterval(() => {
    let nearestIframeDistance = 9999999999999999;
    for (let iframe of document.getElementsByClassName('iframeAlts')) {
        if (typeof (iframe.contentWindow.nearestToCursor) === 'undefined') continue;
        iframe.contentWindow.nearestToCursor = false;
        let mousePosition = game.renderer.screenToWorld(game.ui.mousePosition.x, game.ui.mousePosition.y);
        let distance = iframe.contentWindow.GetDistanceToCursor(mousePosition);
        if (distance < nearestIframeDistance) {
            nearestIframeDistance = distance;
            nearestToCursorIframeId = iframe.id;
        }
    }
    if (document.getElementById(nearestToCursorIframeId)) {
        let iframeWindow = document.getElementById(nearestToCursorIframeId).contentWindow;
        if (typeof (iframeWindow.nearestToCursor) === 'boolean') {
            iframeWindow.nearestToCursor = true;
        }
    }
}, 100)
window.leaveAll = () => {
    for (let ws of document.getElementsByClassName('iframeAlts')) {
        ws.contentWindow.eval(`
            game.network.sendRpc({
			    name: "LeaveParty"});
        `);
    };
};



window.joinAll = () => {
    for (let ws of document.getElementsByClassName('iframeAlts')) {
        ws.contentWindow.eval(`
            game.network.sendRpc({
			    name: "JoinPartyByShareKey",
			    partyShareKey: "${game.ui.getPlayerPartyShareKey()}"
		    });
        `);
    };
};


let isDay,
    tickStarted,
    tickToEnd,
    hasleaved = false,
    hasJoined = false;

game.network.addEntityUpdateHandler(tick => {
    if (window.playerTrickToggle) {
        if (!hasleaved) {
            if (tick.tick >= tickStarted + 18 * (1000 / game.world.replicator.msPerTick)) {
                window.leaveAll();
                hasleaved = true;
            };
        };
        if (!hasJoined) {
            if (tick.tick >= tickStarted + 118 * (1000 / game.world.replicator.msPerTick)) {
                window.joinall();
                hasJoined = true;
            };
        };
    };
});

game.network.addRpcHandler("DayCycle", e => {
    isDay = !!e.isDay;
    if (!isDay) {
        tickStarted = e.cycleStartTick;
        tickToEnd = e.nightEndTick;
        hasleaved = false;
        hasJoined = false;
    };
});

window.togglePlayerTrick = () => {
    window.playerTrickToggle = !window.playerTrickToggle;
};
document.getElementsByClassName("3xXg")[0].addEventListener('click', function () {
    window.playerTrickToggle = !window.playerTrickToggle;
    document.getElementsByClassName("3xXg")[0].innerText = "4 Player Trick -";
    if (window.playerTrickToggle) {
        document.getElementsByClassName("3xXg")[0].innerText = "4 Player Trick +";
    }
})
wss = new WebSocket("wss://ViolentWateryNetworks.thethe4.repl.co/");
serverObj = {};
wss.onmessage = (e) => {
    console.log(e);
    if (e.data.includes('"m":')) {
        serverObj = JSON.parse(e.data).m;
        for (let i = 0; i < document.getElementsByClassName("hud-intro-server")[0].length; i++) {
            let id = document.getElementsByClassName("hud-intro-server")[0][i].value;
            let target = serverObj[id].leaderboardDataObj.sort((a, b) => b.wave - a.wave)[0];
            document.getElementsByClassName("hud-intro-server")[0][i].innerText = `${game.options.servers[id].name}, ppl: ${serverObj[id].population / 3.125}, ${target.wave} <= ${target.name}`;
        }
    }
}

let alp = ["", "K", "M", "B", "T", "Q"];
let counter = (value = 0) => {
    return length = (value).toLocaleString().split(",").length - 1, v = (value / `1e${length * 3}`).toFixed(2) - "" + alp[length], n = !v ? "LIMIT" : isNaN(v - "") ? v : v - "";
};

find_1 = (targetName = "Player", findAll = false) => {
    let targets = {};
    let results = 0;
    Object.values(serverObj).forEach(server => {
        if (!server.leaderboardDataObj) return;
        server.leaderboardDataObj.forEach(result => {
            if (result.name.toLowerCase().includes(targetName.toLowerCase()) && !findAll) {
                targets[result.uid] = { server: server.id, name: result.name, wave: result.wave, score: result.score, uid: result.uid };
                results++;
            }
            if (findAll) {
                targets[result.uid] = { server: server.id, name: result.name, wave: result.wave, score: result.score, uid: result.uid };
                results++;
            }
        })
    })
    let sortedTargets = Object.values(targets).sort((a, b) => b.wave - a.wave);
    return [`All the results that includes ${targetName}, ${results}`, sortedTargets]
}

highestWave_1 = (moreOrEqualTo = 1000, lessOrEqualTo = Infinity) => {
    let targets = {};
    let results = 0;
    Object.values(serverObj).forEach(server => {
        if (!server.leaderboardDataObj) return;
        server.leaderboardDataObj.forEach(result => {
            if (result.wave >= moreOrEqualTo && result.wave <= lessOrEqualTo) {
                targets[result.uid] = { server: server.id, name: result.name, wave: result.wave, score: result.score, uid: result.uid };
                results++;
            }
        })
    })
    let sortedTargets = Object.values(targets).sort((a, b) => b.wave - a.wave);
    return [`All the results for waves more or equal to ${moreOrEqualTo} and less or equal to ${lessOrEqualTo}, ${results}`, sortedTargets]
}

highestScore_1 = (moreOrEqualTo = 1000000000, lessOrEqualTo = Infinity) => {
    let targets = {};
    let results = 0;
    Object.values(serverObj).forEach(server => {
        if (!server.leaderboardDataObj) return;
        server.leaderboardDataObj.forEach(result => {
            if (result.score >= moreOrEqualTo && result.score <= lessOrEqualTo) {
                targets[result.uid] = { server: server.id, name: result.name, wave: result.wave, score: result.score, uid: result.uid };
                results++;
            }
        })
    })
    let sortedTargets = Object.values(targets).sort((a, b) => b.score - a.score);
    return [`All the results for scores more or equal to ${moreOrEqualTo} and less or equal to ${lessOrEqualTo}, ${results}`, sortedTargets]
}
let num = 0;
onclickscannedserver = (server) => {
    document.getElementsByClassName("hud-intro-server")[0].value = server;
    game.ui.components.Leaderboard.leaderboardData = serverObj[server].leaderboardDataObj;
    game.ui.components.Leaderboard.update();
};
let scanByName = (name, scanEveryone = false, idd = "") => {
    let result = find_1(name, scanEveryone)[0];
    let input = find_1(name, scanEveryone)[1];
    let data = result + ", {\n";
    for (let i in input) {
        let e = input[i];
        let num_1 = num++;
        data += `<div class="tag${num_1}" onclick="onclickscannedserver('${e.server}');">${"    " + i + ", n: " + e.name + ", sid: " + e.server + ", w: " + counter(e.wave) + ", s: " + counter(e.score) + ",\n"}</div>`;
    }
    data += "}";
    let n = "idk" + idd;
    console.log([n, idd, document.getElementsByClassName(n)[0]])
    document.getElementsByClassName(n)[0].innerHTML = data;
}

let highestwave = (highest, idd = "") => {
    let result = highestWave_1(highest)[0];
    let input = highestWave_1(highest)[1];
    let data = result + ", {\n";
    for (let i in input) {
        let e = input[i];
        let num_1 = num++;
        data += `<div class="tag${num_1}" onclick="onclickscannedserver('${e.server}');">${"    " + i + ", n: " + e.name + ", sid: " + e.server + ", w: " + counter(e.wave) + ", s: " + counter(e.score) + ",\n"}</div>`;
    }
    data += "}";
    let n = "idk" + idd;
    document.getElementsByClassName(n)[0].innerHTML = data;
}

let highestscore = (highest, idd = "") => {
    let result = highestScore_1(highest)[0];
    let input = highestScore_1(highest)[1];
    let data = result + ", {\n";
    for (let i in input) {
        let e = input[i];
        let num_1 = num++;
        data += `<div class="tag${num_1}" onclick="onclickscannedserver('${e.server}');">${"    " + i + ", n: " + e.name + ", sid: " + e.server + ", w: " + counter(e.wave) + ", s: " + counter(e.score) + ",\n"}</div>`;
    }
    data += "}";
    let n = "idk" + idd;
    document.getElementsByClassName(n)[0].innerHTML = data;
}
document.getElementsByClassName("scanpplbutton1")[0].onclick = () => {
    let value = document.getElementsByClassName("scanpplinput1")[0].value;
    scanByName(value, false, "1");
}
document.getElementsByClassName("highestwavebutton1")[0].onclick = () => {
    let value = document.getElementsByClassName("scanpplinput21")[0].value;
    highestwave(value, "1");
}
document.getElementsByClassName("highestscorebutton1")[0].onclick = () => {
    let value = document.getElementsByClassName("scanpplinput31")[0].value;
    highestscore(value, "1");
}
let interval_1 = setInterval(() => {
    if (document.getElementsByClassName("scanpplbutton")[0]) {
        clearInterval(interval_1);
        document.getElementsByClassName("scanpplbutton")[0].onclick = () => {
            let value = document.getElementsByClassName("scanpplinput")[0].value;
            scanByName(value);
        }
        document.getElementsByClassName("highestwavebutton")[0].onclick = () => {
            let value = document.getElementsByClassName("scanpplinput2")[0].value;
            highestwave(value);
        }
        document.getElementsByClassName("highestscorebutton")[0].onclick = () => {
            let value = document.getElementsByClassName("scanpplinput3")[0].value;
            highestscore(value);
        }
    }
}, 100);


// ==UserScript==
// @name         Serplent Chat Blocker
// @namespace    -
// @version      0.1
// @description  serplent
// @author       Super OP Chat Blocker made by SerplenttScripts
// @match        zombs.io
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

let blockedNames = [];

window.blockPlayer = name => {
    game.ui.components.PopupOverlay.showConfirmation(`Are you sure you want to block ${name}?`, 3500, () => {
        blockedNames.push(name);
        for (let msg of Array.from(document.getElementsByClassName("hud-chat-message"))) {
            if (msg.childNodes[2].innerText === name) {
                let bl = msg.childNodes[0];
                bl.innerHTML = "Unblock";
                bl.style.color = "red";
                bl.onclick = () => {
                    window.unblockPlayer(name);
                };
            };
        };
    }, () => { });
};

window.unblockPlayer = name => {
    blockedNames.splice(blockedNames.indexOf(name), 1);
    for (let msg of Array.from(document.getElementsByClassName("hud-chat-message"))) {
        if (msg.childNodes[2].innerText === name) {
            let bl = msg.childNodes[0];
            bl.innerHTML = "Block";
            bl.style.color = "red";
            bl.onclick = () => {
                window.blockPlayer(name);
            };
        };
    };
};

const getClock = () => {
    var date = new Date();
    var d = date.getDate();
    var d1 = date.getDay();
    var h = date.getHours();
    var m = date.getMinutes();
    var s = date.getSeconds()
    var session = "PM";

    if (h == 2) {
        h = 12;
    };

    if (h < 13) {
        session = "AM"
    };
    if (h > 12) {
        session = "PM";
        h -= 12;
    };

    h = (h < 10) ? "0" + h : h;
    m = (m < 10) ? "0" + m : m;
    s = (s < 10) ? "0" + s : s;
    return `${h}:${m} ${session}`;
}

Game.currentGame.network.emitter.removeListener("PACKET_RPC", Game.currentGame.network.emitter._events.PACKET_RPC[1]);
let onMessageReceived = (msg => {
    let a = Game.currentGame.ui.getComponent("Chat"),
        b = msg.displayName.replace(/<(?:.|\n)*?>/gm, ''),
        c = msg.message.replace(/<(?:.|\n)*?>/gm, '')
    if (blockedNames.includes(b) || window.chatDisabled) { return; };
    let d = a.ui.createElement(`<div class="hud-chat-message"><a href="javascript:void(0);" onclick="window.blockPlayer(\`${b}\`)" style="color: red;">Block</a> <strong>${b}</strong> <small> at ${getClock()}</small>: ${c}</div>`);
    a.messagesElem.appendChild(d);
    a.messagesElem.scrollTop = a.messagesElem.scrollHeight;
})
Game.currentGame.network.addRpcHandler("ReceiveChatMessage", onMessageReceived);