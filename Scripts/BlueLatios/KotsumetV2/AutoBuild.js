// Credits to trollers :3
class AutoBuild {
    constructor() {
        this.buildingSchemaObj = { "Wall": 0, "Door": 1, "SlowTrap": 2, "ArrowTower": 3, "CannonTower": 4, "MeleeTower": 5, "BombTower": 6, "MagicTower": 7, "GoldMine": 8, "Harvester": 9, "GoldStash": 10 };
        this.buildingSchemaArr = ["Wall", "Door", "SlowTrap", "ArrowTower", "CannonTower", "MeleeTower", "BombTower", "MagicTower", "GoldMine", "Harvester", "GoldStash"];
        this.confirmedBase = null;
    }

    getBaseCode() {
        const buildingsArr = Object.values(game.ui.buildings);
        const stash = buildingsArr.shift();
        const arr = [stash.x / 48 + (stash.y / 48) * 500];
        buildingsArr.forEach(e => arr.push(this.encodeBuilding((e.x - stash.x) / 48, (e.y - stash.y) / 48, e.tier, (0 || 0) / 90, this.buildingSchemaObj[e.type])));
        return JSON.stringify(arr);
    }

    buildBase(baseCode) {
        const arr = JSON.parse(baseCode);
        let stash = Object.values(game.ui.buildings)[0];
        if (!stash) {
            stash = { x: Math.floor(arr[0] % 500) * 48, y: Math.floor(arr[0] / 500) * 48 };
            game.network.sendRpc({ name: "MakeBuilding", x: stash.x, y: stash.y, type: "GoldStash", yaw: 0 });
        }
        for (let i = 1; i < arr.length; i++) {
            const index = arr[i];
            const e = this.decodeBuilding(index);
            game.network.sendRpc({ name: "MakeBuilding", x: stash.x + e[0] * 48, y: stash.y + e[1] * 48, type: this.buildingSchemaArr[e[4]], yaw: e[3] * 90 });
        }
    }

    encodeBuilding(x, y, tier, yaw, key) {
        if (key <= 2) return yaw * 10 ** 6 + (y + 18.5) * 10 ** 4 + (x + 18.5) * 10 ** 2 + tier * 10 + key;
        if (key == 9) return yaw * 10 ** 8 + (y + 492) * 10 ** 5 + (x + 492) * 10 ** 2 + tier * 10 + key;
        return yaw * 10 ** 6 + (y + 18) * 10 ** 4 + (x + 18) * 10 ** 2 + tier * 10 + key;
    }

    decodeBuilding(num) {
        if (num % 10 <= 2) return [Math.round(Math.floor(num / 10 ** 2) % 100) - 18.5, Math.round(Math.floor(num / 10 ** 4) % 100) - 18.5, Math.round(Math.floor(num / 10) % 10), Math.floor(num / 10 ** 6), num % 10];
        if (num % 10 == 9) return [Math.round(Math.floor(num / 10 ** 2) % 1000) - 492, Math.round(Math.floor(num / 10 ** 5) % 1000) - 492, Math.round(Math.floor(num / 10) % 10), Math.floor(num / 10 ** 8), num % 10];
        return [Math.round(Math.floor(num / 10 ** 2) % 100) - 18, Math.round(Math.floor(num / 10 ** 4) % 100) - 18, Math.round(Math.floor(num / 10) % 10), Math.floor(num / 10 ** 6), num % 10];
    }
}

export default AutoBuild;