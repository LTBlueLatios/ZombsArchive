// ==UserScript==
// @name         Invincibility Shield
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Never die again
// @author       Vengeance
// @match        *://zombs.io/*
// @grant        none
// ==/UserScript==UUUPP
function FixHealth() {
    if (Game.currentGame.ui.playerTick.Health < 85000) {
        Game.currentGame.network.sendRpc({ name: "EquipItem", itemName: "Health", tier: Game.currentGame.ui.inventory.Health.tier });
    }
}
Game.currentGame.network.addRpcHandler("DayCycle", FixHealth);