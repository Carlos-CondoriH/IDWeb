const express = require("express");
const cursoRoutes = require("./routes/cursoRoutes");
const app = express();
app.use("/api/cursos", cursoRoutes);
app.listen(3000, () => console.log("api de cursos en puerto 3000"));