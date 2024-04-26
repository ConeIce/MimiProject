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
  getAllShops: (req, res) => {
    try {
      const shops = db.prepare("SELECT * FROM shops").all();
      res.json(shops);
    } catch (err) {
      console.error("Error retrieving shops:", err);
      res.status(500).json({ message: "Internal server error" });
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
    console.log("hey");
    console.log(req.params);
    const { shopId } = req.params;

    try {
      // Retrieve data from the pending table
      const pendingQuery = `
      SELECT user_id, shop_id, personal_photo, proof_of_work
      FROM pending
      WHERE shop_id = ?`;

      const pendingData = await db.prepare(pendingQuery).get(shopId);

      if (!pendingData) {
        return res.status(404).json({ message: "Pending shop not found" });
      }

      // Retrieve additional data from the users table
      const userQuery = `
      SELECT username, email
      FROM users
      WHERE user_id = ?`;

      const userData = await db.prepare(userQuery).get(pendingData.user_id);

      // Retrieve additional data from the shops table
      const shopQuery = `
      SELECT shop_name, shop_location
      FROM shops
      WHERE shop_id = ?`;

      const shopData = await db.prepare(shopQuery).get(pendingData.shop_id);

      // Read personal photo file from server storage
      const personalPhotoPath = `./proofs/${pendingData.personal_photo}`;
      const personalPhoto = fs.readFileSync(personalPhotoPath, {
        encoding: "base64",
      });

      // Read proof of work photo file from server storage
      const proofOfWorkPath = `./proofs/${pendingData.proof_of_work}`;
      const proofOfWork = fs.readFileSync(proofOfWorkPath, {
        encoding: "base64",
      });

      // Send the combined data to the frontend
      res.json({
        username: userData.username,
        email: userData.email,
        shop_name: shopData.shop_name,
        shop_location: shopData.shop_location,
        personal_photo: personalPhoto,
        proof_of_work: proofOfWork,
      });
    } catch (error) {
      console.error("Error fetching pending shop:", error);
      res.status(500).json({ message: "Error fetching pending shop" });
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
