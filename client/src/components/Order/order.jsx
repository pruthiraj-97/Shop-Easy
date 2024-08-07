import React,{useState,useEffect} from "react";
import { useNavigate,useLocation,Link } from "react-router-dom";
import url from "../store/urls"
import './order.css'
function OrderDetails(){
    const [order,setOrder]=useState(null)
    const location=useLocation()
    const [loding,setLoding]=useState(false)
    const [isConfirming,setIsConfirming]=useState(false)
    useEffect(()=>{
       setLoding(true)
       setOrder(location.state)
       setLoding(false)
    },[])
    console.log(order)
        if(loding||!order){
            return (
                <h1>Loading...</h1>
            )
        }
      async function cancelOrder(e){
        e.preventDefault()
        setLoding(true)
        const response=await fetch(`${url}/order/canceleorder/${order._id}`,{
            method:'DELETE',
            headers:{
                'Content-Type':'application/json',
                'x-access-token':localStorage.getItem('token')
            },
            body:JSON.stringify({
                productArray:order.products
            })
        })
        const data=await response.json()
        setLoding(false)
        setOrder(data.order)
        setIsConfirming(false)
      }
        return (
            <div className="order-product-container">
            <div className="order-shop-details">
              <Link to={`/shopdetails/${order.shop._id}`} className="shop-link">{order.shop.name}</Link>
              <p className="order-shop-address">{order.shop.city.city},{order.shop.location}</p>
              <p className="order-status">Order Status: {order.orderStatus}</p>
            </div>
            <div className="order-container">
            {order.products && order.products.map((product, index) => (
              <div className="order-product" key={index}>
                <img src={product.image} alt={product.name} className="order-image" />
                <div className="order-product-details">
                  <h3 className="order-product-name">{product.name}</h3>
                  <p className="order-product-quantity">Quantity: {product.quantity}</p>
                  <p className="order-product-price">${product.price.toFixed(2)}</p>
                </div>
              </div>
            ))}
            </div>
            <div className="order-details">
              <p className="order-total-price">Total: ${order.totalPrice.toFixed(2)}</p>
              {
                order.orderStatus=='pending' &&
                 <button className="cancel-button" onClick={()=>setIsConfirming(!isConfirming)}>Cancel Order</button>
              }
            </div>
        {isConfirming && (
         <div className="confirmation-modal">
          <p>Are you sure you want to cancel the order?</p>
          <button  className="cancel-button" onClick={cancelOrder}>Yes</button>
          <button  className="cancel-button" onClick={()=>setIsConfirming(false)}>No</button>
        </div>
        )}
          </div>
        )
}
export default OrderDetails