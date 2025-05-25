const fs = require("fs");

const config = require("./config.json");
const ExpressServer = require("./expressServer.js");
const homepageGenerator = require("./homepageGenerator.js");
const gameServerComms = require("./gameServerComms.js");
const axios = require("axios");
const { permission } = require("process");

class Website {
  constructor() {
    process.on("SIGINT", async () => {
      console.log("\nShutdown detected. Cleaning up server before shutdown.");
      await this.gameServerComms.onShutdown();
      process.exit(0);
    });

    process.on(
      "uncaughtException",
      (async (err) => {
        const errorMessage = err.stack || err.toString();

        console.log(errorMessage);

        await this.sendDiscordWebhook(
          `Uncaught Exception: \n\`\`\`${errorMessage}\`\`\``,
        );

        process.exit(1);
      }).bind(this),
    );

    this.expressServer = new ExpressServer(this);
    this.homepageGenerator = new homepageGenerator(this);
    this.gameServerComms = new gameServerComms(this);

    this.bannedIpAddresses = {};

    // Repeatedly poll banned ip address list to keep it updated
    const pollBannedIps = () => {
      try {
        this.bannedIpAddresses = JSON.parse(
          fs.readFileSync("./bannedIpAddresses.json", "utf-8"),
        );
      } catch (err) {
        this.bannedIpAddresses = {};
      }

      setTimeout(pollBannedIps, 10000);
    };

    pollBannedIps();
  }

  init() {
    this.homepageGenerator.generateHomepage();
  }

  sendDiscordWebhook(content) {
    return new Promise((res, rej) => {
      axios
        .post(
          "https://discord.com/api/webhooks/",
          {
            content,
          },
        )
        .then(() => {
          res();
          // console.log("Discord webhook message sent successfully.");
        })
        .catch((err) => {
          rej();
          console.error(`Error sending Discord webhook message: ${err}`);
        });
    });
  }
}

const website = new Website();
website.init();
