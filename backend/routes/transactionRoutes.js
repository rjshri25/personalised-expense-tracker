const express = require("express")
const router = express.Router()
const Transaction = require("../models/transactionSchema")

router.get("/", async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ date: -1 })
    res.json(transactions)
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch transactions" })
  }
})

router.post("/", async (req, res) => {
  const { type, amount, category, date, description } = req.body
  if (!type || !amount || !category || !date)
    return res.status(400).json({ message: "Missing required fields" })

  try {
    const newTransaction = new Transaction({ type, amount, category, date, description })
    const saved = await newTransaction.save()
    res.json(saved)
  } catch (err) {
    res.status(500).json({ message: "Failed to add transaction" })
  }
})

router.put("/:id", async (req, res) => {
  try {
    const updated = await Transaction.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json(updated)
  } catch (err) {
    res.status(500).json({ message: "Failed to update transaction" })
  }
});


router.delete("/:id", async (req, res) => {
  try {
    await Transaction.findByIdAndDelete(req.params.id)
    res.json({ message: "Transaction deleted" })
  } catch (err) {
    res.status(500).json({ message: "Failed to delete transaction" })
  }
})

router.get("/calendar", async (req, res) => {
  try {
    const transactions = await Transaction.find()
    const grouped = {}

    transactions.forEach((t) => {
      const d = new Date(t.date)

      const formattedDate = `${d.getFullYear()}-${String(
        d.getMonth() + 1
      ).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`

      if (!grouped[formattedDate]) {
        grouped[formattedDate] = { income: 0, expense: 0 }
      }

      if (t.type === "income") {
        grouped[formattedDate].income += Number(t.amount)
      } else {
        grouped[formattedDate].expense += Number(t.amount)
      }
    })

    res.json(grouped)
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch calendar data" })
  }
})
module.exports = router