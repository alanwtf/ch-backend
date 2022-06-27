const cartDaoFiles = require("./CartDaoFiles");
const productsDaoFiles = require("./ProductsDaoFiles");
const productsDaoMemory = require("./ProductsDaoMemory");
const cartDaoMemory = require("./CartDaoMemory");

const getStorage = () => {
    const storage = process.env.STORAGE;
    switch (storage) {
        case "archivo":
            console.log("Entre");
            return {
                products: new productsDaoFiles("products.json"),
                carts: new cartDaoFiles("cats.json"),
            };
        case "memoria":
            return {
                products: new productsDaoMemory(),
                carts: new cartDaoMemory(),
            };
    }
};

module.exports = getStorage;
