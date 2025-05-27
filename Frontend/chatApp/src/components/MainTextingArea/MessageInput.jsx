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
 socket.emit("sendMessage",{conversationID:conversationID,senderId:senderId,receiverId: receiverId ,textMessage:textMessage})
 console.log("sendMessage",conversationID,senderId,receiverId,textMessage)
 setMessage('')
  
}
   
  
  return (
    <div className="flex justify-around items-center  sm:min-w-[80%] bg-slate-900 rounded-lg bg-opacity-80 shadow-xl hover:border hover:border-white transition-all  duration-300  ease-in ">
           <span id="currUserImag" className="flex justify-center items-center p-1" >
            <img src={userImageUrl} className="h-14 w-14 rounded-full shadow-lg"  alt="user1" />
           </span>
           <span className="flex justify-center items-center">
           <Input
            placeholder="this is component for checking"
            value={textMessage}
           
            type="text"
            onChange={(e)=>{
              setMessage(e.target.value)
            }}
            className={`${PropClassName} ` }
            
          />
          {/* button to send message */}
          <button
            onClick={handleSendMessage}
            className={`bg-sky-300 bg-opacity-90 h-14 w-14 py-[10px] rounded-full  hover:bg-sky-500 hover:text-white flex justify-center items-center `}
            id=""
          >
            <SendHorizontal size={18} stroke="black"/>
            
          </button>
           </span>
          
        
    
            
    </div>
  );
};

export default MessageInput;
