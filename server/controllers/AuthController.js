const sqlite = require("better-sqlite3");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const db = new sqlite("./database.db");

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

module.exports = {
  login: (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) throw err;
      if (!user) {
        return res.status(400).send("No User Exists or password is wrong");
      }

      console.log(req.body, user.role, req.body.role !== user.role);
      if (user.role !== req.body.role) {
        return res.status(401).send("Unauthorized User");
      }

      req.logIn(user, (err) => {
        if (err) throw err;
        const user = {
          username: req.user.username,
          role: req.user.role,
          email: req.user.email,
          new: req.user.new,
          user_id: req.user.user_id,
        };

        res.send(user);
      });
    })(req, res, next);
  },
  register: async (req, res) => {
    const { username, email, password } = req.body;
    const role = req.body.role || "user";
    const isNew = req.body.new || 0;

    if (!username || !email || !password) {
      return res.status(400).send("Username, email, and password are required");
    }

    if (!validateEmail(email)) {
      return res.status(400).send("Invalid email address");
    }

    if (password.length < 6) {
      return res
        .status(400)
        .send("Password must be at least 6 characters long");
    }

    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
    const numberRegex = /\d/;
    if (!specialCharRegex.test(password) || !numberRegex.test(password)) {
      return res
        .status(400)
        .send(
          "Password must contain at least one special character and one number"
        );
    }

    const existingEmail = db
      .prepare("SELECT * FROM users WHERE email = ?")
      .get(email);

    if (existingEmail) {
      return res.status(400).send("Email Already Exists");
    }

    const existingUser = db
      .prepare("SELECT * FROM users WHERE username = ?")
      .get(username);

    if (existingUser) {
      res.status(400).send("User Already Exists");
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);

      const insertUserStmt = db.prepare(
        "INSERT INTO users (username, email, password, role, new) VALUES (?, ?, ?, ?, ?)"
      );
      const result = insertUserStmt.run(
        username,
        email,
        hashedPassword,
        role,
        isNew
      );

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
