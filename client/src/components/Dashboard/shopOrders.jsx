import React,{useState,useEffect} from "react";
import { useParams,useNavigate } from "react-router-dom";
import url from "../store/urls"
import '../DashboardCSS/shopOrders.css'
import filterOrder from '../DataController/orderFilter'
function ShopOrders(){
    const {id}=useParams()
    const navigate=useNavigate()
    const [orders,setOrders]=useState([])
    const [allorders,setAllOrders]=useState([])
    useEffect(()=>{
       (async ()=>{
          const response=await fetch(`${url}/shop/shoporders/${id}`,{
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
          setOrders(data.orders)
          setAllOrders(data.orders)
       })()
    },[])
     function handleFilterOrder(e){
      e.preventDefault()
      const newOrder=filterOrder(e.target.value,allorders)
      setOrders(newOrder)
     }

    return (
        <div>
           <div className="myshop-order-container">
      <h2>All Orders</h2>
      <select className="styled-select"
         onChange={handleFilterOrder}
      >
       <option value="all">All</option>
       <option value="pending">Pending</option>
       <option value="delivered">Delivered</option>
       <option value="cancelled">Cancelled</option>
     </select>
      <div className="myshop-orders-wrapper">
        {orders&&orders.map((order, index) => (
          <div key={index} className="myshop-order-item"
             onClick={()=>navigate(`/order/${order._id}`,{state:order})}
          >
              <p>Username: {order.user.username}</p>
              <p>Total Price: ${order.totalPrice.toFixed(2)}</p>
              <p className="myshop-order-status">Order Status: {order.orderStatus}</p>
              <p>Address: {order.address}</p>
              <p>createdAt: {order.createdAt.slice(0,10)}</p>
          </div>
        ))}
      </div>
    </div>
       </div>
    )
}
export default ShopOrders