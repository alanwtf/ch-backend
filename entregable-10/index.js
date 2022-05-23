const express = require("express");
const { engine } = require("express-handlebars");
const res = require("express/lib/response");
const Contenedor = require("./Contenedor");
const app = express();

const container = new Contenedor();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//-------HANDLEBARS-------

// app.engine(
//     "hbs",
//     engine({
//         extname: ".hbs",
//         defaultLayout: `${__dirname}/views/handlebars/index.hbs`,
//         layoutsDir: `${__dirname}/views/handlebars/layouts`,
//         partialsDir: `${__dirname}/views/handlebars/partials`,
//     })
// );
// app.set("views", "./views/handlebars");
// app.set("view engine", "hbs");

//-------PUG-------

//app.set("views", "./views/pug");
//app.set("view engine", "pug");

//-------EJS-------

app.set("views", "./views/ejs");
app.set("view engine", "ejs");

app.get("/", (req, res) => {
    return res.render("layouts/form", { active: { form: true } });
});

app.get("/productos", (req, res) => {
    return res.render("layouts/products", {
        productos: container.getProducts(),
        active: { products: true },
    });
});

app.post("/productos", (req, res) => {
    const newProduct = {
        title: req.body.title,
        price: req.body.price,
        thumbnail: req.body.thumbnail,
    };
    container.addProduct(newProduct);
    return res.redirect("/");
});

const PORT = 8080;

const server = app.listen(PORT, () =>
    console.log(`Server escuchando en puerto ${8080}`)
);

server.on("error", (err) => console.error(`Error en server: ${err}`));
