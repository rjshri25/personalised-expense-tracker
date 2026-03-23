import { useEffect, useState } from "react";
import "./styles.css";

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [goals, setGoals] = useState([]);

  // ✅ FETCH DATA FROM BACKEND
  useEffect(() => {
    fetch("http://localhost:5000/transactions")
      .then((res) => res.json())
      .then(setTransactions);

    fetch("http://localhost:5000/goals")
      .then((res) => res.json())
      .then(setGoals);
  }, []);

  // ✅ CALCULATIONS
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((a, b) => a + Number(b.amount), 0);

  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((a, b) => a + Number(b.amount), 0);

  const savings = income - expense;

  // ✅ CATEGORY BREAKDOWN
  const categoryMap = {};
  transactions.forEach((t) => {
    if (t.type === "expense") {
      categoryMap[t.category] =
        (categoryMap[t.category] || 0) + Number(t.amount);
    }
  });

  const categories = Object.entries(categoryMap);

  // ✅ RECENT TRANSACTIONS (last 3)
  const recent = [...transactions].slice(-3).reverse();

  return (
    <div className="container">

      {/* HEADER */}
      <div className="header-box">
        <div className="header">
          <div className="header-text">
            <h1>Financial Dashboard</h1>
            <p>Track your income, expenses, and savings</p>
          </div>
        </div>

        {/* TOP CARDS */}
        <div className="cards">
          <div className="card income">
            <p>Total Income</p>
            <h2>${income.toFixed(2)}</h2>
          </div>

          <div className="card expense">
            <p>Total Expenses</p>
            <h2>${expense.toFixed(2)}</h2>
          </div>

          <div className="card balance">
            <p>Net Savings</p>
            <h2>${savings.toFixed(2)}</h2>
          </div>

          <div className="card goals">
            <p>Active Goals</p>
            <h2>{goals.length}</h2>
          </div>
        </div>
      </div>

   
      <div className="form" style={{ marginTop: "20px" }}>
        <div className="form-header">
          <h3>📊 Monthly Summary Report</h3>
        </div>

        <div className="form-body">

        
          <h3>Financial Overview</h3>

          <div className="cards">
            <div className="card income">
              <h4>Total Income</h4>
              <p>${income.toFixed(2)}</p>
            </div>

            <div className="card expense">
              <h4>Total Expenses</h4>
              <p>${expense.toFixed(2)}</p>
            </div>

            <div className="card balance">
              <h4>Net Savings</h4>
              <p>${savings.toFixed(2)}</p>
            </div>
          </div>

          {/* CATEGORY BREAKDOWN */}
          <h3 style={{ marginTop: "20px" }}>
            Category-wise Breakdown
          </h3>

          {categories.length === 0 ? (
            <p className="empty">No expense data</p>
          ) : (
            categories.map(([cat, amt]) => {
              const percent = ((amt / expense) * 100).toFixed(1);

              return (
                <div key={cat} style={{ marginBottom: "15px" }}>
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between"
                  }}>
                    <span>{cat}</span>
                    <span>${amt} ({percent}%)</span>
                  </div>

                  <div className="budget-progress-bar">
                    <div
                      className="budget-progress-fill"
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                </div>
              )
            })
          )}

        </div>
      </div>
      
      <div className="cards" style={{ marginTop: "20px" }}>

        {/* RECENT TRANSACTIONS */}
        <div className="simple-card" style={{ flex: 1 }}>   
          <h4>Recent Transactions</h4>

          {recent.length === 0 ? (
            <p className="empty">No transactions</p>
          ) : (
            recent.map((t) => (
              <div key={t._id} style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "10px"
              }}>
                <span>{t.category}</span>
                <span className={t.type === "expense" ? "red" : "green"}>
                  {t.type === "expense" ? "-" : "+"}${t.amount}
                </span>
              </div>
            ))
          )}
        </div>

        {/* GOALS */}
        <div className="simple-card" style={{ flex: 1 }}>
          <h4>Savings Goals</h4>

          {goals.length === 0 ? (
            <p className="empty">No goals</p>
          ) : (
            goals.slice(0, 3).map((g) => (
              <div key={g._id} style={{ marginTop: "10px" }}>
                <div style={{
                  display: "flex",
                  justifyContent: "space-between"
                }}>
                  <span>{g.title}</span>
                  <span>{g.progress}%</span>
                </div>

                <div className="savings-progress-bar">
                  <div
                    className="savings-progress-fill"
                    style={{ width: `${g.progress}%` }}
                  ></div>
                </div>
              </div>
            ))
          )}
        </div>

      </div>

    </div>
  );
}