const mongoose = require("mongoose");
const {v4: uuidv4} = require("uuid");

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
    slug:{
        type:"String"
    },
    invitationLinks:{
        type:[
            {
                link:{
                    type: String,
                    required:true
                },
                uuid:{
                    type: String,
                    required: true,
                },
                expiresAt:{
                    type: Date,
                    required: true,
                    default: Date.now() + 1000*60*60*24*7
                }
            }
        ]
    }
}, {timestamps: true,
    toJSON: {virtuals: true},
    toObject: {virtuals: true}});

groupSchema.methods.generateSlug = function(){
    return this.name.replace(/\s/g, "-").toLowerCase()+".noticeboard.app";
}

groupSchema.pre("save", async function(next){
    if(!this.slug){
        this.slug = this.generateSlug();
    }
    next();
});

groupSchema.methods.generateLink = async function(){
    const uuid = uuidv4();
    let link = this.slug+"/invite/"+uuid;
    const invitationLink = {
        link: link,
        uuid: uuid,
    }
    this.invitationLinks.push(invitationLink);
    await this.save();
    return link;
};
const Group = mongoose.model("Group", groupSchema);
module.exports = Group;