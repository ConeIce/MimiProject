const sqlite = require("better-sqlite3");
const db = new sqlite("./database.db");
const fs = require("fs");
const path = require("path");

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
        const fileId = result.lastInsertRowid;
        const newFilename = `${fileId}-${shopId}_${file.originalname}`;

        const updateFilenameStmt = db.prepare(
          "UPDATE files SET filename = ? WHERE file_id = ?"
        );
        updateFilenameStmt.run(newFilename, fileId);

        const newPath = path.join("uploads", newFilename);
        fs.renameSync(file.path, newPath);

        console.log(`A row has been inserted with rowid ${fileId}`);

        const finalUploadsPath = path.join("uploads_final", newFilename);
        fs.renameSync(newPath, finalUploadsPath);

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

  getUserPrints: (req, res) => {
    const user = req.user;

    const query = `
      SELECT file_id, size, orientation, pageRange, copies, filename, status
      FROM files
      WHERE user_id = ?
    `;

    try {
      const files = db.prepare(query).all(user.user_id);
      res.json(files);
    } catch (err) {
      console.error("Error retrieving files:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};
