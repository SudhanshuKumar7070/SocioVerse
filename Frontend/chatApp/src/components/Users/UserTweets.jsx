import React, { useState, useEffect } from "react";
import axios from "axios";
import TweetCard from "../Tweets/TweetCard";
import { useParams } from "react-router-dom";
import { useRef } from "react";

function UserTweets() {
  const refrer = useRef(null);
  const { tweet_id } = useParams();
  const [userTweet, setUserTweet] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [content, setContent] = useState([]);
  const [isHovered, setIsHovered]= useState(false);
  
  
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
    <div className="min-h-full min-w-full border border-red-500 relative">
      <nav className="max-w-6xl  px-2 py-6   fixed top-2 left-0 right-0 mx-auto      to-slate-900/95  border border-slate-600/50 hover:border-slate-500/70 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 backdrop-blur-md">
        <ul className="flex justify-around  items-center">
          <li className="font-poppins text-blue-300 hover:scale-110 transition-all duration-300 cursor-pointer hover:text-blue-500">Home</li>
          <li className="font-poppins text-blue-300 hover:scale-110 transition-all duration-300 cursor-pointer hover:text-blue-500">Info</li>
          <li className="font-poppins text-blue-300 hover:scale-110 transition-all duration-300 cursor-pointer hover:text-blue-500">Contacts</li>
        </ul>
      </nav>
      {/* aim is to , give this a better view */}
      {loading && (
        <p className=" text-blue-500 tracking-tight leading-tight font-montserrat mx-auto ">
          Loading tweet...
        </p>
      )}
      {err && <p className="text-red-500">{err}</p>}
      <div className="max-w-4xl mt-24 min-h-auto  mx-auto">
        {userTweet && userTweet.owner_data?.[0] && (
          <TweetCard
            profilePicSrc={userTweet.owner_data[0].profilePicture}
            username={userTweet.owner_data[0].fullName}
            content={userTweet.TextContent}
            imageContent={userTweet.imageUrl}
            handle={userTweet.owner_data[0].userName}
          />
        )}
      </div>
      <div
        id="more_user_contents"
          ref={refrer}
        className={`max-w-4xl my-2  border-2  border-slate-600/50   backdrop-blur-md   rounded-2xl shadow-xl  transition-all duration-300 mx-auto px-4 py-6  ${isHovered?"border-slate-500/70 ":""} `}
      >
        <h1 className="font-semibold text-blue-300 tracking-tight font-montserrat">
          more related tweets
        </h1>
      </div>

      <div  className="max-w-4xl   scrollbar-custom mx-auto  h-full overflow-y-auto  ">
        {content &&
          content.map((cont, index) => (
                     <TweetCard
                    onMouseLeave={()=>{
                      setIsHovered(!isHovered);
                    }}
                     key={cont._id}
            profilePicSrc={userTweet.owner_data[0].profilePicture}
            username={userTweet.owner_data[0].fullName}
            content={cont?.TextContent}
            imageContent={cont?.imageUrl}
            handle={userTweet.owner_data[0].userName}
          />
          ))}
      </div>
    </div>
  );
}

export default UserTweets;
