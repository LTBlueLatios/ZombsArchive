import { World } from "./World.js";
import * as PIXI from "pixi.js";
import { RendererLayer } from "./RendererLayer.js";
import { Replicator } from "./Replicator.js";
import { Util } from "../Util.js";
import { Game } from "../Game.js";
import { NetworkEntity } from "./Entities/NetworkEntity.js";
import { Entity } from "./Entities/Entity.js";
import { GroundEntity } from "./Entities/GroundEntity.js";
import { TextEntity } from "./Entities/TextEntity.js";
import { SpriteEntity } from "./Entities/SpriteEntity.js";

class Renderer {
    constructor() {
        this.world = new World();

        this.preloadAssets();

        document.getElementsByClassName("hud-settings-antialias")[0].addEventListener("change", () => {
            window.storage.setItem("settings-antialias", document.getElementsByClassName("hud-settings-antialias")[0].checked);
            window.location.reload();
        })

        document.getElementsByClassName("hud-settings-antialias")[0].checked = window.storage.getItem("settings-antialias") === "true";

        this.renderingFilters = [];

        // if the server is reset while an attachment is fading, it won't be removed from the renderer
        this.fadingAttachments = {};

        this.scale = 1;
        this.zoomDimension = 1.5;

        this.longFrames = 0;
        this.lastMsElapsed = 0;
        this.firstPerformance = null;
        this.followingObject = null;

        this.contextLostTime = 0;

        window.addEventListener("resize", this.onWindowResize.bind(this));

        window.onwheel = (e) => {
            if (e.srcElement !== this.renderer.canvas) return;
            if (process.env.NODE_ENV == "production") {
                if (e.deltaY > 0) {
                    this.zoomDimension = Math.min(1.95, this.zoomDimension + 0.025);
                } else if (e.deltaY < 0) {
                    this.zoomDimension = Math.max(0.5, this.zoomDimension - 0.025);
                }
            } else if (process.env.NODE_ENV == "development") {
                if (e.deltaY > 0) {
                    this.zoomDimension = Math.min(15, this.zoomDimension + 0.1);
                } else if (e.deltaY < 0) {
                    this.zoomDimension = Math.max(0.5, this.zoomDimension - 0.1);
                }

                // TODO
                // Game.network.sendRpc({
                //     name: "AdminCommand",
                //     type: "ZoomLevel",
                //     uid: Math.floor(this.zoomDimension * 100),
                //     reason: "",
                //     x: 0,
                //     y: 0
                // })
            }
            this.onWindowResize();
        }
    }

    preloadAssets() {
        const timeStart = performance.now();

        const data = window.spritesheet;
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(data, "image/svg+xml");
        const svgs = svgDoc.querySelectorAll("svg");
        const serialiser = new XMLSerializer();

        let files = [];

        svgs.forEach((svg, index) => {
            if (index == 0) return;

            const svgString = serialiser.serializeToString(svg);
            const svgBlob = new Blob([svgString], { type: "image/svg+xml" });
            const url = URL.createObjectURL(svgBlob);

            files.push({ src: url, "loadParser": "loadSVG", alias: `./asset/images/${svg.id}` });
        });

        delete window.spritesheet;

        PIXI.Assets.load(files).then(() => {
            files.forEach(file => URL.revokeObjectURL(file.src));

            console.log(`Time taken to preload ${files.length} assets: ${performance.now() - timeStart}ms`);

            document.getElementById("hud-intro-play").classList.remove("is-disabled");
            files.length = 0;
        });
    }

    async init() {
        return new Promise(async (res, rej) => {
            await this.initialisePixiInstance();
            this.replicator = new Replicator();
            this.world.init();
            Game.eventEmitter.on("EnterWorldResponse", this.onEnterWorld.bind(this));

            res();
        });
    }

