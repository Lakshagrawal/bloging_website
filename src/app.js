require('dotenv').config()
const express = require("express")
const app = express()
const path = require("path")
const mongoose = require("mongoose")
const hbs = require('hbs')


const  bodyParser = require("body-parser")
app.use(bodyParser.urlencoded({
    extended:true
}))



// static file use 
app.use('/static',express.static(path.join(__dirname,'../public')));


hbs.registerPartials(path.join(__dirname, "views/partials"))
hbs.registerHelper("calculate_date_hbs",function(date){
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const date1 = (months[date.getMonth()] + " " + date.getDate()+", "+date.getFullYear());
    return date1;
})
hbs.registerHelper("finding_name_hbs",function(date){
    const date1 = (months[date.getMonth()] + " " + date.getDate()+", "+date.getFullYear());
    return 0;
})


// hbs engine 
app.set('view engine','hbs')
app.set('views',path.join(__dirname,'/views'))



// use of routes
const homeRouter = require("./routes/home")
app.use('/',homeRouter); 
const usersRouter = require("./routes/user")
app.use('/user',usersRouter);
const auth = require("./api/auth")
app.use('/api',auth); 


// connect to mongoose
// let dbURL = "mongodb://127.0.0.1:27017/website_tut";
// mongoose.connect(dbURL,()=>{
//     console.log("db connect hello my friends ");   
// })
// let dbURL = "mongodb://localhost:27017/bloging";
try{
    const dbURL = process.env.SERVER_DB_KEY || "mongodb://localhost:27017/bloging";  
    console.log(dbURL);
    // const connectionParams = { 
    //     useNewUrlParser: true,
    //     useUnifiedTopology: true
    // };

    mongoose.connect(dbURL).then(()=>{
        console.log("db is connected succsesfully");
    }).catch((err)=>{
        console.log(err);
    })
}catch(err){
    console.log(err);
}



let port = process.env.APP_PORT || 3000;
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
