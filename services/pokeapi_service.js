const axios = require("axios");
const path = require("path");

const BASE = "https://pokeapi.co/api/v2";

async function getAllPokemon(limit = 36, offset = 0) {
    try {
        const response = await axios.get(
            `${BASE}/pokemon?limit=${limit}&offset=${offset}`
        );

        const totalCount = response.data.count;
        const basicList = response.data.results;

        const detailed = await Promise.all(
            basicList.map(async (p) => {
                const detail = await axios.get(p.url);

                return {
                    id: detail.data.id,
                    name: detail.data.name,
                    image:
                        detail.data.sprites.other["official-artwork"]
                            .front_default ||
                        detail.data.sprites.front_default,
                    types: detail.data.types.map(t => t.type.name)
                };
            })
        );

        return {
            total: totalCount,
            data: detailed
        };

    } catch (err) {
        console.error("Error fetching Pokémon:", err.message);
        throw new Error("Failed to fetch Pokémon");
    }
}

async function getPokemonStats() {
    try {
        const typesResponse = await axios.get(`${BASE}/type`);
        const types = typesResponse.data.results;

        const typeCounts = {};

        await Promise.all(
            types.map(async (t) => {
                const typeDetail = await axios.get(t.url);
                typeCounts[t.name] = typeDetail.data.pokemon.length;
            })
        );

        const pokemonResponse = await axios.get(`${BASE}/pokemon?limit=1`);
        const total = pokemonResponse.data.count;

        return {
            total,
            typeCounts
        };

    } catch (err) {
        console.error("Failed to fetch stats:", err.message);
        throw new Error("Failed to fetch stats");
    }
}

async function getPokemonDetail(name) {
    const response = await axios.get(`${BASE}/pokemon/${name}`);
    return response.data;
}

module.exports = {
    getAllPokemon,
    getPokemonStats,
    getPokemonDetail,
};