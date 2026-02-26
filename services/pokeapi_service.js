const axios = require("axios");
const path = require("path");
const fs = require("fs");

const BASE = "https://pokeapi.co/api/v2";

const CACHE_PATH = path.join(__dirname, "../cache/all_pokemon.json");

async function fetchAndCacheAllPokemon() {
    console.log("Fetching all Pokémon from API...");

    try {
        const response = await axios.get(`${BASE}/pokemon?limit=2000`);
        const allBasic = response.data.results;

        const detailed = await Promise.all(
            allBasic.map(async (p) => {
                const detail = await axios.get(p.url);
                return {
                    name: detail.data.name,
                    image: detail.data.sprites.other["official-artwork"].front_default 
                           || detail.data.sprites.front_default,
                    types: detail.data.types.map(t => t.type.name)
                };
            })
        );

        fs.writeFileSync(CACHE_PATH, JSON.stringify(detailed, null, 2), "utf-8");
        console.log("All Pokémon cached locally.");
        return detailed;

    } catch (err) {
        console.error("Error fetching from PokeAPI:", err.message);
        throw new Error("Failed to fetch Pokémon from API");
    }
}

async function getAllPokemon(forceRefresh = false) {
    try {
        if (!forceRefresh && fs.existsSync(CACHE_PATH)) {
            const data = fs.readFileSync(CACHE_PATH, "utf-8");
            const parsed = JSON.parse(data);
            if (Array.isArray(parsed) && parsed.length > 0) {
                console.log("Loaded Pokémon from cache.");
                return parsed;
            }
            console.log("Cache empty or invalid. Rebuilding...");
        }

        return await fetchAndCacheAllPokemon();

    } catch (err) {
        console.error("Failed to load cache:", err.message);
        return await fetchAndCacheAllPokemon();
    }
}

async function getPokemonDetail(name) {
    const response = await axios.get(`${BASE}/pokemon/${name}`);
    return response.data;
}

module.exports = {
    getAllPokemon,
    getPokemonDetail,
};