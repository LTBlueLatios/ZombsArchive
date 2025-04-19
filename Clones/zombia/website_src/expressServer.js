(require("dotenv")).config();
const config = require("./config.json");
const express = require("express");
const statuses = require("statuses");
const fs = require("fs");
const axios = require("axios");

const grawlix = require("grawlix");
const grawlixRacism = require("grawlix-racism");

grawlix.loadPlugin(grawlixRacism);

grawlix.setDefaults({
    randomize: false
});

const mongoose = require("mongoose");

mongoose.connect(`mongodb+srv://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@zombia.hj2pnv4.mongodb.net/?retryWrites=true&w=majority`, {
    dbName: "zombia"
})
.then(() => {
    console.log("Connected to leaderboard database");
})

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Master password for game server post requests
const gameServerPassword = "V*[(@%CnwBjlgDu-Va]dYVZC:wk)N6i_v8e;6[j2p'17g?1W#|EPSojX0G9j1N9lIcl=_<gWF?jpWZ<'oS4-wlT.OU1C*qKx]dmlp0&mUh>,j<OSW#*N?$g]Q[B88Ujg8crX{S[m^]u'tcs?{7FQ2_0HEK0MT+&&F9vU/'mg/8xOc6pGEF,'G]+T{8QJOypo&DI9EOr*V78@#-_#9Y}Tmn&j[ML<@P<WM+u4#0ciM!1']_tz^UmR5Ndo!%9laY1wU042:*ekBT1Tnl8jPJ1aI{eJDyLzM9sx&f.ceBWM(i8E:c?&z!]IvBbGJ/GguLlhZp'MQrToZ7OZs6,5tb4x4/@UTeTS)&nUtj&[6p{F#_aKF*4NjHp5x}<Y(hF>hs60{X0ZE.m(p'Pu:_Kqm-*ys01oTP5YRa*F|hq3)h)fdb+rnvkb-L.X#?G#di|u89jZ{S#HUomGw64Rkw5F[{D:^x$Ih*Q00{;J!=A$Fy^hj0bqz|mlbar/'[UU1kQp[CGA";

// Stupid workaround for circular dependencies
let websiteController;

class expressServer {
    constructor(websiteControllerProp) {
        websiteController = websiteControllerProp;
    }
}

const app = express();
app.use(express.json());
app.listen(config.websitePort, err => {
    if (err) throw new Error(err);

    console.log(`Express is listening on port ${config.websitePort}`)
});

// express status override
app.response.sendStatus = function sendStatus(statusCode) {
    this.statusCode = statusCode;

    switch (statusCode) {
        case 404:
            this.type("html");
            this.sendFile(__dirname + "/private/404.html");
            break;
        default:
            this.type("txt");
            this.send(statuses.message[statusCode] || String(statusCode));
            break;
    }
}

/*
***
**
* LEADERBOARD REQUESTS
**
***
*/

const leaderboardEntrySchema = new mongoose.Schema({
    players: {
        type: Array,
        required: true
    },
    score: {
        type: Number,
        required: true
    },
    wave: {
        type: Number,
        required: true
    },
    partyId: {
        type: Number,
        required: true
    },
    partyName: {
        type: String,
        required: true
    },
    timeDead: {
        type: Number,
        required: true
    },
    version: {
        type: String,
        required: true
    },
    gameMode: {
        type: String,
        required: false
    },
    serverPopulation: {
        type: Number,
        required: true
    }
});

// Custom sorting function to compare version strings
const compareGameVersions = (a, b) => {
    const versionA = a.split(".").map(Number);
    const versionB = b.split(".").map(Number);

    for (let i = 0; i < Math.max(versionA.length, versionB.length); i++) {
        if (versionA[i] === undefined) return 1;
        if (versionB[i] === undefined) return -1;
        if (versionA[i] < versionB[i]) return 1;
        if (versionA[i] > versionB[i]) return -1;
    }

    return 0;
}

