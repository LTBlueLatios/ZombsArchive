// ==UserScript==
// @name         Server Scanner, automatically verify and ?verify script. Never leak this.
// @namespace    -
// @version      0.1
// @description  You have access to scanner. ?verify for sell permission and to avoid being auto kicked.
// @author       You
// @match        zombs.io
// @grant        none
// @require      https://night-boggy-bard.glitch.me/bincodec31.js
// ==/UserScript==

partyInfo = [{}];
autoKickNonVerifiedPpl = false; // don't set to true, i can only use it because i can verify my alts...
autoSellPermVerifiedPpl = true;
verifiedUids = {};
hasVerifiedBefore = {};
askedForVerification = {};
bannedUids = {};

let PasteOnlyOnce = () => {
    window.hasPastedOnlyOnce = true;
    let syncSellPermsKey;
    let decodedSyncSellPerm;
    let whoAsked;
    partyInfo = [{}]
    let decodeVerificationCodes = {a: 120, b: 534, c: 323, d: 320, e: 476, f: 326, g: -100, h: 321, i: 543, j: -786, k: 333, l: -239, m: 611, n: 340, o: -687, p: 365, q: 397, r: 547, s: -24, t: 900, u: 431, v: 1003, w: -476, x: 1012, y: -90, z: 1048, 0: 356, 1: 456, 2: 324, 3: 786, 4: 365, 5: 244, 6: 1009, 7: 2000, 8: 2021, 9: 900, "-": 4000};
    let encodedVericationCode = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx-xxxxxxxx".replace(/[xy]/g, function(a) {var b = 16 * Math.random() | 0; return ("x" == a ? b : b & 3 | 8).toString(16)});
    let decodedhardverication = encodedVericationCode.split("").map(e => decodeVerificationCodes[e] + 81).reduce((a, b) => a * b) + ""; // this is very illegal for a random dev xD.
    encodedVericationCode = null;
    decodedhardverication = null;

    game.network.addRpcHandler("PartyInfo", response => {
        partyInfo = response;
        if (response[0].playerUid == game.world.myUid) {
            response.forEach(e => {
                verifiedUids[e.playerUid] ? autoSellPermVerifiedPpl && !e.canSell && game.network.sendRpc({name: "SetPartyMemberCanSell", uid: e.playerUid, canSell: 1}) : (autoKickNonVerifiedPpl || bannedUids[e.playerUid]) && !socketsByUid[e.playerUid] && game.network.sendRpc({name: "KickParty", uid: e.playerUid});
            })
        }
    });

    game.network.addRpcHandler("ReceiveChatMessage", e => {
        if (!verifiedUids[game.world.myUid]) {
            verifiedUids[game.world.myUid] = 1;
        }
        if ((e.message == "?verify" || e.message == "?ver&#105;fy") && !verifiedUids[e.uid == game.world.myUid ? 0 : e.uid] && autoSellPermVerifiedPpl) {
            if ((partyInfo[0].playerUid ? partyInfo[0].playerUid : game.ui.playerPartyMembers[0].playerUid) == game.world.myUid && e.uid !== game.world.myUid) {
                if (askedForVerification[e.uid]) {
                    askedForVerification[e.uid] = askedForVerification[e.uid] + 1;
                }
                if (!askedForVerification[e.uid]) {
                    askedForVerification[e.uid] = 1;
                }
                if (askedForVerification[e.uid] > 5) return;
            }
            whoAsked = e.uid;
            setTimeout(() => {
                if ((partyInfo[0].playerUid ? partyInfo[0].playerUid : game.ui.playerPartyMembers[0].playerUid) == game.world.myUid && e.uid !== game.world.myUid) {
                    encodedVericationCode = "?!/cid, " + "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx-xxxxxxxx".replace(/[xy]/g, function(a) {var b = 16 * Math.random() | 0; return ("x" == a ? b : b & 3 | 8).toString(16)});
                    decodedhardverication = encodedVericationCode.split("?!/cid, ").join("").split("").map(e => decodeVerificationCodes[e] + 81).reduce((a, b) => a * b) + "";
                    game.network.sendRpc2 ? game.network.sendRpc2({name: "SendChatMessage", channel: "Local", message: encodedVericationCode}) : game.network.sendRpc({name: "SendChatMessage", channel: "Local", message: encodedVericationCode})
                }
            }, 1100)
        }
        if (e.message.startsWith("?syncdc")) {
            let key = e.message.split("?syncdc ")[1];
            if (decodedhardverication && key == decodedhardverication) {
                decodedhardverication = null;
                verifiedUids[e.uid] = 1;
                hasVerifiedBefore[e.uid] = 1;
                autoSellPermVerifiedPpl && game.network.sendRpc({name: "SetPartyMemberCanSell", uid: e.uid, canSell: 1})
            }
        }
        if (e.message.startsWith("?!/cid, ") && whoAsked == game.world.myUid) {
            decodedhardverication = e.message.split("?!/cid, ").join("").split("").map(e => decodeVerificationCodes[e] + 81).reduce((a, b) => a * b) + "";
            game.network.sendRpc2 ? game.network.sendRpc2({name: "SendChatMessage", channel: "Local", message: "?syncdc " + decodedhardverication}) : game.network.sendRpc({name: "SendChatMessage", channel: "Local", message: "?syncdc " + decodedhardverication})
        }
        if (verifiedUids[e.uid] && (e.message.startsWith("?kickp") || e.message.startsWith("?k&#105;ckp"))) {
            let args = e.message.split(" ");
            let thisUid = args[1] - "";
            verifiedUids[thisUid] ? null : game.network.sendRpc({name: "KickParty", uid: thisUid});
        }
        if (verifiedUids[e.uid] && (e.message.startsWith("?ban") || e.message.startsWith("?b&#97;n"))) {
            let args = e.message.split(" ");
            let thisUid = args[1] - "";
            verifiedUids[thisUid] ? null : game.network.sendRpc({name: "KickParty", uid: thisUid});
            bannedUids[thisUid] = 1;
        }
        if (verifiedUids[e.uid] && (e.message.startsWith("?verify") || e.message.startsWith("?ver&#105;fy"))) {
            let args = e.message.split(" ");
            if (args[1]) {
                let thisUid = args[1] - "";
                verifiedUids[thisUid] = 1;
                hasVerifiedBefore[thisUid] = 1;
                game.network.sendRpc({name: "SetPartyMemberCanSell", uid: thisUid, canSell: 1})
            }
        }
        if (e.uid == game.world.myUid && (e.message == "?enablesell" || e.message == "?en&#97;blesell")) {
            autoSellPermVerifiedPpl = true;
        }
        if (e.uid == game.world.myUid && (e.message == "?disablesell" || e.message == "?d&#105;s&#97;blesell")) {
            autoSellPermVerifiedPpl = false;
        }
        if (e.uid == game.world.myUid && (e.message == "?ak" || e.message == "?&#97;k")) {
            autoKickNonVerifiedPpl = true;
        }
        if (e.uid == game.world.myUid && (e.message == "??ak" || e.message == "??&#97;k")) {
            autoKickNonVerifiedPpl = false;
        }
    })
}
!window.hasPastedOnlyOnce && PasteOnlyOnce();

