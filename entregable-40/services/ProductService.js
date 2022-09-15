const ProductRepository = require("../repositories/ProductRepository");
const logger = require("../utils/logger");

class ProductService {
    constructor() {
        this.repository = new ProductRepository();
    }
    async getAll() {
        const datos = await this.repository.getAll();
        return datos;
    }
    async createProduct(data) {
        return await this.repository.saveProduct(data);
    }
}

module.exports = ProductService;
