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
    <div className="flex items-center justify-center min-h-[100dvh] px-4 w-full bg-gradient-to-r from-slate-900 to-slate-700">
      <div className="flex flex-col items-center w-full sm:w-[80vw] md:w-[60vw] lg:w-[35vw] p-8 md:p-10 rounded-3xl 
        shadow-[0_8px_30px_rgb(0,0,0,0.05)] border border-slate-100/50 
        bg-white mb-10 overflow-hidden relative">
        
        {error && <p className="text-sm bg-red-100/80 text-red-600 font-poppins w-full text-center p-2 rounded-lg mb-4">{error}</p>}
        
        <h1 className="text-3xl font-extrabold mb-4 text-neutral-800 font-poppins text-center tracking-tight">
          Reset Password
        </h1>
        <p className="text-gray-500 text-sm xl:text-base text-center font-poppins mb-8 px-2 leading-relaxed">
          Enter your registered email and we’ll send you a verification code.
        </p>

        <form onSubmit={handleSendEmail} className="w-full space-y-5">
          <Input
            type="email"
            id="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            label="Email"
            className="w-full text-neutral-800 font-medium font-poppins"
          />

          <div className="mt-4 w-full">
            <Button
              disabled={loading}
              type="submit"
              className="w-full flex justify-center items-center h-12 mx-auto"
            >
             {loading ? "Sending..." : "Send Verification Code"}
            </Button>
          </div>
          
          <div className="flex flex-col items-center gap-2 mt-4 pt-6 border-t border-slate-100">
            <h3 className="text-slate-500 text-sm font-poppins text-center">
              Remember your password?{" "}
              <button 
                type="button"
                onClick={() => navigate("/login")}
                className="text-blue-600 font-medium font-poppins hover:text-blue-700 hover:underline transition-colors bg-transparent border-none cursor-pointer"
              >
                Sign in
              </button>
            </h3>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SendEmail;
