const fs = require("fs");

const USERS_FILE = "./data/users.json";

function getUsers() {
    return JSON.parse(fs.readFileSync(USERS_FILE));
}

function saveUsers(users) {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

function findUser(username) {
    const users = getUsers();
    return users.find(u => u.username === username);
}

function createUser(username, password) {
    const users = getUsers();

    if (users.find(u => u.username === username)) {
        return { error: "Usuario ya existe" };
    }

    users.push({ username, password });
    saveUsers(users);

    return { success: true };
}

module.exports = {
    findUser,
    createUser
};