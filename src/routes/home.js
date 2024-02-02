const express = require('express')
const router = express.Router()
const blogs = require('../models/blog')
const widgetText= require("../models/widgetText");


router.get('/',async(req,res)=>{
    let NewPage = req.query.page;
    console.log("hello: page number is " + NewPage);
    if(NewPage == undefined) NewPage = 1;

    const arr = await blogs.find();
    // arr.reverse();
    let n = arr.length;

    if(NewPage <=0) NewPage = 1;
    else if(NewPage >= (n+4)/5) NewPage = 1;
    else if(NewPage <= 0) {
        NewPage = (n+4)/5;
    }
    req.query.page = NewPage;
    
    let maxPage = Math.ceil(n/5.0);
    let st = (NewPage-1)*5;
    let en = Math.min(NewPage*5,n);
    console.log(n);
    console.log(st+"  "+en);

    let nums = [];
    let j = 0;
    for(let i=st;i<en;i++){
        let s = "";
        let m = arr[i].context.length;
        // console.log(m);
        for(let j=0;j<Math.min(m,500);j++){
            s += arr[i].context[j];
        }
        arr[i].context = s;
        nums[j] = arr[i];
        ++j;
    }
    
    let widget = await widgetText.findOne();
    // widget.maxNumPage = n;
    // console.log(widget);
    res.render('home',{data:nums,text:widget});
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