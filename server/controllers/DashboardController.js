const sqlite = require("better-sqlite3");
const bcrypt = require("bcryptjs");
const passport = require("passport");

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

  getOngoingFiles: (req, res) => {
    try {
      const files = db
        .prepare(
          `SELECT file_id, pageRange, copies, filename, shop_name, done from files
          JOIN shops ON files.shop_id = shops.shop_id
          WHERE files.user_id = ?`
        )
        .all(req.user.user_id);

      if (!files || files.length === 0) {
        return res.status(404).json("No ongoing files found");
      }
      res.json(files);
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

  getShops: (req, res) => {
    try {
      const shops = db.prepare("SELECT shop_id, shop_name FROM shops").all();

      if (!shops) {
        return res.status(404).json("No shops found");
      }
      res.json(shops);
    } catch (err) {
      console.error("Error retrieving data from database:", err);
      return res.status(500).json("Internal server error");
    }
  },
};
