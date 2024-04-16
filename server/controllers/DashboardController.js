const sqlite = require("better-sqlite3");
const bcrypt = require("bcryptjs");
const passport = require("passport");

const db = new sqlite("./database.db");

module.exports = {
  submitPrint: (req, res) => {
    const user = req.user;

    const { shopName, paperSize, orientation, pageRange, copies } = req.body;
    const file = req.file;

    if (!shopName || !paperSize || !orientation || !copies || !file) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const defaultStatus = "ongoing";

    const insertStmt = db.prepare(
      "INSERT INTO files (shop, size, orientation, pageRange, copies, filename, status, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
    );

    try {
      const result = insertStmt.run(
        shopName,
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

  getOngoingFiles: (req, res) => {
    try {
      const ongoingFiles = db
        .prepare("SELECT * FROM files WHERE user_id = ? AND status = 'ongoing'")
        .all(req.user.user_id);

      if (!ongoingFiles || ongoingFiles.length === 0) {
        return res.status(404).json("No ongoing files found");
      }
      res.json(ongoingFiles);
    } catch (err) {
      console.error("Error retrieving ongoing files from database:", err);
      return res.status(500).json("Internal server error");
    }
  },

  getCompletedFiles: (req, res) => {
    try {
      const completedFiles = db
        .prepare(
          "SELECT * FROM files WHERE user_id = ? AND status = 'completed'"
        )
        .all(req.user.user_id);

      if (!completedFiles || completedFiles.length === 0) {
        return res.status(404).json("No completed files found");
      }
      res.json(completedFiles);
    } catch (err) {
      console.error("Error retrieving completed files from database:", err);
      return res.status(500).json("Internal server error");
    }
  },
};
