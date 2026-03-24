const express = require("express")
const router = express.Router()
const SavingGoal = require("../models/SavingGoal")

router.get("/:userId", async (req, res) => {
  const { userId } = req.params

  try {
    const goals = await SavingGoal.find({ user: userId })
    res.json({ status: true, goals })
  } catch (err) {
    console.error(err)
    res.json({ status: false, message: "Failed to fetch goals" })
  }
})

router.post("/", async (req, res) => {
  const { userId, title, target, current = 0, date } = req.body

  if (!userId || !title || !target || !date)
    return res.json({ status: false, message: "All fields required" })

  const progress = target > 0 ? ((Number(current) / Number(target)) * 100).toFixed(1) : 0

  try {
    const goal = await SavingGoal.create({ user: userId, title, target, current, date, progress })
    res.json({ status: true, goal })
  } catch (err) {
    console.error(err)
    res.json({ status: false, message: "Failed to create goal" })
  }
})


router.put("/:id", async (req, res) => {
  const { userId, title, target, current = 0, date } = req.body

  try {
    const goal = await SavingGoal.findOneAndUpdate(
      { _id: req.params.id, user: userId },
      {
        title,
        target,
        current,
        date,
        progress: target > 0 ? ((Number(current) / Number(target)) * 100).toFixed(1) : 0,
      },
      { new: true }
    )

    if (!goal) return res.json({ status: false, message: "Goal not found" })
    res.json({ status: true, goal })
  } catch (err) {
    console.error(err)
    res.json({ status: false, message: "Failed to update goal" })
  }
})

router.delete("/:id/:userId", async (req, res) => {
  const { id, userId } = req.params;

  try {
    const goal = await SavingGoal.findOneAndDelete({ _id: id, user: userId })
    if (!goal) return res.json({ status: false, message: "Goal not found" })
    res.json({ status: true, message: "Deleted" })
  } catch (err) {
    console.error(err)
    res.json({ status: false, message: "Failed to delete goal" })
  }
})

module.exports = router