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
<div className="w-full h-full min-h-screen bg-sky-400/30 text-slate-700 flex flex-col relative pb-16">
    <div className="w-full px-2 py-3 bg-blue-800 text-white shadow-md flex justify-between items-center font-semibold font-sans sticky top-0 z-20">
    <div className="flex flex-col justify-center items-center">
        <span id="aboutUser" className="flex items-center gap-2">
            <img src="logo.png" alt="img_logo" className="w-8 h-8 rounded-full" />
            <p id="userName"> mango</p>
        </span>
  
    </div>
    <span id="online_notification" className='text-slate-300 font-light text-sm'>online</span>
    <div className="flex flex-col justify-center items-center">
 <span id='icon_bar_area' className='flex justify-between items-center px-2 sm:px-4 mx-2 sm:mx-4 gap-2 sm:gap-4'> 
    <div className="icon_bar max-w-10 px-2 py-1 border border-white/50 bg-slate-300/20 rounded-md cursor-pointer hover:bg-slate-300/40 transition">
        <img src="https://img.icons8.com/?size=50&id=9659&format=png" className="w-5 h-5 filter brightness-0 invert" alt="phone" />
    </div>
    <div className="icon_bar max-w-10 px-2 py-1 border border-white/50 bg-slate-300/20 rounded-md cursor-pointer hover:bg-slate-300/40 transition">
    <img src="https://www.svgrepo.com/show/473466/video-camera.svg" className="w-5 h-5 filter brightness-0 invert"  alt="video" />
    </div>
    <div className="icon_bar max-w-10 px-2 py-1 border border-white/50 bg-slate-300/20 rounded-md cursor-pointer hover:bg-slate-300/40 transition">
    <img src="https://www.svgrepo.com/show/510181/search.svg" className="w-5 h-5 filter brightness-0 invert" alt="search"  />
    </div>
 </span>
    </div>
    </div>
    


    <div className="w-full sm:w-[90%] md:w-[80%] mx-auto p-3 flex flex-col gap-2 overflow-y-auto mb-20 flex-grow">
        
        <div className="bg-slate-200 text-slate-800 self-start text-left p-3 my-1 rounded-2xl rounded-tl-sm max-w-[85%] sm:max-w-[70%]" >
            <p id='received_message'>hey</p>
            
        </div>
        <div className="bg-sky-400/80 text-slate-800 self-end text-right p-3 my-1 rounded-2xl rounded-tr-sm max-w-[85%] sm:max-w-[70%] shadow-sm">
            <p id='send_message'>hello</p>
            
            
        </div>
        <div className="bg-slate-200 text-slate-800 self-start text-left p-3 my-1 rounded-2xl rounded-tl-sm max-w-[85%] sm:max-w-[70%]" >
            <p id='received_message'>hello</p>
            
        </div>
        <div className="bg-sky-400/80 text-slate-800 self-end text-right p-3 my-1 rounded-2xl rounded-tr-sm max-w-[85%] sm:max-w-[70%] shadow-sm">
            <p id='send_message'>hii</p>
            
            
        </div>
    </div>
</div>
       <MessageInput/>

    </>
  )
}

export default MainTextingArea
