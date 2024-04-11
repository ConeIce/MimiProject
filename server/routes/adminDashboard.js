const express = require("express");
const controller = require("../controllers/AdminDashboardController.js");

const router = express.Router();

router.get("/test-route", (req, res) => {
  controller.get(req, res);
});

module.exports = router;
