//import modules
const express = require("express");
//const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const {body, validationResult} =require("express-validator");

const {User} = require("../models/user");
const router = express.Router();

router.post("/", 
            body('name').isLength({min: 3}).withMessage("Name length less than 3"),
            body('email').isEmail().isLength({min: 7, max: 30}),
            async (req, res)=>{

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
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