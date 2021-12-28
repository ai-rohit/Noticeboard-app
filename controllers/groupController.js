const Group = require("../models/group");
const UserGroup = require("../models/userGroup");
const CustomError = require("../helpers/CustomError")
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
        const myGroups = await Group.find({createdBy: req.user._id}).populate("group");
        return res.json({
            status:"success",
            data:{
                groups:myGroups
            }
        })
    }),
    getGroupMembers: wrapAsync(async (req, res, next) => {
        const groupMembers = await UserGroup.find({group: req.params.id},{"user":1, "groupRole":1}).populate("user", ["name", "email"]);
        return res.json({
            status:"success",
            data:{
                members: groupMembers
            }
        })
    }),
    createGroup: wrapAsync(async (req, res, next) => {
        console.log(req.user);
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
    }),
    generateGroupLink: wrapAsync(async (req, res, next) => {
        const group = await Group.findById(req.params.id);
        if(!group) return next(new CustomError("No group exists", 404));
        if(group.invitationLinks.length >= 10){
            return next(new CustomError("Maximum number of invitation-links reached", 400));
        }
        const link = await group.generateLink();
        return res.json({
            status:"success",
            data:{
                link
            }
        })
    }),
    joinGroup: wrapAsync(async (req, res, next) => {
        const inviteLink = req.body.link;
        const slug = inviteLink.split("/")[0];
        const uuid = inviteLink.split("/")[2];
        const group = await Group.findOne({slug});
        if(!group){
            return next(new CustomError("The invitation link seems to be broken", 404));
        }
        const groupUser = await UserGroup.findOne({group: group._id, user: req.user._id});
        if(groupUser){
            return next(new CustomError("You are already a member of this group", 400));
        }
        const invitationLinks = group.invitationLinks.filter(link =>
            {
                return link.uuid === uuid && link.link === inviteLink;
            } );
        if(invitationLinks.length === 0){
            return next(new CustomError("The invitation link seems to be broken", 404));
        }
        const isExpired = invitationLinks[0].expiresAt < Date.now();
        if(isExpired){
            return next(new CustomError("The invitation link has expired", 400));
        }
        const newGroupUser = new UserGroup({
            group: group._id,
            user: req.user._id
        })
        try{
            await newGroupUser.save();
            return res.json({
                status:"success",
                data:{
                    group: group
                }
            })
        }catch(ex){
            return next(new CustomError(ex.stack, 400));
        }
    }),
    leaveGroup: wrapAsync(async (req, res, next) => {
        const group = await Group.findById(req.params.id);
        if(!group) return next(new CustomError("No group exists", 404));
        const groupUser = await UserGroup.findOne({group: group._id, user: req.user._id});
        if(!groupUser) return next(new CustomError("You are not a member of this group", 400));
        await groupUser.remove();
        return res.json({
            status:"success",
            data:{
                group: group
            }
        })
    }),
    removeGroupUser: wrapAsync(async (req, res, next) => {
        const group = await Group.findById(req.params.id);
        if(!group) return next(new CustomError("No group exists", 404));
        const groupUser = await UserGroup.findOne({group: group._id, user: req.body.user});
        if(!groupUser) return next(new CustomError("The user is not a member of this group", 400));
        await groupUser.remove();
        return res.json({
            status:"success",
            data:{
                group: group
            }
        })
    })
};