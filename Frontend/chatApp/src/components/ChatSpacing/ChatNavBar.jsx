import React from 'react'
import { Phone, Video, Search, MoreVertical, ArrowLeft } from 'lucide-react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

function ChatNavBar({ navClass }) {
  const navigate = useNavigate();
  const userProfile = useSelector((state) => state.userUrl.userUrl) || "";
  const userName = useSelector((state) => state.conversation.userName) || "Chat";

  return (
    <div className={`${navClass} shadow-md sticky top-0 z-30 flex items-center justify-between`}>
      {/* User Info Section with Mobile Back Button */}
      <div id="current_user" className="flex items-center gap-2 sm:gap-3 min-w-0">
        {/* Back Button for Mobile view to return to contact list */}
        <button
          onClick={() => navigate("/center_area/start_chat")}
          className="md:hidden p-1.5 -ml-1 text-slate-300 hover:text-white rounded-full hover:bg-slate-800 transition"
          aria-label="Back to contacts"
        >
          <ArrowLeft size={20} />
        </button>

        <div className="relative shrink-0">
          <img 
            src={userProfile || "https://picsum.photos/seed/chat/200/200"} 
            alt="avatar"  
            className="rounded-full h-9 w-9 sm:h-11 sm:w-11 object-cover border-2 border-slate-700/50" 
          />
        </div>
        <div className="flex flex-col min-w-0">
          <h2 className="text-slate-100 font-semibold text-sm sm:text-base truncate font-poppins">{userName}</h2>
        </div>
      </div>

      {/* Action Icons Section */}
      <div id="options" className="flex items-center gap-1 sm:gap-2 shrink-0">
        <button className="p-2 sm:p-2.5 rounded-full hover:bg-slate-700/50 text-sky-400/80 hover:text-sky-300 transition-all duration-200">
          <Phone size={18} strokeWidth={2.5} />
        </button>
        <button className="p-2 sm:p-2.5 rounded-full hover:bg-slate-700/50 text-indigo-400/80 hover:text-indigo-300 transition-all duration-200 hidden sm:block">
          <Video size={18} strokeWidth={2.5} />
        </button>
        <button className="p-2 sm:p-2.5 rounded-full hover:bg-slate-700/50 text-slate-400 hover:text-slate-200 transition-all duration-200 hidden xs:block">
          <Search size={18} strokeWidth={2.5} />
        </button>
        <button className="p-2 sm:p-2.5 rounded-full hover:bg-slate-700/50 text-slate-400 hover:text-slate-200 transition-all duration-200">
          <MoreVertical size={18} />
        </button>
      </div>
    </div>
  );
}

export default ChatNavBar;
