const replace = require("../utils/replaceUsernameOnIndex");
const logger = require("../utils/logger");

class AppController {
    constructor(service) {
        this.service = service;
    }

    async getInfo(ctx) {
        console.log(Object.keys(ctx));
        const data = await this.service.getInfo();
        console.log(data);
        await ctx.render("partials/info", { data: data });
    }

    async home(ctx) {
        const parsedData = await replace(ctx.state.user.email);
        ctx.body = parsedData;
    }
}

module.exports = AppController;
