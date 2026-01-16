const express = require("express");
const router = express.Router();

const {
  handlegeneratenewshorturl,
  handleredirect,
  handleanalytics,
  deleteurl,
  deleteallurls,
} = require("../controllers/url");
const Url = require("../models/url");

router.get("/analytics/:shortId", handleanalytics);
router.get("/:shortId", handleredirect);
router.post("/", handlegeneratenewshorturl);
router.post("/delete/:id",deleteurl);
router.post("/delete-all",deleteallurls);

module.exports = router;
