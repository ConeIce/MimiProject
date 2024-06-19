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

router.get("/users/:shop_id", (req, res) => {
  controller.getShopUsers(req, res);
});

router.post("/", (req, res) => {
  controller.postShop(req, res);
});

router.put("/", (req, res) => {
  controller.putShop(req, res);
});

router.post("/update", (req, res) => {
  controller.updateFileStatus(req, res);
});

router.get("/fileinfo/:file_id", (req, res) => {
  controller.getFileInfo(req, res);
});

module.exports = router;