app.get("/leaderboard/data", async (req, res) => {
    const ipAddress = req.headers["cf-connecting-ip"] || req.socket.remoteAddress.substring(7);

    // If the IP address has been banned, deny requests
    if (websiteController.bannedIpAddresses[ipAddress] !== undefined) return res.sendFile(`${__dirname}/private/banned.html`);

    if (mongoose.connection.readyState !== 1) return res.send(JSON.stringify({
        status: "failure"
    }));

    let time = req.query.time;
    let category = req.query.category;
    let gameVersion = req.query.version;
    let requestedGameMode = req.query.gameMode;

    if (!["24h", "7d", "all"].includes(time)) time = "24h";
    if (!["wave", "score"].includes(category)) category = "wave";
    if (!["scarcity", "standard"].includes(requestedGameMode)) requestedGameMode = "standard";

    // Check that the game version exists, if it doesn't, default to the latest
    const gameVersions = [];
    const collections = await mongoose.connection.client.db("zombia").listCollections().toArray();

    collections.forEach(ver => {
        gameVersions.push(ver.name.replace("leaderboard_v", ""));
    })

    gameVersions.sort((a, b) => compareGameVersions(a, b));

    // If the game version does not exist (or is undefined), return all records from the latest versions
    // ex: if current version is 1.1.3, return version 1.1.x (1.1.1, 1.1.2 and 1.1.3)
    if (!gameVersions.includes(gameVersion)) {
        const latestVersion = gameVersions[0];

        // Split the version from, for example, 1.1.1 to 1.1
        const upperVersion = `${latestVersion.split(".")[0]}.${latestVersion.split(".")[1]}`;

        const results = [];
        // Loop through all versions that are in that upper version and return data
        for (let version of gameVersions) {
            if (!version.startsWith(upperVersion)) continue;

            const LeaderboardEntry = mongoose.model("LeaderboardEntry", leaderboardEntrySchema, `leaderboard_v${version}`);

            const currentDate = Date.now();

            let startDate;

            switch (time) {
                case "24h":
                    startDate = currentDate - 86400000;
                    break;
                case "7d":
                    startDate = currentDate - (86400000 * 7);
                    break;
                case "all":
                    startDate = 0;
                    break;
            }

            let query = {
                timeDead: { $gte: startDate }
            };

            if (requestedGameMode == "standard") {
                query.$or = [
                    { gameMode: "standard" },
                    { gameMode: { $exists: false } }
                ];
            } else {
                query.gameMode = requestedGameMode;
            }

            let unfilteredResults = await LeaderboardEntry.find(query)
            .sort({ [category]: -1 })
            .limit(10)
            .exec();

            for (const entry of unfilteredResults) {
                results.push({
                    score: entry.score,
                    wave: entry.wave,
                    version: entry.version,
                    timeAchieved: entry.timeDead,
                    players: entry.players.map(e => grawlix(e.name))
                });
            }
        }

        if (category == "wave") {
            results.sort((a, b) => b.wave - a.wave);
        } else if (category == "score") {
            results.sort((a, b) => b.score - a.score);
        }

        await sleep(750);

        res.send(JSON.stringify(results.slice(0, 10)));
    } else {
        const LeaderboardEntry = mongoose.model("LeaderboardEntry", leaderboardEntrySchema, `leaderboard_v${gameVersion}`);

        const currentDate = Date.now();

        let startDate;

        switch (time) {
            case "24h":
                startDate = currentDate - 86400000;
                break;
            case "7d":
                startDate = currentDate - (86400000 * 7);
                break;
            case "all":
                startDate = 0;
                break;
        }

        let unfilteredResults = await LeaderboardEntry.find({
            timeDead: { $gte: startDate }
        })
        .sort({ [category]: -1 })
        .limit(10)
        .exec();

        let results = [];

        for (const entry of unfilteredResults) {
            results.push({
                score: entry.score,
                wave: entry.wave,
                version: entry.version,
                timeAchieved: entry.timeDead,
                players: entry.players.map(e => grawlix(e.name))
            });
        }

        await sleep(750);

        res.send(JSON.stringify(results));
    }
})

// Handle servers' requests to grab banned ip list
app.get("/gameservers/banlist", (req, res) => {
    const ipAddress = req.headers["cf-connecting-ip"] || req.socket.remoteAddress.substring(7);

    // If the IP address has been banned, deny requests
    if (websiteController.bannedIpAddresses[ipAddress] !== undefined && req.headers.password !== gameServerPassword) return res.sendFile(`${__dirname}/private/banned.html`);

    if (req.headers.password == gameServerPassword) {
        res.sendFile(`${__dirname}/bannedIpAddresses.json`);
    } else {
        res.sendStatus(404);
    }
})

