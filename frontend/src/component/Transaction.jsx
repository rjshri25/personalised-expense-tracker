import { useState } from "react";
import "./styles.css";

export default function Transaction() {
  const [showForm, setShowForm] = useState(false);
  const [transactions, setTransactions] = useState([]);

  const [form, setForm] = useState({
    type: "expense",
    amount: "",
    category: "",
    date: "",
    description: "",
  });

  const handleAdd = () => {
    if (!form.amount || !form.category || !form.date) return;

    setTransactions([...transactions, { ...form, id: Date.now() }]);

    setForm({
      type: "expense",
      amount: "",
      category: "",
      date: "",
      description: "",
    });

    setShowForm(false);
  };

  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((a, b) => a + Number(b.amount), 0);

  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((a, b) => a + Number(b.amount), 0);

  const balance = income - expense;

  return (
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
            <h2>${income}</h2>
          </div>

          <div className="card expense">
            <p>TOTAL EXPENSES</p>
            <h2>${expense}</h2>
          </div>

          <div className="card balance">
            <p>NET BALANCE</p>
            <h2>${balance}</h2>
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
        <label>Amount ($) *</label>
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
        onChange={(e) =>
          setForm({ ...form, description: e.target.value })
        }
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
</div>)}

     <div className="history">
  <h3>Transaction History</h3>

  {transactions.length === 0 ? (
    <p className="empty">No transactions found</p>
  ) : (
    transactions.map((t) => (
      <div key={t.id} className="history-item">

       
        <div className="left">
          <div className="icon">
            {t.type === "expense" ? "↘" : "↗"}
          </div>

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
            {t.type === "expense" ? "-" : "+"}${t.amount}
          </span>

          <div className="actions">
            
          </div>
        </div>

      </div>
    ))
  )}
</div>
    </div>
  );
}

