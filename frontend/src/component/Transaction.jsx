import { useState, useEffect } from "react"
import toast, { Toaster } from "react-hot-toast"
import axios from "axios"
import "./styles.css"

export default function Transaction() {
  const [showForm, setShowForm] = useState(false)
  const [transactions, setTransactions] = useState([])
  const [form, setForm] = useState({
    type: "expense",
    amount: "",
    category: "",
    date: "",
    description: "",
  })
  const [editAmounts, setEditAmounts] = useState({})
  const userId = localStorage.getItem("userId")

  useEffect(() => {
    if (!userId) {
      toast.error("Please login first")
      return
    }

    const fetchTransactions = async () => {
      try {
        const res = await axios.get(`http://localhost:6087/transactions/${userId}`)
        if (res.data.status) setTransactions(res.data.transactions)
        else toast.error(res.data.message)
      } catch {
        toast.error("Failed to fetch transactions")
      }
    }
    fetchTransactions()
  }, [userId])

  const handleAdd = async () => {
    if (!form.amount || !form.category || !form.date) {
      return toast.error("Fill all required fields!")
    }

    if (!userId) return toast.error("User not logged in")

    const toastId = toast.loading("Adding transaction...")

    try {
      const res = await axios.post("http://localhost:6087/transactions", {
        ...form,
        userId,
      })

      if (res.data.status) {
        setTransactions([...transactions, res.data.transaction])
        setForm({ type: "expense", amount: "", category: "", date: "", description: "" })
        setShowForm(false)
        toast.success("Transaction added!", { id: toastId })
      } else {
        toast.error(res.data.message, { id: toastId })
      }
    } catch {
      toast.error("Failed to add transaction", { id: toastId })
    }
  }

  const handleUpdate = async (t) => {
    const amount = editAmounts[t._id]
    if (!amount) return toast.error("Enter amount!")
    if (!userId) return toast.error("User not logged in")
    const toastId = toast.loading("Updating transaction...")

    try {
      const res = await axios.put(`http://localhost:6087/transactions/${t._id}`, {
        ...t,
        amount: Number(amount),
        userId,
      })

      if (res.data.status) {
        setTransactions((prev) =>
          prev.map((tr) => (tr._id === res.data.transaction._id ? res.data.transaction : tr))
        )
        setEditAmounts((prev) => ({ ...prev, [t._id]: "" }))
        toast.success("Transaction updated!", { id: toastId })
      } else {
        toast.error(res.data.message, { id: toastId })
      }
    } catch {
      toast.error("Failed to update transaction", { id: toastId })
    }
  }


  const handleDelete = async (id) => {
    if (!userId) return toast.error("User not logged in")
    const toastId = toast.loading("Deleting transaction...")

    try {
      const res = await axios.delete(`http://localhost:6087/transactions/${id}/${userId}`)
      if (res.data.status) {
        setTransactions((prev) => prev.filter((t) => t._id !== id))
        toast.success("Transaction deleted!", { id: toastId })
      } else {
        toast.error(res.data.message, { id: toastId })
      }
    } catch {
      toast.error("Failed to delete transaction", { id: toastId })
    }
  }
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((a, b) => a + Number(b.amount), 0)

  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((a, b) => a + Number(b.amount), 0)

  const balance = income - expense

  return (
    <>
      <Toaster position="top-center" />
      <div className="container">
        <div className="header-box">
          <div className="header">
            <div className="header-text">
              <h1>Transactions</h1>
            </div>
            <button className="add-btn" onClick={() => setShowForm(!showForm)}>
              + Add Transaction
            </button>
          </div>

          <div className="cards">
            <div className="card income">
              <p>TOTAL INCOME</p>
              <h2>₹{income}</h2>
            </div>

            <div className="card expense">
              <p>TOTAL EXPENSES</p>
              <h2>₹{expense}</h2>
            </div>

            <div className="card balance">
              <p>NET BALANCE</p>
              <h2>₹{balance}</h2>
            </div>
          </div>
        </div>

              {showForm && (
          <div className="form">
            <div className="form-header">
              <h3>+ New Transaction</h3>
            </div>
            <div className="form-body">
              <div className="row">
                <div className="field">
                  <label>Type *</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                  >
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </select>
                </div>
                <div className="field">
                  <label>Amount *</label>
                  <input
                    type="number"
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  />
                </div>
              </div>

              <div className="row">
                <div className="field">
                  <label>Category *</label>
                  <input
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                  />
                </div>

                <div className="field">
                  <label>Date *</label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                  />
                </div>
              </div>

              <div className="field full">
                <label>Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>
            </div>

            <div className="form-footer">
              <button className="cancel-btn" onClick={() => setShowForm(false)}>
                Cancel
              </button>
              <button className="create-btn" onClick={handleAdd}>
                Create
              </button>
            </div>
          </div>
        )}
        <div className="history">
          <h4>Transaction History</h4>
          {transactions.length === 0 ? (
            <p className="empty">No transactions found</p>
          ) : (
            transactions.map((t) => (
              <div key={t._id} className="history-item">
                <div className="left">
                  <div className="icon">{t.type === "expense" ? "↘" : "↗"}</div>
                  <div className="details">
                    <div className="top">
                      <span className="title">{t.category}</span>
                      <span className="tag">{t.category}</span>
                    </div>
                    <small>{t.date}</small>
                  </div>
                </div>

                <div className="right">
                  <span className={t.type === "expense" ? "amt red" : "amt green"}>
                    {t.type === "expense" ? "-" : "+"}₹{t.amount}
                  </span>

                  <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
                    <input
                      type="number"
                      placeholder="Edit amount"
                      value={editAmounts[t._id] || ""}
                      onChange={(e) =>
                        setEditAmounts((prev) => ({ ...prev, [t._id]: e.target.value }))
                      }
                      style={{ flex: 1, padding: "6px", fontSize: "14px" }}
                    />

                    <button
                      className="savings-btn"
                      style={{ width: "80px", padding: "6px 0" }}
                      onClick={() => handleUpdate(t)}
                    >
                      Update
                    </button>

                    <button
                      className="cancel-btn"
                      style={{ width: "80px", padding: "6px 0" }}
                      onClick={() => handleDelete(t._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  )
}