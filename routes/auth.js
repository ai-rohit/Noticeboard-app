const express = require("express");
const {User} = require("../models/user");
const bcrypt = require("bcrypt");

const router = express.Router();

router.post("/", async (req, res)=>{
    let email = req.body.email;
    let password = req.body.password;

    try{
        await User.find({email: email}, async (error, users)=>{
            
            if(error){
                res.status(500).send({status:"error", message: "Something went wrong"})
            }

            if(users.length>0){
                if(await bcrypt.compare(password, users[0].password)){
                    return res.status(200).send({status: "success", message: "Logged in successfully"});
                }else{
                    //console.log(result);
                    return res.status(400).send({status: "fail", message: "Password Incorrect"});
                }
            }else{
                return res.status(400).send({status: "fail", message: "email not found"});
            }
            
        });
    }catch(ex){
        console.error(ex);
    }
        
   
    
});

module.exports = router;