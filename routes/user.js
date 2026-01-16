const express = require("express");
const{handlecreateUser,handlelogin,logoutUser,uploadProfileImage}= require("../controllers/user.js"); 
const router = express.Router();
const multer  = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')         
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`)
  }
});

const upload = multer({ storage: storage });

router.post("/",handlecreateUser);
router.post("/login",handlelogin);
router.get("/logout", logoutUser);

router.post("/upload", upload.single("profile-img"), uploadProfileImage);

module.exports = router;