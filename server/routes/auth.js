const express = require("express");
const controller = require("../controllers/AuthController.js");

const router = express.Router();

router.post("/login", (req, res) => {
  controller.login(req, res);
});

router.post("/register", (req, res) => {
  controller.register(req, res);
});

router.post("/registerClient", upload.single("file"), (req, res) => {
  controller.registerClient(req, res);
});

router.post("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect("/");
  });
});

module.exports = router;
