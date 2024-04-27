const express = require("express");
const controller = require("../controllers/ShopController.js");

const router = express.Router();

router.get("/all", (req, res) => {
  controller.getAllShops(req, res);
});

router.get("/shopById/:shop_id", (req, res) => {
  controller.getShopById(req, res);
});

router.get("/", (req, res) => {
  controller.getShop(req, res);
});

router.get("/searchShop", (req, res) => {
  controller.searchShop(req, res);
});

router.post("/", (req, res) => {
  controller.postShop(req, res);
});

router.put("/", (req, res) => {
  controller.putShop(req, res);
});

module.exports = router;
