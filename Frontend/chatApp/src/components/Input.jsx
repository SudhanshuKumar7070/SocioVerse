import React from 'react'
import { useId } from 'react'

const Input = React.forwardRef(
    ({type="text",label,className='',...props},ref) => {
        const id = useId();
      return (
        <div className='flex flex-col sm:flex-row justify-start sm:items-center gap-1 sm:gap-3 w-full'>
          {label && <label htmlFor={id} className="inline-block sm:mb-0 p-1 font-poppins font-medium text-sm text-gray-700 tracking-tight sm:min-w-[25%]">{label}</label>}
          <input 
            type={type} 
            id={id}
            ref={ref}
            className={` duration-200 outline-none flex-1 py-3 rounded-lg font-poppins text-sm transition-all w-full ${className}`} 
            {...props}
          />
        </div>
      )
    }
)

export default Input

 
