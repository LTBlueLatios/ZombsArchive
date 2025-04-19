(require("dotenv")).config();
const fs = require("fs");
const axios = require("axios");
const config = require("./config.json");

let websiteController;

String.prototype.insertText = function(idx, rem, str) {
    return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
};

// Generating spritesheet
// Collect all svg files and combine them into a single file
let spritesheetSvg = "<svg xmlns='http://www.w3.org/2000/svg'>";
{
    let log = "Scanning directory to find textures...";
    let textureCount = 0;

    const scan = (url) => {
        const data = fs.readdirSync(url);

        for (let data2 of data) {
            // If the data does not have a dot, it's a directory, so scan it
            if (!data2.includes(".")) {
                scan(`${url}/${data2}`);
            }

            if (url.includes("Ui") && !url.includes("Ui/Buildings")) continue;

            if (data2.endsWith(".svg")) {
                let fileContent = fs.readFileSync(`${url}/${data2}`, "utf8");
                fileContent = fileContent.replace("<svg ", `<svg id="${url.replace("./private/asset/images/", "")}/${data2}" `);
                spritesheetSvg += fileContent;

                textureCount++;
            }
        }
    }
    scan("./private/asset/images");

    spritesheetSvg += "</svg>";

    log += `\nTextures compiled. Found ${textureCount} textures.`;
    console.log(log);
    // console.log(spritesheetSvg);
}

class homepageGenerator {
    constructor(websiteControllerProp) {
        websiteController = websiteControllerProp;
        // pageHTML is an exact copy of the website's HTML file
        // processedHTML is the website's HTML file with the servers inserted
        // processedDevHTML is processedHTML with app.js replaced with devapp.js
        this.pageHTML = undefined;
        this.layoutsHTML = undefined;
        this.processedHTML = undefined;
        this.processedDevHTML = undefined;
        this.processedLayoutsHTML = undefined;

        // Grab current index.html
        fs.readFile("./private/index.html", "utf-8", (err, html) => {
            if (err) throw err;
            this.pageHTML = html;
        });

        // Grab current layouts.html
        fs.readFile("./private/layouts.html", "utf-8", (err, html) => {
            if (err) throw err;
            this.layoutsHTML = html;
        });
    }

    generateHomepage()  {
        if (this.pageHTML == undefined) return setTimeout(this.generateHomepage.bind(this), 1000);

        let html = this.pageHTML;

        let indexToInsertServers;
        const gameServers = websiteController.gameServerComms.generatePublicServersArray();
        const randomYouTuber = config.featuredYouTubers[Math.floor(Math.random() * config.featuredYouTubers.length)];
    
        indexToInsertServers = html.indexOf(`</body>`) + `</body>`.length;
        html = html.insertText(indexToInsertServers, 0,
            `<script>window.featuredYouTuber = { videoLink: "${randomYouTuber.videoLink}", channelName: "${randomYouTuber.channelName}" };window.servers='${JSON.stringify(gameServers)}';window.spritesheet=\`${spritesheetSvg}\`;</script>`);

        this.processedHTML = html;
    
        this.processedDevHTML = html.replace("app.js", "devapp.js");

        let layoutsHtml = this.layoutsHTML;

        indexToInsertServers = layoutsHtml.indexOf(`</body>`) + `</body>`.length;
        layoutsHtml = layoutsHtml.insertText(indexToInsertServers, 0,
            `<script>window.servers='${JSON.stringify(gameServers)}';</script>`);

        this.processedLayoutsHTML = layoutsHtml;

        setTimeout(this.generateHomepage.bind(this), 5000);
    }

    grabStats() {
        const activeServers = websiteController.gameServerComms.activeServers;
        const prunedServers = {};

        const stats = {
            totalPopulation: 0,
            countryPopulations: {},
            activeServers: prunedServers
        };
    
        for (let id in activeServers) {
            prunedServers[id] = {
                id,
                debuggingInfo: activeServers[id].debuggingInfo,
                serverInfo: activeServers[id].serverInfo,
                ipAddress: activeServers[id].ipAddress
            }

            const server = activeServers[id];

            stats.countryPopulations[server.serverInfo.country] ||= 0;
            stats.countryPopulations[server.serverInfo.country] += server.debuggingInfo?.population;
            stats.totalPopulation += server.debuggingInfo?.population;
        }
    
        return `<pre>${JSON.stringify(stats, null, 2)}</pre>`;
    }
}

module.exports = homepageGenerator;