const express = require('express')
const router = express.Router()
const blog = require("../models/blog")
const newUser = require('../models/newUser');
const cookieParser = require("cookie-parser")
const verifying = require("../middleware/verifying")
const jwt = require("jsonwebtoken");

// use of json file in the router or || app file 
router.use(express.json());
router.use(cookieParser())
const  bodyParser = require("body-parser");
router.use(bodyParser.urlencoded({
    extended:true
}))



// --->  /user

router.get("/",(req,res)=>{
    // **********/////////**************
    // frontend copy to 
    // https://styleshout.com/demo/?theme=keepitsimple
    res.render('login');
})
router.get("/registration",(req,res)=>{
    res.render("signup");
})
router.get("/postyourblog",verifying,(req,res)=>{
    res.render("blog")
})
router.get("/logOut",async(req,res)=>{
     res.clearCookie("jwtoken");
     res.redirect('/user');
})


// Done
router.post("/VerifySignup",async(req,res)=>{
    // console.log(req.body);
    const {name,email,pass,cpass,user} = req.body;
    if(!name || !email || !pass || !cpass || !user || (pass != cpass)){
        res.redirect("/user/registration")
    }
    else{
        let url = "http://localhost:8080/api/signUp";
        try{

            let apiVerify = await fetch(url,{
                method:"POST",
                headers:{
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(
                    req.body
                ),
                redirect: 'follow'
            })
            let vall = await apiVerify.json();
            let statusCode = await apiVerify.status;
            // console.log(statusCode);

            if(statusCode === 200){  
                // console.log("success in user creation, take time to verify it by the admin");
                res.write("<h1>Success in user creation, take time to verify it by the admin</h1>")
                res.write('<a href="/user">Login in</a>')
                res.send();
            }
            else{
                res.send(vall);
            }

            // if(statusCode === 409){
            //     res.send("There is same // User or Email // is available please choice different User name")
            // }
            // else if(statusCode === 200){  
            //     console.log("success in user creation, take time to verify it by the admin");
            //     res.render("login");
            // }
            // else if(statusCode === 500){
            //     res.send("Internal Server Error, Contact to the developer");
            // }
            // else{
            //     res.redirect("/user/registration")
            // }
        }
        catch(err){
            console.log(err);
            res.status(400).send("Not able to Registration user")
        }
    }
})





// Done
router.post("/verifyLogin",async(req,res)=>{
    // console.log("login-in");
    // console.log(req.body);

    let url = "http://localhost:8080/api/signIn";

    
    let {user,pass} = req.body;

    if(!user || !pass){
        res.redirect("/user")
    }
    else{
        let apiVerify = await fetch(url,{
            method:"POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(req.body),
            redirect: 'follow'
        })
        // console.log(apiVerify);
        let vall = await apiVerify.json();
        // console.log(vall);

        let statusCode = apiVerify.status;
        if(statusCode===200){
            const token = vall.message;
            res.cookie("jwtoken",token,{
                expires :new Date(Date.now()+1260000),
                httpOnly:true,
                // //secure is use in the production 
                // secure:true 
            });
            res.render('blog');
        }
        else{
            res.send(vall);
        }
        // if(statusCode === 404){
        //     res.send('Enter valid email and password');
        //     // res.render("login");
        // }
        // else if(statusCode === 400){
        //     // Incorect user and password
        //     res.send('Invalid email and password');
        //     // res.render("login");
        // }
        // else if(statusCode === 302){
        //     // alert("Not verify by the admin, First verify to post your request");
        //     res.send("Not verify by the admin");
        //     // res.render("login");
        // }
        // else if(statusCode===200){
        //     res.render('admin');
        // }
        // else{
        //     res.render("login");
        // }
    }
    
    
})







router.post("/postBlog",async(req,res)=>{
    
    const {title,context} =  req.body;
    
    if(!title || !context){
        res.status(400).send("Please fill the data");
    }
    else{
        let arr = await blog.find({});
        let n = arr.length;
        let thereisduplicate = false;
        
        const token = await req.cookies.jwtoken;
        const verifyUser = await jwt.verify(token,process.env.SECRET_KEY_TOKEN)
        const user = await newUser.findOne({_id: verifyUser._id});

        for(let i=0;i<n;i++){
            if(arr[i].title === title){
                thereisduplicate = true;
                break;
            }
        }
        
        if(thereisduplicate === true){
            res.send("No same title is allow")
        }
        else{
            req.body.sr = n + 1;
            req.body.date = await new Date().toJSON();;
            req.body.user = user.name;
            // console.log(req.body);
            blog.create(req.body);
            
            res.write("<h1>Success in Blog Creation, Blog have been Save in the database</h1>")
            res.write('<a href="/user/postBlog">New Blog</a> <br> <br>')
            res.write('<a href="/">See Your blog</a>')
            res.send();
        }
        
    }
})
        

module.exports = router;