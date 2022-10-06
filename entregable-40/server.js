const { Server: HttpServer } = require("http");
const { Server: IOServer } = require("socket.io");
const Koa = require("koa");
const KoaBody = require("koa-body");
const hbs = require("koa-views-handlebars");
const koaSession = require("koa-session");
const koaPassport = require("koa-passport");
const flash = require("koa-flash");
const koaAppRouter = require("./koaRoutes/appRouter");
const connectDB = require("./config/db");
const serve = require("koa-static");
const initializePassport = require("./config/passport");
const compression = require("compression");
const IO = require("koa-socket-2");
const authRouter = require("./koaRoutes/authRouter");
//const randomRouter = require("./routes/randomRouter");

const MessageService = require("./services/MessageService");
const ProductService = require("./services/ProductService");

const logger = require("./utils/logger");
const normalizeMessages = require("./utils/normalizeMessages");

const server = () => {
    const koaApp = new Koa();
    const io = new IO();

    connectDB(process.env.MONGODB_URI);

    initializePassport(koaPassport);

    // const productService = new ProductService();
    // const messageService = new MessageService();

    koaApp.use(KoaBody());

    koaApp.keys = [process.env.SESSION_SECRET];
    const koaSessionConfig = {
        maxAge: 10 * 60 * 1000,
        rolling: true,
    };
    koaApp.use(koaSession(koaSessionConfig, koaApp));

    koaApp.use(
        hbs(`${__dirname}/views`, {
            partialDirs: `${__dirname}/views/partials`,
        })
    );

    koaApp.use(koaPassport.initialize());
    koaApp.use(koaPassport.session());
    koaApp.use(flash());
    koaApp.use(serve("./public"));

    koaApp.use(koaAppRouter.routes());
    koaApp.use(authRouter.routes());

    koaApp.use((ctx, next) => {
        logger.info(`Ruta: ${ctx.path} Metodo: ${ctx.method}`);
        return next();
    });

    io.attach(koaApp);
    const PORT = process.env.PORT || 8080;

    // app.engine(
    //     "hbs",
    //     engine({
    //         extname: ".hbs",
    //         defaultLayout: `${__dirname}/views/index.hbs`,
    //         layoutsDir: `${__dirname}/views/layouts`,
    //         partialsDir: `${__dirname}/views/partials`,
    //     })
    // );

    // app.set("views", "./views");
    // app.set("view engine", "hbs");

    // app.get("*", (req, res) => {
    //     logger.warn(`Ruta: ${req.path} Metodo: ${req.method}`);
    //     return res.status(404).json({ message: "page not found" });
    // });

    io.on("connection", async (socket) => {
        console.log(`nuevo usuario id: ${socket.id}`);
        const messages = await messageService.getAll();

        socket.emit("success", normalizeMessages(messages));
        socket.on("addProduct", async (data) => {
            const newProduct = await productService.createProduct(data);
            io.emit("newProduct", newProduct);
        });

        //chat
        // socket.on("login", async (user) => {
        //     const messages = await messageService.getAll();
        //     normalizeMessages(messages);
        //     socket.emit("success", normalizeMessages(messages));
        //});

        // socket.on("addMessage", async (data) => {
        //     const newMessage = await messageService.createMessage(data);
        //     io.emit("newMessage", newMessage);
        // });
    });

    koaApp.listen(PORT, () => console.log(`Servidor escuchando en puerto ${PORT}`));
};

module.exports = server;
