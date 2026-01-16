const express = require("express");
const router = express.Router();
const Url = require("../models/url");
const { restrictTo } = require("../middleware/auth");

router.get("/", restrictTo(["USER", "ADMIN"]), async (req, res) => {
    let urls;
    if (req.user.role === "ADMIN") {
        urls = await Url.find({}).populate("createdBy", "name email role");
    } else {
        urls = await Url.find({ createdBy: req.user.id });
    }
    const id = req.session.generatedId;

  req.session.generatedId = null;
    return res.render("home", { urls,id });
});

router.get("/signup", (req, res) => {
    return res.render("signup");
});
router.get("/login", (req, res) => {
    return res.render("login");
});

module.exports = router;
