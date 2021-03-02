const express = require("express");
const {User} = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { userValidationRules } = require("../validations/validation");

const router = express.Router();

router.post("/", userValidationRules(), async (req, res)=>{
    let email = req.body.email;
    let password = req.body.password;

    try{
        await User.find({email: email}, async (error, users)=>{
            
            if(error){
                res.status(500).send({status:"error", message: "Something went wrong"})
            }

            if(users.length>0){
                if(await bcrypt.compare(password, users[0].password)){
                    const token = jwt.sign({userId: users[0]._id, name: users[0].name}, process.env.JWT_PRIVATE_KEY, {expiresIn: "10d"});
                    //res.header('auth-token', token);
                    return res.status(200).send({status: "success", data: {token: token}});
                }else{
                    //console.log(result);
                    return res.status(400).send({status: "fail", message: "Password Incorrect"});
                }
            }else{
                return res.status(400).send({status: "fail", message: "email not found"});
            }
            
        });
    }catch(ex){
        res.status(500).send({status: "error", message: "something went wrong"});
    }
        
   
    
});

module.exports = router;