import WasmModule from "./WasmModule";

class Scanner {
    constructor(sid) {
        this.name = "REDACTED" + Math.random().toString().substring(2, 6);
        this.serverId = sid || game.options.serverId;
        this.server = game.options.servers[this.serverId];
        this.ws = new WebSocket(`wss://${this.server.hostname}:443/`);
        this.ws.binaryType = "arraybuffer";
        this.ws.onmessage = this.onMessage.bind(this);
        this.ws.onclose = () => this.handleClose();
        this.codec = new game.networkType().codec;
        this.Module = WasmModule();
        this.counter = 0;
        this.discordWebhookUrl = "REDACTED"
    }

    sendPacket(event, data) {
        this.ws.readyState == 1 && this.ws.send(this.codec.encode(event, data));
    }

    onMessage(msg) {
        const opcode = new Uint8Array(msg.data)[0];
        if (opcode == 5) {
            this.Module.onDecodeOpcode5(new Uint8Array(msg.data), this.server.ipAddress, e => {
                this.sendPacket(4, { displayName: this.name, extra: e[5] });
                this.enterworld2 = e[6];
            });
            return;
        }
        if (opcode == 10) {
            this.ws.send(this.Module.finalizeOpcode10(new Uint8Array(msg.data)));
            return;
        }

        const data = this.codec.decode(msg.data);
        switch (opcode) {
            case 4:
                this.onEnterWorldHandler(data);
                break;
            case 9:
                this.handleRpc(data);
                break;
        }
    }

    onEnterWorldHandler(data) {
        if (!data.allowed) {
            this.sendPayloadToDiscord({
                content: `Attempted to scan server ${this.serverId}. Server is full`,
                username: this.name
            })
            return;
        }
        this.enterworld2 && this.ws.send(this.enterworld2);
        for (let i = 0; i < 26; i++) this.ws.send(new Uint8Array([3, 17, 123, 34, 117, 112, 34, 58, 49, 44, 34, 100, 111, 119, 110, 34, 58, 48, 125]));
        this.ws.send(new Uint8Array([7, 0]));
        this.ws.send(new Uint8Array([9, 6, 0, 0, 0, 126, 8, 0, 0, 108, 27, 0, 0, 146, 23, 0, 0, 82, 23, 0, 0, 8, 91, 11, 0, 8, 91, 11, 0, 0, 0, 0, 0, 32, 78, 0, 0, 76, 79, 0, 0, 172, 38, 0, 0, 120, 155, 0, 0, 166, 39, 0, 0, 140, 35, 0, 0, 36, 44, 0, 0, 213, 37, 0, 0, 100, 0, 0, 0, 120, 55, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 134, 6, 0, 0]));
        console.log("bot in game");
    }

    handleRpc(data) {
        if (data.name == "Leaderboard") {
            // Bypass Jeremiah's "patch"
            this.counter++;
            if (this.counter !== 2) {
                return;
            }

            const currentDate = new Date().toLocaleString();
            const payload = this.constructPayload(data.response, currentDate);

            this.sendPayloadToDiscord(payload);
            this.ws.close();
        }
    }

    constructPayload(responseData, currentDate) {
        const responseList = this.generateResponseList(responseData);
        return {
            content: `**Leaderboard response**\nDate: ${currentDate}\nServer ID: ${this.serverId}\nResponse:\n${responseList}`,
            username: this.name,
        };
    }

    generateResponseList(responseData) {
        return responseData
            .map(item => `- Name: ${item.name}, UID: ${item.uid}, Score: ${item.score}, Wave: ${item.wave}\n`)
            .join("");
    }

    sendPayloadToDiscord(payload) {
        fetch(this.discordWebhookUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Failed to send message to Discord webhook");
                }
                console.log("Message sent to Discord webhook");
            })
            .catch(error => {
                console.error("Error sending message to Discord webhook:", error);
            });
    }

    handleClose() {
        console.log("closed");
    }
}

// Example usage:
export default Scanner