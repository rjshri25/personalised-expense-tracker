import './styles.css'
import { useNavigate, useLocation } from "react-router-dom"

export default function MenuBar() {
  const navigate = useNavigate()
  const location = useLocation()

  function isActive(path) {
    return location.pathname === path
  }

  return (
    <div className="Menu">
      <div className="header">
        <div className="Label-icon">
          <div className="logo-icon">
            <i className="ri-wallet-3-fill"></i>
          </div>

          <div className="logo-text">
            <h3>MoneyTracker</h3>
            <p>Personal Finance</p>
          </div>
        </div>
      </div>

      <div className="linking">

        <div
          className={`Section-icon ${isActive("/dashboard") ? "active" : ""}`}
          onClick={() => navigate("/dashboard")}
        >
          <i className="ri-dashboard-line"></i>
          <span>Dashboard</span>
        </div>

        <div
          className={`Section-icon ${isActive("/transaction") ? "active" : ""}`}
          onClick={() => navigate("/transaction")}
        >
          <i className="ri-file-list-2-line"></i>
          <span>Transaction</span>
        </div>

        <div
          className={`Section-icon ${isActive("/calendar") ? "active" : ""}`}
          onClick={() => navigate("/calendar")}
        >
          <i className="ri-calendar-event-fill"></i>
          <span>Calendar</span>
        </div>

        <div
          className={`Section-icon ${isActive("/budget") ? "active" : ""}`}
          onClick={() => navigate("/budget")}
        >
          <i className="ri-bill-line"></i>
          <span>Budget</span>
        </div>

        <div
          className={`Section-icon ${isActive("/savinggoal") ? "active" : ""}`}
          onClick={() => navigate("/savinggoal")}
        >
          <i className="ri-trophy-line"></i>
          <span>Saving Goal</span>
        </div>

      </div>
    </div>
  )
}