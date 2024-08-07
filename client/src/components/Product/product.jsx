import React,{useState,useEffect} from "react";
import {Link,useNavigate,useParams,useLocation} from "react-router-dom"
import '../ProductCSS/product.css'
import url from "../store/urls"
function Product(){
    const {id}=useParams()
    const navigate=useNavigate()
    const location=useLocation()
    const [product,setProduct]=useState('')
    useEffect(()=>{
       setProduct(location.state)
    },[])
    async function handleRemoveOffer(e){
        e.preventDefault()
        const response=await fetch(`${url}/product/deleteoffer/${id}`,{
           method:'DELETE',
           headers:{
               'Content-Type':'application/json',
               'x-access-token':localStorage.getItem('token')
           }
        })
        const data=await response.json()
          setProduct(data.product)
    }
    async function removeProduct(e){
       e.preventDefault()
       const response=await fetch(`${url}/product/deleteproduct/${id}`,{
          method:'DELETE',
          headers:{
              'Content-Type':'application/json',
              'x-access-token':localStorage.getItem('token')
          }
       })
       const data=await response.json()
       if(data.success){
        navigate('/dashboard')
       }else{
         navigate('/login')
       }
    }
    if(!product){
       return <h1>Loading...</h1>
    }
    return (
        <div className="product-container-detail">
        <img src={product.image} alt="Product" className="product-image" />
        <div className="product-detail">
          <h4>{product.name}</h4>
          <p>{product.description}</p>
          <p>Price: ${product.price}</p>
          <p>Stocks: {product.quantity}</p>
           
          {product.offer?(
            <p>{`Get ${product.offer.discount}% off on this product for ${product.offer.amount} items`}</p>
           ):null}
          <div className="product-actions-button">
          <button onClick={() =>navigate(`/updateproduct/${id}`,{state:product})}>Update Product</button>
            <button onClick={()=>navigate(`/addoffer/${id}`)}>Add Offer</button>
            <button onClick={removeProduct} >remove product</button>
            {product.offer && (
              <button onClick={handleRemoveOffer}>Remove Offer</button>
            )}
          </div>
        </div>
      </div>
    )
}

export default Product