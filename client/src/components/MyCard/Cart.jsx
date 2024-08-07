import React,{useState,useEffect} from "react";
import { useNavigate } from "react-router-dom";
import './Cart.css'
import url from "../store/urls"
function Cart({product,quantity,onRemove}){
  const navigate=useNavigate()
    return (
        <div className="cart-item">
          <div className="cart-image">
          <img src={product.image} alt={product.name} />
          </div>
            <p className="cart-product-name">{product.name}</p>
            <p className="cart-product-quantity">Quantity: {quantity}</p>
          <button className="remove-button"
            onClick={onRemove}
          >
            Remove
          </button>
        </div>
    )
}
export default Cart