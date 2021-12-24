const mongoose = require("mongoose");

const userGroupSchema = new mongoose.Schema({
    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Group",
        required: true
    },
    user:{ 
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true
    },
    groupRole:{
        type:String,
        default:"member",
        enum:["member", "admin", "helper"]
    },
    status:{
        type:String,
        default:"joined"
    }
}, {timestamps: true});

const UserGroup = mongoose.model("UserGroup", userGroupSchema);

module.exports = UserGroup;