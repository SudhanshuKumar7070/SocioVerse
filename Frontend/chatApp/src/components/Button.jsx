import React from 'react'

function Button({
    children='',
     className ="",
     type="button",
     bgColor= 'bg-[#007BFF]',
      text='text-white',
     ...props
    
}) {
  return (
    <button type={type} className={`bg-blue-500 transition-all duration-300 
     hover:scale-105 text-white rounded-md px-4 py-2
      hover:text-gray-200 shadow-lg 
      hover:shadow-none ${className} 
      ${bgColor}
       ${text}`}
        {...props}>
        {children}
    </button>
  )
}

export default Button
