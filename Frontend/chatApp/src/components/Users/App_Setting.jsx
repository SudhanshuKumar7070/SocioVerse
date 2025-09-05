import React from 'react'
import axios from 'axios'
import { useState } from 'react'
import { useLinkClickHandler } from 'react-router-dom';
import { useSelector,useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice.js';
import { useNavigate } from 'react-router-dom';
function App_Setting() {
const navigate = useNavigate();
 const dispatch = useDispatch();
  const Url = import.meta.env.VITE_API_URL;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // handle logout
  
  const handleLogout = async()=>{
    setLoading(true);
  try{
  const res =await  axios.get(`${Url}/auth/logout`,{withCredentials:true});
  if(res?.data){
    setLoading(false);
    alert("user logged out successfully");
    console.log("user logged out successfully");
    dispatch(logout());
    navigate("/login");
  }
  }catch(err){
    setLoading(false);
    console.log("error creating Logout :",err)
    setError(err.message);

  }
  finally{
    setLoading(false);
  }
  }
  return (

    <div> 
      
        <h1 className='text-2xl font-bold text-slate-700 flex items-center font-poppins hover:text-blue-600 gap-2 hover:transition-all duration-150 linear-ease'>App Settings</h1>
        <div className='flex flex-col gap-4 p-2'>
            <div className='flex flex-col gap-1'>
                <label className='text-slate-600 font-semibold font-poppins'>Theme</label>
                <select className='border border-slate-300 rounded-lg p-2 font-montserrat'>
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="system">System Default</option>
                </select>
            </div>
            <div className='flex flex-col gap-1'> 
                <label className='text-slate-600 font-semibold font-poppins'>Language</label>
                <select className='border border-slate-300 rounded-lg p-2 transition-all duration-200 ease-in-out font-montserrat text-sm'>
                    <option value="english">English</option> 
                    <option value={"hindi"}>Hindi</option>
                    <option value="spanish">Spanish</option>
                    <option value="french">French</option>
                    <option value="german">German</option>  
                    <option value="chinese">Chinese</option>      
                    <option value="japanese">Japanese</option>
                  </select>
            </div>
            <button onClick={handleLogout} disabled={loading}  id='logout' className='bg-red-500  shadow-md text-white font-semibold rounded-lg p-2 w-32 text-center hover:bg-red-600 hover:transition-all hover:text-neutral-100 duration-150 ease-linear cursor-pointer'>
                {loading?"loging out...":"Log out"}
            </button>
    </div>
    </div>
  )
}

export default App_Setting
