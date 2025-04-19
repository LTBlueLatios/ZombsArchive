import { Game } from "./Game.js";
import { Stats } from "./Stats.js";

class Debug {
  constructor() {
    this.visible = false;
    this.ticks = 0;
    this.averageServerFrameTime = 0;
    this.lastByteSizes = [];
  }

  init() {
    const debugHtml = `<div id="hud-debug-container" class="hud-debug-container"></div>`;
    document.body.insertAdjacentHTML("beforeend", debugHtml);
    this.stats = new Stats();
    this.stats.domElement.addEventListener("mousedown", this.onMouseClick);
    this.stats.domElement.style =
      "position: relative; transform: scale(1.5); transform-origin: 0 0; cursor:pointer; width: min-content;";
    document
      .getElementById("hud-debug-container")
      .appendChild(this.stats.domElement);

    this.debugElem = document.createElement("div");
    this.debugElem.id = "hud-debug";
    this.debugElem.className = "hud-debug";
    this.debugElem.style =
      "color:#ffffff;font-family:sans-serif;background-color:rgba(0,0,0,0.8); margin-top: 30px;";
    document.getElementById("hud-debug-container").appendChild(this.debugElem);

    this.debugElem.addEventListener("mousedown", this.onMouseClick);

    Game.eventEmitter.on("RendererUpdated", this.onRendererTick.bind(this));
    Game.eventEmitter.on("119Up", this.onKeyRelease.bind(this));

    Game.eventEmitter.on("EntityUpdate", this.onEntityUpdate.bind(this));

    if (this.visible) this.show();
    else this.hide();
  }

  onEntityUpdate(data) {
    this.averageServerFrameTime = data.averageServerFrameTime;
    this.lastByteSize = data.byteSize;

    this.lastByteSizes.push(this.lastByteSize);
    if (this.lastByteSizes.length > 1000 / Game.renderer.replicator.msPerTick)
      this.lastByteSizes.shift();
  }

  onMouseClick(event) {
    event.stopPropagation();
    event.preventDefault();
  }

  begin() {
    if (!this.stats || !this.visible) return;
    this.stats.begin();
  }

  end() {
    if (!this.stats || !this.visible) return;
    this.stats.end();
  }

  show() {
    this.visible = true;
    document.getElementById("hud-debug-container").style.display = "block";
  }

  hide() {
    this.visible = false;
    document.getElementById("hud-debug-container").style.display = "none";
  }

  onRendererTick() {
    if (!this.visible) return;

    if (this.ticks >= 20) this.ticks = 0;
    this.ticks++;
    if (this.ticks % 20 !== 0) return;

    const localTick =
      Game.renderer.world.entities[Game.renderer.world.localPlayer]?.targetTick;

    this.debugElem.innerHTML = `
        Ping: ${Game.network.getPing()} ms<br>
        FPS: ${Math.round(Game.renderer.replicator.getFps())}<br>
        X: ${localTick?.position.x}<br>
        Y: ${localTick?.position.y}<br>
        Server Uptime: ${Math.floor(Game.renderer.replicator.getServerTime()).toLocaleString()} ms<br>
        Entities shared with client: ${Object.keys(Game.renderer.world.entities).length}<br>
        Tick flow rate: ${Math.floor(Game.network.entityUpdateTimeDelta)} ms<br>
        Average server frame time: ${this.averageServerFrameTime} ms<br>
        Last byte size: ${this.lastByteSize} bytes (${abbreviateNumber(eval(this.lastByteSizes.join("+")), 3)}b/sec)<br>
        Frame stutters: ${Game.renderer.replicator.frameStutters}<br>
        `;
  }

  onKeyRelease() {
    if (this.visible) {
      this.hide();
    } else {
      this.show();
    }
  }
}

const abbreviateNumber = (number, decPlaces) => {
  const units = ["k", "m", "g"];
  decPlaces = Math.pow(10, decPlaces);

  for (let i = units.length - 1; i >= 0; i--) {
    const size = Math.pow(10, (i + 1) * 3);
    if (size <= number) {
      number = Math.round((number * decPlaces) / size) / decPlaces;
      if (number === 1000 && i < units.length - 1) {
        number = 1;
        i++;
      }
      number += ` ${units[i]}`;
      break;
    }
  }
  return number;
};

export { Debug };
