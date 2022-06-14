let knex;

class SqlStorage {
  constructor(config, table) {
    this.table = table;
    knex = require("knex")(config);
  }

  async saveMessage(message) {
    try {
      return await knex(this.table).insert({
        message: message.message,
        email: message.email,
        created_at: message.created_at,
      });
    } catch (err) {
      console.log(err);
    } finally {
      //knex.destroy();
    }
  }

  async getAll() {
    try {
      const allMessages = await knex.from(this.table).select("*");
      return allMessages;
    } catch (err) {
      console.log(err);
    } finally {
      //knex.destroy();
    }
  }
}

module.exports = SqlStorage;
