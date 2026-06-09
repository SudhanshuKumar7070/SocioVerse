import React, { useCallback, useEffect } from "react";
import i18n from "./Hooks/i18n.setup.js";
import { useTranslation } from "react-i18next";
import Container from "./components/Container";
import { Outlet } from "react-router-dom";
import { useSocket } from "./components/SocketConnection";
import { useState } from "react";
import { useGlobalSocket } from "./components/SocketConnection";
import { useSelector } from "react-redux";
import ContactList from "./components/ContactList";
import { useContext } from "react";
import { contextMap } from "./store/NotificationMap.jsx";
import landingPage from "./components/LandingPage/landingPage.jsx";
import LandingPage from "./components/LandingPage/landingPage.jsx";
import axios from "axios";
import { useDispatch } from "react-redux";
import { login } from "./store/authSlice.js";
import { setTokens } from "./store/tokenSlice.js";
import { messaging } from "./Config/firebase.config.js";
import { getToken } from "firebase/messaging";
import { setCurrentDeviceToken } from "./store/currentDeviceToken.js";
import { listenForForegroundNotifications } from "./Config/firebase.forground.js";
function App() {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  // method to cahange language
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };
  const { setValue, getValue, globalMap } = useContext(contextMap);

  const globalSocket = useGlobalSocket();
  const myId = useSelector((state) => state.auth?.userData?._id);
  console.log(myId);
  useEffect(() => {
    const handleConnect = () => {
      console.log("global socket connection done");
      globalSocket.emit("connectionEstablished", { userId: myId });
    };

    const handleAddedComment = (data) => {
      setValue("commentNotification", data);
      console.log("data", data);
      alert("comment created");
    };

    const handleFriendRequestNotification = (data) => {
      setValue("friendRequest", data);
      console.log("you have received a friend request");
      alert("new friendrequest");
    };

    const handleFriendRequestAcceptedNotification = (data) => {
      console.log("accepted notification:", data);
      alert("friend request accepted");
    };

    const handleFriendRequestAccepted = (data) => {
      console.log("friend request accepted data:", data);
    };

    const handleRejectedFriendRequest = (data) => {
      console.log("rejected notification:", data);
      alert("friend request rejected");
    };

    const handleFollowRequest = (message) => {
      console.log("khuch to hua hai");
      console.log(message);
      alert("you have a of new follower");
    };

    globalSocket.on("connect", handleConnect);
    globalSocket.on("addedComment", handleAddedComment);
    globalSocket.on(
      "friend_request_notification",
      handleFriendRequestNotification,
    );
    globalSocket.on(
      "friend_request_acceptd_notofication",
      handleFriendRequestAcceptedNotification,
    );
    globalSocket.on("friend_request_acceptd", handleFriendRequestAccepted);
    globalSocket.on("rejected_friend_request", handleRejectedFriendRequest);
    globalSocket.on("FollowRequest", handleFollowRequest);

    console.log("displaying all data available at globalMap::", globalMap);

    return () => {
      globalSocket.off("connect", handleConnect);
      globalSocket.off("addedComment", handleAddedComment);
      globalSocket.off(
        "friend_request_notification",
        handleFriendRequestNotification,
      );
      globalSocket.off(
        "friend_request_acceptd_notofication",
        handleFriendRequestAcceptedNotification,
      );
      globalSocket.off("friend_request_acceptd", handleFriendRequestAccepted);
      globalSocket.off("rejected_friend_request", handleRejectedFriendRequest);
      globalSocket.off("FollowRequest", handleFollowRequest);
    };
  }, [globalSocket]);

  const get_Current_User = async () => {
    try {
      const user = await axios.get(
        `${import.meta.env.VITE_API_URL}/user/current_user_data`,
        { withCredentials: true },
      );
      if (!user) alert("user not fetched at moment");
      const data = user.data.response;
      console.log("dataa === ", data, "at app.jsx");
      console.log("refreshToken === ", data.RefreshToken, "at app.jsx");
      dispatch(
        login({
          userData: data,
          token: data.RefreshToken,
        }),
      );
      dispatch(
        setTokens({
          refreshToken: data.RefreshToken,
        }),
      );
    } catch (err) {
      console.log("error occured in getting current user", err);
    }
  };

  const notificationPermission = async () => {
    console.log("permission function called");
    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        console.log("permission granted for notification");
        alert("permission granted for notification");
        const token = await getToken(messaging, {
          vapidKey:
            "BEvQqFWDCG8dgBnaKuwJZKiSKQQeN1ZMwbi7G63oXVQbuzJDP2xSK4sCO87lR629girpftLuD0m5K083Z9_j2AQ",
        });
        console.log("token of the system::", token);
        dispatch(setCurrentDeviceToken({ currentDeviceToken: token }));
        // Start listening for foreground messages AFTER service worker is registered
        listenForForegroundNotifications();
      }
    } catch (err) {
      console.log("error occured in getting notification permission", err);
    }
  };
  //  useeffect to get permission

  useEffect(() => {
    get_Current_User();
    notificationPermission();
  }, []);

  return (
    <div className="h-full w-full flex justify-center items-center flex-col">
      <Container>
        <Outlet />
      </Container>
    </div>
  );
}

export default App;
