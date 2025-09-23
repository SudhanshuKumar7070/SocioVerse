import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { ThumbsUp, MessageCircle, X, Send } from 'lucide-react'
import { useState } from 'react'

function TweetComment({
    likesCount = 0,
    commentContent = '',
    profilePic = "https://picsum.photos/seed/2/200/200",
    username = "User",
    timestamp = "2m"
}) {
    const [commentLikeCount, setCommentLikesCount] = useState(likesCount)
    const [isCommentLiked, setCommentLike] = useState(false)
    const [openReplyModel, setOpenReplyModel] = useState(false)
    const [isReplyDisabled, setReplyDisabled] = useState(false)
    const [reply, setReply] = useState('')

    const handleLikeComment = () => {
        if (isCommentLiked) {
            setCommentLikesCount((prev) => prev - 1);
        } else {
            setCommentLikesCount((prev) => prev + 1);
        }
        setCommentLike(!isCommentLiked)
    };

    const handleOpenReplyPanel = () => {
        if (!openReplyModel) {
            setOpenReplyModel(true)
        }
    }

    const handleSubmitReply = () => {
        if (reply.trim()) {
            // Handle reply submission logic here
            console.log("Reply submitted:", reply);
            setReply('');
            setOpenReplyModel(false);
        }
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey && reply.trim()) {
            e.preventDefault();
            handleSubmitReply();
        }
    }

    useEffect(() => {
        if (reply.length === 0) {
            setReplyDisabled(true)
        } else {
            setReplyDisabled(false)
        }
    }, [reply.length])

    return (
        <motion.div 
            className='bg-gradient-to-r from-slate-800/80 to-slate-800/60 backdrop-blur-sm border border-slate-700/50 hover:border-slate-600/70 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 my-3 p-4 group'
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            {/* Comment Header */}
            <div className="flex items-start gap-3 mb-3">
                <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-slate-600/50 hover:ring-slate-500 transition-all duration-200 flex-shrink-0">
                    <img 
                        src={profilePic} 
                        alt={`${username}'s avatar`}
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-slate-200 text-sm">{username}</span>
                        <span className="text-slate-500 text-xs">•</span>
                        <span className="text-slate-500 text-xs">{timestamp}</span>
                    </div>
                    <p className="text-slate-100 leading-relaxed text-sm font-medium">{commentContent}</p>
                </div>
            </div>

            {/* Enhanced Comment Actions */}
            <div className="flex justify-between items-center pl-11">
                <div className="flex items-center gap-4">
                    <button
                        className={`group/like flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-200 ${
                            isCommentLiked 
                                ? "text-rose-400 bg-rose-400/10" 
                                : "text-slate-500 hover:text-rose-400 hover:bg-rose-400/10"
                        }`}
                        onClick={handleLikeComment}
                    >
                        <ThumbsUp 
                            className={`h-4 w-4 group-hover/like:scale-110 transition-transform duration-200 ${
                                isCommentLiked ? 'fill-current' : ''
                            }`}
                        />
                        <span className="text-xs font-medium">{commentLikeCount}</span>
                    </button>

                    <button
                        className={`group/reply flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-200 ${
                            openReplyModel 
                                ? "text-blue-400 bg-blue-400/10" 
                                : "text-slate-500 hover:text-blue-400 hover:bg-blue-400/10"
                        }`}
                        onClick={handleOpenReplyPanel}
                    >
                        <MessageCircle className="h-4 w-4 group-hover/reply:rotate-12 transition-transform duration-200" />
                        <span className="text-xs font-medium">Reply</span>
                    </button>
                </div>

                {/* More options (appears on hover) */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button className="p-1.5 rounded-full hover:bg-slate-700/50 text-slate-500 hover:text-slate-300 transition-all">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Enhanced Reply Modal */}
            <motion.div
                initial={openReplyModel ? { opacity: 0, height: 0, y: -10 } : { opacity: 0, height: 0 }}
                animate={openReplyModel ? { opacity: 1, height: 'auto', y: 0 } : { opacity: 0, height: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className={openReplyModel ? `mt-4 overflow-hidden` : `hidden`}
            >
                <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-600/30 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
                            <img 
                                src={profilePic} 
                                alt="Your avatar"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="flex-1">
                            <textarea
                                className="w-full px-3 py-2 bg-slate-800/60 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:bg-slate-800/80 transition-all duration-200 resize-none text-sm"
                                placeholder="Tweet your reply..."
                                rows="2"
                                value={reply}
                                onChange={(e) => setReply(e.target.value)}
                                onKeyPress={handleKeyPress}
                            />
                            
                            {/* Reply Actions */}
                            <div className="flex justify-between items-center mt-3">
                                <div className="flex items-center gap-2 text-slate-500">
                                    <span className="text-xs">{reply.length}/280</span>
                                    {reply.length > 250 && (
                                        <div className={`w-6 h-6 rounded-full border-2 ${
                                            reply.length > 280 ? 'border-red-400' : 'border-yellow-400'
                                        } relative`}>
                                            <div 
                                                className={`absolute inset-1 rounded-full ${
                                                    reply.length > 280 ? 'bg-red-400' : 'bg-yellow-400'
                                                }`}
                                                style={{ 
                                                    transform: `rotate(${Math.min((reply.length / 280) * 360, 360)}deg)`,
                                                    transformOrigin: 'center'
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>
                                
                                <div className="flex items-center gap-2">
                                    <button 
                                        className="px-4 py-1.5 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-full transition-all duration-200 text-sm font-medium"
                                        onClick={() => {
                                            setOpenReplyModel(false);
                                            setReply('');
                                        }}
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        disabled={isReplyDisabled || reply.length > 280}
                                        onClick={handleSubmitReply}
                                        className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                                            isReplyDisabled || reply.length > 280
                                                ? 'bg-slate-600/50 text-slate-400 cursor-not-allowed'
                                                : 'bg-blue-500 hover:bg-blue-600 text-white hover:scale-105 hover:shadow-lg'
                                        }`}
                                    >
                                        <Send className="h-3 w-3" />
                                        Reply
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    )
}

export default TweetComment