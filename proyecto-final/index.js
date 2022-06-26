const express = require("express");
const app = express();

const productsRouter = require("./routers/productsRouter");
const cartRouter = require("./routers/cartRouter");

const error404Middleware = require("./middlewares/error404Middleware");
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/productos", productsRouter);
app.use("/api/carrito", cartRouter);

//404
app.use(error404Middleware);

const server = app.listen(PORT, () => {
    console.log(`listening on port: ${PORT}`);
});

server.on("error", (err) => console.log(err));
