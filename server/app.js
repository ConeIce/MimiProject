const express = require("express");
const app = express();
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const upload = require("./mult");

app.use(cors());

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const db = new sqlite3.Database("database.db");

app.post("/login", (req, res) => {
  console.log("reached");
  const { username, password } = req.body;
  db.get(
    "SELECT * FROM users WHERE username = ? AND password = ?", // TODO: check if user has the default role
    [username, password],
    (err, row) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error retrieving user data");
      } else if (row) {
        res.send({ status: true });
      } else {
        res.send({ status: false });
      }
    }
  );
});

app.post("/register", (req, res) => {
  const { username, password, email } = req.body;

  db.run(
    "INSERT INTO users (username, password, email) VALUES (?, ?, ?)", // TODO: integrate ROLES. either default/admin supplied from fronted
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

app.post("/submitPrint", upload.single("file"), (req, res) => {
  const { shop, size, orientation, pages, copies } = req.body;
  const file = req.file;
  console.log("reached2");
  console.log(req.body);
  console.log(file);
  if (!shop || !size || !orientation || !copies || !file) {
    return res.status(400).json({ message: "All fields are required" });
  }
  console.log("reached3");
  db.run(
    "INSERT INTO files (shop, size, orientation, pages, copies, filename, file) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [
      shop,
      size,
      orientation,
      parseInt(pages),
      parseInt(copies),
      file.originalname,
      file.buffer,
    ],
    (err) => {
      if (err) {
        console.error("Error inserting data into database:", err);
        return res.status(500).json({ message: "Error uploading file" });
      }
      res.status(200).json({ message: "File uploaded successfully" });
    }
  );
});

app.get("/files", (req, res) => {
  db.all("SELECT * FROM files", (err, rows) => {
    if (err) {
      console.error("Error retrieving data from database:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
    res.status(200).json(rows);
  });
});

app.post("/forgot-password", (req, res) => {
  const { email } = req.body;
  res.send("Forgot password route");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
