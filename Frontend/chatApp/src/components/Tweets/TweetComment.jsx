import React, { useEffect } from 'react'
import {motion} from 'framer-motion'
import { ThumbsUp } from 'lucide-react'
import { useState } from 'react'
function TweetComment({
    likesCount=0,
    commentContent=''
}) {
    const [commentLikeCount,setCommentLikesCount]=useState(likesCount)
    const[isCommentLiked,setCommentLike]=useState(false)
    const [openReplyModel,setOpenReplyModel] = useState(false)
    const [isReplyDisabled,setReplyDisabled] =useState(false)
    const [reply,setReply] = useState('')
    const handleLikeComement = () => {
        if (isCommentLiked) {
         setCommentLikesCount((prev) => prev - 1);
        } else {
         setCommentLikesCount((prev) => prev + 1);
        }
        setCommentLike(!isCommentLiked)
      };
       const handleOpenReplyPanel = ()=>{
           if(!openReplyModel){
            setOpenReplyModel(true)
           }
       }
       useEffect(()=>{
           if(reply.length===0){
            setReplyDisabled(true)
           }else{
            setReplyDisabled(false)
           }
  
           
       },[reply.length])
    //   useEffect to handle reply button
  return (
    <div className='shadow-sm bg-slate-800 flex justify-center flex-col align-start my-2 rounded-md  px-2 py-3 '>
        <p className="text-sky-100 px-2 py-3">{commentContent}</p>
        <div id="comment_meataData  " className="flex justify-around items-center text-slate-600">
                  <span id="like_comment" className="flex gap-2 items-center">
                    <ThumbsUp  className={`flex items-center gap-1 ${
                isCommentLiked ? "text-rose-400" : "text-slate-600 hover:text-rose-400"
              } transition-colors`} onClick={handleLikeComement} />
              <span>{commentLikeCount}</span>
                  </span>
                  <span id="reply_comment">
                    <p className={openReplyModel?` text-white`:`hover:transition-all hover:text-white`} onClick={handleOpenReplyPanel}>Reply</p>
                  </span>
                </div>
                <motion.div 
                initial={openReplyModel ? { opacity: 0, scale: 0.8 } : { opacity: 0 }}
                animate={openReplyModel ? { opacity: 1, scale: 1 } : { opacity: 0 }}
                transition={{ duration: 0.3, ease: "linear" }}
                 id='comment_reply' className={openReplyModel?`my-2`:`hidden`}>
                <input
            type="text"
            className=" text-wrap w-[80%] px-2 py-1 bg-inherit active:border-b hover:border-b-white border-b border-b-slate-500 shadow-sm outline-none font-poppins text-sky-200 my-1"
            placeholder="reply..."
            name="comment_ka_comment_fied"
            id="commentOnComment)"
            value={reply}
            onChange={(e) => {
              setReply(e.target.value);
            }}
          />
           <span className='min-w-full flex justify-around items-center px-2 py-2'> 
            <button className='px-2 bg-slate-950 bg-opacity-20 hover:transition-all hover:bg-opacity-40 text-white shadow-md rounded-xl' onClick={()=>{
                setOpenReplyModel(false);
                setReply('');
            }}>Cancel</button>
            <button disabled={isReplyDisabled} className={ isReplyDisabled?`px-2 bg-sky-200 text-gray-700 shadow-none  rounded-xl`:`px-2 bg-sky-500 text-black shadow-md rounded-xl`}>Reply</button>
           </span>
                </motion.div>
    </div>
  )
}

export default TweetComment
