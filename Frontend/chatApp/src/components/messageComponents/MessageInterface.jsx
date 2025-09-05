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
    <div className={` bg-transparent  flex flex-col  ${propClass} `}>
     <h1 className="text-white font-poppins p-2 absolute top-0">data</h1>
      {textMessage && textMessage.length > 0 ? (
        textMessage.map((element, index) => (
          <div
            key={index}
            ref={refrer}
            className={` flex w-full ${
              element.sender === myId ? "justify-end" : "justify-start"
            }`}
          >
            {element.sender === myId ? (
              <ReceivedMessage message={element.text} />
            ) : (
              <SendMessage message={element.text} />
            )}
          </div>
        ))
      ) : (
        <div className="text-center text-gray-500 text-3xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          No messages yet. Start a conversation!
        </div>
      )}

      <div
        id="chat_type_send"
        className="w-[67%]  fixed flex justify-center items-center bg-transparent h-20  bottom-0 right-3 "
      >
        <MessageInput PropClassName={"w-[40vw] py-3 h-full bg-inherit  shadow-none  font-poppins    focus:bg-inherit duration-200 outline-none text-white placeholder-gray-500 "} />
      </div>
    </div>
  );
}
  


export default MessageInterface;
