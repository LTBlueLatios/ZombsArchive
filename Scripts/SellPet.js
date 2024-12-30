// ==UserScript==
// @name         sell pet
// @namespace    http://tampermonkey.net/
// @version      1
// @description  sell your pet!
// @author       somebody
// @match        *://zombs.io/*
// @grant        none
// ==/UserScript==UUPP
document.getElementById("SellPet").onclick = () => {
    for (var uid in entities) {
        if (!entities.hasOwnProperty(uid)) continue;
        var obj = entities[uid];
        if (entities[uid].fromTick.model == "PetCARL" || entities[uid].fromTick.model == "PetMiner") {
            Game.currentGame.network.sendRpc({ name: "DeleteBuilding", uid: obj.fromTick.uid })
        }
    }
}