import React from 'react'

function SendMessage({message}) {
    return (
        <div className="text-white bg-gradient-to-r from-sky-500 to-indigo-500 px-4 py-2.5 font-montserrat text-sm sm:text-base rounded-2xl rounded-tr-sm max-w-[75%] sm:max-w-[65%] shadow-md my-1.5 mx-4 ml-auto break-words">
          {message}
        </div>
      )
}

export default SendMessage
