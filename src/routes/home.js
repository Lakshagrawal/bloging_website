const express = require('express')
const router = express.Router()
const blogs = require('../models/blog')


router.get('/',async(req,res)=>{
    const arr = await blogs.find();
    
    res.render('home',{data:arr});
    // res.send(data_blog)
})

module.exports = router;