import { Ui } from "./Ui/Ui.js";
import { Network } from "./Network/Network.js";
import { Renderer } from "./Renderer/Renderer.js";
import { Debug } from "./Debug.js";
import EventEmitter from "events";
import _ from "underscore";

class Game {
    constructor() {
        try {
            localStorage.setItem("dummyProp", "dummy");
            localStorage.removeItem("dummyProp");

            window.storage = localStorage;
        } catch(err) {
            window.storage = {
                getItem() {},
                setItem() {}
            }

            if (window.confirm("localStorage has been denied access. Not all functionality is possible. Press OK for more info (popup must be allowed).")) {
                window.open("https://support.google.com/chrome/answer/14114868", "_blank");
            }
        }

        this.ui = new Ui();
        this.network = new Network();
        this.renderer = new Renderer();
        this.debug = new Debug();
        this.eventEmitter = new EventEmitter();
        this.eventEmitter.setMaxListeners(100);

        this.settings = {
            specialEffectsDisabled: false,
            deleteOldChat: true
        }
    }

    async init() {
        await this.renderer.init();
        this.ui.init();
        this.debug.init();
        this.network.init();
    }

    getInWorld() {
        return this.network.connected;
    }
}

const game = new Game();

window.game = game;

game.init();
export { game as Game };