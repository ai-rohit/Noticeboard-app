//import modules
const express = require("express");
//const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const {validationResult} =require("express-validator");
const {userValidationRules} = require("../validations/validation");

const {User} = require("../models/user");
const router = express.Router();

router.post("/", userValidationRules(),
                       async (req, res)=>{

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({status: "fail", message: errors.array()[0].msg});
    }

    const userData = {
        name : req.body.name,
        email : req.body.email,
        password : await bcrypt.hashSync(req.body.password, 8)
    } 
    
    try{
        User.find({email: req.body.email}, async (error, users)=>{

            if (error) return res.status(500).send({error: error});

            if(users.length>0){
                res.status(400).send({status: "fail", message: "User already registered."});
                return;
            }else{
                const user = new User(userData);
                const result = await user.save();
                return res.send({status: true, message: "User registered", result: result});
                
            }; 
        })
    }catch(ex){
        console.error("Something went wrong");
    }
});

module.exports = router;