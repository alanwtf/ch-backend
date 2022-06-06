const express = require("express");
const Storage = require("./Storage.js");

const { Router } = express;
const productsRouter = Router();
//productsRouter.use(express.json());
//productsRouter.use(express.urlencoded({ extended: false }));

const admin = false;

const storage = new Storage();

const checkAdmin = (req, res, next) => {
    if (admin) next();
    else
        return res.json({
            error: -1,
            descripcion: `Ruta ${req.url} método ${req.method} no autorizada`,
        });
};

productsRouter.get("/:id?", async (req, res) => {
    if (req.params.id) {
        return res.json(await storage.getProductById(req.params.id));
    }
    return res.json(await storage.getProducts());
});

productsRouter.post("/", checkAdmin, async (req, res) => {
    await storage.createProduct(req.body);
    return res.sendStatus(201);
});

productsRouter.put("/:id", checkAdmin, async (req, res) => {
    await storage.updateProduct(req.params.id, req.body);
    return res.sendStatus(204);
});

productsRouter.delete("/:id", checkAdmin, async (req, res) => {
    await storage.deleteProduct(req.params.id);
    return res.sendStatus(204);
});

const cartRouter = Router();
// cartRouter.use(express.json());
//cartRouter.use(express.urlencoded({ extended: false }));

cartRouter.post("/", async (req, res) => {
    const newCartId = await storage.createCart();
    res.json(newCartId);
});

cartRouter.delete("/:id", async (req, res) => {
    await storage.deleteCart(req.params.id);
    return res.sendStatus(204);
});

cartRouter.get("/:id/productos", async (req, res) => {
    const products = await storage.getCartProducts(req.params.id);
    return res.json(products);
});

cartRouter.delete("/:id/productos/:id_prod", async (req, res) => {
    await storage.deleteCartProduct(req.params.id, req.params.id_prod);
    return res.sendStatus(204);
});

cartRouter.post("/:id/productos/", async (req, res) => {
    await storage.addCartProduct(req.params.id, req.body.id);
    return res.sendStatus(204);
});

module.exports = { cartRouter, productsRouter };
