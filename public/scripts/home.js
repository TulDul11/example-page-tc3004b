const logoutBtn = document.getElementById("logout-btn");

logoutBtn.addEventListener("click", async () => {
    await fetch("/logout", { method: "POST" });
    window.location.href = "/";
});

const ALL_TYPES = [
    "normal","fire","water","electric","grass","ice",
    "fighting","poison","ground","flying",
    "psychic","bug","rock","ghost",
    "dragon","dark","steel","fairy"
];

function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
}

function createPrimaryStatCard(title, value) {
    const container = document.getElementById("primary-stat");

    const card = document.createElement("div");
    card.classList.add("primary-stat-card");

    card.innerHTML = `
        <p class="primary-title">${title}</p>
        <p class="primary-value">${value}</p>
    `;

    container.appendChild(card);
}

function createStatCard(title, value, type = null) {
    const container = document.getElementById("stats-container");

    const card = document.createElement("div");
    card.classList.add("stat-card");

    card.innerHTML = `
        <p class="stat-title ${type ? `type-text-${type}` : ""}">
            ${title}
        </p>
        <p class="stat-value">${value}</p>
    `;

    container.appendChild(card);
}

const loading = document.getElementById("loading");
const container = document.getElementById("pokemon-container");

async function loadStats() {
    try {
        const response = await fetch("/api/pokemon/stats");
        const stats = await response.json();

        if (!stats || !stats.typeCounts) {
            console.error("Invalid stats response:", stats);
            return;
        }

        document.getElementById("primary-stat").innerHTML = "";
        document.getElementById("stats-container").innerHTML = "";

        createPrimaryStatCard("Total Pokémon", stats.total);

        ALL_TYPES.forEach(type => {
            createStatCard(
                `Total ${capitalize(type)}`,
                stats.typeCounts[type] || 0,
                type
            );
        });

    } catch (err) {
        console.error("Failed to load stats:", err);
    }
}
async function loadPokemonPage(limit = 36, offset = 0) {
    try {
        loading.style.display = "block";
        container.innerHTML = "";

        const response = await fetch(
            `/api/pokemon?limit=${limit}&offset=${offset}`
        );

        const result = await response.json();

        if (!result || !Array.isArray(result.data)) {
            console.error("Invalid pokemon response:", result);
            return;
        }

        result.data.forEach(pokemon => {
            const card = document.createElement("a");
            card.className = "card";
            card.href = `/project?name=${pokemon.name}`;

            card.innerHTML = `
                <div class="card-inside">
                    <img class="pokemon-image" src="${pokemon.image}" alt="${pokemon.name}">
                    <span class="card-inside-title">
                        ${pokemon.id}. ${pokemon.name.toUpperCase()}
                    </span>
                    <div class="pokemon-types">
                        ${pokemon.types.map(type => 
                            `<span class="pokemon-type type-${type}">${type}</span>`
                        ).join("")}
                    </div>
                </div>
            `;

            container.appendChild(card);
        });

    } catch (err) {
        console.error("Failed to load Pokémon:", err);
    } finally {
        loading.style.display = "none";
    }
}

const searchInput = document.getElementById("pokemon-search");

searchInput.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase();

    const cards = document.querySelectorAll(".card");

    cards.forEach(card => {
        const name = card.querySelector(".card-inside-title")
                         .textContent
                         .toLowerCase();

        card.style.display = name.includes(query) ? "flex" : "none";
    });
});

async function initPage() {
    await loadStats();
    await loadPokemonPage(36, 0);
}

initPage();