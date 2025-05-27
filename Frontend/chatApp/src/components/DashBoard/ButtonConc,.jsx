import React from 'react'

function ButtonConc({children}) {
  return (
    <div className='p-2 m-2 bg-blue-300 border-2 border-purple-100 rounded-lg  text-blue-950  text-center font-semibold hover:transition-all hover:duration-300 hover:text-purple-500 hover:bg-blue-600 text-lg shadow-lg'>
      {children}
    </div>
  )
}

export default ButtonConc
