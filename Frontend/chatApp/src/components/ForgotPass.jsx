import React, { useEffect } from 'react'
import axios from 'axios'
function ForgotPass() {
    useEffect(()=>{
axios.post("http://localhost:3000/api/v1/auth/sendResetPasswordMail",{email:"sudhanshukumar15101@gmail.com"})
    },[])
  return (
    <div>
      
    </div>
  )
}

export default ForgotPass
