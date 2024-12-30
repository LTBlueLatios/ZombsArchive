// ==UserScript==
// @name         Auto-buy Spear for raiding in ZOMBS.IO!
// @namespace    raiding but much more ez
// @version      1
// @description  Press [#] to auto buy spear
// @author       Vengeance & REMZAS个
// @match        http://zombs.io/
// @grant        none
// ==/UserScript==
addEventListener('keydown', function (e) { // when key is pressed
    if (e.key == "#") { // If the key being held down is '#'
        Game.currentGame.network.sendRpc({ name: "BuyItem", itemName: "Spear", tier: 1 }); // Buys item
        Game.currentGame.network.sendRpc({ name: "EquipItem", itemName: "Spear", tier: 1 }); // Holds item
    }
}) // : D