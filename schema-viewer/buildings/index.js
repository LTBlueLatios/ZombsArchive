import BuildingSchema from "../../Archive/Schemas/Building.json" with { type: "json" };

import StatDescription from "./StatDescription.json" with { type: "json" };

function formatNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
}

function splitCapitalisation(string) {
    const regex = /(?<!^)(?=[A-Z])/g;
    const splitString = string.replace(regex, " ");
    return splitString.charAt(0).toUpperCase() + splitString.slice(1);
}

function updateCostItem(container, type, value) {
    const costItem = container.querySelector(`.cost-${type} .cost-value`);
    if (costItem) {
        costItem.textContent = formatNumber(value);
    }
}

function addStatItem(container, label, value) {
    const statTemplate = document.getElementById("stat-item-template");
    const statItem = statTemplate.content.cloneNode(true);
    const statElement = statItem.querySelector(".stat-item");

    statItem.querySelector(".stat-label").textContent = label;
    statItem.querySelector(".stat-value").textContent = value;

    if (StatDescription[label]) {
        statElement.setAttribute("data-tooltip", StatDescription[label]);
    }

    container.appendChild(statItem);
}

function updateBuildingStats(building, currentLevel, card) {
    const costsContainer = card.querySelector(".costs-grid");
    const statsContainer = card.querySelector(".stat-grid");

    updateCostItem(costsContainer, "gold", building.GoldCosts[currentLevel]);
    updateCostItem(costsContainer, "wood", building.WoodCosts[currentLevel]);
    updateCostItem(costsContainer, "stone", building.StoneCosts[currentLevel]);

    statsContainer.innerHTML = "";

    addStatItem(
        statsContainer,
        "Health",
        formatNumber(building.Health[currentLevel]),
    );
    addStatItem(
        statsContainer,
        "Health Regen",
        `${building.HealthRegenPerSecond[currentLevel]}/s`,
    );

    if (building.GoldPerSecond) {
        addStatItem(
            statsContainer,
            "Gold/Second",
            building.GoldPerSecond[currentLevel],
        );
    }

    if (building.DamageToZombies) {
        addStatItem(
            statsContainer,
            "Zombie Damage",
            building.DamageToZombies[currentLevel],
        );
        addStatItem(
            statsContainer,
            "Player Damage",
            building.DamageToPlayers[currentLevel],
        );
    }

    if (building.ProjectileAoeRadius) {
        addStatItem(
            statsContainer,
            "AOE Radius",
            building.ProjectileAoeRadius[currentLevel],
        );
    }

    if (building.TowerRadius) {
        addStatItem(
            statsContainer,
            "Range",
            building.TowerRadius[currentLevel],
        );
    }

    if (building.MsBetweenFires) {
        const attacksPerSecond = (
            1000 / building.MsBetweenFires[currentLevel]
        ).toFixed(2);
        addStatItem(statsContainer, "Attack Speed", `${attacksPerSecond}/s`);
    }

    if (building.SlowDuration) {
        addStatItem(
            statsContainer,
            "Slow Duration",
            `${building.SlowDuration[currentLevel]}ms`,
        );
        addStatItem(
            statsContainer,
            "Slow Amount",
            `${(building.SlowAmount[currentLevel] * 100).toFixed(0)}%`,
        );
    }
}

function createLevelButtons(building, card, updateCallback) {
    const levelSelector = card.querySelector(".level-selector");

    building.Health.forEach((_, index) => {
        const levelBtn = document.createElement("button");
        levelBtn.className = `level-btn ${index === 0 ? "active" : ""}`;
        levelBtn.dataset.level = index;
        levelBtn.textContent = index + 1;

        levelBtn.addEventListener("click", () => {
            card.querySelectorAll(".level-btn").forEach((b) =>
                b.classList.remove("active"),
            );
            levelBtn.classList.add("active");
            updateCallback(parseInt(levelBtn.dataset.level));
        });

        levelSelector.appendChild(levelBtn);
    });
}

function createBuildingCard(building) {
    const template = document.getElementById("building-card-template");
    const card = template.content
        .cloneNode(true)
        .querySelector(".building-card");

    let currentLevel = 0;

    card.dataset.building = building.Name;

    card.querySelector(".building-name").textContent = splitCapitalisation(
        building.Name,
    );
    card.querySelector(".building-class").textContent = building.Class;

    const updateStats = (newLevel) => {
        currentLevel = newLevel;
        updateBuildingStats(building, currentLevel, card);
    };

    createLevelButtons(building, card, updateStats);
    updateStats(0);

    return card;
}

function init() {
    const grid = document.getElementById("buildingsGrid");
    BuildingSchema.forEach((building) => {
        const card = createBuildingCard(building);
        grid.appendChild(card);
    });
}

init();
