const axios = require("axios");
const path = require("path");

const BASE = "https://pokeapi.co/api/v2";
const ALL_TYPES = [
    "normal","fire","water","electric","grass","ice",
    "fighting","poison","ground","flying",
    "psychic","bug","rock","ghost",
    "dragon","dark","steel","fairy"
];


async function getAllPokemon(limit = 36, offset = 0, search = "", type = "") {
    try {
        const response = await axios.get(`${BASE}/pokemon?limit=2000`);
        let allBasic = response.data.results;

        if (search) {
            const searchLower = search.toLowerCase();

            if (!isNaN(search)) {
                const idSearch = parseInt(search);

                allBasic = allBasic.filter(p => {
                    const urlParts = p.url.split("/").filter(Boolean);
                    const id = parseInt(urlParts[urlParts.length - 1]);
                    return id === idSearch;
                });

            } else {
                allBasic = allBasic.filter(p =>
                    p.name.includes(searchLower)
                );
            }
        }

        if (type) {
            allBasic = await Promise.all(
                allBasic.map(async (p) => {
                    const detail = await axios.get(p.url);
                    const hasType = detail.data.types.some(
                        t => t.type.name === type
                    );
                    return hasType ? p : null;
                })
            );

            allBasic = allBasic.filter(Boolean);
        }

        const total = allBasic.length;

        const typeCounts = {};
        ALL_TYPES.forEach(t => typeCounts[t] = 0);

        const paginated = allBasic.slice(offset, offset + limit);

        const detailed = await Promise.all(
            paginated.map(async (p) => {
                const detail = await axios.get(p.url);

                return {
                    id: detail.data.id,
                    name: detail.data.name,
                    image:
                        detail.data.sprites.other["official-artwork"].front_default ||
                        detail.data.sprites.front_default,
                    types: detail.data.types.map(t => t.type.name)
                };
            })
        );

        return { total, data: detailed };

    } catch (err) {
        console.error("Service error:", err.message);
        throw new Error("Failed to fetch Pokémon");
    }
};

async function getPokemonStats(search = "", type = "") {
    try {
        const response = await axios.get(`${BASE}/pokemon?limit=2000`);
        let allBasic = response.data.results;

        if (search) {
            const searchLower = search.toLowerCase();

            if (!isNaN(search)) {
                const idSearch = parseInt(search);

                allBasic = allBasic.filter(p => {
                    const urlParts = p.url.split("/").filter(Boolean);
                    const id = parseInt(urlParts[urlParts.length - 1]);
                    return id === idSearch;
                });

            } else {
                allBasic = allBasic.filter(p =>
                    p.name.includes(searchLower)
                );
            }
        };

        if (type) {
            allBasic = await Promise.all(
                allBasic.map(async (p) => {
                    const detail = await axios.get(p.url);
                    const hasType = detail.data.types.some(
                        t => t.type.name === type
                    );
                    return hasType ? p : null;
                })
            );

            allBasic = allBasic.filter(Boolean);
        };

        const total = allBasic.length;

        const typeCounts = {};
        ALL_TYPES.forEach(t => typeCounts[t] = 0);

        await Promise.all(
            allBasic.map(async (p) => {
                const detail = await axios.get(p.url);

                detail.data.types.forEach(t => {
                    const typeName = t.type.name;
                    if (typeCounts[typeName] !== undefined) {
                        typeCounts[typeName]++;
                    }
                });
            })
        );

        return {
            total,
            typeCounts
        };

    } catch (err) {
        console.error("Failed to fetch stats:", err.message);
        throw new Error("Failed to fetch stats");
    }
};

async function getPokemonDetail(id) {
    try {
        const response = await axios.get(`${BASE}/pokemon/${id}`);
        const pokemon = response.data;

        console.log(`Fetching ${pokemon.moves.length} moves...`);

        const moveDetails = await Promise.all(
            pokemon.moves.map(async (m) => {
                const moveRes = await axios.get(m.move.url);
                const move = moveRes.data;

                return {
                    name: move.name,
                    type: move.type.name,
                    power: move.power,
                    accuracy: move.accuracy,
                    pp: move.pp,
                    damage_class: move.damage_class.name
                };
            })
        );

        return {
            id: pokemon.id,
            name: pokemon.name,
            image:
                pokemon.sprites.other["official-artwork"].front_default ||
                pokemon.sprites.front_default,
            types: pokemon.types.map(t => t.type.name),
            stats: pokemon.stats.map(s => ({
                name: s.stat.name,
                value: s.base_stat
            })),
            moves: moveDetails
        };

    } catch (err) {
        console.error("Service detail error:", err.message);
        throw new Error("Failed to fetch Pokémon detail");
    }
};

module.exports = {
    getAllPokemon,
    getPokemonStats,
    getPokemonDetail,
};