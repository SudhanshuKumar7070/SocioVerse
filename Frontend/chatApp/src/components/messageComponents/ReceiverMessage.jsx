import React from 'react'

function ReceivedMessage({message}) {
  return (
    <div className=' bg-slate-800 bg-opacity-90 font-montserrat text-sky-100 border-none px-2 py-3 text-center font-roboto  rounded-md max-w-[50%] shadow-md  my-4 mx-4' >
      {message}
      
    </div>
  )
}

export default ReceivedMessage
