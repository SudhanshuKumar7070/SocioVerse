import  { useEffect } from "react";
import {formatDistanceToNow} from "date-fns"
import DashboardNavbar from "./DashboardNavbar";
import LeftSideBar from "./LeftSideBar";
import MobileBottomNav from "./MobileBottomNav"; // Added Mobile Navbar
import TweetCard from "../Tweets/TweetCard.jsx";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SpinnerWithText from "../LoadingSpinner.jsx";
//  import CurrentUserProfile from './CurrentUserProfile.jsx'
import LeftSideBarUserProfile from "./LeftSideBarUserProfile.jsx";
import Logo from "./Logo.jsx";
import ChatNotification from "./ChatNotification.jsx";
import TweetNotification from "./TweetNotifications.jsx";
import SettingsComponent from "./Settings.jsx";
import { useSelector } from "react-redux";
// import CreatePostButton from './CreatePostButton.jsx'
import CreatePostComponent from "./PostCreate/CreatePostComponent.jsx";
import { ToastContainer } from "react-toastify";


function Dashboard() {
  const Url = import.meta.env.VITE_API_URL;
  const [tweets, setTweets] = useState([]);
  const [isLoading, setIsLoading] = useState(true)
  const [chatNotification, setChatNotification] = useState([]);
  const data = ["hello", "world", "this", "is", "a", "test"];
 const [follower,setFollower] = useState({followerCount:0,followingCount:0});
//  frtching data of all new unread chat messages
 const user_Id = useSelector((state) => state.auth.userData?._id)
console.log("check_user_id", user_Id);
const navigate = useNavigate();
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
  // useEffect to get current user follower and following details
  useEffect(()=>{
     const fetchData = async()=>{
      try{
     
  const res = await axios.get(`${Url}/user/user_data/${user_Id}`,{withCredentials:true})
  console.log("check what we getting at follower::", res)
   if(!res){
      throw new Error("unable to fetch user data");
   }
   setFollower({
    followerCount:res.data.response[0].Followers.length,
    followingCount:res.data.response[0].Following.length
   })
  
      }
      catch(err){
        console.log("error creating fetch follwer=>",err)
        
      }
     }
     fetchData();
     
  },[])
  // useEffect for fetching all available tweets  
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
   console.log(follower)
// method to get notification for notification
 
  return (
    <div className="flex flex-col md:grid md:grid-cols-12 gap-1 min-h-[100dvh] w-full overflow-x-hidden relative pb-16 md:pb-0">
      {/* <ToastContainer/> */}
      {/*  left sidebar (hidden on mobile, visible on desktop) */}
      <div className="hidden md:block md:col-span-2 shadow-md px-2 py-2 bg-opacity-30">
        <Logo />
        <LeftSideBarUserProfile followers = {follower.followerCount}  followings ={follower.followingCount} />
        <div className="py-2 my-2">
          <LeftSideBar />
        </div>
      </div>

      {/* centerContent (full width on mobile, 7 cols on desktop) */}
      <div className="w-full md:col-span-7 relative shadow-sm rounded-2xl px-3 py-4 h-full overflow-y-scroll scrollbar-custom overflow-x-hidden">
        <ToastContainer/>
        <div id="createPost" className="flex justify-center items-center  ">
          <CreatePostComponent variableClassName={"w-full"} />
        </div>
        <div
          id="tweets_area"
          className="h-auto w-full max-w-full shadow-lg bg-blue-950/15 my-3 rounded-2xl "
        >
          <DashboardNavbar />
          <div className=" mx-auto sm:h-full sm:max-w-[70%] grid  md:grid-cols-1 gap-6 px-4 py-3 ">
          { isLoading? <SpinnerWithText designClass="absolute top-1/2 right-1/2 " /> :

          
          tweets &&
            tweets.map((item, index) => (
              <TweetCard
                currentTweetId={item?._id}
                isLiked={item?.isLikedByUser}
                currentUserId={item?.UserData[0]?._id}
                key={index}
                profilePicSrc={item.UserData[0].profilePicture}
                content={item.TextContent}
                imageContent={item.imageUrl}
                username={item.UserData[0].fullName}
                 handle={item.UserData[0].userName}
                 likes={item?.likeCount}
                 timestamp={item.UserData[0].createdAt}
                  className={"cursor-pointer"}
                 comments={""}
                 retweets={""}
                onClick={()=>{
                  navigate(`/tweet/${item?._id}`)
                }}
              />
            ))}
          </div>
        
          {/* <TweetCard/> */}
        </div>
      </div>
      {/* rightSideBar (hidden on mobile, visible on large screens to avoid crowding) */}
      <div className="hidden lg:flex flex-col p-4 bg-inherit lg:col-span-3 rounded-2xl bg-opacity-15 shadow-md gap-4 overflow-y-scroll scroll-smooth scrollbar-custom">
        <div
          id="trending_topics"
          className="w-full sm:h-[35vh] bg-blue-700 border border-slate-700 rounded-2xl shadow-lg bg-opacity-15 p-2"
        >
          <h1 className="text-sky-500 font-semibold text-sm font-poppins  px-2 py-4">
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
          className="w-full sm:h-[35vh] border border-slate-700 rounded-xl shadow-lg bg-opacity-15 bg-blue-950 p-2 overflow-y-clip"
        >
          <h1 className="text-sky-300 font-poppins font-semibold text-sm px-2 py-4 ">
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
          className="w-full sm:h-[35vh] border border-slate-700 bg-blue-950 rounded-xl shadow-lg bg-opacity-15 p-2 overflow-y-clip "
        >
          <h1 className="text-sky-300 font-semibold text-md font-poppins   px-2 py-4">
            Tweet Notifications
          </h1>
          <div className="flex flex-col gap-2 overflow-y-scroll scrollbar-custom max-h-full  ">
            {data.map((item, index) => (
              <TweetNotification
                key={index}
                profilePicSrc={`https://picsum.photos/seed/${index}/200/200`}
                notificationReceived={false}
              />
            ))}
            {/* <ChatNotification/> */}
          </div>
          {/* <TweetNotification/> */}
        </div>

        <div
          id="settings"
          className="w-full sm:h-[35vh] rounded-xl shadow-xl bg-opacity-30 p-2 border border-slate-700 "
        >
          <SettingsComponent />
        </div>
      </div>
      
      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav />
    </div>
  );
}

export default Dashboard;
