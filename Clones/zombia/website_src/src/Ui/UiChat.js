import { UiComponent } from "./UiComponent.js";
import { Game } from "../Game.js";

const grawlix = require("grawlix");
const grawlixRacism = require("grawlix-racism");

grawlix.loadPlugin(grawlixRacism);

grawlix.setDefaults({
    randomize: false
});

class UiChat extends UiComponent {
    constructor() {
        const chatDiv = document.createElement("div");
        chatDiv.className = "hud-chat";
        chatDiv.innerHTML = `
        <div class="hud-chat-messages" id="hud-chat-messages"></div>
        <input type="text" class="hud-chat-input" id="hud-chat-input" placeholder="Send a message to the [All] channel." maxlength="140">
        <div class="hud-chat-toggle-channel" id="hud-chat-toggle-channel"></div>
        <h3 class="hud-chat-walkthrough" id="hud-chat-walkthrough">Press [Enter] to chat.</h3>`;
        document.getElementById("hud-top").appendChild(chatDiv);
        super(chatDiv);

        this.element.addEventListener("mouseup", this.onMouseUp.bind(this));
        this.element.addEventListener("mousedown", this.onMouseDown.bind(this));

        this.walkthroughElem = document.getElementById("hud-chat-walkthrough");
        this.messagesElem = document.getElementById("hud-chat-messages");
        this.inputElem = document.getElementById("hud-chat-input");
        this.toggleChannelButton = document.getElementById("hud-chat-toggle-channel");

        this.inputElem.addEventListener("keydown", event => {
            if (!["Enter", "Escape"].includes(event.code)) event.stopPropagation();
        });

        this.inputElem.addEventListener("keyup", event => {
            if (!["Enter", "Escape"].includes(event.code)) event.stopPropagation();
        });

        this.toggleChannelButton.addEventListener("mousedown", e => {
            e.stopPropagation();
        });

        this.toggleChannelButton.addEventListener("mouseup", e => {
            this.toggleChannel();
            e.stopPropagation();
            this.inputElem.focus();
        });

        this.toggleChannelButton.addEventListener("mouseenter", () => {
            Game.ui.components["uiBuildingBar"].buildingTooltip.moveTo(this.toggleChannelButton);
        });

        this.toggleChannelButton.addEventListener("mouseleave", () => {
            Game.ui.components["uiBuildingBar"].buildingTooltip.hide();
        });

        this.typing = false;
        this.channels = ["All", "Party"];
        this.channelIndex = 0;

        if (window.storage.getItem("walkthrough_Chat") !== null) this.walkthroughElem.style.display = "none";
    }

    init() {
        Game.eventEmitter.on("ReceiveChatMessageRpcReceived", this.onMessageReceived.bind(this));
        Game.eventEmitter.on("13Up", this.toggleTyping.bind(this));
        Game.eventEmitter.on("27Up", () => {
            if (this.typing == true) {
                this.hideChat();
            }
        })

        Game.eventEmitter.on("mouseDown", () => {
            if (this.typing == true) this.hideChat();
        })
    }

    showChat() {
        this.toggleChannelButton.style.display = "block";
        this.element.classList.add("is-focused");
        this.inputElem.focus();
        this.typing = true;
    }

    hideChat() {
        this.toggleChannelButton.style.display = "none";
        this.element.classList.remove("is-focused");
        this.inputElem.blur();
        this.typing = false;
    }

    onMouseUp(event) {
        if (this.typing) {
            event.stopPropagation();
        }
    }

    onMouseDown(event) {
        if (this.typing) {
            event.stopPropagation();
        }
    }

    onMessageReceived(data) {
        const messageDiv = document.createElement("div");
        messageDiv.className = "hud-chat-message";
        messageDiv.innerHTML = `<strong style="${data.channel === "All" ? "color:#FF0000;" : "color:#00FF00;"}">[${data.channel}] </strong><strong><span id="name"></span>: </strong><span id="message"></span>`;

        const nameText = document.createTextNode(Game.network.languageFilterEnabled ? grawlix(data.name) : data.name);
        messageDiv.querySelector("#name").appendChild(nameText);

        const messageText = document.createTextNode(Game.network.languageFilterEnabled ? grawlix(data.message) : data.message);
        messageDiv.querySelector("#message").appendChild(messageText);

        this.messagesElem.appendChild(messageDiv);
        
        messageDiv.addEventListener("mousedown", e => {
            e.stopPropagation();
        });

        messageDiv.addEventListener("mouseup", e => {
            e.stopPropagation();
        });

        this.messagesElem.scrollTop = this.messagesElem.scrollHeight;

        if (Game.settings.deleteOldChat == true) {
            if (document.getElementsByClassName("hud-chat-message").length > 100) {
                document.getElementsByClassName("hud-chat-message")[0].remove();
            }
        }
    }

    toggleTyping() {
        window.storage.setItem("walkthrough_Chat", "true");
        this.walkthroughElem.style.display = "none";

        if (this.typing) {
            if (this.inputElem.value.trim().length > 0) {
                Game.network.sendRpc({
                    name: "SendChatMessage",
                    message: this.inputElem.value.trim(),
                    channel: this.channels[this.channelIndex]
                });
            }

            this.inputElem.value = "";
            this.hideChat();
        } else {
            this.showChat();
        }
    }

    toggleChannel(event) {
        if (!this.typing) return;
        this.channelIndex++;
        if (this.channelIndex + 1 > this.channels.length) this.channelIndex = 0;
        this.inputElem.placeholder = `Send a message to the [${this.channels[this.channelIndex]}] channel.`;
    }
}

export { UiChat };