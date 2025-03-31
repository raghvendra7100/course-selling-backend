const mongoose = require("mongoose");
console.log('connected to ')
mongoose.connect(process.env.Mongo_URL)


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
const purchaseModel = mongoose.model("purchase" , Purchase)

module.exports =({
    userModel,
    adminModel,
    courseModel,
    purchaseModel
})