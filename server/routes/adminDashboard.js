const express = require("express");

const router = express.Router();

router.post("/shop", (req, res) => {
  controller.postShop(req, res);
});

router.get("/allshops", (req, res) => {
  controller.getAllShops(req, res);
});

router.get("/searchShop", (req, res) => {
  controller.searchShop(req, res);
});

router.get("/pendingShops", (req, res) => {
  controller.pendingShops(req, res);
});

router.get("/clientRequest/:shopId", (req, res) => {
  controller.clientRequest(req, res);
});

module.exports = router;
