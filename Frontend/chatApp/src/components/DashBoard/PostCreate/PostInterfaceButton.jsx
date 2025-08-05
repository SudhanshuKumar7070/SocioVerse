import React, { useEffect, useState,useRef } from "react";
 import EmojiPicker from 'emoji-picker-react';
import { ToastContainer,toast } from 'react-toastify'; 
import { backIn, motion } from "framer-motion";
import Draggable from 'react-draggable'; 
import { Send, Sparkles, Heart, Image, Smile, X } from "lucide-react";
import SpinnerWithText from "../../LoadingSpinner";
import axios from "axios";
const PostButton = ({ textPost }) => {
  //  const {notify} = UseToast();
  const textareaRef = useRef(null);
  const [textValue, setTextValue] = useState(textPost);
const notify = (message)=> toast(message)
  // const [isTextValueAvail,setAvailTextVal] = useState("")
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [isPosted, setIsPosted] = useState(false);
  const [isOpenEmoji, setIsOpenImoji] = useState(false);
  const [isLoading,setIsLoading] = useState(false)
  const[wordCount,setWordCount] = useState(0)
  const[imagePreview,setImagePreview] = useState("");
  
  // const [audioValue,setAudioValue]= useState("");
  const [videoValue,setVideoValue]= useState("");
  const [imageValue,setImageValue]= useState("");
  

  // const [selectedEmoji,setEmoji]=useState("")
  const Url = import.meta.env.VITE_API_URL;
  const formData = new FormData();
const imageRefrer = useRef(null);
  const imageFormData = new FormData();
// method to upload video to backend
const uploadImage = async()=>{
  setIsLoading(true)
   if (!imageValue) {
    setIsLoading(false)
    notify("choose image before posting");
    return
   }
      // imageFormData.append("contentVideo",videoValue);
      imageFormData.append("contentImage",imageValue);
      imageFormData.append("contentType","image");
      // imageFormData.append("contentAudio",audioValue);
      try {

         const response = axios.post(`${Url}/tweet/createTweet`,imageFormData,{
          withCredentials:true
         })
         if(response){
          setIsLoading(false);
          setImageValue("");
         }
      } catch (error) { 
    setIsLoading(false)
        console.log(error,":: error occured in posting image ")
      }
    }

  // method to submit form
 

  const handleSubmit = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    
    try {
      // const finalPost = `${textValue}${isTextValueAvail}`
            if(!textValue.trim() ){
              // alert("can't create empty post")
              notify("can't create empty post");
              setIsLoading(false)
               return
              // todo: read the whole codebase and restart from here.......
            }
       
      formData.append("TextContent", textValue);
      formData.append("contentType", "text");
      
      const response = await axios.post(`${Url}/tweet/createTweet`, formData, {
        withCredentials: true,
      });
     if(response){
      notify("Tweet created Successfully")
      setTextValue("");
       setEmoji("");

       setIsLoading(false)
       setIsPosted(true);
       
       setTimeout(() => setIsPosted(false), 2000);
      
     }
      
    } catch (err) {
      setIsLoading(false)
      console.log(err);
    }
  };
   // use effect  to handle adding  emoji with text
      // useEffect(()=>{
      //    setAvailTextVal(selectedEmoji ? selectedEmoji :"")
      // },[selectedEmoji])



    //  handling emoji select

    const handleEmojiSelect = (emojiData) => {
      const textareaVal = textareaRef.current
      const  cursorPos = textareaVal.selectionStart;
      const prevCursor = textareaVal.value.substring(0,cursorPos);
      const aftCursor = textareaVal.value.substring(cursorPos)
      console.log("prev Cursor =", prevCursor , "and after cursor = ", aftCursor)
 console.log(  cursorPos )
      const newTextValue = prevCursor + emojiData.emoji + aftCursor
      setTextValue(newTextValue)
    // setEmoji(emojiData.emoji);

   setIsOpenImoji(false); // Close picker after selection
    // Proper cursor positioning
  setTimeout(() => {
    const newCursorPos = cursorPos + emojiData.emoji.length;
    textareaVal.setSelectionRange(newCursorPos, newCursorPos);
    textareaVal.focus();
  }, 0);
  };
  //  handle image or video post
    



  return (
    <>
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto relative">
      <ToastContainer position="top-center" autoClose={2000} 

/>
      {/* Main Container */}
      <div className="relative bg-gradient-to-br from-blue-900/20 via-indigo-900/30 to-slate-900/20 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-blue-400/30 w-full">
        {/* Floating Elements */}
        <div className="absolute -top-4 -right-4 w-8 h-8 bg-blue-400/40 rounded-full blur-sm animate-pulse"></div>
        <div className="absolute -bottom-3 -left-3 w-6 h-6 bg-indigo-400/50 rounded-full blur-sm animate-pulse delay-1000"></div>

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-blue-100 mb-2 flex items-center justify-center gap-2">
            <Sparkles className="w-6 h-6 font-poppins text-blue-300" />
            Share Your Moment
          </h2>
          <p className="text-blue-200/90 font-montserrat">
            What's on your mind today?
          </p>
        </div>
    
        {/* Post Text Area */}
        <Draggable className="mb-6">
          <textarea
            placeholder="Write something amazing..."
            className="w-full font-montserrat h-32 bg-blue-900/20 border border-blue-400/30 rounded-2xl p-4 text-blue-100 placeholder-blue-200/70 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400/60 focus:border-blue-400/50 transition-all duration-300"
            value={textValue}
            ref={textareaRef}
            onChange={(e) => {
              const newVal =e.target.value;
              const newCount = newVal.length;
             
               if (newCount > 280) {
                notify("word count overlimit")
                return
               }
               setTextValue(newVal);
              setWordCount(newCount)
            }}
          />
        </Draggable>

        {/* Action Icons */}
        <div className="flex justify-between items-center mb-6 px-2 ">
          <div className="flex gap-4">
            <label htmlFor="uploadImage" className="p-2 rounded-xl bg-blue-800/30 hover:bg-blue-600/40 transition-colors duration-200 group">
              <Image className="w-5 h-5 text-blue-200 group-hover:text-blue-200 " />
              
            </label>
            <input id="uploadImage" ref={imageRefrer} accept="image" className="p-2 rounded-xl bg-blue-800/30 hover:bg-blue-600/40 transition-colors duration-200 group" type="file"  hidden onChange={(e)=>{
             setImageValue(e.target.files[0])
             console.log(imageRefrer.current.files[0])
             
            
         
             
            }} />
              
            
            <button className="p-2 rounded-xl bg-blue-800/30 hover:bg-blue-600/40 transition-colors duration-200 group" type="button">
              <Smile
                className="w-5 h-5 text-blue-200 group-hover:text-blue-100"
                onClick={() => {
                  setIsOpenImoji((prevState) => !prevState);
                }}
              />
            </button>
          </div>

          {isOpenEmoji && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: .3, delay: 0 }}
              className="absolute top-70 left-50 right-50 "
            >
              {" "}
              <button
                onClick={() => {
                  setIsOpenImoji((prevState) => !prevState);
                }}
              >
                <X className="text-white hover:text-red-500 hover:transition-all duration-300 ease-linear" />
              </button>
              <EmojiPicker className="border border-red-500 bg-white " onEmojiClick={handleEmojiSelect} >
                <EmojiPicker.Header>
                  <EmojiPicker.Input placeholder="Search emoji" />
                </EmojiPicker.Header>
                <EmojiPicker.Group>
                  <EmojiPicker.List />
                </EmojiPicker.Group>
              </EmojiPicker>
            </motion.div>
          )}
          <div className="text-blue-300/80 text-sm font-poppins">{`${wordCount}/280`}</div>
        </div>
        
        {/* Main Post Button */}
        {isLoading &&  <span className="absolute top-1/2 left-1/2 "><SpinnerWithText /></span> }
        { !imageValue && <button
          type="submit"
         
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onMouseDown={() => setIsPressed(true)}
          onMouseUp={() => setIsPressed(false)}
          className={`
            relative w-full py-4 px-8 rounded-2xl font-semibold text-lg
            transition-all duration-300 transform z-10
            ${isPressed ? "scale-95" : isHovered ? "scale-105" : "scale-100"}
            ${
              isPosted
                ? "bg-green-500 shadow-green-500/50"
                : "bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 hover:from-blue-400 hover:via-blue-500 hover:to-indigo-500 shadow-blue-500/50"
            }
            shadow-2xl border border-blue-400/40
            overflow-hidden group
          `}
        >
          {/* Button Background Effect */}
          <div className="absolute inset-0 bg-blue-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          {/* Shimmer Effect */}
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-blue-200/30 to-transparent skew-x-12"></div>

          {/* Button Content */}
          <div className="relative flex items-center justify-center gap-3 text-blue-50">
            {isPosted ? (
              <>
                <Heart className="w-6 h-6 fill-current animate-bounce" />
                <span>Posted!</span>
              </>
            ) : (
              <>
                <Send
                  className={`w-6 h-6 transition-transform duration-300 ${
                    isHovered ? "translate-x-1" : ""
                  }`}
                />
                <span className="font-poppins">Share Post</span>
                <Sparkles
                  className={`w-5 h-5 transition-transform duration-300 ${
                    isHovered ? "rotate-180" : ""
                  }`}
                />
               
              </>
            )}
          </div>
        </button>}
      
        {/* Success Animation */}
        {isPosted && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-green-500/20 rounded-full p-8 animate-ping">
              <Heart className="w-8 h-8 text-green-400 fill-current" />
            </div>
          </div>
        )}
      </div>
       <div className="absolute top-0 right-0 ">
                  {imageRefrer.current &&  <p className="text-blue-50 font-montserrat   rounded-xl border border-white flex flex-col p-2 bg-slate-500 bg-opacity-20 ">
                   {imageRefrer.current.files[0]?.name}</p>}
                </div>
    </form>
     { imageValue && <button
          onClick={uploadImage}
         
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onMouseDown={() => setIsPressed(true)}
          onMouseUp={() => setIsPressed(false)}
          className={`
            relative w-full py-4 px-8 rounded-2xl font-semibold text-lg
            transition-all duration-300 transform z-10
            ${isPressed ? "scale-95" : isHovered ? "scale-105" : "scale-100"}
            ${
              isPosted
                ? "bg-green-500 shadow-green-500/50"
                : "bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 hover:from-blue-400 hover:via-blue-500 hover:to-indigo-500 shadow-blue-500/50"
            }
            shadow-2xl border border-blue-400/40
            overflow-hidden group
          `}
        >
          {/* Button Background Effect */}
          <div className="absolute inset-0 bg-blue-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          {/* Shimmer Effect */}
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-blue-200/30 to-transparent skew-x-12"></div>

          {/* Button Content */}
          <div className="relative flex items-center justify-center gap-3 text-blue-50">
            {isPosted ? (
              <>
                <Heart className="w-6 h-6 fill-current animate-bounce" />
                <span>Posted!</span>
              </>
            ) : (
              <>
                <Send
                  className={`w-6 h-6 transition-transform duration-300 ${
                    isHovered ? "translate-x-1" : ""
                  }`}
                />
                <span className="font-poppins"> Post Image</span>
                <Sparkles
                  className={`w-5 h-5 transition-transform duration-300 ${
                    isHovered ? "rotate-180" : ""
                  }`}
                />
               
              </>
            )}
          </div>
        </button>
}
</>
  );
};

export default PostButton;
