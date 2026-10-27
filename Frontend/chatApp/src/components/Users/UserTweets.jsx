import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MessageSquare } from "lucide-react";
import InfiniteScroll from "react-infinite-scroll-component";
import TweetCard from "../Tweets/TweetCard";
import MobileBottomNav from "../DashBoard/MobileBottomNav";

// Reusable Tweet Skeleton Loader
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

function UserTweets() {
  const { tweet_id } = useParams();
  const navigate = useNavigate();

  const [userTweet, setUserTweet] = useState(null);
  const [loadingTweet, setLoadingTweet] = useState(true);
  const [err, setErr] = useState("");

  // Infinite scroll states for owner's more tweets
  const [ownerTweets, setOwnerTweets] = useState([]);
  const [ownerPage, setOwnerPage] = useState(1);
  const [hasMoreOwner, setHasMoreOwner] = useState(true);
  const [loadingOwnerTweets, setLoadingOwnerTweets] = useState(false);
  const isFetchingOwnerRef = useRef(false);

  // Fetch target single tweet details
  const fetchTweet = async (id) => {
    setLoadingTweet(true);
    setErr("");
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/tweet/getTweetById/${id}`,
        { withCredentials: true }
      );
      const tweetData = res?.data?.response;
      if (!tweetData) throw new Error("Tweet not found");
      
      setUserTweet(tweetData);
    } catch (error) {
      console.error("Error fetching tweet:", error);
      setErr("Failed to load post. It may have been deleted.");
    } finally {
      setLoadingTweet(false);
    }
  };

  // Fetch initial batch of more tweets from this author
  const fetchInitialOwnerTweets = async (userId) => {
    if (!userId) return;
    setLoadingOwnerTweets(true);
    isFetchingOwnerRef.current = true;
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/tweet/userTweets/${userId}?page=1&limit=6`,
        { withCredentials: true }
      );
      const resData = res?.data?.response;
      console.log("lets check the response for more tweets from the user ", resData);
      const list =
        resData?.tweets ||
        resData?.[0]?.UserTweets ||
        (Array.isArray(resData) ? resData : []);
      // Filter out the main tweet itself from the "More from author" list
      const filtered = list.filter((t) => t?._id?.toString() !== tweet_id?.toString());
      setOwnerTweets(filtered);
      setOwnerPage(1);
      setHasMoreOwner(resData?.hasNextPage ?? (list.length >= 6));
    } catch (err) {
      console.error("Error fetching author's more tweets:", err);
      setOwnerTweets([]);
      setHasMoreOwner(false);
    } finally {
      setLoadingOwnerTweets(false);
      isFetchingOwnerRef.current = false;
    }
  };

  // Fetch next batch for infinite scroll
  const fetchNextOwnerTweets = async () => {
    const ownerId = userTweet?.owner_data?.[0]?._id;
    if (!ownerId || isFetchingOwnerRef.current || !hasMoreOwner) return;
    isFetchingOwnerRef.current = true;

    const nextPage = ownerPage + 1;
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/tweet/userTweets/${ownerId}?page=${nextPage}&limit=6`,
        { withCredentials: true }
      );
      const resData = res?.data?.response;
      const newItems =
        resData?.tweets ||
        resData?.[0]?.UserTweets ||
        (Array.isArray(resData) ? resData : []);

      if (Array.isArray(newItems) && newItems.length > 0) {
        setOwnerTweets((prev) => {
          const existingIds = new Set(prev.map((t) => t?._id?.toString()));
          // ensure no duplicate or origin tweet
          const filtered = newItems.filter(
            (t) => t?._id && t._id.toString() !== tweet_id?.toString() && !existingIds.has(t._id.toString())
          );
          return [...prev, ...filtered];
        });
        setOwnerPage(nextPage);
        setHasMoreOwner(resData?.hasNextPage ?? false);
      } else {
        setHasMoreOwner(false);
      }
    } catch (err) {
      console.error("Error fetching more tweets:", err);
      setHasMoreOwner(false);
    } finally {
      isFetchingOwnerRef.current = false;
    }
  };

  useEffect(() => {
    if (tweet_id) {
      fetchTweet(tweet_id);
    }
  }, [tweet_id]);

  useEffect(() => {
    const authorId = userTweet?.owner_data?.[0]?._id;
    if (authorId) {
      fetchInitialOwnerTweets(authorId);
    }
  }, [userTweet, tweet_id]);

  const author = userTweet?.owner_data?.[0] || {};

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-x-hidden flex flex-col pb-20 md:pb-8">
      {/* Top Sticky Header */}
      <div className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50 px-4 py-3.5 sm:px-8">
        <div className="w-full max-w-3xl mx-auto flex items-center justify-between">
          <button
            className="group flex items-center gap-2 px-3 sm:px-4 py-2 bg-slate-800/60 hover:bg-slate-700/80 border border-slate-700/50 rounded-xl text-slate-300 hover:text-white transition-all duration-200 shadow-sm"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform duration-200" />
            <span className="text-sm font-medium font-poppins">Back</span>
          </button>

          <h1 className="text-base sm:text-lg md:text-xl font-bold text-slate-100 font-montserrat">
            Post Details
          </h1>

          <div className="w-[70px]"></div>
        </div>
      </div>

      <div className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-6">
        {/* Error Alert */}
        {err && (
          <div className="bg-rose-500/10 border border-rose-500/40 text-rose-300 p-4 rounded-xl text-center font-montserrat text-sm">
            {err}
          </div>
        )}

        {/* Origin Tweet Skeleton or Card */}
        {loadingTweet ? (
          <TweetSkeleton />
        ) : userTweet && author ? (
          <div className="animate-in fade-in slide-in-from-bottom-3 duration-300">
            <TweetCard
              currentTweetId={userTweet?._id}
              isLiked={Boolean(userTweet?.isLikedByUser)}
              currentUserId={author?._id || ""}
              profilePicSrc={author?.profilePicture || "https://picsum.photos/seed/default/200/200"}
              username={author?.fullName || "User"}
              content={userTweet?.TextContent || ""}
              imageContent={userTweet?.imageUrl || ""}
              handle={author?.userName || "user"}
              likes={userTweet?.likeCount || 0}
              timestamp={userTweet?.createdAt}
            />
          </div>
        ) : null}

        {/* More Posts from Author Section with Infinite Scroll */}
        {userTweet && (
          <div className="w-full mt-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-px bg-slate-800 flex-1" />
              <h2 className="font-semibold text-xs uppercase tracking-wider text-slate-400 font-montserrat flex items-center gap-2">
                <MessageSquare className="w-3.5 h-3.5 text-sky-400" />
                More from @{author?.userName || "user"}
              </h2>
              <div className="h-px bg-slate-800 flex-1" />
            </div>

            {loadingOwnerTweets ? (
              <div className="flex flex-col gap-4">
                <TweetSkeleton />
                <TweetSkeleton />
              </div>
            ) : ownerTweets.length === 0 ? (
              <p className="text-center py-6 text-xs text-slate-500 font-poppins">
                No other posts from this user yet.
              </p>
            ) : (
              <InfiniteScroll
                dataLength={ownerTweets.length}
                next={fetchNextOwnerTweets}
                hasMore={hasMoreOwner}
                loader={
                  <div className="py-4">
                    <TweetSkeleton />
                  </div>
                }
                endMessage={
                  <p className="text-center py-6 text-xs text-slate-500">
                    No more posts from this author.
                  </p>
                }
              >
                <div className="flex flex-col gap-5">
                  {ownerTweets.map((t, index) => {
                    const postAuthor = Array.isArray(t?.UserData)
                      ? t.UserData[0]
                      : t?.UserData || author;

                    return (
                      <TweetCard
                        key={t?._id || `owner-tweet-${index}`}
                        currentTweetId={t?._id}
                        isLiked={Boolean(t?.isLikedByUser)}
                        currentUserId={postAuthor?._id || ""}
                        profilePicSrc={postAuthor?.profilePicture || author?.profilePicture}
                        username={postAuthor?.fullName || author?.fullName}
                        content={t?.TextContent || ""}
                        imageContent={t?.imageUrl || ""}
                        handle={postAuthor?.userName || author?.userName}
                        likes={t?.likeCount || 0}
                        timestamp={t?.createdAt}
                        className="cursor-pointer"
                        onClick={() => {
                          if (t?._id) {
                            navigate(`/tweet/${t._id}`);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }
                        }}
                      />
                    );
                  })}
                </div>
              </InfiniteScroll>
            )}
          </div>
        )}
      </div>

      <MobileBottomNav />
    </div>
  );
}

export default UserTweets;
