import React, { useEffect } from 'react'
import axios from 'axios'
function ForgotPass() {
    useEffect(()=>{
axios.post(`${import.meta.env.VITE_API_URL}/auth/sendResetPasswordMail`,{email:"sudhanshukumar15101@gmail.com"})
    },[])
  return (
    <div>
      
    </div>
  )
}

export default ForgotPass
