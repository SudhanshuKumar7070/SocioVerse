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
  const [postImage, setPostImage] = useState(null);
  const [postVideo, setPostVideo] = useState(null);
  const [postLink, setPostLink] = useState(null);
  const Url  =  import.meta.env.VITE_API_URL;
  const  formData=  new FormData();
  const handlePostText= (e)=>{
    setPostText(e.target.value)
  }

  //  post will be submitted after a navigating to post interface it should not be auto submitted and from here it will be posted soon ,,aisa nahi ki jo man me aaya wo post kar diya
  const  handleSubmit = async (e) => {
     e.preventDefault();
   try{
     formData.append("TextContent",postText)

  const response= await axios.post(`${Url}/tweet/createTweet`,formData,{withCredentials:true})
     if (response) alert("tweet created success fully")
   }
   catch(err){
     console.log(err);
   }
   
  }
  // method to handle post button
   const handlePostButtonClick =()=>{
   
      dispatch(setTweetText({textContent:postText}));
   
     navigate("/post_interface")
   }
  
  return (
    <form onSubmit={handleSubmit} className={`grid grid-cols-12 gap-4 p-4 bg-white rounded-2xl shadow-2xl font-montserrat   ${variableClassName}`}>
      
      {/* Profile Picture */}
      <div className="col-span-2 h-[3.5rem] w-[3.5rem] rounded-full border-2 border-white overflow-hidden shadow-md bg-gradient-to-br from-slate-800 to-slate-700">
        <img
          src={profilePic}
          alt="profile"
          className="h-full w-full object-cover"
        />
      </div>

      {/* Input Field */}
      <input
        type="text"
        className="col-span-8 h-full w-full bg-slate-100 text-slate-700 placeholder-slate-500 rounded-xl px-4 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-sky-400 transition duration-200 "
        placeholder="What's on your mind?"
        value={postText}
        onChange={handlePostText}
      />

      {/* Create Post Button */}
      <button type="button" onClick={handlePostButtonClick} className="col-span-2 h-12 px-4 flex items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-sky-600 text-white font-semibold shadow-md transition-all duration-300 ease-in-out hover:scale-[1.05] hover:shadow-lg hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-sky-300">
        Create Post
      </button>
    </form>
  );
}

export default CreatePostComponent;
