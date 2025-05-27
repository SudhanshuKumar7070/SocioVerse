import React from 'react'
import OptionsIcon from './IconComponent/OptionsIcon'
import { Phone, Camera ,SearchIcon } from 'lucide-react'
import { useSelector } from 'react-redux'
function ChatNavBar({navClass,currentUserClass,optionsClass}) {
  const userProfile = useSelector((state)=>state.userUrl.userUrl) ||""
  
  return (
    <div className={`${navClass} border-b border-slate-900 rounded-r-lg shadow-lg sticky `}>
      <div id="current_user" className={`flex justify-around items-center ${currentUserClass} sm:min-w-[70%] `}>
        <span ><img src={userProfile} alt="avatar"  className='rounded-full   h-16  w-16 shadow-lg ' /></span>
        <span id="#user_status" className={currentUserClass}></span>
      </div>
      
      <div id="options" className={` sm:min-h-20 gap-4 ${optionsClass} sm:min-w-[30%] flex justify-center items-center`}>
        <ul className='sm:flex   sm:justify-around sm:items-center  w-full h-ullf'>
          <li  ><Phone  size={28} className='text-sky-300 hover:transition-all hover:duration-300 hover:ease-in-out hover:text-cyan-400 '/></li>
          <li  ><Camera size={28} className='text-sky-300 hover:transition-all hover:duration-300 hover:ease-in-out hover:text-cyan-400 '/></li>
          <li  ><SearchIcon size={28} className='text-sky-300 hover:transition-all hover:duration-300 hover:ease-in-out hover:text-cyan-400 '/></li>
        </ul>
      </div>
    </div>
  )
}

export default ChatNavBar
