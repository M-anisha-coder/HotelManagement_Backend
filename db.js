// import mongoose
const mongoose = require("mongoose");
require("dotenv").config();

//Define the mongoDb connection URL here hotel is database name .
const mongoURL =process.env.localURL;
// mongo db Atlas url
//const mongoURL = process.env.mongoURL;

//setup mongoDB connction
mongoose.connect(mongoURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Get the default connction
// Mongoose maintain a default connection object representing the mongoDB connction.
const db = mongoose.connection;

// Define event listners for database connection
db.on("connected", () => {
  console.log("Connected to mongoDB server.");
});

db.on("disconnected", () => {
  console.log("Disconnected to mongoDB server.");
});

db.on("error", (err) => {
  console.log("Error in Connecting mongoDB server: ", err);
});

//Export the database connection.
module.exports = db;
