import React from 'react'

function Button({
    children='',
     className ="",
     type="button",
    
      text='text-white',
     ...props
    
}) {
  return (
    <button type={type} className={`bg-gradient-to-r from-blue-900 via-blue-100 to-blue-900 transition-all duration-300 
     hover:scale-105 text-neutral-900 rounded-md px-4 py-2
      hover:text-gray-200 shadow-md
      hover:shadow-none 
      ${className} 
      
       ${text}`}
        {...props}>
        {children}
    </button>
  )
}

export default Button
