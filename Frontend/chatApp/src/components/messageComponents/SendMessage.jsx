import React from 'react'

function SendMessage({message}) {
    return (
        <div className='  text-slate-700 border-none px-2 py-3 text-center font-montserrat bg-white  rounded-md max-w-[50%] bg-opacity-80 shadow-md  my-4 mx-4' >
          {message}
          
        </div>
      )
}

export default SendMessage
