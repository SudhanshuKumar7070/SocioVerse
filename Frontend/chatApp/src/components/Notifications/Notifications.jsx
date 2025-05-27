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
      console.log("err occured in accepting friend request");
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
    <div className="h-[85vh] w-[65vw] mx-auto rounded-2xl bg-gradient-to-r from-black via-blue-950 to-black shadow-2xl p-6 flex flex-col gap-6">
      {/* Heading */}
      <h1 className="text-3xl text-blue-300 font-bold font-montserrat">
        Notifications
      </h1>

      {/* Tabs */}
      <div className="flex gap-4">
        {[
          { tab: "all", service: "all" },
          { tab: "chat", service: "chatMessage" },
          { tab: "tweet", service: "tweetNotificationData" },
          { tab: "friend", service: "friendRequest" },
        ].map((tabs) => (
          <button
            key={tabs.tab}
            onClick={() => setActiveTab(tabs)}
            className={`px-4 py-2 rounded-full font-poppins text-sm shadow-md transition-all ${
              activeTab?.tab === tabs.tab
                ? "bg-blue-600 text-white"
                : "bg-blue-950 text-blue-300"
            }`}
          >
            {tabs.tab.charAt(0).toUpperCase() + tabs.tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Notification List */}
      <div className="flex flex-col gap-4 overflow-y-auto max-h-[65vh] scrollbar-custom">
        {filteredNotificationData.length > 0 ? (
          filteredNotificationData.map((notif, index) => (
            <div
              key={index}
              className={`flex items-center gap-4 p-4 rounded-lg shadow-lg bg-blue-950 bg-opacity-30 transition hover:bg-blue-900 ${
                notif.isRead ? "opacity-70" : "opacity-100"
              }`}
            >
              <div>{getIcon(notif.service)}</div>
              <div className="flex flex-col w-full">
                <span className=" flex justify-between items-center">
                  {" "}
                  <p className="text-blue-300 font-semibold font-montserrat">
                    {notif.content}
                  </p>{" "}
                  {notif.service === "friendRequest" ? (
                    <span className="p-2 ">
                      <button
                        className="font-montserrat px-2 py-2 rounded-xl shadow-lg bg-slate-900 text-blue-300 font-semibold hover:transition-all duration-300 ease-in   hover:text-blue-500  hover:scale-105"
                        onClick={async() => {
                          const data = await  acceptFriendRequest(notif?.friendRequestId);
            
                            const readResponse = await updateIsReadNotification(notif?._id);
                             if(readResponse) setRefreshNotificationFetch(prev => !prev);
                             if (data) setRefreshNotificationFetch(prev => !prev);
                         
                        }}
                      >
                        Accept
                      </button>{" "}
                      <button className=" font-montserrat px-2 py-2  rounded-xl shadow-lg bg-slate-900  text-blue-500 font-semibold hover:transition-all duration-300 ease-linear hover:scale-105 hover:text-blue-300" 
                      onClick={async()=>{
                              
                             const rejectResponse = await rejectFriendRequest(notif?.friendRequestId);
              
                             if(rejectResponse) setRefreshNotificationFetch(prev => !prev);
                             const readResponse = await updateIsReadNotification(notif?._id);
                             if(readResponse) setRefreshNotificationFetch(prev => !prev);
                      }}
                      >
                        {" "}
                        Reject
                      </button>{" "}
                    </span>
                  ) : (
                    ""
                  )}
                </span>
                <span className="text-slate-400 text-xs">
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
