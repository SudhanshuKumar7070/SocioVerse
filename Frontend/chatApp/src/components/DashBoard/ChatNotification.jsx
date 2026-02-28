import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ChatNotification({ profilePicSrc, notificationReceived,content,notificationId,convoID }) {
  const navigate = useNavigate();
  const Url = import.meta.env.VITE_API_URL;
  const [isSeen, setIsSeen] = useState(!notificationReceived);
   // updating the isReadMessage
   const handeIsMessageRead = async(id)=>{
    try{
    const updateResponse = await axios.patch(`${Url}/notification/update_isRead/${id}`,{},{withCredentials:true})
     if(!updateResponse) throw new Error("error in updating value  of  message isRead");
    }
    catch(err){
      console.log(err)
    }
  }
  useEffect(() => {
    if (notificationReceived) {
      setIsSeen(false);
    }
  }, [notificationReceived]);

  return (
  <div className={ isSeen?`hidden`:`flex items-center gap-3 p-3 rounded-xl shadow-md bg-slate-800/60 hover:bg-slate-800/80 border border-slate-700/50 font-montserrat transition-all duration-300 cursor-pointer`} onClick={()=>{
  handeIsMessageRead(notificationId) ;
  navigate(`/center_area/${convoID}`)
  }}>
      
      {/* Profile Picture */}
      <div className="h-10 w-10 shrink-0 rounded-full border-2 border-slate-700 overflow-hidden shadow-md bg-gradient-to-br from-slate-800 to-slate-700">
        <img
          src={profilePicSrc}
          alt="profile"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Message Info */}
      <div className="relative w-full min-w-0 pr-4">
        <p className="text-sm text-slate-200 font-semibold font-montserrat truncate">{content}</p>
        {!isSeen && (
          <span className="absolute top-1 right-0 h-2.5 w-2.5 bg-emerald-500 border-2 border-slate-800 rounded-full shadow-sm"></span>
        )}
      </div>

      {/* Mark as Seen Button */}
      {!isSeen && (
        <button
          className="ml-auto shrink-0 text-xs font-poppins font-medium text-cyan-400 hover:text-cyan-300 hover:underline transition"
          onClick={(e) => {
            e.stopPropagation();
            handeIsMessageRead(notificationId)
            setIsSeen(true)}}
        >
          Mark as Seen
        </button>
      )}
    </div>
  );
}

export default ChatNotification;
