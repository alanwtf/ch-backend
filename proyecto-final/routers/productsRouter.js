const express = require("express");
const { Router } = express;
const productsRouter = Router();
const isAdmin = require("../middlewares/isAdminMiddleware");
const productsDaoFiles = require("../daos/productsDaoFiles");

const productsDao = new productsDaoFiles();

productsRouter.get("/:id?", async (req, res) => {
    if (req.params.id) {
        return res.json(await productsDao.getItemById(req.params.id));
    }
    return res.json(await productsDao.getItems());
});

productsRouter.post("/", isAdmin, async (req, res) => {
    const newId = await productsDao.createItem(req.body);
    return res.json(newId);
});

productsRouter.put("/:id", isAdmin, async (req, res) => {
    await productsDao.updateItem(req.params.id, req.body);
    return res.sendStatus(204);
});

productsRouter.delete("/:id", isAdmin, async (req, res) => {
    await productsDao.deleteItem(req.params.id);
    return res.sendStatus(204);
});

module.exports = productsRouter;
