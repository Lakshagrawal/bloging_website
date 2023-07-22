require('dotenv').config()
const mongoose = require("mongoose")


const Blog = new mongoose.Schema({
    sr:{type:Number,required:true},
    date:{type:Date,required:true},
    title:{type:String,required:true},
    context:{type:String,required:true},
    user:{type:String,required:true}
})


module.exports = mongoose.model('blogs',Blog);