const express = require("express");
const { Server: HttpServer } = require("http");
const { Server: IOServer } = require("socket.io");
const { engine } = require("express-handlebars");
const formatDate = require("./utils/dateFormatter");
const Storage = require("./storage/Storage");
const replace = require("./utils/replaceUsernameOnIndex");

const normalizeMessages = require("./utils/normalizeMessages");
const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);
const createRandomProducts = require("./utils/createRandomProducts");
const session = require("express-session");
const MongoStore = require("connect-mongo");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    session({
        store: MongoStore.create({
            mongoUrl:
                "mongodb+srv://admin:LseuC262dwrqPkY@cluster0.oijib.mongodb.net/?retryWrites=true&w=majority",
            mongoOptions: { useNewUrlparser: true, useUnifiedTopology: true },
            ttl: 600,
        }),
        secret: "123456789",
        resave: false,
        saveUninitialized: true,
    })
);

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

app.get("/login", (req, res) => {
    res.render("partials/login");
});

app.get("/api/productos-test", (req, res) => {
    const randomProducts = createRandomProducts(5);
    return res.render("partials/products-table", {
        productos: randomProducts,
    });
});

app.post("/login", (req, res) => {
    req.session.username = req.body.username;
    res.redirect("/index");
});

app.get("/index", async (req, res) => {
    if (req.session.username) {
        const parsedData = await replace(req.session.username);
        res.send(parsedData);
    } else {
        res.redirect("/logout");
    }
});

app.get("/logout", (req, res) => {
    const username = req.session.username;
    return req.session.destroy((err) => {
        if (!err) {
            return res.render("partials/logout", { username });
        }

        return res.json({ error: err });
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
    socket.on("login", async (user) => {
        users.push({
            user,
            id: socket.id,
        });
        const messages = await Store.getAll();
        normalizeMessages(messages);
        socket.emit("success", normalizeMessages(messages));
    });

    socket.on("addMessage", async (data) => {
        const now = new Date();
        const newMessage = {
            text: data.message,
            author: data.user,
            time: formatDate(now),
        };
        console.log(newMessage);

        await Store.saveMessage(newMessage);
        io.emit("newMessage", newMessage);
    });
});

httpServer.listen(PORT, () =>
    console.log(`Servidor escuchando en puerto ${PORT}`)
);
