import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Loader, Reply, ThumbsUp, X } from "lucide-react";
import TweetComment from "./TweetComment";
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
  commentLikes=0
}) {
  const [isLiked, setIsLiked] = useState(false);
  const [isRetweeted, setIsRetweeted] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);
  const [retweetCount, setRetweetCount] = useState(retweets);
  const [openCommentModel, setOpenCommentModel] = useState(false);
  const [userComment, setUserComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [TweetComments, setTweetComments] = useState([]);
  const [aeroApperance, setAeroApperance] = useState(false);
  const [isCommentLiked,setCommentLike]= useState(false)
   const [commentLikesCount,setCommentLikesCount] = useState(commentLikes)
   const navigate = useNavigate();
  const Url = import.meta.env.VITE_API_URL;
  const handleAeroApperance = () => {
    if (userComment.length === 0) {
      setAeroApperance(false);
    } else {
      setAeroApperance(true);
    }
  };
  const handleAddComment = async () => {
    try {
      const response = await axios.post(
        `${Url}/comment/createComment/${currentTweetId}`,
        { content: userComment },
        {
          withCredentials: true,
        }
      );
      console.log("commentAdded Data :", response.data);
      setUserComment("");
      if (!response) console.log("error in commenting for that comment");
    } catch (err) {
      console.log("error in add comment");
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
  const handleLike = () => {
    if (isLiked) {
      setLikeCount((prev) => prev - 1);
    } else {
      setLikeCount((prev) => prev + 1);
    }
    setIsLiked(!isLiked);
  };
  

  const handleRetweet = () => {
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
    <motion.div className="min:w-auto h-auto  bg-slate-800/75 border border-slate-700 rounded-2xl shadow-md mb-4 p-4 relative ">
      <div className="flex items-start gap-3">
        {/* Profile Picture */}

        <div className="flex-shrink-0 hover:cursor-pointer "  onClick={()=>{
          navigate(`/userAdmin/${currentUserId}`)
        }}>
          <img
            src={profilePicSrc}
            alt={`${username}'s profile`}
            className="w-12 h-12 rounded-full object-cover border-2 border-sky-400"
          />
        </div>

        {/* Tweet Content */}
        <div className="flex-1 ">
          {/* User Info */}
          <div className=" flex items-center gap-2 mb-1">
            <h3 className="font-bold text-sky-200">{username}</h3>
            <span className="text-slate-400 text-sm">@{handle}</span>
            <span className="text-slate-400 text-xs ml-auto  text-center">
              {timestamp}
            </span>
          </div>

          {/* Tweet Text */}
          <p className="text-slate-200 font-montserrat mb-3">{content}</p>

          {/* Tweet Actions */}
          <div className="flex justify-between mt-3">
            <button
              className={
                openCommentModel
                  ? `flex items-center gap-1 text-slate-40 text-sky-300 transition-all `
                  : `flex items-center gap-1 text-slate-400 hover:text-sky-300 transition-all `
              }
              onClick={async () => {
                handleOpenChat();
                await getAllCommentsOfTheTweet();
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
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
            </button>

            <button
              className={`flex items-center gap-1 ${
                isRetweeted
                  ? "text-emerald-400"
                  : "text-slate-400 hover:text-emerald-400"
              } transition-colors`}
              onClick={handleRetweet}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
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
              <span>{retweetCount}</span>
            </button>

            <button
              className={`flex items-center gap-1 ${
                isLiked ? "text-rose-400" : "text-slate-400 hover:text-rose-400"
              } transition-colors`}
              onClick={handleLike}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
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
              <span>{likeCount}</span>
            </button>

            <button className="flex items-center gap-1 text-slate-400 hover:text-cyan-400 transition-colors ">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
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
          </div>
        </div>
      </div>
      <motion.div
        initial={openCommentModel ? { opacity: 0, scale: 0.8 } : { opacity: 0 }}
        animate={openCommentModel ? { opacity: 1, scale: 1 } : { opacity: 0 }}
        transition={{ duration: 0.3, ease: "linear" }}
        className={
          openCommentModel
            ? ` h-[45vh] absolute scrollbar-custom overflow-x-hidden overflow-y-scroll scrollbar-custom  w-full font-montserrat rounded-lg bg-slate-900 bg-opacity-95 shadow-lg px-3 py-2 flex flex-col text-white  left-0 right-0  grid-cols-12 z-10 `
            : `hidden`
        }
      >
        {comments}
        <div
          className=" col-span-2 flex items-center justify-between mt-1 gap-1"
          id="comment_fiels  " 
        >
          <input
            type="text"
            className="w-full px-2 py-1 bg-inherit active:border-b hover:border-b-white border-b border-b-slate-500 shadow-sm outline-none font-poppins text-sky-200"
            placeholder="comments..."
            name="comment_fied"
            id="comment"
            value={userComment}
            onChange={(e) => {
              // handleAeroApperance();
              setUserComment(e.target.value);
            }}
          />
          <ArrowRight
            onClick={handleAddComment}
            className={
              aeroApperance
                ? `text-slate-500 hover:text-white hover:transition-all`
                : "hidden"
            }
          />
          <X
            className="relative top-0 right-0 m-2  text-slate-600 hover:text-white hover:transition-all "
            onClick={() => {
              setOpenCommentModel(false);
              setUserComment("");
            }}
          />
        </div>

        <div className="col-span-10 " id="comment">
          {loading ? (
            <Loader />
          ) : TweetComments && TweetComments.length ? (
            TweetComments.map((comment, index) => (
              <TweetComment key={index } commentContent={comment.content} />
            ))
          ) : (
            <p className="text-gray-400 text-center my-4">
              No comments available
            </p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default TweetCard;
