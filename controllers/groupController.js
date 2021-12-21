const Group = require("../models/group");
const UserGroup = require("../models/userGroup");

const wrapAsync = require("../helpers/wrapAsync");

module.exports = {
    getGroups: wrapAsync(async (req, res, next) => {
        const groups = await Group.find({});
        return res.json({
            status:"success",
            data:{
                groups: groups
            }
        })
    }),
    getGroup: wrapAsync(async (req, res, next) => {
        const group = await Group.findById(req.params.id);
        return res.json({
            status:"success",
            data:{
                group: group
            }
        })
    }),
    getMyGroups: wrapAsync(async (req, res, next) => {
        const myGroups = await UserGroup.find({user: req.user._id}).populate("group");
        return res.json({
            status:"success",
            data:{
                groups:myGroups
            }
        })
    }),
    getGroupMembers: wrapAsync(async (req, res, next) => {
        const groupMembers = await UserGroup.find({group: req.params.id},{"user":1}).populate("user");
        return res.json({
            status:"success",
            data:{
                members: groupMembers
            }
        })
    }),
    createGroup: wrapAsync(async (req, res, next) => {
        const group = new Group({
            name: req.body.name,
            description: req.body.description,
            createdBy: req.user._id
        });
        const result = await group.save();

        const groupUser = new UserGroup({
            group: result._id,
            user: req.user._id,
            groupRole: "admin"
        });
        try{
            await groupUser.save();
            return res.json({
                status:"success",
                data:{
                    group: result
                }
            })
        }catch(ex){
            await Group.deleteOne({_id: result._id});
            return res.json({
                status:"error",
                message: ex.message
            })
        }
    }),
    updateGroup: wrapAsync(async (req, res, next) => {
        const group = await Group.findById(req.params.id);
        if(!group) return res.json({
            status:"fail",
            message: "No group exists"
        })
        group.set({
            name: req.body.name,
            description: req.body.description
        });
        const result = await group.save();
        return res.json({
            status:"success",
            data:{
                group: result
            }
        })
    })
};