const mongoose = require("mongoose");

const noticeSchema = new mongoose.Schema({
    noticeTitle: {
                 type: String,
                 required: true,
                 minlength: 3,
                 maxlength: 100
                        },
    noticeDescription: {
                        type: String,
                        required: true,
                        minlength: 30, 
                        maxlength: 500
                    },
    noticeDate: {
                 type: Date,
                 required: true, 
                 default: Date.now()
                },
    noticeAuthor: {
                   type: mongoose.Schema.Types.ObjectId, 
                   ref: 'User'
                },
    group:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Group"
    },
    noticeImage: {
                type:String, 
                required: true
            }
}, {timestamps: true,
    toJSON:{virtuals:true},
    toObject:{virtuals: true}})
const Notice = mongoose.model("Notice", noticeSchema);

module.exports.Notice = Notice;