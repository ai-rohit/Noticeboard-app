const mongoose = require("mongoose");

const Notice = mongoose.model("Notice", new mongoose.Schema({
    noticeTitle: {type: String, required: true, minlength: 3, maxlength: 100},
    noticeDescription: {type: String, required: true, minlength: 30, maxlength: 500},
    noticeDate: {type: Date, required: true},
    noticeAuthor: {type: String, required: true, minlength: 3, maxlength: 50}
    //noticeImage: {type:String}
}));

module.exports.Notice = Notice;