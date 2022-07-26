const express = require("express");
const { Server: HttpServer } = require("http");
const { Server: IOServer } = require("socket.io");
const { engine } = require("express-handlebars");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const dotenv = require("dotenv");

const Storage = require("./storage/Storage");

const connectDB = require("./config/db");
const initializePassport = require("./config/passport");

const createRandomProducts = require("./utils/createRandomProducts");
const formatDate = require("./utils/dateFormatter");
const normalizeMessages = require("./utils/normalizeMessages");
const replace = require("./utils/replaceUsernameOnIndex");

const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

const { isAuthenticated, isNotAuthenticated } = require("./middlewares/auth");

dotenv.config();
connectDB(process.env.MONGODB_URI);
initializePassport(passport);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: true,
        saveUninitialized: true,
        rolling: true,
        cookie: {
            maxAge: 1000 * 60 * 10,
        },
    })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(express.static("./public"));

const PORT = process.env.PORT || 8080;

app.engine(
    "hbs",
    engine({
        extname: ".hbs",
        defaultLayout: `${__dirname}/views/index.hbs`,
        layoutsDir: `${__dirname}/views/layouts`,
        partialsDir: `${__dirname}/views/partials`,
    })
);

const Store = new Storage();

app.set("views", "./views");
app.set("view engine", "hbs");

const products = [];
const users = [];

app.get("/products", (_req, res) => {
    return res.send(products);
});

app.get("/login", isNotAuthenticated, (_req, res) => {
    res.render("partials/login");
});

app.post(
    "/login",
    passport.authenticate("login", {
        successRedirect: "/",
        failureRedirect: "/login",
        failureFlash: true,
    })
);

app.get("/register", isNotAuthenticated, (_req, res) => {
    return res.render("partials/register");
});

app.post(
    "/register",
    passport.authenticate("register", {
        successRedirect: "/",
        failureRedirect: "/register",
        failureFlash: true,
    })
);

app.get("/api/productos-test", (_req, res) => {
    const randomProducts = createRandomProducts(5);
    return res.render("partials/products-table", {
        productos: randomProducts,
    });
});

app.get("/", isAuthenticated, async (req, res) => {
    const parsedData = await replace(req.user.email);
    return res.send(parsedData);
});

app.get("/logout", isAuthenticated, (req, res, next) => {
    const email = req.user.email;
    req.logOut((err) => {
        if (err) {
            return next(err);
        }
        return res.render("partials/logout", { email });
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

httpServer.listen(PORT, () => console.log(`Servidor escuchando en puerto ${PORT}`));
