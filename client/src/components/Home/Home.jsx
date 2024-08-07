import React from "react";
import Header from './Header'
import Footer from './Footer'
import {Outlet} from "react-router-dom"
import HomeCompo from "./HomeCompo";
function Home(){
    return (
     <>
       <Header/>
       <Outlet/>
     </>
    )
}

export default Home