import React, { useState, useEffect } from "react"
import axios from "axios"
import toast, { Toaster } from "react-hot-toast"
import "./styles.css"

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [transactions, setTransactions] = useState({})

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const today = new Date()

  
  const userId = localStorage.getItem("userId")

  useEffect(() => {
    if (!userId) {
      toast.error("Please login first")
      return
    }

    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:6087/transactions/calendar/${userId}`)
        if (res.data.status) setTransactions(res.data.transactions)
        else toast.error(res.data.message)
      } catch {
        toast.error("Failed to load calendar")
      }
    }

    fetchData()
  }, [userId])

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1))
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1))
  const goToday = () => setCurrentDate(new Date())

  let incomeDays = 0
  let expenseDays =0
  let noEntryDays =0

  for (let i = 1; i <= daysInMonth; i++) {
    const key = `${year}-${String(month + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`
    const data = transactions[key]

    if (data) {
      if (data.income > 0) incomeDays++
      if (data.expense > 0) expenseDays++
    } else {
      noEntryDays++
    }
  }

  return (
    <>
      <Toaster position="top-center" />
      <div className="container">
        <div className="header-box">
          <div className="header">
            <div className="header-text">
              <h1>Expense Calendar</h1>
              <p>Track your daily income & expenses</p>
            </div>

            <div className="calendar-nav">
              <button onClick={prevMonth}>{"<"}</button>
              <span>
                {currentDate.toLocaleString("default", { month: "long" })} {year}
              </span>
              <button onClick={nextMonth}>{">"}</button>
              <button className="today-btn" onClick={goToday}>
                Today
              </button>
            </div>
          </div>
        </div>

        <div className="calendar-box">
          <div className="calendar-grid">
            {days.map((day) => (
              <div key={day} className="day-name">{day}</div>
            ))}

            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={i}></div>
            ))}

            {Array.from({ length: daysInMonth }).map((_, index) => {
              const date = index + 1;
              const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(date).padStart(2, "0")}`;
              const data = transactions[dateKey];

              const isCurrentMonth = month === today.getMonth() && year === today.getFullYear();
              const isToday = isCurrentMonth && date === today.getDate();

              return (
                <div key={date} className={`day-cell ${isToday ? "today" : ""}`}>
                  <span className="date">{date}</span>
                  {data ? (
                    <>
                      <div className="income">↗ ₹{data.income}</div>
                      <div className="expense">↘ ₹{data.expense}</div>
                    </>
                  ) : (
                    <span className="no-entry">No entry</span>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <div className="cards">
          <div className="simple-card">
            <h4>Income Days</h4>
            <p>{incomeDays}</p>
          </div>

          <div className="simple-card">
            <h4>Expense Days</h4>
            <p>{expenseDays}</p>
          </div>

          <div className="simple-card">
            <h4>No Entry Days</h4>
            <p>{noEntryDays}</p>
          </div>
        </div>
      </div>
    </>
  )
}