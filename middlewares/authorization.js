const mongoose = require("mongoose");
const { Notice } = require("../models/notice");
const {User} = require("../models/user");
const {Role} = require("../roles");


function getUserAuthorization(req, res, next){
    const user = req.user;

    try{
        if(user.role === Role.admin){
            next()
        }else{
            return res.status(401).send({status: "fail", message: "unauthorized access"})
        }
    }catch(ex){
        return res.status(404).send("Something went wrong");
    }

}

async function noticePermissions(req, res, next){
    const user = req.user;
    const noticeId = req.params.id;
    try{
        await Notice.findById(noticeId, {_id:0})
                    .select("noticeAuthor")
                    .populate("noticeAuthor", "_id")
                    .exec((error, noticeDetail)=>{
                        if(error){
                            return res.status(400).send({status: "error", message:error.message});
                        }else{
                            if(noticeDetail.noticeAuthor._id==user.userId || user.role === Role.admin){
                                next();
                            }else{
                                
                                return(res.status(400).send({status:"fail", message:"Unauthorized to perform the action"}))
                            }
                        }
                    });
    }catch(ex){
        return res.status(400).send({status:"error", message:"Something went wrong"});
    }

}

function deleteUserPermission(req, res, next){
    const user = req.user;
    try{
        if(user.role === Role.admin || user.userId == req.params.id){
            next();
        }else{
            return res.status(401).send({status: "fail", message: "unauthorized access"})
        }
    }catch(ex){
        return res.status(404).send({status: "error",message:"Something went wrong"})
    }
}

module.exports.getUserAuthorization = getUserAuthorization;
module.exports.deleteUserPermission = deleteUserPermission;
module.exports.noticePermissions = noticePermissions;