const express = require("express");
const controller = require("../controllers/AdminDashboardController.js");
const router = express.Router();

router.post("/addShop", (req, res) => {
  controller.postShop(req, res);
});

router.get("/pending", (req, res) => {
  controller.usersAwaitingApproval(req, res);
});

router.get("/pending/:shop_id", (req, res) => {
  controller.usersAwaitingApprovalByShop(req, res);
});

router.post("/approveClient", (req, res) => {
  controller.approveClient(req, res);
});

router.post("/rejectClient", (req, res) => {
  controller.rejectRequest(req, res);
});

router.post("/deleteClient", (req, res) => {
  controller.deleteClient(req, res);
});

router.delete("/deleteShop/:shop_id", (req, res) => {
  controller.deleteShop(req, res);
});

module.exports = router;
