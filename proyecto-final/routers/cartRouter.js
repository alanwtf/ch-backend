const express = require("express");
const { Router } = express;
const cartRouter = Router();
const cartDaoFiles = require("../daos/cartDaoFiles");

// cartRouter.use(express.json());
//cartRouter.use(express.urlencoded({ extended: true }));

const cartDao = new cartDaoFiles();

cartRouter.post("/", async (req, res) => {
    const newCartId = await cartDao.createItem({});
    res.json(newCartId);
});

cartRouter.delete("/:id", async (req, res) => {
    await cartDao.deleteItem(req.params.id);
    return res.sendStatus(204);
});

cartRouter.get("/:id/productos", async (req, res) => {
    const products = await cartDao.getCartProducts(req.params.id);
    console.log(products);
    return res.json(products);
});

cartRouter.delete("/:id/productos/:id_prod", async (req, res) => {
    await cartDao.deleteCartProduct(req.params.id, req.params.id_prod);
    return res.sendStatus(204);
});

cartRouter.post("/:id/productos/", async (req, res) => {
    await cartDao.addCartProduct(req.params.id, req.body);
    return res.sendStatus(204);
});

module.exports = cartRouter;
