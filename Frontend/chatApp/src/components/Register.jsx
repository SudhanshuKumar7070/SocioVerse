import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Input from "./Input";
import Button from "./Button";
import SpinnerWithText from "./LoadingSpinner";
import { login } from "../store/authSlice";
import { useDispatch, useSelector } from "react-redux";

function Register() {
  const Url = import.meta.env.VITE_API_URL;
  const dispatch = useDispatch();
  const [fullName, setFullName] = useState("");
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);

  const storeData = useSelector((state) => state.auth.userData);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const onRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("userName", userName);
      formData.append("email", email);
      formData.append("fullName", fullName);
      formData.append("password", userPassword);
      formData.append("profilePicture", selectedFile);

      const registeredData = await axios.post(`${Url}/auth/register`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (registeredData.data) {
        setLoading(false);
        dispatch(
          login({
            userData: registeredData.data.message,
          })
        );
        setEmail("");
        setFullName("");
        setUserName("");
        setSelectedFile(null);
        setUserPassword("");
        
      }
    } catch (err) {
      console.error("Error during registration:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (storeData) {
      navigate("/login");
    }
  }, [storeData, navigate]);

  return (
    <div className="flex items-center justify-center mt-10">
      <div className="flex flex-col items-center w-full md:w-[40vw] h-[80vh] p-6 rounded-2xl 
        shadow-2xl border border-slate-200 
        bg-white/90 backdrop-blur-md">
        
        {/* Title */}
        <h2 className="text-2xl font-bold mb-4 font-poppins text-gray-800 drop-shadow-sm">
          Create an Account
        </h2>

        {/* Form */}
        <form
          onSubmit={onRegister}
          className="w-full h-full flex flex-col gap-5"
        >
          <Input
            name="fullName"
            type="text"
            className="border bg-white border-gray-300 rounded-lg px-3 py-2 shadow-sm 
              focus:ring-2 focus:ring-blue-500 transition"
            label="Full Name"
            placeholder="Enter your full name"
            onChange={(e) => setFullName(e.target.value)}
            value={fullName}
          />

          <Input
            name="userName"
            type="text"
            className="border bg-white border-gray-300 rounded-lg px-3 py-2 shadow-sm 
              focus:ring-2 focus:ring-blue-500 transition"
            label="Username"
            placeholder="Enter username"
            onChange={(e) => setUserName(e.target.value)}
            value={userName}
          />

          <Input
            name="email"
            type="email"
            className="border bg-white border-gray-300 rounded-lg px-3 py-2 shadow-sm 
              focus:ring-2 focus:ring-blue-500 transition"
            label="Email"
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />

          <Input
            name="password"
            type="password"
            className="border bg-white border-gray-300 rounded-lg px-3 py-2 shadow-sm 
              focus:ring-2 focus:ring-blue-500 transition"
            label="Password"
            placeholder="Enter password"
            onChange={(e) => setUserPassword(e.target.value)}
            value={userPassword}
          />

          <Input
            name="profilePicture"
            type="file"
            className="border bg-white border-gray-300 rounded-lg px-3 py-2 shadow-sm 
              cursor-pointer focus:ring-2 focus:ring-blue-500 transition"
            label="Profile Picture"
            onChange={handleFileChange}
          />

          {selectedFile && (
            <p className="text-sm text-gray-700">
              Selected File: <span className="font-medium">{selectedFile.name}</span>
            </p>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 
              text-white font-semibold rounded-lg shadow-md transition 
              disabled:opacity-50"
            disabled={loading}
          >
            {loading ? <SpinnerWithText data={"Signing up..."} /> : "Sign Up"}
          </Button>

          {/* Footer */}
          <h3 className="text-gray-700 text-sm font-poppins text-center">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 font-semibold font-poppins hover:underline"
            >
              Sign in
            </Link>
          </h3>
        </form>
      </div>
    </div>
  );
}

export default Register;
