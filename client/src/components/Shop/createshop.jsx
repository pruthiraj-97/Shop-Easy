import React,{useState,useEffect} from "react";
import { useNavigate } from "react-router-dom";
import url from "../store/urls"
import '../ShopCSS/createshop.css'
function AddShop(){
    const navigate=useNavigate()
    const [categories,setCategories]=useState([])
    const [cities,setCities]=useState([])
    const [states,setStates]=useState([])
    const [name,setName]=useState(null)
    const [state,setState]=useState(null)
    const [city,setCity]=useState(null)
    const [location,setLocation]=useState(null)
    const [pincode,setPincode]=useState(null)
    const [openingTime,setOpeningTime]=useState(null)
    const [closingTime,setClosingTime]=useState(null)
    const [categoryId,setCategoryId]=useState(null)
    const [deliveryCharge,setDeliveryCharge]=useState(null)
    const [contactNumber,setContactNumber]=useState(null)
    const [error,setError]=useState(null)
    const [minimumOrder,setMinimumOrder]=useState(null)

    useEffect(()=>{
        (async ()=>{
          const response=await fetch(`${url}/category/getallcategory`,{
             method:'GET',
             headers:{
               'Content-Type':'application/json',
               'x-access-token':localStorage.getItem('token')
             }
          })
          const data=await response.json()
          setCategories(data.categories)
          setCities(data.cities)
          setStates(data.states)
          console.log(data)
        })()
     },[])

    async function handleSubmit(e){
        e.preventDefault()
        const response=await fetch(`${url}/shop/addshop/${categoryId}`,{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                'x-access-token':localStorage.getItem('token')
            },
            body:JSON.stringify({
                name,state,city,location,pincode,openingTime,closingTime,categoryId,deliveryCharge,contactNumber,minimumOrder
            })
        })
        const data=await response.json()
        if(data.success){
          navigate('/dashboard')
        }
    }
    return (
        <div>
            <div className="shop-registration-container">
      <form onSubmit={handleSubmit}>
        <label>
          Shop Name:
          <input type="text" name="name"  value={name} onChange={(e)=>setName(e.target.value)} />
        </label>
        <label>
          State:
          <select name="state"  onChange={(e)=>setState(e.target.value)}>
            <option value="">Select State</option>
            {states.map(state => (
              <option key={state._id} value={state._id}>{state.state}</option>
            ))}
          </select>
        </label>
        <label>
          City:
          <select name="city"  onChange={(e)=>setCity(e.target.value)}>
            <option value="">Select City</option>
            {cities.map(city => (
              <option key={city._id} value={city._id}>{city.city}</option>
            ))}
          </select>
        </label>
        <label>
          Location:
          <input type="text" name="location"  value={location} onChange={(e)=>setLocation(e.target.value)} />
        </label>
        <label>
          Pincode:
          <input type="text" name="pincode" value={pincode} onChange={(e)=>setPincode(e.target.value)} />
        </label>
        <label>
          contactNumber:
          <input type="text" name="contactNumber" value={contactNumber} onChange={(e)=>setContactNumber(e.target.value)} />
        </label>
        <label>
          Opening Time:
          <input type="text" name="openingTime" value={openingTime} onChange={(e)=>setOpeningTime(e.target.value)} />
        </label>
        <label>
          Closing Time:
          <input type="text" name="closingTime" value={closingTime} onChange={(e)=>setClosingTime(e.target.value)} />
        </label>
        <label>
          Category:
          <select name="categoryId"  onChange={(e)=>setCategoryId(e.target.value)}>
            <option value="">Select Category</option>
            {categories.map(category => (
              <option key={category._id} value={category._id}>{category.category}</option>
            ))}
          </select>
        </label>
        <label>
          Delivery Charge:
          <input type="text" name="deliveryCharge" value={deliveryCharge} onChange={(e)=>setDeliveryCharge(e.target.value)} />
        </label>
        <label>
          Minimum Order:
          <input type="text" name="minimumOrder"value={minimumOrder}  onChange={(e)=>setMinimumOrder(e.target.value)} />
        </label>
        <button type="submit">Register Shop</button>
      </form>
    </div>
        </div>
    )
}

export default AddShop