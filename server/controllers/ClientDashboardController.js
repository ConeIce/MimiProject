const sqlite = require("better-sqlite3");

const db = new sqlite("./database.db");

module.exports = {
  submitProof: (req, res) => {
    const user = req.user;

    const { shopId, shopName } = req.body;
    const personalPhoto = req.files["personalPhoto"][0];
    const proofOfWork = req.files["proofOfWork"][0];

    if (!shopId || !shopName || !personalPhoto || !proofOfWork) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const insertStmt = db.prepare(
      "INSERT INTO pending (shop_id, shop_name, personal_photo, proof_of_work, user_id) VALUES (?, ?, ?, ?, ?)"
    );

    try {
      const result = insertStmt.run(
        shopId,
        shopName,
        personalPhoto.filename,
        proofOfWork.filename,
        user.user_id
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
};
