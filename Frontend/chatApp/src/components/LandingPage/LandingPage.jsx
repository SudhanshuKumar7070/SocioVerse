import React from "react";
import { Link } from "react-router-dom";
import  heroImage from "../DashBoard/logo for social media web app.png"
import homeImg from "../../../public/influencer-dancing-posting-social-media_23-2149194124.avif"
const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-900/10 via-blue-500 to-blue-900/10 flex flex-col items-center justify-center px-6">
      {/* Hero Section */}
      <header className="flex flex-col md:flex-row items-center justify-between w-full max-w-6xl py-16 gap-10">
        
        {/* Text Content */}
        <div className="md:w-1/2 text-center md:text-left space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold font-poppins text-blue-950 leading-tight">
            Connect Instantly,<br className="hidden md:inline" /> Chat Effortlessly
          </h1>
          <p className="text-lg text-neutral-300 font-poppins">
            Secure, real-time messaging at your fingertips. Start your journey today!
          </p>
          <Link
            to="/register"
            className="inline-block bg-blue-600 text-white font-montserrat text-lg font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition"
          >
            Start Exploring
          </Link>
        </div>

        {/* Hero Image */}
        <div className="md:w-1/2">
          <img
            // src="https://img.freepik.com/free-vector/flat-illustration-social-media-day-celebration_23-2150339964.jpg?semt=ais_incoming&w=740&q=80"// Truncated for clarity
            src={homeImg}
            alt="Chat illustration"
            className="w-full h-auto  rounded-3xl shadow-xl"
          />
        </div>
      </header>
    </div>
  );
};

export default LandingPage;
