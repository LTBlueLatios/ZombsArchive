// ==UserScript==
// @name         AFS (AUTO FIX SHIELD)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Auto fix Zombie Shield Health
// @author       deathrain
// @match        *://zombs.io/*
// @grant        none
// ==/UserScript==UUPP
function FixShield() {
    if (Game.currentGame.ui.playerTick.zombieShieldHealth < 85000) {
        Game.currentGame.network.sendRpc({ name: "EquipItem", itemName: "ZombieShield", tier: Game.currentGame.ui.inventory.ZombieShield.tier });
    }
}
Game.currentGame.network.addRpcHandler("DayCycle", FixShield);