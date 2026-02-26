const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET || "llave__muy_secreta_cienporciento";

function generateToken(username) {
    return jwt.sign(
        { username },
        SECRET,
        { expiresIn: "1h" }
    );
}

module.exports = { generateToken };