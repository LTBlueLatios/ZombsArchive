import Server from "./Server.js";
import chalk from "chalk";

const KotsumetSession = {
    server: new Server(),
    init() {
        console.log(chalk
            .underline.bgYellowBright.bold.italic("SESSION SAVER ~ By BlueLatios")
        );
    }
};

KotsumetSession.init();