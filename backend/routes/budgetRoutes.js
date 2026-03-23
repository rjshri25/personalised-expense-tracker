const express = require("express")
const router = express.Router()
const Budget = require("../models/budgetModel")

router.get("/", async (req, res) => {
  try {
    const budgets = await Budget.find()
    res.json(budgets)
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch budgets" });
  }
})

router.post("/", async (req, res) => {
  try {
    const { category, limit, spent, month } = req.body

    const progress =
      limit > 0 ? ((Number(spent || 0) / Number(limit)) * 100).toFixed(1) : 0

    const newBudget = new Budget({
      category,
      limit,
      spent: spent || 0,
      month,
      progress,
    })

    const saved = await newBudget.save()
    res.json(saved)
  } catch (err) {
    res.status(500).json({ message: "Failed to create budget" })
  }
})


router.put("/:id", async (req, res) => {
  try {
    const { spent } = req.body

    const budget = await Budget.findById(req.params.id)
    if (!budget) {
      return res.status(404).json({ message: "Budget not found" })
    }

    const newSpent = Number(budget.spent || 0) + Number(spent || 0)

    const progress =
      budget.limit > 0
        ? ((newSpent / budget.limit) * 100).toFixed(1)
        : 0

    budget.spent = newSpent
    budget.progress = progress

    const updated = await budget.save()
    res.json(updated)
  } catch (err) {
    res.status(500).json({ message: "Failed to update budget" })
  }
})


router.delete("/:id", async (req, res) => {
  try {
    await Budget.findByIdAndDelete(req.params.id)
    res.json({ message: "Budget deleted" })
  } catch (err) {
    res.status(500).json({ message: "Failed to delete budget" })
  }
})

module.exports = router