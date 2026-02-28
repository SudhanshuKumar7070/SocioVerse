import React from 'react'
import { Phone, Video, Search, MoreVertical } from 'lucide-react'
import { useSelector } from 'react-redux'

function ChatNavBar({navClass}) {
  const userProfile = useSelector((state) => state.userUrl.userUrl) || "";
  const userName = useSelector((state) => state.conversation.userName) || "Chat";
  
  return (
    <div className={`${navClass} shadow-md sticky top-0 z-30`}>
      {/* User Info Section */}
      <div id="current_user" className="flex items-center gap-3">
        <div className="relative">
          <img 
            src={userProfile || "https://picsum.photos/seed/chat/200/200"} 
            alt="avatar"  
            className="rounded-full h-10 w-10 sm:h-12 sm:w-12 object-cover border-2 border-slate-700/50" 
          />
          {/* <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border border-slate-900 rounded-full"></span> */}
        </div>
        <div className="flex flex-col flex-1 min-w-0">
          <h2 className="text-slate-100 font-semibold text-sm sm:text-base truncate font-poppins">{userName}</h2>
          {/* <span className="text-emerald-400 text-xs font-medium tracking-wide">Online</span> */}
        </div>
      </div>
      
      {/* Action Icons Section */}
      <div id="options" className="flex items-center gap-1 sm:gap-2">
        <button className="p-2 sm:p-2.5 rounded-full hover:bg-slate-700/50 text-sky-400/80 hover:text-sky-300 transition-all duration-200">
          <Phone size={20} strokeWidth={2.5} />
        </button>
        <button className="p-2 sm:p-2.5 rounded-full hover:bg-slate-700/50 text-indigo-400/80 hover:text-indigo-300 transition-all duration-200 hidden sm:block">
          <Video size={20} strokeWidth={2.5} />
        </button>
        <button className="p-2 sm:p-2.5 rounded-full hover:bg-slate-700/50 text-slate-400 hover:text-slate-200 transition-all duration-200 hidden xs:block">
          <Search size={20} strokeWidth={2.5} />
        </button>
        <button className="p-2 sm:p-2.5 rounded-full hover:bg-slate-700/50 text-slate-400 hover:text-slate-200 transition-all duration-200">
          <MoreVertical size={20} />
        </button>
      </div>
    </div>
  )
}

export default ChatNavBar
