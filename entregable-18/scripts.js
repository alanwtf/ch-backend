//use ecommerce

db.createCollection("mensajes");
db.createCollection("productos");
//1)2)
const messages = [
    {
        message:
            "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Velit, illum?",
        email: "test1@test.com",
        time: Date.now(),
    },
    {
        message:
            "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Velit, illum?",
        email: "test2@test.com",
        time: Date.now(),
    },
    {
        message:
            "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Velit, illum?",
        email: "test3@test.com",
        time: Date.now(),
    },
    {
        message:
            "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Velit, illum?",
        email: "test4@test.com",
        time: Date.now(),
    },
    {
        message:
            "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Velit, illum?",
        email: "test5@test.com",
        time: Date.now(),
    },
    {
        message:
            "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Velit, illum?",
        email: "test6@test.com",
        time: Date.now(),
    },
    {
        message:
            "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Velit, illum?",
        email: "test7@test.com",
        time: Date.now(),
    },
    {
        message:
            "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Velit, illum?",
        email: "test8@test.com",
        time: Date.now(),
    },
    {
        message:
            "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Velit, illum?",
        email: "test9@test.com",
        time: Date.now(),
    },
    {
        message:
            "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Velit, illum?",
        email: "test10@test.com",
        time: Date.now(),
    },
];
db.mensajes.insertMany(messages);
const products = [
    {
        title: "Coca Cola",
        price: 200,
        url: "https://jumboargentina.vtexassets.com/arquivos/ids/666704/Coca-cola-Sabor-Original-1-5-Lt-2-245092.jpg?v=637674357676600000",
    },
    {
        title: "Fernet",
        price: 1000,
        url: "https://jumboargentina.vtexassets.com/arquivos/ids/666704/Coca-cola-Sabor-Original-1-5-Lt-2-245092.jpg?v=637674357676600000",
    },
    {
        title: "Cafe",
        price: 800,
        url: "https://jumboargentina.vtexassets.com/arquivos/ids/666704/Coca-cola-Sabor-Original-1-5-Lt-2-245092.jpg?v=637674357676600000",
    },
    {
        title: "Mochila",
        price: 4800,
        url: "https://jumboargentina.vtexassets.com/arquivos/ids/666704/Coca-cola-Sabor-Original-1-5-Lt-2-245092.jpg?v=637674357676600000",
    },
    {
        title: "Silla",
        price: 3200,
        url: "https://jumboargentina.vtexassets.com/arquivos/ids/666704/Coca-cola-Sabor-Original-1-5-Lt-2-245092.jpg?v=637674357676600000",
    },
    {
        title: "Pelota",
        price: 1800,
        url: "https://jumboargentina.vtexassets.com/arquivos/ids/666704/Coca-cola-Sabor-Original-1-5-Lt-2-245092.jpg?v=637674357676600000",
    },
    {
        title: "Campera",
        price: 4400,
        url: "https://jumboargentina.vtexassets.com/arquivos/ids/666704/Coca-cola-Sabor-Original-1-5-Lt-2-245092.jpg?v=637674357676600000",
    },
    {
        title: "Pantuflas",
        price: 1800,
        url: "https://jumboargentina.vtexassets.com/arquivos/ids/666704/Coca-cola-Sabor-Original-1-5-Lt-2-245092.jpg?v=637674357676600000",
    },
    {
        title: "Agua",
        price: 150,
        url: "https://jumboargentina.vtexassets.com/arquivos/ids/666704/Coca-cola-Sabor-Original-1-5-Lt-2-245092.jpg?v=637674357676600000",
    },
    {
        title: "Bon o Bon",
        price: 110,
        url: "https://jumboargentina.vtexassets.com/arquivos/ids/666704/Coca-cola-Sabor-Original-1-5-Lt-2-245092.jpg?v=637674357676600000",
    },
];
db.productos.insertMany(products);
//3)
db.mensajes.find();
db.productos.find();
//4)
db.mensajes.countDocuments();
db.productos.countDocuments();
//5)a)
db.productos.insertOne({
    title: "Yerba Mate",
    price: 700,
    url: "https://jumboargentina.vtexassets.com/arquivos/ids/666704/Coca-cola-Sabor-Original-1-5-Lt-2-245092.jpg?v=637674357676600000",
});
//5)b)i)
db.productos.find({ price: { $lt: 1000 } });
//5)b)ii)
db.productos.find({ price: { $gt: 1000, $lt: 3000 } });
//5)b)iii)
db.productos.find({ price: { $gt: 3000 } });
//5)b)iv)
db.productos.find({}, { title: 1, _id: 0 }).sort({ price: 1 }).skip(2).limit(1);
//5)c)
db.productos.updateMany({}, { $set: { stock: 100 } });
//5)d)
db.productos.updateMany({ stock: { $gt: 4000 } }, { $set: { stock: 0 } });
//5)e)
db.productos.deleteMany({ price: { $lt: 1000 } });
//6)
db.createUser({
    user: "pepe",
    pwd: "asd456",
    roles: [{ role: "read", db: "ecommerce" }],
});
