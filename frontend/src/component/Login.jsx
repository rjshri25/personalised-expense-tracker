import { NavLink, useNavigate } from 'react-router-dom'
import './styles.css'
import { useForm } from 'react-hook-form'
import { useEffect } from 'react'
import toast, { Toaster } from 'react-hot-toast'

export default function Login() {
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors }
  } = useForm()

  
  const onFormSubmit = () => {
    toast.loading('Logging in...', { id: 'login' })

    setTimeout(() => {
      toast.success('Login successful', { id: 'login' })
      navigate('/dashboard') 
    }, 1000)
  }

  useEffect(() => {
    setFocus('email')
  }, [])

  return (
  <>
    <Toaster position="top-center" />

    <div className="login-container">
      <div className="login-layout">
        
        {/* LEFT PANEL */}
        <div className="login-left">
          <div className="overlay">
            <h1>Welcome Back 👋</h1>
            <p>Login to continue your journey</p>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="login-right">
          <form onSubmit={handleSubmit(onFormSubmit)} className="login-card">
            
            <h2>Login</h2>

            <div className="inputfield">
              <label>Username</label>
              <div className="input-with-icon">
                <i className="ri-user-3-fill"></i>
                <input
                  type="email"
                  {...register('email', { required: 'Email is required' })}
                />
              </div>
              {errors.email && <p>{errors.email.message}</p>}
            </div>

            <div className="inputfield">
              <label>Password</label>
              <div className="input-with-icon">
                <i className="ri-key-fill"></i>
                <input
                  type="password"
                  {...register('password', { required: 'Password is required' })}
                />
              </div>
              {errors.password && <p>{errors.password.message}</p>}
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
