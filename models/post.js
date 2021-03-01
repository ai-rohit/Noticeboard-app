const mongoose = require("mongoose");

const Post = mongoose.model("Post", new mongoose.Schema({
    postHeader: {type: String, required: true, minlength: 15, maxlength: 50},
    postBody: {type: String, required: true, minlength: 30, maxlength: 20},
    postDate: {typep: Date, required: true}
}));

module.exports.post = Post;