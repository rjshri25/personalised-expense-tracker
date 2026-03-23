
import { Route, Router, Routes } from 'react-router-dom'
import './App.css'
import Login from './component/Login'
import Register from './component/Register'
import Dashboard from './component/Dashboard'
import Transaction from './component/Transaction'
import DashboardLayout from './component/DashboardLayout'
import SavingGoal from './component/SavingGoal'
import Budget from './component/Budget'
import Calendar from './component/Calendar'

function App() {
  return (
    <>
<Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/transaction" element={<Transaction />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/budget" element={<Budget />} />
        <Route path="/savinggoal" element={<SavingGoal />} />
      </Route>
    </Routes>
      </>
  )
}

export default App
