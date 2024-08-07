import React, { useState,useEffect } from "react";
import {useNavigate,useParams} from "react-router-dom"
import url from '../store/urls'
import '../ProductCSS/AddProduct.css'
function AddProduct(){
    const {id}=useParams()
    const navigate=useNavigate()
    const [name,setName]=useState(null)
    const [description,setDescription]=useState(null)
    const [price,setPrice]=useState(null)
    const [image,setImage]=useState(null)
    const [stock,setStock]=useState(null)
    const [error,setError]=useState(null)

    async function handleSubmit(e){
      e.preventDefault()
        const response=await fetch(`${url}/product/createproduct/${id}`,{
            method:'POST',
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
      <h2>Add Product</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Price:</label>
          <input
            type="number"
            name="price"
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Image URL:</label>
          <input
            type="text"
            name="image"
            onChange={(e) => setImage(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Stock:</label>
          <input
            type="number"
            name="stock"
            onChange={(e) => setStock(e.target.value)}
            required
          />
        </div>
        <button type="submit">Add Product</button>
      </form>
    </div>
    )
}

export default AddProduct