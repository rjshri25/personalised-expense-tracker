const mongoose = require('mongoose')

const savingGoalSchema = new mongoose.Schema(
{
  title: { type: String, required: true },
  target: { type: Number, required: true },
  current: { type: Number, default: 0 },
  progress: { type: Number, default: 0 },
  date: { type: String, required: true }
})

module.exports = mongoose.model('SavingGoal', savingGoalSchema)