import React, { useEffect } from "react";
import {formatDistanceToNow} from "date-fns"
import DashboardNavbar from "./DashboardNavbar";
import LeftSideBar from "./LeftSideBar";
import TweetCard from "../Tweets/TweetCard.jsx";
import { useState } from "react";
import axios from "axios";
import SpinnerWithText from "../LoadingSpinner.jsx";
//  import CurrentUserProfile from './CurrentUserProfile.jsx'
import LeftSideBarUserProfile from "./LeftSideBarUserProfile.jsx";
import Logo from "./Logo.jsx";
import ChatNotification from "./ChatNotification.jsx";
import TweetNotification from "./TweetNotifications.jsx";
import SettingsComponent from "./Settings.jsx";
// import CreatePostButton from './CreatePostButton.jsx'
import CreatePostComponent from "./PostCreate/CreatePostComponent.jsx";


function Dashboard() {
  const Url = import.meta.env.VITE_API_URL;
  const [tweets, setTweets] = useState([]);
  const [isLoading, setIsLoading] = useState(true)
  const [chatNotification, setChatNotification] = useState([]);
  const data = ["hello", "world", "this", "is", "a", "test"];
 
//  frtching data of all new unread chat messages
  const getChatMessage = async()=>{
    try{
      const notifications = await axios.get(`${Url}/notification/chatsNotifications`,{withCredentials:true})
      if(!notifications) throw new Error("notifications are not available at moment")
        setChatNotification(notifications.data.response)
        console.log("notifications fetched:",notifications.data.response)
    }
    catch(err){
       console.log("something went wrong in fetching  chat notifications",err)
    }
    

  }
  // useEffect for fetching data at first time
  useEffect(() => {
    const fetchTweet = async () => {
      const response = await axios.get(`${Url}/tweet/getAllTweets`, {
        withCredentials: true,
      });
      if (!response) throw new Error("unable to fetch tweets at moment");
      setIsLoading(false);
      console.log("tweets fetched;;", response.data.response);
      setTweets(response.data.response);
    };
    fetchTweet();
    getChatMessage();
  }, []);
 const  newDate = (currentDate)=>{
   const updatedDate = new Date(currentDate);
   const timeAgo =formatDistanceToNow(updatedDate, { addSuffix: true });
   return timeAgo;
 }
  return (
    <div className=" grid  sm:grid-cols-12   gap-1 min-h-full min-w-full overflow-hidden relative">
      {/*  left sidebar */}
      <div className=" sm:col-span-2  sm:block shadow-md px-2 py-2 bg-inherit bg-opacity-30 ">
        <Logo />
        <LeftSideBarUserProfile />

        <div className="py-2 my-2">
          <LeftSideBar />
        </div>
      </div>

      {/* centerContent */}
      <div className=" sm:col-span-7  bg-blue-500 relative shadow-sm bg-opacity-15 rounded-2xl px-3 py-4 w-full h-full overflow-y-scroll scrollbar-custom overflow-x-hidden ">
        <div id="createPost" className="flex justify-center items-center  ">
          <CreatePostComponent variableClassName={"w-full"} />
        </div>
        <div
          id="tweets_area"
          className="h-auto sm:min-w-full shadow-lg  bg-blue-500 bg-opacity-15 my-3 rounded-2xl "
        >
          <DashboardNavbar />
          <div className="sm:h-full sm:w-full grid  md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 py-3 ">
          { isLoading? <SpinnerWithText designClass="absolute top-1/2 right-1/2 " /> :

          
          tweets &&
            tweets.map((item, index) => (
              <TweetCard
                currentTweetId={item?._id}
                currentUserId={item?.UserData[0]?._id}
                key={index}
                profilePicSrc={item.UserData[0].profilePicture}
                content={item.TextContent}
                username={item.UserData[0].fullName}
                 handle={item.UserData[0].userName}
                 likes={""}
                 timestamp={newDate(item.UserData[0].updatedAt)}
                 
                 comments={""}
                 retweets={""}

              />
            ))}
          </div>
        
          {/* <TweetCard/> */}
        </div>
      </div>
      {/* rightSideBar */}
      <div className=" flex flex-col p-4  bg-inherit sm:col-span-3  rounded-2xl bg-opacity-15 shadow-md gap-4 overflow-y-scroll scroll-smooth scrollbar-custom ">
        <div
          id="trending_topics"
          className="sm:min-w-full sm:h-[35vh] bg-blue-700 rounded-2xl shadow-lg bg-opacity-15 p-2"
        >
          <h1 className="text-blue-500 font-bold text-lg  px-2 py-4">
            Trending Topics
          </h1>
          <div className="flex flex-col gap-2">
            <p className="text-blue-300">#Topic1</p>
            <p className="text-blue-300">#Topic2</p>
            <p className="text-blue-300">#Topic3</p>
            <p className="text-blue-300">#Topic4</p>
          </div>
        </div>

        <div
          id="chatNotification"
          className="sm:min-w-full sm:h-[35vh] bg-blue-700 rounded-2xl shadow-lg bg-opacity-15 p-2 overflow-y-clip"
        >
          <h1 className="text-blue-500 font-bold text-lg px-2 py-4">
            Chat Notifications
          </h1>
          <div className="flex flex-col gap-2 overflow-y-scroll scrollbar-custom max-h-full rounded-2xl  p-2">
            {chatNotification && chatNotification.map((item, index) => (
              <ChatNotification
                key={index}
                profilePicSrc={item.profilePicture}
                notificationReceived={true}
                content={item.content}
                notificationId={item?._id}
                convoID={item.conversationId}
              />
            ))}
            {/* <ChatNotification/> */}
          </div>
        </div>

        <div
          id="tweetNotification"
          className="sm:min-w-full sm:h-[35vh] bg-blue-700 rounded-2xl shadow-lg bg-opacity-15 p-2 overflow-y-clip"
        >
          <h1 className="text-blue-500 font-bold text-lg  px-2 py-4">
            Tweet Notifications
          </h1>
          <div className="flex flex-col gap-2 overflow-y-scroll scrollbar-custom max-h-full  ">
            {data.map((item, index) => (
              <TweetNotification
                key={index}
                profilePicSrc={`https://picsum.photos/seed/${index}/200/200`}
                notificationReceived={true}
              />
            ))}
            {/* <ChatNotification/> */}
          </div>
          {/* <TweetNotification/> */}
        </div>

        <div
          id="settings"
          className="sm:min-w-full sm:h-[35vh] bg-blue-700 rounded-2xl shadow-lg bg-opacity-15 p-2"
        >
          <SettingsComponent />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
