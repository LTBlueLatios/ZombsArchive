// ==UserScript==
// @name         Invisible Weapon (CrossBow) ZOMBS.IO!
// @namespace    -
// @version      1
// @description  Press [-] for this invisible weapon! It is called crossbow and it is found in the game files
// @author       Nathaniel_Scripts11
// @match        *://zombs.io/*
// @grant        none
// ==/UserScript==
addEventListener('keydown', function (e) { // when key is pressed
    if (e.key == "-") { // If the key being held down is '-'
        Game.currentGame.network.sendRpc({ name: "BuyItem", itemName: "Crossbow", tier: 1 }); // Buys item
        Game.currentGame.network.sendRpc({ name: "EquipItem", itemName: "Crossbow", tier: 1 }); // Holds item
        Game.currentGame.network.sendRpc({ name: "SendChatMessage", channel: "Local", message: "Invisible Weapon by Eh / Nathaniel_Scripts11!" }) // sends a chat message
        console.log('invisable') // debuggin stuff
    }
}) // :D