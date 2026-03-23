const express = require("express")
const router = express.Router()
const Budget = require("../models/budgetModel")

const calculateProgress = (spent, limit) => {
  if (!limit || limit <= 0) return 0
  return ((spent || 0) / limit) * 100
}

const getStatus = (spent, limit) => {
  if (spent > limit) return "overspent"
  if (spent > 0.8 * limit) return "warning"
  return "safe"
}

router.get("/", async (req, res) => {
  try {
    const budgets = await Budget.find()
    res.json(budgets)
  } catch {
    res.status(500).json({ message: "Failed to fetch budgets" })
  }
})

router.post("/", async (req, res) => {
  try {
    const { category, limit, spent, month } = req.body

    const progress = calculateProgress(spent, limit)
    const status = getStatus(spent, limit)

    const newBudget = new Budget({
      category,
      limit,
      spent: spent || 0,
      month,
      progress,
      status,
    })

    const saved = await newBudget.save()
    res.json(saved)
  } catch {
    res.status(500).json({ message: "Failed to create budget" })
  }
})

router.put("/:id", async (req, res) => {
  try {
    const existing = await Budget.findById(req.params.id);

    const addedSpent = Number(req.body.spent || 0)
    const newSpent = Number(existing.spent || 0) + addedSpent

    const progress = calculateProgress(newSpent, existing.limit)
    const status = getStatus(newSpent, existing.limit)

    const updated = await Budget.findByIdAndUpdate(
      req.params.id,
      {
        spent: newSpent,
        progress,
        status,
      },
      { new: true }
    )

    res.json(updated)
  } catch {
    res.status(500).json({ message: "Failed to update budget" })
  }
})

router.delete("/:id", async (req, res) => {
  try {
    await Budget.findByIdAndDelete(req.params.id)
    res.json({ message: "Deleted" })
  } catch {
    res.status(500).json({ message: "Failed to delete" })
  }
})

module.exports = router