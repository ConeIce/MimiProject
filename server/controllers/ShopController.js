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
          `SELECT s.shop_id, s.shop_name, s.shop_location
            FROM shops s
            JOIN shop_staff ss ON s.shop_id = ss.shop_id
            WHERE ss.user_id = ?`
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

    try {
      const query = `
        SELECT users.user_id, users.email, users.username FROM shop_staff
        JOIN users ON shop_staff.user_id = users.user_id
        JOIN shops ON shop_staff.shop_id = shops.shop_id
        WHERE shop_staff.status = 'approved' AND shop_staff.shop_id = ?`;

      const result = await db.prepare(query).all(shop_id);
      res.json(result);
    } catch (error) {
      console.error("Error fetching pending users:", error);
      res.status(500).json({ message: "Error fetching pending users" });
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

  verifySecret: async (req, res) => {
    const { clientSecret } = req.params;
    console.log("verify");

    try {
      const query = `
      SELECT shop_id
      FROM shops
      WHERE secret = ?`;

      const shop = await db.prepare(query).get(clientSecret);

      if (!shop) {
        res.status(404).json({ message: "Shop not found" });
      } else {
        res.status(200).json(shop);
      }
    } catch (error) {
      console.error("Error retrieving shop:", error);
      res.status(500).json({ message: "Error retrieving shop" });
    }
  },

  shopIdFromUser: async (req, res) => {
    const user_id = req.user.user_id;

    try {
      const shopIdQuery = `
        SELECT shop_id
        FROM shop_staff
        WHERE user_id = ?`;
      const shop = await db.prepare(shopIdQuery).get(user_id);

      if (!shop) {
        return res
          .status(404)
          .json({ message: "Shop not found for this user" });
      }

      res.status(200).json({ shop_id: shop.shop_id });
    } catch (error) {
      console.error("Error fetching shop id:", error);
      res.status(500).json({ message: "Error fetching shop id" });
    }
  },

  ongoingPrints: async (req, res) => {
    const shop_id = req.params.shopId;
    const page = req.query.page || 1;
    const perPage = 5;

    try {
      const countQuery = `
        SELECT COUNT(*) AS total
        FROM files
        WHERE shop_id = ? AND printStatus = 'Pending'`;
      const totalCount = await db.prepare(countQuery).get(shop_id);

      const totalPages = Math.ceil(totalCount.total / perPage);

      const printsQuery = `
        SELECT *
        FROM files
        WHERE shop_id = ? AND printStatus = 'Pending'
        ORDER BY printId
        LIMIT ?
        OFFSET ?`;
      const prints = await db
        .prepare(printsQuery)
        .all(shop_id, perPage, (page - 1) * perPage);

      res.status(200).json({ prints, totalPages });
    } catch (error) {
      console.error("Error fetching pending prints:", error);
      res.status(500).json({ message: "Error fetching pending prints" });
    }
  },
};
