const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET || "llave__muy_secreta_cienporciento";

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

module.exports = { authenticate };