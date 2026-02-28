import React from "react";
import { useRef } from "react";
import SendMessage from "./SendMessage";
import ReceivedMessage from "./ReceiverMessage";
import { useState, useEffect, useCallback } from "react";
import MessageInput from "../MainTextingArea/MessageInput";
import { useSocket } from "../SocketConnection";
import { useGlobalSocket } from "../SocketConnection";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import SpinnerWithText from "../LoadingSpinner";
// import { use } from "react";
// // import redis from 'redis'
// // import {
// //   setCurrentRoom,
// //   updateConversationState,
// // } from "../../store/conversationSlice";
 

function MessageInterface({ propClass , convoId}) {

  // const subscriber= redis.createClient();
   const [isLoading,setIsLoading] = useState(true)
  const dispatch = useDispatch();
  const url = import.meta.env.VITE_API_URL;
   const [convId, setConvId] = useState("");
  const [textMessage, setMessage] = useState([]);
  const myId = useSelector((state) => state.conversation.senderId);
  const socket = useSocket();
  const refrer = useRef(null);
  const myData = useSelector((state) => state.auth.userData);
  const globalSocket= useGlobalSocket();
  
  // setConvId(convoId);
  console.log("myData:", myData, "and my id is:", myId);

  const fetchOldChats = useCallback(     async (conversationId) => {

      try {
        const response = await axios.get(
          `${url}/conversation/fetchConversation/${conversationId}`,{withCredentials:true}
        );
        if(!response) {
         
          return
        }
        console.log("response:", response);
        
        if (response?.data?.response?.[0]?.conversationMessages) {
         
          setMessage(response.data.response[0].conversationMessages);
          console.log(response.data.response[0].conversationMessages);
          return response.data.response[0].conversationMessages;
        }
      } catch (err) {
      
        console.log("error in fetching old chats,", err);
      }
    },[convoId])

useEffect(() => {
    setConvId(convoId);
  }, [convoId]);
    

     useEffect(() => {
    
    const start = async(conversationId)=>{
      if (!conversationId) return;
      setIsLoading(true);
      try {
        const response =  await fetchOldChats(conversationId);
      
      } catch (error) {
        console.log("error in fetching old chats,", error);
        setIsLoading(false);
      }
     finally{
        setIsLoading(false);
      }
  
    }
    start(convoId);
    
    const handleNewMessage = (newData) => {
      console.log("New message received:", newData, "and convoId is:", convoId);
       
      if (newData.conversationID === convoId) {
       
        const newMessage = {
          text: newData.text,
          sender: newData.senderId,
        };
        setMessage((prev) => [...prev,newMessage]);
      }
      // console.log("textMessage:", textMessage);
    };

    socket.on("newMessage", handleNewMessage)
          return () => {
      // socket.off("conversationStarted", handleConversatonStart);
     socket.off("newMessage", handleNewMessage);
    };
  }, [socket,convoId]);
  // handling global notification to stop rerendering

  useEffect(()=>{
    const handleNewChatNotification =(data)=>{
      console.log("new notificatton received:::",data)
      alert(" received new message !");
     }
    globalSocket.on("newChatNotfication",handleNewChatNotification);
    return ()=>{
      globalSocket.off("newChatNotfication",handleNewChatNotification)
    }
  },[globalSocket,convoId])

  useEffect(() => {
    if (refrer.current) {
      refrer.current.scrollTo({
        top: refrer.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [textMessage]);

  
  if (isLoading) return ( <SpinnerWithText/>)
    
  return (
    <div className={`w-full flex-1 flex flex-col bg-transparent relative overflow-hidden ${propClass}`}>
      {/* Scrollable Message Container */}
      <div className="flex-1 overflow-y-auto scrollbar-custom scroll-smooth px-2 sm:px-4 py-6 w-full flex flex-col gap-2">
        {textMessage && textMessage.length > 0 ? (
          textMessage.map((element, index) => (
            <div
              key={index}
              ref={refrer}
              className={`flex w-full ${
                element.sender === myId ? "justify-end" : "justify-start"
              } animate-in fade-in slide-in-from-bottom-2 duration-300`}
            >
              {element.sender === myId ? (
                <SendMessage message={element.text} />
              ) : (
                <ReceivedMessage message={element.text} />
              )}
            </div>
          ))
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center h-full opacity-50 select-none pointer-events-none pb-12">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4 border border-slate-700">
               <span className="text-2xl">👋</span>
            </div>
            <p className="text-slate-400 font-montserrat text-center">No messages yet.<br/>Start the conversation!</p>
          </div>
        )}
      </div>

      {/* Footer Input Area */}
      <div className="w-full shrink-0 z-10 bg-slate-900 border-t border-slate-700/50">
        <MessageInput PropClassName="py-2.5 sm:py-3 bg-transparent text-slate-100 placeholder-slate-500 font-montserrat" />
      </div>
    </div>
  );
}
  


export default MessageInterface;
