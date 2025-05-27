import React, { useState } from 'react';
import { Send, Sparkles, Heart, Image, Smile } from 'lucide-react';

const PostButton = ({textPost}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [isPosted, setIsPosted] = useState(false);

  const handlePost = () => {
    setIsPosted(true);
    setTimeout(() => setIsPosted(false), 2000);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Main Container */}
      <div className="relative bg-gradient-to-br from-blue-900/20 via-indigo-900/30 to-slate-900/20 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-blue-400/30 w-full">
        
        {/* Floating Elements */}
        <div className="absolute -top-4 -right-4 w-8 h-8 bg-blue-400/40 rounded-full blur-sm animate-pulse"></div>
        <div className="absolute -bottom-3 -left-3 w-6 h-6 bg-indigo-400/50 rounded-full blur-sm animate-pulse delay-1000"></div>
        
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-blue-100 mb-2 flex items-center justify-center gap-2">
            <Sparkles className="w-6 h-6 text-blue-300" />
            Share Your Moment
          </h2>
          <p className="text-blue-200/90">What's on your mind today?</p>
        </div>

        {/* Post Text Area */}
        <div className="mb-6">
          <textarea
            placeholder="Write something amazing..."
            className="w-full font-montserrat h-32 bg-blue-900/20 border border-blue-400/30 rounded-2xl p-4 text-blue-100 placeholder-blue-200/70 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400/60 focus:border-blue-400/50 transition-all duration-300"
            value={textPost}
          />
        </div>

        {/* Action Icons */}
        <div className="flex justify-between items-center mb-6 px-2">
          <div className="flex gap-4">
            <button className="p-2 rounded-xl bg-blue-800/30 hover:bg-blue-600/40 transition-colors duration-200 group">
              <Image className="w-5 h-5 text-blue-200 group-hover:text-blue-100" />
            </button>
            <button className="p-2 rounded-xl bg-blue-800/30 hover:bg-blue-600/40 transition-colors duration-200 group">
              <Smile className="w-5 h-5 text-blue-200 group-hover:text-blue-100" />
            </button>
          </div>
          <div className="text-blue-300/80 text-sm">0/280</div>
        </div>

        {/* Main Post Button */}
        <button
          onClick={handlePost}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onMouseDown={() => setIsPressed(true)}
          onMouseUp={() => setIsPressed(false)}
          className={`
            relative w-full py-4 px-8 rounded-2xl font-semibold text-lg
            transition-all duration-300 transform
            ${isPressed ? 'scale-95' : isHovered ? 'scale-105' : 'scale-100'}
            ${isPosted 
              ? 'bg-green-500 shadow-green-500/50' 
              : 'bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 hover:from-blue-400 hover:via-blue-500 hover:to-indigo-500 shadow-blue-500/50'
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
                <Send className={`w-6 h-6 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} />
                <span>Share Post</span>
                <Sparkles className={`w-5 h-5 transition-transform duration-300 ${isHovered ? 'rotate-180' : ''}`} />
              </>
            )}
          </div>
        </button>

        {/* Success Animation */}
        {isPosted && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-green-500/20 rounded-full p-8 animate-ping">
              <Heart className="w-8 h-8 text-green-400 fill-current" />
            </div>
          </div>
        )}


      </div>
    </div>
  );
};

export default PostButton;