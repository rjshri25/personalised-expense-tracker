const express=require('express')
const bodyParser=require('body-parser')
const cors=require('cors')
const mongoose=require('mongoose')

const URL = 'mongodb://localhost:27017/expenseTracker'

mongoose.connect(URL)
  .then(() => console.log('Mongodb Database connected!!'))
  .catch((err) => console.log('Database not connected', err))

const server=express()
server.use(bodyParser.json())
server.use(cors())

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