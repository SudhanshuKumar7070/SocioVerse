import React from 'react'
// import PhoneLogo from '../../assets/phone-call-svgrepo-com.svg'
// import CameraLogo from '../../assets/video-call-svgrepo-com.svg'
// import SearchLogo from '../../assets/search-button-svgrepo-com.svg'
import "./MainTextingArea.css"
import MessageInput from './MessageInput'
import { useState,useEffect } from 'react'
import { use } from 'react'
const MainTextingArea = () => {
 const [message,setMessage]=useState('')
useEffect(()=>{
    // const socket = io("http://localhost:8080");
    // socket.onopen = () => {
    //     console.log('connected');
    //     socket.send('hey');
    // };
    // socket.onmessage = (event) => {
    //     console.log('received', event.data);
    //     setMessage(event.data)
    // };
    // socket.onclose = () => {
    //     console.log('disconnected');
    // };
    // return () => {
    //     socket.close();
    // };



},[])

    
  return (
    <>
<div className="texting_area_container">
    <div className="user_Data">
    <div className="online_user_Detail">
        <span id="aboutUser">
            <img src="logo.png" alt="img_logo" />
            <p id="userName"> mango</p>
        </span>
  
    </div>
    <span id="online_notification" className='text-slate-400'>online</span>
    <div className="your_data">
 <span id='icon_bar_area' className='flex justify-space-between items-center p-4 mx-4 gap-4'> 
    <div className="call icon_bar max-w-10 px-2 py-1 border-2 border-white bg-slate-300 rounded-md  ">
        <img src="https://img.icons8.com/?size=50&id=9659&format=png"  alt="phone" />
    </div>
    <div className="video_call icon_bar  max-w-10 px-2 py-1 border-2 border-white bg-slate-300 rounded-md ">
    <img src="https://www.svgrepo.com/show/473466/video-camera.svg"   alt="phone" />
    </div>
    <div className="search_for_conatact icon_bar max-w-10 px-2 py-1 border-2 border-white bg-slate-300 rounded-md  ">
    <img src="https://www.svgrepo.com/show/510181/search.svg" alt="phone"  />
    </div>
 </span>
    </div>
    </div>
    


    <div className="text_area">
        
        <div className="opponent_text text" >
            <p id='received_message'>hey</p>
            
        </div>
        <div className="your_Text text">
            <p id='send_message'>hello</p>
            
            
        </div>
        <div className="opponent_text text" >
            <p id='received_message'>hello</p>
            
        </div>
        <div className="your_Text text">
            <p id='send_message'>hii</p>
            
            
        </div>
    </div>
</div>
       <MessageInput/>

    </>
  )
}

export default MainTextingArea
