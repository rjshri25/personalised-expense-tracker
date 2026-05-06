import axios from "axios"

const API = "https://personalised-expense-tracker-5.onrender.com"


const api = axios.create({
  baseURL: API,
})

export default api;