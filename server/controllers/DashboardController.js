const sqlite = require("better-sqlite3");
const bcrypt = require("bcryptjs");
const passport = require("passport");

const db = new sqlite("./database.db");

module.exports = {
  submitPrint: (req, res) => {
    // console.log(req.user);

    const { shopName, paperSize, orientation, pages, copies } = req.body;
    const file = req.file;

    console.log(shopName, paperSize);

    if (!shopName || !paperSize || !orientation || !copies || !file) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const insertStmt = db.prepare(
      "INSERT INTO files (shop, size, orientation, pages, copies, filename, file, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
    );

    try {
      const result = insertStmt.run(
        shopName,
        paperSize,
        orientation,
        parseInt(pages),
        parseInt(copies),
        file.originalname,
        file.buffer,
        user.user_id
      );

      if (result.changes === 1) {
        console.log(
          `A row has been inserted with rowid ${result.lastInsertRowid}`
        );
        res.status(200).json({ message: "File uploaded successfully" });
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
    db.all("SELECT * FROM files", (err, rows) => {
      if (err) {
        console.error("Error retrieving data from database:", err);
        return res.status(500).json({ message: "Internal server error" });
      }
      res.status(200).json(rows);
    });
  },
};