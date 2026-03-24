const express = require("express")
const Transaction = require("../models/transactionSchema")

const router = express.Router()


router.get("/:userId", async (req, res) => {
  const { userId } = req.params

  try {
    const transactions = await Transaction.find({ user: userId })
    res.send({ status: true, transactions })
  } catch (err) {
    console.error(err)
    res.send({ status: false, message: "Failed to fetch transactions" })
  }
})


router.post("/", async (req, res) => {
  const { userId, amount, category, type } = req.body

  if (!userId || !amount || !category || !type)
    return res.send({ status: false, message: "All fields required" })

  try {
    const transaction = await Transaction.create({
      user: userId,
      amount,
      category,
      type
    })
    res.send({ status: true, transaction })
  } catch (err) {
    console.error(err)
    res.send({ status: false, message: "Failed to create transaction" })
  }
})

router.put("/:transactionId", async (req, res) => {
  const { transactionId } = req.params;
  const { userId, amount, category, type } = req.body

  try {
    const transaction = await Transaction.findOneAndUpdate(
      { _id: transactionId, user: userId },
      { amount, category, type },
      { new: true }
    )
    if (!transaction)
      return res.send({ status: false, message: "Transaction not found" })

    res.send({ status: true, transaction })
  } catch (err) {
    console.error(err);
    res.send({ status: false, message: "Failed to update transaction" })
  }
})


router.delete("/:transactionId/:userId", async (req, res) => {
  const { transactionId, userId } = req.params;

  try {
    const transaction = await Transaction.findOneAndDelete({ _id: transactionId, user: userId });
    if (!transaction)
      return res.send({ status: false, message: "Transaction not found" })

    res.send({ status: true, message: "Transaction deleted" })
  } catch (err) {
    console.error(err)
    res.send({ status: false, message: "Failed to delete transaction" })
  }
})

router.get("/calendar/:userId", async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ status: false, message: "User ID is required" });
  }

  try {
    // Find all transactions for the user
    const transactions = await Transaction.find({ user: userId });

    // Aggregate transactions by date
    const calendarData = {};

    transactions.forEach((t) => {
      const dateKey = t.date.toISOString().split("T")[0]; // format YYYY-MM-DD

      if (!calendarData[dateKey]) {
        calendarData[dateKey] = { income: 0, expense: 0 };
      }

      if (t.type === "income") {
        calendarData[dateKey].income += t.amount;
      } else if (t.type === "expense") {
        calendarData[dateKey].expense += t.amount;
      }
    });

    res.json({ status: true, transactions: calendarData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: false, message: "Failed to fetch transactions" });
  }
});


module.exports = router