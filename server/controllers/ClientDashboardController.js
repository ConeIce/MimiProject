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
