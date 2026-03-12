let currentOffset = 0;
const limit = 54;
let totalCount = 0;
let isLoading = false;
let currentSearch = "";
let selectedTypes = new Set();
let appliedTypes = []; 

const ALL_TYPES = [
    "normal","fire","water","electric","grass","ice",
    "fighting","poison","ground","flying",
    "psychic","bug","rock","ghost",
    "dragon","dark","steel","fairy"
];

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
function createFilterButton(type) {
    const button = document.createElement("button");
    button.className = `filter-type-btn type-${type}`;
    button.textContent = capitalize(type);

    button.addEventListener("click", () => {
        if (selectedTypes.has(type)) {
            selectedTypes.delete(type);
            button.classList.remove("active");
        } else {
            selectedTypes.add(type);
            button.classList.add("active");
        }
    });

    return button;
};
function renderActiveFilters() {
    const container = document.getElementById("active-filters");
    container.innerHTML = "";

    appliedTypes.forEach(type => {
        const badge = document.createElement("span");
        badge.className = `type-badge type-${type}`;
        badge.textContent = capitalize(type);
        container.appendChild(badge);
    });
};
function renderTypeFilters() {
    const container = document.getElementById("filter-types");
    container.innerHTML = "";

    ALL_TYPES.forEach(type => {
        const button = createFilterButton(type);
        container.appendChild(button);
    });
};
function setupFilterActions() {
    const confirmBtn = document.getElementById("confirm-filters");
    const clearBtn = document.getElementById("clear-filters");

    confirmBtn.addEventListener("click", async () => {
        appliedTypes = Array.from(selectedTypes);
        currentOffset = 0;

        renderActiveFilters();

        pageReload();
    });

    clearBtn.addEventListener("click", () => {
        selectedTypes.clear();
        appliedTypes = [];

        document.querySelectorAll(".filter-type-btn")
            .forEach(btn => btn.classList.remove("active"));
    });
};

async function loadStats(currentSearch = "", currentTypeFilter = []) {  
    try {
        const params = new URLSearchParams();
        params.append("search", currentSearch);

        currentTypeFilter.forEach(type => {
            params.append("type", type);
        });

        const response = await fetch(`/api/pokemon/stats?${params.toString()}`);

        const stats = await response.json();

        if (!stats || !stats.typeCounts) {
            console.error("Invalid stats response:", stats);
            return;
        }

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
    currentTypeFilter = [],
) {
    try {
        const params = new URLSearchParams();
        params.append("limit", limit);
        params.append("offset", offset);
        params.append("search", currentSearch);

        currentTypeFilter.forEach(type => {
            params.append("type", type);
        });

        const response = await fetch(`/api/pokemon?${params.toString()}`);
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
    }
};

searchInput.addEventListener("input", async (e) => {
    currentSearch = e.target.value.trim();
    currentOffset = 0;

    pageReload();
});
document.getElementById("next-page").addEventListener("click", () => {
    if (currentOffset + limit < totalCount) {
        container.innerHTML = "";
        loadPokemonPage(limit, currentOffset + limit, currentSearch, appliedTypes);
    }
});
document.getElementById("prev-page").addEventListener("click", () => {
    if (currentOffset > 0) {
        container.innerHTML = "";
        loadPokemonPage(limit, currentOffset - limit, currentSearch, appliedTypes);
    }
});
filterButton.addEventListener("click", () => {
    filterPanel.style.display =
        filterPanel.style.display === "none" ? "block" : "none";
});

async function pageReload() {
    if (isLoading) return;

    isLoading = true;
    setPaginationDisabled(true);
    loading.style.display = "block";

    document.getElementById("primary-stat").innerHTML = "";
    document.getElementById("stats-container").innerHTML = "";
    container.innerHTML = "";

    await loadStats(currentSearch, appliedTypes);
    await loadPokemonPage(limit, 0, currentSearch, appliedTypes);

    loading.style.display = "none";
    isLoading = false;
    updatePaginationUI();
};
async function initPage() {
    renderTypeFilters();
    setupFilterActions();

    isLoading = true;
    setPaginationDisabled(true);
    loading.style.display = "block";
    
    await loadPokemonPage(limit, 0);
    await loadStats(currentSearch, appliedTypes);

    loading.style.display = "none";
    isLoading = false;
    updatePaginationUI();
};

initPage();