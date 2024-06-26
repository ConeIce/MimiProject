const sqlite = require("better-sqlite3");
const db = new sqlite("./database.db");

module.exports = {
  getShopPrices: (req, res) => {
    try {
      const shopPrices = db
        .prepare(
          `SELECT service_cost, a4_bw_cost, a4_color_cost, a3_bw_cost, a3_color_cost FROM shops WHERE shop_id = (
        SELECT s.shop_id
        FROM shops s
        JOIN shop_staff ss ON s.shop_id = ss.shop_id
        WHERE ss.user_id = ?)`
        )
        .all(req.user.user_id);
      res.json(shopPrices);
    } catch (err) {
      console.error("Error retrieving shops:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  putShopPrices: (req, res) => {
    const userId = req.user.user_id;

    const updateStatement = db.prepare(
      `UPDATE shops SET service_cost = ?, a4_bw_cost = ?, a4_color_cost = ?, a3_bw_cost = ?, a3_color_cost = ? WHERE shop_id = (
        SELECT s.shop_id
        FROM shops s
        JOIN shop_staff ss ON s.shop_id = ss.shop_id
        WHERE ss.user_id = ?)`
    );

    try {
      const result = updateStatement.run(
        req.body.serviceCost,
        req.body.a4Cost,
        req.body.a4ColorCost,
        req.body.a3Cost,
        req.body.a3ColorCost,
        userId
      );

      if (result.changes === 1) {
        res.json({ message: "Shop prices updated successfully" });
      } else {
        res.status(500).json({ message: "Failed to update shop prices" });
      }
    } catch (err) {
      console.log("Error updating shop prices:", err);
      res.status(500).json({ message: "Error updating shop prices" });
    }
  },
};
