const { Router } = require("express");
const userRouter = Router();

const bcrypt = require("bcrypt");
const saltRounds = 5;

const { z } = require("zod");

const jwt = require("jsonwebtoken");
const {JWT_SECRET} = require("../config");

const { userModel, purchaseModel } = require("../database/db");
const {userMiddleware} = require("../middleware/userMiddleware")


userRouter.post("/signup" , async(req, res)=>{
   
   const requirebody = z.object({
    email:z.string().min(3).max(100).email(),
    password:z.string().min(3).max(100),
    firstname:z.string().min(3).max(100),
    lastname:z.string().min(3).max(100)
   })

   const parseData = requirebody.safeParse(req.body);
   
   if(!parseData.success){
    res.status(422).json({
        message: "incorrect format" , 
        error: parseData.error    
    })
    return
   }

   const {username , email , password} = req.body;
    
    const hashedPassword =await bcrypt.hash(password, saltRounds)
 
try{ 
    await userModel.create({
        username : username,
        email : email ,
        password : hashedPassword
    })
}catch(e){
    res.json("user already exists");
}
    res.json({
        message: "You are SignedUp"
    })
})


userRouter.post("/signin" , async(req, res)=>{
    const { email , password }= req.body ;

    const response = await userModel.findOne({
        email
    })

    if(!response){
        res.json({
            message: "email not found in db "
        })

    }

    const passwordMatch =  bcrypt.compare(password , response.password);
    if(passwordMatch){
        const token = jwt.sign(
            {id: response._id}, 
            JWT_SECRET);

        res.json({ 
            token : token
        })
    }else{
       res.status(404).json({
            message: " user not found "
        })
    }

})

userRouter.post("/purchase" ,userMiddleware ,  async(req, res)=>{
   const userId= req.userId
    const purchases = await purchaseModel.find({
        userId
    })

    res.json({
        purchases
    })
})



module.exports = {
userRouter: userRouter
}