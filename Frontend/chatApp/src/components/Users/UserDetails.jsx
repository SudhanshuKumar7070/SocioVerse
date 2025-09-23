import React from "react";
import { useParams } from "react-router-dom";
import {
  Plus,
  MapPin,
  Calendar,
  ExternalLink,
  UserPlus,
  Heart,
  MessageCircle,
} from "lucide-react";
import axios from "axios";
import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";

export default function UserDetails() {
  const { userId } = useParams();
  console.log(userId);
  const [followers, setFollowers] = useState("");
  const [following, setFollowings] = useState("");
  const [friends, setFriends] = useState("");
  const [data, setData] = useState({});
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFriend, setIsFriend] = useState(false);
  const [loading, setLoading] = useState(false);

  const Url = import.meta.env.VITE_API_URL;

  // handling friendRequest..
  const handleSendFriendRequest = async () => {
    setLoading(true);
    try {
      const friendRequestResponse = await axios.post(
        `${Url}/friend_request/send_friend_request/${userId}`,
        { message: "you have requested for friend request" },
        { withCredentials: true }
      );
      if (!friendRequestResponse)
        throw new Error("something went wrong in sending friendrequest.");
      console.log(friendRequestResponse);
      setIsFriend(true);
    } catch (error) {
      console.log("error in sending friendrequest", error);
    } finally {
      setLoading(false);
    }
  };

  // handling following user..
  const handleFollowUser = async () => {
    setLoading(true);
    try {
      const followResponse = await axios.post(
        `${Url}/follow/followUser/${userId}`,
        { message: " sent message followed user" },
        {
          withCredentials: true,
        }
      );
      if (followResponse) {
        console.log("follow request sent successfully", followResponse.data);
        setIsFollowing(!isFollowing);
      }
    } catch (err) {
      console.log("error occurred in following user in user");
    } finally {
      setLoading(false);
    }
  };

  const fetchData = useCallback(async () => {
    const response = await axios.get(`${Url}/user/user_data/${userId}`, {
      withCredentials: true,
    });
    if (!response) console.log("response not found");
    console.log("response", response.data);
    setData(response.data.response[0]);
    console.log(data);
  }, [userId]);

  useEffect(() => {
    const fetchNewdata = async () => {
      await fetchData();
    };
    fetchNewdata();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Cover Image Section */}
      <div className="relative">
        <div
          className="h-64 md:h-80 w-full bg-gradient-to-r from-cyan-500/20 to-purple-600/20 relative overflow-hidden"
          style={{
            background: data?.bio?.bannerImage
              ? `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.5)), url(${data?.bio?.bannerImage})`
              : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />

          {/* Decorative elements */}
          <div className="absolute top-4 right-4 opacity-20">
            <div className="w-32 h-32 rounded-full border border-white/30"></div>
          </div>
          <div className="absolute bottom-4 left-4 opacity-10">
            <div className="w-24 h-24 rounded-full bg-white/20"></div>
          </div>
        </div>

        {/* Profile Picture - Overlapping */}
        <div className="absolute -bottom-16 left-8 md:left-12">
          <motion.div
            className="relative"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 p-1 shadow-2xl">
              <img
                src={
                  data?.profilePicture ||
                  "https://picsum.photos/seed/user/200/200"
                }
                alt="Profile"
                className="w-full h-full rounded-full object-cover border-4 border-slate-900"
              />
            </div>
            {/* Online indicator */}
            <div className="absolute bottom-2 right-2 w-6 h-6 bg-emerald-500 rounded-full border-4 border-slate-900"></div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-8 md:px-12 pt-20 pb-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Profile Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Info */}
              <motion.div
                className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                      {data?.userName || "Username"}
                    </h1>
                    <p className="text-slate-400 text-lg">
                      @{data?.handle || "userhandle"}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <motion.button
                      className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold transition-all duration-200 ${
                        isFollowing
                          ? "bg-slate-700 text-white hover:bg-slate-600"
                          : "bg-cyan-500 hover:bg-cyan-600 text-white hover:scale-105"
                      }`}
                      onClick={handleFollowUser}
                      disabled={loading}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {isFollowing ? (
                        <Heart className="w-4 h-4 fill-current" />
                      ) : (
                        <UserPlus className="w-4 h-4" />
                      )}
                      {isFollowing ? "Following" : "Follow"}
                    </motion.button>

                    <motion.button
                      className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold transition-all duration-200 ${
                        isFriend
                          ? "bg-emerald-600 text-white hover:bg-emerald-700"
                          : "bg-white text-slate-900 hover:bg-slate-100 hover:scale-105"
                      }`}
                      onClick={handleSendFriendRequest}
                      disabled={loading}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {isFriend ? (
                        <Heart className="w-4 h-4 fill-current" />
                      ) : (
                        <Plus className="w-4 h-4" />
                      )}
                      {isFriend ? "Friends" : "Add Friend"}
                    </motion.button>

                    <motion.button
                      className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-slate-700 text-white hover:bg-slate-600 font-semibold transition-all duration-200"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <MessageCircle className="w-4 h-4" />
                      Message
                    </motion.button>
                  </div>
                </div>

                {/* Bio */}
                {data?.bio?.text && (
                  <p className="text-slate-200 text-lg leading-relaxed mb-4">
                    {data.bio.text}
                  </p>
                )}

                {/* Location & Date */}
                <div className="flex flex-wrap gap-4 text-slate-400">
                  {data?.bio?.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>
                        {data.bio.location.city}, {data.bio.location.country}
                      </span>
                    </div>
                  )}
                  {data?.bio?.dateOfBirth && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>
                        Born{" "}
                        {new Date(data.bio.dateOfBirth).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Social Links */}
              {data?.bio?.socialLinks && data.bio.socialLinks.length > 0 && (
                <motion.div
                  className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h3 className="text-xl font-semibold text-white mb-4">
                    Social Links
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {data.bio.socialLinks.map((link, index) => (
                      <motion.a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 bg-slate-700/50 hover:bg-slate-700 rounded-xl transition-all duration-200 group"
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-lg flex items-center justify-center">
                          <ExternalLink className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-white capitalize">
                            {link.platform}
                          </p>
                          <p className="text-sm text-slate-400 group-hover:text-slate-300 truncate">
                            {link.url}
                          </p>
                        </div>
                      </motion.a>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Right Column - Stats */}
            <div className="space-y-6">
              <motion.div
                className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h3 className="text-xl font-semibold text-white mb-6">Stats</h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl hover:bg-slate-700/50 transition-colors cursor-pointer">
                    <div>
                      <p className="text-slate-400 text-sm">Followers</p>
                      <p className="text-2xl font-bold text-cyan-400">
                        {data?.Followers?.length || 0}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-cyan-400/20 rounded-full flex items-center justify-center">
                      <UserPlus className="w-6 h-6 text-cyan-400" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl hover:bg-slate-700/50 transition-colors cursor-pointer">
                    <div>
                      <p className="text-slate-400 text-sm">Following</p>
                      <p className="text-2xl font-bold text-purple-400">
                        {data?.Following?.length || 0}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-purple-400/20 rounded-full flex items-center justify-center">
                      <Heart className="w-6 h-6 text-purple-400" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl hover:bg-slate-700/50 transition-colors cursor-pointer">
                    <div>
                      <p className="text-slate-400 text-sm">Friends</p>
                      <p className="text-2xl font-bold text-emerald-400">
                        {data?.Friends?.length || data?.Followers?.length || 0}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-emerald-400/20 rounded-full flex items-center justify-center">
                      <MessageCircle className="w-6 h-6 text-emerald-400" />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Quick Actions */}
              <motion.div
                className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h3 className="text-xl font-semibold text-white mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <button className="w-full p-3 bg-slate-700/50 hover:bg-slate-700 rounded-xl text-left text-slate-200 hover:text-white transition-all">
                    View Posts
                  </button>
                  <button className="w-full p-3 bg-slate-700/50 hover:bg-slate-700 rounded-xl text-left text-slate-200 hover:text-white transition-all">
                    Mutual Friends
                  </button>
                  <button className="w-full p-3 bg-slate-700/50 hover:bg-slate-700 rounded-xl text-left text-slate-200 hover:text-white transition-all">
                    Block User
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
