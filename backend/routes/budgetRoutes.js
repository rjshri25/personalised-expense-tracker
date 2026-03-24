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


router.get("/:userId", async (req, res) => {
  const { userId } = req.params
  try {
    const budgets = await Budget.find({ user: userId })
    res.json({ status: true, budgets })
  } catch {
    res.status(500).json({ status: false, message: "Failed to fetch budgets" })
  }
})

router.post("/", async (req, res) => {
  try {
    const { userId, category, limit, spent, month } = req.body;
    if (!userId) return res.status(400).json({ status: false, message: "User ID is required" });

    const progress = calculateProgress(spent, limit)
    const status = getStatus(spent, limit)

    const newBudget = new Budget({
      user: userId,
      category,
      limit,
      spent: spent || 0,
      month,
      progress,
      status,
    })

    const saved = await newBudget.save()
    res.json({ status: true, budget: saved })
  } catch {
    res.status(500).json({ status: false, message: "Failed to create budget" })
  }
})

router.put("/:id", async (req, res) => {
  try {
    const existing = await Budget.findById(req.params.id)
    if (!existing) return res.status(404).json({ status: false, message: "Budget not found" });

    const addedSpent = Number(req.body.spent || 0)
    const newSpent = Number(existing.spent || 0) + addedSpent

    const progress = calculateProgress(newSpent, existing.limit)
    const status = getStatus(newSpent, existing.limit)

    const updated = await Budget.findByIdAndUpdate(
      req.params.id,
      { spent: newSpent, progress, status },
      { new: true }
    )

    res.json({ status: true, budget: updated })
  } catch {
    res.status(500).json({ status: false, message: "Failed to update budget" })
  }
})

router.delete("/:id/:userId", async (req, res) => {
  try {
    const { id, userId } = req.params
    await Budget.deleteOne({ _id: id, user: userId })
    res.json({ status: true, message: "Deleted" })
  } catch {
    res.status(500).json({ status: false, message: "Failed to delete budget" })
  }
})

module.exports = router