// access to scanner
localStorage.wsEnv = "wss://idealglisteningprocessors.thethe4.repl.co/";
localStorage.isxyzAllowed = "2";
localStorage.haspassword = ";2s_6p_13f_10d; x < -1;";
localStorage.hasAccess = "2";
localStorage.shouldCycleWithoutTimeouts = "";
window._hasacctolkey = true;

// scanner
wss = null;
codec = new BinCodec();
serverObj = {};
let leaderboardLoaded;

function myWS() {
    if (localStorage.isxyzAllowed !== "2") return;
    wss = new WebSocket(localStorage.wsEnv);
    wss.binaryType = "arraybuffer";
    wss.onopen = () => {
        if (localStorage.haspassword && localStorage.hasAccess == "2") thisNetwork.sendMessage(localStorage.haspassword);
    }
    wss.onmessage = (e) => {
        let data = codec.decode(e.data);
        let response = data.response;
        let parsedResponse;
        if (response.data) {
            parsedResponse = JSON.parse(response.data);
            if (parsedResponse) {
                if (parsedResponse.id) {
                    thisInfo.id = parsedResponse.id;
                }
                if (parsedResponse.verifiedusers) {
                    verifiedUids = parsedResponse.verifiedusers;
                    console.log(parsedResponse.verifiedusers);
                    for (let i in partyInfo) {
                        verifiedUids[partyInfo[i].playerUid] && autoSellPermVerifiedPpl && game.network.sendRpc({name: "SetPartyMemberCanSell", uid: partyInfo[i].playerUid, canSell: 1})
                    }
                    for (let i in hasVerifiedBefore) {
                        verifiedUids[i] = 1;
                    }
                }
            }
            if (parsedResponse && !parsedResponse.id && !parsedResponse.verifiedusers) {
                serverObj = parsedResponse;
                if (!leaderboardLoaded) {
                    leaderboardLoaded = true;
                    game.ui.components.Leaderboard.leaderboardData = serverObj[document.getElementsByClassName("hud-intro-server")[0].value].leaderboardDataObj;
                    game.ui.components.Leaderboard.update();
                }
                for (let i = 0; i < document.getElementsByClassName("hud-intro-server")[0].length; i++) {
                    let id = document.getElementsByClassName("hud-intro-server")[0][i].value;
                    if (serverObj[id]) {
                        let target = serverObj[id].leaderboardDataObj.sort((a, b) => b.wave - a.wave)[0];
                        document.getElementsByClassName("hud-intro-server")[0][i].innerText = `${game.options.servers[id].name}, ppl: ${serverObj[id].population}, ${target.wave} <= ${target.name}`;
                    }
                }
            }
        } else {
            if (!response.msg.includes(`{"tk":"`) && !response.msg.includes(`, [`)) {
                //console.log(response);
            }
        }
    }
}
thisNetwork = {
    codec: codec,
    sendMessage(message) {
        wss.send(codec.encode(9, {name: "message", msg: message}));
    },
    getdisconnected() {
        return wss.readyState == wss.CLOSED;
    },
    disconnect() {
        wss.close();
    },
    reconnect() {
        myWS();
    }
}
thisInfo = {
    id: null,
    name: null,
    uid: null,
    host: null,
    active: false
}
game.network.addEnterWorldHandler(e => {
    thisInfo.uid = e.uid;
    thisInfo.name = e.effectiveDisplayName;
    thisInfo.host = game.network.socket.url;
    thisInfo.active = true;
    thisNetwork.sendMessage("!uid " + e.uid);
    wss.uid = game.world.myUid;
})
myWS();
setInterval(() => {
    if (localStorage.isxyzAllowed == "2" && thisNetwork.getdisconnected()) {
        thisNetwork.reconnect();
    }
}, 5000);

setInterval(() => {
    wss.readyState == 1 && game.world.myUid && !wss.uid && (wss.uid = game.world.myUid) && (thisInfo.uid = game.world.myUid) && thisNetwork.sendMessage("!uid " + game.world.myUid);
}, 2500)