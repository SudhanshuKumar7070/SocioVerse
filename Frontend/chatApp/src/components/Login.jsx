import React, { useEffect, useState } from "react";
//  import { useForm } from "react-hook-form";
import SpinnerWithText from "./LoadingSpinner";
// import { useId } from "react";
import axios from "axios";
import Input from "./Input";
import Button from "./Button";
import { login } from "../store/authSlice";
// import{login} from '../store/authSlice'
import { useDispatch, useSelector } from "react-redux";
import { useNavigate,Link } from "react-router-dom";
function Login() {
  const navigate = useNavigate();
  const Url = import.meta.env.VITE_API_URL;
  const dispatch = useDispatch();
  const [userEmail, setUserEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState(""); // we can do it latter using new middleware at server.. for error handling
  const [loading, setLoading] = useState(false);
  const storeData = useSelector((state) => state.auth.userData);
  console.log("storeData before login:", storeData);
  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${Url}/auth/login`, {
        email: userEmail,
        password: password,

      },{
        withCredentials: true
      }
    );

      if (response.data) {
        setLoading(false);
        console.log("data", response.data);
        setPassword("");
        setUserEmail("");
        console.log("User Data: ", response.data.response.user);
        console.log("AccessToken: ", response.data.response.AccessToken);
        dispatch(
          login({
            userData: response.data.response.user,
            token: response.data.response.AccessToken,
          })
        );
      }
    } catch (error) {
      console.error("Error logging in:", error.response);
    }
  };
  useEffect(() => {
    if (storeData) {
      console.log("storeData after login:", storeData);
       navigate("/componentCheck");
    }
  }, [storeData, navigate]);

  return (
    <div
      className="fill_form flex justify-center items-center p-4 flex-col border-2 border-slate-300 rounded-lg shadow-lg
          md:h-[45vh] h-[80vh] md:w-[40vw] w-screen mt-10 gap-4 bg-blue-200"
    >
      <form onSubmit={onSubmit} className="p-4 flex flex-col gap-4">
        <Input
          placeholder="enter email"
          type="email"
          value={userEmail}
          onChange={(e) => {
            setUserEmail(e.target.value);
          }}
          disabled={loading}
          className="font-poppins "
        />

        <Input
          placeholder="password "
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          disabled={loading}
          className="font-poppins"
        />
 {
  loading ? <SpinnerWithText data={"signing in..."} /> :  <Button
          type="submit"
          className="w-full font-poppins"
          disabled={loading}
          onClick={() => {
            console.log("clicked");
          }}
        >
          {" "}
          {/* {loading ? <SpinnerWithText data={"signing in..."} /> : " Sign In"} */}
          Sign In
        </Button>
 }

       
        <h3 className="font-montserrat"> didn't have an account ?    <Link to="/register" className="font-bold">sign up</Link>  </h3> 
      </form>
    </div>
  );
}

export default Login;
