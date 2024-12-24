const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    mongoose.connect(`${process.env.URI}`);
    console.log("Connected to Database!");
  } catch (e) {
    console.log(e);
  }
};

module.exports = connectDB;
