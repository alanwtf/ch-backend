const express = require("express");
const { Server: HttpServer } = require("http");
const { Server: IOServer } = require("socket.io");

const { engine } = require("express-handlebars");

const SqlStorage = require("./storage/SqlStorage");
const SqliteStorage = require("./storage/SqliteStorage");
const { mysqlConfig, sqliteConfig } = require("./db/mysql");
const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = 8080;

app.engine(
  "hbs",
  engine({
    extname: ".hbs",
    defaultLayout: `${__dirname}/views/index.hbs`,
    layoutsDir: `${__dirname}/views/layouts`,
    partialsDir: `${__dirname}/views/partials`,
  })
);

app.use(express.static("./public"));

const SqlStore = new SqlStorage(mysqlConfig, "messages");
const SqliteStore = new SqliteStorage(sqliteConfig, "products");

app.set("views", "./views");
app.set("view engine", "hbs");

const products = [];
const users = [];
const messages = [];

app.get("/products", async (req, res) => {
  const allProducts = await SqliteStore.getAll();
  return res.send(allProducts);
});

io.on("connection", (socket) => {
  console.log(`nuevo usuario id: ${socket.id}`);

  //productos

  socket.on("addProduct", async (data) => {
    const newProduct = await SqliteStore.saveProduct(data);
    console.log(newProduct);
    io.emit("newProduct", newProduct[0]);
  });

  //chat
  socket.on("login", async (email) => {
    users.push({
      email,
      id: socket.id,
    });
    const messages = await SqlStore.getAll();
    socket.emit("success", messages);
  });

  socket.on("addMessage", async (data) => {
    const now = new Date();
    const newMessage = {
      message: data.message,
      email: data.email,
      created_at: now,
    };

    await SqlStore.saveMessage(newMessage);
    io.emit("newMessage", newMessage);
  });
});

httpServer.listen(PORT, () =>
  console.log(`Servidor escuchando en puerto ${PORT}`)
);
