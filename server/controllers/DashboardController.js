const sqlite = require("better-sqlite3");
const bcrypt = require("bcryptjs");
const passport = require("passport");

const db = new sqlite("./database.db");

module.exports = {
  submitPrint: (req, res) => {
    const user = req.user;

    const { shopName, paperSize, orientation, pageRange, copies } = req.body;
    const file = req.file;

    console.log("PageRange", pageRange);

    if (!shopName || !paperSize || !orientation || !copies || !file) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const insertStmt = db.prepare(
      "INSERT INTO files (shop, size, orientation, pageRange, copies, filename, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)"
    );

    try {
      const result = insertStmt.run(
        shopName,
        paperSize,
        orientation,
        pageRange,
        parseInt(copies),
        file.originalname,
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

  getFiles: (req, res) => {
    try {
      const files = db
        .prepare("SELECT * FROM files WHERE user_id = ?")
        .all(req.user.user_id);

      console.log(files);

      if (!files) {
        return res.status(404).json("No files found");
      }
      res.json(files);
    } catch (err) {
      console.error("Error retrieving data from database:", err);
      return res.status(500).json("Internal server error");
    }
  },
};
