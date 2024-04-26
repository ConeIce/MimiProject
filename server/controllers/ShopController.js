const sqlite = require("better-sqlite3");

const db = new sqlite("./database.db");

module.exports = {
  getShop: (req, res) => {
    const userId = req.user.user_id;

    try {
      const shop = db
        .prepare(
          "SELECT shop_id, shop_name, lat, lng FROM shops WHERE user_id = ?"
        )
        .get(userId);

      console.log(shop);

      if (!shop) {
        return res.status(404).json("Shop not found");
      }
      res.json(shop);
    } catch (err) {
      console.error("Error retrieving data from database:", err);
      return res.status(500).json("Internal server error");
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
};