import React from "react";
import { useId } from "react";
const Select = React.forwardRef(
  ({ label, className = "", options, ...props }, ref) => {
    const id = useId();
    return (
      <div className=" w-full">
        {label && (
          <label htmlFor={id} className="inline-block px-3">
            {label}
          </label>
        )}
        {
          <select
            className={` bg-gray-100	text-gray-800	border-2 border-gray-300 hover:bg-gray-200 
    hover:text-gray-900 duration-200 hover:border-gray-400 focus:bg-white
    focus:text-gray-500 focus:border-blue-500  ${className} w-full`}
            {...props}
            id={id}
            ref={ref}
          >
            {options?.map((option) => (
              // agar options me array value nahi aaya to error aayega
              <option value={option} key={option}>
                {option}
              </option>
            ))}
          </select>
        }
      </div>
    );
  }
);
export default Select;
