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

  getOngoingPrints: (req, res) => {
    const user = req.user;
    const { page = 1, limit = 5 } = req.query;

    const offset = (page - 1) * limit;

    try {
      const countStmt = db.prepare(
        "SELECT COUNT(*) as total FROM files WHERE user_id = ?"
      );
      const totalCount = countStmt.get(user.user_id).total;

      const totalPages = Math.ceil(totalCount / limit);

      const selectStmt = db.prepare(
        "SELECT files.file_id, files.size, files.orientation, files.pageRange, files.copies, files.filename, files.status, shops.shop_name " +
          "FROM files " +
          "JOIN shops ON files.shop_id = shops.shop_id " +
          "WHERE files.user_id = ? " +
          "LIMIT ? OFFSET ?"
      );
      const files = selectStmt.all(user.user_id, limit, offset);

      res.json({
        files,
        totalPages,
        currentPage: parseInt(page),
      });
    } catch (err) {
      console.error("Error retrieving user files:", err);
      res.status(500).json({ message: "Error retrieving user files" });
    }
  },
};
