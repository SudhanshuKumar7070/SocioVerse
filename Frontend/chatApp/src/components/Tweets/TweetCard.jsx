import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Loader, Reply, ThumbsUp, X } from "lucide-react"
 import { ToastContainer, toast } from 'react-toastify';
import TweetComment from "./TweetComment";
import { Copy, Send, Share2 } from "lucide-react";
function TweetCard({
  profilePicSrc = "https://picsum.photos/seed/1/200/200",
  currentUserId="",
  username = "username",
  handle = "userhandle",
  content = "This is a sample tweet content.",
  timestamp = "2h ago",
  likes = 0,
  currentTweetId = "",
  retweets = 0,
  comments = 0,
  commentLikes=0,
  imageContent="",
  className="",
  ...props

  
}) {
  const [isLiked, setIsLiked] = useState(false);
  const [isRetweeted, setIsRetweeted] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);
  const [retweetCount, setRetweetCount] = useState(retweets);
  const [openCommentModel, setOpenCommentModel] = useState(false);
  const [userComment, setUserComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [TweetComments, setTweetComments] = useState([]);
  const[newCommentAdded,setNewCommentAdded] = useState(false);
  const [aeroApperance, setAeroApperance] = useState(false);
  const [isCommentLiked,setCommentLike]= useState(false)
  const [commentLikesCount,setCommentLikesCount] = useState(commentLikes)
  const navigate = useNavigate();
  const Url = import.meta.env.VITE_API_URL;
  const [tweetPostLoading, setTweetPostLoading] = useState(false);
  const[isOpenShareModel,setIsOpenShareModel]=useState(false);

  // handle share content 
const handleClickInsideDiv=(e)=>{
  e.stopPropagation();
}
  // const handleShareContent = (tweetId)=>{
  //   const uri =`${window.location.origin}/tweet/${tweetId}`;
  //    const searchMethod =window.open(`https://wa.me/?text=${encodeURIComponent(uri)}`, "_blank");

  // }
  const handleSendViaWhatsapp = (tweetId)=>{
 const uri =`${window.location.origin}/tweet/${tweetId}`;
     const searchMethod =window.open(`https://wa.me/?text=${encodeURIComponent(uri)}`, "_blank");
  }
  const handleSendViaCopyLink =(tweetId)=>{
    console.log("clicked")
     const uri =`${window.location.origin}/tweet/${tweetId}`;
    navigator.clipboard.writeText(uri);
  alert("Link copied to clipboard!");


  }

  const handleSendViaOthers =()=>{
    alert("no others added yet");
  }
  const handleAeroApperance = () => {
    if (userComment.length === 0) {
      setAeroApperance(false);
    } else {
      setAeroApperance(true);
    }
  };

  // useeffetct to load the tweets
  useEffect(()=>{
    if(openCommentModel && newCommentAdded){
      getAllCommentsOfTheTweet();
    }
    else{
      return;
    }
  },[openCommentModel,newCommentAdded])

  const handleAddComment = async () => { //==============================================
  setTweetPostLoading(true);
    try {
      const response = await axios.post(
        `${Url}/comment/createComment/${currentTweetId}`,
        { content: userComment },
        {
          withCredentials: true,
        }
      );
       if (!response){ 
        setTweetPostLoading(false);
        console.log("error in commenting for that comment");
      }
        setTweetPostLoading(false);
        setUserComment("");
        toast.done("comment added successfully..")
        newCommentAdded(true);
      console.log("commentAdded Data :", response.data);
      
    
     
    } catch (err) {
      setTweetPostLoading(false);
      console.log("error in add comment,err", err);
    }
    finally{
      setTweetPostLoading(false);
    }
  };

  const getAllCommentsOfTheTweet = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${Url}/comment/getAllCommentsOfTweet/${currentTweetId}`,
        {
          withCredentials: true,
        }
      );
      if (response) {
        console.log("response of fetching TWeet:", response.data);
        setLoading(false);
        setTweetComments(response.data.response);
      }

      if (!response) console.log("error in feching comment");
    } catch (err) {
      setLoading(false);
      console.log("error in fetching all commments of that tweet");
    }
  };

  const handleOpenChat = () => {
    if (openCommentModel === true) {
      setOpenCommentModel(false);
    } else {
      setOpenCommentModel(true);
    }
  };

  const handleLike = (e) => {
  e.stopPropagation()
    if (isLiked) {
      setLikeCount((prev) => prev - 1);
    } else {
      setLikeCount((prev) => prev + 1);
    }
    setIsLiked(!isLiked);
  };
  
  const handleRetweet = (e) => {
     e.stopPropagation()
    if (isRetweeted) {
      setRetweetCount((prev) => prev - 1);
    } else {
      setRetweetCount((prev) => prev + 1);
    }
    setIsRetweeted(!isRetweeted);
  };

  // side effect for aeroApperance
  useEffect(() => {
    handleAeroApperance();
  }, [userComment.length]);

  return (
    <motion.div className={`min-w-auto h-auto bg-gradient-to-br from-slate-800/90 to-slate-900/95 backdrop-blur-sm border border-slate-600/50 hover:border-slate-500/70 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 mb-6 p-6 relative group ${className}` }{...props}>
      <ToastContainer/>
      {/* Subtle hover glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="flex items-start gap-4 relative z-10">
        {/* Enhanced Profile Picture */}
        <div className="flex-shrink-0 hover:cursor-pointer transition-transform hover:scale-105" onClick={() => {
          navigate(`/userAdmin/${currentUserId}`)
        }}>
          <div className="relative">
            <img
              src={profilePicSrc}
              alt={`${username}'s profile`}
              className="w-12 h-12 rounded-full object-cover border-2 border-cyan-400/60 hover:border-cyan-400 transition-colors duration-300"
            />
            {/* Online status indicator */}
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-slate-800"></div>
          </div>
        </div>

        {/* Tweet Content */}
        <div className="flex-1">
          {/* Enhanced User Info */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-white hover:text-cyan-400 transition-colors cursor-pointer font-poppins">{username}</h3>
              <span className="text-slate-400 text-sm font-serif">@{handle}</span>
              <span className="text-slate-500 text-xs">•</span>
              <span className="text-slate-500 text-xs font-montserrat">{timestamp}</span>
            </div>
            
            {/* More options button */}
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button className="p-2 rounded-full hover:bg-slate-700/50 text-slate-400 hover:text-white transition-all">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Enhanced Tweet Content */}
          <div className="mb-4">
            {imageContent && (
              <div className="rounded-xl overflow-hidden mb-3 hover:opacity-95 transition-opacity cursor-pointer">
                <img className="rounded-xl w-full max-h-80 object-cover hover:scale-105 transition-transform duration-300" src={imageContent} />
              </div>
            )}
            <p className="text-slate-100 font-medium leading-relaxed font-poppins mt-10">{content}</p>
          </div>

          {/* Enhanced Tweet Actions */}
          <div className="flex justify-between items-center max-w-md relative">
            <button
              className={`group flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-200 ${
                openCommentModel
                  ? 'text-cyan-400 bg-cyan-400/10'
                  : 'text-slate-400 hover:text-cyan-400 hover:bg-cyan-400/10'
              }`}
              onClick={async (e) => {
                handleClickInsideDiv(e);
                handleOpenChat();
                await getAllCommentsOfTheTweet();
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 group-hover:rotate-12 transition-transform duration-200 "
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <span className="text-sm font-medium">{comments}</span>
            </button>

            <button
              className={`group flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-200 ${
                isRetweeted
                  ? "text-emerald-400 bg-emerald-400/10"
                  : "text-slate-400 hover:text-emerald-400 hover:bg-emerald-400/10"
              }`}
              onClick={handleRetweet}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 group-hover:rotate-180 transition-transform duration-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                />
              </svg>
              <span className="text-sm font-medium">{retweetCount}</span>
            </button>

            <button
              className={`group flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-200 ${
                isLiked ? "text-rose-400 bg-rose-400/10" : "text-slate-400 hover:text-rose-400 hover:bg-rose-400/10"
              }`}
              onClick={handleLike}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-5 w-5 group-hover:scale-110 transition-transform duration-200 ${isLiked ? 'fill-current' : ''}`}
                fill={isLiked ? "currentColor" : "none"}
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              <span className="text-sm font-medium">{likeCount}</span>
            </button>

            <button className="group flex items-center gap-2 px-3 py-2 rounded-full text-slate-400 hover:text-blue-400 hover:bg-blue-400/10 transition-all duration-200"
            onClick={(e)=>{
               e.stopPropagation()
              // handleShareContent(currentTweetId)
              setIsOpenShareModel(!isOpenShareModel);
            }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 group-hover:-translate-y-1 transition-transform duration-200 "
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                />
              </svg>
            </button>
           


    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 }}
      id="shareModel"
      className={`${
        isOpenShareModel
          ? "absolute -top-10 left-0 mt-4 min-h-4 w-full font-montserrat rounded-xl bg-slate-900/95 backdrop-blur-sm border border-slate-600/50 shadow-2xl px-4 py-4 flex flex-col text-white overflow-hidden z-50"
          : "hidden"
      }`}
    >
      <button className="flex items-center gap-2 hover:bg-slate-800 px-3 py-2 rounded-md transition"
       onClick={(e)=>{
         handleClickInsideDiv(e);
         handleSendViaCopyLink(currentTweetId);
         setIsOpenShareModel(!isOpenShareModel)
       }}>
        <Copy size={18} />
        Copy Link
      </button>
      <button className="flex items-center gap-2 hover:bg-slate-800 px-3 py-2 rounded-md transition"
      onClick={(e)=>{
         handleClickInsideDiv(e);
         handleSendViaWhatsapp(currentTweetId);
         setIsOpenShareModel(!isOpenShareModel)
       }}
      >
        <Send size={18} />
        Send via WhatsApp
      </button>
      <button className="flex items-center gap-2 hover:bg-slate-800 px-3 py-2 rounded-md transition"
      onClick={(e)=>{
         handleClickInsideDiv(e);
         handleSendViaOthers();
         setIsOpenShareModel(!isOpenShareModel)
       }}
      >
        <Share2 size={18} />
        Others
      </button>
    </motion.div>
  

          </div>
        </div>
      </div>

      {/* Enhanced Comment Modal */}
      <motion.div
      onClick={(e)=>{e.stopPropagation()}}
        initial={openCommentModel ? { opacity: 0, scale: 0.95, y: -10 } : { opacity: 0 }}
        animate={openCommentModel ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className={
          openCommentModel
            ? `mt-4 h-[45vh] w-full font-montserrat rounded-xl bg-slate-900/95 backdrop-blur-sm border border-slate-600/50 shadow-2xl px-4 py-4 flex flex-col text-white overflow-hidden z-20`
            : `hidden`
        }
      >
        {/* Enhanced Comment Input */}
        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-600/30">
          <div className="w-8 h-8 rounded-full overflow-hidden">
            <img src={profilePicSrc} alt="Your avatar" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 relative">
            <input
              type="text"
              className="w-full px-4 py-3 bg-slate-800/60 border border-slate-600/50 rounded-full text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 focus:bg-slate-800/80 transition-all duration-200"
              placeholder="Tweet your reply..."
              value={userComment}
              onChange={(e) => setUserComment(e.target.value)}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              {aeroApperance && (
                <ArrowRight
                  onClick={handleAddComment}
                  className="text-cyan-400 hover:text-cyan-300 cursor-pointer transition-colors p-1 bg-cyan-400/20 rounded-full"
                  size={20}
                />
              )}
            </div>
          </div>
          <X
            className="text-slate-400 hover:text-white cursor-pointer transition-colors p-1 hover:bg-slate-700/50 rounded-full"
            onClick={() => {
              setOpenCommentModel(false);
              setUserComment("");
            }}
            size={20}
          />
        </div>

        {/* Enhanced Comments List */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-track-slate-800/50 scrollbar-thumb-slate-600/50 scrollbar-thumb-rounded-full">
          {loading || tweetPostLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="flex flex-col items-center gap-3">
                <Loader className="animate-spin text-cyan-400" size={24} />
                <p className="text-slate-400 text-sm">Loading comments...</p>
              </div>
            </div>
          ) : TweetComments && TweetComments.length ? (
            <div className="space-y-3">
              {TweetComments.map((comment, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <TweetComment commentContent={comment.content} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <svg className="w-16 h-16 text-slate-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p className="text-slate-400 font-medium mb-1">No comments yet</p>
              <p className="text-slate-500 text-sm">Be the first to share your thoughts!</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default TweetCard;