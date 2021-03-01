const express = require("express");
const {User} = require("../models/user");

const router = express.Router();


router.get("/users", async (req, res)=>{
    try{
    const result = await User.find({}, (error, result)=>{
        if (error){
            return res.status(500).send({status: "error", message: "Something went wrong."});
        }
        if(result.length>0){
            return res.status(200).send({status: "success", data:{result}});
        }else{
            return res.status(404).send({status: "fail", message: "User not found."});
        }
    });

    res.status(400).send({status: true, message: "User retrieved successfully", data: result});
    }catch(ex){
        console.error(ex);
    }
});

router.get("/users/:name", async(req, res)=>{
    let name= req.params.name;

    const result = await User.find({name: name});
    res.send(result);
});

module.exports = router;