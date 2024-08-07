import '../HomeCss/About.css'
import React,{useState,useEffect} from "react"
import { useNavigate } from 'react-router-dom'
function About(){
    const navigate=useNavigate()
    return (
        <div className="About-section">
        <div className="About-content">
          <h3>About Shop Easy</h3>
          <p>Shop Easy is your ultimate destination for hassle-free online shopping. We strive to make your shopping experience as convenient and enjoyable as possible.</p>
          <p>Founded with the vision of simplifying the way you shop, Shop Easy offers a wide range of products from top brands, ensuring that you find everything you need in one place.</p>
          <p>With Shop Easy, you can browse through our extensive collection of groceries, household essentials, electronics, fashion items, and much more, all from the comfort of your home.</p>
          <p>Our team is committed to providing you with exceptional service and fast delivery, so you can shop with confidence and peace of mind.</p>
          <p>Experience the convenience of online shopping with Shop Easy today!</p>
          <button className="start-shopping-btn"
            onClick={()=>navigate('/shopdashboard')}
          >Start Shopping</button>
        </div>
      </div>
    )
}
export default About