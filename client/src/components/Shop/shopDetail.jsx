import React,{useState,useEffect} from "react";
import {useNavigate,useParams} from "react-router-dom"
import url from '../store/urls'
import '../ShopCSS/shopDetailCSS.css'
import { FaShoppingBasket } from "react-icons/fa";
import ShopProduct from '../Product/shopProduct';
function ShopDetails(){
    const navigate=useNavigate()
    const {id}=useParams()
    const [shop,setShop]=useState(null)
    const [loding,setLoding]=useState(false)
    const [showInput,setShowInput]=useState(false)
    useEffect(()=>{
        (async ()=>{
            setLoding(true)
        const response=await fetch(`${url}/shop/getshopdetail/${id}`,{
           method:'GET',
           headers:{
               'Content-Type':'application/json',
               'x-access-token':localStorage.getItem('token')
           }
        })
        const data=await response.json()
        setShop(data.shop)
        console.log(data)
        })()
        setLoding(false)
    },[])
    function addToCart(e){
      e.preventDefault()
    }
    function handleSubmit(e){
      e.preventDefault()
    }
    if(loding||!shop){
        return <h1>Loading...</h1>
    }
    return (
        <div className="shop-details-container">
          <div className="shop-address">
            <h2>{shop.name}</h2>
            <p>Address: {shop.city.city}, {shop.state.state}</p>
            <p>Location: {shop.location}</p>
            <p>Opening Time: {shop.openingTime}</p>
            <p>Closing Time: {shop.closingTime}</p>
            <p>Delivery Charge: {shop.deliveryCharge}</p>
            <p>Minimum Order: {shop.minimumOrder}</p>
            <p>contact number {shop.owner.contactNumber}</p>
          </div>
        <div className="products">
  {shop.products.map((product) => (
    <ShopProduct key={product._id} product={product} />
   ))}
 </div>
          <div className="reviews">
  <ul>
    {shop.review.length > 0 ? (
      shop.review.map((review) => (
        <li key={review._id}>
          <div className="review-details">
            <span className="reviewer-name">{review.userName} -</span>
            <span className="review-content">{review.comment}</span>
            <div className="star-rating">
              {[...Array(5)].map((_, index) => (
                <span key={index} className={`star ${index < review.rating ? 'filled' : ''}`}>
                  ★
                </span>
              ))}
            </div>
          </div>
        </li>
      ))
    ) : (
        <></>
    )}
  </ul>
</div>
        </div>
      );
      
}
export default ShopDetails
{/* <div className="shop-product-action">
      <button onClick={()=>setShowInput(!showInput)} className="add-to-cart">Add to Cart</button>
      {showInput && (
        <div>
          <input type="text" placeholder="Enter quantity" />
          <button onClick={handleSubmit}>Submit</button>
        </div>
      )}
    </div> */}