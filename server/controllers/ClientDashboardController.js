const sqlite = require("better-sqlite3");
const db = new sqlite("./database.db");

module.exports = {
  submitProof: (req, res) => {
    const user = req.user;

    const { shopId } = req.body;
    const personalPhoto = req.files["personalPhoto"][0];
    const proofOfWork = req.files["proofOfWork"][0];

    if (!shopId || !personalPhoto || !proofOfWork) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const insertStmt = db.prepare(
      "INSERT INTO shop_staff (user_id, shop_id, personal_photo, proof_of_work) VALUES (?, ?, ?, ?)"
    );

    try {
      const result = insertStmt.run(
        user.user_id,
        shopId,
        personalPhoto.filename,
        proofOfWork.filename
      );

      if (result.changes === 1) {
        console.log(
          `A row has been inserted with rowid ${result.lastInsertRowid}`
        );
        res.json({ message: "Proof submitted successfully" });
      } else {
        console.error("Failed to insert proof");
        res.status(500).json({ message: "Failed to submit proof" });
      }
    } catch (err) {
      console.error("Error inserting data into database:", err);
      res.status(500).json({ message: "Error submitting proof" });
    }
  },

  registerClient: async (req, res) => {
    console.log("hey");
    const { username, email, password, role, clientSecret } = req.body;
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

      try {
        const result = insertUserStmt.run(
          username,
          email,
          hashedPassword,
          role || "user",
          isNew
        );

        if (result.changes === 1) {
          console.log(
            `A row has been inserted with rowid ${result.lastInsertRowid}`
          );

          const shopQuery = `
            SELECT shop_id
            FROM shops
            WHERE secret = ?`;

          const shop = await db.prepare(shopQuery).get(clientSecret);

          if (!shop) {
            return res.status(400).send("Invalid client secret");
          }

          const insertClientQuery = `
            INSERT INTO shop_staff (user_id, shop_id, status)
            VALUES (?, ?, 'pending')`;

          await db
            .prepare(insertClientQuery)
            .run(result.lastInsertRowid, shop.shop_id);

          res.send("User Created and added to shop successfully");
        } else {
          console.error("Failed to insert user");
          res.status(500).send("Failed to create user");
        }
      } catch (error) {
        console.error("Error inserting user:", error);
        res.status(500).send("Failed to create user");
      }
    }
  },

  userStatus: (req, res) => {
    if (req.isAuthenticated()) {
      res.json({ isNewUser: req.user.new });
    } else {
      res.status(401).json({ message: "User not authenticated" });
    }
  },
};
