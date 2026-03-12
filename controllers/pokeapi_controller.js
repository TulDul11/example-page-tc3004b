const pokeService = require("../services/pokeapi_service.js");

async function getAll(req, res) {
    try {
        const pokemons = await pokeService.getAllPokemon();

        res.json({
            total: pokemons.length,
            data: pokemons
        });
    } catch (err) {
        res.status(500).json({ error: "Failed to load all Pokémon" });
    }
};

async function getList(req, res) {
    try {
        const limit = parseInt(req.query.limit) || 36;
        const offset = parseInt(req.query.offset) || 0;
        const search = req.query.search || "";
        let types = [];

        if (req.query.type) {
            if (Array.isArray(req.query.type)) {
                types = req.query.type;
            } else {
                types = req.query.type.split(",");
            }
        }

        const result = await pokeService.getPokemon(limit, offset, search, types);

        res.json(result);

    } catch (err) {
        res.status(500).json({ error: "Failed to load Pokémon" });
    }
};

async function getStats(req, res) {
    try {
        const search = req.query.search || "";
        let types = [];

        if (req.query.type) {
            if (Array.isArray(req.query.type)) {
                types = req.query.type;
            } else {
                types = req.query.type.split(",");
            }
        }

        const stats = await pokeService.getPokemonStats(search, types);

        res.json(stats);

    } catch (err) {
        res.status(500).json({ error: "Failed to load stats" });
    }
};

async function getDetail(req, res) {
    try {
        const { id } = req.params;
        const pokemon = await pokeService.getPokemonDetail(id);
        res.json(pokemon);
    } catch (err) {
        res.status(404).json({ error: "Pokemon not found" });
    }
};

module.exports = {
    getAll,
    getList,
    getDetail,
    getStats,
};