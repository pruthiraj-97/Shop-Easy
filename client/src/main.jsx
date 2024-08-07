import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import Signup from './components/Authcomponent/signup.jsx'
import Login from './components/Authcomponent/login.jsx'
import ShopDashboard from './components/Shop/Shopdashboard.jsx'
import ShopDetails from './components/Shop/shopDetail.jsx'
import UserProfile from './components/profile/userprofile.jsx'
import Dashboard from './components/Dashboard/Dashboard.jsx'
import Product from './components/Product/product.jsx'
import AddProduct from './components/Product/AddProduct.jsx'
import AddShop from './components/Shop/createshop.jsx'
import Offer from './components/Offer/offer.jsx'
import UpdateProduct from './components/Product/UpdateProduct.jsx'
import Home from './components/Home/Home.jsx'
import MyCart from './components/MyCard/MyCard.jsx'
import MyOrder from './components/MyCard/order.jsx'
import OrderDetails from './components/Order/order.jsx'
import ShopOrders from './components/Dashboard/shopOrders.jsx'
import Admin from './components/AdminPannel/Admin.jsx'
import Order from './components/Dashboard/order.jsx'
import HomeCompo from './components/Home/HomeCompo.jsx'
import About from './components/Home/About.jsx'
import AdminVerification from './components/AdminPannel/verifyAdmin.jsx'
import LoginAdmin from './components/AdminPannel/loginAdmin.jsx'
import SignUpAdmin from './components/AdminPannel/signupAdmin.jsx'
import './index.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
        <Route path='/' element={<Home />}>
            <Route path='' element={<HomeCompo/>}/>
            <Route path='about' element={<About/>}/>
            <Route path='login' element={<Login />}/>
            <Route path='signup' element={<Signup />}/>
            <Route path='shopdashboard' element={<ShopDashboard />}/>
            <Route path='shopdetails/:id' element={<ShopDetails />}/>
            <Route path='profile' element={<UserProfile />}/>
            <Route path='dashboard' element={<Dashboard/>}/>
            <Route path='product/:id' element={<Product/>}/>
            <Route path='addproduct/:id' element={<AddProduct/>}/>
            <Route path='addshop' element={<AddShop/>}/>
            <Route path='addoffer/:id' element={<Offer/>}/>
            <Route path='updateproduct/:id' element={<UpdateProduct/>}/>
            <Route path='mycart' element={<MyCart/>}/>
            <Route path='confirmorder/:id' element={<MyOrder/>}/>
            <Route path='orderdetails/:id' element={<OrderDetails/>}/>
            <Route path='shoporders/:id' element={<ShopOrders/>}/>
            <Route path='order/:id' element={<Order/>}/>
            <Route path='adminverification' element={<AdminVerification/>}/>
            <Route path='loginadmin' element={<LoginAdmin/>}/>
            <Route path='adminpannel' element={<Admin/>}/>
            <Route path='signupadmin' element={<SignUpAdmin/>}/>
        </Route>
    </Routes>
  </BrowserRouter>
  
)
