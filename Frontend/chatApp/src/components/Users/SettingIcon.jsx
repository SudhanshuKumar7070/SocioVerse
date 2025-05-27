import { useState } from "react";
import { Settings } from "lucide-react"; // Ensure you import the correct Settings icon

const IconWithTooltip = (
    params,
    styling=""
) => {
  const [textDisplay, setTextDisplay] = useState(false);

  return (
    <div
      className={` flex items-center justify-center absolute right-10 top-10`}
      onMouseEnter={() => setTextDisplay(true)}
      onMouseLeave={() => setTextDisplay(false)}
    >
      <span className={` flex items-center justify-center cursor-pointer `}>
        <Settings className={`text-blue-200 w-6 h-6 transition-transform duration-300 ease-in-out hover:scale-110 hover:text-blue-600" ${styling}`} {...params} />
        <p
          className={ ` absolute top-12 right-0 px-3  py-1 bg-slate-950 shadow-lg rounded-md text-sm text-white font-poppins transition-opacity duration-300 ${
            textDisplay ? "opacity-100 scale-100": "opacity-0 scale-95"
          }`}
        >
          Profile Setting
        </p>
      </span>
    </div>
  );
};

export default IconWithTooltip;
