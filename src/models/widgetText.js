require('dotenv').config()
const mongoose = require("mongoose")


const widgetText = new mongoose.Schema({
    widgettext:{type:String},
    about:{type:String},
})


module.exports = mongoose.model('widgetText',widgetText);