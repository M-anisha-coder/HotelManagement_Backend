//import passport and its local strategy for authentication
const passport =require('passport');
const LocalStrategy =require('passport-local').Strategy;

//import Person Schema 
const Person = require("./models/Person");

//Password Verification function need 3 parameter username,password,done callback function and done(error,user,message(optional))
passport.use(new LocalStrategy(async(user,pwd,done)=>{
    // authentication logic code
    try{
        
        const userdetails = await Person.find({username:user});
        if(!userdetails){
         console.log("Incorrect Username.");
           return done(null,false,{message:"Incorrect Username."}) ;
        }
       // const ispwdMatch =userdetails[0].password == pwd ? true :false;
       
       const ispwdMatch  = userdetails[0].comparepassword(pwd);
        if(ispwdMatch) {
            console.log("user Authenticated.");
             return done(null,userdetails);
        }
        else{
            console.log("Incorrect password.");
            return done(null,false,{message:"Incorrect password."}) ;
        }
    
    }
    catch(err){
        console.log(err);
        return done(null,false,{message:"error in passport.js"}) ;
    }
    }))

//export the passport
module.exports=passport;
