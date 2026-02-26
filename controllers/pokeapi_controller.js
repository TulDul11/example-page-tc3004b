const pokeService = require("../services/pokeapi_service.js");

async function getAll(req, res) {
    try {
        const refresh = req.query.refresh === "true";
        const pokemons = await pokeService.getAllPokemon(refresh);
        res.json(pokemons);
    } catch (err) {
        res.status(500).json({ error: "Failed to load all Pokémon" });
    }
}

async function getDetail(req, res) {
    try {
        const { name } = req.params;

        const pokemon = await pokeService.getPokemonDetail(name);

        res.json({
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
};