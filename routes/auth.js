const express = require("express");
const {User} = require("../models/user");
const bcrypt = require("bcrypt");

const router = express.Router();

router.post("/", async (req, res)=>{
    let email = req.body.email;
    let password = req.body.password;

    const result = await User.find({email: email});
    if(result.length>0){
        if(await bcrypt.compare(password, result[0].password)){
            return res.status(200).send({status: true, message: "Logged in successfully"});
        }else{
            //console.log(result);
            return res.status(400).send({status: false, message: "Password Incorrect"});
        }
    }else{
        return res.status(400).send({status: false, message: "email not found"});
    }
    
    
});

module.exports = router;