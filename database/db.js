const mongoose = require("mongoose");
console.log('connected to ')
mongoose.connect("mongodb+srv://admin:uvxW9TUWxQJ5VQWB@cluster0.eo1ds.mongodb.net/course-selling-app")


const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const User = new Schema({
    email : {type: String , unique:true},
    password: String,
    firstname: String,
    lastname: String
})

const Admin = new Schema({
    email : {type: String , unique:true},
    password: String,
    firstname: String,
    lastname: String
})

const Course = new Schema({
    title: String,
    Description : String , 
    Price : Number,
    imageURL: String,
    createrId: ObjectId
  
})

const Purchase = new Schema({
    userId : ObjectId,
    courseId: ObjectId
})

const userModel = mongoose.model("user" , User)
const adminModel = mongoose.model("admin" , Admin)
const courseModel = mongoose.model("course" , Course)
const purcahseModel = mongoose.model("purchase" , Purchase)

module.exports =({
    userModel,
    adminModel,
    courseModel,
    purcahseModel
})