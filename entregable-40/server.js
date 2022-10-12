const { Server: HttpServer } = require("http");
const { Server: IOServer } = require("socket.io");
const Koa = require("koa");
const koaBody = require("koa-body");
const hbs = require("koa-views-handlebars");
const koaSession = require("koa-session");
const koaPassport = require("koa-passport");
const flash = require("koa-better-flash");
const appRouter = require("./koaRoutes/appRouter");
const productRouter = require("./koaRoutes/productRouter");

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
    const messageService = new MessageService();

    koaApp.use(koaBody());

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

    koaApp.use(appRouter.routes());
    koaApp.use(authRouter.routes());
    koaApp.use(productRouter.routes());

    koaApp.use((ctx) => {
        logger.info(`Ruta: ${ctx.path} Metodo: ${ctx.method}`);
    });

    io.attach(koaApp);

    const PORT = process.env.PORT || 8080;

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
