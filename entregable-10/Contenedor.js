class Contenedor {
    constructor() {
        this.products = [];
    }

    getProducts = () => {
        return this.products;
    };

    getProductById = (id) => {
        return this.products.find((el) => Number(id) === el.id);
    };

    addProduct = (product) => {
        const newProduct = product;
        newProduct.id = this.products.length > 0 ? this.products.length + 1 : 1;
        this.products.push(newProduct);
        return newProduct;
    };

    updateProduct = (id, newProduct) => {
        const index = this.products.findIndex((el) => el.id === Number(id));
        if (index < 0) return undefined;
        newProduct.id = this.products[index].id;
        this.products[index] = newProduct;
        return 1;
    };

    deleteProduct = (id) => {
        if (!this.getProductById(id)) return undefined;
        const newArr = this.products.filter((el) => el.id !== Number(id));
        this.products = newArr;
        return 1;
    };
}

module.exports = Contenedor;