    async initialisePixiInstance() {
        console.log("Initialising PIXI instance...");
        this.renderer = new PIXI.Application();

        await this.renderer.init({
            backgroundColor: 0x222222,
            antialias: document.getElementsByClassName("hud-settings-antialias")[0].checked,
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
        this.uiLayer = new RendererLayer();
        this.groundLayer = new RendererLayer();
        this.buildings = new RendererLayer();
        this.scenery = new RendererLayer();
        this.zombieLayer = new RendererLayer();
        this.npcLayer = new RendererLayer();
        this.projectiles = new RendererLayer();
        this.players = new RendererLayer();

        this.entitiesLayer.addAttachment(this.groundLayer);
        this.entitiesLayer.addAttachment(this.buildings);
        this.entitiesLayer.addAttachment(this.scenery);
        this.entitiesLayer.addAttachment(this.zombieLayer);
        this.entitiesLayer.addAttachment(this.players);
        this.entitiesLayer.addAttachment(this.npcLayer);
        this.entitiesLayer.addAttachment(this.projectiles);
        this.scene.addAttachment(this.entitiesLayer);
        this.scene.addAttachment(this.uiLayer);

        this.hasCreatedGrassBackground = false;

        if (this.worldSize !== undefined) {
            this.createGrassBackground();

            this.border.setDimensions(-48 * 40, -48 * 40, this.worldSize.x + 2 * 48 * 40, this.worldSize.y + 2 * 48 * 40);
            this.grass.setDimensions(0, 0, this.worldSize.x, this.worldSize.y);
        }

        this.onWindowResize();

        // If context was lost during gameplay, we want to resume everything back to normal
        if (Game.getInWorld() == true) {
            this.start();
            for (let uid in this.world.entities) {
                this.add(this.world.entities[uid], this.world.entities[uid].entityClass);
            }
        }
    }

    createGrassBackground() {
        this.hasCreatedGrassBackground = true;

        this.groundEntity = new GroundEntity();
        this.border = new SpriteEntity("./asset/images/Map/Grass.svg", true);
        this.grass = new SpriteEntity("./asset/images/Map/Grass.svg", true);
        this.groundEntity.addAttachment(this.border);
        this.groundEntity.addAttachment(this.grass);
        this.border.setAnchor(0, 0);
        this.border.setAlpha(0.5);
        this.grass.setAnchor(0, 0);
        Game.renderer.add(this.groundEntity);
    }

    onEnterWorld(data) {
        this.clearFadingAttachments();

        this.start();

        this.worldSize = { x: parseInt(data.x), y: parseInt(data.y) };

        if (this.hasCreatedGrassBackground == false) this.createGrassBackground();

        this.border.setDimensions(-48 * 40, -48 * 40, this.worldSize.x + 2 * 48 * 40, this.worldSize.y + 2 * 48 * 40);
        this.grass.setDimensions(0, 0, this.worldSize.x, this.worldSize.y);
    }

    start() {
        this.ticker.start();
        this.onWindowResize();
    }
    
    clearFadingAttachments() {
        for (let id in this.fadingAttachments) {
            this.deleteFadingAttachment(id);
        }
    }

    onServerDesync() {
        this.clearFadingAttachments();
        console.log("Server desynced, renderer has removed all fading attachments");
    }

    add(obj, entityClass = undefined) {
        if (obj instanceof NetworkEntity) {
            switch (entityClass) {
                case "Building":
                    this.buildings.addAttachment(obj);
                    break;
                case "Resource":
                case "Spell":
                case "ResourcePickup":
                    this.scenery.addAttachment(obj);
                    break;
                case "Zombie":
                    this.zombieLayer.addAttachment(obj);
                    break;
                case "Projectile":
                    this.projectiles.addAttachment(obj);
                    break;
                case "Player":
                case "Pet":
                    this.players.addAttachment(obj);
                    break;
                case "Npc":
                    this.npcLayer.addAttachment(obj);
                    break;
                default:
                    this.npcLayer.addAttachment(obj);
                    break;
            }
        } else if (obj instanceof GroundEntity) {
            this.groundLayer.addAttachment(obj);
        } else if (obj instanceof TextEntity) {
            this.uiLayer.addAttachment(obj);
        } else {
            throw new Error(`Unhandled object: ${JSON.stringify(obj)}`);
        }
    }

    remove(obj, shouldCreateFadingEffect = true) {
        obj.currentModel?.onDie?.();

        let rendererLayer = "npcLayer";

        if (obj instanceof NetworkEntity) {
            switch (obj.entityClass) {
                case "Building":
                    rendererLayer = "buildings";
                    break;
                case "Resource":
                case "Spell":
                case "ResourcePickup":
                    rendererLayer = "scenery";
                    break;
                case "Zombie":
                    rendererLayer = "zombieLayer";
                    break;
                case "Projectile":
                    rendererLayer = "projectiles";
                    break;
                case "Player":
                case "Pet":
                    rendererLayer = "players";
                    break;
                case "Npc":
                    rendererLayer = "npcLayer";
                    break;
            }
        } else if (obj instanceof GroundEntity) {
            rendererLayer = "groundLayer";
        } else if (obj instanceof TextEntity) {
            rendererLayer = "uiLayer";
        }

        if (shouldCreateFadingEffect == true && Game.settings.specialEffectsDisabled == false && obj.currentModel?.hasDeathFadeEffect == true) {
            let fadedId = this.generateFadingAttachmentId();
            this.fadingAttachments[fadedId] = obj;

            // Set any variables that are required for the death fade-out effect
            obj.currentModel.deathFadeEffect.rendererLayer = rendererLayer;
            obj.currentModel.deathFadeEffect.inUse = true;
            obj.currentModel.deathFadeEffect.id = fadedId;
            obj.currentModel.deathFadeEffect.diedTick = Game.renderer.replicator.currentTick.tick;
            obj.currentModel.deathFadeEffect.lastFramePosition = obj.getPosition();
            obj.currentModel.deathFadeEffect.lastFrameVelocity = {
                x: obj.targetTick.position.x - obj.fromTick.position.x,
                y: obj.targetTick.position.y - obj.fromTick.position.y
            }
        } else {
            this[rendererLayer].removeAttachment(obj);
        }
    }

    generateFadingAttachmentId() {
        // generate a unique id for fading attachments
        const id = Math.floor(Math.random() * 100000);
        if (this.fadingAttachments[id] !== undefined) return this.generateFadingAttachmentId();

        return id;
    }

    deleteFadingAttachment(id) {
        const attachment = this.fadingAttachments[id];
        this[attachment.currentModel.deathFadeEffect.rendererLayer].removeAttachment(attachment);
        delete this.fadingAttachments[id];
    }

    update(msElapsed) {
        if (Game.renderer.renderer.renderer.context.isLost == true) {
            if (performance.now() - this.contextLostTime > 5000) {
                console.log("Context has been lost for too long! Re-initialising PIXI.");
                document.body.removeChild(this.renderer.canvas);
                this.initialisePixiInstance();
                return;
            }
        }

        if (this.firstPerformance === null) return this.firstPerformance = performance.now();

        const now = performance.now();
        const totalMs = now - this.firstPerformance;
        const currentMs = totalMs - this.lastMsElapsed;
        this.lastMsElapsed = totalMs;
        msElapsed = currentMs;
        Game.debug.begin();

        try {
            Game.eventEmitter.emit("RendererUpdated", {
                msElapsed
            });
        } catch (e) {
            console.log("Had an issue with the event listener on 'RendererUpdated'.", e);
        }

        if (Game.network.connected == true) {
            try {
                this.scene.update(msElapsed, null);
            } catch (e) {
                console.log("Had an issue updating the scene.", e);
            }
        }

        if (this.followingObject !== null) this.lookAtPosition(this.followingObject.getPosition());

        this.renderer.renderer.render(this.scene.getNode());

        const timerTotal = Math.round((performance.now() - now) * 100) / 100;
        if (timerTotal >= 10) {
            this.longFrames++;
        }

        for (let filter of this.renderingFilters) filter.update(msElapsed);

        Game.debug.end();
    }

    lookAtPosition({ x, y }) {
        const halfX = (window.innerWidth * window.devicePixelRatio) / 2;
        const halfY = (window.innerHeight * window.devicePixelRatio) / 2;
        x *= this.scale;
        y *= this.scale;
        const oldPositionX = this.entitiesLayer.getPositionX();
        const oldPositionY = this.entitiesLayer.getPositionY();
        const newPosition = {
            x: Math.round((-x + halfX) * 100) / 100,
            y: Math.round((-y + halfY) * 100) / 100
        };
        this.entitiesLayer.setPosition(newPosition.x, newPosition.y);
        if (oldPositionX !== newPosition.x || oldPositionY !== newPosition.y) {
            Game.eventEmitter.emit("CameraUpdate", {
                newPosition
            });
        }
    }

    onWindowResize() {
        if (this.ticker == undefined || this.ticker?.started == false) return;

        const canvasWidth = window.innerWidth * window.devicePixelRatio;
        const canvasHeight = window.innerHeight * window.devicePixelRatio;
        const ratio = Math.max(canvasWidth / (1920 * this.zoomDimension), canvasHeight / (1080 * this.zoomDimension));
        this.scale = ratio;
        this.entitiesLayer.setScale(ratio);
        this.uiLayer.setScale(ratio);
        this.renderer.renderer.resize(canvasWidth, canvasHeight);
        if (this.followingObject !== null) this.lookAtPosition(this.followingObject.getPosition());
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

    screenToYaw(x, y) {
        const angle = Math.round(Util.angleTo({ x: Game.renderer.getWidth() / 2, y: Game.renderer.getHeight() / 2 }, { x, y }));
        return angle % 360;
    }

    getWidth() {
        return this.renderer.renderer.width / window.devicePixelRatio;
    }

    getHeight() {
        return this.renderer.renderer.height / window.devicePixelRatio;
    }
}

export { Renderer };