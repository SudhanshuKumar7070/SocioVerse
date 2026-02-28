import React from 'react'

function Button({
    children='',
     className ="",
     type="button",
    
      text='text-white',
     ...props
    
}) {
  return (
    <button type={type} className={`bg-blue-600 hover:bg-blue-700 active:bg-blue-800 transition-all duration-200 
     text-white font-medium rounded-lg px-6 py-3
     font-poppins
     shadow-sm hover:shadow active:scale-[0.98] w-full sm:w-auto
      ${className} 
      
       ${text}`}
        {...props}>
        {children}
    </button>
  )
}

export default Button
