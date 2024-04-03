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

    db.get(
      "SELECT * FROM users WHERE username = ?",
      [username],
      async (err, row) => {
        if (err) throw err;
        if (row) res.send("User Already Exists");
        else {
          const hashedPassword = await bcrypt.hash(password, 10);

          db.run(
            "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)",
            [username, email, hashedPassword, role],
            function (err) {
              if (err) {
                return console.log(err.message);
              }
              console.log(`A row has been inserted with rowid ${this.lastID}`);
              res.send("User Created");
            }
          );
        }
      }
    );
  },
};
