import * as PIXI from "pixi.js";

// Creating server list
const servers = JSON.parse(window.servers);
const serversElem = document.getElementById("hud-intro-servers");

// Generate server list
let gameServers = {};
let gameModeOptgroups = {};

for (let server of servers) {
    gameServers[server.gameMode] ||= {};
    gameServers[server.gameMode][server.country] ||= {};
    gameServers[server.gameMode][server.country][server.id] = server;
}

for (let gameMode in gameServers) {
    gameModeOptgroups[gameMode] = [];

    for (let country in gameServers[gameMode]) {
        let countryOptgroup = document.createElement("optgroup");
        countryOptgroup.label = country;
        serversElem.appendChild(countryOptgroup);

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
}

onGameModeChange("standard");

gameModeListElement.addEventListener("change", event => onGameModeChange(event.target.value.toLowerCase()));

class Entity {
    constructor(node = null) {
        this.attachments = [];
        this.parent = null;
        this.isVisible = true;
        this.setNode(node || new PIXI.Container());
    }

    getNode() {
        return this.node;
    }

    setNode(node) {
        this.node = node;
    }

    getParent() {
        return this.parent;
    }

    setParent(parent) {
        if (parent == null) {
            if (this.currentModel !== undefined) {
                this.currentModel.removedParentFunction?.();
                for (const attachment of this.currentModel.attachments) {
                    attachment.setParent(null);
                }
            }

            for (const attachment of this.attachments) {
                attachment.setParent(null);
            }
        }

        this.parent = parent;
    }

    getAttachments() {
        return this.attachments;
    }

    addAttachment(attachment, zIndex = 0) {
        const node = attachment.getNode();
        node.zIndex = zIndex;
        attachment.setParent(this);
        this.node.addChild(attachment.getNode());
        this.attachments.push(attachment);
        this.node.children.sort((a, b) => {
            if (a.zIndex == b.zIndex) return 0;
            return a.zIndex < b.zIndex ? -1 : 1;
        })
    }

    removeAttachment(attachment) {
        if (!attachment) return;
        this.node.removeChild(attachment.getNode());
        attachment.setParent(null);
        if (this.attachments.indexOf(attachment) > -1) this.attachments.splice(this.attachments.indexOf(attachment), 1);
    }

    getRotation() {
        return this.node.rotation * 180 / Math.PI;
    }

    setRotation(degrees) {
        this.node.rotation = degrees * Math.PI / 180;
    }

    getAlpha() {
        return this.node.alpha;
    }

    setAlpha(alpha) {
        if (this.node.alpha !== alpha) this.node.alpha = alpha;
    }

    getScale() {
        return this.node.scale;
    }

    setScale(scale) {
        this.node.scale.x = scale;
        this.node.scale.y = scale;
    }

    getScaleX() {
        return this.node.scale.x;
    }

    setScaleX(scale) {
        this.node.scale.x = scale;
    }

    getScaleY() {
        return this.node.scale.y;
    }

    setScaleY(scale) {
        this.node.scale.y = scale;
    }

    getFilters() {
        return this.node.filters;
    }

    setFilters(filters) {
        this.node.filters = filters;
    }

    getPosition() {
        return this.node.position;
    }

    setPosition(x, y) {
        if (this.node.position.x !== x) this.node.position.x = x;
        if (this.node.position.y !== y) this.node.position.y = y;
    }

    getPositionX() {
        return this.node.position.x;
    }

    setPositionX(x) {
        if (this.node.position.x !== x) this.node.position.x = x;
    }

    getPositionY() {
        return this.node.position.y;
    }

    setPositionY(y) {
        if (this.node.position.y !== y) this.node.position.y = y;
    }

    getPivotPoint() {
        return this.node.pivot;
    }

    setPivotPoint(x, y) {
        this.node.pivot.x = x;
        this.node.pivot.y = y;
    }

    getVisible() {
        return this.isVisible;
    }

    setVisible(visible) {
        this.isVisible = visible;
        this.node.visible = visible;
    }

    update(dt, tick) {
        for (const attachment of this.attachments) attachment.update(dt, tick);
    }
}

class SpriteEntity extends Entity {
    constructor(textureString, tiled = false) {
        super();

        const texture = PIXI.Assets.get(textureString);

        if (tiled) {
            texture.source.scaleMode = "nearest";
            this.sprite = new PIXI.TilingSprite(texture);
        } else {
            this.sprite = new PIXI.Sprite(texture);
        }

        this.sprite.anchor.x = 0.5;
        this.sprite.anchor.y = 0.5;
        this.setNode(this.sprite);
    }
    getAnchor() {
        return this.sprite.anchor;
    }
    setAnchor(x, y) {
        this.sprite.anchor.x = x;
        this.sprite.anchor.y = y;
    }
    getTint() {
        return this.node.tint;
    }
    setTint(tint) {
        this.node.tint = tint;
    }
    getBlendMode() {
        return this.node.tint;
    }
    setBlendMode(blendMode) {
        this.node.blendMode = blendMode;
    }
    getMask() {
        return this.node.mask;
    }
    setMask(entity) {
        this.node.mask = entity.getNode();
    }
    setDimensions(x, y, width, height) {
        this.sprite.x = x;
        this.sprite.y = y;
        this.sprite.width = width;
        this.sprite.height = height;
    }
    setParent(parent) {
        super.setParent(parent);

        if (parent == null) this.sprite.destroy();
    }
}

class RendererLayer extends Entity {
    constructor() {
        super();
        this.setNode(new PIXI.Container());
    }
}

class Renderer {
    constructor(worldSize) {
        this.worldSize = worldSize;
        this.scale = 1;
        this.zoomDimension = 5.5;

        this.longFrames = 0;
        this.lastMsElapsed = 0;
        this.firstPerformance = null;
        this.cameraPos = { x: this.worldSize.x / 2, y: this.worldSize.y / 2 };
        this.cameraMovementKeys = { up: false, right: false, down: false, left: false };
        this.cameraMovementYaw = null;

        window.addEventListener("resize", this.onWindowResize.bind(this));

        window.onwheel = (e) => {
            if (e.srcElement !== this.renderer.canvas) return;
            if (e.deltaY > 0) {
                this.zoomDimension = Math.min(15, this.zoomDimension + 0.1);
            } else if (e.deltaY < 0) {
                this.zoomDimension = Math.max(0.5, this.zoomDimension - 0.1);
            }
            this.onWindowResize();
        }
    }

    async initialisePixiInstance() {
        console.log("Initialising PIXI instance...");
        this.renderer = new PIXI.Application();

        await this.renderer.init({
            backgroundColor: 0x222222,
            hello: true
        });

        this.renderer.canvas.oncontextmenu = e => e.preventDefault();

        document.body.appendChild(this.renderer.canvas);

        this.contextLostTime = 0;

        this.renderer.canvas.addEventListener("webglcontextlost", () => {
            console.log("WebGL context lost has been lost.");
            this.contextLostTime = performance.now();
        })

        this.renderer.canvas.addEventListener("webglcontextrestored", () => {
            console.log("WebGL context has been restored.");
        })

        this.ticker = new PIXI.Ticker();
        this.ticker.add(this.update.bind(this));

        this.scene = new Entity();
        this.entitiesLayer = new RendererLayer();
        this.scene.addAttachment(this.entitiesLayer);

        this.groundEntity = new Entity();
        this.border = new SpriteEntity("./asset/images/Map/Grass.svg", true);
        this.grass = new SpriteEntity("./asset/images/Map/Grass.svg", true);
        this.groundEntity.addAttachment(this.border);
        this.groundEntity.addAttachment(this.grass);
        this.border.setAnchor(0, 0);
        this.border.setAlpha(0.5);
        this.grass.setAnchor(0, 0);
        this.add(this.groundEntity, 0);

        this.border.setDimensions(-48 * 160, -48 * 160, this.worldSize.x + 2 * 48 * 160, this.worldSize.y + 2 * 48 * 160);
        this.grass.setDimensions(0, 0, this.worldSize.x, this.worldSize.y);

        this.onWindowResize();
        this.start();
    }

    start() {
        this.ticker.start();
        this.onWindowResize();
    }

    add(obj, zIndex) {
        this.entitiesLayer.addAttachment(obj, zIndex);
    }

    remove(obj) {
        this.entitiesLayer.removeAttachment(obj);
    }

    update(msElapsed) {
        if (this.firstPerformance === null) return this.firstPerformance = performance.now();

        const now = performance.now();
        const totalMs = now - this.firstPerformance;
        const currentMs = totalMs - this.lastMsElapsed;
        this.lastMsElapsed = totalMs;
        msElapsed = currentMs;


        try {
            this.scene.update(msElapsed, null);
        } catch (e) {
            console.log("Had an issue updating the scene.", e);
        }

        if (this.cameraMovementKeys.up == false && this.cameraMovementKeys.right == false && this.cameraMovementKeys.down == false && this.cameraMovementKeys.left == false) {
            this.cameraMovementYaw = null;
        } else
        if (this.cameraMovementKeys.up && this.cameraMovementKeys.right) {
            this.cameraMovementYaw = 45;
        } else
        if (this.cameraMovementKeys.down && this.cameraMovementKeys.right) {
            this.cameraMovementYaw = 135;
        } else
        if (this.cameraMovementKeys.up && this.cameraMovementKeys.left) {
            this.cameraMovementYaw = 315;
        } else
        if (this.cameraMovementKeys.down && this.cameraMovementKeys.left) {
            this.cameraMovementYaw = 225;
        } else
        if (this.cameraMovementKeys.up && !(this.cameraMovementKeys.left || this.cameraMovementKeys.right)) {
            this.cameraMovementYaw = 0;
        } else
        if (this.cameraMovementKeys.right && !(this.cameraMovementKeys.up || this.cameraMovementKeys.down)) {
            this.cameraMovementYaw = 90;
        } else
        if (this.cameraMovementKeys.down && !(this.cameraMovementKeys.left || this.cameraMovementKeys.right)) {
            this.cameraMovementYaw = 180;
        } else
        if (this.cameraMovementKeys.left && !(this.cameraMovementKeys.up || this.cameraMovementKeys.down)) {
            this.cameraMovementYaw = 270;
        }

        if (this.cameraMovementYaw !== null) {
            this.cameraPos.x += Math.sin(this.cameraMovementYaw * Math.PI / 180) * 15;
            this.cameraPos.y -= Math.cos(this.cameraMovementYaw * Math.PI / 180) * 15;

            this.cameraPos.x = Math.max(0, Math.min(this.worldSize.x, this.cameraPos.x));
            this.cameraPos.y = Math.max(0, Math.min(this.worldSize.y, this.cameraPos.y));
        }

        this.lookAtPosition(this.cameraPos);

        const xPos = this.cameraPos.x / this.worldSize.x * 100;
        const yPos = this.cameraPos.y / this.worldSize.y * 100;
        positionMarker.style.left = xPos + "%";
        positionMarker.style.top = yPos + "%";

        this.renderer.renderer.render(this.scene.getNode());

        const timerTotal = Math.round((performance.now() - now) * 100) / 100;
        if (timerTotal >= 10) {
            this.longFrames++;
        }
    }

    lookAtPosition({ x, y }) {
        const halfX = (window.innerWidth * window.devicePixelRatio) / 2;
        const halfY = (window.innerHeight * window.devicePixelRatio) / 2;
        x *= this.scale;
        y *= this.scale;
        const newPosition = {
            x: Math.round((-x + halfX) * 100) / 100,
            y: Math.round((-y + halfY) * 100) / 100
        };
        this.entitiesLayer.setPosition(newPosition.x, newPosition.y);
    }

    onWindowResize() {
        if (this.ticker == undefined || this.ticker?.started == false) return;

        const canvasWidth = window.innerWidth * window.devicePixelRatio;
        const canvasHeight = window.innerHeight * window.devicePixelRatio;
        const ratio = Math.max(canvasWidth / (1920 * this.zoomDimension), canvasHeight / (1080 * this.zoomDimension));
        this.scale = ratio;
        this.entitiesLayer.setScale(ratio);
        this.renderer.renderer.resize(canvasWidth, canvasHeight);
    }

    screenToWorld(x, y) {
        let offsetX = -this.entitiesLayer.getPositionX();
        let offsetY = -this.entitiesLayer.getPositionY();
        offsetX *= (1 / this.scale);
        offsetY *= (1 / this.scale);
        x *= (1 / this.scale) * window.devicePixelRatio;
        y *= (1 / this.scale) * window.devicePixelRatio;
        return {
            x: offsetX + x,
            y: offsetY + y
        };
    }

    worldToUi(x, y) {
        let offsetX = -this.entitiesLayer.getPositionX();
        let offsetY = -this.entitiesLayer.getPositionY();
        offsetX *= (1 / this.scale);
        offsetY *= (1 / this.scale);
        return {
            x: x - offsetX,
            y: y - offsetY
        };
    }

    worldToScreen(x, y) {
        let offsetX = -this.entitiesLayer.getPositionX();
        let offsetY = -this.entitiesLayer.getPositionY();
        offsetX *= (1 / this.scale);
        offsetY *= (1 / this.scale);
        return {
            x: (x - offsetX) * this.scale * (1 / window.devicePixelRatio),
            y: (y - offsetY) * this.scale * (1 / window.devicePixelRatio)
        };
    }
}

const mapElement = document.createElement("div");
mapElement.className = "hud-map";
mapElement.style = "position: absolute;";
document.body.appendChild(mapElement);

let positionMarker = document.createElement("div");
positionMarker.className = "hud-map-player";
positionMarker.style.display = "block";
positionMarker.setAttribute("data-index", "0");
mapElement.appendChild(positionMarker);

let initialised = false;

window.onload = async () => {
    let files = [{
        "alias": "./asset/images/Map/Grass.svg",
        "src": "../asset/images/Map/Grass.svg"
    }, {
        "alias": "./asset/images/Map/Stone1.svg",
        "src": "../asset/images/Map/Stone1.svg"
    }, {
        "alias": "./asset/images/Map/Stone2.svg",
        "src": "../asset/images/Map/Stone2.svg"
    }, {
        "alias": "./asset/images/Map/Tree1.svg",
        "src": "../asset/images/Map/Tree1.svg"
    }, {
        "alias": "./asset/images/Map/Tree2.svg",
        "src": "../asset/images/Map/Tree2.svg"
    }]

    PIXI.Assets.load(files).then(() => {
        console.log(`${files.length} images successfully preloaded.`);
    });

    document.getElementById("hud-intro-play").addEventListener("mouseup", async () => {
        if (initialised == true) return;
        initialised = true;

        const json = await fetch(`./layouts/${document.getElementById("hud-intro-servers").value}`);
        const resourcesObj = await json.json();

        const renderer = new Renderer(resourcesObj.worldSize);
        await renderer.initialisePixiInstance();
        window.renderer = renderer;

        const onKeydown = (event) => {
            switch (event.which) {
                case 87: // UP - W
                case 38:
                    renderer.cameraMovementKeys.up = true;
                    renderer.cameraMovementKeys.down = false;
                    break;
                case 65: // LEFT - A
                case 37:
                    renderer.cameraMovementKeys.left = true;
                    renderer.cameraMovementKeys.right = false;
                    break;
                case 83: // DOWN - S
                case 40:
                    renderer.cameraMovementKeys.down = true;
                    renderer.cameraMovementKeys.up = false;
                    break;
                case 68: // RIGHT - D
                case 39:
                    renderer.cameraMovementKeys.right = true;
                    renderer.cameraMovementKeys.left = false;
                    break;
            }
        }
    
        const onKeyup = (event) => {
            switch (event.which) {
                case 87: // UP - W
                case 38:
                    renderer.cameraMovementKeys.up = false;
                    break;
                case 65: // LEFT - A
                case 37:
                    renderer.cameraMovementKeys.left = false;
                    break;
                case 83: // DOWN - S
                case 40:
                    renderer.cameraMovementKeys.down = false;
                    break;
                case 68: // RIGHT - D
                case 39:
                    renderer.cameraMovementKeys.right = false;
                    break;
            }
        }
    
        window.addEventListener("keydown", onKeydown);
        window.addEventListener("keyup", onKeyup);

        console.log(resourcesObj);

        for (let uid in resourcesObj.mapLayout) {
            const rss = resourcesObj.mapLayout[uid];

            const sprite = new SpriteEntity(`./asset/images/Map/${rss.model}.svg`);
            sprite.setPosition(rss.position.x, rss.position.y);
            sprite.setRotation(rss.yaw);
            renderer.add(sprite, 1);
        }

        document.getElementById("hud-intro").style.display = "none";
    })
}