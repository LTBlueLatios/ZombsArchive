import { UiComponent } from "./UiComponent.js";
import { Game } from "../Game.js";

const grawlix = require("grawlix");
const grawlixRacism = require("grawlix-racism");

grawlix.loadPlugin(grawlixRacism);

grawlix.setDefaults({
    randomize: false
});

class UiLeaderboard extends UiComponent {
    constructor() {
        const leaderboardDiv = document.createElement("div");
        leaderboardDiv.id = "hud-leaderboard";
        leaderboardDiv.className = "hud-leaderboard";

        leaderboardDiv.innerHTML = `
        <div class="hud-leaderboard-player is-header">
            <span class="player-rank">Rank</span>
            <span class="player-name">Name</span>
            <span class="player-score">Score</span>
            <span class="player-wave">Wave</span>
        </div>
        <div class=\"hud-leaderboard-players\"></div>
        `;

        document.getElementById("hud-top").appendChild(leaderboardDiv);

        super(leaderboardDiv);

        this.playerElems = [];
        this.playerRankElems = [];
        this.playerNameElems = [];
        this.playerScoreElems = [];
        this.playerWaveElems = [];
        this.playerNames = {};
        this.leaderboardData = [];
        this.playersElem = this.element.querySelector(".hud-leaderboard-players");
    }

    init() {
        Game.eventEmitter.on("UpdateLeaderboardRpcReceived", this.onLeaderboardData.bind(this));
    }

    update() {
        this.playersElem.style.height = `${28 * this.leaderboardData.length}px`;

        setTimeout(() => {
            for (let i = 0; i < this.leaderboardData.length; i++) {
                const player = this.leaderboardData[i];
                this.playerNames[player.uid] ||= player.name;

                if (!(i in this.playerElems)) {
                    this.playerElems[i] = document.createElement("div");
                    this.playerElems[i].className = "hud-leaderboard-player";

                    this.playerRankElems[i] = document.createElement("span");
                    this.playerRankElems[i].className = "player-rank";
                    this.playerRankElems[i].innerHTML = "-";

                    this.playerNameElems[i] = document.createElement("strong");
                    this.playerNameElems[i].className = "player-name";
                    this.playerNameElems[i].innerHTML = "-";

                    this.playerScoreElems[i] = document.createElement("span");
                    this.playerScoreElems[i].className = "player-score";
                    this.playerScoreElems[i].innerHTML = "-";

                    this.playerWaveElems[i] = document.createElement("span");
                    this.playerWaveElems[i].className = "player-wave";
                    this.playerWaveElems[i].innerHTML = "-";

                    this.playerElems[i].appendChild(this.playerRankElems[i]);
                    this.playerElems[i].appendChild(this.playerNameElems[i]);
                    this.playerElems[i].appendChild(this.playerScoreElems[i]);
                    this.playerElems[i].appendChild(this.playerWaveElems[i]);
                    this.playersElem.appendChild(this.playerElems[i]);
                }

                if (Game.renderer.world.localPlayer == player.uid) this.playerElems[i].classList.add("is-active");
                else this.playerElems[i].classList.remove("is-active");

                this.playerElems[i].style.display = "block";
                this.playerRankElems[i].innerText = `#${player.rank}`;
                this.playerNameElems[i].innerText = Game.network.languageFilterEnabled ? grawlix(player.name) : player.name;
                this.playerScoreElems[i].innerText = parseInt(player.score).toLocaleString();
                this.playerWaveElems[i].innerHTML = player.wave === 0 ? "<small>&mdash;</small>" : parseInt(player.wave).toLocaleString();
            }
        }, 100);

        if (this.leaderboardData.length < this.playerElems.length) {
            for (let i = this.leaderboardData.length; i < this.playerElems.length; i++) {
                this.playerElems[i].style.display = "none";
            }
        }
    }

    onLeaderboardData(response) {
        this.leaderboardData = response;
        this.update();
    }
}

export { UiLeaderboard };