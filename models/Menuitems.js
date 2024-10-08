//import Mongoose for connecting mongoDB  with nodejs
const mongoose = require("mongoose");

//define Menuitems schema
const MenuitemsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  taste: {
    type: String,
    enum: ["Spicy", "Sour", "Sweet"],
    required: true,
  },
  is_drink: {
    type: Boolean,
    default: false,
  },
  ingredients: {
    type: [String],
    default:[],
    
  },
  num_sales: {
    type: Number,
    default: 0,
  },
});

//Create Menuitems model
const Menuitems = mongoose.model("Menuitems", MenuitemsSchema);

//export the Menuitems schema
module.exports = Menuitems;
