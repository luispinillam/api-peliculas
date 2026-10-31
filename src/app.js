const express = require("express");
const conexion = require("./config/database");
const generosRoutes = require("./routes/generos.routes.js");
const directoresRoutes = require("./routes/directores.routes.js");
const productorasRoutes = require("./routes/productoras.routes.js");
const tiposRoutes = require("./routes/tipos.routes.js")
const mediaRoutes = require("./routes/media.routes.js")

const app = express();

conexion.getConnection()
    .then(connection => {
        console.log("Conexión a MySQL exitosa");
        connection.release();
    })
    .catch(error => {
        console.error("Error al conectar con MySQL:", error.message);
    });

app.use(express.json());
app.use("/api/generos", generosRoutes);
app.use("/api/directores", directoresRoutes);
app.use("/api/productoras", productorasRoutes);
app.use("/api/tipos", tiposRoutes);
app.use("/api/media", mediaRoutes);

app.get("/", (req, res) => {
    res.json({
        mensaje: "API de películas y series funcionando correctamente"
    });
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});