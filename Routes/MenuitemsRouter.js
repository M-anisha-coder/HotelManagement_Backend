//import express ,express routers and Menuitems schema
const express=require("express");
const Menuitems = require("../models/Menuitems");
const router=express.Router();

//Create items
router.post("/",async(req,res)=>{
    try{
      // req.body contain person data
      const data = req.body; 
      // create new item document/data
      const newitem = new Menuitems(data); 
      // save new item
      const response = await newitem.save() 
      res.status(200).json(response);
      console.log("items data saved.");
  
    }
    catch(err){
      console.log(err);
      res.status(500).json({error:"internal server error"})
    }
  })
  
//Get All items data
router.get("/",async(req,res)=>{
    try{
      const data = await Menuitems.find();
      res.status(201).json(data);
      console.log("items data fetched")
  
    }
    catch(err){
      console.log(err);
      res.status(500).json({error:"internal Server error"});
    }
  })

//Get items data based on taste using parameterized api and in below api tasteType is act as variable
router.get("/:tasteType", async(req,res)=>{
    try{
        const tasteType=req.params.tasteType;
        if(tasteType=='Sweet'||tasteType=='Sour'||tasteType=='Spicy'){
            const data = await Menuitems.find({taste:tasteType});
            res.status(200).json(data);
            console.log("data of all",tasteType ," fetched.")
        }else{
            res.status(404).json({error:"Inavlid Taste"});
        }

    }catch(err){
        console.log(err);
        res.status(500).json({error:"Internal server error"});

    } 

})

//Update the items data having unique id 
router.patch("/:uniqueid",async(req,res)=>{
  try{
    const itemid =req.params.uniqueid;
    const updateitem =req.body;
    const response = await Menuitems.findByIdAndUpdate(itemid,updateitem,{
      new:true,
      runValidators:true,
    })
    if(!response){
      return res.status(404).json({error :"Invalid item"});
    }
    res.status(200).json(response);
    console.log("update the item data.")

  }catch(err){
    console.log(err);
    res.status(500).json({error:"Internal server error"});
  }
})


//delete items data having unique id 
router.delete("/:uniqueid",async(req,res)=>{

try {
  const itemid =req.params.uniqueid;
  const response = await Menuitems.findByIdAndDelete(itemid);
  if(!response){
    return res.status(404).json({error :"Invalid item"});
  }
  res.status(200).json({meassage :"item data is deleted successfully."});
  console.log("Deleted the item data.")
  
} catch (err) {
  console.log(err);
    res.status(500).json({error:"Internal server error"});
}

})

//export the router
module.exports=router;
  
  