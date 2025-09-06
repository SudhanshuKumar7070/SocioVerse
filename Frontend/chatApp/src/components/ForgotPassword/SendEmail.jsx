import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../Button";
import Input from "../Input";
function SendEmail() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error,setError] = useState("");
  const[loading,setLoading]=useState(false);
  const Url = import.meta.env.VITE_API_URL;

  const handleSendEmail = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      const res = await axios.post(`${Url}/auth/sendResetPasswordMail`, { email });
      if (res.data) {
        setLoading(false);
        navigate(`/validatePassCode/${email}`);
        
      }
    } catch (err) {
      setLoading(false)
      setError(err.message)
      console.log("Error sending email:", err.response?.data || err.message);
    }
    finally{
      setLoading(false);
    }
  };

  return (
    
    <div className="flex items-center   justify-center">
      {error && <p className="text-xl text-red-500 font-poppins tracking-tight leading-tight">{error}</p>}
      <div className="w-full max-w-md bg-white/90 shadow-lg rounded-2xl p-6">
        <h1 className="text-2xl font-semibold text-gray-800 text-center mb-4 font-montserrat">
          Reset Your Password
        </h1>
        <p className="text-gray-600 text-sm text-center font-poppins mb-6">
          Enter your registered email and we’ll send you a verification code.
        </p>

        <form onSubmit={handleSendEmail} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm  font-bold font-montserrat text-gray-700 mb-1">
              Email Address
            </label>
            <Input
              type="email"
              id="email"
              
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full py-2 px-4 text-neutral-600 font-bold font-montserrat disabled:bg-blue-400 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
            />
          </div>

          <Button
          disabled={loading}
            type="submit"
            className="w-full font-montserrat font-bold  py-2 px-4  text-neutral-600 font-bold rounded-xl hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
          >
           {loading?"sending otp please wait...":"Send Otp"}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default SendEmail;
