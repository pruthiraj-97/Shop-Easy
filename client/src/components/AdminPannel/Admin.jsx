import React,{useState,useEffect} from "react";
import { useNavigate } from "react-router-dom";
import url from '../store/urls'
import './Admin.css'
function Admin(){
    const navigate=useNavigate()
    const [showCityForm, setShowCityForm] = useState(false);
    const [showStateForm, setShowStateForm] = useState(false);
    const [showCategoryForm, setShowCategoryForm] = useState(false);
    const [category,setCategory]=useState(null)
    const [state,setState]=useState(null)
    const [city,setCity]=useState(null)
    const [info,setInfo]=useState(null)
    useEffect(()=>{
      (async ()=>{
        const response=await fetch(`${url}/auth/getuser`,{
           method:'GET',
           headers:{
               'Content-Type':'application/json',
               'x-access-token':localStorage.getItem('token')
           }
        })
        const data=await response.json()
        if(data.status&&!data.status){
            navigate('/login')
        }else if(!data.success){
            return (
                <h1>This is only for admin of ths website</h1>
            )
        }
      })()
    },[])


    const handleCitySubmit =async (e) => {
        e.preventDefault();
        const response=await fetch(`${url}/adminpannel/addcity`,{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                'x-access-token':localStorage.getItem('token')
            },
            body:JSON.stringify({
               city
            })
        })
        const data=await response.json()
        setInfo(data.message)
    };

    const handleStateSubmit =async (e) => {
        e.preventDefault();
        const response=await fetch(`${url}/adminpannel/addstate`,{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                'x-access-token':localStorage.getItem('token')
            },
            body:JSON.stringify({
               state
            })
        })
        const data=await response.json()
        setInfo(data.message)
    };

    const handleCategorySubmit = async (e) => {
        e.preventDefault();
        const response=await fetch(`${url}/adminpannel/createcategory`,{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                'x-access-token':localStorage.getItem('token')
            },
            body:JSON.stringify({
               category
            })
        })
        const data=await response.json()
        console.log(data)
        setInfo(data.message)
    };

    return(
<div className="admin-panel">
            <h2>Admin Panel</h2>
            <button onClick={()=>setShowCityForm(!showCityForm)}>Add New City</button>
            {showCityForm && (
                <form onSubmit={handleCitySubmit}>
                    <input type="text" placeholder="Enter city name" 
                     value={city}
                      onChange={(e)=>setCity(e.target.value)}
                    />
                    <button type="submit">Submit</button>
                </form>
            )}

            <button onClick={()=>setShowStateForm(!showStateForm)}>Add New State</button>
            {showStateForm && (
                <form onSubmit={handleStateSubmit}>
                    <input type="text" placeholder="Enter state name" 
                       value={state}
                       onChange={(e)=>setState(e.target.value)}
                    />
                    <button type="submit">Submit</button>
                </form>
            )}

            <button onClick={()=>setShowCategoryForm(!showCategoryForm)}>Add New Category</button>
            {showCategoryForm && (
                <form onSubmit={handleCategorySubmit}>
                    <input type="text" placeholder="Enter category name"
                      value={category}
                      onChange={(e)=>setCategory(e.target.value)}
                    />
                    <button type="submit">Submit</button>
                </form>
            )}
            {
                info && <p>{info}</p>
            }
        </div>
    )
}
export default Admin