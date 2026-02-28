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
    <div className="flex justify-between items-center w-full sm:w-[90%] md:w-[80%] mx-auto bg-slate-900 rounded-lg bg-opacity-80 shadow-xl border border-transparent hover:border-white transition-all duration-300 ease-in p-2 mt-auto mb-2 shrink-0">
           <span id="currUserImag" className="flex justify-center items-center shrink-0" >
            <img src={userImageUrl} className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 rounded-full shadow-lg"  alt="user1" />
           </span>
           <span className="flex justify-center items-center flex-grow mx-2 space-x-2">
           <Input
            placeholder="Type your message..."
            value={textMessage}
           
            type="text"
            onChange={(e)=>{
              setMessage(e.target.value)
            }}
            className={`w-full ${PropClassName} `}
            
          />
          {/* button to send message */}
          <button
            onClick={handleSendMessage}
            className={`bg-sky-300 bg-opacity-90 h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 shrink-0 rounded-full hover:bg-sky-500 hover:text-white flex justify-center items-center `}
            id=""
          >
            <SendHorizontal size={18} stroke="black"/>
            
          </button>
           </span>
          
        
    
            
    </div>
  );
};

export default MessageInput;
