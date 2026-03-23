import { NavLink } from 'react-router-dom';
import './styles.css';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
export default function Register(){
    const{register,handleSubmit,setFocus,setValue,watch,formState:{errors}}=useForm()
    const onFormSubmit=(data)=>{
        toast.loading('Registering user', {Id:'loader'})
        setTimeout(async()=>{
        const res=await axios.post(
            'http://localhost:6087/register',data)
            const resData=res.data
            if(resData.status)
            {
               toast.success(resData.message,{Id:'loader'})
            }
            else if(resData.message =='user exists!!')
            {
toast.error(resData.message,{Id:'loader'})
        setValue('email','')
        setFocus('email')
            }
        },2000)
    }
    const password=watch('password')
    useEffect(()=>{
setFocus('fullName')
    })
  return (
  <>
    <Toaster position="top-center" />

    <div className="login-container">
      <div className="login-layout">

      
        <div className="login-left">
          <div className="overlay">
            <h1>Create Account 🚀</h1>
            <p>Join us and start your journey</p>
          </div>
        </div>

        <div className="login-right">
          <form onSubmit={handleSubmit(onFormSubmit)} className="login-card">

            <h2>Register</h2>

            <div className="inputfield">
              <label>Full Name</label>
              <div className="input-with-icon">
                <i className="ri-user-3-fill"></i>
                <input
                  type="text"
                  {...register('fullName', {
                    required: 'Full Name is required',
                    minLength: {
                      value: 8,
                      message: 'Full Name must be at least 8 characters'
                    }
                  })}
                />
              </div>
              {errors.fullName && <p>{errors.fullName.message}</p>}
            </div>

            <div className="inputfield">
              <label>Email</label>
              <div className="input-with-icon">
                <i className="ri-mail-fill"></i>
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
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    }
                  })}
                />
              </div>
              {errors.password && <p>{errors.password.message}</p>}
            </div>

            <div className="inputfield">
              <label>Confirm Password</label>
              <div className="input-with-icon">
                <i className="ri-key-fill"></i>
                <input
                  type="password"
                  {...register('confirmpassword', {
                    required: 'Please confirm password',
                    validate: (value) =>
                      value === password || "Passwords don't match"
                  })}
                />
              </div>
              {errors.confirmpassword && <p>{errors.confirmpassword.message}</p>}
            </div>

            <button type="submit">Register</button>

            <div className="linkling">
              <p>
                Already have an account? <NavLink to="/">Login</NavLink>
              </p>
            </div>

          </form>
        </div>

      </div>
    </div>
  </>
)
}