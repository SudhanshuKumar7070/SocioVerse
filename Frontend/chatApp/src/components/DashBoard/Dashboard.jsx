import { useEffect, useState, useRef } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import DashboardNavbar from "./DashboardNavbar";
import LeftSideBar from "./LeftSideBar";
import MobileBottomNav from "./MobileBottomNav";
import TweetCard from "../Tweets/TweetCard.jsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LeftSideBarUserProfile from "./LeftSideBarUserProfile.jsx";
import Logo from "./Logo.jsx";
import ChatNotification from "./ChatNotification.jsx";
import TweetNotification from "./TweetNotifications.jsx";
import SettingsComponent from "./Settings.jsx";
import { useSelector } from "react-redux";
import CreatePostComponent from "./PostCreate/CreatePostComponent.jsx";
import { ToastContainer } from "react-toastify";

// Skeleton Placeholder Component for smooth pagination transitions
const TweetSkeleton = () => (
  <div className="w-full bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 sm:p-5 shadow-lg animate-pulse">
    <div className="flex items-center gap-3 mb-3">
      <div className="w-10 h-10 rounded-full bg-slate-800 shrink-0" />
      <div className="flex flex-col gap-1.5 flex-1">
        <div className="w-32 h-3.5 bg-slate-800 rounded" />
        <div className="w-20 h-2.5 bg-slate-800/70 rounded" />
      </div>
    </div>
    <div className="space-y-2 mb-4">
      <div className="w-full h-3 bg-slate-800/90 rounded" />
      <div className="w-5/6 h-3 bg-slate-800/90 rounded" />
      <div className="w-3/4 h-3 bg-slate-800/60 rounded" />
    </div>
    <div className="flex justify-between items-center pt-2 border-t border-slate-800/50">
      <div className="w-12 h-4 bg-slate-800/60 rounded" />
      <div className="w-12 h-4 bg-slate-800/60 rounded" />
      <div className="w-12 h-4 bg-slate-800/60 rounded" />
    </div>
  </div>
);

