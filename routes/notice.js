const express = require("express");
const multer = require("multer");

const {verifyLogin} = require("../middlewares/verifyLogin");
const {noticeValidationRules, editNoticeValidationRules} = require("../validations/validation");
const {noticePermissions} = require("../middlewares/authorization");
const {Notice} = require("../models/notice");

const {validationResult} = require("express-validator");

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, "./uploads");
    },
    filename: function(req, file, cb){
        cb(null, file.originalname);
    }
});

const fileFilter = (req, file, cb)=>{
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null, true);
    }else{
        cb(null, false);
    }
}

const upload = multer({storage: storage,
                       limits:{fileSize: 1024*1024*5},
                       fileFilter: fileFilter});

const type = upload.single("noticeImage");

const router = express.Router();


//get all notice
router.get("/",
          async(req, res)=>{
            try{
                await Notice.find({}).
                populate('noticeAuthor','name -_id')
                .select('noticeTitle noticeDate noticeDescription noticeImage noticeAuthor')
                .exec((error, notice)=>{
                    if(error){
                        return res.send({status: "error", message: error});
                    }
                    return res.status(200).send({status: "success", data:{notice: notice}});
                });
            }catch(ex){
                return res.status(400).send({status: "error", message: "Something went wrong"});
            }
        });

//get posted notice
router.get("/my",
          verifyLogin, 
          async(req, res)=>{
            try{
                const user = req.user;
                await Notice.find({noticeAuthor: user.userId}, (error, notice)=>{
                    if(error){
                        return res.status(400).send({status: "error", message: "something went wrong while getting your notices!"});
                    }
                    return res.status(200).send({status: "success", data:{notice: notice}});
                });
            }catch(ex){
                return res.status(400).send({status: "error", message: "Can't get notices"});
            }
         });

//post notice
router.post("/",
            verifyLogin,
            type, 
            noticeValidationRules(),  
            async (req, res)=>{
                const errors = validationResult(req);
                if(!errors.isEmpty()){
                    const param = errors.array()[0].param;    
                    const error = errors.array()[0].msg;
                    return res.send({status: "fail", data:{[param]: error}})
                }

                if(!req.file){
                    return res.status(400).send({status:"fail", data: {image: "No file selected"}});
                }

                try{
                    const user = req.user;
                    const noticeDetails = {
                                    noticeTitle: req.body.noticeTitle,
                                    noticeDescription: req.body.noticeDescription,
                                    noticeImage: req.file.path,
                                    noticeAuthor: user.userId
                                    }
                    const notice = new Notice(noticeDetails);
                    const result = await notice.save();
                    return res.send({status: "success", data:{notice: result}});  
                }catch(ex){
                    return res.send({status: "error", message: ex.message});
                }
            });

//delete notice
router.delete("/:id",
             verifyLogin, 
             noticePermissions, 
             async (req, res)=>{
                const id = req.params.id;
                try{
                    await Notice.deleteOne({_id: id}, (error, result)=>{
                        if(error){
                            return res.status(400).send({status: "error", message: error.message});
                        }
                        return res.status(200).send({status: "success", data: null});
                });
                }catch(ex){
                    return res.status(404).send({status: "error", message: ex.message});
                }
            });


//Update notice
router.put("/:id",
          verifyLogin, 
          noticePermissions, 
          type, 
          editNoticeValidationRules(), 
          async(req, res)=>{
            const id = req.params.id;
            try{   
                await Notice.findById(id, (error, notice)=>{
                    if(error) return res.status(400).send({Status: "error", message: "Something went wrong"});

                    if(!notice) return res.status(400).send({status: "fail", data:{notice: "No notice exists"}});

                    //notice.set({noticeDescription: noticeDescription});
                    if(!req.body.noticeTitle && !req.body.noticeDescription && !req.file){
                        return res.status(400).send({status:"fail", data: {update: "Atleast try to update a field"}})
                    }

                    if(req.body.noticeTitle){
                        notice.noticeTitle = req.body.noticeTitle;
                    }
                    
                    if(req.body.noticeDescription){
                        notice.noticeDescription = req.body.noticeDescription;
                    }

                    if(req.file){
                    notice.noticeImage = req.file.path;
                    }
                    notice.save((error, result)=>{
                        if(error){
                            return res.status(400).send({status: "error", message: error.message});
                        }
                        return res.status(200).send({status: 'success', data:{notice: "updated"}});
                    });
                    
                });
            }catch(ex){
                return res.status(400).send({status:"error", message: "Something went wrong"});
            }
           });

module.exports = router;