import React, { useRef, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { MapPin, Settings, Calendar, ExternalLink, UserPlus, Heart, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import IconWithTooltip from './SettingIcon';
import ProfileSettingBar from './ProfileSettingBar';
import axios from 'axios';

function UserProfile() {
  const currentUser = useSelector((state) => state.auth?.userData);
  const userId = currentUser?._id;
  const refrer = useRef(null);
  const [errorMessage,setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [openSettingModel ,setOpenSettingModel] = useState(false);
  const [user,setUser] = useState({});
  
  const handleFollowUser = () => console.log('Follow user clicked');
  const handleSendFriendRequest = () => console.log('Friend request clicked');
  const handleOpnenSettingModel =()=>{
     openSettingModel?setOpenSettingModel(false):setOpenSettingModel(true)
  }
  // useeffect for fetching current user data
const fetch_user = async()=>{
  setLoading(true)
  try{
 const response = await axios.get()
  }
  catch(err){
setLoading(false);
setErrorMessage(err.message)
 console.log(err)
  }
  finally{
    setLoading(false)
  }
}
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-x-hidden relative pb-20 md:pb-0">
      
      {/* Settings Overlay */}
      <div className="absolute top-4 right-4 z-50">
        <IconWithTooltip onClick={handleOpnenSettingModel} styling={openSettingModel} />
        <ProfileSettingBar className={openSettingModel ? 'absolute top-12 right-0 bg-slate-800 shadow-2xl rounded-xl z-50 w-64 border border-slate-700' : "hidden"} />
      </div>

      {/* Cover Image Section */}
      <div className="relative">
        <div
          className="h-48 sm:h-64 md:h-80 w-full bg-gradient-to-r from-cyan-500/20 to-purple-600/20 relative overflow-hidden"
          style={{
            background: currentUser?.bio?.bannerImage
              ? `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.5)), url(${currentUser?.bio?.bannerImage})`
              : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
        </div>

        {/* Profile Picture - Overlapping */}
        <div className="absolute -bottom-12 sm:-bottom-16 left-4 sm:left-8 md:left-12">
          <motion.div
            className="relative"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 p-1 shadow-2xl">
              <img
                src={
                  currentUser?.profilePicture ||
                  "https://picsum.photos/seed/user/200/200"
                }
                alt="Profile"
                className="w-full h-full rounded-full object-cover border-4 border-slate-900"
              />
            </div>
            {/* Online indicator */}
            <div className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 w-5 h-5 sm:w-6 sm:h-6 bg-emerald-500 rounded-full border-4 border-slate-900"></div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-8 md:px-12 pt-16 sm:pt-20 pb-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            
            {/* Left Column - Profile Info */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Basic Info */}
              <motion.div
                className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-4 sm:p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                  <div className="min-w-0">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 sm:mb-2 truncate">
                      {currentUser?.userName || "Username"}
                    </h1>
                    <p className="text-slate-400 text-base sm:text-lg truncate">
                      @{currentUser?.handle || "userhandle"}
                    </p>
                  </div>
                </div>

                {/* Bio */}
                {currentUser?.bio?.text && (
                  <p className="text-slate-200 text-base sm:text-lg leading-relaxed mb-4 break-words whitespace-pre-wrap">
                    {currentUser.bio.text}
                  </p>
                )}

                {/* Location & Date */}
                <div className="flex flex-wrap gap-3 sm:gap-4 text-slate-400 text-sm sm:text-base">
                  {currentUser?.bio?.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 shrink-0" />
                      <span className="truncate max-w-[200px]">
                        {currentUser.bio.location.city}, {currentUser.bio.location.country}
                      </span>
                    </div>
                  )}
                  {currentUser?.bio?.dateOfBirth && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 shrink-0" />
                      <span>
                        Born{" "}
                        {new Date(currentUser.bio.dateOfBirth).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Social Links */}
              {currentUser?.bio?.socialLinks && currentUser.bio.socialLinks.length > 0 && (
                <motion.div
                  className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-4 sm:p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h3 className="text-lg sm:text-xl font-semibold text-white mb-4">
                    Social Links
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {currentUser.bio.socialLinks.map((link, index) => (
                      <motion.a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 bg-slate-700/50 hover:bg-slate-700 rounded-xl transition-all duration-200 group"
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="w-10 h-10 shrink-0 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-lg flex items-center justify-center">
                          <ExternalLink className="w-5 h-5 text-white" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-white capitalize truncate">
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
                className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-4 sm:p-6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6">Stats</h3>

                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center justify-between p-3 sm:p-4 bg-slate-700/30 rounded-xl hover:bg-slate-700/50 transition-colors cursor-pointer">
                    <div>
                      <p className="text-slate-400 text-xs sm:text-sm">Followers</p>
                      <p className="text-xl sm:text-2xl font-bold text-cyan-400">
                        {currentUser?.Followers?.length || 0}
                      </p>
                    </div>
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-cyan-400/20 rounded-full flex items-center justify-center">
                      <UserPlus className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 sm:p-4 bg-slate-700/30 rounded-xl hover:bg-slate-700/50 transition-colors cursor-pointer">
                    <div>
                      <p className="text-slate-400 text-xs sm:text-sm">Following</p>
                      <p className="text-xl sm:text-2xl font-bold text-purple-400">
                        {currentUser?.Following?.length || 0}
                      </p>
                    </div>
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-400/20 rounded-full flex items-center justify-center">
                      <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 sm:p-4 bg-slate-700/30 rounded-xl hover:bg-slate-700/50 transition-colors cursor-pointer">
                    <div>
                      <p className="text-slate-400 text-xs sm:text-sm">Friends</p>
                      <p className="text-xl sm:text-2xl font-bold text-emerald-400">
                        {currentUser?.Friends?.length || currentUser?.Followers?.length || 0}
                      </p>
                    </div>
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-400/20 rounded-full flex items-center justify-center">
                      <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400" />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Quick Actions */}
              <motion.div
                className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-4 sm:p-6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">
                  Account Management
                </h3>
                <div className="space-y-2 sm:space-y-3">
                  <button className="w-full p-2.5 sm:p-3 bg-slate-700/50 hover:bg-slate-700 rounded-xl text-left text-slate-200 hover:text-white transition-all text-sm sm:text-base">
                    Edit Profile
                  </button>
                  <button className="w-full p-2.5 sm:p-3 bg-slate-700/50 hover:bg-slate-700 rounded-xl text-left text-slate-200 hover:text-white transition-all text-sm sm:text-base">
                    Privacy Settings
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

export default UserProfile;
