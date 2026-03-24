import { NavLink, useNavigate } from "react-router-dom"
import "./styles.css"
import { useForm } from "react-hook-form"
import { useEffect } from "react"
import toast, { Toaster } from "react-hot-toast"
import axios from "axios"

export default function Login() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors },
    reset
  } = useForm()

 
  const onFormSubmit = async (data) => {
    toast.loading("Logging in...", { id: "login" })

    try {
      const res = await axios.post("http://localhost:6087/login", data)
      const resData = res.data

      if (resData.status) {
        toast.success(resData.message, { id: "login" })
        localStorage.setItem("user", JSON.stringify(resData.user))
        localStorage.setItem("userId", resData.user._id)
        reset()
        navigate("/dashboard")
      } else {
        toast.error(resData.message, { id: "login" })
      }
    } catch (err) {
      console.error(err)
      toast.error("Something went wrong", { id: "login" })
    }
  }
  useEffect(() => {
    setFocus("email")
  }, [])

  return (
    <>
      <Toaster position="top-center" />

      <div className="login-container">
        <div className="login-layout">
          <div className="login-left">
            <div className="overlay">
              <h1>Welcome Back 👋</h1>
              <p>Login to continue your journey</p>
            </div>
          </div>

          <div className="login-right">
            <form onSubmit={handleSubmit(onFormSubmit)} className="login-card">
              <h2>Login</h2>

              <div className="inputfield">
                <label>Email</label>
                <div className="input-with-icon">
                  <i className="ri-mail-fill"></i>
                  <input
                    type="email"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^\S+@\S+\.\S+$/,
                        message: "Invalid email format"
                      }
                    })}
                  />
                </div>
                {errors.email && <p style={{ color: "red" }}>{errors.email.message}</p>}
              </div>

              <div className="inputfield">
                <label>Password</label>
                <div className="input-with-icon">
                  <i className="ri-key-fill"></i>
                  <input
                    type="password"
                    {...register("password", {
                      required: "Password is required",
                      minLength: { value: 6, message: "Minimum 6 characters" }
                    })}
                  />
                </div>
                {errors.password && <p style={{ color: "red" }}>{errors.password.message}</p>}
              </div>

              <button type="submit">Login</button>

              <div className="linkling">
                <p>
                  New user? <NavLink to="/register">Click here</NavLink>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}