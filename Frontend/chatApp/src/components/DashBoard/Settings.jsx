import React from "react";
import { SettingsIcon } from "lucide-react";

function SettingsComponent() {
  return (
    <div className="sm:w-full sm:h-[35vh] bg-white border border-slate-200 rounded-xl shadow-md flex flex-col justify-center items-center gap-3 p-6 font-montserrat transition-all duration-300">
      
      {/* Heading */}
      <h1 className="text-2xl font-bold text-slate-700 flex items-center gap-2">
        <SettingsIcon className="text-slate-500" />
        Settings
      </h1>

      {/* Subtext */}
      <p className="text-sm text-slate-500 text-center max-w-md">
        Customize your experience and manage your account settings effortlessly.
      </p>
    </div>
  );
}

export default SettingsComponent;
