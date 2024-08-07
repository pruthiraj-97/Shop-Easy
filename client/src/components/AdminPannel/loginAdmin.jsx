import React,{useState,useEffect} from "react";
import { Link,useNavigate } from "react-router-dom";
import { IoEye } from "react-icons/io5";
import { IoEyeOff } from "react-icons/io5";
import url from '../store/urls'
import '../AuthcomponentCSS/login.css';
function LoginAdmin() {
    const [password,setPassword]=useState('')
    const [email,setEmail]=useState('')
    const [error,setError]=useState('')
    const [showpassword,setShowPassword]=useState(false)
    const navigate=useNavigate()
    async function loginUserByemail(e){
        e.preventDefault()
        const response=await fetch(`${url}/adminpannel/loginadmin`,{
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
          navigate('/adminpannel')
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
        <p className="signup-admin">Don't have an account? <Link to="/signupadmin">SignUp</Link></p>
      </div>
    </div>
    )
}
export default LoginAdmin