// Handle admin request to unban ip
app.get("/gameservers/unbanip", (req, res) => {
    const ipAddress = req.headers["cf-connecting-ip"] || req.socket.remoteAddress.substring(7);

    // If the IP address has been banned, deny requests
    if (websiteController.bannedIpAddresses[ipAddress] !== undefined && req.headers.password !== gameServerPassword) return res.sendFile(`${__dirname}/private/banned.html`);

    if (req.headers.password !== gameServerPassword) {
        res.sendStatus(404);
        return;
    }

    const requestedIp = req.query.ip;

    if (!requestedIp) {
        res.send("No IP has been provided.");
        return;
    }

    const bannedIpsTemp = JSON.parse(fs.readFileSync("./bannedIpAddresses.json", "utf-8"));

    if (bannedIpsTemp[requestedIp] == undefined) {
        res.send("The provided IP was not banned.");
        return;
    }

    if (bannedIpsTemp[requestedIp] !== undefined) {
        delete bannedIpsTemp[requestedIp];

        fs.writeFileSync("./bannedIpAddresses.json", JSON.stringify(bannedIpsTemp));

        res.send(`${requestedIp} has been unbanned.`);
        websiteController.gameServerComms.sendBannedIpAddressListToAll(bannedIpsTemp);
    }
})

// Handle admin statistics view
app.get("/stats", (req, res) => {
    const ipAddress = req.headers["cf-connecting-ip"] || req.socket.remoteAddress.substring(7);

    // If the IP address has been banned, deny requests
    if (websiteController.bannedIpAddresses[ipAddress] !== undefined) return res.sendFile(`${__dirname}/private/banned.html`);

    if (req.headers.password == gameServerPassword) {
        res.send(websiteController.homepageGenerator.grabStats());
    } else {
        // res.sendStatus(404);
    }
})


app.get("/layouts/*", (req, res) => {
    const ipAddress = req.headers["cf-connecting-ip"] || req.socket.remoteAddress.substring(7);

    // If the IP address has been banned, deny requests
    if (websiteController.bannedIpAddresses[ipAddress] !== undefined) return res.sendFile(`${__dirname}/private/banned.html`);

    const serverId = req.url.split("/")[2];

    if (serverId == undefined || websiteController.gameServerComms.activeServers[serverId] == undefined) return res.sendStatus(404);

    res.send(websiteController.gameServerComms.activeServers[serverId].mapLayout);
});

app.get("/layouts", (req, res) => {
    const ipAddress = req.headers["cf-connecting-ip"] || req.socket.remoteAddress.substring(7);

    // If the IP address has been banned, deny requests
    if (websiteController.bannedIpAddresses[ipAddress] !== undefined) return res.sendFile(`${__dirname}/private/banned.html`);

    res.send(websiteController.homepageGenerator.processedLayoutsHTML);
})

app.get("/", (req, res) => {
    const ipAddress = req.headers["cf-connecting-ip"] || req.socket.remoteAddress.substring(7);

    // If the IP address has been banned, deny requests
    if (websiteController.bannedIpAddresses[ipAddress] !== undefined) return res.sendFile(`${__dirname}/private/banned.html`);

    if (req.headers.password == gameServerPassword) {
        res.send(websiteController.homepageGenerator.processedDevHTML);
    } else {
        res.send(websiteController.homepageGenerator.processedHTML);
    }
})

app.get("/*", (req, res) => {
    const ipAddress = req.headers["cf-connecting-ip"] || req.socket.remoteAddress.substring(7);

    // If the IP address has been banned, deny requests
    if (websiteController.bannedIpAddresses[ipAddress] !== undefined) return res.sendFile(`${__dirname}/private/banned.html`);

    const urlResponse = `${__dirname}/public/${req.url}`;

    if (req.headers.password !== gameServerPassword) {
        if (req.url.includes("devapp.js") ||
            req.url.endsWith(".map"))
                return res.sendStatus(404);
    }

    fs.readFile(urlResponse, (err, data) => {
        if (data == undefined) res.sendStatus(404);
        else res.sendFile(urlResponse);
    })
})

let webhooks = [];
let lastWebhookSent = 0;
const sendDiscordWebhook = (content) => {
    webhooks.push(content);
    updateWebhook();
}

const updateWebhook = () => {
    const currentTime = Date.now();
    if (currentTime - lastWebhookSent < 3000) return setTimeout(updateWebhook, 3000);
    lastWebhookSent = currentTime;

    if (webhooks.length <= 0) return;

    axios.post("https://discord.com/api/webhooks/", {
        content: webhooks[0]
    }).then(() => {
        webhooks.shift();
        // console.log("Discord webhook message sent successfully.");
    }).catch(err => {
        console.error(`Error sending Discord webhook message: ${err}`);
    });
}

module.exports = expressServer;
