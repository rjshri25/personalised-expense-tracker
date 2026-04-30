const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected (Local) 🚀");
  } catch (err) {
    console.error("MongoDB error:", err);
    process.exit(1);
  }
};

module.exports = { connectDB };