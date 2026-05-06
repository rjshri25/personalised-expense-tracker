const mongoose = require("mongoose");

const connectDB= async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected 🚀");
  } catch (err) {
    console.error("MongoDB error:", err);
    console.log("Failed to connect to MongoDB Atlas. Please check your MONGO_URI in .env file.");
  }
};

module.exports = { connectDB };