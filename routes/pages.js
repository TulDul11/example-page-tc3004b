const express = require("express");
const path = require("path");
const router = express.Router();

router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/pages/index.html"));
});

router.get("/home", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/pages/home.html"));
});

module.exports = router;