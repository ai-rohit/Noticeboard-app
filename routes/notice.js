const express = require("express");
const {verifyLogin} = require("../middlewares/verifyLogin");
const {noticeValidationRules} = require("../validations/validation");
const {noticePermissions} = require("../middlewares/authorization");
const {Notice} = require("../models/notice");

const {validationResult} = require("express-validator");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.get("/", async(req, res)=>{
    try{
        await Notice.find({}).populate('noticeAuthor','name -_id').select('noticeTitle noticeDate noticeDescription noticeAuthor').exec((error, notice)=>{

            if(error){
                return res.send({status: "error", message: error});
            }
            return res.status(200).send({status: "success", data:{notice: notice}});
        });
    }catch(ex){
        return res.status(400).send({status: "error", message: "Something went wrong"});
    }
});

router.post("/", noticeValidationRules(), verifyLogin, async (req, res)=>{

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.send({status: "fail", message: errors.array()[0].msg})
    }

    try{
        const user = req.user;
        const noticeDetails = {
                        noticeTitle: req.body.noticeTitle,
                        noticeDescription: req.body.noticeDescription,
                        noticeAuthor: user.userId
                        }
        const notice = new Notice(noticeDetails);
        const result = await notice.save();
        return res.send({status: "success", data:{notice: result}});  
    }catch(ex){
        return res.send({status: "error", message: "Something went wrong"});
    }

});

router.delete("/delete/:id", verifyLogin, noticePermissions, async (req, res)=>{
    const id = req.params.id;
    try{
        await Notice.deleteOne({_id: id}, (error, result)=>{
            if(error){
                return res.status(400).send({status: "error", message: "Something went wrong"});
            }
            return res.status(200).send({status: "success", data: null});
    });
    }catch(ex){
        return res.status(404).send({status: "error", message: "Something went wrong"});
    }
});

router.put("/update/:id", verifyLogin, noticePermissions, noticeValidationRules(), async(req, res)=>{
    const id = req.params.id;
    const noticeDescription = req.body.noticeDescription;
    
    try{   
        await Notice.findById(id, (error, notice)=>{
            if(error) return res.status(400).send({Status: "error", message: "Something went wrong"});

            if(!notice) return res.status(400).send({status: "fail", data:{notice: "No notice exists"}});

            notice.set({noticeDescription: noticeDescription});
            notice.save((error, result)=>{
                if(error){
                    return res.status(400).send({status: "error", message: "something went wrong"});
                }
                return res.status(200).send({status: 'success', data:{notice: "updated"}});
            });
            
        });
    }catch(ex){
        return res.status(400).send({status:"error", message: "Something went wrong"});
    }
});

module.exports = router;