import React, { useCallback, useEffect } from 'react'
import i18n from './Hooks/i18n.setup.js';
import { useTranslation } from 'react-i18next';
import Container from "./components/Container";
import { Outlet } from "react-router-dom";
import { useSocket } from './components/SocketConnection';
import { useState } from 'react';
import { useGlobalSocket } from './components/SocketConnection';
import { useSelector } from 'react-redux';
import ContactList from './components/ContactList';
import { useContext } from 'react';
import { contextMap } from './store/NotificationMap.jsx';
import landingPage from './components/LandingPage/landingPage.jsx';
import LandingPage from './components/LandingPage/landingPage.jsx';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { login } from './store/authSlice.js';
import { setTokens } from './store/tokenSlice.js';
// import ForgotPass from './co
// mponents/ForgotPass.jsx';
// import ChatingSpace from './components/ChatSpacing/ChatingSpace.jsx';
function App() {
  const {t , i18n} = useTranslation();
  const dispatch = useDispatch();
  // method to cahange language 
  const changeLanguage = (lng)=>{
    i18n.changeLanguage(lng);
  }
  const {setValue, getValue,globalMap} = useContext(contextMap);
  
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
                       globalSocket.off("addedComment",()=>{
                        console.log("added comment turned off");
                       })
        }

   },[globalSocket])
  
const get_Current_User = async()=>{
try{
const user = await axios.get(`http://localhost:3000/api/v1/user/current_user_data`,{withCredentials:true});
if(!user) alert("user not fetched at moment");
const data = user.data.response;
console.log("dataa === ", data ,"at app.jsx");
console.log("refreshToken === ", data.RefreshToken ,"at app.jsx");
    dispatch(login({
      userData:data,
      token:data.RefreshToken
    }))
   dispatch(setTokens({
    refreshToken:data.RefreshToken
   }))
    }
    catch(err){
      console.log("error occured in getting current user" , err)
    }
   }
  useEffect(()=>{
    get_Current_User();
  },[])

   
  return (
    <div className="h-full w-full flex justify-center items-center flex-col">
      
   <Container>
   <Outlet/>
   </Container>
    
    </div>
  )
}

export default App
