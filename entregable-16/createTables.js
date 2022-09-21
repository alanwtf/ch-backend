const { mysqlConfig, sqliteConfig } = require("./db/mysql");

const knex = require("knex")(sqliteConfig);

// knex.schema
//   .createTable("messages", (table) => {
//     table.increments("id");
//     table.string("message", 60);
//     table.string("email", 30);
//     table.timestamp("created_at").defaultTo(knex.fn.now());
//   })
//   .then(() => {

knex.schema
    .createTable("products", (table) => {
        table.increments("id");
        table.string("product", 60);
        table.integer("price");
        table.string("thumbnail", 60);
    })
    .catch((err) => console.log(err))
    .finally(() => knex.destroy());
