import React, { useState, useEffect } from "react";
import {
  Bell,
  MessageSquare,
  UserPlus,
  Heart,
  Check,
  X,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import MobileBottomNav from "../DashBoard/MobileBottomNav";
import { useGlobalSocket } from "../SocketConnection";

function Notifications() {
  const Url = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const globalSocket = useGlobalSocket();

  const [notificationData, setNotificationData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [refreshNotificationFetch, setRefreshNotificationFetch] = useState(false);

  // Filter based on active tab
  const filteredNotifications = notificationData.filter((noti) => {
    if (activeTab === "all") return true;
    if (activeTab === "follow") return noti.service === "follow";
    if (activeTab === "friend") {
      return (
        noti.service === "friendRequest" ||
        noti.service === "friendRequestAccept" ||
        noti.service === "friendRequestReject"
      );
    }
    if (activeTab === "chat") return noti.service === "chatMessage";
    if (activeTab === "tweet") {
      return (
        noti.service?.startsWith("tweet") ||
        noti.service === "commentNotification"
      );
    }
    return true;
  });

  // Icon helper
  const getIcon = (service) => {
    switch (service) {
      case "chatMessage":
      case "chat":
        return <MessageSquare className="w-4 h-4 text-sky-400" />;
      case "friendRequest":
      case "friendRequestAccept":
        return <UserPlus className="w-4 h-4 text-emerald-400" />;
      case "follow":
        return <Heart className="w-4 h-4 text-rose-400 fill-rose-400/20" />;
      case "tweetLike":
        return <Heart className="w-4 h-4 text-pink-400 fill-pink-400" />;
      default:
        return <Bell className="w-4 h-4 text-amber-400" />;
    }
  };

  // Fetch all notifications
  const fetchAllNotifications = async () => {
    setLoading(true);
    try {
      // Try unified allNotifications endpoint first
      const res = await axios.get(`${Url}/notification/allNotifications`, {
        withCredentials: true,
      });
      const list = res?.data?.response;
      if (Array.isArray(list)) {
        setNotificationData(list);
      } else {
        // Fallback to friend requests
        const fallbackRes = await axios.get(
          `${Url}/notification/friendRequestsNotifications`,
          { withCredentials: true }
        );
        setNotificationData(fallbackRes?.data?.response || []);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      // Fallback
      try {
        const fallback = await axios.get(
          `${Url}/notification/friendRequestsNotifications`,
          { withCredentials: true }
        );
        setNotificationData(fallback?.data?.response || []);
      } catch (e) {
        setNotificationData([]);
      }
    } finally {
      setLoading(false);
    }
  };

  // Accept friend request
  const acceptFriendRequest = async (friendRequestId, notificationId) => {
    try {
      await axios.patch(
        `${Url}/friend_request/accept_friend_request/${friendRequestId}`,
        {},
        { withCredentials: true }
      );
      if (notificationId) {
        await updateIsReadNotification(notificationId);
      }
      setRefreshNotificationFetch((prev) => !prev);
    } catch (err) {
      console.error("Error accepting friend request:", err);
    }
  };

  // Reject friend request
  const rejectFriendRequest = async (friendRequestId, notificationId) => {
    try {
      await axios.patch(
        `${Url}/friend_request/reject_friend_request/${friendRequestId}`,
        {},
        { withCredentials: true }
      );
      if (notificationId) {
        await updateIsReadNotification(notificationId);
      }
      setRefreshNotificationFetch((prev) => !prev);
    } catch (error) {
      console.error("Error rejecting friend request:", error);
    }
  };

  // Mark notification as read
  const updateIsReadNotification = async (notificationId) => {
    try {
      await axios.patch(
        `${Url}/notification/update_isRead/${notificationId}`,
        {},
        { withCredentials: true }
      );
      setNotificationData((prev) =>
        prev.map((n) =>
          n._id === notificationId ? { ...n, isRead: true } : n
        )
      );
    } catch (error) {
      console.error("Error updating notification isRead:", error);
    }
  };

  useEffect(() => {
    fetchAllNotifications();
  }, [refreshNotificationFetch]);

  // Listen for real-time notifications on socket
  useEffect(() => {
    if (!globalSocket) return;

    const handleNewNotification = (data) => {
      if (data?.newFollowerNotification) {
        setNotificationData((prev) => [data.newFollowerNotification, ...prev]);
      } else if (data?.notification) {
        setNotificationData((prev) => [data.notification, ...prev]);
      } else {
        setRefreshNotificationFetch((prev) => !prev);
      }
    };

    globalSocket.on("FollowRequest", handleNewNotification);
    globalSocket.on("friend_request_notification", handleNewNotification);
    globalSocket.on("friend_request_acceptd_notofication", handleNewNotification);
    globalSocket.on("friend_request_accepted_notification", handleNewNotification);
    globalSocket.on("rejected_friend_request", handleNewNotification);
    globalSocket.on("friend_request_rejected", handleNewNotification);
    globalSocket.on("newChatNotfication", handleNewNotification);

    return () => {
      globalSocket.off("FollowRequest", handleNewNotification);
      globalSocket.off("friend_request_notification", handleNewNotification);
      globalSocket.off("friend_request_acceptd_notofication", handleNewNotification);
      globalSocket.off("friend_request_accepted_notification", handleNewNotification);
      globalSocket.off("rejected_friend_request", handleNewNotification);
      globalSocket.off("friend_request_rejected", handleNewNotification);
      globalSocket.off("newChatNotfication", handleNewNotification);
    };
  }, [globalSocket]);

  const tabs = [
    { id: "all", label: "All" },
    { id: "follow", label: "Follows" },
    { id: "friend", label: "Friends" },
    { id: "chat", label: "Chats" },
    { id: "tweet", label: "Posts" },
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 flex flex-col pb-24 md:pb-8">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-8 py-4">
        <div className="w-full max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold font-montserrat text-white flex items-center gap-2">
              <Bell className="w-5 h-5 text-cyan-400" />
              Notifications
            </h1>
            <p className="text-xs text-slate-400 font-poppins">
              Stay updated with your community activities
            </p>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-5 flex-1 flex flex-col">
        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap px-4 py-2 rounded-xl font-poppins text-xs sm:text-sm font-semibold transition-all duration-200 shadow-sm ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-cyan-500/20"
                  : "bg-slate-900/60 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="flex-1 flex flex-col gap-3">
          {loading ? (
            <div className="flex flex-col gap-3">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/60 animate-pulse flex items-center gap-3.5"
                >
                  <div className="w-10 h-10 rounded-full bg-slate-800 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="w-3/4 h-3.5 bg-slate-800 rounded" />
                    <div className="w-1/4 h-2.5 bg-slate-800/60 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredNotifications.length > 0 ? (
            filteredNotifications.map((notif, index) => {
              const sender = notif?.sender;
              const senderId = sender?._id || notif?.sender;
              const profilePic =
                sender?.profilePicture ||
                "https://picsum.photos/seed/user/200/200";
              const senderName =
                sender?.fullName || sender?.userName || "Someone";

              return (
                <div
                  key={notif?._id || `notif-${index}`}
                  onClick={() => {
                    if (!notif.isRead && notif._id) {
                      updateIsReadNotification(notif._id);
                    }
                  }}
                  className={`flex items-start sm:items-center justify-between gap-3.5 p-3.5 sm:p-4 rounded-2xl border transition-all duration-200 ${
                    notif.isRead
                      ? "bg-slate-900/40 border-slate-800/60 opacity-75 hover:opacity-100 hover:bg-slate-900/60"
                      : "bg-slate-800/50 border-cyan-500/30 shadow-lg shadow-cyan-950/20 hover:bg-slate-800/70"
                  }`}
                >
                  <div className="flex items-start sm:items-center gap-3.5 flex-1 min-w-0">
                    {/* Sender Avatar + Notification Icon Badge */}
                    <div className="relative shrink-0">
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          if (senderId) navigate(`/userAdmin/${senderId}`);
                        }}
                        className="w-11 h-11 rounded-full overflow-hidden bg-slate-800 border border-slate-700/60 cursor-pointer hover:ring-2 hover:ring-cyan-400 transition-all"
                      >
                        <img
                          src={profilePic}
                          alt={senderName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute -bottom-1 -right-1 p-1 bg-slate-900 rounded-full border border-slate-800 shadow-md">
                        {getIcon(notif.service)}
                      </div>
                    </div>

                    {/* Content & Timestamp */}
                    <div className="flex-1 min-w-0">
                      <p className="text-slate-200 text-xs sm:text-sm font-poppins leading-relaxed break-words">
                        {senderId ? (
                          <span
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/userAdmin/${senderId}`);
                            }}
                            className="font-bold text-white hover:text-cyan-400 cursor-pointer transition-colors"
                          >
                            {senderName}{" "}
                          </span>
                        ) : null}
                        {notif.content}
                      </p>
                      <span className="text-[11px] text-slate-500 font-poppins mt-1 block">
                        {moment(notif.createdAt).fromNow()}
                      </span>
                    </div>
                  </div>

                  {/* Actions for Friend Requests */}
                  {notif.service === "friendRequest" && (
                    <div
                      className="flex items-center gap-2 shrink-0 ml-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => {
                          const reqId = notif?.sourceId?._id || notif?.sourceId;
                          acceptFriendRequest(reqId, notif?._id);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-white border border-emerald-500/30 text-xs font-semibold font-poppins transition-all duration-200 flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Accept</span>
                      </button>
                      <button
                        onClick={() => {
                          const reqId = notif?.sourceId?._id || notif?.sourceId;
                          rejectFriendRequest(reqId, notif?._id);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white border border-rose-500/30 text-xs font-semibold font-poppins transition-all duration-200 flex items-center gap-1"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    </div>
                  )}

                  {/* Action for Follow Notification */}
                  {notif.service === "follow" && senderId && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/userAdmin/${senderId}`);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-cyan-500 hover:text-slate-900 border border-slate-700 text-slate-300 text-xs font-semibold font-poppins transition-all duration-200 shrink-0 ml-2 flex items-center gap-1"
                    >
                      <span>View</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  )}
                </div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
              <div className="w-16 h-16 rounded-full bg-slate-900/60 border border-slate-800 flex items-center justify-center">
                <Sparkles className="w-7 h-7 text-slate-600" />
              </div>
              <h3 className="text-base font-semibold text-slate-300 font-montserrat">
                No notifications right now
              </h3>
              <p className="text-xs text-slate-500 font-poppins max-w-xs">
                When someone follows you, comments, or sends messages, they will appear here.
              </p>
            </div>
          )}
        </div>
      </main>

      <MobileBottomNav />
    </div>
  );
}

export default Notifications;
