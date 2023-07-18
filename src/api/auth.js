const express = require("express");
const newUser = require("../models/newUser")
const bcrypt = require('bcrypt');

const router = express.Router();
let blog = require("../models/blog")

router.use(express.json());
require('dotenv').config()
const  bodyParser = require("body-parser");
router.use(bodyParser.urlencoded({
    extended:true
}))
  

// Done 
router.post('/signUp',async(req,res,next)=>{
    // console.log("this si sign up page *****************");
    // console.log(req.body);
    
    try{
        const {name,email,pass,cpass,user} = req.body;
        // console.log(req.body);
        let arr = await newUser.find({});
        let n = arr.length;
        let flag = false;

        for(let i=0;i<n;i++){
            if(arr[i].user === user || arr[i].email === email){
                flag = true;
                break;
            }
        }
        
        
        if(flag){
            return res.status(409).json({error:"There is same // User or Email // is available please choice different User name"});
        }
        else{
            // dublicate is not allow
            req.body.admin = 0;
            req.body.date = await new Date().toJSON();
            const salt= await bcrypt.genSalt();
            let hashPass = await bcrypt.hash(pass,salt);
            let hashCpass = await bcrypt.hash(cpass,salt);
            req.body.cpass = hashCpass;
            req.body.pass = hashPass;
            // console.log(req.body);
            
            // *creating new user but not saving in the database*
            // const newUserId = await new newUser(req.body);

            // console.log("new user print**");
            // console.log(newUserId);

            // const token = await newUserId.generateAuthToken();


            // console.log("the given token is :***  "+token);
            
            
            newUser.create(req.body);
            return res.status(200).json({message:"Success in user creation, take time to verify it by the admin"});
        }

    }catch(er){
        console.log(er);
        return res.status(500).json({message:"Internal Server Error, Contact to the developer"});
    }
})



// Done
router.post("/signIn",async(req,res)=>{
    const {user,pass} =  req.body;
    
    // console.log(req.body);
    let usersdb = await newUser.findOne({user:user});

    if(!usersdb){
        return res.status(404).json({error : "Please Enter Correct User and Password",
    server: "ok"});
    }

    const isMatch = await bcrypt.compare(pass,usersdb.pass);

    if(isMatch){
        const token = await usersdb.generateAuthToken();
        // console.log(token);
        res.status(200).json({message:token})
    }

    if(!isMatch){
        // Incorect user and password
        res.status(400).json({error:"Invalid Crediantial" , server: "ok"});
    }
    else if(usersdb.admin === 0){
        // not verify by the admin
        res.status(302).json({message:"Please Verify your admin credibility from ADMIN"});
    }
})


module.exports = router;