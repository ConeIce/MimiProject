const sqlite = require("better-sqlite3");

const db = new sqlite("./database.db");

module.exports = {
  getClientOngoingFiles: (req, res) => {
    const userShopName = req.user.shop;
    const userId = req.user.user_id;

    try {
      const isClient = db
        .prepare("SELECT is_client FROM users WHERE user_id = ?")
        .get(userId);

      if (!isClient || isClient.is_client !== "yes") {
        return res.json([]);
      }

      const ongoingFiles = db
        .prepare("SELECT * FROM files WHERE shop = ? AND status = 'ongoing'")
        .all(userShopName);

      res.json(ongoingFiles);
    } catch (err) {
      console.error("Error retrieving ongoing client shop files:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  submitProof: (req, res) => {
    console.log("hey");
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
      "INSERT INTO pending (user_id, shop_id, personal_photo, proof_of_work) VALUES (?, ?, ?, ?)"
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

  getAllShops: (req, res) => {
    try {
      const shops = db.prepare("SELECT * FROM shops").all();
      res.json(shops);
    } catch (err) {
      console.error("Error retrieving shops:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  getClientCompletedFiles: (req, res) => {
    const userShopName = req.user.shop;
    const userId = req.user.user_id;

    try {
      const isClient = db
        .prepare("SELECT is_client FROM users WHERE user_id = ?")
        .get(userId);

      if (!isClient || isClient.is_client !== "yes") {
        return res.json([]);
      }

      const completedFiles = db
        .prepare("SELECT * FROM files WHERE shop = ? AND status = 'completed'")
        .all(userShopName);

      res.json(completedFiles);
    } catch (err) {
      console.error("Error retrieving completed client shop files:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};
