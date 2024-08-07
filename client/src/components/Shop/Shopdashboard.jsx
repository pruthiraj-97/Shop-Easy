import React,{useState,useEffect} from "react";
import {Link,useNavigate} from "react-router-dom"
import url from '../store/urls'
import '../ShopCSS/ShopdashboardCSS.css'
function ShopDashboard(){
  const navigate=useNavigate()
  const [categories,setCategories]=useState([])
  const [shops,setShops]=useState([])
  const[loding,setLoding]=useState(false)
    useEffect(()=>{
      (async ()=>{
        setLoding(true)
        const response=await fetch(`${url}/shop/getshops`,{
          method:'GET',
          headers:{
            'Content-Type':'application/json',
            'x-access-token':localStorage.getItem('token')
          },
        })
        const data=await response.json()
        if(!data.success){
          navigate('/login')
        }
        setShops(data.shops)
        setLoding(false)
      })()
    },[])
    useEffect(()=>{
      (async ()=>{
        setLoding(true)
        const response=await fetch(`${url}/adminpannel/getallcategory`,{
            method:'GET',
            headers:{
              'Content-Type':'application/json',
              'x-access-token':localStorage.getItem('token')
            },
        })
        const data=await response.json()
        console.log(data)
        if(data.status==401){
          navigate('/login')
        }
        setCategories(data.categories)
        setLoding(false)
      })()
    },[])
    if(loding){
      return <h1>Loading...</h1>
    }
    
    function getCategoryProduct(id){
      return async(e)=>{
         e.preventDefault()
         const response=await fetch(`${url}/category/getcategoryshops/${id}`,{
           method:'GET',
           headers:{
             'Content-Type':'application/json',
             'x-access-token':localStorage.getItem('token')
           },
         })
         const data=await response.json()
         setShops(data.shops)
      }
    }



    return (
       <div className="shop-dashboard">
        <h3 className="shop-dashboard-heading">Start Shoping from Easy Shop</h3>
        <div class="catagory-container">
          {
            categories.length>0&&categories.map((Item,index)=>{
                return (
                    <Link className="category-link"
                      onClick={getCategoryProduct(Item._id)}
                    >{Item.category}</Link>
                )
            })
          }
          </div>
          <div className="shop-container">
            {shops.length>0&&shops.map((Item,index)=>{
                return (
                  <div className="shop-details"
                    onClick={()=>navigate(`/shopdetails/${Item._id}`)}
                    key={index}
                  >
                    <h3>{Item.name}</h3>
                    <p className="p-shop-category">{Item.category?Item.category.category:"null"}</p>
                    <p>Delivery by {Item.closingTime}</p>
                   </div>
                )
            })}
         </div>
       </div>
    )
}

export default ShopDashboard