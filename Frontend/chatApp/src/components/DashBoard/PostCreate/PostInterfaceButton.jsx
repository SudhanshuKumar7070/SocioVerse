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
    <form onSubmit={handleSubmit} className="w-full mx-auto relative group">
      <ToastContainer position="top-center" autoClose={2000} />
      {/* Main Container */}
      <div className="relative bg-slate-800/60 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-700/50 w-full transition-all duration-300 hover:border-slate-600/50 hover:shadow-cyan-500/10 hover:shadow-2xl">
        {/* Floating Elements */}
        <div className="absolute -top-4 -right-4 w-8 h-8 bg-cyan-400/20 rounded-full blur-sm animate-pulse"></div>
        <div className="absolute -bottom-3 -left-3 w-6 h-6 bg-purple-400/20 rounded-full blur-sm animate-pulse delay-1000"></div>

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-100 mb-2 flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 font-poppins text-cyan-400" />
            Share Your Moment
          </h2>
          <p className="text-slate-400 font-montserrat text-sm sm:text-base">
            What's on your mind today?
          </p>
        </div>
    
        {/* Post Text Area */}
        <div className="mb-6 relative">
          <textarea
            placeholder="Write something amazing..."
            className="w-full font-montserrat h-32 sm:h-40 bg-slate-900/50 border border-slate-700/50 rounded-2xl p-4 sm:p-5 text-slate-100 placeholder-slate-500 resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all duration-300 scrollbar-hide"
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
        </div>

        {/* Action Icons */}
        <div className="flex justify-between items-center mb-6 px-1 sm:px-2">
          <div className="flex gap-3 sm:gap-4 relative">
            <label htmlFor="uploadImage" className="p-2 sm:p-2.5 rounded-xl bg-slate-700/30 hover:bg-slate-700/60 border border-slate-600/30 transition-all duration-300 cursor-pointer group hover:scale-105 hover:shadow-lg focus:outline-none">
              <Image className="w-5 h-5 text-cyan-400 group-hover:text-cyan-300" />
            </label>
            <input 
              id="uploadImage" 
              ref={imageRefrer} 
              accept="image" 
              className="hidden" 
              type="file" 
              onChange={(e) => {
                setImageValue(e.target.files[0])
              }} 
            />
            
            <button className="p-2 sm:p-2.5 rounded-xl bg-slate-700/30 hover:bg-slate-700/60 border border-slate-600/30 transition-all duration-300 group hover:scale-105 hover:shadow-lg focus:outline-none" type="button">
              <Smile
                className="w-5 h-5 text-purple-400 group-hover:text-purple-300"
                onClick={() => {
                  setIsOpenImoji((prevState) => !prevState);
                }}
              />
            </button>
            
            {/* Emoji Picker Modal */}
            {isOpenEmoji && (
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="absolute top-14 left-0 sm:left-14 z-50 shadow-2xl rounded-xl border border-slate-700"
              >
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsOpenImoji(false)}
                    className="absolute -top-3 -right-3 p-1 flex items-center justify-center bg-slate-800 border border-slate-600 rounded-full text-slate-300 hover:text-white hover:bg-rose-500 hover:border-rose-500 transition-all duration-200 z-10 shadow-lg"
                  >
                    <X size={12} strokeWidth={3} />
                  </button>
                  <EmojiPicker 
                    theme="dark"
                    onEmojiClick={handleEmojiSelect} 
                    previewConfig={{ showPreview: false }} 
                    searchDisabled={false}
                    lazyLoadEmojis={true}
                    style={{
                      backgroundColor: '#1e293b', // slate-800
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: 'none',
                      '--epr-search-input-bg-color': '#0f172a', // slate-900
                      '--epr-category-label-bg-color': '#1e293b', 
                      '--epr-search-border-color': '#334155', // slate-700
                      height: '350px',
                      width: '300px'
                    }}
                  />
                </div>
              </motion.div>
            )}
          </div>
          
          <div className="text-slate-500 font-medium text-xs sm:text-sm font-poppins bg-slate-900/50 px-3 py-1.5 rounded-full border border-slate-700/50">
            {`${wordCount}/280`}
          </div>
        </div>
        
        {/* Upload Preview Chip */}
        {imageValue && (
          <div className="mb-4 flex items-center justify-between p-3 bg-slate-700/30 border border-slate-600/50 rounded-xl animate-in fade-in zoom-in duration-300">
            <div className="flex items-center gap-3 overflow-hidden">
               <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center shrink-0 border border-slate-600">
                 <Image className="w-5 h-5 text-cyan-400" />
               </div>
               <p className="text-slate-300 font-poppins text-sm truncate max-w-[150px] sm:max-w-[250px]">
                 {imageRefrer.current?.files[0]?.name || "Image appended"}
               </p>
            </div>
            <button 
              type="button" 
              onClick={() => {
                setImageValue("");
                if(imageRefrer.current) imageRefrer.current.value = "";
              }}
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 rounded-lg transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        )}
        
        {/* Unified Submit Button */}
        <div className="relative w-full">
          {isLoading && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm rounded-2xl">
              <SpinnerWithText text="Publishing..." />
            </div>
          )}
          
          <button
            type="button"
            onClick={imageValue ? uploadImage : handleSubmit}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onMouseDown={() => setIsPressed(true)}
            onMouseUp={() => setIsPressed(false)}
            disabled={isLoading || (!textValue.trim() && !imageValue)}
            className={`
              relative w-full py-3.5 sm:py-4 px-6 sm:px-8 rounded-2xl font-semibold text-base sm:text-lg
              transition-all duration-300 transform z-10 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:ring-offset-2 focus:ring-offset-slate-900
              ${isPressed ? "scale-95" : isHovered ? "scale-[1.02]" : "scale-100"}
              ${(!textValue.trim() && !imageValue) ? "opacity-50 cursor-not-allowed bg-slate-700 shadow-none border-slate-600" :
                isPosted
                  ? "bg-emerald-500 shadow-emerald-500/30 border-emerald-400"
                  : "bg-gradient-to-r from-cyan-500 hover:from-cyan-400 to-blue-600 hover:to-blue-500 shadow-cyan-500/25 border-cyan-400/50"
              }
              shadow-xl border overflow-hidden group
            `}
          >
          {/* Button Background Effect */}
          <div className={`absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${(!textValue.trim() && !imageValue) ? "hidden" : ""}`}></div>

          {/* Shimmer Effect */}
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-blue-200/30 to-transparent skew-x-12"></div>

          {/* Button Content */}
          <div className="relative flex items-center justify-center gap-2 sm:gap-3 text-white">
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
                <span className="font-poppins">{imageValue ? "Share Image Post" : "Share Update"}</span>
                <Sparkles
                  className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-500 ${
                    isHovered ? "rotate-180 scale-125 text-yellow-300" : ""
                  }`}
                />
              </>
            )}
          </div>
        </button>
        </div>
      
        {/* Success Animation */}
        {isPosted && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
            <div className="bg-emerald-500/20 backdrop-blur-sm rounded-full p-8 animate-ping">
              <Heart className="w-10 h-10 sm:w-16 sm:h-16 text-emerald-400 fill-current drop-shadow-lg scale-150" />
            </div>
          </div>
        )}
      </div>
    </form>
    </>
  );
};

export default PostButton;
