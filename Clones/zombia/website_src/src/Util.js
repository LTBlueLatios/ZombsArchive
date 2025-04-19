import { Game } from "./Game.js";

class Util { 
    constructor() {
        this.checkedIfMobile = false;
        this.actuallyIsMobile = false;
    }
    lerp(start, end, ratio) {
        return start * (1 - ratio) + end * ratio;
    }
    mod(a, b) {
        return (a % b + b) % b;
    }
    interpolateYaw(from, target) {
        const tickPercent = Math.min(1, Game.renderer.replicator.getMsInThisTick() / Game.renderer.replicator.msPerTick);
        let rotationalDifference = this.lerp(0, (this.mod((target - from) + 180, 360) - 180), tickPercent);
        let yaw = from + rotationalDifference;
        if (yaw < 0) {
            yaw += 360;
        }
        if (yaw >= 360) {
            yaw -= 360;
        }
        return yaw;
    }
    angleTo(obj1, obj2) {
        return (Math.atan2(obj2.y - obj1.y, obj2.x - obj1.x) * 180 / Math.PI + 90 + 360) % 360;
    }
    measureDistance(obj1, obj2) {
        if (!(obj1.x !== undefined && obj1.y !== undefined && obj2.x !== undefined && obj2.y !== undefined)) return Infinity;
        let xDif = obj2.x - obj1.x;
        let yDif = obj2.y - obj1.y;
        return Math.abs((xDif**2) + (yDif**2));
    }
    isMobile() {
        if (!this.checkedIfMobile) {
            this.actuallyIsMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            this.checkedIfMobile = true;
        }
        return this.actuallyIsMobile;
    }
    hexToRgb(hex) {
        var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, function (m, r, g, b) {
            return r + r + g + g + b + b;
        });
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }
    createResourceCostString(data, tier = 1, multiplier = 1, requiresLowResource = true) {
        let lowResource = false;
        const resources = ["wood", "stone", "gold", "tokens"];
        const resourceCosts = [];
        const playerTick = Game.ui.getPlayerTick();
        for (const resource of resources) {
            const costString = `${resource}Costs`;
            if (costString in data) {
                const rawCost = (data[costString][tier - 1] == undefined ? data[costString] : data[costString][tier - 1]) * multiplier;
                if (rawCost === 0) continue;
                resourceCosts.push(`<span class="${playerTick !== null && requiresLowResource === true ? playerTick[resource] >= rawCost ? "" : "hud-resource-low" : ""}">${this.abbreviateNumber(rawCost, 3).toLocaleString()} ${resource}</span>`);
            }
        }
        if (resourceCosts.length > 0) {
            return { elem: resourceCosts.join(", ") };
        }
        return { elem: "<span class='hud-resource-free'>Free</span>", lowResource };
    }
    createResourceRefundString(data, tier = 1, multiplier = 0) {
        const resources = ["wood", "stone", "gold", "tokens"];
        const resourcesRefunded = [];
        for (const resource of resources) {
            const resourceKey = `${resource}Costs`;
            if (data[resourceKey]) {
                const rawRefund = Math.floor(data[resourceKey].slice(0, tier).reduce((a, b) => a + b) * multiplier * 0.75);
                if (rawRefund > 0) {
                    resourcesRefunded.push(`${this.abbreviateNumber(rawRefund, 3).toLocaleString()} ${resource}`);
                }
            }
        }
        if (resourcesRefunded.length > 0) return `${resourcesRefunded.join(', ')}`;
        return "<span class='hud-resource-free'>None</span>";
    }
    canAfford(playerData, itemPrices) {
        const resources = ["wood", "stone", "gold", "tokens"];
        for (let resource of resources) {
            if (playerData[resource] < itemPrices[`${resource}Costs`]) return false;
        }

        return true;
    }
    abbreviateNumber(number, decPlaces) {
        const units = ["K", "M", "B", "T", "q", "Q", "s", "S", "O", "N", "D"];
        decPlaces = Math.pow(10, decPlaces);
    
        for (let i = units.length - 1; i >= 0; i--) {
            const size = Math.pow(10, (i + 1) * 3);
            if (size <= number) {
                number = Math.round(number * decPlaces / size) / decPlaces;
                if ((number === 1000) && (i < units.length - 1)) {
                    number = 1;
                    i++;
                };
                number += units[i];
                break;
            }
        }
        return number;
    }
}

const util = new Util();
export { util as Util };