import React,{useState,useEffect} from "react";
import {useParams,useNavigate} from "react-router-dom"
import url from "../store/urls"
import './offer.css'
function Offer(){
    const {id}=useParams()
    const navigate=useNavigate()
    const [openingDate, setOpeningDate] = useState(null);
    const [closingDate, setClosingDate] = useState(null);
    const [name, setOfferName] = useState(null);
    const [discount, setDiscount] = useState(null);
    const [amount, setAmount] = useState(null);
    const [error, setError] = useState(null);
    async function handleSubmit(e){
        e.preventDefault()
        const response=await fetch(`${url}/product/createoffer/${id}`,{
           method:'POST',
           headers:{
               'Content-Type':'application/json',
               'x-access-token':localStorage.getItem('token')
           },
           body:JSON.stringify({
               openingDate,closingDate,name,discount,amount
           })
        })
        const data=await response.json()
        if(data.success){
           navigate(`/product/${id}`)
        }else{
          setError(data.message)
        }
    }
    return (
        <div className="offer-container">
         {error && <div className="error-message">{error}</div>}
      <div className="offer-header">
        <h2>Add Offer</h2>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Opening Date:</label>
          <input type="date" value={openingDate} onChange={(e) => setOpeningDate(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Closing Date:</label>
          <input type="date" value={closingDate} onChange={(e) => setClosingDate(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Offer Name:</label>
          <input type="text" value={name} onChange={(e) => setOfferName(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Discount (%):</label>
          <input type="number" value={discount} onChange={(e) => setDiscount(parseInt(e.target.value))} required />
        </div>
        <div className="form-group">
          <label>Amount:</label>
          <input type="number" value={amount} onChange={(e) => setAmount(parseFloat(e.target.value))} required />
        </div>
        <button type="submit">Add Offer</button>
      </form>
    </div>
    )
}

export default Offer