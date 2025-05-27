import React, { useState, useEffect } from 'react';

function TweetNotification({ profilePicSrc, userName, tweetContent, notificationReceived }) {
  const [isSeen, setIsSeen] = useState(!notificationReceived);

  useEffect(() => {
    if (notificationReceived) {
      setIsSeen(false);
    }
  }, [notificationReceived]);

  return (
    <div className="flex items-start gap-3 p-4 rounded-xl shadow-md bg-white border border-slate-200 font-montserrat transition-all duration-300">
      
      {/* Profile Picture */}
      <div className="h-10 w-10 rounded-full border-2 border-white overflow-hidden shadow-md bg-gradient-to-br from-slate-800 to-slate-600">
        <img
          src={profilePicSrc}
          alt={`${userName}'s profile`}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Tweet Content */}
      <div className="flex-1 relative">
        <p className="text-sm text-slate-700 font-semibold">{userName}</p>
        <p className="text-xs text-slate-500">{tweetContent}</p>
        {!isSeen && (
          <span className="absolute top-0 right-0 h-3 w-3 bg-green-500 border-2 border-white rounded-full shadow-sm"></span>
        )}
      </div>

      {/* Mark as Seen */}
      {!isSeen && (
        <button
          className="ml-auto text-xs font-medium text-sky-500 hover:text-sky-600 hover:underline transition"
          onClick={() => setIsSeen(true)}
        >
          Mark as Seen
        </button>
      )}
    </div>
  );
}

export default TweetNotification;
