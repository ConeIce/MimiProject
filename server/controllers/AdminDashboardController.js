const sqlite = require("better-sqlite3");

const db = new sqlite("./database.db");

module.exports = {
  get: (req, res) => {
    res.json("Admin Dashboard Route");
  },
};
