import { UiComponent } from "../UiComponent";

class UiIntroLeaderboard extends UiComponent {
    constructor() {
        super(document.getElementsByClassName("hud-intro-leaderboard")[0]);
        this.leaderboardToggle = document.getElementsByClassName("hud-intro-leaderboard-toggle")[0];
        this.leaderboardWrapper = this.element.querySelector(".hud-intro-leaderboard-wrapper");
        this.categoryElem = this.element.querySelector(".hud-intro-leaderboard-category");
        this.timeElem = this.element.querySelector(".hud-intro-leaderboard-time");
        this.modeElem = this.element.querySelector(".hud-intro-leaderboard-mode");

        this.leaderboardToggle.addEventListener("click", () => {
            this.element.classList.add("visible");
            this.leaderboardToggle.style.display = "none";
        })

        this.element.querySelector(".hud-grid-exit").addEventListener("click", () => {
            this.element.classList.remove("visible");
            this.leaderboardToggle.style.display = "block";
        });

        this.categoryElem.addEventListener("change", this.requestLeaderboard.bind(this));
        this.timeElem.addEventListener("change", this.requestLeaderboard.bind(this));
        this.modeElem.addEventListener("change", this.requestLeaderboard.bind(this));
        this.requestLeaderboard();

        this.element.addEventListener("click", e => {
            if (e.target == this.element) {
                this.element.classList.remove("visible");
                this.leaderboardToggle.style.display = "block";
            }
        })
    }

    requestLeaderboard() {
        this.leaderboardWrapper.innerHTML = "<div class='hud-loading'></div>";
        const request = new XMLHttpRequest();
        request.open("GET", `http://${document.location.hostname}/leaderboard/data?category=${this.categoryElem.value}&time=${this.timeElem.value}&gameMode=${this.modeElem.value}`);

        request.onreadystatechange = () => {
            if (request.readyState !== 4) return;
            const leaderboardData = JSON.parse(request.responseText);

            if (leaderboardData.status == "failure") {
                this.leaderboardWrapper.innerHTML = "<span>We've had an issue querying that request.</span>";
                return;
            }

            if (leaderboardData.length == 0) {
                this.leaderboardWrapper.innerHTML = "<span>We couldn't find any entries with that query.</span>";
                return;
            }

            this.leaderboardWrapper.innerHTML = "<div class='hud-intro-leaderboard-results'></div>";

            const formatter = new Intl.ListFormat("en", { style: "long", type: "conjunction" });

            for (let i = 0; i < leaderboardData.length; i++) {
                const entry = leaderboardData[i];

                let elem = document.createElement("div");
                elem.className = "hud-intro-leaderboard-result";

                if (this.categoryElem.value == "wave") {
                    elem.innerHTML += `<strong class="hud-intro-leaderboard-rank">${i + 1}</strong><text id="player-${i}"></text><strong class="hud-intro-leaderboard-score">${entry.wave.toLocaleString()} Waves</strong>`;
                } else if (this.categoryElem.value == "score") {
                    elem.innerHTML += `<strong class="hud-intro-leaderboard-rank">${i + 1}</strong><text id="player-${i}"></text><strong class="hud-intro-leaderboard-score">${entry.score.toLocaleString()} Score</strong>`;
                }

                elem.querySelector(`#player-${i}`).appendChild(document.createTextNode(formatter.format(entry.players)));

                this.leaderboardWrapper.querySelector(".hud-intro-leaderboard-results").appendChild(elem);
            }
        }

        request.send();
    }
}

export { UiIntroLeaderboard };