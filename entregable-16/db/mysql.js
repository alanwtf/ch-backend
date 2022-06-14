const mysqlConfig = {
  client: "mysql",
  connection: {
    host: "127.0.0.1",
    port: 3306,
    user: "root",
    password: "",
    database: "entregable16",
  },
};

const sqliteConfig = {
  client: "sqlite3",
  connection: {
    filename: "./mydb.sqlite",
  },
  useNullAsDefault: true,
};

module.exports = { mysqlConfig, sqliteConfig };
