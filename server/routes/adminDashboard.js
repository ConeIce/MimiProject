const express = require("express");
const controller = require("../controllers/AdminDashboardController.js");
const router = express.Router();

router.post("/addShop", (req, res) => {
  controller.postShop(req, res);
});

router.get("/pendingShops", (req, res) => {
  controller.pendingShops(req, res);
});

router.get("/clientRequest/:shop_id", (req, res) => {
  controller.clientRequest(req, res);
});

router.post("/approveClient", (req, res) => {
  controller.approveRequest(req, res);
});

router.post("/rejectClient", (req, res) => {
  controller.rejectRequest(req, res);
});

module.exports = router;
