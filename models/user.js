const mongoose = require("mongoose");

const User = mongoose.model("User", new mongoose.Schema({
    name: {type: String, required: true, minlength: 3, maxlength: 50},
    email: {type: String, required: true},
    password: {type: String, requried: true, minlength: 8, maxlength: 100},
    confirmPassword: {type: String, requried: true, minlength: 8, maxlength: 100},
}));

exports.User = User;