const mongoose = require("mongoose")

const budgetSchema = new mongoose.Schema({
  category: { type: String, required: true },
  limit: { type: Number, required: true },
  spent: { type: Number, default: 0 },
  month: { type: String, required: true },
  progress: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ["safe", "warning", "overspent"],
    default: "safe",
  },
})

module.exports = mongoose.model("Budget", budgetSchema)