import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TweetCard from '../Tweets/TweetCard';
import { useParams } from 'react-router-dom';

function UserTweets() {
  const { tweet_id } = useParams();
  const [userTweet, setUserTweet] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const fetchTweet = async (tweet_id) => {
    setLoading(true);
    setErr("");
    try {
      console.log("Fetching tweet with ID:", tweet_id);
      const res = await axios.get(`http://localhost:3000/api/v1/tweet/getTweetById/${tweet_id}`, {
        withCredentials: true,
      });

      const tweetData = res?.data?.response;
      console.log(tweetData)
      if (!tweetData) throw new Error("No tweet found");

      setUserTweet(tweetData);
    } catch (error) {
      console.error("Error fetching tweet:", error);
      setErr("Failed to load tweet");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tweet_id) fetchTweet(tweet_id);
  }, [tweet_id]);

  return (
    <div className="min-h-full min-w-full">
      <nav className='min-w-6xl  px-2 py-4  bg-blue-500/30 absolute top-2 left-0 right-0 mx-14 rounded-2xl shadow-md backdrop-blur-md'>
          <ul className='flex justify-around  items-center'>
            <li className='font-poppins'>Home</li>
            <li className='font-poppins'>Info</li>
            <li className='font-poppins'>Contacts</li>
          </ul>
        </nav>
      {/* aim is to , give this a better view */}
      {loading && <p>Loading tweet...</p>}
      {err && <p className="text-red-500">{err}</p>}
      <div className='max-w-4xl mt-16 h-auto  mx-auto'>
        
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

    </div>
  );
}

export default UserTweets;