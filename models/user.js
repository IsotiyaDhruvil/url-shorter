const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{ 
        type:String,
        required:true,
        unique:true,
    },
    role:{
        type:String,
        required:true,
        default:"USER",
    },
    password:{ 
        type:String,
        required:true,
    },
    profileImage:{
        type:String,
        default:""
    }

}, 
{ timestamps: true }
);

const user = mongoose.model("user",userSchema);
module.exports = user;