import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import logo_image from "./logo for social media web app.png";

function Logo() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex justify-center items-center bg-sky-200   rounded-xl shadow-md my-4 p-6 sm:p-4 w-full h-[10rem] bg-opacity-15"
    >
      <Link to="/" className="block w-28 h-28 sm:w-32 sm:h-32">
        <div className="flex justify-center items-center w-full h-full rounded-full border-4 border-white overflow-hidden shadow-md bg-slate-100">
          <img
            src={logo_image}
            alt="LOGO"
            className="w-full h-full object-cover rounded-full"
          />
        </div>
      </Link>
    </motion.div>
  );
}

export default Logo;
