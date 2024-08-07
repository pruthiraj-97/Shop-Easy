import React,{useState,useEffect} from "react";
import { useParams,useLocation } from "react-router-dom";
import url from "../store/urls"
import '../DashboardCSS/order.css'
function Order(){
    const location=useLocation()
    const {id}=useParams()
    const [order,setOrder]=useState(null)
    const [loding,setLoding]=useState(false)
    const [isConfirming,setIsConfirming]=useState(false)
    const [error,setError]=useState(null)
    const [confirmotp,setConfirmotp]=useState(false)
    const [deliveryOtp,setDeliveryOtp]=useState(null)
    useEffect(()=>{
        setLoding(true)
        setOrder(location.state)
        setLoding(false)
    },[])
    async function sendConfirmOtp(e){
        e.preventDefault()
        const response=await fetch(`${url}/order/sendconfirmotp/${id}`,{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                'x-access-token':localStorage.getItem('token')
            }
        })
        const data=await response.json()
        setError(data.message)
    }
    async function handleSubmitDeliveryOtp(e){
        e.preventDefault()
        const response=await fetch(`${url}/order/deliveredorder/${id}`,{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                'x-access-token':localStorage.getItem('token')
            },
            body:JSON.stringify({
                otp:deliveryOtp
            })
        })
        const data=await response.json()
        if(data.success){
        setOrder(data.order)
        }
        setError(data.message)
    }
    if(loding||!order){
        return <h1>Loading...</h1>
    }
    return (
        <div className="order-product-container">
             <div className="order-shop-details">
              <p className="order-shop-name">{order.user.username}</p>
              <p className="order-shop-address">contact : {order.contactNumber}</p>
              <p className="order-shop-address">Address : {order.address}</p>
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
                {
                    error && <p style={{color:'red',fontSize:'20px'}}>{error}</p>
                }
              <p className="order-status">Order Status: {order.orderStatus}</p>
              <p className="order-total-price">Total: ${order.totalPrice.toFixed(2)}</p>
              {
                (
                    <button className="cancel-button" 
                    onClick={()=>{
                      setIsConfirming(!isConfirming);
                      setConfirmotp(false);
                    }}>send confirmation otp</button>
                )
              } 
              <button className="deliver-button" 
                onClick={() => {
                  setConfirmotp(!confirmotp);
                  setIsConfirming(false);
                }}
              >Deliver product</button>
            </div>
        {isConfirming && (
         <div className="confirmation-modal">
          <p>Are you sure to send delivery otp</p>
          <button  className="cancel-button" onClick={sendConfirmOtp}>Yes</button>
          <button  className="cancel-button" onClick={()=>setIsConfirming(false)}>No</button>
        </div>
        )}

      {confirmotp && (
      <div className="confirmation-modal">
      <p>Enter delivery OTP:</p>
      <form onSubmit={handleSubmitDeliveryOtp}>
      <input
        type="text"
        placeholder="Delivery OTP"
        value={deliveryOtp}
        onChange={(e) => setDeliveryOtp(e.target.value)}
      />
      <button type="submit" className="submit-button">Submit</button>
    </form>
    {
        error && <p style={{color:'red',fontSize:'20px'}}>{error}</p>
    }
   </div>
)}

        </div>
    )
}
export default Order