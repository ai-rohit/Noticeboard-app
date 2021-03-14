const express = require("express");
const bcrypt = require("bcrypt");
const {validationResult} =require("express-validator");
const {userValidationRules} = require("../validations/validation");

const {User} = require("../models/user");
const router = express.Router();

router.post("/", 
            userValidationRules(),
            async (req, res)=>{
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                const param = errors.array()[0].param;    
                const error = errors.array()[0].msg;
                return res.status(400).send({status: "fail", data:{[param]: error}});
                }

                const userData = {
                    name : req.body.name,
                    email : req.body.email,
                    password : await bcrypt.hashSync(req.body.password, 8)
                } 
                
                try{
                    User.find({email: req.body.email}, async (error, users)=>{

                        if (error) return res.status(500).send({status: "error", message: error.message});

                        if(users.length>0){
                            res.status(400).send({status: "fail", data:{user: "User already registered."}});
                            return;
                        }else{
                            const user = new User(userData);
                            const result = await user.save();
                            return res.send({status: "success", data:{user: user}});
                        }; 
                    })
                }catch(ex){
                    res.status(500).send({status: "error", message: ex.message});
                }
            });

module.exports = router;