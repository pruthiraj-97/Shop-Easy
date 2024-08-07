import React,{useState,useEffect} from "react";
import '../AuthcomponentCSS/signup.css';
import { states, cities } from "../store/stateAndCity";
import { Link ,useNavigate} from "react-router-dom";
import { IoEye } from "react-icons/io5";
import { IoEyeOff } from "react-icons/io5";
import url from '../store/urls'
function Signup(){
 const navigate=useNavigate()
 const [username,setUsername]=useState('');
 const [email,setEmail]=useState('');
 const [password,setPassword]=useState('');
 const [contactNumber,setContactNumber]=useState('');
 const [type,setType]=useState('');
 const [state,setState]=useState('');
 const [city,setCity]=useState('');
 const [pincode,setPincode]=useState('');
 const [userotp,setUserotp]=useState('');
 const [error,setError]=useState('')
 const [showpassword,setShowPassword]=useState(false)
 const [otpMessage,setOtpMessage]=useState('')
 const [cities,setCities]=useState([])
 const [states,setStates]=useState([])
 useEffect(()=>{
    (async ()=>{
       const response=await fetch(`${url}/adminpannel/city/state`,{
         method:'GET',
         headers:{
           'Content-Type':'application/json',
         }
       })
       const data=await response.json()
       setCities(data.city)
       setStates(data.state)
       console.log(data)
    })()
 },[])
 async function handleSubmit(e){
    e.preventDefault()
    console.log(username,email,password,contactNumber,type,state,city,pincode,userotp)
    const response=await fetch(`${url}/auth/signup`,{
      method:'POST',
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify({
        username,email,password,contactNumber,type,state,city,pincode,userotp
      })
    })
    const data=await response.json()
    if(data.success){
       navigate('/login')
    }else{
      setError(data.message)
    }
 }
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
    const data= await response.json()
    if(data.success){
      setOtpMessage(data.message)
    }
 }


    return (
      <div className="container">
      {
        error&&<div className="error">{error}</div>
      }
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input type="text" id="username" name="username" value={username} 
            onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <div className="password-input">
          <input  type={!showpassword?"password":"text"}
          id="password" name="password" value={password} 
            onChange={(e) => setPassword(e.target.value)} required />
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
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" value={email} 
            onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="contactnumber">Contact Number</label>
          <div className="contact-number-input">
            <input type="tel" id="contactnumber" name="contactnumber" value={contactNumber} 
              onChange={(e) => setContactNumber(e.target.value)} required />
            <button type="button" className="send-otp-button" onClick={sendOtp}>
              Send OTP
            </button>
          </div>
          {
            otpMessage.length>0&&<div className="otp-message">{otpMessage}</div>
          }
        </div>
        <div className="form-group">
          <label htmlFor="otp">OTP</label>
          <input type="text" id="otp" name="otp" value={userotp} 
            onChange={(e) => setUserotp(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="usertype">User Type</label>
          <select id="usertype" name="usertype" value={type} 
            onChange={(e) => setType(e.target.value)} required>
            <option value={null}>Select User Type</option>
            <option value="owner">Owner</option>
            <option value="user">User</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="state">State</label>
          <select id="state" name="state" value={state} 
            onChange={(e) => setState(e.target.value)} required>
            <option value="">Select State</option>
            {cities.map((item, index) => (
              <option key={index} value={item._id}>{item.city}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="city">City</label>
          <select id="city" name="city" value={city} 
            onChange={(e) => setCity(e.target.value)} required>
            <option value="">Select City</option>
            {states.map((item, index) => (
              <option key={index} value={item._id}>{item.state}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="pincode">Pincode</label>
          <input type="text" id="pincode" name="pincode" value={pincode} 
            onChange={(e) => setPincode(e.target.value)} required />
        </div>
        <div className="form-group">
          <input type="submit" value="Submit" />
        </div>
        <p className="login-link">login your account account? <Link to={'/login'} className="login">Login</Link></p>
      </form>
    </div>

    )
}

export default Signup