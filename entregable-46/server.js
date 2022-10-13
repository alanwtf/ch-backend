const Koa = require("koa");
const IO = require("koa-socket-2");

const koaBody = require("koa-body");
const hbs = require("koa-views-handlebars");
const serve = require("koa-static");
const session = require("koa-session");
const passport = require("koa-passport");
const flash = require("koa-better-flash");

const appRouter = require("./routes/appRouter");
const productRouter = require("./routes/productRouter");
const authRouter = require("./routes/authRouter");

const connectDB = require("./config/db");
const initializePassport = require("./config/passport");

const MessageService = require("./services/MessageService");
const ProductService = require("./services/ProductService");

const logger = require("./utils/logger");
const normalizeMessages = require("./utils/normalizeMessages");

const server = () => {
    const app = new Koa();
    const io = new IO();

    connectDB(process.env.MONGODB_URI);

    initializePassport(passport);

    const messageService = new MessageService();
    const productService = new ProductService();

    app.use(serve("./public"));
    app.use(koaBody());

    app.keys = [process.env.SESSION_SECRET];
    const sessionOpts = {
        maxAge: 10 * 60 * 1000,
        rolling: true,
    };
    app.use(session(sessionOpts, app));

    app.use(
        hbs(`${__dirname}/views`, {
            partialDirs: `${__dirname}/views/partials`,
        })
    );

    app.use(passport.initialize());
    app.use(passport.session());
    app.use(flash());

    app.use(appRouter.routes());
    app.use(authRouter.routes());
    app.use(productRouter.routes());

    app.use((ctx) => {
        logger.info(`Ruta: ${ctx.path} Metodo: ${ctx.method}`);
    });

    io.attach(app);

    const PORT = process.env.PORT || 8080;

    io.on("connection", async (socket) => {
        console.log(`nuevo usuario id: ${socket.id}`);
        const messages = await messageService.getAll();

        socket.on("addProduct", async (data) => {
            const newProduct = await productService.createProduct(data);
            io.broadcast("newProduct", newProduct);
        });

        //chat
        socket.on("login", async (user) => {
            const messages = await messageService.getAll();
            normalizeMessages(messages);
            socket.emit("success", normalizeMessages(messages));
        });

        socket.on("addMessage", async (data) => {
            console.log(data);
            const newMessage = await messageService.createMessage(data);
            io.broadcast("newMessage", newMessage);
        });
    });

    app.listen(PORT, () => console.log(`Servidor escuchando en puerto ${PORT}`));
};

module.exports = server;
