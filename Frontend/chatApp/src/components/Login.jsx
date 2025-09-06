import React, { useEffect, useState } from "react";

import SpinnerWithText from "./LoadingSpinner";
import axios from "axios";
import Input from "./Input";
import Button from "./Button";
import { login } from "../store/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const Url = import.meta.env.VITE_API_URL;
  const dispatch = useDispatch();
  const [userEmail, setUserEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const storeData = useSelector((state) => state.auth.userData);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        `${Url}/auth/login`,
        { email: userEmail, password },
        { withCredentials: true }
      );

      if (response.data) {
        setLoading(false);
        setPassword("");
        setUserEmail("");
        dispatch(
          login({
            userData: response.data.response.user,
            token: response.data.response.RefreshToken,
          })
        );
      }
    } catch (error) {
      console.error("Error logging in:", error.response);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (storeData) {
      navigate("/dashboard");
    }
  }, [storeData, navigate]);

  return (
    <div className="flex items-center justify-center mt-10">
      <div className="flex flex-col items-center w-full md:w-[40vw] h-[45vh] p-6 rounded-2xl 
        shadow-2xl border border-slate-200 
        bg-white/90 backdrop-blur-md">
        
        {/* Title */}
        <h2 className="text-2xl font-bold mb-4 text-gray-800 font-poppins drop-shadow-sm">
          Welcome Back
        </h2>

        {/* Form */}
        <form onSubmit={onSubmit} className="w-full flex flex-col  gap-5">
          <Input
            placeholder="Enter your email"
            type="email"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            disabled={loading}
            className="border bg-white border-gray-300 rounded-lg px-3 py-2 shadow-sm 
              focus:ring-2 focus:ring-blue-500 transition"
            label="Email"
          />

          <Input
            placeholder="Enter your password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            className="border bg-white border-gray-300 rounded-lg px-3 py-2 shadow-sm 
              focus:ring-2 focus:ring-blue-500 transition"
            label="Password"
          />

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full py-2   
              text-neutral-600 font-semibold rounded-lg shadow-md transition 
              disabled:opacity-50"
            disabled={loading}
          >
            {loading ? <SpinnerWithText data={"Signing in..."} /> : "Sign In"}
          </Button>

          {/* Footer */}
          <h3 className="text-gray-700 text-sm font-poppins text-center">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="text-blue-600 font-semibold font-poppins hover:underline"
            >
              Sign up
            </Link>
          </h3>
          <h3 className="text-gray-700 text-sm font-poppins text-center">
            Forgot Password?{" "}
            <Link
              to="/sendEmail"
              className="text-blue-600 font-semibold font-poppins hover:underline"
            >
              Forgot Password
            </Link>
          </h3>
        </form>
      </div>
    </div>
  );
}

export default Login;
