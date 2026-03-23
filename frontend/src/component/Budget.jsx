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

  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        const res = await axios.get("http://localhost:6087/budgets");
        setBudgets(res.data);
      } catch {
        toast.error("Failed to fetch budgets");
      }
    };
    fetchBudgets();
  }, []);

  const handleAdd = async () => {
    if (!form.category || !form.limit || !form.month) {
      toast.error("Fill required fields!");
      return;
    }

    const toastId = toast.loading("Adding budget...");

    try {
      const res = await axios.post("http://localhost:6087/budgets", form);
      setBudgets([...budgets, res.data]);
      setForm({ category: "", limit: "", spent: "", month: "" });
      setShowForm(false);
      toast.success("Budget added!", { id: toastId });
    } catch {
      toast.error("Failed to add budget", { id: toastId });
    }
  };

  const handleAddSpent = async (b) => {
    const amount = addSpent[b._id];
    if (!amount) {
      toast.error("Enter amount!");
      return;
    }

    const toastId = toast.loading("Updating...");

    try {
      const res = await axios.put(
        `http://localhost:6087/budgets/${b._id}`,
        { spent: amount }
      );

      setBudgets((prev) =>
        prev.map((item) => (item._id === res.data._id ? res.data : item))
      );

      setAddSpent((prev) => ({ ...prev, [b._id]: "" }));

      if (res.data.status === "overspent") {
        toast.error("Overspending!");
      } else if (res.data.status === "warning") {
        toast("Near budget limit!", { icon: "⚠" });
      }

      toast.success("Updated!", { id: toastId });
    } catch {
      toast.error("Update failed", { id: toastId });
    }
  };

  const handleDelete = async (id) => {
    const toastId = toast.loading("Deleting...");

    try {
      await axios.delete(`http://localhost:6087/budgets/${id}`);
      setBudgets((prev) => prev.filter((b) => b._id !== id));
      toast.success("Deleted!", { id: toastId });
    } catch {
      toast.error("Delete failed", { id: toastId });
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
                    onChange={(e) =>
                      setForm({ ...form, category: e.target.value })
                    }
                  />
                </div>

                <div className="field">
                  <label>Limit *</label>
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
                  <label>Initial Spent</label>
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

        <div className="budget-cards">
          {budgets.length === 0 ? (
            <p className="empty">No budgets added</p>
          ) : (
            budgets.map((b) => (
              <div key={b._id} className="budget-card">
                <h3>{b.category}</h3>

                <p
                  style={{
                    color:
                      b.status === "overspent"
                        ? "red"
                        : b.status === "warning"
                        ? "orange"
                        : "green",
                    fontWeight: "bold",
                  }}
                >
                  {b.status === "overspent"
                    ? "Overspending!"
                    : b.status === "warning"
                    ? "Near limit"
                    : "Safe"}
                </p>

                <p className="budget-progress-text">
                  Used <span>{b.progress}%</span>
                </p>

                <div className="budget-progress-bar">
                  <div
                    className="budget-progress-fill"
                    style={{
                      width: `${b.progress}%`,
                      background:
                        b.status === "overspent"
                          ? "red"
                          : b.status === "warning"
                          ? "orange"
                          : "green",
                    }}
                  ></div>
                </div>

                <div className="budget-amounts">
                  <div>
                    <p>Spent</p>
                    <h4>${b.spent}</h4>
                  </div>
                  <div>
                    <p>Limit</p>
                    <h4>${b.limit}</h4>
                  </div>
                </div>

                <div className="budget-date">{b.month}</div>

                <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
                  <input
                    type="number"
                    placeholder="Add spent"
                    value={addSpent[b._id] || ""}
                    onChange={(e) =>
                      setAddSpent((prev) => ({
                        ...prev,
                        [b._id]: e.target.value,
                      }))
                    }
                    style={{ flex: 1 }}
                  />

                  <button
                    className="savings-btn"
                    onClick={() => handleAddSpent(b)}
                  >
                    Add
                  </button>

                  <button
                    className="cancel-btn"
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
  );
}