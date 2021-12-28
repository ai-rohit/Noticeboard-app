const mongoose = require("mongoose");
const {Role} = require("../roles");

const usersSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: true,
        minlength: 3, 
        maxlength: 50
        },
    email: {
        type: String,
        unique: true,
        required: true
        },
    password: {
            type: String, 
            requried: true, 
            minlength: 8, 
            maxlength: 100
            },
    role: {
        type: String, 
        required: true, 
        default:Role.basic, enum: ["basic", "admin"]
    },
    userType:{
        type:String,
        enum:["local", "google", "facebook"],
        default:"local"
    }
}, {timestamps: true,
    toJSON:{virtuals:true},
    toObject:{virtuals: true}});

usersSchema.virtual("notices", {
    ref:"Notice",
    localField:"_id",
    foreignField: "noticeAuthor"
})
const User = mongoose.model("User", usersSchema);

exports.User = User;