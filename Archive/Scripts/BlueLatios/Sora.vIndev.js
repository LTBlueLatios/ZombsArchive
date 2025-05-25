// ==UserScript==
// @name         Sora.js vZombs
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Skids better skid out of zombs
// @author       BlueLatios
// @match        https://zombs.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zombs.io
// @grant        none
// ==/UserScript==

/* global game Scripts */

// GUI

const scriptGUI = document.querySelector("#hud-menu-settings");
const menuHTML = `
<style>
    body {
        display: flex;
        background-color: #2b2b2b;
        color: #ffffff;
        margin: 0;
    }

    #mainContent {
        flex-grow: 1;
        padding: 10px;
    }

    .sidebar {
        width: 150px;
        height: 100%;
        overflow-y: scroll;
        background-color: #333333;
        border: black solid;
        box-shadow: -2px 0 5px rgba(0, 0, 0, 0.5);
    }

    .navigation {
        padding: 5px;
    }

    btn {
        display: block;
    }
</style>

<div class="sidebar">
    <div class="navigation">
        <h3>Categories</h3>
        <btn>Main</btn>
        <btn>Raid</btn>
        <btn>Player</btn>
        <btn>Base</btn>
        <btn>Render</btn>
    </div>
</div>
<div id="content">
</div>
`;
scriptGUI.innerHTML = menuHTML;

const pageLoader = {
    load: function (pageNumber) {
        const htmlContent = this.pages[pageNumber];
        if (htmlContent === undefined) {
            throw new Error("Page not found.");
        }

        const contentDiv = document.getElementById("content");
        if (contentDiv) {
            contentDiv.innerHTML = htmlContent;
        } else {
            throw new Error("Content div not found.");
        }
    },
    pages: {
        1: `
            <h1>Welcome to Page 1</h1><p>This is the content of page 1.</p>
            <btn>Example Module</btn>
        `,
        2: "<h1>Welcome to Page 2</h1><p>This is the content of page 2.</p>",
    }
};

const guiBase = {
    createButton(text, onClick) {
        const button = document.createElement("button");
        button.innerText = text;
        button.addEventListener("click", onClick);
        return button;
    },

    createInput(label, type, onChange) {
        const container = document.createElement("div");
        const input = document.createElement("input");
        input.type = type;
        input.addEventListener("change", onChange);

        const labelElement = document.createElement("label");
        labelElement.innerText = label;
        labelElement.appendChild(input);

        container.appendChild(labelElement);
        return container;
    }
};

const gui = {
    init() {
        this.container = document.createElement("div");
        this.container.style.position = "fixed";
        this.container.style.top = "10px";
        this.container.style.right = "10px";
        document.body.appendChild(this.container);

        this.buildScriptsGUI();
    },

    buildScriptsGUI() {
        for (const scriptName in Scripts) {
            const script = Scripts[scriptName];

            const scriptContainer = document.createElement("div");
            scriptContainer.style.marginBottom = "10px";

            const toggleButton = guiBase.createButton(script.name, () => this.openSettingsGUI(script));
            scriptContainer.appendChild(toggleButton);

            this.container.appendChild(scriptContainer);
        }
    },

    openSettingsGUI(script) {
        const settingsGUI = document.createElement("div");
        settingsGUI.style.backgroundColor = "#fff";
        settingsGUI.style.padding = "10px";
        settingsGUI.style.border = "1px solid #ccc";
        settingsGUI.style.position = "fixed";
        settingsGUI.style.top = "50%";
        settingsGUI.style.left = "50%";
        settingsGUI.style.transform = "translate(-50%, -50%)";

        for (const option in script) {
            if (typeof script[option] === "function") continue;

            const inputType = typeof script[option] === "boolean" ? "checkbox" : "text";
            const input = guiBase.createInput(option, inputType, (e) => this.handleOptionChange(script, option, e));
            settingsGUI.appendChild(input);
        }

        document.body.appendChild(settingsGUI);
    },

    handleOptionChange(script, option, event) {
        const value = event.target.type === "checkbox" ? event.target.checked : event.target.value;
        script.set({ [option]: value });
    }
};

gui.init();


