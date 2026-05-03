require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");

const { connectDB } = require("./db");

const server = express();

// Middlewares
server.use(bodyParser.json());
server.use(cors());

// Routes
const registerRoute = require("./routes/registerRoute");
server.use("/register", registerRoute);

const loginRoute = require("./routes/loginRoute");
server.use("/login", loginRoute);

const goalRoutes = require("./routes/goalRoutes");
server.use("/goals", goalRoutes);

const transactionRoutes = require("./routes/transactionRoutes");
server.use("/transactions", transactionRoutes);

const budgetRoutes = require("./routes/budgetRoutes");
server.use("/budgets", budgetRoutes);

// DB Test Route
server.get("/test-db", async (req, res) => {
  try {
    const state = mongoose.connection.readyState;

    const status = {
      0: "disconnected ❌",
      1: "connected ✅",
      2: "connecting ⏳",
      3: "disconnecting ⚠️"
    };

    res.json({
      dbState: status[state],
      readyState: state
    });
  } catch (err) {
    res.json({ error: err.message });
  }
});


const startServer = async () => {
  try {
    await connectDB();
    console.log("✅ MongoDB Atlas Connected Successfully");

    server.listen(6087, () => {
      console.log("🚀 Server is running on port 6087");
    });

  } catch (err) {
    console.log("❌ MongoDB Connection Failed:");
    console.log(err.message);
    process.exit(1);
  }
};

startServer();