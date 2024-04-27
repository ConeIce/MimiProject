const sqlite = require("better-sqlite3");
const db = new sqlite("./database.db");

module.exports = {
  submitPrint: (req, res) => {
    const user = req.user;

    const { shopId, paperSize, orientation, pageRange, copies } = req.body;
    const file = req.file;

    if (!shopId || !paperSize || !orientation || !copies || !file) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const defaultStatus = "ongoing";

    const insertStmt = db.prepare(
      "INSERT INTO files (shop_id, size, orientation, pageRange, copies, filename, status, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
    );

    try {
      const result = insertStmt.run(
        shopId,
        paperSize,
        orientation,
        pageRange,
        parseInt(copies),
        file.originalname,
        defaultStatus,
        user.user_id
      );

      if (result.changes === 1) {
        console.log(
          `A row has been inserted with rowid ${result.lastInsertRowid}`
        );
        res.json({ message: "File uploaded successfully" });
      } else {
        console.error("Failed to insert file");
        res.status(500).json({ message: "Failed to upload file" });
      }
    } catch (err) {
      console.error("Error inserting data into database:", err);
      res.status(500).json({ message: "Error uploading file" });
    }
  },
};
