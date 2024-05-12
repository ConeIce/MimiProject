const sqlite = require("better-sqlite3");
const fs = require("fs");
const db = new sqlite("./database.db");

module.exports = {
  postShop: (req, res) => {
    const { shopName, shopLocation } = req.body;
    const ownerId = req.user.user_id;

    console.log(ownerId);

    const insertStatement = db.prepare(
      "INSERT INTO shops (user_id, shop_name, shop_location) VALUES (?, ?, ?)"
    );

    try {
      const result = insertStatement.run(ownerId, shopName, shopLocation);
      console.log(req.user);
    } catch (err) {
      console.error("Error creating shop:", err);
      res.status(500).json({ message: "Error creating shop" });
    }

    res.json("Admin Dashboard Route");
  },

  pendingShops: async (req, res) => {
    try {
      const query = `
        SELECT p.shop_id, s.shop_name
        FROM pending p
        JOIN shops s ON p.shop_id = s.shop_id
        GROUP BY p.shop_id
        LIMIT 5`;

      const result = await db.prepare(query).all();

      console.log(result);
      res.json(result);
    } catch (error) {
      console.error("Error fetching pending shops:", error);
      res.status(500).json({ message: "Error fetching pending shops" });
    }
  },

  clientRequest: async (req, res) => {
    const { shop_id } = req.params;
    console.log(shop_id);
    console.log(req.params);
    console.log("ehy");

    try {
      const pendingQuery = `
        SELECT user_id, shop_id, personal_photo, proof_of_work
        FROM pending
        WHERE shop_id = ?`;

      const pendingData = await db.prepare(pendingQuery).all(shop_id);

      if (!pendingData || pendingData.length === 0) {
        return res.status(404).json({ message: "Pending shop not found" });
      }

      const userDetailsPromises = pendingData.map(async (pendingItem) => {
        const userQuery = `
          SELECT user_id, username, email
          FROM users
          WHERE user_id = ?`;

        const userData = await db.prepare(userQuery).get(pendingItem.user_id);

        return {
          user_id: userData.user_id,
          username: userData.username,
          email: userData.email,
          personal_photo: pendingItem.personal_photo,
          proof_of_work: pendingItem.proof_of_work,
        };
      });

      const userDetails = await Promise.all(userDetailsPromises);

      const shopQuery = `
        SELECT shop_name, shop_location
        FROM shops
        WHERE shop_id = ?`;

      const shopData = await db.prepare(shopQuery).get(pendingData[0].shop_id);

      res.json({
        shop_name: shopData.shop_name,
        shop_location: shopData.shop_location,
        users: userDetails,
      });
    } catch (error) {
      console.error("Error fetching pending shop:", error);
      res.status(500).json({ message: "Error fetching pending shop" });
    }
  },

  approveRequest: async (req, res) => {
    console.log("hey");
    const { user_id, shop_id } = req.body;

    try {
      const { personal_photo } = db
        .prepare("SELECT personal_photo FROM pending WHERE user_id = ?")
        .get(user_id);

      const updateQuery = `
        UPDATE users
        SET new = 0
        WHERE user_id = ?`;
      await db.prepare(updateQuery).run(user_id);

      const deleteQuery = `
        DELETE FROM pending
        WHERE user_id = ?`;
      await db.prepare(deleteQuery).run(user_id);

      const insertQuery = `
      INSERT INTO UserShop (user_id, shop_id, personal_photo)
      VALUES (?, ?, ?)`;
      await db.prepare(insertQuery).run(user_id, shop_id, personal_photo);

      res.status(200).json({ message: "User request approved successfully" });
    } catch (error) {
      console.error("Error approving user request:", error);
      res.status(500).json({ message: "Error approving user request" });
    }
  },

  rejectRequest: async (req, res) => {
    try {
      const deleteQuery = `
        DELETE FROM pending
        WHERE user_id = ?`;

      await db.prepare(deleteQuery).run(req.body.user_id);

      res.status(200).json({ message: "User request rejected successfully" });
    } catch (error) {
      console.error("Error rejecting user request:", error);
      res.status(500).json({ message: "Error rejecting user request" });
    }
  },
};
