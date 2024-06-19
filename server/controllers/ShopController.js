const sqlite = require("better-sqlite3");
const db = new sqlite("./database.db");

module.exports = {
  getAllShops: (req, res) => {
    try {
      const shops = db.prepare("SELECT * FROM shops").all();
      res.json(shops);
    } catch (err) {
      console.error("Error retrieving shops:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  getShopById: async (req, res) => {
    const { shop_id } = req.params;
    try {
      const shop = await db
        .prepare("SELECT * FROM shops WHERE shop_id = ?")
        .get(shop_id);

      if (!shop) {
        return res.status(404).json({ message: "Shop not found" });
      }

      console.log(shop);
      res.json(shop);
    } catch (err) {
      console.error("Error retrieving shop:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  getShop: (req, res) => {
    console.log("here at getShop");
    const userId = req.user.user_id;
    console.log(userId);

    try {
      const shop = db
        .prepare(
          "SELECT shop_id, shop_name, lat, lng FROM shops WHERE user_id = ?"
        )
        .get(userId);

      console.log("Shop:", shop);

      if (!shop) {
        return res.status(404).json("Shop not found");
      }
      res.json(shop);
    } catch (err) {
      console.error("Error retrieving data from database:", err);
      return res.status(500).json("Internal server error");
    }
  },

  searchShop: async (req, res) => {
    const searchTerm = req.query.search;

    try {
      const query = `
      SELECT * 
      FROM shops 
      WHERE LOWER(shop_name) LIKE '%' || ? || '%'`;

      const result = await db.prepare(query).all(searchTerm.toLowerCase());

      res.json(result);
    } catch (error) {
      console.error("Error fetching shops:", error);
      res.status(500).json({ message: "Error fetching shops" });
    }
  },

  getShopUsers: async (req, res) => {
    const { shop_id } = req.params;
    console.log(shop_id);

    try {
      const users = await db
        .prepare(
          `
        SELECT users.user_id, users.username, users.email, UserShop.personal_photo
        FROM users
        INNER JOIN UserShop ON users.user_id = UserShop.user_id
        WHERE UserShop.shop_id = ?
      `
        )
        .all(shop_id);

      console.log(users);
      res.json(users);
    } catch (error) {
      console.error("Error retrieving shop users:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

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

      if (result.changes === 1) {
        const updateStatement = db.prepare(
          "UPDATE users SET new = 0 WHERE user_id = ?"
        );
        const result = updateStatement.run(req.user.user_id);

        res.json({ message: "Shop created successfully" });
      } else {
        res.status(500).json({ message: "Failed to create shop" });
      }
    } catch (err) {
      console.error("Error creating shop:", err);
      res.status(500).json({ message: "Error creating shop" });
    }
  },

  putShop: (req, res) => {
    const { lat, lng, shopName } = req.body;

    const userId = req.user.user_id;

    const updateStatement = db.prepare(
      "UPDATE shops SET lat = ?, lng = ?, shop_name = ? WHERE user_id = ?"
    );

    try {
      const result = updateStatement.run(lat, lng, shopName, userId);

      if (result.changes === 1) {
        res.json({ message: "Shop updated successfully" });
      } else {
        res.status(500).json({ message: "Failed to update shop" });
      }
    } catch (err) {
      console.log("Error updating shop location:", err);
      res.status(500).json({ message: "Error updating shop location" });
    }
  },

  updateFileStatus: (req, res) => {
    const { file_id, status } = req.body;

    if (!file_id || !status) {
      return res.status(400).json({
        message: "File ID and new status are required",
      });
    }

    const updateStmt = db.prepare(
      "UPDATE files SET status = ? WHERE file_id = ?"
    );

    try {
      const result = updateStmt.run(status, file_id);

      if (result.changes === 1) {
        console.log(`Status updated successfully for file ID ${file_id}`);
        res.json({ message: "File status updated successfully" });
      } else {
        console.error("Failed to update file status");
        res.status(500).json({ message: "Failed to update file status" });
      }
    } catch (err) {
      console.error("Error updating file status:", err);
      res.status(500).json({ message: "Error updating file status" });
    }
  },

  getFileInfo: (req, res) => {
    const fileId = req.params.file_id;
    console.log("here");

    const selectStatement = db.prepare("SELECT * FROM files WHERE file_id = ?");

    try {
      const fileInfo = selectStatement.get(fileId);

      if (fileInfo) {
        res.json(fileInfo);
      } else {
        res.status(404).json({ message: "File not found" });
      }
    } catch (err) {
      console.log("Error retrieving file information:", err);
      res.status(500).json({ message: "Error retrieving file information" });
    }
  },
};
