const express = require("express");
const controller = require("../controllers/AdminDashboardController.js");

const router = express.Router();

router.post("/shop", (req, res) => {
  controller.postShop(req, res);
});

module.exports = router;
