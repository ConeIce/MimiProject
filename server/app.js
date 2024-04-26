const express = require("express");
const app = express();
const cors = require("cors");
const session = require("express-session");
const sqlite = require("better-sqlite3");
const SqliteStore = require("better-sqlite3-session-store")(session);
const sessionsDB = new sqlite("sessions.db");
const upload = require("./multFiles.js");

const AuthRoute = require("./routes/auth.js");
const DashboardRoute = require("./routes/dashboard.js");
const AdminDashboardRoute = require("./routes/adminDashboard.js");
const ClientDashboardRoute = require("./routes/clientDashboard.js");

const passport = require("passport");
const passportLocal = require("passport-local");

const cookieParser = require("cookie-parser");

const isLoggedIn = require("./middleware/isLoggedIn.js");
const isLoggedInAsAdmin = require("./middleware/isLoggedInAsAdmin.js");

const corsOptions = {
  origin: "http://localhost:5173",
  optionsSuccessStatus: 200,
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const db = new sqlite("./database.db");

app.use(cookieParser("bigboysecurity"));

app.use(
  session({
    store: new SqliteStore({
      client: sessionsDB,
    }),
    secret: process.env.SECRET || "bigboysecurity",
    resave: true,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());
const passportConfig = require("./passportConfig.js");
const isLoggedInAsClient = require("./middleware/isLoggedInAsClient.js");
passportConfig(passport);

app.use("/auth", AuthRoute);
app.use("/dash", isLoggedIn, DashboardRoute);
app.use("/client-dash", isLoggedInAsClient, ClientDashboardRoute);
app.use("/admin-dash", isLoggedInAsAdmin, AdminDashboardRoute);

app.post("/forgot-password", (req, res) => {
  const { email } = req.body;
  res.send("Forgot password route");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
