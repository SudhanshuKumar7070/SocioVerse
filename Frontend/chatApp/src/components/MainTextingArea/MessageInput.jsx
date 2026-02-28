import React, { useEffect,useState,useCallback } from "react";
import { SendHorizontal } from "lucide-react";

import "./MessageInput.css";
import { useSocket } from "../SocketConnection";
import Input from "../Input";
import { useSelector } from "react-redux";
const MessageInput = ({PropClassName}) => {
   const roomID = useSelector((state)=> state.conversation.currentRoom )
   const userImageUrl = useSelector((state)=> state.auth?.userData?.profilePicture)
    const conversationID = useSelector((state)=> state.conversation.conversationId);
    const senderId = useSelector((state)=> state.conversation.senderId)
    const receiverId = useSelector((state)=> state.conversation.receiverId)
    console.log("properties at frontend for redux::",conversationID, senderId, receiverId )
  const[textMessage,setMessage] = useState('')
  
//  const[conversationId,setConversationId]=useState()
//  const[senderId,setSenderId]=useState();
//  const[receiverId,setReceiverId]=useState();
 const socket = useSocket();
   const handleSendMessage=()=>{
    console.log("<>----------handleSendMessage called--------<>")
    if(!textMessage){
      return
    }
 socket.emit("sendMessage",{conversationID:conversationID,senderId:senderId,receiverId: receiverId ,textMessage:textMessage})
 console.log("sendMessage",conversationID,senderId,receiverId,textMessage)
 setMessage('')

}
   
  
  return (
    <div className="w-full bg-slate-800/60 backdrop-blur-md border-t border-slate-700/50 p-3 sm:p-4 shrink-0 transition-all duration-300">
      <div className="flex justify-between items-center w-full max-w-4xl mx-auto gap-3 sm:gap-4">
        <span id="currUserImag" className="shrink-0 hidden sm:flex">
          <img src={userImageUrl || "https://picsum.photos/seed/user/200/200"} className="h-10 w-10 sm:h-12 sm:w-12 rounded-full border border-slate-600/50 object-cover" alt="user" />
        </span>
        
        <div className="flex flex-1 items-center bg-slate-900/50 border border-slate-700/50 rounded-full px-2 sm:px-4 py-1.5 sm:py-2 focus-within:border-sky-500/50 focus-within:ring-1 focus-within:ring-sky-500/50 transition-all">
          <Input
            placeholder="Type your message..."
            value={textMessage}
            type="text"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendMessage()
            }}
            onChange={(e) => setMessage(e.target.value)}
            className={`w-full bg-transparent active:border-none focus:outline-none text-slate-100 placeholder-slate-500 font-montserrat text-sm sm:text-base px-2 ${PropClassName}`}
          />
        </div>

        <button
          onClick={handleSendMessage}
          disabled={!textMessage.trim()}
          className={`shrink-0 h-10 w-10 sm:h-12 sm:w-12 rounded-full flex justify-center items-center transition-all duration-300
            ${textMessage.trim() 
              ? "bg-gradient-to-r from-sky-500 to-indigo-500 text-white shadow-lg hover:shadow-sky-500/25 hover:scale-105" 
              : "bg-slate-700 text-slate-500 cursor-not-allowed"}`}
        >
          <SendHorizontal size={20} strokeWidth={2.5} className={textMessage.trim() ? "translate-x-0.5" : ""} />
        </button>
      </div>
    </div>
  );
};

export default MessageInput;
