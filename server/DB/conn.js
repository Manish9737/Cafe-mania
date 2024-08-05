const mongoose = require("mongoose");
const DB = process.env.DATABASE;

const connectDB = async () => {
  try {
    const conn = mongoose.connect(DB);
    console.log("Connected to Mongodb server ! ")
  } catch (error) {
    console.log(`Error in Mongodb connection : ${error}`)
  }
};

connectDB();
