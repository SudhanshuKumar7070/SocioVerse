import { useEffect, useState } from "react";
import { setTokens } from "../store/tokenSlice";
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
          }),
          setTokens({
            refreshToken: response.data.response.RefreshToken,
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
    <div className="flex items-center justify-center min-h-[100dvh] px-4 w-full  bg-gradient-to-r from-slate-900 to-slate-700">
      <div className="flex flex-col items-center w-full sm:w-[80vw] md:w-[60vw] lg:w-[35vw] p-8 md:p-10 rounded-3xl 
        shadow-[0_8px_30px_rgb(0,0,0,0.05)] border border-slate-100/50 
        bg-white mb-10 overflow-hidden relative">
        
        {/* Title */}
        <h2 className="text-3xl font-extrabold mb-8 text-neutral-800 font-poppins text-center tracking-tight">
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
          <div className="mt-4 w-full">
            <Button
              type="submit"
              className="w-full mx-auto flex justify-center items-center h-12"
              disabled={loading}
            >
              {loading ? <SpinnerWithText data={"Signing in..."} /> : "Sign In"}
            </Button>
          </div>

          {/* Footer */}
          <div className="flex flex-col items-center gap-2 mt-4 pt-4 border-t border-slate-100">
            <h3 className="text-slate-500 text-sm font-poppins text-center">
              Don’t have an account?{" "}
              <Link
                to="/register"
                className="text-blue-600 font-medium font-poppins hover:text-blue-700 hover:underline transition-colors"
              >
                Sign up
              </Link>
            </h3>
            <h3 className="text-slate-500 text-sm font-poppins text-center">
              <Link
                to="/sendEmail"
                className="text-slate-500 font-medium font-poppins hover:text-slate-800 hover:underline transition-colors"
              >
                Forgot Password?
              </Link>
            </h3>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
