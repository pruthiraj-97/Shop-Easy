import '../HomeCss/HomeCompo.css'
import React,{useState,useEffect} from "react"
import {Link} from 'react-router-dom'
function HomeCompo(){
    return (
        <div className="Home-compo">
          <div className='Home-compo-text'>
          <h2>Well come to Shop Easy</h2>
          <Link to={'/shopdashboard'} className='home-link'>Start Shoping </Link>
          </div>
          

        </div>
    )
}

export default HomeCompo