const MemoryContainer = require("../containers/MemoryContainer");

class CartDaoMemory extends MemoryContainer {
    constructor() {
        super();
    }

    deleteCartProduct = (id, prodId) => {
        const cart = this.getItemById(id);
        console.log({ cart });
        const newCartArr = cart.products.filter(
            (prod) => prod.id !== Number(prodId)
        );
        cart.products = [...newCartArr];
        this.updateItem(id, cart);
        return;
    };

    getCartProducts = (id) => {
        const cart = this.getItemById(Number(id));
        return cart.products;
    };

    addCartProduct = (id, prod) => {
        console.log("MEMORY", this.memory);
        const cart = this.getItemById(Number(id));
        cart.products ??= [];
        cart.products.push(prod);
        console.log(cart.products.length);
        this.updateItem(id, cart);
        return;
    };
}

module.exports = CartDaoMemory;
