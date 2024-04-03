const sqlite = require("better-sqlite3");
const bcrypt = require("bcryptjs");
const passportLocal = require("passport-local");
const localStrategy = passportLocal.Strategy;

const db = new sqlite("./database.db");

module.exports = function (passport) {
  passport.use(
    new localStrategy((username, password, done) => {
      db.get(
        "SELECT * FROM users WHERE username = ?",
        [username],
        (err, row) => {
          if (err) {
            throw err;
          }
          if (!row) {
            return done(null, false);
          }
          bcrypt.compare(password, row.password, (err, result) => {
            if (err) {
              throw err;
            }
            if (result === true) {
              return done(null, row);
            } else {
              return done(null, false);
            }
          });
        }
      );
    })
  );

  passport.serializeUser((user, cb) => {
    cb(null, user.id);
  });

  passport.deserializeUser((id, cb) => {
    db.get("SELECT * FROM users WHERE id = ?", [id], (err, row) => {
      if (err) {
        return cb(err);
      }
      cb(null, row);
    });
  });
};
