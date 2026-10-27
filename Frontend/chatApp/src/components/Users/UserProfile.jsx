import React, { useRef, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  Calendar,
  ExternalLink,
  UserPlus,
  Heart,
  MessageCircle,
  ArrowLeft,
  Edit3,
  Mail,
  ShieldCheck,
  Sparkles,
  Share2,
  Check,
} from "lucide-react";
import { motion } from "framer-motion";
import IconWithTooltip from "./SettingIcon";
import ProfileSettingBar from "./ProfileSettingBar";
import MobileBottomNav from "../DashBoard/MobileBottomNav";
import axios from "axios";
import { login } from "../../store/authSlice";

function UserProfile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.auth?.userData);
  const userId = currentUser?._id;

  const [openSettingModel, setOpenSettingModel] = useState(false);
  const [copied, setCopied] = useState(false);
  const [profileData, setProfileData] = useState(currentUser || null);
  const [stats, setStats] = useState({
    followers: 0,
    following: 0,
    friends: 0,
  });

  const settingsRef = useRef(null);

  // Sync with Redux store initially
  useEffect(() => {
    if (currentUser) {
      setProfileData(currentUser);
    }
  }, [currentUser]);

  // Fetch fresh user profile + follower/following counts
  useEffect(() => {
    let isMounted = true;
    const fetchFreshProfile = async () => {
      if (!userId) return;
      try {
        const [userRes, infoRes] = await Promise.allSettled([
          axios.get(`${import.meta.env.VITE_API_URL}/user/current_user_data`, {
            withCredentials: true,
          }),
          axios.get(`${import.meta.env.VITE_API_URL}/user/user_data/${userId}`, {
            withCredentials: true,
          }),
        ]);

        if (userRes.status === "fulfilled" && userRes.value?.data?.response) {
          const freshData = userRes.value.data.response;
          if (isMounted) {
            setProfileData(freshData);
            dispatch(login({ userData: freshData, token: freshData.RefreshToken }));
          }
        }

        if (infoRes.status === "fulfilled") {
          const raw = infoRes.value?.data?.response;
          const info = Array.isArray(raw) ? raw[0] : raw;
          if (info && isMounted) {
            setStats({
              followers: info?.Followers?.length || 0,
              following: info?.Following?.length || 0,
              friends: info?.Friends?.length || 0,
            });
          }
        }
      } catch (err) {
        console.error("Error fetching fresh user profile:", err);
      }
    };

    fetchFreshProfile();
    return () => {
      isMounted = false;
    };
  }, [userId, dispatch]);

  // Close settings popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (settingsRef.current && !settingsRef.current.contains(e.target)) {
        setOpenSettingModel(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleShareProfile = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const user = profileData || currentUser || {};
  const bio = user?.bio || {};
  const banner = bio?.bannerImage && bio.bannerImage.trim() ? bio.bannerImage : null;
  const locationText = [bio?.location?.city, bio?.location?.country]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 overflow-x-hidden flex flex-col pb-24 md:pb-12">
      {/* Top Sticky Navigation Bar */}
      <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-8 py-3.5">
        <div className="w-full max-w-5xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 rounded-xl text-slate-300 hover:text-white transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-0.5 transition-transform" />
            <span className="text-xs sm:text-sm font-medium font-poppins">Back</span>
          </button>

          <div className="flex flex-col items-center">
            <h1 className="text-sm sm:text-base font-bold text-slate-100 font-montserrat truncate max-w-[180px] sm:max-w-xs">
              {user?.fullName || user?.userName || "My Account"}
            </h1>
            <span className="text-[11px] text-slate-400 font-poppins">
              Profile &amp; Settings
            </span>
          </div>

          <div className="relative" ref={settingsRef}>
            <IconWithTooltip
              onClick={() => setOpenSettingModel((prev) => !prev)}
              styling={openSettingModel ? "rotate-90 text-cyan-400" : ""}
            />
            {openSettingModel && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -8 }}
                transition={{ duration: 0.15 }}
                className="absolute top-12 right-0 z-50 w-56 sm:w-64"
              >
                <ProfileSettingBar
                  onClose={() => setOpenSettingModel(false)}
                  onUpdateBio={() => navigate("/edit_profile")}
                  onUpdatePassword={() => navigate("/forgotPassword")}
                />
              </motion.div>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="w-full max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 mt-4 sm:mt-6">
        {/* Profile Card Wrapper */}
        <div className="bg-slate-900/60 border border-slate-800/90 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl">
          {/* Banner Hero */}
          <div className="relative h-44 sm:h-60 md:h-72 w-full overflow-hidden bg-gradient-to-r from-cyan-900/40 via-purple-900/30 to-indigo-950/60">
            {banner ? (
              <img
                src={banner}
                alt="Profile Banner"
                className="w-full h-full object-cover object-center"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-tr from-cyan-600/30 via-indigo-600/20 to-purple-700/30 flex items-center justify-center">
                <Sparkles className="w-12 h-12 text-slate-600/40" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-black/20" />

            <button
              onClick={() => navigate("/edit_profile")}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-slate-900/70 hover:bg-slate-900/90 border border-slate-700/70 text-slate-200 hover:text-white rounded-xl backdrop-blur-md text-xs sm:text-sm font-medium transition-all shadow-lg hover:scale-105"
            >
              <Edit3 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Change Banner</span>
            </button>
          </div>

          {/* Profile Identity Bar */}
          <div className="relative px-4 sm:px-8 pb-6 pt-0">
            {/* Avatar & Floating Actions Header */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-16 sm:-mt-20 mb-6">
              {/* Profile Avatar */}
              <div className="relative inline-block self-start">
                <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-gradient-to-tr from-cyan-400 via-purple-500 to-pink-500 p-1 shadow-2xl">
                  <img
                    src={user?.profilePicture || "/default-avatar.png"}
                    alt={user?.fullName || "User Avatar"}
                    className="w-full h-full rounded-full object-cover border-4 border-slate-900 bg-slate-800"
                  />
                </div>
                {/* Active Indicator */}
                <div
                  className="absolute bottom-2 right-2 w-5 h-5 bg-emerald-500 rounded-full border-4 border-slate-900 shadow-md"
                  title="Active"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
                <button
                  onClick={handleShareProfile}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700/80 text-slate-200 text-xs sm:text-sm font-medium transition-all hover:scale-105 active:scale-95 shadow-sm"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-4 h-4 text-slate-400" />
                      <span>Share</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => navigate("/edit_profile")}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white text-xs sm:text-sm font-semibold transition-all shadow-lg hover:shadow-cyan-500/20 hover:scale-105 active:scale-95"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>
              </div>
            </div>

            {/* Names & Handle */}
            <div className="space-y-1 mb-5">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-montserrat tracking-tight">
                  {user?.fullName || "Your Name"}
                </h2>
                {user?.isVerified && (
                  <ShieldCheck className="w-5 h-5 text-sky-400 shrink-0" title="Verified" />
                )}
              </div>
              <p className="text-sm sm:text-base text-cyan-400 font-medium font-poppins">
                @{user?.userName || "username"}
              </p>
            </div>

            {/* Bio Text */}
            {bio?.text ? (
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-5 max-w-3xl whitespace-pre-line font-poppins">
                {bio.text}
              </p>
            ) : (
              <div className="mb-5 p-3.5 rounded-2xl bg-slate-800/30 border border-dashed border-slate-700/80 max-w-xl">
                <p className="text-xs sm:text-sm text-slate-400 italic">
                  No bio added yet. Tell the world something about yourself!
                </p>
              </div>
            )}

            {/* Meta Information Pills */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-5 text-xs sm:text-sm text-slate-400 font-poppins pb-4 border-b border-slate-800/80">
              {locationText && (
                <div className="flex items-center gap-1.5 text-slate-300">
                  <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{locationText}</span>
                </div>
              )}

              {user?.email && (
                <div className="flex items-center gap-1.5 text-slate-300">
                  <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span className="truncate max-w-[220px]">{user.email}</span>
                </div>
              )}

              {bio?.dateOfBirth && (
                <div className="flex items-center gap-1.5 text-slate-300">
                  <Calendar className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>Born {new Date(bio.dateOfBirth).toLocaleDateString()}</span>
                </div>
              )}
            </div>

            {/* 2-Column Content Grid: Left Details & Right Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-6">
              {/* Left Column (Span 2) */}
              <div className="lg:col-span-2 space-y-6">
                {/* Social Links Section */}
                <div className="bg-slate-800/40 border border-slate-800 rounded-2xl p-4 sm:p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 font-montserrat flex items-center gap-2">
                      <ExternalLink className="w-4 h-4 text-cyan-400" />
                      Social Links
                    </h3>
                    <button
                      onClick={() => navigate("/edit_profile")}
                      className="text-xs text-cyan-400 hover:text-cyan-300 font-medium"
                    >
                      Manage
                    </button>
                  </div>

                  {bio?.socialLinks && bio.socialLinks.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {bio.socialLinks.map((link, idx) => (
                        <a
                          key={idx}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-700/60 transition-all duration-200 group hover:scale-[1.02]"
                        >
                          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-300 shrink-0 group-hover:border-cyan-400">
                            <ExternalLink className="w-4 h-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold text-slate-200 capitalize truncate group-hover:text-white">
                              {link.platform || "Website"}
                            </p>
                            <p className="text-[11px] text-slate-400 truncate group-hover:text-slate-300">
                              {link.url}
                            </p>
                          </div>
                        </a>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 italic py-2">
                      No social accounts linked yet. Click "Manage" to add Instagram, Twitter, etc.
                    </p>
                  )}
                </div>

                {/* Account Settings / Privacy Overview */}
                <div className="bg-slate-800/40 border border-slate-800 rounded-2xl p-4 sm:p-5">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 font-montserrat mb-3 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-purple-400" />
                    Security &amp; Preferences
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800 flex items-center justify-between">
                      <div>
                        <p className="text-xs text-slate-400 font-poppins">Account Type</p>
                        <p className="text-sm font-semibold text-slate-200">
                          {user?.isPrivate ? "Private Account" : "Public Account"}
                        </p>
                      </div>
                      <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800 flex items-center justify-between">
                      <div>
                        <p className="text-xs text-slate-400 font-poppins">Status</p>
                        <p className="text-sm font-semibold text-emerald-400">Active Member</p>
                      </div>
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Stats & Quick Links */}
              <div className="space-y-6">
                {/* Community Stats */}
                <div className="bg-slate-800/40 border border-slate-800 rounded-2xl p-4 sm:p-5">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 font-montserrat mb-4">
                    Community Stats
                  </h3>

                  <div className="space-y-3">
                    {/* Followers */}
                    <div className="flex items-center justify-between p-3.5 bg-slate-900/60 hover:bg-slate-900/90 border border-slate-800/80 rounded-xl transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                          <UserPlus className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-400 font-poppins">Followers</p>
                          <p className="text-lg font-bold text-white font-montserrat">
                            {stats.followers}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Following */}
                    <div className="flex items-center justify-between p-3.5 bg-slate-900/60 hover:bg-slate-900/90 border border-slate-800/80 rounded-xl transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                          <Heart className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-400 font-poppins">Following</p>
                          <p className="text-lg font-bold text-white font-montserrat">
                            {stats.following}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Friends */}
                    <div className="flex items-center justify-between p-3.5 bg-slate-900/60 hover:bg-slate-900/90 border border-slate-800/80 rounded-xl transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                          <MessageCircle className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-400 font-poppins">Friends</p>
                          <p className="text-lg font-bold text-white font-montserrat">
                            {stats.friends}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Account Management Actions */}
                <div className="bg-slate-800/40 border border-slate-800 rounded-2xl p-4 sm:p-5">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 font-montserrat mb-3">
                    Quick Actions
                  </h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => navigate("/edit_profile")}
                      className="w-full text-left px-3.5 py-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-all text-xs sm:text-sm font-medium flex items-center justify-between"
                    >
                      <span>Update Bio &amp; Avatar</span>
                      <ArrowLeft className="w-3.5 h-3.5 rotate-180 text-slate-500" />
                    </button>

                    <button
                      onClick={() => navigate("/forgotPassword")}
                      className="w-full text-left px-3.5 py-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-all text-xs sm:text-sm font-medium flex items-center justify-between"
                    >
                      <span>Security &amp; Password</span>
                      <ArrowLeft className="w-3.5 h-3.5 rotate-180 text-slate-500" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
}

export default UserProfile;
