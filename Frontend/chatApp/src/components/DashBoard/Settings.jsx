import React, { useState } from "react";
import { SettingsIcon, X } from "lucide-react";
import App_Setting from "../Users/App_Setting";

function SettingsComponent() {
  const [isSettingOpen, setIsSettingOpen] = useState(false);

  return (
    <>
      {/* Sidebar Trigger Button */}
      <div className="w-full flex-1 flex flex-col justify-center items-center gap-4 transition-all duration-300 ease-linear">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-300 flex items-center font-poppins gap-3 transition-colors duration-200">
          <button 
            onClick={() => setIsSettingOpen(true)}
            className="flex items-center justify-center gap-3 hover:text-cyan-400 group"
          >
            <SettingsIcon className="w-6 h-6 sm:w-7 sm:h-7 group-hover:rotate-90 transition-all duration-300" />
            <span>Settings</span>
          </button>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 text-center max-w-[200px] font-poppins">
          Customize your experience and manage preferences.
        </p>
      </div>

      {/* Fullscreen Modal Overlay */}
      {isSettingOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 sm:px-0 transition-opacity animate-in fade-in duration-300">
          
          {/* Modal Container */}
          <div className="relative w-full max-w-2xl max-h-[90vh] sm:max-h-[85vh] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 rounded-2xl shadow-2xl border border-slate-700/50 flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-700/50 bg-slate-900/50">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-100 flex items-center gap-3 font-poppins">
                <SettingsIcon className="w-6 h-6 text-cyan-400" />
                Application Settings
              </h2>
              <button 
                onClick={() => setIsSettingOpen(false)}
                className="p-2 rounded-full bg-slate-800 border border-slate-700 text-slate-400 hover:text-rose-400 hover:bg-slate-700 hover:border-rose-500/50 transition-all duration-200"
              >
                <X size={20} strokeWidth={2.5} />
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="flex-1 overflow-y-auto scrollbar-custom p-4 sm:p-6">
              <App_Setting />
            </div>
            
          </div>
        </div>
      )}
    </>
  );
}

export default SettingsComponent;
