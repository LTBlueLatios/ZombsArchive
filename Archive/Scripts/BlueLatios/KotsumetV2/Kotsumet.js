/* eslint-disable complexity */
import SocketHandler from "./SocketHandler";
import SocketComponent from "./SocketComponent";
import MouseMove from "./SocketPlugins/MouseMove";

import CommandParser from "./CommandParser";
import PopupManager from "./PopupManager";

import AutoBuild from "./AutoBuild";
const autoBuild = new AutoBuild();

import Scanner from "../scanner";
globalThis.Scanner = Scanner;

const socketHandler = new SocketHandler();
socketHandler.registerPlugins([MouseMove]);
MouseMove.init(SocketComponent);

globalThis.socketHandler = socketHandler;
function createEvent(type, data) {
    document.dispatchEvent(new CustomEvent(type, data));
}

const commandParser = new CommandParser();
const popupManager = new PopupManager();

const originalSendRpc = game.network.sendRpc;
game.network.sendRpc = async function () {
    const args = Array.from(arguments);
    const rpcName = args[0].name;

    if (rpcName == "BuyItem" && args[0].itemName) {
        createEvent("SocketEvent", {
            detail: {
                action: "BuyItem",
                payload: {
                    itemName: args[0].itemName
                }
            }
        });
    }

    if (rpcName == "EquipItem" && args[0].itemName) {
        createEvent("SocketEvent", {
            detail: {
                action: "EquipItem",
                payload: {
                    itemName: args[0].itemName
                }
            }
        });
    }

    if (rpcName === "SendChatMessage") {
        try {
            const handled = await commandParser.handleCommand(args[0].message);
            if (handled) {
                return;
            }
        } catch (error) {
            popupManager.show(`Command error: ${error.message}`);
            return;
        }
    }

    return originalSendRpc.apply(this, args);
};

commandParser.registerCommand("test", {
    description: "A test command",
    usage: "/test [message] [--color red|blue|green]",
    minArgs: 0,
    maxArgs: 1,
    execute: ({ args, options }) => {
        const message = args[0] || "test!";
        const color = options.color || "white";
        popupManager.show(message, { color });
    }
});

const originalSendInput = game.network.sendInput;
game.network.sendInput = function (...args) {
    const result = originalSendInput.apply(this, args);
    if (!socketHandler.states.controlled) return;
    const [inputData] = args;

    if (Object.hasOwn(inputData, "space")) {
        SocketComponent.sendPacket(null, 3, {
            space: inputData.space
        }, true);
    }

    if (Object.hasOwn(inputData, "mouseDown")) {
        SocketComponent.sendPacket(null, 3, {
            mouseDown: inputData.mouseDown
        }, true);
    } else if (Object.hasOwn(inputData, "mouseUp")) {
        SocketComponent.sendPacket(null, 3, {
            mouseUp: inputData.mouseUp
        }, true);
    }

    return result;
};

// document.addEventListener("keydown", (event) => {
//     let socket,
//         message,
//         base;
//     switch (event.key) {
//         case "l":
//             socketHandler.createSocket();
//             break;
//         case ".":
//             socket = socketHandler.getClosestPlayerToMouse();
//             SocketComponent.sendPacket(socket, 9, {
//                 name: "BuyItem",
//                 itemName: "HealthPotion",
//                 tier: 1
//             })
//             SocketComponent.sendPacket(socket, 9, { name: "EquipItem", itemName: "HealthPotion", tier: 1 });
//             SocketComponent.sendPacket(socket, 3, {
//                 mouseDown: 1
//             });
//             break;
//         case "u":
//             socketHandler.states.locked = !socketHandler.states.locked;
//             message = socketHandler.states.locked ? "Alt's are now: Locked" : "Alt's are now: Unlocked";
//             popupManager.show(message);
//             break;
//         case "j":
//             createEvent("SocketEvent", {
//                 detail: {
//                     action: "JoinMain"
//                 }
//             });
//             break;
//         case "h":
//             createEvent("SocketEvent", {
//                 detail: {
//                     action: "LeaveParty"
//                 }
//             })
//             break;
//         case "i":
//             game.network.sendRpc({
//                 name: "LeaveParty"
//             });
//             break;
//         case "[":
//             socketHandler.sockets.forEach((socket) => {
//                 if (Object.values(socket.buildings).length == 0) {
//                     game.network.sendPacket(9, { name: "JoinPartyByShareKey", partyShareKey: socket.partyShareKey });
//                 }
//             });
//             break;
//         case "]":
//             // TODO: Make this customizable
//             base = "[0,171214,191214,172414,192414,212511,222511,232511,242511,252511,252411,252311,252211,252111,251611,251511,251411,251311,251211,241211,231211,221211,211211,161211,151211,141211,131211,121211,121311,121411,121511,121611,122111,122211,122311,122411,122511,132511,142511,152511,162511,131313,151313,132313,132113,212313,232313,231513,231313,171416,191416,172216,192216,121914,121714,141916,141716,241914,241714,221916,221716,211518,211318,131518,151518,152118,152318,212118,232118]"
//             autoBuild.buildBase(base);
//             break;
//         case "c":
//             socketHandler.states.controlled = !socketHandler.states.controlled;
//             message = socketHandler.states.controlled ? "Sockets are now: Controlled" : "Sockets are now: Not Controlled";
//             popupManager.show(message);
//             break;
//         case "/":
//             game.ui.components.Chat.startTyping()
//             break;
//         case "m":
//             if (!socketHandler.states.controlled) return;

//             socketHandler.sockets.forEach(socket => {
//                 SocketComponent.sendPacket(socket, 9, { name: "BuyItem", itemName: "PetMiner", tier: 1 });
//                 SocketComponent.sendPacket(socket, 9, { name: "EquipItem", itemName: "PetMiner", tier: 1 });
//             });
//             break;
//         case "n":
//             if (!socketHandler.states.controlled) return;

//             socketHandler.sockets.forEach(socket => {
//                 SocketComponent.sendPacket(socket, 9, { name: "BuyItem", itemName: "PetRevive", tier: 1 });
//                 SocketComponent.sendPacket(socket, 9, { name: "EquipItem", itemName: "PetRevive", tier: 1 });
//             });
//             break;
//         case "g":
//             if (!socketHandler.states.controlled) return;
//             socketHandler.sockets.forEach(socket => {
//                 console.log(socket.myPlayer.petUid)
//                 SocketComponent.sendPacket(socket, 9, { name: "DeleteBuilding", uid: socket.myPlayer.petUid });
//             });
//             break;
//         case "y":
//             socketHandler.states.showAltID = !socketHandler.states.showAltID;
//             message = socketHandler.states.showAltID ? "Socket IDs are now: Shown" : "Socket IDs are now: Hidden";
//             popupManager.show(message);
//             break;
//     }
// });

