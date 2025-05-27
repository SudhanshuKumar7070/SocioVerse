import React, { useCallback, useEffect } from 'react'
import Container from "./components/Container";
import { Outlet } from "react-router-dom";
import { useSocket } from './components/SocketConnection';
import { useState } from 'react';
import { useGlobalSocket } from './components/SocketConnection';
import { useSelector } from 'react-redux';
import ContactList from './components/ContactList';
import { useContext } from 'react';
import { contextMap } from './store/NotificationMap.jsx';
// import ChatingSpace from './components/ChatSpacing/ChatingSpace.jsx';
function App() {
  const {setValue, getValue,globalMap} = useContext(contextMap);
  // const socket =  useSocket();
  // const globalSocket = useGlobalSocket();
  // const [newVal ,setNewVal]= useState('');
  // const [reply ,setReply]= useState('');
  // const handleChange = (e)=>{
  //   setNewVal(e.target.value);
  // }
  // const handleSendMessage = useCallback(()=>{
  //   socket.emit("message",{message:newVal})
  //   setNewVal('')
  // })
  // useEffect(()=>{
  //   console.log(reply)
  //   socket.on("connect",()=>{
  //     console.log("socket connection done")
  //     socket.on("reply",({reply})=>{
  //          if(reply){
  //           setReply(reply);
  //          }
  //     })
  //   })
  // },[socket,reply])
  
   const globalSocket = useGlobalSocket();
   const myId = useSelector((state) => state.auth?.userData?._id);
    console.log(myId)
   useEffect(()=>{
    globalSocket.on("connect",()=>{
      console.log("global socket connection done")
      globalSocket.on("addedComment",(data)=>{
           setValue("commentNotification",data);
        // NotificationManager.set("commentNotification",data)
  console.log("data",data)
  alert("comment created");
      })
      globalSocket.on("friend_request_notification", (data)=>{
        setValue("friendRequest",data);
          // NotificationManager.set("friendRequest",data);
        console.log("you have received a friend  request");
        alert("new friendrequest");
      })
      globalSocket.on("friend_request_acceptd_notofication",(data)=>{
 console.log("accepted notification:",data);
  alert("friend request accepted");

      })
      globalSocket.on("rejected_friend_request",(data)=>{
 console.log("rejected notification:",data);
  alert("friend request rejected");

      })
      globalSocket.emit("connectionEstablished",{userId:myId})
      
    })
     // getting all the values in map for checking purpose
     console.log("displaying all data available at globalMap::",globalMap)
      globalSocket.on("FollowRequest",(message)=>{
        console.log("khuch to hua hai")
        console.log(message)
         alert("you have a of new follower");
      })
        return ()=>{
          globalSocket.off("FollowRequest",(message)=>{
            console.log("khuch to hua hai")
            console.log(message)
            //  alert("you have a of new follower");
          })
          globalSocket.off("friend_request_notification", (data)=>{
            setValue("friendRequest",data);
              // NotificationManager.set("friendRequest",data);
            console.log("you have received a friend  request");
            // alert("new friendrequest");
          })
          globalSocket.off("friend_request_acceptd_notofication",(data)=>{
            console.log("accepted notificatin",data);
            //  alert("friend request accepted");
           
                 })
                 globalSocket.off("rejected_friend_request",(data)=>{
                  console.log("rejected notification at off :",data);
                  
                 
                       })
        }

   },[globalSocket])
  


   
  return (
    <div className="h-full w-full flex justify-center items-center flex-col">
      
   <Container>
     {/* <input type="text" name="new_input" id="input_ka_id "  value={newVal} onChange={handleChange} />
      <button  onClick={handleSendMessage} className='border-2 rounded-lg  border-blue-600 p-2 mt-5 bg-slate-400'>send maessage</button>
      {reply && <div>{reply}</div>} */}
      {/* <ContactList/> */}
      {/* <ChatingSpace/> */}
   <Outlet/>
   </Container>
    
    </div>
  )
}

export default App
