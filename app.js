const express = require("express");
const path = require('path');
const pagesRoutes = require("./routes/pages");

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.use("/", pagesRoutes);

app.listen(8000, function () {
  console.log("Aplicación ejemplo, escuchando el puerto 8000!");
});