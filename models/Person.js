//import Mongoose for connecting mongoDB  with nodejs
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

//define persons schema
const PersonSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  work: {
    type: String,
    enum: ["Chef", "Waiter", "Manager"],
    required: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  address: {
    type: String,
  },
  salary: {
    type: Number,
    required: true,
  },
  username :{
    type:String,
    required:true,
    unique : true,
  },
  password :{
    type:String,
    required:true,
  }
});

PersonSchema.pre('save',async function (next){
  const person =this; 
  
  //hash the password only if modified or new record.
  if(!person.isModified('password')) return next();
  
  try{
    //salt generation
    const salt= await bcrypt.genSalt(10);

    //hash password generation
    const hashpassword = await bcrypt.hash(person.password, salt);
    console.log("person.password and hashedpassword",person.password,hashpassword);
    person.password=hashpassword;

    next();

  }catch(err){

    next (err);
  }
})

PersonSchema.methods.comparepassword= async function(passwordenter){

  const person =this;
  try{
    
    const isMatch= bcrypt.compare(passwordenter, this.password);
    console.log("passwordenter and this.password",passwordenter,this.password);
    return isMatch;

  }
  catch(err){
    throw err;
  }

}


PersonSchema.pre('findOneAndUpdate',async function (next){
  const update = this.getUpdate();
  console.log(update.password);
  // Check if the password is being updated
  if (update.password) {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(update.password, salt);

      // Replace the plain text password with the hashed password
      this.setUpdate({ ...update, password: hashPassword });
      
      next();
    } catch (err) {
      next(err);
    }
  } else {
    next();
  }
})

//Create person model
const Person = mongoose.model("Person", PersonSchema);

//export the person schema
module.exports = Person;
