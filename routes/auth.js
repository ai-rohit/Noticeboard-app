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
                    const token = jwt.sign({userId: users[0]._id, name: users[0].name, role: users[0].role}, process.env.JWT_PRIVATE_KEY, {expiresIn: "10d"});

                    return res.status(200).send({status: "success", data: {token: token}});
                }else{
                    return res.status(400).send({status: "fail", data: {password: "Password Incorrect"}});
                }
            }else{
                return res.status(400).send({status: "fail", data: {email: "email not found"}});
            }
            
        });
    }catch(ex){
        res.status(500).send({status: "error", message: "something went wrong"});
    }
        
   
    
});

module.exports = router;