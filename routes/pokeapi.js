const express = require("express");
const router = express.Router();
const controller = require("../controllers/pokeapi_controller.js");

router.get("/", controller.getAll);
router.get("/stats", controller.getStats);
router.get("/detail/:name", controller.getDetail);

module.exports = router;