const { Router } = require("express")

const bcrypt = require("bcrypt");
const saltRounds = 5; 

 const { z } = require("zod")

 const jwt = require("jsonwebtoken")
 const JWT_SECRET = "hello";
 

const adminRouter= Router();
const { adminModel } = require("../database/db");
const user = require("./user");
adminRouter.post("/signup" , async(req ,res)=>{
    const requirebody = z.object({
        email: z.string().min(3).max(100).email(),
        password: z.string().min(3).max(100),
        firstname: z.string().min(2).max(100),
        lastname:z.string().min(3).max(100)
    })
    const parseData =requirebody.safeParse(req.body);

    if(!parseData.success){
        res.json({message:"incorrect format",
            error:parseData.error
        })
        
        return
    }

     const email =req.body.email;
     const password = req.body.password;
     const firstname = req.body.firstname ;
     const lastname = req.body.lastname

    const hashedPassword = await bcrypt.hash(password ,saltRounds)
try{
    await adminModel.create({
        email: email,
        password: hashedPassword,
        firstname: firstname,
        lastname: lastname
     })
    }catch(e){
        console.log("User already exists");
    }
     res.json({
        message: "You are Succeessfully Signedup"
     })
})


adminRouter.post("/signin" , async(req ,res)=>{
    const email =req.body.email;
    const password = req.body.password;
  
    const response = await adminModel.findOne({
        email
    })

    if(!response){
        res.json({message: "incorrect email"});
    }

    const passwordMatch = bcrypt.compare(password , response.password)
    
    if(passwordMatch){
          const token = jwt.sign({
            id: response._id.toString() },
            JWT_SECRET
        );
        res.json({
            token: token
        })
    }else{
        res.status(404).json({
            message: "User not found"
        })
    }
    

})
adminRouter.post("/course" , (req ,res)=>{

})
adminRouter.put("/course" , (req ,res)=>{

})
adminRouter.get("/course/bulk" , (req ,res)=>{

})

module.exports = { 
    adminRouter: adminRouter
}