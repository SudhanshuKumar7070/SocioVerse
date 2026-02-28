import React, { useState, useEffect } from 'react';

function TweetNotification({ profilePicSrc, userName, tweetContent, notificationReceived }) {
  const [isSeen, setIsSeen] = useState(!notificationReceived);

  useEffect(() => {
    if (notificationReceived) {
      setIsSeen(false);
    }
  }, [notificationReceived]);

  return (
    <div className="flex items-center gap-3 p-3 rounded-xl shadow-md bg-slate-800/60 hover:bg-slate-800/80 border border-slate-700/50 font-montserrat transition-all duration-300 cursor-pointer">
      
      {/* Profile Picture */}
      <div className="h-10 w-10 shrink-0 rounded-full border-2 border-slate-700 overflow-hidden shadow-md bg-gradient-to-br from-slate-800 to-slate-600">
        <img
          src={profilePicSrc}
          alt={`${userName}'s profile`}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Tweet Content */}
      <div className="flex-1 relative min-w-0 pr-4">
        <p className="text-sm text-slate-200 font-semibold truncate">{userName}</p>
        <p className="text-xs text-slate-400 truncate">{tweetContent}</p>
        {!isSeen && (
          <span className="absolute top-1 right-0 h-2.5 w-2.5 bg-emerald-500 border-2 border-slate-800 rounded-full shadow-sm"></span>
        )}
      </div>

      {/* Mark as Seen */}
      {!isSeen && (
        <button
          className="ml-auto shrink-0 text-xs font-medium text-cyan-400 hover:text-cyan-300 hover:underline transition"
          onClick={(e) => {
            e.stopPropagation();
            setIsSeen(true);
          }}
        >
          Mark as Seen
        </button>
      )}
    </div>
  );
}

export default TweetNotification;
