const {body, param} = require("express-validator");
const Group = require("../models/group");

function validateGroupId(){
    return [
        param("id").exists().custom(async (value, {req})=>{
            const group = await Group.findById(value);
            if(!group){
                return Promise.reject("Group not found");
            }
            req.group = group;
            return Promise.resolve();
        })
    ]
}

module.exports = {
    validateGroupId
}