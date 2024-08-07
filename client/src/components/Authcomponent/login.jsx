import React,{useState,useEffect} from "react";
import { Link,useNavigate } from "react-router-dom";
import { IoEye } from "react-icons/io5";
import { IoEyeOff } from "react-icons/io5";
import url from '../store/urls'
import '../AuthcomponentCSS/login.css';
function Login() {
    const [password,setPassword]=useState('')
    const [email,setEmail]=useState('')
    const [contactNumber,setContactNumber]=useState('')
    const [userotp,setUserotp]=useState('')
    const [error,setError]=useState('')
    const [showpassword,setShowPassword]=useState(false)
    const navigate=useNavigate()
    async function sendOtp(e){
      e.preventDefault()
      const response=await fetch(`${url}/otp/sendotp`,{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify({
            contactNumber
        })
      })
      const data=await response.json()
      console.log(data)
    }
    async function loginUserByemail(e){
        e.preventDefault()
        const response=await fetch(`${url}/auth/loginemail`,{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                email,password
            })
        })
        const data=await response.json()
        if(data.success){
        localStorage.setItem('token',data.token)
        localStorage.setItem('user',JSON.stringify(data.user))
        navigate('/shopdashboard')
        }else{
          setError(data.message)
        }
    }
     
    async function loginUserByOtp(e){
        e.preventDefault()
        const response=await fetch(`${url}/auth/loginotp`,{
          method:'POST',
          headers:{
              'Content-Type':'application/json'
          },
          body:JSON.stringify({
              contactNumber,userotp
          })
        })
        const data=await response.json()
        if(data.success){
          localStorage.setItem('token',data.token)
          localStorage.setItem('user',JSON.stringify(data.user))
          navigate('/shopdashboard')
          }else{
            setError(data.message)
          }
    }

    return (
      <div className="login-form">
        {
          error && <p className="error">{error}</p>
        }
      <div className="login-section">
        <h2>Login with Email</h2>
        <form>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="password-field">
      <input
          type={!showpassword?"password":"text"}
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
     />
          {
            !showpassword?
            <IoEye
            onClick={() => setShowPassword(!showpassword)}
            className="eye-icon"
            />:
            <IoEyeOff
            onClick={() => setShowPassword(!showpassword)}
            className="eye-icon"
            />
          }
     </div>
          <button type="submit"
           onClick={loginUserByemail}
           className="login-button"
          >Login</button>
        </form>
      </div>
      <div className="login-section">
        <h2>Login with OTP</h2>
        <form>
          <input
            type="text"
            placeholder="Enter contact number"
            value={contactNumber}
            onChange={(e) => setContactNumber(e.target.value)}
          />
          <button type="button"
           className="login-button"
            onClick={sendOtp}
          >Send OTP</button>
          <input
            type="text"
            placeholder="Enter OTP"
            value={userotp}
            onChange={(e) => setUserotp(e.target.value)}
          />
          <button type="submit"
           className="login-button"
            onClick={loginUserByOtp}
          >Login</button>
        </form>
      </div>
      <Link to={'/signup'} className="signup-link">Signup</Link>
    </div>
    )
}
export default Login