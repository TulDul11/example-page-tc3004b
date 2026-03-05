let currentOffset = 0;
const limit = 54;
let totalCount = 0;
let isLoading = false;
let currentSearch = "";
let currentTypeFilter = "";

const ALL_TYPES = [
    "normal","fire","water","electric","grass","ice",
    "fighting","poison","ground","flying",
    "psychic","bug","rock","ghost",
    "dragon","dark","steel","fairy"
];

const logoutBtn = document.getElementById("logout-btn");
const loading = document.getElementById("loading");
const container = document.getElementById("pokemon-container");
const searchInput = document.getElementById("pokemon-search");
const filterButton = document.getElementById("filter-button");
const filterPanel = document.getElementById("filter-panel");

function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
};
function createPrimaryStatCard(title, value) {
    const container = document.getElementById("primary-stat");

    const card = document.createElement("div");
    card.classList.add("primary-stat-card");

    card.innerHTML = `
        <p class="primary-title">${title}</p>
        <p class="primary-value">${value}</p>
    `;

    container.appendChild(card);
};
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
};
function updatePaginationUI() {
    const start = currentOffset + 1;
    const end = Math.min(currentOffset + limit, totalCount);

    document.getElementById("pagination-info").textContent =
        `${start}–${end} of ${totalCount}`;

    document.getElementById("prev-page").disabled =
        isLoading || currentOffset === 0;

    document.getElementById("next-page").disabled =
        isLoading || currentOffset + limit >= totalCount;
};
function setPaginationDisabled(disabled) {
    document.getElementById("prev-page").disabled = disabled;
    document.getElementById("next-page").disabled = disabled;
};
function renderTypeFilters() {
    const container = document.getElementById("filter-types");
    container.innerHTML = "";

    ALL_TYPES.forEach(type => {
        const btn = document.createElement("button");
        btn.className = `filter-type-btn type-${type}`;
        btn.textContent = capitalize(type);

        btn.addEventListener("click", () => {
            currentTypeFilter = type;
            currentOffset = 0;

            loadPokemonPage(limit, 0, currentSearch, currentTypeFilter);
        });

        container.appendChild(btn);
    });

    const clearBtn = document.createElement("button");
    clearBtn.textContent = "Clear Filter";
    clearBtn.className = "filter-clear-btn";

    clearBtn.addEventListener("click", () => {
        currentTypeFilter = "";
        currentOffset = 0;

        loadPokemonPage(limit, 0, currentSearch, "");
    });

    container.appendChild(clearBtn);
};

async function loadStats(currentSearch = "", currentTypeFilter = "") {
    try {
        const response = await fetch(
            `/api/pokemon/stats?search=${encodeURIComponent(currentSearch)}&type=${encodeURIComponent(currentTypeFilter)}`
        );

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
};
async function loadPokemonPage(
    limit = 54,
    offset = 0,
    currentSearch = "",
    currentTypeFilter = ""
) {
    if (isLoading) return;
    try {
        isLoading = true;
        setPaginationDisabled(true);
        loading.style.display = "block";
        container.innerHTML = "";

        await loadStats(currentSearch, currentTypeFilter);

        const response = await fetch(
            `/api/pokemon?limit=${limit}&offset=${offset}&search=${currentSearch}&type=${currentTypeFilter}`
        );
        const result = await response.json();

        if (!result || !Array.isArray(result.data)) {
            console.error("Invalid pokemon response:", result);
            return;
        }

        totalCount = result.total;
        currentOffset = offset;

        result.data.forEach(pokemon => {
            const card = document.createElement("a");
            card.className = "card";
            card.href = `/project?id=${pokemon.id}`;

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

        updatePaginationUI();

    } catch (err) {
        console.error("Failed to load Pokémon:", err);
    } finally {
        loading.style.display = "none";
        isLoading = false;
        updatePaginationUI();
    }
};

logoutBtn.addEventListener("click", async () => {
    await fetch("/logout", { method: "POST" });
    window.location.href = "/";
});
searchInput.addEventListener("input", async (e) => {
    currentSearch = e.target.value.trim();
    currentOffset = 0;

    loadPokemonPage(limit, 0, currentSearch, currentTypeFilter);
});
document.getElementById("next-page").addEventListener("click", () => {
    if (currentOffset + limit < totalCount) {
        loadPokemonPage(limit, currentOffset + limit, currentSearch, currentTypeFilter);
    }
});
document.getElementById("prev-page").addEventListener("click", () => {
    if (currentOffset > 0) {
        loadPokemonPage(limit, currentOffset - limit, currentSearch, currentTypeFilter);
    }
});
filterButton.addEventListener("click", () => {
    filterPanel.style.display =
        filterPanel.style.display === "none" ? "block" : "none";
});

async function initPage() {
    await loadPokemonPage(limit, 0);
    renderTypeFilters();
};

initPage();