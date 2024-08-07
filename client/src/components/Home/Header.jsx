import React, { useState,useEffect } from "react";
import '../HomeCss/Header.css'
import { BsCart4 } from "react-icons/bs";
import { Link ,useNavigate,useNavigation} from "react-router-dom";
function Header(){
    const navigate=useNavigate()
    return (
        <>
        <div className="header-container">
            <div className="logo-container">
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJ427YsVkj6UETgonuIN9WrREy97aazFQAkDM_dkWmyg&s" alt=""  className="logo-image"/>
            </div>
            <div className="filed-container">
             <div className="parts-container1">
               <Link to={'/'} className="Link-tag">Home</Link>
               <Link to={'/about'} className="Link-tag">About</Link>
             </div>
             <p className="Head-name"
              onClick={()=>navigate('/about')}
             >Shop Easy.com</p>
             <div className="parts-container2">
                <Link to={'/AdminVerification'} className="Link-tag">Admin</Link>
                <Link to={'/login'} className="Link-tag">Login</Link>
                <Link  to={'/shopdashboard'}  className="Link-tag">Start Shoping</Link>
                <img 
                 onClick={()=>navigate('/profile')}
                src="https://previews.123rf.com/images/remodesigner/remodesigner1906/remodesigner190600575/131360456-portrait-of-a-young-man-with-beard-and-hair-style-male-avatar-vector-illustration.jpg" alt="" className="profile-image"/>
             </div>
            </div>
            <div className="cart-container">
                <BsCart4 className="addtocart-icon"
                   onClick={()=>navigate(`/mycart`)}
                />
            </div>
        </div>
        </>
    )
}

export default Header