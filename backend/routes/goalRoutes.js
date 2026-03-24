const express = require("express")
const router = express.Router()

const SavingGoal = require("../models/SavingGoal")

router.get("/", async (req, res) => {
  const goals = await SavingGoal.find();
  res.json(goals);
})

router.post("/", async (req, res) => {
  const goal = new SavingGoal(req.body);
  const saved = await goal.save();
  res.json(saved);
})

router.put("/:id", async (req, res) => {
  const updated = await SavingGoal.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updated);
})

router.delete("/:id", async (req, res) => {
  await SavingGoal.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
})

module.exports = router