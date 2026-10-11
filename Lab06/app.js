const express = require("express");
const cursoRoutes = require("./routes/cursoRoutes");
const app = express();
app.use(express.json());
app.use((req, res, next) => {
    const inicio = Date.now();
    res.on("finish", () => {
        const duracion = Date.now() - inicio;
        console.log(`${req.method} ${req.originalUrl} - ${res.statusCode} - ${duracion}ms`);
    });
    next();
});
app.use("/api/cursos", cursoRoutes);
app.use((err, req, res, next) => {
    console.error("error no controlado:", err.message);
    res.status(500).json({
        status: "error",
        message: "error interno del servidor",
    });
});
app.listen(3000, () => console.log("api de cursos en puerto 3000"));