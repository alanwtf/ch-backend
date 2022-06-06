const express = require("express");
const { productsRouter, cartRouter } = require("./routers.js");

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/productos", productsRouter);
app.use("/api/carrito", cartRouter);
//404
app.use((req, res, next) => {
    return res.json({
        error: -2,
        descripcion: `Ruta ${req.url} método ${req.method} no implementada`,
    });
});

const server = app.listen(PORT, () => {
    console.log(`listening on port: ${PORT}`);
});

server.on("error", (err) => console.log(err));
