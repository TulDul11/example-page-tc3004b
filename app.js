const express = require("express");
const path = require('path');
const cookieParser = require("cookie-parser");

const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(cookieParser());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


const pagesRoutes = require("./routes/pages");
const pokemonRoutes = require("./routes/pokeapi");

app.use("/", pagesRoutes);
app.use("/api/pokemon", pokemonRoutes);

app.listen(8000, function () {
  console.log("Aplicación ejemplo, escuchando el puerto 8000!");
});