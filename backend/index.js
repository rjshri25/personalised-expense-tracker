require("dotenv").config()
const express=require('express')

const bodyParser=require('body-parser')
const cors=require('cors')
const mongoose=require('mongoose')

const { connectDB } = require('./db')
connectDB()


console.log("MONGO_URI:", process.env.MONGO_URI)

const server=express()
server.use(bodyParser.json())
server.use(cors())

const registerRoute=require('./routes/registerRoute')
server.use("/register", registerRoute)

const loginRoute = require("./routes/loginRoute")
server.use("/login", loginRoute)

const goalRoutes=require('./routes/goalRoutes')
server.use("/goals", goalRoutes)

const transactionRoutes=require('./routes/transactionRoutes')
server.use("/transactions", transactionRoutes)

const budgetRoutes = require("./routes/budgetRoutes")
server.use("/budgets", budgetRoutes)


server.listen(6087,
    ()=>
    {
    console.log("Server is in listening mode!!!")
    }   
)
 