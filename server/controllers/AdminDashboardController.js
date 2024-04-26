const sqlite = require("better-sqlite3");

const db = new sqlite("./database.db");

module.exports = {
  postShop: (req, res) => {
    const shopName = req.body.shopName;
    const ownerId = req.user.user_id;

    console.log(ownerId);

    const insertStatement = db.prepare(
      "INSERT INTO shops (user_id, shop_name) VALUES (?, ?)"
    );

    try {
      const result = insertStatement.run(ownerId, shopName);
      console.log(req.user);
    } catch (err) {
      console.error("Error creating shop:", err);
      res.status(500).json({ message: "Error creating shop" });
    }

    res.json("Admin Dashboard Route");
  },
  getAllShops: (req, res) => {
    try {
      const shops = db.prepare("SELECT * FROM shops").all();
      res.json(shops);
    } catch (err) {
      console.error("Error retrieving shops:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  getUsersByShop: (req, res) => {
    const shopId = req.params.shopId;

    try {
      const users = db
        .prepare(
          `
        SELECT u.username, u.email, u.role 
        FROM users u
        WHERE EXISTS (
          SELECT 1 FROM client_requests cr
          WHERE cr.user_id = u.user_id AND cr.shop_id = ?
        )
      `
        )
        .all(shopId);

      res.json(users);
    } catch (err) {
      console.error("Error retrieving users by shop:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  approveClientRequest: (req, res) => {
    const userId = req.params.userId;
    const shopId = req.params.shopId;

    try {
      const updateStmt = db.prepare(
        "UPDATE users SET is_client = 'yes' WHERE user_id = ?"
      );
      const result = updateStmt.run(userId);

      if (result.changes === 1) {
        db.prepare(
          "DELETE FROM client_requests WHERE user_id = ? AND shop_id = ?"
        ).run(userId, shopId);

        res.json({ message: "Client request approved successfully" });
      } else {
        res.status(500).json({ message: "Failed to approve client request" });
      }
    } catch (err) {
      console.error("Error approving client request:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  getShopOngoingFiles: (req, res) => {
    const { shopName } = req.params;

    try {
      const ongoingFiles = db
        .prepare("SELECT * FROM files WHERE shop = ? AND status = 'ongoing'")
        .all(shopName);

      res.json(ongoingFiles);
    } catch (err) {
      console.error("Error retrieving ongoing shop files:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  getShopCompletedFiles: (req, res) => {
    const { shopName } = req.params;

    try {
      const completedFiles = db
        .prepare("SELECT * FROM files WHERE shop = ? AND status = 'completed'")
        .all(shopName);

      res.json(completedFiles);
    } catch (err) {
      console.error("Error retrieving completed shop files:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};
