import { Game } from "../../Game.js";
import { UiComponent } from "../UiComponent.js";

class UiIntro extends UiComponent {
    constructor() {
        super(document.getElementById("hud-intro"));

        this.nameElem = this.element.querySelector(".hud-intro-name");
        this.serversElem = this.element.querySelector(".hud-intro-servers");
        this.playElem = this.element.querySelector(".hud-intro-play");
        this.errorElem = this.element.querySelector(".hud-intro-error");

        this.partyKey = "";
        this.socketIntentionallyClosed = false;
        this.inWorld = false;

        window.addEventListener("load", this.onPageLoad.bind(this));

        // Generating homepage resources
        this.resourceElements = {};
        this.resourcesCount = 0;

        const resourceCount = Math.floor(Math.random() * 30) + 8;

        for (let i = 0; i < resourceCount; i++) {
            this.createResourceElement();
        }

        // Updating featured YouTuber
        const featuredYouTuber = window.featuredYouTuber;
        const featuredYouTuberElem = document.getElementById("hud-featured-youtuber");

        featuredYouTuberElem.href = `https://www.youtube.com/watch?v=${featuredYouTuber.videoLink}`;
        featuredYouTuberElem.innerHTML = featuredYouTuber.channelName;

        // Creating server list
        this.servers = JSON.parse(window.servers);

        // Remove the script tag that adds the server list
        document.getElementsByTagName("script")[1].remove();

        if (this.servers.length == 0) {
            console.log("No servers detected!");
            this.servers = [{
                "id": "v1001",
                "country": "Local",
                "city": "Local",
                "status": "Low",
                "port": 8000,
                "gameMode": "standard"
            }]
        }

        // Generate server list

        // gameServers[gameMode][country][city]
        let gameServers = {};
        let gameModeOptgroups = {};

        for (let server of this.servers) {
            gameServers[server.gameMode] ||= {};
            gameServers[server.gameMode][server.country] ||= {};
            gameServers[server.gameMode][server.country][server.id] = server;
        }

        for (let gameMode in gameServers) {
            gameModeOptgroups[gameMode] = [];

            for (let country in gameServers[gameMode]) {
                let countryOptgroup = document.createElement("optgroup");
                countryOptgroup.label = country;
                this.serversElem.appendChild(countryOptgroup);

                gameModeOptgroups[gameMode].push(countryOptgroup);

                let countryCounter = 1;
                for (let id in gameServers[gameMode][country]) {
                    const serverOption = document.createElement("option");
                    serverOption.value = id;
                    const server = gameServers[gameMode][country][id];
                    serverOption.textContent = `${country} (${server.city}) #${countryCounter++} [${server.status}]`;
                    countryOptgroup.appendChild(serverOption);
    
                    gameServers[gameMode][country][id].serverElement = serverOption;
                }
            }
        }

        // Update server list based on game mode chosen

        const gameModeDescriptions = {
            "standard": "Collect resources to build a base to defend against neverending zombies!",
            "scarcity": "Start with a huge number of resources without being able to earn any more. PvP is disabled. Survive as long as you can!"
        }

        const gameModeListElement = document.getElementById("hud-intro-modes-list");

        const onGameModeChange = selectedGameMode => {

            let foundFirstServer = false;

            for (const gameMode in gameModeOptgroups) {
                if (gameMode == selectedGameMode) {
                    for (const optgroup of gameModeOptgroups[gameMode]) {
                        optgroup.style.display = "block";

                        if (foundFirstServer == false) {
                            if (optgroup.children[0] !== undefined) {
                                foundFirstServer = true;
                                optgroup.children[0].selected = true;
                            }
                        }
                    }
                } else {
                    for (const optgroup of gameModeOptgroups[gameMode]) optgroup.style.display = "none";
                }
            }

            document.getElementById("hud-intro-modes-description").innerText = gameModeDescriptions[selectedGameMode];
        }

        gameModeListElement.addEventListener("change", event => onGameModeChange(event.target.value.toLowerCase()));

        this.playElem.addEventListener("mouseup", this.connect.bind(this));

        this.nameElem.addEventListener("keyup", event => {
            if (event.key == "Enter") this.connect();
        });

        let serverFound = false;

        // Choose server based on URL (for share link)
        if (document.location.hash !== "") {
            const [serverId, partyKey] = document.location.hash.substring(2).split("/");
            this.partyKey = partyKey || "";

            const server = this.servers.find(s => s.id == serverId);

            if (server !== undefined) {
                serverFound = true;
                for (let elem of gameModeListElement.children) {
                    if (elem.innerHTML.toLowerCase() == server.gameMode) elem.setAttribute("selected", "true");
                    onGameModeChange(server.gameMode);
                }
                this.serversElem.querySelector(`option[value="${serverId}"]`).setAttribute("selected", "true");
            }
        }

        if (serverFound == false) {
            const lastUsedGameMode = window.storage.getItem("gameMode");

            if (lastUsedGameMode == null) onGameModeChange("standard");
            else {
                for (let elem of gameModeListElement.children) {
                    if (elem.innerHTML.toLowerCase() == lastUsedGameMode) elem.setAttribute("selected", "true");
                    onGameModeChange(lastUsedGameMode);
                }
            }
        }
    }

