const express = require("express");
const router = express.Router();
const controller = require("../controllers/pokeapi_controller.js");

router.get("/", controller.getList);
router.get("/all", controller.getAll);
router.get("/stats", controller.getStats);
router.get("/detail/:id", controller.getDetail);

module.exports = router;