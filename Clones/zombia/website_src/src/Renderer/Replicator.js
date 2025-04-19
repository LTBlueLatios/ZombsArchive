import { Game } from "../Game.js";

class Replicator {
    constructor() {
        this.currentTick = { tick: 0 };
        this.ticks = [];
        this.shiftedGameTime = 0;
        this.lastShiftedGameTime = 0;
        this.receivedFirstTick = false;
        this.serverTime = 0;
        this.msPerTick = 0;
        this.msInThisTick = 0;
        this.msElapsed = 0;
        this.lastMsElapsed = 0;
        this.startTime = null;
        this.startShiftedGameTime = 0;
        this.frameStutters = 0;
        this.frameTimes = [];
        this.interpolating = false;
        this.ticksDesynced = 0;
        this.ticksDesynced2 = 0;
        this.clientTimeResets = 0;
        this.maxExtrapolationTime = 0;
        this.totalExtrapolationTime = 0;
        this.extrapolationIncidents = 0;
        this.differenceInClientTime = 0;
        this.equalTimes = 0;
        this.wasRendererJustUnpaused = false;

        this.tickUpdatedCallback = () => {};

        Game.eventEmitter.on("EnterWorldResponse", this.onEnterWorld.bind(this));
        Game.eventEmitter.on("EntityUpdate", this.onEntityUpdate.bind(this));
        Game.eventEmitter.on("RendererUpdated", this.onTick.bind(this));
    }
    setTargetTickUpdatedCallback(tickUpdatedCallback) {
        this.tickUpdatedCallback = tickUpdatedCallback;
    }
    getClientTimeResets() {
        return this.clientTimeResets;
    }
    getMsInThisTick() {
        return Math.floor(this.msInThisTick);
    }
    getMsPerTick() {
        return this.msPerTick;
    }
    getMsSinceTick(tick, useInterpolationOffset = true) {
        if (useInterpolationOffset) tick += 1;
        return this.shiftedGameTime - tick * this.msPerTick;
    }
    getMsUntilTick(tick) {
        return tick * this.msPerTick - this.shiftedGameTime;
    }
    getServerTime() {
        return Math.floor(this.serverTime);
    }
    getClientTime() {
        return Math.floor(this.shiftedGameTime);
    }
    getRealClientTime() {
        if (this.startTime == null) {
            return 0;
        }
        var msElapsed = (new Date().getTime() - this.startTime.getTime());
        return Math.floor(this.startShiftedGameTime + msElapsed);
    }
    getFrameStutters() {
        return this.frameStutters;
    }
    getDifferenceInClientTime() {
        return this.differenceInClientTime;
    }
    isFpsReady() {
        return this.frameTimes.length >= 10;
    }
    getFps() {
        var time = 0;
        for (var i = 0; i < this.frameTimes.length; i++) {
            time += this.frameTimes[i];
        }
        return 1000 / (time / this.frameTimes.length);
    }
    getTickIndex() {
        if (this.currentTick == null) {
            return 0;
        }
        return this.currentTick.tick;
    }
    getMaxExtrapolationTime() {
        return this.maxExtrapolationTime;
    }
    getExtrapolationIncidents() {
        return this.extrapolationIncidents;
    }
    getTotalExtrapolationTime() {
        return this.totalExtrapolationTime;
    }
    resetClientLag() {
        this.shiftedGameTime = this.getRealClientTime();
    }
    onTick({ msElapsed }) {
        this.msElapsed += msElapsed;
        this.lastMsElapsed = msElapsed;
        this.frameTimes.push(msElapsed);
        if (this.frameTimes.length > 10) {
            this.frameTimes.shift();
        }
        var steps = 0;
        var timestep = 1000 / 60;
        while (this.msElapsed >= timestep) {
            this.msElapsed -= timestep;
            steps++;
        }
        if (steps > 1) {
            this.frameStutters++;
        }
        if (this.isRendererPaused()) {
            this.wasRendererJustUnpaused = true;
            this.equalTimes = 0;
            msElapsed = 0;
        }
        this.serverTime += msElapsed;
        this.shiftedGameTime += msElapsed;
        this.msInThisTick += msElapsed;
        this.updateTick();
    }
    onServerDesync() {
        this.ticks.length = 0;
    }
    updateTick() {
        for (var i = 0; i < this.ticks.length; i++) {
            var tick = this.ticks[i];
            var tickStart = this.msPerTick * tick.tick;
            if (this.shiftedGameTime >= tickStart) {
                this.currentTick = tick;
                this.msInThisTick = this.shiftedGameTime - tickStart;
                this.tickUpdatedCallback(tick.entities);
                this.ticks.shift();
                i--;
            }
        }
        if (this.currentTick != null) {
            var nextTickStart = this.msPerTick * (this.currentTick.tick + 1);
            if (this.shiftedGameTime >= nextTickStart) {
                if (this.interpolating) {
                    this.interpolating = false;
                    this.extrapolationIncidents++;
                }
                this.maxExtrapolationTime = Math.max(this.shiftedGameTime - nextTickStart, this.maxExtrapolationTime);
                let extrapolationTime = Math.min(this.msInThisTick - this.msPerTick, this.lastMsElapsed);
                this.totalExtrapolationTime += extrapolationTime;
            }
            else {
                this.interpolating = true;
            }
            if (this.serverTime - this.shiftedGameTime < Game.network.ping) {
                this.ticksDesynced++;
                if (this.ticksDesynced >= 10) {
                }
            }
        }
    }
    onEnterWorld(data) {
        if (!data.allowed) {
            return;
        }
        this.msPerTick = data.tickRate;
        this.msInThisTick = 0;
        this.shiftedGameTime = 0;
        this.serverTime = 0;
        this.receivedFirstTick = false;
        this.msElapsed = 0;
        this.lastMsElapsed = 0;
        this.startTime = null;
        this.startShiftedGameTime = 0;
        this.interpolating = false;
    }
    checkRendererPaused() {
        if (this.lastShiftedGameTime == this.shiftedGameTime) {
            this.equalTimes++;
        }
        else {
            this.equalTimes = 0;
        }
    }
    isRendererPaused() {
        return this.equalTimes >= 8;
    }
    onEntityUpdate(data) {
        this.serverTime = data.tick * this.msPerTick + Game.network.ping;
        this.ticks.push(data);
        if (!this.receivedFirstTick) {
            this.receivedFirstTick = true;
            this.startTime = new Date();
            this.shiftedGameTime = data.tick * this.msPerTick - 90;
            this.startShiftedGameTime = this.shiftedGameTime;
            this.clientTimeResets = 0;
        }
        else {
            this.checkRendererPaused();
            var rendererPaused = this.isRendererPaused();
            var differenceInClientLag = (data.tick * this.msPerTick - 90) - this.shiftedGameTime;
            if (!rendererPaused) {
                this.differenceInClientTime = differenceInClientLag;
            }
            if (Math.abs(differenceInClientLag) >= 40) {
                this.ticksDesynced2++;
            }
            else {
                this.ticksDesynced2 = 0;
            }
            if (this.ticksDesynced2 >= 10 || this.wasRendererJustUnpaused) {
                var last = this.shiftedGameTime;
                this.shiftedGameTime = data.tick * this.msPerTick - 90;
                this.msInThisTick += (this.shiftedGameTime - last);
                if (!rendererPaused && !this.wasRendererJustUnpaused) {
                    this.clientTimeResets++;
                }
                this.ticksDesynced2 = 0;
                this.wasRendererJustUnpaused = false;
            }
            this.lastShiftedGameTime = this.shiftedGameTime;
        }
    }
}

export { Replicator };