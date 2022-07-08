const express = require("express");
const { Server: HttpServer } = require("http");
const { Server: IOServer } = require("socket.io");
const { engine } = require("express-handlebars");
const formatDate = require("./helpers/dateFormatter");
const Storage = require("./helpers/Storage");
const { faker } = require("@faker-js/faker");
const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = 8080;

app.engine(
    "hbs",
    engine({
        extname: ".hbs",
        defaultLayout: `${__dirname}/views/index.hbs`,
        layoutsDir: `${__dirname}/views/layouts`,
        partialsDir: `${__dirname}/views/partials`,
    })
);

app.use(express.static("./public"));

const Store = new Storage();

app.set("views", "./views");
app.set("view engine", "hbs");

const products = [];
const users = [];
const messages = [];

app.get("/products", (req, res) => {
    return res.send(products);
});

const createRandomProducts = (n) => {
    let products = [];
    for (let i = 0; i < n; i++) {
        products.push({
            id: i + 1,
            title: faker.commerce.product(),
            price: faker.commerce.price(),
            thumbnail: faker.image.animals(640, 480, true),
        });
    }
    return products;
};

app.get("/api/productos-test", (req, res) => {
    const randomProducts = createRandomProducts(5);
    console.log(faker.commerce.product());
    return res.render("index", {
        productos: randomProducts,
    });
});

io.on("connection", (socket) => {
    console.log(`nuevo usuario id: ${socket.id}`);

    //productos

    socket.on("addProduct", (data) => {
        const newProduct = { ...data, id: products.length + 1 };
        products.push(newProduct);
        io.emit("newProduct", newProduct);
    });

    //chat
    socket.on("login", async (email) => {
        users.push({
            email,
            id: socket.id,
        });
        const messages = await Store.getAll();
        socket.emit("success", messages);
    });

    socket.on("addMessage", async (data) => {
        const now = new Date();
        const newMessage = {
            message: data.message,
            email: data.email,
            time: formatDate(now),
        };

        await Store.saveMessage(newMessage);
        io.emit("newMessage", newMessage);
    });
});

httpServer.listen(PORT, () =>
    console.log(`Servidor escuchando en puerto ${PORT}`)
);