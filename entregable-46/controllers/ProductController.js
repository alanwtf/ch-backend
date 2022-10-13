const logger = require("../utils/logger");
const replace = require("../utils/replaceUsernameOnIndex");
const createRandomProducts = require("../utils/createRandomProducts");

class ProductController {
    constructor(service) {
        this.service = service;
    }

    async get(ctx) {
        let datos;
        console.log(ctx.params.id);
        if (ctx.params.id) datos = await this.service.getOne(ctx.params.id);
        else datos = await this.service.getAll();
        if (datos) {
            ctx.body = datos;
            console.log(datos);
        } else {
            ctx.throw(404);
        }
    }

    async createProduct(ctx) {
        const product = await this.service.createProduct(ctx.request.body);
        ctx.status = 201;
        ctx.body = product;
    }

    async updateProduct(ctx) {
        const prod = await this.service.updateProduct(ctx.params.id, ctx.request.body);
        ctx.status = 201;
        ctx.body = prod;
    }
    async deleteProduct(ctx) {
        console.log({ id: ctx.params.id });

        const isDeleted = await this.service.deleteProduct(ctx.params.id);
        if (isDeleted) {
            ctx.status = 204;
            ctx.body = "no content";
        } else {
            ctx.status = 404;
            ctx.body = "not found";
        }
    }
}

module.exports = ProductController;
