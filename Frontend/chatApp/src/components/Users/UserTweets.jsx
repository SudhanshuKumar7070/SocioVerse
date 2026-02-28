import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MessageSquare } from "lucide-react";
import TweetCard from "../Tweets/TweetCard";
import MobileBottomNav from "../DashBoard/MobileBottomNav";
import SpinnerWithText from "../LoadingSpinner";
function UserTweets() {
  const refrer = useRef(null);
  const { tweet_id } = useParams();
  const navigate = useNavigate();
  const [userTweet, setUserTweet] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [content, setContent] = useState([]);
  
  
  const fetchTweet = async (tweet_id) => {
    setLoading(true);
    setErr("");
    try {
      console.log("Fetching tweet with ID:", tweet_id);
      const res = await axios.get(
        `http://localhost:3000/api/v1/tweet/getTweetById/${tweet_id}`,
        {
          withCredentials: true,
        }
      );

      const tweetData = res?.data?.response;
      console.log(tweetData);
      if (!tweetData) throw new Error("No tweet found");
      setLoading(false);
      setUserTweet(tweetData);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching tweet:", error);
      setErr("Failed to load tweet");
    } finally {
      setLoading(false);
    }
  };

  const fetchOwnerTweet = async (userId) => {
    setLoading(true);
    try {
      const tweetResponse = await axios.get(
        `http://localhost:3000/api/v1/tweet/userTweets/${userId}`,{
          withCredentials:true
        }
      );
      if (!tweetResponse)
        throw new Error("error at getting response of user contents");
       console.log("resposnse of the users cont", tweetResponse.data.response)
      setLoading(false);
      setContent(tweetResponse.data.response[0]?.UserTweets);
    } catch (err) {
      setLoading(false);
      setErr(err.message);
      console.log("error occured in fetching extra content of user", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (tweet_id) fetchTweet(tweet_id);
  }, [tweet_id]);

  useEffect(() => {
    if (userTweet)
      fetchOwnerTweet(userTweet.owner_data[0]._id);
  }, [userTweet]);
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-x-hidden flex flex-col pb-20 md:pb-0">
      
      {/* Header Container */}
      <div className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50 px-4 py-4 sm:px-8">
        <div className="w-full max-w-3xl mx-auto flex items-center justify-between">
          <button 
            className="group flex items-center gap-2 px-3 sm:px-4 py-2 bg-slate-800/50 hover:bg-slate-700/80 border border-slate-700/50 rounded-xl text-slate-300 hover:text-white transition-all duration-300 shadow-sm" 
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform duration-200" />
            <span className="text-sm sm:text-base font-medium font-poppins">Back</span>
          </button>
          
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-100 font-montserrat flex items-center gap-2">
            Post Details
          </h1>
          
          <div className="w-[70px] sm:w-[88px]"></div> {/* Spacer */}
        </div>
      </div>

      <div className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col gap-6">
        
        {/* Loading / Error States */}
        {loading && (
          <div className="flex justify-center py-8">
            <SpinnerWithText text="Loading tweet..." />
          </div>
        )}
        {err && (
          <div className="bg-rose-500/10 border border-rose-500/50 text-rose-400 p-4 rounded-xl text-center font-montserrat">
            {err}
          </div>
        )}

        {/* Main Origin Tweet */}
        {userTweet && userTweet.owner_data?.[0] && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <TweetCard
              profilePicSrc={userTweet.owner_data[0].profilePicture}
              username={userTweet.owner_data[0].fullName}
              content={userTweet.TextContent}
              imageContent={userTweet.imageUrl}
              handle={userTweet.owner_data[0].userName}
            />
          </div>
        )}

        {/* Related Tweets Divider */}
        {content && content.length > 0 && (
          <div className="w-full mt-6 mb-2">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-px bg-slate-700/50 flex-1"></div>
              <h2 className="font-semibold text-slate-400 font-montserrat flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                More from @{userTweet?.owner_data?.[0]?.userName}
              </h2>
              <div className="h-px bg-slate-700/50 flex-1"></div>
            </div>
            
            {/* Related Tweets Feed */}
            <div className="flex flex-col gap-4">
              {content.map((cont, index) => (
                <div 
                  key={cont._id} 
                  className="animate-in fade-in slide-in-from-bottom-4" 
                  style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'both' }}
                >
                  <TweetCard
                    profilePicSrc={userTweet.owner_data[0].profilePicture}
                    username={userTweet.owner_data[0].fullName}
                    content={cont?.TextContent}
                    imageContent={cont?.imageUrl}
                    handle={userTweet.owner_data[0].userName}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Navigation */}
      <MobileBottomNav />
    </div>
  );
}

export default UserTweets;
