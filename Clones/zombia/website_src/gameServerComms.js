(require("dotenv")).config();
const WebSocket = require("ws");
const config = require("./config.json");
const fs = require("fs");
const axios = require("axios");

let websiteController;

class GameServerComms {
    constructor(websiteControllerProp) {
        websiteController = websiteControllerProp;

        this.activeServers = {};

        // serverRegions exists to ID servers properly
        // vXXYYYY where XX is the index in the below object and YYYY is which server within the region
        // For example v020004 is Frankfurt #4
        this.serverRegions = {
            "Los Angeles": {},
            "New York": {},
            "Frankfurt": {},
            "Sydney": {},
            "Singapore": {}
        };

        this.wsServer = new WebSocket.Server({ port: config.gameServerWsPort });

        this.wsServer.on("listening", () => {
            console.log(`Game server WebSocket server is listening on port ${config.gameServerWsPort}`);
        })

        this.wsServer.on("connection", socket => {
            this.onNewWS(socket);
        })

        this.cloudflareAuthenticationHeaders = {
            'Content-Type': 'application/json',
            'X-Auth-Key': process.env.CLOUDFLARE_API_KEY,
            'X-Auth-Email': process.env.EMAIL_ADDRESS
        }

        // Clear all DNS records from previous servers
        // This MUST be set to true before committing to git
        this.shouldClearDNS = false;
        if (this.shouldClearDNS == true) this.clearDNS();

        this.ipPlayerCounts = {};
    }

    async clearDNS() {
        let log = "Clearing remnant DNS records...";
        let foundRecord = false;

        try {
            const getRequest = await axios.get(`https://api.cloudflare.com/client/v4/zones/${process.env.CLOUDFLARE_ZONE_ID}/dns_records`, {
                headers: this.cloudflareAuthenticationHeaders,
            });

            const dnsRecords = getRequest.data.result;

            for (const record of dnsRecords) {
                if (record.name.startsWith("server-")) {
                    const response = await axios.delete(`https://api.cloudflare.com/client/v4/zones/${process.env.CLOUDFLARE_ZONE_ID}/dns_records/${record.id}`, {
                        headers: this.cloudflareAuthenticationHeaders,
                    });

                    foundRecord = true;

                    if (response.status === 200) {
                        log += `\nDeleted DNS record with name ${record.name} (${record.id})`;
                    } else {
                        console.error(`Failed to delete DNS record with name ${record.name} (${record.id}). Status code: ${response.status}`);
                    }
                }
            }
        } catch(err) {
            websiteController.sendDiscordWebhook(`Error clearing DNS records:\n${err.stack}`);
        } finally {
            if (foundRecord == false) log += "None found";
            console.log(log);
        }

    }

    // return value is the ID of the new subdomain
    async createCloudflareDns(subdomain, ipAddress) {
        try {
            const data = {
                type: "A",
                name: subdomain,
                content: ipAddress,
                proxied: false
            };

            const response = await axios.post(`https://api.cloudflare.com/client/v4/zones/${process.env.CLOUDFLARE_ZONE_ID}/dns_records`, data, {
                headers: this.cloudflareAuthenticationHeaders,
            });

            if (response.status !== 200) {
                console.error(`Failed to create subdomain ${subdomain}. Status code: ${response.status}`);
                return 0;
            }

            console.log(`Subdomain ${subdomain} created successfully.`);
            return response.data.result.id;
        } catch (error) {
            console.error(`Error creating subdomain ${subdomain}: ${error.message}`);
            return 0;
        }
    }

    async deleteCloudflareDNS(serverId) {
        const recordId = this.activeServers[serverId]?.cloudflareID;
        if (recordId == undefined) return;
        try {
            const response = await axios.delete(`https://api.cloudflare.com/client/v4/zones/${process.env.CLOUDFLARE_ZONE_ID}/dns_records/${recordId}`, {
                headers: this.cloudflareAuthenticationHeaders,
            });
            if (response.status === 200) {
                console.log(`Deleted DNS record with ID: ${recordId}`);
            } else {
                console.error(`Failed to delete DNS record with ID ${recordId}. Status code: ${response.status}`);
            }
        } catch (error) {
            console.error(`Error deleting DNS record with ID ${recordId}: ${error.message}`);
        }
    }

    // this function generates an array that will be sent to players, containing info only players need to know
    generatePublicServersArray() {
        let publicServers = [];

        for (let id in this.activeServers) {
            publicServers.push({
                id,
                status: this.activeServers[id].serverInfo.status,
                country: this.activeServers[id].serverInfo.country,
                city: this.activeServers[id].serverInfo.city,
                port: this.activeServers[id].serverInfo.port,
                gameMode: this.activeServers[id].serverInfo.gameMode
            })
        }

        return publicServers;
    }

    generateServerId(region) {
        let Id = "v";
        
        this.serverRegions[region] ||= {};
    
        Id += ("0" + (Object.keys(this.serverRegions).indexOf(region) + 1)).slice(-2);

        let position = 0;
        for (let i = 1; i <= 999; i++) {
            if (this.serverRegions[region][i] == undefined) {
                this.serverRegions[region][i] = true;
                Id += ("00" + i).slice(-3);
                position = i;

                break;
            }
        }
    
        return { positionInIdObj: position, Id };
    }

