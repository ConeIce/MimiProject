const express = require("express");
const controller = require("../controllers/ShopController.js");

const router = express.Router();

router.get("/", (req, res) => {
  controller.getShop(req, res);
});

router.post("/", (req, res) => {
  controller.postShop(req, res);
});

router.put("/", (req, res) => {
  controller.putShop(req, res);
});

module.exports = router;