function Dashboard() {
  const Url = import.meta.env.VITE_API_URL;
  const [tweets, setTweets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [chatNotification, setChatNotification] = useState([]);
  const [follower, setFollower] = useState({ followerCount: 0, followingCount: 0 });
  const data = ["hello", "world", "this", "is", "a", "test"];

  const isFetchingRef = useRef(false);
  const user_Id = useSelector((state) => state.auth.userData?._id);
  const navigate = useNavigate();

  const getChatMessage = async () => {
    try {
      const notifications = await axios.get(`${Url}/notification/chatsNotifications`, {
        withCredentials: true,
      });
      if (notifications?.data?.response) {
        setChatNotification(notifications.data.response);
      }
    } catch (err) {
      console.error("something went wrong in fetching chat notifications", err);
    }
  };

  // Fetch initial batch (Page 1)
  const fetchInitialTweets = async () => {
    setIsLoading(true);
    isFetchingRef.current = true;
    try {
      const response = await axios.get(`${Url}/tweet/getAllTweets?page=1&limit=10`, {
        withCredentials: true,
      });
      const resData = response?.data?.response;
      if (resData?.tweets && Array.isArray(resData.tweets)) {
        setTweets(resData.tweets);
        setPage(1);
        setHasMore(resData.hasNextPage ?? false);
      } else if (Array.isArray(resData)) {
        setTweets(resData);
        setHasMore(false);
      } else {
        setTweets([]);
        setHasMore(false);
      }
    } catch (err) {
      console.error("unable to fetch tweets at moment", err);
      setTweets([]);
      setHasMore(false);
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  };

  // Fetch subsequent batch with ref-lock
  const fetchNextTweets = async () => {
    if (isFetchingRef.current || !hasMore) return;
    isFetchingRef.current = true;

    const nextPage = page + 1;
    try {
      const response = await axios.get(`${Url}/tweet/getAllTweets?page=${nextPage}&limit=10`, {
        withCredentials: true,
      });
      const resData = response?.data?.response;
      const newTweets = resData?.tweets;

      if (Array.isArray(newTweets) && newTweets.length > 0) {
        setTweets((prev) => {
          const existingIds = new Set(prev.map((t) => t?._id?.toString()));
          const filteredNew = newTweets.filter((t) => t?._id && !existingIds.has(t._id.toString()));
          return [...prev, ...filteredNew];
        });
        setPage(nextPage);
        setHasMore(resData.hasNextPage ?? false);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error("error fetching more tweets", err);
      setHasMore(false);
    } finally {
      isFetchingRef.current = false;
    }
  };

  // useEffect to get current user follower and following details
  useEffect(() => {
    const fetchData = async () => {
      if (!user_Id) return;
      try {
        const res = await axios.get(`${Url}/user/user_data/${user_Id}`, {
          withCredentials: true,
        });
        if (res?.data?.response?.[0]) {
          setFollower({
            followerCount: res.data.response[0].Followers?.length || 0,
            followingCount: res.data.response[0].Following?.length || 0,
          });
        }
      } catch (err) {
        console.error("error fetching follower data =>", err);
      }
    };
    fetchData();
  }, [user_Id]);

  // useEffect for initial load
  useEffect(() => {
    fetchInitialTweets();
    getChatMessage();
  }, []);

  return (
    <div className="flex h-screen w-full overflow-hidden relative pb-16 md:pb-0 gap-2 p-1 sm:p-2 bg-transparent">
      <ToastContainer />

      {/* 1. LEFT SIDEBAR: Pinned on Desktop (Width: 260px), internally scrollable */}
      <aside className="hidden md:flex flex-col w-64 lg:w-72 shrink-0 h-full shadow-lg p-2 bg-slate-900/40 rounded-2xl border border-slate-800/60 overflow-y-auto scrollbar-custom gap-2">
        <Logo />
        <LeftSideBarUserProfile
          followers={follower.followerCount}
          followings={follower.followingCount}
        />
        <div className="w-full">
          <LeftSideBar />
        </div>
      </aside>

      {/* 2. CENTER SECTION: Static CreatePost & Navbar + Independent Scrollable Tweets Container */}
      <main className="flex-1 min-w-0 flex flex-col h-full overflow-hidden p-1 sm:p-2">
        {/* Pinned Component 1: Create Post */}
        <div id="createPost" className="w-full shrink-0 pb-2">
          <CreatePostComponent variableClassName="w-full" />
        </div>

        {/* Pinned Component 2: Dashboard Categories Navbar */}
        <div className="w-full shrink-0 pb-2 z-10">
          <DashboardNavbar />
        </div>

        {/* ONLY SCROLLABLE TWEET FEED CONTAINER */}
        <div
          id="scrollableTweetsContainer"
          className="flex-1 w-full overflow-y-auto scrollbar-custom bg-blue-950/20 rounded-2xl shadow-inner px-2 sm:px-4 py-3"
        >
          <div className="mx-auto w-full max-w-2xl px-1">
            {isLoading ? (
              <div className="flex flex-col gap-6 py-4">
                <TweetSkeleton />
                <TweetSkeleton />
                <TweetSkeleton />
              </div>
            ) : tweets.length === 0 ? (
              <div className="text-center py-16 text-slate-400">
                <p className="text-sm">No tweets to display right now.</p>
              </div>
            ) : (
              <InfiniteScroll
                dataLength={tweets.length}
                next={fetchNextTweets}
                hasMore={hasMore}
                scrollThreshold={0.8}
                scrollableTarget="scrollableTweetsContainer"
                loader={
                  <div className="w-full flex flex-col gap-6 py-6 items-center">
                    <TweetSkeleton />
                    <div className="flex items-center gap-3 bg-slate-900/80 px-4 py-2 rounded-full border border-sky-500/20 shadow-md">
                      <div className="w-4 h-4 rounded-full border-2 border-sky-400 border-t-transparent animate-spin" />
                      <span className="text-xs text-sky-300 font-medium tracking-wide">
                        Loading older posts...
                      </span>
                    </div>
                  </div>
                }
                endMessage={
                  <div className="flex flex-col items-center justify-center py-8 gap-1.5 border-t border-slate-800/40 my-4 text-center">
                    <div className="w-2 h-2 rounded-full bg-sky-400 mb-1 animate-ping" />
                    <p className="text-xs font-semibold text-slate-400">
                      You're all caught up!
                    </p>
                    <p className="text-[11px] text-slate-500">
                      No more tweets to show in your feed.
                    </p>
                  </div>
                }
              >
                <div className="flex flex-col gap-6 pb-6">
                  {tweets.map((item, index) => {
                    const author = Array.isArray(item?.UserData)
                      ? item.UserData[0]
                      : item?.UserData || {};

                    return (
                      <TweetCard
                        key={item?._id || `tweet-${index}`}
                        currentTweetId={item?._id}
                        isLiked={Boolean(item?.isLikedByUser)}
                        currentUserId={author?._id || ""}
                        profilePicSrc={
                          author?.profilePicture ||
                          "https://picsum.photos/seed/default/200/200"
                        }
                        content={item?.TextContent || ""}
                        imageContent={item?.imageUrl || ""}
                        username={author?.fullName || "User"}
                        handle={author?.userName || "user"}
                        likes={item?.likeCount || 0}
                        timestamp={author?.createdAt || item?.createdAt || new Date().toISOString()}
                        className="cursor-pointer"
                        comments={""}
                        retweets={""}
                        onClick={() => {
                          if (item?._id) {
                            navigate(`/tweet/${item._id}`);
                          }
                        }}
                      />
                    );
                  })}
                </div>
              </InfiniteScroll>
            )}
          </div>
        </div>
      </main>

      {/* 3. RIGHT SIDEBAR: Fixed on Right Side on Desktop (Width: 320px), internally scrollable */}
      <aside className="hidden md:flex flex-col w-72 lg:w-80 shrink-0 h-full p-2 gap-3 overflow-y-auto scrollbar-custom bg-slate-900/40 rounded-2xl border border-slate-800/60 shadow-lg">
        {/* Trending Topics Card */}
        <div
          id="trending_topics"
          className="w-full shrink-0 min-h-[140px] max-h-[180px] bg-blue-700/20 border border-slate-700/60 rounded-2xl shadow-md p-3 flex flex-col overflow-hidden"
        >
          <h1 className="text-sky-400 font-semibold text-sm font-poppins pb-2 border-b border-slate-700/50">
            Trending Topics
          </h1>
          <div className="flex flex-col gap-1.5 overflow-y-auto scrollbar-custom pt-2 text-xs">
            <p className="text-blue-300 hover:text-sky-200 cursor-pointer transition">#Topic1</p>
            <p className="text-blue-300 hover:text-sky-200 cursor-pointer transition">#Topic2</p>
            <p className="text-blue-300 hover:text-sky-200 cursor-pointer transition">#Topic3</p>
            <p className="text-blue-300 hover:text-sky-200 cursor-pointer transition">#Topic4</p>
          </div>
        </div>

        {/* Chat Notifications Card */}
        <div
          id="chatNotification"
          className="w-full shrink-0 min-h-[180px] max-h-[220px] border border-slate-700/60 rounded-2xl shadow-md bg-blue-950/40 p-3 flex flex-col overflow-hidden"
        >
          <h1 className="text-sky-300 font-poppins font-semibold text-sm pb-2 border-b border-slate-700/50">
            Chat Notifications
          </h1>
          <div className="flex flex-col gap-2 overflow-y-auto scrollbar-custom flex-1 pt-2 pr-1">
            {chatNotification && chatNotification.length > 0 ? (
              chatNotification.map((item, index) => (
                <ChatNotification
                  key={index}
                  profilePicSrc={item.profilePicture}
                  notificationReceived={true}
                  content={item.content}
                  notificationId={item?._id}
                  convoID={item.conversationId}
                />
              ))
            ) : (
              <p className="text-xs text-slate-500 py-3 text-center">No new chat alerts</p>
            )}
          </div>
        </div>

        {/* Tweet Notifications Card */}
        <div
          id="tweetNotification"
          className="w-full shrink-0 min-h-[180px] max-h-[220px] border border-slate-700/60 bg-blue-950/40 rounded-2xl shadow-md p-3 flex flex-col overflow-hidden"
        >
          <h1 className="text-sky-300 font-semibold text-sm font-poppins pb-2 border-b border-slate-700/50">
            Tweet Notifications
          </h1>
          <div className="flex flex-col gap-2 overflow-y-auto scrollbar-custom flex-1 pt-2 pr-1">
            {data.map((item, index) => (
              <TweetNotification
                key={index}
                profilePicSrc={`https://picsum.photos/seed/${index}/200/200`}
                notificationReceived={false}
              />
            ))}
          </div>
        </div>

        {/* Settings Card */}
        <div
          id="settings"
          className="w-full shrink-0 rounded-2xl shadow-md bg-slate-900/60 p-4 border border-slate-700/60 flex items-center justify-center mt-auto"
        >
          <SettingsComponent />
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav />
    </div>
  );
}

export default Dashboard;
