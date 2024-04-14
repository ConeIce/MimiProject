const sqlite = require("better-sqlite3");

const db = new sqlite("./database.db");

module.exports = {
  getUserShopFiles: (req, res) => {
    const userShopName = req.user.shop;
    const userId = req.user.user_id;

    try {
      const isClient = db
        .prepare("SELECT is_client FROM users WHERE user_id = ?")
        .get(userId);

      if (!isClient || isClient.is_client !== "yes") {
        return res.json([]);
      }

      const files = db
        .prepare("SELECT * FROM files WHERE shop = ?")
        .all(userShopName);

      res.json(files);
    } catch (err) {
      console.error("Error retrieving user shop files:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};
