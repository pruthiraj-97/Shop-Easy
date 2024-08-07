// src/components/AdminVerification.js
import React, { useState } from 'react';
import './verifyAdmin.css';
import url from '../store/urls';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
const AdminVerification = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate=useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();
      const response=await fetch(`${url}/adminpannel/verifyadmin`,{
        method:'POST',
        headers:{
          'Content-Type':'application/json',
          'x-access-token':localStorage.getItem('token')
        },
        body:JSON.stringify({
          email,password
        })
      })
      const data=await response.json()
      console.log(data)
      if(data.status==200){
        navigate('/adminpannel')
      }
      if(data.status==400){
        setError(data.message)
      }
      if(data.status==401){
        navigate('/loginadmin')
      }
  };

  return (
    <div className="admin-verification-container">
      <h2 className="admin-verification-title">Admin Verification</h2>
      <form className="admin-verification-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="submit-button">Verify</button>
        <p className='admin-login'>login account account? <Link to="/loginadmin">Login</Link></p>
      </form>
    </div>
  );
};

export default AdminVerification;
