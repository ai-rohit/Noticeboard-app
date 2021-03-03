const {Role} = require("../roles");

function getUserAuthorization(req, res, next){
    const user = req.user;

    try{
        if(user.role === Role.admin){
            next()
        }else{
            return res.status(401).send({status: "fail", message: "unauthorized access"})
        }
    }catch(ex){
        return res.status(404).send("Something went wrong");
    }

}

module.exports.getUserAuthorization = getUserAuthorization;