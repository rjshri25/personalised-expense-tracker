import { useState } from "react";
import "./styles.css";

export default function Budget() {
  const [showForm, setShowForm] = useState(false);
  const [budgets, setBudgets] = useState([]);

  const [form, setForm] = useState({
    category: "",
    limit: "",
    spent: "",
    month: "",
  });

  const handleAdd = () => {
    if (!form.category || !form.limit || !form.month) return;

    const progress =
      form.limit > 0
        ? ((Number(form.spent) / Number(form.limit)) * 100).toFixed(1)
        : 0;

    setBudgets([
      ...budgets,
      { ...form, progress, id: Date.now() },
    ]);

    setForm({
      category: "",
      limit: "",
      spent: "",
      month: "",
    });

    setShowForm(false);
  };

  return (
    <div className="container">

      {/* HEADER */}
      <div className="header-box">
        <div className="header">
          <div className="header-text">
            <h1>Budget Management</h1>
            <p>Set spending limits and track your budget</p>
          </div>

          <button className="add-btn" onClick={() => setShowForm(!showForm)}>
            + Set Budget
          </button>
        </div>
      </div>

      {/* FORM */}
      {showForm && (
        <div className="form">

          <div className="form-header">
            <h3>+ New Budget</h3>
          </div>

          <div className="form-body">

            <div className="row">
              <div className="field">
                <label>Category *</label>
                <input
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                />
              </div>

              <div className="field">
                <label>Monthly Limit *</label>
                <input
                  type="number"
                  value={form.limit}
                  onChange={(e) =>
                    setForm({ ...form, limit: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="row">
              <div className="field">
                <label>Amount Spent</label>
                <input
                  type="number"
                  value={form.spent}
                  onChange={(e) =>
                    setForm({ ...form, spent: e.target.value })
                  }
                />
              </div>

              <div className="field">
                <label>Month *</label>
                <input
                  type="month"
                  value={form.month}
                  onChange={(e) =>
                    setForm({ ...form, month: e.target.value })
                  }
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

      {/* BUDGET CARDS */}
      <div className="budget-cards">
        {budgets.length === 0 ? (
          <p className="empty">No budgets added</p>
        ) : (
          budgets.map((b) => (
            <div key={b.id} className="budget-card">

              <h3>{b.category}</h3>

              <p className="budget-progress-text">
                Used <span>{b.progress}%</span>
              </p>

              <div className="budget-progress-bar">
                <div
                  className="budget-progress-fill"
                  style={{ width: `${b.progress}%` }}
                ></div>
              </div>

              <div className="budget-amounts">
                <div>
                  <p>Spent</p>
                  <h4>${b.spent || 0}</h4>
                </div>
                <div>
                  <p>Limit</p>
                  <h4>${b.limit}</h4>
                </div>
              </div>

              <div className="budget-date">
                <span>{b.month}</span>
              </div>

              <button className="budget-btn">
                Manage Budget
              </button>

            </div>
          ))
        )}
      </div>

    </div>
  );
}