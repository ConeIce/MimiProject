const express = require("express");

const router = express.Router();

router.post("/shop", (req, res) => {
  controller.postShop(req, res);
});

router.get("/allshops", (req, res) => {
  controller.getAllShops(req, res);
});

module.exports = router;
