const { Router } = require("express")

const courseRouter = Router();

courseRouter.get("/preview"  , (req,res)=>{
    res.json({
        message: "working routes"
    })
})

courseRouter.get("/purchases" , (req, res)=>{
    res.json({
        message: "working routes"
    })
})    

module.exports ={  
    courseRouter:courseRouter
}