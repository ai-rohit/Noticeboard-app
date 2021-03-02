const jwt = require("jsonwebtoken");

const verifyLogin = (req, res, next)=>{

    try{
        const token = req.header("Authorization").split(" ")[1];

        if(!token) return res.send({status: "error", message: "Can't access! Needs login to continue"});

        const user = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
        // console.log("Token:", token);
        //console.log(user);
        req.user = user;
        next();
    }catch(ex){
        return res.send({status: "error", message: "Access denied"});
    }
}

module.exports.verifyLogin = verifyLogin;