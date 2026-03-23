import { useEffect, useState } from "react"
import axios from "axios"
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import "./styles.css"

export default function Dashboard() {
  const [transactions, setTransactions] = useState([])
  const [goals, setGoals] = useState([])

  useEffect(() => {
    axios.get("http://localhost:6087/transactions").then((res) => {
      setTransactions(res.data)
    })
    axios.get("http://localhost:6087/goals").then((res) => {
      setGoals(res.data)
    })
  }, [])

  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((a, b) => a + Number(b.amount), 0)

  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((a, b) => a + Number(b.amount), 0)

  const savings = income - expense;

  const categoryMap = {}
  transactions.forEach((t) => {
    if (t.type === "expense") {
      categoryMap[t.category] =
        (categoryMap[t.category] || 0) + Number(t.amount)
    }
  })

  const pieData = Object.keys(categoryMap).map((key) => ({
    name: key,
    value: categoryMap[key],
  }))
  const COLORS = ["#00C49F", "#FF4D4F", "#4F46E5", "#F59E0B", "#9333EA"]

  const barData = [
    { name: "Income", value: income },
    { name: "Expense", value: expense },
  ]

  const recent = [...transactions].slice(-3).reverse()

  return (
    <div className="container">
      <div className="header-box">
        <h1 className="title">Financial Dashboard</h1>
        <p className="subtitle">Track your income, expenses, and savings</p>

        <div className="cards">
          <div className="card income">
            <p>Total Income</p>
            <h2>₹{income.toFixed(2)}</h2>
          </div>

          <div className="card expense">
            <p>Total Expenses</p>
            <h2>₹{expense.toFixed(2)}</h2>
          </div>

          <div className="card balance">
            <p>Net Savings</p>
            <h2>₹{savings.toFixed(2)}</h2>
          </div>

          <div className="card goals">
            <p>Active Goals</p>
            <h2>{goals.length}</h2>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="glass-card">
          <h3>Category Breakdown</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={pieData} dataKey="value" outerRadius={90}>
                {pieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card">
          <h3>Income vs Expense</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={barData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value">
                <Cell fill="#00C49F" />
                <Cell fill="#FF4D4F" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="dashboard-grid" style={{ marginTop: "20px" }}>
        <div className="glass-card">
          <h3>Recent Transactions</h3>

          {recent.length === 0 ? (
            <p className="empty">No transactions</p>
          ) : (
            recent.map((t) => (
              <div className="row-item" key={t._id}>
                <span>{t.category}</span>
                <span className={t.type === "expense" ? "red" : "green"}>
                  {t.type === "expense" ? "-" : "+"}₹{t.amount}
                </span>
              </div>
            ))
          )}
        </div>

        <div className="glass-card">
          <h3>Savings Goals</h3>

          {goals.length === 0 ? (
            <p className="empty">No goals</p>
          ) : (
            goals.slice(0, 3).map((g) => (
              <div key={g._id} style={{ marginTop: "10px" }}>
                <div className="row-item">
                  <span>{g.title}</span>
                  <span>{g.progress}%</span>
                </div>

                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${g.progress}%` }}
                  ></div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}