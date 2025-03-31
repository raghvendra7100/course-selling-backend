const { Router } = require("express")

const bcrypt = require("bcrypt");
const saltRounds = 5; 

 const { z } = require("zod")

 const jwt = require("jsonwebtoken")
 const {JWT_ADMIN_SECRET} = require("../config");
 

const adminRouter= Router();
const { adminModel } = require("../database/db");
const {adminMiddleware} = require("../middleware/adminMiddleware");

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

     const{email , password , firstname , lastname} = req.body;

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
            JWT_ADMIN_SECRET
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
adminRouter.post("/course" , adminMiddleware , async(req ,res)=>{
    const adminId = req.adminId;
    const {title , description , price , imageURL }= req.body;

    await courseModel.create({
        title, 
        description , 
        imageURL , 
        price ,
        creatorId : adminId
    })
    res.json({
        message: "new course is successfully created",
        courseId: course._id
    })
})
adminRouter.put("/course" , async(req ,res)=>{
    const adminId = req.adminId;
    const {title   ,description ,   imageURL , price , courseId} = req.body;

    await coureseModel.updateOne({
        creatorId,
        _id: courseId
    } , {
        title, 
        description , 
        price,
        imageURL,
        creatorId : adminId
    })

    res.json({
        message: "Course update successful",
        courseId: courseId
    })
})
adminRouter.get("/course/bulk" , async(req ,res)=>{
    const adminId  = req.adminId;
    const courses = await courseModel.find({
        creatorId: adminId
    })

    res.json({
        courses
    })
})

module.exports = { 
    adminRouter: adminRouter
}