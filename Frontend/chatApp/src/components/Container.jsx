import React from 'react'

function Container({children}) {
  return (
    <div className={`sm:bg-gradient-to-r sm:from-slate-900 sm:via-blue-800 sm:to-slate-900
     w-[100vw] h-[100vh]
    flex flex-col justify-center items-center font-montserrat bg-gradient-to-tr from-blue-900 via-blue-500 to-blue-900 bg-opacity-10 shadow-lg rounded-lg border-2 border-white overflow-hidden`}>
        {children}
    </div>
  )
}

export default Container