    onNewWS(socket) {
        socket.on("error", err => {
            console.log(err);
            socket.close();
            return;
        });

        socket.ipAddress = socket._socket.remoteAddress.replace("::ffff:", "");

        // An array that has to be sent from the game server as an authentication measure
        const authenticationArray = [752, 993, 141, 191, 141, 664, 550, 124, 164, 678, 806, 970, 89, 860, 968, 101, 964, 841, 427, 344, 991, 279, 923, 597, 959, 220, 32, 942, 931, 764, 334, 570, 283, 491, 157, 918, 449, 301, 291, 467, 215, 839, 154, 956, 981, 325, 551, 864, 7, 956];

        let socketAuthenticated = false;
        setTimeout(() => {
            if (socketAuthenticated == false) socket.close();
        }, 1000);

        socket.on("message", async msg => {
            let message;
            try {
                message = JSON.parse(Buffer.from(msg).toString());
            } catch(err) {
                return;
            }

            if (socketAuthenticated == false) {
                if (message.message_type == "Handshake") {
                    if (Array.isArray(message.message.HandshakePacket.authentication_array)) {
                        const array = message.message.HandshakePacket.authentication_array;
                        let arrayCorrect = true;
                        if (array.length !== authenticationArray.length) arrayCorrect = false;

                        for (let i in array) {
                            if (array[i] !== authenticationArray[i]) arrayCorrect = false;
                        }

                        if (arrayCorrect == true) {
                            socketAuthenticated = true;
                            socket.serverInfo = message.message.HandshakePacket.server_info;

                            console.log(`${socket.ipAddress} has been recognised as a game server.`);

                            // Initialise server
                            const { positionInIdObj, Id } = this.generateServerId(message.message.HandshakePacket.server_info.city);

                            socket.id = Id;
                            socket.positionInIdObj = positionInIdObj;

                            socket.cloudflareID = await this.createCloudflareDns(`server-${socket.id}`, socket.ipAddress);

                            this.activeServers[socket.id] = socket;

                            this.sendBannedIpAddressList(socket);
                        }
                    }
                }

                return;
            }

            if (message.message_type == undefined) return;

            switch (message.message_type) {
                case "BanIpAddress":
                    this.banIpAddress(message.ipAddress, message.reason, message.lastUsedName);
                    break;
                case "DebuggingInfo":
                    socket.debuggingInfo = message.message.DebuggingInfo;

                    // Update server population status
                    const serverPopulation = message.message.DebuggingInfo.population;
                    
                    let status = "";
                    if (serverPopulation == 0) status = "Empty";
                    else if (serverPopulation < 10) status = "Low";
                    else if (serverPopulation < 20) status = "Medium";
                    else if (serverPopulation < 32) status = "High";
                    else status = "Full";

                    socket.serverInfo.status = status;
                    break;
                case "PlayerCountUpdated":
                    const playerInfo = message.playerInfo;

                    for (const player of playerInfo) {
                        if (player.isIncreasing == true) {
                            this.ipPlayerCounts[player.ipAddress] ||= [];
                            this.ipPlayerCounts[player.ipAddress].push(socket.id);
                        } else {
                            if (this.ipPlayerCounts[player.ipAddress] !== undefined) {
                                this.ipPlayerCounts[player.ipAddress].splice(this.ipPlayerCounts[player.ipAddress].indexOf(socket.id), 1);
                            }
                        }
                    }

                    let list = {};
                    for (let ip in this.ipPlayerCounts) {
                        list[ip] = this.ipPlayerCounts[ip].length;
                    }

                    for (let id in this.activeServers) {
                        this.activeServers[id].send(JSON.stringify({ playerIpCounts: list }));
                    }
                    break;
                case "MapLayout":
                    socket.mapLayout = message.message.MapLayout;
                    break;
            }
        });

        socket.on("close", () => {
            // TODO: when server socket closes, delete the saved ip counts from that server

            this.serverRegions[socket.serverInfo.city][socket.positionInIdObj] = undefined;
            this.deleteCloudflareDNS(socket.id);

            delete this.activeServers[socket.id];

            for (let ip in this.ipPlayerCounts) {
                const playerIp = this.ipPlayerCounts[ip];

                for (let i = 0; i < playerIp.length; i++) {
                    const serverId = playerIp[i];
                    if (serverId == socket.id) {
                        playerIp.splice(i, 1);
                        i--;
                    }
                }
            }

            let list = {};
            for (let ip in this.ipPlayerCounts) {
                list[ip] = this.ipPlayerCounts[ip].length;
            }

            for (let id in this.activeServers) {
                this.activeServers[id].send(JSON.stringify({ playerIpCounts: list }));
            }

            console.log(`${socket.ipAddress} has been removed as a recognised game server.`);
        })
    }

    sendBannedIpAddressList(socket, list = undefined) {
        socket.send(JSON.stringify({
            bannedIpAddresses: list == undefined ? Object.keys(websiteController.bannedIpAddresses) : Object.keys(list)
        }));
    }

    sendBannedIpAddressListToAll(list = undefined) {
        for (let id in this.activeServers) {
            this.sendBannedIpAddressList(this.activeServers[id], list);
        }
    }

    banIpAddress(ipAddress, reason, lastUsedName) {
        const bannedIpsTemp = JSON.parse(fs.readFileSync("./bannedIpAddresses.json", "utf-8"));
    
        if (bannedIpsTemp[ipAddress] == undefined) {
            bannedIpsTemp[ipAddress] = {
                reason,
                timeBanned: Date.now(),
                lastUsedName
            }
    
            fs.writeFileSync("./bannedIpAddresses.json", JSON.stringify(bannedIpsTemp));
        }

        this.sendBannedIpAddressListToAll(bannedIpsTemp);
    }

    async onShutdown() {
        console.log("Cleaning up Cloudflare DNS records...");
        const deletePromises = [];
        for (let id in this.activeServers) {
            deletePromises.push(this.deleteCloudflareDNS(id));
        }
        await Promise.all(deletePromises);
    }
}

module.exports = GameServerComms;