    init() {
        Game.eventEmitter.on("SocketClosed", this.onSocketClosed.bind(this));
        Game.eventEmitter.on("EnterWorldResponse", this.onEnterWorldResponse.bind(this));

        this.lastAnimationFrame = performance.now();
        requestAnimationFrame(this.onRendererUpdated.bind(this));
    }

    onRendererUpdated(performanceNow) {
        const msElapsed = performanceNow - this.lastAnimationFrame;
        this.lastAnimationFrame = performanceNow;

        if (this.inWorld == true) return;

        if (Math.random() < 0.005) this.createResourceElement(true);

        for (const resourceId in this.resourceElements) {
            const resource = this.resourceElements[resourceId];

            resource.y -= 24 / 1000 * msElapsed;

            if (resource.y <= -400) this.destroyResourceElem(resourceId);

            resource.elem.style.top = resource.y;
        }

        requestAnimationFrame(this.onRendererUpdated.bind(this));
    }

    createResourceElement(spawnBelowScreen = false) {
        const resources = ["tree", "stone"];
        let resource = document.createElement("span");
        resource.className = `hud-intro-${resources[Math.floor(Math.random() * resources.length)]}-${Math.floor(Math.random() * 2) + 1}`;

        let randomX;
        let randomY;

        if (spawnBelowScreen == true) {
            randomX = Math.floor(Math.random() * window.innerWidth);
            randomY = window.innerHeight + 100;
        } else {
            randomX = Math.floor(Math.random() * window.innerWidth);
            randomY = Math.floor(Math.random() * window.innerHeight);
        }

        resource.style = `top:${randomY}px;
                    left: ${randomX}px;
                    transform: rotate(${Math.floor(Math.random() * 360)}deg);`
        this.element.appendChild(resource);

        const resourceId = ++this.resourcesCount;
        this.resourceElements[resourceId] = {
            elem: resource,
            x: randomX,
            y: randomY
        }
    }

    destroyResourceElem(resourceId) {
        this.element.removeChild(this.resourceElements[resourceId].elem);
        delete this.resourceElements[resourceId];
    }

    connect() {
        if (this.playElem.classList.contains("is-disabled")) return;

        this.playElem.innerHTML = "<span class='hud-loading'></span>";
        Game.network.setConnectionData(this.nameElem.value, this.partyKey, this.servers.find(e => e.id == this.serversElem.value));
        Game.network.connect();
    }

    onPageLoad() {
        this.nameElem.value = window.storage.getItem("displayName") || "";
    }

    onSocketClosed() {
        if (this.socketIntentionallyClosed === true) {
            this.socketIntentionallyClosed = false;
            return;
        }
        if (Game.getInWorld()) return;
        this.playElem.innerHTML = "Play";
        this.serversElem.classList.add("has-error");
        this.errorElem.style.display = "block";
        this.errorElem.innerText = "You were not able to connect to this server for unknown reasons. Check your internet connection then try again.";
    }

    onEnterWorldResponse(data) {
        window.storage.setItem("displayName", data.name);

        document.getElementsByClassName("hud-intro-wrapper")[0].style.opacity = 0;

        setTimeout(() => {
            document.getElementById("game-mode").style.opacity = 1;
        }, 250);

        const gameMode = Game.network.options.serverData.gameMode;
        const gameModeCapitalised = gameMode.charAt(0).toUpperCase() + gameMode.slice(1);

        window.storage.setItem("gameMode", gameMode);

        document.getElementById("game-mode").innerText = gameModeCapitalised;

        setTimeout(() => {
            this.element.style.opacity = 0;

            setTimeout(() => {
                this.hide();
                this.inWorld = true;
            }, 500);
        }, 1000);
    }

    setFailure(data) {
        this.socketIntentionallyClosed = true;
        let error = "Unknown reason.";
        if (data.reason) {
            switch (data.reason) {
                case "MaxPlayerCount":
                    error = "This server is currently full. Please try again later or select another server.";
                    break;
                case "MaxIpLimit":
                    error = "You've reached the maximum number of tabs.";
                    break;
            }
        }
        this.playElem.innerHTML = "Play";
        this.errorElem.innerText = error;
        this.serversElem.classList.add("has-error");
        this.errorElem.style.display = "block";
    }
}

export { UiIntro };