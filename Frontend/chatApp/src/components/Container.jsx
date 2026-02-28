import React from 'react'

 
function Container({children}) {
  return (
    <div className={`sm:bg-gradient-to-r from-slate-900 to-slate-700
     w-full min-h-screen
    flex flex-col justify-center items-center font-montserrat bg-gradient-to-tr from-blue-900 via-blue-500 to-blue-900 bg-opacity-10 shadow-lg rounded-lg sm:border-2 border-white overflow-x-hidden relative`}>
        {children}
    </div>
  )
}

export default Container
