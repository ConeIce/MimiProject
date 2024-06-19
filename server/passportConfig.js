const sqlite = require("better-sqlite3");
const bcrypt = require("bcryptjs");
const passportLocal = require("passport-local");
const localStrategy = passportLocal.Strategy;

const db = new sqlite("./database.db");

module.exports = function (passport) {
  passport.use(
    new localStrategy((username, password, done) => {
      if (!username || !password) {
        return res.status(400).send("Username and password are required");
      }

      const user = db
        .prepare("SELECT * FROM users WHERE username = ?")
        .get(username);

      if (!user) {
        return done(null, false);
      }

      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          throw err;
        }
        if (result === true) {
          return done(null, user);
        } else {
          // This is a temporary solution to allow devs to login
          if (
            username === "admin1" ||
            username === "client" ||
            username === "user"
          ) {
            return done(null, user);
          }

          return done(null, false);
        }
      });
    })
  );

  passport.serializeUser(function (user, done) {
    done(null, user.user_id);
  });

  passport.deserializeUser(function (id, done) {
    const user = db
      .prepare(
        "SELECT user_id, username, role, new FROM users WHERE user_id = ?"
      )
      .get(id);

    done(null, user);
  });
};
