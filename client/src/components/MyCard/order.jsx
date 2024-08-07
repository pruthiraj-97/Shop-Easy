import React,{useState,useEffect} from "react";
import { useNavigate,useParams,useLocation } from "react-router-dom";
import url from "../store/urls"
import './order.css'
function MyOrder(){
    const {id}=useParams()
    const navigate=useNavigate()
    const location=useLocation()
    const [productArray,setProductArray]=useState([])
    const [totalPrice,setTotalPrice]=useState(null)
    const [contactNumber,setContactNumber]=useState(null)
    const [address,setAddress]=useState(null)
    const [loadConfirmation,setLoadConfirmation]=useState(false)
    useEffect(()=>{
        console.log(location.state)
        setProductArray(location.state.productArray)
        setTotalPrice(location.state.totalprice)
        setContactNumber(location.state.contactNumber)
        setAddress(location.state.address)
    })
    async function ConfirmOrder(e){
        e.preventDefault()
        setLoadConfirmation(true)
        const response=await fetch(`${url}/order/confirmorder/${id}`,{
           method:'POST',
           headers:{
               'Content-Type':'application/json',
               'x-access-token':localStorage.getItem('token')
           },
           body:JSON.stringify({
            productArray,totalPrice,contactNumber,address
           })
        })
        const data=await response.json()
        setLoadConfirmation(false)
        navigate('/profile')
    }
    if (loadConfirmation) {
      return (
        <div className="confirmation-container">
          Confirming your order. Please wait...
        </div>
      );
    }
    
    return(
        <div className="product-list-container">
      <h2>Product List</h2>
      <div className="confirm-products">
        {productArray.map((product, index) => (
          <div className="confirm-product" key={index}>
            <img src={product.image} alt={product.name} />
            <div className="confirm-product-details">
              <h3>{product.name}</h3>
              <p>Quantity: {product.quantity}</p>
              <p>Price: ${product.price}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="total-price">
        <p>Total Price: ${totalPrice}</p>
      </div>
      <button className="confirm-order-button" onClick={ConfirmOrder}>Confirm Order</button>
    </div>
    )
}
export default MyOrder