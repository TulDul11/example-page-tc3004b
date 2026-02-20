const express = require("express");
const path = require("path");
const fs = require("fs");
const router = express.Router();
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

router.use(cookieParser());
const USERS_FILE = "./users.json";
const SECRET = "llave__muy_secreta_cienporciento";

function authenticate(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.redirect("/");
    }

    try {
        jwt.verify(token, SECRET);
        next();
    } catch (err) {
        return res.redirect("/");
    }
}

router.get("/", (req, res) => {
    res.render('pages/index');
});

router.post("/register", (req, res) => {
    const { username, password } = req.body;

    const users = JSON.parse(fs.readFileSync(USERS_FILE));

    if (users.find(u => u.username === username)) {
        return res.status(400).json({ error: "Usuario ya existe" });
    }

    users.push({ username, password });
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));

    const token = jwt.sign(
        { username: username },
        SECRET,
        { expiresIn: "1h" }
    );

    res.cookie("token", token, {
        httpOnly: true
    });

    res.json({ success: true });
});

router.post("/login", (req, res) => {
    const { username, password } = req.body;

    const users = JSON.parse(fs.readFileSync(USERS_FILE));

    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
        return res.status(400).json({ error: "Credenciales invalidas" });
    }

    const token = jwt.sign(
        { username: user.username },
        SECRET,
        { expiresIn: "1h" }
    );

    res.cookie("token", token, {
        httpOnly: true
    });

    res.json({ success: true });
});

router.post("/logout", (req, res) => {
    res.clearCookie("token");
    res.json({ success: true });
});

router.get("/home", authenticate, (req, res) => {
    res.render('pages/home');
});

router.get("/project", authenticate, (req, res) => {
    res.render('pages/project');
});

module.exports = router;