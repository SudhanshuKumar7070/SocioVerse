import React from "react";
import { SettingsIcon } from "lucide-react";
import App_Setting from "../Users/App_Setting";
import { useState } from "react";
function SettingsComponent() {
  const [isSettingOpen, setIsSettingOpen] =useState(false);
  return (
   <div
  className={`${
    isSettingOpen
      ? "sm:h-[80vh] sm:w-[32rem] absolute top-10 right-6 z-50 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950"
      : "sm:h-[35vh] sm:w-full bg-none"
  } 
  
  rounded-2xl  
  flex flex-col justify-center items-center gap-6 
  p-6 font-montserrat
  
  transition-all duration-300 ease-linear`}
>
      
      {/* Heading */}
      <h1 className={`${isSettingOpen?" hover:text-white":"hover:text-blue-500"} text-2xl font-bold text-white flex items-center font-poppins gap-2 hover:transition-all duration-150 linear-ease`}>
        <SettingsIcon className={`text-white ${isSettingOpen?" hover:text-white":"hover:text-blue-500"}`} onClick={()=>{
          setIsSettingOpen(!isSettingOpen)
        }} />
        Settings
      </h1>
      {isSettingOpen && <div className="w-full h-full overflow-y-auto scrollbar-custom transition-all duration-300">
          <App_Setting/>
      </div>}
      

       
      <p className="text-sm text-slate-500 text-center max-w-md">
        Customize your experience and manage your account settings effortlessly.
      </p>
    </div>
  );
}

export default SettingsComponent;
