const { Router } = require("express");
const { purchaseModel } = require("../database/db");
const {courseModel} = require("../database/db");
const {userMiddleware} = require("../middleware/userMiddleware")
const courseRouter = Router();

courseRouter.post("/purchases" , userMiddleware , async(req, res)=>{
    const {userId , courseId} =req.body;
    const alreadyBought = await purchaseModel.findOne({
        userId,
        courseId
    })
    if(alreadyBought){
        res.json({message : "course already purchased ! "})
        return
    }
    const purchase  = await purcahseModel.create({
        userId,
        courseId
    })

    res.json({
        message: "You are now successfully enrolled",
        purchaseId: purchase._id
    })


})    

courseRouter.get("/preview"  , async(req,res)=>{
    const course = await courseModel.find({});
    res.json({
        course
    })
})
module.exports ={  
    courseRouter:courseRouter
}