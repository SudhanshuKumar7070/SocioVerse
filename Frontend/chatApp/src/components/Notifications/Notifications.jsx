import React, { useState, useEffect } from "react";
import { Bell, MessageSquare, UserPlus } from "lucide-react";
import axios from "axios";

// const notificationsData = [
//   { id: 1, service: 'chat', message: 'You have a new message from John!', timestamp: '2m ago', isRead: false },
//   { id: 2, type: 'tweet', message: 'Alice commented on your tweet.', timestamp: '10m ago', isRead: true },
//   { id: 3, type: 'friend', message: 'Mike sent you a friend request.', timestamp: '1h ago', isRead: false },
// ];

function Notifications() {
  const Url = import.meta.env.VITE_API_URL;

  const [NotificationData, setNotificationData] = useState([]);
  const [activeTab, setActiveTab] = useState({ tab: "all", service: "all" });
 const [refreshNotificationFetch, setRefreshNotificationFetch] = useState(false)
 const customisedNotificationFilter = ()=>{
  if(activeTab.service === "all") return NotificationData
  else if(activeTab.service=== "friendRequest") return  NotificationData?.filter((noti)=> noti.service=== "friendRequest" || noti.service === "friendRequestAccept" || noti.service === "friendRequestReject");
  else return NotificationData?.filter((n) => n.service === activeTab.service);
 }
 const filteredNotificationData = customisedNotificationFilter();
  // const filteredNotificationData =
  //   activeTab.service === "all"
  //     ? NotificationData
  //     : NotificationData?.filter((n) => n.service === activeTab.service);
  //  set icon accordingly
  const getIcon = (service) => {
    if (service === "chat")
      return (
        <MessageSquare
          className="text-blue-300 hover:transition-all duration-300 ease-linear hover:text-blue-500 hover:shadow-xl cursor-pointer"
          size={24}
        />
      );
    if (service === "friendRequest")
      return (
        <UserPlus
          className="text-green-300 hover:transition-all duration-300 ease-linear hover:text-green-500 hover:shadow-xl cursor-pointer"
          size={24}
        />
      );
    return (
      <Bell
        className="text-yellow-300 hover:transition-all duration-300 ease-linear hover:text-yellow-500 hover:shadow-xl cursor-pointer"
        size={24}
      />
    );
  };
  //  method for fetching friendRequests Notifiacations
  const getFriendRequestasNotification = async () => {
    try {
      const response = await axios.get(
        `${Url}/notification/friendRequestsNotifications`,
        { withCredentials: true }
      );
      if (!response)
        throw new Error("unable to fetch NotificationData at the moment");
      console.log(
        "fetching NotificationData at notification page:",
        response.data.response
      );
      setNotificationData(  response.data.response
      );
      console.log("nott:", NotificationData);
    } catch (error) {
      console.log(error);
    }
  };
  // method for accepting friend request
  const acceptFriendRequest = async (friendRequestId) => {
    try {
      const acceptRequest =await axios.patch(
        `${Url}/friend_request/accept_friend_request/${friendRequestId}`,
        {},
        { withCredentials: true }
      );
      if (!acceptRequest)
        throw new Error("something went wrong in accepting friend request");
      return acceptRequest;
    } catch (err) {
      console.log("err occured in accepting friend request",err);
    }
  };
  // method for rejecting request
   const rejectFriendRequest = async(friendRequestId)=>{
  try {
     
    const rejectResponse = await axios.patch(`${Url}/friend_request/reject_friend_request/${friendRequestId}`,{},{withCredentials:true})
    if(!rejectResponse) throw new Error("something went wrong in rejecting request");
    return rejectResponse
  } catch (error) {
    console.log(error)
  }
   }
  // method for marking isRead True
   const updateIsReadNotification = async(notificationId)=>{
    
      try {
        const response = await axios.patch(`${Url}/notification/update_isRead/${notificationId}`,{},{withCredentials:true})
         if(!response) throw new Error("something went wrong in updating noiification")
          return response
      } catch (error) {
        console.log(error)
      }
   }

  // use effect  for fetching all data
  useEffect(() => {
    const fetchData = async () => {
      await getFriendRequestasNotification();
    };
    fetchData();
  }, [ refreshNotificationFetch]);
  return (
    <div className="h-[100dvh] sm:h-[85vh] w-full sm:w-[90vw] md:w-[75vw] lg:w-[65vw] mx-auto sm:mt-8 sm:rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700/50 shadow-2xl p-4 sm:p-6 flex flex-col gap-4 sm:gap-6 pb-20 sm:pb-6">
      {/* Heading */}
      <h1 className="text-2xl sm:text-3xl text-cyan-400 font-extrabold font-montserrat tracking-tight">
        Notifications
      </h1>

      {/* Tabs */}
      <div className="flex gap-2 sm:gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {[
          { tab: "all", service: "all" },
          { tab: "chat", service: "chatMessage" },
          { tab: "tweet", service: "tweetNotificationData" },
          { tab: "friend", service: "friendRequest" },
        ].map((tabs) => (
          <button
            key={tabs.tab}
            onClick={() => setActiveTab(tabs)}
            className={`whitespace-nowrap shrink-0 px-4 py-2 rounded-full font-poppins text-xs sm:text-sm font-medium shadow-md transition-all duration-300 ${
              activeTab?.tab === tabs.tab
                ? "bg-cyan-500 text-slate-900 shadow-cyan-500/20"
                : "bg-slate-800 text-slate-400 hover:text-cyan-400 border border-slate-700 hover:border-cyan-500/50"
            }`}
          >
            {tabs.tab.charAt(0).toUpperCase() + tabs.tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Notification List */}
      <div className="flex flex-col gap-3 overflow-y-auto flex-1 scrollbar-custom pr-1 sm:pr-2">
        {filteredNotificationData.length > 0 ? (
          filteredNotificationData.map((notif, index) => (
            <div
              key={index}
              className={`flex items-start sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl shadow-lg bg-slate-800/60 border border-slate-700/50 transition-all duration-300 hover:bg-slate-800/80 hover:border-slate-600 ${
                notif.isRead ? "opacity-60 grayscale-[30%]" : "opacity-100"
              }`}
            >
              <div className="mt-1 sm:mt-0 p-2 sm:p-3 bg-slate-700/30 rounded-full shrink-0">{getIcon(notif.service)}</div>
              <div className="flex flex-col w-full min-w-0">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-4 w-full">
                  <p className="text-slate-200 font-medium font-poppins text-sm sm:text-base leading-snug break-words">
                    {notif.content}
                  </p>
                  
                  {notif.service === "friendRequest" && (
                    <div className="flex items-center gap-2 shrink-0 mt-2 sm:mt-0">
                      <button
                        className="font-poppins text-xs sm:text-sm px-4 py-2 rounded-lg shadow-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold hover:bg-emerald-500 hover:text-white transition-all duration-200"
                        onClick={async() => {
                          const data = await acceptFriendRequest(notif?.sourceId);
                          const readResponse = await updateIsReadNotification(notif?._id);
                          if(readResponse) setRefreshNotificationFetch(prev => !prev);
                          if (data) setRefreshNotificationFetch(prev => !prev);
                        }}
                      >
                        Accept
                      </button>
                      <button 
                        className="font-poppins text-xs sm:text-sm px-4 py-2 rounded-lg shadow-md bg-rose-500/10 text-rose-400 border border-rose-500/20 font-semibold hover:bg-rose-500 hover:text-white transition-all duration-200" 
                        onClick={async()=>{
                           const rejectResponse = await rejectFriendRequest(notif?.sourceId);
                           if(rejectResponse) setRefreshNotificationFetch(prev => !prev);
                           const readResponse = await updateIsReadNotification(notif?._id);
                           if(readResponse) setRefreshNotificationFetch(prev => !prev);
                        }}
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
                <span className="text-slate-500 text-xs mt-1.5 font-montserrat">
                  {notif.createdAt}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-slate-400 font-poppins">
            No Notifications Yet 🚀
          </div>
        )}
      </div>
    </div>
  );
}

export default Notifications;
