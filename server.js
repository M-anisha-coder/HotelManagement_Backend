//importing Express package
const express = require("express"); 
const app = express();

// import mongodb  connection.
const db = require("./db.js"); 

//import body parser middleware which store data in req.body.
const bodyParser = require("body-parser");
app.use(bodyParser.json()); 

//import Passport.js for user authentication.
const passport=require('./auth.js');

//import dotenv for hidding sensitive information by using .env config.
require("dotenv").config();

//MiddleWare Function  : it will take 3 parameter req,res,next
const Logging =(req,res,next)=>{
  console.log(`[${new Date().toLocaleString()}] request made to ${req.originalUrl}`);
  next();     // important for next execution this function is act as Callback.
}
//use logging middleware for all routes.
app.use(Logging);


//Authentication Middleware
app.use(passport.initialize());
const localAuthmiddleware= passport.authenticate('local',{session:false});

//import Routes 
const PersonRoute=require("./Routes/PersonRoutes.js");
const MenuitemsRoute=require("./Routes/MenuitemsRouter.js");

//main page 
app.get("/", function (req, res) {
  res.send("Welcome to Hotel Management System.");
});

//use the routes as middleware
//app.use("/person",localAuthmiddleware,PersonRoute);   ------we can add local auth using passport and adding localAuthmiddleware middleware.
app.use("/person",PersonRoute);
app.use("/Menuitems",MenuitemsRoute);


const PORT = process.env.PORT ||3000;
//listening server
app.listen(PORT, function () {
  console.log(" Nodejs server is running at port 3000");
});





//1.this how we pass an object
// app.get("/idli",function(req,res){
//     var idli ={
//         name :"Rava idli",
//         size :"10cm"
//     }
//     res.send(idli) ;
// })

// 2. using index.js files variables
// console.log(Index.name);
// console.log(Index.age);
// console.log(Index.add(3,7));
