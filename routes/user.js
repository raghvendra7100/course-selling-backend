const { Router } = require("express");
const userRouter = Router();

const bcrypt = require("bcrypt");
const saltRounds = 5;

const { z } = require("zod");

const jwt = require("jsonwebtoken");
const JWT_SECRET = "hello";

const { userModel } = require("../database/db");



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

    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    
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
    const email = req.body.email;
    const password = req.body.password;

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

userRouter.post("/buy" , (req, res)=>{
    res.json({
        message: "working route"
    })
})



module.exports = {
userRouter: userRouter
}