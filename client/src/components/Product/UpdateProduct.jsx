import React,{useState,useEffect} from "react";
import {useLocation,useParams,useNavigate} from "react-router-dom";
import url from "../store/urls"
function UpdateProduct(){
    const {id}=useParams()
    const navigate=useNavigate()
    const [name,setName]=useState(null)
    const [description,setDescription]=useState(null)
    const [price,setPrice]=useState(null)
    const [image,setImage]=useState(null)
    const [stock,setStock]=useState(null)
    const [error,setError]=useState(null)
    const location = useLocation();
    useState(()=>{
      setName(location.state.name)
      setDescription(location.state.description)
      setPrice(location.state.price)
      setImage(location.state.image)
      setStock(location.state.quantity)
    },[])
    async function handleSubmit(e){
      e.preventDefault()
        const response=await fetch(`${url}/product/updateproduct/${id}`,{
            method:'PUT',
            headers:{
                'Content-Type':'application/json',
                'x-access-token':localStorage.getItem('token')
            },
            body:JSON.stringify({
                name,description,price,image,
                quantity:stock
            })
          })
          const data=await response.json()
          if(data.success){
             navigate('/dashboard')
          }else{
            setError(data.message)
          }
    }
    return (
        <div className="product-form-container">
        {
          error && <h2>{error}</h2>
        }
      <h2>Update Product</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            onChange={(e) => setName(e.target.value)}
            defaultValue={name}
            required
          />
        </div>
        <div className="form-group">
          <label>Description:</label>
          <textarea
            name="description"
            onChange={(e) => setDescription(e.target.value)}
            defaultValue={description}
            required
          ></textarea>
        </div>
        <div className="form-group">
          <label>Price:</label>
          <input
            type="number"
            name="price"
            onChange={(e) => setPrice(e.target.value)}
            defaultValue={price}
            required
          />
        </div>
        <div className="form-group">
          <label>Image URL:</label>
          <input
            type="text"
            name="image"
            onChange={(e) => setImage(e.target.value)}
            defaultValue={image}
            required
          />
        </div>
        <div className="form-group">
          <label>Stock:</label>
          <input
            type="number"
            name="stock"
            onChange={(e) => setStock(e.target.value)}
            defaultValue={stock}
            required
          />
        </div>
        <button type="submit">update Product</button>
      </form>
    </div>
    )
}
export default UpdateProduct