import { useState } from "react";
import { Settings } from "lucide-react"; // Ensure you import the correct Settings icon

const IconWithTooltip = (
    params,
    styling=""
) => {
  const [textDisplay, setTextDisplay] = useState(false);

  return (
    <div
      className={`relative flex items-center justify-center`}
      onMouseEnter={() => setTextDisplay(true)}
      onMouseLeave={() => setTextDisplay(false)}
    >
      <span className={`flex items-center justify-center cursor-pointer`}>
        <Settings className={`text-slate-300 w-6 h-6 sm:w-7 sm:h-7 transition-all duration-300 ease-in-out hover:scale-110 hover:text-white hover:rotate-90 ${styling}`} {...params} />
        <p
          className={`absolute top-10 right-0 px-3 py-1.5 bg-slate-800 border border-slate-700 shadow-xl rounded-lg text-xs sm:text-sm text-slate-200 font-poppins whitespace-nowrap transition-all duration-300 pointer-events-none z-50 ${
            textDisplay ? "opacity-100 scale-100 translate-y-0": "opacity-0 scale-95 -translate-y-2"
          }`}
        >
          Profile Settings
        </p>
      </span>
    </div>
  );
};

export default IconWithTooltip;
