import React from 'react'
import { useId } from 'react'

const Input = React.forwardRef(
    ({type="text",label,className='',...props},ref) => {
        const id = useId();
      return (
        <div>
          {label && <label htmlFor={id}  className="inline-block mb-2 p-2">{label}</label>}
          <input type={type} className={`bg-blue-200 border-[#DDDDDD] text-black px-3
            focus:bg-blue-50 duration-200 outline-none
             py-4  shadow-lg rounded-s-lg  ${className}  `} {...props}/>
        </div>
      )
    }
)

export default Input

 
