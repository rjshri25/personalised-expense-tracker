const mongoose = require('mongoose')

const savingGoalSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
  title: { type: String, required: true },
  target: { type: Number, required: true },
  current: { type: Number, default: 0 },
  progress: { type: Number, default: 0 },
  date: { type: String, required: true }
})

module.exports = mongoose.model('SavingGoal', savingGoalSchema)