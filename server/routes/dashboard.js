const express = require("express");
const controller = require("../controllers/DashboardController.js");
const upload = require("../multFiles.js");
const router = express.Router();

router.post("/files", upload.single("file"), (req, res) => {
  controller.submitPrint(req, res);
});

module.exports = router;
