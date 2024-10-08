//import express ,express routers and Person schema
const express = require("express");
const router = express.Router();
const Person = require("../models/Person.js");
const {jwtmiddleware,generateJWTToken} =require('../Jwt.js');

//login Route
router.post("/SignIn", async (req,res)=>{
  try{
    const {username,password}=req.body;
   // console.log(username,password);
    const response = await Person.findOne({username:username});
    console.log(response);
    if(!response) {
      return res.status(404).json({error:"User Not Found."});
    }
    if(await response.comparepassword(password)){
      
    const payload ={
      id :response.id,
      username:response.username,
    }
    
    const token = generateJWTToken(payload);
    console.log(payload);

    res.json({token});
    console.log("Logged In");
  }
  else{
    return res.status(404).json({error:"Inavlid password"});
  }

  }
  catch(err){
    console.log(err)
    res.status(500).json({error:'Internal Server error'});
  }
})


//Create Person
router.post("/SignUp", async (req, res) => {
  try {
    // req.body contain person data
    const data = req.body; 
    // create new person document/data
    
    const newPerson = new Person(data); 
   
    // save new person
    const response = await newPerson.save(); 
    //JWT AUthentication token 
    const payload ={
      id :response.id,
      username:response.username,
    }
    const token = generateJWTToken(payload);
    console.log(JSON.stringify(payload));

    res.status(200).json({response:response,token:token});
    console.log("Persons data saved.");
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "internal server" });
  }
});







//Get  persons Profile data
router.get("/profile",jwtmiddleware, async (req, res) => {

  try {
    const userdata = req.jwtpayload;
    console.log(req.jwtpayload);
    const data = await Person.findById(userdata.id);
    res.status(200).json(data);
    console.log("Profile data fetched.");
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "internal server error" });
  }
});


//Get All persons data
router.get("/",jwtmiddleware, async (req, res) => {
  const userdata = req.jwtpayload;
  console.log(req.jwtpayload);
  const data = await Person.findById(userdata.id);
  if (!(data.work=="Manager")) return res.status(403).json({message :"User does not have Rights"});
  try {
    const data = await Person.find();
    res.status(200).json(data);
    console.log("Persons data fetched.");
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "internal server error" });
  }
});

//Get person data based on work using parameterized api and in below api worktype is act as variable
router.get("/:worktype",jwtmiddleware, async (req, res) => {
  try {
    const userdata = req.jwtpayload;
    console.log(req.jwtpayload);
    const data = await Person.findById(userdata.id);
    if (!(data.work=="Manager")) return res.status(403).json({message :"User does not have Rights"});

    const worktype = req.params.worktype;
    if (worktype == "Chef" || worktype == "Manager" || worktype == "Waiter") {
      const data = await Person.find({ work: worktype });
      res.status(200).json(data);
      console.log("data of all ", worktype, "fetched");
    } else {
      res.status(404).json({ error: "Invalid Worktype" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
});


//Update the items data having unique id 
router.put("/:uniqueid",jwtmiddleware, async (req, res) => {
  const userdata = req.jwtpayload;
  console.log(req.jwtpayload);
  const data = await Person.findById(userdata.id);
  if (!(data.work=="Manager")) return res.status(403).json({message :"User does not have Rights"});
  try {
    const personid = req.params.uniqueid;
    const updatedpersondata = req.body;
    const response = await Person.findByIdAndUpdate(
      personid,
      updatedpersondata,
      {
        new: true, //return updated data in response.
        runValidators: true, //run mongoose validator to check person data with personSchema
      }
    );

    if (!response) {
     return res.status(404).json({ error: "Person Not found." });
    }
    res.status(200).json(response); // get updated data
    console.log("Persons data updated");
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "internal server error" });
  }
});

//delete items data having unique id 
router.delete("/:unique_id",jwtmiddleware,async (req,res)=>{
  const userdata = req.jwtpayload;
  console.log(req.jwtpayload);
  const data = await Person.findById(userdata.id);
  if (!(data.work=="Manager")) return res.status(403).json({message :"User does not have Rights"});
  try{
    const personid =req.params.unique_id;
    const response = await Person.findByIdAndDelete(personid);

    if (!response) {
       return res.status(404).json({ error: "Person Not found." });
    }
    console.log("person data deleted")
    res.status(200).json({message:"Person deleted successfully."})

  }catch(err){
    console.log(err);
    res.status(500).json({ error: "internal server error" });
  }
})

//export the router
module.exports = router;
