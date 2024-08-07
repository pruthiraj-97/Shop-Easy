import React,{useState,useEffect} from "react";
import { Link ,useNavigate} from "react-router-dom";
import url from "../store/urls"
import '../DashboardCSS/Dashboard.css'
function Dashboard(){
    const navigate=useNavigate()
    const [shop,setShop]=useState(null)
    const [loading,setLoading]=useState(false)
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')))
    useEffect(()=>{
        (async ()=>{
          setLoading(true)
          const response=await fetch(`${url}/shop/getmyshop`,{
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
          setShop(data.shop)
          setLoading(false)
        })()
    },[])
    if(loading){
        return <h1>Loading...</h1>
    }
    console.log("user is",user)
    if(!shop){
      return <Link to={`/addshop`} className="orders-button">Add your shop</Link>
    }
    return (
        <div className="dashboard-container">
      <div className="dashbord-shop-details">
        <h2>Shop Details</h2>
        <p>Name: {shop.name}</p>
        <p>location: {shop.location}</p>
        <p>City: {shop.city.city}</p>
        <p>State: {shop.state.state}</p>
        <p>Opening Time: {shop.openingTime}</p>
        <p>Closing Time: {shop.closingTime}</p>
        <p>Contact: {shop.contactNumber}</p>
        <Link to={`/shoporders/${shop._id}`} className="orders-button">View Orders</Link>
        <Link to={`/addproduct/${shop._id}`} className="orders-button">Add new Product</Link>
      </div>
      <div className="dashbord-my-product-detail">
        <h2>Products</h2>
        <div className="dashbord-products-container">
          {shop.products.length>0 && shop.products.map((product, index) => (
            <div key={index} className="product-item"
              onClick={()=>navigate(`/product/${product._id}`,{state:product})}
            >
              <div className="dashbord-product-image">
                 <img src={product.image} alt={product.name} />
              </div>
              <div className="product-info">
                <h3>{product.name}</h3>
                <p>Price: {product.price}</p>
                <p>Stocks: {product.quantity}</p>
                {product.offer ? (
                            `Get ${product.offer.discount}% off on ${product.offer.amount} purchase`
                          ) : (
                            `Check back soon for exciting offers!`
                    )}
              </div>
            </div>
          ))}
        </div>
      </div>
 </div>
    )
}

export default Dashboard