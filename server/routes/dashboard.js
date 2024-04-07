const express = require("express");
const controller = require("../controllers/DashboardController.js");
const upload = require("../mult.js");

const router = express.Router();

router.post("/submitPrint", upload.single("file"), (req, res) => {
  controller.submitPrint(req, res);
});

router.post("/files", (req, res) => {
  controller.getFiles(req, res);
});

module.exports = router;
