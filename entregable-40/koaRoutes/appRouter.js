const Router = require("koa-router");

const { isAuthenticated } = require("../middlewares/auth");
const AppService = require("../services/AppService");
const AppController = require("../controllers/AppController");

const appService = new AppService();
const appController = new AppController(appService);

const appRouter = new Router({ prefix: "/home" });

appRouter.get("/", isAuthenticated, appController.home);

//appRouter.get("/info", appController.getInfo.bind(appController));

//appRouter.get("/", isAuthenticated, appController.home);

//appRouter.get("*", appController.notFound);

module.exports = appRouter;
