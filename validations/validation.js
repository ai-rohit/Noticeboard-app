const {body} = require("express-validator");

const userValidationRules = ()=>{
    return [body('name').isLength({min: 3}).withMessage("Name length less than 3"),
    body('email').isEmail().withMessage("Email not valid").isLength({min: 7, max: 30}),
    body('password').isLength({min: 8, max:16}).withMessage("Password's length should be minimum 8 characters and maximum 16 characters")]
       
}

const noticeValidationRules = ()=>{
    return [body('noticeTitle').isString().withMessage("Not a valid Title").isLength({min: 3, max: 100}).withMessage("Title must be more than 3 and less than 100 charcaters."),
            body('noticeDescription').isString().withMessage("Not a valid Title").isLength({min: 30, max: 500}).withMessage("Description must exceed 30 and should be less than 500 characters"),
            //body('noticeDate').trim().isDate().withMessage("not a valid date"),
            //body('noticeAuthor').isString().withMessage("Not a valid author").isLength({min: 3, max: 50}).withMessage("Author name should be between 3 to 50 characters")]
            ]
}

module.exports.userValidationRules = userValidationRules;
module.exports.noticeValidationRules = noticeValidationRules;
