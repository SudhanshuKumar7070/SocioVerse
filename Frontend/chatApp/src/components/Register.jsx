import React, { useState,useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Input from "./Input";
import Button from "./Button";
import SpinnerWithText from "./LoadingSpinner";
import { login } from "../store/authSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
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
console.log("storeData:",storeData)
  // upload file to server
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]); // Access the selected file
    console.log("Selected file:", e.target.files[0]);
  };

  // handle reister
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

      const registeredData = await axios.post(
        `${Url}/auth/register`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Important for file uploads
          },
        }
      );

      if (registeredData.data) {
        setLoading(false);
        console.log("registeredData", registeredData.data);
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
      console.error("Error during registration:", registeredData.error);
    }
  };

   useEffect(() => {
      if (storeData) {
        console.log("storeData after register:", storeData);
        navigate("/add_Bio")
       
      }
    }, [storeData, navigate]);
  

  return (
    <div
      className=" flex  items-center p-4 flex-col border-2 border-slate-300 rounded-lg shadow-lg
           h-[80vh] md:w-[40vw] w-screen mt-10 gap-3 bg-blue-200"
    >
      <form onSubmit={onRegister} className="p-4 w-full h-full flex flex-col gap-5">
        <Input
          name="fullName"
          type="text"
          label="FullName"
          placeholder="Enter username here"
          onChange={(e) => setFullName(e.target.value)}
          value={fullName}
        />

        <Input
          name="userName"
          type="text"
          label="UserName"
          placeholder="Enter username here"
          onChange={(e) => setUserName(e.target.value)}
          value={userName}
        />
        <Input
          name="email"
          type="email"
          label="Email"
          placeholder="Enter email here"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
        <Input
          name="password"
          type="password"
          label="Password"
          placeholder="Enter password here"
          onChange={(e) => setUserPassword(e.target.value)}
          value={userPassword}
        />
        <Input
          name="profilePicture"
          type="file"
          label="Profile"
          placeholder="Your Profile"
          onChange={handleFileChange}
          // value={selectedFile}
        />
        {selectedFile && <p>File Name: {selectedFile.name}</p>}
        <Button type="submit" className="w-full" disabled={loading}>
          {" "}
          {loading ? <SpinnerWithText data={"signing up..."} /> : " Sign Up"}
        </Button>
           <h3> already have an account ?    <Link to="/login" className="font-bold">sign in</Link>  </h3> 
      </form>
    </div>
  );
}

export default Register;
