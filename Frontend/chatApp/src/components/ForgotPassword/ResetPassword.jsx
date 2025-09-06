import React, { useEffect, useState } from "react";
import { Check } from "lucide-react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Button from "../Button";
import Input from "../Input";
function ResetPassword() {
  const navigate = useNavigate();
  const { email, code } = useParams();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassWord] = useState("");
  const [passComment, setPassComment] = useState({ message: "", textColor: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const Url = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(
        `${Url}/auth/reset_password/${email}/${code}`,
        { newPassword: password }
      );

      if (res.data) {
        navigate("/login");
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      console.log("Error resetting password:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (confirmPassword.length > 0) {
      if (confirmPassword !== password) {
        setPassComment({
          message: "Passwords do not match",
          textColor: "text-red-500",
        });
      } else {
        setPassComment({
          message: <Check className="text-green-500" />,
          textColor: "text-green-500",
        });
      }
    } else {
      setPassComment({ message: "", textColor: "" });
    }
  }, [confirmPassword, password]);

  return (
    <div className="flex items-center justify-center ">
      <div className="w-full max-w-md bg-white/90 shadow-lg rounded-2xl p-6">
        <h1 className="text-2xl font-semibold text-gray-800 text-center font-montserrat mb-4">
          Reset Password
        </h1>
        <p className="text-gray-600 text-sm text-center tracking-tight mb-6 font-poppins">
          Enter a new password for your account <span className="font-medium font-serif text-neutral-600">{email}</span>
        </p>

        {error && (
          <p className="text-sm text-red-500 text-center font-sans mb-4">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-bold text-gray-700 font-poppins tracking-tight mb-1"
            >
              New Password
            </label>
            <Input
              type="password"
              id="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border font-poppins font-bold placeholder:font-semibold border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-bold tracking-tight font-poppins  text-gray-700 mb-1"
            >
              Confirm Password
            </label>
            <Input
              type="password"
              id="confirmPassword"
              placeholder="Re-enter new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassWord(e.target.value)}
              required
              className="w-full px-4 py-2 border font-poppins font-bold placeholder:font-semibold border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            {passComment.message && (
              <div className={`mt-1 text-sm flex items-center font-montserrat ${passComment.textColor}`}>
                {passComment.message}
              </div>
            )}
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 font-montserrat font-bold text-neutral-600 disabled:bg-blue-400 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
          >
            {loading ? "Please wait..." : "Set Password"}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
