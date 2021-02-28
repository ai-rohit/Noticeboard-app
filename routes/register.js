//import modules
const express = require("express");
//const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const {User} = require("../models/user");
const router = express.Router();

router.post("/", async (req, res)=>{
    let name = req.body.name;
    let email = req.body.email;
    let password = req.body.password;
    let confirmPassword = req.body.confirmPassword;

    const result = await User.find({email: email});
    if(result.length>0){
        return res.status(400).send({status: false, message:"User already registered"});
    }

    if(password!=confirmPassword){
        return res.status(400).send({status: false, message:"Password & confirm password doesn't match"})
    }

    try{
    let user = new User({name: name, email: email, password: bcrypt.hashSync(password, 8), confirmPassword: bcrypt.hashSync(confirmPassword, 8)});
    user = await user.save();

    return res.status(200).send({status: "true", message: "user registered", field: user})
    }catch(err){
        console.log(err.message);
    }
});

module.exports = router;