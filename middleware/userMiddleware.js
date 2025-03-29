const jwt = require("jsonwebtoken");
const {JWT_SECRET} = require("../config")

function userMiddleware(req , res , next){
    const token = req.headers.token;
    const decodedInfo = jwt.verify(token , JWT_SECRET);
    if(decodedInfo){
        const userId = decodedInfo.id;
        next();
    }else{
        res.status(403).json({
            message: "you are not signed in"
        })
    }

}

module.exports ={
    userMiddleware:userMiddleware
}