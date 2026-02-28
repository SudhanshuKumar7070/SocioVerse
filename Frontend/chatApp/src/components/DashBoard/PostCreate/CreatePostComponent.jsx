import React, { useEffect } from "react";
import axios from 'axios'
import { useState } from "react";
import { Trophy } from "lucide-react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setTweetText} from "../../../store/tweetContentSlice.js"
function CreatePostComponent({ variableClassName }) {
  const navigate= useNavigate();
  const dispatch = useDispatch();
  const profilePic = useSelector((state) => state.auth?.userData?.profilePicture);
  const  refreshToken = useSelector((state)=> state.auth?.userData);
  console.log("rerfreshToken:", refreshToken);
   const [postText, setPostText] = useState('');
  // const [postImage, setPostImage] = useState(null);
  // const [postVideo, setPostVideo] = useState(null);
  // const [postLink, setPostLink] = useState(null);

  
  const handlePostText= (e)=>{
    setPostText(e.target.value)
  }

  
  
  // method to handle post button
   const handlePostButtonClick =()=>{
   
      dispatch(setTweetText({textContent:postText}));
   
     navigate("/post_interface")
   }
  
  return (
    <div className={`flex flex-col sm:flex-row items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white rounded-2xl shadow-lg border border-slate-100/50 font-montserrat w-full ${variableClassName}`}>
      
      <div className="flex w-full items-center gap-3 flex-1">
        {/* Profile Picture */}
        <div className="shrink-0 h-10 w-10 sm:h-12 sm:w-12 rounded-full border-2 border-white overflow-hidden shadow-sm bg-gradient-to-br from-slate-800 to-slate-700">
          <img src={profilePic} alt="profile" className="h-full w-full object-cover" />
        </div>

        {/* Input Field */}
        <input
          type="text"
          className="flex-1 w-full bg-slate-50 border border-slate-200/60 text-slate-700 placeholder-slate-400 rounded-xl px-4 py-2.5 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition duration-200"
          placeholder="What's on your mind?"
          value={postText}
          onChange={handlePostText}
        />
      </div>

      {/* Create Post Button */}
      <button 
        type="button" 
        onClick={handlePostButtonClick} 
        className="w-full sm:w-auto shrink-0 font-montserrat text-sm sm:text-base px-6 py-2.5 sm:py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-semibold transition-all duration-200 shadow-sm hover:shadow"
      >
        Create Post
      </button>
    </div>
  );
}

export default CreatePostComponent;
