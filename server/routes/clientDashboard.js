const express = require("express");
const controller = require("../controllers/ClientDashboardController.js");
const upload = require("../multProof.js");
const router = express.Router();

router.post(
  "/submitProof",
  upload.fields([
    { name: "personalPhoto", maxCount: 1 },
    { name: "proofOfWork", maxCount: 1 },
  ]),
  (req, res) => {
    controller.submitProof(req, res);
  }
);

router.get("/status", (req, res) => {
  controller.userStatus(req, res);
});

module.exports = router;
