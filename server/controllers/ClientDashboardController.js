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

  userStatus: (req, res) => {
    if (req.isAuthenticated()) {
      res.json({ isNewUser: req.user.new });
    } else {
      res.status(401).json({ message: "User not authenticated" });
    }
  },
};
