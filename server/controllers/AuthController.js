const sqlite = require("better-sqlite3");
const bcrypt = require("bcryptjs");
const passport = require("passport");

const db = new sqlite("./database.db");

module.exports = {
  login: (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) throw err;
      if (!user) res.status(400).send("No User Exists");
      else {
        req.logIn(user, (err) => {
          if (err) throw err;
          res.send("Successfully Authenticated");
        });
      }
    })(req, res, next);
  },
  register: async (req, res) => {
    console.log(req.body);

    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const role = req.body.role || "user";

    const existingUser = db
      .prepare("SELECT * FROM users WHERE username = ?")
      .get(username);

    if (existingUser) {
      res.send("User Already Exists");
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);

      const insertUserStmt = db.prepare(
        "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)"
      );
      const result = insertUserStmt.run(username, email, hashedPassword, role);

      if (result.changes === 1) {
        console.log(
          `A row has been inserted with rowid ${result.lastInsertRowid}`
        );
        res.send("User Created");
      } else {
        console.error("Failed to insert user");
        res.status(500).send("Failed to create user");
      }
    }
  },
};
