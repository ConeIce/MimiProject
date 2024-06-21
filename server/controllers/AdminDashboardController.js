const sqlite = require("better-sqlite3");
const db = new sqlite("./database.db");
const nodemailer = require("nodemailer");

module.exports = {
  postShop: async (req, res) => {
    console.log("hey");
    const { shopName, shopLocation, shopEmail } = req.body;
    const ownerId = req.user.user_id;

    console.log(ownerId);

    try {
      const secret = Math.random().toString(36).substring(7);
      const insertStatement = db.prepare(
        "INSERT INTO shops (shop_name, shop_location, secret) VALUES (?, ?, ?)"
      );

      const result = insertStatement.run(shopName, shopLocation, secret);
      console.log("Shop added successfully");

      await sendSecretEmail(shopEmail, secret);

      res.status(201).json({ message: "Shop added successfully", secret });
    } catch (err) {
      console.error("Error creating shop:", err);
      res.status(500).json({ message: "Error creating shop" });
    }
  },

  usersAwaitingApproval: async (req, res) => {
    try {
      const query = `
        SELECT users.user_id, users.username, shops.shop_name FROM shop_staff
        JOIN users ON shop_staff.user_id = users.user_id
        JOIN shops ON shop_staff.shop_id = shops.shop_id
        WHERE shop_staff.status = 'pending'`;

      const result = await db.prepare(query).all();

      console.log(result);
      res.json(result);
    } catch (error) {
      console.error("Error fetching pending users:", error);
      res.status(500).json({ message: "Error fetching pending users" });
    }
  },

  usersAwaitingApprovalByShop: async (req, res) => {
    const { shop_id } = req.params;

    try {
      const query = `
        SELECT users.user_id, users.email, users.username, shops.shop_name, shop_staff.personal_photo FROM shop_staff
        JOIN users ON shop_staff.user_id = users.user_id
        JOIN shops ON shop_staff.shop_id = shops.shop_id
        WHERE shop_staff.status = 'pending' AND shop_staff.shop_id = ?`;

      const result = await db.prepare(query).all(shop_id);
      res.json(result);
    } catch (error) {
      console.error("Error fetching pending users:", error);
      res.status(500).json({ message: "Error fetching pending users" });
    }
  },

  approveClient: async (req, res) => {
    const { user_id, shop_id } = req.body;

    try {
      const updateQuery = `
        UPDATE shop_staff
        SET status = 'approved'
        WHERE user_id = ?`;
      await db.prepare(updateQuery).run(user_id);

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

  deleteClient: async (req, res) => {
    const { user_id } = req.body;

    try {
      const deleteQuery = `
        DELETE FROM users
        WHERE user_id = ?`;

      await db.prepare(deleteQuery).run(user_id);

      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ message: "Error deleting user" });
    }
  },

  deleteShop: async (req, res) => {
    const { shop_id } = req.params;

    try {
      const deleteQuery = `
            DELETE FROM shops
            WHERE shop_id = ?`;

      await db.prepare(deleteQuery).run(shop_id);

      res.status(200).json({ message: "Shop deleted successfully" });
    } catch (error) {
      console.error("Error deleting shop:", error);
      res.status(500).json({ message: "Error deleting shop" });
    }
  },
};

async function sendSecretEmail(shopEmail, secret) {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "tpurposes461@gmail.com",
      pass: "dtok payn wqui kijq",
    },
  });

  let mailOptions = {
    from: "printconnect@gmail.com",
    to: shopEmail,
    subject: "Your Shop Secret",
    text: `Hello,\n\nYour secret for the shop is: ${secret}`,
  };

  await transporter.sendMail(mailOptions);
}
