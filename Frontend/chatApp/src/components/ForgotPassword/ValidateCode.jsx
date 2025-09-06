import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Button from "../Button";
import Input from "../Input";
function ValidateCode() {
  const { email } = useParams();
  const navigate = useNavigate();

  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const Url = import.meta.env.VITE_API_URL;

  const handleValidateCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post(
        `${Url}/auth/match_forgot_passCode/${email}`,
        { resetCode: code }
      );

      if (res.data) {
        navigate(`/resetPassword/${email}/${code}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      console.log("Error validating code:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center ">
      <div className="w-full max-w-md bg-white/90 shadow-lg rounded-2xl p-6">
        <h1 className="text-2xl font-montserrat font-bold text-gray-800 text-center mb-4">
          Enter Verification Code
        </h1>
        <p className="text-gray-600 font-poppins text-sm text-center mb-6">
          We sent a 6-digit verification code to <span className="font-medium font-serif text-neutral-600">{email}</span>.  
          Please enter it below.
        </p>

        <form onSubmit={handleValidateCode} className="space-y-4">
          <div>
            <label
              htmlFor="code"
              className="block text-sm font-montserrat font-bold text-gray-700 mb-1"
            >
              Verification Code
            </label>
            <Input
              type="text"
              id="code"
              placeholder="Enter your code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              className="w-full px-4 py-2 border placeholder:font-montserrat font-bold border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {error && (
            <p className="text-sm text-red-500 font-poppins text-center">{error}</p>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 text-neutral-600 font-bold font-montserrat disabled:bg-blue-400 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
          >
            {loading ? "Verifying..." : "Verify"}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default ValidateCode;
