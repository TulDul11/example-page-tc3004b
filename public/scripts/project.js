const logoutBtn = document.getElementById("logout-btn");
let statChartInstance = null;

function getPokemonIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
};
function formatName(name) {
    return name.replace("-", " ").toUpperCase();
};
function renderStatChart(stats) {

    const ctx = document.getElementById("statChart");

    if (!ctx) return;

    if (statChartInstance) {
        statChartInstance.destroy();
    }

    const labels = stats.map(s => formatName(s.name));
    const values = stats.map(s => s.value);

    statChartInstance = new Chart(ctx, {
        type: "radar",
        data: {
            labels: labels,
            datasets: [{
                data: values,
                fill: true,
                backgroundColor: "rgba(33, 150, 243, 0.2)",
                borderColor: "rgba(33, 150, 243, 1)",
                borderWidth: 2,
                pointBackgroundColor: "rgba(33, 150, 243, 1)",
                pointRadius: 3
            }]
        },
        options: {
            responsive: true,
            scales: {
                r: {
                    beginAtZero: true,
                    suggestedMax: 150,

                    ticks: {
                        display: false
                    },

                    grid: {
                        circular: true,
                        color: "rgba(0,0,0,0.1)"
                    },

                    angleLines: {
                        color: "rgba(0,0,0,0.15)"
                    },

                    pointLabels: {
                        color: "#333",
                        font: {
                            size: 12,
                            weight: "600"
                        }
                    },
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
};
function renderPokemonDetail(pokemon) {
    const container = document.getElementById("pokemon-detail");

    container.innerHTML = `
        <div class="detail-layout">

            <div class="detail-left">
                <img class="detail-image" src="${pokemon.image}" alt="${pokemon.name}">
                
                <h1 class="detail-title">
                    ${pokemon.id}. ${pokemon.name.toUpperCase()}
                </h1>

                <div class="types">
                    ${pokemon.types.map(type =>
                        `<span class="type-badge type-${type}">
                            ${formatName(type)}
                        </span>`
                    ).join("")}
                </div>
            </div>

            <div class="detail-right">

                <div class="stats-section-wrapper">

                    <h2 class="section-title">Base Stats</h2>

                    <div class="stats-chart-wrapper">

                        <div class="stats-section">
                            <ul>
                                ${pokemon.stats.map(stat => 
                                    `<li>
                                        <span class="stat-name">${formatName(stat.name)}</span>
                                        <span class="stat-value">${stat.value}</span>
                                    </li>`
                                ).join("")}
                            </ul>
                        </div>

                        <div class="stat-chart">
                            <canvas id="statChart"></canvas>
                        </div>

                    </div>

                </div>

                <div class="moves-section">

                    <h2 class="section-title">Moves</h2>

                    <div class="moves-container">
                        <table class="moves-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Type</th>
                                    <th>Category</th>
                                    <th>Power</th>
                                    <th>Accuracy</th>
                                    <th>PP</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${pokemon.moves.map(move => `
                                    <tr>
                                        <td>${formatName(move.name)}</td>
                                        <td>
                                            <span class="type-badge type-${move.type}">
                                                ${formatName(move.type)}
                                            </span>
                                        </td>
                                        <td>${formatName(move.damage_class)}</td>
                                        <td>${move.power ?? "-"}</td>
                                        <td>${move.accuracy ?? "-"}</td>
                                        <td>${move.pp ?? "-"}</td>
                                    </tr>
                                `).join("")}
                            </tbody>
                        </table>
                    </div>

                </div>

            </div>
        </div>
    `;

    renderStatChart(pokemon.stats);
};

async function loadPokemonDetail() {
    const id = getPokemonIdFromURL();

    if (!id) {
        console.error("No Pokémon ID provided");
        return;
    }

    try {
        const response = await fetch(`/api/pokemon/detail/${id}`);
        const pokemon = await response.json();

        console.log(pokemon)

        renderPokemonDetail(pokemon);

    } catch (err) {
        console.error("Failed to load Pokémon detail:", err);
    }
};

logoutBtn.addEventListener("click", async () => {
    await fetch("/logout", { method: "POST" });
    window.location.href = "/";
});

async function initPage() {
    await loadPokemonDetail();
};

initPage();