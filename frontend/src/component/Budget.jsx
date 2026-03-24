import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
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
  const [addSpent, setAddSpent] = useState({});

  // Get logged-in userId from localStorage
  const userId = JSON.parse(localStorage.getItem("user"))?._id;

  useEffect(() => {
    if (!userId) return toast.error("Please login first");

    const fetchBudgets = async () => {
      try {
        const res = await axios.get(`http://localhost:6087/budgets/${userId}`);
        if (res.data.status) setBudgets(res.data.budgets);
        else toast.error(res.data.message);
      } catch {
        toast.error("Failed to fetch budgets");
      }
    };

    fetchBudgets();
  }, [userId]);

  const handleAdd = async () => {
    if (!form.category || !form.limit || !form.month)
      return toast.error("Fill all required fields!");

    if (!userId) return toast.error("User not logged in");

    const toastId = toast.loading("Adding budget...");

    try {
      const res = await axios.post("http://localhost:6087/budgets", {
        ...form,
        userId,
      });
      if (res.data.status) {
        setBudgets([...budgets, res.data.budget]);
        setForm({ category: "", limit: "", spent: "", month: "" });
        setShowForm(false);
        toast.success("Budget added!", { id: toastId });
      } else {
        toast.error(res.data.message, { id: toastId });
      }
    } catch {
      toast.error("Failed to add budget", { id: toastId });
    }
  };

  const handleUpdate = async (b) => {
    const amount = addSpent[b._id];
    if (!amount) return toast.error("Enter an amount first!");
    if (!userId) return toast.error("User not logged in");

    const toastId = toast.loading("Updating budget...");

    try {
      const res = await axios.put(`http://localhost:6087/budgets/${b._id}`, {
        spent: amount,
        userId,
      });

      if (res.data.status) {
        setBudgets((prev) =>
          prev.map((item) => (item._id === res.data.budget._id ? res.data.budget : item))
        );
        setAddSpent((prev) => ({ ...prev, [b._id]: "" }));

        if (res.data.budget.progress > 100) {
          toast.error("Overspending!", { id: toastId });
        } else {
          toast.success("Budget updated!", { id: toastId });
        }
      } else {
        toast.error(res.data.message, { id: toastId });
      }
    } catch {
      toast.error("Failed to update budget", { id: toastId });
    }
  };

  const handleDelete = async (id) => {
    if (!userId) return toast.error("User not logged in");
    const toastId = toast.loading("Deleting budget...");

    try {
      await axios.delete(`http://localhost:6087/budgets/${id}/${userId}`);
      setBudgets((prev) => prev.filter((b) => b._id !== id));
      toast.success("Budget deleted!", { id: toastId });
    } catch {
      toast.error("Failed to delete budget", { id: toastId });
    }
  };

  return (
    <>
      <Toaster position="top-center" />

      <div className="container">
        <div className="header-box">
          <div className="header">
            <div className="header-text">
              <h1>Budget Management</h1>
              <p>Track your spending</p>
            </div>
            <button className="add-btn" onClick={() => setShowForm(!showForm)}>
              + Set Budget
            </button>
          </div>
        </div>

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
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                  />
                </div>
                <div className="field">
                  <label>Limit *</label>
                  <input
                    type="number"
                    value={form.limit}
                    onChange={(e) => setForm({ ...form, limit: e.target.value })}
                  />
                </div>
              </div>
              <div className="row">
                <div className="field">
                  <label>Initial Spent</label>
                  <input
                    type="number"
                    value={form.spent}
                    onChange={(e) => setForm({ ...form, spent: e.target.value })}
                  />
                </div>
                <div className="field">
                  <label>Month *</label>
                  <input
                    type="month"
                    value={form.month}
                    onChange={(e) => setForm({ ...form, month: e.target.value })}
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

        <div className="budget-cards">
          {budgets.length === 0 ? (
            <p className="empty">No budgets added</p>
          ) : (
            budgets.map((b) => (
              <div key={b._id} className="budget-card">
                <h3>{b.category}</h3>
                <p className="budget-progress-text">
                  Used <span>{b.progress.toFixed(1)}%</span>
                </p>
                <div className="budget-progress-bar">
                  <div
                    className="budget-progress-fill"
                    style={{
                      width: `${Math.min(b.progress, 100)}%`,
                      background: b.progress > 100 ? "red" : "#4caf50",
                    }}
                  ></div>
                </div>
                <div className="budget-amounts">
                  <div>
                    <p>Spent</p>
                    <h4>₹{b.spent || 0}</h4>
                  </div>
                  <div>
                    <p>Limit</p>
                    <h4>₹{b.limit}</h4>
                  </div>
                </div>
                <div className="budget-date">{b.month}</div>
                <div style={{ display: "flex", gap: "8px", marginTop: "10px", alignItems: "center" }}>
                  <input
                    type="number"
                    placeholder="Add amount"
                    value={addSpent[b._id] || ""}
                    onChange={(e) =>
                      setAddSpent((prev) => ({ ...prev, [b._id]: e.target.value }))
                    }
                    style={{ flex: 1, padding: "6px", fontSize: "14px", width: "60px" }}
                  />
                  <button
                    className="savings-btn"
                    style={{ width: "80px", padding: "6px 0" }}
                    onClick={() => handleUpdate(b)}
                  >
                    + Add
                  </button>
                  <button
                    className="cancel-btn"
                    style={{ width: "80px", padding: "6px 0" }}
                    onClick={() => handleDelete(b._id)}
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