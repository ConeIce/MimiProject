const express = require("express");
const app = express();
const cors = require("cors");
const session = require("express-session");
const sqlite = require("better-sqlite3");
const SqliteStore = require("better-sqlite3-session-store")(session);
const sessionsDB = new sqlite("sessions.db");
const upload = require("./mult");
const AuthRoute = require("./routes/auth.js");
const passport = require("passport");
const passportLocal = require("passport-local");

const { createServer } = require("node:http");
const server = createServer(app);

const { Server } = require("socket.io");
const io = new Server(server);

app.use(cors());

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const db = new sqlite("./database.db");

app.use(
  session({
    proxy: process.env.ENV === "production",
    store: new SqliteStore({
      client: sessionsDB,
    }),
    secret: process.env.SECRET || "bigboysecurity",
    resave: true,
    saveUninitialized: false,
    cookie: {},
  })
);

app.use(passport.initialize());
app.use(passport.session());
const passportConfig = require("./passportConfig.js");
passportConfig(passport);

app.use("/auth", AuthRoute);

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
