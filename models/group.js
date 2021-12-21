const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({
    name:{
        type:"String",
        required:true
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        required: true,
        ref:"User"
    },
    description:{
        type:"String"
    },
    status:{
        type:"String",
        default:"private",
    },
    image:{
        type:"String"
    },
    invitationLinks:{
        type:[
            {
                link:{
                    type: String,
                    required:true
                },
                expiresAt:{
                    type: Date,
                    required: true,
                    default: Date.now() + 1000*60*60*24*7
                }
            }
        ]
    }
}, {timestamps: true});

const Group = mongoose.model("Group", groupSchema);
module.exports = Group;