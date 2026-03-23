import { useState, useEffect } from "react"
import toast, { Toaster } from "react-hot-toast"
import axios from "axios"
import "./styles.css"

export default function SavingGoals() {
  const [showForm, setShowForm] = useState(false)
  const [goals, setGoals] = useState([])
  const [form, setForm] = useState({
    title: "",
    target: "",
    current: "",
    date: "",
  })
  const [addAmounts, setAddAmounts] = useState({})
  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const res = await axios.get("http://localhost:6087/goals")
        setGoals(res.data)
      } catch (err) {
        toast.error("Failed to fetch goals")
      }
    }
    fetchGoals()
  }, [])


  const handleAdd = async () => {
    if (!form.title || !form.target || !form.date)
      return toast.error("Fill all required fields!")

    const progress =
      form.target > 0
        ? ((Number(form.current) / Number(form.target)) * 100).toFixed(1)
        : 0

    const newGoal = { ...form, progress }

    const toastId = toast.loading("Adding goal...")
    try {
      const res = await axios.post("http://localhost:6087/goals", newGoal)
      setGoals([...goals, res.data]);
      setForm({ title: "", target: "", current: "", date: "" })
      setShowForm(false)
      toast.success("Goal added!", { id: toastId })
    } catch (err) {
      toast.error("Failed to add goal", { id: toastId })
    }
  }

  
  const handleUpdate = async (goal) => {
    const amount = addAmounts[goal._id]
    if (!amount) return toast.error("Enter an amount first!")

    const newCurrent = Number(goal.current || 0) + Number(amount)
    const progress = ((newCurrent / goal.target) * 100).toFixed(1)
    const toastId = toast.loading("Updating goal...")

    try {
      const res = await axios.put(`http://localhost:6087/goals/${goal._id}`, {
        ...goal,
        current: newCurrent,
        progress,
      })
      setGoals((prev) =>
        prev.map((g) => (g._id === res.data._id ? res.data : g))
      )
      setAddAmounts((prev) => ({ ...prev, [goal._id]: "" }))
      toast.success("Goal updated!", { id: toastId })
    } catch (err) {
      toast.error("Failed to update goal", { id: toastId })
    }
  }

  const handleDelete = async (id) => {
    const toastId = toast.loading("Deleting goal...")
    try {
      await axios.delete(`http://localhost:6087/goals/${id}`)
      setGoals((prev) => prev.filter((g) => g._id !== id))
      toast.success("Goal deleted!", { id: toastId })
    } catch (err) {
      toast.error("Failed to delete goal", { id: toastId })
    }
  }

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="container">
     
        <div className="header-box">
          <div className="header">
            <div className="header-text">
              <h1>Savings Goals</h1>
              <p>Track your financial goals and progress</p>
            </div>
            <button className="add-btn" onClick={() => setShowForm(!showForm)}>
              + New Goal
            </button>
          </div>
        </div>
        {showForm && (
          <div className="form">
            <div className="form-header">
              <h3>+ New Goal</h3>
            </div>
            <div className="form-body">
              <div className="row">
                <div className="field">
                  <label>Goal Name *</label>
                  <input
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                  />
                </div>
                <div className="field">
                  <label>Target Amount *</label>
                  <input
                    type="number"
                    value={form.target}
                    onChange={(e) => setForm({ ...form, target: e.target.value })}
                  />
                </div>
              </div>
              <div className="row">
                <div className="field">
                  <label>Current Amount</label>
                  <input
                    type="number"
                    value={form.current}
                    onChange={(e) => setForm({ ...form, current: e.target.value })}
                  />
                </div>
                <div className="field">
                  <label>Deadline *</label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                  />
                </div>
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
        <div className="savings-cards">
          {goals.length === 0 ? (
            <p className="empty">No goals added</p>
          ) : (
            goals.map((g) => (
              <div key={g._id} className="savings-card">
                <h3>{g.title}</h3>
                <p className="savings-progress-text">
                  Progress <span>{g.progress}%</span>
                </p>
                <div className="savings-progress-bar">
                  <div
                    className="savings-progress-fill"
                    style={{ width: `${g.progress}%` }}
                  ></div>
                </div>
                <div className="savings-amounts">
                  <div>
                    <p>Current</p>
                    <h4>₹{g.current || 0}</h4>
                  </div>
                  <div>
                    <p>Target</p>
                    <h4>₹{g.target}</h4>
                  </div>
                </div>
                <div className="savings-date">
                  <span>{g.date}</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    marginTop: "10px",
                    alignItems: "center",
                  }}
                >
                  <input
                    type="number"
                    placeholder="Add amount"
                    value={addAmounts[g._id] || ""}
                    onChange={(e) =>
                      setAddAmounts((prev) => ({ ...prev, [g._id]: e.target.value }))
                    }
                    style={{
                      flex: 1,
                      padding: "6px 8px",
                      fontSize: "14px",
                      borderRadius: "5px",
                      width: "80px",
                      border: "1px solid #ccc",
                    }}
                  />
                  <button
                    className="savings-btn"
                    onClick={() => handleUpdate(g)}
                    style={{
                      padding: "6px 0",
                      fontSize: "14px",
                      borderRadius: "5px",
                      width: "80px",
                      textAlign: "center",
                    }}
                  >
                    + Add
                  </button>
                  <button
                    className="cancel-btn"
                    onClick={() => handleDelete(g._id)}
                    style={{
                      padding: "6px 0",
                      fontSize: "14px",
                      borderRadius: "5px",
                      width: "80px",
                      textAlign: "center",
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  )
}