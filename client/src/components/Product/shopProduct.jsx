import React,{useState,useEffect} from "react";
import '../ProductCSS/shopProduct.css'
import url from '../store/urls'
function ShopProduct({product}){
    console.log(product)
    const [showInput,setShowInput]=useState(false)
    const [quantity,setQuantity]=useState(null)
    const [error,setError]=useState(null)
    async function handleSubmit(e){
       const response=await fetch(`${url}/auth/addtocart/${product._id}`,{
         method:'POST',
         headers:{
           'Content-Type':'application/json',
           'x-access-token':localStorage.getItem('token')
         },
         body:JSON.stringify({
           quantity,
           shopId:product.shop
         })
       })
       const data=await response.json()
       setError(data.message)
       setShowInput(false)
    }
    function setAddtoCart(e){
        e.preventDefault()
        setShowInput(!showInput)
        setQuantity(null)
        setError(null)
    }
    return (
        <div className="shop-product-details" key={product._id}>
     <div className="shop-product-content">
      <div className="shop-product-image">
        <img src={product.image} alt={product.name} className="product-image" />
      </div>
      <div className="shop-product-info">
        <span className="shop-product-name">{product.name}</span>
        <span className="shop-product-stock">Stocks: {product.quantity}</span>
        <span>₹{product.price}</span>
        {product.offer && (
          <span className="shop-product-offer">
            {product.offer ? (
              `Get ${product.offer.discount}% off on ${product.offer.amount} purchase`
            ) : (
              `Check back soon for exciting offers!`
            )}
          </span>
        )}
      </div>
    </div>
    <div className="shop-product-action">
      <button onClick={setAddtoCart} className="add-to-cart">Add to Cart</button>
      {showInput && (
  <div>
    <input 
      type="text" 
      placeholder="Enter quantity" 
      value={quantity} 
      onChange={(e) => setQuantity(e.target.value)} 
    />
    <button onClick={handleSubmit} className="add-to-cart" >Submit</button>
  </div>
)}
{error && <div className="error">{error}</div>}

    </div>
  </div>
    )
}
export default ShopProduct