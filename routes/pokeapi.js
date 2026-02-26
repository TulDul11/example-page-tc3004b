const express = require("express");
const router = express.Router();
const controller = require("../controllers/pokeapi_controller.js");

router.get("/all", controller.getAll);
router.get("/detail/:name", controller.getDetail);

module.exports = router;