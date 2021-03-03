const mongoose = require("mongoose");
const {Role} = require("../roles");

const User = mongoose.model("User", new mongoose.Schema({
    name: {type: String, required: true, minlength: 3, maxlength: 50},
    email: {type: String, required: true},
    password: {type: String, requried: true, minlength: 8, maxlength: 100},
    role: {type: String, required: true, default:Role.basic, enum: ["basic", "admin"]}
}));

exports.User = User;