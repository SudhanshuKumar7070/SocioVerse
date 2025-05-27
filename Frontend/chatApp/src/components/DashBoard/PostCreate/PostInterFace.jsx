import React from 'react'
import PostButton from './PostInterfaceButton.jsx';
import { useNavigate } from 'react-router-dom'
import {ArrowLeft,Sparkles } from "lucide-react"
import { useSelector } from 'react-redux';


function PostInterFace() {
    const tweetText = useSelector((state)=>state.tweetTextContent?.textContent)
     console.log("textData::>",tweetText)
    const navigate = useNavigate();
  return (
    <>
    <div className='font-poppins my-3'>
       <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent flex items-center gap-3 justify-center">
  <Sparkles className="w-8 h-8 text-blue-400 animate-pulse" />
  Create Post Here
</h1>
    </div>
    <div className='sm:w-[70vw] w-[90vw] sm:h-[70vh] h-[90vh] shadow-md rounded-xl p-2 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex justify-center items-center '>
     <button 
  className='group flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-red-500/20 backdrop-blur-sm border border-white/20 hover:border-red-400/40 rounded-xl text-white hover:text-red-400 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-red-500/20' 
  onClick={() => navigate(-1)}
>
  <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
  <span className="text-sm font-medium">Back</span>
</button>
      <div className="w-full flex justify-center items-center">
        <PostButton textPost={tweetText}/>
      </div>
    
    </div>
    </>
  )
}

export default PostInterFace
