import { Game } from "../Game.js";

class InputPacketManager {
    constructor() {
        this.movementPackets = {};
        this.lastSentYaw = 1;
        this.hasBoundKeys = false;
        this.mouseDown = false;
        this.shiftDown = false;
        this.inputsLocked = false;
    }

    init() {
        Game.eventEmitter.on("EnterWorldResponse", this.onEnterWorld.bind(this));
    }

    toggleInputLock() {
        if (!Game.network.connected) return;

        this.inputsLocked = !this.inputsLocked;

        Game.ui.components.uiInputLock.toggle(this.inputsLocked);
    }

    onEnterWorld() {
        this.inputsLocked = false;

        if (!this.hasBoundKeys) {
            this.hasBoundKeys = true;
            window.addEventListener("keydown", this.onKeydown.bind(this));
            window.addEventListener("keyup", this.onKeyup.bind(this));
            window.addEventListener("mousedown", this.onMouseDown.bind(this));
            window.addEventListener("mouseup", this.onMouseUp.bind(this));
            window.addEventListener("mousemove", this.onMouseMoved.bind(this));
        }
    }

    sendInputPacket(data, event) {
        if (this.inputsLocked == true && event.which !== 71) {
            Game.ui.components.uiInputLock.alert();
            return;
        }


        let dataToSend = {};
        for (let type of Object.keys(data)) {
            if (typeof this.movementPackets[type] == "undefined") {
                this.movementPackets[type] = data[type];
                dataToSend[type] = data[type];
            } else {
                if (this.movementPackets[type] === data[type]) continue; else {
                    this.movementPackets[type] = data[type];
                    dataToSend[type] = data[type];
                }
            }
        }
        if (Object.keys(dataToSend).length > 0) Game.network.sendInput({ ...dataToSend });
    }

    onKeydown(event) {
        switch (event.which) {
            case 87: // UP - W
            case 38:
                this.sendInputPacket({ up: true, down: false }, event);
                break;
            case 65: // LEFT - A
            case 37:
                this.sendInputPacket({ left: true, right: false }, event);
                break;
            case 83: // DOWN - S
            case 40:
                this.sendInputPacket({ down: true, up: false }, event);
                break;
            case 68: // RIGHT - D
            case 39:
                this.sendInputPacket({ right: true, left: false }, event);
                break;
            case 32: // SPACE
                this.sendInputPacket({ space: true }, event);
                break;
            case 16: // SHIFT
                this.shiftDown = true;
                break;
        }

        Game.eventEmitter.emit(`${event.which}Down`);
    }

    onKeyup(event) {
        switch (event.which) {
            case 87: // UP - W
            case 38:
                this.sendInputPacket({ up: false }, event);
                break;
            case 65: // LEFT - A
            case 37:
                this.sendInputPacket({ left: false }, event);
                break;
            case 83: // DOWN - S
            case 40:
                this.sendInputPacket({ down: false }, event);
                break;
            case 68: // RIGHT - D
            case 39:
                this.sendInputPacket({ right: false }, event);
                break;
            case 32: // SPACE
                this.sendInputPacket({ space: false }, event);
                break;
            case 16: // SHIFT
                this.shiftDown = false;
                break;
            case 71: // G
                this.toggleInputLock();
                break;
        }

        Game.eventEmitter.emit(`${event.which}Up`, event);
    }

    getLastSentYaw() {
        return this.lastSentYaw;
    }

    onMouseMoved(event) {
        const mousePos = Game.renderer.screenToWorld(event.clientX, event.clientY);
        const mouseYaw = Game.renderer.screenToYaw(event.clientX, event.clientY);
        this.lastSentYaw = mouseYaw;
        this.sendInputPacket({
            mouseMoved: mouseYaw,
            x: Math.floor(mousePos.x),
            y: Math.floor(mousePos.y)
        }, event);
        
        Game.eventEmitter.emit("mouseMoved", { event });
    }

    onMouseDown(event) {
        if (event.which == 3 || event.button == 2) {
            if (this.rightMouseDown) {
                Game.eventEmitter.emit("rightMouseUp", { event });
            };
            this.rightMouseDown = true;
            Game.eventEmitter.emit("rightMouseDown", { event });
            return;
        };

        if (Game.ui.castingSpell == false) {
            this.sendInputPacket({
                mouseDown: true
            }, event);
        }

        this.mouseDown = true;
        Game.eventEmitter.emit("mouseDown", { event });
    }

    onMouseUp(event) {
        if (this.inputsLocked == true) return;

        if (event.which == 3 || event.button == 2) {
            this.rightMouseDown = false;
            Game.eventEmitter.emit("rightMouseUp", event);
            return;
        };

        if (Game.ui.castingSpell == false) {
            this.sendInputPacket({
                mouseDown: false
            });
        }

        this.mouseDown = false;
        Game.eventEmitter.emit("mouseUp", { event });
    }
}

export { InputPacketManager };