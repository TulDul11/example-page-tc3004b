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

async function loadAllPokemon() {
    try {
        loading.style.display = "block";
        container.innerHTML = "";

        const response = await fetch("/api/pokemon/all");
        const pokemonList = await response.json();

        if (!Array.isArray(pokemonList)) {
            console.error("Expected an array of Pokémon, got:", pokemonList);
            return;
        }

        const typeCounts = {};
        ALL_TYPES.forEach(type => typeCounts[type] = 0);
        pokemonList.forEach(pokemon => {
            pokemon.types.forEach(t => {
                if (typeCounts[t] !== undefined) typeCounts[t]++;
            });
        });

        createPrimaryStatCard("Total Pokémon", pokemonList.length);
        ALL_TYPES.forEach(type => {
            createStatCard(`Total ${capitalize(type)}`, typeCounts[type], type);
        });

        pokemonList.forEach(pokemon => {
            const card = document.createElement("a");
            card.className = "card";
            card.href = `/project?name=${pokemon.name}`;

            card.innerHTML = `
                <div class="card-inside">
                    <img class="pokemon-image" src="${pokemon.image}" alt="${pokemon.name}">
                    <span class="card-inside-title">${pokemon.name.toUpperCase()}</span>
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
        console.error("Failed to load all Pokémon:", err);
    } finally {
        loading.style.display = "none";
    }
}

loadAllPokemon();


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