// Game Functions

const { sendRpc } = game.network;

const Player = {
    health: null,
    pos: null,
    shield: null,
    pet: {
        health: null,
        isDead: false
    },
};

const moduleBase = {
    toggle() {
        this.enabled = !this.enabled;
        sendPackets.systemChat("[System]", `Toggled ${this.name}: ${this.enabled ? "ON" : "OFF"}`);
        this.onToggle && this.onToggle();
    },
    set(options) {
        Object.assign(this, options);
        console.log(options);
    }
};

const createModule = (name, properties) => {
    return Object.assign(Object.create(moduleBase), {
        name,
        enabled: false,
        ...properties
    });
};

window.Scripts = {
    spamChat: createModule("Chat Spam", {
        intervalId: null,
        msg: "Skill Issue",
        delay: 1000,
        onToggle() {
            this.enabled
                ? this.intervalId = setInterval(() => sendPackets.chat(this.msg), this.delay)
                : clearInterval(this.intervalId);
        }
    }),
    singLyrics: createModule("Sing Song", {
        lyrics: [
            "Baa baa black sheep, have you any wool?",
            "Yes sir, yes sir three bags full",
            "One for my master, one for my dame",
            "One for the little boy, who lives down the lane",
        ],
        currentIndex: 0,
        intervalId: null,
        onToggle() {
            if (this.enabled) {
                this.intervalId = setInterval(() => {
                    sendPackets.chat(this.lyrics[this.currentIndex]);
                    this.currentIndex = (this.currentIndex + 1) % this.lyrics.length;
                }, 1500);
            } else {
                clearInterval(this.intervalId);
                this.currentIndex = 0;
            }
        }
    }),
    autoHealPlayer: createModule("Player AutoHeal", {
        healthThreshold: 40,
        cooldown: false,
        check() {
            if (Player.health <= this.healthThreshold && !this.cooldown) {
                sendPackets.playerHeal();
                this.cooldown = true;
                setTimeout(() => this.cooldown = false, 5000);
            }
        }
    }),
    autoHealPet: createModule("Pet AutoHeal", {
        healthThreshold: 40,
        cooldown: false,
        check() {
            if (Player.pet.health <= this.healthThreshold && !this.cooldown) {
                sendPackets.petHeal();
                this.cooldown = true;
                setTimeout(() => this.cooldown = false, 5000);
            }
        }
    }),
    autoRevivePet: createModule("Pet AutoRevive", {
        cooldown: false,
        check() {
            if (Player.pet.isDead && !this.cooldown) {
                sendPackets.petRevive();
                this.cooldown = true;
                setTimeout(() => this.cooldown = false, 5000);
            }
        }
    }),
    zoom: create("Zoom", {
        // Something
    })
};

const sendPackets = {
    chat: (msg) => game.network.sendRpc({ name: "SendChatMessage", message: msg, channel: "Local" }),
    systemChat: (name, msg) => game.ui.components.Chat.onMessageReceived({ displayName: name, message: msg }),
    buyItem: (item, tier, needsEquip = false) => {
        sendRpc({
            "name": "BuyItem",
            "itemName": item,
            "tier": tier,
        });

        if (needsEquip) {
            sendRpc({
                "name": "EquipItem",
                "itemName": item,
                "tier": tier,
            });
        }
    },
    playerHeal: () => {
        this.buyItem(item = "HealthPotion", tier = 1, needsEquip = true);
    },
    petHeal: () => {
        this.buyItem(item = "PetHealthPotion", tier = 1, needsEquip = true);
    },
    petRevive: () => {
        this.buyItem(item = "PetRevive", tier = 1, needsEquip = true);
    }
}

game.network.addEntityUpdateHandler(() => {
    const { autoHealPlayer, autoHealPet } = Scripts;

    if (autoHealPlayer.enabled == true) autoHealPlayer.check();
    if (autoHealPet.enabled == true) autoHealPet.check();

    if (game.ui.playerTick) {
        const { playerTick } = game.ui;

        Player.health = playerTick.health;
        Player.pos = playerTick.position;
        Player.shield = playerTick.zombieShieldHealth;
    }

    if (game.ui.playerPetTick) {
        const { playerPetTick } = game.ui;

        Player.pet.health = playerPetTick.health;
    }
});

