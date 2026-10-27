import React, { useCallback, useEffect } from "react";
import i18n from "./Hooks/i18n.setup.js";
import { useTranslation } from "react-i18next";
import Container from "./components/Container";
import { Outlet } from "react-router-dom";
import { useSocket, useGlobalSocket } from "./components/SocketConnection";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import ContactList from "./components/ContactList";
import { useContext } from "react";
import { contextMap } from "./store/NotificationMap.jsx";
import LandingPage from "./components/LandingPage/LandingPage.jsx";
import axios from "axios";
import { login } from "./store/authSlice.js";
import { setTokens } from "./store/tokenSlice.js";
import { messaging } from "./Config/firebase.config.js";
import { getToken } from "firebase/messaging";
import { setCurrentDeviceToken } from "./store/currentDeviceToken.js";
import { listenForForegroundNotifications } from "./Config/firebase.forground.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const { setValue, getValue, globalMap } = useContext(contextMap);
  const globalSocket = useGlobalSocket();
  const myId = useSelector((state) => state.auth?.userData?._id);

  useEffect(() => {
    if (!globalSocket) return;

    const emitConnectionEstablished = () => {
      if (myId) {
        console.log("Emitting connectionEstablished for user:", myId);
        globalSocket.emit("connectionEstablished", { userId: myId });
      }
    };

    // If socket is already connected when component mounts or when myId becomes available
    if (globalSocket.connected && myId) {
      emitConnectionEstablished();
    }

    const handleConnect = () => {
      emitConnectionEstablished();
    };

    const handleAddedComment = (data) => {
      setValue("commentNotification", data);
      toast.info("💬 New comment on your post!");
    };

    const handleFriendRequestNotification = (data) => {
      setValue("friendRequest", data);
      toast.info("👥 You have a new friend request!");
    };

    const handleFriendRequestAcceptedNotification = (data) => {
      setValue("friendRequestAccepted", data);
      toast.success("🎉 Friend request accepted!");
    };

    const handleFriendRequestAccepted = (data) => {
      setValue("friendRequestAccepted", data);
    };

    const handleRejectedFriendRequest = (data) => {
      setValue("friendRequestRejected", data);
    };

    const handleFollowRequest = (data) => {
      setValue("followNotification", data);
      const senderName =
        data?.sender?.fullName || data?.sender?.userName || "Someone";
      toast.info(`✨ ${senderName} started following you!`);
    };

    const handleNewChatNotification = (data) => {
      const senderName = data?.sender?.fullName || data?.sender?.userName || "New Message";
      toast.info(`📩 ${senderName}: ${data?.message?.content || "Sent a message"}`);
    };

    globalSocket.on("connect", handleConnect);
    globalSocket.on("addedComment", handleAddedComment);
    globalSocket.on(
      "friend_request_notification",
      handleFriendRequestNotification
    );
    globalSocket.on(
      "friend_request_acceptd_notofication",
      handleFriendRequestAcceptedNotification
    );
    globalSocket.on("friend_request_acceptd", handleFriendRequestAccepted);
    globalSocket.on("rejected_friend_request", handleRejectedFriendRequest);
    globalSocket.on("FollowRequest", handleFollowRequest);
    globalSocket.on("newChatNotfication", handleNewChatNotification);

    return () => {
      globalSocket.off("connect", handleConnect);
      globalSocket.off("addedComment", handleAddedComment);
      globalSocket.off(
        "friend_request_notification",
        handleFriendRequestNotification
      );
      globalSocket.off(
        "friend_request_acceptd_notofication",
        handleFriendRequestAcceptedNotification
      );
      globalSocket.off("friend_request_acceptd", handleFriendRequestAccepted);
      globalSocket.off("rejected_friend_request", handleRejectedFriendRequest);
      globalSocket.off("FollowRequest", handleFollowRequest);
      globalSocket.off("newChatNotfication", handleNewChatNotification);
    };
  }, [globalSocket, myId]);

  const get_Current_User = async () => {
    try {
      const user = await axios.get(
        `${import.meta.env.VITE_API_URL}/user/current_user_data`,
        { withCredentials: true }
      );
      if (!user) return;
      const data = user.data.response;
      dispatch(
        login({
          userData: data,
          token: data.RefreshToken,
        })
      );
      dispatch(
        setTokens({
          refreshToken: data.RefreshToken,
        })
      );
    } catch (err) {
      console.error("error occurred in getting current user", err);
    }
  };

  const notificationPermission = async () => {
    try {
      if (typeof Notification !== "undefined" && Notification.requestPermission) {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          const token = await getToken(messaging, {
            vapidKey:
              "BEvQqFWDCG8dgBnaKuwJZKiSKQQeN1ZMwbi7G63oXVQbuzJDP2xSK4sCO87lR629girpftLuD0m5K083Z9_j2AQ",
          });
          dispatch(setCurrentDeviceToken({ currentDeviceToken: token }));
          listenForForegroundNotifications();
        }
      }
    } catch (err) {
      console.error("error occurred in getting notification permission", err);
    }
  };

  useEffect(() => {
    get_Current_User();
    notificationPermission();
  }, []);

  return (
    <div className="h-full w-full flex justify-center items-center flex-col">
      <Container>
        <Outlet />
      </Container>
      <ToastContainer
        position="bottom-right"
        autoClose={3500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
}

export default App;
