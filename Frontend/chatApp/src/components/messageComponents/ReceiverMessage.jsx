import React from 'react'

function ReceivedMessage({message}) {
  return (
    <div className="bg-slate-800/90 border border-slate-700/50 text-slate-100 px-4 py-2.5 font-montserrat text-sm sm:text-base rounded-2xl rounded-tl-sm max-w-[75%] sm:max-w-[65%] shadow-md my-1.5 mx-4 mr-auto break-words">
      {message}
    </div>
  )
}

export default ReceivedMessage
