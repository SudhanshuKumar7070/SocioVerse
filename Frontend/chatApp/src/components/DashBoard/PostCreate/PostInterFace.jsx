import React from 'react'
import PostButton from './PostInterfaceButton.jsx';
import { useNavigate } from 'react-router-dom'
import {ArrowLeft,Sparkles } from "lucide-react"
import { useSelector } from 'react-redux';


function PostInterFace() {
  // method for creating post here
  
    const tweetText = useSelector((state)=>state.tweetTextContent?.textContent)
     console.log("textData::>",tweetText)
    const navigate = useNavigate();
  
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-x-hidden flex flex-col pt-8 pb-20 px-4 sm:px-8">
      
      {/* Header Container */}
      <div className='w-full max-w-3xl mx-auto flex items-center justify-between mb-8'>
        <button 
          className='group flex items-center gap-2 px-4 py-2 bg-slate-800/50 hover:bg-slate-700/80 border border-slate-700/50 backdrop-blur-sm rounded-xl text-slate-300 hover:text-white transition-all duration-300 hover:scale-105 hover:shadow-lg font-poppins shadow-slate-900/50' 
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
          <span className="text-sm sm:text-base font-medium font-poppins">Back</span>
        </button>
        
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-cyan-400 font-montserrat flex items-center gap-2 sm:gap-3 drop-shadow-md">
          <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-400 animate-pulse" />
          Create Post
        </h1>
        
        {/* Invisible spacer to perfectly center the heading between the back button */}
        <div className="hidden sm:block w-[88px]"></div> 
      </div>

      {/* Main Form Area */}
      <div className='w-full max-w-2xl mx-auto flex-1 flex flex-col justify-start items-center'>
        <PostButton textPost={tweetText} />
      </div>
    </div>
  )
  
}

export default PostInterFace
