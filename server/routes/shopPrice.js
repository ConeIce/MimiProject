const express = require("express");
const controller = require("../controllers/ShopPriceController.js");

const router = express.Router();

router.get("/", (req, res) => {
  controller.getShopPrices(req, res);
});

router.put("/", (req, res) => {
  controller.putShopPrices(req, res);
});

module.exports = router;
