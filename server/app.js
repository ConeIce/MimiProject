const express = require("express");
const app = express();
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();

app.use(cors());

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Create a new SQLite database
const db = new sqlite3.Database("database.db");

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  res.send("Login route");
});

app.post("/register", (req, res) => {
  console.log("Reached");
  const { username, password, email } = req.body;

  db.run(
    "INSERT INTO users (username, password, email) VALUES (?, ?, ?)",
    [username, password, email],
    (err) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error saving user data");
      } else {
        res.send("User registered successfully");
      }
    }
  );
});

app.post("/forgot-password", (req, res) => {
  const { email } = req.body;
  res.send("Forgot password route");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
