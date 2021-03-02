const express = require("express");
const {verifyLogin} = require("../middlewares/verifyLogin");
const {noticeValidationRules} = require("../validations/validation");
const {Notice} = require("../models/notice");

const {validationResult} = require("express-validator");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.get("/", async(req, res)=>{
    try{
        await Notice.find({}, (error, notice)=>{
            if(error){
                return res.send({status: "error", message: "Something went wrong"});
            }
            return res.status(200).send({status: "success", data:{notice: notice}});
        });
    }catch(ex){
        return res.status(400).send({status: "error", message: "Something went wrong"});
    }
});

router.post("/", noticeValidationRules(), verifyLogin,async (req, res)=>{

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log(new Date());
        return res.send({status: "fail", message: errors.array()[0].msg})
    }

    try{
        const noticeDetails = {
                        noticeTitle: req.body.noticeTitle,
                        noticeDescription: req.body.noticeDescription,
                        noticeAuthor: req.body.noticeAuthor
                        }
        const notice = new Notice(noticeDetails);
        const result = await notice.save();
        return res.send({status: "success", data:{notice: result}});  
    }catch(ex){
        return res.send({status: "error", message: "Something went wrong"});
    }

});

module.exports = router;