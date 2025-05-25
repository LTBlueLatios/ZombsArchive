import BuildingSchema from "./Archive/Schemas/Building.json" with { type: "json" };

function formatNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
}

function createBuildingCard(building) {
    const card = document.createElement("div");
    card.className = "building-card";

    let currentLevel = 0;

    function updateStats() {
        const costsHtml = `
                    <div class="costs-grid">
                        <div class="cost-item cost-gold">
                            <div class="cost-value">${formatNumber(building.GoldCosts[currentLevel])}</div>
                            <div class="cost-label">Gold</div>
                        </div>
                        <div class="cost-item cost-wood">
                            <div class="cost-value">${formatNumber(building.WoodCosts[currentLevel])}</div>
                            <div class="cost-label">Wood</div>
                        </div>
                        <div class="cost-item cost-stone">
                            <div class="cost-value">${formatNumber(building.StoneCosts[currentLevel])}</div>
                            <div class="cost-label">Stone</div>
                        </div>
                        <div class="cost-item cost-token">
                            <div class="cost-value">${formatNumber(building.TokenCosts[currentLevel])}</div>
                            <div class="cost-label">Token</div>
                        </div>
                    </div>
                `;

        let statsHtml = `
                    <div class="stat-grid">
                        <div class="stat-item">
                            <span class="stat-label">Health</span>
                            <span class="stat-value">${formatNumber(building.Health[currentLevel])}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Health Regen</span>
                            <span class="stat-value">${building.HealthRegenPerSecond[currentLevel]}/s</span>
                        </div>
                `;

        // Add specific stats based on building type
        if (building.GoldPerSecond) {
            statsHtml += `
                        <div class="stat-item">
                            <span class="stat-label">Gold/Second</span>
                            <span class="stat-value">${building.GoldPerSecond[currentLevel]}</span>
                        </div>
                    `;
        }

        if (building.DamageToZombies) {
            statsHtml += `
                        <div class="stat-item">
                            <span class="stat-label">Zombie Damage</span>
                            <span class="stat-value">${building.DamageToZombies[currentLevel]}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Player Damage</span>
                            <span class="stat-value">${building.DamageToPlayers[currentLevel]}</span>
                        </div>
                    `;
        }

        if (building.TowerRadius) {
            statsHtml += `
                        <div class="stat-item">
                            <span class="stat-label">Range</span>
                            <span class="stat-value">${building.TowerRadius[currentLevel]}</span>
                        </div>
                    `;
        }

        if (building.MsBetweenFires) {
            const attacksPerSecond = (
                1000 / building.MsBetweenFires[currentLevel]
            ).toFixed(2);
            statsHtml += `
                        <div class="stat-item">
                            <span class="stat-label">Attack Speed</span>
                            <span class="stat-value">${attacksPerSecond}/s</span>
                        </div>
                    `;
        }

        if (building.SlowDuration) {
            statsHtml += `
                        <div class="stat-item">
                            <span class="stat-label">Slow Duration</span>
                            <span class="stat-value">${building.SlowDuration[currentLevel]}ms</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Slow Amount</span>
                            <span class="stat-value">${(building.SlowAmount[currentLevel] * 100).toFixed(0)}%</span>
                        </div>
                    `;
        }

        statsHtml += "</div>";

        card.querySelector(".stats-content").innerHTML = costsHtml + statsHtml;
    }

    card.innerHTML = `
                <div class="building-header">
                    <div class="building-title">
                        <div class="building-name">${building.Name}</div>
                        <div class="building-class">${building.Class}</div>
                    </div>
                </div>

                <div class="stats-section">
                    <div class="section-title">Level</div>
                    <div class="level-selector">
                        ${building.Health.map(
                            (_, index) =>
                                `<button class="level-btn ${index === 0 ? "active" : ""}" data-level="${index}">
                                ${index + 1}
                            </button>`,
                        ).join("")}
                    </div>
                </div>

                <div class="stats-section">
                    <div class="section-title">Stats & Costs</div>
                    <div class="stats-content"></div>
                </div>
            `;

    // Add event listeners for level buttons
    card.querySelectorAll(".level-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
            card.querySelectorAll(".level-btn").forEach((b) =>
                b.classList.remove("active"),
            );
            btn.classList.add("active");
            currentLevel = parseInt(btn.dataset.level);
            updateStats();
        });
    });

    updateStats();
    return card;
}

function initializeVisualizer() {
    const grid = document.getElementById("buildingsGrid");
    BuildingSchema.forEach((building) => {
        const card = createBuildingCard(building);
        grid.appendChild(card);
    });
}
