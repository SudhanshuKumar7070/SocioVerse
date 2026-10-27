import { useState } from "react";
import { Settings } from "lucide-react"; // Ensure you import the correct Settings icon

const IconWithTooltip = ({ onClick, styling = "", className = "", ...rest }) => {
  const [textDisplay, setTextDisplay] = useState(false);

  return (
    <div
      className="relative flex items-center justify-center"
      onMouseEnter={() => setTextDisplay(true)}
      onMouseLeave={() => setTextDisplay(false)}
    >
      <button
        type="button"
        onClick={onClick}
        className={`p-2.5 rounded-full bg-slate-900/60 hover:bg-slate-800/90 border border-slate-700/60 backdrop-blur-md shadow-lg text-slate-300 hover:text-white transition-all duration-200 hover:scale-105 active:scale-95 group ${className}`}
        {...rest}
      >
        <Settings
          className={`w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300 group-hover:rotate-90 ${styling}`}
        />
      </button>
      <div
        className={`absolute top-12 right-0 px-3 py-1.5 bg-slate-900/95 border border-slate-700/80 shadow-2xl rounded-xl text-xs text-slate-200 font-poppins whitespace-nowrap transition-all duration-200 pointer-events-none z-50 backdrop-blur-md ${
          textDisplay ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-1"
        }`}
      >
        Profile Settings
      </div>
    </div>
  );
};

export default IconWithTooltip;
