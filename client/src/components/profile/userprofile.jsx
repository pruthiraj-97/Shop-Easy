import React,{useState,useEffect} from "react";
import {useNavigate} from "react-router-dom"
import filterOrder from '../DataController/orderFilter'
import url from '../store/urls'
import '../profileCSS/profile.css'
function UserProfile() {
    const navigate=useNavigate()
    const [user,setUser]=useState(null)
    const [loading,setLoading]=useState(false)
    const [orders,setOrders]=useState([])
    const[filterorder,setFilterOrder]=useState([])
    useEffect(()=>{
      (async ()=>{
        setLoading(true)
        const response=await fetch(`${url}/auth/getuser`,{
            method:'GET',
            headers:{
                'Content-Type':'application/json',
                'x-access-token':localStorage.getItem('token')
            }
        })
        const data=await response.json()
        if(!data.success){
          navigate('/login')
        }
        console.log(data)
        setUser(data.user)
        setOrders(data.user.orderHistory)
        setFilterOrder(data.user.orderHistory)
        setLoading(false)
      })()
    },[])
    function handleFilterOrder(e){
      e.preventDefault()
      const newOrder=filterOrder(e.target.value,orders)
      setFilterOrder(newOrder)
     }
    if(loading||!user){
        return <h1>Loading...</h1>
    }
    return (
        <div className="user-details-container">
          <div className="user-details">
        <div className="user-info">
          <p>Name: {user.username}</p>
          <p>Email: {user.email}</p>
          <p>contact number: {user.contactNumber}</p>
        </div>
        {user.type=="owner"&&(
          <button className="dashboard-button"
          onClick={()=>navigate('/dashboard')}
          >Shop Dashboard</button>
        )}
      </div>
      <div className="order-list">
      <h2>Order List</h2>
      <select className="right-aligned-select"
         onChange={handleFilterOrder}
      >
        <option value="all">All</option>
        <option value="pending">Pending</option>
        <option value="delivered">Delivered</option>
        <option value="cancelled">Cancelled</option>
     </select>
      <div className="whole-order-container">
      {filterorder && filterorder.map((order, index) => (
        <div key={index} className="order-item"
           onClick={()=>navigate(`/orderdetails/${order._id}`,{state:order})}
        >
          <h3 className="shop-name">{order.shop.name}</h3>
            <p>Order Created: {order.createdAt.slice(0, 10)}</p>
            <p>Shop Address: {order.shop.city.city}, {order.shop.location}</p>
            <p className="order-status">Order Status: {order.orderStatus}</p>
            <p>Total Price: ${order.totalPrice}</p>
        </div>
      ))}
      </div>
    </div>
    </div>
    );
}
export default UserProfile;