const express = require('express')
const router = express.Router()
const blogs = require('../models/blog')
const widgetText= require("../models/widgetText");


router.get('/',async(req,res)=>{
    const arr = await blogs.find();
    let n = arr.length;
    // console.log(arr);
    for(let i=0;i<n;i++){
        let s = "";
        let m = arr[i].context.length;
        // console.log(m);
        for(let j=0;j<Math.min(m,500);j++){
            s += arr[i].context[j];
        }
        
        arr[i].context = s;
    }
    let widget = await widgetText.findOne();
    // console.log(widget);
    res.render('home',{data:arr,text:widget});
    // res.send(data_blog)
})

router.get('/fullBlog/:id',async(req,res)=>{

    let _id = req.params.id;
    // console.log(_id);
    
    let arr= await blogs.find({"_id":_id});
    let widget = await widgetText.findOne();
    res.render('FullOpenBlog',{data:arr,text:widget});
    // res.send(data_blog)
})

module.exports = router;