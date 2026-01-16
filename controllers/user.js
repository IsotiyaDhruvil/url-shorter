const User = require("../models/user.js");
const {v4:uuidv4}=require("uuid");
const {setUser,getUser} = require("../service/auth.js");

async function handlecreateUser(req, res) {
    const {name,email,password}=req.body;
    await User.create({
        name,
        email,
        password,
    });
    return res.redirect("/");
};

async function handlelogin(req, res) {
    const {email,password}=req.body;
    const user = await User.findOne({email,password});
    if(!user){
        return res.render("login",{
            error:"Invalid username or password",
        });
    }

    req.session.user ={
        _id:user._id,
        name:user.name,
        role:user.role,
        email:user.email,
    };
    const token = setUser(user);
    res.cookie("token",token);
    return res.redirect("/");
};

async function logoutUser(req,res){
    req.session.destroy(() => {
    res.clearCookie("connect.sid"); 
    res.redirect("/login");
  });
};

async function uploadProfileImage(req,res){
     if (!req.file) return res.redirect("/");

  await User.findByIdAndUpdate(req.body.userId, {
    profileImage: `/uploads/${req.file.filename}`
  });

  res.redirect("/");
};
module.exports={handlecreateUser,handlelogin,logoutUser,uploadProfileImage};