// Zoom

const gameRenderer = {
    dimension: 1,
    maxDimension: 1.35,
    minDimension: 0.1,
    baseWidth: 1920,
    baseHeight: 1080,
    getRenderer() {
        return game.renderer;
    },
    updateScale() {
        const { innerWidth, innerHeight, devicePixelRatio } = window;
        const scaleWidth = innerWidth * devicePixelRatio / (this.baseWidth * this.dimension);
        const scaleHeight = innerHeight * devicePixelRatio / (this.baseHeight * this.dimension);
        const ratio = Math.max(scaleWidth, scaleHeight);

        const renderer = this.getRenderer();
        renderer.scale = ratio;
        renderer.entities.setScale(ratio);
        renderer.ui.setScale(ratio);
        renderer.renderer.resize(innerWidth * devicePixelRatio, innerHeight * devicePixelRatio);
        renderer.viewport.width = renderer.renderer.width / renderer.scale + 2 * renderer.viewportPadding;
        renderer.viewport.height = renderer.renderer.height / renderer.scale + 2 * renderer.viewportPadding;
    },
    adjustDimension(deltaY) {
        this.dimension += (deltaY > 0 ? 0.01 : -0.01);
        this.dimension = Math.min(this.maxDimension, Math.max(this.minDimension, this.dimension));
        this.updateScale();
    },
    initialize() {
        window.addEventListener("resize", this.updateScale.bind(this));
        window.addEventListener("wheel", event => this.adjustDimension(event.deltaY));
        this.updateScale(); // Initial adjustment
    }
};

gameRenderer.initialize();

// Song Player

const songPlayer = {
    audioElement: new Audio(),
    currentSongIndex: -1,
    songs: [],

    addSong(file) {
        const url = URL.createObjectURL(file);
        this.songs.push({ title: file.name, url: url });
        console.log(`Song "${file.name}" added!`);
    },

    delSong(title) {
        const index = this.songs.findIndex(song => song.title === title);

        if (index !== -1) {
            URL.revokeObjectURL(this.songs[index].url); // Free up memory
            this.songs.splice(index, 1);
            console.log(`Song "${title}" deleted!`);
        } else {
            console.log(`Song "${title}" not found!`);
        }
    },

    playSong(index) {
        if (index >= 0 && index < this.songs.length) {
            const song = this.songs[index];
            this.audioElement.src = song.url;
            this.audioElement.play();
            this.currentSongIndex = index;
            console.log(`Playing song "${song.title}"...`);
        } else {
            console.log("Song index out of bounds!");
        }
    },

    stopSong() {
        this.audioElement.pause();
        this.audioElement.currentTime = 0;
        console.log("Song playback stopped!");
    },

    nextSong() {
        let nextIndex = (this.currentSongIndex + 1) % this.songs.length;
        this.playSong(nextIndex);
    },

    prevSong() {
        let prevIndex = (this.currentSongIndex - 1 + this.songs.length) % this.songs.length;
        this.playSong(prevIndex);
    }
};

const uploadButton = document.createElement("button");
uploadButton.textContent = "Upload Songs";
uploadButton.style.position = "fixed";
uploadButton.style.top = "0";
uploadButton.style.left = "0";
uploadButton.style.zIndex = "1";

const fileInput = document.createElement("input");
fileInput.type = "file";
fileInput.id = "fileUploader";
fileInput.multiple = true;
fileInput.style.display = "none";

fileInput.addEventListener("change", function (event) {
    const files = event.target.files;
    for (const file of files) {
        songPlayer.addSong(file);
        console.log(songPlayer.songs);
        songPlayer.playSong(0);
    }
});

uploadButton.addEventListener("click", function () {
    fileInput.click();
});

document.body.appendChild(fileInput);
document.body.appendChild(uploadButton);

// Hijack connect function for modification purposes

const originalSendPacket = game.network.connect;
game.network.connect = function (...data) {
    console.log("Connecting to:", ...data);
    originalSendPacket.apply(game.network, arguments);
}