const pokeService = require("../services/pokeapi_service.js");

async function getAll(req, res) {
    try {
        const limit = req.query.limit;
        const offset = req.query.offset;
        const pokemons = await pokeService.getAllPokemon(limit, offset);
        res.json(pokemons);
    } catch (err) {
        res.status(500).json({ error: "Failed to load all Pokémon" });
    }
}

async function getStats(req, res) {
    try {
        const stats = await pokeService.getPokemonStats();
        res.json(stats);
    } catch (err) {
        res.status(500).json({ error: "Failed to load stats" });
    }
}

async function getDetail(req, res) {
    try {
        const { name } = req.params;

        const pokemon = await pokeService.getPokemonDetail(name);

        res.json({
            id: pokemon.id,
            name: pokemon.name,
            image: pokemon.sprites.front_default,
            types: pokemon.types.map(t => t.type.name),
            stats: pokemon.stats
        });

    } catch (err) {
        res.status(404).json({ error: "Pokemon not found" });
    }
}

module.exports = {
    getAll,
    getDetail,
    getStats,
};