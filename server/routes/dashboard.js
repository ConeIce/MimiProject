const express = require("express");
const controller = require("../controllers/DashboardController.js");
const upload = require("../multFiles.js");

const router = express.Router();

router.post("/files", upload.single("file"), (req, res) => {
  controller.submitPrint(req, res);
});

router.get("/ongoing", (req, res) => {
  controller.getOngoingFiles(req, res);
});

router.get("/shops", (req, res) => {
  controller.getShops(req, res);
});

module.exports = router;
