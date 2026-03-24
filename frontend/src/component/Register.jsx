import { NavLink } from 'react-router-dom'
import './styles.css'
import { useForm } from 'react-hook-form'
import { useEffect } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import axios from 'axios'

export default function Register(){
const{register,handleSubmit,setFocus,setValue,watch,formState:{errors}}=useForm()

const onFormSubmit=async(data)=>{
toast.loading('Registering user',{id:'loader'})
try{
const res=await axios.post('http://localhost:6087/register',data)
const resData=res.data
if(resData.status){
toast.success(resData.message,{id:'loader'})
setValue('fullName','')
setValue('email','')
setValue('password','')
setValue('confirmpassword','')
}
else{
toast.error(resData.message,{id:'loader'})
if(resData.message==='user exists!!'){
setValue('email','')
setFocus('email')
}
}
}catch{
toast.error('Something went wrong',{id:'loader'})
}
}

const password=watch('password')
useEffect(()=>{
setFocus('fullName')
},[])

return(
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
{...register('fullName',{
required:'Full Name is required',
minLength:{value:3,message:'Minimum 3 characters'},
pattern:{value:/^[A-Za-z ]+$/,message:'Only letters allowed'}
})}
/>
</div>
{errors.fullName && <p style={{ color: 'red' }}>{errors.fullName.message}</p>}
</div>

<div className="inputfield">
<label>Email</label>
<div className="input-with-icon">
<i className="ri-mail-fill"></i>
<input
type="email"
{...register('email',{
required:'Email is required',
pattern:{value:/^\S+@\S+\.\S+$/,message:'Invalid email'}
})}
/>
</div>
{errors.email && <p style={{ color: 'red' }}>{errors.email.message}</p>}
</div>

<div className="inputfield">
<label>Password</label>
<div className="input-with-icon">
<i className="ri-key-fill"></i>
<input
type="password"
{...register('password',{
required:'Password is required',
minLength:{value:6,message:'Minimum 6 characters'},
pattern:{
value:/^(?=.*[A-Z])(?=.*[0-9]).*$/,
message:'Must include 1 capital & 1 number'
}
})}
/>
</div>
{errors.password && <p style={{ color: 'red' }}>{errors.password.message}</p>}
</div>

<div className="inputfield">
<label>Confirm Password</label>
<div className="input-with-icon">
<i className="ri-key-fill"></i>
<input
type="password"
{...register('confirmpassword',{
required:'Confirm your password',
validate:(value)=>value===password||'Passwords do not match'
})}
/>
</div>
{errors.confirmpassword && <p style={{ color: 'red' }}>{errors.confirmpassword.message}</p>}
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