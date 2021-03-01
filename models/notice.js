const mongoose = require("mongoose");

const Notice = mongoose.model("Notice", new mongoose.Schema({
    noticeTitle: {type: String, required: true, minlength: 15, maxlength: 50},
    noticeDescription: {type: String, required: true, minlength: 30, maxlength: 20},
    noticeDate: {type: Date, required: true}
}));

module.exports.notice = Notice;