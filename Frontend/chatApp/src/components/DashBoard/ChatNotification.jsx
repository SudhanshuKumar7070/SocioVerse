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
  <div className={ isSeen?`hidden`:`flex items-center gap-3 p-3 rounded-xl shadow-md bg-white border border-slate-200 font-montserrat transition-all duration-300`} onClick={()=>{
  navigate(`/center_area/${convoID}`)
  }}>
      
      {/* Profile Picture */}
      <div className="h-10 w-10 rounded-full border-2 border-white overflow-hidden shadow-md bg-gradient-to-br from-slate-800 to-slate-700">
        <img
          src={profilePicSrc}
          alt="profile"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Message Info */}
      <div className="relative w-full">
        <p className="text-sm text-slate-700 font-semibold font-montserrat">{content}</p>
        {!isSeen && (
          <span className="absolute top-0 right-0 h-3 w-3 bg-green-500 border-2 border-white rounded-full shadow-sm"></span>
        )}
      </div>

      {/* Mark as Seen Button */}
      {!isSeen && (
        <button
          className="ml-auto text-xs font-poppins font-medium text-sky-500 hover:text-sky-600 hover:underline transition"
          onClick={() => {
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
