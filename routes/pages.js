const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth_controller.js");
const pageController = require("../controllers/page_controller.js");
const { authenticate } = require("../middleware/auth_middleware.js");

router.get("/", pageController.index);

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);

router.get("/home", authenticate, pageController.home);
router.get("/project", authenticate, pageController.project);

module.exports = router;