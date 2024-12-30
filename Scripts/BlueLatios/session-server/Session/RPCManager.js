const RPCManager = {
    handleLocalBuilding(response) {
        response.forEach(building => {
            this.buildings[building.uid] = building;
            if (building.dead) {
                delete this.buildings[building.uid];
            }
        });
    },

    handlePartyShareKey(response) {
        this.partyShareKey = response.partyShareKey;
    },

    handleDead() {
        console.log("Player died", Date.now());
    },

    handleSetItem(response) {
        this.inventory[response.itemName] = response;
        if (!this.inventory[response.itemName].stacks) {
            delete this.inventory[response.itemName];
        }
        if (response.itemName === "ZombieShield" && response.stacks) {
            this.sendRpc({ name: "EquipItem", itemName: "ZombieShield", tier: response.tier });
        }
    },

    handlePartyInfo(response) {
        this.partyInfo = response;
    },

    handleSetPartyList(response) {
        this.parties = {};
        this.players = 0;
        response.forEach(e => {
            this.parties[e.partyId] = e;
            this.players += e.memberCount;
        });
    },

    handleDayCycle(response) {
        this.dayCycle = response;
    },

    handleLeaderboard(response) {
        this.leaderboard = response;
    },

    handleReceiveChatMessage(response) {
        this.messages.push(response);
        if (this.messages.length > 50) {
            this.messages = this.messages.slice(-50);
        }
    },

    handleCastSpellResponse: function(response) {
        this.castSpellResponse = response;
    },
}

export default RPCManager