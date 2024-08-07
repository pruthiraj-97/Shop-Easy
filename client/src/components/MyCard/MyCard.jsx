import React,{useState,useEffect} from "react";
import { useNavigate } from "react-router-dom";
import './MyCard.css'
import url from "../store/urls"
import Cart from "./Cart";
function MyCart(){
    const navigate=useNavigate()
    const [products,setProducts]=useState([])
    const [loding,setLoding]=useState(false)
    const [contactNumber,setContactNumber]=useState(null)
    const [address,setAddress]=useState(null)
    const [error,setError]=useState(null)
    useEffect(()=>{
      (async ()=>{
        setLoding(true)
        const response=await fetch(`${url}/auth/mycart`,{
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
        setProducts(data.mycart)
        setLoding(false)
      })()
    },[])
    async function createOrder(e){
      e.preventDefault()
      const response=await fetch(`${url}/order/createOrder/${products[0].product.shop._id}`,{
        method:'POST',
        headers:{
          'Content-Type':'application/json',
          'x-access-token':localStorage.getItem('token')
        },
        body:JSON.stringify({
          contactNumber,address
        })
      })
      const data=await response.json()
      if(data.success){
        navigate(`/confirmorder/${products[0].product.shop._id}`,{state:{
          productArray:data.productArray,
          totalprice:data.totalPrice,
          contactNumber,
          address
        }})
      }else{
        setError(data.message)
      }
    }
    
   async function removeCart(id){
    const response=await fetch(`${url}/auth/removefromcart/${id}`,{
       method:'DELETE',
       headers:{
          'Content-Type':'application/json',
          'x-access-token':localStorage.getItem('token')
       }
    })
    const data=await response.json()
    setProducts(data.mycart)
    }

    if(loding){
      return <h1>Loading...</h1>
    }
    if(products.length==0){
      return (
        <div className="empty-cart-container">
        <h1>Cart is Empty</h1>
        <button className="start-shopping-btn"
         onClick={()=>navigate('/shopdashboard')}
        >Start Shopping</button>
      </div>
      )
    }
    return (
    <div className="shop-cart-container">
  <h4 className="shop-name">{products[0].product.shop.name}</h4>
  <div className="products-cart-section">
    {products && products.length > 0 &&
      products.map((product, index) => (
        <Cart product={product.product} quantity={product.quantity}
        onRemove={()=>removeCart(product.product._id)} 
        key={index} />
      ))}
  </div>
  {
    error && <h2>{error}</h2>
  }
  <div className="order-details">
    <input
      type="text"
      placeholder="Contact Number"
      value={contactNumber}
      onChange={(e) => setContactNumber(e.target.value)}
    />
    <input
      type="text"
      placeholder="Address"
      value={address}
      onChange={(e) => setAddress(e.target.value)}
    />
  </div>
  <button className="create-order-button" onClick={createOrder}>
    Create Order
  </button>
</div>
    )
}
export default MyCart