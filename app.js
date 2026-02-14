var express = require("express");
const path = require('path');
var app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, 'public/pages/index.html'));
});

app.get("/home", function (req, res) {
  res.sendFile(path.join(__dirname, 'public/pages/home.html'));
});

app.listen(8000, function () {
  console.log("Aplicación ejemplo, escuchando el puerto 8000!");
});