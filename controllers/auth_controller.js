const userService = require("../services/user_service.js");
const authService = require("../services/auth_service.js");

exports.register = (req, res) => {
    const { username, password } = req.body;

    const result = userService.createUser(username, password);

    if (result.error) {
        return res.status(400).json({ error: result.error });
    }

    const token = authService.generateToken(username);

    res.cookie("token", token, { httpOnly: true });

    res.json({ success: true });
};

exports.login = (req, res) => {
    const { username, password } = req.body;

    const user = userService.findUser(username);

    if (!user || user.password !== password) {
        return res.status(400).json({ error: "Credenciales invalidas" });
    }

    const token = authService.generateToken(user.username);

    res.cookie("token", token, { httpOnly: true });

    res.json({ success: true });
};

exports.logout = (req, res) => {
    res.clearCookie("token");
    res.json({ success: true });
};