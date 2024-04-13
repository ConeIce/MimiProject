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

    res.json("Admin Dashboard Route");
  },
};
